import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';

import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
// import * as myVarGlobals from "../../../../../global";

import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { ModalEditionComponent } from './modal-edition/modal-edition.component';
import { GestionExpedienteService } from './gestion-expediente.service';
import * as myVarGlobals from 'src/app/global';
import { environment } from 'src/environments/environment';
import { ExcelService } from 'src/app/services/excel.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: 'app-gestion-expediente',
  templateUrl: './gestion-expediente.component.html',
  styleUrls: ['./gestion-expediente.component.scss']
})
export class GestionExpedienteComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator
  mensajeSpinner: string = "Cargando...";
  fTitle: string = "Gestión de Expedientes"
  dataUser: any;
  permissions: any
  vmButtons: any[] = []
  paginate: any = {
    length: 0,
    perPage: 10,
    page: 1,
    pageSizeOptions: [5, 10, 15, 20]
  };

  filter: any = {
    contribuyente: null,
    expediente: null,
    sector: 0,
    estado: 'T',
    fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
    juicio: '0'
  };

  // Catalogos para Filtros
  sectores: any[] = []
  estados: any[] = [
    { id: 'T', nombre: 'TODOS' },
    { id: 'R', nombre: 'RECIBIDO' },
    { id: 'P', nombre: 'PENDIENTE' },
    { id: 'N', nombre: 'NO RECIBIDO' }
  ]
  cmbJuicio = [
    { value: '0', label: 'Sin Juicio' },
    { value: '1', label: 'En Juicio' },
  ]

  masterSelected: boolean = false

  // Datos a mostrar en tabla
  expedientes: any = [];

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: GestionExpedienteService,
    private excelService: ExcelService,
  ) {
    this.commonVrs.modalEditionDetallesCobro.asObservable().subscribe(
      (res: any) => {
        Object.assign(
          this.expedientes.find(e => e.id_cob_notificacion == res.id_cob_notificacion),
          res
        )
      }
    );
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsGestionExpediente",
        paramAction: "",
        boton: { icon: "fas fa-file-excel", texto: "EXPORTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(()=> {
      this.validaPermisos()
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXPORTAR":
        this.exportarExcel()
        break;
    }
  }

  validaPermisos() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTGestionExpediente,
      id_rol: this.dataUser.id_rol,
    };

    (this as any).mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", "Edicion Notificacion detalles");
          // this.vmButtons = [];
        } else {
          this.getCatalogos();
          // this.lcargando.ctlSpinner(false)
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    // this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogs({ params: "'CAT_SECTOR'" }).subscribe(
      (res: any) => {
        // this.lcargando.ctlSpinner(false)
        this.sectores = res.data.CAT_SECTOR
        this.getExpedientes()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  handleSelectJuicioFilter(event) {
    console.log(event);
  }

  changePaginate({pageIndex, pageSize}) {
    Object.assign(this.paginate, {perPage: pageSize, page: pageIndex + 1});
    this.getExpedientes();
  }

  getExpedientes(){
    (this as any).mensajeSpinner = "Cargando Expedientes...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getExpedientes({ params: { filter: this.filter, paginate: this.paginate }}).subscribe(
      (res: any) => {
        console.log(res);
        if (Array.isArray(res.data) && !res.data.length) {
          this.lcargando.ctlSpinner(false)
          return;
        }

        this.paginate.length = res.data.total;
        this.expedientes = res.data.data;

        /* if (res.data.current_page == 1) {
          this.expedientes = res.data.data;
        } else {
          this.expedientes = Object.values(res.data.data);
        } */
        this.expedientes.forEach((e: any) => {
          if (e.fecha_recepcion) {
            let f_rec = moment(e.fecha_recepcion)
            let today = moment()
            Object.assign(e, { vencimiento: today.diff(f_rec, 'days') })
          }
        })

        setTimeout(() => {
          this.lcargando.ctlSpinner(false);
        }, 2500)

      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message, 'Error cargando Expedientes');
        console.log(error);
      }
    );
  }

  selectAll() {
    this.expedientes.map((e: any) => e.juicio = this.masterSelected)
  }

  handleSearch() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.getExpedientes()
  }

  setJuicios() {
    let procesados = this.expedientes.filter(e => e.juicio == true && e.fecha_recepcion != null)

    Swal.fire({
      title: this.fTitle,
      text: `Se procesará ${procesados.length} registro(s).`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = "Procesando expedientes"
        this.lcargando.ctlSpinner(true);
        console.log({ expedientes: procesados })
        this.apiSrv.setJuicios({ expedientes: procesados }).subscribe(
          (res: any) => {
            console.log(res)
            this.expedientes = this.expedientes.filter(e => e.juicio == false)
            this.lcargando.ctlSpinner(false)
            Swal.fire('Juicios generados con éxito', '', 'success')
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error procesando Expedientes')
          }
        )
      }
    })
  }

  anularExpediente(expediente: any) {
    Swal.fire({
      title: this.fTitle,
      text: 'Seguro desea anular este Expediente?',
      icon: 'question',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Anular',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'No ha ingresado un motivo'
        }
      },
      preConfirm: (observacion) => {
        return this.apiSrv.anularExpediente({ expediente: expediente, observacion: observacion }).subscribe(
          (res: any) => {
            console.log(res.data)
            this.expedientes.find((e: any) => e.id_cob_notificacion == res.data.id_cob_notificacion).estado = res.data.estado
            this.lcargando.ctlSpinner(false)
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            Swal.showValidationMessage(
              `Hubo un error: ${err}`
            )
            // this.toastr.error(err.error.message, 'Error anulando Expediente')
          }
        )
      },
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire('Expediente anulado', '', 'success')
      }
    })

  }

  modalDetalles(expediente: any){
    const modal = this.modalSrv.open(ModalDetallesComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modal.componentInstance.expediente = expediente

  }

  modalEditDetalles(expediente: any){
    const modal = this.modalSrv.open(ModalEditionComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    modal.componentInstance.expediente = expediente
  }

  handleEnter(event) {
    if (event.keyCode == 13) this.getExpedientes()
  }

  descargarReporte(expediente: any) {
    // rpt_juzgado_coactiva, param: id_notificacion
    window.open(`${environment.ReportingUrl}rpt_juzgado_coactiva.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&id_notificacion=${expediente.id_cob_notificacion}`)
  }

  exportarExcel() {
    let excelData = []
    (this as any).mensajeSpinner = 'Exportando'
    this.lcargando.ctlSpinner(true);

    this.apiSrv.getExpedientes({ params: { filter: this.filter }}).subscribe(
      (res: any) => {
        res.data.forEach((liquidacion: any) => {
          const { id_cob_notificacion,tipo_gestion, total, fecha, estado, notificador, fecha_recepcion, ...items } = liquidacion;
          const { razon_social, num_documento, codigo_sector, ...contribuyente  } = liquidacion.contribuyente;
          const { nombre } = liquidacion.usuario == null ? '' : liquidacion.usuario

          const data = {
            NumNotificacion: id_cob_notificacion,
            Contribuyente: razon_social,
            TipoGestion: tipo_gestion,
            Total: total,
            Fecha: fecha,
            Usuario: nombre,
            Estado: estado == "P" ? "Pendiente" : estado == "R" ? "Recibido" : estado == "N" ? "No Recibido" : estado == "G" ? "Gaceta" : estado == "S" ? "Sin Direccion" : estado == 'X' ? 'Anulado' : 'Desconocido',
            Notificador: notificador,
            FechaRecepcion: fecha_recepcion,
          }
          excelData.push(data)
        })
        this.excelService.exportAsExcelFile(excelData, `ExpedientesEmitidos_${moment().format('YYYYMMDD')}`);
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message, 'Error cargando Expedientes');
      }
    )
  }

  limpiarFiltros() {
    this.filter = {
      contribuyente: null,
      sector: 0,
      estado: 0,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      juicio: 0,
    }
  }
}
