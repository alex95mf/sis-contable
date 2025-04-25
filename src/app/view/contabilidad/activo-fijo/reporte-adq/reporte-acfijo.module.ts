import { NgModule } from '@angular/core';
import { ReporteAcfijoComponent } from './reporte-acfijo.component';
import { ReporteAdqRoutingModule } from './reporte-acfijo.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [ReporteAcfijoComponent],
  imports: [
    ReporteAdqRoutingModule,
    AppCustomModule
  ]
})
export class ReporteAdqModule { }
