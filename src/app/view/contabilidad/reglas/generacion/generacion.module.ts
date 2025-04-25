import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { GeneracionRoutingModule } from './generacion-routing.module';
import { GeneracionComponent } from './generacion.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ListReglasComponent } from './list-reglas/list-reglas.component'; 
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    GeneracionComponent,
    ModalCuentPreComponent,
    ListReglasComponent,
  ],
  imports: [
    CommonModule,
    GeneracionRoutingModule,
    AppCustomModule,
    CalendarModule
  ]
})
export class GeneracionModule { }
