import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExcelService } from 'src/app/services/excel.service';

import { FormularioNuevoRoutingModule } from './formulario-nuevo-routing.module';
import { FormularioNuevoComponent } from './formulario-nuevo.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { ModalEditionComponent } from './modal-edition/modal-edition.component';


@NgModule({
  providers: [
    ExcelService,
  ],
  declarations: [
    FormularioNuevoComponent,
    ModalDetallesComponent,
    ModalEditionComponent
  ],
  imports: [
    CommonModule,
    FormularioNuevoRoutingModule,
    AppCustomModule
  ]
})
export class FormularioNuevoModule { }
