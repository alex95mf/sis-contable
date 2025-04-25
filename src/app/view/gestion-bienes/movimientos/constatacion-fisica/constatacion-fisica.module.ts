import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatacionFisicaRoutingModule } from './constatacion-fisica-routing.module';
import { ExcelService } from 'src/app/services/excel.service';
import { ConstatacionFisicaComponent } from './constatacion-fisica.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalBusquedaConstatacionComponent } from './modal-busqueda-constatacion/modal-busqueda-constatacion.component';




@NgModule({
  declarations: [
    ConstatacionFisicaComponent,
    ModalBusquedaConstatacionComponent,


  ],
  providers: [
    ExcelService
  ],
  imports: [
    CommonModule,
    ConstatacionFisicaRoutingModule,
    AppCustomModule
  ]
})
export class ConstatacionFisicaModule { }
