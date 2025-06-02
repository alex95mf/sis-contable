import { NgModule } from '@angular/core';
import {CreacionRoutingModule} from './creacion.routing';
import {CreacionComponent} from './creacion.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ShowCuentasCajaComponent } from './show-cuentas-caja/show-cuentas-caja.component';


@NgModule({
  declarations: [CreacionComponent, ShowCuentasCajaComponent],
  imports: [
    CreacionRoutingModule,
    AppCustomModule
  ],
})
export class CreacionModule { }
