import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CargoRoutingModule } from './cargo-routing.module';
import { CargoComponent } from './cargo.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalDepartamenteComponent } from './modal-departamente/modal-departamente.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    CargoComponent,
    ModalDepartamenteComponent
  ],
  imports: [
    CommonModule,
    CargoRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class CargoModule { }
