import { ElementRef } from '@angular/core';
import { TargetTypeWithoutSignal } from './target-type-without-signal';
import { MdComponent } from '../../common/base/md.component';


export function getTargetElement(
  document: Document,
  hostElement: HTMLElement | undefined,
  target: TargetTypeWithoutSignal
) {
  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target)!;
  }

  if (target instanceof MdComponent) {
    target = target.hostElement;
  }

  if (target instanceof ElementRef) {
    target = target.nativeElement;
  }

  if (target instanceof HTMLElement) {
    return target;
  }

  if (!!hostElement && !target) {
    return hostElement.parentElement as HTMLElement;
  }

  return undefined;
}
