import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmisionArancelesRoutingModule } from './emision-aranceles.routing';
import { EmisionArancelesComponent } from './emision-aranceles.component';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalArancelesComponent } from './modal-aranceles/modal-aranceles.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import {InputNumberModule} from 'primeng/inputnumber';
import { NgxCurrencyModule } from 'ngx-currency';
import { ModalExonContribuyenteComponent } from './modal-exon-contribuyente/modal-exon-contribuyente.component';


@NgModule({
  declarations: [
    EmisionArancelesComponent,
    ModalContribuyentesComponent,
    ModalArancelesComponent,
    ListLiquidacionesComponent,
    ModalExoneracionesComponent,
    ModalExonContribuyenteComponent

  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    EmisionArancelesRoutingModule,
    InputNumberModule
  ]
})
export class EmisionArancelesModule { }
