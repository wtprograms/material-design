import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { Observable, Subscription } from 'rxjs';

class ObserveDirective extends AsyncDirective {
  private _subscription?: Subscription;

  render(observable: Observable<unknown>) {
    this._subscription = observable.subscribe(value => this.setValue(value));
    return noChange;
  }
  
  override disconnected() {
    this._subscription?.unsubscribe();
  }
}

export const observe = directive(ObserveDirective);