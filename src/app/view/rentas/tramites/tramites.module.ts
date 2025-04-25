import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';

import { TramitesRoutingModule } from './tramites.routing';
import { TramitesComponent } from './tramites.component';
import { ModalTramiteDetallesComponent } from './modal-tramite-detalles/modal-tramite-detalles.component';


@NgModule({
  declarations: [
    TramitesComponent,
    ModalTramiteDetallesComponent
  ],
  imports: [
    CommonModule,
    TramitesRoutingModule,
    AppCustomModule,
  ],
  providers: [
    ExcelService
  ],
})
export class TramitesModule { }
