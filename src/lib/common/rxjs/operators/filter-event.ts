import { filter, Observable } from 'rxjs';

export function filterEvent<T extends Event = Event>(type: string) {
  return (source: Observable<Event>) => source.pipe(filter((event): event is T => event.type === type));
}
