import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { CobrosRoutingModule } from './cobros.routing';




@NgModule({
  declarations: [


  
   
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CobrosRoutingModule
  ]
})
export class CobrosModule { }
