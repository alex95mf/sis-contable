import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FlujoCajaProyectadonRoutingModule } from './flujo-de-caja-proyectado-routing.module';
import { CalendarModule } from 'primeng/calendar';
//import { TablaAmortizacionRoutingModule } from './tabla-amortizacion-rounting.module';
//import { ComponentModalBusquedaComponent } from './component-modal-busqueda/component-modal-busqueda.component';
//import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FlujoCajaProyectadonRoutingModule,
    AppCustomModule,
    CalendarModule
    
    
  ]
})
export class FlujoCajaProyectadoModule { }