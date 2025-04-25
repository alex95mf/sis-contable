import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportacionesComponent } from './importaciones.component';
import {ImprtRoutingModule} from './importaciones.routing'


@NgModule({
  declarations: [ImportacionesComponent],
  imports: [
    CommonModule,
    ImprtRoutingModule
  ]
})
export class ImportacionesModule { }
