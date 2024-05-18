export interface Openable {
  open: boolean;
  hide(): Promise<void>;
  show(): Promise<void>;
}