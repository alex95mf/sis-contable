import { Component, OnInit, ViewChild } from "@angular/core";
import { EstadoCuentaService } from "./estado-cuenta.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
//import { ModalContribuyentesComponent } from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { ModalContribuyentesComponent } from "./modal-contribuyentes/modal-contribuyentes.component";
import { DetalleInteresesComponent } from "./detalle-intereses/detalle-intereses.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConceptoDetComponent } from "./concepto-det/concepto-det.component";
import { environment } from "src/environments/environment";
import { ValidacionesFactory } from "src/app/config/custom/utils/ValidacionesFactory";
@Component({
standalone: false,
  selector: "app-estado-cuenta",
  templateUrl: "./estado-cuenta.component.html",
  styleUrls: ["./estado-cuenta.component.scss"],
})
export class EstadoCuentaComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  disabledFilter: boolean = true
  formReadOnly: boolean = true
  filter: any ;
  empresLogo: any;
  //catalog: any = {};
  contribuyente: any = [];
  deudas: any = [];
  conceptosList: any = [];
  saldo_convenio: number = 0;
  totalDeudas = 0;
  sector: any;
  solar: any;
  //tamDoc: any = 0;
  /*actions: any = {
    //new: false, 
    search: false,
    add: true,
    edit: true,
    cancel: true,
    delete: true,
  };*/

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm')
  verifyRestore = false;
  hayContribuyente: boolean = false;

  contribuyente_activo: any = {};
  totalDeudasCheck = 0;

  desglose: any = {
    valor: 0,
    interes: 0,
    multa: 0,
    descuento: 0,
    exoneraciones: 0,
    recargo: 0,
    coactiva: 0,
    saldo: 0
  }
  listEstados = [
    {value: "E",label: "EMITIDO"},
    {value: "A",label: "APROBADO"},
    {value: "X",label: "ANULADO"},
    {value: "C",label: "CANCELADO"},
    {value: "V",label: "CONVENIO"},
  ]

  constructor(
    private contribuyenteSrv: EstadoCuentaService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    public validaciones: ValidacionesFactory,
  ) {
    /*this.commonVrs.editContribuyente.asObservable().subscribe((res) => {
      this.mensajeSpinner = 'Cargando deudas del contribuyente...'
      this.lcargando.ctlSpinner(true);
      this.CancelForm();
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;
      this.contribuyente = res;
      this.contribuyenteSrv.getDeudas({id_contribuyente: res.id_cliente}).subscribe(
        res2 => {
          this.deudas = res2["data"];
          this.lcargando.ctlSpinner(false);
          this.calcularTotal();
        },
        err => {
          this.toastr.error(err.error);
          this.lcargando.ctlSpinner(false);
        }
      )
    });*/
    this.commonVrs.selectContribuyenteConfRen.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.cargarDatosModal(res);
      }
    );
    this.commonVrs.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.cargarDatosModal(res);
        this.disabledFilter = false
      }
    );
  }

  calculoChecks(){
    let sumaChecks = 0;
    Object.assign(
      this.desglose,
      {
        valor: 0,
        interes: 0,
        multa: 0,
        descuento: 0,
        exoneraciones: 0,
        recargo: 0,
        coactiva: 0,
        saldo: 0
      }
    )

    this.deudas.map((deuda: any) => {
        if(deuda.Check){
          if(deuda.saldo == null || Number.isNaN(deuda.saldo)){
            sumaChecks = 0;
            console.log(deuda.saldo);
          }else{
            if(deuda['tipo_documento']!='AN' && deuda['tipo_documento'] !='BA'){
              sumaChecks += parseFloat(deuda.saldo)

              // Desglose
              this.desglose.valor += parseFloat(deuda.valor)
              this.desglose.interes += parseFloat(deuda.interes)
              this.desglose.multa += parseFloat(deuda.multa)
              this.desglose.descuento += parseFloat(deuda.descuento)
              this.desglose.exoneraciones += parseFloat(deuda.exoneraciones)
              this.desglose.recargo += parseFloat(deuda.recargo)
              this.desglose.coactiva += parseFloat(deuda.coactiva)
              this.desglose.saldo += parseFloat(deuda.saldo)
            }else if(deuda['tipo_documento']=='AN' || deuda['tipo_documento']=='BA'){
              sumaChecks -= parseFloat(deuda.saldo)

            }
          }
        }
    })

    this.totalDeudasCheck = sumaChecks
  }

  ngOnInit(): void {
    this.vmButtons = [
      // {
      //   orig: "btnsContribuyente",
      //   paramAccion: "",
      //   boton: { icon: "far fa-search", texto: "BUSCAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-info boton btn-sm",
      //   habilitar: false,
      // },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
        printSection: "Printsection", imprimir: true
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      }
    ];

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      concepto: null,
      estado: null
    }

    setTimeout(() => {
      this.validatePermission();
      this.getConceptos()
    }, 50);
  }

  validatePermission() {
    this.mensajeSpinner = 'Cargando Permisos de Usuario...'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fRenECuenta,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        this.lcargando.ctlSpinner(false);
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Estado de Cuenta."
          );
          this.vmButtons = [];
        } else {
          this.lcargando.ctlSpinner(false);
          setTimeout(() => {
            //this.fillCatalog();
          }, 500);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  /*fillCatalog() {
    let data = {
      params: "'DOCUMENTO'",
    };
    this.contribuyenteSrv.getCatalogs(data).subscribe(
      (res) => {
        this.catalog.documents = res["data"]["DOCUMENTO"];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }*/

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      // case "BUSCAR":
      //   this.showContribuyentes();
      //   break;
      case "IMPRIMIR":
        //this.imprimirContribuyente();
        break;
      case "CANCELAR":
        this.CancelForm()
        break;
    }
  }

  getConceptos() {
    this.mensajeSpinner = 'Cargando Tipos de Reporte';
    this.lcargando.ctlSpinner(true);
    this.contribuyenteSrv.getConceptos().subscribe(
      (res: any) => {
         console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            codigo: element.codigo,
            nombre: element.nombre,
            id_concepto: element.id_concepto
          };
          this.conceptosList.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  CancelForm() {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.contribuyente_activo = {};
    this.deudas = [];
    this.totalDeudas = 0;
    this.hayContribuyente = false;
    this.disabledFilter = true
    //this.commonVrs.clearContact.next(this.actions);
  }

  showContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenECuenta;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    //this.ClearForm();
  }

  calcularTotal() {
    this.mensajeSpinner = 'Calculando total de las deudas...';
    this.lcargando.ctlSpinner(true);
    let total = 0;
    this.deudas.forEach(d => {
      // Se agregan estados: 
      //   X => Anulados, porque se toma en cuenta las Anulaciones
      if (d.estado == "A" || d.estado == 'X') {
        if(d.tipo_documento=='AN' || d.tipo_documento=='BA'){
          total -= +d.saldo; // si es un aanulacion se resta el valor
        }else{
          total += +d.saldo;
        }

      }
    });
    this.totalDeudas = total;
    this.lcargando.ctlSpinner(false);
  }

  handleFilter = () => {
    this.mensajeSpinner = 'Filtrando Deudas'
    this.lcargando.ctlSpinner(true)
    this.contribuyenteSrv.getDeudas({ id_contribuyente: this.contribuyente_activo.id_cliente, filter: this.filter }).subscribe(
      (res: any) => {
        console.log(res)
        this.deudas = res.data.deudas
        this.saldo_convenio = res.data.convenio
        this.deudas.forEach((deuda: any) => {
          if (deuda.liquidacion?.codigo_catastro != null) {
            Object.assign(
              deuda,
              {
                sector: deuda.liquidacion.codigo_catastro.split('-')[1],
                solar: deuda.liquidacion.codigo_catastro.split('-')[3],
              }
            )
          }
        });
        this.deudas.map((deuda: any) => deuda.check = false)
        this.calcularTotal()
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error filtrando Deudas')
      }
    )
    
  }

  resetFilter = () => {
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      concepto: null,
      estado: null
    }
  }

  cargarDatosModal(dato?: any) {
    this.mensajeSpinner = 'Cargando deudas del contribuyente...'
    this.lcargando.ctlSpinner(true);
    if(dato) {
      this.contribuyente_activo = dato;
    }  
    this.hayContribuyente = true;
    // this.CancelForm();
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    //this.contribuyente = res;
    this.contribuyenteSrv.getDeudas({id_contribuyente: this.contribuyente_activo.id_cliente}).subscribe(
      res2 => {
        console.log(res2);
        this.saldo_convenio = res2['data']['convenio'];
        this.deudas = res2['data']['deudas'];
        res2['data']['deudas'].forEach(e => {
          
          //this.tipoEventosList.push(e);
          if(e.liquidacion != null){
            if(e.liquidacion.codigo_catastro != null){
              console.log(e.liquidacion.codigo_catastro);
              //this.sector=e.liquidacion.codigo_catastro.split('-')[3];
              //this.solar=e.liquidacion.codigo_catastro.split('-')[1];

              Object.assign(e, { sector: e.liquidacion.codigo_catastro.split('-')[1], solar: e.liquidacion.codigo_catastro.split('-')[3] })
              
                // this.sector =e.liquidacion.codigo_catastro.split('-')[3],
                // this.solar =e.liquidacion.codigo_catastro.split('-')[1]
                
              
              //e.liquidacion.push({ "sector": e.liquidacion.codigo_catastro.split('-')[3]});

            }
           
          }
          //console.log('solar',this.solar);
          //console.log('sector',this.sector);
        });
        //console.log(this.deudas.liquidacion); //= //res['data'].fecha.split(' ')[0];
        console.log(res2["data"]['deudas'][0]); //= //res.fecha.split(" ")[0];
        this.deudas.map((obj: any)=>{
          obj["Check"] = false
        })
        this.lcargando.ctlSpinner(false);
        this.calcularTotal();
      },
      err => {
        this.toastr.error(err.error);
        this.lcargando.ctlSpinner(false);
      }
    )
    console.log(this.contribuyente_activo);
  }

  recargarDeudas() {
    this.cargarDatosModal();
  }
  printTitulo(dt?:any){
    console.log(dt)
    if(dt.tipo_documento=='TA'){
      window.open(environment.ReportingUrl + "rep_rentas_tasas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A" , '_blank')
    }
    else if(dt.tipo_documento=='PC'){
      window.open(environment.ReportingUrl + "rep_tasas_permiso_construccion.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"   , '_blank')
    }
    else if(dt.tipo_documento=='CV'){
      window.open(environment.ReportingUrl + "rep_rentas_conceptos_varios.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"   , '_blank')
    }
    else if(dt.tipo_documento=='AM'){
      window.open(environment.ReportingUrl + "rep_rentas_arriendo_mercado.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"   , '_blank')
    }
    else if(dt.tipo_documento=='PL'){
      window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"   , '_blank')
    }
    else if(dt.tipo_documento=='PU'){
      window.open(environment.ReportingUrl + "rpt_rentas_prediosUrbanos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"   , '_blank')
    }
    else if(dt.tipo_documento=='CM'){
      window.open(environment.ReportingUrl + "report_tasa_centro_medico.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"   , '_blank')
    }
    else if(dt.tipo_documento=='CU'){
      window.open(environment.ReportingUrl + "rep_rentas_cuota_convenio.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"   , '_blank')
    }
    else if(dt.tipo_documento=='AR'){
      window.open(environment.ReportingUrl + "rep_rentas_arriendo_terreno.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"   , '_blank')
    }
    else if(dt.tipo_documento=='EP'){
      window.open(environment.ReportingUrl + "rep_rentas_espectaculos_publicos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A"  , '_blank')
    }
    else if(dt.tipo_documento=='CT'){
      window.open(environment.ReportingUrl + "rep_rentas_compra_terreno.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A" , '_blank')
    }
    else{
      window.open(environment.ReportingUrl + "rep_rentas_generico.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A" , '_blank')
    }
    
    
  }
  expandDetalleConcepto(c) {
    const modalInvoice = this.modalService.open(ConceptoDetComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.concepto = c;
  }

  consultaDetalleIntereses(data?:any) {
 
    const modalInvoice = this.modalService.open(DetalleInteresesComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.data = data;
  }
  
}