import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { GeneracionRoutingModule } from './generacion-routing.module';
import { GeneracionComponent } from './generacion.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalArancelesComponent } from './modal-aranceles/modal-aranceles.component';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { ModalExonContribuyenteComponent } from './modal-exon-contribuyente/modal-exon-contribuyente.component';

@NgModule({
  declarations: [
    GeneracionComponent,
    ListLiquidacionesComponent,
    ModalExoneracionesComponent,
    ModalArancelesComponent,
    ModalExonContribuyenteComponent,
    ModalContribuyentesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    GeneracionRoutingModule,
  ]
})
export class GeneracionModule { }
