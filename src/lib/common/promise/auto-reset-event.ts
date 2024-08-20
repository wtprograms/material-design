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

  async waitOne(): Promise<void> {
    if (this._resolved) {
      return;
    }
    await this._promise;
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