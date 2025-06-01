import { Component, OnInit, ViewChild, ElementRef, OnDestroy  } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConvenioService } from './convenio.service';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { environment } from 'src/environments/environment';
import { id } from '@swimlane/ngx-charts';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { SweetAlertResult } from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
standalone: false,
  selector: 'app-convenio',
  templateUrl: './convenio.component.html',
  styleUrls: ['./convenio.component.scss']
})
export class ConvenioComponent implements OnInit, OnDestroy  {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild("print") print!: ElementRef;
  fTitle = "Gestión de convenios";
  msgSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  fileList: FileList;
  fileList2: FileList;
  fileList3: FileList;
  formReadOnly = false;
  titulosDisabled = true;
  deudaDisabled = true;
  garanteDisabled = true;
  cuotasDisabled = true;
  masterSelected: boolean = false
  contribuyenteActive: any = {
    razon_social: ""
  };

  contribuyenteCActive: any = {
    razon_social: ""
  };

  conceptosList: any = [];
  concepto: any = 0;

  totalCobro = 0;
  totalInteres = 0;
  totalPago = 0;
  difCobroPago = 0;
  docId: any;

  deudas: any = [];
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
  verifyRestore = false;

  formasDePago = [
    {
      nombre: "EFECTIVO",
      valor: "EF"
    },{
      nombre: "TARJETA",
      valor: "TC"
    },{
      nombre: "CHEQUE" ,
      valor: "CH"
    },{
      nombre: "TRANSFERENCIA" ,
      valor: "TR"
    },{
      nombre: "DEBITO" ,
      valor: "TD"
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
    cuota_inicial: 0,
    porcentaje: 0,
    num_cuotas: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
    cuotas: [], // cuotas que se guardaran como detalles con liq y deudas
    fk_caja: 0, // caja activa al momento de cobrar
    fk_contribuyente_2: null,
    observacion_pdf_1:"",
    observacion_pdf_2:"",
    garante:"",
  }

  newDocument: any = {
    id_documento: null,
    tipo_documento: "", // concepto.codigo
    fk_contribuyente: null, // contr id
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: "",
    estado: "P",
    subtotal: 0,
    total: 0,
    cuota_inicial: 0,
    porcentaje: 0,
    num_cuotas: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
    cuotas: [], // cuotas que se guardaran como detalles con liq y deudas
    fk_caja: 0, // caja activa al momento de cobrar
    fk_contribuyente_2: null,
    observacion_pdf_1:"",
    observacion_pdf_2:"",
    garante:"",
  }

  cajaActiva: any = {
    id_caja: 0,
    nombre: "",
  }

  amortizacion: any = {
    cuota_inicial: 0,
    num_cuotas: 0,
    interes: 0,
    monto_amortizar: 0,
  }

  amortizaciones: any = [];

  totalIntereses = 0;
  totalPagoMensual = 0;
  totalPagoTotal = 0;
  totalValorPagado = 0;
  monto20 = 0;
  total20 = 0;
  variable: boolean = false

  detallesNon: any = [];
  detallesHorizontal: string

  estado = [
    {valor: 'A', descripcion: 'Aprobado'},
    {valor: 'X', descripcion: 'Cancelado'},
    {valor: 'E', descripcion: 'Emitido'},
  ]


  aprobacionValidacion: boolean = false;

  destroy = new Subject<any>();


  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: ConvenioService
    ) {
      this.commonVrs.selectContribuyenteCustom.asObservable().pipe(takeUntil(this.destroy)).subscribe(
        (res) => {
          console.log(res);
          // this.cargarDatosModal(res);

          let date = new Date()



          if((res['fecha'] != null ? res['fecha'].split('-')[0] == date.getFullYear : true) && (res['cant_convenios'] >= 0 && res['cant_convenios'] < 2 )){

            if(res['valida_contribuyente']){
              this.restoreForm()
              this.contribuyenteActive = res;
              this.contribuyenteActive['cant_convenios'] += 1
              this.titulosDisabled = false;
              this.vmButtons[0].habilitar = false;
              this.vmButtons[1].habilitar = true;
              this.vmButtons[2].habilitar = true;
              this.vmButtons[3].habilitar = true;
              this.vmButtons[4].habilitar = false;
              this.vmButtons[7].habilitar = true;

              this.getLiquidaciones();

              // if(this.contribuyenteActive.tiene_convenio == 1){
              //   console.log("hola")
              //   Swal.fire({
              //     icon: "warning",
              //     title: "¡Atención!",
              //     text: "Ya tiene convenio creado, no puede realizar más",
              //     showCloseButton: true,
              //     showCancelButton: true,
              //     showConfirmButton: true,
              //     cancelButtonText: "Cancelar",
              //     confirmButtonText: "Aceptar",
              //     cancelButtonColor: '#F86C6B',
              //     confirmButtonColor: '#4DBD74',
              //   })
              //   this.vmButtons[3].habilitar = false;
              //   console.log(this.documento)
              // }

              // else{
              //   this.titulosDisabled = false;
              //   this.vmButtons[3].habilitar = false;

              //   this.getLiquidaciones();

              // }

            }
            else{
              console.log('2')

              this.contribuyenteCActive = res;

              if (this.contribuyenteActive.id_cliente == this.contribuyenteCActive.id_cliente) {
                Swal.fire({
                  titleText: 'Seleccion de Solicitante',
                  text: 'No puede seleccionar al mismo Contribuyente como Solicitante.',
                }).then(() => Object.assign(this.contribuyenteCActive, {razon_social: null}) )
              }
            }

          }else {
            Swal.fire({
              icon: "warning",
              title: "¡Atención!",
              text: "Ya tiene 2 convenios creado este año, no puede realizar más",
              showCloseButton: true,
              showCancelButton: true,
              showConfirmButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              cancelButtonColor: '#F86C6B',
              confirmButtonColor: '#4DBD74',
            })
            this.vmButtons[4].habilitar = false;

          }





          // this.deudaDisabled = false;
        }
      );

      this.commonVrs.needRefresh.asObservable().subscribe(
        (res) => {
          if(res){
            this.calcCobroTotal();
          }
        }
      );

      this.commonVrs.diableCargarDis.asObservable().pipe(takeUntil(this.destroy)).subscribe(
        (res)=>{
          console.log('entro');
          this.documento.id_documento = null
        }
      )

      this.commonVrs.selectRecDocumento.asObservable().pipe(takeUntil(this.destroy)).subscribe(
        (res) => {

          // this.formReadOnly = true;

          this.restoreForm();
          // if(res['estado'] = 'A'){
          //   this.formReadOnly = true;
          //   this.titulosDisabled = true;
          // }else{
            this.formReadOnly = false;
            this.titulosDisabled = false;
          // }

          // console.log(res.contribuyente);
          // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar

          this.contribuyenteActive = res.contribuyente;
          this.contribuyenteCActive = res.contribuyente_2;
          // console.log(this.contribuyenteActive)
          // console.log(this.contribuyenteCActive)
          // console.log('Documento '+res.id_documento)
          this.docId = res.id_documento
          this.documento = res;
          this.newDocument = res['id_documento'];
          this.documento.fecha = res.fecha.split(" ")[0];
          this.documento['id_documento_detalle'] = 1;
          this.documento['id__documento'] = res['id_documento']


          console.log( res.detalles);

          res.detalles.forEach(e => {


            if(e.codigo_concepto=="CU"){ // si es cuota va a amortizacion
              if(e.deuda!=null){
                let amort = {
                  id_documento_detalle: e.id_documento_detalle,
                  num: e.num_cuota,
                  pago_total: e.valor,
                  pago_mensual: e.abono,
                  interes: e.interes != null ?e.interes: 0, //por ahora hasta que se involucre interes
                  saldo_inicial: e.saldo_anterior,
                  saldo_final: e.saldo_actual,
                  plazo_maximo: e.fecha_plazo_maximo,
                  estado: e.deuda.estado,
                  codigo_concepto: e.codigo_concepto,
                  fk_concepto: e.fk_concepto,
                }

                this.amortizaciones.push(amort);
              }else{
                let amort = {
                  id_documento_detalle: e.id_documento_detalle,
                  num: e.num_cuota,
                  pago_total: e.valor,
                  pago_mensual: e.abono,
                  interes: e.interes != null ?e.interes: 0, //por ahora hasta que se involucre interes
                  saldo_inicial: e.saldo_anterior,
                  saldo_final: e.saldo_actual,
                  plazo_maximo: e.fecha_plazo_maximo,
                  estado: 'P',
                  codigo_concepto: e.codigo_concepto,
                  fk_concepto: e.fk_concepto,
                }

                this.amortizaciones.push(amort);
              }



            } else {
              let det = {
                ...e,
                check: true,
                aplica: true,
                tipo_documento: e.codigo_concepto ?? "NaN",
                numero_documento: e.fk_numero_documento,
                concepto: {nombre: e.concepto ? e.concepto.nombre : "NaN", codigo:e.concepto ? e.concepto.codigo : "NaN" },
                comentario: e.comentario,
                //interes: e.interes != null ?e.interes: 0,
                valor: e.valor,
                saldo: e.saldo_anterior,
                cobro: e.abono,
                nuevo_saldo: e.saldo_actual,
                id_liquidacion: e.liquidacion?.id_liquidacion,
                total: e.liquidacion?.total,
                interes: e.liquidacion?.interes,
                sta: e.liquidacion?.sta,
                coactiva: e.liquidacion?.coactiva,
                descuento: e.liquidacion?.descuento,
                multa:e.liquidacion?.multa,
                exoneraciones: e.liquidacion?.exoneraciones,
                recargo: e.liquidacion?.recargo,
                descuento_interes: e.liquidacion?.descuento_interes
              }


              // check: false,
              // tipo_documento: e.concepto.codigo ?? "NA",
              // numero_documento: e.documento,
              // nombre: e.concepto.nombre ?? "NA",
              // comentario: "",
              // valor: e.subtotal,
              // saldo: e.deuda.saldo,
              // cobro: e.deuda.saldo, // en convenio se debe escoger todo siempre
              // nuevo_saldo: 0,
              // aplica: true,
              // total: e.total,
              // id_liquidacion: e.id_liquidacion,
              // interes: e.interes,
              // sta: e.sta,
              // coactiva: e.coactiva,
              // descuento: e.descuento,
              // multa:e.multa,
              // exoneraciones: e.exoneraciones,
              // recargo: e.recargo,
              // descuento_interes: e.descuento_interes,


              if(this.detallesNon.length == 0){
                this.detallesNon.push(e.concepto.nombre);
              }else {
                let val = true;
                this.detallesNon.map(
                  (rest)=>{
                    if(rest == e.concepto.nombre){
                      val = false;
                    }
                  }
                )

                if(val){
                  this.detallesNon.push(e.concepto.nombre);
                }
              }

              this.deudas.push(det);

            }

          })

          this.detallesNon.map(
            (res)=>{
              if(!!this.detallesHorizontal){
                this.detallesHorizontal = this.detallesHorizontal + ", " + res
              }else {
                this.detallesHorizontal = res
              }

            }
          )

          this.commonVrs.contribAnexoLoad.next({ id_cliente: this.documento['id_documento'], condi: 'dis'});
          this.commonVrs.contribAnexoLoad2.next({ id_cliente: this.documento['id_documento'], condi: 'dis', custom1: 'archivo2'});

          this.totalCobro = res.total;
          this.totalPago = res.total;
          // console.log(this.detallesHorizontal);
          // LLENADO DE CAMPOS EXTRA DE AMORTIZACION
          this.amortizacion = {
            cuota_inicial: res.cuota_inicial,
            num_cuotas: res.num_cuotas,
            interes: 0, //por ahora hasta que tenga valor
            monto_amortizar: +res.total - +res.cuota_inicial,
          }

          this.amortizaciones.forEach( e => {
            // intereses aun no porque esta en 0
            this.totalPagoMensual += +e.pago_mensual;
            this.totalPagoTotal += +e.pago_total;
            if(e.estado=='C'){
              this.totalValorPagado += +e.pago_mensual;
            }
          })

          this.aprobacionValidacion = true;

          // res.formas_pago.forEach(e => {
          //   this.pagos.push(e);
          // });
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = res['estado'] == 'A'
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;
          this.vmButtons[5].habilitar = false;
          this.vmButtons[7].habilitar = false;

        }
      )
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
        boton: { icon: "fas fa-edit", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
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
        boton: { icon: "far fa-close", texto: " PRE-ANULACION" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-close", texto: " ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: " RESOLUCIÓN" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
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
        this.createRecDocumento();
        break;
      case " BUSCAR":
        this.expandListDocumentosRec();
        break;
      case "MODIFICAR":
        this.updateRecDocumento();
        break;
      case " IMPRIMIR":
        this.printConvenio();
        break;
      case " LIMPIAR":
        this.confirmRestore();
        break;
      case " PRE-ANULACION":
        this.preAnularConvenio();
        break;
      case " ANULAR":
       // this.preAnularConvenio();
        break;
      case " RESOLUCIÓN":
          this.printResolucion();
          break;
      default:
        break;
    }
  }

  triggerPrint(): void {
    this.print.nativeElement.click();
  }

  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fConvenio,
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
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  getLiquidaciones() {
    this.msgSpinner = "Cargando lista de Liquidaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      codigo: "CO",
      fk_contribuyente: this.contribuyenteActive.id_cliente,
    }

    this.apiSrv.getLiqByContribuyente(data).subscribe(
      (res) => {
        console.log(res);

        this.deudas = [];

        res['data'].forEach(e => {
          if(e.deuda) {

            Object.assign(e, {
              check: false,
              tipo_documento: e.concepto.codigo ?? "NA",
              numero_documento: e.documento,
              nombre: e.concepto.nombre ?? "NA",
              comentario: "",
              valor: e.subtotal,
              saldo: e.deuda.saldo,
              cobro: e.deuda.saldo, // en convenio se debe escoger todo siempre
              nuevo_saldo: 0,
              aplica: true,
              total: e.total,
              id_liquidacion: e.id_liquidacion,
              interes: e.interes,
              sta: e.sta,
              coactiva: e.coactiva,
              descuento: e.descuento,
              multa:e.multa,
              exoneraciones: e.exoneraciones,
              recargo: e.recargo,
              descuento_interes: e.descuento_interes,

            })

            // let deuda = {
            //   tipo_documento: e.concepto.codigo ?? "NA",
            //   numero_documento: e.documento,
            //   nombre: e.concepto.nombre ?? "NA",
            //   comentario: "",
            //   valor: e.total,
            //   saldo: e.deuda.saldo,
            //   cobro: e.deuda.saldo, // en convenio se debe escoger todo siempre
            //   nuevo_saldo: 0,
            //   aplica: true,
            //   total: e.total,
            //   id_liquidacion: e.id_liquidacion
            // }

            this.deudas.push(e);
            // console.log(this.deudas)
          }
        });

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


  selectAll() {
    console.log(this.masterSelected)
    this.deudas.map((e: any) => e.check = this.masterSelected)
    this.calcCheck();
    if(!this.masterSelected){
      this.totalCobro = 0;
    }
    else{

    }
  }
  restar(deuda) {
    deuda.nuevo_saldo = +deuda.saldo - +deuda.cobro;
    this.calcCobroTotal();
  }

  calcCobroTotal() {
    let cobroTotal = 0;
    let interesTotal = 0;
    this.deudas.forEach(e => {
      // if (e.aplica) {
        let cobro100 = +e.cobro * 100;
        let interes100 = +e.interes * 100;
        cobroTotal += +cobro100; // en este caso es total porque sale de valor unitario * cantidad
        interesTotal += +interes100;
      // }
    });
    this.totalCobro = +cobroTotal / 100;
    this.totalInteres = +interesTotal / 100;
    // this.calcSaldoRestanteTotal();
    this.calcDifCobroPago();
    this.calcMontoInicial();
  }

  calcCheck(){
    // console.log('Calculo')
    let cobroTotal = 0;
    this.deudas.forEach(e => {
      if (e.check) {
        let cobro100 = + parseFloat(e.cobro) ;
        cobroTotal += +cobro100;


        this.calcDifCobroPago();
       }
       else{
        // console.log("holis")

       }
    });
    this.totalCobro = cobroTotal;
    this.calcMontoInicial();


  }

  calcMontoInicial() {
    let total100 = +this.totalCobro * 2000;
    let monto20 = +total100 / 10000;
    this.monto20 = +monto20.toFixed(2);
    //console.log(this.monto20)

    this.total20 = +this.monto20
    //console.log(amortizacion)
    this.amortizacion.cuota_inicial = +this.monto20 ;
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

  detAmortizacion() {
    const allSelected = this.deudas.reduce((acc, curr) => acc & curr.check, 1)
    if(this.masterSelected || allSelected){
      console.log("xd")
    }
    else{

      this.deudaDisabled = false;
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "No ha seleccionado todas las deudas ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    })
    if(this.documento.observacion_pdf_1 ==""|| this.documento.observacion_pdf_1 == undefined){
      this.toastr.info("Debe ingresar una observacion sobre las liquidaciones");
      // return;
    }


    }
    if(this.amortizacion.num_cuotas>24  ){

      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Desea realizar un convenio con cuotas mayor a 24?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      })
      this.cuotasDisabled = false;
      //  if (this.documento.observacion_pdf_2 =="" || this.documento.observacion_pdf_2 == undefined){
      //   this.toastr.info("Debe ingresar una observacion sobre las cuotas");
      //   return;
      // }
    }
    if(this.amortizacion.cuota_inicial < +this.monto20){
      this.toastr.info("La cuota inicial debe ser de almenos: "+ (+this.monto20));
      return;
    }else if(this.amortizacion.cuota_inicial >= this.totalCobro){
      this.toastr.info("La cuota inicial no puede ser mayor o igual al monto total a pagar");
      return;
    }else if( this.amortizacion.num_cuotas<=0 ){
      this.toastr.info("El No. de cuotas debe ser de 1 a 24");
      return;
    }

    else if(this.amortizacion.interes > 100){
      this.toastr.info("El interés no puede ser mayor a 100");
      return;
    }


    this.amortizaciones = [];

    let cobro100 = this.totalCobro * 10000;
    let cuota100 = this.amortizacion.cuota_inicial * 10000;
    let dif100 = +cobro100 - +cuota100;
    this.amortizacion.monto_amortizar = +dif100 / 10000;
    let monto100 = (this.amortizacion.monto_amortizar * 100) / +this.amortizacion.num_cuotas;
    let pago_mensual = +monto100 / 100;

    let inicial_anterior = 0;

    const fecha_documento: number[] = this.documento.fecha.split('-')
    let hoy = new Date(fecha_documento[0], fecha_documento[1] - 1, fecha_documento[2]);
    let mes = hoy.getMonth();
    let anio = hoy.getFullYear();

    for(let i=0;i<this.amortizacion.num_cuotas;i++){


      if(i==0){
        let saldo_inicial = +this.amortizacion.monto_amortizar;
        let interes = (+saldo_inicial * +this.amortizacion.interes) / 100;
        let pago_total = +interes + +pago_mensual;
        let saldo_final = +saldo_inicial - +pago_mensual;
        inicial_anterior = +saldo_final;

        let fecha = new Date();

        if(mes==11){
          mes=0;
          anio += 1;
        }else{
          mes += 1;
        }

        fecha.setMonth(mes);
        fecha.setFullYear(anio);

        let amort = {
          id_documento_detalle: 0,
          num: i+1,
          saldo_inicial: saldo_inicial,
          interes: interes,
          pago_mensual: pago_mensual,
          pago_total: pago_total,
          saldo_final: saldo_final,
          plazo_maximo: moment(fecha).format('YYYY-MM-DD'),
          estado: "P",
          codigo_concepto: 'CU',
        }

        this.amortizaciones.push(amort);

      }else{
        let saldo_inicial = +inicial_anterior;
        let interes = (+saldo_inicial * +this.amortizacion.interes) / 100;
        let pago_total = +interes + +pago_mensual;
        let saldo_final = +saldo_inicial - +pago_mensual;
        inicial_anterior = +saldo_final;

        let fecha = new Date();

        if(mes==11){
          mes=0;
          anio += 1;
        }else{
          mes += 1;
        }

        fecha.setMonth(mes);
        fecha.setFullYear(anio);

        let amort = {
          id_documento_detalle: 0,
          num: i+1,
          saldo_inicial: saldo_inicial,
          interes: interes,
          pago_mensual: pago_mensual,
          pago_total: pago_total,
          saldo_final: saldo_final,
          plazo_maximo: moment(fecha).format('YYYY-MM-DD'),
          estado: "P",
          codigo_concepto: 'CU'
        }

        this.amortizaciones.push(amort);

        if(i==this.amortizacion.num_cuotas-1){
          this.calcAmortizaciones()
        }




      }

      this.documento['id_documento_detalle'] = 0;


    }

      let cuota_inicial = {
        id_documento_detalle: 0,
        num: 0,
        saldo_inicial: this.totalCobro,
        interes: 0,
        pago_mensual: this.amortizacion.cuota_inicial,
        pago_total: this.amortizacion.cuota_inicial,
        saldo_final: this.totalCobro - this.amortizacion.cuota_inicial,
        plazo_maximo: this.documento.fecha,
        estado: "P",
        codigo_concepto: 'CU',
      }
      this.amortizaciones.unshift(cuota_inicial);



    // this.vmButtons[0].habilitar = false;

  }


  async preAnularConvenio() {


    if(this.documento.estado=='X'){
      this.toastr.info('Este Convenio ya esta Anulado.');
      return ;
    }

    let result: SweetAlertResult = await Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea pre-anular este convenio?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    })

    if (result.isConfirmed) {
      let data = {
        documento: this.documento,
        superavit: this.totalValorPagado,
        id_documento :this.docId
      }

      this.lcargando.ctlSpinner(true);
      this.apiSrv.anularConvenio(data).subscribe(
        (res) => {
          console.log(res);

          this.documento = res['data'];
          this.documento.fecha = res['data'].fecha.split(' ')[0];
          this.formReadOnly = true;
          this.vmButtons[0].habilitar = true;
          this.vmButtons[2].habilitar = false;
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;
          this.vmButtons[5].habilitar = true;
          this.vmButtons[7].habilitar = false;
          console.log(this.documento);
          // this.guardarDeuda(res['data'].id_liquidacion);
          this.lcargando.ctlSpinner(false);
          Swal.fire('Convenio pre-anulado', res['message'], 'success')
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "error",
            title: "Error al pre-anular el Convenio",
            text: error.error.message,
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          });
        }
      );
    }

  }

  calcAmortizaciones() {
console.log(this.amortizaciones)
    this.totalIntereses = 0;
    this.totalPagoMensual = 0;
    this.totalPagoTotal = 0;
    this.totalValorPagado =0;

    this.amortizaciones.forEach(e => {
      this.totalIntereses += +e.interes;
      this.totalPagoMensual += +e.pago_mensual;
      this.totalPagoTotal += +e.pago_total;

      if(e.deuda?.estado=='C'){
        this.totalValorPagado += +e.pago_mensual;
      }


    })
    this.totalPagoMensual = this.totalPagoMensual + this.amortizacion.cuota_inicial;
    this.totalPagoTotal = this.totalPagoTotal + this.amortizacion.cuota_inicial;
  }

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
      console.log(this.deudas[i].nuevo_saldo)
      if (
        this.deudas[i].nuevo_saldo<0
      ) {
        return true;
      }
    }
    return false;
  }

  createRecDocumento() {

     if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Convenios.", this.fTitle);
    } else {
      if(this.documento.observacion==""||this.documento.observacion==undefined){
        this.toastr.info("Debe ingresar una observación para el convenio")
        return;
      } else if(
        this.deudas.length<=0||!this.deudas.length
      ) {
        this.toastr.info("Debe ingresar al menos un título a amortizar ")
        return;
      } else if(
        this.amortizaciones.length<=0||!this.amortizaciones.length
      ) {
        this.toastr.info("Deben existir amortizaciones")
        return;
      // } else if(
      //   this.checkDeudas()
      // ) {
      //   this.toastr.info("El valor a pagar no puede ser mayor al saldo actual")
      //   return;
      // } else if(
      //   this.difCobroPago!=0
      // ) {
      //   this.toastr.info("El Valor Pagado total debe ser igual a "+this.totalCobro)
      //   return;
      }else if(
        this.documento.garante == '' || this.documento.garante == undefined
      ) {
        this.toastr.info("El campo ¿Tiene solicitante? no debe quedar vacio ")
        return;
      }

      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Está a punto de crear un convenio ¿Desea continuar?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.msgSpinner = 'Generando convenio...';
          this.lcargando.ctlSpinner(true);
          this.documento.estado = "E";
          this.documento.tipo_documento = "CO";
          this.documento.fk_contribuyente = this.contribuyenteActive.id_cliente;
          this.documento.fk_contribuyente_2 = this.contribuyenteCActive.id_cliente;
          this.documento.subtotal = this.totalCobro;
          this.documento.total = this.totalCobro;
          this.documento.detalles = [];
          this.documento.cuotas = [];
          this.documento.fk_caja = this.cajaActiva.id_caja;
          this.documento.cuota_inicial = this.amortizacion.cuota_inicial;
          this.documento.porcentaje = (+this.amortizacion.cuota_inicial/+this.totalCobro*100);
          this.documento.num_cuotas = this.amortizacion.num_cuotas;
          this.documento['cant_convenios'] = this.contribuyenteActive.cant_convenios
          console.log(this.deudas);
          console.log(this.pagos);
          this.deudas.forEach(e => {
            if (e.check && e.cobro >0 && e.aplica) {

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

          let i = 1;
          this.amortizaciones.forEach(e => {
            if(e.pago_mensual > 0 && e.pago_total > 0){


              let cuota = {
                id_documento_detalle: 0,
                num_cuota: e.num,
                valor: e.pago_total,
                abono: e.pago_mensual,
                saldo_anterior: e.saldo_inicial,
                saldo_actual: e.saldo_final,
                fecha_plazo_maximo: e.plazo_maximo
              }

              this.documento.cuotas.push(cuota);
              i++;
            }
          })

          let data = {
            documento: this.documento
          }
          console.log(this.documento);
          // servicio que crea el documento, sus detalles, sus cuotas asociadas
          // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
          this.apiSrv.setConvenio(data).subscribe(
            (res) => {
              this.documento = res['data'];
              this.newDocument = res['data']['id_documento']
              this.formReadOnly = true;
              this.vmButtons[0].habilitar = true;
              this.vmButtons[2].habilitar = false;
              this.vmButtons[4].habilitar = false;
              console.log(this.documento);
              this.lcargando.ctlSpinner(false);
              this.deudaDisabled = false;
              this.cuotasDisabled = false;

              if(!!this.fileList){
                this.uploadFile(res['data']['id_documento']);
              }
              if(!!this.fileList2){
                this.uploadFile2(res['data']['id_documento'], '');
              }

              console.log(res);
              console.log(this.contribuyenteActive.tiene_convenio);
              Swal.fire({
                icon: "success",
                title: "Convenio generado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              })/*.then((res)=>
              {
                if(res.isConfirmed){
                  this.triggerPrint();
                }
                else{
                  console.log("anexosss")
                }
                // else{
                //   Swal.fire({
                //     icon: "error",
                //     title: "Error al generar el Convenio",
                //     text: res['message'],
                //     showCloseButton: true,
                //     confirmButtonText: "Aceptar",
                //     confirmButtonColor: '#20A8D8',
                //   });
                // }
              })*/ },
            (error) => {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error al generar el Convenio",
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



  updateRecDocumento() {

    if (this.permissions.guardar == "0") {
     this.toastr.warning("No tiene permisos emitir Convenios.", this.fTitle);
   } else {
     if(this.documento.observacion==""||this.documento.observacion==undefined){
       this.toastr.info("Debe ingresar una observación para el convenio")
       return;
     } else if(
       this.deudas.length<=0||!this.deudas.length
     ) {
       this.toastr.info("Debe ingresar al menos un título a amortizar ")
       return;
     } else if(
       this.amortizaciones.length<=0||!this.amortizaciones.length
     ) {
       this.toastr.info("Deben existir amortizaciones")
       return;
     // } else if(
     //   this.checkDeudas()
     // ) {
     //   this.toastr.info("El valor a pagar no puede ser mayor al saldo actual")
     //   return;
     // } else if(
     //   this.difCobroPago!=0
     // ) {
     //   this.toastr.info("El Valor Pagado total debe ser igual a "+this.totalCobro)
     //   return;
     }

     Swal.fire({
       icon: "warning",
       title: "¡Atención!",
       text: "Está a punto de actualiza un convenio ¿Desea continuar?",
       showCloseButton: true,
       showCancelButton: true,
       showConfirmButton: true,
       cancelButtonText: "Cancelar",
       confirmButtonText: "Aceptar",
       cancelButtonColor: '#F86C6B',
       confirmButtonColor: '#4DBD74',
     }).then((result) => {
       if (result.isConfirmed) {
         this.msgSpinner = 'Generando convenio...';
         this.lcargando.ctlSpinner(true);
        //  this.documento.estado = "E";
        //  this.documento.tipo_documento = "CO";
        if(this.documento.id_documento_detalle == 0){
          this.documento['ant_cuota'] = []
          this.documento.detalles.forEach((e)=>{

            if(e.codigo_concepto=="CU"){ // si es cuota va a amortizacion

              let amort = {
                id_documento_detalle: e.id_documento_detalle,
                num: e.num_cuota,
                pago_total: e.valor,
                pago_mensual: e.abono,
                interes: 0, //por ahora hasta que se involucre interes
                saldo_inicial: e.saldo_anterior,
                saldo_final: e.saldo_actual,
                plazo_maximo: e.fecha_plazo_maximo,
                estado: e.estado,
                codigo_concepto: e.codigo_concepto,
                fk_concepto: e.fk_concepto,
              }

              this.documento['ant_cuota'].push(amort);

            }

          })


         }
         this.documento.fk_contribuyente = this.contribuyenteActive.id_cliente;
         this.documento.fk_contribuyente_2 = this.contribuyenteCActive?.id_cliente;
         this.documento.subtotal = this.totalCobro;
         this.documento.total = this.totalCobro;
         this.documento.detalles = [];
         this.documento.cuotas = [];
         this.documento.fk_caja = this.cajaActiva.id_caja;
         this.documento.cuota_inicial = this.amortizacion.cuota_inicial;
         this.documento.porcentaje = (+this.amortizacion.cuota_inicial/+this.totalCobro*100);
         this.documento.num_cuotas = this.amortizacion.num_cuotas;
         this.documento['cant_convenios'] = this.contribuyenteActive.cant_convenios
         console.log(this.deudas);
         console.log(this.pagos);
         this.deudas.forEach(e => {
           if (e.check && e.cobro >0 && e.aplica) {

             let doc_det = {
               id_documento_detalle: 0,
               fk_documento: 0,
               fk_liquidacion: e.fk_liquidacion,
               fk_deuda: e.deuda.id_deuda,
               fk_numero_documento: e.fk_numero_documento,
               valor: e.valor ?? e.total,
               abono: e.abono,
               saldo_anterior: e.saldo_anterior,
               saldo_actual: e.saldo_actual,
               comentario: e.comentario,
             }
             this.documento.detalles.push(doc_det);
           }
         });



        //  let abono = {
        //   id_documento_detalle: 0,
        //   num_cuota: 0,
        //   valor: this.documento.cuota_inicial,
        //   abono: this.documento.cuota_inicial,
        //   saldo_anterior: this.documento.total,
        //   saldo_actual: parseFloat(this.documento.total) - parseFloat(this.documento.cuota_inicial),
        //   fecha_plazo_maximo: this.documento.fecha
        //  }

        //  this.documento.cuotas.push(abono);

         let i = 1;
         this.amortizaciones.forEach(e => {
           if(e.pago_mensual > 0 && e.pago_total > 0){


             let cuota = {
               id_documento_detalle: e.id_documento_detalle,
               num_cuota: e.num,
               valor: e.pago_total,
               abono: e.pago_mensual,
               saldo_anterior: e.saldo_inicial,
               saldo_actual: e.saldo_final,
               fecha_plazo_maximo: e.plazo_maximo,
               codigo_concepto: e.codigo_concepto,
               fk_concepto: e.fk_concepto,
             }

             this.documento.cuotas.push(cuota);
             i++;
           }
         })

         let data = {
           documento: this.documento
         }

         if(this.documento.estado == 'X'){

          if( this.contribuyenteActive.cant_convenios == null ||  this.contribuyenteActive.cant_convenios == 0){
            this.documento.cant_convenios = 0;
          }else{
            this.documento['cant_convenios'] =  this.contribuyenteActive.cant_convenios -= 1;
          }


         }


         console.log(this.documento);
         // servicio que crea el documento, sus detalles, sus cuotas asociadas
         // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
         this.apiSrv.updateDocuemnto(data).subscribe(
           (res) => {
            //  this.documento = res['data'];
             this.formReadOnly = true;
             this.vmButtons[0].habilitar = true;
             this.vmButtons[2].habilitar = false;
             this.vmButtons[3].habilitar = false;
             this.vmButtons[7].habilitar = false;
             console.log(this.documento);
             this.lcargando.ctlSpinner(false);
             this.deudaDisabled = false;
             this.cuotasDisabled = false;

             if(!!this.fileList){
               this.uploadFile(res['data']['id_documento']);
             }
             if(!!this.fileList2){
               this.uploadFile2(res['data']['id_documento'], '');
             }

             console.log(res);
             console.log(this.contribuyenteActive.tiene_convenio);
             Swal.fire({
               icon: "success",
               title: "Convenio generado",
               text: res['message'],
               showCloseButton: true,
               confirmButtonText: "Aceptar",
               confirmButtonColor: '#20A8D8',
             })/*.then((res)=>
             {
               if(res.isConfirmed){
                 this.triggerPrint();
               }
               else{
                 console.log("anexosss")
               }
               // else{
               //   Swal.fire({
               //     icon: "error",
               //     title: "Error al generar el Convenio",
               //     text: res['message'],
               //     showCloseButton: true,
               //     confirmButtonText: "Aceptar",
               //     confirmButtonColor: '#20A8D8',
               //   });
               // }
             })*/ },
           (error) => {
             this.lcargando.ctlSpinner(false);
             Swal.fire({
               icon: "error",
               title: "Error al generar el Convenio",
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



  cargaArchivo(archivos) {
    if (archivos.length > 0) {

      this.fileList = archivos
        setTimeout(() => {
          this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de trámite')
        }, 50)



      // console.log(this.fileList)
    }


  }

  algo(){
    console.log('holis');
    console.log(this.fileList3);
  }

  cargaArchivo2(archivos, validacion) {
    if (archivos.length > 0) {
      console.log(this.fileList3);

      if(validacion == 'final'){
        console.log('aqui');
        this.fileList3 = archivos
        setTimeout(() => {
          this.toastr.info('Ha seleccionado ' + this.fileList3.length + ' archivo(s).', 'Anexos de trámite')
        }, 50)

      }else {
        this.fileList2 = archivos
        setTimeout(() => {
          this.toastr.info('Ha seleccionado ' + this.fileList2.length + ' archivo(s).', 'Anexos de trámite')
        }, 50)
      }
      // console.log(this.fileList)
    }


  }


  /**
* Se encarga de enviar los archivos al backend para su almacenado
* @param data Informacion del Formulario de Inspeccion (CAB)
*/
uploadFile(identifier) {



  console.log('Presionado una vez');
  let data = {
    // Informacion para almacenamiento de anexo
    module: 19,
    component: myVarGlobals.fConvenio,  // TODO: Actualizar cuando formulario ya tenga un ID
    identifier: identifier,
    // Informacion para almacenamiento de bitacora
    id_controlador: myVarGlobals.fConvenio,  // TODO: Actualizar cuando formulario ya tenga un ID
    accion: `Nuevo anexo para Ticket ${identifier}`,
    ip: this.commonService.getIpAddress()
  }

  for (let i = 0; i < this.fileList.length; i++) {
    console.log('File', data);
    this.UploadService(this.fileList[i], data, null);
  }
  this.fileList = undefined

  // this.lcargando.ctlSpinner(false)
}


uploadFile2(identifier, validacion) {
  let fileList2: FileList;
  let custom: any;
  if(validacion == "final"){
    fileList2 = this.fileList3;
    custom = validacion
  }else {
    fileList2 = this.fileList2;
    custom = 'archivo2'
  }
  console.log('Presionado una vez');
  let data = {
    // Informacion para almacenamiento de anexo
    module: 19,
    component: myVarGlobals.fConvenio,  // TODO: Actualizar cuando formulario ya tenga un ID
    identifier: identifier,
    custom1: custom,
    // Informacion para almacenamiento de bitacora
    id_controlador: myVarGlobals.fConvenio,  // TODO: Actualizar cuando formulario ya tenga un ID
    accion: `Nuevo anexo para Ticket ${identifier}`,
    ip: this.commonService.getIpAddress()
  }

  for (let i = 0; i < fileList2.length; i++) {
    console.log('File', data);
    this.UploadService2(fileList2[i], data, custom);
  }
  // this.fileList2 = undefined
  if(identifier == "final"){
    this.fileList3 = undefined;
  }else {
    this.fileList2 = undefined;
  }
  // this.lcargando.ctlSpinner(false)
}

/**
 * Envia un archivo al backend
 * @param file Archivo
 * @param payload Metadata
 */
UploadService(file, payload?: any, custom1?: any): void {
  let cont = 0
  console.log('Se ejecuto con:', payload);
  this.apiSrv.uploadAnexo(file, payload).toPromise().then(res => {
    console.log('aqui', res);
  }).then(res => {
    this.commonVrs.contribAnexoLoad.next({ id_cliente: this.documento['id_documento'], condi: 'dis', custom1: custom1 })
  })
}

UploadService2(file, payload?: any, custom1?: any): void {
  let cont = 0
  console.log('Se ejecuto');
  this.apiSrv.uploadAnexo(file, payload).toPromise().then(res => {
    console.log('aqui', res);
  }).then(res => {
    this.commonVrs.contribAnexoLoad2.next({ id_cliente: this.documento['id_documento'], condi: 'dis', custom1: custom1 })
  })
}

  restoreForm() {
    this.fileList = undefined;
    this.fileList2 = undefined;
    this.formReadOnly = false;
    this.titulosDisabled = true;
    this.deudaDisabled = true;
    this.cuotasDisabled = true;
    this.fileList= undefined;
    this.fileList2 = undefined;
    this.variable = false;
    this.aprobacionValidacion = false;


    this.contribuyenteActive = {
      razon_social: ""
    };
    this.contribuyenteCActive = {
      razon_social: ""
    };

    // this.conceptosList = [];
    this.concepto = 0;
   // this.fileList = [];

    this.totalCobro = 0;
    this.totalInteres = 0;
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
      cuota_inicial: 0,
      porcentaje: 0,
      num_cuotas: 0,
      detalles: [], // deudas
      formas_pago: [], // pagos
      cuotas: [], // cuotas que se guardaran como detalles con liq y deudas
      fk_caja: 0, // caja activa al momento de cobrar
      fk_contribuyente_2: null,
      observacion_pdf_1:"",
      observacion_pdf_2:"",
      garante:"",
    }

    this.amortizacion = {
      cuota_inicial: 0,
      num_cuotas: 0,
      interes: 0,
      monto_amortizar: 0,
    }

    this.totalIntereses = 0;
    this.totalPagoMensual = 0;
    this.totalPagoTotal = 0;
    this.totalValorPagado = 0;

    this.amortizaciones = [];

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[7].habilitar = true;
    this.commonVrs.clearAnexos.next(null)

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

  expandListContribuyentes(verificacionC) {
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
      modalInvoice.componentInstance.verificaContribuyente = verificacionC
    }

  }

  expandDetalleLiq(c) {
    const modalInvoice = this.modalService.open(ConceptoDetComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.concepto = c;
  }
  printConvenio(){

    //window.open(environment.ReportingUrl + "rpt_notifiacion_convenios.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_convenio=145" , '_blank')
    window.open(environment.ReportingUrl + "rpt_convenios.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_convenio=" + this.newDocument, '_blank')
      //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_notifiacion_convenios.html?id_convenio=


  }

  ngOnDestroy() {
    // this.commonVrs.selectContribuyenteCustom;
    this.destroy.next(null)
    this.destroy.complete()
  }

  printResolucion(){
    console.log(this.newDocument)
    window.open(environment.ReportingUrl + "rpt_resolucion_convenio.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_convenio=" + this.newDocument, '_blank')



  }

}
