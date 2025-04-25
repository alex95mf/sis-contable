import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SalesElectronicComponent} from './sales-electronic.component'
import {ElectronicRoutingModule} from './electronic.routing'


@NgModule({
  declarations: [SalesElectronicComponent],
  imports: [
    CommonModule,
    ElectronicRoutingModule
  ]
})
export class SalesElectronicModule { }
