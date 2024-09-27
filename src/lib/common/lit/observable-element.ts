/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, PropertyValues } from 'lit';
import { BehaviorSubject } from 'rxjs';

export abstract class ObservableElement extends LitElement {

  constructor() {
    super();

    const elementProperties = (this.constructor as any)
      .elementProperties as Map<string, any>;
    for (const [propertyKey] of elementProperties) {
      const rxKey = '_' + propertyKey + '$';
      if (!this[rxKey]) {
        this[rxKey] = new BehaviorSubject(this[propertyKey]);
      }
      Object.defineProperty(this, propertyKey + '$', {
        get(this: any) {
          return this[rxKey].asObservable();
        },
      });
    }
  }

  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    const elementProperties = (this.constructor as any)
      .elementProperties as Map<string, any>;
    for (const [propertyKey] of elementProperties) {
      const rxKey = '_' + propertyKey + '$';
      this[rxKey]?.next(this[propertyKey]);
    }
  }
}
