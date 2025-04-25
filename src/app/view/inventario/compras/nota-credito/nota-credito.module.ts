import { NgModule } from '@angular/core';
import { NotaCreditoComponent } from './nota-credito.component';
import { NotaCreditoRoutingModule } from './nota-credito.routing';
import { ShowCuentasComponent } from './show-cuentas/show-cuentas.component';
import { ShowNotasCreditoComponent } from './show-notas-credito/show-notas-credito.component';
import { ReportNotaCreditoComponent } from './report-nota-credito/report-nota-credito.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ListadoRepNcComponent } from './report-nota-credito/listado-rep-nc/listado-rep-nc.component';
@NgModule({
  declarations: [NotaCreditoComponent, ShowCuentasComponent, ShowNotasCreditoComponent, ReportNotaCreditoComponent, ListadoRepNcComponent],
  imports: [
    NotaCreditoRoutingModule,
    AppCustomModule
  ], 
  entryComponents:[
    ShowCuentasComponent, ShowNotasCreditoComponent, ReportNotaCreditoComponent, ListadoRepNcComponent
  ]
})
export class NotaCreditoModule { }
