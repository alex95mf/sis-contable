import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { MultasEmitidasService } from './multas-emitidas.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultaDetComponent } from './multa-det/multa-det.component';
import { environment } from 'src/environments/environment';
import { NgxPrintDirective } from 'ngx-print';

@Component({
standalone: false,
  selector: 'app-multas-emitidas',
  templateUrl: './multas-emitidas.component.html',
  styleUrls: ['./multas-emitidas.component.scss']
})
export class MultasEmitidasComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Aprobación de Multas";
  mensajeSpinner: string = "Cargando...";
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  select_estado = 0;

  liquidacionesDt: any = [];

  estadosList = [
    {
      value: 'E',
      label: "Emitido",
    },
    {
      value: 'A',
      label: "Aprobado",
    },
    {
      value: 'X',
      label: "Anulado",
    },
    {
      value: 'T',
      label: "Todos",
    },
  ];
  razon_social_rep: any
  estado_rep: any

  constructor(
    private apiSrv: MultasEmitidasService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private modalService: NgbModal,
    private cierremesService: CierreMesService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.vmButtons = [

      {
        orig: "btnsMult",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
        printSection: "PrintSection",
        imprimir: true
      },
      {
        orig: "btnsMult",
        paramAccion: "2",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      }
    ];

    this.filter = {
      razon_social: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      estado: 0,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [2, 5, 10, 20]
    }

    setTimeout(()=>{
      this.validaPermisos();
    },0)

  }

  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';

    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fRPTitulos,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso");
        } else {
          this.cargarLiquidaciones();
        }
      }
    )
  }
  metodoGlobal = (event) => {
    switch (event.items.boton.texto)
    {
      case " IMPRIMIR":
        this.btnImprimir();
       break
      case "EXCEL":
        this.btnExcel();
       break
    }
  }
  btnImprimir(){
   if(this.filter.razon_social==undefined){
    this.razon_social_rep= " "
   }else{
    this.razon_social_rep=this.filter.razon_social
   }
   if(this.select_estado==0){
    this.estado_rep = " "
   }else{
    this.estado_rep =this.select_estado
   }
   console.log(this.filter.razon_social_rep)
    window.open(environment.ReportingUrl + "rpt_rentas_multas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_inicio=" + this.filter.fecha_desde + "&fecha_fin=" + this.filter.fecha_hasta + "&razon_social=%" + this.razon_social_rep + "%&estado=" + this.estado_rep, '_blank')
   //window.open(environment.ReportingUrl + "rpt_rentas_multas.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting , '_blank')

  }
  btnExcel(){
    window.open(environment.ReportingUrl + "rpt_rentas_multas.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_inicio=" + this.filter.fecha_desde + "&fecha_fin=" + this.filter.fecha_hasta + "&razon_social=%" + this.razon_social_rep + "%&estado=" + this.estado_rep, '_blank')
    //window.open(environment.ReportingUrl + "rpt_rentas_multas.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting , '_blank')

  }


  estadoToPrint(estado) {
    if(estado === 'E'){
      return "Emitido"
    } else if(estado === 'A'){
      return "Aprobado"
    } else if(estado === 'X'){
      return "Anulado"
    } else {
      return "Todos"
    }
  }

  cargarLiquidaciones() {

    (this as any).mensajeSpinner = "Cargando lista de liquidaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      codigo: 'ML',
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.apiSrv.getLiquidaciones(data).subscribe(
      (res) => {
        // console.log(res);
        // this.liquidacionesDt = res ['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
         this.liquidacionesDt = res['data']['data'];
        } else {
         this.liquidacionesDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLiquidaciones();
  }

  aplicarFiltros() {
    this.paginate.page = 1;
    this.cargarLiquidaciones();
  }

  limpiarFiltros() {
    this.filter.razon_social = undefined;
    this.filter.fecha_desde = moment(this.firstday).format('YYYY-MM-DD');
    this.filter.fecha_hasta = moment(this.today).format('YYYY-MM-DD');
    this.filter.estado = undefined;
    this.select_estado = 0;
    // this.cargarLiquidaciones();
  }


  change(event) {
    // console.log(event);
    if(event!='T'){
      let temp = [];
      temp.push(event);
      this.filter.estado = temp;
      temp = [];
    } else {
      this.filter.estado = undefined;
    }
  }

  aprobar(id) {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea aprobar esta Liquidacion?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result)=>{
      if(result.isConfirmed) {


        (this as any).mensajeSpinner = 'Verificando período contable...';
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment().format('YYYY')),
          "mes": Number(moment().format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              (this as any).mensajeSpinner = "Aprobando liquidacion...";
              this.lcargando.ctlSpinner(true);
              this.apiSrv.aprobarLiquidacion(id).subscribe(
                (res) => {
                  if (res["status"] == 1) {
                    this.lcargando.ctlSpinner(false);
                    this.cargarLiquidaciones();
                    Swal.fire({
                      title: "Registro Aprobado",
                      text: res['message'],
                      showCloseButton: true,
                      //showCancelButton: true,
                      //showConfirmButton: true,
                      //cancelButtonText: "Cancelar",
                      confirmButtonText: "Aceptar",
                      //cancelButtonColor: '#F86C6B',
                      confirmButtonColor: '#20A8D8',
                    });

                  } else {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: res['message'],
                      showCloseButton: true,
                      //showCancelButton: true,
                      //showConfirmButton: true,
                      //cancelButtonText: "Cancelar",
                      confirmButtonText: "Aceptar",
                      //cancelButtonColor: '#F86C6B',
                      confirmButtonColor: '#20A8D8',
                    });
                  }
                },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.message);
                }
              )

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

  anular(id) {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea anular esta Liquidacion?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result)=>{
      if(result.isConfirmed) {


        (this as any).mensajeSpinner = 'Verificando período contable...';
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment().format('YYYY')),
          "mes": Number(moment().format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              (this as any).mensajeSpinner = "Anulando liquidacion...";
              this.lcargando.ctlSpinner(true);
              this.apiSrv.anularLiquidacion(id).subscribe(
                (res) => {
                  if (res["status"] == 1) {
                    this.lcargando.ctlSpinner(false);
                    this.cargarLiquidaciones();
                    Swal.fire({
                      title: "Registro Eliminado",
                      text: res['message'],
                      showCloseButton: true,
                      //showCancelButton: true,
                      //showConfirmButton: true,
                      //cancelButtonText: "Cancelar",
                      confirmButtonText: "Aceptar",
                      //cancelButtonColor: '#F86C6B',
                      confirmButtonColor: '#20A8D8',
                    });

                  } else {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: res['message'],
                      showCloseButton: true,
                      //showCancelButton: true,
                      //showConfirmButton: true,
                      //cancelButtonText: "Cancelar",
                      confirmButtonText: "Aceptar",
                      //cancelButtonColor: '#F86C6B',
                      confirmButtonColor: '#20A8D8',
                    });
                  }
                },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.message);
                }
              )

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


  expandDetalleMulta(c) {
    const modalInvoice = this.modalService.open(MultaDetComponent,{
      size:"md",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    // modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    modalInvoice.componentInstance.concepto = c;
  }


}
