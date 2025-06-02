import { NgModule } from '@angular/core';
import { PagosServiciosComponent } from './pagos-servicios.component';
import { PagosServiciosRoutingModule } from './pagos-servicios.routing';
import { ShowPagosServiciosComponent } from './show-pagos-servicios/show-pagos-servicios.component';
import { AppCustomModule } from '../../../config/custom/app-custom.module';

@NgModule({
  declarations: [PagosServiciosComponent, ShowPagosServiciosComponent],
  imports: [
    PagosServiciosRoutingModule,
    AppCustomModule
  ],
})
export class PagosServiciosModule { }
