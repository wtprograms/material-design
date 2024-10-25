import { effect, ElementRef, inject, Signal } from '@angular/core';

export function bindAttribute<T>(name: string, signal: Signal<T>) {
  const elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  effect(() => {
    const value = signal();
    if (value === null || value === undefined) {
      elementRef.nativeElement.removeAttribute(name);
    } else {
      elementRef.nativeElement.setAttribute(name, value.toString());
    }
  });
}
