import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { JuiciosRoutingModule } from './juicios.routing';
import { JuiciosComponent } from './juicios.component';
import { ModalAbogadosComponent } from './modal-abogados/modal-abogados.component';
import { ModalActuacionesComponent } from './modal-actuaciones/modal-actuaciones.component';
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { ModalNuevoJuicioComponent } from './modal-nuevoJuicio/modal-nuevoJuicio.component';
import { ModalCitacionComponent } from './modal-citacion/modal-citacion.component';
import { ModalNuevoAbogadoComponent } from './modal-nuevoAbogado/modal-nuevoAbogado.component';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { ExcelService } from 'src/app/services/excel.service';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  providers: [
    ExcelService,
  ],
  declarations: [
    JuiciosComponent,
    ModalAbogadosComponent,
    ModalActuacionesComponent,
    ModalNuevoJuicioComponent,
    AnexosListComponentDis,
    ModalCitacionComponent,
    ModalNuevoAbogadoComponent,
    AnexosListComponentDis,
    ConceptoDetComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    JuiciosRoutingModule,
    NgxCurrencyModule,
  ]
})
export class JuiciosModule { }
