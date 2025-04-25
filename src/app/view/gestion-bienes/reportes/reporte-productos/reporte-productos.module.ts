import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { ReporteProductosRoutingModule } from './reporte-productos-routing.module';
import { ReporteProductosComponent } from './reporte-productos.component'; 
import { ModalGruposComponent } from '../reporte-productos/modal-grupos/modal-grupos.component';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { CalendarModule } from 'primeng/calendar';
import { ExcelService } from 'src/app/services/excel.service';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [
    ReporteProductosComponent,
    ModalGruposComponent,
    ListBusquedaComponent
  ],
  imports: [
    CommonModule,
    ReporteProductosRoutingModule,
    AppCustomModule,
    CalendarModule,
    CheckboxModule
  ],
  providers: [
    ExcelService,
  ]
})
export class ReporteProductosModule { }
