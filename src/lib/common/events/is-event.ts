export function isEvent<T extends Event = Event>(event: Event, type: string): event is T {
  return event.type === type;
}