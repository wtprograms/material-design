import { Disable } from '../disable/disable';

export interface Control extends Disable {
  name: string;
  value: string;
}