import { NgModule } from '@angular/core';
import { RolGeneralComponent } from './rol-general.component';
import { RolGeneralRoutingModule } from './rol-general-empl.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ModalProgramaComponent } from './modal-programa/modal-programa.component';
import { DetallesRolComponent } from './detalles-rol/detalles-rol.component'; 


import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [RolGeneralComponent,ModalCuentPreComponent,ModalProgramaComponent ,DetallesRolComponent],
  imports: [
    AppCustomModule,
    RolGeneralRoutingModule,
    CalendarModule,
    TableModule,
    PaginatorModule
  ]
 
})
export class RolGeneralModule { }


