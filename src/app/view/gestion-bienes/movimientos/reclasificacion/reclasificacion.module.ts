import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReclasificacionRoutingModule } from './reclasificacion.routing';
import { ReclasificacionComponent } from './reclasificacion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalReasignacionComponent } from './modal-reasignacion/modal-reasignacion.component';


@NgModule({
  declarations: [
    ReclasificacionComponent,
    ModalReasignacionComponent
  ],
  imports: [
    AppCustomModule,
    NgxCurrencyDirective,
    CommonModule,
    ReclasificacionRoutingModule
  ]
})
export class ReclasificacionModule { }
