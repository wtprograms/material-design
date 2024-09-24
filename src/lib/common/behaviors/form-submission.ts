import { ReactiveElement, isServer } from 'lit';
import { WithElementInternals, internals } from '../mixins/mixin-element-internals';

export type FormSubmitterConstructor =
  | (new () => FormSubmitter)
  | (abstract new () => FormSubmitter);

export type FormSubmitterType = 'button' | 'submit' | 'reset';

export interface FormSubmitter extends ReactiveElement, WithElementInternals {
  type: FormSubmitterType;
  name: string;
  value: string | null;
}

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
