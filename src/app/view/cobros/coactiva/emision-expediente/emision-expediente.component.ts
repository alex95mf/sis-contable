import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import * as moment from 'moment'
import Swal from "sweetalert2/dist/sweetalert2.js";
// import * as myVarGlobals from "../../../../../global";
import { EmisionExpedienteService } from './emision-expediente.service';
import { Subject } from 'rxjs';
import * as myVarGlobals from 'src/app/global';
import { ModalDetallesComponent } from '../../cobranza/formulario-notificaciones/modal-detalles/modal-detalles.component';
import { ModalEdicionComponent } from '../../cobranza/formulario-notificaciones/modal-edition/modal-edicion.component';
import {ModalExpedienteContribuyenteComponent} from './modalExpedienteContribuyente/modalExpedienteContribuyente.component';
import { ExcelService } from 'src/app/services/excel.service';
import { MatPaginator } from '@angular/material/paginator';
@Component({
standalone: false,
  selector: 'app-emision-expediente',
  templateUrl: './emision-expediente.component.html',
  styleUrls: ['./emision-expediente.component.scss']
})
export class EmisionExpedienteComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator
  fTitle: string = "Emisión de expedientes"
  mensajeSpinner: string = "Cargnado...";
  dataUser: any;
  permissions: any;
  vmButtons: any;
  procesados: Subject<any> = new Subject<any>();
  
  sectores: any[] = [
    { valor: 0, descripcion: 'Seleccione un Sector' }
  ]
  mercados: any[] = [
    { id_catalogo: 0, valor: 0, descripcion: 'TODOS' }
  ]
  conceptos: any[] = [
    { id_concepto: 0, nombre: 'TODOS' },
  ]
  gestiones: any[] = [
    { valor: 0, descripcion: "TODOS"}
  ];
  estadoList = [
    { value: 0, label: "TODOS" },
    {value: "P", label: "PENDIENTE"},
    {value: "R", label: "RECIBIDO"},
    {value: "N", label: "NO RECIBIDO"}
  ]
  
  deudas: any = [];
  liquidacionesDt: any[] = [];
  masterSelected: boolean = false
  masterIndeterminate: boolean = false

  notificacionCobros: any = [];
  paginate: any = {
    length: 0,
    perPage: 10,
    page: 1,
    pageSizeOptions: [10, 20, 30, 50]
  };

  filter: any = {
    gestion: 0,
    mercado: 0,
    estado: 'R',
    concepto: 0,
    razon_social: null,
    fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
  }
  fecha_emision: string = moment().add(0, 'years').format('YYYY-MM-DD');

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: EmisionExpedienteService,
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
      // {
      //   orig: "btnsGestionCobranza",
      //   paramAccion: "",
      //   boton: { icon: "fas fa-mail-bulk", texto: "ENVIAR CORREO" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-success boton btn-sm",
      //   habilitar: false,
      // },
      /* {
        orig: "btnsGestionCobranza",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR POR LOTE" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
        
      }, */
      {
        orig: "btnsGestionCobranza",
        paramAccion: "",
        boton: { icon: "fas fa-bell-plus", texto: "GENERAR EXPEDIENTE" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
        
      },
      {
        orig: "btnsGestionCobranza",
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

    setTimeout(()=> {
      // this.cargarLiquidaciones();
      // this.getConceptos();
      this.validaPermisos();
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {

      case "EXCEL":
        this.exportarExcel()
      break;

      case "GENERAR EXPEDIENTE":
        this.generarExpedientes()
        break;
    
      case "ENVIAR CORREO":
        this.enviarCorreos()
        break;

      case "CONSULTAR POR LOTE":
        this.modalExpedienteContribuyente()
        break;
    
      default:
        break;
    }
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.cargarLiquidaciones();
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.cargarLiquidaciones()
  }

  validaPermisos() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fCoacEmiExpediente,
      id_rol: this.dataUser.id_rol,
    };

    this.mensajeSpinner = "Verificando permisos del usuario...";
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
        this.toastr.info(error.error.message, 'Error cargando Permisos');
      }
    );
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Cargando Catalogs";
    this.apiSrv.getCatalogs({params: "'COB_TIPO_GESTION','CAT_SECTOR','REN_MERCADO'"}).subscribe(
      (res: any) => {
        // console.log(res.data);
        res.data.COB_TIPO_GESTION.forEach(e => {
          const { valor, descripcion } = e;
          if (valor != 'CONVENIO') this.gestiones = [...this.gestiones, {valor: valor, descripcion: descripcion}]
        })
        res.data.CAT_SECTOR.forEach(e => {
          const { valor, descripcion } = e;
          this.sectores.push({valor: valor, descripcion: descripcion})
        })
        res.data.REN_MERCADO.forEach(e => {
          const { id_catalogo, valor, descripcion } = e;
          this.mercados.push({ id_catalogo: id_catalogo, valor: valor, descripcion: descripcion })
        })
        // this.lcargando.ctlSpinner(false);
        this.cargarConceptos()
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarConceptos() {
    this.mensajeSpinner = 'Cargando Conceptos'
    this.apiSrv.getConceptos().subscribe(
      (res: any) => {
        res.data.forEach(e => {
          const { id_concepto, nombre, codigo } = e
          if (codigo != 'AN' && codigo != 'BA' && codigo != 'CU') {
            this.conceptos = [...this.conceptos, {id_concepto, nombre}]
          }
        })
        this.cargarLiquidaciones()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  cargarLiquidaciones(){
    this.mensajeSpinner = "Cargando listado de expedientes...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getNotificacionCobro({params: {tipo:"GESTION", filter: this.filter, paginate: this.paginate } }).subscribe(
      (res: any) => {
        console.log(res);
        if (Array.isArray(res.data) && !res.data.length) {
          this.lcargando.ctlSpinner(false)
          return;
        }
        
        this.paginate.length = res['data']['total'];

        this.liquidacionesDt = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
        this.liquidacionesDt.forEach((element: any) => {
          const vencido = moment().diff(moment(element.fecha_recepcion))
          Object.assign(element, { check: false, vencido: vencido })
        });
        
        setTimeout(() => {
          this.lcargando.ctlSpinner(false);
        }, 2500)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message);
      }
    );
  }

  consultarLiquidaciones() {
    this.paginate.page = 1
    if (this.filter.razon_social) {
      this.filter.razon_social = this.filter.razon_social.trim().length > 0 ? this.filter.razon_social.trim() : null
    }

    this.cargarLiquidaciones()
  }

  generarExpedientes() {
    let process = this.liquidacionesDt.filter((e: any) => e.check == true && ['R', 'G'].includes(e.estado) && e.expediente == false)

    if (!process.length) {
      this.toastr.warning('No hay regsitros a procesar', this.fTitle)
      return
    }

    Swal.fire({
      title: this.fTitle,
      text: `Esta seguro de procesar ${process.length} registros?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Procesar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = 'Generando Expedientes'
        this.lcargando.ctlSpinner(true)
        this.apiSrv.generarExpedientes({ titulos: process, fecha_emision: this.fecha_emision }).subscribe(
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

    // this.commonVrs.modalDetallesCobro.next({detalles: detalles, deuda: deuda})
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
  }

  limpiarFiltros() {
    this.filter = {
      gestion: 0,
      mercado: 0,
      estado: 0,
      concepto: 0,
      razon_social: null,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
    }
    // this.cargarLiquidaciones();
  }

  enviarCorreos() {
    Swal.fire({
      title: this.fTitle,
      text: "Se enviarán notificaciones al correo de los contribuyentes.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire('Correos enviados', '', 'success')
      }
    })
  }

  checkIndetereminate() {
    const someSelected = this.liquidacionesDt.reduce((acc, curr) => acc | curr.check, 0)
    const allSelected = this.liquidacionesDt.reduce((acc, curr) => acc & curr.check, 1)

    this.masterIndeterminate = !!(someSelected && !allSelected)
    this.masterSelected = !!allSelected
  }

  selectAll() {
    this.masterIndeterminate = false
    this.liquidacionesDt.map((e: any) => { if (e.expediente == 0) e.check = this.masterSelected })
  }

  generarLote(){


  }

  modalExpedienteContribuyente() {
    const modal = this.modalService.open(ModalExpedienteContribuyenteComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    //modal.componentInstance.juicio = juicio
    //modal.componentInstance.permissions = this.permissions
  }

  exportarExcel() {
    console.log(this.liquidacionesDt);
    let excelData = []
    this.liquidacionesDt.forEach((liquidacion: any) => {
      const { id_cob_notificacion,tipo_gestion, total, fecha, estado, notificador, ...items } = liquidacion;
      const { razon_social, num_documento, codigo_sector, ...contribuyente  } = liquidacion.contribuyente;
      const {nombre} = liquidacion.usuario == null ? '' : liquidacion.usuario
      // const { nombre, ...concepto } = liquidacion.concepto;

      const data = {
        Nor: id_cob_notificacion,
        Contribuyente: razon_social,
        Tipo_de_gestión: tipo_gestion,
        Total: total,
        Fecha: fecha,
        Usuario: nombre,
        Estado: estado == "P" ? "Pendiente" : estado == "R" ? "Recibido" : estado == "N" ? "No Recibido" : estado == "G" ? "Gaceta" : estado == "S" && "Sin Direccion",
        Notificador: notificador,
      }
      excelData.push(data)
    })
    this.excelService.exportAsExcelFile(excelData, 'Gestión_de_Notificaciones');
  }



}
