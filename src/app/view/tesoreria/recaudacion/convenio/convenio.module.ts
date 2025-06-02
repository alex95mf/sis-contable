import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvenioRoutingModule } from './convenio-routing.module';
import { ConvenioComponent } from './convenio.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { AnexosListaComponentDis } from './anexos-lista/anexos-lista-dis.component';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';

import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
  declarations: [
    ConvenioComponent,
    ModalLiquidacionesComponent,
    ListRecDocumentosComponent,
    AnexosListComponentDis,
    AnexosListaComponentDis,
    ConceptoDetComponent
  ],

  imports: [
    CommonModule,
    AppCustomModule,
    ConvenioRoutingModule,
    NgxCurrencyDirective
  ]
})
export class ConvenioModule { }
