import { Component, input, signal } from '@angular/core';
import { MdSnackBarComponent } from '../snack-bar.component';
import { Subject, takeUntil, tap, timer } from 'rxjs';
import { OpenCloseState } from '../../../common/rxjs/open-close';
import { MdButtonModule } from '../../button/button.module';
import { MdComponent } from '../../md.component';

export interface SnackBarData {
  message: string;
  multiline?: boolean;
  action?: [string, () => void];
  close?: () => void;
}

@Component({
  selector: 'md-snack-bar-handler',
  templateUrl: './snack-bar-handler.component.html',
  styleUrl: './snack-bar-handler.component.scss',
  imports: [MdSnackBarComponent, MdButtonModule]
})
export class MdSnackBarHandlerComponent extends MdComponent {
  readonly timeout = input(5000);

  readonly open = signal(false);
  readonly snackBarData = signal<SnackBarData | undefined>(undefined);

  private readonly _queue: SnackBarData[] = [];

  private readonly _stopTimer = new Subject<void>();

  enqueue(data: SnackBarData | string) {
    if (typeof data === 'string') {
      data = {
        message: data,
      };
    }

    this._queue.push(data);
    if (this._queue.length === 1) {
      this._show(data);
    }
  }

  stateChanged(state: OpenCloseState) {
    if (state === 'closed') {
      this._stopTimer.next();
      this.snackBarData.set(undefined);
      this._queue.shift();
      if (this._queue.length > 0) {
        this._show(this._queue[0]);
      }
    }
  }

  private async _show(data: SnackBarData) {
    this.snackBarData.set(data);
    this.open.set(true);
    timer(this.timeout()).pipe(
      tap(() => this.open.set(false)),
      takeUntil(this._stopTimer)
    ).subscribe();
  }
  
}