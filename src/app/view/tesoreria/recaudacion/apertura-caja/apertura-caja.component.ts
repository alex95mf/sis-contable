import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { AperturaCajaService } from './apertura-caja.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';

@Component({
standalone: false,
  selector: 'app-apertura-caja',
  templateUrl: './apertura-caja.component.html',
  styleUrls: ['./apertura-caja.component.scss']
})
export class AperturaCajaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = "Apertura de caja";
  mensajeSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');

  sumaEfectivoInicio: number = 0;
  formReadOnly: boolean = false;
  encerado: boolean = false;

  cajasList: any = [];

  caja_dia = {
    id_caja_dia: 0,
    fk_caja: 0, // caja asociada (usuario incluido)
    fecha: moment(new Date()).format('YYYY-MM-DD'), // fecha del dia para que coincida con las recaudaciones detalles para ver titulos y formas de pago para ver metodos
    total_efectivo_inicio: 0, // cash inicial 200
    total_recaudacion: 0, // recaudacion total con tarjetas, cheques, etc 3000 (500 efectivo)
    total_recaudacion_efectivo: 0, // recaudacion (solo efectivo) 500 
    total_efectivo_cierre_final: 0, // cash final computo (recaudacion_efectivo + efectivo_inicio) 500+200 = 700
    total_efectivo_fisico: 0, // cash real final debe coincidir con cierre final sino hay sobrante/faltante s:720, n:680
    total_sobrante: 0, // cuando el cash real final es mayor al computo efectivo cierre final s:20
    total_faltante: 0, // cuando el cash real final es menor al computo efectivo cierre final n:20
    estado: "", // A (Abierto) C (Cerrado)
    monedas: [], // detalles tipo moneda
    billetes: [], // detalles tipo billete
  }

  // estructura para detalle
  caja_dia_detalle = {
    id_caja_dia_detalle: 0,
    id_caja_dia: 0, //fk para obtener datos generales
    id_caja: 0, //fk para obtener datos de la caja y su usuario
    tipo_detalle: 0, // I para inicio, C para cierre
    tipo_denominacion: 0, // M para monedas, B para billetes
    denominacion: 0, // de cuanto es la moneda o billete
    cantidad: 0, // cuantos de cada denominacion
    total_denominacion: 0, // denominacion * cantidad
    estado: ""
  }

  monedas: any = [];
  billetes: any = [];

  monedasCat: any = [];
  billetesCat: any =[];

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVSrv: CommonVarService,
    private apiSrv: AperturaCajaService,
    private cierremesService: CierreMesService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.iniciarData();

    this.vmButtons = [
      {
        orig: "btnsRecAbreCaja",
        paramAccion: "",
        boton: { icon: "far fa-check", texto: "VERIFICAR CAJA" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRecAbreCaja",
        paramAccion: "",
        boton: { icon: "far fa-sunrise", texto: "ABRIR CAJA" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
    ]

    setTimeout(() => {
      this.validaPermisos();
    }, 0);

  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "VERIFICAR CAJA":
        this.verificarCaja();
        break;
      case "ABRIR CAJA":
        this.validaCaja();
        break;
      // case " BUSCAR":
      //   this.revisarConcepto();
      //   break;
      // case " IMPRIMIR":
        
      //   break;
      // case " LIMPIAR":
      //   this.confirmRestore();
      //   break;
      default:
        break;
    }
  }

  iniciarData() {

    this.sumaEfectivoInicio = 0;

    this.caja_dia = {
      id_caja_dia: 0,
      fk_caja: 0, // caja asociada (usuario incluido)
      fecha: this.caja_dia.fecha, // fecha del dia para que coincida con las recaudaciones detalles para ver titulos y formas de pago para ver metodos
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
    }


    // reinicia los arrays a como estan cargados de catalogos

    this.monedas = JSON.parse(JSON.stringify(this.monedasCat));  
    this.billetes = JSON.parse(JSON.stringify(this.billetesCat));

  }

  validaPermisos() {
    this.mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fTesAperturaCaja,
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

    this.mensajeSpinner = 'Cargando Catalogos...';
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
        this.lcargando.ctlSpinner(false);        
        this.getCajasData();
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )

  }

  getCajasData() {
    this.mensajeSpinner = 'Cargando Cajas del sistema...';
    this.lcargando.ctlSpinner(true);

    let data = {
      id_usuario: this.dataUser.id_usuario
    }

    this.apiSrv.getCajasByUser(data).subscribe(
      (res) => {
        console.log(res);
        this.cajasList = res['data'];
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )

  }

  verificarCaja() {
    // funcion para revisar si la caja seleccionada ya ha sido abierta ese dia

    this.mensajeSpinner = 'Verificando si la caja ya ha sido abierta...';
    this.lcargando.ctlSpinner(true);

    let data = {
      id_caja: this.caja_dia.fk_caja,
      fecha: this.caja_dia.fecha,
    }

    console.log(data);

    this.apiSrv.getCajaDiaByCaja(data).subscribe(
      (res) => {
        console.log(res);
        this.assignData(res['data'], this.caja_dia.fk_caja);
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )

  }

  assignData(data, id_caja) {

    this.iniciarData();
    this.caja_dia.fk_caja = id_caja; // el id_caja seleccionada no se puede perder
    if (data.length==0) {
      // esa caja no ha sido abierta aun, se puede iniciar
      this.vmButtons[1].habilitar = false;
      this.formReadOnly = false;

      localStorage.removeItem('activeCaja');
    } else {
      // esa caja ya ha sido abierta, no se puede iniciar ni editar
      this.vmButtons[1].habilitar = true;
      this.formReadOnly = true;

      this.setCajaActiva(id_caja);

      this.sumaEfectivoInicio = data.total_efectivo_inicio;
      this.caja_dia = data;

      // this.monedas = [];
      // this.billetes = [];

      data.detalles.forEach(e => {
        if(e.tipo_denominacion=="M"){

          this.monedas.forEach(m => {
            if(+m.denominacion == +e.denominacion){
              Object.assign(m,{
                cantidad: e.cantidad,
                total_denominacion: e.total_denominacion,
              })
            }
          })

          // let m = {
          //   denominacion: e.denominacion,
          //   cantidad: e.cantidad,
          //   total_denominacion: e.total_denominacion,
          // }
          // this.monedas.push(m);
        }else if(e.tipo_denominacion=="B"){

          this.billetes.forEach(b => {
            if(+b.denominacion == +e.denominacion){
              Object.assign(b,{
                cantidad: e.cantidad,
                total_denominacion: e.total_denominacion,
              })
            }
          })

          // let b = {
          //   denominacion: e.denominacion,
          //   cantidad: e.cantidad,
          //   total_denominacion: e.total_denominacion,
          // }
          // this.billetes.push(b);
        }
      })

    }
  }

  setCajaActiva(id) {
    this.mensajeSpinner = 'Obteniendo Caja Activa...';

    // funcion necesario solo porque en la sesion se maneja solo el id no toda la info de la caja activa

    this.apiSrv.getCajaActiva(id).subscribe(
      (res) => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
        // return;

        let caja = res['data'];
        Object.assign(caja, {fecha: moment(this.caja_dia.fecha).format('YYYY-MM-DD')})
        localStorage.setItem('activeCaja', JSON.stringify(caja));
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Caja Activa')
      }
    )

  }

  async validaCaja() {
    if(this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para abrir esta Caja");
    } else {
        let resp = await this.validaDataGlobal().then((respuesta) => {
          if(respuesta) {
            this.abrirConCero(this.encerado);
          }
        });  
    }
  }

  validaDataGlobal() {
    if(
      this.caja_dia.total_efectivo_inicio == 0
    ) {
      this.encerado = true;
    } else if(
      this.caja_dia.total_efectivo_inicio > 0
    ) {
      this.encerado = false;
    }
    let flag = false;
    return new Promise((resolve, reject) => {
      if(
        this.caja_dia.total_efectivo_inicio < 0 ||
        this.caja_dia.total_efectivo_inicio == undefined
      ) {
        this.toastr.info("Debe ingresar el valor del efectivo con el que inicia el día");
        flag = true;
      } else if(
        this.caja_dia.total_efectivo_inicio != this.sumaEfectivoInicio 
      ) {
        this.toastr.info("La suma debe coincidir con el valor que se ingresó al inicio "+this.caja_dia.total_efectivo_inicio);
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
      !flag ? resolve(true) : resolve(false);
    })
  }

  abrirConCero(val: boolean) {
    if(val){
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: 'Está a punto de iniciar una caja con efectivo inicial en 0, ¿desea continuar?',
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
      }).then( (res) => {
        if (res.isConfirmed){
          this.mensajeSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let dat = {
            "anio": Number(moment(this.caja_dia.fecha).format('YYYY')),
            "mes": Number(moment(this.caja_dia.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(res => {
            
            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.abrirCajaDia();
              this.lcargando.ctlSpinner(false);
             
            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }
        
            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })
          
        }
      })
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea abrir esta caja?",
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
      }).then((result)=> {
        if (result.isConfirmed) {
          this.mensajeSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let dat = {
            "anio": Number(moment(this.caja_dia.fecha).format('YYYY')),
            "mes": Number(moment(this.caja_dia.fecha).format('MM')),
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(res => {
            
            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.abrirCajaDia();
              this.lcargando.ctlSpinner(false);
             
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

  abrirCajaDia() {













    this.mensajeSpinner = 'Iniciando caja...';
    this.lcargando.ctlSpinner(true);
    
    // LLENA ARRAY MONEDAS DE CAJA_DIA
    this.caja_dia.monedas = [];
    this.monedas.forEach(e => {
      // if(e.cantidad>0){ // solo si tiene de esa denominacion se agrega
        let m = {
          tipo_detalle: "I",
          tipo_denominacion: "M",
          denominacion: e.denominacion,
          cantidad: e.cantidad,
          total_denominacion: e.total_denominacion,  
        }
        this.caja_dia.monedas.push(m);
      // }      
    })

    // LLENA ARRAY BILLETES DE CAJA_DIA
    this.caja_dia.billetes = [];
    this.billetes.forEach(e => {
      // if(e.cantidad>0){ // solo si tiene de esa denominacion se agrega
        let b = {
          tipo_detalle: "I",
          tipo_denominacion: "B",
          denominacion: e.denominacion,
          cantidad: e.cantidad,
          total_denominacion: e.total_denominacion,  
        }
        this.caja_dia.billetes.push(b);
      // }
    })

    let data = {
      caja: this.caja_dia,
    }

    console.log(data);

    this.apiSrv.abrirCaja(data).subscribe(
      (res) => {
        console.log(res);
        if (res["status"] == 1) {
        this.lcargando.ctlSpinner(false);        
        this.caja_dia.estado = "A"; // Estado A de caja Abierta
        this.formReadOnly = true;

        // se guarda la caja en la sesion (LocalStorage)
        this.setCajaActiva(this.caja_dia.fk_caja);

        Swal.fire({
            icon: "success",
            title: "Caja Abierta",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
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

    d.total_denominacion = +d.denominacion * +d.cantidad;

    this.calcSumaEfectivo();

  }

  calcSumaEfectivo() {
    let totalMonedas = 0;
    this.monedas.forEach(e => {
      totalMonedas += +e.total_denominacion
    })
    let totalBilletes = 0;
    this.billetes.forEach(e => {
      totalBilletes += +e.total_denominacion
    })
    this.sumaEfectivoInicio = +totalMonedas + +totalBilletes;
  }

}
