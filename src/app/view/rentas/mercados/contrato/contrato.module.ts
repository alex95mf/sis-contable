import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { ContratoRoutingModule } from './contrato-routing.module';
import { ContratoComponent } from './contrato.component';
import { ListContratosComponent } from './list-contratos/list-contratos.component';
import { AnexosListComponent } from './anexos-list/anexos-list.component';
import { EmailDestinatarioComponent } from './email-destinatario/email-destinatario.component';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    ContratoComponent,
    ListContratosComponent,
    AnexosListComponent,
    EmailDestinatarioComponent,
    ModalContribuyentesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    ContratoRoutingModule
  ],
  providers: [
    ValidacionesFactory,
  ]
})
export class ContratoModule { }
