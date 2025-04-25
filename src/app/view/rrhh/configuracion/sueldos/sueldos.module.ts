import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { SueldosComponent } from './sueldos.component';
import { SueldosRoutingModule } from './sueldos-routing.module';
import { SueldoNuevoComponent } from './sueldo-nuevo/sueldo-nuevo.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    SueldosComponent,
    SueldoNuevoComponent
  ],
  imports: [
    CommonModule,
    SueldosRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
    
    
  ]
})
export class SueldosModule { }
