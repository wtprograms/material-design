import { ComputePositionReturn, Placement } from '@floating-ui/dom';
import { Openable } from '../openable/openable';
import { PopoverTrigger } from './popover-trigger';
import { Attachable } from '../attachable/attachable';

export interface Popover extends Openable, Attachable {
  trigger: PopoverTrigger;
  placement: Placement;
  offset: number;
  stayOpenOnOutsideClick: boolean;
  currentPlacement: Placement;
  animateWidth: boolean;
  body: HTMLDivElement | null;
  slots: HTMLElement[];
  updatePosition(): Promise<void>;
  getPosition(): Promise<ComputePositionReturn>;
}