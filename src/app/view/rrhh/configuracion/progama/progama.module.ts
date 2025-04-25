import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgamaRoutingModule } from './progama-routing.module';
import { ProgamaComponent } from './progama.component';
import { ProgramaFormComponent } from './programa-form/programa-form.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    ProgamaComponent,
    ProgramaFormComponent
  ],
  imports: [
    CommonModule,
    ProgamaRoutingModule,
    AppCustomModule
  ]
})
export class ProgamaModule { }
