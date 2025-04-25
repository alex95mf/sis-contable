import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimientosRoutingModule } from './movimientos-routing.module';
import { IngresoBodegaComponent } from './ingreso-bodega/ingreso-bodega.component';
import { EgresosBodegaComponent } from './egresos-bodega/egresos-bodega.component';
import { PrestamoComponent } from './prestamo/prestamo.component';
import { TrasladoComponent } from './traslado/traslado.component';
// import { ConstatacionFisicaComponent } from './constatacion-fisica/constatacion-fisica.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListDocumentosComponent } from './ingreso-bodega/list-documentos/list-documentos.component';
import { ListBusquedaComponent } from './ingreso-bodega/list-busqueda/list-busqueda.component';
import { ListBusquedaTrasladoComponent } from './traslado/list-busqueda/list-busqueda-traslado.component';
import { ListBusquedaPrestamoComponent } from './prestamo/list-busqueda-prestamo/list-busqueda-prestamo.component';
import { BusquedaPrestamoComponent } from './prestamo/busqueda-prestamo/busqueda-prestamo.component';
import { BusquedaPrestamoSalidasComponent } from './prestamo/busqueda-prestamo-salidas/busqueda-prestamo-salidas.component';
import { ModalGruposComponent } from './ingreso-bodega/modal-grupos/modal-grupos.component';
import { ModalCodigoBienesComponent } from './ingreso-bodega/modal-codigo-bienes/modal-codigo-bienes.component';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { EncargadoTrasladoComponent } from './traslado/encargado-traslado/encargado-traslado.component';
import { AnexosListComponentDis } from './prestamo/anexos-list/anexos-list-dis.component';
//import { ConstatacionFisicaBCAComponent } from './constatacion-fisica-bca/constatacion-fisica-bca.component';
import { AnexosListComponent } from './mantenimiento/anexos-list/anexos-list.component';
import { AnexoBodegaComponent } from './ingreso-bodega/anexo-bodega/anexo-bodega.component';
import { NgxCurrencyModule } from 'ngx-currency';

//import { DetallesProductoComponent } from './traslado/detalles-producto/detalles-producto.component';

@NgModule({
  declarations: [
    IngresoBodegaComponent,
    EgresosBodegaComponent,
    TrasladoComponent,
    PrestamoComponent,
    AnexoBodegaComponent,
    ListDocumentosComponent,
    ListBusquedaComponent,
    ListBusquedaPrestamoComponent,
    BusquedaPrestamoComponent,
    ModalGruposComponent,
    ModalCodigoBienesComponent,
    EncargadoComponent,
    EncargadoTrasladoComponent,
    AnexosListComponentDis,
    BusquedaPrestamoSalidasComponent,
    ListBusquedaTrasladoComponent,
    //ConstatacionFisicaBCAComponent

    //DetallesProductoComponent
  ],
  imports: [
    CommonModule,
    MovimientosRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class MovimientosModule { }
