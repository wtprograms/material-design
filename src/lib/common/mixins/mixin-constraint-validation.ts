import {isServer, LitElement, PropertyDeclaration, PropertyValues} from 'lit';

import {MixinBase, MixinReturn} from './mixin.js';
import { FormAssociated } from '../behaviors/form-associated.js';
import { Validator } from '../behaviors/validators/validator.js';
import { WithElementInternals, internals } from './mixin-element-internals.js';

export interface ConstraintValidation extends FormAssociated {
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(error: string): void;
  [createValidator](): Validator<unknown>;
  [getValidityAnchor](): HTMLElement | null;
}

export const createValidator = Symbol('createValidator');

export const getValidityAnchor = Symbol('getValidityAnchor');

// Private symbol members, used to avoid name clashing.
const privateValidator = Symbol('privateValidator');
const privateSyncValidity = Symbol('privateSyncValidity');
const privateCustomValidationMessage = Symbol('privateCustomValidationMessage');

export function mixinConstraintValidation<
  T extends MixinBase<LitElement & FormAssociated & WithElementInternals>,
>(base: T): MixinReturn<T, ConstraintValidation> {
  abstract class ConstraintValidationElement
    extends base
    implements ConstraintValidation
  {
    get validity() {
      this[privateSyncValidity]();
      return this[internals].validity;
    }

    get validationMessage() {
      this[privateSyncValidity]();
      return this[internals].validationMessage;
    }

    get willValidate() {
      this[privateSyncValidity]();
      return this[internals].willValidate;
    }

    [privateValidator]?: Validator<unknown>;

    [privateCustomValidationMessage] = '';

    checkValidity() {
      this[privateSyncValidity]();
      return this[internals].checkValidity();
    }

    reportValidity() {
      this[privateSyncValidity]();
      return this[internals].reportValidity();
    }

    setCustomValidity(error: string) {
      this[privateCustomValidationMessage] = error;
      this[privateSyncValidity]();
    }

    override requestUpdate(
      name?: PropertyKey,
      oldValue?: unknown,
      options?: PropertyDeclaration,
    ) {
      super.requestUpdate(name, oldValue, options);
      this[privateSyncValidity]();
    }

    override firstUpdated(changed: PropertyValues) {
      super.firstUpdated(changed);
      // Sync the validity again when the element first renders, since the
      // validity anchor is now available.
      //
      // Elements that `delegatesFocus: true` to an `<input>` will throw an
      // error in Chrome and Safari when a form tries to submit or call
      // `form.reportValidity()`:
      // "An invalid form control with name='' is not focusable"
      //
      // The validity anchor MUST be provided in `internals.setValidity()` and
      // MUST be the `<input>` element rendered.
      //
      // See https://lit.dev/playground/#gist=6c26e418e0010f7a5aac15005cde8bde
      // for a reproduction.
      this[privateSyncValidity]();
    }

    [privateSyncValidity]() {
      if (isServer) {
        return;
      }

      if (!this[privateValidator]) {
        this[privateValidator] = this[createValidator]();
      }

      const {validity, validationMessage: nonCustomValidationMessage} =
        this[privateValidator].getValidity();

      const customError = !!this[privateCustomValidationMessage];
      const validationMessage =
        this[privateCustomValidationMessage] || nonCustomValidationMessage;

      this[internals].setValidity(
        {...validity, customError},
        validationMessage,
        this[getValidityAnchor]() ?? undefined,
      );
    }

    [createValidator](): Validator<unknown> {
      throw new Error('Implement [createValidator]');
    }

    [getValidityAnchor](): HTMLElement | null {
      throw new Error('Implement [getValidityAnchor]');
    }
  }

  return ConstraintValidationElement;
}
