import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { ReporteUnoRoutingModule } from './reporte-uno-routing.module';
import { ReporteUnoComponent } from './reporte-uno.component'; 
import { ModalGruposComponent } from '../reporte-productos/modal-grupos/modal-grupos.component';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';

import { CalendarModule } from 'primeng/calendar';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    ReporteUnoComponent,
    ModalGruposComponent,
    ListBusquedaComponent
  ],
  imports: [
    CommonModule,
    ReporteUnoRoutingModule,
    AppCustomModule,
    CalendarModule
  ],
  providers: [
    ExcelService,
  ]
})
export class ReporteUnoModule { }
