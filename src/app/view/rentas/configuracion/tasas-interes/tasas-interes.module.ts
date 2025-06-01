import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasasInteresRoutingModule } from './tasas-interes.routing';
import { TasasInteresComponent } from './tasas-interes.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    TasasInteresComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    TasasInteresRoutingModule
  ]
})
export class TasasInteresModule { }
