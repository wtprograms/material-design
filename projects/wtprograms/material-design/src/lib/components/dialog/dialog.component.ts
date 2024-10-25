import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  model,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { skip, tap } from 'rxjs';
import { openClose, OpenCloseState } from '../../common/rxjs/open-close';
import { ElevationComponent } from '../elevation/elevation.component';
import { SlotDirective } from '../../directives/slot.directive';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'md-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [ElevationComponent, SlotDirective],
  host: {
    '[attr.icon]': `iconSlot()?.any() || null`,
    '[attr.headline]': `headlineSlot()?.any() || null`,
    '[attr.supportingText]': `supportingtext()?.any() || null`,
    '[attr.actions]': `actionSlot()?.any() || null`,
    '[attr.body]': `bodySlot()?.any() || null`,
    '[attr.state]': 'state()',
  },
})
export class DialogComponent extends MaterialDesignComponent {
  readonly returnValue = model<string>();
  readonly open = model(false);
  readonly cancel = output();
  private readonly _dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  readonly iconSlot = this.slotDirective('icon');
  readonly headlineSlot = this.slotDirective('headline');
  readonly supportingtext = this.slotDirective('supporting-text');
  readonly actionSlot = this.slotDirective('action');
  readonly bodySlot = this.slotDirective();

  private readonly _document = inject(DOCUMENT);
  private readonly _openClose$ = openClose(this.open, 'long3', 'long2');
  readonly state = toSignal(this._openClose$, {
    initialValue: 'closed',
  });
  readonly stateChange = output<OpenCloseState>();

  constructor() {
    super();
    toObservable(this.state)
      .pipe(
        tap((x) => this.stateChange.emit(x)),
        skip(1),
        tap((state) => {
          if (state === 'opening') {
            this._document.body.style.overflow = 'hidden';
            if (isPlatformBrowser(this.platformId)) {
              this._dialog()?.nativeElement.showModal();
            }
          }
          if (state === 'closed') {
            this._document.body.style.overflow = '';
            if (isPlatformBrowser(this.platformId)) {
              this._dialog()?.nativeElement.close();
            }
          }
        })
      )
      .subscribe();
    this.setSlots(ButtonComponent, (component) => {
      component.hostElement.slot = 'action';
      component.variant.set('text');
    });
  }

  private _nextClickIsFromContent = false;
  private _escapePressedWithoutCancel = false;

  onDialogCancel(event: Event) {
    event.preventDefault();
    this._escapePressedWithoutCancel = false;
    this.open.set(false);
  }

  onDialogClose() {
    if (!this._escapePressedWithoutCancel) {
      this.cancel.emit();
    }

    this._escapePressedWithoutCancel = false;
    this._dialog()?.nativeElement?.dispatchEvent(
      new Event('cancel', { cancelable: true })
    );
  }

  onDialogKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return;
    }

    this._escapePressedWithoutCancel = true;
    setTimeout(() => (this._escapePressedWithoutCancel = false));
  }

  onDialogClick() {
    if (this._nextClickIsFromContent) {
      this._nextClickIsFromContent = false;
      return;
    }

    this.cancel.emit();
    this.open.set(false);
  }

  onContainerContentClick() {
    this._nextClickIsFromContent = true;
  }
}
