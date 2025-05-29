import { Component, OnInit, ViewChild } from '@angular/core';
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
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
standalone: false,
  selector: 'app-recibo-cobro',
  templateUrl: './recibo-cobro.component.html',
  styleUrls: ['./recibo-cobro.component.scss']
})
export class ReciboCobroComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Recibo de cobro";
  msgSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  formReadOnly = false;
  titulosDisabled = true;

  contribuyenteActive: any = {
    razon_social: ""
  };

  conceptosList: any = [];
  concepto: any = 0;

  totalCobro = 0;
  totalPago = 0;
  difCobroPago = 0;

  deudas: any = [];
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
  verifyRestore = false;

  formasDePago = [
    {
      nombre: "EFECTIVO",
      valor: "EF"
    },{
      nombre: "TARJETA",
      valor: "TA"
    },{
      nombre: "CHEQUE" ,
      valor: "CH"
    },{
      nombre: "TRANSFERENCIA" ,
      valor: "TR"
    },
  ];

  pagos: any = [];

  formaPago = 0;

  documento: any = {
    id_documento: null,
    tipo_documento: "", // concepto.codigo
    fk_contribuyente: null, // contr id
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: "",
    estado: "P",
    subtotal: 0,
    total: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
  }

  fallaCobro: boolean = false;

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: ReciboCobroService
    ) { 
      this.commonVrs.selectContribuyenteCustom.pipe(takeUntil(this.onDestroy$)).subscribe(
        (res) => {
          console.log(res);
          // this.cargarDatosModal(res);
          this.contribuyenteActive = res;
          this.titulosDisabled = false;
          this.vmButtons[3].habilitar = false;
        }
      );

      this.commonVrs.selectRecDocumento.asObservable().subscribe(
        (res) => {

          // this.formReadOnly = true;
          this.restoreForm();

          console.log(res);
          // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar
          this.contribuyenteActive = res.contribuyente;
          this.documento = res;
          this.documento.fecha = res.fecha.split(" ")[0];

          res.detalles.forEach(e => {
            let det = {
              tipo_documento: e.codigo_concepto ?? "NaN",
              numero_documento: e.fk_numero_documento,
              concepto: {nombre: e.concepto ? e.concepto.nombre : "NaN"},
              comentario: e.comentario,
              valor: e.valor,
              saldo: e.saldo_anterior,
              cobro: e.abono,
              nuevo_saldo: e.saldo_actual
            }

            this.deudas.push(det);
          })

          res.formas_pago.forEach(e => {
            this.pagos.push(e);
          });

          this.totalCobro = res.total;
          this.totalPago = res.total;

          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;        
          this.vmButtons[3].habilitar = false;
        }
      )
    }

    ngOnDestroy() {
      this.onDestroy$.next();
      this.onDestroy$.complete();
    }

  ngOnInit(): void {
    
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
      }
    ]


    setTimeout(() => {
      this.validaPermisos();
    }, 0);
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " GUARDAR":
        this.createLiquidacion();
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
          this.getConceptos();
        }
      },
      err => {
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
          this.conceptosList.push({...concepto})
        })


        this.conceptosList = this.conceptosList.filter(c => (c.codigo!="BA" && c.codigo!="AN" && c.codigo!="EX"));

        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Contribuyentes')
      }
    )
  }

  restar(deuda) {
    deuda.nuevo_saldo = +deuda.saldo - +deuda.cobro;
    this.calcCobroTotal();
  }

  calcCobroTotal() {
    let cobroTotal = 0;
    this.deudas.forEach(e => {
      // if (e.aplica) {
        cobroTotal += +e.cobro; // en este caso es total porque sale de valor unitario * cantidad
      // }
    });
    this.totalCobro = cobroTotal;
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
  }

  calcPagoTotal() {
    let pagoTotal = 0;
    this.pagos.forEach(e => {
      // if (e.aplica) {
        pagoTotal += +e.valor; // en este caso es total porque sale de valor unitario * cantidad
      // }
    });
    this.totalPago = pagoTotal;
    this.calcDifCobroPago();
  }

  calcDifCobroPago() {
    this.difCobroPago = +this.totalCobro - +this.totalPago;
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

  agregaPagos() {
    let nuevo = {
      id_documento_forma_pago: 0,
      fk_documento: 0, // sera el id del documento que se cree primero la cabecera
      tipo_pago: this.formaPago,
      numero_documento: "",
      valor: 0,
      comentario: "",
    }

    this.pagos.push(nuevo);
    this.vmButtons[0].habilitar=false;
  }

  checkDeudas() {
    for(let i=0;i<this.deudas.length;i++) {
      if (
        this.deudas[i].nuevo_saldo<0
      ) {
        return true;         
      } 
      return false;
    }
  }

  createLiquidacion() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Liquidaciones.", this.fTitle);
    } else {
      if(this.documento.observacion==""||this.documento.observacion==undefined){
        this.toastr.info("Debe ingresar una observación para la liquidación")
        return;
      } else if(
        this.deudas.length<=0||!this.deudas.length
      ) {
        this.toastr.info("Debe ingresar detalles para la liquidación")
        return;
      } else if(
        this.pagos.length<=0||!this.pagos.length
      ) {
        this.toastr.info("Debe ingresar formas de pago")
        return;
      } else if(
        this.checkDeudas()
      ) {
        this.toastr.info("El valor a pagar no puede ser mayor al saldo actual")
        return;
      } else if(
        this.difCobroPago!=0
      ) {
        this.toastr.info("Debe pagar el monto completo, no más ni menos")
        return;
      }

      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Está a punto de realizar un pago ¿Desea continuar?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.msgSpinner = 'Generando Documento de pago...';
          this.lcargando.ctlSpinner(true);
          this.documento.estado = "E";
          this.documento.tipo_documento = this.concepto.codigo;
          this.documento.fk_contribuyente = this.contribuyenteActive.id_cliente;
          this.documento.subtotal = this.totalCobro;
          this.documento.total = this.totalCobro;
          this.documento.detalles = [];
          console.log(this.deudas);
          console.log(this.pagos);
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
              }
              this.documento.detalles.push(doc_det);
            }
          });

          this.pagos.forEach(e => {
            if(e.valor > 0){
              this.documento.formas_pago.push(e);
            }
          })

          let data = {
            documento: this.documento
          }
          console.log(this.documento);
          // servicio que crea el documento, sus detalles, sus formas de pago asociadas
          // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
          this.apiSrv.setRecDocumento(data).subscribe(
            (res) => {
              console.log(res);
              Swal.fire({
                icon: "success",
                title: "Documento de pago generado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
              this.documento = res['data'];
              this.formReadOnly = true;
              this.vmButtons[0].habilitar = true;
              this.vmButtons[2].habilitar = false;
              this.vmButtons[3].habilitar = false;
              console.log(this.documento);
              // this.guardarDeuda(res['data'].id_liquidacion);
              this.lcargando.ctlSpinner(false);
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error al generar el documento de pago",
                text: error.error.message,
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          );
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
    this.titulosDisabled = true;

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

    this.documento = {
      id_documento: null,
      tipo_documento: "", // concepto.codigo
      fk_contribuyente: null, // contr id
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      observacion: "",
      estado: "P",
      subtotal: 0,
      total: 0,
      detalles: [], // deudas
      formas_pago: [], // pagos
    }

    this.fallaCobro = false;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;

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
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    } else {
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
      modalInvoice.componentInstance.codigo = this.concepto.codigo;
      modalInvoice.componentInstance.fk_contribuyente = this.contribuyenteActive.id_cliente;
      modalInvoice.componentInstance.deudas = this.deudas;
    }
  }

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListRecDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  expandListContribuyentes() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 8;
    }
  }

}
