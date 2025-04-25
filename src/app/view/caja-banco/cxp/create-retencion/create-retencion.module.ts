import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreateRetencionComponent} from './create-retencion.component';
import { CreateRetencionCompraRoutingModule } from './create-retencion.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [CreateRetencionComponent],
  imports: [
    CommonModule,
    CreateRetencionCompraRoutingModule,
    AppCustomModule
  ]
})
export class CreateRetencionModule { }
