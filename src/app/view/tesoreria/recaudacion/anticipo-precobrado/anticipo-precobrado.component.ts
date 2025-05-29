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
import { AnticipoPrecobradoService } from './anticipo-precobrado.service';
import { ContratoService } from 'src/app/view/rentas/mercados/contrato/contrato.service';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { MovimientosBancariosComponent } from '../../pagos/activos-financieros/movimientos-bancarios/movimientos-bancarios.component'; 
import { TitulosService } from 'src/app/view/rentas/mercados/titulos/titulos.service';


@Component({
standalone: false,
  selector: 'app-anticipo-precobrado',
  templateUrl: './anticipo-precobrado.component.html',
  styleUrls: ['./anticipo-precobrado.component.scss']
})
export class AnticipoPrecobradoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild("print") print!: ElementRef;
  fTitle = "Anticipo Precobrado, depósito bancario";
  msgSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  formReadOnly = false;
  ordenDisabled = true;
  titulosDisabled = false;
  habilitar: boolean = true;
  deshabilitarCont: boolean = false;
  deshabilitarMultCobros: boolean = false;
  multCobros: boolean = false;

  contribuyenteActive: any = {
    razon_social: ""
  };

  movimiento: any = [];

  mercados = []
  puestos = []
  puestos_filter: any[] = []

  ordenActive: any = {
    numero_orden: "",
    fk_local: {
      id_local: 0,
      razon_social: "",
      contrato: "",
      fk_sector: {
        id_catalogo: 0,
        tipo: "",
        valor: "",
        descripcion: ""
      },
      fk_actividad_comercial: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
      fk_grupo: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
    },
  }

  conceptosBackup: any = [];
  conceptosList: any = [];
  concepto: any = 0;

  totalCobro = 0;
  totalPago = 0;
  difCobroPago = 0;

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
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: "",
    estado: "P",
    subtotal: 0,
    total: 0,
    superavit: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
    fk_caja: 0, // caja activa al momento de cobrar
    mercado: 0,
    puesto: 0,
    multiples_cobros: 'N'
  }

  cajaActiva: any = {
    id_caja: 0,
    nombre: "",
  }

  activo: boolean = false;
  superavit: boolean = false;


  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: AnticipoPrecobradoService,
    private contSvr:ContratoService,
    private cierremesService: CierreMesService
    ) { 
      this.commonVrs.selectContribuyenteCustom.asObservable().subscribe(
        (res) => {
          console.log('Aqui '+res);
          // this.cargarDatosModal(res);
          this.contribuyenteActive = res;
          this.ordenDisabled = false;
          this.titulosDisabled = false;
          this.deshabilitarMultCobros = true;
          // this.getLiquidaciones();
          this.vmButtons[0].habilitar=true;
        }
      );

      this.commonVrs.selectInspeccionRentas.asObservable().subscribe(
        (res: any) => {
          console.log(res);
          this.ordenActive = res;
          this.titulosDisabled = false;
          this.vmButtons[0].habilitar = false;
          this.vmButtons[4].habilitar = false;
        }
      );

      this.commonVrs.selectRecDocumento.asObservable().subscribe(
        (res) => {

          // this.formReadOnly = true;
          this.restoreForm();
          

          console.log(res);
          // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar
          this.habilitar=false;
          
          if(res.detalles != null){
            this.movimiento = res.detalles
          }
          
          if(res.contribuyente){
            this.contribuyenteActive = res.contribuyente;
            this.deshabilitarCont = true;
            this.deshabilitarMultCobros = true;
            this.vmButtons[1].habilitar = true;
          }else{
            this.vmButtons[1].habilitar = false;
            this.deshabilitarMultCobros = false;
          }
          this.documento = res;
          if(res.multiples_cobros == 'S'){
            this.multCobros = true;
            
          }else{
            this.multCobros = false;
          }
          this.documento.fecha = res.fecha.split(" ")[0];
          this.documento.mercado =  this.mercados.find(m => m.id == res.fk_mercado);
          
          
          /* let data = {
            mercado: this.mercados.find(m => m.id == res.fk_mercado)
          } */
          
          this.msgSpinner = 'Cargando Puestos de Mercado'
          this.puestos_filter = this.puestos.filter(e => e.fk_mercado == res.fk_mercado)
       
          this.documento.puesto = res.fk_mercado_puesto;

          if (res.fk_documento_2 && res.fk_documento_2 != 0) {
            this.msgSpinner = 'Cargando datos de la Garantía...';
            this.lcargando.ctlSpinner(true);
            let data = {
              inspeccion: res.fk_documento_2
            }
            this.apiSrv.getInspeccion(data).subscribe(
              (res) => {
                console.log(res);
                this.lcargando.ctlSpinner(false);
                this.ordenActive = res['data'];
              }
            );
          }
          res.formas_pago.forEach(e => {
            this.pagos.push(e);
          });
          
          this.totalCobro = res.total;
          this.totalPago = +res.total + +res.superavit;
          this.difCobroPago = 0 - +res.superavit;

          this.formReadOnly = true;
          this.vmButtons[0].habilitar = true;
          
          this.vmButtons[2].habilitar = false;        
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;
        }
      )

      this.commonVrs.needRefresh.asObservable().subscribe(
        (res) => {
          if(res){
            this.calcCobroTotal();
          }
        }
      );
      this.commonVrs.modalMovimientosBancarisoAF.asObservable().subscribe(
        (res)=>{
          console.log(res)
          this.movimiento = []
          res['id_documento_detalle'] = 0;
          res['num_cuenta'] =Number(res['num_cuenta']);
          this.totalCobro = res['valor']
          this.movimiento.push(res);
        }
      );
    }

  ngOnInit(): void {

    this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'));

    console.log(this.cajaActiva);

    this.formaPago = 0;
    this.entidad = 0;
    this.emisor = 0;
    
    this.vmButtons = [
      {
        orig: "btnsNotaCredito",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsNotaCredito",
        paramAccion: "",
        boton: { icon: "fas fa-edit", texto: " MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsNotaCredito",
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
        orig: "btnsNotaCredito",
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
        orig: "btnsNotaCredito",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }
    ]


   // if(!this.cajaActiva){
      // Swal.fire({
      //   icon: "warning",
      //   title: "No puede continuar",
      //   text: "Debe tener una caja activa para poder realizar cobros.",
      //   showCloseButton: false,
      //   showConfirmButton: true,
      //   showCancelButton: false,
      //   confirmButtonText: "Aceptar",
      //   confirmButtonColor: '#20A8D8',
      // });
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
      case " MODIFICAR":
        this.updateRecDocumento();
        break;
      case " BUSCAR":
        this.expandListDocumentosRec();
        break;
      case " IMPRIMIR":
        
        break;
      case " LIMPIAR":
        this.confirmRestore();
        break;
      default:
        break;
    }
  }

  triggerPrint(): void {   
    this.print.nativeElement.click();
  }
  multCobroCheck(event){
    if (event) {
      this.documento.multiples_cobros= 'S';
      this.deshabilitarCont = true;
    } else {
 
      this.documento.multiples_cobros= 'N';
      this.deshabilitarCont = false;
    }
    console.log(this.documento.multiples_cobros)
  }

  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fRenPredUrbanoEmision,
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
          // this.getCajaActiva();
         // this.getCatalogos();
         // this.getMercados();
         // this.getPuestos();
          // this.getConceptos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  getMercados() {
    let data = {
      params: "'REN_MERCADO'"
    }
    this.msgSpinner = 'Cargando datos de Mercados'
    this.lcargando.ctlSpinner(true)
    this.contSvr.getMercados(data).subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Mercados para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data']['REN_MERCADO'].forEach(m => {
          let mercado = {
            id: m.id_catalogo,
            nombre: m.valor
          }
          this.mercados.push({ ...mercado })
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Mercados')
      }
    )
  }

  tipoSelected(event: any) {
    console.log(event)
  }

  getPuestos() {
    let data = {
      mercado: this.documento.mercado
    }
    this.documento.puesto=0; // cada que se cambia el mercado debe reiniciarse el puesto
    this.msgSpinner = 'Cargando Puestos de Mercado'
    this.lcargando.ctlSpinner(true)
    this.puestos = []
    this.apiSrv.getPuestos().subscribe(
      (res: any) => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Puestos para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        this.puestos = res.data
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Puestos de Mercado')
      }
    )
    /* this.contSvr.getPuestos(data).subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Mercados para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(p => {
          let puesto = {
            id: p.id_mercado_puesto,
            numero: p.numero_puesto,
            descripcion: p.descripcion,
            estado: p.estado
          }
          this.puestos.push({ ...puesto })
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Puestos de Mercado')
      }
    ) */
  }

  getCatalogos() {
    this.msgSpinner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REC_FORMA_PAGO','REC_FORMA_PAGO_ENTIDAD','REC_FORMA_PAGO_EMISOR',''",
    }

    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log(res);

        res['data']['REC_FORMA_PAGO'].forEach(e => {
          if(e.valor!='GARANTIA' && e.valor!='FAVOR'){
            let f_pago = {
              nombre: e.descripcion,
              valor: e.valor,
              grupo: e.grupo
            }
            this.formasDePago.push(f_pago);
          }
          
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
        this.lcargando.ctlSpinner(false);               
        // this.getConceptos();
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }


  // no se usa ya que la sesion ahora maneja toda la caja activa, no solo el id
  getCajaActiva() {
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
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  verificarCaja() {
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



  restar(deuda) {
    deuda.nuevo_saldo = +deuda.saldo - +deuda.cobro;
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
    }
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

  removeTitulo(index) {

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
    if (tipo=="CHEQUE" || tipo=="TRANSFERENCIA"){
      return tipo.substring(0,2)+' - '+ this.entidad.valor;
    } else 
    if (tipo=="TARJETA" || tipo=="DEBITO") {
      return (tipo=="TARJETA"?'T/C':'T/D')+' - '+this.emisor.valor;
    }
    return this.formaPago.nombre;
  }

  detBanco() :string {
    let tipo = this.formaPago.valor;
    if (tipo=="CHEQUE" || tipo=="TRANSFERENCIA"){
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
    if ( (tipo=="CHEQUE" || tipo=="TRANSFERENCIA") && this.entidad==0){
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
      estado: 'E',
    }

    this.pagos.push(nuevo);
    this.vmButtons[0].habilitar=false;
  }

  handlePago(event) {
    this.entidad = 0;
    this.emisor = 0;
    this.entidadesFiltrada = this.entidades.filter(e => e.grupo == event.valor);
    this.entidadDisabled = false;

    if(event.valor != "TARJETA" && event.valor != "DEBITO" && event.valor != "CHEQUE" && event.valor != "TRANSFERENCIA"){
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
      pago.cambio = dif100 / 100;
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
    for(let i=0;i<this.pagos.length;i++) {
      if (
        this.pagos[i].tipo_pago=='EFECTIVO' && (this.pagos[i].cambio<0)
      ) {        
        return true;         
      } 
    }
    return false;
  }

  createRecDocumento() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para emitir Anticipos.", this.fTitle);
    }else if(this.totalCobro <=0 || this.totalCobro == undefined){
      this.toastr.warning("Debe ingresar un monto.", this.fTitle);
    }else if(this.documento.observacion == "" ||this.documento.observacion == undefined){
      this.toastr.warning("Debe ingresar una Observación.");
    } 
    else {

      if (+this.difCobroPago<0){
        let dif100 = +this.difCobroPago * 100;
        let super100 = +dif100 - (2 * +dif100); // volver un numero positivo es restarle su doble
        let superavit = +super100 / 100;
        console.log(superavit);
        this.documento.superavit = +superavit.toFixed(2);
        this.superavit = true;
      } else {        
        this.documento.superavit = 0;
        this.superavit = false;
      }

      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text:'¿Está a punto de emitir un Anticipo Precobrado desea continuar?' ,
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
                this.msgSpinner = 'Generando Anticipo Precobrado...';
                this.lcargando.ctlSpinner(true);
                this.documento.estado = "E";
                this.documento.tipo_documento = this.concepto.codigo;
                //this.documento.fk_contribuyente = this.contribuyenteActive.id_cliente;
                //this.documento.fk_documento_2 = this.ordenActive.id_inspeccion_orden;
                this.documento.subtotal = this.totalCobro;
                this.documento.total = this.totalCobro;
                this.documento.detalles = [];
                //this.documento.fk_caja = this.cajaActiva.id_caja;   
                
                this.documento.formas_pago = [];
                this.pagos.forEach(e => {
                  if(e.valor > 0){
                    this.documento.formas_pago.push(e);
                  }
                });
                if(this.multCobros){
                  this.documento.multiples_cobros = 'S'
                } else{
                  this.documento.multiples_cobros = 'N'
                }
      
                let data2 = {
                  documento: this.documento,
                  movimiento: this.movimiento
                }
                console.log(this.documento);     
                // servicio que crea el documento, sus detalles, sus formas de pago asociadas
                // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
              console.log(data2)
                this.apiSrv.setAnticipoPrecobrado(data2).subscribe(
                  (res) => {
                    console.log(res);
                    
                    this.documento = res['data'];
                    this.formReadOnly = true;
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[2].habilitar = false;
                    this.vmButtons[3].habilitar = false;
                    this.vmButtons[4].habilitar = false;
                    console.log(this.documento);
                    // this.guardarDeuda(res['data'].id_liquidacion);
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "success",
                      title: "Anticipo Precobrado",
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
                      title: "Error al generar el Anticipo Precobrado",
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

  updateRecDocumento(){
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para emitir Anticipos.", this.fTitle);
    }
    // else if(this.contribuyenteActive.razon_social == "" ||this.contribuyenteActive.razon_social == undefined){
    //   this.toastr.warning("Debe seleccionar un contribuyente.");
    // }
    else {

      if (+this.difCobroPago<0){
        let dif100 = +this.difCobroPago * 100;
        let super100 = +dif100 - (2 * +dif100); // volver un numero positivo es restarle su doble
        let superavit = +super100 / 100;
        console.log(superavit);
        this.documento.superavit = +superavit.toFixed(2);
        this.superavit = true;
      } else {        
        this.documento.superavit = 0;
        this.superavit = false;
      }

      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text:'¿Está a punto de modificar un anticipo precobrado desea continuar?' ,
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

              this.msgSpinner = 'Modificando Anticipo Precobrado...';
              this.lcargando.ctlSpinner(true);
              this.documento.estado = "E";
              this.documento.tipo_documento = this.concepto.codigo;
              this.documento.fk_contribuyente = this.contribuyenteActive.id_cliente;
              //this.documento.fk_documento_2 = this.ordenActive.id_inspeccion_orden;
              this.documento.subtotal = this.totalCobro;
              this.documento.total = this.totalCobro;
              this.documento.detalles = [];
              //this.documento.fk_caja = this.cajaActiva.id_caja;   
              
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
              this.apiSrv.updateAnticipoPrecobrado(data2).subscribe(
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
                    title: "Anticipo Precobrado",
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
                    title: "Error al modificar el Anticipo Precobrado",
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
    this.titulosDisabled = false;
    this.ordenDisabled = true;
    this.habilitar=true;

    this.contribuyenteActive = {
      razon_social: ""
    };

    this.ordenActive = {
      numero_orden: "",
      fk_local: {
        id_local: 0,
        razon_social: "",
        contrato: "",
        fk_sector: {
          id_catalogo: 0,
          tipo: "",
          valor: "",
          descripcion: ""
        },
        fk_actividad_comercial: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
        },
        fk_grupo: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
        },
      },
    }

    // this.conceptosList = [];
    this.concepto = 0;

    this.totalCobro = 0;
    this.totalPago = 0;
    this.difCobroPago = 0;

    this.deudas = [];
    this.fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
    this.verifyRestore = false;

    this.pagos = [];
    this.movimiento = []

    this.formaPago = 0;
    this.entidad = 0;
    this.emisor = 0;
    this.multCobros = false
    this.deshabilitarMultCobros = false;

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

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;

  }
  removeActivosFinancieros(index){
    this.movimiento.splice(index,1);
  }

  handleConcepto() {
    this.titulosDisabled = false;
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
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      // modalInvoice.componentInstance.id_concepto = this.concepto.id;
      modalInvoice.componentInstance.listaConceptos = this.conceptosList;
      // modalInvoice.componentInstance.codigo = this.concepto.codigo;
      // modalInvoice.componentInstance.codigo = this.verConvenios?'CUO':'CO';
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

  expandListContribuyentes() {

    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    // } else {
      const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 8;
    // }
  }

  expandirModalMovimiento(){
    const modal = this.modalService.open(MovimientosBancariosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
  }

 
}
