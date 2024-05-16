export interface Attachable {
  htmlFor: string | null;
  control: HTMLElement | null;
  initialize(...events: string[]): void;
  handleControlEvent(event: Event): Promise<void>;
  reattach(): void;
}