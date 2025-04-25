import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetasOdsRoutingModule } from './metas-ods-routing.module';
import { MetasOdsComponent } from './metas-ods.component';
import { AppCustomModule } from "src/app/config/custom/app-custom.module";
import { MetaViewComponent } from './meta-view/meta-view.component';


@NgModule({
  declarations: [
    MetasOdsComponent,
    MetaViewComponent
  ],
  imports: [
    CommonModule,
    MetasOdsRoutingModule,
    AppCustomModule
  ]
})
export class MetasOdsModule { }
