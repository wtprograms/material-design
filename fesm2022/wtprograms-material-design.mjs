import * as i0 from '@angular/core';
import { inject, ElementRef, effect, DestroyRef, isSignal, PLATFORM_ID, signal, input, computed, Directive, HostListener, viewChildren, Component, model, ChangeDetectionStrategy, ViewEncapsulation, viewChild, InjectionToken, forwardRef, output, Pipe, Input, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, finalize, Subject, switchMap, merge, of, timer, takeUntil, map, filter, tap, Observable, fromEvent, delay, forkJoin, skip, combineLatest, startWith, pairwise } from 'rxjs';
import { toObservable, takeUntilDestroyed, toSignal, outputFromObservable } from '@angular/core/rxjs-interop';
import * as i1 from '@angular/common';
import { DOCUMENT, isPlatformServer, CommonModule, isPlatformBrowser } from '@angular/common';
import * as i2 from '@angular/forms';
import { FormGroupDirective, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { autoUpdate, offset, flip, shift, computePosition } from '@floating-ui/dom';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

class NullOrUndefinedError extends Error {
    value;
    constructor(value, message = 'Value is null or undefined') {
        super(message);
        this.value = value;
    }
}

function isDefined(value) {
    return value !== undefined && value !== null;
}

function assertDefined(value) {
    if (!isDefined(value)) {
        throw new NullOrUndefinedError(value);
    }
}

function getDateTimeFormatOptions(format) {
    const options = {};
    const formatParts = format.replace(':', ' ').split(/[\s/.-]+/);
    for (const part of formatParts) {
        switch (part) {
            case 'dd':
                options.day = '2-digit';
                break;
            case 'd':
                options.day = 'numeric';
                break;
            case 'MM':
                options.month = '2-digit';
                break;
            case 'M':
                options.month = 'numeric';
                break;
            case 'MMM':
                options.month = 'short';
                break;
            case 'MMMM':
                options.month = 'long';
                break;
            case 'yy':
                options.year = '2-digit';
                break;
            case 'yyyy':
                options.year = 'numeric';
                break;
            case 'HH':
                options.hour = '2-digit';
                options.hour12 = false;
                break;
            case 'H':
                options.hour = 'numeric';
                options.hour12 = false;
                break;
            case 'hh':
                options.hour = '2-digit';
                options.hour12 = true;
                break;
            case 'h':
                options.hour = 'numeric';
                options.hour12 = true;
                break;
            case 'mm':
                options.minute = '2-digit';
                break;
            case 'm':
                options.minute = 'numeric';
                break;
            case 'ss':
                options.second = '2-digit';
                break;
            case 's':
                options.second = 'numeric';
                break;
            case 'a':
            case 'A':
                options.hour12 = true;
                break;
            default:
                break;
        }
    }
    return options;
}

function getMeridianValues(locale) {
    const date = new Date(2000, 0, 1);
    const am = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true }).split(' ')[1];
    date.setHours(13);
    const pm = date.toLocaleTimeString(locale, { hour: 'numeric', hour12: true }).split(' ')[1];
    return {
        am,
        pm,
    };
}

function bindAttribute(name, signal) {
    const elementRef = inject(ElementRef);
    effect(() => {
        const value = signal();
        if (value === null || value === undefined) {
            elementRef.nativeElement.removeAttribute(name);
        }
        else {
            elementRef.nativeElement.setAttribute(name, value.toString());
        }
    });
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}

function dispatchActivationClick(element, bubbles = true) {
    const event = new MouseEvent('click', { bubbles });
    element.dispatchEvent(event);
    return event;
}

function isActivationClick(event) {
    if (event.currentTarget !== event.target) {
        return false;
    }
    if (event.composedPath()[0] !== event.target) {
        return false;
    }
    return true;
}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Re-dispatches an event from the provided element.
 *
 * This function is useful for forwarding non-composed events, such as `change`
 * events.
 *
 * @example
 * class MyInput extends ObservableElement {
 *   render() {
 *     return html`<input @change=${this.redispatchEvent}>`;
 *   }
 *
 *   protected redispatchEvent(event: Event) {
 *     redispatchEvent(this, event);
 *   }
 * }
 *
 * @param element The element to dispatch the event from.
 * @param event The event to re-dispatch.
 * @return Whether or not the event was dispatched (if cancelable).
 */
function redispatchEvent(element, event) {
    // For bubbling events in SSR light DOM (or composed), stop their propagation
    // and dispatch the copy.
    if (event.bubbles && (!element.shadowRoot || event.composed)) {
        event.stopPropagation();
    }
    const copy = Reflect.construct(event.constructor, [event.type, event]);
    const dispatched = element.dispatchEvent(copy);
    if (!dispatched) {
        event.preventDefault();
    }
    return dispatched;
}

const DURATION = {
    short1: 50,
    short2: 100,
    short3: 150,
    short4: 200,
    medium1: 250,
    medium2: 300,
    medium3: 350,
    medium4: 400,
    long1: 450,
    long2: 500,
    long3: 550,
    long4: 600,
    extraLong1: 700,
    extraLong2: 800,
    extraLong3: 900,
    extraLong4: 1000,
};
function durationToMilliseconds(duration) {
    if (!duration) {
        return undefined;
    }
    if (typeof duration === 'number') {
        return duration;
    }
    return DURATION[duration];
}

const EASING = {
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    legacy: 'cubic-bezier(0.4, 0, 0.2, 1)',
    legacyAccelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    legacyDecelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    linear: 'cubic-bezier(0, 0, 1, 1)',
};
function easingToFunction(easing) {
    if (!easing) {
        return undefined;
    }
    if (easing in EASING) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return EASING[easing];
    }
    return easing;
}

function modelToObservable(signal) {
    const subject = new BehaviorSubject(signal());
    const outputRef = signal.subscribe((x) => subject.next(x));
    return subject.asObservable().pipe(finalize(() => outputRef.unsubscribe()));
}

function openClose(openTrigger, openingDelay = 'short4', closingDelay) {
    closingDelay ??= openingDelay;
    const destroyRef = inject(DestroyRef);
    const _cancelTimer = new Subject();
    let lastState = 'closed';
    if (isSignal(openTrigger)) {
        openTrigger = toObservable(openTrigger);
    }
    return openTrigger.pipe(takeUntilDestroyed(destroyRef), switchMap((open) => {
        let state = lastState;
        if (!open && state === 'opening') {
            _cancelTimer.next();
            state = 'opened';
        }
        if (open && state === 'closing') {
            _cancelTimer.next();
            state = 'closed';
        }
        if (open && state === 'closed') {
            return merge(of('opening'), timer(durationToMilliseconds(openingDelay) ?? 50).pipe(takeUntilDestroyed(destroyRef), takeUntil(_cancelTimer), map(() => 'opened')));
        }
        if (!open && state === 'opened') {
            return merge(of('closing'), timer(durationToMilliseconds(closingDelay) ?? 50).pipe(takeUntilDestroyed(destroyRef), takeUntil(_cancelTimer), map(() => 'closed')));
        }
        return of({});
    }), filter((state) => typeof state === 'string'), tap((state) => (lastState = state)));
}

function startAnimations(abortControllerOrAnimation, ...animations) {
    return new Observable((subscriber) => {
        let abortController = undefined;
        if (abortControllerOrAnimation instanceof AbortController) {
            abortController = abortControllerOrAnimation;
        }
        else {
            abortController = new AbortController();
            animations.unshift(abortControllerOrAnimation);
        }
        if (animations.length === 0) {
            subscriber.next();
            subscriber.complete();
        }
        const _animations = animations
            .map((animation) => animation())
            .filter((x) => !!x);
        for (const animation of _animations) {
            abortController.signal.addEventListener('abort', () => animation.cancel());
        }
        Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        _animations.map((animation) => animation.finished.catch(() => { }))).then(() => {
            abortController = undefined;
            subscriber.next();
            subscriber.complete();
        });
    });
}

function runAnimations(abortControllerOrAnimation, ...animations) {
    return (source) => source.pipe(switchMap((value) => startAnimations(abortControllerOrAnimation, ...animations).pipe(map(() => value))));
}

function tapStart(callback) {
    return (source) => of({}).pipe(tap(() => callback()), switchMap(() => source));
}

function textDirection() {
    const document = inject(DOCUMENT);
    const platformId = inject(PLATFORM_ID);
    const dirSignal = signal(document.dir ? document.dir : 'ltr');
    if (isPlatformServer(platformId)) {
        return dirSignal;
    }
    const observer = new MutationObserver(() => {
        dirSignal.set(document.dir ? document.dir : 'ltr');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return dirSignal;
}

function isWritableSignal(input) {
    if (!isSignal(input)) {
        return false;
    }
    return 'set' in input;
}

class TimeSpan {
    _hours;
    _minutes;
    _seconds;
    constructor(hours, minutes, seconds) {
        this._hours = hours ?? 0;
        this._minutes = minutes ?? 0;
        this._seconds = seconds ?? 0;
        this.normalize();
    }
    normalize() {
        if (this._seconds >= 60) {
            this._minutes += Math.floor(this._seconds / 60);
            this._seconds = this._seconds % 60;
        }
        if (this._minutes >= 60) {
            this._hours += Math.floor(this._minutes / 60);
            this._minutes = this._minutes % 60;
        }
    }
    set hours(value) {
        this._hours = value;
        this.normalize();
    }
    get hours() {
        return this._hours;
    }
    set minutes(value) {
        this._minutes = value;
        this.normalize();
    }
    get minutes() {
        return this._minutes;
    }
    set seconds(value) {
        this._seconds = value;
        this.normalize();
    }
    get seconds() {
        return this._seconds;
    }
    get totalSeconds() {
        return this._hours * 3600 + this._minutes * 60 + this._seconds;
    }
    toString(options) {
        options ??= {
            hours: true,
            seconds: true,
        };
        const hours = options?.hours ? `${this.hours}:` : '';
        const seconds = options?.seconds ? `:${this.seconds}` : '';
        return `${hours}${this.minutes}${seconds}`;
    }
    static parse(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return new TimeSpan(hours ?? 0, minutes ?? 0, seconds ?? 0);
    }
    static fromSeconds(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return new TimeSpan(hours, minutes, remainingSeconds);
    }
    static fromDate(date) {
        return new TimeSpan(date.getHours(), date.getMinutes(), date.getSeconds());
    }
    compare(other) {
        if (this.totalSeconds < other.totalSeconds) {
            return -1;
        }
        else if (this.totalSeconds > other.totalSeconds) {
            return 1;
        }
        return 0;
    }
    min(other) {
        return this.compare(other) < 0 ? this : other;
    }
    max(other) {
        return this.compare(other) > 0 ? this : other;
    }
}

class SlotDirective {
    name = input();
    slot = input();
    _hostElement = inject(ElementRef);
    _platformId = inject(PLATFORM_ID);
    get _assignedNodes() {
        if (isPlatformServer(this._platformId)) {
            return [];
        }
        return (this._hostElement.nativeElement.assignedNodes({ flatten: true }) ?? []);
    }
    assignedNodes$ = new BehaviorSubject(this._assignedNodes);
    nodes = toSignal(this.assignedNodes$, {
        initialValue: this._assignedNodes,
    });
    length = computed(() => this.nodes().length);
    any = computed(() => !!this.length());
    elements = computed(() => this.nodes().filter((node) => node instanceof HTMLElement));
    components = computed(() => this.elements()
        .map((element) => MaterialDesignComponent.get(element))
        .filter((component) => !!component));
    elementsOf(...types) {
        return Array.from(this.filterType(this.elements(), ...types));
    }
    componentsOf(...types) {
        return Array.from(this.filterType(this.components(), ...types));
    }
    onSlotChange() {
        this.assignedNodes$.next(this._assignedNodes);
    }
    *filterType(items, ...types) {
        for (const item of items) {
            for (const type of types) {
                if (item instanceof type) {
                    yield item;
                }
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SlotDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: SlotDirective, isStandalone: true, selector: "slot", inputs: { name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, slot: { classPropertyName: "slot", publicName: "slot", isSignal: true, isRequired: false, transformFunction: null } }, host: { listeners: { "slotchange": "onSlotChange()" }, properties: { "attr.name": "name() ?? null", "attr.slot": "slot() ?? null" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SlotDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: 'slot',
                    standalone: true,
                    host: {
                        '[attr.name]': 'name() ?? null',
                        '[attr.slot]': 'slot() ?? null',
                    },
                }]
        }], propDecorators: { onSlotChange: [{
                type: HostListener,
                args: ['slotchange']
            }] } });

/* eslint-disable @typescript-eslint/no-explicit-any */
const ELEMENT_MAP = new WeakMap();
class MaterialDesignComponent {
    slots = viewChildren(SlotDirective);
    platformId = inject(PLATFORM_ID);
    hostElement = inject(ElementRef).nativeElement;
    defaultSlot = this.slotDirective();
    ngOnInit() {
        ELEMENT_MAP.set(this.hostElement, this);
    }
    ngOnDestroy() {
        ELEMENT_MAP.delete(this.hostElement);
    }
    slotDirective(name) {
        const observable = toObservable(this.slots).pipe(switchMap((slots) => merge(...slots.map((slot) => slot.assignedNodes$.pipe(map(() => slot))))), filter((slot) => slot.name() === name));
        return toSignal(observable);
    }
    setSlots(types, callback, ...signals) {
        effect(() => {
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
        }, {
            allowSignalWrites: true,
        });
    }
    static get(element) {
        return ELEMENT_MAP.get(element) ?? undefined;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MaterialDesignComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "18.2.9", type: MaterialDesignComponent, selector: "ng-component", viewQueries: [{ propertyName: "slots", predicate: SlotDirective, descendants: true, isSignal: true }], ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MaterialDesignComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                }]
        }] });

class BadgeComponent extends MaterialDesignComponent {
    dot = model(false);
    number = model();
    embedded = model(false);
    text = computed(() => {
        if (this.dot()) {
            return;
        }
        const number = this.number();
        if (!number) {
            return;
        }
        return number > 999 ? '999+' : number;
    });
    singleDigit = computed(() => this.number() ? this.number() < 10 : false);
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: BadgeComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: BadgeComponent, isStandalone: true, selector: "md-badge", inputs: { dot: { classPropertyName: "dot", publicName: "dot", isSignal: true, isRequired: false, transformFunction: null }, number: { classPropertyName: "number", publicName: "number", isSignal: true, isRequired: false, transformFunction: null }, embedded: { classPropertyName: "embedded", publicName: "embedded", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { dot: "dotChange", number: "numberChange", embedded: "embeddedChange" }, host: { properties: { "attr.dot": "dot() || null", "attr.number": "text() ?? null", "attr.embedded": "embedded() || null", "attr.singleDigit": "singleDigit() || null" } }, usesInheritance: true, ngImport: i0, template: "{{ text() }}", styles: [":host{position:absolute;background-color:var(--md-sys-color-danger);color:var(--md-sys-color-danger-on);border-radius:var(--md-sys-shape-full);display:inline-flex;place-content:center;place-items:center;flex-shrink:0;flex-grow:0;top:0;height:16px;font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}:host([embedded=true]){position:relative;top:auto}:host(:not([embedded=true])[dot=true]){right:0}:host(:not([embedded=true])[number]:not([number=\"0\"])){inset-inline-start:50%}:host([dot]){width:6px;height:6px}:host(:not([dot]):not([number])){display:none}:host([singleDigit]:not([dot=true])){width:16px}:host(:not([embedded])[number]:not([number=\"0\"])){margin-top:-2px;margin-inline-end:-4px}:host([number]:not([singleDigit]):not([number=\"0\"])){padding-inline-start:4px;padding-inline-end:4px}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: BadgeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-badge', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, host: {
                        '[attr.dot]': 'dot() || null',
                        '[attr.number]': 'text() ?? null',
                        '[attr.embedded]': 'embedded() || null',
                        '[attr.singleDigit]': 'singleDigit() || null',
                    }, template: "{{ text() }}", styles: [":host{position:absolute;background-color:var(--md-sys-color-danger);color:var(--md-sys-color-danger-on);border-radius:var(--md-sys-shape-full);display:inline-flex;place-content:center;place-items:center;flex-shrink:0;flex-grow:0;top:0;height:16px;font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}:host([embedded=true]){position:relative;top:auto}:host(:not([embedded=true])[dot=true]){right:0}:host(:not([embedded=true])[number]:not([number=\"0\"])){inset-inline-start:50%}:host([dot]){width:6px;height:6px}:host(:not([dot]):not([number])){display:none}:host([singleDigit]:not([dot=true])){width:16px}:host(:not([embedded])[number]:not([number=\"0\"])){margin-top:-2px;margin-inline-end:-4px}:host([number]:not([singleDigit]):not([number=\"0\"])){padding-inline-start:4px;padding-inline-end:4px}\n"] }]
        }] });

class IconComponent extends MaterialDesignComponent {
    filled = model(false);
    size = model();
    badgeDot = model(false);
    badgeNumber = model();
    slot = model();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: IconComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: IconComponent, isStandalone: true, selector: "md-icon", inputs: { filled: { classPropertyName: "filled", publicName: "filled", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, badgeDot: { classPropertyName: "badgeDot", publicName: "badgeDot", isSignal: true, isRequired: false, transformFunction: null }, badgeNumber: { classPropertyName: "badgeNumber", publicName: "badgeNumber", isSignal: true, isRequired: false, transformFunction: null }, slot: { classPropertyName: "slot", publicName: "slot", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { filled: "filledChange", size: "sizeChange", badgeDot: "badgeDotChange", badgeNumber: "badgeNumberChange", slot: "slotChange" }, host: { properties: { "style.--md-comp-icon-filled": "filled() ? 1 : null", "style.--md-comp-icon-size": "size() ?? null" } }, usesInheritance: true, ngImport: i0, template: "<slot></slot>\n@if (badgeDot() || badgeNumber()) {\n<md-badge [dot]=\"badgeDot()\" [number]=\"badgeNumber()\" />\n}", styles: [":host{--md-comp-icon-filled: 0;--md-comp-icon-weight: var(--md-ref-typeface-weight-regular);--md-comp-icon-size: 24;--_size-px: calc(var(--md-comp-icon-size) * 1px);position:relative;font-size:var(--_size-px);width:var(--_size-px);max-width:var(--_size-px);height:var(--_size-px);color:inherit;display:inline-flex;font-style:normal;place-items:center;place-content:center;vertical-align:middle;line-height:1;letter-spacing:normal;text-transform:none;-webkit-user-select:none;user-select:none;white-space:nowrap;word-wrap:normal;flex-shrink:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-family:var(--md-ref-typeface-font-icon);font-weight:var(--md-comp-icon-weight);font-variation-settings:\"FILL\" var(--md-comp-icon-filled),\"wght\" var(--md-comp-icon-weight),\"GRAD\" 0,\"opsz\" clamp(20,var(--md-comp-icon-size),48);transition-property:font-variation-settings;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-badge{transform:scale(calc(var(--md-comp-icon-size) / 24))}\n"], dependencies: [{ kind: "component", type: BadgeComponent, selector: "md-badge", inputs: ["dot", "number", "embedded"], outputs: ["dotChange", "numberChange", "embeddedChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: IconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-icon', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, imports: [BadgeComponent], host: {
                        '[style.--md-comp-icon-filled]': 'filled() ? 1 : null',
                        '[style.--md-comp-icon-size]': 'size() ?? null',
                    }, template: "<slot></slot>\n@if (badgeDot() || badgeNumber()) {\n<md-badge [dot]=\"badgeDot()\" [number]=\"badgeNumber()\" />\n}", styles: [":host{--md-comp-icon-filled: 0;--md-comp-icon-weight: var(--md-ref-typeface-weight-regular);--md-comp-icon-size: 24;--_size-px: calc(var(--md-comp-icon-size) * 1px);position:relative;font-size:var(--_size-px);width:var(--_size-px);max-width:var(--_size-px);height:var(--_size-px);color:inherit;display:inline-flex;font-style:normal;place-items:center;place-content:center;vertical-align:middle;line-height:1;letter-spacing:normal;text-transform:none;-webkit-user-select:none;user-select:none;white-space:nowrap;word-wrap:normal;flex-shrink:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-family:var(--md-ref-typeface-font-icon);font-weight:var(--md-comp-icon-weight);font-variation-settings:\"FILL\" var(--md-comp-icon-filled),\"wght\" var(--md-comp-icon-weight),\"GRAD\" 0,\"opsz\" clamp(20,var(--md-comp-icon-size),48);transition-property:font-variation-settings;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-badge{transform:scale(calc(var(--md-comp-icon-size) / 24))}\n"] }]
        }] });

class AttachableDirective {
    events = model([]);
    target = model();
    for = model();
    hostElement = inject(ElementRef).nativeElement;
    _forElement = computed(() => {
        const htmlFor = this.for();
        if (!htmlFor) {
            return undefined;
        }
        return this.hostElement.getRootNode().querySelector(`#${htmlFor}`);
    });
    targetElement = computed(() => this._forElement() ?? getElement(this.target()));
    targetElement$ = toObservable(this.targetElement);
    get event$() {
        return this._event$.asObservable();
    }
    _event$ = new Subject();
    event = outputFromObservable(this._event$);
    _subscription;
    constructor() {
        effect(() => {
            this._subscription?.unsubscribe();
            this._subscription = undefined;
            const targetElement = this.targetElement();
            if (!targetElement) {
                return;
            }
            for (const event of this.events()) {
                const observable = fromEvent(targetElement, event).pipe(tap((x) => this._event$.next(x)));
                if (!this._subscription) {
                    this._subscription = observable.subscribe();
                }
                else {
                    this._subscription.add(observable.subscribe());
                }
            }
        });
    }
    ngOnDestroy() {
        this._subscription?.unsubscribe();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AttachableDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: AttachableDirective, isStandalone: true, inputs: { events: { classPropertyName: "events", publicName: "events", isSignal: true, isRequired: false, transformFunction: null }, target: { classPropertyName: "target", publicName: "target", isSignal: true, isRequired: false, transformFunction: null }, for: { classPropertyName: "for", publicName: "for", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { events: "eventsChange", target: "targetChange", for: "forChange", event: "event" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AttachableDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], ctorParameters: () => [] });
function getElement(element) {
    if (!element) {
        return undefined;
    }
    if (element instanceof MaterialDesignComponent) {
        return element.hostElement;
    }
    return element instanceof ElementRef ? element.nativeElement : element;
}
function attachTarget(type, element) {
    const directive = inject(type);
    if (isSignal(element)) {
        effect(() => directive.target.set(getElement(element())), {
            allowSignalWrites: true,
        });
    }
    else {
        directive.target.set(getElement(element));
    }
    return directive;
}
function attach(...events) {
    const directive = inject(AttachableDirective);
    directive.events.set(events);
    return directive;
}

class ForwardFocusDirective extends AttachableDirective {
    onFocus() {
        this.targetElement()?.focus();
    }
    onBlur() {
        this.targetElement()?.blur();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ForwardFocusDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.9", type: ForwardFocusDirective, isStandalone: true, host: { listeners: { "focus": "onFocus()", "blur": "onBlur()" } }, usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ForwardFocusDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], propDecorators: { onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onBlur: [{
                type: HostListener,
                args: ['blur']
            }] } });

class ProgressIndicatorComponent extends MaterialDesignComponent {
    variant = model('circular');
    value = model(0);
    max = model(1);
    indeterminate = model(false);
    fourColor = model(false);
    size = model();
    width = model();
    buffer = model(0);
    circleSize = model();
    dashOffset = computed(() => (1 - this.value() / this.max()) * 100);
    progressStyle = computed(() => ({
        transform: `scaleX(${(this.indeterminate() ? 1 : this.value() / this.max()) * 100}%)`,
    }));
    dotSize = computed(() => this.indeterminate() || !this.buffer() ? 1 : this.buffer() / this.max());
    dotStyle = computed(() => ({
        transform: `scaleX(${this.dotSize() * 100}%)`,
    }));
    hideDots = computed(() => this.indeterminate() ||
        !this.buffer() ||
        this.buffer() >= this.max() ||
        this.value() >= this.max());
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ProgressIndicatorComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: ProgressIndicatorComponent, isStandalone: true, selector: "md-progress-indicator", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null }, indeterminate: { classPropertyName: "indeterminate", publicName: "indeterminate", isSignal: true, isRequired: false, transformFunction: null }, fourColor: { classPropertyName: "fourColor", publicName: "fourColor", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, width: { classPropertyName: "width", publicName: "width", isSignal: true, isRequired: false, transformFunction: null }, buffer: { classPropertyName: "buffer", publicName: "buffer", isSignal: true, isRequired: false, transformFunction: null }, circleSize: { classPropertyName: "circleSize", publicName: "circleSize", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { variant: "variantChange", value: "valueChange", max: "maxChange", indeterminate: "indeterminateChange", fourColor: "fourColorChange", size: "sizeChange", width: "widthChange", buffer: "bufferChange", circleSize: "circleSizeChange" }, host: { properties: { "attr.variant": "variant()", "style.--md-comp-progress-indicator-size": "size() ?? null", "style.--md-comp-progress-indicator-width": "width() ?? null" } }, usesInheritance: true, ngImport: i0, template: "<div class=\"progress\" [class.indeterminate]=\"this.indeterminate()\" [class.four-color]=\"this.fourColor()\"\n  role=\"progressbar\">\n  @if (variant() === 'linear') {\n  <div class=\"dots\" [hidden]=\"hideDots()\"></div>\n  <div class=\"inactive-track\" [style]=\"dotStyle()\"></div>\n  <div class=\"bar primary-bar\" [style]=\"progressStyle()\">\n    <div class=\"bar-inner\"></div>\n  </div>\n  <div class=\"bar secondary-bar\">\n    <div class=\"bar-inner\"></div>\n  </div>\n  } @else {\n  @if (indeterminate()) {\n  <div class=\"spinner\">\n    <div class=\"left\">\n      <div class=\"circle\"></div>\n    </div>\n    <div class=\"right\">\n      <div class=\"circle\"></div>\n    </div>\n  </div>\n  } @else {\n  <svg viewBox=\"0 0 4800 4800\">\n    <circle class=\"track\" pathLength=\"100\"></circle>\n    <circle class=\"active-track\" pathLength=\"100\" [attr.stroke-dashoffset]=\"dashOffset()\"></circle>\n  </svg>\n  }\n  }\n</div>", styles: [":host{--md-comp-progress-indicator-color: var(--md-sys-color-primary);--md-comp-progress-indicator-color-one: var(--md-sys-color-primary);--md-comp-progress-indicator-color-two: var(--md-sys-color-primary-container);--md-comp-progress-indicator-color-three: var(--md-sys-color-tertiary);--md-comp-progress-indicator-color-four: var( --md-sys-color-tertiary-container );--md-comp-progress-indicator-size: 48;--md-comp-progress-indicator-width: 4;--md-comp-progress-indicator-track-color: var( --md-sys-color-surface-container-highest );--md-comp-progress-indicator-track-height: 4px;--md-comp-progress-indicator-height: 4px}:host([variant=circular]){--_size-px: calc(var(--md-comp-progress-indicator-size) * 1px);display:inline-flex;vertical-align:middle;width:var(--_size-px);height:var(--_size-px);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}:host([variant=circular]) .progress{flex:1;align-self:stretch;margin:4px}:host([variant=circular]) .progress,:host([variant=circular]) .spinner,:host([variant=circular]) .left,:host([variant=circular]) .right,:host([variant=circular]) .circle,:host([variant=circular]) svg,:host([variant=circular]) .track,:host([variant=circular]) .active-track{position:absolute;inset:0}:host([variant=circular]) svg{transform:rotate(-90deg)}:host([variant=circular]) circle{cx:50%;cy:50%;r:calc(50% * (1 - var(--md-comp-progress-indicator-width) / 100));stroke-width:calc(var(--md-comp-progress-indicator-width) * 1%);stroke-dasharray:100;fill:transparent}:host([variant=circular]) .active-track{transition:stroke-dashoffset .5s cubic-bezier(0,0,.2,1);stroke:var(--md-comp-progress-indicator-color)}:host([variant=circular]) .track{stroke:transparent}:host([variant=circular]) .progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1.5682352941176s}:host([variant=circular]) .spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(.4,0,.2,1)}:host([variant=circular]) .left{overflow:hidden;inset:0 50% 0 0}:host([variant=circular]) .right{overflow:hidden;inset:0 0 0 50%}:host([variant=circular]) .circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--md-comp-progress-indicator-width) / 100 * (var(--_size-px) - 8px));border-color:var(--md-comp-progress-indicator-color) var(--md-comp-progress-indicator-color) transparent transparent;animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(.4,0,.2,1)}:host([variant=circular]) .four-color .circle{animation-name:expand-arc,four-color}:host([variant=circular]) .left .circle{rotate:135deg;inset:0 -100% 0 0}:host([variant=circular]) .right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-.6665s,0ms}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}to{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}to{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--md-comp-progress-indicator-color-one);border-right-color:var(--md-comp-progress-indicator-color-one)}15%{border-top-color:var(--md-comp-progress-indicator-color-one);border-right-color:var(--md-comp-progress-indicator-color-one)}25%{border-top-color:var(--md-comp-progress-indicator-color-two);border-right-color:var(--md-comp-progress-indicator-color-two)}40%{border-top-color:var(--md-comp-progress-indicator-color-two);border-right-color:var(--md-comp-progress-indicator-color-two)}50%{border-top-color:var(--md-comp-progress-indicator-color-three);border-right-color:var(--md-comp-progress-indicator-color-three)}65%{border-top-color:var(--md-comp-progress-indicator-color-three);border-right-color:var(--md-comp-progress-indicator-color-three)}75%{border-top-color:var(--md-comp-progress-indicator-color-four);border-right-color:var(--md-comp-progress-indicator-color-four)}90%{border-top-color:var(--md-comp-progress-indicator-color-four);border-right-color:var(--md-comp-progress-indicator-color-four)}to{border-top-color:var(--md-comp-progress-indicator-color-one);border-right-color:var(--md-comp-progress-indicator-color-one)}}:host([variant=linear]){display:flex;position:relative;min-width:80px;height:var(--md-comp-progress-indicator-track-height);content-visibility:auto;contain:strict}:host([variant=linear]) .progress,:host([variant=linear]) .dots,:host([variant=linear]) .inactive-track,:host([variant=linear]) .bar,:host([variant=linear]) .bar-inner{position:absolute}:host([variant=linear]) .progress{direction:ltr;inset:0;border-radius:inherit;overflow:hidden;display:flex;align-items:center}:host([variant=linear]) .bar{animation:none;width:100%;height:var(--md-comp-progress-indicator-height);transform-origin:left center;transition:transform .25s cubic-bezier(.4,0,.6,1)}:host([variant=linear]) .secondary-bar{display:none}:host([variant=linear]) .bar-inner{inset:0;animation:none;background:var(--md-comp-progress-indicator-color)}:host([variant=linear]) .inactive-track{background:var(--md-comp-progress-indicator-track-color);inset:0;transition:transform .25s cubic-bezier(.4,0,.6,1);transform-origin:left center}:host([variant=linear]) .dots{inset:0;animation:linear infinite .25s;animation-name:buffering;background-color:var(--md-comp-progress-indicator-track-color);background-repeat:repeat-x;-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E\");z-index:-1}:host([variant=linear]) .dots[hidden]{display:none}:host([variant=linear]) .indeterminate .bar{transition:none}:host([variant=linear]) .indeterminate .primary-bar{inset-inline-start:-145.167%}:host([variant=linear]) .indeterminate .secondary-bar{inset-inline-start:-54.8889%;display:block}:host([variant=linear]) .indeterminate .primary-bar{animation:linear infinite 2s;animation-name:primary-indeterminate-translate}:host([variant=linear]) .indeterminate .primary-bar>.bar-inner{animation:linear infinite 2s primary-indeterminate-scale}:host([variant=linear]) .indeterminate.four-color .primary-bar>.bar-inner{animation-name:primary-indeterminate-scale,linear-four-color;animation-duration:2s,4s}:host([variant=linear]) .indeterminate .secondary-bar{animation:linear infinite 2s;animation-name:secondary-indeterminate-translate}:host([variant=linear]) .indeterminate .secondary-bar>.bar-inner{animation:linear infinite 2s secondary-indeterminate-scale}:host([variant=linear]) .indeterminate.four-color .secondary-bar>.bar-inner{animation-name:secondary-indeterminate-scale,linear-four-color;animation-duration:2s,4s}:host([variant=linear]) :host(:dir(rtl)){transform:scale(-1)}@keyframes primary-indeterminate-scale{0%{transform:scaleX(.08)}36.65%{animation-timing-function:cubic-bezier(.334731,.12482,.785844,1);transform:scaleX(.08)}69.15%{animation-timing-function:cubic-bezier(.06,.11,.6,1);transform:scaleX(.661479)}to{transform:scaleX(.08)}}@keyframes secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(.205028,.057051,.57661,.453971);transform:scaleX(.08)}19.15%{animation-timing-function:cubic-bezier(.152313,.196432,.648374,1.00432);transform:scaleX(.457104)}44.15%{animation-timing-function:cubic-bezier(.257759,-.003163,.211762,1.38179);transform:scaleX(.72796)}to{transform:scaleX(.08)}}@keyframes buffering{0%{transform:translate(calc(var(--md-comp-progress-indicator-track-height) / 2 * 5))}}@keyframes primary-indeterminate-translate{0%{transform:translate(0)}20%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translate(0)}59.15%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translate(83.6714%)}to{transform:translate(200.611%)}}@keyframes secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(.15,0,.515058,.409685);transform:translate(0)}25%{animation-timing-function:cubic-bezier(.31033,.284058,.8,.733712);transform:translate(37.6519%)}48.35%{animation-timing-function:cubic-bezier(.4,.627035,.6,.902026);transform:translate(84.3862%)}to{transform:translate(160.278%)}}@keyframes linear-four-color{0%{background:var(--md-comp-progress-indicator-color-one)}15%{background:var(--md-comp-progress-indicator-color-one)}25%{background:var(--md-comp-progress-indicator-color-two)}40%{background:var(--md-comp-progress-indicator-color-two)}50%{background:var(--md-comp-progress-indicator-color-three)}65%{background:var(--md-comp-progress-indicator-color-three)}75%{background:var(--md-comp-progress-indicator-color-four)}90%{background:var(--md-comp-progress-indicator-color-four)}to{background:var(--md-comp-progress-indicator-color-one)}}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ProgressIndicatorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-progress-indicator', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, host: {
                        '[attr.variant]': 'variant()',
                        '[style.--md-comp-progress-indicator-size]': 'size() ?? null',
                        '[style.--md-comp-progress-indicator-width]': 'width() ?? null',
                    }, template: "<div class=\"progress\" [class.indeterminate]=\"this.indeterminate()\" [class.four-color]=\"this.fourColor()\"\n  role=\"progressbar\">\n  @if (variant() === 'linear') {\n  <div class=\"dots\" [hidden]=\"hideDots()\"></div>\n  <div class=\"inactive-track\" [style]=\"dotStyle()\"></div>\n  <div class=\"bar primary-bar\" [style]=\"progressStyle()\">\n    <div class=\"bar-inner\"></div>\n  </div>\n  <div class=\"bar secondary-bar\">\n    <div class=\"bar-inner\"></div>\n  </div>\n  } @else {\n  @if (indeterminate()) {\n  <div class=\"spinner\">\n    <div class=\"left\">\n      <div class=\"circle\"></div>\n    </div>\n    <div class=\"right\">\n      <div class=\"circle\"></div>\n    </div>\n  </div>\n  } @else {\n  <svg viewBox=\"0 0 4800 4800\">\n    <circle class=\"track\" pathLength=\"100\"></circle>\n    <circle class=\"active-track\" pathLength=\"100\" [attr.stroke-dashoffset]=\"dashOffset()\"></circle>\n  </svg>\n  }\n  }\n</div>", styles: [":host{--md-comp-progress-indicator-color: var(--md-sys-color-primary);--md-comp-progress-indicator-color-one: var(--md-sys-color-primary);--md-comp-progress-indicator-color-two: var(--md-sys-color-primary-container);--md-comp-progress-indicator-color-three: var(--md-sys-color-tertiary);--md-comp-progress-indicator-color-four: var( --md-sys-color-tertiary-container );--md-comp-progress-indicator-size: 48;--md-comp-progress-indicator-width: 4;--md-comp-progress-indicator-track-color: var( --md-sys-color-surface-container-highest );--md-comp-progress-indicator-track-height: 4px;--md-comp-progress-indicator-height: 4px}:host([variant=circular]){--_size-px: calc(var(--md-comp-progress-indicator-size) * 1px);display:inline-flex;vertical-align:middle;width:var(--_size-px);height:var(--_size-px);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}:host([variant=circular]) .progress{flex:1;align-self:stretch;margin:4px}:host([variant=circular]) .progress,:host([variant=circular]) .spinner,:host([variant=circular]) .left,:host([variant=circular]) .right,:host([variant=circular]) .circle,:host([variant=circular]) svg,:host([variant=circular]) .track,:host([variant=circular]) .active-track{position:absolute;inset:0}:host([variant=circular]) svg{transform:rotate(-90deg)}:host([variant=circular]) circle{cx:50%;cy:50%;r:calc(50% * (1 - var(--md-comp-progress-indicator-width) / 100));stroke-width:calc(var(--md-comp-progress-indicator-width) * 1%);stroke-dasharray:100;fill:transparent}:host([variant=circular]) .active-track{transition:stroke-dashoffset .5s cubic-bezier(0,0,.2,1);stroke:var(--md-comp-progress-indicator-color)}:host([variant=circular]) .track{stroke:transparent}:host([variant=circular]) .progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1.5682352941176s}:host([variant=circular]) .spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(.4,0,.2,1)}:host([variant=circular]) .left{overflow:hidden;inset:0 50% 0 0}:host([variant=circular]) .right{overflow:hidden;inset:0 0 0 50%}:host([variant=circular]) .circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--md-comp-progress-indicator-width) / 100 * (var(--_size-px) - 8px));border-color:var(--md-comp-progress-indicator-color) var(--md-comp-progress-indicator-color) transparent transparent;animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(.4,0,.2,1)}:host([variant=circular]) .four-color .circle{animation-name:expand-arc,four-color}:host([variant=circular]) .left .circle{rotate:135deg;inset:0 -100% 0 0}:host([variant=circular]) .right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-.6665s,0ms}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}to{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}to{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--md-comp-progress-indicator-color-one);border-right-color:var(--md-comp-progress-indicator-color-one)}15%{border-top-color:var(--md-comp-progress-indicator-color-one);border-right-color:var(--md-comp-progress-indicator-color-one)}25%{border-top-color:var(--md-comp-progress-indicator-color-two);border-right-color:var(--md-comp-progress-indicator-color-two)}40%{border-top-color:var(--md-comp-progress-indicator-color-two);border-right-color:var(--md-comp-progress-indicator-color-two)}50%{border-top-color:var(--md-comp-progress-indicator-color-three);border-right-color:var(--md-comp-progress-indicator-color-three)}65%{border-top-color:var(--md-comp-progress-indicator-color-three);border-right-color:var(--md-comp-progress-indicator-color-three)}75%{border-top-color:var(--md-comp-progress-indicator-color-four);border-right-color:var(--md-comp-progress-indicator-color-four)}90%{border-top-color:var(--md-comp-progress-indicator-color-four);border-right-color:var(--md-comp-progress-indicator-color-four)}to{border-top-color:var(--md-comp-progress-indicator-color-one);border-right-color:var(--md-comp-progress-indicator-color-one)}}:host([variant=linear]){display:flex;position:relative;min-width:80px;height:var(--md-comp-progress-indicator-track-height);content-visibility:auto;contain:strict}:host([variant=linear]) .progress,:host([variant=linear]) .dots,:host([variant=linear]) .inactive-track,:host([variant=linear]) .bar,:host([variant=linear]) .bar-inner{position:absolute}:host([variant=linear]) .progress{direction:ltr;inset:0;border-radius:inherit;overflow:hidden;display:flex;align-items:center}:host([variant=linear]) .bar{animation:none;width:100%;height:var(--md-comp-progress-indicator-height);transform-origin:left center;transition:transform .25s cubic-bezier(.4,0,.6,1)}:host([variant=linear]) .secondary-bar{display:none}:host([variant=linear]) .bar-inner{inset:0;animation:none;background:var(--md-comp-progress-indicator-color)}:host([variant=linear]) .inactive-track{background:var(--md-comp-progress-indicator-track-color);inset:0;transition:transform .25s cubic-bezier(.4,0,.6,1);transform-origin:left center}:host([variant=linear]) .dots{inset:0;animation:linear infinite .25s;animation-name:buffering;background-color:var(--md-comp-progress-indicator-track-color);background-repeat:repeat-x;-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E\");z-index:-1}:host([variant=linear]) .dots[hidden]{display:none}:host([variant=linear]) .indeterminate .bar{transition:none}:host([variant=linear]) .indeterminate .primary-bar{inset-inline-start:-145.167%}:host([variant=linear]) .indeterminate .secondary-bar{inset-inline-start:-54.8889%;display:block}:host([variant=linear]) .indeterminate .primary-bar{animation:linear infinite 2s;animation-name:primary-indeterminate-translate}:host([variant=linear]) .indeterminate .primary-bar>.bar-inner{animation:linear infinite 2s primary-indeterminate-scale}:host([variant=linear]) .indeterminate.four-color .primary-bar>.bar-inner{animation-name:primary-indeterminate-scale,linear-four-color;animation-duration:2s,4s}:host([variant=linear]) .indeterminate .secondary-bar{animation:linear infinite 2s;animation-name:secondary-indeterminate-translate}:host([variant=linear]) .indeterminate .secondary-bar>.bar-inner{animation:linear infinite 2s secondary-indeterminate-scale}:host([variant=linear]) .indeterminate.four-color .secondary-bar>.bar-inner{animation-name:secondary-indeterminate-scale,linear-four-color;animation-duration:2s,4s}:host([variant=linear]) :host(:dir(rtl)){transform:scale(-1)}@keyframes primary-indeterminate-scale{0%{transform:scaleX(.08)}36.65%{animation-timing-function:cubic-bezier(.334731,.12482,.785844,1);transform:scaleX(.08)}69.15%{animation-timing-function:cubic-bezier(.06,.11,.6,1);transform:scaleX(.661479)}to{transform:scaleX(.08)}}@keyframes secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(.205028,.057051,.57661,.453971);transform:scaleX(.08)}19.15%{animation-timing-function:cubic-bezier(.152313,.196432,.648374,1.00432);transform:scaleX(.457104)}44.15%{animation-timing-function:cubic-bezier(.257759,-.003163,.211762,1.38179);transform:scaleX(.72796)}to{transform:scaleX(.08)}}@keyframes buffering{0%{transform:translate(calc(var(--md-comp-progress-indicator-track-height) / 2 * 5))}}@keyframes primary-indeterminate-translate{0%{transform:translate(0)}20%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translate(0)}59.15%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translate(83.6714%)}to{transform:translate(200.611%)}}@keyframes secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(.15,0,.515058,.409685);transform:translate(0)}25%{animation-timing-function:cubic-bezier(.31033,.284058,.8,.733712);transform:translate(37.6519%)}48.35%{animation-timing-function:cubic-bezier(.4,.627035,.6,.902026);transform:translate(84.3862%)}to{transform:translate(160.278%)}}@keyframes linear-four-color{0%{background:var(--md-comp-progress-indicator-color-one)}15%{background:var(--md-comp-progress-indicator-color-one)}25%{background:var(--md-comp-progress-indicator-color-two)}40%{background:var(--md-comp-progress-indicator-color-two)}50%{background:var(--md-comp-progress-indicator-color-three)}65%{background:var(--md-comp-progress-indicator-color-three)}75%{background:var(--md-comp-progress-indicator-color-four)}90%{background:var(--md-comp-progress-indicator-color-four)}to{background:var(--md-comp-progress-indicator-color-one)}}\n"] }]
        }] });

class TouchAreaComponent extends MaterialDesignComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TouchAreaComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.9", type: TouchAreaComponent, isStandalone: true, selector: "md-touch-area", usesInheritance: true, ngImport: i0, template: "", styles: [":host{position:absolute;inset:0;border-radius:inherit}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TouchAreaComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-touch-area', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, template: "", styles: [":host{position:absolute;inset:0;border-radius:inherit}\n"] }]
        }] });

class RippleComponent extends MaterialDesignComponent {
    hoverable = model(true);
    interactive = model(true);
    attachableDirective = inject(AttachableDirective);
    hovering = toSignal(this.attachableDirective.event$.pipe(filter((x) => (this.hoverable() || this.interactive()) &&
        (x.type === 'pointerenter' || x.type === 'pointerleave')), filter((x) => this.shouldReactToEvent(x)), tap((x) => x.type === 'pointerleave' && this.endPressAnimation()), map((x) => x.type === 'pointerenter')));
    activated = signal(false);
    _rippleStartEvent;
    _checkBoundsAfterContextMenu = false;
    _growAnimation;
    _state = 'inactive';
    _pointerUp$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'pointerup'), filter((x) => this.shouldReactToEvent(x)), map(() => {
        if (this._state === 'holding') {
            return 'waiting-for-click';
        }
        if (this._state === 'touch-delay') {
            this.startPressAnimation(this._rippleStartEvent);
            return 'waiting-for-click';
        }
        return undefined;
    }), filter((x) => !!x), tap((x) => (this._state = x)));
    _pointerDown$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'pointerdown'), filter((x) => this.shouldReactToEvent(x) && this.interactive()), tap((x) => (this._rippleStartEvent = x)), filter((x) => {
        if (!this.isTouch(x)) {
            this._state = 'waiting-for-click';
            this.startPressAnimation(x);
            return false;
        }
        return true;
    }), filter((x) => !this._checkBoundsAfterContextMenu || this.inBounds(x)), tap(() => {
        this._checkBoundsAfterContextMenu = false;
        this._state = 'touch-delay';
    }), delay(150), tap((x) => {
        if (this._state === 'touch-delay') {
            this._state = 'holding';
            this.startPressAnimation(x);
        }
    }));
    _click$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'click' && this.interactive()), tap(() => {
        if (this._state === 'waiting-for-click') {
            this.endPressAnimation();
        }
        else if (this._state === 'inactive') {
            this.startPressAnimation();
            this.endPressAnimation();
        }
    }));
    _pointerCancel$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'pointercancel'), tap(() => this.endPressAnimation()));
    _contextMenu$ = this.attachableDirective.event$.pipe(filter((x) => x.type === 'contextmenu'), tap(() => {
        this._checkBoundsAfterContextMenu = true;
        this.endPressAnimation();
    }));
    constructor() {
        super();
        this.attachableDirective.events.set([
            'click',
            'contextmenu',
            'pointercancel',
            'pointerdown',
            'pointerenter',
            'pointerleave',
            'pointerup',
        ]);
        this._pointerUp$.subscribe();
        this._pointerDown$.subscribe();
        this._click$.subscribe();
        this._pointerCancel$.subscribe();
        this._contextMenu$.subscribe();
    }
    determineRippleSize() {
        const { height, width } = this.hostElement.getBoundingClientRect();
        const maxDim = Math.max(height, width);
        const softEdgeSize = Math.max(0.35 * maxDim, 75);
        const initialSize = Math.floor(maxDim * 0.2);
        const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
        const maxRadius = hypotenuse + 10;
        const rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
        const rippleSize = `${initialSize}px`;
        return {
            initialSize,
            rippleScale,
            rippleSize,
        };
    }
    getNormalizedPointerEventCoords(pointerEvent) {
        const { scrollX, scrollY } = window;
        const { left, top } = this.hostElement.getBoundingClientRect();
        const documentX = scrollX + left;
        const documentY = scrollY + top;
        const { pageX, pageY } = pointerEvent;
        return { x: pageX - documentX, y: pageY - documentY };
    }
    getTranslationCoordinates(initialSize, positionEvent) {
        const { height, width } = this.hostElement.getBoundingClientRect();
        // end in the center
        const endPoint = {
            x: (width - initialSize) / 2,
            y: (height - initialSize) / 2,
        };
        let startPoint;
        if (positionEvent instanceof PointerEvent) {
            startPoint = this.getNormalizedPointerEventCoords(positionEvent);
        }
        else {
            startPoint = {
                x: width / 2,
                y: height / 2,
            };
        }
        // center around start point
        startPoint = {
            x: startPoint.x - initialSize / 2,
            y: startPoint.y - initialSize / 2,
        };
        return { startPoint, endPoint };
    }
    startPressAnimation(positionEvent) {
        this.activated.set(true);
        this._growAnimation?.cancel();
        const { initialSize, rippleSize, rippleScale } = this.determineRippleSize();
        const { startPoint, endPoint } = this.getTranslationCoordinates(initialSize, positionEvent);
        const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
        const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
        this._growAnimation = this.hostElement.animate({
            top: [0, 0],
            left: [0, 0],
            height: [rippleSize, rippleSize],
            width: [rippleSize, rippleSize],
            transform: [
                `translate(${translateStart}) scale(1)`,
                `translate(${translateEnd}) scale(${rippleScale})`,
            ],
        }, {
            pseudoElement: '::after',
            duration: 450,
            easing: EASING.standard,
            fill: 'forwards',
        });
    }
    async endPressAnimation() {
        this._rippleStartEvent = undefined;
        this._state = 'inactive';
        const animation = this._growAnimation;
        let pressAnimationPlayState = Infinity;
        if (typeof animation?.currentTime === 'number') {
            pressAnimationPlayState = animation.currentTime;
        }
        else if (animation?.currentTime) {
            pressAnimationPlayState = animation.currentTime.to('ms').value;
        }
        if (pressAnimationPlayState >= 225) {
            this.activated.set(false);
            return;
        }
        await new Promise((resolve) => {
            setTimeout(resolve, 225 - pressAnimationPlayState);
        });
        if (this._growAnimation !== animation) {
            // A new press animation was started. The old animation was canceled and
            // should not finish the pressed state.
            return;
        }
        this.activated.set(false);
    }
    shouldReactToEvent(event) {
        if (!event.isPrimary) {
            return false;
        }
        if (this._rippleStartEvent &&
            this._rippleStartEvent.pointerId !== event.pointerId) {
            return false;
        }
        if (event.type === 'pointerenter' || event.type === 'pointerleave') {
            return !this.isTouch(event);
        }
        const isPrimaryButton = event.buttons === 1;
        return this.isTouch(event) || isPrimaryButton;
    }
    inBounds({ x, y }) {
        const { top, left, bottom, right } = this.hostElement.getBoundingClientRect();
        return x >= left && x <= right && y >= top && y <= bottom;
    }
    isTouch({ pointerType }) {
        return pointerType === 'touch';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: RippleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: RippleComponent, isStandalone: true, selector: "md-ripple, [mdRipple]", inputs: { hoverable: { classPropertyName: "hoverable", publicName: "hoverable", isSignal: true, isRequired: false, transformFunction: null }, interactive: { classPropertyName: "interactive", publicName: "interactive", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { hoverable: "hoverableChange", interactive: "interactiveChange" }, host: { properties: { "attr.hovering": "hovering() || null", "attr.activated": "activated() || null" } }, usesInheritance: true, hostDirectives: [{ directive: AttachableDirective, inputs: ["events", "events", "for", "for", "target", "target"] }], ngImport: i0, template: "", styles: [":host{--md-comp-ripple-color: var(--md-sys-color-surface-on);--md-comp-ripple-color-activated: var(--md-comp-ripple-color);--md-comp-ripple-transform-default: unset;--md-comp-ripple-transform-hover: unset;display:inline-flex;margin:auto;pointer-events:none;border-radius:inherit;position:absolute;inset:0;overflow:hidden;-webkit-tap-highlight-color:transparent}:host:before,:host:after{content:\"\";opacity:0;position:absolute;border-radius:inherit}:host:before{background-color:var(--md-comp-ripple-color);inset:0;transform:var(--md-comp-ripple-transform-default);transition-property:opacity,background-color,transform;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host:after{background:radial-gradient(closest-side,var(--md-comp-ripple-color-activated) max(100% - 70px,65%),transparent 100%);transform-origin:center center;transition:opacity 375ms linear}:host([hovering=true]):before{background-color:var(--md-comp-ripple-color);opacity:var(--md-sys-state-hover);transform:var(--md-comp-ripple-transform-hover)}:host([activated=true]):after{opacity:var(--md-sys-state-active);transition-duration:105ms}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: RippleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-ripple, [mdRipple]', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, hostDirectives: [
                        {
                            directive: AttachableDirective,
                            inputs: ['events', 'for', 'target'],
                        },
                    ], host: {
                        '[attr.hovering]': 'hovering() || null',
                        '[attr.activated]': 'activated() || null',
                    }, template: "", styles: [":host{--md-comp-ripple-color: var(--md-sys-color-surface-on);--md-comp-ripple-color-activated: var(--md-comp-ripple-color);--md-comp-ripple-transform-default: unset;--md-comp-ripple-transform-hover: unset;display:inline-flex;margin:auto;pointer-events:none;border-radius:inherit;position:absolute;inset:0;overflow:hidden;-webkit-tap-highlight-color:transparent}:host:before,:host:after{content:\"\";opacity:0;position:absolute;border-radius:inherit}:host:before{background-color:var(--md-comp-ripple-color);inset:0;transform:var(--md-comp-ripple-transform-default);transition-property:opacity,background-color,transform;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host:after{background:radial-gradient(closest-side,var(--md-comp-ripple-color-activated) max(100% - 70px,65%),transparent 100%);transform-origin:center center;transition:opacity 375ms linear}:host([hovering=true]):before{background-color:var(--md-comp-ripple-color);opacity:var(--md-sys-state-hover);transform:var(--md-comp-ripple-transform-hover)}:host([activated=true]):after{opacity:var(--md-sys-state-active);transition-duration:105ms}\n"] }]
        }], ctorParameters: () => [] });

class ParentActivationDirective extends AttachableDirective {
    click(event) {
        const target = this.targetElement();
        if (!target) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        if (!isActivationClick(event)) {
            return;
        }
        this.hostElement.focus();
        event.preventDefault();
        event.stopImmediatePropagation();
        dispatchActivationClick(target);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ParentActivationDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.9", type: ParentActivationDirective, isStandalone: true, host: { listeners: { "click": "click($event)" } }, usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ParentActivationDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], propDecorators: { click: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

class ElevationComponent extends MaterialDesignComponent {
    level = model(0);
    hoverable = model(true);
    interactive = model(true);
    dragging = model(false);
    attachableDirective = inject(AttachableDirective);
    hovering = toSignal(this.attachableDirective.targetElement$.pipe(filter((x) => !!x), switchMap((x) => merge(fromEvent(x, 'pointerenter'), fromEvent(x, 'pointerleave'))), filter(() => this.hoverable() || this.interactive()), map((x) => x.type === 'pointerenter')));
    activated = toSignal(this.attachableDirective.targetElement$.pipe(filter((x) => !!x), switchMap((x) => merge(fromEvent(x, 'pointerdown'), fromEvent(x, 'pointerup'))), filter(() => this.interactive()), map((x) => x.type === 'pointerdown')));
    levelVariable = computed(() => {
        let level = this.level();
        if (this.dragging()) {
            return 'var(--md-sys-elevation-4)';
        }
        if (this.hovering() && !this.activated()) {
            level += 1;
        }
        return `var(--md-sys-elevation-${level})`;
    });
    constructor() {
        super();
        this.attachableDirective.events.set([
            'pointerenter',
            'pointerleave',
            'pointerdown',
            'pointerup',
        ]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ElevationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: ElevationComponent, isStandalone: true, selector: "md-elevation", inputs: { level: { classPropertyName: "level", publicName: "level", isSignal: true, isRequired: false, transformFunction: null }, hoverable: { classPropertyName: "hoverable", publicName: "hoverable", isSignal: true, isRequired: false, transformFunction: null }, interactive: { classPropertyName: "interactive", publicName: "interactive", isSignal: true, isRequired: false, transformFunction: null }, dragging: { classPropertyName: "dragging", publicName: "dragging", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { level: "levelChange", hoverable: "hoverableChange", interactive: "interactiveChange", dragging: "draggingChange" }, host: { properties: { "style.boxShadow": "levelVariable()" } }, usesInheritance: true, hostDirectives: [{ directive: AttachableDirective, inputs: ["events", "events", "for", "for", "target", "target"] }], ngImport: i0, template: "", styles: [":host{position:absolute;border-radius:inherit;inset:0;transition-property:box-shadow;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ElevationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-elevation', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, hostDirectives: [
                        {
                            directive: AttachableDirective,
                            inputs: ['events', 'for', 'target'],
                        },
                    ], host: {
                        '[style.boxShadow]': 'levelVariable()',
                    }, template: "", styles: [":host{position:absolute;border-radius:inherit;inset:0;transition-property:box-shadow;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}\n"] }]
        }], ctorParameters: () => [] });

class FocusRingComponent extends MaterialDesignComponent {
    focusVisible = model(true);
    attachableDirective = inject(AttachableDirective);
    focused = toSignal(this.attachableDirective.event$.pipe(map((x) => {
        if (x.type === 'focusout') {
            return false;
        }
        return this.focusVisible()
            ? this.attachableDirective
                .targetElement()
                ?.matches(':focus-visible') ?? false
            : true;
    })));
    constructor() {
        super();
        this.attachableDirective.events.set(['focusin', 'focusout']);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FocusRingComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: FocusRingComponent, isStandalone: true, selector: "md-focus-ring", inputs: { focusVisible: { classPropertyName: "focusVisible", publicName: "focusVisible", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { focusVisible: "focusVisibleChange" }, host: { properties: { "attr.focused": "focused() || null" } }, usesInheritance: true, hostDirectives: [{ directive: AttachableDirective, inputs: ["events", "events", "for", "for", "target", "target"] }], ngImport: i0, template: "", styles: [":host{display:inline-flex;pointer-events:none;border-radius:inherit;inset:0;position:absolute;opacity:0;outline-width:0;outline-offset:3px;outline-color:var(--md-sys-color-outline-variant);outline-style:solid;transition-property:opacity,outline-width;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([focused=true]){outline-width:3px;opacity:1}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FocusRingComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-focus-ring', changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, hostDirectives: [
                        {
                            directive: AttachableDirective,
                            inputs: ['events', 'for', 'target'],
                        },
                    ], host: {
                        '[attr.focused]': 'focused() || null',
                    }, template: "", styles: [":host{display:inline-flex;pointer-events:none;border-radius:inherit;inset:0;position:absolute;opacity:0;outline-width:0;outline-offset:3px;outline-color:var(--md-sys-color-outline-variant);outline-style:solid;transition-property:opacity,outline-width;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([focused=true]){outline-width:3px;opacity:1}\n"] }]
        }], ctorParameters: () => [] });

class ButtonComponent extends MaterialDesignComponent {
    variant = model('filled');
    disabled = model(false);
    type = model('button');
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    progressIndeterminate = model(false);
    progressValue = model(0);
    progressMax = model(0);
    button = viewChild('button');
    leadingSlot = this.slotDirective('leading');
    trailingSlot = this.slotDirective('trailing');
    hasElevation = computed(() => (this.variant() === 'elevated' ||
        this.variant() === 'filled' ||
        this.variant() === 'tonal') &&
        !this.progressIndeterminate() &&
        !this.progressValue());
    elevationLevel = computed(() => !this.disabled() && this.variant() === 'elevated' ? 1 : 0);
    constructor() {
        super();
        attachTarget(ForwardFocusDirective, this.button);
        attachTarget(ParentActivationDirective, this.button);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: ButtonComponent, isStandalone: true, selector: "md-button", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, progressIndeterminate: { classPropertyName: "progressIndeterminate", publicName: "progressIndeterminate", isSignal: true, isRequired: false, transformFunction: null }, progressValue: { classPropertyName: "progressValue", publicName: "progressValue", isSignal: true, isRequired: false, transformFunction: null }, progressMax: { classPropertyName: "progressMax", publicName: "progressMax", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { variant: "variantChange", disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", progressIndeterminate: "progressIndeterminateChange", progressValue: "progressValueChange", progressMax: "progressMaxChange" }, host: { properties: { "attr.variant": "variant()", "attr.disabled": "disabled() || null", "attr.busy": "progressIndeterminate() || !!progressValue() || null", "attr.leading": "leadingSlot()?.any() || null", "attr.trailing": "trailingSlot()?.any() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: ParentActivationDirective }, { directive: ForwardFocusDirective }], ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  <slot name=\"leading\"></slot>\n  <slot></slot>\n  <slot name=\"trailing\"></slot>\n</ng-template>\n\n@if (hasElevation()) {\n<md-elevation [target]=\"button()\" [level]=\"elevationLevel()\" />\n}\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<div class=\"progress\">\n  <md-progress-indicator [size]=\"28\" [value]=\"progressValue()\" [indeterminate]=\"progressIndeterminate()\" />\n</div>\n}", styles: [":host{--md-comp-button-icon-size: 18;--_color: currentColor;position:relative;display:inline-flex;border-radius:var(--md-sys-shape-full);height:40px;cursor:pointer;transition-property:background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);flex-shrink:0;place-content:center;place-items:center;gap:8px;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host ::slotted(md-icon){--md-comp-icon-size: var(--md-comp-button-icon-size)}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host .progress{position:absolute;display:inline-flex;align-self:center;justify-content:center;inset:0}:host md-progress-indicator{--md-comp-progress-indicator-color: var(--_color)}:host .leading,:host .trailing{display:none}:host([variant=elevated]){background-color:var(--md-sys-color-surface-container-low);color:var(--md-sys-color-primary)}:host([variant=filled]){background-color:var(--md-sys-color-primary);color:var(--md-sys-color-primary-on)}:host([variant=tonal]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([variant=outlined]){border:1px solid var(--md-sys-color-outline);color:var(--md-sys-color-primary)}:host([variant=text]){color:var(--md-sys-color-primary)}:host([variant=plain]){border-radius:0;color:var(--md-sys-color-surface-variant-on)}:host([variant=elevated]){padding-inline:24px}:host([variant=elevated][leading=true]){padding-inline-start:16px}:host([variant=elevated][trailing=true]){padding-inline-end:16px}:host([variant=filled]){padding-inline:24px}:host([variant=filled][leading=true]){padding-inline-start:16px}:host([variant=filled][trailing=true]){padding-inline-end:16px}:host([variant=tonal]){padding-inline:24px}:host([variant=tonal][leading=true]){padding-inline-start:16px}:host([variant=tonal][trailing=true]){padding-inline-end:16px}:host([variant=outlined]){padding-inline:24px}:host([variant=outlined][leading=true]){padding-inline-start:16px}:host([variant=outlined][trailing=true]){padding-inline-end:16px}:host([variant=text]){padding-inline:16px}:host([variant=text][leading=true]){padding-inline-start:12px}:host([variant=text][trailing=true]){padding-inline-end:12px}:host([busy=true]:not([disabled=true])){pointer-events:none}:host([busy=true]:not([disabled=true])) a,:host([busy=true]:not([disabled=true])) button{opacity:0}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"], dependencies: [{ kind: "component", type: ProgressIndicatorComponent, selector: "md-progress-indicator", inputs: ["variant", "value", "max", "indeterminate", "fourColor", "size", "width", "buffer", "circleSize"], outputs: ["variantChange", "valueChange", "maxChange", "indeterminateChange", "fourColorChange", "sizeChange", "widthChange", "bufferChange", "circleSizeChange"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, imports: [
                        ProgressIndicatorComponent,
                        TouchAreaComponent,
                        ElevationComponent,
                        RippleComponent,
                        FocusRingComponent,
                        CommonModule,
                        SlotDirective,
                    ], hostDirectives: [ParentActivationDirective, ForwardFocusDirective], host: {
                        '[attr.variant]': 'variant()',
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
                        '[attr.leading]': `leadingSlot()?.any() || null`,
                        '[attr.trailing]': `trailingSlot()?.any() || null`,
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  <slot name=\"leading\"></slot>\n  <slot></slot>\n  <slot name=\"trailing\"></slot>\n</ng-template>\n\n@if (hasElevation()) {\n<md-elevation [target]=\"button()\" [level]=\"elevationLevel()\" />\n}\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<div class=\"progress\">\n  <md-progress-indicator [size]=\"28\" [value]=\"progressValue()\" [indeterminate]=\"progressIndeterminate()\" />\n</div>\n}", styles: [":host{--md-comp-button-icon-size: 18;--_color: currentColor;position:relative;display:inline-flex;border-radius:var(--md-sys-shape-full);height:40px;cursor:pointer;transition-property:background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);flex-shrink:0;place-content:center;place-items:center;gap:8px;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host ::slotted(md-icon){--md-comp-icon-size: var(--md-comp-button-icon-size)}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host .progress{position:absolute;display:inline-flex;align-self:center;justify-content:center;inset:0}:host md-progress-indicator{--md-comp-progress-indicator-color: var(--_color)}:host .leading,:host .trailing{display:none}:host([variant=elevated]){background-color:var(--md-sys-color-surface-container-low);color:var(--md-sys-color-primary)}:host([variant=filled]){background-color:var(--md-sys-color-primary);color:var(--md-sys-color-primary-on)}:host([variant=tonal]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([variant=outlined]){border:1px solid var(--md-sys-color-outline);color:var(--md-sys-color-primary)}:host([variant=text]){color:var(--md-sys-color-primary)}:host([variant=plain]){border-radius:0;color:var(--md-sys-color-surface-variant-on)}:host([variant=elevated]){padding-inline:24px}:host([variant=elevated][leading=true]){padding-inline-start:16px}:host([variant=elevated][trailing=true]){padding-inline-end:16px}:host([variant=filled]){padding-inline:24px}:host([variant=filled][leading=true]){padding-inline-start:16px}:host([variant=filled][trailing=true]){padding-inline-end:16px}:host([variant=tonal]){padding-inline:24px}:host([variant=tonal][leading=true]){padding-inline-start:16px}:host([variant=tonal][trailing=true]){padding-inline-end:16px}:host([variant=outlined]){padding-inline:24px}:host([variant=outlined][leading=true]){padding-inline-start:16px}:host([variant=outlined][trailing=true]){padding-inline-end:16px}:host([variant=text]){padding-inline:16px}:host([variant=text][leading=true]){padding-inline-start:12px}:host([variant=text][trailing=true]){padding-inline-end:12px}:host([busy=true]:not([disabled=true])){pointer-events:none}:host([busy=true]:not([disabled=true])) a,:host([busy=true]:not([disabled=true])) button{opacity:0}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"] }]
        }], ctorParameters: () => [] });

class AccordianComponent extends MaterialDesignComponent {
    open = model(false);
    _openClose$ = openClose(this.open, 'short4');
    state = toSignal(this._openClose$);
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AccordianComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: AccordianComponent, isStandalone: true, selector: "md-accordian", inputs: { open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { open: "openChange" }, host: { properties: { "attr.state": "state()" } }, usesInheritance: true, ngImport: i0, template: "<md-button part=\"button\" variant=\"plain\" (click)=\"open.set(!open())\">\n  <slot name=\"headline\"></slot>\n  <md-icon>keyboard_arrow_down</md-icon>\n</md-button>\n<div part=\"body\" class=\"body\">\n  <slot></slot>\n</div>", styles: [":host{display:inline-flex;flex-direction:column}:host md-icon{margin-inline-start:auto;transform:rotate(0);transition-property:transform;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .body{display:inline-flex;flex-direction:column;align-items:flex-start;overflow:hidden;height:0;visibility:hidden;padding-inline:8px;padding-top:0;padding-bottom:0;transition-property:height,visibility,padding;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-button{--md-comp-button-icon-size: 24;justify-content:flex-start;font-size:var(--md-sys-typescale-title-large-size);font-weight:var(--md-sys-typescale-title-large-weight);font-family:var(--md-sys-typescale-title-large-font);padding:8px}:host md-button::part(button){flex-grow:1}:host(:not([state=closed])) .body{visibility:visible}:host([state=opening]) .body,:host([state=opened]) .body{height:auto;padding-top:8px;padding-bottom:8px}:host([state=opening]) md-icon,:host([state=opened]) md-icon{transform:rotate(-180deg)}\n"], dependencies: [{ kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "component", type: ButtonComponent, selector: "md-button", inputs: ["variant", "disabled", "type", "href", "anchorTarget", "name", "value", "progressIndeterminate", "progressValue", "progressMax"], outputs: ["variantChange", "disabledChange", "typeChange", "hrefChange", "anchorTargetChange", "nameChange", "valueChange", "progressIndeterminateChange", "progressValueChange", "progressMaxChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AccordianComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-accordian', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [IconComponent, ButtonComponent], host: {
                        '[attr.state]': 'state()',
                    }, template: "<md-button part=\"button\" variant=\"plain\" (click)=\"open.set(!open())\">\n  <slot name=\"headline\"></slot>\n  <md-icon>keyboard_arrow_down</md-icon>\n</md-button>\n<div part=\"body\" class=\"body\">\n  <slot></slot>\n</div>", styles: [":host{display:inline-flex;flex-direction:column}:host md-icon{margin-inline-start:auto;transform:rotate(0);transition-property:transform;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .body{display:inline-flex;flex-direction:column;align-items:flex-start;overflow:hidden;height:0;visibility:hidden;padding-inline:8px;padding-top:0;padding-bottom:0;transition-property:height,visibility,padding;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-button{--md-comp-button-icon-size: 24;justify-content:flex-start;font-size:var(--md-sys-typescale-title-large-size);font-weight:var(--md-sys-typescale-title-large-weight);font-family:var(--md-sys-typescale-title-large-font);padding:8px}:host md-button::part(button){flex-grow:1}:host(:not([state=closed])) .body{visibility:visible}:host([state=opening]) .body,:host([state=opened]) .body{height:auto;padding-top:8px;padding-bottom:8px}:host([state=opening]) md-icon,:host([state=opened]) md-icon{transform:rotate(-180deg)}\n"] }]
        }] });

class AvatarComponent extends MaterialDesignComponent {
    disabled = model(false);
    type = model(undefined);
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    progressIndeterminate = model(false);
    progressValue = model(0);
    progressMax = model(0);
    badgeDot = model(false);
    badgeNumber = model();
    src = model();
    palette = model('primary');
    fullName = model();
    size = model();
    slot = model();
    button = viewChild('button');
    initial = computed(() => this.fullName() ? this.fullName()[0] : '');
    constructor() {
        super();
        attachTarget(ForwardFocusDirective, this.button);
        attachTarget(ParentActivationDirective, this.button);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AvatarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: AvatarComponent, isStandalone: true, selector: "md-avatar", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, progressIndeterminate: { classPropertyName: "progressIndeterminate", publicName: "progressIndeterminate", isSignal: true, isRequired: false, transformFunction: null }, progressValue: { classPropertyName: "progressValue", publicName: "progressValue", isSignal: true, isRequired: false, transformFunction: null }, progressMax: { classPropertyName: "progressMax", publicName: "progressMax", isSignal: true, isRequired: false, transformFunction: null }, badgeDot: { classPropertyName: "badgeDot", publicName: "badgeDot", isSignal: true, isRequired: false, transformFunction: null }, badgeNumber: { classPropertyName: "badgeNumber", publicName: "badgeNumber", isSignal: true, isRequired: false, transformFunction: null }, src: { classPropertyName: "src", publicName: "src", isSignal: true, isRequired: false, transformFunction: null }, palette: { classPropertyName: "palette", publicName: "palette", isSignal: true, isRequired: false, transformFunction: null }, fullName: { classPropertyName: "fullName", publicName: "fullName", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, slot: { classPropertyName: "slot", publicName: "slot", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", progressIndeterminate: "progressIndeterminateChange", progressValue: "progressValueChange", progressMax: "progressMaxChange", badgeDot: "badgeDotChange", badgeNumber: "badgeNumberChange", src: "srcChange", palette: "paletteChange", fullName: "fullNameChange", size: "sizeChange", slot: "slotChange" }, host: { properties: { "attr.palette": "palette()", "attr.interactive": "!!type() || !!href() || null", "style.--md-comp-avatar-size": "size() ?? null", "attr.disabled": "disabled() || null", "attr.busy": "progressIndeterminate() || !!progressValue() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: ForwardFocusDirective }, { directive: ParentActivationDirective }], ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  @if (src()) {\n  @defer {\n  <img [src]=\"src()\" [alt]=\"fullName()\" />\n  }\n  } @else {\n  <span class=\"initials\">\n    {{ initial() }}\n  </span>\n  }\n</ng-template>\n\n@if (this.type() || this.href()) {\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" class=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled()\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n} @else {\n<ng-container *ngTemplateOutlet=\"content\" />\n}\n@if (badgeDot() || badgeNumber()) {\n<md-badge part=\"badge\" [dot]=\"badgeDot()\" [number]=\"badgeNumber()\" />\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<md-progress-indicator [value]=\"progressValue()\" [indeterminate]=\"progressIndeterminate()\" />\n}", styles: [":host{--md-comp-avatar-size: 40;--_size-px: calc(var(--md-comp-avatar-size) * 1px);--_color: currentColor;position:relative;border-radius:var(--md-sys-shape-full);height:var(--_size-px);width:var(--_size-px);flex-shrink:0;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);font-size:calc(var(--_size-px) * .45);justify-content:center;align-items:center;display:inline-flex;overflow:hidden;transition-property:background-color,border,color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host img{height:var(--_size-px);width:var(--_size-px);transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-ripple{--md-comp-ripple-color: var(--_color);--md-comp-ripple-transform-default: scale(0);--md-comp-ripple-transform-hover: scale(1);z-index:1}:host md-progress-indicator{--md-comp-progress-indicator-color: var(--_color);--md-comp-progress-indicator-size: calc(var(--md-comp-avatar-size) * .6);position:absolute;display:inline-flex;align-self:center}:host .content{transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([interactive=true]){cursor:pointer}:host([palette=surface]){background-color:var(--md-sys-color-surface-container-low);border:2px solid var(--md-sys-color-outline-variant);color:var(--md-sys-color-surface-variant-on)}:host([palette=primary]){background-color:var(--md-sys-color-primary-container);border:2px solid var(--md-sys-color-primary);color:var(--md-sys-color-primary)}:host([palette=secondary]){background-color:var(--md-sys-color-secondary-container);border:2px solid var(--md-sys-color-secondary);color:var(--md-sys-color-secondary)}:host([palette=tertiary]){background-color:var(--md-sys-color-tertiary-container);border:2px solid var(--md-sys-color-tertiary);color:var(--md-sys-color-tertiary)}:host([palette=plain]){background-color:transparent;color:var(--md-sys-color-surface-variant-on)}:host([palette=plain][disabled=true]){background-color:transparent;border-color:transparent}:host([interactive=true]:hover) img{opacity:.8}:host([busy=true]:not([disabled=true])){pointer-events:none}:host([busy=true]:not([disabled=true])) img{opacity:.5}:host([busy=true]:not([disabled=true])) .initials{opacity:0}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%));border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([disabled=true]) img{opacity:.5}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: BadgeComponent, selector: "md-badge", inputs: ["dot", "number", "embedded"], outputs: ["dotChange", "numberChange", "embeddedChange"] }, { kind: "component", type: ProgressIndicatorComponent, selector: "md-progress-indicator", inputs: ["variant", "value", "max", "indeterminate", "fourColor", "size", "width", "buffer", "circleSize"], outputs: ["variantChange", "valueChange", "maxChange", "indeterminateChange", "fourColorChange", "sizeChange", "widthChange", "bufferChange", "circleSizeChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AvatarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-avatar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, imports: [
                        CommonModule,
                        TouchAreaComponent,
                        FocusRingComponent,
                        RippleComponent,
                        CommonModule,
                        BadgeComponent,
                        ProgressIndicatorComponent,
                    ], hostDirectives: [ForwardFocusDirective, ParentActivationDirective], host: {
                        '[attr.palette]': 'palette()',
                        '[attr.interactive]': '!!type() || !!href() || null',
                        '[style.--md-comp-avatar-size]': 'size() ?? null',
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  @if (src()) {\n  @defer {\n  <img [src]=\"src()\" [alt]=\"fullName()\" />\n  }\n  } @else {\n  <span class=\"initials\">\n    {{ initial() }}\n  </span>\n  }\n</ng-template>\n\n@if (this.type() || this.href()) {\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" class=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled()\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n} @else {\n<ng-container *ngTemplateOutlet=\"content\" />\n}\n@if (badgeDot() || badgeNumber()) {\n<md-badge part=\"badge\" [dot]=\"badgeDot()\" [number]=\"badgeNumber()\" />\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<md-progress-indicator [value]=\"progressValue()\" [indeterminate]=\"progressIndeterminate()\" />\n}", styles: [":host{--md-comp-avatar-size: 40;--_size-px: calc(var(--md-comp-avatar-size) * 1px);--_color: currentColor;position:relative;border-radius:var(--md-sys-shape-full);height:var(--_size-px);width:var(--_size-px);flex-shrink:0;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);font-size:calc(var(--_size-px) * .45);justify-content:center;align-items:center;display:inline-flex;overflow:hidden;transition-property:background-color,border,color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host img{height:var(--_size-px);width:var(--_size-px);transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-ripple{--md-comp-ripple-color: var(--_color);--md-comp-ripple-transform-default: scale(0);--md-comp-ripple-transform-hover: scale(1);z-index:1}:host md-progress-indicator{--md-comp-progress-indicator-color: var(--_color);--md-comp-progress-indicator-size: calc(var(--md-comp-avatar-size) * .6);position:absolute;display:inline-flex;align-self:center}:host .content{transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([interactive=true]){cursor:pointer}:host([palette=surface]){background-color:var(--md-sys-color-surface-container-low);border:2px solid var(--md-sys-color-outline-variant);color:var(--md-sys-color-surface-variant-on)}:host([palette=primary]){background-color:var(--md-sys-color-primary-container);border:2px solid var(--md-sys-color-primary);color:var(--md-sys-color-primary)}:host([palette=secondary]){background-color:var(--md-sys-color-secondary-container);border:2px solid var(--md-sys-color-secondary);color:var(--md-sys-color-secondary)}:host([palette=tertiary]){background-color:var(--md-sys-color-tertiary-container);border:2px solid var(--md-sys-color-tertiary);color:var(--md-sys-color-tertiary)}:host([palette=plain]){background-color:transparent;color:var(--md-sys-color-surface-variant-on)}:host([palette=plain][disabled=true]){background-color:transparent;border-color:transparent}:host([interactive=true]:hover) img{opacity:.8}:host([busy=true]:not([disabled=true])){pointer-events:none}:host([busy=true]:not([disabled=true])) img{opacity:.5}:host([busy=true]:not([disabled=true])) .initials{opacity:0}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%));border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([disabled=true]) img{opacity:.5}\n"] }]
        }], ctorParameters: () => [] });

class BreadcrumbComponent extends MaterialDesignComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: BreadcrumbComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.9", type: BreadcrumbComponent, isStandalone: true, selector: "md-breadcrumb", usesInheritance: true, ngImport: i0, template: "<slot></slot>", styles: [":host{list-style:none;display:inline-flex;padding:0;margin:0}:host ::slotted(*:not(:last-child)):after{content:\"/\";margin-top:0;margin-bottom:0;margin-inline:8px}:host(:dir(rtl)) ::slotted(*:not(:last-child)):after{content:\"\\\\\"}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: BreadcrumbComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-breadcrumb', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, template: "<slot></slot>", styles: [":host{list-style:none;display:inline-flex;padding:0;margin:0}:host ::slotted(*:not(:last-child)):after{content:\"/\";margin-top:0;margin-bottom:0;margin-inline:8px}:host(:dir(rtl)) ::slotted(*:not(:last-child)):after{content:\"\\\\\"}\n"] }]
        }] });

class CardComponent extends MaterialDesignComponent {
    variant = model('outlined');
    disabled = model(false);
    type = model(undefined);
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    progressIndeterminate = model(false);
    progressValue = model(0);
    progressMax = model(0);
    progressBuffer = model(0);
    leadingSlot = this.slotDirective('leading');
    trailingSlot = this.slotDirective('trailing');
    button = viewChild('button');
    hasElevation = computed(() => this.variant() !== 'outlined');
    elevationLevel = computed(() => this.variant() === 'elevated' ? 1 : 0);
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: CardComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: CardComponent, isStandalone: true, selector: "md-card", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, progressIndeterminate: { classPropertyName: "progressIndeterminate", publicName: "progressIndeterminate", isSignal: true, isRequired: false, transformFunction: null }, progressValue: { classPropertyName: "progressValue", publicName: "progressValue", isSignal: true, isRequired: false, transformFunction: null }, progressMax: { classPropertyName: "progressMax", publicName: "progressMax", isSignal: true, isRequired: false, transformFunction: null }, progressBuffer: { classPropertyName: "progressBuffer", publicName: "progressBuffer", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { variant: "variantChange", disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", progressIndeterminate: "progressIndeterminateChange", progressValue: "progressValueChange", progressMax: "progressMaxChange", progressBuffer: "progressBufferChange" }, host: { properties: { "attr.variant": "variant()", "attr.interactive": "!!type() || !!href() || null", "attr.leading": "leadingSlot()?.any()", "attr.trailing": "trailingSlot()?.any()", "attr.disabled": "disabled() || null", "attr.busy": "progressIndeterminate() || !!progressValue() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #content>\n  <div part=\"leading\" class=\"leading content\">\n    <slot name=\"leading\"></slot>\n  </div>\n  <div part=\"body\" class=\"body content\">\n    <slot></slot>\n  </div>\n  <div part=\"trailing\" class=\"trailing content\">\n    <slot name=\"trailing\"></slot>\n  </div>\n</ng-template>\n\n@if (type() || href()) {\n@if (hasElevation()) {\n<md-elevation part=\"elevation\" [target]=\"button()\" [level]=\"elevationLevel()\" />\n}\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <md-touch-area />\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <md-touch-area />\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n} @else {\n<md-elevation part=\"elevation\" [target]=\"hostElement\" [level]=\"elevationLevel()\" [hoverable]=\"false\"\n  [interactive]=\"false\" />\n<ng-container *ngTemplateOutlet=\"content\" />\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<div class=\"progress\">\n  <md-progress-indicator variant=\"linear\" [value]=\"progressValue()\" [indeterminate]=\"progressIndeterminate()\"\n    [buffer]=\"progressBuffer()\" />\n</div>\n}", styles: [":host{--__color: currentColor;position:relative;display:inline-flex;flex-direction:column;isolation:isolate;text-align:left;align-items:flex-start;border-radius:var(--md-sys-shape-medium);transition-property:opacity,background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);display:inherit;flex-direction:inherit}:host md-elevation{z-index:-1}:host md-ripple{--md-comp-ripple-color: var(--__color)}:host .leading,:host .body,:host .trailing{flex-direction:column;padding:1rem}:host .body{align-self:stretch;display:inline-flex;text-align:inherit;align-items:flex-start}:host .leading,:host .trailing{align-self:stretch;border-radius:inherit;display:none;background-color:var(--md-sys-color-secondary-container);text-align:inherit;align-items:flex-start}:host .progress{border-radius:inherit;overflow:hidden;position:absolute;inset:0}:host([leading=true]) .leading{display:inline-flex}:host([trailing=true]) .trailing{display:inline-flex}:host([interactive=true]){cursor:pointer}:host([variant=elevated]){background-color:var(--md-sys-color-surface-container-low)}:host([variant=elevated][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=filled]){background-color:var(--md-sys-color-surface-container-highest)}:host([variant=filled][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=outlined]){border:1px solid var(--md-sys-color-outline-variant)}:host([variant=outlined][disabled=true]){border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([busy=true]:not([disabled=true])){pointer-events:none}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }, { kind: "component", type: ProgressIndicatorComponent, selector: "md-progress-indicator", inputs: ["variant", "value", "max", "indeterminate", "fourColor", "size", "width", "buffer", "circleSize"], outputs: ["variantChange", "valueChange", "maxChange", "indeterminateChange", "fourColorChange", "sizeChange", "widthChange", "bufferChange", "circleSizeChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: CardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-card', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        CommonModule,
                        RippleComponent,
                        TouchAreaComponent,
                        FocusRingComponent,
                        ElevationComponent,
                        SlotDirective,
                        ProgressIndicatorComponent,
                    ], hostDirectives: [], host: {
                        '[attr.variant]': 'variant()',
                        '[attr.interactive]': '!!type() || !!href() || null',
                        '[attr.leading]': `leadingSlot()?.any()`,
                        '[attr.trailing]': `trailingSlot()?.any()`,
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
                    }, template: "<ng-template #content>\n  <div part=\"leading\" class=\"leading content\">\n    <slot name=\"leading\"></slot>\n  </div>\n  <div part=\"body\" class=\"body content\">\n    <slot></slot>\n  </div>\n  <div part=\"trailing\" class=\"trailing content\">\n    <slot name=\"trailing\"></slot>\n  </div>\n</ng-template>\n\n@if (type() || href()) {\n@if (hasElevation()) {\n<md-elevation part=\"elevation\" [target]=\"button()\" [level]=\"elevationLevel()\" />\n}\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <md-touch-area />\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <md-touch-area />\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n} @else {\n<md-elevation part=\"elevation\" [target]=\"hostElement\" [level]=\"elevationLevel()\" [hoverable]=\"false\"\n  [interactive]=\"false\" />\n<ng-container *ngTemplateOutlet=\"content\" />\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<div class=\"progress\">\n  <md-progress-indicator variant=\"linear\" [value]=\"progressValue()\" [indeterminate]=\"progressIndeterminate()\"\n    [buffer]=\"progressBuffer()\" />\n</div>\n}", styles: [":host{--__color: currentColor;position:relative;display:inline-flex;flex-direction:column;isolation:isolate;text-align:left;align-items:flex-start;border-radius:var(--md-sys-shape-medium);transition-property:opacity,background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);display:inherit;flex-direction:inherit}:host md-elevation{z-index:-1}:host md-ripple{--md-comp-ripple-color: var(--__color)}:host .leading,:host .body,:host .trailing{flex-direction:column;padding:1rem}:host .body{align-self:stretch;display:inline-flex;text-align:inherit;align-items:flex-start}:host .leading,:host .trailing{align-self:stretch;border-radius:inherit;display:none;background-color:var(--md-sys-color-secondary-container);text-align:inherit;align-items:flex-start}:host .progress{border-radius:inherit;overflow:hidden;position:absolute;inset:0}:host([leading=true]) .leading{display:inline-flex}:host([trailing=true]) .trailing{display:inline-flex}:host([interactive=true]){cursor:pointer}:host([variant=elevated]){background-color:var(--md-sys-color-surface-container-low)}:host([variant=elevated][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=filled]){background-color:var(--md-sys-color-surface-container-highest)}:host([variant=filled][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=outlined]){border:1px solid var(--md-sys-color-outline-variant)}:host([variant=outlined][disabled=true]){border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([busy=true]:not([disabled=true])){pointer-events:none}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"] }]
        }] });

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const GET_VALIDATION_MESSAGE_INJECTION_TOKEN = new InjectionToken('GET_VALIDATION_MESSAGE_INJECTION_TOKEN', {
    providedIn: 'root',
    factory: () => (messageOrKey, properties) => {
        if (typeof messageOrKey === 'string') {
            return messageOrKey;
        }
        const handlers = {
            required: () => $localize `This field is required.`,
            minlength: ({ requiredLength, actualLength }) => $localize `This field must be at least ${requiredLength} characters`,
            maxlength: ({ requiredLength, actualLength }) => $localize `This field must be at most ${requiredLength} characters`,
            min: ({ min }) => $localize `This field must be at least ${min}`,
            max: ({ max }) => $localize `This field must be at most ${max}`,
            pattern: ({ requiredPattern, actualValue }) => $localize `This field must match the pattern: ${requiredPattern}`,
            email: () => $localize `This field must be a valid email address.`,
            nullValidator: () => null,
        };
        if (handlers[messageOrKey]) {
            return handlers[messageOrKey](properties ?? {});
        }
        return undefined;
    },
});

class MaterialDesignValueAccessorComponent extends MaterialDesignComponent {
    disabled = model(false);
    errorText = model();
    _onChange;
    _onTouched;
    _control;
    _previousValue;
    _formGroup = inject(FormGroupDirective, { optional: true });
    _getValidationMessage = inject(GET_VALIDATION_MESSAGE_INJECTION_TOKEN);
    get formControlName() {
        return this.hostElement.getAttribute('formControlName');
    }
    get control() {
        if (!this._formGroup || !this.formControlName) {
            return undefined;
        }
        if (this._control) {
            return this._control;
        }
        this._control = this._formGroup.control.get(this.formControlName);
        this._control.valueChanges.subscribe(() => this.invalidate());
        this._control.statusChanges.subscribe(() => this.invalidate());
        return this._control;
    }
    constructor() {
        super();
        effect(() => {
            if (this._previousValue !== this.value()) {
                this._previousValue = this.value();
                this._onChange?.(this.value());
            }
        });
    }
    writeValue(value) {
        this.value.set(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled.set(isDisabled);
    }
    onFocus() {
        this._onTouched?.();
        this.invalidate();
    }
    invalidate() {
        if (!this.control) {
            return;
        }
        const errors = [];
        for (const key in this.control.errors) {
            const properties = this.control.errors[key];
            const message = this._getValidationMessage(key, properties);
            if (message) {
                errors.push(message);
            }
        }
        this.errorText.set(errors[0] ?? undefined);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MaterialDesignValueAccessorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: MaterialDesignValueAccessorComponent, selector: "ng-component", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, errorText: { classPropertyName: "errorText", publicName: "errorText", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { disabled: "disabledChange", errorText: "errorTextChange" }, host: { listeners: { "focus": "onFocus()" } }, usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MaterialDesignValueAccessorComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                }]
        }], ctorParameters: () => [], propDecorators: { onFocus: [{
                type: HostListener,
                args: ['focus']
            }] } });

class CheckComponent extends MaterialDesignValueAccessorComponent {
    type = model('checkbox');
    switch = model(false);
    supportingText = model();
    value = model(false);
    _input = viewChild('input');
    uncheckedIconSlot = this.slotDirective('unchecked-icon');
    checkedIconSlot = this.slotDirective('checked-icon');
    labelSlot = this.slotDirective();
    checked = computed(() => this.value() === true || this.value() === undefined);
    indeterminate = computed(() => this.value() === undefined);
    _checkboxIcon = computed(() => {
        if (!this.checked() && !this.indeterminate()) {
            return 'check_box_outline_blank';
        }
        else if (this.checked() && !this.indeterminate()) {
            return 'check_box';
        }
        return 'indeterminate_check_box';
    });
    _radioIcon = computed(() => this.checked() ? 'radio_button_checked' : 'radio_button_unchecked');
    icon = computed(() => this.type() === 'checkbox' ? this._checkboxIcon() : this._radioIcon());
    constructor() {
        super();
        attachTarget(ParentActivationDirective, this._input);
        attachTarget(ForwardFocusDirective, this._input);
    }
    onInput(event) {
        const target = event.target;
        if (!target.checked) {
            this.value.set(false);
        }
        else if (target.indeterminate) {
            this.value.set(undefined);
        }
        else {
            this.value.set(true);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: CheckComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: CheckComponent, isStandalone: true, selector: "md-check", inputs: { type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, switch: { classPropertyName: "switch", publicName: "switch", isSignal: true, isRequired: false, transformFunction: null }, supportingText: { classPropertyName: "supportingText", publicName: "supportingText", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { type: "typeChange", switch: "switchChange", supportingText: "supportingTextChange", value: "valueChange" }, host: { properties: { "attr.error": "!!errorText() || null", "attr.type": "type()", "attr.checked": "checked() || indeterminate()", "attr.disabled": "disabled() || null", "attr.switch": "switch() || null", "attr.uncheckedIcon": "uncheckedIconSlot()?.any() || null", "attr.checkedIcon": "checkedIconSlot()?.any() || null", "attr.label": "labelSlot()?.any() || null" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                multi: true,
                useExisting: forwardRef(() => CheckComponent),
            },
        ], viewQueries: [{ propertyName: "_input", first: true, predicate: ["input"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: ParentActivationDirective }, { directive: ForwardFocusDirective }], ngImport: i0, template: "@if (switch()) {\n<div class=\"track\">\n  <div class=\"container\">\n    <md-ripple [target]=\"input\" />\n    <md-focus-ring [target]=\"input\" />\n    <div class=\"handle\">\n      <span class=\"unchecked-icon\">\n        <slot name=\"unchecked-icon\"></slot>\n      </span>\n      <span class=\"checked-icon\">\n        <slot name=\"checked-icon\"></slot>\n      </span>\n    </div>\n  </div>\n</div>\n} @else {\n<div part=\"container\" class=\"container\">\n  <md-ripple [target]=\"input\" />\n  <md-focus-ring [target]=\"input\" />\n  <md-icon [filled]=\"checked() || indeterminate()\">{{ icon() }}</md-icon>\n</div>\n}\n<input #input [type]=\"type()\" [disabled]=\"disabled()\" [checked]=\"checked()\" [indeterminate]=\"indeterminate()\"\n  (change)=\"onInput($event)\">\n<span class=\"label\">\n  <slot></slot>\n</span>", styles: [":host{position:relative;display:inline-flex;flex-direction:row;gap:8px;color:var(--md-sys-color-surface-variant-on);transition-property:color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .container{position:relative;display:inline-flex;justify-content:center;align-items:center;border-radius:var(--md-sys-shape-full);width:40px;height:40px}:host input{appearance:none;position:absolute;inset:0;border-radius:inherit;outline:0;cursor:pointer}:host md-ripple{--md-comp-ripple-transform-default: scale(0);--md-comp-ripple-transform-hover: scale(1)}:host .label{display:none;color:inherit;align-self:center}:host md-icon,:host ::slotted(md-icon){pointer-events:none}:host md-icon{color:inherit}:host([checked=true]){color:var(--md-sys-color-primary)}:host([checked=true]) md-icon,:host([checked=true]) ::slotted(md-icon){--md-comp-icon-filled: 1}:host([error=true]){color:var(--md-sys-color-danger)}:host([label=true]) .label{display:inline-flex}:host([switch=true]){flex-grow:0;flex-shrink:0}:host([switch=true]) .track{width:52px;height:32px;display:inline-flex;justify-content:center;align-items:center;background-color:var(--md-sys-color-surface-container-highest);border:2px solid var(--md-sys-color-outline);border-radius:var(--md-sys-shape-full);box-sizing:border-box;transition-property:background-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-border)}:host([switch=true]) .handle{width:16px;height:16px;display:inline-flex;justify-content:center;align-items:center;color:var(--md-sys-color-surface-container-highest);background-color:var(--md-sys-color-outline);border-radius:inherit;transition-property:width,height,background-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([switch=true]) .container{position:absolute;transition-property:inset-inline-start;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([switch=true]) .unchecked-icon,:host([switch=true]) .checked-icon{display:none}:host([switch=true]) ::slotted(md-icon){--md-comp-icon-size: 16}:host([switch=true][checked=false]) .container{inset-inline-start:-4px}:host([switch=true][checked=false][error=true]) .track{background-color:var(--md-sys-color-danger-container);border-color:var(--md-sys-color-danger)}:host([switch=true][checked=false][error=true]) .handle{color:var(--md-sys-color-danger-on);background-color:var(--md-sys-color-danger)}:host([switch=true][checked=true]) .container{inset-inline-start:16px}:host([switch=true][checked=true]) .track{background-color:var(--md-sys-color-primary);border-color:var(--md-sys-color-primary)}:host([switch=true][checked=true]) .handle{height:24px;width:24px;color:var(--md-sys-color-primary);background-color:var(--md-sys-color-primary-on)}:host([switch=true][checked=true][error=true]) .track{background-color:var(--md-sys-color-danger);border-color:var(--md-sys-color-danger)}:host([switch=true][checked=true][error=true]) .handle{color:var(--md-sys-color-danger);background-color:var(--md-sys-color-danger-on)}:host([switch=true][checked=false][uncheckedIcon=true]) .unchecked-icon{display:inline-flex}:host([switch=true][checked=false][uncheckedIcon=true]) .handle{height:24px;width:24px}:host([switch=true][checked=true][checkedIcon=true]) .checked-icon{display:inline-flex}:host([switch=true]:active) .handle,:host([switch=true][checked=false][uncheckedIcon=true]:active) .handle{height:28px;width:28px}:host([switch=true][disabled=true]){color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}:host([switch=true][disabled=true]) .track{background-color:var(--md-sys-color-surface-container-highest);border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([switch=true][disabled=true]) .handle{color:var(--md-sys-color-surface);background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}:host([disabled=true]) .track{background-color:var(--md-sys-color-surface-container-highest);border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([disabled=true]) .handle{color:var(--md-sys-color-surface);background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}\n"], dependencies: [{ kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: CheckComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-check', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [RippleComponent, FocusRingComponent, IconComponent, SlotDirective], hostDirectives: [ParentActivationDirective, ForwardFocusDirective], host: {
                        '[attr.error]': '!!errorText() || null',
                        '[attr.type]': 'type()',
                        '[attr.checked]': 'checked() || indeterminate()',
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.switch]': 'switch() || null',
                        '[attr.uncheckedIcon]': `uncheckedIconSlot()?.any() || null`,
                        '[attr.checkedIcon]': `checkedIconSlot()?.any() || null`,
                        '[attr.label]': `labelSlot()?.any() || null`,
                    }, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            multi: true,
                            useExisting: forwardRef(() => CheckComponent),
                        },
                    ], template: "@if (switch()) {\n<div class=\"track\">\n  <div class=\"container\">\n    <md-ripple [target]=\"input\" />\n    <md-focus-ring [target]=\"input\" />\n    <div class=\"handle\">\n      <span class=\"unchecked-icon\">\n        <slot name=\"unchecked-icon\"></slot>\n      </span>\n      <span class=\"checked-icon\">\n        <slot name=\"checked-icon\"></slot>\n      </span>\n    </div>\n  </div>\n</div>\n} @else {\n<div part=\"container\" class=\"container\">\n  <md-ripple [target]=\"input\" />\n  <md-focus-ring [target]=\"input\" />\n  <md-icon [filled]=\"checked() || indeterminate()\">{{ icon() }}</md-icon>\n</div>\n}\n<input #input [type]=\"type()\" [disabled]=\"disabled()\" [checked]=\"checked()\" [indeterminate]=\"indeterminate()\"\n  (change)=\"onInput($event)\">\n<span class=\"label\">\n  <slot></slot>\n</span>", styles: [":host{position:relative;display:inline-flex;flex-direction:row;gap:8px;color:var(--md-sys-color-surface-variant-on);transition-property:color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .container{position:relative;display:inline-flex;justify-content:center;align-items:center;border-radius:var(--md-sys-shape-full);width:40px;height:40px}:host input{appearance:none;position:absolute;inset:0;border-radius:inherit;outline:0;cursor:pointer}:host md-ripple{--md-comp-ripple-transform-default: scale(0);--md-comp-ripple-transform-hover: scale(1)}:host .label{display:none;color:inherit;align-self:center}:host md-icon,:host ::slotted(md-icon){pointer-events:none}:host md-icon{color:inherit}:host([checked=true]){color:var(--md-sys-color-primary)}:host([checked=true]) md-icon,:host([checked=true]) ::slotted(md-icon){--md-comp-icon-filled: 1}:host([error=true]){color:var(--md-sys-color-danger)}:host([label=true]) .label{display:inline-flex}:host([switch=true]){flex-grow:0;flex-shrink:0}:host([switch=true]) .track{width:52px;height:32px;display:inline-flex;justify-content:center;align-items:center;background-color:var(--md-sys-color-surface-container-highest);border:2px solid var(--md-sys-color-outline);border-radius:var(--md-sys-shape-full);box-sizing:border-box;transition-property:background-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-border)}:host([switch=true]) .handle{width:16px;height:16px;display:inline-flex;justify-content:center;align-items:center;color:var(--md-sys-color-surface-container-highest);background-color:var(--md-sys-color-outline);border-radius:inherit;transition-property:width,height,background-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([switch=true]) .container{position:absolute;transition-property:inset-inline-start;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([switch=true]) .unchecked-icon,:host([switch=true]) .checked-icon{display:none}:host([switch=true]) ::slotted(md-icon){--md-comp-icon-size: 16}:host([switch=true][checked=false]) .container{inset-inline-start:-4px}:host([switch=true][checked=false][error=true]) .track{background-color:var(--md-sys-color-danger-container);border-color:var(--md-sys-color-danger)}:host([switch=true][checked=false][error=true]) .handle{color:var(--md-sys-color-danger-on);background-color:var(--md-sys-color-danger)}:host([switch=true][checked=true]) .container{inset-inline-start:16px}:host([switch=true][checked=true]) .track{background-color:var(--md-sys-color-primary);border-color:var(--md-sys-color-primary)}:host([switch=true][checked=true]) .handle{height:24px;width:24px;color:var(--md-sys-color-primary);background-color:var(--md-sys-color-primary-on)}:host([switch=true][checked=true][error=true]) .track{background-color:var(--md-sys-color-danger);border-color:var(--md-sys-color-danger)}:host([switch=true][checked=true][error=true]) .handle{color:var(--md-sys-color-danger);background-color:var(--md-sys-color-danger-on)}:host([switch=true][checked=false][uncheckedIcon=true]) .unchecked-icon{display:inline-flex}:host([switch=true][checked=false][uncheckedIcon=true]) .handle{height:24px;width:24px}:host([switch=true][checked=true][checkedIcon=true]) .checked-icon{display:inline-flex}:host([switch=true]:active) .handle,:host([switch=true][checked=false][uncheckedIcon=true]:active) .handle{height:28px;width:28px}:host([switch=true][disabled=true]){color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}:host([switch=true][disabled=true]) .track{background-color:var(--md-sys-color-surface-container-highest);border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([switch=true][disabled=true]) .handle{color:var(--md-sys-color-surface);background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}:host([disabled=true]) .track{background-color:var(--md-sys-color-surface-container-highest);border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([disabled=true]) .handle{color:var(--md-sys-color-surface);background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}\n"] }]
        }], ctorParameters: () => [] });

class ChipComponent extends MaterialDesignComponent {
    closable = model(false);
    pill = model(false);
    disabled = model(false);
    selected = model(false);
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    close = output();
    leadingSlot = this.slotDirective('leading');
    trailingSlot = this.slotDirective('trailing');
    button = viewChild('button');
    constructor() {
        super();
        this.setSlots(AvatarComponent, (x) => (x.hostElement.slot = 'leading'));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ChipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: ChipComponent, isStandalone: true, selector: "md-chip", inputs: { closable: { classPropertyName: "closable", publicName: "closable", isSignal: true, isRequired: false, transformFunction: null }, pill: { classPropertyName: "pill", publicName: "pill", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { closable: "closableChange", pill: "pillChange", disabled: "disabledChange", selected: "selectedChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", close: "close" }, host: { properties: { "attr.leading": "leadingSlot()?.any() || null", "attr.trailing": "trailingSlot()?.any() || null", "attr.disabled": "disabled() || null", "attr.closable": "closable() || null", "attr.pill": "pill() || null", "attr.selected": "selected() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  <slot name=\"leading\"></slot>\n  <slot></slot>\n  <slot name=\"trailing\"></slot>\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (closable()) {\n<ng-container *ngTemplateOutlet=\"content\" />\n<md-button variant=\"plain\" (click)=\"close.emit()\">\n  <md-icon>close</md-icon>\n</md-button>\n} @else {\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button type=\"button\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n}", styles: [":host{--_color: currentColor;position:relative;border-radius:var(--md-sys-shape-extra-small);color:var(--md-sys-color-surface-variant-on);display:inline-flex;align-items:center;justify-content:center;height:32px;flex-shrink:0;cursor:pointer;isolation:isolate;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);gap:8px;background-color:transparent;border:1px solid var(--md-sys-color-outline);padding-inline-start:8px;padding-inline-end:8px;overflow:hidden;transition-property:background-color,color,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .touch{position:absolute;inset:0;border-radius:inherit}:host ::slotted(md-icon){pointer-events:none;--md-comp-icon-size: 18}:host ::slotted(md-avatar){margin-inline-start:-4px;--md-comp-avatar-size: 24}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host md-button{height:100%;padding-inline-start:4px;padding-inline-end:4px}:host([closable=true]){padding-inline-start:16px;cursor:default}:host([closable=true]) button,:host([closable=true]) a{margin-left:-4px;cursor:pointer;position:relative;padding-inline-start:8px;padding-inline-end:8px}:host([pill=true]){border-radius:var(--md-sys-shape-full)}:host([leading=true]){padding-inline-start:8px}:host([pill=true][trailing=true]){padding-inline-end:4px}:host([closable=true]){padding-inline-end:0px}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"], dependencies: [{ kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: ButtonComponent, selector: "md-button", inputs: ["variant", "disabled", "type", "href", "anchorTarget", "name", "value", "progressIndeterminate", "progressValue", "progressMax"], outputs: ["variantChange", "disabledChange", "typeChange", "hrefChange", "anchorTargetChange", "nameChange", "valueChange", "progressIndeterminateChange", "progressValueChange", "progressMaxChange"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ChipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-chip', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        SlotDirective,
                        RippleComponent,
                        FocusRingComponent,
                        TouchAreaComponent,
                        CommonModule,
                        ButtonComponent,
                        IconComponent,
                    ], hostDirectives: [], host: {
                        '[attr.leading]': `leadingSlot()?.any() || null`,
                        '[attr.trailing]': `trailingSlot()?.any() || null`,
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.closable]': 'closable() || null',
                        '[attr.pill]': 'pill() || null',
                        '[attr.selected]': 'selected() || null',
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  <slot name=\"leading\"></slot>\n  <slot></slot>\n  <slot name=\"trailing\"></slot>\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (closable()) {\n<ng-container *ngTemplateOutlet=\"content\" />\n<md-button variant=\"plain\" (click)=\"close.emit()\">\n  <md-icon>close</md-icon>\n</md-button>\n} @else {\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button type=\"button\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n}", styles: [":host{--_color: currentColor;position:relative;border-radius:var(--md-sys-shape-extra-small);color:var(--md-sys-color-surface-variant-on);display:inline-flex;align-items:center;justify-content:center;height:32px;flex-shrink:0;cursor:pointer;isolation:isolate;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);gap:8px;background-color:transparent;border:1px solid var(--md-sys-color-outline);padding-inline-start:8px;padding-inline-end:8px;overflow:hidden;transition-property:background-color,color,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .touch{position:absolute;inset:0;border-radius:inherit}:host ::slotted(md-icon){pointer-events:none;--md-comp-icon-size: 18}:host ::slotted(md-avatar){margin-inline-start:-4px;--md-comp-avatar-size: 24}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host md-button{height:100%;padding-inline-start:4px;padding-inline-end:4px}:host([closable=true]){padding-inline-start:16px;cursor:default}:host([closable=true]) button,:host([closable=true]) a{margin-left:-4px;cursor:pointer;position:relative;padding-inline-start:8px;padding-inline-end:8px}:host([pill=true]){border-radius:var(--md-sys-shape-full)}:host([leading=true]){padding-inline-start:8px}:host([pill=true][trailing=true]){padding-inline-end:4px}:host([closable=true]){padding-inline-end:0px}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"] }]
        }], ctorParameters: () => [] });

class IconButtonComponent extends MaterialDesignComponent {
    disabled = model(false);
    type = model('button');
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    progressIndeterminate = model(false);
    progressValue = model(0);
    progressMax = model(0);
    variant = model('standard');
    selected = model(false);
    custom = model(false);
    badgeDot = model(false);
    badgeNumber = model();
    button = viewChild('button');
    constructor() {
        super();
        attachTarget(ForwardFocusDirective, this.button);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: IconButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: IconButtonComponent, isStandalone: true, selector: "md-icon-button", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, progressIndeterminate: { classPropertyName: "progressIndeterminate", publicName: "progressIndeterminate", isSignal: true, isRequired: false, transformFunction: null }, progressValue: { classPropertyName: "progressValue", publicName: "progressValue", isSignal: true, isRequired: false, transformFunction: null }, progressMax: { classPropertyName: "progressMax", publicName: "progressMax", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null }, custom: { classPropertyName: "custom", publicName: "custom", isSignal: true, isRequired: false, transformFunction: null }, badgeDot: { classPropertyName: "badgeDot", publicName: "badgeDot", isSignal: true, isRequired: false, transformFunction: null }, badgeNumber: { classPropertyName: "badgeNumber", publicName: "badgeNumber", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", progressIndeterminate: "progressIndeterminateChange", progressValue: "progressValueChange", progressMax: "progressMaxChange", variant: "variantChange", selected: "selectedChange", custom: "customChange", badgeDot: "badgeDotChange", badgeNumber: "badgeNumberChange" }, host: { properties: { "attr.variant": "variant()", "attr.selected": "selected() || null", "attr.busy": "progressIndeterminate() || !!progressValue() || null", "attr.disabled": "disabled() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: ForwardFocusDirective }], ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  @if (custom()) {\n  <slot></slot>\n  } @else {\n  <md-icon part=\"icon\" [filled]=\"selected()\" [badgeDot]=\"badgeDot()\" [badgeNumber]=\"badgeNumber()\">\n    <slot></slot>\n  </md-icon>\n  }\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<md-progress-indicator [size]=\"28\" [value]=\"progressValue()\" [indeterminate]=\"progressIndeterminate()\" />\n}", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;border-radius:var(--md-sys-shape-full);height:40px;width:40px;cursor:pointer;transition-property:opacity,background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);flex-shrink:0;place-content:center;place-items:center;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host ::slotted(md-icon),:host md-icon{--md-comp-icon-size: 24}:host md-ripple{--md-comp-ripple-color: var(--_color);--md-comp-ripple-transform-default: scale(0);--md-comp-ripple-transform-hover: scale(1)}:host md-progress-indicator{--md-comp-progress-indicator-color: var(--_color);position:absolute;display:inline-flex;align-self:center}:host([selected=true]) ::slotted(md-icon),:host([selected=true]) md-icon{--md-comp-icon-filled: 1}:host([variant=filled]){background-color:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-primary)}:host([variant=filled][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=filled][selected=true]){background-color:var(--md-sys-color-primary);color:var(--md-sys-color-primary-on)}:host([variant=tonal]){background-color:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-surface-variant-on)}:host([variant=tonal][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=tonal][selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([variant=outlined]){background-color:transparent;color:var(--md-sys-color-surface-variant-on);border:1px solid var(--md-sys-color-outline)}:host([variant=outlined][disabled=true]){border:1px solid color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([variant=outlined][selected=true]){background-color:var(--md-sys-color-surface-inverse);color:var(--md-sys-color-surface-inverse-on)}:host([variant=outlined][selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=standard]){color:var(--md-sys-color-surface-variant-on)}:host([variant=standard][selected=true]){color:var(--md-sys-color-primary)}:host([busy=true]:not([disabled=true])){pointer-events:none}:host([busy=true]:not([disabled=true])) a,:host([busy=true]:not([disabled=true])) button{opacity:0}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"], dependencies: [{ kind: "component", type: ProgressIndicatorComponent, selector: "md-progress-indicator", inputs: ["variant", "value", "max", "indeterminate", "fourColor", "size", "width", "buffer", "circleSize"], outputs: ["variantChange", "valueChange", "maxChange", "indeterminateChange", "fourColorChange", "sizeChange", "widthChange", "bufferChange", "circleSizeChange"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: IconButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-icon-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, imports: [
                        ProgressIndicatorComponent,
                        IconComponent,
                        FocusRingComponent,
                        RippleComponent,
                        TouchAreaComponent,
                        CommonModule,
                    ], hostDirectives: [ForwardFocusDirective], host: {
                        '[attr.variant]': 'variant()',
                        '[attr.selected]': 'selected() || null',
                        '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
                        '[attr.disabled]': 'disabled() || null',
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  @if (custom()) {\n  <slot></slot>\n  } @else {\n  <md-icon part=\"icon\" [filled]=\"selected()\" [badgeDot]=\"badgeDot()\" [badgeNumber]=\"badgeNumber()\">\n    <slot></slot>\n  </md-icon>\n  }\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<md-progress-indicator [size]=\"28\" [value]=\"progressValue()\" [indeterminate]=\"progressIndeterminate()\" />\n}", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;border-radius:var(--md-sys-shape-full);height:40px;width:40px;cursor:pointer;transition-property:opacity,background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);flex-shrink:0;place-content:center;place-items:center;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host ::slotted(md-icon),:host md-icon{--md-comp-icon-size: 24}:host md-ripple{--md-comp-ripple-color: var(--_color);--md-comp-ripple-transform-default: scale(0);--md-comp-ripple-transform-hover: scale(1)}:host md-progress-indicator{--md-comp-progress-indicator-color: var(--_color);position:absolute;display:inline-flex;align-self:center}:host([selected=true]) ::slotted(md-icon),:host([selected=true]) md-icon{--md-comp-icon-filled: 1}:host([variant=filled]){background-color:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-primary)}:host([variant=filled][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=filled][selected=true]){background-color:var(--md-sys-color-primary);color:var(--md-sys-color-primary-on)}:host([variant=tonal]){background-color:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-surface-variant-on)}:host([variant=tonal][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=tonal][selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([variant=outlined]){background-color:transparent;color:var(--md-sys-color-surface-variant-on);border:1px solid var(--md-sys-color-outline)}:host([variant=outlined][disabled=true]){border:1px solid color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([variant=outlined][selected=true]){background-color:var(--md-sys-color-surface-inverse);color:var(--md-sys-color-surface-inverse-on)}:host([variant=outlined][selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([variant=standard]){color:var(--md-sys-color-surface-variant-on)}:host([variant=standard][selected=true]){color:var(--md-sys-color-primary)}:host([busy=true]:not([disabled=true])){pointer-events:none}:host([busy=true]:not([disabled=true])) a,:host([busy=true]:not([disabled=true])) button{opacity:0}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"] }]
        }], ctorParameters: () => [] });

class AnimationContextDirective {
    animationTriggers = model({});
    ngOnDestroy() {
        this.stop();
    }
    stop() {
        for (const trigger of Object.values(this.animationTriggers())) {
            for (const animator of trigger) {
                animator.stop();
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AnimationContextDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: AnimationContextDirective, isStandalone: true, selector: "[mdAnimationContext]", inputs: { animationTriggers: { classPropertyName: "animationTriggers", publicName: "animationTriggers", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { animationTriggers: "animationTriggersChange" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AnimationContextDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mdAnimationContext]',
                    standalone: true,
                }]
        }] });
function animationContext(triggers) {
    const directive = inject(AnimationContextDirective);
    if (isSignal(triggers)) {
        effect(() => directive.animationTriggers.set(triggers()), {
            allowSignalWrites: true,
        });
    }
    else {
        directive.animationTriggers.set(triggers);
    }
    return directive;
}

function toKeyframeAnimationOptions(options) {
    if (!options) {
        return {};
    }
    options.easing ??= 'standard';
    options.duration ??= 'short4';
    options.fill ??= 'forwards';
    return {
        duration: durationToMilliseconds(options.duration),
        easing: easingToFunction(options.easing),
        fill: options.fill,
        iterations: options.iterations,
        direction: options.direction,
        delay: durationToMilliseconds(options.delay),
        endDelay: durationToMilliseconds(options.endDelay),
        composite: options.composite,
    };
}

class Animator {
    state;
    instructions;
    _stopped = false;
    _abortController = new AbortController();
    constructor(stateOrStates, ...instructions) {
        this.state = Array.isArray(stateOrStates) ? stateOrStates : [stateOrStates];
        this.instructions = instructions;
    }
    animate(stateValue, element) {
        return new Observable((subscriber) => {
            if (this.instructions.length === 0) {
                subscriber.next(stateValue);
                subscriber.complete();
                return;
            }
            if (!this._abortController || this._stopped) {
                this._abortController = new AbortController();
                this._stopped = false;
            }
            const animations = [];
            for (const instruction of this.instructions) {
                if (this.state != stateValue) {
                    const isArrayAndSame = Array.isArray(this.state) &&
                        Array.isArray(stateValue) &&
                        this.state.length === stateValue.length &&
                        this.state.every((value, index) => value === stateValue[index]);
                    if (!isArrayAndSame) {
                        continue;
                    }
                }
                if (instruction.style) {
                    const style = typeof instruction.style === 'function'
                        ? instruction.style()
                        : instruction.style;
                    Object.assign(element.style, style);
                }
                if (instruction.keyframes) {
                    const keyFrames = typeof instruction.keyframes === 'function'
                        ? instruction.keyframes()
                        : instruction.keyframes;
                    instruction.options ??= {};
                    instruction.options =
                        typeof instruction.options === 'function'
                            ? instruction.options()
                            : instruction.options;
                    instruction.options.duration ??= 'short4';
                    instruction.options.easing ??= 'standard';
                    const animation = element.animate(keyFrames ?? null, toKeyframeAnimationOptions(instruction.options));
                    this._abortController.signal.addEventListener('abort', () => animation.cancel());
                    animations.push(animation);
                }
            }
            Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            animations.map((animation) => animation.finished.catch(() => { }))).then(() => {
                subscriber.next(stateValue);
                subscriber.complete();
            });
        });
    }
    stop() {
        this._abortController?.abort();
        this._stopped = true;
    }
}

class AnimationDirective {
    mdAnimation = model();
    mdAnimationAnimators = model([]);
    mdAnimationState = model();
    _context = inject(AnimationContextDirective, { optional: true });
    _hostElement = inject(ElementRef).nativeElement;
    platformId = inject(PLATFORM_ID);
    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            effect(() => {
                const animators = [];
                const trigger = this.mdAnimation();
                if (trigger && this._context) {
                    const triggerAnimators = this._context.animationTriggers();
                    animators.push(...(triggerAnimators[trigger] ?? []));
                }
                animators.push(...this.mdAnimationAnimators());
                const state = this.mdAnimationState();
                const observables = [];
                for (const animator of animators) {
                    const observable = animator.animate(state, this._hostElement);
                    observables.push(observable);
                }
                forkJoin(observables).subscribe();
            });
        }
    }
    ngOnDestroy() {
        this.stop();
    }
    stop() {
        const animators = this.mdAnimationAnimators();
        for (const animator of animators) {
            animator.stop();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AnimationDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: AnimationDirective, isStandalone: true, selector: "[mdAnimation]", inputs: { mdAnimation: { classPropertyName: "mdAnimation", publicName: "mdAnimation", isSignal: true, isRequired: false, transformFunction: null }, mdAnimationAnimators: { classPropertyName: "mdAnimationAnimators", publicName: "mdAnimationAnimators", isSignal: true, isRequired: false, transformFunction: null }, mdAnimationState: { classPropertyName: "mdAnimationState", publicName: "mdAnimationState", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { mdAnimation: "mdAnimationChange", mdAnimationAnimators: "mdAnimationAnimatorsChange", mdAnimationState: "mdAnimationStateChange" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: AnimationDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mdAnimation]',
                    standalone: true,
                }]
        }], ctorParameters: () => [] });
function animation(state, animators) {
    const directive = inject(AnimationDirective);
    effect(() => directive.mdAnimationState.set(state()), {
        allowSignalWrites: true,
    });
    if (isSignal(animators)) {
        effect(() => {
            directive.stop();
            directive.mdAnimationAnimators.set(animators());
        }, {
            allowSignalWrites: true,
        });
    }
    else {
        directive.mdAnimationAnimators.set(animators);
    }
    return directive;
}

class PopoverComponent extends MaterialDesignComponent {
    attachableDirective = attach('click', 'pointerdown', 'pointerenter', 'pointerleave', 'contextmenu');
    trigger = model('click');
    flip = model(false);
    shift = model(false);
    offset = model(0);
    delay = model(0);
    placement = model('bottom-start');
    strategy = model('absolute');
    native = model(true);
    open = model(false);
    manualClose = model(false);
    useContainerWidth = model(false);
    containerWidth = computed(() => {
        this.open();
        const useContainerWidth = this.useContainerWidth();
        if (!useContainerWidth) {
            return null;
        }
        const target = this.attachableDirective.targetElement();
        if (!target) {
            return null;
        }
        return `${target.offsetWidth}px`;
    });
    _position = signal({});
    _display = signal('none');
    _opacity = signal(0);
    _document = inject(DOCUMENT);
    _documentClick$ = fromEvent(this._document, 'click').pipe(map((event) => {
        const targetElement = this.attachableDirective.targetElement();
        if (this.state() !== 'opened' || !targetElement) {
            return;
        }
        const path = event.composedPath();
        if (path.includes(this.hostElement) || path.includes(targetElement)) {
            return undefined;
        }
        return false;
    }), filter((x) => x !== undefined));
    _cancelTimer = new Subject();
    _events$ = this.attachableDirective.event$.pipe(switchMap((event) => {
        if (event.type === 'pointerleave' && this.trigger() === 'hover') {
            this._cancelTimer.next();
            return this.manualClose() ? of({}) : of(false);
        }
        if (this.state() !== 'opened') {
            if ((event.type === 'click' && this.trigger() === 'click') ||
                (event.type === 'pointerenter' && this.trigger() === 'hover') ||
                (event.type === 'contextmenu' && this.trigger() === 'contextmenu')) {
                if (event.type === 'contextmenu') {
                    event.preventDefault();
                }
                return timer(this.delay()).pipe(takeUntil(this._cancelTimer), map(() => true));
            }
        }
        return of({});
    }), map((x) => {
        if (this._closing) {
            this._closing = false;
            return;
        }
        return x;
    }), filter((x) => typeof x === 'boolean'));
    _openClose$ = openClose(this.open, 'long2', 'long3');
    state = toSignal(this._openClose$, { initialValue: 'closed' });
    stateChange = output();
    hostStyle = computed(() => ({
        display: this._display(),
        opacity: this._opacity().toString(),
        top: this._position()?.top ?? '',
        left: this._position()?.start ?? '',
    }));
    transformOrigin = computed(() => {
        const placement = this._position()?.placement ?? this.placement();
        const top = [
            'right-start',
            'left-start',
            'bottom',
            'bottom-start',
            'bottom-end',
        ];
        const bottom = [
            'right-end',
            'left-end',
            'top',
            'top-start',
            'top-end',
        ];
        if (top.find((x) => x === placement)) {
            return 'top';
        }
        else if (bottom.find((x) => x === placement)) {
            return 'bottom';
        }
        return '';
    });
    animationTriggers = {
        container: [
            new Animator('opening', {
                keyframes: { height: '100%' },
                options: { duration: 'short4', easing: 'standardDecelerate' },
            }),
            new Animator('closing', {
                keyframes: { height: '0' },
                options: {
                    duration: 'short2',
                    easing: 'standardAccelerate',
                    delay: 'short1',
                },
            }),
        ],
        body: [
            new Animator('opening', {
                keyframes: { opacity: '1' },
                options: {
                    duration: 'short4',
                    easing: 'standardDecelerate',
                    delay: 'short3',
                },
            }),
            new Animator('closing', {
                keyframes: { opacity: '0' },
                options: { duration: 'short2', easing: 'standardAccelerate' },
            }),
        ],
    };
    _platformId = inject(PLATFORM_ID);
    _cancelAutoUpdate;
    _destroyRef = inject(DestroyRef);
    _closing = false;
    constructor() {
        super();
        effect(() => this.stateChange.emit(this.state()));
        animationContext(this.animationTriggers);
        merge(this._documentClick$, this._events$)
            .pipe(takeUntilDestroyed(this._destroyRef), tap((x) => this.open.set(x)))
            .subscribe();
        effect(() => {
            if (this.native()) {
                this.hostElement.popover = 'manual';
            }
            else {
                this.hostElement.popover = '';
            }
        });
        effect(() => {
            const state = this.state();
            if (state === 'opening') {
                if (this.attachableDirective.targetElement() &&
                    isPlatformBrowser(this._platformId)) {
                    this._cancelAutoUpdate = autoUpdate(this.attachableDirective.targetElement(), this.hostElement, this.updatePosition.bind(this));
                }
                this._display.set('inline-flex');
                if (this.native() && isPlatformBrowser(this._platformId)) {
                    this.hostElement.showPopover();
                }
                this._opacity.set(1);
            }
            if (state === 'closed') {
                this._display.set('none');
                this._opacity.set(0);
                if (this.native() && isPlatformBrowser(this._platformId)) {
                    this.hostElement.hidePopover();
                }
            }
        }, {
            allowSignalWrites: true,
        });
        effect(() => (this.hostElement.popover = this.native() ? 'manual' : null));
    }
    ngOnDestroy() {
        this._cancelAutoUpdate?.();
    }
    async updatePosition() {
        const target = this.attachableDirective.targetElement();
        if (!target) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const middleware = [offset(this.offset)];
        if (this.flip()) {
            middleware.push(flip());
        }
        if (this.shift()) {
            middleware.push(shift());
        }
        const result = await computePosition(target, this.hostElement, {
            middleware,
            placement: this.placement(),
            strategy: this.strategy(),
        });
        this._position.set({
            start: `${result.x}px`,
            top: `${result.y}px`,
            placement: result.placement,
        });
        return result;
    }
    onClosePopover() {
        this._closing = true;
        this.open.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: PopoverComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: PopoverComponent, isStandalone: true, selector: "md-popover", inputs: { trigger: { classPropertyName: "trigger", publicName: "trigger", isSignal: true, isRequired: false, transformFunction: null }, flip: { classPropertyName: "flip", publicName: "flip", isSignal: true, isRequired: false, transformFunction: null }, shift: { classPropertyName: "shift", publicName: "shift", isSignal: true, isRequired: false, transformFunction: null }, offset: { classPropertyName: "offset", publicName: "offset", isSignal: true, isRequired: false, transformFunction: null }, delay: { classPropertyName: "delay", publicName: "delay", isSignal: true, isRequired: false, transformFunction: null }, placement: { classPropertyName: "placement", publicName: "placement", isSignal: true, isRequired: false, transformFunction: null }, strategy: { classPropertyName: "strategy", publicName: "strategy", isSignal: true, isRequired: false, transformFunction: null }, native: { classPropertyName: "native", publicName: "native", isSignal: true, isRequired: false, transformFunction: null }, open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, manualClose: { classPropertyName: "manualClose", publicName: "manualClose", isSignal: true, isRequired: false, transformFunction: null }, useContainerWidth: { classPropertyName: "useContainerWidth", publicName: "useContainerWidth", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { trigger: "triggerChange", flip: "flipChange", shift: "shiftChange", offset: "offsetChange", delay: "delayChange", placement: "placementChange", strategy: "strategyChange", native: "nativeChange", open: "openChange", manualClose: "manualCloseChange", useContainerWidth: "useContainerWidthChange", stateChange: "stateChange" }, host: { properties: { "attr.strategy": "strategy()", "style": "hostStyle()", "state": "state()", "style.width": "containerWidth()" } }, usesInheritance: true, hostDirectives: [{ directive: AnimationContextDirective }, { directive: AttachableDirective, inputs: ["target", "target"] }], ngImport: i0, template: "<div mdAnimation=\"container\" [mdAnimationState]=\"state()\" part=\"container\" class=\"container\"\n  [style.transformOrigin]=\"transformOrigin()\">\n  <md-elevation part=\"elevation\" [level]=\"2\" />\n</div>\n<div mdAnimation=\"body\" [mdAnimationState]=\"state()\" part=\"body\" class=\"body\">\n  <slot (close-popover)=\"onClosePopover()\"></slot>\n</div>", styles: [":host{display:none;flex-direction:column;inset:auto;opacity:0;margin:0;background-color:transparent;overflow:visible;border-radius:var(--md-sys-shape-extra-small);border:0;padding:0;z-index:var(--md-sys-z-index-popover);isolation:isolate;color:inherit}:host .container{position:absolute;background-color:var(--md-sys-color-surface-container);inset:0;border-radius:inherit;transform-origin:top;z-index:-1;color:inherit;height:0}:host .body{display:inline-flex;flex-direction:column;opacity:0;overflow-y:auto;color:inherit}:host([strategy=fixed]){position:fixed}:host([strategy=absolute]){position:absolute}\n"], dependencies: [{ kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "directive", type: AnimationDirective, selector: "[mdAnimation]", inputs: ["mdAnimation", "mdAnimationAnimators", "mdAnimationState"], outputs: ["mdAnimationChange", "mdAnimationAnimatorsChange", "mdAnimationStateChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: PopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-popover', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [ElevationComponent, AnimationDirective], hostDirectives: [
                        AnimationContextDirective,
                        {
                            directive: AttachableDirective,
                            inputs: ['target'],
                        },
                    ], host: {
                        '[attr.strategy]': 'strategy()',
                        '[style]': 'hostStyle()',
                        '[state]': 'state()',
                        '[style.width]': 'containerWidth()',
                    }, template: "<div mdAnimation=\"container\" [mdAnimationState]=\"state()\" part=\"container\" class=\"container\"\n  [style.transformOrigin]=\"transformOrigin()\">\n  <md-elevation part=\"elevation\" [level]=\"2\" />\n</div>\n<div mdAnimation=\"body\" [mdAnimationState]=\"state()\" part=\"body\" class=\"body\">\n  <slot (close-popover)=\"onClosePopover()\"></slot>\n</div>", styles: [":host{display:none;flex-direction:column;inset:auto;opacity:0;margin:0;background-color:transparent;overflow:visible;border-radius:var(--md-sys-shape-extra-small);border:0;padding:0;z-index:var(--md-sys-z-index-popover);isolation:isolate;color:inherit}:host .container{position:absolute;background-color:var(--md-sys-color-surface-container);inset:0;border-radius:inherit;transform-origin:top;z-index:-1;color:inherit;height:0}:host .body{display:inline-flex;flex-direction:column;opacity:0;overflow-y:auto;color:inherit}:host([strategy=fixed]){position:fixed}:host([strategy=absolute]){position:absolute}\n"] }]
        }], ctorParameters: () => [] });

class FieldComponent extends MaterialDesignValueAccessorComponent {
    value = model();
    variant = model('filled');
    label = model();
    populated = model(false);
    contentClick = output();
    bodyClick = output();
    _labelSpan = viewChild('labelSpan');
    _content = viewChild('content');
    popover = viewChild('popover');
    _textDirection = textDirection();
    open = model(false);
    popoverTrigger = model('click');
    maxPopoverHeight = model();
    popoverStateChange = output();
    leadingSlot = this.slotDirective('leading');
    popoverSlot = this.slotDirective('popover');
    trailingSlot = this.slotDirective('trailing');
    supportingTextSlot = this.slotDirective('supporting-text');
    counterSlot = this.slotDirective('counter');
    prefixSlot = this.slotDirective('prefix');
    suffixSlot = this.slotDirective('suffix');
    _labelStart = computed(() => {
        this.leadingSlot()?.any();
        this.label();
        const content = this._content().nativeElement;
        if (this.populated() && this.variant() === 'outlined') {
            return 16;
        }
        const offsetLeft = content.offsetLeft;
        const offsetRight = content.offsetParent
            ? content.offsetParent.offsetWidth -
                (content.offsetLeft + content.offsetWidth)
            : 0;
        const start = this._textDirection() === 'ltr' ? offsetLeft : offsetRight;
        return start;
    });
    _transition = signal('none');
    labelStyle = computed(() => ({
        insetInlineStart: `${this._labelStart()}px`,
        transition: this._transition(),
    }));
    contentStyle = computed(() => ({
        transition: this._transition(),
    }));
    _labelWidth = computed(() => this.populated() && !!this._labelSpan()?.nativeElement.offsetWidth
        ? this._labelSpan().nativeElement.offsetWidth
        : 10);
    borderTopEndStyle = computed(() => ({
        marginInlineStart: this._labelWidth() === 10 ? '' : `${10 + 4 + this._labelWidth() + 6}px`,
    }));
    _destroyRef = inject(DestroyRef);
    ngAfterViewInit() {
        timer(100)
            .pipe(takeUntilDestroyed(this._destroyRef), tap(() => this._transition.set('')))
            .subscribe();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FieldComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: FieldComponent, isStandalone: true, selector: "md-field", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, populated: { classPropertyName: "populated", publicName: "populated", isSignal: true, isRequired: false, transformFunction: null }, open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, popoverTrigger: { classPropertyName: "popoverTrigger", publicName: "popoverTrigger", isSignal: true, isRequired: false, transformFunction: null }, maxPopoverHeight: { classPropertyName: "maxPopoverHeight", publicName: "maxPopoverHeight", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange", variant: "variantChange", label: "labelChange", populated: "populatedChange", contentClick: "contentClick", bodyClick: "bodyClick", open: "openChange", popoverTrigger: "popoverTriggerChange", maxPopoverHeight: "maxPopoverHeightChange", popoverStateChange: "popoverStateChange" }, host: { properties: { "attr.variant": "variant()", "attr.populated": "populated()", "attr.disabled": "disabled()", "attr.error": "!!errorText() || null", "attr.label": "!!label() || null", "attr.leading": "leadingSlot()?.any() || null", "attr.trailing": "trailingSlot()?.any() || null", "attr.prefix": "prefixSlot()?.any() || null", "attr.suffix": "suffixSlot()?.any() || null", "attr.supportingText": "supportingTextSlot()?.any() || null", "attr.counter": "counterSlot()?.any() || null" } }, viewQueries: [{ propertyName: "_labelSpan", first: true, predicate: ["labelSpan"], descendants: true, isSignal: true }, { propertyName: "_content", first: true, predicate: ["content"], descendants: true, isSignal: true }, { propertyName: "popover", first: true, predicate: ["popover"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<div #body part=\"body\" class=\"body\" (click)=\"bodyClick.emit($event)\">\n  @if (label()) {\n  <span #labelSpan class=\"hidden-label\">{{ label() }}</span>\n  }\n  @if (variant() === 'filled') {\n  <md-ripple [target]=\"body\" [interactive]=\"false\" />\n  }\n\n  @if (variant() === 'outlined') {\n  <div class=\"border-top-start\"></div>\n  <div class=\"border-top-end\" [style]=\"borderTopEndStyle()\"></div>\n  <div class=\"border-x\"></div>\n  }\n  <div class=\"border-bottom\"></div>\n\n  @if (label()) {\n  <span class=\"label\" [ngStyle]=\"labelStyle()\">{{ label() }}</span>\n  }\n\n  <span class=\"leading\">\n    <slot name=\"leading\"></slot>\n  </span>\n\n  <div #content part=\"content\" class=\"content\" (click)=\"contentClick.emit($event)\" [style]=\"contentStyle()\">\n    <div part=\"control\" class=\"control\">\n      <slot name=\"prefix\"></slot>\n      <slot></slot>\n      <span class=\"suffix\">\n        <slot name=\"suffix\"></slot>\n      </span>\n    </div>\n  </div>\n\n  <span class=\"trailing\">\n    <slot name=\"trailing\"></slot>\n  </span>\n\n</div>\n<div class=\"footer\">\n  @if (errorText()) {\n  <span>{{ errorText()}}</span>\n  }\n  <span class=\"supporting-text\">\n    <slot #supportingTextSlot name=\"supporting-text\"></slot>\n  </span>\n  <span class=\"counter\">\n    <slot name=\"counter\"></slot>\n  </span>\n</div>\n\n<md-popover #popover [target]=\"body\" [offset]=\"4\" [trigger]=\"popoverTrigger()\" [useContainerWidth]=\"true\"\n  [(open)]=\"open\" [style.maxHeight.px]=\"maxPopoverHeight()\" (stateChange)=\"popoverStateChange.emit($event)\">\n  <slot name=\"popover\"></slot>\n</md-popover>", styles: [":host{--md-comp-field-error-color: var(--md-sys-color-danger);--_error-color: var(--md-comp-field-error-color);--_color: currentColor;display:inline-flex;flex-direction:column;gap:4px;color:var(--md-sys-color-surface-variant-on);width:100%}:host .body{border-radius:inherit;display:inline-flex;position:relative;min-height:56px;padding-inline-start:16px;padding-inline-end:16px;gap:16px}:host .leading,:host .trailing{margin-top:16px}:host .content{align-self:stretch;display:inline-flex;flex-direction:column;color:inherit;padding-top:18px;padding-bottom:4px;width:100%;font-size:var(--md-sys-typescale-body-large-size);font-weight:var(--md-sys-typescale-body-large-weight);font-family:var(--md-sys-typescale-body-large-font);transition-property:opacity,margin-top;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .control{color:inherit;display:inline-flex;caret-color:currentColor}:host .footer{display:none;color:inherit;padding-inline:16px;font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host .counter{margin-inline-start:auto}:host .hidden-label{position:absolute;pointer-events:none;z-index:-1;opacity:0;font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}:host .label{position:absolute;color:inherit;inset-inline-start:0;margin-top:18px;font-size:var(--md-sys-typescale-body-large-size);font-weight:var(--md-sys-typescale-body-large-weight);font-family:var(--md-sys-typescale-body-large-font);transition-property:color,font-size,inset,margin-top;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .leading,:host .trailing{display:none}:host .leading{color:var(--md-sys-color-surface-variant-on)}:host .trailing{color:var(--md-sys-color-surface-variant-on);margin-inline-start:auto}:host .border-top-start,:host .border-top-end,:host .border-x,:host .border-bottom{position:absolute;inset:0;border-radius:inherit;pointer-events:none;transition-property:border;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-popover{width:100%}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host .suffix{display:none;margin-inline-start:auto}:host .supporting-text{display:none}:host .counter{display:none}:host([supportingText=true]) .footer,:host([counter=true]) .footer,:host([error=true]) .footer{display:inline-flex}:host([supportingText=true]:not([error=true])) .supporting-text{display:inline-flex}:host([counter=true]) .counter{display:inline-flex}:host([suffix=true]) .suffix{display:inline-flex}:host([leading=true]) .body{padding-inline-start:12px}:host([leading=true]) .leading{display:inline-flex}:host([trailing=true]) .body{padding-inline-end:12px}:host([trailing=true]) .trailing{display:inline-flex}:host([error=true]:hover){--_error-color: color-mix(in oklab, var(--md-comp-field-error-color), var(--md-sys-color-surface-on) calc(.28 * 100%))}:host([label=true]) .content{opacity:0}:host([populated=true]) .label{font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}:host([label=true][populated=true]) .content{opacity:1}:host([label=true][populated=true]) .label{color:var(--md-sys-color-primary)}:host([label=true][populated=true]) .control{caret-color:var(--md-sys-color-primary)}:host([variant=filled]){border-radius:var(--md-sys-shape-extra-small-top)}:host([variant=filled]) .body{background-color:var(--md-sys-color-surface-container-high)}:host([variant=filled]) .border-bottom{border-bottom:1px solid var(--md-sys-color-outline)}:host([variant=filled]) .border-bottom:after{content:\"\";position:absolute;inset:auto 0 -1px;border-bottom:2px solid;border-bottom-color:inherit;transform:scaleX(0);transition-property:transform;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([variant=filled][populated=true]) .label{margin-top:10px}:host([variant=filled][populated=true]) .border-bottom{border-bottom:1px solid var(--md-sys-color-primary)}:host([variant=filled][populated=true]) .border-bottom:after{transform:scaleX(1)}:host([variant=filled][populated=true][label=true]) .content{padding-top:26px}:host([variant=outlined]){border-radius:var(--md-sys-shape-extra-small)}:host([variant=outlined]) .border-top-start,:host([variant=outlined]) .border-top-end{border-top:1px solid var(--md-sys-color-outline)}:host([variant=outlined]) .border-x{border-inline-start:1px solid var(--md-sys-color-outline);border-inline-end:1px solid var(--md-sys-color-outline)}:host([variant=outlined]) .border-bottom{border-bottom:1px solid var(--md-sys-color-outline)}:host([variant=outlined]) .border-top-start{width:10px;border-start-end-radius:0}:host([variant=outlined]) .border-top-end{margin-inline-start:10px;border-start-start-radius:0;transition-property:margin-inline-start,border;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([variant=outlined][populated=true]) .label{margin-top:-6px}:host([variant=outlined][populated=true]) .border-top-start,:host([variant=outlined][populated=true]) .border-top-end{border-top:2px solid var(--md-sys-color-primary)}:host([variant=outlined][populated=true]) .border-x{border-inline-start:2px solid var(--md-sys-color-primary);border-inline-end:2px solid var(--md-sys-color-primary)}:host([variant=outlined][populated=true]) .border-bottom{border-bottom:2px solid var(--md-sys-color-primary)}:host([error=true]) .label,:host([error=true]) .trailing,:host([error=true]) .footer,:host([error=true][populated=true]) .label,:host([error=true][populated=true]) .trailing,:host([error=true][populated=true]) .footer,:host([variant=filled][error=true]:not([populated=true])) .label,:host([variant=filled][error=true]:not([populated=true])) .trailing,:host([variant=filled][error=true]:not([populated=true])) .footer{color:var(--_error-color)}:host([error=true]) .border-top-start,:host([error=true]) .border-top-end,:host([error=true]) .border-x,:host([error=true]) .border-bottom,:host([error=true][populated=true]) .border-top-start,:host([error=true][populated=true]) .border-top-end,:host([error=true][populated=true]) .border-x,:host([error=true][populated=true]) .border-bottom,:host([variant=filled][error=true]:not([populated=true])) .border-top-start,:host([variant=filled][error=true]:not([populated=true])) .border-top-end,:host([variant=filled][error=true]:not([populated=true])) .border-x,:host([variant=filled][error=true]:not([populated=true])) .border-bottom{border-color:var(--_error-color)}:host([populated=false][error=true][disabled=true]),:host([populated=true][disabled=true]),:host([populated=true][disabled=true][error=true]){color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([populated=false][error=true][disabled=true]) .label,:host([populated=false][error=true][disabled=true]) .leading,:host([populated=false][error=true][disabled=true]) .trailing,:host([populated=false][error=true][disabled=true]) .footer,:host([populated=false][error=true][disabled=true]) .content,:host([populated=true][disabled=true]) .label,:host([populated=true][disabled=true]) .leading,:host([populated=true][disabled=true]) .trailing,:host([populated=true][disabled=true]) .footer,:host([populated=true][disabled=true]) .content,:host([populated=true][disabled=true][error=true]) .label,:host([populated=true][disabled=true][error=true]) .leading,:host([populated=true][disabled=true][error=true]) .trailing,:host([populated=true][disabled=true][error=true]) .footer,:host([populated=true][disabled=true][error=true]) .content{color:inherit}:host([populated=false][error=true][disabled=true]) .border-top-start,:host([populated=false][error=true][disabled=true]) .border-top-end,:host([populated=false][error=true][disabled=true]) .border-x,:host([populated=false][error=true][disabled=true]) .border-bottom,:host([populated=true][disabled=true]) .border-top-start,:host([populated=true][disabled=true]) .border-top-end,:host([populated=true][disabled=true]) .border-x,:host([populated=true][disabled=true]) .border-bottom,:host([populated=true][disabled=true][error=true]) .border-top-start,:host([populated=true][disabled=true][error=true]) .border-top-end,:host([populated=true][disabled=true][error=true]) .border-x,:host([populated=true][disabled=true][error=true]) .border-bottom{border-color:inherit}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([disabled=true]) .label,:host([disabled=true]) .leading,:host([disabled=true]) .trailing,:host([disabled=true]) .footer,:host([disabled=true]) .content{color:inherit}:host([disabled=true]) .border-top-start,:host([disabled=true]) .border-top-end,:host([disabled=true]) .border-x,:host([disabled=true]) .border-bottom{border-color:inherit}\n"], dependencies: [{ kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: PopoverComponent, selector: "md-popover", inputs: ["trigger", "flip", "shift", "offset", "delay", "placement", "strategy", "native", "open", "manualClose", "useContainerWidth"], outputs: ["triggerChange", "flipChange", "shiftChange", "offsetChange", "delayChange", "placementChange", "strategyChange", "nativeChange", "openChange", "manualCloseChange", "useContainerWidthChange", "stateChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-field', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [SlotDirective, RippleComponent, CommonModule, PopoverComponent], hostDirectives: [], host: {
                        '[attr.variant]': 'variant()',
                        '[attr.populated]': 'populated()',
                        '[attr.disabled]': 'disabled()',
                        '[attr.error]': '!!errorText() || null',
                        '[attr.label]': '!!label() || null',
                        '[attr.leading]': `leadingSlot()?.any() || null`,
                        '[attr.trailing]': `trailingSlot()?.any() || null`,
                        '[attr.prefix]': `prefixSlot()?.any() || null`,
                        '[attr.suffix]': `suffixSlot()?.any() || null`,
                        '[attr.supportingText]': `supportingTextSlot()?.any() || null`,
                        '[attr.counter]': 'counterSlot()?.any() || null',
                    }, template: "<div #body part=\"body\" class=\"body\" (click)=\"bodyClick.emit($event)\">\n  @if (label()) {\n  <span #labelSpan class=\"hidden-label\">{{ label() }}</span>\n  }\n  @if (variant() === 'filled') {\n  <md-ripple [target]=\"body\" [interactive]=\"false\" />\n  }\n\n  @if (variant() === 'outlined') {\n  <div class=\"border-top-start\"></div>\n  <div class=\"border-top-end\" [style]=\"borderTopEndStyle()\"></div>\n  <div class=\"border-x\"></div>\n  }\n  <div class=\"border-bottom\"></div>\n\n  @if (label()) {\n  <span class=\"label\" [ngStyle]=\"labelStyle()\">{{ label() }}</span>\n  }\n\n  <span class=\"leading\">\n    <slot name=\"leading\"></slot>\n  </span>\n\n  <div #content part=\"content\" class=\"content\" (click)=\"contentClick.emit($event)\" [style]=\"contentStyle()\">\n    <div part=\"control\" class=\"control\">\n      <slot name=\"prefix\"></slot>\n      <slot></slot>\n      <span class=\"suffix\">\n        <slot name=\"suffix\"></slot>\n      </span>\n    </div>\n  </div>\n\n  <span class=\"trailing\">\n    <slot name=\"trailing\"></slot>\n  </span>\n\n</div>\n<div class=\"footer\">\n  @if (errorText()) {\n  <span>{{ errorText()}}</span>\n  }\n  <span class=\"supporting-text\">\n    <slot #supportingTextSlot name=\"supporting-text\"></slot>\n  </span>\n  <span class=\"counter\">\n    <slot name=\"counter\"></slot>\n  </span>\n</div>\n\n<md-popover #popover [target]=\"body\" [offset]=\"4\" [trigger]=\"popoverTrigger()\" [useContainerWidth]=\"true\"\n  [(open)]=\"open\" [style.maxHeight.px]=\"maxPopoverHeight()\" (stateChange)=\"popoverStateChange.emit($event)\">\n  <slot name=\"popover\"></slot>\n</md-popover>", styles: [":host{--md-comp-field-error-color: var(--md-sys-color-danger);--_error-color: var(--md-comp-field-error-color);--_color: currentColor;display:inline-flex;flex-direction:column;gap:4px;color:var(--md-sys-color-surface-variant-on);width:100%}:host .body{border-radius:inherit;display:inline-flex;position:relative;min-height:56px;padding-inline-start:16px;padding-inline-end:16px;gap:16px}:host .leading,:host .trailing{margin-top:16px}:host .content{align-self:stretch;display:inline-flex;flex-direction:column;color:inherit;padding-top:18px;padding-bottom:4px;width:100%;font-size:var(--md-sys-typescale-body-large-size);font-weight:var(--md-sys-typescale-body-large-weight);font-family:var(--md-sys-typescale-body-large-font);transition-property:opacity,margin-top;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .control{color:inherit;display:inline-flex;caret-color:currentColor}:host .footer{display:none;color:inherit;padding-inline:16px;font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host .counter{margin-inline-start:auto}:host .hidden-label{position:absolute;pointer-events:none;z-index:-1;opacity:0;font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}:host .label{position:absolute;color:inherit;inset-inline-start:0;margin-top:18px;font-size:var(--md-sys-typescale-body-large-size);font-weight:var(--md-sys-typescale-body-large-weight);font-family:var(--md-sys-typescale-body-large-font);transition-property:color,font-size,inset,margin-top;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .leading,:host .trailing{display:none}:host .leading{color:var(--md-sys-color-surface-variant-on)}:host .trailing{color:var(--md-sys-color-surface-variant-on);margin-inline-start:auto}:host .border-top-start,:host .border-top-end,:host .border-x,:host .border-bottom{position:absolute;inset:0;border-radius:inherit;pointer-events:none;transition-property:border;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-popover{width:100%}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host .suffix{display:none;margin-inline-start:auto}:host .supporting-text{display:none}:host .counter{display:none}:host([supportingText=true]) .footer,:host([counter=true]) .footer,:host([error=true]) .footer{display:inline-flex}:host([supportingText=true]:not([error=true])) .supporting-text{display:inline-flex}:host([counter=true]) .counter{display:inline-flex}:host([suffix=true]) .suffix{display:inline-flex}:host([leading=true]) .body{padding-inline-start:12px}:host([leading=true]) .leading{display:inline-flex}:host([trailing=true]) .body{padding-inline-end:12px}:host([trailing=true]) .trailing{display:inline-flex}:host([error=true]:hover){--_error-color: color-mix(in oklab, var(--md-comp-field-error-color), var(--md-sys-color-surface-on) calc(.28 * 100%))}:host([label=true]) .content{opacity:0}:host([populated=true]) .label{font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}:host([label=true][populated=true]) .content{opacity:1}:host([label=true][populated=true]) .label{color:var(--md-sys-color-primary)}:host([label=true][populated=true]) .control{caret-color:var(--md-sys-color-primary)}:host([variant=filled]){border-radius:var(--md-sys-shape-extra-small-top)}:host([variant=filled]) .body{background-color:var(--md-sys-color-surface-container-high)}:host([variant=filled]) .border-bottom{border-bottom:1px solid var(--md-sys-color-outline)}:host([variant=filled]) .border-bottom:after{content:\"\";position:absolute;inset:auto 0 -1px;border-bottom:2px solid;border-bottom-color:inherit;transform:scaleX(0);transition-property:transform;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([variant=filled][populated=true]) .label{margin-top:10px}:host([variant=filled][populated=true]) .border-bottom{border-bottom:1px solid var(--md-sys-color-primary)}:host([variant=filled][populated=true]) .border-bottom:after{transform:scaleX(1)}:host([variant=filled][populated=true][label=true]) .content{padding-top:26px}:host([variant=outlined]){border-radius:var(--md-sys-shape-extra-small)}:host([variant=outlined]) .border-top-start,:host([variant=outlined]) .border-top-end{border-top:1px solid var(--md-sys-color-outline)}:host([variant=outlined]) .border-x{border-inline-start:1px solid var(--md-sys-color-outline);border-inline-end:1px solid var(--md-sys-color-outline)}:host([variant=outlined]) .border-bottom{border-bottom:1px solid var(--md-sys-color-outline)}:host([variant=outlined]) .border-top-start{width:10px;border-start-end-radius:0}:host([variant=outlined]) .border-top-end{margin-inline-start:10px;border-start-start-radius:0;transition-property:margin-inline-start,border;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([variant=outlined][populated=true]) .label{margin-top:-6px}:host([variant=outlined][populated=true]) .border-top-start,:host([variant=outlined][populated=true]) .border-top-end{border-top:2px solid var(--md-sys-color-primary)}:host([variant=outlined][populated=true]) .border-x{border-inline-start:2px solid var(--md-sys-color-primary);border-inline-end:2px solid var(--md-sys-color-primary)}:host([variant=outlined][populated=true]) .border-bottom{border-bottom:2px solid var(--md-sys-color-primary)}:host([error=true]) .label,:host([error=true]) .trailing,:host([error=true]) .footer,:host([error=true][populated=true]) .label,:host([error=true][populated=true]) .trailing,:host([error=true][populated=true]) .footer,:host([variant=filled][error=true]:not([populated=true])) .label,:host([variant=filled][error=true]:not([populated=true])) .trailing,:host([variant=filled][error=true]:not([populated=true])) .footer{color:var(--_error-color)}:host([error=true]) .border-top-start,:host([error=true]) .border-top-end,:host([error=true]) .border-x,:host([error=true]) .border-bottom,:host([error=true][populated=true]) .border-top-start,:host([error=true][populated=true]) .border-top-end,:host([error=true][populated=true]) .border-x,:host([error=true][populated=true]) .border-bottom,:host([variant=filled][error=true]:not([populated=true])) .border-top-start,:host([variant=filled][error=true]:not([populated=true])) .border-top-end,:host([variant=filled][error=true]:not([populated=true])) .border-x,:host([variant=filled][error=true]:not([populated=true])) .border-bottom{border-color:var(--_error-color)}:host([populated=false][error=true][disabled=true]),:host([populated=true][disabled=true]),:host([populated=true][disabled=true][error=true]){color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([populated=false][error=true][disabled=true]) .label,:host([populated=false][error=true][disabled=true]) .leading,:host([populated=false][error=true][disabled=true]) .trailing,:host([populated=false][error=true][disabled=true]) .footer,:host([populated=false][error=true][disabled=true]) .content,:host([populated=true][disabled=true]) .label,:host([populated=true][disabled=true]) .leading,:host([populated=true][disabled=true]) .trailing,:host([populated=true][disabled=true]) .footer,:host([populated=true][disabled=true]) .content,:host([populated=true][disabled=true][error=true]) .label,:host([populated=true][disabled=true][error=true]) .leading,:host([populated=true][disabled=true][error=true]) .trailing,:host([populated=true][disabled=true][error=true]) .footer,:host([populated=true][disabled=true][error=true]) .content{color:inherit}:host([populated=false][error=true][disabled=true]) .border-top-start,:host([populated=false][error=true][disabled=true]) .border-top-end,:host([populated=false][error=true][disabled=true]) .border-x,:host([populated=false][error=true][disabled=true]) .border-bottom,:host([populated=true][disabled=true]) .border-top-start,:host([populated=true][disabled=true]) .border-top-end,:host([populated=true][disabled=true]) .border-x,:host([populated=true][disabled=true]) .border-bottom,:host([populated=true][disabled=true][error=true]) .border-top-start,:host([populated=true][disabled=true][error=true]) .border-top-end,:host([populated=true][disabled=true][error=true]) .border-x,:host([populated=true][disabled=true][error=true]) .border-bottom{border-color:inherit}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}:host([disabled=true]) .label,:host([disabled=true]) .leading,:host([disabled=true]) .trailing,:host([disabled=true]) .footer,:host([disabled=true]) .content{color:inherit}:host([disabled=true]) .border-top-start,:host([disabled=true]) .border-top-end,:host([disabled=true]) .border-x,:host([disabled=true]) .border-bottom{border-color:inherit}\n"] }]
        }] });

class DividerComponent extends MaterialDesignComponent {
    vertical = model(false);
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DividerComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: DividerComponent, isStandalone: true, selector: "md-divider", inputs: { vertical: { classPropertyName: "vertical", publicName: "vertical", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { vertical: "verticalChange" }, host: { properties: { "attr.vertical": "vertical()" } }, usesInheritance: true, ngImport: i0, template: "", styles: [":host{margin:8px 0}:host([vertical=false]){border-top:1px solid currentColor}:host([vertical=true]){border-inline-start:1px solid currentColor}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DividerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-divider', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [], hostDirectives: [], host: {
                        '[attr.vertical]': 'vertical()',
                    }, template: "", styles: [":host{margin:8px 0}:host([vertical=false]){border-top:1px solid currentColor}:host([vertical=true]){border-inline-start:1px solid currentColor}\n"] }]
        }] });

class ListComponent extends MaterialDesignComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ListComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.9", type: ListComponent, isStandalone: true, selector: "md-list", usesInheritance: true, ngImport: i0, template: "<slot></slot>", styles: [":host{display:inline-flex;flex-direction:column;padding-top:8px;padding-bottom:8px}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-list', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, template: "<slot></slot>", styles: [":host{display:inline-flex;flex-direction:column;padding-top:8px;padding-bottom:8px}\n"] }]
        }] });

class DropdownComponent extends MaterialDesignValueAccessorComponent {
    value = model();
    variant = model('filled');
    prefix = model();
    suffix = model();
    label = model();
    field = viewChild('field');
    selectedValueSlot = this.slotDirective('selected-value');
    populated = computed(() => {
        if (this.field()?.popover()?.state() === 'closing' && !this.value()) {
            return false;
        }
        return (!!this.value() ||
            this.field()?.open() ||
            this.field()?.popover()?.state() === 'opening');
    });
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DropdownComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: DropdownComponent, isStandalone: true, selector: "md-dropdown", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, prefix: { classPropertyName: "prefix", publicName: "prefix", isSignal: true, isRequired: false, transformFunction: null }, suffix: { classPropertyName: "suffix", publicName: "suffix", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange", variant: "variantChange", prefix: "prefixChange", suffix: "suffixChange", label: "labelChange" }, host: { properties: { "attr.disabled": "disabled() || null" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                multi: true,
                useExisting: forwardRef(() => DropdownComponent),
            },
        ], viewQueries: [{ propertyName: "field", first: true, predicate: ["field"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<md-field #field [variant]=\"variant()\" [populated]=\"!!populated()\" [errorText]=\"errorText()\" [label]=\"label()\"\n  [disabled]=\"disabled()\" [maxPopoverHeight]=\"300\">\n  <slot name=\"leading\" slot=\"leading\"></slot>\n  <slot name=\"prefix\" slot=\"prefix\"></slot>\n  <slot name=\"suffix\" slot=\"suffix\"></slot>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <slot name=\"counter\" slot=\"counter\"></slot>\n  <span class=\"selected-value\">\n    <slot name=\"selected-value\"></slot>\n    @if (!selectedValueSlot()?.any()) {\n    {{ value() }}\n    }\n  </span>\n  <md-icon slot=\"trailing\">arrow_drop_down</md-icon>\n  <md-list slot=\"popover\">\n    <slot></slot>\n  </md-list>\n</md-field>", styles: [":host{position:relative}:host md-field::part(body){cursor:pointer}:host([disabled=true]){pointer-events:none;cursor:default}\n"], dependencies: [{ kind: "component", type: FieldComponent, selector: "md-field", inputs: ["value", "variant", "label", "populated", "open", "popoverTrigger", "maxPopoverHeight"], outputs: ["valueChange", "variantChange", "labelChange", "populatedChange", "contentClick", "bodyClick", "openChange", "popoverTriggerChange", "maxPopoverHeightChange", "popoverStateChange"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "ngmodule", type: FormsModule }, { kind: "component", type: ListComponent, selector: "md-list" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DropdownComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-dropdown', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [FieldComponent, IconComponent, FormsModule, ListComponent], hostDirectives: [], host: {
                        '[attr.disabled]': 'disabled() || null',
                    }, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            multi: true,
                            useExisting: forwardRef(() => DropdownComponent),
                        },
                    ], template: "<md-field #field [variant]=\"variant()\" [populated]=\"!!populated()\" [errorText]=\"errorText()\" [label]=\"label()\"\n  [disabled]=\"disabled()\" [maxPopoverHeight]=\"300\">\n  <slot name=\"leading\" slot=\"leading\"></slot>\n  <slot name=\"prefix\" slot=\"prefix\"></slot>\n  <slot name=\"suffix\" slot=\"suffix\"></slot>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <slot name=\"counter\" slot=\"counter\"></slot>\n  <span class=\"selected-value\">\n    <slot name=\"selected-value\"></slot>\n    @if (!selectedValueSlot()?.any()) {\n    {{ value() }}\n    }\n  </span>\n  <md-icon slot=\"trailing\">arrow_drop_down</md-icon>\n  <md-list slot=\"popover\">\n    <slot></slot>\n  </md-list>\n</md-field>", styles: [":host{position:relative}:host md-field::part(body){cursor:pointer}:host([disabled=true]){pointer-events:none;cursor:default}\n"] }]
        }] });

class ListItemComponent extends MaterialDesignComponent {
    dragging = model(false);
    top = model(false);
    large = model(false);
    selected = model(false);
    split = model(false);
    disabled = model(false);
    type = model(undefined);
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    progressIndeterminate = model(false);
    progressValue = model(0);
    progressMax = model(0);
    progressBuffer = model(0);
    leadingSlot = this.slotDirective('leading');
    trailingSlot = this.slotDirective('trailing');
    supportingTextSlot = this.slotDirective('supporting-text');
    button = viewChild('button');
    _dropdownField = inject(DropdownComponent, {
        optional: true,
    });
    interactive = computed(() => !!this.type() || !!this.href() || !!this._dropdownField);
    constructor() {
        super();
        this.setSlots([AvatarComponent, IconComponent], (x) => (x.hostElement.slot = 'leading'));
        this.setSlots(CheckComponent, (x) => (x.hostElement.slot = 'trailing'));
    }
    onClick() {
        if (this._dropdownField) {
            this._dropdownField.value.set(this.value());
        }
        this.hostElement.dispatchEvent(new Event('close-popover', { bubbles: true }));
        if (this.split() || (!this.type() && !this.href())) {
            return;
        }
        const allSlottedComponents = [
            ...(this.leadingSlot()?.componentsOf(AvatarComponent) || []),
            ...(this.trailingSlot()?.componentsOf(ButtonComponent, CheckComponent) || []),
        ];
        for (const component of allSlottedComponents) {
            dispatchActivationClick(component.hostElement);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ListItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: ListItemComponent, isStandalone: true, selector: "md-list-item", inputs: { dragging: { classPropertyName: "dragging", publicName: "dragging", isSignal: true, isRequired: false, transformFunction: null }, top: { classPropertyName: "top", publicName: "top", isSignal: true, isRequired: false, transformFunction: null }, large: { classPropertyName: "large", publicName: "large", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null }, split: { classPropertyName: "split", publicName: "split", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, progressIndeterminate: { classPropertyName: "progressIndeterminate", publicName: "progressIndeterminate", isSignal: true, isRequired: false, transformFunction: null }, progressValue: { classPropertyName: "progressValue", publicName: "progressValue", isSignal: true, isRequired: false, transformFunction: null }, progressMax: { classPropertyName: "progressMax", publicName: "progressMax", isSignal: true, isRequired: false, transformFunction: null }, progressBuffer: { classPropertyName: "progressBuffer", publicName: "progressBuffer", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { dragging: "draggingChange", top: "topChange", large: "largeChange", selected: "selectedChange", split: "splitChange", disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", progressIndeterminate: "progressIndeterminateChange", progressValue: "progressValueChange", progressMax: "progressMaxChange", progressBuffer: "progressBufferChange" }, host: { listeners: { "click": "onClick()" }, properties: { "attr.leading": "leadingSlot()?.any() || null", "attr.trailing": "trailingSlot()?.any() || null", "attr.supportingText": "supportingTextSlot()?.any() || null", "attr.top": "top() || null", "attr.large": "large() || null", "attr.selected": "selected() || null", "attr.disabled": "disabled() || null", "attr.split": "split()", "attr.busy": "progressIndeterminate() || !!progressValue() || null", "attr.interactive": "interactive() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: ForwardFocusDirective }], ngImport: i0, template: "<ng-template #content>\n  <div part=\"leading\" class=\"leading\">\n    <slot name=\"leading\"></slot>\n  </div>\n  <div part=\"content\" class=\"content\">\n    <slot></slot>\n    <span part=\"supporting-text\" class=\"supporting-text\">\n      <slot #supportingTextSlot name=\"supporting-text\"></slot>\n    </span>\n  </div>\n  @if (!split()) {\n  <div part=\"trailing\" class=\"trailing\">\n    <slot name=\"trailing\"></slot>\n  </div>\n  }\n</ng-template>\n\n<div class=\"body\">\n  <md-elevation part=\"elevation\" [target]=\"this\" [hoverable]=\"false\" [interactive]=\"false\" [dragging]=\"dragging()\" />\n  @if (interactive()) {\n  <md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n  <md-ripple part=\"ripple\" [target]=\"button()\" />\n  @if (href()) {\n  <a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n    [tabIndex]=\"disabled() ? -1 : 0\">\n    <md-touch-area />\n    <ng-container *ngTemplateOutlet=\"content\" />\n  </a>\n  } @else {\n  <button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n    [attr.value]=\"value() ?? null\">\n    <md-touch-area />\n    <ng-container *ngTemplateOutlet=\"content\" />\n  </button>\n  }\n  } @else {\n  <ng-container *ngTemplateOutlet=\"content\" />\n  }\n</div>\n\n@if (split()) {\n<div part=\"trailing\" class=\"trailing\">\n  <md-divider part=\"divider\" [vertical]=\"true\" />\n  <slot name=\"trailing\"></slot>\n</div>\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<md-progress-indicator part=\"progress-indicator\" variant=\"linear\" [value]=\"progressValue()\" [max]=\"progressMax()\"\n  [indeterminate]=\"progressIndeterminate()\" [buffer]=\"progressBuffer()\" />\n}", styles: [":host{--_color: currentColor;color:var(--md-sys-color-surface-on);display:inline-flex;min-height:56px;gap:16px;width:100%;position:relative;transition-property:color,background-color,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .body{position:relative;display:inline-flex;padding-inline:16px;align-items:center;gap:16px;width:100%}:host img{max-width:56px;max-height:56px}:host .content{display:inline-flex;flex-direction:column;gap:4px;padding-top:8px;padding-bottom:8px;font-size:var(--md-sys-typescale-body-large-size);font-weight:var(--md-sys-typescale-body-large-weight);font-family:var(--md-sys-typescale-body-large-font)}:host .supporting-text{font-size:var(--md-sys-typescale-body-medium-size);font-weight:var(--md-sys-typescale-body-medium-weight);font-family:var(--md-sys-typescale-body-medium-font)}:host .leading,:host .supporting-text,:host .trailing{display:none;color:var(--md-sys-color-surface-variant-on)}:host .trailing{gap:16px;align-items:center;margin-inline-start:auto}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);align-items:inherit;text-align:start;width:100%}:host ::slotted(md-icon){--md-comp-icon-size: 24}:host md-divider{align-self:stretch;color:var(--md-sys-color-outline-variant)}:host md-progress-indicator{position:absolute;inset:auto 0 0}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host ::slotted(img){max-width:56px;max-height:56px}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true]) ::slotted(md-icon){--md-comp-icon-filled: 1}:host([selected=true]) .leading,:host([selected=true]) .supporting-text,:host([selected=true]) .trailing{color:inherit}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([split=false]) ::slotted(md-avatar),:host([split=false]) ::slotted(md-button),:host([split=false]) ::slotted(md-check){pointer-events:none}:host([split=true]) .trailing{margin-inline-end:16px}:host([supportingText=true]) .supporting-text{display:inline-flex}:host([leading=true]) .leading{display:inline-flex}:host([trailing=true]) .trailing{display:inline-flex}:host([body=true]) .body{display:inline-flex}:host([top=true]) .body,:host([top=true]) .leading,:host([top=true]) .trailing{align-items:flex-start}:host([top=true]) .leading,:host([top=true]) .trailing,:host([top=true]) .content{margin-top:8px}:host([large=true]) .body{padding-inline-start:0;padding-top:12px;padding-bottom:12px}:host([large=true]) ::slotted(img){max-height:64px;max-width:revert}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}:host([disabled=true]) .leading,:host([disabled=true]) .supporting-text,:host([disabled=true]) .trailing{color:inherit}\n"], dependencies: [{ kind: "component", type: ProgressIndicatorComponent, selector: "md-progress-indicator", inputs: ["variant", "value", "max", "indeterminate", "fourColor", "size", "width", "buffer", "circleSize"], outputs: ["variantChange", "valueChange", "maxChange", "indeterminateChange", "fourColorChange", "sizeChange", "widthChange", "bufferChange", "circleSizeChange"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }, { kind: "component", type: DividerComponent, selector: "md-divider", inputs: ["vertical"], outputs: ["verticalChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: ListItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-list-item', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        ProgressIndicatorComponent,
                        TouchAreaComponent,
                        RippleComponent,
                        FocusRingComponent,
                        ElevationComponent,
                        CommonModule,
                        SlotDirective,
                        DividerComponent,
                    ], hostDirectives: [ForwardFocusDirective], host: {
                        '[attr.leading]': `leadingSlot()?.any() || null`,
                        '[attr.trailing]': `trailingSlot()?.any() || null`,
                        '[attr.supportingText]': `supportingTextSlot()?.any() || null`,
                        '[attr.top]': 'top() || null',
                        '[attr.large]': 'large() || null',
                        '[attr.selected]': 'selected() || null',
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.split]': 'split()',
                        '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
                        '[attr.interactive]': 'interactive() || null',
                    }, template: "<ng-template #content>\n  <div part=\"leading\" class=\"leading\">\n    <slot name=\"leading\"></slot>\n  </div>\n  <div part=\"content\" class=\"content\">\n    <slot></slot>\n    <span part=\"supporting-text\" class=\"supporting-text\">\n      <slot #supportingTextSlot name=\"supporting-text\"></slot>\n    </span>\n  </div>\n  @if (!split()) {\n  <div part=\"trailing\" class=\"trailing\">\n    <slot name=\"trailing\"></slot>\n  </div>\n  }\n</ng-template>\n\n<div class=\"body\">\n  <md-elevation part=\"elevation\" [target]=\"this\" [hoverable]=\"false\" [interactive]=\"false\" [dragging]=\"dragging()\" />\n  @if (interactive()) {\n  <md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n  <md-ripple part=\"ripple\" [target]=\"button()\" />\n  @if (href()) {\n  <a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n    [tabIndex]=\"disabled() ? -1 : 0\">\n    <md-touch-area />\n    <ng-container *ngTemplateOutlet=\"content\" />\n  </a>\n  } @else {\n  <button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n    [attr.value]=\"value() ?? null\">\n    <md-touch-area />\n    <ng-container *ngTemplateOutlet=\"content\" />\n  </button>\n  }\n  } @else {\n  <ng-container *ngTemplateOutlet=\"content\" />\n  }\n</div>\n\n@if (split()) {\n<div part=\"trailing\" class=\"trailing\">\n  <md-divider part=\"divider\" [vertical]=\"true\" />\n  <slot name=\"trailing\"></slot>\n</div>\n}\n\n@if (!disabled() && (progressValue() || progressIndeterminate())) {\n<md-progress-indicator part=\"progress-indicator\" variant=\"linear\" [value]=\"progressValue()\" [max]=\"progressMax()\"\n  [indeterminate]=\"progressIndeterminate()\" [buffer]=\"progressBuffer()\" />\n}", styles: [":host{--_color: currentColor;color:var(--md-sys-color-surface-on);display:inline-flex;min-height:56px;gap:16px;width:100%;position:relative;transition-property:color,background-color,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .body{position:relative;display:inline-flex;padding-inline:16px;align-items:center;gap:16px;width:100%}:host img{max-width:56px;max-height:56px}:host .content{display:inline-flex;flex-direction:column;gap:4px;padding-top:8px;padding-bottom:8px;font-size:var(--md-sys-typescale-body-large-size);font-weight:var(--md-sys-typescale-body-large-weight);font-family:var(--md-sys-typescale-body-large-font)}:host .supporting-text{font-size:var(--md-sys-typescale-body-medium-size);font-weight:var(--md-sys-typescale-body-medium-weight);font-family:var(--md-sys-typescale-body-medium-font)}:host .leading,:host .supporting-text,:host .trailing{display:none;color:var(--md-sys-color-surface-variant-on)}:host .trailing{gap:16px;align-items:center;margin-inline-start:auto}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);align-items:inherit;text-align:start;width:100%}:host ::slotted(md-icon){--md-comp-icon-size: 24}:host md-divider{align-self:stretch;color:var(--md-sys-color-outline-variant)}:host md-progress-indicator{position:absolute;inset:auto 0 0}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host ::slotted(img){max-width:56px;max-height:56px}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true]) ::slotted(md-icon){--md-comp-icon-filled: 1}:host([selected=true]) .leading,:host([selected=true]) .supporting-text,:host([selected=true]) .trailing{color:inherit}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([split=false]) ::slotted(md-avatar),:host([split=false]) ::slotted(md-button),:host([split=false]) ::slotted(md-check){pointer-events:none}:host([split=true]) .trailing{margin-inline-end:16px}:host([supportingText=true]) .supporting-text{display:inline-flex}:host([leading=true]) .leading{display:inline-flex}:host([trailing=true]) .trailing{display:inline-flex}:host([body=true]) .body{display:inline-flex}:host([top=true]) .body,:host([top=true]) .leading,:host([top=true]) .trailing{align-items:flex-start}:host([top=true]) .leading,:host([top=true]) .trailing,:host([top=true]) .content{margin-top:8px}:host([large=true]) .body{padding-inline-start:0;padding-top:12px;padding-bottom:12px}:host([large=true]) ::slotted(img){max-height:64px;max-width:revert}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}:host([disabled=true]) .leading,:host([disabled=true]) .supporting-text,:host([disabled=true]) .trailing{color:inherit}\n"] }]
        }], ctorParameters: () => [], propDecorators: { onClick: [{
                type: HostListener,
                args: ['click']
            }] } });

class DialogComponent extends MaterialDesignComponent {
    returnValue = model();
    open = model(false);
    cancel = output();
    _dialog = viewChild('dialog');
    iconSlot = this.slotDirective('icon');
    headlineSlot = this.slotDirective('headline');
    supportingtext = this.slotDirective('supporting-text');
    actionSlot = this.slotDirective('action');
    bodySlot = this.slotDirective();
    _document = inject(DOCUMENT);
    _openClose$ = openClose(this.open, 'long3', 'long2');
    state = toSignal(this._openClose$, {
        initialValue: 'closed',
    });
    stateChange = output();
    constructor() {
        super();
        toObservable(this.state)
            .pipe(tap((x) => this.stateChange.emit(x)), skip(1), tap((state) => {
            if (state === 'opening') {
                this._document.body.style.overflow = 'hidden';
                if (isPlatformBrowser(this.platformId)) {
                    this._dialog()?.nativeElement.showModal();
                }
            }
            if (state === 'closed') {
                this._document.body.style.overflow = '';
                if (isPlatformBrowser(this.platformId)) {
                    this._dialog()?.nativeElement.close();
                }
            }
        }))
            .subscribe();
        this.setSlots(ButtonComponent, (component) => {
            component.hostElement.slot = 'action';
            component.variant.set('text');
        });
    }
    _nextClickIsFromContent = false;
    _escapePressedWithoutCancel = false;
    onDialogCancel(event) {
        event.preventDefault();
        this._escapePressedWithoutCancel = false;
        this.open.set(false);
    }
    onDialogClose() {
        if (!this._escapePressedWithoutCancel) {
            this.cancel.emit();
        }
        this._escapePressedWithoutCancel = false;
        this._dialog()?.nativeElement?.dispatchEvent(new Event('cancel', { cancelable: true }));
    }
    onDialogKeyDown(event) {
        if (event.key !== 'Escape') {
            return;
        }
        this._escapePressedWithoutCancel = true;
        setTimeout(() => (this._escapePressedWithoutCancel = false));
    }
    onDialogClick() {
        if (this._nextClickIsFromContent) {
            this._nextClickIsFromContent = false;
            return;
        }
        this.cancel.emit();
        this.open.set(false);
    }
    onContainerContentClick() {
        this._nextClickIsFromContent = true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DialogComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "18.2.9", type: DialogComponent, isStandalone: true, selector: "md-dialog", inputs: { returnValue: { classPropertyName: "returnValue", publicName: "returnValue", isSignal: true, isRequired: false, transformFunction: null }, open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { returnValue: "returnValueChange", open: "openChange", cancel: "cancel", stateChange: "stateChange" }, host: { properties: { "attr.icon": "iconSlot()?.any() || null", "attr.headline": "headlineSlot()?.any() || null", "attr.supportingText": "supportingtext()?.any() || null", "attr.actions": "actionSlot()?.any() || null", "attr.body": "bodySlot()?.any() || null", "attr.state": "state()" } }, viewQueries: [{ propertyName: "_dialog", first: true, predicate: ["dialog"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<div part=\"scrim\" class=\"scrim\"></div>\n<dialog part=\"dialog\" #dialog [returnValue]=\"returnValue() || null\" (cancel)=\"onDialogCancel($event)\"\n  (click)=\"onDialogClick()\" (close)=\"onDialogClose()\" (keydown)=\"onDialogKeyDown($event)\">\n  <div part=\"container\" class=\"container\">\n    <md-elevation part=\"elevation\" [level]=\"3\" />\n    <div part=\"container-content\" class=\"container-content\" (click)=\"onContainerContentClick()\">\n      <div part=\"header\" class=\"header\">\n        <div part=\"icon\" class=\"icon\">\n          <slot name=\"icon\"></slot>\n        </div>\n        <div part=\"headline\" class=\"headline\">\n          <slot name=\"headline\"></slot>\n        </div>\n        <div part=\"supporting-text\" class=\"supporting-text\">\n          <slot #supportingTextSlot name=\"supporting-text\"></slot>\n        </div>\n      </div>\n      <div class=\"scroller\">\n        <div class=\"content\">\n          <slot></slot>\n        </div>\n      </div>\n      <div part=\"actions\" #actions class=\"actions\">\n        <slot name=\"action\"></slot>\n      </div>\n    </div>\n  </div>\n</dialog>", styles: [":host{--_motion-easing: var(--md-sys-motion-easing-emphasized-decelerate);--_motion-duration: var(--md-sys-motion-duration-long-1);max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;display:contents;margin:auto;position:fixed;height:fit-content;width:fit-content}:host dialog{background:transparent;border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit;opacity:0;transform:translateY(-200px);color:var(--md-sys-color-surface-on);transition-property:opacity,transform;transition-timing-function:var(--_motion-easing);transition-duration:var(--_motion-duration)}:host dialog[open]{display:inline-flex}:host ::backdrop{background:none}:host .container{position:relative;border-radius:inherit;display:inline-flex;border-radius:var(--md-sys-shape-extra-large);flex-direction:column;background-color:var(--md-sys-color-surface-container);max-height:670px}:host .container-content{position:relative;border-radius:inherit;display:inline-flex;border-radius:var(--md-sys-shape-extra-large);flex-direction:column;gap:24px;padding:24px;transform-origin:top;overflow:hidden;height:auto;opacity:0;transition-property:opacity;transition-timing-function:var(--_motion-easing);transition-duration:var(--_motion-duration);transition-delay:.1s}:host .scrim{visibility:hidden;inset:0;position:fixed;z-index:-1;background:var(--md-sys-color-scrim);opacity:0;transition-property:opacity,visibility;transition-timing-function:var(--_motion-easing);transition-duration:var(--_motion-duration)}:host .header{display:none;flex-direction:column;width:100%;gap:16px}:host .actions{display:none;gap:8px;justify-content:flex-end}:host .scroller{display:none;overflow-y:hidden;flex-direction:column}:host .content{height:min-content;position:relative}:host .headline{font-size:var(--md-sys-typescale-headline-small-size);font-weight:var(--md-sys-typescale-headline-small-weight);font-family:var(--md-sys-typescale-headline-small-font);color:var(--md-sys-color-surface-on);display:none;flex-direction:row;align-items:flex-start;gap:16px}:host .supporting-text{display:none;font-size:var(--md-sys-typescale-body-medium-size);font-weight:var(--md-sys-typescale-body-medium-weight);font-family:var(--md-sys-typescale-body-medium-font);color:var(--md-sys-color-surface-variant-on)}:host .icon{display:none;color:var(--md-sys-color-secondary)}:host .icon ::slotted(md-icon){--md-sys-icon-size: 24}:host([state=opening]) dialog,:host([state=opened]) dialog{opacity:1;transform:translateY(0)}:host([state=opening]) .scrim,:host([state=opened]) .scrim{opacity:.32}:host([state=opening]) .container-content,:host([state=opened]) .container-content{opacity:1}:host([state=opened]) .scroller{overflow-y:auto}:host(:not([state=closed])) .scrim{visibility:visible;z-index:var(--md-sys-z-index-scrim)}:host([state=closing]){--_motion-easing: var(--md-sys-motion-easing-emphasized-accelerate);--_motion-duration: var(--md-sys-motion-duration-short-4)}:host([state=closing]) dialog{opacity:0;transform:translateY(-200px)}:host([state=closing]) .scrim{opacity:0}:host([state=closing]) .container-content{opacity:0}:host([body=true]) .scroller{display:inline-flex}:host([header=true]) .header{display:inline-flex}:host([actions=true]) .actions{margin-top:auto;display:inline-flex}:host([icon=true]) .header,:host([headline=true]) .header,:host([supportingText=true]) .header{display:inline-flex}:host([icon=true]) .icon{display:inline-flex}:host([icon=true]) .headline{flex-direction:column}:host([icon=true]) .headline,:host([icon=true]) .header{align-items:center}:host([headline=true]) .headline{display:inline-flex}:host([supportingText=true]) .supporting-text{display:inline-flex}\n"], dependencies: [{ kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-dialog', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [ElevationComponent, SlotDirective], host: {
                        '[attr.icon]': `iconSlot()?.any() || null`,
                        '[attr.headline]': `headlineSlot()?.any() || null`,
                        '[attr.supportingText]': `supportingtext()?.any() || null`,
                        '[attr.actions]': `actionSlot()?.any() || null`,
                        '[attr.body]': `bodySlot()?.any() || null`,
                        '[attr.state]': 'state()',
                    }, template: "<div part=\"scrim\" class=\"scrim\"></div>\n<dialog part=\"dialog\" #dialog [returnValue]=\"returnValue() || null\" (cancel)=\"onDialogCancel($event)\"\n  (click)=\"onDialogClick()\" (close)=\"onDialogClose()\" (keydown)=\"onDialogKeyDown($event)\">\n  <div part=\"container\" class=\"container\">\n    <md-elevation part=\"elevation\" [level]=\"3\" />\n    <div part=\"container-content\" class=\"container-content\" (click)=\"onContainerContentClick()\">\n      <div part=\"header\" class=\"header\">\n        <div part=\"icon\" class=\"icon\">\n          <slot name=\"icon\"></slot>\n        </div>\n        <div part=\"headline\" class=\"headline\">\n          <slot name=\"headline\"></slot>\n        </div>\n        <div part=\"supporting-text\" class=\"supporting-text\">\n          <slot #supportingTextSlot name=\"supporting-text\"></slot>\n        </div>\n      </div>\n      <div class=\"scroller\">\n        <div class=\"content\">\n          <slot></slot>\n        </div>\n      </div>\n      <div part=\"actions\" #actions class=\"actions\">\n        <slot name=\"action\"></slot>\n      </div>\n    </div>\n  </div>\n</dialog>", styles: [":host{--_motion-easing: var(--md-sys-motion-easing-emphasized-decelerate);--_motion-duration: var(--md-sys-motion-duration-long-1);max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;display:contents;margin:auto;position:fixed;height:fit-content;width:fit-content}:host dialog{background:transparent;border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit;opacity:0;transform:translateY(-200px);color:var(--md-sys-color-surface-on);transition-property:opacity,transform;transition-timing-function:var(--_motion-easing);transition-duration:var(--_motion-duration)}:host dialog[open]{display:inline-flex}:host ::backdrop{background:none}:host .container{position:relative;border-radius:inherit;display:inline-flex;border-radius:var(--md-sys-shape-extra-large);flex-direction:column;background-color:var(--md-sys-color-surface-container);max-height:670px}:host .container-content{position:relative;border-radius:inherit;display:inline-flex;border-radius:var(--md-sys-shape-extra-large);flex-direction:column;gap:24px;padding:24px;transform-origin:top;overflow:hidden;height:auto;opacity:0;transition-property:opacity;transition-timing-function:var(--_motion-easing);transition-duration:var(--_motion-duration);transition-delay:.1s}:host .scrim{visibility:hidden;inset:0;position:fixed;z-index:-1;background:var(--md-sys-color-scrim);opacity:0;transition-property:opacity,visibility;transition-timing-function:var(--_motion-easing);transition-duration:var(--_motion-duration)}:host .header{display:none;flex-direction:column;width:100%;gap:16px}:host .actions{display:none;gap:8px;justify-content:flex-end}:host .scroller{display:none;overflow-y:hidden;flex-direction:column}:host .content{height:min-content;position:relative}:host .headline{font-size:var(--md-sys-typescale-headline-small-size);font-weight:var(--md-sys-typescale-headline-small-weight);font-family:var(--md-sys-typescale-headline-small-font);color:var(--md-sys-color-surface-on);display:none;flex-direction:row;align-items:flex-start;gap:16px}:host .supporting-text{display:none;font-size:var(--md-sys-typescale-body-medium-size);font-weight:var(--md-sys-typescale-body-medium-weight);font-family:var(--md-sys-typescale-body-medium-font);color:var(--md-sys-color-surface-variant-on)}:host .icon{display:none;color:var(--md-sys-color-secondary)}:host .icon ::slotted(md-icon){--md-sys-icon-size: 24}:host([state=opening]) dialog,:host([state=opened]) dialog{opacity:1;transform:translateY(0)}:host([state=opening]) .scrim,:host([state=opened]) .scrim{opacity:.32}:host([state=opening]) .container-content,:host([state=opened]) .container-content{opacity:1}:host([state=opened]) .scroller{overflow-y:auto}:host(:not([state=closed])) .scrim{visibility:visible;z-index:var(--md-sys-z-index-scrim)}:host([state=closing]){--_motion-easing: var(--md-sys-motion-easing-emphasized-accelerate);--_motion-duration: var(--md-sys-motion-duration-short-4)}:host([state=closing]) dialog{opacity:0;transform:translateY(-200px)}:host([state=closing]) .scrim{opacity:0}:host([state=closing]) .container-content{opacity:0}:host([body=true]) .scroller{display:inline-flex}:host([header=true]) .header{display:inline-flex}:host([actions=true]) .actions{margin-top:auto;display:inline-flex}:host([icon=true]) .header,:host([headline=true]) .header,:host([supportingText=true]) .header{display:inline-flex}:host([icon=true]) .icon{display:inline-flex}:host([icon=true]) .headline{flex-direction:column}:host([icon=true]) .headline,:host([icon=true]) .header{align-items:center}:host([headline=true]) .headline{display:inline-flex}:host([supportingText=true]) .supporting-text{display:inline-flex}\n"] }]
        }], ctorParameters: () => [] });

class TooltipComponent extends MaterialDesignComponent {
    variant = model('plain');
    placement = model('bottom');
    trigger = model('hover');
    offset = model(8);
    manualClose = model(false);
    popover = viewChild('popover');
    attachableDirective = inject(AttachableDirective);
    modal = model(false);
    state = computed(() => this.popover()?.state() ?? 'closed');
    headlineSlot = this.slotDirective('headline');
    actionSlot = this.slotDirective('action');
    scrimAnimation = [
        new Animator('opening', {
            keyframes: { opacity: 0.32 },
            options: { easing: 'standardDecelerate' },
        }),
        new Animator('closing', {
            keyframes: { opacity: 0 },
            options: { duration: 'short3', easing: 'standardAccelerate' },
        }),
    ];
    constructor() {
        super();
        attach('pointerenter', 'pointerleave');
        effect(() => {
            const state = this.state();
            const modal = this.modal();
            const target = this.popover()?.attachableDirective?.targetElement();
            if (!target) {
                return;
            }
            if (modal) {
                if (state === 'opening') {
                    target.style.zIndex = 'var(--md-sys-z-index-popover)';
                }
                else if (state === 'closed') {
                    target.style.zIndex = '';
                }
            }
        });
        this.setSlots(ButtonComponent, (x) => {
            x.hostElement.slot = 'action';
            x.variant.set('text');
        });
    }
    openTooltip() {
        this.popover()?.open?.set(true);
    }
    closeTooltip() {
        this.popover()?.open?.set(false);
    }
    onActionClick() {
        this.closeTooltip();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TooltipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: TooltipComponent, isStandalone: true, selector: "md-tooltip", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, placement: { classPropertyName: "placement", publicName: "placement", isSignal: true, isRequired: false, transformFunction: null }, trigger: { classPropertyName: "trigger", publicName: "trigger", isSignal: true, isRequired: false, transformFunction: null }, offset: { classPropertyName: "offset", publicName: "offset", isSignal: true, isRequired: false, transformFunction: null }, manualClose: { classPropertyName: "manualClose", publicName: "manualClose", isSignal: true, isRequired: false, transformFunction: null }, modal: { classPropertyName: "modal", publicName: "modal", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { variant: "variantChange", placement: "placementChange", trigger: "triggerChange", offset: "offsetChange", manualClose: "manualCloseChange", modal: "modalChange" }, host: { properties: { "attr.variant": "variant()", "attr.headline": "headlineSlot()?.any() || null", "attr.actions": "actionSlot()?.any() || null", "attr.state": "state()" } }, viewQueries: [{ propertyName: "popover", first: true, predicate: ["popover"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: AttachableDirective, inputs: ["target", "target"] }], ngImport: i0, template: "@if (modal()) {\n<div mdAnimation [mdAnimationAnimators]=\"scrimAnimation\" [mdAnimationState]=\"state()\" part=\"scrim\" class=\"scrim\"></div>\n}\n<md-popover #popover part=\"popover\" [target]=\"attachableDirective.target()\" [offset]=\"offset()\"\n  [placement]=\"placement()\" [trigger]=\"trigger()\" [manualClose]=\"manualClose() || !!actionSlot()?.any()\" [delay]=\"500\">\n  @if (variant() === 'plain') {\n  <slot></slot>\n  } @else {\n  <span part=\"headline\" class=\"headline\">\n    <slot name=\"headline\"></slot>\n  </span>\n  <slot></slot>\n  <span part=\"actions\" class=\"actions\">\n    <slot name=\"action\" (click)=\"onActionClick()\"></slot>\n  </span>\n  }\n</md-popover>", styles: [":host{position:absolute;display:inline-flex;flex-direction:column}:host md-popover{max-width:280px;font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host md-popover::part(body){padding:8px}:host ::slotted(md-divider){border-color:var(--md-sys-color-outline-variant)}:host .scrim{display:none;inset:0;opacity:0;position:fixed;z-index:var(--md-sys-z-index-scrim);background:var(--md-sys-color-scrim);transition-property:opacity}:host(:not([state=closed])) .scrim{display:block}:host([variant=plain]){color:var(--md-sys-color-surface-inverse-on)}:host([variant=plain]) md-popover::part(container){background-color:var(--md-sys-color-surface-inverse)}:host([variant=rich]){color:var(--md-sys-color-surface-variant-on)}:host([variant=rich]) md-popover::part(body){padding-top:12px;padding-bottom:8px;padding-inline:16px}:host([variant=rich]) .headline{display:none;margin-bottom:4px;color:var(--md-sys-color-surface-on);font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host([variant=rich]) .actions{margin-inline-start:-12px;display:none;margin-top:12px;justify-content:flex-start;gap:8px}:host([headline=true]) .headline{display:inline-flex}:host([actions=true]) .actions{display:inline-flex}\n"], dependencies: [{ kind: "component", type: PopoverComponent, selector: "md-popover", inputs: ["trigger", "flip", "shift", "offset", "delay", "placement", "strategy", "native", "open", "manualClose", "useContainerWidth"], outputs: ["triggerChange", "flipChange", "shiftChange", "offsetChange", "delayChange", "placementChange", "strategyChange", "nativeChange", "openChange", "manualCloseChange", "useContainerWidthChange", "stateChange"] }, { kind: "directive", type: AnimationDirective, selector: "[mdAnimation]", inputs: ["mdAnimation", "mdAnimationAnimators", "mdAnimationState"], outputs: ["mdAnimationChange", "mdAnimationAnimatorsChange", "mdAnimationStateChange"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-tooltip', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [PopoverComponent, AnimationDirective, SlotDirective], hostDirectives: [
                        {
                            directive: AttachableDirective,
                            inputs: ['target'],
                        },
                    ], host: {
                        '[attr.variant]': 'variant()',
                        '[attr.headline]': `headlineSlot()?.any() || null`,
                        '[attr.actions]': `actionSlot()?.any() || null`,
                        '[attr.state]': 'state()',
                    }, template: "@if (modal()) {\n<div mdAnimation [mdAnimationAnimators]=\"scrimAnimation\" [mdAnimationState]=\"state()\" part=\"scrim\" class=\"scrim\"></div>\n}\n<md-popover #popover part=\"popover\" [target]=\"attachableDirective.target()\" [offset]=\"offset()\"\n  [placement]=\"placement()\" [trigger]=\"trigger()\" [manualClose]=\"manualClose() || !!actionSlot()?.any()\" [delay]=\"500\">\n  @if (variant() === 'plain') {\n  <slot></slot>\n  } @else {\n  <span part=\"headline\" class=\"headline\">\n    <slot name=\"headline\"></slot>\n  </span>\n  <slot></slot>\n  <span part=\"actions\" class=\"actions\">\n    <slot name=\"action\" (click)=\"onActionClick()\"></slot>\n  </span>\n  }\n</md-popover>", styles: [":host{position:absolute;display:inline-flex;flex-direction:column}:host md-popover{max-width:280px;font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host md-popover::part(body){padding:8px}:host ::slotted(md-divider){border-color:var(--md-sys-color-outline-variant)}:host .scrim{display:none;inset:0;opacity:0;position:fixed;z-index:var(--md-sys-z-index-scrim);background:var(--md-sys-color-scrim);transition-property:opacity}:host(:not([state=closed])) .scrim{display:block}:host([variant=plain]){color:var(--md-sys-color-surface-inverse-on)}:host([variant=plain]) md-popover::part(container){background-color:var(--md-sys-color-surface-inverse)}:host([variant=rich]){color:var(--md-sys-color-surface-variant-on)}:host([variant=rich]) md-popover::part(body){padding-top:12px;padding-bottom:8px;padding-inline:16px}:host([variant=rich]) .headline{display:none;margin-bottom:4px;color:var(--md-sys-color-surface-on);font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host([variant=rich]) .actions{margin-inline-start:-12px;display:none;margin-top:12px;justify-content:flex-start;gap:8px}:host([headline=true]) .headline{display:inline-flex}:host([actions=true]) .actions{display:inline-flex}\n"] }]
        }], ctorParameters: () => [] });

class DateFormatPipe {
    transform(value, locale, format) {
        return dateFormat(locale, value, format);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DateFormatPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.9", ngImport: i0, type: DateFormatPipe, isStandalone: true, name: "dateFormat" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DateFormatPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'dateFormat',
                    pure: true,
                    standalone: true,
                }]
        }] });
function dateFormat(locale, value, format) {
    if (!value) {
        return '';
    }
    return value.toLocaleDateString(locale, getDateTimeFormatOptions(format));
}

class DatePickerComponent extends MaterialDesignValueAccessorComponent {
    range = model(false);
    variant = model('dropdown');
    fieldVariant = model('filled');
    prefix = model();
    suffix = model();
    label = model();
    field = viewChild('field');
    dialog = viewChild('dialog');
    populated = computed(() => {
        if (this.field()?.popover()?.state() === 'closing' && !this.value()) {
            return false;
        }
        return (!!this.value() ||
            this.field()?.open() ||
            this.field()?.popover()?.state() === 'opening');
    });
    _today = new Date();
    value = model();
    selectionValue = model(this.value());
    canOkay = computed(() => {
        if (this.range() &&
            this.fromSelectedValueAsDate &&
            !this.toSelectedValueAsDate) {
            return false;
        }
        return true;
    });
    get fromValueAsDate() {
        if (this.range()) {
            return this.value()?.[0] ? new Date(this.value()[0]) : undefined;
        }
        return this.value() ? new Date(this.value()) : undefined;
    }
    set fromValueAsDate(value) {
        if (this.range()) {
            this.value.update((x) => [value?.toISOString(), x?.[1]]);
        }
        else {
            this.value.set(value?.toISOString());
        }
    }
    get toValueAsDate() {
        if (!this.range()) {
            return undefined;
        }
        return this.value()?.[1] ? new Date(this.value()[1]) : undefined;
    }
    set toValueAsDate(value) {
        if (!this.range()) {
            return;
        }
        this.value.update((x) => [x?.[0], value?.toISOString()]);
    }
    get fromSelectedValueAsDate() {
        if (this.range()) {
            return this.selectionValue()?.[0]
                ? new Date(this.selectionValue()[0])
                : undefined;
        }
        return this.selectionValue()
            ? new Date(this.selectionValue())
            : undefined;
    }
    set fromSelectedValueAsDate(value) {
        if (this.range()) {
            this.selectionValue.update((x) => [value?.toISOString(), x?.[1]]);
        }
        else {
            this.selectionValue.set(value?.toISOString());
        }
    }
    get toSelectedValueAsDate() {
        if (!this.range()) {
            return undefined;
        }
        return this.selectionValue()?.[1]
            ? new Date(this.selectionValue()[1])
            : undefined;
    }
    set toSelectedValueAsDate(value) {
        if (!this.range()) {
            return;
        }
        this.selectionValue.update((x) => [x?.[0], value?.toISOString()]);
    }
    locale = model('en');
    monthItems = viewChildren('monthItem');
    monthView = model(this._today.getMonth());
    monthViewText = computed(() => {
        const month = this.monthView();
        const date = this.fromSelectedValueAsDate ?? new Date(this._today);
        date.setMonth(month);
        const dateString = date.toLocaleDateString(this.locale(), {
            month: 'short',
        });
        return dateString;
    });
    months = computed(() => {
        const formatter = new Intl.DateTimeFormat(this.locale(), { month: 'long' });
        return Array.from({ length: 12 }, (_, value) => ({
            text: formatter.format(new Date(0, value)),
            value,
        }));
    });
    monthViewOpen = signal(false);
    monthViewState = toSignal(openClose(this.monthViewOpen, 'short4'), {
        initialValue: 'closed',
    });
    yearItems = viewChildren('yearItem');
    yearView = model(this._today.getFullYear());
    yearViewText = computed(() => {
        const year = this.yearView();
        const date = this.fromSelectedValueAsDate ?? new Date(this._today);
        date.setFullYear(year);
        const dateString = date.toLocaleDateString(this.locale(), {
            year: 'numeric',
        });
        return dateString;
    });
    get years() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 50;
        const endYear = currentYear + 20;
        return Array.from({ length: endYear - startYear + 1 }, (_, value) => startYear + value);
    }
    yearViewOpen = signal(false);
    yearViewState = toSignal(openClose(this.yearViewOpen, 'short4'), {
        initialValue: 'closed',
    });
    dayNames = computed(() => {
        const formatter = new Intl.DateTimeFormat(this.locale(), {
            weekday: 'narrow',
        });
        return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(1970, 0, i + 4)));
    });
    days = computed(() => {
        const month = this.monthView();
        const year = this.yearView();
        const date = new Date(year, month);
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1 - firstDayOfMonth);
        const calendarDays = [];
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const day = currentDate.getDate();
            let type = 'current';
            if (currentDate.getMonth() < date.getMonth()) {
                type = 'previous';
            }
            else if (currentDate.getMonth() > date.getMonth()) {
                type = 'next';
            }
            calendarDays.push({ day, type, date: currentDate });
        }
        return calendarDays;
    });
    fromSelection = true;
    constructor() {
        super();
        effect(() => {
            if (this.variant() === 'embedded') {
                this.value.set(this.selectionValue());
            }
        }, {
            allowSignalWrites: true,
        });
    }
    openMonthView() {
        this.yearViewOpen.set(false);
        this.monthViewOpen.set(!this.monthViewOpen());
        const selectedItem = this.monthItems().find((x) => x.selected());
        selectedItem?.hostElement.scrollIntoView({
            block: 'nearest',
        });
    }
    monthItemClick(month) {
        this.monthView.set(month);
        this.monthViewOpen.set(false);
    }
    openYearView() {
        this.monthViewOpen.set(false);
        this.yearViewOpen.set(!this.yearViewOpen());
        const selectedItem = this.yearItems().find((x) => x.variant() === 'filled');
        selectedItem?.hostElement.scrollIntoView({
            block: 'nearest',
        });
    }
    yearItemClick(year) {
        this.yearView.set(year);
        this.yearViewOpen.set(false);
    }
    todayClick() {
        this.monthView.set(this._today.getMonth());
        this.yearView.set(this._today.getFullYear());
    }
    dayClick(day) {
        if (this.fromSelection) {
            this.fromSelectedValueAsDate = day.date;
            this.toSelectedValueAsDate = undefined;
        }
        else {
            if (this.fromSelectedValueAsDate &&
                day.date < this.fromSelectedValueAsDate) {
                this.fromSelection = !this.fromSelection;
                this.dayClick(day);
                return;
            }
            this.toSelectedValueAsDate = day.date;
        }
        this.monthView.set(day.date.getMonth());
        this.yearView.set(day.date.getFullYear());
        if (this.range()) {
            this.fromSelection = !this.fromSelection;
        }
    }
    isDateEqual(dateA, dateB) {
        return (dateA?.getFullYear() === dateB?.getFullYear() &&
            dateA?.getMonth() === dateB?.getMonth() &&
            dateA?.getDate() === dateB?.getDate());
    }
    isToday(date) {
        return (this._today.getFullYear() === date.getFullYear() &&
            this._today.getMonth() === date.getMonth() &&
            this._today.getDate() === date.getDate());
    }
    isDaySelected(date) {
        return (this.isDateEqual(this.fromSelectedValueAsDate, date) ||
            this.isDateEqual(this.toSelectedValueAsDate, date));
    }
    isInRange(date) {
        if (!this.fromSelectedValueAsDate || !this.toSelectedValueAsDate) {
            return false;
        }
        return (date >= this.fromSelectedValueAsDate && date <= this.toSelectedValueAsDate);
    }
    clearClick() {
        this.fromSelection = true;
        this.value.set(undefined);
        this.selectionValue.set(undefined);
    }
    okayClick() {
        this.fromSelection = true;
        this.value.set(this.selectionValue());
        this.monthView.set(this.fromSelectedValueAsDate?.getMonth() ?? this._today.getMonth());
        this.yearView.set(this.fromSelectedValueAsDate?.getFullYear() ?? this._today.getFullYear());
        if (this.variant() === 'dropdown') {
            this.field()?.open.set(false);
        }
        if (this.variant() === 'dialog') {
            this.dialog()?.open.set(false);
        }
        this.monthViewOpen.set(false);
        this.yearViewOpen.set(false);
    }
    cancelClick() {
        this.fromSelection = true;
        this.selectionValue.set(this.value());
        this.monthView.set(this.fromSelectedValueAsDate?.getMonth() ?? this._today.getMonth());
        this.yearView.set(this.fromSelectedValueAsDate?.getFullYear() ?? this._today.getFullYear());
        if (this.variant() === 'dropdown') {
            this.field()?.open.set(false);
        }
        if (this.variant() === 'dialog') {
            this.dialog()?.open.set(false);
        }
        this.monthViewOpen.set(false);
        this.yearViewOpen.set(false);
    }
    bodyClick() {
        if (this.variant() !== 'dialog') {
            return;
        }
        this.dialog()?.open.set(true);
    }
    popoverStateChange(state) {
        if (state === 'closed') {
            this.cancelClick();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DatePickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: DatePickerComponent, isStandalone: true, selector: "md-date-picker", inputs: { range: { classPropertyName: "range", publicName: "range", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, fieldVariant: { classPropertyName: "fieldVariant", publicName: "fieldVariant", isSignal: true, isRequired: false, transformFunction: null }, prefix: { classPropertyName: "prefix", publicName: "prefix", isSignal: true, isRequired: false, transformFunction: null }, suffix: { classPropertyName: "suffix", publicName: "suffix", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, selectionValue: { classPropertyName: "selectionValue", publicName: "selectionValue", isSignal: true, isRequired: false, transformFunction: null }, locale: { classPropertyName: "locale", publicName: "locale", isSignal: true, isRequired: false, transformFunction: null }, monthView: { classPropertyName: "monthView", publicName: "monthView", isSignal: true, isRequired: false, transformFunction: null }, yearView: { classPropertyName: "yearView", publicName: "yearView", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { range: "rangeChange", variant: "variantChange", fieldVariant: "fieldVariantChange", prefix: "prefixChange", suffix: "suffixChange", label: "labelChange", value: "valueChange", selectionValue: "selectionValueChange", locale: "localeChange", monthView: "monthViewChange", yearView: "yearViewChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                multi: true,
                useExisting: forwardRef(() => DatePickerComponent),
            },
        ], viewQueries: [{ propertyName: "field", first: true, predicate: ["field"], descendants: true, isSignal: true }, { propertyName: "dialog", first: true, predicate: ["dialog"], descendants: true, isSignal: true }, { propertyName: "monthItems", predicate: ["monthItem"], descendants: true, isSignal: true }, { propertyName: "yearItems", predicate: ["yearItem"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #actions>\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" class=\"clear\" (click)=\"clearClick()\"\n    i18n>Clear</md-button>\n  @if (variant() !== 'embedded') {\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" (click)=\"okayClick()\"\n    [disabled]=\"!canOkay()\" i18n>Okay</md-button>\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" (click)=\"cancelClick()\"\n    i18n>Cancel</md-button>\n  }\n</ng-template>\n\n<ng-template #contents>\n  <div class=\"container\">\n    <div class=\"header\">\n      <div class=\"months\">\n        <md-button variant=\"plain\" class=\"navigate\" (click)=\"monthView.set(monthView() - 1)\">\n          <md-icon>chevron_left</md-icon>\n        </md-button>\n        <md-button #monthViewButton variant=\"plain\" (click)=\"openMonthView()\">\n          {{ monthViewText() }}\n          <md-icon class=\"month-icon\" slot=\"trailing\">arrow_drop_down</md-icon>\n        </md-button>\n        <md-button variant=\"plain\" class=\"navigate\" (click)=\"monthView.set(monthView() + 1)\">\n          <md-icon>chevron_right</md-icon>\n        </md-button>\n      </div>\n      @if (variant() === 'dropdown') {\n      <md-icon-button #today (click)=\"todayClick()\">today</md-icon-button>\n      <md-tooltip [target]=\"today\" i18n>Today</md-tooltip>\n      } @else {\n      <md-button variant=\"text\" (click)=\"todayClick()\" i18n>Today</md-button>\n      }\n      <div class=\"years\">\n        <md-button variant=\"plain\" class=\"navigate\" (click)=\"yearView.set(yearView() - 1)\">\n          <md-icon>chevron_left</md-icon>\n        </md-button>\n        <md-button variant=\"plain\" (click)=\"openYearView()\">\n          {{ yearViewText() }}\n          <md-icon slot=\"trailing\">arrow_drop_down</md-icon>\n        </md-button>\n        <md-button variant=\"plain\" class=\"navigate\" (click)=\"yearView.set(yearView() + 1)\">\n          <md-icon>chevron_right</md-icon>\n        </md-button>\n      </div>\n    </div>\n    <div class=\"body\">\n      <div class=\"view\" [ngClass]=\"monthViewState()\">\n        @for (month of months(); track $index) {\n        <md-list-item #monthItem [selected]=\"monthView() === month.value\" (click)=\"monthItemClick(month.value)\"\n          type=\"button\">\n          {{ month.text }}\n        </md-list-item>\n        }\n      </div>\n      <div class=\"view year-view\" [ngClass]=\"yearViewState()\">\n        @for (year of years; track $index) {\n        <md-button #yearItem [variant]=\"yearView() === year ? 'filled' : 'text'\" (click)=\"yearItemClick(year)\">\n          {{ year }}\n        </md-button>\n        }\n      </div>\n      <div class=\"calendar\">\n        <div class=\"days day-names\">\n          @for (dayName of dayNames(); track $index) {\n          <div class=\"day-container\">\n            <div class=\"day-name\">{{ dayName }}</div>\n          </div>\n          }\n        </div>\n        <div class=\"days\">\n          @for (day of days(); track $index) {\n          <div class=\"day-container\">\n            @if (isInRange(day.date)) {\n            <div class=\"in-range-indicator\" [class.first]=\"isDateEqual(fromSelectedValueAsDate, day.date)\"\n              [class.last]=\"isDateEqual(toSelectedValueAsDate, day.date)\" [class.not-current]=\"day.type !== 'current'\">\n            </div>\n            }\n            <md-icon-button [custom]=\"true\" [selected]=\"isDaySelected(day.date)\"\n              [variant]=\"isDaySelected(day.date) ? 'filled' : 'standard'\" [class.not-current]=\"day.type !== 'current'\"\n              [class.today]=\"isToday(day.date)\" (click)=\"dayClick(day)\" [class.in-range]=\"isInRange(day.date)\">{{\n              day.day\n              }}</md-icon-button>\n          </div>\n          }\n        </div>\n      </div>\n    </div>\n    @if (variant() !== 'dialog') {\n    <div class=\"actions\">\n      <ng-container *ngTemplateOutlet=\"actions\" />\n    </div>\n    }\n  </div>\n</ng-template>\n\n@if (variant() === 'embedded') {\n<ng-container *ngTemplateOutlet=\"contents\" />\n} @else {\n<md-field #field [variant]=\"fieldVariant()\" [populated]=\"!!populated()\" [errorText]=\"errorText()\" [label]=\"label()\"\n  [disabled]=\"disabled()\" (bodyClick)=\"bodyClick()\" (popoverStateChange)=\"popoverStateChange($event)\">\n  <slot name=\"leading\" slot=\"leading\"></slot>\n  <slot name=\"prefix\" slot=\"prefix\"></slot>\n  <slot name=\"suffix\" slot=\"suffix\"></slot>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <slot name=\"counter\" slot=\"counter\"></slot>\n  <span class=\"selected-value\">\n    @if (!fromValueAsDate) {\n    <span i18n>Select a date...</span>\n    } @else {\n    <span>{{ fromValueAsDate | dateFormat: this.locale(): 'dd MMM yyyy' }}</span>\n    @if (range()) {\n    <span>-</span>\n    <span>{{ toValueAsDate | dateFormat: this.locale(): 'dd MMM yyyy' }}</span>\n    }\n    }\n  </span>\n  <md-icon slot=\"trailing\">calendar_month</md-icon>\n  @if (variant() === 'dropdown') {\n  <div class=\"popover\" slot=\"popover\">\n    <ng-container *ngTemplateOutlet=\"contents\" />\n  </div>\n  }\n</md-field>\n@if (variant() === 'dialog') {\n<md-dialog #dialog (stateChange)=\"popoverStateChange($event)\">\n  <md-icon slot=\"icon\">calendar_month</md-icon>\n  <span class=\"selected-value\" slot=\"headline\">\n    @if (!fromSelectedValueAsDate) {\n    <span i18n>Select a date...</span>\n    } @else {\n    <span>{{ fromSelectedValueAsDate | dateFormat: this.locale(): 'dd MMM yyyy' }}</span>\n    @if (range()) {\n    <span>-</span>\n    <span>{{ toSelectedValueAsDate | dateFormat: this.locale(): 'dd MMM yyyy' }}</span>\n    }\n    }\n  </span>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <ng-container *ngTemplateOutlet=\"contents\" />\n  <ng-container *ngTemplateOutlet=\"actions\" />\n</md-dialog>\n}\n}", styles: [":host md-field::part(body){cursor:pointer}:host .popover{display:inline-flex}:host .container{display:inline-flex;flex-direction:column;isolation:isolate;flex-grow:1;background-color:var(--md-sys-color-surface-container);border-radius:var(--md-sys-shape-extra-small);padding-top:20px;padding-bottom:12px;padding-inline:12px}:host .container .header{display:inline-flex;justify-content:space-between;margin-bottom:30px}:host .container .months,:host .container .years{display:inline-flex}:host .container .navigate{width:40px;height:40px}:host .container md-button[variant=plain]:not(.navigate){padding-inline-start:12px;padding-inline-end:4px}:host .container .body{position:relative;flex-grow:1;flex-direction:column;display:inline-flex}:host .container .view{display:inline-flex;flex-direction:column;visibility:hidden;position:absolute;inset:0;background-color:var(--md-sys-color-surface-container);height:0px;opacity:0;overflow-y:auto;z-index:1;transition-property:height,opacity,visibility;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .container .view:before{content:\"\";position:fixed;inset:0 0 auto;border-top:1px solid var(--md-sys-color-outline)}:host .container .view:not(.closed){height:auto;opacity:1;visibility:visible}:host .container .view.year-view{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-top:8px;padding-bottom:8px;padding-inline:16px}:host .container .calendar{display:inline-flex;flex-direction:column}:host .container .calendar .day-names{margin-bottom:16px}:host .container .calendar .days{display:grid;grid-template-columns:repeat(7,1fr)}:host .container .calendar .days .day-container{position:relative;display:inline-flex;justify-content:center;align-items:center;text-align:center;height:40px}:host .container .calendar .days .day-name{display:inline-flex;justify-content:center;align-items:center;text-align:center;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);height:40px;width:40px;justify-self:center;align-self:center}:host .container .calendar .days .today{border:1px solid var(--md-sys-color-primary)}:host .container .calendar .days .in-range-indicator{position:absolute;height:24px;background-color:var(--md-sys-color-primary);inset-inline:0;z-index:-1}:host .container .calendar .days .in-range-indicator.first{inset-inline-start:50%}:host .container .calendar .days .in-range-indicator.last{inset-inline-end:50%}:host .container .calendar .days .in-range-indicator.not-current{background:color-mix(in oklab,var(--md-sys-color-primary),var(--md-sys-color-surface) 50%)}:host .container md-icon-button{justify-self:center;align-self:center}:host .container md-icon-button.in-range{color:var(--md-sys-color-primary-on)}:host .container md-icon-button.not-current{color:color-mix(in oklab,currentColor,var(--md-sys-color-surface) 50%)}:host .container md-icon-button.not-current[variant=filled]{color:var(--md-sys-color-primary-on);background:color-mix(in oklab,var(--md-sys-color-primary),var(--md-sys-color-surface) 50%)}:host .container md-icon-button.in-range.not-current:not([variant=filled]){color:var(--md-sys-color-primary-on)}:host .actions{display:inline-flex;justify-content:flex-end;gap:8px;flex-grow:1;margin-top:8px}:host .clear{margin-inline-end:auto}:host .selected-value{display:inline-flex;gap:8px}\n"], dependencies: [{ kind: "component", type: ButtonComponent, selector: "md-button", inputs: ["variant", "disabled", "type", "href", "anchorTarget", "name", "value", "progressIndeterminate", "progressValue", "progressMax"], outputs: ["variantChange", "disabledChange", "typeChange", "hrefChange", "anchorTargetChange", "nameChange", "valueChange", "progressIndeterminateChange", "progressValueChange", "progressMaxChange"] }, { kind: "component", type: IconButtonComponent, selector: "md-icon-button", inputs: ["disabled", "type", "href", "anchorTarget", "name", "value", "progressIndeterminate", "progressValue", "progressMax", "variant", "selected", "custom", "badgeDot", "badgeNumber"], outputs: ["disabledChange", "typeChange", "hrefChange", "anchorTargetChange", "nameChange", "valueChange", "progressIndeterminateChange", "progressValueChange", "progressMaxChange", "variantChange", "selectedChange", "customChange", "badgeDotChange", "badgeNumberChange"] }, { kind: "component", type: FieldComponent, selector: "md-field", inputs: ["value", "variant", "label", "populated", "open", "popoverTrigger", "maxPopoverHeight"], outputs: ["valueChange", "variantChange", "labelChange", "populatedChange", "contentClick", "bodyClick", "openChange", "popoverTriggerChange", "maxPopoverHeightChange", "popoverStateChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "component", type: ListItemComponent, selector: "md-list-item", inputs: ["dragging", "top", "large", "selected", "split", "disabled", "type", "href", "anchorTarget", "name", "value", "progressIndeterminate", "progressValue", "progressMax", "progressBuffer"], outputs: ["draggingChange", "topChange", "largeChange", "selectedChange", "splitChange", "disabledChange", "typeChange", "hrefChange", "anchorTargetChange", "nameChange", "valueChange", "progressIndeterminateChange", "progressValueChange", "progressMaxChange", "progressBufferChange"] }, { kind: "component", type: DialogComponent, selector: "md-dialog", inputs: ["returnValue", "open"], outputs: ["returnValueChange", "openChange", "cancel", "stateChange"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }, { kind: "component", type: TooltipComponent, selector: "md-tooltip", inputs: ["variant", "placement", "trigger", "offset", "manualClose", "modal"], outputs: ["variantChange", "placementChange", "triggerChange", "offsetChange", "manualCloseChange", "modalChange"] }, { kind: "pipe", type: DateFormatPipe, name: "dateFormat" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: DatePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-date-picker', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        ButtonComponent,
                        IconButtonComponent,
                        FieldComponent,
                        CommonModule,
                        IconComponent,
                        FieldComponent,
                        ListItemComponent,
                        DialogComponent,
                        SlotDirective,
                        TooltipComponent,
                        DateFormatPipe,
                    ], hostDirectives: [], host: {}, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            multi: true,
                            useExisting: forwardRef(() => DatePickerComponent),
                        },
                    ], template: "<ng-template #actions>\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" class=\"clear\" (click)=\"clearClick()\"\n    i18n>Clear</md-button>\n  @if (variant() !== 'embedded') {\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" (click)=\"okayClick()\"\n    [disabled]=\"!canOkay()\" i18n>Okay</md-button>\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" (click)=\"cancelClick()\"\n    i18n>Cancel</md-button>\n  }\n</ng-template>\n\n<ng-template #contents>\n  <div class=\"container\">\n    <div class=\"header\">\n      <div class=\"months\">\n        <md-button variant=\"plain\" class=\"navigate\" (click)=\"monthView.set(monthView() - 1)\">\n          <md-icon>chevron_left</md-icon>\n        </md-button>\n        <md-button #monthViewButton variant=\"plain\" (click)=\"openMonthView()\">\n          {{ monthViewText() }}\n          <md-icon class=\"month-icon\" slot=\"trailing\">arrow_drop_down</md-icon>\n        </md-button>\n        <md-button variant=\"plain\" class=\"navigate\" (click)=\"monthView.set(monthView() + 1)\">\n          <md-icon>chevron_right</md-icon>\n        </md-button>\n      </div>\n      @if (variant() === 'dropdown') {\n      <md-icon-button #today (click)=\"todayClick()\">today</md-icon-button>\n      <md-tooltip [target]=\"today\" i18n>Today</md-tooltip>\n      } @else {\n      <md-button variant=\"text\" (click)=\"todayClick()\" i18n>Today</md-button>\n      }\n      <div class=\"years\">\n        <md-button variant=\"plain\" class=\"navigate\" (click)=\"yearView.set(yearView() - 1)\">\n          <md-icon>chevron_left</md-icon>\n        </md-button>\n        <md-button variant=\"plain\" (click)=\"openYearView()\">\n          {{ yearViewText() }}\n          <md-icon slot=\"trailing\">arrow_drop_down</md-icon>\n        </md-button>\n        <md-button variant=\"plain\" class=\"navigate\" (click)=\"yearView.set(yearView() + 1)\">\n          <md-icon>chevron_right</md-icon>\n        </md-button>\n      </div>\n    </div>\n    <div class=\"body\">\n      <div class=\"view\" [ngClass]=\"monthViewState()\">\n        @for (month of months(); track $index) {\n        <md-list-item #monthItem [selected]=\"monthView() === month.value\" (click)=\"monthItemClick(month.value)\"\n          type=\"button\">\n          {{ month.text }}\n        </md-list-item>\n        }\n      </div>\n      <div class=\"view year-view\" [ngClass]=\"yearViewState()\">\n        @for (year of years; track $index) {\n        <md-button #yearItem [variant]=\"yearView() === year ? 'filled' : 'text'\" (click)=\"yearItemClick(year)\">\n          {{ year }}\n        </md-button>\n        }\n      </div>\n      <div class=\"calendar\">\n        <div class=\"days day-names\">\n          @for (dayName of dayNames(); track $index) {\n          <div class=\"day-container\">\n            <div class=\"day-name\">{{ dayName }}</div>\n          </div>\n          }\n        </div>\n        <div class=\"days\">\n          @for (day of days(); track $index) {\n          <div class=\"day-container\">\n            @if (isInRange(day.date)) {\n            <div class=\"in-range-indicator\" [class.first]=\"isDateEqual(fromSelectedValueAsDate, day.date)\"\n              [class.last]=\"isDateEqual(toSelectedValueAsDate, day.date)\" [class.not-current]=\"day.type !== 'current'\">\n            </div>\n            }\n            <md-icon-button [custom]=\"true\" [selected]=\"isDaySelected(day.date)\"\n              [variant]=\"isDaySelected(day.date) ? 'filled' : 'standard'\" [class.not-current]=\"day.type !== 'current'\"\n              [class.today]=\"isToday(day.date)\" (click)=\"dayClick(day)\" [class.in-range]=\"isInRange(day.date)\">{{\n              day.day\n              }}</md-icon-button>\n          </div>\n          }\n        </div>\n      </div>\n    </div>\n    @if (variant() !== 'dialog') {\n    <div class=\"actions\">\n      <ng-container *ngTemplateOutlet=\"actions\" />\n    </div>\n    }\n  </div>\n</ng-template>\n\n@if (variant() === 'embedded') {\n<ng-container *ngTemplateOutlet=\"contents\" />\n} @else {\n<md-field #field [variant]=\"fieldVariant()\" [populated]=\"!!populated()\" [errorText]=\"errorText()\" [label]=\"label()\"\n  [disabled]=\"disabled()\" (bodyClick)=\"bodyClick()\" (popoverStateChange)=\"popoverStateChange($event)\">\n  <slot name=\"leading\" slot=\"leading\"></slot>\n  <slot name=\"prefix\" slot=\"prefix\"></slot>\n  <slot name=\"suffix\" slot=\"suffix\"></slot>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <slot name=\"counter\" slot=\"counter\"></slot>\n  <span class=\"selected-value\">\n    @if (!fromValueAsDate) {\n    <span i18n>Select a date...</span>\n    } @else {\n    <span>{{ fromValueAsDate | dateFormat: this.locale(): 'dd MMM yyyy' }}</span>\n    @if (range()) {\n    <span>-</span>\n    <span>{{ toValueAsDate | dateFormat: this.locale(): 'dd MMM yyyy' }}</span>\n    }\n    }\n  </span>\n  <md-icon slot=\"trailing\">calendar_month</md-icon>\n  @if (variant() === 'dropdown') {\n  <div class=\"popover\" slot=\"popover\">\n    <ng-container *ngTemplateOutlet=\"contents\" />\n  </div>\n  }\n</md-field>\n@if (variant() === 'dialog') {\n<md-dialog #dialog (stateChange)=\"popoverStateChange($event)\">\n  <md-icon slot=\"icon\">calendar_month</md-icon>\n  <span class=\"selected-value\" slot=\"headline\">\n    @if (!fromSelectedValueAsDate) {\n    <span i18n>Select a date...</span>\n    } @else {\n    <span>{{ fromSelectedValueAsDate | dateFormat: this.locale(): 'dd MMM yyyy' }}</span>\n    @if (range()) {\n    <span>-</span>\n    <span>{{ toSelectedValueAsDate | dateFormat: this.locale(): 'dd MMM yyyy' }}</span>\n    }\n    }\n  </span>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <ng-container *ngTemplateOutlet=\"contents\" />\n  <ng-container *ngTemplateOutlet=\"actions\" />\n</md-dialog>\n}\n}", styles: [":host md-field::part(body){cursor:pointer}:host .popover{display:inline-flex}:host .container{display:inline-flex;flex-direction:column;isolation:isolate;flex-grow:1;background-color:var(--md-sys-color-surface-container);border-radius:var(--md-sys-shape-extra-small);padding-top:20px;padding-bottom:12px;padding-inline:12px}:host .container .header{display:inline-flex;justify-content:space-between;margin-bottom:30px}:host .container .months,:host .container .years{display:inline-flex}:host .container .navigate{width:40px;height:40px}:host .container md-button[variant=plain]:not(.navigate){padding-inline-start:12px;padding-inline-end:4px}:host .container .body{position:relative;flex-grow:1;flex-direction:column;display:inline-flex}:host .container .view{display:inline-flex;flex-direction:column;visibility:hidden;position:absolute;inset:0;background-color:var(--md-sys-color-surface-container);height:0px;opacity:0;overflow-y:auto;z-index:1;transition-property:height,opacity,visibility;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .container .view:before{content:\"\";position:fixed;inset:0 0 auto;border-top:1px solid var(--md-sys-color-outline)}:host .container .view:not(.closed){height:auto;opacity:1;visibility:visible}:host .container .view.year-view{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-top:8px;padding-bottom:8px;padding-inline:16px}:host .container .calendar{display:inline-flex;flex-direction:column}:host .container .calendar .day-names{margin-bottom:16px}:host .container .calendar .days{display:grid;grid-template-columns:repeat(7,1fr)}:host .container .calendar .days .day-container{position:relative;display:inline-flex;justify-content:center;align-items:center;text-align:center;height:40px}:host .container .calendar .days .day-name{display:inline-flex;justify-content:center;align-items:center;text-align:center;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);height:40px;width:40px;justify-self:center;align-self:center}:host .container .calendar .days .today{border:1px solid var(--md-sys-color-primary)}:host .container .calendar .days .in-range-indicator{position:absolute;height:24px;background-color:var(--md-sys-color-primary);inset-inline:0;z-index:-1}:host .container .calendar .days .in-range-indicator.first{inset-inline-start:50%}:host .container .calendar .days .in-range-indicator.last{inset-inline-end:50%}:host .container .calendar .days .in-range-indicator.not-current{background:color-mix(in oklab,var(--md-sys-color-primary),var(--md-sys-color-surface) 50%)}:host .container md-icon-button{justify-self:center;align-self:center}:host .container md-icon-button.in-range{color:var(--md-sys-color-primary-on)}:host .container md-icon-button.not-current{color:color-mix(in oklab,currentColor,var(--md-sys-color-surface) 50%)}:host .container md-icon-button.not-current[variant=filled]{color:var(--md-sys-color-primary-on);background:color-mix(in oklab,var(--md-sys-color-primary),var(--md-sys-color-surface) 50%)}:host .container md-icon-button.in-range.not-current:not([variant=filled]){color:var(--md-sys-color-primary-on)}:host .actions{display:inline-flex;justify-content:flex-end;gap:8px;flex-grow:1;margin-top:8px}:host .clear{margin-inline-end:auto}:host .selected-value{display:inline-flex;gap:8px}\n"] }]
        }], ctorParameters: () => [] });

class FabComponent extends MaterialDesignComponent {
    palette = model('primary');
    size = model('medium');
    lowered = model(false);
    disabled = model(false);
    type = model('button');
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    extended = model(false);
    iconSlot = this.slotDirective();
    labelSlot = this.slotDirective('label');
    button = viewChild('button');
    elevationLevel = computed(() => (this.lowered() ? 1 : 3));
    _openClose$ = openClose(this.extended);
    state = toSignal(this._openClose$, {
        initialValue: 'closed',
    });
    constructor() {
        super();
        attachTarget(ForwardFocusDirective, this.button);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FabComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: FabComponent, isStandalone: true, selector: "md-fab", inputs: { palette: { classPropertyName: "palette", publicName: "palette", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, lowered: { classPropertyName: "lowered", publicName: "lowered", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, extended: { classPropertyName: "extended", publicName: "extended", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { palette: "paletteChange", size: "sizeChange", lowered: "loweredChange", disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", extended: "extendedChange" }, host: { properties: { "attr.palette": "palette()", "attr.size": "size()", "attr.disabled": "disabled()", "attr.icon": "iconSlot()?.any() || null", "attr.label": "labelSlot()?.any() || null", "attr.state": "state()" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: ForwardFocusDirective }], ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  <slot></slot>\n  <span part=\"label\">\n    <slot name=\"label\"></slot>\n  </span>\n</ng-template>\n\n<md-elevation part=\"elevation\" [target]=\"button()\" [level]=\"elevationLevel()\" />\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;gap:8px;cursor:pointer;justify-content:flex-start;align-items:center;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);transition-property:background-color,color,width;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard-decelerate)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);overflow:hidden}:host .label{display:none}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host([state=opened]){transition-timing-function:var(--md-sys-motion-easing-standard-accelerate)}:host(:not([state=closed])[label=true]) .label{display:inline-flex}:host([palette=surface]){background-color:var(--md-sys-color-surface-container-low);color:var(--md-sys-color-primary)}:host([palette=primary]){background-color:var(--md-sys-color-primary-container);color:var(--md-sys-color-primary-container-on)}:host([palette=secondary]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([palette=tertiary]){background-color:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-tertiary-container-on)}:host([palette=danger]){background-color:var(--md-sys-color-danger-container);color:var(--md-sys-color-danger-container-on)}:host([palette=warning]){background-color:var(--md-sys-color-warning-container);color:var(--md-sys-color-warning-container-on)}:host([palette=success]){background-color:var(--md-sys-color-success-container);color:var(--md-sys-color-success-container-on)}:host([size=large]){height:96px;width:96px;padding:32px;border-radius:var(--md-sys-shape-medium)}:host([size=large]) ::slotted(md-icon){--md-comp-icon-size: 36}:host([size=medium]){height:56px;width:56px;padding:16px;border-radius:var(--md-sys-shape-small)}:host([size=medium]) ::slotted(md-icon){--md-comp-icon-size: 24}:host([size=small]){height:40px;width:40px;padding:8px;border-radius:var(--md-sys-shape-extra-small)}:host([size=small]) md-icon,:host([size=small]) ::slotted(md-icon){--md-comp-icon-size: 24}:host([label=true]:not([icon])),:host([icon=true]:not([state=closed])[label=true]){width:auto}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}\n"], dependencies: [{ kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FabComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-fab', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, imports: [
                        ProgressIndicatorComponent,
                        TouchAreaComponent,
                        ElevationComponent,
                        RippleComponent,
                        FocusRingComponent,
                        CommonModule,
                        SlotDirective,
                        AnimationDirective,
                        IconComponent,
                    ], hostDirectives: [ForwardFocusDirective], host: {
                        '[attr.palette]': 'palette()',
                        '[attr.size]': 'size()',
                        '[attr.disabled]': 'disabled()',
                        '[attr.icon]': `iconSlot()?.any() || null`,
                        '[attr.label]': 'labelSlot()?.any() || null',
                        '[attr.state]': 'state()',
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  <slot></slot>\n  <span part=\"label\">\n    <slot name=\"label\"></slot>\n  </span>\n</ng-template>\n\n<md-elevation part=\"elevation\" [target]=\"button()\" [level]=\"elevationLevel()\" />\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;gap:8px;cursor:pointer;justify-content:flex-start;align-items:center;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);transition-property:background-color,color,width;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard-decelerate)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);overflow:hidden}:host .label{display:none}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host([state=opened]){transition-timing-function:var(--md-sys-motion-easing-standard-accelerate)}:host(:not([state=closed])[label=true]) .label{display:inline-flex}:host([palette=surface]){background-color:var(--md-sys-color-surface-container-low);color:var(--md-sys-color-primary)}:host([palette=primary]){background-color:var(--md-sys-color-primary-container);color:var(--md-sys-color-primary-container-on)}:host([palette=secondary]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([palette=tertiary]){background-color:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-tertiary-container-on)}:host([palette=danger]){background-color:var(--md-sys-color-danger-container);color:var(--md-sys-color-danger-container-on)}:host([palette=warning]){background-color:var(--md-sys-color-warning-container);color:var(--md-sys-color-warning-container-on)}:host([palette=success]){background-color:var(--md-sys-color-success-container);color:var(--md-sys-color-success-container-on)}:host([size=large]){height:96px;width:96px;padding:32px;border-radius:var(--md-sys-shape-medium)}:host([size=large]) ::slotted(md-icon){--md-comp-icon-size: 36}:host([size=medium]){height:56px;width:56px;padding:16px;border-radius:var(--md-sys-shape-small)}:host([size=medium]) ::slotted(md-icon){--md-comp-icon-size: 24}:host([size=small]){height:40px;width:40px;padding:8px;border-radius:var(--md-sys-shape-extra-small)}:host([size=small]) md-icon,:host([size=small]) ::slotted(md-icon){--md-comp-icon-size: 24}:host([label=true]:not([icon])),:host([icon=true]:not([state=closed])[label=true]){width:auto}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}\n"] }]
        }], ctorParameters: () => [] });

class MenuComponent extends MaterialDesignComponent {
    placement = model('bottom-start');
    trigger = model('click');
    offset = model(8);
    popover = viewChild('popover');
    attachableDirective = inject(AttachableDirective);
    useContainerWidth = model(false);
    constructor() {
        super();
        this.attachableDirective.events.set([
            'click',
            'pointerdown',
            'pointerenter',
            'pointerleave',
            'contextmenu',
        ]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "18.2.9", type: MenuComponent, isStandalone: true, selector: "md-menu", inputs: { placement: { classPropertyName: "placement", publicName: "placement", isSignal: true, isRequired: false, transformFunction: null }, trigger: { classPropertyName: "trigger", publicName: "trigger", isSignal: true, isRequired: false, transformFunction: null }, offset: { classPropertyName: "offset", publicName: "offset", isSignal: true, isRequired: false, transformFunction: null }, useContainerWidth: { classPropertyName: "useContainerWidth", publicName: "useContainerWidth", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { placement: "placementChange", trigger: "triggerChange", offset: "offsetChange", useContainerWidth: "useContainerWidthChange" }, viewQueries: [{ propertyName: "popover", first: true, predicate: ["popover"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: AttachableDirective, inputs: ["target", "target"] }], ngImport: i0, template: "<md-popover #popover part=\"popover\" [target]=\"attachableDirective.target()\" [offset]=\"offset()\"\n  [placement]=\"placement()\" [trigger]=\"trigger()\" [useContainerWidth]=\"useContainerWidth()\">\n  <slot></slot>\n</md-popover>", styles: [":host{position:absolute;display:inline-flex;flex-direction:column}:host md-popover{min-width:112px;max-width:280px}:host md-popover::part(body){padding-top:8px;padding-bottom:8px}:host ::slotted(md-divider){border-color:var(--md-sys-color-outline-variant)}\n"], dependencies: [{ kind: "component", type: PopoverComponent, selector: "md-popover", inputs: ["trigger", "flip", "shift", "offset", "delay", "placement", "strategy", "native", "open", "manualClose", "useContainerWidth"], outputs: ["triggerChange", "flipChange", "shiftChange", "offsetChange", "delayChange", "placementChange", "strategyChange", "nativeChange", "openChange", "manualCloseChange", "useContainerWidthChange", "stateChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-menu', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [PopoverComponent], hostDirectives: [
                        {
                            directive: AttachableDirective,
                            inputs: ['target'],
                        },
                    ], host: {}, template: "<md-popover #popover part=\"popover\" [target]=\"attachableDirective.target()\" [offset]=\"offset()\"\n  [placement]=\"placement()\" [trigger]=\"trigger()\" [useContainerWidth]=\"useContainerWidth()\">\n  <slot></slot>\n</md-popover>", styles: [":host{position:absolute;display:inline-flex;flex-direction:column}:host md-popover{min-width:112px;max-width:280px}:host md-popover::part(body){padding-top:8px;padding-bottom:8px}:host ::slotted(md-divider){border-color:var(--md-sys-color-outline-variant)}\n"] }]
        }], ctorParameters: () => [] });

class MenuItemComponent extends MaterialDesignComponent {
    checkOnSelected = model(false);
    disabled = model(false);
    type = model('button');
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    selected = model(false);
    leadingSlot = this.slotDirective('leading');
    trailingSlot = this.slotDirective('trailing');
    itemSlot = this.slotDirective('item');
    button = viewChild('button');
    subMenu = viewChild('menu');
    dir = textDirection();
    placement = computed(() => this.dir() === 'ltr' ? 'right-start' : 'left-start');
    constructor() {
        super();
        this.setSlots(MenuItemComponent, (x) => (x.hostElement.slot = 'item'));
    }
    onClick(event) {
        if (this.itemSlot()?.any()) {
            if (this.hostElement === event.target) {
                this.subMenu()?.popover()?.open.set?.(true);
            }
        }
        else {
            this.hostElement.dispatchEvent(new Event('close-popover', { bubbles: true }));
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MenuItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: MenuItemComponent, isStandalone: true, selector: "md-menu-item", inputs: { checkOnSelected: { classPropertyName: "checkOnSelected", publicName: "checkOnSelected", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { checkOnSelected: "checkOnSelectedChange", disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", selected: "selectedChange" }, host: { listeners: { "click": "onClick($event)" }, properties: { "attr.leading": "leadingSlot()?.any() || null", "attr.trailing": "trailingSlot()?.any() || null", "attr.selected": "selected() || null", "attr.disabled": "disabled() || null", "attr.items": "itemSlot()?.any() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }, { propertyName: "subMenu", first: true, predicate: ["menu"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  @if (checkOnSelected() && selected()) {\n  <md-icon [filled]=\"true\">check</md-icon>\n  } @else {\n  <slot name=\"leading\"></slot>\n  }\n  <slot></slot>\n  @if (itemSlot()?.any()) {\n  @if (dir() === 'ltr') {\n  <md-icon class=\"end\">arrow_right</md-icon>\n  } @else {\n  <md-icon class=\"end\">arrow_left</md-icon>\n  }\n  } @else {\n  <span class=\"trailing\">\n    <slot name=\"trailing\"></slot>\n  </span>\n  }\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n<md-menu #menu [target]=\"hostElement\" [placement]=\"placement()\" [offset]=\"0\" trigger=\"manual\">\n  <slot name=\"item\"></slot>\n</md-menu>", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;height:48px;gap:0;cursor:pointer;transition-property:opacity,background-color,color,border-color;flex-shrink:0;color:var(--md-sys-color-surface-variant-on);padding-inline-start:12px;padding-inline-end:12px;align-items:center;gap:12px;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);transition-property:background-color,color,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);width:100%}:host .trailing{margin-inline-start:auto;display:none}:host .end{margin-inline-start:auto}:host ::slotted(md-icon),:host md-icon{--md-comp-icon-size: 24}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host md-menu{display:none}:host([trailing=true]) .trailing{display:inline-flex}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true]) ::slotted(md-icon),:host([selected=true]) md-icon{--md-comp-icon-filled: 1}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([items=true]) md-menu{display:inline-flex}:host([leading=true]){--_padding-start: var(--_padding-addon)}:host([trailing=true]){--_padding-end: var(--_padding-addon)}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"], dependencies: [{ kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: MenuComponent, selector: "md-menu", inputs: ["placement", "trigger", "offset", "useContainerWidth"], outputs: ["placementChange", "triggerChange", "offsetChange", "useContainerWidthChange"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: MenuItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-menu-item', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        FocusRingComponent,
                        RippleComponent,
                        TouchAreaComponent,
                        MenuComponent,
                        IconComponent,
                        CommonModule,
                        SlotDirective,
                    ], hostDirectives: [], host: {
                        '[attr.leading]': 'leadingSlot()?.any() || null',
                        '[attr.trailing]': 'trailingSlot()?.any() || null',
                        '[attr.selected]': 'selected() || null',
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.items]': `itemSlot()?.any() || null`,
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  @if (checkOnSelected() && selected()) {\n  <md-icon [filled]=\"true\">check</md-icon>\n  } @else {\n  <slot name=\"leading\"></slot>\n  }\n  <slot></slot>\n  @if (itemSlot()?.any()) {\n  @if (dir() === 'ltr') {\n  <md-icon class=\"end\">arrow_right</md-icon>\n  } @else {\n  <md-icon class=\"end\">arrow_left</md-icon>\n  }\n  } @else {\n  <span class=\"trailing\">\n    <slot name=\"trailing\"></slot>\n  </span>\n  }\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n<md-menu #menu [target]=\"hostElement\" [placement]=\"placement()\" [offset]=\"0\" trigger=\"manual\">\n  <slot name=\"item\"></slot>\n</md-menu>", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;height:48px;gap:0;cursor:pointer;transition-property:opacity,background-color,color,border-color;flex-shrink:0;color:var(--md-sys-color-surface-variant-on);padding-inline-start:12px;padding-inline-end:12px;align-items:center;gap:12px;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);transition-property:background-color,color,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);width:100%}:host .trailing{margin-inline-start:auto;display:none}:host .end{margin-inline-start:auto}:host ::slotted(md-icon),:host md-icon{--md-comp-icon-size: 24}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host md-menu{display:none}:host([trailing=true]) .trailing{display:inline-flex}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true]) ::slotted(md-icon),:host([selected=true]) md-icon{--md-comp-icon-filled: 1}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([items=true]) md-menu{display:inline-flex}:host([leading=true]){--_padding-start: var(--_padding-addon)}:host([trailing=true]){--_padding-end: var(--_padding-addon)}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"] }]
        }], ctorParameters: () => [], propDecorators: { onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

class NavigationItemComponent extends MaterialDesignComponent {
    selected = model(false);
    custom = model(false);
    layout = model('bar');
    disabled = model(false);
    type = model('button');
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    progressIndeterminate = model(false);
    progressValue = model(0);
    progressMax = model(0);
    badgeDot = model(false);
    badgeNumber = model();
    labelSlot = this.slotDirective('label');
    iconSlot = this.slotDirective();
    button = viewChild('button');
    _parent = inject(NavigationComponent, {
        optional: true,
        host: true,
    });
    parentLayout = computed(() => {
        if (!this._parent) {
            return this.layout();
        }
        return this._parent.layout();
    });
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: NavigationItemComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: NavigationItemComponent, isStandalone: true, selector: "md-navigation-item", inputs: { selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null }, custom: { classPropertyName: "custom", publicName: "custom", isSignal: true, isRequired: false, transformFunction: null }, layout: { classPropertyName: "layout", publicName: "layout", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, progressIndeterminate: { classPropertyName: "progressIndeterminate", publicName: "progressIndeterminate", isSignal: true, isRequired: false, transformFunction: null }, progressValue: { classPropertyName: "progressValue", publicName: "progressValue", isSignal: true, isRequired: false, transformFunction: null }, progressMax: { classPropertyName: "progressMax", publicName: "progressMax", isSignal: true, isRequired: false, transformFunction: null }, badgeDot: { classPropertyName: "badgeDot", publicName: "badgeDot", isSignal: true, isRequired: false, transformFunction: null }, badgeNumber: { classPropertyName: "badgeNumber", publicName: "badgeNumber", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selected: "selectedChange", custom: "customChange", layout: "layoutChange", disabled: "disabledChange", type: "typeChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", progressIndeterminate: "progressIndeterminateChange", progressValue: "progressValueChange", progressMax: "progressMaxChange", badgeDot: "badgeDotChange", badgeNumber: "badgeNumberChange" }, host: { properties: { "attr.selected": "selected() || null", "attr.layout": "parentLayout()", "attr.disabled": "disabled() || null", "attr.label": "labelSlot()?.any() || null", "attr.icon": "iconSlot()?.any() || null" } }, viewQueries: [{ propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  @if (parentLayout() === 'drawer') {\n  <md-focus-ring [target]=\"button()\" />\n  <md-ripple [target]=\"button()\" />\n  @if (custom()) {\n  <slot></slot>\n  } @else {\n  <md-icon part=\"icon\" [filled]=\"selected()\">\n    <slot></slot>\n  </md-icon>\n  }\n  } @else {\n  <div part=\"indicator\" class=\"indicator\">\n    <md-focus-ring [target]=\"button()\" />\n    <md-ripple [target]=\"button()\" />\n    @if (custom()) {\n    <slot></slot>\n    } @else {\n    @if (disabled()) {\n    <md-icon part=\"icon\" [filled]=\"selected()\">\n      <slot></slot>\n    </md-icon>\n    } @else {\n    <md-icon part=\"icon\" [filled]=\"selected()\" [badgeDot]=\"badgeDot()\" [badgeNumber]=\"badgeNumber()\">\n      <slot></slot>\n    </md-icon>\n    }\n    }\n  </div>\n  }\n  <span class=\"label\">\n    <slot name=\"label\"></slot>\n  </span>\n  @if (parentLayout() === 'drawer') {\n  @if (!disabled()) {\n  <md-badge [embedded]=\"true\" [dot]=\"badgeDot()\" [number]=\"badgeNumber()\" />\n  }\n  }\n</ng-template>\n\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}", styles: [":host{--_color: currentColor;position:relative;color:var(--md-sys-color-surface-variant-on);cursor:pointer;isolation:isolate;display:inline-flex;flex-direction:column;align-items:center;gap:4px;justify-content:center;transition-property:background-color,width,height,color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);flex-direction:inherit;align-items:inherit;justify-content:inherit}:host .label{display:none;text-wrap:nowrap;font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}:host .indicator{position:relative;border-radius:var(--md-sys-shape-full);width:64px;height:32px;display:inline-flex;justify-content:center;align-items:center;flex-shrink:0;z-index:-1;transition-property:background-color,width,height,color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host md-icon{display:none}:host([icon=true]) md-icon{display:inline-flex}:host([label=true]) .label{display:inline-flex}:host([selected=true]){pointer-events:none}:host([selected=true]) md-icon,:host([selected=true]) ::slotted(md-icon){--md-comp-icon-filled: 1}:host([selected=true][layout=drawer]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true]:not([layout=drawer])) .indicator{background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([layout=rail]) md-ripple,:host([layout=bar]) md-ripple{--md-comp-ripple-transform-default: scaleX(0);--md-comp-ripple-transform-hover: scaleX(1)}:host([layout=rail]) .indicator{width:56px}:host([layout=drawer]){flex-direction:row;justify-content:flex-start;height:56px;padding-inline:16px 16px;border-radius:var(--md-sys-shape-full)}:host([layout=drawer]) .label{font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host([layout=drawer]) a,:host([layout=drawer]) button{gap:12px;width:100%}:host([layout=drawer]) md-badge{margin-inline-start:auto}:host(:not([layout=drawer])[disabled=true][selected=true]) .indicator{background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([layout=drawer][disabled=true][selected=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"], dependencies: [{ kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: BadgeComponent, selector: "md-badge", inputs: ["dot", "number", "embedded"], outputs: ["dotChange", "numberChange", "embeddedChange"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: NavigationItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-navigation-item', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        IconComponent,
                        TouchAreaComponent,
                        FocusRingComponent,
                        RippleComponent,
                        CommonModule,
                        BadgeComponent,
                        SlotDirective,
                    ], hostDirectives: [], host: {
                        '[attr.selected]': 'selected() || null',
                        '[attr.layout]': 'parentLayout()',
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.label]': `labelSlot()?.any() || null`,
                        '[attr.icon]': `iconSlot()?.any() || null`,
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  @if (parentLayout() === 'drawer') {\n  <md-focus-ring [target]=\"button()\" />\n  <md-ripple [target]=\"button()\" />\n  @if (custom()) {\n  <slot></slot>\n  } @else {\n  <md-icon part=\"icon\" [filled]=\"selected()\">\n    <slot></slot>\n  </md-icon>\n  }\n  } @else {\n  <div part=\"indicator\" class=\"indicator\">\n    <md-focus-ring [target]=\"button()\" />\n    <md-ripple [target]=\"button()\" />\n    @if (custom()) {\n    <slot></slot>\n    } @else {\n    @if (disabled()) {\n    <md-icon part=\"icon\" [filled]=\"selected()\">\n      <slot></slot>\n    </md-icon>\n    } @else {\n    <md-icon part=\"icon\" [filled]=\"selected()\" [badgeDot]=\"badgeDot()\" [badgeNumber]=\"badgeNumber()\">\n      <slot></slot>\n    </md-icon>\n    }\n    }\n  </div>\n  }\n  <span class=\"label\">\n    <slot name=\"label\"></slot>\n  </span>\n  @if (parentLayout() === 'drawer') {\n  @if (!disabled()) {\n  <md-badge [embedded]=\"true\" [dot]=\"badgeDot()\" [number]=\"badgeNumber()\" />\n  }\n  }\n</ng-template>\n\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button [type]=\"type()\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}", styles: [":host{--_color: currentColor;position:relative;color:var(--md-sys-color-surface-variant-on);cursor:pointer;isolation:isolate;display:inline-flex;flex-direction:column;align-items:center;gap:4px;justify-content:center;transition-property:background-color,width,height,color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);flex-direction:inherit;align-items:inherit;justify-content:inherit}:host .label{display:none;text-wrap:nowrap;font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}:host .indicator{position:relative;border-radius:var(--md-sys-shape-full);width:64px;height:32px;display:inline-flex;justify-content:center;align-items:center;flex-shrink:0;z-index:-1;transition-property:background-color,width,height,color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host md-icon{display:none}:host([icon=true]) md-icon{display:inline-flex}:host([label=true]) .label{display:inline-flex}:host([selected=true]){pointer-events:none}:host([selected=true]) md-icon,:host([selected=true]) ::slotted(md-icon){--md-comp-icon-filled: 1}:host([selected=true][layout=drawer]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true]:not([layout=drawer])) .indicator{background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([layout=rail]) md-ripple,:host([layout=bar]) md-ripple{--md-comp-ripple-transform-default: scaleX(0);--md-comp-ripple-transform-hover: scaleX(1)}:host([layout=rail]) .indicator{width:56px}:host([layout=drawer]){flex-direction:row;justify-content:flex-start;height:56px;padding-inline:16px 16px;border-radius:var(--md-sys-shape-full)}:host([layout=drawer]) .label{font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host([layout=drawer]) a,:host([layout=drawer]) button{gap:12px;width:100%}:host([layout=drawer]) md-badge{margin-inline-start:auto}:host(:not([layout=drawer])[disabled=true][selected=true]) .indicator{background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([layout=drawer][disabled=true][selected=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"] }]
        }] });

class NavigationComponent extends MaterialDesignComponent {
    layout = model('bar');
    constructor() {
        super();
        this.setSlots(NavigationItemComponent, (x) => x.layout.set(this.layout()));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: NavigationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: NavigationComponent, isStandalone: true, selector: "md-navigation", inputs: { layout: { classPropertyName: "layout", publicName: "layout", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { layout: "layoutChange" }, host: { properties: { "attr.layout": "layout()" } }, usesInheritance: true, ngImport: i0, template: "@if (layout() === 'bar') {\n<md-elevation [target]=\"this\" [level]=\"2\" [hoverable]=\"false\" [interactive]=\"false\" />\n}\n<slot></slot>", styles: [":host{position:relative;display:inline-flex;width:100%;z-index:var(--md-sys-z-index-navigation)}:host ::slotted(md-divider){display:none}:host ::slotted(md-navigation-headline){display:none}:host([layout=bar]){height:80px;gap:8px;flex-direction:row;background-color:var(--md-sys-color-surface-container)}:host([layout=bar]) ::slotted(md-navigation-item){padding:12px 0 16px;width:100%}:host([layout=rail]){height:100%;width:auto;align-items:center;padding:16px 12px;gap:12px;flex-direction:column}:host([layout=drawer]){flex-direction:column}:host([layout=drawer]) ::slotted(md-navigation-headline){display:none}:host([layout=drawer]) ::slotted(md-divider){margin-top:0;margin-bottom:0;display:inline-flex;margin-inline-start:16px;margin-inline-end:24px;border-color:var(--md-sys-color-outline)}:host([layout=drawer]) ::slotted(md-navigation-headline){display:inline-flex}\n"], dependencies: [{ kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: NavigationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-navigation', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [ElevationComponent], hostDirectives: [], host: {
                        '[attr.layout]': 'layout()',
                    }, template: "@if (layout() === 'bar') {\n<md-elevation [target]=\"this\" [level]=\"2\" [hoverable]=\"false\" [interactive]=\"false\" />\n}\n<slot></slot>", styles: [":host{position:relative;display:inline-flex;width:100%;z-index:var(--md-sys-z-index-navigation)}:host ::slotted(md-divider){display:none}:host ::slotted(md-navigation-headline){display:none}:host([layout=bar]){height:80px;gap:8px;flex-direction:row;background-color:var(--md-sys-color-surface-container)}:host([layout=bar]) ::slotted(md-navigation-item){padding:12px 0 16px;width:100%}:host([layout=rail]){height:100%;width:auto;align-items:center;padding:16px 12px;gap:12px;flex-direction:column}:host([layout=drawer]){flex-direction:column}:host([layout=drawer]) ::slotted(md-navigation-headline){display:none}:host([layout=drawer]) ::slotted(md-divider){margin-top:0;margin-bottom:0;display:inline-flex;margin-inline-start:16px;margin-inline-end:24px;border-color:var(--md-sys-color-outline)}:host([layout=drawer]) ::slotted(md-navigation-headline){display:inline-flex}\n"] }]
        }], ctorParameters: () => [] });

class NavigationHeadlineComponent extends MaterialDesignComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: NavigationHeadlineComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.9", type: NavigationHeadlineComponent, isStandalone: true, selector: "md-navigation-headline", usesInheritance: true, ngImport: i0, template: "<slot></slot>", styles: [":host{display:inline-flex;height:56px;align-items:center;margin-inline-start:16px;font-size:var(--md-sys-typescale-title-small-size);font-weight:var(--md-sys-typescale-title-small-weight);font-family:var(--md-sys-typescale-title-small-font)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: NavigationHeadlineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-navigation-headline', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [], hostDirectives: [], host: {}, template: "<slot></slot>", styles: [":host{display:inline-flex;height:56px;align-items:center;margin-inline-start:16px;font-size:var(--md-sys-typescale-title-small-size);font-weight:var(--md-sys-typescale-title-small-weight);font-family:var(--md-sys-typescale-title-small-font)}\n"] }]
        }] });

class SegmentedButtonComponent extends MaterialDesignValueAccessorComponent {
    selected = model(false);
    type = model('button');
    name = model();
    value = model();
    badgeDot = model(false);
    badgeNumber = model();
    checkOnSelected = model(false);
    checked = computed(() => this.value() === true);
    selectedOrChecked = computed(() => this.selected() || this.checked());
    leadingSlot = this.slotDirective('leading');
    trailingSlot = this.slotDirective('trailing');
    _button = viewChild('button');
    _input = viewChild('input');
    input = computed(() => this.type() === 'button' ? this._button() : this._input());
    constructor() {
        super();
        attachTarget(ForwardFocusDirective, this.input);
        attachTarget(ParentActivationDirective, this.input);
    }
    onInput(event) {
        const target = event.target;
        this.value.set(target.checked);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SegmentedButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: SegmentedButtonComponent, isStandalone: true, selector: "md-segmented-button", inputs: { selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, badgeDot: { classPropertyName: "badgeDot", publicName: "badgeDot", isSignal: true, isRequired: false, transformFunction: null }, badgeNumber: { classPropertyName: "badgeNumber", publicName: "badgeNumber", isSignal: true, isRequired: false, transformFunction: null }, checkOnSelected: { classPropertyName: "checkOnSelected", publicName: "checkOnSelected", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selected: "selectedChange", type: "typeChange", name: "nameChange", value: "valueChange", badgeDot: "badgeDotChange", badgeNumber: "badgeNumberChange", checkOnSelected: "checkOnSelectedChange" }, host: { properties: { "attr.disabled": "disabled() || null", "attr.selected": "selectedOrChecked() || null", "attr.leading": "leadingSlot()?.any() || selectedOrChecked() && checkOnSelected() || null", "attr.trailing": "trailingSlot()?.any() || badgeDot() || !!badgeNumber() || null" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                multi: true,
                useExisting: forwardRef(() => SegmentedButtonComponent),
            },
        ], viewQueries: [{ propertyName: "_button", first: true, predicate: ["button"], descendants: true, isSignal: true }, { propertyName: "_input", first: true, predicate: ["input"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: ParentActivationDirective }, { directive: ForwardFocusDirective }], ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  @if (selectedOrChecked() && checkOnSelected()) {\n  <md-icon [filled]=\"true\">check</md-icon>\n  } @else {\n  <slot name=\"leading\"></slot>\n  }\n  <span class=\"label\">\n    <slot></slot>\n  </span>\n  @if (!disabled() && (badgeDot() || !!badgeNumber())) {\n  <md-badge [embedded]=\"true\" [dot]=\"badgeDot()\" [number]=\"badgeNumber()\" />\n  } @else {\n  <slot name=\"trailing\"></slot>\n  }\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"input()\" />\n<md-ripple part=\"ripple\" [target]=\"input()\" />\n\n@if (type() === 'button') {\n<button part=\"button\" #button type=\"button\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n@if (type() !== 'button') {\n<ng-container *ngTemplateOutlet=\"content\" />\n<input #input [type]=\"type()\" [disabled]=\"disabled()\" [checked]=\"checked()\" (change)=\"onInput($event)\">\n}", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;height:40px;gap:8px;cursor:pointer;place-content:center;place-items:center;-webkit-user-select:none;user-select:none;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);transition-property:background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);padding-inline:24px;background-color:transparent;color:var(--md-sys-color-surface-variant-on);border-color:var(--md-sys-color-outline);border-style:solid;border-top-width:1px;border-bottom-width:1px}:host md-icon,:host ::slotted(md-icon){--md-comp-icon-size: 18}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .label{text-wrap:nowrap}:host input{appearance:none;position:absolute;inset:0;border-radius:inherit;outline:0;cursor:pointer}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host(:first-child:last-child){border-radius:var(--md-sys-shape-full);border-inline-width:1px}:host(:first-child:not(:last-child)){border-radius:var(--md-sys-shape-full-start);border-inline-start-width:1px;border-inline-end-width:.5px}:host(:not(:first-child):not(:last-child)){border-inline-width:.5px}:host(:not(:first-child):last-child){border-radius:var(--md-sys-shape-full-end);border-inline-start-width:.5px;border-inline-end-width:1px}:host([leading=true]){padding-inline-start:16px}:host([trailing=true]){padding-inline-end:16px}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}\n"], dependencies: [{ kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: BadgeComponent, selector: "md-badge", inputs: ["dot", "number", "embedded"], outputs: ["dotChange", "numberChange", "embeddedChange"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SegmentedButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-segmented-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, standalone: true, imports: [
                        TouchAreaComponent,
                        RippleComponent,
                        FocusRingComponent,
                        CommonModule,
                        BadgeComponent,
                        IconComponent,
                    ], hostDirectives: [ParentActivationDirective, ForwardFocusDirective], host: {
                        '[attr.disabled]': 'disabled() || null',
                        '[attr.selected]': 'selectedOrChecked() || null',
                        '[attr.leading]': 'leadingSlot()?.any() || selectedOrChecked() && checkOnSelected() || null',
                        '[attr.trailing]': 'trailingSlot()?.any() || badgeDot() || !!badgeNumber() || null',
                    }, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            multi: true,
                            useExisting: forwardRef(() => SegmentedButtonComponent),
                        },
                    ], template: "<ng-template #content>\n  <md-touch-area />\n  @if (selectedOrChecked() && checkOnSelected()) {\n  <md-icon [filled]=\"true\">check</md-icon>\n  } @else {\n  <slot name=\"leading\"></slot>\n  }\n  <span class=\"label\">\n    <slot></slot>\n  </span>\n  @if (!disabled() && (badgeDot() || !!badgeNumber())) {\n  <md-badge [embedded]=\"true\" [dot]=\"badgeDot()\" [number]=\"badgeNumber()\" />\n  } @else {\n  <slot name=\"trailing\"></slot>\n  }\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"input()\" />\n<md-ripple part=\"ripple\" [target]=\"input()\" />\n\n@if (type() === 'button') {\n<button part=\"button\" #button type=\"button\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}\n\n@if (type() !== 'button') {\n<ng-container *ngTemplateOutlet=\"content\" />\n<input #input [type]=\"type()\" [disabled]=\"disabled()\" [checked]=\"checked()\" (change)=\"onInput($event)\">\n}", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;height:40px;gap:8px;cursor:pointer;place-content:center;place-items:center;-webkit-user-select:none;user-select:none;font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font);transition-property:background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);padding-inline:24px;background-color:transparent;color:var(--md-sys-color-surface-variant-on);border-color:var(--md-sys-color-outline);border-style:solid;border-top-width:1px;border-bottom-width:1px}:host md-icon,:host ::slotted(md-icon){--md-comp-icon-size: 18}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host .label{text-wrap:nowrap}:host input{appearance:none;position:absolute;inset:0;border-radius:inherit;outline:0;cursor:pointer}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host(:first-child:last-child){border-radius:var(--md-sys-shape-full);border-inline-width:1px}:host(:first-child:not(:last-child)){border-radius:var(--md-sys-shape-full-start);border-inline-start-width:1px;border-inline-end-width:.5px}:host(:not(:first-child):not(:last-child)){border-inline-width:.5px}:host(:not(:first-child):last-child){border-radius:var(--md-sys-shape-full-end);border-inline-start-width:.5px;border-inline-end-width:1px}:host([leading=true]){padding-inline-start:16px}:host([trailing=true]){padding-inline-end:16px}:host([selected=true]){background-color:var(--md-sys-color-secondary-container);color:var(--md-sys-color-secondary-container-on)}:host([selected=true][disabled=true]){background-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-background-color) * 100%))}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%));border-color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-border-color) * 100%))}\n"] }]
        }], ctorParameters: () => [] });

class SegmentedButtonSetComponent extends MaterialDesignComponent {
    type = model('button');
    constructor() {
        super();
        this.setSlots(SegmentedButtonComponent, (x) => x.type.set(this.type()));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SegmentedButtonSetComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: SegmentedButtonSetComponent, isStandalone: true, selector: "md-segmented-button-set", inputs: { type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { type: "typeChange" }, usesInheritance: true, ngImport: i0, template: "<slot></slot>", styles: [":host{display:inline-flex}:host ::slotted(md-segmented-button){flex:1}\n"], dependencies: [{ kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SegmentedButtonSetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-segmented-button-set', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [SlotDirective], hostDirectives: [], host: {}, template: "<slot></slot>", styles: [":host{display:inline-flex}:host ::slotted(md-segmented-button){flex:1}\n"] }]
        }], ctorParameters: () => [] });

class SheetComponent extends MaterialDesignComponent {
    modal = model(false);
    open = model(false);
    returnValue = model();
    cancel = output();
    position = model('start');
    maxWidth = model();
    iconSlot = this.slotDirective('icon');
    headlineSlot = this.slotDirective('headline');
    supportingtext = this.slotDirective('supportingText');
    actionSlot = this.slotDirective('action');
    maxWidthPx = computed(() => this.maxWidth() &&
        (this.position() === 'start' || this.position() === 'end')
        ? `${this.maxWidth()}px`
        : '100%');
    maxHeight = model();
    maxHeightPx = computed(() => this.maxHeight() &&
        (this.position() === 'top' || this.position() === 'bottom')
        ? `${this.maxHeight()}px`
        : '100%');
    _openClose$ = openClose(this.open, 'long2', 'short4');
    state = toSignal(this._openClose$, {
        initialValue: 'closed',
    });
    stateChange = output();
    _embeddedAnimations = computed(() => {
        if (this.modal()) {
            return [];
        }
        const maxWidth = this.maxWidthPx();
        const maxHeight = this.maxHeightPx();
        return [
            new Animator('opening', {
                keyframes: () => {
                    return { maxWidth, maxHeight };
                },
                options: { duration: 'long1', easing: 'standardDecelerate' },
            }),
            new Animator('closing', {
                keyframes: () => {
                    if (this.position() === 'top' || this.position() === 'bottom') {
                        return { maxHeight: 0 };
                    }
                    return { maxWidth: 0 };
                },
                options: { duration: 'short3', easing: 'standardAccelerate' },
            }),
        ];
    });
    _dialog = viewChild('dialog');
    getTranslate(amount) {
        const func = this.position() === 'top' || this.position() === 'bottom'
            ? 'translateY'
            : 'translateX';
        const percentageNumber = this.position() === 'start' || this.position() === 'top'
            ? amount * -1
            : amount;
        const percentage = amount === 0 ? 0 : percentageNumber + '%';
        return `${func}(${percentage})`;
    }
    _dialogAnimations = {
        dialog: [
            new Animator('opening', {
                keyframes: () => ({
                    transform: [this.getTranslate(100), this.getTranslate(0)],
                }),
                options: { duration: 'long1', easing: 'emphasizedDecelerate' },
            }),
            new Animator('closing', {
                keyframes: () => ({
                    transform: [this.getTranslate(0), this.getTranslate(100)],
                }),
                options: { duration: 'short3', easing: 'emphasizedAccelerate' },
            }),
        ],
        scrim: [
            new Animator('opening', {
                keyframes: { opacity: 0.32 },
                options: { duration: 'long1', easing: 'emphasizedDecelerate' },
            }),
            new Animator('closing', {
                keyframes: { opacity: 0 },
                options: { duration: 'short3', easing: 'emphasizedAccelerate' },
            }),
        ],
    };
    _isModalOpen = false;
    constructor() {
        super();
        effect(() => this.stateChange.emit(this.state()));
        animationContext(computed(() => (this.modal() ? this._dialogAnimations : {})));
        animation(this.state, this._embeddedAnimations);
        toObservable(this.modal)
            .pipe(skip(1), map(() => [
            ...this._embeddedAnimations(),
            ...Object.values(this._dialogAnimations).flat(),
        ]), tap((x) => {
            for (const animator of x) {
                animator.stop();
            }
        }))
            .subscribe();
        combineLatest({
            state: toObservable(this.state),
            modal: toObservable(this.modal),
        })
            .pipe(filter(({ modal }) => modal), tap(({ state }) => {
            const openModal = () => {
                this._document.body.style.overflow = 'hidden';
                if (isPlatformBrowser(this.platformId)) {
                    this._dialog()?.nativeElement.showModal();
                    this._isModalOpen = true;
                }
            };
            if (state === 'opened' && !this._isModalOpen) {
                openModal();
            }
            if (state === 'opening') {
                openModal();
            }
            if (state === 'closed') {
                this._document.body.style.overflow = '';
                if (isPlatformBrowser(this.platformId)) {
                    this._dialog()?.nativeElement.close();
                    this._isModalOpen = false;
                }
            }
        }))
            .subscribe();
    }
    _document = inject(DOCUMENT);
    _nextClickIsFromContent = false;
    _escapePressedWithoutCancel = false;
    onDialogCancel(event) {
        event.preventDefault();
        this._escapePressedWithoutCancel = false;
        this.open.set(false);
    }
    onDialogClose() {
        if (!this._escapePressedWithoutCancel) {
            this.cancel.emit();
        }
        this._escapePressedWithoutCancel = false;
        this._dialog()?.nativeElement?.dispatchEvent(new Event('cancel', { cancelable: true }));
    }
    onDialogKeyDown(event) {
        if (event.key !== 'Escape') {
            return;
        }
        this._escapePressedWithoutCancel = true;
        setTimeout(() => (this._escapePressedWithoutCancel = false));
    }
    onDialogClick() {
        if (this._nextClickIsFromContent) {
            this._nextClickIsFromContent = false;
            return;
        }
        this.cancel.emit();
        this.open.set(false);
    }
    onContainerContentClick() {
        this._nextClickIsFromContent = true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SheetComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: SheetComponent, isStandalone: true, selector: "md-sheet", inputs: { modal: { classPropertyName: "modal", publicName: "modal", isSignal: true, isRequired: false, transformFunction: null }, open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, returnValue: { classPropertyName: "returnValue", publicName: "returnValue", isSignal: true, isRequired: false, transformFunction: null }, position: { classPropertyName: "position", publicName: "position", isSignal: true, isRequired: false, transformFunction: null }, maxWidth: { classPropertyName: "maxWidth", publicName: "maxWidth", isSignal: true, isRequired: false, transformFunction: null }, maxHeight: { classPropertyName: "maxHeight", publicName: "maxHeight", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { modal: "modalChange", open: "openChange", returnValue: "returnValueChange", cancel: "cancel", position: "positionChange", maxWidth: "maxWidthChange", maxHeight: "maxHeightChange", stateChange: "stateChange" }, host: { properties: { "attr.position": "position()", "attr.state": "state()", "attr.modal": "modal() || null", "attr.icon": "iconSlot()?.any() || null", "attr.headline": "headlineSlot()?.any() || null", "attr.supportingText": "supportingtext()?.any() || null", "attr.actions": "actionSlot()?.any() || null", "style.--md-comp-sheet-width": "maxWidthPx() ?? null", "style.--md-comp-sheet-height": "maxHeightPx() ?? null" } }, viewQueries: [{ propertyName: "_dialog", first: true, predicate: ["dialog"], descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: AnimationContextDirective }, { directive: AnimationDirective }], ngImport: i0, template: "@if (modal()) {\n<div mdAnimation=\"scrim\" [mdAnimationState]=\"state()\" part=\"scrim\" class=\"scrim\"></div>\n<dialog mdAnimation=\"dialog\" [mdAnimationState]=\"state()\" part=\"dialog\" #dialog [returnValue]=\"returnValue() || null\"\n  (cancel)=\"onDialogCancel($event)\" (click)=\"onDialogClick()\" (close)=\"onDialogClose()\"\n  (keydown)=\"onDialogKeyDown($event)\">\n  <div part=\"container\" mdAnimation=\"container\" [mdAnimationState]=\"state()\" class=\"container\">\n    <md-elevation part=\"elevation\" [level]=\"3\" />\n    <div part=\"container-content\" class=\"container-content\" (click)=\"onContainerContentClick()\">\n      <div part=\"header\" class=\"header\">\n        <div part=\"icon\" class=\"icon\">\n          <slot name=\"icon\"></slot>\n        </div>\n        <div part=\"headline\" class=\"headline\">\n          <slot name=\"headline\"></slot>\n        </div>\n        <div part=\"supporting-text\" class=\"supporting-text\">\n          <slot #supportingTextSlot name=\"supporting-text\"></slot>\n        </div>\n      </div>\n      <div class=\"scroller\">\n        <div part=\"content\" class=\"content\">\n          <slot></slot>\n        </div>\n      </div>\n      <div part=\"actions\" #actions class=\"actions\">\n        <slot name=\"action\"></slot>\n      </div>\n    </div>\n  </div>\n</dialog>\n} @else {\n<div #containerContent part=\"container-content\" class=\"container-content\">\n  <div part=\"header\" class=\"header\">\n    <div part=\"icon\" class=\"icon\">\n      <slot name=\"icon\"></slot>\n    </div>\n    <div part=\"headline\" class=\"headline\">\n      <slot name=\"headline\"></slot>\n    </div>\n    <div part=\"supporting-text\" class=\"supporting-text\">\n      <slot #supportingTextSlot name=\"supporting-text\"></slot>\n    </div>\n  </div>\n  <div part=\"content\" class=\"content\">\n    <slot></slot>\n  </div>\n  <div part=\"actions\" #actions class=\"actions\">\n    <slot name=\"action\"></slot>\n  </div>\n</div>\n}", styles: [":host(:not([modal=true])){--md-comp-sheet-width: unset;--md-comp-sheet-height: unset;flex-shrink:0;flex-grow:0;max-width:0;overflow:hidden;display:none}:host(:not([modal=true])) .container-content{position:relative;border-radius:inherit;display:inline-flex;flex-direction:column;gap:24px;flex-shrink:0;width:var(--md-comp-sheet-width);height:var(--md-comp-sheet-height)}:host(:not([modal=true]):not([state=closed])){display:inline-flex}:host(:not([modal=true])[state=opened]){max-width:var(--md-comp-sheet-min-width)}:host([modal=true]:not([state=closed])) .scrim{display:block}:host([modal=true][state=opened]){transform:translate(0)}:host([modal=true][state=opened]) .scrim{opacity:.32}:host([modal=true]){min-height:140px;min-width:280px;display:contents;margin:auto;position:fixed;height:fit-content;width:fit-content;transform:unset}:host([modal=true]) dialog{background:transparent;border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit;color:var(--md-sys-color-surface-on)}:host([modal=true]) dialog[open]{display:inline-flex}:host([modal=true]) ::backdrop{background:none}:host([modal=true]) .scrim{display:none;inset:0;opacity:0;position:fixed;z-index:var(--md-sys-z-index-scrim);background:var(--md-sys-color-scrim)}:host([modal=true]) .container{position:relative;border-radius:inherit;display:inline-flex;flex-direction:column;background-color:var(--md-sys-color-surface-container)}:host([modal=true]) .container-content{position:relative;border-radius:inherit;display:inline-flex;flex-direction:column;gap:24px;overflow:hidden;padding:24px;height:100%}:host([modal=true]) .scroller{display:inline-flex;overflow-y:auto;flex-direction:column}:host([modal=true][position=start]){max-width:min(400px,100% - 48px);max-height:100%;margin-top:0;margin-bottom:0;margin-inline:0 auto}:host([modal=true][position=start]) .container{border-radius:var(--md-sys-shape-extra-large-end);height:100dvh}:host([modal=true][position=start]) .actions{justify-content:flex-end}:host([modal=true][position=top]){max-width:min(640px,100%);max-height:100%;margin-top:0;margin-bottom:auto;margin-inline:auto}:host([modal=true][position=top]) .container{border-radius:var(--md-sys-shape-extra-large-bottom);max-height:calc(100dvh - 72px)}:host([modal=true][position=top]) .actions{justify-content:flex-end}:host([modal=true][position=end]){max-width:min(400px,100% - 48px);max-height:100%;margin-top:0;margin-bottom:0;margin-inline:auto 0}:host([modal=true][position=end]) .container{border-radius:var(--md-sys-shape-extra-large-start);height:100dvh}:host([modal=true][position=end]) .actions{justify-content:flex-start}:host([modal=true][position=bottom]){max-width:min(640px,100%);max-height:revert;margin-top:auto;margin-bottom:0;margin-inline:auto}:host([modal=true][position=bottom]) .container{border-radius:var(--md-sys-shape-extra-large-top);max-height:calc(100dvh - 72px)}:host([modal=true][position=bottom]) .actions{justify-content:flex-end}:host .container-content{position:relative;border-radius:inherit;display:inline-flex;flex-direction:column;gap:24px;overflow:hidden}:host .header{display:none;flex-direction:column;width:100%;gap:16px}:host .actions{display:none;gap:8px;justify-content:flex-end}:host .content{display:inline-flex;flex-direction:column;height:min-content;position:relative}:host .headline{font-size:var(--md-sys-typescale-headline-small-size);font-weight:var(--md-sys-typescale-headline-small-weight);font-family:var(--md-sys-typescale-headline-small-font);color:var(--md-sys-color-surface-on);display:none;flex-direction:row;align-items:flex-start;gap:16px}:host .supporting-text{display:none;font-size:var(--md-sys-typescale-body-medium-size);font-weight:var(--md-sys-typescale-body-medium-weight);font-family:var(--md-sys-typescale-body-medium-font);color:var(--md-sys-color-surface-variant-on)}:host .icon{display:none;color:var(--md-sys-color-secondary)}:host .icon ::slotted(md-icon){--md-sys-icon-size: 24}:host([header=true]) .header{display:inline-flex}:host([actions=true]) .actions{margin-top:auto;display:inline-flex}:host([icon=true]) .header,:host([headline=true]) .header,:host([supportingText=true]) .header{display:inline-flex}:host([icon=true]) .icon{display:inline-flex}:host([icon=true]) .headline{flex-direction:column}:host([icon=true]) .headline,:host([icon=true]) .header{align-items:center}:host([headline=true]) .headline{display:inline-flex}:host([supportingText=true]) .supporting-text{display:inline-flex}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: AnimationDirective, selector: "[mdAnimation]", inputs: ["mdAnimation", "mdAnimationAnimators", "mdAnimationState"], outputs: ["mdAnimationChange", "mdAnimationAnimatorsChange", "mdAnimationStateChange"] }, { kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SheetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-sheet', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        CommonModule,
                        AnimationDirective,
                        ElevationComponent,
                        SlotDirective,
                    ], hostDirectives: [AnimationContextDirective, AnimationDirective], host: {
                        '[attr.position]': 'position()',
                        '[attr.state]': 'state()',
                        '[attr.modal]': 'modal() || null',
                        '[attr.icon]': `iconSlot()?.any() || null`,
                        '[attr.headline]': `headlineSlot()?.any() || null`,
                        '[attr.supportingText]': `supportingtext()?.any() || null`,
                        '[attr.actions]': `actionSlot()?.any() || null`,
                        '[style.--md-comp-sheet-width]': 'maxWidthPx() ?? null',
                        '[style.--md-comp-sheet-height]': 'maxHeightPx() ?? null',
                    }, template: "@if (modal()) {\n<div mdAnimation=\"scrim\" [mdAnimationState]=\"state()\" part=\"scrim\" class=\"scrim\"></div>\n<dialog mdAnimation=\"dialog\" [mdAnimationState]=\"state()\" part=\"dialog\" #dialog [returnValue]=\"returnValue() || null\"\n  (cancel)=\"onDialogCancel($event)\" (click)=\"onDialogClick()\" (close)=\"onDialogClose()\"\n  (keydown)=\"onDialogKeyDown($event)\">\n  <div part=\"container\" mdAnimation=\"container\" [mdAnimationState]=\"state()\" class=\"container\">\n    <md-elevation part=\"elevation\" [level]=\"3\" />\n    <div part=\"container-content\" class=\"container-content\" (click)=\"onContainerContentClick()\">\n      <div part=\"header\" class=\"header\">\n        <div part=\"icon\" class=\"icon\">\n          <slot name=\"icon\"></slot>\n        </div>\n        <div part=\"headline\" class=\"headline\">\n          <slot name=\"headline\"></slot>\n        </div>\n        <div part=\"supporting-text\" class=\"supporting-text\">\n          <slot #supportingTextSlot name=\"supporting-text\"></slot>\n        </div>\n      </div>\n      <div class=\"scroller\">\n        <div part=\"content\" class=\"content\">\n          <slot></slot>\n        </div>\n      </div>\n      <div part=\"actions\" #actions class=\"actions\">\n        <slot name=\"action\"></slot>\n      </div>\n    </div>\n  </div>\n</dialog>\n} @else {\n<div #containerContent part=\"container-content\" class=\"container-content\">\n  <div part=\"header\" class=\"header\">\n    <div part=\"icon\" class=\"icon\">\n      <slot name=\"icon\"></slot>\n    </div>\n    <div part=\"headline\" class=\"headline\">\n      <slot name=\"headline\"></slot>\n    </div>\n    <div part=\"supporting-text\" class=\"supporting-text\">\n      <slot #supportingTextSlot name=\"supporting-text\"></slot>\n    </div>\n  </div>\n  <div part=\"content\" class=\"content\">\n    <slot></slot>\n  </div>\n  <div part=\"actions\" #actions class=\"actions\">\n    <slot name=\"action\"></slot>\n  </div>\n</div>\n}", styles: [":host(:not([modal=true])){--md-comp-sheet-width: unset;--md-comp-sheet-height: unset;flex-shrink:0;flex-grow:0;max-width:0;overflow:hidden;display:none}:host(:not([modal=true])) .container-content{position:relative;border-radius:inherit;display:inline-flex;flex-direction:column;gap:24px;flex-shrink:0;width:var(--md-comp-sheet-width);height:var(--md-comp-sheet-height)}:host(:not([modal=true]):not([state=closed])){display:inline-flex}:host(:not([modal=true])[state=opened]){max-width:var(--md-comp-sheet-min-width)}:host([modal=true]:not([state=closed])) .scrim{display:block}:host([modal=true][state=opened]){transform:translate(0)}:host([modal=true][state=opened]) .scrim{opacity:.32}:host([modal=true]){min-height:140px;min-width:280px;display:contents;margin:auto;position:fixed;height:fit-content;width:fit-content;transform:unset}:host([modal=true]) dialog{background:transparent;border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit;color:var(--md-sys-color-surface-on)}:host([modal=true]) dialog[open]{display:inline-flex}:host([modal=true]) ::backdrop{background:none}:host([modal=true]) .scrim{display:none;inset:0;opacity:0;position:fixed;z-index:var(--md-sys-z-index-scrim);background:var(--md-sys-color-scrim)}:host([modal=true]) .container{position:relative;border-radius:inherit;display:inline-flex;flex-direction:column;background-color:var(--md-sys-color-surface-container)}:host([modal=true]) .container-content{position:relative;border-radius:inherit;display:inline-flex;flex-direction:column;gap:24px;overflow:hidden;padding:24px;height:100%}:host([modal=true]) .scroller{display:inline-flex;overflow-y:auto;flex-direction:column}:host([modal=true][position=start]){max-width:min(400px,100% - 48px);max-height:100%;margin-top:0;margin-bottom:0;margin-inline:0 auto}:host([modal=true][position=start]) .container{border-radius:var(--md-sys-shape-extra-large-end);height:100dvh}:host([modal=true][position=start]) .actions{justify-content:flex-end}:host([modal=true][position=top]){max-width:min(640px,100%);max-height:100%;margin-top:0;margin-bottom:auto;margin-inline:auto}:host([modal=true][position=top]) .container{border-radius:var(--md-sys-shape-extra-large-bottom);max-height:calc(100dvh - 72px)}:host([modal=true][position=top]) .actions{justify-content:flex-end}:host([modal=true][position=end]){max-width:min(400px,100% - 48px);max-height:100%;margin-top:0;margin-bottom:0;margin-inline:auto 0}:host([modal=true][position=end]) .container{border-radius:var(--md-sys-shape-extra-large-start);height:100dvh}:host([modal=true][position=end]) .actions{justify-content:flex-start}:host([modal=true][position=bottom]){max-width:min(640px,100%);max-height:revert;margin-top:auto;margin-bottom:0;margin-inline:auto}:host([modal=true][position=bottom]) .container{border-radius:var(--md-sys-shape-extra-large-top);max-height:calc(100dvh - 72px)}:host([modal=true][position=bottom]) .actions{justify-content:flex-end}:host .container-content{position:relative;border-radius:inherit;display:inline-flex;flex-direction:column;gap:24px;overflow:hidden}:host .header{display:none;flex-direction:column;width:100%;gap:16px}:host .actions{display:none;gap:8px;justify-content:flex-end}:host .content{display:inline-flex;flex-direction:column;height:min-content;position:relative}:host .headline{font-size:var(--md-sys-typescale-headline-small-size);font-weight:var(--md-sys-typescale-headline-small-weight);font-family:var(--md-sys-typescale-headline-small-font);color:var(--md-sys-color-surface-on);display:none;flex-direction:row;align-items:flex-start;gap:16px}:host .supporting-text{display:none;font-size:var(--md-sys-typescale-body-medium-size);font-weight:var(--md-sys-typescale-body-medium-weight);font-family:var(--md-sys-typescale-body-medium-font);color:var(--md-sys-color-surface-variant-on)}:host .icon{display:none;color:var(--md-sys-color-secondary)}:host .icon ::slotted(md-icon){--md-sys-icon-size: 24}:host([header=true]) .header{display:inline-flex}:host([actions=true]) .actions{margin-top:auto;display:inline-flex}:host([icon=true]) .header,:host([headline=true]) .header,:host([supportingText=true]) .header{display:inline-flex}:host([icon=true]) .icon{display:inline-flex}:host([icon=true]) .headline{flex-direction:column}:host([icon=true]) .headline,:host([icon=true]) .header{align-items:center}:host([headline=true]) .headline{display:inline-flex}:host([supportingText=true]) .supporting-text{display:inline-flex}\n"] }]
        }], ctorParameters: () => [] });

class SnackBarComponent extends MaterialDesignComponent {
    multiline = model(false);
    closeButton = model(false);
    open = model(false);
    autoDissmissTimeout = model(5000);
    actionSlot = this.slotDirective('action');
    animationTriggers = {
        container: [
            new Animator('opening', {
                style: { display: 'inline-flex' },
                keyframes: { transform: 'scaleY(100%)' },
                options: { duration: 'short4', easing: 'standardDecelerate' },
            }),
            new Animator('closing', {
                keyframes: { transform: 'scaleY(0)' },
                options: {
                    duration: 'short2',
                    easing: 'standardAccelerate',
                    delay: 'short1',
                },
            }),
            new Animator('closed', {
                style: { display: 'none', transform: 'scaleY(0)' },
            }),
        ],
        body: [
            new Animator('opening', {
                keyframes: { opacity: '1' },
                options: {
                    duration: 'short4',
                    easing: 'standardDecelerate',
                    delay: 'short3',
                },
            }),
            new Animator('closing', {
                keyframes: { opacity: '0' },
                options: { duration: 'short2', easing: 'standardAccelerate' },
            }),
        ],
    };
    _platformId = inject(PLATFORM_ID);
    _closing$ = new Subject();
    _openClose = openClose(this.open, 'long1', 'long1');
    state = toSignal(this._openClose);
    constructor() {
        super();
        this.hostElement.popover = 'manual';
        animationContext(this.animationTriggers);
        effect(() => {
            const state = this.state();
            if (state === 'opening' && isPlatformBrowser(this._platformId)) {
                this.hostElement.showPopover();
            }
            if (state === 'closed' && isPlatformBrowser(this._platformId)) {
                this.hostElement.hidePopover();
                this._closing$.next();
            }
            if (state === 'opened') {
                if (this.autoDissmissTimeout() > 0) {
                    timer(this.autoDissmissTimeout())
                        .pipe(takeUntil(this._closing$))
                        .subscribe(() => this.open.set(false));
                }
            }
        });
    }
    onActionClick() {
        this.open.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SnackBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: SnackBarComponent, isStandalone: true, selector: "md-snack-bar", inputs: { multiline: { classPropertyName: "multiline", publicName: "multiline", isSignal: true, isRequired: false, transformFunction: null }, closeButton: { classPropertyName: "closeButton", publicName: "closeButton", isSignal: true, isRequired: false, transformFunction: null }, open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, autoDissmissTimeout: { classPropertyName: "autoDissmissTimeout", publicName: "autoDissmissTimeout", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { multiline: "multilineChange", closeButton: "closeButtonChange", open: "openChange", autoDissmissTimeout: "autoDissmissTimeoutChange" }, host: { properties: { "attr.closeButton": "closeButton() || null", "attr.actions": "actionSlot()?.any() || null", "attr.multiline": "multiline() || null" } }, usesInheritance: true, hostDirectives: [{ directive: AnimationContextDirective }], ngImport: i0, template: "<div mdAnimation=\"container\" [mdAnimationState]=\"state()\" class=\"container\">\n  <md-elevation part=\"elevation\" [level]=\"2\" />\n  <div mdAnimation=\"body\" [mdAnimationState]=\"state()\" class=\"body\">\n    <div>\n      <slot></slot>\n    </div>\n    <div class=\"actions\">\n      <slot #actionSlot name=\"action\" (click)=\"onActionClick()\"></slot>\n      @if (closeButton()) {\n      <md-icon-button (click)=\"open.set(false)\">\n        close\n      </md-icon-button>\n      }\n    </div>\n  </div>\n</div>", styles: [":host{max-width:100%;min-width:280px;display:contents;margin:auto 0 0;position:fixed;height:fit-content;width:100%;z-index:var(--md-sys-z-index-snack-bar);gap:8px;padding:0 0 16px;border:0;overflow:visible;padding-inline:16px}:host .container{position:relative;background-color:var(--md-sys-color-surface-inverse);color:var(--md-sys-color-surface-inverse-on);border-radius:var(--md-sys-shape-extra-small);padding:0;margin:0;gap:inherit;display:inline-flex;flex-direction:column;width:100%;transform-origin:bottom;transform:scaleY(0)}:host .body{display:inline-flex;flex-direction:row;opacity:0;color:inherit;align-items:center;gap:inherit;padding-top:4px;padding-bottom:4px;padding-inline:16px;min-height:48px}:host .actions{gap:8px;display:inline-flex;margin-inline-start:auto}:host md-icon-button{color:inherit}:host ::slotted(md-button){color:var(--md-sys-color-primary-inverse-on)}@media screen and (min-width: 640px){:host{max-width:min(560px,100% - 48px);margin:auto auto 0}}:host([closeButton=true]) .body{padding-inline-end:4px}:host([multiline=true]) .body{flex-direction:column;align-items:flex-start}\n"], dependencies: [{ kind: "component", type: IconButtonComponent, selector: "md-icon-button", inputs: ["disabled", "type", "href", "anchorTarget", "name", "value", "progressIndeterminate", "progressValue", "progressMax", "variant", "selected", "custom", "badgeDot", "badgeNumber"], outputs: ["disabledChange", "typeChange", "hrefChange", "anchorTargetChange", "nameChange", "valueChange", "progressIndeterminateChange", "progressValueChange", "progressMaxChange", "variantChange", "selectedChange", "customChange", "badgeDotChange", "badgeNumberChange"] }, { kind: "component", type: ElevationComponent, selector: "md-elevation", inputs: ["level", "hoverable", "interactive", "dragging"], outputs: ["levelChange", "hoverableChange", "interactiveChange", "draggingChange"] }, { kind: "directive", type: AnimationDirective, selector: "[mdAnimation]", inputs: ["mdAnimation", "mdAnimationAnimators", "mdAnimationState"], outputs: ["mdAnimationChange", "mdAnimationAnimatorsChange", "mdAnimationStateChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: SnackBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-snack-bar', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [IconButtonComponent, ElevationComponent, AnimationDirective], hostDirectives: [AnimationContextDirective], host: {
                        '[attr.closeButton]': 'closeButton() || null',
                        '[attr.actions]': 'actionSlot()?.any() || null',
                        '[attr.multiline]': 'multiline() || null',
                    }, template: "<div mdAnimation=\"container\" [mdAnimationState]=\"state()\" class=\"container\">\n  <md-elevation part=\"elevation\" [level]=\"2\" />\n  <div mdAnimation=\"body\" [mdAnimationState]=\"state()\" class=\"body\">\n    <div>\n      <slot></slot>\n    </div>\n    <div class=\"actions\">\n      <slot #actionSlot name=\"action\" (click)=\"onActionClick()\"></slot>\n      @if (closeButton()) {\n      <md-icon-button (click)=\"open.set(false)\">\n        close\n      </md-icon-button>\n      }\n    </div>\n  </div>\n</div>", styles: [":host{max-width:100%;min-width:280px;display:contents;margin:auto 0 0;position:fixed;height:fit-content;width:100%;z-index:var(--md-sys-z-index-snack-bar);gap:8px;padding:0 0 16px;border:0;overflow:visible;padding-inline:16px}:host .container{position:relative;background-color:var(--md-sys-color-surface-inverse);color:var(--md-sys-color-surface-inverse-on);border-radius:var(--md-sys-shape-extra-small);padding:0;margin:0;gap:inherit;display:inline-flex;flex-direction:column;width:100%;transform-origin:bottom;transform:scaleY(0)}:host .body{display:inline-flex;flex-direction:row;opacity:0;color:inherit;align-items:center;gap:inherit;padding-top:4px;padding-bottom:4px;padding-inline:16px;min-height:48px}:host .actions{gap:8px;display:inline-flex;margin-inline-start:auto}:host md-icon-button{color:inherit}:host ::slotted(md-button){color:var(--md-sys-color-primary-inverse-on)}@media screen and (min-width: 640px){:host{max-width:min(560px,100% - 48px);margin:auto auto 0}}:host([closeButton=true]) .body{padding-inline-end:4px}:host([multiline=true]) .body{flex-direction:column;align-items:flex-start}\n"] }]
        }], ctorParameters: () => [] });

class TabComponent extends MaterialDesignComponent {
    secondary = model(false);
    disabled = model(false);
    href = model();
    anchorTarget = model();
    name = model();
    value = model();
    selected = model(false);
    selected$ = toObservable(this.selected);
    labelSlot = this.slotDirective('label');
    _label = viewChild('label');
    contentWidth = computed(() => {
        const icon = this.defaultSlot()?.elements()[0];
        this.labelSlot();
        const secondary = this.secondary();
        const label = this._label()?.nativeElement;
        if (secondary) {
            return this.hostElement.offsetWidth;
        }
        const iconWidth = icon ? icon.offsetWidth : 0;
        const labelWidth = label ? label.offsetWidth : 0;
        return Math.max(iconWidth, labelWidth) + 8;
    });
    button = viewChild('button');
    click() {
        this.selected.set(true);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TabComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: TabComponent, isStandalone: true, selector: "md-tab", inputs: { secondary: { classPropertyName: "secondary", publicName: "secondary", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, anchorTarget: { classPropertyName: "anchorTarget", publicName: "anchorTarget", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { secondary: "secondaryChange", disabled: "disabledChange", href: "hrefChange", anchorTarget: "anchorTargetChange", name: "nameChange", value: "valueChange", selected: "selectedChange" }, host: { listeners: { "click": "click()" }, properties: { "attr.selected": "selected() || null", "attr.secondary": "secondary() || null", "attr.disabled": "disabled() || null" } }, viewQueries: [{ propertyName: "_label", first: true, predicate: ["label"], descendants: true, isSignal: true }, { propertyName: "button", first: true, predicate: ["button"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #content>\n  <md-touch-area />\n  <slot></slot>\n  <span #label part=\"label\">\n    <slot name=\"label\"></slot>\n  </span>\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button type=\"button\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;flex-direction:column;cursor:pointer;flex-grow:1;transition-property:background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);place-content:center;place-items:center;gap:4px;padding-top:8px;padding-bottom:8px;padding-inline:24px;font-size:var(--md-sys-typescale-title-small-size);font-weight:var(--md-sys-typescale-title-small-weight);font-family:var(--md-sys-typescale-title-small-font)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);flex-direction:inherit}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host([selected]){color:var(--md-sys-color-primary);pointer-events:none}:host([selected]) ::slotted(md-icon){--md-comp-icon-filled: 1}:host([secondary=true]){flex-direction:row;gap:8px}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"], dependencies: [{ kind: "component", type: TouchAreaComponent, selector: "md-touch-area" }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }, { kind: "component", type: FocusRingComponent, selector: "md-focus-ring", inputs: ["focusVisible"], outputs: ["focusVisibleChange"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TabComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-tab', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        TouchAreaComponent,
                        SlotDirective,
                        FocusRingComponent,
                        RippleComponent,
                        CommonModule,
                    ], hostDirectives: [], host: {
                        '[attr.selected]': 'selected() || null',
                        '[attr.secondary]': 'secondary() || null',
                        '[attr.disabled]': 'disabled() || null',
                    }, template: "<ng-template #content>\n  <md-touch-area />\n  <slot></slot>\n  <span #label part=\"label\">\n    <slot name=\"label\"></slot>\n  </span>\n</ng-template>\n\n<md-focus-ring part=\"focus-ring\" [target]=\"button()\" />\n<md-ripple part=\"ripple\" [target]=\"button()\" />\n@if (href()) {\n<a part=\"button\" #button [attr.href]=\"href() ?? null\" [attr.target]=\"anchorTarget() ?? null\"\n  [tabIndex]=\"disabled() ? -1 : 0\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</a>\n} @else {\n<button part=\"button\" #button type=\"button\" [disabled]=\"disabled() || null\" [attr.name]=\"name() ?? null\"\n  [attr.value]=\"value() ?? null\">\n  <ng-container *ngTemplateOutlet=\"content\" />\n</button>\n}", styles: [":host{--_color: currentColor;position:relative;display:inline-flex;flex-direction:column;cursor:pointer;flex-grow:1;transition-property:background-color,color,border-color;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);place-content:center;place-items:center;gap:4px;padding-top:8px;padding-bottom:8px;padding-inline:24px;font-size:var(--md-sys-typescale-title-small-size);font-weight:var(--md-sys-typescale-title-small-weight);font-family:var(--md-sys-typescale-title-small-font)}:host button,:host a{background-color:transparent;display:inherit;font:inherit;color:inherit;padding:0;margin:0;gap:inherit;text-decoration:none;border-radius:inherit;appearance:none;border:0;outline:none;cursor:pointer;align-items:center;transition-property:opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard);flex-direction:inherit}:host md-ripple{--md-comp-ripple-color: var(--_color)}:host([selected]){color:var(--md-sys-color-primary);pointer-events:none}:host([selected]) ::slotted(md-icon){--md-comp-icon-filled: 1}:host([secondary=true]){flex-direction:row;gap:8px}:host([disabled=true]){pointer-events:none;cursor:default;color:color-mix(in oklab,transparent,var(--md-sys-color-surface-on) calc(var(--md-sys-disabled-color) * 100%))}\n"] }]
        }], propDecorators: { click: [{
                type: HostListener,
                args: ['click']
            }] } });

class TabsComponent extends MaterialDesignComponent {
    secondary = model(false);
    selectedTab$ = toObservable(this.defaultSlot).pipe(filter((x) => !!x), map((slots) => slots
        .componentsOf(TabComponent)
        .map((tab) => tab.selected$.pipe(map((selected) => ({ tab, selected }))))), switchMap((tabs) => merge(...tabs)), filter((x) => x.selected), map((x) => x.tab));
    selectedTab = toSignal(this.selectedTab$.pipe(startWith(undefined), pairwise(), tap(([previous]) => previous?.selected?.set(false)), 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_, current]) => current)));
    indicatorStyle = computed(() => {
        const selectedTab = this.selectedTab();
        const secondary = this.secondary();
        if (!selectedTab) {
            return {
                marginInlineStart: '0',
                width: '0',
                opacity: '0',
            };
        }
        const left = secondary
            ? selectedTab.hostElement.offsetLeft
            : selectedTab.hostElement.offsetLeft +
                selectedTab.hostElement.offsetWidth / 2 -
                selectedTab.contentWidth() / 2;
        return {
            marginInlineStart: `${left - 16}px`,
            width: `${selectedTab.contentWidth()}px`,
        };
    });
    constructor() {
        super();
        this.setSlots(TabComponent, (x) => x.secondary.set(this.secondary()));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TabsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: TabsComponent, isStandalone: true, selector: "md-tabs", inputs: { secondary: { classPropertyName: "secondary", publicName: "secondary", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { secondary: "secondaryChange" }, host: { properties: { "attr.secondary": "secondary() || null" } }, usesInheritance: true, ngImport: i0, template: "<div class=\"tabs\">\n  <slot></slot>\n</div>\n<div class=\"indicator\" [ngStyle]=\"indicatorStyle()\"></div>", styles: [":host{display:inline-flex;flex-direction:column}:host .tabs{display:inline-flex;width:100%}:host .indicator{background-color:var(--md-sys-color-primary);border-radius:3 3 0 0;height:3px;transition-property:margin-inline-start,width,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([secondary=true]) .indicator{border-radius:0;height:2px}\n"], dependencies: [{ kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TabsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-tabs', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [SlotDirective, CommonModule], hostDirectives: [], host: {
                        '[attr.secondary]': 'secondary() || null',
                    }, template: "<div class=\"tabs\">\n  <slot></slot>\n</div>\n<div class=\"indicator\" [ngStyle]=\"indicatorStyle()\"></div>", styles: [":host{display:inline-flex;flex-direction:column}:host .tabs{display:inline-flex;width:100%}:host .indicator{background-color:var(--md-sys-color-primary);border-radius:3 3 0 0;height:3px;transition-property:margin-inline-start,width,opacity;transition-duration:var(--md-sys-motion-duration-short-4);transition-timing-function:var(--md-sys-motion-easing-standard)}:host([secondary=true]) .indicator{border-radius:0;height:2px}\n"] }]
        }], ctorParameters: () => [] });

class TextFieldComponent extends MaterialDesignValueAccessorComponent {
    value = model();
    variant = model('filled');
    type = model('text');
    prefix = model();
    suffix = model();
    label = model();
    supportingText = model();
    maxLength = model();
    hasDropdown = model(false);
    selectedItemToTextFn = (value) => value;
    _input = viewChild('input');
    _field = viewChild(FieldComponent);
    counterText = computed(() => this.maxLength() && this._input()?.nativeElement
        ? `${this.value()?.length ?? 0}/${this.maxLength()}`
        : undefined);
    populated = toSignal(combineLatest({
        focused: merge(toObservable(this._input).pipe(filter((x) => !!x?.nativeElement), switchMap((x) => fromEvent(x.nativeElement, 'focus').pipe(map(() => true)))), toObservable(this._input).pipe(filter((x) => !!x?.nativeElement), switchMap((x) => fromEvent(x.nativeElement, 'blur').pipe(map(() => false))))),
        hasValue: toObservable(this.value).pipe(map((x) => !!x)),
    }).pipe(map((x) => x.focused || x.hasValue)));
    constructor() {
        super();
        attachTarget(ForwardFocusDirective, this._input);
        this.setSlots(ListItemComponent, (x) => {
            x.type.set('button');
            x.selected.set(x.value() === this.value());
        });
    }
    onContentClick() {
        this._input()?.nativeElement.focus();
    }
    onInput(event) {
        if (this.type() === 'text-area') {
            const target = event.target;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
        }
        if (this.hasDropdown()) {
            if (!this._field()?.popover()?.open()) {
                this._field().popover().open.set(true);
            }
        }
    }
    onItemClick(event) {
        const item = MaterialDesignComponent.get(event.target);
        this.value.set(this.selectedItemToTextFn(item.value()));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TextFieldComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: TextFieldComponent, isStandalone: true, selector: "md-text-field", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, prefix: { classPropertyName: "prefix", publicName: "prefix", isSignal: true, isRequired: false, transformFunction: null }, suffix: { classPropertyName: "suffix", publicName: "suffix", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, supportingText: { classPropertyName: "supportingText", publicName: "supportingText", isSignal: true, isRequired: false, transformFunction: null }, maxLength: { classPropertyName: "maxLength", publicName: "maxLength", isSignal: true, isRequired: false, transformFunction: null }, hasDropdown: { classPropertyName: "hasDropdown", publicName: "hasDropdown", isSignal: true, isRequired: false, transformFunction: null }, selectedItemToTextFn: { classPropertyName: "selectedItemToTextFn", publicName: "selectedItemToTextFn", isSignal: false, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange", variant: "variantChange", type: "typeChange", prefix: "prefixChange", suffix: "suffixChange", label: "labelChange", supportingText: "supportingTextChange", maxLength: "maxLengthChange", hasDropdown: "hasDropdownChange" }, host: { attributes: { "tabindex": "0" }, properties: { "attr.disabled": "disabled() || null" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                multi: true,
                useExisting: forwardRef(() => TextFieldComponent),
            },
        ], viewQueries: [{ propertyName: "_input", first: true, predicate: ["input"], descendants: true, isSignal: true }, { propertyName: "_field", first: true, predicate: FieldComponent, descendants: true, isSignal: true }], usesInheritance: true, hostDirectives: [{ directive: ForwardFocusDirective }], ngImport: i0, template: "<md-field [variant]=\"variant()\" [populated]=\"!!populated()\" [errorText]=\"errorText()\" [label]=\"label()\"\n  (contentClick)=\"onContentClick()\" [disabled]=\"disabled()\" popoverTrigger=\"manual\" [maxPopoverHeight]=\"300\">\n  <slot name=\"leading\" slot=\"leading\"></slot>\n\n  <slot name=\"prefix\" slot=\"prefix\"></slot>\n  <slot name=\"suffix\" slot=\"suffix\"></slot>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n\n  @if (counterText()) {\n  <span slot=\"counter\">{{ counterText() }}</span>\n  }\n\n  @if (type() === 'text-area') {\n  <textarea #input [ngModel]=\"value()\" (ngModelChange)=\"value.set($event)\" rows=\"1\" (input)=\"onInput($event)\"\n    [disabled]=\"disabled()\"></textarea>\n  } @else {\n  <input #input [ngModel]=\"value()\" (ngModelChange)=\"value.set($event)\" [type]=\"type()\" [disabled]=\"disabled()\"\n    (input)=\"onInput($event)\">\n  }\n  <slot name=\"trailing\" slot=\"trailing\"></slot>\n  @if (hasDropdown()) {\n  <md-list slot=\"popover\">\n    <slot (click)=\"onItemClick($event)\"></slot>\n  </md-list>\n  }\n</md-field>", styles: [":host input,:host textarea{display:inline-flex;appearance:none;margin:0;padding:0;padding-inline:0;padding-block:0;border:0;outline:none;background-color:transparent;color:inherit;caret-color:inherit;resize:none;overflow:hidden;font-family:inherit;font-weight:inherit;font-size:inherit;box-sizing:border-box}:host input::placeholder,:host textarea::placeholder{color:currentColor;opacity:1}:host input::-webkit-calendar-picker-indicator,:host textarea::-webkit-calendar-picker-indicator{display:none}:host input::-webkit-search-decoration,:host input::-webkit-search-cancel-button,:host textarea::-webkit-search-decoration,:host textarea::-webkit-search-cancel-button{display:none}:host input::-webkit-inner-spin-button,:host input::-webkit-outer-spin-button,:host textarea::-webkit-inner-spin-button,:host textarea::-webkit-outer-spin-button{display:none}:host input[type=number],:host textarea[type=number]{-moz-appearance:textfield}:host md-field::part(content){cursor:text}:host([disabled=true]){pointer-events:none;cursor:default}\n"], dependencies: [{ kind: "component", type: FieldComponent, selector: "md-field", inputs: ["value", "variant", "label", "populated", "open", "popoverTrigger", "maxPopoverHeight"], outputs: ["valueChange", "variantChange", "labelChange", "populatedChange", "contentClick", "bodyClick", "openChange", "popoverTriggerChange", "maxPopoverHeightChange", "popoverStateChange"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: ListComponent, selector: "md-list" }, { kind: "directive", type: SlotDirective, selector: "slot", inputs: ["name", "slot"] }, { kind: "ngmodule", type: CommonModule }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TextFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-text-field', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        FieldComponent,
                        FormsModule,
                        ListComponent,
                        SlotDirective,
                        CommonModule,
                    ], host: {
                        '[attr.disabled]': 'disabled() || null',
                        tabindex: '0',
                    }, hostDirectives: [ForwardFocusDirective], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            multi: true,
                            useExisting: forwardRef(() => TextFieldComponent),
                        },
                    ], template: "<md-field [variant]=\"variant()\" [populated]=\"!!populated()\" [errorText]=\"errorText()\" [label]=\"label()\"\n  (contentClick)=\"onContentClick()\" [disabled]=\"disabled()\" popoverTrigger=\"manual\" [maxPopoverHeight]=\"300\">\n  <slot name=\"leading\" slot=\"leading\"></slot>\n\n  <slot name=\"prefix\" slot=\"prefix\"></slot>\n  <slot name=\"suffix\" slot=\"suffix\"></slot>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n\n  @if (counterText()) {\n  <span slot=\"counter\">{{ counterText() }}</span>\n  }\n\n  @if (type() === 'text-area') {\n  <textarea #input [ngModel]=\"value()\" (ngModelChange)=\"value.set($event)\" rows=\"1\" (input)=\"onInput($event)\"\n    [disabled]=\"disabled()\"></textarea>\n  } @else {\n  <input #input [ngModel]=\"value()\" (ngModelChange)=\"value.set($event)\" [type]=\"type()\" [disabled]=\"disabled()\"\n    (input)=\"onInput($event)\">\n  }\n  <slot name=\"trailing\" slot=\"trailing\"></slot>\n  @if (hasDropdown()) {\n  <md-list slot=\"popover\">\n    <slot (click)=\"onItemClick($event)\"></slot>\n  </md-list>\n  }\n</md-field>", styles: [":host input,:host textarea{display:inline-flex;appearance:none;margin:0;padding:0;padding-inline:0;padding-block:0;border:0;outline:none;background-color:transparent;color:inherit;caret-color:inherit;resize:none;overflow:hidden;font-family:inherit;font-weight:inherit;font-size:inherit;box-sizing:border-box}:host input::placeholder,:host textarea::placeholder{color:currentColor;opacity:1}:host input::-webkit-calendar-picker-indicator,:host textarea::-webkit-calendar-picker-indicator{display:none}:host input::-webkit-search-decoration,:host input::-webkit-search-cancel-button,:host textarea::-webkit-search-decoration,:host textarea::-webkit-search-cancel-button{display:none}:host input::-webkit-inner-spin-button,:host input::-webkit-outer-spin-button,:host textarea::-webkit-inner-spin-button,:host textarea::-webkit-outer-spin-button{display:none}:host input[type=number],:host textarea[type=number]{-moz-appearance:textfield}:host md-field::part(content){cursor:text}:host([disabled=true]){pointer-events:none;cursor:default}\n"] }]
        }], ctorParameters: () => [], propDecorators: { selectedItemToTextFn: [{
                type: Input
            }] } });

class TimePickerComponent extends MaterialDesignValueAccessorComponent {
    variant = model('embedded');
    fieldVariant = model('filled');
    label = model();
    value = model();
    selectionValue = model(this.value());
    field = viewChild('field');
    dialog = viewChild('dialog');
    hours = model(true);
    seconds = model(false);
    timeOfDay = model(false);
    locale = model('en');
    meridian = model('am');
    populated = computed(() => {
        if (this.field()?.popover()?.state() === 'closing' && !this.value()) {
            return false;
        }
        return (!!this.value() ||
            this.field()?.open() ||
            this.field()?.popover()?.state() === 'opening');
    });
    get meridianLabels() {
        return getMeridianValues(this.locale());
    }
    get valueAsTimeSpan() {
        return this.value() ? TimeSpan.parse(this.value()) : undefined;
    }
    set valueAsTimeSpan(value) {
        this.value.set(value?.toString());
    }
    get selectedValueAsTimeSpan() {
        return this.selectionValue()
            ? TimeSpan.parse(this.selectionValue())
            : undefined;
    }
    set selectedValueAsTimeSpan(value) {
        this.selectionValue.set(value?.toString());
    }
    hoursInput = signal(this.selectedValueAsTimeSpan?.hours);
    minutesInput = signal(this.selectedValueAsTimeSpan?.minutes);
    secondsInput = signal(this.selectedValueAsTimeSpan?.seconds);
    displayText = computed(() => {
        if (!this.valueAsTimeSpan) {
            return $localize `Select a time...`;
        }
        const time = this.valueAsTimeSpan.toString({
            seconds: this.seconds(),
            hours: this.hours(),
        });
        if (this.timeOfDay()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return `${time} ${this.meridianLabels[this.meridian()]}`;
        }
        return time;
    });
    constructor() {
        super();
        effect(() => {
            const hours = this.hoursInput();
            const minutes = this.minutesInput();
            const seconds = this.secondsInput();
            this.selectedValueAsTimeSpan = new TimeSpan(hours, minutes, seconds);
        }, {
            allowSignalWrites: true,
        });
        effect(() => {
            if (this.variant() === 'embedded') {
                this.value.set(this.selectionValue());
            }
        }, {
            allowSignalWrites: true,
        });
        effect(() => {
            if (this.timeOfDay()) {
                if (this.meridian() === 'am' && this.hoursInput() === 12) {
                    this.hoursInput.set(0);
                }
                else if (this.meridian() === 'pm' && this.hoursInput() === 0) {
                    this.hoursInput.set(12);
                }
            }
        }, {
            allowSignalWrites: true,
        });
    }
    clearClick() {
        this.value.set(undefined);
        this.selectionValue.set(undefined);
    }
    okayClick() {
        this.value.set(this.selectionValue());
        if (this.variant() === 'dropdown') {
            this.field()?.open.set(false);
        }
        if (this.variant() === 'dialog') {
            this.dialog()?.open.set(false);
        }
    }
    cancelClick() {
        this.selectionValue.set(this.value());
        if (this.variant() === 'dropdown') {
            this.field()?.open.set(false);
        }
        if (this.variant() === 'dialog') {
            this.dialog()?.open.set(false);
        }
    }
    bodyClick() {
        if (this.variant() !== 'dialog') {
            return;
        }
        this.dialog()?.open.set(true);
    }
    popoverStateChange(state) {
        if (state === 'closed') {
            this.cancelClick();
        }
    }
    onBeforeInput(event, part) {
        const input = event.target;
        const inputEvent = event;
        if (inputEvent.inputType === 'insertText') {
            inputEvent.preventDefault();
            const min = 0;
            const max = part === 'hours' ? 12 : 59;
            let value = parseInt(input.value + (inputEvent.data ?? '0'));
            if (this.timeOfDay() || part !== 'hours') {
                if (value < min) {
                    value = min;
                }
                if (value > max) {
                    value = max;
                }
            }
            if (part === 'hours') {
                if (this.timeOfDay() && this.meridian() === 'am' && value === 12) {
                    this.hoursInput.set(0);
                }
                else if (this.timeOfDay() &&
                    this.meridian() === 'pm' &&
                    value === 0) {
                    this.hoursInput.set(12);
                }
                else {
                    this.hoursInput.set(value);
                }
            }
            if (part === 'minutes') {
                this.minutesInput.set(value);
            }
            if (part === 'seconds') {
                this.secondsInput.set(value);
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TimePickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.9", type: TimePickerComponent, isStandalone: true, selector: "md-time-picker", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, fieldVariant: { classPropertyName: "fieldVariant", publicName: "fieldVariant", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, selectionValue: { classPropertyName: "selectionValue", publicName: "selectionValue", isSignal: true, isRequired: false, transformFunction: null }, hours: { classPropertyName: "hours", publicName: "hours", isSignal: true, isRequired: false, transformFunction: null }, seconds: { classPropertyName: "seconds", publicName: "seconds", isSignal: true, isRequired: false, transformFunction: null }, timeOfDay: { classPropertyName: "timeOfDay", publicName: "timeOfDay", isSignal: true, isRequired: false, transformFunction: null }, locale: { classPropertyName: "locale", publicName: "locale", isSignal: true, isRequired: false, transformFunction: null }, meridian: { classPropertyName: "meridian", publicName: "meridian", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { variant: "variantChange", fieldVariant: "fieldVariantChange", label: "labelChange", value: "valueChange", selectionValue: "selectionValueChange", hours: "hoursChange", seconds: "secondsChange", timeOfDay: "timeOfDayChange", locale: "localeChange", meridian: "meridianChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                multi: true,
                useExisting: forwardRef(() => TimePickerComponent),
            },
        ], viewQueries: [{ propertyName: "field", first: true, predicate: ["field"], descendants: true, isSignal: true }, { propertyName: "dialog", first: true, predicate: ["dialog"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #actions>\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" class=\"clear\" (click)=\"clearClick()\"\n    i18n>Clear</md-button>\n  @if (variant() !== 'embedded') {\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" (click)=\"okayClick()\"\n    i18n>Okay</md-button>\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" (click)=\"cancelClick()\"\n    i18n>Cancel</md-button>\n  }\n</ng-template>\n\n<ng-template #contents>\n  <div class=\"container\">\n    <div class=\"body\">\n      @if (hours()) {\n      <div class=\"input-container\">\n        <div class=\"input\">\n          <md-ripple [target]=\"hours\" [interactive]=\"false\" />\n          <input #hours type=\"number\" class=\"hours\" (beforeinput)=\"onBeforeInput($event, 'hours')\"\n            [(ngModel)]=\"hoursInput\">\n        </div>\n        <span class=\"input-label\" i18n>Hours</span>\n      </div>\n      <span class=\"separator\">:</span>\n      }\n      <div class=\"input-container\">\n        <div class=\"input\">\n          <md-ripple [target]=\"minutes\" [interactive]=\"false\" />\n          <input #minutes type=\"number\" class=\"minutes\" (beforeinput)=\"onBeforeInput($event, 'minutes')\"\n            [(ngModel)]=\"minutesInput\">\n        </div>\n        <span class=\"input-label\" i18n>Minutes</span>\n      </div>\n      @if (seconds()) {\n      <span class=\"separator\">:</span>\n      <div class=\"input-container\">\n        <div class=\"input\">\n          <md-ripple [target]=\"seconds\" [interactive]=\"false\" />\n          <input #seconds type=\"number\" class=\"seconds\" (beforeinput)=\"onBeforeInput($event, 'seconds')\"\n            [(ngModel)]=\"secondsInput\">\n        </div>\n        <span class=\"input-label\" i18n>Seconds</span>\n      </div>\n      }\n      @if (timeOfDay()) {\n      <div class=\"meridian\">\n        <md-button variant=\"plain\" [class.selected]=\"meridian() === 'am'\" (click)=\"meridian.set('am')\">\n          {{ meridianLabels.am }}\n        </md-button>\n        <md-button variant=\"plain\" [class.selected]=\"meridian() === 'pm'\" (click)=\"meridian.set('pm')\">\n          {{ meridianLabels.pm }}\n        </md-button>\n      </div>\n      }\n    </div>\n    @if (variant() !== 'dialog') {\n    <div class=\"actions\">\n      <ng-container *ngTemplateOutlet=\"actions\" />\n    </div>\n    }\n  </div>\n</ng-template>\n\n@if (variant() === 'embedded') {\n<ng-container *ngTemplateOutlet=\"contents\" />\n} @else {\n<md-field #field [variant]=\"fieldVariant()\" [populated]=\"!!populated()\" [errorText]=\"errorText()\" [label]=\"label()\"\n  [disabled]=\"disabled()\" (bodyClick)=\"bodyClick()\" (popoverStateChange)=\"popoverStateChange($event)\">\n  <slot name=\"leading\" slot=\"leading\"></slot>\n  <slot name=\"prefix\" slot=\"prefix\"></slot>\n  <slot name=\"suffix\" slot=\"suffix\"></slot>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <slot name=\"counter\" slot=\"counter\"></slot>\n  <span class=\"selected-value\">\n    {{ displayText() }}\n  </span>\n  <md-icon slot=\"trailing\">schedule</md-icon>\n  @if (variant() === 'dropdown') {\n  <div class=\"popover\" slot=\"popover\">\n    <ng-container *ngTemplateOutlet=\"contents\" />\n  </div>\n  }\n</md-field>\n@if (variant() === 'dialog') {\n<md-dialog #dialog (stateChange)=\"popoverStateChange($event)\">\n  <md-icon slot=\"icon\">schedule</md-icon>\n  <span class=\"selected-value\" slot=\"headline\" i18n>\n    Select a time...\n  </span>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <ng-container *ngTemplateOutlet=\"contents\" />\n  <ng-container *ngTemplateOutlet=\"actions\" />\n</md-dialog>\n}\n}", styles: [":host md-field::part(body){cursor:pointer}:host .popover{display:inline-flex}:host .container{display:inline-flex;flex-direction:column;isolation:isolate;flex-grow:1;background-color:var(--md-sys-color-surface-container);border-radius:var(--md-sys-shape-extra-small);padding-top:20px;padding-bottom:12px;padding-inline:12px}:host .container md-button[variant=plain]{border-inline:1px solid var(--md-sys-color-outline);height:40px}:host .container md-button[variant=plain]:first-child{border-top:1px solid var(--md-sys-color-outline);border-bottom:.5px solid var(--md-sys-color-outline);border-radius:var(--md-sys-shape-extra-small-top)}:host .container md-button[variant=plain]:last-child{border-top:.5px solid var(--md-sys-color-outline);border-bottom:1px solid var(--md-sys-color-outline);border-radius:var(--md-sys-shape-extra-small-bottom)}:host .container .body{position:relative;flex-grow:1;flex-direction:row;display:inline-flex;justify-content:center}:host .actions{display:inline-flex;justify-content:flex-end;gap:8px;flex-grow:1;margin-top:8px}:host .clear{margin-inline-end:auto}:host .selected-value{display:inline-flex;gap:8px}:host input,:host textarea{display:inline-flex;appearance:none;margin:0;padding:0;padding-inline:0;padding-block:0;border:0;outline:none;background-color:transparent;color:inherit;caret-color:inherit;resize:none;overflow:hidden;font-family:inherit;font-weight:inherit;font-size:inherit;box-sizing:border-box;height:80px;width:96px;text-align:center;border-radius:inherit}:host input::placeholder,:host textarea::placeholder{color:currentColor;opacity:1}:host input::-webkit-calendar-picker-indicator,:host textarea::-webkit-calendar-picker-indicator{display:none}:host input::-webkit-search-decoration,:host input::-webkit-search-cancel-button,:host textarea::-webkit-search-decoration,:host textarea::-webkit-search-cancel-button{display:none}:host input::-webkit-inner-spin-button,:host input::-webkit-outer-spin-button,:host textarea::-webkit-inner-spin-button,:host textarea::-webkit-outer-spin-button{display:none}:host input[type=number],:host textarea[type=number]{-moz-appearance:textfield}:host .input-container{display:inline-flex;gap:4px;flex-direction:column}:host .input-label{color:var(--md-sys-color-surface-variant-on);font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host .input{position:relative;font-size:var(--md-sys-typescale-display-large-no-rfs-size);font-weight:var(--md-sys-typescale-display-large-no-rfs-weight);font-family:var(--md-sys-typescale-display-large-no-rfs-font);caret-color:currentColor;border-radius:var(--md-sys-shape-small)}:host .hours{background-color:var(--md-sys-color-primary-container);color:var(--md-sys-color-primary-container-on)}:host .hours:focus{border:2px solid var(--md-sys-color-primary)}:host .minutes,:host .seconds{background-color:var(--md-sys-color-surface-container-highest);color:var(--md-sys-color-surface-on)}:host .minutes:focus,:host .seconds:focus{border:2px solid var(--md-sys-color-surface-on)}:host .separator{margin-inline:8px;font-size:var(--md-sys-typescale-display-large-no-rfs-size);font-weight:var(--md-sys-typescale-display-large-no-rfs-weight);font-family:var(--md-sys-typescale-display-large-no-rfs-font)}:host .meridian{display:inline-flex;flex-direction:column;margin-inline-start:16px;width:52px}:host .meridian .selected{background-color:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-tertiary-container-on)}\n"], dependencies: [{ kind: "component", type: ButtonComponent, selector: "md-button", inputs: ["variant", "disabled", "type", "href", "anchorTarget", "name", "value", "progressIndeterminate", "progressValue", "progressMax"], outputs: ["variantChange", "disabledChange", "typeChange", "hrefChange", "anchorTargetChange", "nameChange", "valueChange", "progressIndeterminateChange", "progressValueChange", "progressMaxChange"] }, { kind: "component", type: DialogComponent, selector: "md-dialog", inputs: ["returnValue", "open"], outputs: ["returnValueChange", "openChange", "cancel", "stateChange"] }, { kind: "component", type: FieldComponent, selector: "md-field", inputs: ["value", "variant", "label", "populated", "open", "popoverTrigger", "maxPopoverHeight"], outputs: ["valueChange", "variantChange", "labelChange", "populatedChange", "contentClick", "bodyClick", "openChange", "popoverTriggerChange", "maxPopoverHeightChange", "popoverStateChange"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: IconComponent, selector: "md-icon", inputs: ["filled", "size", "badgeDot", "badgeNumber", "slot"], outputs: ["filledChange", "sizeChange", "badgeDotChange", "badgeNumberChange", "slotChange"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: RippleComponent, selector: "md-ripple, [mdRipple]", inputs: ["hoverable", "interactive"], outputs: ["hoverableChange", "interactiveChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TimePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-time-picker', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [
                        ButtonComponent,
                        DialogComponent,
                        FieldComponent,
                        CommonModule,
                        IconComponent,
                        FormsModule,
                        RippleComponent,
                    ], hostDirectives: [], host: {}, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            multi: true,
                            useExisting: forwardRef(() => TimePickerComponent),
                        },
                    ], template: "<ng-template #actions>\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" class=\"clear\" (click)=\"clearClick()\"\n    i18n>Clear</md-button>\n  @if (variant() !== 'embedded') {\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" (click)=\"okayClick()\"\n    i18n>Okay</md-button>\n  <md-button [attr.slot]=\"variant() === 'dialog' ? 'action' : null\" variant=\"text\" (click)=\"cancelClick()\"\n    i18n>Cancel</md-button>\n  }\n</ng-template>\n\n<ng-template #contents>\n  <div class=\"container\">\n    <div class=\"body\">\n      @if (hours()) {\n      <div class=\"input-container\">\n        <div class=\"input\">\n          <md-ripple [target]=\"hours\" [interactive]=\"false\" />\n          <input #hours type=\"number\" class=\"hours\" (beforeinput)=\"onBeforeInput($event, 'hours')\"\n            [(ngModel)]=\"hoursInput\">\n        </div>\n        <span class=\"input-label\" i18n>Hours</span>\n      </div>\n      <span class=\"separator\">:</span>\n      }\n      <div class=\"input-container\">\n        <div class=\"input\">\n          <md-ripple [target]=\"minutes\" [interactive]=\"false\" />\n          <input #minutes type=\"number\" class=\"minutes\" (beforeinput)=\"onBeforeInput($event, 'minutes')\"\n            [(ngModel)]=\"minutesInput\">\n        </div>\n        <span class=\"input-label\" i18n>Minutes</span>\n      </div>\n      @if (seconds()) {\n      <span class=\"separator\">:</span>\n      <div class=\"input-container\">\n        <div class=\"input\">\n          <md-ripple [target]=\"seconds\" [interactive]=\"false\" />\n          <input #seconds type=\"number\" class=\"seconds\" (beforeinput)=\"onBeforeInput($event, 'seconds')\"\n            [(ngModel)]=\"secondsInput\">\n        </div>\n        <span class=\"input-label\" i18n>Seconds</span>\n      </div>\n      }\n      @if (timeOfDay()) {\n      <div class=\"meridian\">\n        <md-button variant=\"plain\" [class.selected]=\"meridian() === 'am'\" (click)=\"meridian.set('am')\">\n          {{ meridianLabels.am }}\n        </md-button>\n        <md-button variant=\"plain\" [class.selected]=\"meridian() === 'pm'\" (click)=\"meridian.set('pm')\">\n          {{ meridianLabels.pm }}\n        </md-button>\n      </div>\n      }\n    </div>\n    @if (variant() !== 'dialog') {\n    <div class=\"actions\">\n      <ng-container *ngTemplateOutlet=\"actions\" />\n    </div>\n    }\n  </div>\n</ng-template>\n\n@if (variant() === 'embedded') {\n<ng-container *ngTemplateOutlet=\"contents\" />\n} @else {\n<md-field #field [variant]=\"fieldVariant()\" [populated]=\"!!populated()\" [errorText]=\"errorText()\" [label]=\"label()\"\n  [disabled]=\"disabled()\" (bodyClick)=\"bodyClick()\" (popoverStateChange)=\"popoverStateChange($event)\">\n  <slot name=\"leading\" slot=\"leading\"></slot>\n  <slot name=\"prefix\" slot=\"prefix\"></slot>\n  <slot name=\"suffix\" slot=\"suffix\"></slot>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <slot name=\"counter\" slot=\"counter\"></slot>\n  <span class=\"selected-value\">\n    {{ displayText() }}\n  </span>\n  <md-icon slot=\"trailing\">schedule</md-icon>\n  @if (variant() === 'dropdown') {\n  <div class=\"popover\" slot=\"popover\">\n    <ng-container *ngTemplateOutlet=\"contents\" />\n  </div>\n  }\n</md-field>\n@if (variant() === 'dialog') {\n<md-dialog #dialog (stateChange)=\"popoverStateChange($event)\">\n  <md-icon slot=\"icon\">schedule</md-icon>\n  <span class=\"selected-value\" slot=\"headline\" i18n>\n    Select a time...\n  </span>\n  <slot name=\"supporting-text\" slot=\"supporting-text\"></slot>\n  <ng-container *ngTemplateOutlet=\"contents\" />\n  <ng-container *ngTemplateOutlet=\"actions\" />\n</md-dialog>\n}\n}", styles: [":host md-field::part(body){cursor:pointer}:host .popover{display:inline-flex}:host .container{display:inline-flex;flex-direction:column;isolation:isolate;flex-grow:1;background-color:var(--md-sys-color-surface-container);border-radius:var(--md-sys-shape-extra-small);padding-top:20px;padding-bottom:12px;padding-inline:12px}:host .container md-button[variant=plain]{border-inline:1px solid var(--md-sys-color-outline);height:40px}:host .container md-button[variant=plain]:first-child{border-top:1px solid var(--md-sys-color-outline);border-bottom:.5px solid var(--md-sys-color-outline);border-radius:var(--md-sys-shape-extra-small-top)}:host .container md-button[variant=plain]:last-child{border-top:.5px solid var(--md-sys-color-outline);border-bottom:1px solid var(--md-sys-color-outline);border-radius:var(--md-sys-shape-extra-small-bottom)}:host .container .body{position:relative;flex-grow:1;flex-direction:row;display:inline-flex;justify-content:center}:host .actions{display:inline-flex;justify-content:flex-end;gap:8px;flex-grow:1;margin-top:8px}:host .clear{margin-inline-end:auto}:host .selected-value{display:inline-flex;gap:8px}:host input,:host textarea{display:inline-flex;appearance:none;margin:0;padding:0;padding-inline:0;padding-block:0;border:0;outline:none;background-color:transparent;color:inherit;caret-color:inherit;resize:none;overflow:hidden;font-family:inherit;font-weight:inherit;font-size:inherit;box-sizing:border-box;height:80px;width:96px;text-align:center;border-radius:inherit}:host input::placeholder,:host textarea::placeholder{color:currentColor;opacity:1}:host input::-webkit-calendar-picker-indicator,:host textarea::-webkit-calendar-picker-indicator{display:none}:host input::-webkit-search-decoration,:host input::-webkit-search-cancel-button,:host textarea::-webkit-search-decoration,:host textarea::-webkit-search-cancel-button{display:none}:host input::-webkit-inner-spin-button,:host input::-webkit-outer-spin-button,:host textarea::-webkit-inner-spin-button,:host textarea::-webkit-outer-spin-button{display:none}:host input[type=number],:host textarea[type=number]{-moz-appearance:textfield}:host .input-container{display:inline-flex;gap:4px;flex-direction:column}:host .input-label{color:var(--md-sys-color-surface-variant-on);font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host .input{position:relative;font-size:var(--md-sys-typescale-display-large-no-rfs-size);font-weight:var(--md-sys-typescale-display-large-no-rfs-weight);font-family:var(--md-sys-typescale-display-large-no-rfs-font);caret-color:currentColor;border-radius:var(--md-sys-shape-small)}:host .hours{background-color:var(--md-sys-color-primary-container);color:var(--md-sys-color-primary-container-on)}:host .hours:focus{border:2px solid var(--md-sys-color-primary)}:host .minutes,:host .seconds{background-color:var(--md-sys-color-surface-container-highest);color:var(--md-sys-color-surface-on)}:host .minutes:focus,:host .seconds:focus{border:2px solid var(--md-sys-color-surface-on)}:host .separator{margin-inline:8px;font-size:var(--md-sys-typescale-display-large-no-rfs-size);font-weight:var(--md-sys-typescale-display-large-no-rfs-weight);font-family:var(--md-sys-typescale-display-large-no-rfs-font)}:host .meridian{display:inline-flex;flex-direction:column;margin-inline-start:16px;width:52px}:host .meridian .selected{background-color:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-tertiary-container-on)}\n"] }]
        }], ctorParameters: () => [] });

class TypescaleComponent extends MaterialDesignComponent {
    scale = model('body');
    size = model('medium');
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TypescaleComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.2.9", type: TypescaleComponent, isStandalone: true, selector: "md-typescale", inputs: { scale: { classPropertyName: "scale", publicName: "scale", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { scale: "scaleChange", size: "sizeChange" }, host: { properties: { "attr.scale": "scale()", "attr.size": "size()" } }, usesInheritance: true, ngImport: i0, template: "<slot></slot>", styles: [":host([scale=display][size=large]){font-size:var(--md-sys-typescale-display-large-size);font-weight:var(--md-sys-typescale-display-large-weight);font-family:var(--md-sys-typescale-display-large-font)}:host([scale=display][size=medium]){font-size:var(--md-sys-typescale-display-medium-size);font-weight:var(--md-sys-typescale-display-medium-weight);font-family:var(--md-sys-typescale-display-medium-font)}:host([scale=display][size=small]){font-size:var(--md-sys-typescale-display-small-size);font-weight:var(--md-sys-typescale-display-small-weight);font-family:var(--md-sys-typescale-display-small-font)}:host([scale=headline][size=large]){font-size:var(--md-sys-typescale-headline-large-size);font-weight:var(--md-sys-typescale-headline-large-weight);font-family:var(--md-sys-typescale-headline-large-font)}:host([scale=headline][size=medium]){font-size:var(--md-sys-typescale-headline-medium-size);font-weight:var(--md-sys-typescale-headline-medium-weight);font-family:var(--md-sys-typescale-headline-medium-font)}:host([scale=headline][size=small]){font-size:var(--md-sys-typescale-headline-small-size);font-weight:var(--md-sys-typescale-headline-small-weight);font-family:var(--md-sys-typescale-headline-small-font)}:host([scale=body][size=large]){font-size:var(--md-sys-typescale-body-large-size);font-weight:var(--md-sys-typescale-body-large-weight);font-family:var(--md-sys-typescale-body-large-font)}:host([scale=body][size=medium]){font-size:var(--md-sys-typescale-body-medium-size);font-weight:var(--md-sys-typescale-body-medium-weight);font-family:var(--md-sys-typescale-body-medium-font)}:host([scale=body][size=small]){font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host([scale=title][size=large]){font-size:var(--md-sys-typescale-title-large-size);font-weight:var(--md-sys-typescale-title-large-weight);font-family:var(--md-sys-typescale-title-large-font)}:host([scale=title][size=medium]){font-size:var(--md-sys-typescale-title-medium-size);font-weight:var(--md-sys-typescale-title-medium-weight);font-family:var(--md-sys-typescale-title-medium-font)}:host([scale=title][size=small]){font-size:var(--md-sys-typescale-title-small-size);font-weight:var(--md-sys-typescale-title-small-weight);font-family:var(--md-sys-typescale-title-small-font)}:host([scale=label][size=large]){font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host([scale=label][size=medium]){font-size:var(--md-sys-typescale-label-medium-size);font-weight:var(--md-sys-typescale-label-medium-weight);font-family:var(--md-sys-typescale-label-medium-font)}:host([scale=label][size=small]){font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.ShadowDom });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: TypescaleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'md-typescale', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.ShadowDom, imports: [], hostDirectives: [], host: {
                        '[attr.scale]': 'scale()',
                        '[attr.size]': 'size()',
                    }, template: "<slot></slot>", styles: [":host([scale=display][size=large]){font-size:var(--md-sys-typescale-display-large-size);font-weight:var(--md-sys-typescale-display-large-weight);font-family:var(--md-sys-typescale-display-large-font)}:host([scale=display][size=medium]){font-size:var(--md-sys-typescale-display-medium-size);font-weight:var(--md-sys-typescale-display-medium-weight);font-family:var(--md-sys-typescale-display-medium-font)}:host([scale=display][size=small]){font-size:var(--md-sys-typescale-display-small-size);font-weight:var(--md-sys-typescale-display-small-weight);font-family:var(--md-sys-typescale-display-small-font)}:host([scale=headline][size=large]){font-size:var(--md-sys-typescale-headline-large-size);font-weight:var(--md-sys-typescale-headline-large-weight);font-family:var(--md-sys-typescale-headline-large-font)}:host([scale=headline][size=medium]){font-size:var(--md-sys-typescale-headline-medium-size);font-weight:var(--md-sys-typescale-headline-medium-weight);font-family:var(--md-sys-typescale-headline-medium-font)}:host([scale=headline][size=small]){font-size:var(--md-sys-typescale-headline-small-size);font-weight:var(--md-sys-typescale-headline-small-weight);font-family:var(--md-sys-typescale-headline-small-font)}:host([scale=body][size=large]){font-size:var(--md-sys-typescale-body-large-size);font-weight:var(--md-sys-typescale-body-large-weight);font-family:var(--md-sys-typescale-body-large-font)}:host([scale=body][size=medium]){font-size:var(--md-sys-typescale-body-medium-size);font-weight:var(--md-sys-typescale-body-medium-weight);font-family:var(--md-sys-typescale-body-medium-font)}:host([scale=body][size=small]){font-size:var(--md-sys-typescale-body-small-size);font-weight:var(--md-sys-typescale-body-small-weight);font-family:var(--md-sys-typescale-body-small-font)}:host([scale=title][size=large]){font-size:var(--md-sys-typescale-title-large-size);font-weight:var(--md-sys-typescale-title-large-weight);font-family:var(--md-sys-typescale-title-large-font)}:host([scale=title][size=medium]){font-size:var(--md-sys-typescale-title-medium-size);font-weight:var(--md-sys-typescale-title-medium-weight);font-family:var(--md-sys-typescale-title-medium-font)}:host([scale=title][size=small]){font-size:var(--md-sys-typescale-title-small-size);font-weight:var(--md-sys-typescale-title-small-weight);font-family:var(--md-sys-typescale-title-small-font)}:host([scale=label][size=large]){font-size:var(--md-sys-typescale-label-large-size);font-weight:var(--md-sys-typescale-label-large-weight);font-family:var(--md-sys-typescale-label-large-font)}:host([scale=label][size=medium]){font-size:var(--md-sys-typescale-label-medium-size);font-weight:var(--md-sys-typescale-label-medium-weight);font-family:var(--md-sys-typescale-label-medium-font)}:host([scale=label][size=small]){font-size:var(--md-sys-typescale-label-small-size);font-weight:var(--md-sys-typescale-label-small-weight);font-family:var(--md-sys-typescale-label-small-font)}\n"] }]
        }] });

class FormGroupResetterDirective {
    _formGroup = inject(FormGroupDirective);
    _changeDetectorRef = inject(ChangeDetectorRef);
    ngAfterViewInit() {
        this._formGroup.statusChanges?.subscribe(() => this._changeDetectorRef.detectChanges());
        const resetPrevious = this._formGroup.form.reset.bind(this._formGroup.form);
        this._formGroup.form.reset = (value) => {
            resetPrevious.call(this._formGroup, value);
            for (const directive of this._formGroup.directives) {
                if (directive.valueAccessor instanceof
                    MaterialDesignValueAccessorComponent) {
                    directive.control.markAsPristine();
                    directive.control.markAsUntouched();
                    directive.valueAccessor.errorText.set(undefined);
                }
            }
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FormGroupResetterDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.9", type: FormGroupResetterDirective, isStandalone: true, selector: "[formGroup]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: FormGroupResetterDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: '[formGroup]',
                    standalone: true,
                }]
        }] });

class LinkDirective {
    mdLink = input.required();
    mdLinkActiveClass = input();
    mdLinkExact = input(false);
    mdLinkSelectable = input(true);
    mdLinkOutlet = input();
    _router = inject(Router);
    _activatedRoute = inject(ActivatedRoute);
    href = computed(() => this.mdLinkOutlet() ? undefined : this._router.serializeUrl(this.urlTree()));
    urlTree = computed(() => {
        const link = this.mdLink();
        const commands = typeof link === 'string' || typeof link === 'number'
            ? [link]
            : link;
        return this._router.createUrlTree(commands, {
            relativeTo: this._activatedRoute,
        });
    });
    _element = inject(ElementRef);
    _component = computed(() => MaterialDesignComponent.get(this._element.nativeElement));
    _subscription;
    constructor() {
        effect(() => {
            const component = this._component();
            const href = this.href();
            if (!href) {
                return;
            }
            if (component) {
                component.href?.set(href);
            }
            else {
                this._element.nativeElement.setAttribute('href', href);
            }
        }, {
            allowSignalWrites: true,
        });
        this._router.events
            .pipe(startWith(null), filter(() => this.mdLinkSelectable() || !!this.mdLinkActiveClass()), filter((event) => event instanceof NavigationEnd), map(() => this._router.isActive(this.urlTree(), this.mdLinkExact())), tap((isActive) => {
            if (this._component()) {
                this._component().selected.set(isActive);
            }
            if (isActive && this.mdLinkActiveClass()) {
                this._element.nativeElement.classList.add(this.mdLinkActiveClass());
            }
            else {
                this._element.nativeElement.classList.remove(this.mdLinkActiveClass());
            }
        }))
            .subscribe();
    }
    ngOnDestroy() {
        this._subscription?.unsubscribe();
    }
    onClick(event) {
        event.preventDefault();
        if (this.mdLinkOutlet()) {
            this._router.navigate([
                {
                    outlets: {
                        [this.mdLinkOutlet()]: this.href(),
                    },
                },
            ], {
                relativeTo: this._activatedRoute,
            });
        }
        else {
            this._router.navigate([this.href()], {
                relativeTo: this._activatedRoute,
            });
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: LinkDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.9", type: LinkDirective, isStandalone: true, selector: "[mdLink]", inputs: { mdLink: { classPropertyName: "mdLink", publicName: "mdLink", isSignal: true, isRequired: true, transformFunction: null }, mdLinkActiveClass: { classPropertyName: "mdLinkActiveClass", publicName: "mdLinkActiveClass", isSignal: true, isRequired: false, transformFunction: null }, mdLinkExact: { classPropertyName: "mdLinkExact", publicName: "mdLinkExact", isSignal: true, isRequired: false, transformFunction: null }, mdLinkSelectable: { classPropertyName: "mdLinkSelectable", publicName: "mdLinkSelectable", isSignal: true, isRequired: false, transformFunction: null }, mdLinkOutlet: { classPropertyName: "mdLinkOutlet", publicName: "mdLinkOutlet", isSignal: true, isRequired: false, transformFunction: null } }, host: { listeners: { "click": "onClick($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.9", ngImport: i0, type: LinkDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mdLink]',
                    standalone: true,
                }]
        }], ctorParameters: () => [], propDecorators: { onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/// <reference types="@angular/localize" />

/**
 * Generated bundle index. Do not edit.
 */

export { AccordianComponent, AnimationContextDirective, AnimationDirective, Animator, AttachableDirective, AvatarComponent, BadgeComponent, BreadcrumbComponent, ButtonComponent, CardComponent, CheckComponent, ChipComponent, DURATION, DateFormatPipe, DatePickerComponent, DialogComponent, DividerComponent, DropdownComponent, EASING, ElevationComponent, FabComponent, FieldComponent, FocusRingComponent, FormGroupResetterDirective, ForwardFocusDirective, GET_VALIDATION_MESSAGE_INJECTION_TOKEN, IconButtonComponent, IconComponent, LinkDirective, ListComponent, ListItemComponent, MaterialDesignComponent, MaterialDesignValueAccessorComponent, MenuComponent, MenuItemComponent, NavigationComponent, NavigationHeadlineComponent, NavigationItemComponent, NotFoundError, NullOrUndefinedError, ParentActivationDirective, PopoverComponent, ProgressIndicatorComponent, RippleComponent, SegmentedButtonComponent, SegmentedButtonSetComponent, SheetComponent, SlotDirective, SnackBarComponent, TabComponent, TabsComponent, TextFieldComponent, TimePickerComponent, TimeSpan, TooltipComponent, TouchAreaComponent, TypescaleComponent, animation, animationContext, assertDefined, attach, attachTarget, bindAttribute, dateFormat, dispatchActivationClick, durationToMilliseconds, easingToFunction, getDateTimeFormatOptions, getMeridianValues, isActivationClick, isDefined, isWritableSignal, modelToObservable, openClose, redispatchEvent, runAnimations, startAnimations, tapStart, textDirection, toKeyframeAnimationOptions };
//# sourceMappingURL=wtprograms-material-design.mjs.map
