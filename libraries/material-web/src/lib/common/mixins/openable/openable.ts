export interface Openable {
  open: boolean;
  opening: boolean;
  closing: boolean;
  show(): Promise<void>
  close(): Promise<void>
}