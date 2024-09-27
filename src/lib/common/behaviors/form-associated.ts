import {LitElement, PropertyDeclaration} from 'lit';
import {property} from 'lit/decorators.js';
import { internals, WithElementInternals } from '../mixins/mixin-element-internals';
import { MixinBase, MixinReturn } from '../mixins/mixin';
import { ObservableElement } from '../lit/observable-element';

export interface FormAssociated {
  readonly form: HTMLFormElement | null;
  readonly labels: NodeList;
  name: string;
  disabled: boolean;
  [getFormValue](): FormValue | null;
  [getFormState](): FormValue | null;
  formDisabledCallback(disabled: boolean): void;
  formResetCallback(): void;
  formStateRestoreCallback(
    state: FormRestoreState | null,
    reason: FormRestoreReason,
  ): void;
  formAssociatedCallback?(form: HTMLFormElement | null): void;
}

export interface FormAssociatedConstructor {
  readonly formAssociated: true;
}

export const getFormValue = Symbol('getFormValue');

export const getFormState = Symbol('getFormState');

export function mixinFormAssociated<
  T extends MixinBase<ObservableElement & WithElementInternals>,
>(base: T): MixinReturn<T & FormAssociatedConstructor, FormAssociated> {
  abstract class FormAssociatedElement extends base implements FormAssociated {
    /** @nocollapse */
    static readonly formAssociated = true;

    get form() {
      return this[internals].form;
    }

    get labels() {
      return this[internals].labels;
    }

    @property({noAccessor: true})
    get name() {
      return this.getAttribute('name') ?? '';
    }
    set name(name: string) {
      // Note: setting name to null or empty does not remove the attribute.
      this.setAttribute('name', name);
      // We don't need to call `requestUpdate()` since it's called synchronously
      // in `attributeChangedCallback()`.
    }

    @property({type: Boolean, noAccessor: true})
    get disabled() {
      return this.hasAttribute('disabled');
    }
    set disabled(disabled: boolean) {
      this.toggleAttribute('disabled', disabled);
      // We don't need to call `requestUpdate()` since it's called synchronously
      // in `attributeChangedCallback()`.
    }

    override attributeChangedCallback(
      name: string,
      old: string | null,
      value: string | null,
    ) {
      // Manually `requestUpdate()` for `name` and `disabled` when their
      // attribute or property changes.
      // The properties update their attributes, so this callback is invoked
      // immediately when the properties are set. We call `requestUpdate()` here
      // instead of letting Lit set the properties from the attribute change.
      // That would cause the properties to re-set the attribute and invoke this
      // callback again in a loop. This leads to stale state when Lit tries to
      // determine if a property changed or not.
      if (name === 'name' || name === 'disabled') {
        // Disabled's value is only false if the attribute is missing and null.
        const oldValue = name === 'disabled' ? old !== null : old;
        // Trigger a lit update when the attribute changes.
        this.requestUpdate(name, oldValue);
        return;
      }

      super.attributeChangedCallback(name, old, value);
    }

    override requestUpdate(
      name?: PropertyKey,
      oldValue?: unknown,
      options?: PropertyDeclaration,
    ) {
      super.requestUpdate(name, oldValue, options);
      // If any properties change, update the form value, which may have changed
      // as well.
      // Update the form value synchronously in `requestUpdate()` rather than
      // `update()` or `updated()`, which are async. This is necessary to ensure
      // that form data is updated in time for synchronous event listeners.
      this[internals].setFormValue(this[getFormValue](), this[getFormState]());
    }

    [getFormValue](): FormValue | null {
      // Closure does not allow abstract symbol members, so a default
      // implementation is needed.
      throw new Error('Implement [getFormValue]');
    }

    [getFormState](): FormValue | null {
      return this[getFormValue]();
    }

    formDisabledCallback(disabled: boolean) {
      this.disabled = disabled;
    }

    abstract formResetCallback(): void;

    abstract formStateRestoreCallback(
      state: FormRestoreState | null,
      reason: FormRestoreReason,
    ): void;
  }

  return FormAssociatedElement;
}

export type FormValue = File | string | FormData;

export type FormRestoreState =
  | File
  | string
  | Array<[string, FormDataEntryValue]>;

export type FormRestoreReason = 'restore' | 'autocomplete';
