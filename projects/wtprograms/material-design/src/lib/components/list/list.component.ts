import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdComponent } from '../../common/base/md.component';
import { MdListItemComponent } from '@wtprograms/material-design';

@Component({
  selector: 'md-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class MdListComponent extends MdComponent {
  readonly interactive = input<boolean>();
  readonly listItems = contentChildren(MdListItemComponent);

  constructor() {
    super();
    effect(() => {
      const interactive = this.interactive();
      if (interactive === undefined) {
        return;
      }
      const listItems = this.listItems();
      for (const listItem of listItems) {
        listItem.interactive.set(interactive);
      }
    });
  }
}


