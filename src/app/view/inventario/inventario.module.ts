import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperativoComponent } from './operativo/operativo.component';
import {InventarioRoutingModule} from './inventario.routing'


@NgModule({
  declarations: [OperativoComponent],
  imports: [
    CommonModule,
    InventarioRoutingModule
  ]
})
export class InventarioModule { }
