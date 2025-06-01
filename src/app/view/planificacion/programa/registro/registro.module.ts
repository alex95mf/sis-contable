import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { AppCustomModule } from "src/app/config/custom/app-custom.module";

import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    RegistroComponent
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    AppCustomModule,
    NgxCurrencyDirective,
  ]
})
export class ProgramaRegistroModule { }
