import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitulosRoutingModule } from './titulos-routing.module';
import { TitulosComponent } from './titulos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    TitulosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    TitulosRoutingModule,
  ]
})
export class TitulosModule { }
