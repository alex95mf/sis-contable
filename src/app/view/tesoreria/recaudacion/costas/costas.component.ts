import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CostasService } from './costas.service'; 
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
//import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ListGarantiasComponent } from '../recibo-cobro/list-garantias/list-garantias.component'; 
import { ListVafavorComponent } from '../recibo-cobro/list-vafavor/list-vafavor.component';
import { ListCruceConvenioComponent } from '../recibo-cobro/list-cruce-convenio/list-cruce-convenio.component'; 
import { ListNotaCreditoComponent } from '../recibo-cobro/list-nota-credito/list-nota-credito.component'; 
import { ListAnticipoPrecobradoComponent } from '../recibo-cobro/list-anticipo-precobrado/list-anticipo-precobrado.component'; 
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
//import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { id } from '@swimlane/ngx-charts';

@Component({
standalone: false,
  selector: 'app-costas',
  templateUrl: './costas.component.html',
  styleUrls: ['./costas.component.scss']
})
export class CostasComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild("print") print!: ElementRef;
  
  fTitle = "Costas";
  msgSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  formReadOnly = false;
  titulosDisabled = true;
  disabledJuicio = false;
  agregaCostas= true;

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
  resJuicios: any = [];

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
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: "",
    estado: "P",
    subtotal: 0,
    total: 0,
    superavit: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
    fk_caja: 0, // caja activa al momento de cobrar
    juicio:0,
    costa:0
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

  filter:any;
  juicios: any = [];
  costas: any = [];
  costasArray: any = {};

  estados: any[] = [
    { id: 'EMI', value: 'EMITIDO', pos: 0 },
    { id: 'CIT', value: 'CITADO', pos: 1 },
    { id: 'CIG', value: 'CITADO EN GACETA', pos: 2 },
    { id: 'PAP', value: 'PUBLICACION DE AUTO DE PAGO', pos: 3 },
    { id: 'RET', value: 'RETENCION DE VALORES', pos: 4 },
    { id: 'EMB', value: 'EMBARGO', pos: 5 },
    { id: 'REM', value: 'REMATE', pos: 6 },
    { id: 'PUR', value: 'PUBLICACION DEL REMATE', pos: 7 },
    { id: 'POS', value: 'POSTULACION', pos: 8 },
    { id: 'ADJ', value: 'ADJUDICACION', pos: 9 },
    { id: 'CAN', value: 'CANCELADO', pos: 10 },
  ];
  tipos: any[] = [
    { id: 'PRO', value: 'PROVIDENCIA' },
    { id: 'DJ', value: 'DEPOSITARIO JUDICIAL' },
    { id: 'PU', value: 'PUBLICACIÓN' },
    { id: 'PA', value: 'PERITO AVALUADOR' },
    { id: 'PO', value: 'POSTURA' },
    { id: 'APL', value: 'ADJUDICACIÓN Y PERITO LIQUIDADOR' },
 
    // { id: 'ESC', value: 'ESCRITO' },
    // { id: 'SRA', value: 'SENTAR RAZON' },
    // { id: 'RAZ', value: 'RAZON' },
    // { id: 'ATT', value: 'ATENDER PETICION' },
    // { id: 'CAU', value: 'CONVOCATORIA A AUDIENCIA' },
    // { id: 'AUD', value: 'AUDIENCIA PRESENCIAL' },
    // { id: 'NOT', value: 'NOTIFICACION' },
    // { id: 'SUS', value: 'SUSPENCION Y SEñALAMIENTO' },
    // { id: 'RES', value: 'ACTA RESUMEN' },
    // { id: 'SEN', value: 'SENTENCIA' },
    // { id: 'OFC', value: 'OFICIO' },
    // { id: 'EJE', value: 'RAZON DE EJECUTORIA' },
  ]

  deshabilitarFormaPag: boolean = false
  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: CostasService,
    private cierremesService: CierreMesService
    ) { 
      this.commonVrs.selectContribuyenteCustom.asObservable().subscribe(
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
          this.documento.juicio = 0;
          this.documento.costa = 0;

          if(this.verifyRestore){
            this.restoreForm();
          }
          this.contribuyenteActive = res;
          this.filter.contribuyente = res.razon_social;
          this.titulosDisabled = false;
          this.disabledJuicio = false;
          this.vmButtons[3].habilitar = false;
         
          this.buscarJuicios();
         
        }
      );

      this.commonVrs.selectRecDocumento.asObservable().subscribe(
        (res) => {
          let n= 0;
          
          this.restoreForm();
          this.formReadOnly = true;
          console.log(res);
         
          // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar
          this.contribuyenteActive = res.contribuyente;
          this.documento = res;
          this.documento.juicio = res.fk_id_cob_juicio;
          this.documento.fecha = res.fecha.split(" ")[0];

          this.filter.contribuyente = res.contribuyente.razon_social;
          this.documento.juicio = res.cob_juicios.num_proceso;

         
           
          console.log(res)
          res.detalles.forEach(e => {
            console.log(e)
          
            let det = {
              aplica:true,
              id_cob_juicio_actuaciones: e.juicio_actuaciones[0].id_cob_juicio_actuaciones,
              tipo:e.juicio_actuaciones[0].tipo,
              estado:e.juicio_actuaciones[0].estado,
              saldo:e.saldo_anterior,
              cobro: e.valor
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
          this.vmButtons[4].habilitar = false;
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

      this.commonVrs.selectGarantia.asObservable().subscribe(
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
      

      this.commonVrs.needRefresh.asObservable().subscribe(
        (res) => {
          if(res){
            this.calcCobroTotal();
          }
        }
      );

      this.commonVrs.cobros.asObservable().subscribe(
        (res) => {
          this.cobros = res;
          console.log(this.deudas)
        }
      )
    }

  ngOnInit(): void {

    // this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'));

    // console.log(this.cajaActiva);

    this.formaPago = 0;
    this.entidad = 0;
    this.emisor = 0;
    
    this.vmButtons = [
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
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
        boton: { icon: "far fa-search", texto: " BUSCAR" },
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
        boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
        printSection: "PrintSection", imprimir: true
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
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
        boton: { icon: "far fa-close", texto: " ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
    ]

    this.filter = {
      contribuyente: "",
    };


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
    switch (event.items.boton.texto) {
      case " GUARDAR":
        this.createRecDocumento();
        break;
      case " BUSCAR":
        this.expandListDocumentosRec();
        break;
      case " IMPRIMIR":
       this.printComprobante();
        break;
      case " LIMPIAR":
        this.confirmRestore();
        break;
      case " ANULAR":
        this.anularRecDocumento();
        break;
      default:
        break;
    }
  }

  triggerPrint(): void {   
    this.print.nativeElement.click();
  }

  getEstado(id: string) {
    return this.estados.find(e => e.id == id)?.value
  }

  /* recargarCaja() {
    this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'));

    if(!this.cajaActiva || this.cajaActiva.fecha != moment().format('YYYY-MM-DD')){
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

  validaPermisos = () => {
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
    console.log(this.documento.id_documento)
    //window.open(environment.ReportingUrl + "rep_rentas_tasas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + 116 + "&forma_pago=" + 'efectivo' , '_blank')
   // console.log(environment.ReportingUrl + "rep_rentas_comprobante_sobrante.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.idDoc)
    window.open(environment.ReportingUrl + "rep_rentas_costas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.documento.id_documento, '_blank')
  }

  // printTitulo(dt?:any){
  //   console.log(dt)
  //   if(dt.tipo_documento=='TA'){
  //     window.open(environment.ReportingUrl + "rep_rentas_tasas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
  //   }
  //   else if(dt.tipo_documento=='PC'){
  //     window.open(environment.ReportingUrl + "rep_tasas_permiso_construccion.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
  //   }
 
  // }

  buscarJuicios(){
  
    this.msgSpinner = 'Cargando Juicios...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
      }
    }
    this.apiSrv.getJuicio(data).subscribe(
      (res) => {
        console.log(res);
        this.juicios= res['data']
        this.lcargando.ctlSpinner(false);               
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Juicios')
      }
    )
  }

  selectJuicioHandler(event: any) {
    console.log(event)
    this.msgSpinner = 'Cargando Costas...';
    this.lcargando.ctlSpinner(true);

    let data = {
      juicio: {
        id_cob_juicio: event,
      }
    }
    this.apiSrv.getCostas(data).subscribe(
      (res) => {
        console.log(res);
        this.costas= res['data']
        this.lcargando.ctlSpinner(false);               
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Costas')
      }
    )
    
    
  }
  selectCostaHandler(event: any){
    
    this.costasArray = {
      aplica:true,
      id_cob_juicio_actuaciones: event.id_cob_juicio_actuaciones,
      tipo:event.tipo,
      estado:event.estado,
      saldo:event.saldo,
      cobro: event.saldo
    }
    
    this.disabledJuicio = true;
    this.agregaCostas = false;
    
  }
  
  addCosta(){
    let flag = true;
    for(let i = 0 ; i<this.deudas.length; i++){
      if(this.deudas[i].id_cob_juicio_actuaciones === this.costasArray.id_cob_juicio_actuaciones){
       // console.log(this.usuarios[i]);
        flag = false;
        break;
      }
    }
    if(flag){
      this.deudas.push(this.costasArray);
      console.log(flag)
    }else{
      console.log(flag)
      this.toastr.info( "No puede seleccionar la misma costa."); 
    }
    this.vmButtons[0].habilitar=false;
    this.calcCobroTotal()
  }

  getCatalogos() {
    this.msgSpinner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REC_FORMA_PAGO','REC_FORMA_PAGO_ENTIDAD','REC_FORMA_PAGO_EMISOR','COB_JUICIO_ESTADO'",
    }

    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log(res);

        this.estados = []
        res['data']['COB_JUICIO_ESTADO'].forEach(e => {
          const o = {
            id: e.valor,
            value: e.descripcion,
            pos: e.isconstant,
          }
          this.estados = [...this.estados, o]
        })

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

       
        // this.lcargando.ctlSpinner(false);               
       // this.getConceptos();
       this.validacionCaja()
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
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
        //this.getConceptos();
        // this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )

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
        if(res['data'].estado=="A"){
          this.activo = true;
        } else if(res['data'].estado=="C") {
          this.activo = false;
        }
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al intentar verificar la caja')
      }
    )

  } */

 
 


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
    let dif = (+totalC100 - +totalP100);
    this.difCobroPago = +dif / 100;
  }

  removeFormaPago(index) {

    this.pagos.splice(index,1);
    if(this.pagos.length==0){
      this.vmButtons[0].habilitar=true;
    }
    this.calcPagoTotal();
  }
  removeCosta(index) {

    this.deudas.splice(index,1);
    if(this.deudas.length==0){
      this.vmButtons[0].habilitar=true;
      this.disabledJuicio = false;
    }
    this.calcCobroTotal();
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
    if (tipo=="TARJETA" || tipo=="DEBITO") {
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
    if ((tipo=="TARJETA" || tipo=="DEBITO") && (this.entidad==0 || this.emisor==0)){
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
   // console.log(event.valor)
    this.entidad = 0;
    this.emisor = 0;
    this.entidadesFiltrada = this.entidades.filter(e => e.grupo == event.valor);
    this.entidadDisabled = false;
    
    /* if(event.valor == "GARANTIA" || event.valor == "FAVOR" || event.valor == "CRUCE CONVENIO" || event.valor == "NOTA CREDITO" || event.valor == "ANTICIPO PRECOBRADO"){
      this.expandPago = true;
    } else {
      this.expandPago = false;
    } */
    this.expandPago = ['GARANTIA', 'FAVOR', 'CRUCE CONVENIO', 'NOTA CREDITO', 'ANTICIPO PRECOBRADO'].includes(event.valor);
    this.deshabilitarFormaPag = ["GARANTIA", "FAVOR", "CRUCE CONVENIO", "NOTA CREDITO", "ANTICIPO PRECOBRADO"].includes(event.valor)

    if(event.valor != "TARJETA" && event.valor != "DEBITO" && event.valor != "CHEQUE" && event.valor != "TRANSFERENCIA"  &&  event.valor!="DEPOSITO"){
      this.hayEntidad = false;
    } else {
      this.hayEntidad = true;
    }
    if(event.valor == "TARJETA" || event.valor == "DEBITO"){
      this.hayEmisor = true;
    } else {
      this.hayEmisor = false;
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
    for(let i=0;i<this.deudas.length;i++) {
      if (
        this.deudas[i].nuevo_saldo<0
      ) {        
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
        this.toastr.info("Debe ingresar al menos una costa a cobrar ");
        return;
      }
      //  else if(
      //   this.checkTitulosFechas()
      // ) {
      //   this.toastr.info(this.msjError);
      //   return;
      // }
      //  else if(
      //   this.checkCuotasPlazos()
      // ) {
      //   this.toastr.info(this.msjError);
      //   return;
      // } else if(
      //   this.checkCuotasATPlazos()
      // ) {
      //   this.toastr.info(this.msjError);
      //   return;
      // }
       else if(
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

      if (+this.difCobroPago<0){
        let dif100 = +this.difCobroPago * 100;
        let super100 = +dif100 - (2 * +dif100); // volver un numero positivo es restarle su doble
        let superavit = +super100 / 100;
        console.log(superavit);
        this.documento.superavit = +superavit.toFixed(2);
        this.superavit = 1;
        this.quitarDeudas = false;
      } else if (+this.difCobroPago>0){    
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

          this.msgSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(moment(this.documento.fecha).format('YYYY')),
            "mes": Number(moment(this.documento.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
            
            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.msgSpinner = 'Generando Documento de cobro...';
              this.lcargando.ctlSpinner(true);
                        
              if(this.quitarDeudas){
                this.totalCobro = 0;
                this.deudas = [];
              }
    
              this.documento.estado = "E";
             // this.documento.tipo_documento = this.concepto.codigo;
              this.documento.fk_contribuyente = this.contribuyenteActive.id_cliente;
              this.documento.subtotal = this.totalCobro;
              this.documento.total = this.totalCobro;
              this.documento.detalles = [];
              this.documento.fk_caja = this.cajaActiva.id_caja;
    
              console.log(this.deudas);
              console.log(this.pagos);
              this.deudas.forEach(e => {
                if (e.aplica && e.cobro > 0) {
    
                  let doc_det = {
                    id_documento_detalle: 0,
                    fk_documento: 0,
                    id_cob_juicio_actuaciones:e.id_cob_juicio_actuaciones,
                    tipo:e.tipo,
                    estado:e.estado,
                   // fk_liquidacion: e.id_liquidacion,
                   // fk_deuda: e.deuda.id_deuda,
                    fk_numero_documento: e.documento,
                    valor: parseFloat(e.cobro),
                    abono: parseFloat(e.cobro),
                    saldo_anterior: parseFloat(e.saldo),
                    saldo_actual: parseFloat(e.saldo) - parseFloat(e.cobro),
                   // comentario: e.comentario,
                   // fk_concepto: e.fk_concepto,
                   // codigo_concepto: e.concepto.codigo,
                   // fk_cuota: (e.cuota && e.cuota.id_documento_detalle) ? e.cuota.id_documento_detalle : 0, // id del documento det (cuota) para cambiar su estado luego de pagarla, 0 si no es cuota
                  }
    
                  this.documento.detalles.push(doc_det);
                }
              });
    
              this.documento.formas_pago = [];
              this.pagos.forEach(e => {
                if(e.valor > 0){
                  this.documento.formas_pago.push(e);
                }
              });
    
              let data2 = {
                documento: this.documento
              }
              console.log(this.documento);     
              // servicio que crea el documento, sus detalles, sus formas de pago asociadas
              // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
              // this.lcargando.ctlSpinner(false);
              // return ;
              this.apiSrv.setRecDocumento(data2).subscribe(
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
                      //this.triggerPrint();
                      this.printComprobante();
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

    let hoy = this.fecha.split(' ')[0];

    if(this.documento.estado=='X'){
      this.toastr.info('Este Documento ya esta Anulado.');
      return ;
    }
    // else if(this.documento.fecha != hoy){
    //   this.toastr.info('No puede anular un Documento cobrado en dias previos');
    //   return ;     
    // }
   
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


        this.msgSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let data = {
          "anio": Number(moment(this.documento.fecha).format('YYYY')),
          "mes": Number(moment(this.documento.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
          
          /* Validamos si el periodo se encuentra aperturado */
          if (res["data"][0].estado !== 'C') {
            let data2 = {
              documento: this.documento
            }
            console.log(this.documento);

            this.msgSpinner = "Anulando Documento...";
            this.lcargando.ctlSpinner(true);
            this.apiSrv.anularCosta(data2).subscribe(
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
                  title: "Documento anulado",
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
                  title: "Error al anular el documento",
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
    this.quitarDeudas = false;
    this.superavit = 0;
    this.expandPago = false;
    this.agregaCostas = true;
    this.msjError = '';
    this.fila = '';

    this.contribuyenteActive = {
      razon_social: ""
    };
    this.filter = {
      contribuyente: ""
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

  async validacionCaja() {
    this.msgSpinner = 'Validando Estado de Caja'
    this.lcargando.ctlSpinner(true)
    this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'))

    if (!this.cajaActiva) {
      console.log('Sin sesion')
      this.toastr.info('No tiene caja activa');
      this.formReadOnly = true
      this.activo = false
    } 

    if (this.cajaActiva && this.cajaActiva.fecha != moment().format('YYYY-MM-DD')) {
      console.log('No fue abierta hoy')
      this.toastr.info('La caja activa no fue abierta hoy.')
      this.formReadOnly = true
      this.activo = false
    }

    try {
      let response = await this.apiSrv.getCajaDiaByCaja({
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
      this.toastr.warning(err.error?.message)
    }
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
}
