import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmisionExpedienteRoutingModule } from './emision-expediente-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { EmisionExpedienteComponent } from './emision-expediente.component';
import { ModalDetallesComponent } from '../gestion-expediente/modal-detalles/modal-detalles.component';
import { ModalEditionComponent } from '../gestion-expediente/modal-edition/modal-edition.component';
import {ModalExpedienteContribuyenteComponent} from './modalExpedienteContribuyente/modalExpedienteContribuyente.component';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  providers: [
    ExcelService,
  ],
  declarations: [
    EmisionExpedienteComponent,
    ModalDetallesComponent,
    ModalEditionComponent,
    ModalExpedienteContribuyenteComponent,
    ConceptoDetComponent
  ],
  imports: [
    CommonModule,
    EmisionExpedienteRoutingModule,
    AppCustomModule
  ]
})
export class EmisionExpedienteModule { }
