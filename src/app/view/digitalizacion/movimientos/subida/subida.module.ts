import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubidaRoutingModule } from './subida.routing';
import { SubidaComponent } from './subida.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    SubidaComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    SubidaRoutingModule,
  ],
  providers: [
  ]
})
export class SubidaModule { }
