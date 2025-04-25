import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultasEmitidasRoutingModule } from './multas-emitidas-routing.module';
import { MultasEmitidasComponent } from './multas-emitidas.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { MultaDetComponent } from './multa-det/multa-det.component';


@NgModule({
  declarations: [
    MultasEmitidasComponent,
    MultaDetComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    MultasEmitidasRoutingModule
  ]
})
export class MultasEmitidasModule { }
