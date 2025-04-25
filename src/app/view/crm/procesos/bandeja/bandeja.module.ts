import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaRoutingModule } from './bandeja-routing.module';
import { BandejaComponent } from './bandeja.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { TareaFormComponent } from './tarea-form/tarea-form.component';


@NgModule({
  declarations: [
    BandejaComponent,
    TareaFormComponent
  ],
  imports: [
    CommonModule,
    BandejaRoutingModule,
    AppCustomModule
  ]
})
export class BandejaModule { }



