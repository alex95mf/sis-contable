import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesaAyudaRoutingModule } from './mesa-ayuda-routing.module';
import { GestionFormComponent } from './bandeja-trabajo/gestion-form/gestion-form.component'; 
import { SeguimientoFormComponent } from './bandeja-trabajo/seguimiento-form/seguimiento-form.component';
import { ExcelService } from 'src/app/services/excel.service';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';



@NgModule({
  declarations: [

  ],
  providers: [
    ExcelService,
    ValidacionesFactory
  ],
  imports: [
    CommonModule,
    MesaAyudaRoutingModule,
    
  ]
})
export class MesaAyudaModule { }
