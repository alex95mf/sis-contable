import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReformaRoutingModule } from './reforma-routing.module';
import { ReformaComponent } from './reforma.component';
import { ExcelService } from 'src/app/services/excel.service';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalBusquedaReformaComponent } from './modal-busqueda-reforma/modal-busqueda-reforma.component';


@NgModule({
  declarations: [
    ReformaComponent,
    ModalBusquedaReformaComponent
  ],
  providers: [
    ExcelService
  ],
  imports: [
    CommonModule,
    ReformaRoutingModule,
    AppCustomModule
  ]
})
export class ReformaModule { }
