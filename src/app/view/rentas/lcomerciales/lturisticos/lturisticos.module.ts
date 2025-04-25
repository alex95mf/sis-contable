import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LturisticosRoutingModule } from './lturisticos-routing.module';
import { LturisticosComponent } from './lturisticos.component';
import { ModalNuevoComponent } from './modal-nuevo/modal-nuevo.component';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    LturisticosComponent,
    ModalNuevoComponent,
    
    
  ],
  imports: [
    CommonModule,
    LturisticosRoutingModule,
    AppCustomModule
  ]
})
export class LturisticosModule { }
