import { MixinBase, MixinReturn } from './mixin';
import { Observable, Subject } from 'rxjs';
import { ObservableElement } from '../lit/observable-element';

export interface Attachable {
  htmlFor: string | null;
  control: HTMLElement | null;
  initialize(...events: string[]): void;
  reattach(): void;
  attachControl(control: HTMLElement | null): void;
  detachControl(): void;
  event$: Observable<Event>;
}

export function mixinAttachable<T extends MixinBase<ObservableElement>>(
  base: T
): MixinReturn<T, Attachable> {
  abstract class Mixin extends base implements Attachable {
    private readonly _event$ = new Subject<Event>();

    get event$() {
      return this._event$.asObservable();
    }

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
      this.dispatchEvent(new Event('for-change'));
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
      if (!this._currentControl) {
        this._currentControl = this.parentElement ?? (this.getRootNode() as any).host;
      }
      this.reattach();
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

    attachControl(control: HTMLElement | null) {
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

    detachControl() {
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
      this._event$.next(event);
    }
  }

  return Mixin;
}
