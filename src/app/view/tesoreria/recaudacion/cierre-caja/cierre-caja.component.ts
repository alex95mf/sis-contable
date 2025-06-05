import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { CierreCajaService } from './cierre-caja.service';
import { environment } from 'src/environments/environment';

@Component({
standalone: false,
  selector: 'app-cierre-caja',
  templateUrl: './cierre-caja.component.html',
  styleUrls: ['./cierre-caja.component.scss']
})
export class CierreCajaComponent implements OnInit {

  @Input() fromGeneral = false;
  @Input() caja: any = {};
  @Input() fTitle = "Cierre de caja";

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  @ViewChild("print") print!: ElementRef;


  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');

  sumaEfectivoFinal: number = 0;
  formReadOnly: boolean = false;
  selectedCaja: any = ' ';
  cajasList: any = [];

  caja_dia = {
    id_caja_dia: 0,
    fk_caja: 0, // caja asociada (usuario incluido)
    fecha: moment(new Date()).format('YYYY-MM-DD'), // fecha del dia para que coincida con las recaudaciones detalles para ver titulos y formas de pago para ver metodos
    total_efectivo_inicio: 0, // cash inicial
    total_recaudacion: 0, // recaudacion total con tarjetas, cheques, etc
    total_recaudacion_efectivo: 0, // recaudacion es final - inicial (solo efectivo)
    total_efectivo_cierre_final: 0, // cash final computo
    total_efectivo_fisico: 0, // cash real final
    total_sobrante: 0, // cuando el cash real final es mayor al computo efectivo cierre final
    total_faltante: 0, // cuando el cash real final es menor al computo efectivo cierre final
    estado: "",
    monedas: [], // detalles tipo moneda
    billetes: [], // detalles tipo billete
    detalles: [],
    resumen: [],
    depositos: [],
  }

  monedas: any = [];
  billetes: any = [];

  monedasCat: any = [];
  billetesCat: any =[];

  recibosDia: any = [];

  cajaActiva: any = {
    id_caja: 0,
    nombre: "",
  }

  cajaDiaData: any = {};

  total = 0;
  totalEF = 0;
  totalCH = 0;
  totalTC = 0;
  totalTR = 0;
  totalTD = 0;
  totalGA = 0;
  totalVF = 0;
  totalND = 0;
  totalDE = 0;
  totalOtro = 0;


  cuentaDepositar = 0;

  cuentasBancarias: any = [
    {
      cuenta_banco: "CUENTA 1"
    },
    {
      cuenta_banco: "CUENTA 2"
    },
    {
      cuenta_banco: "CUENTA 3"
    },
  ]

  depositos: any = [];

  totalDepositar = 0;
  totalDeposito = 0;
  difDepositos = 0;

  activo: boolean = false

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVSrv: CommonVarService,
    private apiSrv: CierreCajaService,
    private activeModal: NgbActiveModal,
    private cierremesService: CierreMesService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    // this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'));

    // console.log(this.cajaActiva);

    this.iniciarData();

    if(this.fromGeneral){
      this.vmButtons = [
        {
          orig: "btnsRecCierraCaja",
          paramAccion: "",
          boton: { icon: "far fa-chevron-left", texto: "REGRESAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false,
        },
      ]
    }else{

    this.vmButtons = [
      {
        orig: "btnsRecCierraCaja",
        paramAccion: "",
        boton: { icon: "far fa-sunset", texto: "CERRAR CAJA" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRecCierraCaja",
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
    ]
    }


      setTimeout(() => {
        // this.caja_dia.fk_caja = this.cajaActiva.id_caja;
        if(this.fromGeneral){
          this.caja_dia.fk_caja = this.caja.fk_caja;
          this.caja_dia.fecha = this.caja.fecha;
          // this.verificarCaja();
          this.validacionCaja()
        }else{
          this.validaPermisos();
        }
      }, 0);


  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "CERRAR CAJA":
      this.validaCaja();
        break;
      // case " BUSCAR":
      //   this.revisarConcepto();
      //   break;
      case "IMPRIMIR":
        this.mostrarReporte()
        break;
      // case " REABRIR CAJA":
      //   this.reabrirCaja();
      //   break;
      case "REGRESAR":
        this.activeModal.dismiss();
        break;
      default:
        break;
    }
  }

  triggerPrint(): void {
    this.print.nativeElement.click();
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fTesCierreCaja,
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
          this.getCatalogos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  getCatalogos() {

    (this as any).mensajeSpinner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REC_DENOMINACION_DETALLE'",
    }

    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log(res);
        res['data']['REC_DENOMINACION_DETALLE'].forEach(e => {
          if(e.grupo=="M"){
            let m = {
              denominacion: e.descripcion,
              cantidad: 0,
              total_denominacion: 0,
            }
            this.monedasCat.push(m);
          }else if(e.grupo=="B"){
            let b = {
              denominacion: e.descripcion,
              cantidad: 0,
              total_denominacion: 0,
            }
            this.billetesCat.push(b);
          }
        })
        // this.lcargando.ctlSpinner(false);
        this.getCajasData();
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )

  }

  // prob no se use aqui
  getCajasData() {
    (this as any).mensajeSpinner = 'Cargando Cajas del sistema...';
    this.lcargando.ctlSpinner(true);

    let data = {
      id_usuario: this.dataUser.id_usuario
    }

    this.apiSrv.getCajasByUser(data).subscribe(
      (res) => {
        console.log(res);
        this.cajasList = res['data'];
        // this.lcargando.ctlSpinner(false);
        // this.verificarCaja();
        // this.recargarCaja();
        this.validacionCaja()
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Las cajas del usuario')
      }
    )

  }

  async validacionCaja() {
    (this as any).mensajeSpinner = 'Validando Estado de Caja'
    this.lcargando.ctlSpinner(true);
    this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'))

    try {
    if (!this.cajaActiva) {
      console.log('Sin sesion')
      // this.toastr.info('No tiene caja activa');
      this.formReadOnly = true
      this.activo = false
      throw new Error('No tiene caja activa.')
    }

    if (this.cajaActiva && this.cajaActiva.fecha != moment(this.caja_dia.fecha).format('YYYY-MM-DD')) {
      console.log('No fue abierta hoy')
      // this.toastr.info('La caja activa no fue abierta hoy.')
      this.formReadOnly = true
      this.activo = false
      throw new Error('La caja activa no fue abierta hoy.')
    }

      const response = await this.apiSrv.getCajaDiaByCaja({
        id_caja: this.cajaActiva.id_caja,
        fecha: this.cajaActiva.fecha
      }) as any
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
      this.cajaDiaData = response.data
      this.assignData();

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(err.error?.message ?? err, 'Validacion de Caja Activa')
    }
  }

  recargarCaja() {
    this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'));

    // if(this.fromGeneral){
    //   this.caja_dia.fk_caja = this.caja.fk_caja;
    //   this.caja_dia.fecha = this.caja.fecha;
    //   this.verificarCaja();
    // } else {
      if(!this.cajaActiva || this.cajaActiva.fecha != moment().format('YYYY-MM-DD')){
        this.lcargando.ctlSpinner(false)
        Swal.fire({
          icon: "warning",
          title: "No puede continuar",
          text: "Debe abrir una caja nueva o seleccionar una caja cerrada para usar esta pantalla.",
          showCloseButton: false,
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
      }else {
        this.caja_dia.fk_caja = this.cajaActiva.id_caja;
        // this.verificarCaja();
        this.validacionCaja()
      }
    // }

  }

  verificarCaja() {
    // funcion para revisar si la caja seleccionada ya ha sido abierta ese dia

    (this as any).mensajeSpinner = 'Verificando si la caja está activa...';
    this.lcargando.ctlSpinner(true);

    let data = {
      // id_caja: this.cajaActiva.id_caja,
      id_caja: this.caja_dia.fk_caja,
      fecha: this.caja_dia.fecha,
    }

    this.apiSrv.getCajaDiaByCaja(data).subscribe(
      (res) => {
        console.log(res);
        this.cajaDiaData = res['data'];
        this.assignData();
        // this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al intentar verificar la caja')
      }
    )

  }

  assignData() {
    this.iniciarData();
    let data = this.cajaDiaData;
    // en este caso siempre habra data ya que se debe haber creado (abierto) la caja
    // this.caja_dia.fk_caja = this.cajaActiva.id_caja; // el id_caja seleccionada no se puede perder
    if (data.estado=="A") {
      // si la caja esta abierta permite editar
      if(!this.fromGeneral){
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
      }
      // this.vmButtons[2].habilitar = true;
      this.formReadOnly = false;
      this.fillData();
      this.getRecibosDia();

    } else if(data.estado=="C") {
      if(!this.fromGeneral){
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
      }
      // this.vmButtons[2].habilitar = false;
      this.formReadOnly = true;
      this.fillData();
      this.getRecibosDia();

    } else {
      this.lcargando.ctlSpinner(false);
    }

    this.caja_dia = data;


  }

  fillData() {
    let data = this.cajaDiaData;
    // llena con data de monedas y billetes al tener la caja ya cerrada
    data.detalles.forEach(d => {
      if(d.tipo_denominacion=="M") {

        this.monedas.forEach(m => {
          if(+d.denominacion == +m.denominacion){
            Object.assign(m, {
              cantidad: d.cantidad_cierre,
              total_denominacion: d.total_cierre,
            })
          }
        })

      }else if(d.tipo_denominacion=="B") {

        this.billetes.forEach(b => {
          if(+d.denominacion == +b.denominacion){
            Object.assign(b, {
              cantidad: d.cantidad_cierre,
              total_denominacion: d.total_cierre,
            })
          }
        })

      }
    });

    // // llena data de los depositos bancarios
    // data.depositos.forEach(d => {

    //   this.totalDeposito += +d.total;
    //   let dep = {
    //     cuenta_banco: d.cuenta_banco,
    //     total: d.total,
    //   }
    //   this.depositos.push(dep);
    // })

  }

  recargarReporteDiario() {
    this.getRecibosDia();
  }

  getRecibosDia() {
    (this as any).mensajeSpinner = 'Cargando Reporte diario...';
    this.lcargando.ctlSpinner(true);


    let dt = this.cajaDiaData;

    let data = {
      id_caja: dt.fk_caja,
      fecha: dt.fecha
    }

    console.log(data);

    this.apiSrv.getRecibosByDia(data).subscribe(
      (res) => {
        console.log(res);
        this.recibosDia = res['data'];
        this.calcDocumentos();
        // this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Recibos de la caja activa')
      }
    )

  }

  agregaDepositos() {
    let nuevo = {
      id_caja_dia_deposito: 0,
      fk_caja_dia: 0, // sera el id del documento que se cree primero la cabecera
      fk_caja: this.cajaActiva.id_caja,
      cuenta_banco: this.cuentaDepositar,
      total: 0,
      estado: "A",
      comentario: "",
    }

    this.depositos.push(nuevo);
    if(!this.fromGeneral){
      this.vmButtons[0].habilitar = false;
      this.vmButtons[1].habilitar = true;
    }
  }

  removeDeposito(index) {

    this.depositos.splice(index,1);
    if(this.depositos.length==0){
      if(!this.fromGeneral){
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = true;
      }
    }
    this.calcDepositoFinal();
  }

  calcDepositoFinal() {
    let deposito = 0;
    this.depositos.forEach(e => {
      // if (e.aplica) {
        let total100 = +e.total * 100;
        deposito += +total100; // en este caso es total porque sale de valor unitario * cantidad
      // }
    });
    this.totalDeposito = deposito / 100;
    this.calcDifDepositos();
  }

  calcDifDepositos() {
    let depositar100 = +this.totalDepositar * 100;
    let depositado100 = +this.totalDeposito * 100;
    let dif100 = +depositar100 - +depositado100;
    this.difDepositos = +dif100 / 100;
     this.lcargando.ctlSpinner(false);
  }

  calcDocumentos() {

    this.total = 0;
    this.totalEF = 0;
    this.totalCH = 0;
    this.totalTC = 0;
    this.totalTR = 0;
    this.totalTD = 0;
    this.totalGA = 0;
    this.totalVF = 0;
    this.totalND = 0;
    this.totalDE = 0;
    this.totalOtro = 0;

    this.totalDepositar = 0;
    this.totalDeposito = 0;
    this.difDepositos = 0;


    this.recibosDia.forEach(r => {
      let totalEF = 0; //EFECTIVO
      let totalCH = 0; //CHEQUE
      let totalTC = 0; //TARJETA CREDITO
      let totalTR = 0; //TRANSFERENCIA
      let totalTD = 0; //TARJETA DEBITO
      let totalGA = 0; //GARANTIA
      let totalVF = 0; //VALOR A FAVOR
      let totalND = 0; //NOTA DE DEBITO
      let totalDE = 0; //DEPOSITO
      let totalOtro = 0; //OTRAS FORMAS DE PAGO


      r.formas_pago.forEach(f => {
        if(f.estado!='X'){
          if(f.tipo_pago=="EFECTIVO"){
            totalEF += +f.valor;
          }else if(f.tipo_pago=="CHEQUE"){
            totalCH += +f.valor;
          }else if(f.tipo_pago=="TARJETA"){
            totalTC += +f.valor;
          }else if(f.tipo_pago=="TRANSFERENCIA"){
            totalTR += +f.valor;
          }else if(f.tipo_pago=="DEBITO"){
            totalTD += +f.valor;
          }else if(f.tipo_pago=="GARANTIA"){
            totalGA += +f.valor;
          }else if(f.tipo_pago=="FAVOR"){
            totalVF += +f.valor;
          }else if(f.tipo_pago=="NOTA"){
            totalND += +f.valor;
          }else if(f.tipo_pago=="DEPOSITO"){
            totalDE += +f.valor;
          }else{
            totalOtro += +f.valor;
          }
          Object.assign(r,{
            totalEF: totalEF,
            totalCH: totalCH,
            totalTC: totalTC,
            totalTR: totalTR,
            totalTD: totalTD,
            totalGA: totalGA,
            totalVF: totalVF,
            totalND: totalND,
            totalDE: totalDE,
            totalOtro: totalOtro,
          });
        }
      })

      console.log(r)

      if(r.tipo_documento=='CA') { // documentos cobro de caja
        if(!r.superavit || +r.superavit==0){ //cobro de caja sin superavit
          console.log('Caja sin superavit');
          let rec100 = +r.total * 100;
          let gvf100 = (+r.totalGA * 100) + (+r.totalVF * 100);
          let dif100 = +rec100 - +gvf100;
          r.total = +dif100 / 100;
        }else if((r.superavit || +r.superavit>0) && +r.total>0){ //cobro de caja con superavit
          // r.total es los titulos cobrados
          let tit100 = +r.total * 100;
          let sph100 = +r.superavit * 100;
          let rec100 = +tit100 + +sph100;
          let gvf100 = (+r.totalGA * 100) + (+r.totalVF * 100);
          let dif100 = +rec100 - +gvf100;
          r.total = +dif100 / 100;
          // r.total += +r.superavit;
          console.log('Caja con superavit');
        }else if((r.superavit || +r.superavit>0) && +r.total==0){ //puro superavit no se cobra ninguna deuda
          let tit100 = +r.total * 100;
          let sph100 = +r.superavit * 100;
          let rec100 = +tit100 + +sph100;
          r.total = +rec100 / 100;
          // r.total += +r.superavit;
          // r.total = +r.superavit;
          console.log('Solo superavit');
        }
      }
      // else if(r.tipo_documento=='GA'){
      //   r.total -= (+r.totalGA + +r.totalVF);
      //   console.log('Garantia');
      // }

      // if(r.tipo_documento == "CA"){
      //  let totalGF = (+(r.totalGA) + +(r.totalVF)) * 100;
      //  let resta = +(r.total * 100) - +totalGF;
      //   r.total = resta / 100;
      // }

      this.total += +r.total;
      this.totalEF += +r.totalEF;
      this.totalCH += +r.totalCH;
      this.totalTC += +r.totalTC;
      this.totalTR += +r.totalTR;
      this.totalTD += +r.totalTD;
      this.totalGA += +r.totalGA;
      this.totalVF += +r.totalVF;
      this.totalND += +r.totalND;
      this.totalDE += +r.totalDE;
      this.totalOtro += +r.totalOtro;


    })


    // aqui revisar si se deposita el efectivo recaudado o el efectivo fisico (es decir, se quedaria debiendo de la caja o la caja queda intacta)

    this.caja_dia.total_efectivo_cierre_final = parseFloat((+this.caja_dia.total_efectivo_inicio + +this.totalEF).toFixed(2));

    this.sobraOFalta();

    // lo que se deposita es el total del efectivo mas cheque (+ sobrante si existe)
    // this.calcValoresDeposito(); // ya se calculan desde sobraOfalta
  }

  calcValoresDeposito() {

    let sobra100 = +this.caja_dia.total_sobrante * 100; // valor del sobrante x 100 , 0 si era 0 inicialmente
    let efect100 = +this.totalEF * 100;
    let cheqe100 = +this.totalCH * 100;
    let total100 = +sobra100 + +efect100 + +cheqe100;
    this.totalDepositar = +total100 / 100;
    this.calcDifDepositos();
  }

  sobraOFalta() {
    if(this.caja_dia.total_efectivo_fisico < this.caja_dia.total_efectivo_cierre_final){
      this.caja_dia.total_sobrante = 0;
      let computo100 = +this.caja_dia.total_efectivo_cierre_final * 100;
      let fisico100 = +this.caja_dia.total_efectivo_fisico * 100;
      let dif100 = +computo100 - +fisico100;
      this.caja_dia.total_faltante = +dif100 / 100;
    } else if (this.caja_dia.total_efectivo_fisico > this.caja_dia.total_efectivo_cierre_final){
      this.caja_dia.total_faltante = 0;
      let computo100 = +this.caja_dia.total_efectivo_cierre_final * 100;
      let fisico100 = +this.caja_dia.total_efectivo_fisico * 100;
      let dif100 = +fisico100 - +computo100;
      this.caja_dia.total_sobrante = +dif100 / 100;
    } else {
      this.caja_dia.total_sobrante = 0;
      this.caja_dia.total_faltante = 0;
    }
    this.calcValoresDeposito();
  }

  iniciarData() {

    this.sumaEfectivoFinal = 0;

    this.caja_dia = {
      id_caja_dia: 0,
      fk_caja: 0, // caja asociada (usuario incluido)
      fecha: moment(new Date()).format('YYYY-MM-DD'), // fecha del dia para que coincida con las recaudaciones detalles para ver titulos y formas de pago para ver metodos
      total_efectivo_inicio: 0, // cash inicial
      total_recaudacion: 0, // recaudacion total con tarjetas, cheques, etc
      total_recaudacion_efectivo: 0, // recaudacion es final - inicial (solo efectivo)
      total_efectivo_cierre_final: 0, // cash final computo
      total_efectivo_fisico: 0, // cash real final
      total_sobrante: 0, // cuando el cash real final es mayor al computo efectivo cierre final
      total_faltante: 0, // cuando el cash real final es menor al computo efectivo cierre final
      estado: "",
      monedas: [], // detalles tipo moneda
      billetes: [], // detalles tipo billete
      detalles: [],
      resumen: [],
      depositos: [],
    }

    // reinicia los arrays a como estan cargados de catalogos

    this.monedas = JSON.parse(JSON.stringify(this.monedasCat));
    this.billetes = JSON.parse(JSON.stringify(this.billetesCat));


    this.recibosDia = [];
    this.depositos = [];

    this.total = 0;
    this.totalEF = 0;
    this.totalCH = 0;
    this.totalTC = 0;
    this.totalTR = 0;
    this.totalTD = 0;
    this.totalGA = 0;
    this.totalVF = 0;
    this.totalND = 0;
    this.totalDE = 0;
    this.totalOtro = 0;

    this.totalDepositar = 0;
    this.totalDeposito = 0;
    this.difDepositos = 0;

  }

  reabrirCaja() {
    console.log(this.caja_dia);
    (this as any).mensajeSpinner = 'Reabriendo caja...';
    this.lcargando.ctlSpinner(true);

    let data = {
      caja_dia: this.caja_dia
    }

    this.apiSrv.reabrirCaja(data).subscribe(
      (res) => {
        console.log(res);

        this.lcargando.ctlSpinner(false);
        this.verificarCaja();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "La caja ha sido reabierta con éxito",
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        })
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error reabriendo Caja')
      }
    )
  }

  async validaCaja() {
    if(this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para cerrar esta Caja");
    } else {
        let resp = await this.validaDataGlobal().then((respuesta) => {
          if(respuesta) {
            Swal.fire({
              icon: "warning",
              title: "¡Atención!",
              text: "¿Seguro que desea cerrar esta caja?",
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            }).then((result)=> {
              if (result.isConfirmed) {

                (this as any).mensajeSpinner = "Verificando período contable";
                this.lcargando.ctlSpinner(true);
                let data = {
                  "anio": Number(moment(this.caja_dia.fecha).format('YYYY')),
                  "mes": Number(moment(this.caja_dia.fecha).format('MM')),
                }
                  this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

                  /* Validamos si el periodo se encuentra aperturado */
                  if (res["data"][0].estado !== 'C') {

                    this.cerrarCajaDia();

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
        });
    }
  }

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if(
        this.caja_dia.total_efectivo_fisico < 0 ||
        this.caja_dia.total_efectivo_fisico == undefined
      ) {
        this.toastr.info("Debe ingresar el efectivo con el que cierra la caja");
        flag = true;
      } else if(
        this.caja_dia.total_efectivo_fisico < this.caja_dia.total_efectivo_inicio
      ) {
        this.toastr.info("El efectivo con el que cierra la caja no puede ser menor al valor que se ingresó al inicio "+this.caja_dia.total_efectivo_inicio);
        flag = true;
      } else if(
        this.caja_dia.total_faltante > 0
      ) {
        this.toastr.info("No puede cerrar la caja con dinero faltante");
        flag = true;
      } else if(
        this.caja_dia.fecha == "" ||
        this.caja_dia.fecha == undefined
      ) {
        this.toastr.info("El campo Fecha no puede ser vacío");
        flag = true;
      } else if(
        this.caja_dia.estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un Estado");
        flag = true;
      }
      // else if(
      //   this.depositos.length<=0||!this.depositos.length
      // ) {
      //   this.toastr.info("Debe ingresar al menos un depósito")
      //   flag = true;
      // }
      // else if(
      //   this.difDepositos!=0
      // ) {
      //   this.toastr.info("El valor depositado debe ser de "+this.totalDepositar)
      //   flag = true;
      // }
      !flag ? resolve(true) : resolve(false);
    })
  }

  cerrarCajaDia() {

    (this as any).mensajeSpinner = 'Cerrando caja...';
    this.lcargando.ctlSpinner(true);

    console.log(this.caja_dia);

    // LLENA ARRAY MONEDAS DE CAJA_DIA
    this.caja_dia.monedas = [];
    this.monedas.forEach(e => {
      // if(e.cantidad>0){ // solo si tiene de esa denominacion se agrega
        let m = {
          tipo_detalle: "C",
          tipo_denominacion: "M",
          denominacion: e.denominacion,
          cantidad_cierre: e.cantidad,
          total_cierre: e.total_denominacion,
        }
        this.caja_dia.monedas.push(m);
      // }
    })

    // LLENA ARRAY BILLETES DE CAJA_DIA
    this.caja_dia.billetes = [];
    this.billetes.forEach(e => {
      // if(e.cantidad>0){ // solo si tiene de esa denominacion se agrega
        let b = {
          tipo_detalle: "C",
          tipo_denominacion: "B",
          denominacion: e.denominacion,
          cantidad_cierre: e.cantidad,
          total_cierre: e.total_denominacion,
        }
        this.caja_dia.billetes.push(b);
      // }
    })

    // SE LLENAN LOS IDS DE CADA DETALLE

    this.caja_dia.detalles.forEach(e => {
      this.caja_dia.monedas.forEach(m => {
        if(e.tipo_denominacion=="M" && +e.denominacion == +m.denominacion){
          Object.assign(m,{
            id_caja_dia_detalle: e.id_caja_dia_detalle,
          })
        }
      })
    })

    this.caja_dia.detalles.forEach(e => {
      this.caja_dia.billetes.forEach(b => {
        if(e.tipo_denominacion=="B" && +e.denominacion == +b.denominacion){
          Object.assign(b,{
            id_caja_dia_detalle: e.id_caja_dia_detalle,
          })
        }
      })
    })

    this.caja_dia.total_recaudacion = this.total;
    this.caja_dia.total_recaudacion_efectivo = this.totalEF;

    this.caja_dia.resumen = [
      {
        forma_pago: "EFECTIVO",
        total: this.totalEF,
      },
      {
        forma_pago: "TARJETA",
        total: this.totalTC,
      },
      {
        forma_pago: "CHEQUE",
        total: this.totalCH,
      },
      {
        forma_pago: "TRANSFERENCIA",
        total: this.totalTR,
      },
      {
        forma_pago: "DEBITO",
        total: this.totalTD,
      },

      {
        forma_pago: "GARANTIA",
        total: this.totalGA,
      },

      {
        forma_pago: "FAVOR",
        total: this.totalVF,
      },

      {
        forma_pago: "NOTA",
        total: this.totalND,
      },
      {
        forma_pago: "DEPOSITO",
        total: this.totalDE,
      },
      {
        forma_pago: "OTRO",
        total: this.totalOtro,
      },

    ]

    //this.caja_dia.depositos = this.depositos;

    let data = {
      caja: this.caja_dia,
    }

    console.log(data);

    this.apiSrv.cerrarCaja(data).subscribe(
      (res) => {
        console.log(res);
        if (res["status"] == 1) {
        this.lcargando.ctlSpinner(false);
        this.caja_dia.estado = "C"; // Estado C de caja cerrada
        this.vmButtons[0].habilitar = true; // YA ESTA CERRADA NO SE PUEDE CERRAR
        this.vmButtons[1].habilitar = false;
        this.formReadOnly = true;

        // se elimina la caja en la sesion (LocalStorage)
        // localStorage.removeItem('activeCaja');

        Swal.fire({
            icon: "success",
            title: "Caja Cerrada",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
        }).then((res)=> {
          if(res.isConfirmed){
            this.triggerPrint();
          }
        })
        } else {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
        });
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  multiplicar(d) {

    let deno100 = +d.denominacion * 100;
    let total100 = +deno100 * +d.cantidad;
    d.total_denominacion = +total100 / 100;

    this.calcSumaEfectivo();

  }

  calcSumaEfectivo() {
    let totalMonedas = 0;
    this.monedas.forEach(e => {
      let deno100 = +e.total_denominacion * 100;
      totalMonedas += +deno100;
    })
    let totalBilletes = 0;
    this.billetes.forEach(e => {
      let deno100 = +e.total_denominacion * 100;
      totalBilletes += +deno100;
    })

    let total_efectivo_fisico100 = +totalMonedas + +totalBilletes;
    this.caja_dia.total_efectivo_fisico = total_efectivo_fisico100/100;

    this.sobraOFalta();
  }


  mostrarReporte(){



            window.open(environment.ReportingUrl +"rpt_cierreCaja"+".pdf?&j_username=" + environment.UserReporting
            + "&j_password=" + environment.PasswordReporting+"&fecha=" + this.caja_dia.fecha + "&caja="+ this.caja_dia.fk_caja,'_blank')
              console.log( this.caja_dia.fecha);
              console.log(this.caja_dia.fk_caja);







  }

}
