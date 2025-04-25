import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvenioArrienteTRoutingModule } from './convenio-arriente-t-routing.module';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { ModalCompraTerrenosComponent } from './modal-compra-terrenos/modal-compra-terrenos.component';



@NgModule({
  declarations: [
    ListRecDocumentosComponent,
    AnexosListComponentDis,
    ModalCompraTerrenosComponent
  ],
  imports: [
    CommonModule,
    ConvenioArrienteTRoutingModule,
    AppCustomModule,
   
  ]
})
export class ConvenioArrienteTModule { }
