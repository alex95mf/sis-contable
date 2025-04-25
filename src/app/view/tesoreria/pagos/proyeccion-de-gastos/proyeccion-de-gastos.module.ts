import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ProyeccionGastosnRoutingModule } from './proyeccion-de-gastos-routing.module';
import { CalendarModule } from 'primeng/calendar';
//import { TablaAmortizacionRoutingModule } from './tabla-amortizacion-rounting.module';
//import { ComponentModalBusquedaComponent } from './component-modal-busqueda/component-modal-busqueda.component';
//import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';

@NgModule({
  declarations: [
    //ComponentModalBusquedaComponent,
    //ModalBusquedaComponent
  ],
  imports: [
    CommonModule,
    ProyeccionGastosnRoutingModule,
    AppCustomModule,
    CalendarModule
    
    
  ]
})
export class ProyeccionGastosModule { }
