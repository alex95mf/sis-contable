import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelService } from 'src/app/services/excel.service';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { LcomercialesRoutingModule } from './lcomerciales-routing.module';
import { InspeccionComponent } from './inspeccion/inspeccion.component';
import { ModalContribuyentesComponent } from './inspeccion/modal-contribuyentes/modal-contribuyentes.component';
import { ModalNuevolocalComponent } from './inspeccion/modal-nuevolocal/modal-nuevolocal.component';
import { ModalNuevaInspeccionComponent } from './inspeccion/modal-nueva-inspeccion/modal-nueva-inspeccion.component';
import { ModalBusqContratoComponent } from './inspeccion/modal-busq-contrato/modal-busq-contrato.component';
import { ModalLocalDetComponent } from './inspeccion/modal-local-det/modal-local-det.component';
import { ModalFeriasComponent } from './inspeccion/modal-ferias/modal-ferias.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  providers: [
    ExcelService
  ],
  declarations: [
    InspeccionComponent,
    ModalContribuyentesComponent,
    ModalNuevolocalComponent,
    ModalNuevaInspeccionComponent,
    ModalBusqContratoComponent,
    ModalLocalDetComponent,
    ModalFeriasComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    LcomercialesRoutingModule
  ]
})
export class LcomercialesModule { }
