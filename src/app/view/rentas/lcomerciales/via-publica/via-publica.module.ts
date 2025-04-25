import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


import { ViaPublicaRoutingModule } from './via-publica-routing.module';
import { ViaPublicaComponent } from './via-publica.component';
import { EditviapublicaComponent } from './editviapublica/editviapublica.component';



@NgModule({
  declarations: [
    ViaPublicaComponent,
    EditviapublicaComponent
  ],
  imports: [
    CommonModule,
    ViaPublicaRoutingModule,
    AppCustomModule
  ]
})
export class ViaPublicaModule { }
