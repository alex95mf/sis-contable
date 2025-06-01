import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevisionCierreRoutingModule } from './revision-cierre.routing';
import { RevisionCierreComponent } from './revision-cierre.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    RevisionCierreComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    RevisionCierreRoutingModule
  ]
})
export class RevisionCierreModule { }
