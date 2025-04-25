import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablasConfigRoutingModule } from './tablas-config-routing.module';
import { TablasConfigComponent } from './tablas-config.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { TablasConfigFormComponent } from './tablas-config-form/tablas-config-form.component';



@NgModule({
  declarations: [
    TablasConfigComponent,
    TablasConfigFormComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    TablasConfigRoutingModule
    
  ]
})
export class TablasConfigModule { }
