import { FormSubmitter } from './form-submitter';

export type FormSubmitterConstructor =
  | (new () => FormSubmitter)
  | (abstract new () => FormSubmitter);