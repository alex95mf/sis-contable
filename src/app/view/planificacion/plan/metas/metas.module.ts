import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetasRoutingModule } from './metas-routing.module';
import { MetasComponent } from './metas.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FormMetasComponent } from './form-metas/form-metas.component';


@NgModule({
  declarations: [
    MetasComponent,
    FormMetasComponent
  ],
  imports: [
    CommonModule,
    MetasRoutingModule,
    AppCustomModule
  ]
})
export class MetasModule { }
