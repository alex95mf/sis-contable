import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasPublicasRoutingModule } from './compras-publicas.routing';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComprasPublicasRoutingModule,
    AppCustomModule
  ]
})
export class ComprasPublicasModule { }
