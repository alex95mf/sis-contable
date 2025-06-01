import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReciboCobroService } from './recibo-cobro.service';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ListGarantiasComponent } from './list-garantias/list-garantias.component';
import { ListVafavorComponent } from './list-vafavor/list-vafavor.component';
import { ListCruceConvenioComponent } from './list-cruce-convenio/list-cruce-convenio.component';
import { ListNotaCreditoComponent } from './list-nota-credito/list-nota-credito.component';
import { ListAnticipoPrecobradoComponent } from './list-anticipo-precobrado/list-anticipo-precobrado.component';
import { environment } from 'src/environments/environment';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
standalone: false,
  selector: 'app-recibo-cobro',
  templateUrl: './recibo-cobro.component.html',
  styleUrls: ['./recibo-cobro.component.scss']
})
export class ReciboCobroComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild("print") print!: ElementRef;
  
  fTitle = "Recibo de caja";
  msgSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  formReadOnly = false;
  titulosDisabled = true;
  verConvenios = false;

  contribuyenteActive: any = {
    razon_social: ""
  };

  cobros: any = {};

  conceptosBackup: any = [];
  conceptosList: any = [];
  concepto: any = 0;

  totalCobro = 0;
  totalPago = 0;
  difCobroPago = 0;
  tieneSuperavit: boolean = false;

  deudas: any = [];
  deudasBackup: any = [];
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
  verifyRestore = false;

  formasDePago: any = [];
  entidades: any = [];
  emisores: any = [];

  pagos: any = [];

  formaPago: any = {
    nombre: '',
    valor: '',    
  };

  entidadesFiltrada: any = [];
  entidadDisabled: boolean = true;
  hayEntidad: boolean = false;
  entidad: any = {
    nombre: '',
    valor: '',  
    grupo: '',  
  };

  emisoresFiltrada: any = [];
  emisorDisabled: boolean = true;
  hayEmisor: boolean = false;
  emisor: any = {
    nombre: '',
    valor: '',  
    grupo: '',  
  };

  documento: any = {
    id_documento: null,
    tipo_documento: "", // concepto.codigo
    fk_contribuyente: null, // contr id
    fecha: moment().format('YYYY-MM-DD'),
    observacion: "",
    estado: "P",
    subtotal: 0,
    total: 0,
    descuento_interes: 0,
    superavit: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
    fk_caja: 0, // caja activa al momento de cobrar
    fk_descuento_interes:undefined,
    motivo_anulacion: "",
  }

  cajaActiva: any = {
    id_caja: 0,
    nombre: "",
  }

  convenio:any
  mensaje: any
  juicio:any
  juicio_mensaje:any
  selectContri:any
  fila: string = '';
  msjError = 'Error';
  activo: boolean = false;
  quitarDeudas: boolean = false;
  superavit = 0; // bandera 0-> fasle no hay superavit, 1 hay superavit normal se excedio el cobro, 2 hay superavit igual a todo el pago que realiza el contribuyente puesto que no completa el valor de las deudas
  expandPago: boolean = false;  // booleano que controla si el boton para seleccionar garantias o valores a favores aparece

  nombre_concepto: any;
  idDoc: any;
  deshabilitarFormaPag: boolean = false
  campaigns: any = []
  totalDescuentoInteres: any = 0
  locality: any
  estadoCaja: string;

  anular: boolean = false;
  cmb_motivo_anulacion: any = []
  disabledAnular: boolean = true;

  private onDestroy$: Subject<void> = new Subject<void>();
  
  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: ReciboCobroService,
    private cierremesService: CierreMesService,
    ) { 
      this.commonVrs.selectContribuyenteCustom.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
        (res) => {
          let n= 0;
          console.log(res);
          this.selectContri = res['id_cliente']
          this.convenio = res['tiene_convenio']
          n = res['cant_convenios']
          if(this.convenio == 1){
             this.mensaje = 'El contribuyente tiene ' + n + ' convenio(s)'
          }
          else{
            this.mensaje = "El contribuyente no tiene convenios"
          }
          
          this.cargarjuicios()
        
          if(this.verifyRestore){
            this.restoreForm();
          }
          this.contribuyenteActive = res;
          this.titulosDisabled = false;
          this.vmButtons[3].habilitar = false;
         
        }
      );

      this.commonVrs.selectRecDocumento.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
        (res) => {
          let n= 0;
          
          this.restoreForm();
          this.formReadOnly = true;
          this.disabledAnular = false;
          console.log(res);
          this.convenio = res['contribuyente']['tiene_convenio']
          n = res['contribuyente']['cant_convenios']
          if(this.convenio == 1){
             this.mensaje = 'El contribuyente tine ' + n + ' convenio(s)'
          }
          else{
            this.mensaje = "No tiene convenios"
          }
          if(res['juicios'].length==0){
            this.juicio_mensaje = 'El contribuyente no tiene juicios'
          }
          else{
            let j = 0
            j = res['juicios'].length
            this.juicio_mensaje = 'El contribuyente tiene ' + j + ' juicio(s)'
          }
          // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar
          this.contribuyenteActive = res.contribuyente;
          this.documento = res;
          this.documento.fecha = res.fecha.split(" ")[0];
          //console.log(res)
          res.detalles.forEach(e => {
            console.log(e)
            let det = {
              id_liquidacion: e.fk_liquidacion,
              tipo_documento: e.codigo_concepto ?? "NaN",
              numero_documento: e.fk_numero_documento,
              nombre: e.concepto ? e.concepto.nombre : "NaN",
              concepto: {nombre: e.concepto ? e.concepto.nombre : "NaN"},
              comentario: e.comentario,
              valor: e.valor,
              saldo: e.saldo_anterior,
              cobro: e.abono,
              nuevo_saldo: e.saldo_actual,
              fecha: e.liquidacion.fecha,
              cuota: e.liquidacion.cuota.num_cuota ? true : false,
              total:e.liquidacion.total,
              interes:e.liquidacion.interes,
              descuento_interes:e.descuento_interes,
              multa:e.liquidacion.multa,
              descuento:e.liquidacion.descuento,
              exoneraciones:e.liquidacion.exoneraciones,
              servtecadmin:e.liquidacion.servtecadmin,
              recargo:e.liquidacion.recargo,
              coactiva:e.liquidacion.coactiva,

            }

            if(e.codigo_concepto == "CU" || e.codigo_concepto == "CUTE"){
              Object.assign(det, {
                num_cuota: e.liquidacion.cuota.num_cuota,
                num_cuotas: e.liquidacion.cuota.documento.num_cuotas,
                monto_total: e.liquidacion.cuota.documento.total,
                cobro: e.liquidacion.cuota.valor,
                plazo_maximo: e.liquidacion.cuota.fecha_plazo_maximo,
              })    
              console.log(e);               
            }

            this.deudas.push(det);
          })

          res.formas_pago.forEach(e => {
            this.pagos.push(e);
          });

          this.totalCobro = res.total;
          this.totalPago = +res.total + +res.superavit;
          this.difCobroPago = 0 - +res.superavit;


          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;        
          this.vmButtons[3].habilitar = false;
          //this.vmButtons[4].habilitar = false;
          console.log('superavit '+res.superavit)
          if(res.superavit>0){
            this.tieneSuperavit = true;
            this.superavit = res.superavit;
            this.idDoc = res.id_documento;
            console.log(res.id_documento)
          }else{
            this.tieneSuperavit = false;
            this.superavit = 0.00;
          }
        }
      );
      this.apiSrv.listaAnticipos$.subscribe(
        (res) => {
          // this.deshabilitarFormaPag = true
          console.log(res);
          this.pagoDirecto(res);

        }
      );

      this.commonVrs.selectGarantia.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
    
        (res) => {

          console.log(res);
          this.pagoDirecto(res);

        }
      );
      // this.commonVrs.selectCruceConv.asObservable().subscribe(
      //   (res) => {

      //     console.log(res);
      //     this.pagoDirecto(res);

      //   }
      // );
      

      this.commonVrs.needRefresh.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
        (res) => {
          if(res){
            this.calcCobroTotal();
          }
        }
      );

      this.commonVrs.cobros.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
        (res) => {
          this.cobros = res;
          console.log(this.deudas)
          console.log(this.campaigns)
          this.calcCobroTotal();
          if(this.campaigns.length > 0){
            this.aplicarDescuentoCampaigns()
          }

        }
      )
    }
  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }

  ngOnInit(): void {

    this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'));
    this.estadoCaja = this.cajaActiva?.estado

    // console.log(this.cajaActiva);

    this.formaPago = 0;
    this.entidad = 0;
    this.emisor = 0;
    this.anular = false
    this.disabledAnular = true;
    
    this.vmButtons = [
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
        //printSection: "PrintSection", imprimir: true
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-close", texto: "ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
    ]


    // if(!this.cajaActiva){
    //   Swal.fire({
    //     icon: "warning",
    //     title: "No puede continuar",
    //     text: "Debe tener una caja activa para poder realizar cobros.",
    //     showCloseButton: false,
    //     showConfirmButton: true,
    //     showCancelButton: false,
    //     confirmButtonText: "Aceptar",
    //     confirmButtonColor: '#20A8D8',
    //   });
    // }else{
      setTimeout(() => {
        this.validaPermisos();
      }, 0);
    // }

  }

  metodoGlobal = (event) => {
   // alert(event.items.boton.texto);
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.createRecDocumento();
        break;
      case "BUSCAR":
        this.expandListDocumentosRec();
        break;
      case "IMPRIMIR":
        this.imprimirDocumento();
        break;
      case "LIMPIAR":
        this.confirmRestore();
        break;
      case "ANULAR":
      //  alert(event.items.boton.texto);
        this.anularRecDocumento();
        break;
      default:
        break;
    }
  }

  triggerPrint(): void {   
    this.print.nativeElement.click();
  }

  /* recargarCaja() {
    this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'));

    if(!this.cajaActiva){
      Swal.fire({
        icon: "warning",
        title: "No puede continuar",
        text: "Debe tener una caja activa para poder realizar cobros.",
        showCloseButton: false,
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
      });
    }else {
      this.verificarCaja();
    }
  } */

  /* verificarCaja() {
    // funcion para revisar si la caja seleccionada ya ha sido abierta ese dia

    this.msgSpinner = 'Verificando si la caja está activa...';
    this.lcargando.ctlSpinner(true);

    let data = {
      id_caja: this.cajaActiva.id_caja,
      fecha: this.documento.fecha,
    }

    this.apiSrv.getCajaDiaByCaja(data).subscribe(
      (res) => {
        console.log(res);
        this.activo = res['data'].estado=="A"
        this.formReadOnly = !(res['data'].estado=="A")
        // if(res['data'].estado=="A"){
        //   this.activo = true;
        // } else if(res['data'].estado=="C") {
        //   this.activo = false;
        // }
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al intentar verificar la caja')
      }
    )

  } */

  async validacionCaja() {
    this.msgSpinner = 'Validando Estado de Caja'
    this.lcargando.ctlSpinner(true)
    this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'))

    try {
    if (!this.cajaActiva) {
      console.log('Sin sesion')
      // this.toastr.info('No tiene caja activa');
      this.formReadOnly = true
      this.activo = false
      throw new Error('No tiene caja activa.')
    } 

    if (this.cajaActiva && this.cajaActiva.fecha != moment(this.documento.fecha).format('YYYY-MM-DD')) {
      console.log('No fue abierta hoy')
      // this.toastr.info('La caja activa no fue abierta hoy.')
      this.formReadOnly = true
      this.activo = false
      throw new Error('La caja activa no fue abierta hoy.')
    }
    
      const response = await this.apiSrv.getCajaDiaByCaja({
        id_caja: this.cajaActiva.id_caja, 
        fecha: this.cajaActiva.fecha
      }).toPromise<any>()
      console.log(response.data)
  
      if (response.data.length == 0) {
        console.log('No hay registro en la base')
        this.toastr.info('No hay cajas reabiertas')
        this.formReadOnly = true
        this.activo = false
      } else if (response.data.estado == 'C') {
        console.log('Estado de caja C')
        this.estadoCaja = 'C'
        this.toastr.warning('La caja de hoy se encuentra Cerrada')
        this.formReadOnly = true
        this.activo = false
      } else if (response.data.estado == 'A') {
        this.formReadOnly = false
        this.activo = true
      }
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(err.error?.message ?? err, 'Validacion de Caja Activa')
    }
  }

  validaPermisos() {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fTesRecTitulos,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          // this.lcargando.ctlSpinner(false);
          // this.getCajaActiva();
          this.getCatalogos();
          this.getCampaigns()
          // this.getConceptos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }
  printComprobante(){
    //window.open(environment.ReportingUrl + "rep_rentas_tasas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + 116 + "&forma_pago=" + 'efectivo' , '_blank')
   // console.log(environment.ReportingUrl + "rep_rentas_comprobante_sobrante.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.idDoc)
    window.open(environment.ReportingUrl + "rep_rentas_valor_a_favor.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.idDoc, '_blank')
  }

  printTitulo(dt?:any){
    console.log(dt)
    if(dt.tipo_documento=='TA'){
      window.open(environment.ReportingUrl + "rep_rentas_tasas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='PC'){
      window.open(environment.ReportingUrl + "rep_tasas_permiso_construccion.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='CV'){
      window.open(environment.ReportingUrl + "rep_rentas_conceptos_varios.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='AM'){
      window.open(environment.ReportingUrl + "rep_rentas_arriendo_mercado.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='PL'){
      window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='PU'){
      window.open(environment.ReportingUrl + "rpt_rentas_prediosUrbanos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='CM'){
      window.open(environment.ReportingUrl + "report_tasa_centro_medico.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='CU'){
      window.open(environment.ReportingUrl + "rep_rentas_cuota_convenio.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='AR'){
      window.open(environment.ReportingUrl + "rep_rentas_arriendo_terreno.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='EP'){
      window.open(environment.ReportingUrl + "rep_rentas_espectaculos_publicos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else if(dt.tipo_documento=='CT'){
      window.open(environment.ReportingUrl + "rep_rentas_compra_terreno.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    else{
      window.open(environment.ReportingUrl + "rep_rentas_generico.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
    }
    
    
  }

  getCatalogos() {
    this.msgSpinner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REC_FORMA_PAGO','REC_FORMA_PAGO_ENTIDAD','REC_FORMA_PAGO_EMISOR','REC_MOTIVO_ANULACION'",
    }

    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log(res);

        res['data']['REC_FORMA_PAGO'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.formasDePago.push(f_pago);
        })

        res['data']['REC_FORMA_PAGO_ENTIDAD'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.entidades.push(f_pago);
        })

        res['data']['REC_FORMA_PAGO_EMISOR'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.emisores.push(f_pago);
        })

        res['data']['REC_MOTIVO_ANULACION'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.cmb_motivo_anulacion.push(f_pago);
        })

        // res['data']['REC_DENOMINACION_DETALLE'].forEach(e => {
        //   if(e.grupo=="M"){
        //     let m = {
        //       denominacion: e.descripcion,
        //       cantidad: 0,
        //       total_denominacion: 0,   
        //     }
        //     this.monedasCat.push(m);
        //   }else if(e.grupo=="B"){
        //     let b = {
        //       denominacion: e.descripcion,
        //       cantidad: 0,
        //       total_denominacion: 0,   
        //     }
        //     this.billetesCat.push(b);
        //   }
        // })
        // this.lcargando.ctlSpinner(false);
        this.getConceptos();
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }
  getCampaigns() {
    this.msgSpinner = 'Obteniendo campañas de descuento...';
    //let id = this.cajaActiva.id_caja;

    // busaca campañas activas y que se puedan aplicar a los conceptos segun la fecha 
    this.apiSrv.getCampaigns().subscribe(
      (res) => {
        if(res['data']?.length > 0){
          console.log(res);
          this.campaigns= res['data'];
        }else{
          this.campaigns= [];
        }
        
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )

  }


  // no se usa ya que la sesion ahora maneja toda la caja activa, no solo el id
  /* getCajaActiva() {
    this.msgSpinner = 'Obteniendo Caja Activa...';
    let id = this.cajaActiva.id_caja;

    // funcion necesario solo porque en la sesion se maneja solo el id no toda la info de la caja activa

    this.apiSrv.getCajaActiva(id).subscribe(
      (res) => {
        console.log(res);
        this.cajaActiva = res['data'];
        this.getConceptos();
        // this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )

  } */

  getConceptos() {
    this.msgSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getConceptos().subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Conceptos para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(c => {
          let concepto = {
            id: c.id_concepto,
            codigo: c.codigo,
            nombre: c.nombre,
            id_tarifa: c.id_tarifa,
            tipo_calculo: c.tipo_calculo,
            tiene_tarifa: c.tiene_tarifa==1 ? true : false //llena el campo con true si tiene tarifa
          }
          this.conceptosBackup.push({...concepto})
        })


        this.conceptosList = this.conceptosBackup.filter(c => (c.codigo!="BA" && c.codigo!="AN" && c.codigo!="EX"));

        // this.lcargando.ctlSpinner(false)
        // this.verificarCaja();
        // this.recargarCaja();
        this.validacionCaja();
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  getLiquidaciones() {
    this.msgSpinner = "Cargando lista de Liquidaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      codigo: "ALL",
      fk_contribuyente: this.contribuyenteActive.id_cliente,
    }

    this.apiSrv.getLiqByContribuyente(data).subscribe(
      (res) => {
        console.log(res);

        this.deudasBackup = [];

        res['data'].forEach(e => {
          if(e.deuda) {

            Object.assign(e, {
              tipo_documento: e.concepto.codigo ?? "NA",
              numero_documento: e.documento,
              nombre: e.concepto.nombre ?? "NA",
              comentario: "",
              valor: e.total,
              saldo: e.deuda.saldo,
              cobro: 0, 
              nuevo_saldo: 0,
              aplica: true,
              total: e.total,
              id_liquidacion: e.id_liquidacion,
            })

            // let deuda = {
            //   tipo_documento: e.concepto.codigo ?? "NA",
            //   numero_documento: e.documento,
            //   nombre: e.concepto.nombre ?? "NA",
            //   comentario: "",
            //   valor: e.total,
            //   saldo: e.deuda.saldo,
            //   cobro: 0, 
            //   nuevo_saldo: 0,
            //   aplica: true,
            //   total: e.total,
            //   id_liquidacion: e.id_liquidacion,
            // }

            if(e.concepto.codigo == "CU" || e.concepto.codigo == "CUTE"){
              if(e.cuota){ // CADA UNA DE LAS CUOTAS AMORTIZADAS (cuenta con registro en rec_documento_det)
                Object.assign(e, {
                  num_cuota: e.cuota.num_cuota,
                  num_cuotas: e.cuota.documento.num_cuotas,
                  monto_total: e.cuota.documento.total,
                  cobro: (+e.cuota.valor).toFixed(2),
                  plazo_maximo: e.cuota.fecha_plazo_maximo,
                })              
              }
              else { // CUOTA INICIAL no tiene rec_documento_det
                Object.assign(e, {
                  num_cuota: 0,
                  monto_total: (+(+e.total*100 / +e.observacion)).toFixed(2),
                  cobro: (+e.total).toFixed(2),
                  plazo_maximo: e.resolucion_fecha,
                })   
              }
            }
        
            this.deudasBackup.push(e);
          }
        });

        console.log(this.deudasBackup);
        this.deudas = this.deudasBackup.filter(d => d.tipo_documento!="CU");

        this.calcCobroTotal();

        // this.liquidacionesDt = this.resdata.filter(l =>l.estado =="A");
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cambiarDeudas() {
    this.verConvenios = !this.verConvenios;
    if(this.verConvenios) {
      this.deudas = this.deudasBackup.filter(d => d.tipo_documento=="CU");
      this.conceptosList = this.conceptosBackup.filter(c => (c.codigo=="CU"));
    } else {
      this.deudas = this.deudasBackup.filter(d => d.tipo_documento!="CU");
      this.conceptosList = this.conceptosBackup.filter(c => (c.codigo!="BA" && c.codigo!="AN" && c.codigo!="EX" && c.codigo!="CU"));
    }
    console.log(this.deudas);
    this.calcCobroTotal();
  }

  restar(deuda) {
    deuda.nuevo_saldo = +deuda.total - +deuda.cobro;
    this.calcCobroTotal();
  }

  calcCobroTotal() {
    let cobroTotal = 0;
    this.deudas.forEach(e => {
      // if (e.aplica) {
        let cobro100 = +e.cobro * 100;
        cobroTotal += +cobro100;
      // }
   
    });

 
    
    this.totalCobro = +cobroTotal / 100;
    // this.calcSaldoRestanteTotal();
    this.calcDifCobroPago();
   
  }

  

  // calcSaldoRestanteTotal() {
  //   let saldoResTotal = 0;
  //   this.deudas.forEach(e => {
  //     // if (e.aplica) {
  //       saldoResTotal += +e.nuevo_saldo; // en este caso es total porque sale de valor unitario * cantidad
  //     // }
  //   });
  //   this.totalSaldoRestante = saldoResTotal;
  // }

  sumar(pago) {
    this.calcPagoTotal();
    if(pago.tipo_pago=="EFECTIVO"){
      this.getCambio(pago);
    }else if (pago.tipo_pago=='GARANTIA' || pago.tipo_pago=='FAVOR' || pago.tipo_pago=='CRUCE CONVENIO' || pago.tipo_pago=='NOTA CREDITO' || pago.tipo_pago=='ANTICIPO PRECOBRADO'){
      this.getNewSaldo(pago);
    }
  }

  getNewSaldo(pago) {
    let old_saldo100 = +pago.saldo_max * 100;
    let pagado100 = +pago.valor * 100;
    let new_saldo100 = +old_saldo100 - +pagado100;
    pago.nuevo_saldo = +new_saldo100 / 100;
    console.log(pago);
  }

  calcPagoTotal() {
    let pagoTotal = 0;
    this.pagos.forEach(e => {
      // if (e.aplica) {
        let valor100 = +e.valor * 100;
        pagoTotal += +valor100; // en este caso es total porque sale de valor unitario * cantidad
      // }
    });

    this.totalPago = +pagoTotal / 100;
    this.calcDifCobroPago();
  }

  calcDifCobroPago() {
    let totalC100 = +this.totalCobro * 100;
    let totalP100 = +this.totalPago * 100;
    let totalI100 = +this.totalDescuentoInteres * 100
    let dif = (+totalC100 - +totalP100 - +totalI100);
    console.log(totalC100,totalP100,totalI100)
    console.log(dif)
    this.difCobroPago = +dif / 100;
    console.log(this.difCobroPago.toFixed(2))
  }

  removeTitulo(index) {

    console.log(this.deudas[index]);

    let d = this.deudas[index];

    // this.cobros.titulos = this.cobros.titulos.filter(e => e.id_liquidacion !== d.id_liquidacion);
    // this.cobros.cuotas = this.cobros.cuotas.filter(e => e.id_liquidacion !== d.id_liquidacion);
    // this.cobros.cuotasAT = this.cobros.cuotasAT.filter(e => e.id_liquidacion !== d.id_liquidacion);

    let a = this.cobros.titulos.find(e => e.id_liquidacion===d.id_liquidacion);
    let b = this.cobros.cuotas.find(e => e.id_liquidacion===d.id_liquidacion);
    let c =this.cobros.cuotasAT.find(e => e.id_liquidacion===d.id_liquidacion);
    if(a){a.aplica = false}
    if(b){b.aplica = false}
    if(c){c.aplica = false}

    this.deudas.splice(index,1);
    this.calcCobroTotal();
  }

  removeFormaPago(index) {

    this.pagos.splice(index,1);
    if(this.pagos.length==0){
      this.vmButtons[0].habilitar=true;
    }
    this.calcPagoTotal();
  }

  doc1PlaceHolder(pago: any) :string {
    if(pago.tipo_pago=="CHEQUE"){
      return "No. de cheque";
    } else if (pago.tipo_pago=="TRANSFERENCIA"){
      return "No. de transferencia";
    }
    return "No. de transacción";
  }

  detPagoLbl() :string {
    let tipo = this.formaPago.valor;
    if (tipo=="CHEQUE" || tipo=="TRANSFERENCIA" || tipo=="DEPOSITO"){
      return tipo.substring(0,2)+' - '+ this.entidad.valor;
    } else 
    if (tipo=="TARJETA" || tipo=="DEBITO") {
      return (tipo=="TARJETA"?'T/C':'T/D')+' - '+this.emisor.valor;
    }
    return this.formaPago.nombre;
  }

  detBanco() :string {
    let tipo = this.formaPago.valor;
    if (tipo=="CHEQUE" || tipo=="TRANSFERENCIA" || tipo=="DEPOSITO"){
      return this.entidad.nombre;
    } else 
    if (tipo=="TARJETA" || tipo=="DEBITO" || tipo=="MEDIANET") {
      return this.emisor.nombre;
    }
    return '';
  }

  agregaPagos() {
    console.log(this.formaPago);
    let tipo = this.formaPago.valor;
    if( this.formaPago==0 ){
      this.toastr.info("Seleccione una Forma de pago primero.")
      return ;
    } else
    if ( (tipo=="CHEQUE" || tipo=="TRANSFERENCIA" || tipo=="DEPOSITO") && this.entidad==0){
      this.toastr.info("Debe seleccionar una Entidad para ésta forma de pago.")
      return ;
    } else 
    if ((tipo=="TARJETA" || tipo=="DEBITO" || tipo=="MEDIANET") && (this.entidad==0 || this.emisor==0)){
      this.toastr.info("Debe seleccionar Entidad y Emisor para ésta forma de pago.")
      return ;
    }

    let nuevo = {
      id_documento_forma_pago: 0,
      fk_documento: 0, // sera el id del documento que se cree primero la cabecera
      tipo_pago: this.formaPago.valor,
      tipo_pago_lbl: this.detPagoLbl(),
      banco: this.detBanco(),
      numero_documento: "",
      numero_documento2: "",
      valor: 0,
      valor_recibido: 0,
      cambio: 0,
      comentario: "",
      fk_garantia: 0,
      estado: "E"
    }

    this.pagos.push(nuevo);
    this.vmButtons[0].habilitar=false;
  }

  pagoDirecto(doc: any) {

    let nuevo = {
      id_documento_forma_pago: 0,
      fk_documento: 0, // sera el id del documento que se cree primero la cabecera
      tipo_pago: this.formaPago.valor,
      tipo_pago_lbl: this.formaPago.nombre,
      banco: this.detBanco(),
      numero_documento: doc.documento,
      numero_documento2: "Saldo: $"+doc.saldo,
      valor: 0, // abono
      valor_recibido: 0,
      cambio: 0,
      saldo_max: doc.saldo,
      nuevo_saldo: doc.saldo, // empieza como saldo puesto que es saldo anterior - valor(inicialmente 0)
      comentario: '',
      fk_garantia: doc.id_documento, // id del documento del cual se esta sacando saldo para pagar (garantia o valor a favor)
      estado: "E"
    }

    
    this.pagos.push(nuevo);
    this.vmButtons[0].habilitar=false;
  }

  selectDocPago() {
    if(this.formaPago.valor=='GARANTIA'){
      this.expandGarantias();
    } else if (this.formaPago.valor=='FAVOR') {
      this.expandValoresFavor();
    }else if (this.formaPago.valor=='CRUCE CONVENIO'){
      this.expandCruceConvenio();
    } else if (this.formaPago.valor=='NOTA CREDITO'){
      this.expandNotaCredito();
    }else if (this.formaPago.valor=='ANTICIPO PRECOBRADO'){
      this.expandAnticipoPrecobrado()
    }
  }

  handlePago(event) {
   console.log(event.valor)
    this.entidad = 0;
    this.emisor = 0;
    this.entidadesFiltrada = this.entidades.filter((e: any) => e.grupo == event.valor);
    this.entidadDisabled = false;
    
    this.expandPago = ['GARANTIA', 'FAVOR', 'CRUCE CONVENIO', 'NOTA CREDITO', 'ANTICIPO PRECOBRADO'].includes(event.valor);
    this.deshabilitarFormaPag = ["GARANTIA", "FAVOR", "CRUCE CONVENIO", "NOTA CREDITO", "ANTICIPO PRECOBRADO"].includes(event.valor)
    this.hayEmisor = ['TARJETA', 'DEBITO','MEDIANET'].includes(event.valor);

    if(event.valor != "TARJETA" && event.valor != "DEBITO" && event.valor != "CHEQUE" && event.valor != "TRANSFERENCIA"  &&  event.valor!="DEPOSITO" &&  event.valor!="MEDIANET"){
      this.hayEntidad = false;
    } else {
      this.hayEntidad = true;
    }

  }

  handleEntidad(event) {
    this.emisor = 0;
    this.emisoresFiltrada = this.emisores.filter(e => e.grupo == event.valor);
    this.emisorDisabled = false;
  }

  getCambio(pago: any) {
    if(pago.tipo_pago=="EFECTIVO"){
      let total100 = +pago.valor * 100;
      let pagado100 = +pago.valor_recibido * 100;
      let dif100 = pagado100 - total100;
      pago.cambio = (dif100 / 100).toFixed(2);
    }
  }

  checkDeudas() {
    console.log(this.deudas)
    for(let i=0;i<this.deudas.length;i++) {
      if (this.deudas[i].nuevo_saldo<0) {        
        return true;         
      }else if(this.deudas[i].descuento_interes>0 && this.deudas[i].cobro != this.deudas[i].total){
        this.msjError = "Debe pagar el valor total del titulo  "+this.deudas[(i+1)].numero_documento;
        return true;
      } 
    }
    return false;
  }

  checkPagos() {
    if(this.totalPago == 0){
      this.fila = '1';
      this.msjError = 'No puede realizar un cobro con pagos en 0';
      return true;
    }
    for(let i=0;i<this.pagos.length;i++) {
      if (
        this.pagos[i].tipo_pago=='EFECTIVO' && (this.pagos[i].cambio<0)
      ) {        
        this.fila = +(i+1) +' - '+ this.pagos[i].tipo_pago_lbl;
        this.msjError = "El valor recibido no puede ser menor al valor que se está pagando en efectivo";
        return true;         
      } else if (
        (this.pagos[i].tipo_pago=='GARANTIA' || this.pagos[i].tipo_pago=='FAVOR' || this.pagos[i].tipo_pago=='CRUCE CONVENIO' || this.pagos[i].tipo_pago=='NOTA CREDITO' || this.pagos[i].tipo_pago=='ANTICIPO PRECOBRADO') && (+this.pagos[i].valor>+this.pagos[i].saldo_max)
      ) {       
        this.fila = +(i+1) +' - '+ this.pagos[i].tipo_pago_lbl; 
        this.msjError = "El valor a pagar no puede ser mayor al saldo restante en "+this.pagos[i].tipo_pago_lbl;
        return true;         
      } 
    }
    return false;
  }

  // funcion para verificar si algun pago es EFECTIVO, CHEQUE, TRANSFERENCIA, DEOPSITO O TARJETAS para permitir guardar superavits, si es GARANTIA O VALOR A FAVOR no permite guardar superavits
  checkSuperavit() {
    // for(let i=0;i<this.pagos.length;i++) {
    //   // if(
    //   //   this.pagos[i].tipo_pago=='GARANTIA' || this.pagos[i].tipo_pago=='FAVOR'
    //   // ) {
    //   //   this.msjError = "No puede ingresar superávits con formas de pago Garantía o Valor a favor";
    //   //   console.log(this.documento.superavit);
    //   //   if(+this.documento.superavit > 0) {

    //   //     return false;  
    //   //   }      
    //   // } else
    //    if (
    //     this.pagos[i].tipo_pago=='EFECTIVO' || this.pagos[i].tipo_pago=='CHEQUE' || this.pagos[i].tipo_pago=='TARJETA' || this.pagos[i].tipo_pago=='DEBITO' || this.pagos[i].tipo_pago=='TRANSFERENCIA' || this.pagos[i].tipo_pago=='DEPOSITO' 
    //   ) {        
    //     // this.fila = i+1;
    //     this.msjError = "El valor recibido no puede ser menor al valor que se está pagando en efectivo";
    //     console.log(this.documento.superavit);
    //     if(+this.documento.superavit > 0) {

    //       return false;  
    //     }       
    //   }
    // }
    // return true;
    for(let i=0;i<this.pagos.length;i++) {
      if(
        this.pagos[i].tipo_pago=='GARANTIA' || this.pagos[i].tipo_pago=='FAVOR' || this.pagos[i].tipo_pago=='CRUCE CONVENIO' || this.pagos[i].tipo_pago=='NOTA CREDITO' || this.pagos[i].tipo_pago=='ANTICIPO PRECOBRADO' 
      ) {
        if(+this.difCobroPago!=0) {

          return true;  
        }      
      } 
      // else
      //  if (
      //   this.pagos[i].tipo_pago=='EFECTIVO' || this.pagos[i].tipo_pago=='CHEQUE' || this.pagos[i].tipo_pago=='TARJETA' || this.pagos[i].tipo_pago=='DEBITO' || this.pagos[i].tipo_pago=='TRANSFERENCIA' || this.pagos[i].tipo_pago=='DEPOSITO' 
      // ) {        
      //   // this.fila = i+1;
      //   this.msjError = "El valor recibido no puede ser menor al valor que se está pagando en efectivo";
      //   console.log(this.documento.superavit);
      //   if(+this.documento.superavit > 0) {

      //     return false;  
      //   }       
      // }
    }
    return false;
  }

  checkTitulosFechas(){

    let titulos = this.cobros.titulos;

    let titulosCobrados = titulos.filter(e => e.aplica);
    let titulosNoCobrados = titulos.filter(e => !e.aplica);

    for(let i=0;i<titulosCobrados.length;i++){
      for(let j=0;j<titulosNoCobrados.length;j++){
        if(titulosCobrados[i].fk_concepto===titulosNoCobrados[j].fk_concepto){
          console.log('mismo concepto');
          if(titulosCobrados[i].fecha > titulosNoCobrados[j].fecha){
            console.log('fecha cobrada mayor a no cobrada');
            this.msjError = 'Debe cobrar título más antiguo de un mismo concepto primero.';
            return true;
          }
        }
      }
    }

    return false;
  }

  checkCuotasPlazos() {

    let cuotas = this.cobros.cuotas;

    let cuotasCobrados = cuotas.filter(e => e.aplica);
    let cuotasNoCobrados = cuotas.filter(e => !e.aplica);
    console.log(cuotasCobrados);
    console.log(cuotasNoCobrados);

    for(let i=0;i<cuotasCobrados.length;i++){
      for(let j=0;j<cuotasNoCobrados.length;j++){
        if(cuotasCobrados[i].fk_concepto===cuotasNoCobrados[j].fk_concepto){
          console.log('mismo concepto');
          if(cuotasCobrados[i].cuota.fecha_plazo_maximo > cuotasNoCobrados[j].cuota.fecha_plazo_maximo){
            console.log('fecha cobrada mayor a no cobrada');
            this.msjError = 'Debe cobrar cuotas que venzan antes primero.';
            return true;
          }
        }
      }
    }

    return false;
  }
  
  checkCuotasATPlazos() {

    let cuotas = this.cobros.cuotasAT;

    let cuotasCobrados = cuotas.filter(e => e.aplica);
    let cuotasNoCobrados = cuotas.filter(e => !e.aplica);
    console.log(cuotasCobrados);
    console.log(cuotasNoCobrados);

    for(let i=0;i<cuotasCobrados.length;i++){
      for(let j=0;j<cuotasNoCobrados.length;j++){
        if(cuotasCobrados[i].fk_concepto===cuotasNoCobrados[j].fk_concepto){
          console.log('mismo concepto');
          if(cuotasCobrados[i].cuota?.fecha_plazo_maximo > cuotasNoCobrados[j].cuota?.fecha_plazo_maximo){
            console.log('fecha cobrada mayor a no cobrada');
            this.msjError = 'Debe cobrar cuotas que venzan antes primero.';
            return true;
          }
        }
      }
    }

    return false;
  }

  aplicarDescuentoCampaigns(){
    console.log(this.deudas)
    console.log(this.campaigns)
    
    if(this.deudas.length > 0){
      let descuentoIntereses = 0
      this.deudas.forEach(element => {
        this.campaigns.forEach(camp => {
          console.log(camp)
          console.log(element)
          if(element.interes > 0){
            if(camp.detalles.length > 0){
                camp.detalles.forEach(c =>{
                  if(c.fk_concepto == element.fk_concepto){
                    console.log(element.fk_concepto)
                    let porcentajeAplicable = c.porcentaje;
                    let valorDescontar = element.interes / 100 * porcentajeAplicable;
                    console.log(valorDescontar)
                    // element.descuento_interes = parseFloat(element.interes) / 100 * porcentajeAplicable
                    // element.fk_descuento_interes = c.fk_descuento
                    Object.assign(element , {
                      descuento_interes: valorDescontar,
                      fk_descuento_interes:c.fk_descuento
                    })
                    console.log(element)
                    descuentoIntereses += +valorDescontar
                  } /* else if(c.fk_concepto != element.fk_concepto){
                    Object.assign(element , {
                      descuento_interes: 0.00,
                      fk_descuento_interes:undefined
                    })
                  } */
                })
            }
          }
        });
        
      
      });
      this.totalDescuentoInteres = descuentoIntereses
      console.log(this.totalDescuentoInteres)
      this.calcPagoTotal();
    }
   
  }

  createRecDocumento() {

    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Recibos de cobro.", this.fTitle);
    } else {
      // if(this.documento.observacion==""||this.documento.observacion==undefined){
      //   this.toastr.info("Debe ingresar una observación para el recibo")
      //   return;
      // } else 
      if(
        this.deudas.length<=0||!this.deudas.length
      ) {
        this.toastr.info("Debe ingresar al menos un título a cobrar ");
        return;
      } else if(
        this.checkTitulosFechas()
      ) {
        this.toastr.info(this.msjError);
        return;
      } else if(
        this.checkCuotasPlazos()
      ) {
        this.toastr.info(this.msjError);
        return;
      } else if(
        this.checkCuotasATPlazos()
      ) {
        this.toastr.info(this.msjError);
        return;
      } else if(
        this.pagos.length<=0||!this.pagos.length
      ) {
        this.toastr.info("Debe ingresar al menos una forma de pago");
        return;
      } else if(
        this.checkDeudas()
      ) {
        this.toastr.info("El valor a pagar no puede ser mayor al saldo actual");
        return;
      } else if(
        // this.difCobroPago>0
        this.checkSuperavit()
      ) {
        // this.toastr.info("El Valor Pagado total debe ser igual o superior a "+this.totalCobro);
        this.toastr.info("No puede ingresar superávits con formas de pago Garantía o Valor a favor");
        return;
      } else if(
        this.checkPagos()
      ) {
        this.toastr.info(this.msjError,"Fila #"+this.fila);
        return;
      }

      if (+this.difCobroPago.toFixed(2)<0){
        let dif100 = +this.difCobroPago * 100;
        let super100 = +dif100 - (2 * +dif100); // volver un numero positivo es restarle su doble
        let superavit = +super100 / 100;
        console.log(superavit);
        this.documento.superavit = +superavit.toFixed(2);
        this.superavit = 1;
        this.quitarDeudas = false;
      } else if (+this.difCobroPago.toFixed(2)>0){    
        this.documento.superavit = +this.totalPago;
        this.superavit = 2;
        this.quitarDeudas = true;
      } else {
        this.documento.superavit = 0;
        this.superavit = 0;
        this.quitarDeudas = false;
      }

      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: (this.superavit==1 ? 'Está a punto de realizar un cobro con un superávit de $'+this.documento.superavit+' USD ¿Desea continuar?' : this.superavit==2 ? 'No se realizará cobro de ningún título, todo el pago será guardado como un superávit de $'+(this.documento.superavit) +' USD y se eliminarán los títulos ¿Desea continuar?' : "Está a punto de realizar un cobro ¿Desea continuar?"),
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true);
          let datos = {
            "anio": Number(moment(this.documento.fecha).format('YYYY')),
            "mes": Number(moment(this.documento.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
            
            /* Validamos si el periodo se encuentra aperturado */
              if (res["data"][0].estado !== 'C') {
                
                this.msgSpinner = 'Generando Documento de cobro...';
                this.lcargando.ctlSpinner(true);
                          
                if(this.quitarDeudas){
                  this.totalCobro = 0;
                  this.deudas = [];
                }

                this.documento.estado = "E";
                this.documento.tipo_documento = this.concepto.codigo;
                this.documento.fk_contribuyente = this.contribuyenteActive.id_cliente;
                this.documento.subtotal = this.totalCobro;
                this.documento.total = this.totalCobro;
                this.documento.descuento_interes = this.totalDescuentoInteres;
                this.documento.detalles = [];
                this.documento.fk_caja = this.cajaActiva.id_caja;
                
                console.log(this.quitarDeudas);
                console.log(+this.difCobroPago)
                console.log(this.deudas);
                console.log(this.pagos);
              /// return;
                this.deudas.forEach(e => {
                  if (e.aplica && e.cobro > 0) {

                    let doc_det = {
                      id_documento_detalle: 0,
                      fk_documento: 0,
                      fk_liquidacion: e.id_liquidacion,
                      fk_deuda: e.deuda.id_deuda,
                      fk_numero_documento: e.documento,
                      valor: e.valor ?? e.total,
                      abono: e.cobro,
                      saldo_anterior: e.saldo,
                      saldo_actual: e.nuevo_saldo,
                      comentario: e.comentario,
                      fk_concepto: e.fk_concepto,
                      codigo_concepto: e.concepto.codigo,
                      fk_cuota: (e.cuota && e.cuota.id_documento_detalle) ? e.cuota.id_documento_detalle : 0, // id del documento det (cuota) para cambiar su estado luego de pagarla, 0 si no es cuota
                      descuento_interes: e.descuento_interes,
                      fk_descuento_interes: e.fk_descuento_interes
                    }

                    // if(e.cuota && e.cuota.id_documento_detalle){
                    //   Object.assign(doc_det, {
                    //     fecha_plazo_maximo: e.cuota.fecha_plazo_maximo,
                    //     num_cuota: e.num_cuota,
                    //     estado: 'C',
                    //   })
                    // }
                    this.documento.detalles.push(doc_det);
                  }
                });

                this.documento.formas_pago = [];
                this.pagos.forEach(e => {
                  if(e.valor > 0){
                    this.documento.formas_pago.push(e);
                  }
                });

                let data = {
                  documento: this.documento
                }
                console.log(this.documento);     
                // servicio que crea el documento, sus detalles, sus formas de pago asociadas
                // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
                // this.lcargando.ctlSpinner(false);
                // return ;
                this.apiSrv.setRecDocumento(data).subscribe(
                  (res) => {
                    console.log(res);
                    
                    this.documento = res['data'];
                    this.formReadOnly = true;
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[2].habilitar = false;
                    this.vmButtons[3].habilitar = false;
                    console.log(this.documento);
                    // this.guardarDeuda(res['data'].id_liquidacion);
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "success",
                      title: "Documento de cobro generado",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    }).then((res)=> {
                      if(res.isConfirmed){
                        this.triggerPrint();
                      }
                    })
                  },
                  (error) => {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "error",
                      title: "Error al generar el documento de cobro",
                      text: error.error.message,
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    });
                  }
                );
          
              } else {
                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
              }
        
            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })










        }
      });
    }
  }

  anularRecDocumento() {
  //  alert('aaaa');
    let msgInvalid = ''

    if (this.documento.estado == 'X') msgInvalid += 'El documento ya esta Anulado.<br>';
    if (this.estadoCaja == 'C') msgInvalid += 'La Caja seleccionada tiene estado Cerrada.<br>';
    if (this.documento.motivo_anulacion == "" || this.documento.motivo_anulacion == undefined) msgInvalid += 'Debe seleccionar un motivo de anulación.<br>';

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return
    }

    let hoy = this.fecha.split(' ')[0];

    /* if(this.documento.estado=='X'){
      this.toastr.info('Este Documento ya esta Anulado.');
      return ;
    }else  */

    if(this.documento.fecha != hoy){

      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "El Documento fue cobrado en dias previos ¿Desea Continuar?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.anulacion();
        }
      })

      //this.toastr.info('No puede anular un Documento cobrado en dias previos');
      //     
    }
    else
    {
      this.anulacion();
    }




  }

  anulacion(){

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea anular este documento?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment(this.documento.fecha).format('YYYY')),
          "mes": Number(moment(this.documento.fecha).format('MM'))
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
           
          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.msgSpinner = 'Anulando documento...';
              this.lcargando.ctlSpinner(true);
              let data = {
                documento: this.documento
              }
              console.log(this.documento);
              this.apiSrv.anularRecDocument(data).subscribe(
                (res) => {
                  console.log(res);
                  
                  this.documento = res['data'];
                  this.documento.fecha = res['data'].fecha.split(' ')[0];
                  this.formReadOnly = true;
                  this.vmButtons[0].habilitar = true;
                  this.vmButtons[2].habilitar = false;
                  this.vmButtons[3].habilitar = false;
                  this.vmButtons[4].habilitar = true;
                  console.log(this.documento);
                  // this.guardarDeuda(res['data'].id_liquidacion);
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "success",
                    title: "Documento de cobro anulado",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  })
                },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "error",
                    title: "Error al anular el documento de cobro",
                    text: error.error.message,
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  });
                }
              );
        
            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }
      
          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })
      }else{
        this.lcargando.ctlSpinner(false);
      }
    });
  }

  confirmRestore() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reiniciar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.restoreForm();
      }
    });
  }

  restoreForm() {
    this.formReadOnly = false;
    this.titulosDisabled = true;
    this.verConvenios = false;
    this.quitarDeudas = false;
    this.superavit = 0;
    this.expandPago = false;
    this.msjError = '';
    this.fila = '';
    this.deshabilitarFormaPag =false;

    this.contribuyenteActive = {
      razon_social: ""
    };

    // this.conceptosList = [];
    this.concepto = 0;

    this.totalCobro = 0;
    this.totalPago = 0;
    this.difCobroPago = 0;

    this.deudas = [];
    this.fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
    this.verifyRestore = false;

    this.pagos = [];

    this.formaPago = 0;
    this.entidad = 0;
    this.emisor = 0;
    this.tieneSuperavit = false;
    this.anular = false;
    this.disabledAnular = true;
   

    this.documento = {
      id_documento: null,
      tipo_documento: "", // concepto.codigo
      fk_contribuyente: null, // contr id
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      observacion: "",
      estado: "P",
      subtotal: 0,
      total: 0,
      superavit: 0,
      detalles: [], // deudas
      formas_pago: [], // pagos
      motivo_anulacion: ""
    }
    this.mensaje = '';
    this.juicio_mensaje = '';

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;

  }

  handleConcepto() {
    this.titulosDisabled = false;
  }

  imprimirDocumento(){
    window.open(environment.ReportingUrl + "rpt_tesoreria_recaudacion_titulos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_doc=" + this.documento.id_documento, '_blank')

  }
  
  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  expandModalTitulos() {    
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    // } else {

      const modalInvoice = this.modalService.open(ModalLiquidacionesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fTesRecTitulos;
      modalInvoice.componentInstance.permissions = this.permissions;
      // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      // modalInvoice.componentInstance.id_concepto = this.concepto.id;
      modalInvoice.componentInstance.listaConceptos = this.conceptosList;
      // modalInvoice.componentInstance.codigo = this.concepto.codigo;
      modalInvoice.componentInstance.codigo = this.verConvenios?'CUO':'CO';
      modalInvoice.componentInstance.fk_contribuyente = this.contribuyenteActive.id_cliente;
      modalInvoice.componentInstance.deudas = this.deudas;
      modalInvoice.componentInstance.totalCobro = this.totalCobro;
    // }
  }

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListRecDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  expandValoresFavor() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListVafavorComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  expandGarantias() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListGarantiasComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }
  expandCruceConvenio() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListCruceConvenioComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  expandNotaCredito(){
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListNotaCreditoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }
  expandAnticipoPrecobrado(){
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListAnticipoPrecobradoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  expandListContribuyentes() {
    if(!this.activo){
      this.toastr.warning("No puede realizar cobros sin tener una caja activa.");
      return ;
    }
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    // } else {
      if(this.deudas.length>0 || this.pagos.length>0 || this.documento.observacion!=''){
        this.verifyRestore = true;
      } else {
        this.verifyRestore = false;
      }
      const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fTesRecTitulos;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 8;
    // }
  }
  expandDetalleMulta(c) {
    const modalInvoice = this.modalService.open(ConceptoDetComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.concepto = c;
  }

  cargarjuicios(){
    let id = this.selectContri
    let data = {

    }
    this.apiSrv.getJuicios(data,id).subscribe(
      (res) => {
        console.log(res)
        this.juicio = res
        if(this.juicio.length==0){
          this.juicio_mensaje = 'El contribuyente no tiene juicios'
        }
        else{
          let j = 0
          j = this.juicio.length
          this.juicio_mensaje = 'El contribuyente tiene ' + j + ' juicio(s)'
        }
      }
    );
  }

  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }

  anulacionSelected(event){
    console.log(this.anular)
    console.log(event.target.checked)
    if(event.target.checked){
      this.vmButtons[4].habilitar = false;
    }else{
      this.vmButtons[4].habilitar = true;
    }
  
  }
 

}
