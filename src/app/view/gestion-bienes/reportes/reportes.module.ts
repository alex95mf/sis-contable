import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { InformacionGestionComponent } from './informacion-gestion/informacion-gestion.component';
import { ReporteDetalladoBienesComponent } from './reporte-detallado-bienes/reporte-detallado-bienes.component';
import { ModalDepartamentosResComponent } from './reporte-detallado-bienes/modal-departamentos-res/modal-departamentos-res.component'; 

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    InformacionGestionComponent,
    ReporteDetalladoBienesComponent,
    ModalDepartamentosResComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    AppCustomModule,
    CalendarModule
  ]
})
export class ReportesModule { }
