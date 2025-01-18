import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

export function observeResize$(element: HTMLElement, platformId: Object): Observable<DOMRect> {
  if (isPlatformServer(platformId)) {
    return new Subject<DOMRect>().asObservable();
  }
  const subject = new BehaviorSubject<DOMRect>(element.getBoundingClientRect());
  const resizeObserver = new ResizeObserver((entries) =>
    subject.next(entries[0].contentRect)
  );
  resizeObserver.observe(element);
  return subject.asObservable();
}
