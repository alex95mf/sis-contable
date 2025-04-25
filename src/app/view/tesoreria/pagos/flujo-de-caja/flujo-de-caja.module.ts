import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { FlujoCajaRoutingModule } from './flujo-de-caja-routing.module';
import { CalendarModule } from 'primeng/calendar';

//import { ComponentModalBusquedaComponent } from './component-modal-busqueda/component-modal-busqueda.component';
//import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';

@NgModule({
  declarations: [
    //ComponentModalBusquedaComponent,
    //ModalBusquedaComponent
  ],
  imports: [
    CommonModule,
    FlujoCajaRoutingModule,
    AppCustomModule,
    CalendarModule
    
    
  ]
})
export class FlujoCajanModule { }