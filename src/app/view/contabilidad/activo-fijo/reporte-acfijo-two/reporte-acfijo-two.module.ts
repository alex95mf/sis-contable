import { NgModule } from '@angular/core';
import { ReporteAcfijoTwoComponent } from './reporte-acfijo-two.component';
import { ReporteAcfijoTwoRoutingModule } from './reporte-acfijo-two.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ReporteAcfijoTwoComponent],
  imports: [
    ReporteAcfijoTwoRoutingModule,
    AppCustomModule,
  ]
})
export class ReporteAcfijoTwoModule { }
