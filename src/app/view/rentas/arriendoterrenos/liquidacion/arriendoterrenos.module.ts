import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { ArriendoterrenosRoutingModule } from './arriendoterrenos-routing.module';
import { ArriendoterrenosComponent } from './arriendoterrenos.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  declarations: [
    ArriendoterrenosComponent,
    ListLiquidacionesComponent,
    ModalExoneracionesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    ArriendoterrenosRoutingModule,
  ]
})
export class ArriendoterrenosModule { }
