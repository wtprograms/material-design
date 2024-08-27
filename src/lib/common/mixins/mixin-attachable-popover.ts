import { LitElement, PropertyValues } from 'lit';
import { MixinBase, MixinReturn } from './mixin';
import { Attachable, mixinAttachable } from './mixin-attachable';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  Placement,
  shift,
} from '@floating-ui/dom';
import {
  DEFAULT_POPOVER_OPTIONS,
  mixinPopover,
  Popover,
  PopoverOptions,
} from './mixin-popover';
import { property } from 'lit/decorators.js';

export type PopoverTrigger = 'click' | 'hover' | 'contextmenu' | 'manual';

export interface AttachablePopover extends Attachable, Popover {
  trigger: PopoverTrigger;
  handleClick(): Promise<void>;
  handlePointerEnter(): Promise<void>;
  handlePointerLeave(): Promise<void>;
  handleContextMenu(): Promise<void>;
  adjustPlugins: string;
}

export class DocumentCloseEvent extends Event {
  constructor(readonly path: EventTarget[]) {
    super('document-close', { cancelable: true });
  }
}

export interface AttachablePopoverOptions extends PopoverOptions {
  trigger?: PopoverTrigger;
}

export const DEFAULT_ATTACHABLE_POPOVER_OPTIONS: AttachablePopoverOptions =
  Object.assign({}, DEFAULT_POPOVER_OPTIONS, {
    trigger: 'click',
  }) as AttachablePopoverOptions;

export function mixinAttachablePopover<T extends MixinBase<LitElement>>(
  base: T,
  options: AttachablePopoverOptions = DEFAULT_POPOVER_OPTIONS
): MixinReturn<T, AttachablePopover> {
  const _base = mixinAttachable(mixinPopover(base, options));
  abstract class Mixin extends _base implements AttachablePopover {
    @property({ type: String, reflect: true })
    trigger: PopoverTrigger = options.trigger ?? 'click';

    @property({ type: Boolean, noAccessor: true, attribute: 'manual-control' })
    manualControl = false;

    @property({ type: String, attribute: 'adjust-plugins' })
    adjustPlugins = 'flip,shift';

    @property({ type: Boolean, attribute: 'no-shift' })
    no = false;

    private _cleanup?: () => void;
    private _cleanUpPositioningEvents?: () => void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      this.initialize('click', 'contextmenu', 'pointerenter', 'pointerleave');
    }

    override async showComponent(): Promise<void> {
      await super.showComponent();
      this._cleanup = this.subscribeToDocumentEvents();
      this._cleanUpPositioningEvents = autoUpdate(
        this.control!,
        this,
        this.updatePosition.bind(this)
      );
    }

    override async closeComponent(): Promise<void> {
      await super.closeComponent();
      this._cleanup?.();
      this._cleanUpPositioningEvents?.();
    }

    private subscribeToDocumentEvents() {
      const onDocumentClick = this.onDocumentClick.bind(this);
      document.addEventListener('click', onDocumentClick, { capture: true });

      return () => {
        document.removeEventListener('click', onDocumentClick);
      };
    }

    private onDocumentClick(event: Event) {
      if (!this.open) {
        return;
      }
      const path = event.composedPath();
      if (!path.includes(this) && !path.includes(this.control!)) {
        const canClose = this.dispatchEvent(new DocumentCloseEvent(path));
        if (!canClose) {
          return;
        }
        this.open = false;
      }
    }

    override async updatePosition(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const middleware: any[] = [offset(this.offset)];
      const plugins = this.adjustPlugins.split(',');
      for (const plugin of plugins) {
        if (plugin === 'flip') {
          middleware.push(flip());
        } else if (plugin === 'shift') {
          middleware.push(shift());
        }
      }
      const result = await computePosition(this.control!, this, {
        middleware,
        placement: this.placement,
        strategy: this.strategy,
      });
      this.resultTransformOrigin = result.placement;
      this.setTransformOrigin();
      this.style.top = `${result.y}px`;
      this.style.left = `${result.x}px`;
      this.dispatchEvent(new Event('position-changed', { bubbles: true }));
    }

    override setTransformOrigin() {
      const top: Placement[] = [
        'right-start',
        'left-start',
        'bottom',
        'bottom-start',
        'bottom-end',
      ];
      const bottom: Placement[] = [
        'right-end',
        'left-end',
        'top',
        'top-start',
        'top-end',
      ];
      if (top.find((x) => x === this.resultTransformOrigin)) {
        this.popoverContainer.style.transformOrigin = 'top';
      } else if (bottom.find((x) => x === this.resultTransformOrigin)) {
        this.popoverContainer.style.transformOrigin = 'bottom';
      } else {
        this.popoverContainer.style.transformOrigin = '';
      }
    }

    async handleClick() {
      this.showComponent();
    }

    async handlePointerEnter() {
      this.showComponent();
    }

    async handlePointerLeave() {
      this.closeComponent();
    }

    async handleContextMenu() {
      this.showComponent();
    }

    override async handleControlEvent(event: Event): Promise<void> {
      if (this.trigger === 'manual') {
        return;
      }
      if (this.trigger === 'click' && event.type === 'click') {
        await this.handleClick();
        return;
      }

      if (
        this.trigger === 'hover' &&
        (event.type === 'pointerenter' || event.type === 'pointerleave')
      ) {
        if (event.type === 'pointerenter') {
          await this.handlePointerEnter();
        } else {
          await this.handlePointerLeave();
        }
        return;
      }

      if (this.trigger !== 'contextmenu') {
        return;
      }

      event.preventDefault();
      await this.handleContextMenu();
    }

    protected override firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties);
      if (!this.control && !this.manualControl) {
        this.attachControl(this.parentElement);
      }
    }
  }
  return Mixin;
}
