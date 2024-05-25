/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateResult, nothing } from 'lit';
import { Openable } from '../openable/openable';
import { AutoResetEvent } from '../../promise/auto-reset-event';

export interface Dialog extends Openable {
  returnValue: string;
  noFocusTrap: boolean;
  dialog: HTMLDialogElement | null;
  body: HTMLElement | null;
  scrim: HTMLElement | null;
  isConnectedLatch: AutoResetEvent;
  renderFocusTrap(): TemplateResult<1> | typeof nothing;
  renderDialog(): TemplateResult<1> | typeof nothing;
  renderElevation(): TemplateResult<1> | typeof nothing;
  renderContent(): TemplateResult<1> | typeof nothing;
  renderScrim(): TemplateResult<1> | typeof nothing;
}