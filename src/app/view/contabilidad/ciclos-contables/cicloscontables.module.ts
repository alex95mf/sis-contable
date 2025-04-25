import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CiclosContablesComponent } from './ciclos-contables.component';
import { CiclosContablesRoutingModule } from './cicloscontables.routing';
import { CierreSaldosComponent } from './cierre-saldos/cierre-saldos.component';
//import { CierreDeAnioComponent } from './cierre-de-anio/cierre-de-anio.component';


@NgModule({
  declarations: [CiclosContablesComponent, /*CierreSaldosComponent*/ /*CierreDeAnioComponent*/],
  imports: [
    CiclosContablesRoutingModule,
    CommonModule
  ]
})

export class CiclosContablesModule{ }
