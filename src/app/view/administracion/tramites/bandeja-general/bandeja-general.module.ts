import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaGeneralRoutingModule } from './bandeja-general-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AnexosListComponentDis } from '../anexos-list/anexos-list-dis.component';
import { BandejaGeneralComponent } from './bandeja-general.component';
import { SeguimientoFormComponent } from './seguimiento-form/seguimiento-form.component';
import { GestionFormComponent } from './gestion-form/gestion-form.component';
import { ModalAnexosComponent } from './seguimiento-form/modal-anexos/modal-anexos.component';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    SeguimientoFormComponent,
    GestionFormComponent,
    BandejaGeneralComponent,
    AnexosListComponentDis,
    ModalAnexosComponent,
  ],
  imports: [
    CommonModule,
    BandejaGeneralRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService
  ]
})
export class BandejaGeneralModule { }
