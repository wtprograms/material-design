import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from '../mixin';
import { isFocusable } from './is-focusable';
import { WithFocusable } from './with-focusable';

const privateIsFocusable = Symbol('privateIsFocusable');
const externalTabIndex = Symbol('externalTabIndex');
const isUpdatingTabIndex = Symbol('isUpdatingTabIndex');
const updateTabIndex = Symbol('updateTabIndex');

export function mixinFocusable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, WithFocusable> {
  abstract class WithFocusableElementMixin extends base implements WithFocusable {
    @property({ type: Boolean })
    focusable = false;

    @property({ noAccessor: true })
    declare tabIndex: number;

    get [isFocusable]() {
      return this[privateIsFocusable];
    }

    set [isFocusable](value: boolean) {
      if (this[isFocusable] === value) {
        return;
      }

      this[privateIsFocusable] = value;
      this[updateTabIndex]();
    }

    [privateIsFocusable] = true;
    [externalTabIndex]: number | null = null;
    [isUpdatingTabIndex] = false;

    override connectedCallback() {
      super.connectedCallback();
      this[updateTabIndex]();
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
      if (this[isUpdatingTabIndex]) {
        return;
      }

      if (!this.hasAttribute('tabindex')) {
        this[externalTabIndex] = null;
        this[updateTabIndex]();
        return;
      }

      this[externalTabIndex] = this.tabIndex;
    }

    [updateTabIndex]() {
      const internalTabIndex = this[isFocusable] ? 0 : -1;
      const computedTabIndex = this[externalTabIndex] ?? internalTabIndex;

      this[isUpdatingTabIndex] = true;
      this.tabIndex = computedTabIndex;
      this[isUpdatingTabIndex] = false;
    }
  }

  return WithFocusableElementMixin;
}
