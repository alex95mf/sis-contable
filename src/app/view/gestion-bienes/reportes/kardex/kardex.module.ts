import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { KardexRoutingModule } from './kardex-routing.module'; 
import { KardexComponent } from './kardex.component'; 
import { ModalGruposComponent } from './modal-grupos/modal-grupos.component'; 
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { CalendarModule } from 'primeng/calendar';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    KardexComponent,
    ModalGruposComponent,
    ListBusquedaComponent
  ],
  imports: [
    CommonModule,
    KardexRoutingModule,
    AppCustomModule,
    CalendarModule
  ],
  providers: [
    ExcelService,
  ]
})
export class KardexModule { }
