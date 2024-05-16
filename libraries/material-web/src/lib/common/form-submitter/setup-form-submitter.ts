import { isServer, ReactiveElement } from 'lit';
import { internals } from '../mixins/element-internals/internals';
import { FormSubmitter } from './form-submitter';
import { FormSubmitterConstructor } from './form-submitter-constructor';

export function setupFormSubmitter(ctor: FormSubmitterConstructor) {
  if (isServer) {
    return;
  }

  (ctor as unknown as typeof ReactiveElement).addInitializer((instance) => {
    const submitter = instance as FormSubmitter;
    submitter.addEventListener('click', async (event) => {
      const { type, [internals]: elementInternals } = submitter;
      const { form } = elementInternals;
      if (!form || type === 'button') {
        return;
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve);
      });

      if (event.defaultPrevented) {
        return;
      }

      if (type === 'reset') {
        form.reset();
        return;
      }

      form.addEventListener(
        'submit',
        (submitEvent) => {
          Object.defineProperty(submitEvent, 'submitter', {
            configurable: true,
            enumerable: true,
            get: () => submitter,
          });
        },
        { capture: true, once: true }
      );

      elementInternals.setFormValue(submitter.value);
      form.requestSubmit();
    });
  });
}
