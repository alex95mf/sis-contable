import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgresosComponent } from './egresos.component';
import { EgresosRoutingModule } from './egresos.routing';
import { AppCustomModule } from '../../../config/custom/app-custom.module';

@NgModule({
  declarations: [EgresosComponent],
  imports: [
    CommonModule,
    EgresosRoutingModule,
    AppCustomModule
  ]
})
export class EgresosModule { }
