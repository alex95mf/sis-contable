import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { CierreGeneralService } from './cierre-general.service';
import { CierreCajaComponent } from '../cierre-caja/cierre-caja.component';
import { environment } from 'src/environments/environment';
import { ModalReporteCajaComponent } from './modal-reporte-caja/modal-reporte-caja.component';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-cierre-general',
  templateUrl: './cierre-general.component.html',
  styleUrls: ['./cierre-general.component.scss']
})
export class CierreGeneralComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = "Cierre general";
  msgSpinner: string = "Cargando...";
  vmButtons: Botonera[] = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  formReadOnly: boolean = false;
  depositoDisabled: boolean = false;
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
  today = moment(new Date()).format('YYYY-MM-DD');

  cajasDia: any = [];

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
    depositos: [],
  }

 
  depositoDetallesIds: any = []

  totalConceptos = 0;
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

  porcTotal = 0;
  porcEF = 0;
  porcCH = 0;
  porcTC = 0;
  porcTR = 0;
  porcTD = 0;
  porcGA = 0;
  porcVF = 0;
  porcND = 0;
  porcDE = 0;
  porcOtro = 0;

  allDetalles: any = [];
  allFormasPago: any = [];

  fecha_consulta = moment(new Date()).format('YYYY-MM-DD');

  conceptosList: any = [
    //{ codigo: 'EF', nombre: 'ESPECIES FISCALES' },
   // { codigo: 'GA', nombre: 'GARANTÍAS DE MERCADO' },
    //{ codigo: 'COST', nombre: 'COSTAS' },
    { codigo: 'SUPERAVIT', nombre: 'SUPERAVIT' },

  ];
  conceptosReportes: any = [];
  concepto: any = 0;

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
  listaCuentas: any = []

  superavit: any = 0

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVSrv: CommonVarService,
    private apiSrv: CierreGeneralService,
    private ngbModal: NgbModal,
    private cierremesService: CierreMesService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnsRecCierreGeneral",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      // {
      //   orig: "btnsRecCierreGeneral",
      //   paramAccion: "",
      //   boton: { icon: "far fa-search", texto: " BUSCAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-primary boton btn-sm",
      //   habilitar: false,
      // },
      {
        orig: "btnsRecCierreGeneral",
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
      { orig: 'btnsRecCierreGeneral', paramAccion: '', boton: {icon: 'far fa-check', texto: 'HABILITAR'}, clase: 'btn btn-sm btn-secondary', permiso:true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      {
        orig: "btnsRecCierreGeneral",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(() => {
      this.validaPermisos();
      this.cargarCuentas();
    }, 0);
   


  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "GUARDAR":
       this.validaCaja();
        break;
      case " BUSCAR":
        // this.revisarFecha();
        break;
      case "IMPRIMIR":
        this.mostrarReporte();
        break;
      case "LIMPIAR":
        this.confirmRestore();
        break;
      case "HABILITAR":
        break;
      default:
        break;
    }
  }

  validaPermisos() {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fTesCierreGeneral,
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
          this.lcargando.ctlSpinner(false);
          // this.getCajasData();
          // this.getRecibosDia();
          // this.verificarCaja();          
          // this.getCajasDia();
          this.getConceptos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }
  
  async validaCaja() {
    if(this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para realizar el cierre general");
      return;
    } 

    try {
      let response = await this.validaDataGlobal();
      if (response) {
        let result = await Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea realizar el cierre general?",
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        })

        if (result.isConfirmed) {

          this.msgSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(moment(this.fecha_consulta).format('YYYY')),
            "mes": Number(moment(this.fecha_consulta).format('MM')),
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
      }

      
    } catch (err) {
      console.log(err)
      this.toastr.warning(err, 'Validacion de Datos', {enableHtml: true})
    }
  }

  validaDataGlobal() {

    let message = ''
    
    return new Promise((resolve, reject) => {

      this.cajasDia.forEach((caja: any) => {
        if (caja.estado == 'A') message += `Caja ${caja.caja.nombre} aun se encuentra abierta.<br>`
      })

      let depositar100 = this.totalDepositar * 100;
      let depositado100 = this.totalDeposito * 100;
      this.totalDepositar = depositar100 / 100;
      this.totalDeposito = depositado100 / 100;


      this.totalDeposito = Number(this.totalDeposito.toFixed(2))
      this.totalDepositar = Number(this.totalDepositar.toFixed(2))
      this.difDepositos = Number(this.difDepositos.toFixed(2))
    
      console.log(this.totalDepositar , this.totalDeposito, this.difDepositos)


      if(this.difDepositos != 0 || this.totalDepositar != this.totalDeposito) {
        message += "* El valor a depositar debe ser igual al valor depositado.<br>"
        // flag = true;
       } 
      // if(
      //   this.caja_dia.total_efectivo_fisico < 0 ||
      //   this.caja_dia.total_efectivo_fisico == undefined
      // ) {
      //   this.toastr.info("Debe ingresar el efectivo con el que cierra la caja");
      //   flag = true;
      //  } 
      //else if(
      //   this.caja_dia.total_efectivo_fisico < this.caja_dia.total_efectivo_inicio 
      // ) {
      //   this.toastr.info("El efectivo con el que cierra la caja no puede ser menor al valor que se ingresó al inicio "+this.caja_dia.total_efectivo_inicio);
      //   flag = true;
      // } else if(
      //   this.caja_dia.total_faltante > 0 
      // ) {
      //   this.toastr.info("No puede cerrar la caja con dinero faltante");
      //   flag = true;
      // } else if(
      //   this.caja_dia.fecha == "" ||
      //   this.caja_dia.fecha == undefined
      // ) {
      //   this.toastr.info("El campo Fecha no puede ser vacío");
      //   flag = true;
      // } else if(
      //   this.caja_dia.estado == undefined  
      // ) {
      //   this.toastr.info("Debe seleccionar un Estado");
      //   flag = true;
      // } else if(
      //   this.depositos.length<=0||!this.depositos.length
      // ) {
      //   this.toastr.info("Debe ingresar al menos un depósito")
      //   flag = true;
      // } else if(
      //   this.difDepositos!=0
      // ) {
      //   this.toastr.info("El valor depositado debe ser de "+this.totalDepositar)
      //   flag = true;
      // }
      return (message.length > 0) ? reject(message) : resolve(true)
    })
  }

  cerrarCajaDia() {

    this.msgSpinner = 'Realizando cierre general...';
    this.lcargando.ctlSpinner(true);

    console.log(this.caja_dia);
    
    this.caja_dia.total_recaudacion = this.total;
    this.caja_dia.total_recaudacion_efectivo = this.totalEF;

    this.caja_dia.depositos = this.depositos;
    this.caja_dia.fecha = this.fecha_consulta;

    let data = {
      caja: this.caja_dia,
      detallesEliminar: this.depositoDetallesIds
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
       // this.formReadOnly = true;

        // se elimina la caja en la sesion (LocalStorage)
        // localStorage.removeItem('activeCaja');

        Swal.fire({
            icon: "success",
            title: "Cierre General realizado con exito",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
        }).then((res)=> {
          // if(res.isConfirmed){
          //   this.triggerPrint();
          // }
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
        console.log(res['data'])

        res['data'].forEach(c => {
          let concepto = {
            id: c.id_concepto,
            codigo: c.codigo,
            nombre: c.nombre,
            id_tarifa: c.id_tarifa,
            tipo_calculo: c.tipo_calculo,
            tiene_tarifa: c.tiene_tarifa==1 ? true : false //llena el campo con true si tiene tarifa
          }
          this.conceptosList.push({...concepto})
        })


        this.conceptosList = this.conceptosList.filter(c => (c.codigo!="BA" && c.codigo!="AN" && c.codigo!="EX"));

        this.lcargando.ctlSpinner(false);
        // this.getCajasDia();
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  cargarCuentas() {

    this.apiSrv.listarCuentasBancos({}).subscribe((res: any) => {
      //console.log(res);
     
      res.map((data) => {
        let item={
          name_banks:data.name_banks,
          num_cuenta:data.num_cuenta,
          cuenta_contable:data.cuenta_contable
        }
        this.listaCuentas.push(item)
        
      })
      console.log(this.listaCuentas)
    })
  }

  getCajasDia() {
    // obtiene todas las cajas dia de ese dia para hacer el reporte general
    this.msgSpinner = 'Cargando reportes de todas las cajas...';
    this.lcargando.ctlSpinner(true);
    console.log(this.today);
    console.log(this.fecha_consulta);
    let data = {
      fecha: this.fecha_consulta,
    }

    this.apiSrv.getCajasDia(data).subscribe(
      (res) => {
        console.log(res);
        if(res['data'].length>0){
          this.vmButtons[0].habilitar = false;
          this.vmButtons[1].habilitar = false;
         
          this.apiSrv.getDepositos(data).subscribe(
            (res2) => {
              console.log(res2)
              this.vmButtons[0].habilitar = false
              if(res2['data'].length > 0){
                this.depositos = []
                this.vmButtons[0].habilitar = true;
                let totalDepositado = 0;
                res2['data'].forEach(e => {
                  let dep = {
                    id_caja_general_deposito: e.id_caja_general_deposito,
                    fk_caja_dia: 0, // sera el id del documento que se cree primero la cabecera
                   // fk_caja: this.cajaActiva.id_caja,
                    nombre_banco: e.cuenta_banco,
                    cuenta_banco:e.num_cuenta,
                    cuenta_contable: e.cuenta_contable,
                    total: e.total,
                    estado: e.estado,
                    comentario: e.comentario,
                  }
                  totalDepositado += +e.total; 
                  this.depositos.push(dep);
                });
                this.totalDeposito = totalDepositado;
                //this.formReadOnly = true
              }

            });

        } else {
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = true;
        }
        this.iniciarData();
        this.cajasDia = res['data'];
        this.calcCajasDia();
        // this.getRecibosCadaCaja();     
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando los reportes')
      }
    )
    
  }

  iniciarData() {
    this.cajasDia = [];
    this.conceptosReportes = [];
    this.total = 0;
    this.totalConceptos = 0

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
      depositos: [],
    }
  
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

    this.porcTotal = 0;
    this.porcEF = 0;
    this.porcCH = 0;
    this.porcTC = 0;
    this.porcTR = 0;
    this.porcTD = 0;
    this.porcGA = 0;
    this.porcVF = 0;
    this.porcND = 0;
    this.porcDE = 0;
    this.porcOtro = 0;
  }

  confirmReabrir(caja) {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reabrir esta caja?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#20A8D8',
    }).then((result)=> {
      if (result.isConfirmed) {
        this.reabrirCaja(caja);
      }
    });
  }

  reabrirCaja(caja) {
    console.log(caja);
    console.log(this.today);
    console.log(this.fecha_consulta);

    // Comentado temporal para pruebas de 2024
    // if(this.today!=this.fecha_consulta){
    //   this.toastr.info('No puede reabrir cajas de días pasados');
    //   return ;
    // }

    this.msgSpinner = 'Reabriendo caja...';
    this.lcargando.ctlSpinner(true);

    let data = {
      caja_dia: caja
    }

    this.apiSrv.reabrirCaja(data).subscribe(
      (res) => {
        console.log(res);
        
        this.lcargando.ctlSpinner(false);    
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "La caja ha sido reabierta con éxito. Por favor, vuelva a consultar.",
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        })
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error reabriendo Caja');
      }
    )
  }

  checkCaja(caja) {
    console.log(caja);
    this.verReportePorCaja(caja);
  }

  calcCajasDia() {
    this.cajasDia.forEach(c => {

      if(c.resumen.length>0){
        c.resumen.forEach(r => {
          if(r.forma_pago=="TARJETA"){
            Object.assign(c,{
              totalTC: r.total
            })
          } else if(r.forma_pago=="CHEQUE"){
            Object.assign(c,{
              totalCH: r.total
            })
          } else if(r.forma_pago=="TRANSFERENCIA"){
            Object.assign(c,{
              totalTR: r.total
            })
          } else if(r.forma_pago=="DEBITO"){
            Object.assign(c,{
              totalTD: r.total
            })
          } else if(r.forma_pago=="GARANTIA"){
            Object.assign(c,{
              totalGA: r.total
            })
          } else if(r.forma_pago=="FAVOR"){
            Object.assign(c,{
              totalVF: r.total
            })
          } else if(r.forma_pago=="NOTA"){
            Object.assign(c,{
              totalND: r.total
            })
          } else if(r.forma_pago=="DEPOSITO"){
            Object.assign(c,{
              totalDE: r.total
            })
          } else {
            Object.assign(c,{
              totalOtro: r.total
            })
          }
        })  
      } else {
        Object.assign(c,{
          totalCH: 0,
          totalTC: 0,
          totalTR: 0,
          totalTD: 0,
          totalGA: 0,
          totalVF: 0,
          totalND: 0,
          totalDE: 0,
          totalOtro: 0,
        })
      }
          

      this.total += +c.total_recaudacion;
      this.totalEF += +c.total_recaudacion_efectivo;
      this.totalCH += +c.totalCH;
      this.totalTC += +c.totalTC;
      this.totalTR += +c.totalTR;
      this.totalTD += +c.totalTD;
      this.totalGA += +c.totalGA;
      this.totalVF += +c.totalVF;
      this.totalND += +c.totalND;
      this.totalDE += +c.totalDE;
      this.totalOtro += +c.totalOtro;
       

      this.caja_dia.total_sobrante += +c.total_sobrante;
      this.caja_dia.total_faltante += +c.total_faltante;
    })

    this.porcTotal = 100;
    this.porcEF = this.totalEF * 100 / this.total;
    this.porcCH = this.totalCH * 100 / this.total;
    this.porcTC = this.totalTC * 100 / this.total;
    this.porcTR = this.totalTR * 100 / this.total;
    this.porcTD = this.totalTD * 100 / this.total;
    this.porcGA = this.totalGA * 100 / this.total;
    this.porcVF = this.totalVF * 100 / this.total;
    this.porcND = this.totalND * 100 / this.total;
    this.porcDE = this.totalDE * 100 / this.total;
    this.porcOtro = this.totalOtro * 100 / this.total;
    this.totalDepositar = this.total;
    this.getRecibosCadaCaja();
  }

   getRecibosCadaCaja() {
    let i = 0;
   

    this.allDetalles = [];
    this.allFormasPago = [];
    this.cajasDia.forEach((c) => {            

      let data = {
        id_caja: c.fk_caja,
        fecha: c.fecha
      }
      let superavit = 0;
      i++;
      this.apiSrv.getRecibosByDia(data).subscribe(
        (res) => {
          console.log(res);
         
          res['data'].forEach(e => {
            if (e.tipo_documento == 'EF') {
              this.allDetalles.push(
                { valor: e.total, abono: e.total, codigo_concepto: 'EF' }
              )
            }
            if (e.tipo_documento == 'GA') {
              this.allDetalles.push(
                { valor: e.total, abono: e.total, codigo_concepto: 'GA' }
              )
            }
            if (e.tipo_documento == 'COST') {
              this.allDetalles.push(
                { valor: e.total, abono: e.total, codigo_concepto: 'COST' }
              )
            }
            if(e.superavit>0){
              this.allDetalles.push(
                { valor:e.superavit, abono:e.superavit, codigo_concepto: 'SUPERAVIT' }
              )
            }
              e.detalles.forEach(d => {
                this.allDetalles.push(d);
              })
            
            
              console.log(e.formas_pago);
              console.log(e.detalles);
              
                //Object.assign(e, { valor: e.liquidacion.codigo_catastro.split('-')[1], codigo_concepto: e.liquidacion.codigo_catastro.split('-')[3] })
              
              //this.allDetalles.push();
            
            e.formas_pago.forEach(f => {
              this.allFormasPago.push(f);
              //if(e.detalles ==0){
                //this.allDetalles.push(f);
                //Object.assign(f, { total: f.valor, codigo:'EF', nombre:'ESPECIES FISCALES'})
              //}
              
            })
          })
          this.lcargando.ctlSpinner(false);
          console.log(this.allFormasPago);
          console.log(this.allDetalles);
          if(i==this.cajasDia.length){
            this.getTotalesConceptos();
          }
        },
        (err) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.error(err.error.message, 'Error cargando uno de los recibos');
        }
      )  
      
    })
    
  }

  agregaDepositos() {
    let depositar100 = this.totalDepositar * 100;
    let depositado100 = this.totalDeposito * 100;
    this.totalDepositar = depositar100 / 100;
    this.totalDeposito = depositado100 / 100;

    this.totalDeposito = Number(this.totalDeposito.toFixed(2))
    this.totalDepositar = Number(this.totalDepositar.toFixed(2))
    this.difDepositos = Number(this.difDepositos.toFixed(2))
    if(this.totalDepositar==this.totalDeposito){
      this.toastr.info('No puede agregar mas cuentas, los valores agregados cubren el valor total del pago')
    }else{
      let nuevo = {
        id_caja_general_deposito: 0,
        fk_caja_general: 0, // sera el id del documento que se cree primero la cabecera
       // fk_caja: this.cajaActiva.id_caja,
        nombre_banco: this.cuentaDepositar['name_banks'],
        cuenta_banco: this.cuentaDepositar['num_cuenta'],
        cuenta_contable: this.cuentaDepositar['cuenta_contable'],
        total: 0,
        estado: "A",
        comentario: "",
      }
  
      this.depositos.push(nuevo);
    }
    
    // if(!this.fromGeneral){
    //   this.vmButtons[0].habilitar = false;
    //   this.vmButtons[1].habilitar = true;
    // }
  }
  removeDeposito(d) {
    if (d.id_caja_general_deposito !== null ||d.id_caja_general_deposito !== 0  ) this.depositoDetallesIds.push(d.id_caja_general_deposito)
    //this.depositos.splice(index,1);
    this.depositos.splice(this.depositos.indexOf(d), 1)
    
    this.calcDepositoFinal();
  }

  // removeDetalleReglas(d) {
  //   if (d.id_regla_det !== null ||d.id_regla_det !== 0  ) this.reglasDetallesIds.push(d.id_regla_det)
  //   console.log(this.reglasDetallesIds)
  //   this.codigoDetalles.splice(this.codigoDetalles.indexOf(d), 1)
    
  // }

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
    if(this.difDepositos==0){
      this.depositoDisabled= true
    }else{
      this.depositoDisabled= false
    }
     this.lcargando.ctlSpinner(false);
  }


  getTotalesConceptos() {
    this.conceptosReportes = [];

    let conceptosCopy = JSON.parse(JSON.stringify(this.conceptosList));
    console.log(conceptosCopy);
    let totalConceptos100 = 0;
    console.log(this.allDetalles);
    conceptosCopy.forEach(c => {
      let total100: number = 0;
      
      this.allDetalles.forEach(d => {
        if(c.codigo == d.codigo_concepto){
          total100 += +d.abono * 100;
            Object.assign(c,{
              total: total100 / 100
            })
          
        }
         /* else if(c.codigo == 'EF'){
          Object.assign(c, { total: 5 })
           total100 += +d.abono * 100;
            Object.assign(c,{
              total: total100 / 100
            })
          
        } */
      })

    })

    console.log(conceptosCopy);
    
    this.conceptosReportes = conceptosCopy.filter(c => c.total>0);
    // this.conceptosReportes.push({codigo: 'SUPERAVIT', nombre: 'SUPERAVIT',total:this.superavit })
    console.log(this.conceptosReportes);




    // let totalConceptos100 = 0;
    this.conceptosReportes.forEach(e => {
      totalConceptos100 += e.total * 100;
    })
    if(+totalConceptos100 != 0){
      this.totalConceptos = +totalConceptos100 / 100;
    }
    console.log(this.conceptosReportes);
    this.lcargando.ctlSpinner(false);
  }

  /* verReportePorCaja(caja) {    
      const modalInvoice = this.modalSrv.open(CierreCajaComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
        scrollable: true,
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fTesCierreGeneral;
      modalInvoice.componentInstance.fTitle = 'Reporte de caja '+caja.nombre;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.caja = caja;
      modalInvoice.componentInstance.fromGeneral = true;
    
  } */

  verReportePorCaja(caja) {
    const modal = this.modalSrv.open(ModalReporteCajaComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.caja = caja.caja
    modal.componentInstance.fecha = this.fecha_consulta
  }


  mostrarReporte(){  
  
    window.open(environment.ReportingUrl +"rpt_cierreCajaGeneral"+".pdf?&j_username=" + environment.UserReporting 
    + "&j_password=" + environment.PasswordReporting+"&fecha=" + this.fecha_consulta+"&p_total="+this.totalConceptos * 100,'_blank')
      console.log( this.fecha_consulta);
      console.log(this.totalConceptos);
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
        // this.contribuyenteDisabled = false;
        this.restoreForm(false, false);
      }
    });
  }

  restoreForm(keepContr, keepArancel) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.fecha_consulta = moment().format('YYYY-MM-DD')

    this.iniciarData()

    this.depositos = []
    this.totalDepositar = 0
    this.totalDeposito = 0
    this.difDepositos = 0
  }

  async habilitarCierreGeneral() {
    const result = await Swal.fire({
      titleText: 'Habilitar Cierre General',
      text: 'Esta seguro/a desea habilitar el Cierre General para este dia? Esto eliminara los depositos que se hayan guardado.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Habilitar'
    })

    if (result.isConfirmed) {
      // Eliminar depositos del dia
      this.lcargando.ctlSpinner(true)
      this.msgSpinner = 'Eliminando deposito'
      try {
        const response = await this.apiSrv.eliminarDeposito({fecha: this.fecha_consulta})
        console.log(response)
        this.depositoDisabled = false
    
        // Recargar dia
        this.getCajasDia()
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.toastr
      }
    }

  }
  
}
