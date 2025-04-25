import { NgModule } from '@angular/core';
import { DepreciacionComponent } from './depreciacion.component'
import { DepreciacionRoutingModule } from './depreciacion.routing'
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [DepreciacionComponent],
  imports: [
    DepreciacionRoutingModule,
    AppCustomModule
  ]
})
export class DepreciacionModule { }
