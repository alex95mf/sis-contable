import { NgModule } from '@angular/core';
import { CcMantenimientoComponent } from './cc-mantenimiento.component';
import { CCMantenimientoRoutingModule } from './cc-mantenimiento.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [CcMantenimientoComponent],
  imports: [
    AppCustomModule,
    CCMantenimientoRoutingModule
  ]
})
export class CcMantenimientoModule { }
