import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { DepreciacionRoutingModule } from './depreciacion.routing';
import { DepreciacionComponent } from './depreciacion.component';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    DepreciacionComponent,
    ModalBusquedaComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    DepreciacionRoutingModule
  ],
  providers: [
    ExcelService,
  ]
})
export class DepreciacionModule { }
