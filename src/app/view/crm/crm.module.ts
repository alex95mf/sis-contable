import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmRoutingModule } from './crm-routing.module';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CrmRoutingModule,
    AppCustomModule
    
  ]
})
export class CrmModule { }
