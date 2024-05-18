import { TemplateResult, nothing } from 'lit';
import { Control } from '../control/control';

export interface Check extends Control {
  checked: boolean;
  hasLabel: boolean;
  inputElement: HTMLInputElement;
  error: boolean;
  toggle(): void;
  onSlotChange(): void;
  handleActivationClick(event: MouseEvent): void;
  renderLabel(): TemplateResult;
  renderAttachables(): TemplateResult;
  renderIcon(): TemplateResult | typeof nothing;
}