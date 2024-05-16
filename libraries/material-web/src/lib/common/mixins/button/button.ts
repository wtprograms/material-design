import { TemplateResult } from 'lit';
import { AnchorTarget } from '../../types/anchor-target';
import { Control } from '../control/control';
import { FormSubmitterType } from '../../form-submitter/form-submitter-type';

export interface Button extends Control {
  type: FormSubmitterType;
  href: string;
  target: AnchorTarget;
  buttonElement: HTMLElement | null;
  renderAnchor(excludeContent?: boolean): TemplateResult;
  renderButton(excludeContent?: boolean): TemplateResult;
  renderAnchorOrButton(excludeContent?: boolean): TemplateResult;
  renderContent(): TemplateResult;
}