import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsLayout } from './tabs-layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { MdTabComponent } from './tab/tab.component';
import { TabType } from './tab/tab-type';
import { MdComponent } from '../../common/base/md.component';
import { observeResize$ } from '../../common/rxjs/observe-resize';

@Component({
  selector: 'md-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  host: {
    '[attr.layout]': 'layout()',
  },
})
export class MdTabsComponent extends MdComponent {
  readonly layout = input<TabsLayout>('primary');
  readonly type = input<TabType>('button');

  private readonly _tabs = contentChildren(MdTabComponent);
  private readonly _selectedTab = computed(() => {
    const tabs = this._tabs();
    return tabs.find((tab) => tab.selected());
  });
  private readonly _hostRect = toSignal(
    observeResize$(this.hostElement, this.platformId)
  );
  private _previousRect?: DOMRect;
  readonly indicatorStyle = computed(() => {
    const rect = this._hostRect();
    const layout = this.layout();
    const tab = this._selectedTab();
    if (!tab) {
      return {
        display: 'none',
      };
    }
    if (layout === 'secondary') {
      const result = {
        'inset-inline-start': `${tab.hostElement.offsetLeft}px`,
        width: `${tab.hostElement.offsetWidth}px`,
        transition: this._previousRect === rect ? '' : 'none',
      };
      this._previousRect = rect;
      return result;
    }

    let left = 0;
    let width = 0;
    const embeddedButtonElement = tab.embeddedButtonElement()?.nativeElement;
    if (embeddedButtonElement) {
      left = embeddedButtonElement.offsetLeft;
      width = embeddedButtonElement.offsetWidth;
    }
    const contents = tab.contents()?.nativeElement;
    if (contents) {
      left = contents.offsetLeft;
      width = contents.offsetWidth;
    }
    const result = {
      'inset-inline-start': `${
        tab.hostElement.offsetLeft +
        left +
        2
      }px`,
      width: `${width - 4}px`,
      transition: this._previousRect === rect ? '' : 'none',
    };
    this._previousRect = rect;
    return result;
  });

  constructor() {
    super();
    effect(() => {
      const tabs = this._tabs();
      const layout = this.layout();
      const type = this.type();
      for (const tab of tabs) {
        tab.layout.set(layout);
        tab.type.set(type);
      }
    });
  }
}
