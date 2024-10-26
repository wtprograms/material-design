/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Signal,
  Type,
  viewChildren,
} from '@angular/core';
import { SlotDirective } from '../directives/slot.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, merge, switchMap } from 'rxjs';
import { v4 } from 'uuid';

const ELEMENT_MAP = new WeakMap<HTMLElement, MaterialDesignComponent>();

@Component({
  template: '',
  host: {
    '[attr.host-id]': 'id'
  }
})
export abstract class MaterialDesignComponent<
  T extends HTMLElement = HTMLElement
> implements OnInit, OnDestroy
{
  readonly id = v4();
  readonly slots = viewChildren(SlotDirective);

  readonly platformId = inject(PLATFORM_ID);
  readonly hostElement = inject<ElementRef<T>>(ElementRef).nativeElement;
  readonly defaultSlot = this.slotDirective();

  ngOnInit(): void {
    ELEMENT_MAP.set(this.hostElement, this);
  }

  ngOnDestroy(): void {
    ELEMENT_MAP.delete(this.hostElement);
  }

  slotDirective(name?: string) {
    const observable = toObservable(this.slots).pipe(
      switchMap((slots) =>
        merge(...slots.map((slot) => slot.assignedNodes$.pipe(map(() => slot))))
      ),
      filter((slot) => slot.name() === name)
    );
    return toSignal(observable);
  }

  setSlots<T extends MaterialDesignComponent>(
    types: Type<T>[] | Type<T>,
    callback: (component: T) => void,
    ...signals: Signal<unknown>[]
  ) {
    effect(
      () => {
        for (const signal of signals) {
          signal();
        }
        types = Array.isArray(types) ? types : [types];
        const defaultSlot = this.defaultSlot();
        if (!defaultSlot) {
          return;
        }
        const components = defaultSlot.componentsOf(...types);
        for (const component of components) {
          callback(component);
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  static get<T extends MaterialDesignComponent = any>(
    element: any
  ): T | undefined {
    return (ELEMENT_MAP.get(element) as T | undefined) ?? undefined;
  }
}
