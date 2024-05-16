import { InvalidOperationError } from '../errors/invalid-operation.error';

export class AutoResetEvent {
  private _promise: Promise<void>;
  private _resolver?: () => void;
  private _resolved = false;

  constructor(initialState: boolean = false) {
    this._promise = new Promise<void>((resolve) => (this._resolver = resolve));
    if (!initialState) {
      this.reset();
    }
  }

  waitOne() {
    if (this._resolved) {
      throw new InvalidOperationError('The event has already been set. Please call reset() before waiting again.');
    }
    return this._promise;
  }

  set() {
    const resolve = this._resolver;
    if (resolve) {
      this._promise = new Promise<void>((resolve) => (this._resolver = resolve));
      resolve();
      this._resolved = true;
    }
  }

  reset() {
    this._promise = new Promise<void>((resolve) => (this._resolver = resolve));
    this._resolved = false;
  }
}