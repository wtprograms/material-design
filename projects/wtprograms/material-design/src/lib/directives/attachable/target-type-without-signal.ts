import { ElementRef } from '@angular/core';
import { MdComponent } from '../../common/base/md.component';

export type TargetTypeWithoutSignal =
  | undefined
  | string
  | HTMLElement
  | ElementRef<HTMLElement>
  | MdComponent;