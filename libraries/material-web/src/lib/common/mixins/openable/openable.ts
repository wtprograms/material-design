/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Openable {
  open: boolean;
  animations: Animation[];
  show(...args: any[]): Promise<void>;
  handleShow(...args: any[]): Promise<boolean>;
  close(...args: any[]): Promise<void>;
  handleClose(...args: any[]): Promise<boolean>;
  animateOpen(): Promise<void>;
  animateClose(): Promise<void>;
  animationsPromise(): Promise<void>;
  cancelAnimations(): void;
}