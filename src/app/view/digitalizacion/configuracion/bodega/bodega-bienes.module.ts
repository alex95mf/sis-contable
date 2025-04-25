import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BodegaRoutingModule } from './bodega-bienes-routing.module';
import { BodegaBienesComponent } from './bodega-bienes.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
//import { EncargadoComponent } from '../../../../config/custom/encargado/encargado.component';


@NgModule({
  declarations: [
    BodegaBienesComponent,
    //EncargadoComponent
  ],
  imports: [
    CommonModule,
    BodegaRoutingModule,
    AppCustomModule
  ]
})
export class BodegaModule { }
