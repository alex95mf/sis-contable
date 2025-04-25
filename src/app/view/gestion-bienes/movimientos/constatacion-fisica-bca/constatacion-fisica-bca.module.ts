import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatacionFisicaBCARoutingModule } from './constatacion-fisica-bca-routing.module';
import { ExcelService } from 'src/app/services/excel.service';
import { ConstatacionFisicaBCAComponent } from './constatacion-fisica-bca.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalBusquedaConstatacionComponent } from './modal-busqueda-constatacion/modal-busqueda-constatacion.component';




@NgModule({
  declarations: [
    ConstatacionFisicaBCAComponent,
    ModalBusquedaConstatacionComponent,


  ],
  providers: [
    ExcelService
  ],
  imports: [
    CommonModule,
    ConstatacionFisicaBCARoutingModule,
    AppCustomModule
  ]
})
export class ConstatacionFisicaBCAModule { }
