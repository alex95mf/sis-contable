import { Component, OnInit, ViewChild } from '@angular/core';

import { ListPuestosComponent } from './list-puestos/list-puestos.component';
import { PuestoService } from './puesto.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { ModalPuestosComponent } from './modal-puestos/modal-puestos.component';

@Component({
standalone: false,
  selector: 'app-puesto',
  templateUrl: './puesto.component.html',
  styleUrls: ['./puesto.component.scss']
})
export class PuestoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  fTitle = "Puesto de Mercado"
  mensajeSpinner: string
  vmButtons = []
  dataUser: any
  permissions: any
  empresLogo: any

  puestos: any[] = []
  puesto = {
    id_mercado_puesto: null,
    numero_puesto: '',
    fk_mercado: 0,
    descripcion: '',
    ubicacion: '',
    estado: 0,
    id_usuario: 0
  }
  queryMode: boolean = false

  estados = [
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
  mercados = []

  paginate: any;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: PuestoService
  ) {
    this.commonVarService.editPuestoMercado.asObservable().subscribe(
      res => {
        this.puesto = res;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = false;
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsMerPuesto",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsMerPuesto",
        paramAccion: "",
        boton: { icon: "fa fa-pencil-square-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsMerPuesto",
        paramAccion: "",
        boton: { icon: "fa fa-file-pdf-o", texto: "ACTUALIZAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsMerPuesto",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20]
    }

    setTimeout(() => {
      this.validaPermisos();
    }, 150)
  }

  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fPuestoMercado,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            this.getMercados();
            // this.getPuestos();
          }, 150)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "BUSCAR":
        this.mostrarListaMercados();
        break;
      case "GUARDAR":
        this.validarFormulario("GUARDAR");
        break;
      case "ACTUALIZAR":
        this.validarFormulario("MODIFICAR");
        break;
      case "CANCELAR":
        this.cancelForm();
        break;
      default:
        break;
    }
  }

  getPuestos() {
    let data = {
      params: {
        paginate: this.paginate,
      }
    }

    (this as any).mensajeSpinner = 'Cargando Puestos de Mercados'
    this.lcargando.ctlSpinner(true);

    this.apiService.getPuestos(data).subscribe(
      (res: any) => {
        this.paginate.length = res.data.length
        if (res.data.current_page == 1) {
          this.puestos = res.data.data;
         } else {
          this.puestos = Object.values(res.data.data);
         }
         this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error('Error cargando Puestos de Mercados', this.fTitle)
      }
    )
  }

  getMercados = () => {
    (this as any).mensajeSpinner = 'Obteniendo Mercados'
    this.lcargando.ctlSpinner(true);

    this.apiService.getMercados().subscribe(
      res => {
        this.mercados = res["data"]["REN_MERCADO"];
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Mercados');
      }
    )
  }

  mostrarListaMercados = () => {
    const modal = this.modalService.open(ModalPuestosComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
  }

  async validarFormulario(accion: String) {
    if(this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para agregar puestos de mercado.");
    } else if (this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar este puesto de mercado.", this.fTitle);
    } else {
      let resp = await this.validarPuesto().then((respuesta) => {
        if(respuesta) {
          if(accion=="GUARDAR"){
            this.guardarPuesto();
          } else if (accion==="MODIFICAR"){
            this.editarPuesto();
          }
  
          }
        });
      }
  }

  guardarPuesto() {
    // Valida que se hayan ingresado los datos minimos (OM: Revisar que valide correctamente)
    this.validarPuesto().then(
      (_) => {
        Swal.fire({
          title: "¡Atención!",
          text: "¿Seguro que desea guardar este Puesto de Mercado?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#DC3545",
          confirmButtonColor: "#13A1EA",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.value) {
            (this as any).mensajeSpinner = 'Guardando cambios'
            this.lcargando.ctlSpinner(true);
            this.apiService.savePuesto({puesto: this.puesto}).subscribe(
              res => {
                this.puesto = res["data"];
                this.vmButtons[1].habilitar = true;
                this.vmButtons[2].habilitar = false;
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  title: "Operación exitosa",
                  text: res["message"],
                  icon: "success",
                })
              },
              err => {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  title: "¡Error!",
                  text: err.error.message,
                  icon: "warning",
                })
              }
            );
          }
        });
      }
    )

    
  }

  editarPuesto = () => {
    // Valida que se hayan ingresado los datos minimos
    // this.validarPuesto();

    Swal.fire({
      title: "¡Atención!",
      text: "¿Seguro que desea cambiar la información de este Puesto de Mercado?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        (this as any).mensajeSpinner = 'Editando información'
        this.lcargando.ctlSpinner(true);
        this.apiService.updatePuesto({puesto: this.puesto}).subscribe(
          res => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Operación exitosa",
              text: res["message"],
              icon: "success",
            })
          },
          err => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "¡Error!",
              text: err.error.message,
              icon: "warning",
            })
          }
        );
      }
    });
  }

  validarPuesto() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.puesto.numero_puesto == "" ||
        this.puesto.numero_puesto == undefined
      ) {
        this.toastr.info("Ingrese un número de local para el Puesto");
        flag = true;
      } else if (this.puesto.fk_mercado == 0) {
        this.toastr.info("Seleccione un mercado");
        flag = true;
      } else if (this.puesto.estado == 0) {
        this.toastr.info("Seleccione el estado del puesto");
        flag = true;
      } else if (
        this.puesto.descripcion == "" ||
        this.puesto.descripcion == undefined
      ) {
        this.toastr.info("Ingrese una descripción para el Puesto");
        flag = true;
      } else if (
        this.puesto.ubicacion == "" ||
        this.puesto.ubicacion == undefined
      ) {
        this.toastr.info("Ingrese la ubicación del Puesto");
        flag = true;
      } 
      !flag ? resolve(true) : resolve(false);
    });
  }

  cancelForm = () => {
    this.puesto = {
      id_mercado_puesto: null,
      numero_puesto: '',
      fk_mercado: 0,
      descripcion: '',
      ubicacion: '',
      estado: 0,
      id_usuario: 0
    }
    this.queryMode = false
    this.vmButtons[1].habilitar = false
    this.vmButtons[2].habilitar = true
  }

  changePaginate(event: any) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getPuestos();
  }

}
