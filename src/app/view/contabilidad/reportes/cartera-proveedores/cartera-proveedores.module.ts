import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarteraProveedoresRoutingModule } from './cartera-proveedores-routing.module';
import { CarteraProveedoresComponent } from './cartera-proveedores.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    CarteraProveedoresComponent
  ],
  imports: [
    CommonModule,
    CarteraProveedoresRoutingModule,
    AppCustomModule,
    CalendarModule,
    TableModule
  ]
})
export class CarteraProveedoresModule { }
