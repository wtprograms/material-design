/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import {LitElement, isServer} from 'lit';

import {ConstraintValidation} from './mixin-constraint-validation.js';
import {MixinBase, MixinReturn} from './mixin.js';
import { internals, WithElementInternals } from './mixin-element-internals.js';
import { ObservableElement } from '../lit/observable-element.js';

export interface OnReportValidity extends ConstraintValidation {
  [onReportValidity](invalidEvent: Event | null): void;

  // `mixinOnReportValidity()` implements this optional method. If overriden,
  // call `super.formAssociatedCallback(form)`.
  // (inherit jsdoc from `FormAssociated`)
  formAssociatedCallback(form: HTMLFormElement | null): void;
}

export const onReportValidity = Symbol('onReportValidity');

// Private symbol members, used to avoid name clashing.
const privateCleanupFormListeners = Symbol('privateCleanupFormListeners');
const privateDoNotReportInvalid = Symbol('privateDoNotReportInvalid');
const privateIsSelfReportingValidity = Symbol('privateIsSelfReportingValidity');
const privateCallOnReportValidity = Symbol('privateCallOnReportValidity');

export function mixinOnReportValidity<
  T extends MixinBase<ObservableElement & ConstraintValidation & WithElementInternals>,
>(base: T): MixinReturn<T, OnReportValidity> {
  abstract class OnReportValidityElement
    extends base
    implements OnReportValidity
  {
    [privateCleanupFormListeners] = new AbortController();

    [privateDoNotReportInvalid] = false;

    [privateIsSelfReportingValidity] = false;

    // Mixins must have a constructor with `...args: any[]`
    constructor(...args: any[]) {
      super(...args);
      if (isServer) {
        return;
      }

      this.addEventListener(
        'invalid',
        (invalidEvent) => {
          // Listen for invalid events dispatched by a `<form>` when it tries to
          // submit and the element is invalid. We ignore events dispatched when
          // calling `checkValidity()` as well as untrusted events, since the
          // `reportValidity()` and `<form>`-dispatched events are always
          // trusted.
          if (this[privateDoNotReportInvalid] || !invalidEvent.isTrusted) {
            return;
          }

          this.addEventListener(
            'invalid',
            () => {
              // A normal bubbling phase event listener. By adding it here, we
              // ensure it's the last event listener that is called during the
              // bubbling phase.
              this[privateCallOnReportValidity](invalidEvent);
            },
            {once: true},
          );
        },
        {
          // Listen during the capture phase, which will happen before the
          // bubbling phase. That way, we can add a final event listener that
          // will run after other event listeners, and we can check if it was
          // default prevented. This works because invalid does not bubble.
          capture: true,
        },
      );
    }

    override checkValidity() {
      this[privateDoNotReportInvalid] = true;
      const valid = super.checkValidity();
      this[privateDoNotReportInvalid] = false;
      return valid;
    }

    override reportValidity() {
      this[privateIsSelfReportingValidity] = true;
      const valid = super.reportValidity();
      // Constructor's invalid listener will handle reporting invalid events.
      if (valid) {
        this[privateCallOnReportValidity](null);
      }

      this[privateIsSelfReportingValidity] = false;
      return valid;
    }

    [privateCallOnReportValidity](invalidEvent: Event | null) {
      // Since invalid events do not bubble to parent listeners, and because
      // our invalid listeners are added lazily after other listeners, we can
      // reliably read `defaultPrevented` synchronously without worrying
      // about waiting for another listener that could cancel it.
      const wasCanceled = invalidEvent?.defaultPrevented;
      if (wasCanceled) {
        return;
      }

      this[onReportValidity](invalidEvent);

      // If an implementation calls invalidEvent.preventDefault() to stop the
      // platform popup from displaying, focusing is also prevented, so we need
      // to manually focus.
      const implementationCanceledFocus =
        !wasCanceled && invalidEvent?.defaultPrevented;
      if (!implementationCanceledFocus) {
        return;
      }

      // The control should be focused when:
      // - `control.reportValidity()` is called (self-reporting).
      // - a form is reporting validity for its controls and this is the first
      //   invalid control.
      if (
        this[privateIsSelfReportingValidity] ||
        isFirstInvalidControlInForm(this[internals].form, this)
      ) {
        this.focus();
      }
    }

    [onReportValidity](invalidEvent: Event | null) {
      throw new Error('Implement [onReportValidity]');
    }

    override formAssociatedCallback(form: HTMLFormElement | null) {
      // can't use super.formAssociatedCallback?.() due to closure
      if (super.formAssociatedCallback) {
        super.formAssociatedCallback(form);
      }

      // Clean up previous form listeners.
      this[privateCleanupFormListeners].abort();
      if (!form) {
        return;
      }

      this[privateCleanupFormListeners] = new AbortController();

      // Add a listener that fires when the form runs constraint validation and
      // the control is valid, so that it may remove its error styles.
      //
      // This happens on `form.reportValidity()` and `form.requestSubmit()`
      // (both when the submit fails and passes).
      addFormReportValidListener(
        this,
        form,
        () => {
          this[privateCallOnReportValidity](null);
        },
        this[privateCleanupFormListeners].signal,
      );
    }
  }

  return OnReportValidityElement;
}

function addFormReportValidListener(
  control: Element,
  form: HTMLFormElement,
  onControlValid: () => void,
  cleanup: AbortSignal,
) {
  const validateHooks = getFormValidateHooks(form);

  // When a form validates its controls, check if an invalid event is dispatched
  // on the control. If it is not, then inform the control to report its valid
  // state.
  let controlFiredInvalid = false;
  let cleanupInvalidListener: AbortController | undefined;
  let isNextSubmitFromHook = false;
  validateHooks.addEventListener(
    'before',
    () => {
      isNextSubmitFromHook = true;
      cleanupInvalidListener = new AbortController();
      controlFiredInvalid = false;
      control.addEventListener(
        'invalid',
        () => {
          controlFiredInvalid = true;
        },
        {
          signal: cleanupInvalidListener.signal,
        },
      );
    },
    {signal: cleanup},
  );

  validateHooks.addEventListener(
    'after',
    () => {
      isNextSubmitFromHook = false;
      cleanupInvalidListener?.abort();
      if (controlFiredInvalid) {
        return;
      }

      onControlValid();
    },
    {signal: cleanup},
  );

  // The above hooks handle imperatively submitting the form, but not
  // declaratively submitting the form. This happens when:
  // 1. A non-custom element `<button type="submit">` is clicked.
  // 2. Enter is pressed on a non-custom element text editable `<input>`.
  form.addEventListener(
    'submit',
    () => {
      // This submit was from `form.requestSubmit()`, which already calls the
      // listener.
      if (isNextSubmitFromHook) {
        return;
      }

      onControlValid();
    },
    {
      signal: cleanup,
    },
  );

  // Note: it is a known limitation that we cannot detect if a form tries to
  // submit declaratively, but fails to do so because an unrelated sibling
  // control failed its constraint validation.
  //
  // Since we cannot detect when that happens, a previously invalid control may
  // not clear its error styling when it becomes valid again.
  //
  // To work around this, call `form.reportValidity()` when submitting a form
  // declaratively. This can be down on the `<button type="submit">`'s click or
  // the text editable `<input>`'s 'Enter' keydown.
}

const FORM_VALIDATE_HOOKS = new WeakMap<HTMLFormElement, EventTarget>();

function getFormValidateHooks(form: HTMLFormElement) {
  if (!FORM_VALIDATE_HOOKS.has(form)) {
    // Patch form methods to add event listener hooks. These are needed to react
    // to form behaviors that do not dispatch events, such as a form asking its
    // controls to report their validity.
    //
    // We should only patch the methods once, since multiple controls and other
    // forces may want to patch this method. We cannot reliably clean it up if
    // there are multiple patched and re-patched methods referring holding
    // references to each other.
    //
    // Instead, we never clean up the patch but add and clean up event listeners
    // added to the hooks after the patch.
    const hooks = new EventTarget();
    FORM_VALIDATE_HOOKS.set(form, hooks);

    // Add hooks to support notifying before and after a form has run constraint
    // validation on its controls.
    // Note: `form.submit()` does not run constraint validation per spec.
    for (const methodName of ['reportValidity', 'requestSubmit'] as const) {
      const superMethod = form[methodName];
      form[methodName] = function (this: HTMLFormElement) {
        hooks.dispatchEvent(new Event('before'));
        const result = Reflect.apply(superMethod, this, arguments);
        hooks.dispatchEvent(new Event('after'));
        return result;
      };
    }
  }

  return FORM_VALIDATE_HOOKS.get(form)!;
}

function isFirstInvalidControlInForm(
  form: HTMLFormElement | null,
  control: HTMLElement,
) {
  if (!form) {
    return true;
  }

  let firstInvalidControl: Element | undefined;
  for (const element of form.elements as unknown as Element[]) {
    if (element.matches(':invalid')) {
      firstInvalidControl = element;
      break;
    }
  }

  return firstInvalidControl === control;
}
