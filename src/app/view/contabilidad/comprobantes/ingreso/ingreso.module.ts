import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowCuentasComponent } from './show-cuentas/show-cuentas.component';
import { ShowComprobantesComponent } from './show-comprobantes/show-comprobantes.component';
import { IngresoComponent } from './ingreso.component';
import { IngresoRoutingModule } from './ingreso.routing';
import { ReportComprobantesComponent } from './report-comprobantes/report-comprobantes.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { DataTablesModule } from 'angular-datatables';
import { ListadoComIgComponent } from './report-comprobantes/listado-com-ig/listado-com-ig.component';


@NgModule({
  declarations: [ShowCuentasComponent, ShowComprobantesComponent,IngresoComponent, ReportComprobantesComponent, ListadoComIgComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    IngresoRoutingModule,
    AppCustomModule
  ],
})
export class IngresoComprobantesModule { }
