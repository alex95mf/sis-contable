import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajasFormComponent } from './tesoreria/recaudacion/cajas/cajas-form/cajas-form.component';
// import { CategoriaProductoComponent } from './configuracion/categoria-producto/categoria-producto.component';
import { NewHomeComponent } from './new-home/new-home.component';
import { CategoriaProductoComponent } from './gestion-bienes/configuracion/categoria-producto/categoria-producto.component';
/* import { TomaFisicaModule } from './inventario/toma-fisica/toma-fisica.module';
import { BodegaDespachoModule } from './inventario/bodega/bodega-despacho/bodega-despacho.module';
import { BodegaDistribuirModule } from './inventario/bodega/bodega-distribuir/bodega-distribuir.module';
import { BodegaComprasModule } from './inventario/bodega/bodega-compras/bodega-compras.module';
import { BodegaIngresoModule } from './inventario/bodega/bodega-ingreso/bodega-ingreso.module';
import { OfertasModule } from './inventario/producto/ofertas/ofertas.module';
import { ListaPrecioModule } from './inventario/producto/lista/lista.module';
import { PreciosModule } from './inventario/producto/precios/precios.module';
import { IngresoComprobantesModule } from './contabilidad/comprobantes/ingreso/ingreso.module';
import { AdmDecimoCuartoModule } from './administracion/adm-decimo-cuarto/adm-decimo-cuarto.module';
import { AdmDecimoTerceroModule } from './administracion/adm-decimo-tercero/adm-decimo-tercero.module';
import { AdmAnticipoModule } from './administracion/adm-anticipo/adm-anticipo.module';
import { AdmRolPagoModule } from './administracion/adm-rol-pago/adm-rol-pago.module';
import { PrestamosModule } from './administracion/prestamos/prestamos.module';
import { ParametroadModule } from './administracion/parametroad/parametroad.module';
import { GrupoModule } from './administracion/grupo/grupo.module';
import { CargaFamiliarModule } from './administracion/adm-nomina/carga-familiar/carga-familiar.module';
import { DocumentosModule } from './administracion/adm-nomina/documentos/documentos.module';
import { EmpleadoModule } from './administracion/adm-nomina/empleado/empleado.module';
import { CcMantenimientoModule } from './contabilidad/centro-costo/cc-mantenimiento/cc-mantenimiento.module';
import { ReporteAcfijoModule } from './contabilidad/activo-fijo/reporte-acfijo/reporte-acfijo.module';
import { EtiquetaAcfijoModule } from './contabilidad/activo-fijo/etiqueta-acfijo/etiqueta-acfijo.module';
import { DepreciacionModule } from './contabilidad/activo-fijo/depreciacion/depreciacion.module';
import { ParametrosModule } from './contabilidad/activo-fijo/parametros/parametros.module';
import { AdquisicionesModule } from './contabilidad/activo-fijo/adquisiciones/adquisiciones.module';
import { BalanceGeneralModule } from './contabilidad/estados-financieros/balance-general/balance-general.module';
import { EstadoResultadoModule } from './contabilidad/estados-financieros/estado-resultado/estado-resultado.module';
import { MovimientosContableModule } from './contabilidad/reportes/movimientos-contable/movimientos-contable.module';
import { BalancecomprobacionModule } from './contabilidad/reportes/balancecomprobacion/balancecomprobacion.module';
import { EgresoModule } from './contabilidad/comprobantes/egreso/egreso.module';
import { DiarioModule } from './contabilidad/comprobantes/diario/diario.module';
import { PlanCuentasModule } from './contabilidad/plan-cuentas/plan-cuentas.module';
import { UsuariosOnlineModule } from './sistemas/usuarios-online/usuarios-online.module';
import { BitacoraModule } from './sistemas/bitacora/bitacora.module';
import { GeneralModule } from './sistemas/parametro/general/general.module';
import { EmpresarialModule } from './sistemas/parametro/empresarial/empresarial.module';
import { SeguridadModule } from './sistemas/seguridad/seguridad.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConsultaCentroModule } from './contabilidad/centro-costo/consulta/consulta.module';
import { IngresoProductoModule } from './inventario/producto/ingreso/ingreso.module';
import { ConsultaProductoModule } from './inventario/producto/consulta/consulta.module';
import { CustomersRegisterModule } from './venta/customers/customers-register/customers-register.module';
import { NotaCreditoModule } from './venta/customers/nota-credito/nota-credito.module';
import { NotaDebitoModule } from './venta/customers/nota-debito/nota-debito.module';
import { CustomersConsultModule } from './venta/customers/customers-consult/customers-consult.module';
import { QuotesModule } from './venta/quotes/quotes.module';
import { ReportsVentasModule } from './venta/reports/reports.module';
import { InvoiceSalesModule } from './venta/invoice/invoice-sales/invoice-sales.module';
import { PointSalesModule } from './venta/invoice/point-sales/point-sales.module';
import { SalesElectronicModule } from './venta/invoice/sales-electronic/sales-electronic.module';
import { ReportsInvoiceModule } from './venta/invoice/reports-invoice/reports-invoice.module';
import { ReportsQuotesModule } from './venta/consulta/reports-quotes/reports-quotes.module';
import { BusquedaProductoModule } from './venta/consulta/busqueda-producto/busqueda-producto.module';
import { AsignacionClienteModule } from './venta/consulta/asignacion-cliente/asignacion-cliente.module';
import { DevolucionesModule } from './venta/devoluciones/devoluciones.module';
import { RetencionVentaModule } from './venta/retencion-venta/retencion-venta.module';
import { OrdenesModule } from './compra/ordenes/ordenes.module';
import { FacturaCompraModule } from './compra/factura-compra/factura-compra.module';
import { SuppliersModule } from './inventario/suppliers/suppliers.module';
import { KardexModule } from './compra/kardex/kardex.module';
import { ReportsCompraModule } from './compra/reports-compra/reports-compra.module';
import { RetencionCompraModule } from './compra/retencion-compra/retencion-compra.module';
import { SolicitudModule } from './compra/solicitud/solicitud.module';
import { AperturaModule } from './banco/caja-general/apertura/apertura.module';
import { CierreModule } from './banco/caja-general/cierre/cierre.module';
import { ConsultaCajaModule } from './banco/caja-general/consulta/consulta.module';
import { CreacionModule } from './banco/caja-chica/creacion/creacion.module';
import { ValeModule } from './banco/caja-chica/vale/vale.module';
import { ConsultaCajachCModule } from './banco/caja-chica/consulta-cajach/consulta-cajach.module';
import { BovedasModule } from './banco/cuentas/bovedas/bovedas.module';
import { BancariasModule } from './banco/cuentas/bancarias/bancarias.module';
import { CuentasModule } from './banco/cuentas/cuentas.module';
import { ConciliacionModule } from './banco/conciliacion/conciliacion.module';
import { ReportsBancoModule } from './banco/reportes/reportes.module';
import { TransaccionesModule } from './banco/transacciones/transacciones.module';
import { CobranzaModule } from './cartera/cobranza/cobranza.module';
import { CobranzaReportModule } from './cartera/cobranza/reporte-cobranzas/reporte-cobranzas.module';
import { ChequesPostModule } from './cartera/cheques-post/cheques-post.module';
import { NotaDebitoCarteraModule } from './cartera/nota-debito/nota-debito.module';
import { ProveedoresModule } from './pagos/proveedores/proveedores.module';
import { ReporteCxpModule } from './pagos/reporte-cxp/reporte-cxp.module';
import { ComprasModule } from './proveduria/compras/compras.module';
import { EgresosModule } from './proveduria/egresos/egresos.module';
import { ProductosModule } from './proveduria/productos/productos.module';
import { ReportesModule } from './contabilidad/reportes/reportes.module';
import { PagosServiciosModule } from './proveduria/pagos-servicios/pagos-servicios.module';
import { PedidosModule } from './importacion/pedidos/pedidos.module';
import { GastosModule } from './importacion/gastos/gastos.module';
import { CierrePedidoModule } from './importacion/cierre-pedido/cierre-pedido.module';
import { LiquidacionesModule } from './importacion/liquidaciones/liquidaciones.module'; */


@NgModule({
  declarations: [
    CajasFormComponent,
    CategoriaProductoComponent
  ],
  imports: [
    CommonModule/* ,
    SeguridadModule,
    EmpresarialModule,
    GeneralModule,
    BitacoraModule,
    UsuariosOnlineModule,
    PlanCuentasModule,
    DiarioModule,
    EgresoModule,
    BalancecomprobacionModule,
    MovimientosContableModule,
    EstadoResultadoModule,
    BalanceGeneralModule,
    AdquisicionesModule,
    ParametrosModule,
    DepreciacionModule,
    EtiquetaAcfijoModule,
    ReporteAcfijoModule,
    CcMantenimientoModule,    
    EmpleadoModule,
    DocumentosModule,
    CargaFamiliarModule,
    GrupoModule,
    ParametroadModule,
    PrestamosModule,
    AdmRolPagoModule,
    AdmAnticipoModule,
    AdmDecimoTerceroModule,
    AdmDecimoCuartoModule,
    PreciosModule,
    ListaPrecioModule,
    OfertasModule,
    BodegaIngresoModule,
    BodegaComprasModule,
    BodegaDistribuirModule,
    BodegaDespachoModule,
    TomaFisicaModule,
    DashboardModule,
    ConsultaCentroModule,
    IngresoComprobantesModule,
    IngresoProductoModule,
    ConsultaProductoModule,
    CustomersRegisterModule,
    NotaCreditoModule,
    NotaDebitoModule,
    CustomersConsultModule,
    QuotesModule,
    ReportsVentasModule,
    InvoiceSalesModule,
    PointSalesModule,
    SalesElectronicModule,
    ReportsInvoiceModule,
    ReportsQuotesModule,
    BusquedaProductoModule,
    AsignacionClienteModule,
    DevolucionesModule,
    RetencionVentaModule,
    SolicitudModule,
    OrdenesModule,
    FacturaCompraModule,
    SuppliersModule,
    KardexModule,
    ReportsCompraModule,
    RetencionCompraModule,
    AperturaModule,
    CierreModule,
    ConsultaCajaModule,
    CreacionModule,
    ValeModule,
    ConsultaCajachCModule,
    BancariasModule,
    BovedasModule,
    ConciliacionModule,
    ReportsBancoModule,
    TransaccionesModule,
    CobranzaModule,
    CobranzaReportModule,
    ChequesPostModule,
    NotaDebitoCarteraModule,
    ProveedoresModule,
    ReporteCxpModule,
    ComprasModule,
    EgresosModule,
    ProductosModule,
    ReportesModule,
    PagosServiciosModule,
    PedidosModule,
    GastosModule,
    CierrePedidoModule,
    LiquidacionesModule */

  ]
})

export class ViewModule{

}