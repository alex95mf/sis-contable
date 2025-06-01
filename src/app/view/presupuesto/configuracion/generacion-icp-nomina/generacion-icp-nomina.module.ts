import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneracionIcpNominaRoutingModule } from './generacion-icp-nomina-routing.module';
import { GeneracionIcpNominaComponent } from './generacion-icp-nomina.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalIngresoAsignacionComponent } from './modal-ingreso-asignacion/modal-ingreso-asignacion.component';
import { ModalCedulaPresupuestariaComponent } from './modal-cedula-presupuestaria/modal-cedula-presupuestaria.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    GeneracionIcpNominaComponent,
    ListRecDocumentosComponent,
    ModalIngresoAsignacionComponent,
    ModalCedulaPresupuestariaComponent
  ],
  imports: [
    CommonModule,
    GeneracionIcpNominaRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class GeneracionIcpNominaModule { }
