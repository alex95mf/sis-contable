import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveeduriaComponent } from './proveeduria.component';
import {ProveduriaRoutingModule} from './proveeduria.routing'


@NgModule({
  declarations: [ProveeduriaComponent],
  imports: [
    CommonModule,
    ProveduriaRoutingModule
  ]
})
export class ProveeduriaModule { }
