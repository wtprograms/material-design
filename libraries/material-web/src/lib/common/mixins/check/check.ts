import { TemplateResult } from 'lit';
import { Control } from '../control/control';

export interface Check extends Control {
  checked: boolean;
  hasLabel: boolean;
  inputElement: HTMLInputElement;
  error: boolean;
  get icon(): string;
  toggle(): void;
  onSlotChange(): void;
  handleActivationClick(event: MouseEvent): void;
  renderLabel(): TemplateResult;
  renderAttachables(): TemplateResult;
  renderIcon(size: number): TemplateResult;
}