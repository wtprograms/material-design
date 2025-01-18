import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdComponent } from '../../../common/base/md.component';

@Component({
  selector: 'md-navigation-sub-header',
  templateUrl: './navigation-sub-header.component.html',
  styleUrls: ['./navigation-sub-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdNavigationSubHeaderComponent extends MdComponent {}
