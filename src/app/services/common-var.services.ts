import { Injectable, OnInit } from "@angular/core";
import { Subject } from 'rxjs';
import { ApiServices } from '../services/api.service';
declare const Buffer: any;
@Injectable()
export class CommonVarService {
  setDocOrder: Subject<any>;//comunicacion entre ordenesComponent y anexos-doc-component
  setPosition: Subject<any>;
  setPositionBuy: Subject<any>;
  nextStatus: Subject<any>;
  actionAprobada: Subject<any>;
  deleteDocument: Subject<any>;
  setCuentaData: Subject<any>;
  setData: Subject<any>;
  listenDifered: Subject<any>;
  listenOrders: Subject<any>;
  setListProduct: Subject<any>;
  setListProductInvoice: Subject<any>;
  listenDiferedInvoice: Subject<any>;
  setListProductEdit: Subject<any>;
  listenQuotes: Subject<any>;
  listenDispached: Subject<any>;
  setProductData: Subject<any>;
  setAccountBanks: Subject<any>;
  setValueCaja: Subject<any>;
  setValueCajaCierre: Subject<any>;
  setAccountClose: Subject<any>;
  setTotalAccount: Subject<any>;
  listenDiferedActivoFijo: Subject<any>;
  listenSetActivoFijo: Subject<any>;
  listenDiferedBuyProv: Subject<any>;
  listenSetBuyProv: Subject<any>;
  listenImagenes: Subject<any>;
  listenDocumentos: Subject<any>;
  sendAnexos: Subject<any>;
  setModalCliente: Subject<any>;
  listenAccountBoxSmall: Subject<any>;
  listenBoxSmall: Subject<any>;
  dataPersonal: Subject<any>;
  listenBoxSmallReposition: Subject<any>;
  setAccountComprobantes: Subject<any>;
  setAccountComprobantesIg: Subject<any>;
  setAccountNCV: Subject<any>;
  setVaucheresEgress: Subject<any>;
  setVaucheresIgress: Subject<any>;
  showDevolutionsListen: Subject<any>;
  setNotasCreditoVenta: Subject<any>;
  showPASListen: Subject<any>;
  setNotasDebitoVenta: Subject<any>;
  setAccountNDV: Subject<any>;
  refreshNDV: Subject<any>;
  listenDiferedPedid: Subject<any>;
  listenPedidosImp: Subject<any>;
  setCuentasFisica: Subject<any>;
  listenDiferedGastosImp: Subject<any>;
  listenGastosImp: Subject<any>;
  listenCierrePedidosImp: Subject<any>;
  listenLiquidacionImp: Subject<any>;
  cancelImpLiqui: Subject<any>;
  listenDiferedPedidosImp: Subject<any>;
  cancelImpPedido: Subject<any>;
  cancelImpGasto: Subject<any>;
  cancelImpPed: Subject<any>;
  listenRecetionPedidosImp: Subject<any>;
  setCuentasFisicados: Subject<any>;
  setDataestadoCuenta: Subject<any>;
  setDatacliente: Subject<any>;
  setDataUltimo: Subject<any>;
  updPerm: Subject<any>;
  setDtConsulta: Subject<any>;
  changePermisions: Subject<any>;
  smallListenAccountBox: Subject<any>;
  paramsAccount: Subject<any>;
  listeButtonEmpresa: Subject<any>;
  listeButtonPtEm: Subject<any>;
  listenCxp: Subject<any>;
  listenCxpRes: Subject<any>;
  refreshSucursal: Subject<any>;
  setSupervisorBox: Subject<any>;
  refreshPurchases: Subject<any>;
  listenvendedor: Subject<any>;
  editVendedor: Subject<any>;
  editVendedorContact: Subject<any>;
  clearContact : Subject<any>;
  listendistribuidor: Subject<any>;
  editDistribuidor: Subject<any>;
  listencontribuyente: Subject<any>;
  editContribuyente: Subject<any>;
  listenConcepto: Subject<any>;
  editConcepto: Subject<any>;
  editAbogado: Subject<any>;
  // Rentas / Configuracion / Tarifa
  editTarifa: Subject<any>;
  // Rentas / Liquidacion / Generacion
  editLiquidacion: Subject<any>;
  addLiquidacion: Subject<any>;
  // Rentas / Mercados / Contrato
  clearContratoForm: Subject<any>;
  editContrato: Subject<any>;
  getContribuyenteContrato: Subject<any>;
  editPuestoMercado: Subject<any>;
  editArancel: Subject<any>;
  selectArancelLiqRP: Subject<any>;
  selectExonerLiqRP: Subject<any>;
  selectContribuyenteLiqRP: Subject<any>;
  selectListLiqRP: Subject<any>;
  selectExonerLiqPURen: Subject<any>;
  selectContribuyenteLiqPURen: Subject<any>;
  selectListLiqPURen: Subject<any>;
  editCuantia: Subject<any>;
  editExoneracion: Subject<any>;
  selectContribuyenteLiqRen: Subject<any>;
  editConceptoDet: Subject<any>;
  selectContribuyenteConfRen: Subject<any>;

  //Arriendos
  selectListLiqArriendo : Subject<any>;
  //Permisos de Construccion
  selectListLiqPermisos: Subject<any>;

  //plusvalias y alcabalas
  selectListLiq: Subject<any>;
  selectExoneracion: Subject<any>;
  selectContribuyenteLiquid : Subject<any>;
  selectContribuyenteC: Subject<any>;
  selectExonerPV: Subject<any>;
  selectExonerAL: Subject<any>;
  selectGrupo: Subject<any>;
  selectSubGrupo: Subject<any>;
  // Rentas / Locales comerciales / Formularios
  selectLocalInspeccion: Subject<any>;
  // Inspeccion
  setNuevoLocal: Subject<any>;
  setActualizarLocal: Subject<any>;
  setNuevaInspeccion: Subject<any>;
  // Asignacion
  editAsignacion: Subject<any>;
  // Formularios
  selectInspeccionRentas: Subject<any>;
  selectInspeccionHigiene: Subject<any>;
  selectInspeccionComisaria: Subject<any>;
  selectInspeccionPlanificacion: Subject<any>;
  updateFormularioCabRen: Subject<any>;
  updateFormularioCabHig: Subject<any>;
  updateFormularioCabCom: Subject<any>;
  updateFormularioCabPlanificacion: Subject<any>;
  updateFormularioCab: Subject<any>;
  selectContratoContribuyente: Subject<any>;
  setPersonalNom: Subject<any>;
  setJornadaNom: Subject<any>;
  setNuevaInspeccionCom: Subject<any>;
  setNuevaInspeccionPlanificacion: Subject<any>;
  
  editFormInspPlanificacion: Subject<any>;
  getInspeccionCompleta: Subject<any>;

  editCategoriasEspPublicitario:Subject<any>;
  editLugarTuristico:Subject<any>;

  selectConcepLiqLCRen: Subject<any>;

  editMetaPlanificacion: Subject<any>;
  selectCodigoCompras: Subject<any>
  asignaTareas: Subject<any>

  selectContribuyenteCustom: Subject<any>;
  selectConceptoCustom: Subject<any>;
  selectConceptoTemp: Subject<any>;
  guardarActivos: Subject<any>;
  guardarVehiculos: Subject<any>;
  numVehiculos: Subject<any>;

  updateCliente: Subject<any>;
  editarViaspublicas: Subject<any>;

  needRefresh: Subject<any>;
  listenTablasConfig: Subject<any>;
  editarTablasConfig: Subject<any>;

  guardarConcepto: Subject<any>;
  editarConcepto: Subject<any>;
  contribAnexoLoad: Subject<any>;
  contribAnexoLoad2: Subject<any>;

  contratacionAnexoLoad: Subject<any>;

  saveContribu: Subject<any>;
  searchDiscapContribu: Subject<any>;
  loadActivo: Subject<any>;
  diableCargarDis: Subject<any>;
  disableCargarTutor: Subject<any>;
  disableCargarTutorEnf: Subject<any>;
  disableCargarPrestamo: Subject<any>;
  disableCargarCoop: Subject<any>;
  clearContribu: Subject<any>;
  deleteAnexos: Subject<any>;
  clearAnexos: Subject<any>;

  diableCargarArt: Subject<any>;
  disableCargarEnf: Subject<any>;

  guardaActivosPorCiudad: Subject<any>;

  editarTasasVarias: Subject<any>;
  limpiarArchivos: Subject<any>;

  selectLiqAnulacion: Subject<any>;
  limpiarSupervivencia: Subject<any>;
  mesaAyuTicket:Subject<any>;
  bandTrabTicket:Subject<any>;
  seguiTicket:Subject<any>;
 

  selectPago: Subject<any>;
  selectContrato: Subject<any>;
  selectDetContrato: Subject<any>;
  selectAnexo: Subject<any>;
  selectCondicion: Subject<any>;

  selectRecDocumento: Subject<any>;
  selectRecDocumentoOrden: Subject<any>;
  selectInventario: Subject<any>;
  selectProducto: Subject<any>;
  selectUbicacionProducto: Subject<any>;
  selectPrestamo: Subject<any>;
  selectCatalogo: Subject<any>;
  selectGarantia: Subject<any>;
  selectValorFavor: Subject<any>;
  selectPoliza: Subject<any>;
  selecContMultas: Subject<any>;

  usuarioTramite: Subject<any>;

  selectTramites: Subject<any>;

  modalDetallesCobro: Subject<any>;

  modalEditionDetallesCobro: Subject<any>;
  selectProveedorCustom: Subject<any>;

  juicioAsignaAbogado: Subject<any>;
  juicioActuacion: Subject<any>;

  guardarAprobacion: Subject<any>;

  cobros: Subject<any>;
  compPubInfimas: Subject<any>;
  CpCatElecOrden:Subject<any>;

  CatalogoBienes:Subject<any>;
  EgresosBodega:Subject<any>;
  TrasladoBienes:Subject<any>;
  PrestamoBienes:Subject<any>;
  PrestamoBienesSalidas:Subject<any>;

  encargadoSelect:Subject<any>;

  seleciconSolicitud:Subject<any>;
  regProveedores:Subject<any>;
  selectCruceConv:Subject<any>;

  seleciconCategoriaCuentaPro:Subject<any>;
  gestionTicket: Subject<any>;
  departamentoSelect:Subject<any>;
  departamentoSelectRes:Subject<any>;


  updateCitaciones: Subject<any>

  updateAbogados:Subject<any>;

  modalMovimientoBanco:Subject<any>;

  modalConfiguracionContable:Subject<any>;

  modalEspeciesFiscales:Subject<any>;

  modalAnulacionEspeciesFiscales:Subject<any>;

  modalMovimientosBancarisoAF:Subject<any>;

  modalAsignacionIngreso:Subject<any>;

  modalReformaBusqueda:Subject<any>;
  modalReformaBusquedageneral:Subject<any>;
  modalConstFisica:Subject<any>;
  modalJornada:Subject<any>;
  modalActualizarAmortizacion:Subject<any>;

  modalreformaInterna:Subject<any>;

  modalreformaPrespuestoCod:Subject<any>;

  clearAnexosPrestamo: Subject<any>;

  modalCajaChica: Subject<any>;

  modalFacturaCajaChica: Subject<any>;
  modalFacturaRecDocumento: Subject<any>;
  editArea: Subject<any>;

  modalAreaDepartamento: Subject<any>;

  modalDepartamento: Subject<any>;

  modalCambioEstaIDP: Subject<any>;

  modalFamiliares: Subject<any>;

  modalCargarRubros: Subject<any>;

  modalProgramArea: Subject<any>;

  modalCargarRetIVA: Subject<any>;

  selectLote: Subject<any>;
  selectUsuario : Subject<any>;
  modalParametrosNomina: Subject<any>;

  constructor(private apiService: ApiServices) {
    this.setDocOrder = new Subject<any>();
    this.selectPago = new Subject<any>();
    this.selectCondicion = new Subject<any>();
    
    this.selectAnexo = new Subject<any>();
    this.selectContrato = new Subject<any>();
    this.selectDetContrato = new Subject<any>();
    
    this.setPosition = new Subject<any>();
    this.setPositionBuy = new Subject<any>();
    this.nextStatus = new Subject<any>();
    this.actionAprobada = new Subject<any>();
    this.deleteDocument = new Subject<any>();
    this.setCuentaData = new Subject<any>();
    this.setData = new Subject<any>();
    this.listenDifered = new Subject<any>();
    this.listenOrders = new Subject<any>();
    this.setListProduct = new Subject<any>();
    this.setListProductInvoice = new Subject<any>();
    this.listenDiferedInvoice = new Subject<any>();
    this.setListProductEdit = new Subject<any>();
    this.listenQuotes = new Subject<any>();
    this.listenDispached = new Subject<any>();
    this.setProductData = new Subject<any>();
    this.setAccountBanks = new Subject<any>();
    this.setValueCaja = new Subject<any>();
    this.setValueCajaCierre = new Subject<any>();
    this.setAccountClose = new Subject<any>();
    this.setTotalAccount = new Subject<any>();
    this.listenDiferedActivoFijo = new Subject<any>();
    this.listenSetActivoFijo = new Subject<any>();
    this.listenDiferedBuyProv = new Subject<any>();
    this.listenSetBuyProv = new Subject<any>();
    this.listenImagenes = new Subject<any>();
    this.listenDocumentos = new Subject<any>();
    this.sendAnexos = new Subject<any>();
    this.setModalCliente = new Subject<any>();
    this.listenImagenes = new Subject<any>();
    this.listenDocumentos = new Subject<any>();
    this.sendAnexos = new Subject<any>();
    this.listenAccountBoxSmall = new Subject<any>();
    this.listenBoxSmall = new Subject<any>();
    this.dataPersonal = new Subject<any>();
    this.listenBoxSmallReposition = new Subject<any>();
    this.setAccountComprobantes = new Subject<any>();
    this.setAccountComprobantesIg = new Subject<any>();
    this.setAccountNCV = new Subject<any>();
    this.setVaucheresEgress = new Subject<any>();
    this.showDevolutionsListen = new Subject<any>();
    this.setNotasCreditoVenta = new Subject<any>();
    this.setVaucheresIgress = new Subject<any>();
    this.showPASListen = new Subject<any>();
    this.setNotasDebitoVenta = new Subject<any>();
    this.setAccountNDV = new Subject<any>();
    this.refreshNDV = new Subject<any>();
    this.listenDiferedPedidosImp = new Subject<any>();
    this.listenPedidosImp = new Subject<any>();
    this.listenDiferedGastosImp = new Subject<any>();
    this.listenGastosImp = new Subject<any>();
    this.listenCierrePedidosImp = new Subject<any>();
    this.setCuentasFisica = new Subject<any>();
    this.listenLiquidacionImp = new Subject<any>();
    this.cancelImpLiqui = new Subject<any>();
    this.cancelImpPedido = new Subject<any>();
    this.cancelImpGasto = new Subject<any>();
    this.cancelImpPed = new Subject<any>();
    this.listenRecetionPedidosImp = new Subject<any>();
    this.setCuentasFisicados = new Subject<any>();
    this.setDataestadoCuenta = new Subject<any>();
    this.setDatacliente = new Subject<any>();
    this.setDataUltimo = new Subject<any>();
    this.updPerm = new Subject<any>();
    this.setDtConsulta = new Subject<any>();
    this.changePermisions = new Subject<any>();
    this.smallListenAccountBox = new Subject<any>();
    this.paramsAccount = new Subject<any>();
    this.listeButtonEmpresa = new Subject<any>();
    this.listeButtonPtEm = new Subject<any>();
    this.listenCxp = new Subject<any>();
    this.listenCxpRes = new Subject<any>();
    this.refreshSucursal = new Subject<any>();
    this.setSupervisorBox = new Subject<any>();
    this.refreshPurchases = new Subject<any>();
    this.listenvendedor = new Subject<any>();
    this.editVendedor = new Subject<any>();
    this.editVendedorContact = new Subject<any>();
    this.clearContact = new Subject<any>();
    this.setPersonalNom  = new Subject<any>();
    this.setJornadaNom  = new Subject<any>();
    this.listendistribuidor = new Subject<any>();
    this.editDistribuidor = new Subject<any>();
    this.listencontribuyente = new Subject<any>();
    this.editContribuyente = new Subject<any>();
    this.listenConcepto = new Subject<any>();
    this.editConcepto = new Subject<any>();
    this.editAbogado = new Subject<any>();
    this.editTarifa = new Subject<any>();
    this.editLiquidacion = new Subject<any>();
    this.addLiquidacion = new Subject<any>();
    this.editContrato = new Subject<any>();
    this.getContribuyenteContrato = new Subject<any>();
    this.editPuestoMercado = new Subject<any>();
    this.editArancel = new Subject<any>();
    this.selectArancelLiqRP = new Subject<any>();
    this.selectExonerLiqRP = new Subject<any>();
    this.selectContribuyenteLiqRP = new Subject<any>();
    this.selectListLiqRP = new Subject<any>();
    this.selectExonerLiqPURen = new Subject<any>();
    this.selectExonerPV = new Subject<any>();
    this.selectExonerAL = new Subject<any>();
    this.selectGrupo = new Subject<any>();
    this.selectSubGrupo = new Subject<any>();
    
    
    
    this.selectContribuyenteLiqPURen = new Subject<any>();
    this.selectListLiqPURen = new Subject<any>();

    //
    this.selectListLiq = new Subject<any>();
    this.selectExoneracion = new Subject<any>();
    this.selectContribuyenteLiquid = new Subject<any>();
    this.selectContribuyenteC = new Subject<any>();

    //Arriendos
    this.selectListLiqArriendo = new Subject<any>();
    //Permisos
    this.selectListLiqPermisos = new Subject<any>();


    this.editCuantia = new Subject<any>();
    this.editExoneracion = new Subject<any>();
    this.selectContribuyenteConfRen = new Subject<any>();
    this.selectContribuyenteLiqRen = new Subject<any>();
    this.editConceptoDet = new Subject<any>();
    this.selectInspeccionHigiene = new Subject<any>();
    this.editAsignacion = new Subject<any>();
    this.selectInspeccionRentas = new Subject<any>();
    this.selectInspeccionPlanificacion = new Subject<any>();
    this.selectInspeccionComisaria = new Subject<any>();

    this.selectLocalInspeccion = new Subject<any>();
    this.setNuevoLocal = new Subject<any>();
    this.setActualizarLocal = new Subject<any>();
    this.setNuevaInspeccion = new Subject<any>();
    this.updateFormularioCabRen = new Subject<any>();
    this.setNuevaInspeccionCom = new Subject<any>();
    this.updateFormularioCabCom = new Subject<any>();
    this.updateFormularioCabHig = new Subject<any>();
    this.updateFormularioCab = new Subject<any>();
    this.setNuevaInspeccionPlanificacion = new Subject<any>();
    this.updateFormularioCabPlanificacion = new Subject<any>();
    this.editFormInspPlanificacion = new Subject<any>();

    this.getInspeccionCompleta = new Subject<any>();
    this.selectContratoContribuyente = new Subject<any>();

    this.editCategoriasEspPublicitario = new Subject<any>();
    this.editLugarTuristico = new Subject<any>();
    this.selectConcepLiqLCRen = new Subject<any>();

    this.editMetaPlanificacion = new Subject<any>();
    this.selectCodigoCompras = new Subject<any>()
    this.asignaTareas = new Subject<any>()

    this.selectContribuyenteCustom = new Subject<any>();
    this.selectConceptoCustom = new Subject<any>();
    this.selectConceptoTemp = new Subject<any>();

    this.guardarActivos = new Subject<any>();
    this.guardarVehiculos = new Subject<any>();
    this.numVehiculos = new Subject<any>();

    this.editarViaspublicas = new Subject<any>();
    this.clearContratoForm = new Subject<any>()

    this.needRefresh = new Subject<any>();
    this.listenTablasConfig = new Subject<any>();
    this.editarTablasConfig = new Subject<any>();

    this.guardarConcepto = new Subject<any>();
    this.editarConcepto = new Subject<any>();
    this.contribAnexoLoad = new Subject<any>();
    this.contribAnexoLoad2 = new Subject<any>();

    this.contratacionAnexoLoad = new Subject<any>();
    

    this.saveContribu = new Subject<any>();
    this.searchDiscapContribu = new Subject<any>();
    this.loadActivo  = new Subject<any>();
    this.diableCargarDis = new Subject<any>();
    this.diableCargarArt = new Subject<any>();
    this.disableCargarEnf = new Subject<any>();
    this.disableCargarTutor = new Subject<any>();
    this.disableCargarTutorEnf = new Subject<any>();
    this.disableCargarPrestamo = new Subject<any>();
    this.disableCargarCoop = new Subject<any>();
    this.clearContribu = new Subject<any>();
    this.deleteAnexos = new Subject<any>();
    this.clearAnexos = new Subject<any>();
    this.editarTasasVarias = new Subject<any>();
    this.guardaActivosPorCiudad = new Subject<any>();

    this.limpiarArchivos = new Subject<any>();

    this.selectLiqAnulacion = new Subject<any>();
    this.limpiarSupervivencia = new Subject<any>();
    this.mesaAyuTicket = new Subject<any>();
    this.bandTrabTicket = new Subject<any>();
    this.seguiTicket = new Subject<any>();
    

    this.usuarioTramite = new Subject<any>();

    this.selectTramites = new Subject<any>();

    this.selectRecDocumento = new Subject<any>();
    this.selectRecDocumentoOrden = new Subject<any>();
    this.selectInventario = new Subject<any>();
    this.selectProducto = new Subject<any>();
    this.selectUbicacionProducto = new Subject<any>();
    
    this.selectCatalogo = new Subject<any>();
    
    
    this.selectGarantia = new Subject<any>();
    this.selectValorFavor = new Subject<any>();

    this.modalDetallesCobro = new Subject<any>();

    this.modalEditionDetallesCobro = new Subject<any>();
    this.selectProveedorCustom = new Subject<any>();

    this.juicioAsignaAbogado = new Subject<any>();
    this.juicioActuacion = new Subject<any>();

    this.guardarAprobacion = new Subject<any>();

    this.cobros = new Subject<any>();
    this.compPubInfimas= new Subject<any>();
    this.CpCatElecOrden = new Subject<any>();

    this.CatalogoBienes = new Subject<any>();
    this.EgresosBodega = new Subject<any>();
    this.TrasladoBienes = new Subject<any>();
    this.PrestamoBienes = new Subject<any>();
    this.PrestamoBienesSalidas = new Subject<any>();
  
    this.encargadoSelect = new Subject<any>();

    this.seleciconSolicitud = new Subject<any>();
    this.regProveedores = new Subject<any>();
    this.selectCruceConv = new Subject<any>();
    
    this.gestionTicket = new Subject<any>();
    this.seleciconCategoriaCuentaPro = new Subject<any>();
    this.departamentoSelect= new Subject<any>();
    this.departamentoSelectRes = new Subject<any>();

    this.updateAbogados = new Subject<any>();
  
    this.seleciconCategoriaCuentaPro = new Subject<any>();

    this.updateCitaciones = new Subject<any>()

    this.modalMovimientoBanco = new Subject<any>()

    this.modalConfiguracionContable = new Subject<any>()

    this.modalEspeciesFiscales = new Subject<any>();

    this.modalAnulacionEspeciesFiscales = new Subject<any>();

    this.modalMovimientosBancarisoAF = new Subject<any>();

    this.modalAsignacionIngreso =new Subject<any>();
    this.modalReformaBusquedageneral = new Subject<any>();
    this.modalReformaBusqueda = new Subject<any>();

    this.modalConstFisica = new Subject<any>();

    this.modalJornada = new Subject<any>();

    this.modalActualizarAmortizacion = new Subject<any>();
    this.modalreformaInterna = new Subject<any>();

    this.modalreformaPrespuestoCod = new Subject<any>();
    

    this.clearAnexosPrestamo = new Subject<any>();
    this.selectPrestamo = new Subject<any>();
    this.selectPoliza = new Subject<any>();
    this.selecContMultas = new Subject<any>();

    this.modalCajaChica = new Subject<any>();

    this.modalFacturaCajaChica = new Subject<any>();

    this.modalFacturaRecDocumento = new Subject<any>();
    this.editArea = new Subject<any>();

    this.modalAreaDepartamento = new Subject<any>();

    this.modalDepartamento = new Subject<any>();

    this.modalCambioEstaIDP = new Subject<any>();

    this.modalFamiliares = new Subject<any>();

    this.modalCargarRubros = new Subject<any>();
    this.modalParametrosNomina = new Subject<any>();

    this.modalProgramArea = new Subject<any>();

    this.modalCargarRetIVA = new Subject<any>();
    this.selectLote = new Subject<any>();

    this.selectUsuario = new Subject<any>();
    

  }

  Unidades(num) {
    switch (num) {
      case 1: return "Un";
      case 2: return "Dos";
      case 3: return "Tres";
      case 4: return "Cuatro";
      case 5: return "Cinco";
      case 6: return "Seis";
      case 7: return "Siete";
      case 8: return "Ocho";
      case 9: return "Nueve";
    }
    return "";
  }

  Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0: return "Diez";
          case 1: return "Once";
          case 2: return "Doce";
          case 3: return "Trece";
          case 4: return "Catorce";
          case 5: return "Quince";
          default: return "Dieci" + this.Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0: return "Vente";
          default: return "Veinti" + this.Unidades(unidad);
        }
      case 3: return this.DecenasY("Treinta", unidad);
      case 4: return this.DecenasY("Cuarenta", unidad);
      case 5: return this.DecenasY("Cincuenta", unidad);
      case 6: return this.DecenasY("Sesenta", unidad);
      case 7: return this.DecenasY("Setenta", unidad);
      case 8: return this.DecenasY("Ochenta", unidad);
      case 9: return this.DecenasY("Noventa", unidad);
      case 0: return this.Unidades(unidad);
    }
  }

  DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
      return strSin + " Y " + this.Unidades(numUnidades)

    return strSin;
  }

  Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);

    switch (centenas) {
      case 1:
        if (decenas > 0)
          return "Ciento " + this.Decenas(decenas);
        return "Cien";
      case 2: return "Doscientos " + this.Decenas(decenas);
      case 3: return "Trecientos " + this.Decenas(decenas);
      case 4: return "Cuatrocientos " + this.Decenas(decenas);
      case 5: return "Quinientos " + this.Decenas(decenas);
      case 6: return "Seiscientos " + this.Decenas(decenas);
      case 7: return "Setecientos " + this.Decenas(decenas);
      case 8: return "Ochocientos " + this.Decenas(decenas);
      case 9: return "Novecientos " + this.Decenas(decenas);
    }
    return this.Decenas(decenas);
  }

  Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)
    let letras = "";

    if (cientos > 0)
      if (cientos > 1)
        letras = this.Centenas(cientos) + " " + strPlural;
      else
        letras = strSingular;

    if (resto > 0)
      letras += "";
    return letras;
  }

  Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)
    let strMiles = this.Seccion(num, divisor, "Mil", "Mil");
    let strCentenas = this.Centenas(resto);

    if (strMiles == "")
      return strCentenas;

    return strMiles + " " + strCentenas;
  }

  Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)
    let strMillones = this.Seccion(num, divisor, "Un millón", "Millones");
    let strMiles = this.Miles(resto);
    if (strMillones == "")
      return strMiles;
    return strMillones + " " + strMiles;
  }

  NumeroALetras(num, centavos) {
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: "",
    };
    if (centavos == undefined || centavos == false) {
      data['letrasMonedaPlural'] = "Dólares";
      data['letrasMonedaSingular'] = "Dolar";
    } else {
      data['letrasMonedaPlural'] = "Centavos";
      data['letrasMonedaSingular'] = "Centavo";
    }
    if (data.centavos > 0)
      data.letrasCentavos = "con " + this.NumeroALetras(data.centavos, true);
    if (data.enteros == 0)
      return "Cero " + data['letrasMonedaPlural'] + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return this.Millones(data.enteros) + " " + data['letrasMonedaSingular'] + " " + data.letrasCentavos;
    else
      return this.Millones(data.enteros) + " " + data['letrasMonedaPlural'] + " " + data.letrasCentavos;
  }

}
