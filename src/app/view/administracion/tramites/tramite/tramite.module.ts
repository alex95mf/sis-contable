import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TramiteRoutingModule } from './tramite-routing.module';
import { TicketFormComponent } from './ticket-form/ticket-form.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module'
import { AnexosListComponentDis } from '../anexos-list/anexos-list-dis.component';
import { ModalAnexoComponent } from './modal-anexo/modal-anexo.component';
import { ModalRegContribuyenteComponent } from './modal-reg-contribuyente/modal-reg-contribuyente.component';
import { ExcelService } from 'src/app/services/excel.service';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [
    TicketFormComponent,
    AnexosListComponentDis,
    ModalAnexoComponent,
    ModalRegContribuyenteComponent
  ],
  imports: [
    CommonModule,
    TramiteRoutingModule,
    AppCustomModule,
    CheckboxModule
  ],
  providers: [
    ExcelService
  ]
})
export class TramiteModule { }
