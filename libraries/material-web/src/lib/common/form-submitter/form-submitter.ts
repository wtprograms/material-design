import { ReactiveElement } from 'lit';
import { WithElementInternals } from '../mixins/element-internals/with-element-internals';
import { FormSubmitterType } from './form-submitter-type';

export interface FormSubmitter extends ReactiveElement, WithElementInternals {
  type: FormSubmitterType;
  name: string;
  value: string;
}