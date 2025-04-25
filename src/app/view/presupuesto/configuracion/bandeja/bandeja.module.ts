import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaRoutingModule } from './bandeja-routing.module';
import { BandejaComponent } from './bandeja.component';
import { ExcelService } from 'src/app/services/excel.service';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalBusquedaReformaComponent } from './modal-busqueda-reforma/modal-busqueda-reforma.component';


@NgModule({
  declarations: [
    BandejaComponent,
    ModalBusquedaReformaComponent
  ],
  providers: [
    ExcelService
  ],
  imports: [
    CommonModule,
    BandejaRoutingModule,
    AppCustomModule
  ]
})
export class BandejaModule { }
