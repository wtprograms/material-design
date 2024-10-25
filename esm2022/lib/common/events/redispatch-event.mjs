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
export function redispatchEvent(element, event) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXNwYXRjaC1ldmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3d0cHJvZ3JhbXMvbWF0ZXJpYWwtZGVzaWduL3NyYy9saWIvY29tbW9uL2V2ZW50cy9yZWRpc3BhdGNoLWV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSCxNQUFNLFVBQVUsZUFBZSxDQUFDLE9BQWdCLEVBQUUsS0FBWTtJQUM1RCw2RUFBNkU7SUFDN0UseUJBQXlCO0lBQ3pCLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUM3RCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNoQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbi8qKlxuICogUmUtZGlzcGF0Y2hlcyBhbiBldmVudCBmcm9tIHRoZSBwcm92aWRlZCBlbGVtZW50LlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZnVsIGZvciBmb3J3YXJkaW5nIG5vbi1jb21wb3NlZCBldmVudHMsIHN1Y2ggYXMgYGNoYW5nZWBcbiAqIGV2ZW50cy5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlJbnB1dCBleHRlbmRzIE9ic2VydmFibGVFbGVtZW50IHtcbiAqICAgcmVuZGVyKCkge1xuICogICAgIHJldHVybiBodG1sYDxpbnB1dCBAY2hhbmdlPSR7dGhpcy5yZWRpc3BhdGNoRXZlbnR9PmA7XG4gKiAgIH1cbiAqXG4gKiAgIHByb3RlY3RlZCByZWRpc3BhdGNoRXZlbnQoZXZlbnQ6IEV2ZW50KSB7XG4gKiAgICAgcmVkaXNwYXRjaEV2ZW50KHRoaXMsIGV2ZW50KTtcbiAqICAgfVxuICogfVxuICpcbiAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGRpc3BhdGNoIHRoZSBldmVudCBmcm9tLlxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byByZS1kaXNwYXRjaC5cbiAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIGV2ZW50IHdhcyBkaXNwYXRjaGVkIChpZiBjYW5jZWxhYmxlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZGlzcGF0Y2hFdmVudChlbGVtZW50OiBFbGVtZW50LCBldmVudDogRXZlbnQpIHtcbiAgLy8gRm9yIGJ1YmJsaW5nIGV2ZW50cyBpbiBTU1IgbGlnaHQgRE9NIChvciBjb21wb3NlZCksIHN0b3AgdGhlaXIgcHJvcGFnYXRpb25cbiAgLy8gYW5kIGRpc3BhdGNoIHRoZSBjb3B5LlxuICBpZiAoZXZlbnQuYnViYmxlcyAmJiAoIWVsZW1lbnQuc2hhZG93Um9vdCB8fCBldmVudC5jb21wb3NlZCkpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIGNvbnN0IGNvcHkgPSBSZWZsZWN0LmNvbnN0cnVjdChldmVudC5jb25zdHJ1Y3RvciwgW2V2ZW50LnR5cGUsIGV2ZW50XSk7XG4gIGNvbnN0IGRpc3BhdGNoZWQgPSBlbGVtZW50LmRpc3BhdGNoRXZlbnQoY29weSk7XG4gIGlmICghZGlzcGF0Y2hlZCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICByZXR1cm4gZGlzcGF0Y2hlZDtcbn1cbiJdfQ==