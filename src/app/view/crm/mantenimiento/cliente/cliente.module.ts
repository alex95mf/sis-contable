import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteComponent } from './cliente.component';
import { ModalBuscarClienteComponent } from './modal-buscar-cliente/modal-buscar-cliente.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


import { GoogleMapComponent } from './google-map/google-map.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';


@NgModule({
  declarations: [
    ClienteComponent,
    ModalBuscarClienteComponent,
    GoogleMapComponent,
    ModalVistaFotosComponent
 
  ],
  imports: [

    CommonModule,
    ClienteRoutingModule,
    AppCustomModule,
   // GoogleMapsModule
   /*
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD42IeBfULXCHiaTJJ_4PIp40R5NMG-p-c', // Reemplaza con tu API key de Google Maps
      libraries: ['places']
    })
      */
   
  ]
})
export class ClienteModule { }
