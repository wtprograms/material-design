import { filter, Observable } from 'rxjs';

export function filterAnyEvent<T extends Event = Event>(...types: string[]) {
  return (source: Observable<Event>) =>
    source.pipe(filter((event): event is T => types.includes(event.type)));
}
