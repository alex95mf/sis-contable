import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CuentasComponent} from './cuentas.component'
import {BancariasRoutingModule} from './cuentas.routing';


@NgModule({
  declarations: [CuentasComponent],
  imports: [
    CommonModule,
    BancariasRoutingModule
  ]
})

export class CuentasModule { }
