import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';

export interface Focusable {
  focusable: boolean;
}

export function mixinFocusable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Focusable> {
  abstract class Mixin extends base implements Focusable {
    @property({ type: Boolean, noAccessor: true })
    get focusable() {
      return this.hasAttribute('focusable');
    }
    set focusable(focusable: boolean) {
      if (this.focusable === focusable) {
        return;
      }

      if (focusable) {
        this.setAttribute('focusable', '');
      } else {
        this.removeAttribute('focusable');
      }
      this.updateTabIndex();
    }

    @property({ noAccessor: true })
    declare tabIndex: number;

    private _externalTabIndex: number | null = null;
    private _isUpdatingTabIndex = false;

    override connectedCallback() {
      super.connectedCallback();
      this.updateTabIndex();
    }

    override attributeChangedCallback(
      name: string,
      old: string | null,
      value: string | null
    ) {
      if (name !== 'tabindex') {
        super.attributeChangedCallback(name, old, value);
        return;
      }

      this.requestUpdate('tabIndex', Number(old ?? -1));
      if (this._isUpdatingTabIndex) {
        return;
      }

      if (!this.hasAttribute('tabindex')) {
        this._externalTabIndex = null;
        this.updateTabIndex();
        return;
      }

      this._externalTabIndex = this.tabIndex;
    }

    private updateTabIndex() {
      const internalTabIndex = this.focusable ? 0 : -1;
      const computedTabIndex = this._externalTabIndex ?? internalTabIndex;

      this._isUpdatingTabIndex = true;
      this.tabIndex = computedTabIndex;
      this._isUpdatingTabIndex = false;
    }
  }

  return Mixin;
}
