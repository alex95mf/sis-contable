import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { AppCustomModule } from "src/app/config/custom/app-custom.module";

import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    RegistroComponent
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    AppCustomModule,
    NgxCurrencyModule,
  ]
})
export class ProgramaRegistroModule { }
