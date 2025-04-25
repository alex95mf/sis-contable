import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CajaBancoComponent} from './caja-banco.component';
import {CajaBancoRoutingModule} from './caja-banco.routing';


@NgModule({
  declarations: [CajaBancoComponent],
  imports: [
    CommonModule,
    CajaBancoRoutingModule
  ]
})
export class CajaBancoModule { }
