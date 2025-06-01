import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { FormularioNotificacionesService } from './formulario-notificaciones.service';
import { Subject } from 'rxjs';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { ModalEdicionComponent } from './modal-edition/modal-edicion.component';
import * as myVarGlobals from 'src/app/global';

import { environment } from 'src/environments/environment';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
standalone: false,
  selector: 'app-formulario-notificaciones',
  templateUrl: './formulario-notificaciones.component.html',
  styleUrls: ['./formulario-notificaciones.component.scss']
})
export class FormularioNotificacionesComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle: string = "Gestión de Notificaciones"
  msgSpinner: string = "Cargnado...";
  dataUser: any;
  permissions: any;
  vmButtons: any;
  procesados: Subject<any> = new Subject<any>();

  cmb_mercados: any[] = []
  cmb_conceptos: any[] = []

  sectores: any[] = [
    { valor: 0, descripcion: 'Seleccione un Sector' }
  ]
  // gestiones: any[] = [
  //   { valor: 0, descripcion: "Seleccione una Gestion"}
  // ];
  gestiones: any[] = [
    { valor: 0, descripcion: "TODOS" },
  ];
  estadoList = [
    {value: "P",label: "PENDIENTE"},
    {value: "R",label: "RECIBIDO"},
    {value: "N",label: "NO RECIBIDO"}
  ]

  deudas: any = [];
  liquidacionesDt: any[] = [];
  masterIndeterminate: boolean = false
  masterSelected: boolean = false

  resdata: any = [];
  notificacionCobros: any = [];
  paginate: any;
  filter: any;

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: FormularioNotificacionesService,
    private excelService: ExcelService,
  ) {
    this.commonVrs.modalEditionDetallesCobro.asObservable().subscribe(
      (res)=>{
        this.cargarLiquidaciones();
      }
    )

    this.procesados.subscribe(() => this.cargarLiquidaciones());

  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnsCobranzaGestionNotificaciones",
        paramAccion: "",
        boton: { icon: "fas fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-danger boton btn-sm",
        habilitar: false,

      },
      {
        orig: "btnsCobranzaGestionNotificaciones",
        paramAccion: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false,
      },
    ]

    this.filter = {
      gestion: 0,
      sector: 0,
      mercado: null,
      concepto: null,
      estado: 0,
      razon_social: null,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [10, 20, 30, 50]
    }

    setTimeout(()=> {
      // this.cargarLiquidaciones();
      // this.getConceptos();
      this.validaPermisos();
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "IMPRIMIR":
        this.generarReportes()
        break;

      case "EXCEL":
        this.exportarExcel()
      break;

      case "GENERAR EXPEDIENTE":
        this.generarNotificacion()
        break;

      default:
        break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLiquidaciones();
  }

  validaPermisos() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fCobNotificacion,
      id_rol: this.dataUser.id_rol,
    };

    this.msgSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          // this.vmButtons = [];
        } else {
          this.fillCatalog();
          // this.lcargando.ctlSpinner(false)
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.msgSpinner = "Cargando Catalogs";
    this.apiSrv.getCatalogs({params: "'COB_TIPO_GESTION','CAT_SECTOR','REN_MERCADO'"}).subscribe(
      (res: any) => {
        // console.log(res.data);
        res.data.COB_TIPO_GESTION.forEach(e => {
          const { valor, descripcion } = e;
          this.gestiones = [...this.gestiones, { valor: valor, descripcion: descripcion }]
        })
        res.data.CAT_SECTOR.forEach(e => {
          const { valor, descripcion } = e;
          this.sectores.push({valor: valor, descripcion: descripcion})
        })
        res.data.REN_MERCADO.forEach(e => {
          const { id_catalogo, valor, descripcion } = e;
          this.cmb_mercados = [...this.cmb_mercados, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
        })
        // this.lcargando.ctlSpinner(false);
        this.cargarConceptos()
        // this.cargarLiquidaciones()
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarConceptos() {
    // this.msgSpinner = 'Cargando Conceptos'
    // this.lcargando.ctlSpinner(true)
    this.apiSrv.getConceptos().subscribe(
      (res: any) => {
        res.data.forEach(e => {
          const { id_concepto, nombre } = e
          this.cmb_conceptos = [...this.cmb_conceptos, { id_concepto: id_concepto, nombre: nombre }]
        })
        // this.lcargando.ctlSpinner(false)
        this.cargarLiquidaciones()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  consultar() {
    Object.assign(
      this.paginate,
      { page: 1 }
    )

    this.cargarLiquidaciones()
  }

  cargarLiquidaciones(){
    if (this.filter.razon_social != null) {
      this.filter.razon_social = this.filter.razon_social.trim().length > 0 ? this.filter.razon_social.trim() : null
    }

    this.msgSpinner = "Cargando Notificaciones...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getNotificacionCobro({params: {tipo:"GESTION", filter: this.filter, paginate: this.paginate } }).subscribe(
      (res: any) => {
        // console.log(res);
        if (Array.isArray(res.data) && !res.data.length) {
          this.lcargando.ctlSpinner(false)
          return;
        }

        this.paginate.length = res['data']['total'];

        this.liquidacionesDt = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
        this.liquidacionesDt.forEach((element: any) => {
          Object.assign(element, { check: false })
        });

        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message);
      }
    );
  }

  selectAll() {
    this.masterIndeterminate = false
    // this.data.map((e) => e.check = this.masterSelected)
    this.liquidacionesDt.map((e: any) => e.check = this.masterSelected)
  }

  partialSelect() {
    const someSelected = this.liquidacionesDt.reduce((acc, curr) => acc | curr.check, 0)
    const allSelected = this.liquidacionesDt.reduce((acc, curr) => acc & curr.check, 1)

    this.masterIndeterminate = !!(someSelected && !allSelected)
    this.masterSelected = !!allSelected
  }

  generarReportes() {
    const notif = this.liquidacionesDt.filter(e => e.check)

    if (!notif.length) {
      this.toastr.warning('No ha seleccionado ninguna notificacion', `${this.fTitle} - Imprimir`)
      return
    }

    notif.forEach((element: any) => {
      if (element.tipo_gestion == 'MERCADOS') {
        window.open(`${environment.ReportingUrl}rpt_notificacion_mercado.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&id_notificacion=${element.id_cob_notificacion}`)
      } else if (element.tipo_gestion == 'CONVENIO') {
        window.open(`${environment.ReportingUrl}rpt_notificaciones_convenio.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&id_convenio=${element.id_cob_notificacion}`)
      } else if (element.tipo_gestion == 'CONCEPTOS') {
        window.open(`${environment.ReportingUrl}rpt_notificacion_conceptos_coactiva.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&id_notificacion=${element.id_cob_notificacion}`)
      }
    });
  }

  generarNotificacion() {
    let procesados = this.liquidacionesDt.filter(e => e.check == true && e.notificador != null)
    console.log(procesados)
    Swal.fire({
      title: this.fTitle,
      text: `Se procesarán ${procesados.length} registros.`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.msgSpinner = 'Generando Expedientes'
        this.lcargando.ctlSpinner(true)
        this.apiSrv.generarNotificaciones({titulos: procesados}).subscribe(
          (res: any) => {
            console.log(res)
            this.lcargando.ctlSpinner(false)
            Swal.fire('Expedientes generados correctamente', '', 'success').then(() => {
              this.cargarLiquidaciones()
            })
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error generando Expedientes')
          }
        )
      }
    })
  }

  imprimirNotificacion(notificacion: any) {
    if (notificacion.tipo_gestion == 'MERCADOS') {
      window.open(`${environment.ReportingUrl}rpt_notificacion_mercado.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&id_notificacion=${notificacion.id_cob_notificacion}`)
    } else if (notificacion.tipo_gestion == 'CONVENIO') {
      window.open(`${environment.ReportingUrl}rpt_notificaciones_convenio.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&id_convenio=${notificacion.id_cob_notificacion}`)
    } else if (notificacion.tipo_gestion == 'CONCEPTOS') {
      window.open(`${environment.ReportingUrl}rpt_notificacion_conceptos_coactiva.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&id_notificacion=${notificacion.id_cob_notificacion}`)
    }
  }

  generarExpedientes() {
    let process = this.notificacionCobros.filter(e => e.check == true)

    Swal.fire({
      title: this.fTitle,
      text: `Esta seguro de procesar ${process.length} registros?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Procesar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.msgSpinner = 'Generando Expedientes'
        this.lcargando.ctlSpinner(true)
        this.apiSrv.generarExpediente({ titulos: process }).subscribe(
          (res: any) => {
            console.log(res.data)
            this.lcargando.ctlSpinner(false)
            Swal.fire(this.fTitle, `${res.data.conteo} registros procesados`, 'success').then((result) => {
              this.procesados.next(res.data.registros)
            })

          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error generando Expedientes')
          }
        )
      }
    })
  }

  modalDetalles(notificacion: any){
    const modal = this.modalSrv.open(ModalDetallesComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    modal.componentInstance.notificacion = notificacion

  }

  modalEditDetalles(notificacion: any){
    console.log(notificacion)
    const modal = this.modalSrv.open(ModalEdicionComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    modal.componentInstance.notificacion = notificacion;
    modal.componentInstance.permissions = this.permissions;
  }

  limpiarFiltros() {
    this.filter = {
      gestion: 0,
      sector: 0,
      mercado: null,
      concepto: null,
      estado: 0,
      contribuyente: null,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
    }
    // this.cargarLiquidaciones();
  }


  exportarExcel() {
    let excelData = []
    this.msgSpinner = 'Exportando'
    this.lcargando.ctlSpinner(true)

    this.apiSrv.getNotificacionCobro({params: {tipo:"GESTION", filter: this.filter}}).subscribe(
      (res: any) => {
        res.data.forEach((liquidacion: any) => {
          const { id_cob_notificacion,tipo_gestion, total, fecha, estado, notificador, fecha_recepcion, ...items } = liquidacion;
          const { razon_social, num_documento, codigo_sector, ...contribuyente  } = liquidacion.contribuyente;
          const {nombre} = liquidacion.usuario == null ? '' : liquidacion.usuario

          const data = {
            NumNotificacion: id_cob_notificacion,
            Contribuyente: razon_social,
            TipoGestion: tipo_gestion,
            Total: total,
            Fecha: fecha,
            Usuario: nombre,
            Estado: estado == "P" ? "Pendiente" : estado == "R" ? "Recibido" : estado == "N" ? "No Recibido" : estado == "G" ? "Gaceta" : estado == "S" && "Sin Direccion",
            Notificador: notificador,
            FechaRecepcion: fecha_recepcion,
          }
          excelData.push(data)
        })
        this.excelService.exportAsExcelFile(excelData, `NotificacionesEmitidas_${moment().format('YYYYMMDD')}`);
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.warning(err.error.message, 'Error cargando Notificaciones')
      }
    )
  }


}
