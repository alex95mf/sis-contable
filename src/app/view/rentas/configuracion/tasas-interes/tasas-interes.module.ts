import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasasInteresRoutingModule } from './tasas-interes.routing';
import { TasasInteresComponent } from './tasas-interes.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    TasasInteresComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    TasasInteresRoutingModule
  ]
})
export class TasasInteresModule { }
