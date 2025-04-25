import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { PagosRoutingModule } from './pagos-routing.module';
import { OrdenComponent } from './orden/orden.component';
import { AprobacionComponent } from './aprobacion/aprobacion.component';
import { EmisionComponent } from './emision/emision.component';
import { ListRecDocumentosComponent } from './orden/list-rec-documentos/list-rec-documentos.component';
import { ModalGestionComponent } from './aprobacion/modal-gestion/modal-gestion.component';
import { ModalLiquidacionesComponent } from './emision/modal-liquidaciones/modal-liquidaciones.component';
import { ListDocumentosComponent } from './emision/list-documentos/list-documentos.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { ModalConsultaComponent } from './consulta/modal-consulta/modal-consulta.component';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalImprimirComponent } from './aprobacion/modal-imprimir/modal-imprimir.component';
import { ModalSolicitudComponent } from './orden/modal-solicitud/modal-solicitud.component';
import { ReportesPagosComponent } from './reportes-pagos/reportes-pagos.component';
import { HistorialComprobanteComponent } from './emision/historial-comprobante/historial-comprobante.component';
import { TablaAmortizacionComponent } from './tabla-amortizacion/tabla-amortizacion.component';
import { ModalCajaComponent } from './orden/modal-caja/modal-caja.component';
import { FlujoDeCajaComponent } from './flujo-de-caja/flujo-de-caja.component';
import { ProyeccionDeGastosComponent } from './proyeccion-de-gastos/proyeccion-de-gastos.component';
import { FlujoDeCajaProyectadoComponent } from './flujo-de-caja-proyectado/flujo-de-caja-proyectado.component';
import { ModalSolicitudCatComponent } from './orden/modal-solicitud-cat/modal-solicitud-cat.component';
import { ModalComprasComponent } from './orden/modal-compras/modal-compras.component';
import { MovimientosBancariosComponent } from './emision/movimientos-bancarios/movimientos-bancarios.component';
import { CalendarModule } from 'primeng/calendar';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    OrdenComponent,
    AprobacionComponent,
    EmisionComponent,
    ListRecDocumentosComponent,
    ModalGestionComponent,
    ModalLiquidacionesComponent,
    ListDocumentosComponent,
    ConsultaComponent,
    ModalConsultaComponent,
    ModalImprimirComponent,
    ModalSolicitudComponent,
    ReportesPagosComponent,
    HistorialComprobanteComponent,
    TablaAmortizacionComponent,
    ModalCajaComponent,
    FlujoDeCajaComponent,
    ProyeccionDeGastosComponent,
    FlujoDeCajaProyectadoComponent,
    ModalSolicitudCatComponent,
    ModalComprasComponent,
    MovimientosBancariosComponent
   
  ],
  providers: [
    ExcelService
  ],
  imports: [
    CommonModule,
    PagosRoutingModule,
    AppCustomModule,
    CalendarModule,
    NgxCurrencyModule,
  ]
})
export class PagosModule { }
