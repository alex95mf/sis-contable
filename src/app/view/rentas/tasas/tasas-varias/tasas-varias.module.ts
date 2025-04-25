import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasasVariasRoutingModule } from './tasas-varias-routing.module';
import { TasasVariasComponent } from './tasas-varias.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { TasasVariasFormComponent } from './tasas-varias-form/tasas-varias-form.component';



@NgModule({
  declarations: [
    TasasVariasComponent,
    TasasVariasFormComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    TasasVariasRoutingModule
  ]
})
export class TasasVariasModule { }
