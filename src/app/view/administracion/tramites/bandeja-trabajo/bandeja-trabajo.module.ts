import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaTrabajoRoutingModule } from './bandeja-trabajo-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AnexosListComponentDis } from '../anexos-list/anexos-list-dis.component';
import { BandejaTrabajoComponent } from './bandeja-trabajo.component';
import { SeguimientoFormComponent } from './seguimiento-form/seguimiento-form.component';
import { GestionFormComponent } from './gestion-form/gestion-form.component';
import { ModalAnexosComponent } from './seguimiento-form/modal-anexos/modal-anexos.component';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    SeguimientoFormComponent,
    GestionFormComponent,
    BandejaTrabajoComponent,
    AnexosListComponentDis,
    ModalAnexosComponent,
  ],
  imports: [
    CommonModule,
    BandejaTrabajoRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService
  ]
})
export class BandejaTrabajoModule { }
