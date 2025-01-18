import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdDialogComponent } from "../dialog/dialog.component";
import { MdDialogHeadlineComponent } from "../dialog/dialog-headline/dialog-headline.component";
import { FormsModule } from '@angular/forms';
import { MdComponent } from '../../common/base/md.component';
import { durationToMilliseconds } from '../../common/motion';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdTintComponent, CommonModule, MdDialogComponent, MdDialogHeadlineComponent, FormsModule],
  host: {
    '[attr.open]': 'open() && openOnInput() ? "" : null',
    '[attr.dialog]': 'dialog() ? "" : null',
    '(document:click)': 'documentClick($event)',
  },
})
export class MdSearchComponent extends MdComponent {
  readonly dialog = input(false);
  readonly open = model(false);
  readonly openOnInput = input(true);
  readonly value = model('');
  readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  documentClick(event: Event) {
    const path = event.composedPath();
    if (!this.open() || path.includes(this.hostElement)) {
      return;
    }
    this.open.set(false);
  }

  constructor() {
    super();
    effect(() => {
      const open = this.open();
      const dialog = this.dialog();
      if (open && dialog) {
        setTimeout(() => this.input().nativeElement.focus(), durationToMilliseconds('short4'));
      }
    })
  }
}
