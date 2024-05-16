import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { Attachable } from './attachable';

export function mixinAttachable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Attachable> {
  abstract class AttachableMixin extends base implements Attachable {
    get htmlFor() {
      return this.getAttribute('for');
    }
    set htmlFor(value: string | null) {
      if (value === null) {
        this.removeAttribute('for');
      } else {
        this.setAttribute('for', value);
      }
      this.attachControl(this.htmlForControl);
      this.dispatchEvent(new Event('forchange'));
    }

    private get htmlForControl(): HTMLElement | null {
      if (this.htmlFor === '') {
        return null;
      }
      return (
        this.getRootNode() as Document | ShadowRoot
      ).querySelector<HTMLElement>(`#${this.htmlFor}`);
    }

    get control() {
      return this._currentControl;
    }

    set control(control: HTMLElement | null) {
      this.htmlFor = '';
      this.attachControl(control);
    }

    private _currentControl: HTMLElement | null = null;
    private _observer?: MutationObserver;
    private _events: string[] = [];

    initialize(...events: string[]) {
      this._events = events;
    }

    override connectedCallback(): void {
      super.connectedCallback();
      this._observer = new MutationObserver(() =>
        this.attachControl(this.htmlForControl)
      );
      this._observer.observe(this, {
        attributes: true,
        attributeFilter: ['for'],
      });
      this.attachControl(this.htmlForControl);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this._observer?.disconnect();
    }

    private attachControl(control: HTMLElement | null) {
      if (this._currentControl === control) {
        return;
      }
      this.detachControl();
      if (control === null) {
        this._currentControl = null;
        return;
      }
      for (const event of this._events) {
        this._currentControl?.removeEventListener(event, this);
        control?.addEventListener(event, this);
      }
      this._currentControl = control;
    }

    private detachControl() {
      for (const event of this._events) {
        this._currentControl?.removeEventListener(event, this);
      }
    }

    reattach() {
      this.detachControl();
      if (this._currentControl === null) {
        return;
      }
      for (const event of this._events) {
        this._currentControl?.removeEventListener(event, this);
        this._currentControl?.addEventListener(event, this);
      }
    }

    async handleEvent(event: Event): Promise<void> {
      await this.handleControlEvent(event);
    }

    abstract handleControlEvent(event: Event): Promise<void>;
  }

  return AttachableMixin;
}
