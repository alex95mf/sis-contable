import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoactivaRoutingModule } from './coactiva-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { EmisionExpedienteComponent } from './emision-expediente/emision-expediente.component';
import { ReporteComponent } from './reporte/reporte.component';
//import { AbogadosComponent } from './abogados/abogados.component';


@NgModule({
  declarations: [

  
    //AbogadosComponent
  
    ReporteComponent
  ],
  imports: [
    CommonModule,
    CoactivaRoutingModule,
    AppCustomModule
  ]
})
export class CoactivaModule { }
