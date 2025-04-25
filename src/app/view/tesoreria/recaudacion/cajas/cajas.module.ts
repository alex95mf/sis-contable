import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajasRoutingModule } from './cajas-routing.module';
import { CajasComponent } from './cajas.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { CajasFormComponent } from './cajas-form/cajas-form.component';


@NgModule({
  declarations: [
    CajasComponent,
    CajasFormComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CajasRoutingModule
  ]
})
export class CajasModule { }
