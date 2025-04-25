import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgresoComponent } from './egreso.component';
import { EgresoRoutingModule } from './egreso.routing';
import { ShowCuentasComponent } from './show-cuentas/show-cuentas.component';
import { ShowComprobantesComponent } from './show-comprobantes/show-comprobantes.component';
import { ReportComprobantesComponent } from './report-comprobantes/report-comprobantes.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { DataTablesModule } from 'angular-datatables';
import { ListadoComEgComponent } from './report-comprobantes/listado-com-eg/listado-com-eg.component';

@NgModule({
  declarations: [
    EgresoComponent, 
    ShowComprobantesComponent, ReportComprobantesComponent,ShowCuentasComponent, ListadoComEgComponent
  ],
  imports: [
    CommonModule,
    EgresoRoutingModule,
    DataTablesModule,
    AppCustomModule
  ],
  entryComponents: [
    ShowComprobantesComponent,ReportComprobantesComponent,ShowCuentasComponent, ListadoComEgComponent
  ]
  
})
export class EgresoModule { }
