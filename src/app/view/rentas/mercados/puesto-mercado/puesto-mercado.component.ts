import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { PuestoMercadoService } from './puesto-mercado.service';
import * as myVarGlobals from "../../../../global";

import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PuestoMercadoFormComponent } from './puesto-mercado-form/puesto-mercado-form.component';
import { CommonService } from 'src/app/services/commonServices';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';

@Component({
standalone: false,
  selector: 'app-puesto-mercado',
  templateUrl: './puesto-mercado.component.html',
  styleUrls: ['./puesto-mercado.component.scss']
})
export class PuestoMercadoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = "Puestos de Mercado";
  mensajeSpinner: string = "Cargando...";
  dataUser: any
  permissions: any;
  vmButtons: any[] = [];

  puestos: any[] = [];
  mercados: any[] = [];

  paginate: any;
  filter: any;

  estados: any[] = [
    {
      value: 'D',
      descripcion: 'Disponible',
    },
    {
      value: 'A',
      descripcion: 'Alquilado',
    },
    {
      value: 'I',
      descripcion: 'Inactivo',
    }
  ]

  constructor(
    private commonVarService: CommonVarService,
    private apiService: PuestoMercadoService,
    private toastr: ToastrService,
    private modalSrv: NgbModal,
    private commonService: CommonService,
    private excelService: ExcelService,
  ) {
    this.commonVarService.needRefresh.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargaPuestos();
        }
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsPuestoMercado",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsPuestoMercado",
        paramAccion: "",
        boton: { icon: "fa fa-file-pdf", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsPuestoMercado",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false,
      }
    ]

    this.filter = {
      num_local: null,
      mercado: null,
      descripcion: null,
      estado: null,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    }

    setTimeout(() => {
      this.validaPermisos();

    }, 0)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.showPuestoMercadoForm(true);
        break;

      case "PDF":
        this.exportarPDF()
        break;

      case "EXCEL":
        this.exportarExcel()
        break;

      default:
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))

    let params = {
      codigo: myVarGlobals.fPuestoMercado,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        }
        else {
          setTimeout(() => {
            this.getMercados();
          }, 0)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  exportarPDF = () => {
    window.open(`${environment.ReportingUrl}rpt_lista_puestos_mercados.pdf?j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&p_numero_puesto=${this.filter.num_local ?? ""}&p_mercado=${this.filter.mercado ?? ""}&p_estado=${this.filter.estado ?? "T"}&p_descripcion=${this.filter.descripcion ?? ""}`)
  }

  exportarExcel = () => {
    if (this.permissions.exportar === 0) {
      this.toastr.warning('No tiene permisos para Exportar')
      return
    }

    let excelData = []
    (this as any).mensajeSpinner = 'Exportando Puestos de Mercado'
    this.lcargando.ctlSpinner(true)
    this.apiService.getPuestos({params: { filter: this.filter }}).subscribe(
      (res: any) => {
        console.log(res)
        res.data.forEach((element: any) => {
          const { numero_puesto, mercado: { valor }, descripcion, ubicacion, estado, id_usuario: { nombre }, created_at } = element;
          const puesto = {
            NumLocal: numero_puesto,
            Mercado: valor,
            Descripcion: descripcion,
            Ubicacion: ubicacion,
            Estado: (estado == 'D') ? 'Disponible' : (estado == 'A') ? 'Alquilado' : (estado == 'I') ? 'Inactivo' : 'Desconocido',
            Usuario: nombre,
            FechaCreacion: created_at.split('T')[0]
          }
          excelData.push(puesto)
        });
        this.excelService.exportAsExcelFile(excelData, 'PuestosMercado')
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.warning(err.error.message, 'Error expotando Puestos de Mercado')
      }
    )

  }

  consultarPuestos() {
    Object.assign(this.paginate, { page: 1 })

    this.lcargando.ctlSpinner(true)
    this.cargaPuestos()
  }

  cargaPuestos() {

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    (this as any).mensajeSpinner = 'Cargando Puestos...';
    // this.lcargando.ctlSpinner(true);

    this.apiService.getPuestos(data).subscribe(
      (res: any) => {
        // console.log(res);
        this.paginate.length = res.data.total;
        this.puestos = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
        this.puestos.map((e: any) => e.created_at = moment(e.created_at).format('YYYY-MM-DD'))

        // this.getMercados();
        this.lcargando.ctlSpinner(false)
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getMercados = () => {
    (this as any).mensajeSpinner = 'Obteniendo Mercados'
    this.lcargando.ctlSpinner(true);

    this.apiService.getMercados().subscribe(
      (res: any) => {
        res.data.REN_MERCADO.forEach((element: any) => {
          const { id_catalogo, valor, descripcion } = element
          this.mercados = [...this.mercados, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
        });
        // this.lcargando.ctlSpinner(false);
        this.cargaPuestos()
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Mercados');
      }
    )
  }

  showPuestoMercadoForm(isNew: boolean, data?: any) {
    const modalInvoice = this.modalSrv.open(PuestoMercadoFormComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fPuestoMercado;
    modalInvoice.componentInstance.fTitle = this.fTitle;
    modalInvoice.componentInstance.isNew = isNew;
    modalInvoice.componentInstance.data = data;
    modalInvoice.componentInstance.mercados = this.mercados;
    modalInvoice.componentInstance.permissions = this.permissions;
  }

  deletePuesto(id, i) {
    Swal.fire({
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar este Puesto de Mercado?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        (this as any).mensajeSpinner = 'Eliminando elemento';
        this.lcargando.ctlSpinner(true);
        this.apiService.deletePuesto({ id_mercado_puesto: id }).subscribe(
          res => {
            // this.puestos.splice(i, 1); ahora no se borra porque es eliminado logico
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Operación exitosa",
              text: res["message"],
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                this.cargaPuestos();
              }
            });
          },
          err => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "¡Error!",
              text: err.error.message,
              icon: "warning",
            })
          }
        )
      }
    })
  }

  // editPuesto(puesto) {
  //   this.commonVarService.editPuestoMercado.next(puesto);
  //   this.activeModal.close();
  // }

  limpiarFiltros() {
    this.filter = {
      num_local: null,
      mercado: null,
      descripcion: null,
      estado: null,
      filterControl: ""
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);

    this.lcargando.ctlSpinner(true)
    this.cargaPuestos();
  }

}

