import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { CategoriasEspPublicitariosService } from './categorias-esp-publicitarios.service';
import * as variablesGlobales from "../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { FormCategoriasEspacioPublicitarioComponent } from './form-categorias-espacio-publicitario/form-categorias-espacio-publicitario.component';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
standalone: false,
  selector: 'app-categorias-esp-publicitarios',
  templateUrl: './categorias-esp-publicitarios.component.html',
  styleUrls: ['./categorias-esp-publicitarios.component.scss']
})
export class CategoriasEspPublicitariosComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  barra_carga: CcSpinerProcesarComponent;

  titulo = "Categorias Espacios Publicitarios";
  botonera: any = [];
  datos_usuario: any;
  permisos: any;

  cat_esp_Pub_dt: any = [];
  mostrar_inactivo = false;

  paginate: any;
  filtro: any;

  constructor(
    private srvCatEspPub: CategoriasEspPublicitariosService,
    private srvCom: CommonService,
    private srvTostar: ToastrService,
    private srvVarCom: CommonVarService,
    private modal: NgbModal
  ) {
    this.srvVarCom.editCategoriasEspPublicitario.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargarCategoriasEspPublicitarios();
        }
      }
    );
   }

  ngOnInit(): void {
    console.log("Iniciando Categorias de Esp Publicitarios");
    this.botonera = [
      {
        orig: "btnsCategoriasEspPublicitarios",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsCategoriasEspPublicitarios",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false
      }
    ];

    this.filtro = {
      nombre: undefined,
      estado: ['A']
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [2, 5, 10, 20, 50]
    };

    setTimeout(()=> {
      this.validarPermisos();
    }, 0);
  }

  validarPermisos() {
    this.texto_barra_carga = "Verificando permisos del usuario...";
    this.barra_carga.ctlSpinner(true);

    this.datos_usuario = JSON.parse(localStorage.getItem("Datauser"));

    let parametros = {
      codigo: variablesGlobales.fRPEspPublicitarios,
      id_rol: this.datos_usuario.id_rol,
    };

    this.srvCom.getPermisionsGlobas(parametros).subscribe(
      (res) => {
        this.permisos = res["data"][0];
        if (this.permisos.ver == "0") {
          this.barra_carga.ctlSpinner(false);
          this.srvTostar.warning("No tiene permisos para ver este formulario.", this.titulo);
          this.botonera = [];
        } else {
          this.cargarCategoriasEspPublicitarios();
        }
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

  cargarCategoriasEspPublicitarios() {
    this.texto_barra_carga = "Cargando lista de categorias de espacios publicitarios...";
    this.barra_carga.ctlSpinner(true);

    let datos = {
      params: {
        filter: this.filtro,
        paginate: this.paginate
      }
    };
    
    this.srvCatEspPub.obtenerCategoriasEspPublicitarios(datos).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.cat_esp_Pub_dt = res['data']['data'];
        } else {
          this.cat_esp_Pub_dt = Object.values(res['data']['data']);
        }
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

  borrarCategoriasEspPublicitarios(id_categorias_esp) {

  }

  mostrarFormularioCatEspPub(esNuevaCatEspPub, dato?:any) {
    if (!esNuevaCatEspPub && this.permisos.consultar == "0") {
      this.srvTostar.warning("No tiene permisos para consultar Categorias de Espacios Publicitarios.", this.titulo);
    } else if (esNuevaCatEspPub && this.permisos.guardar == "0") {
      this.srvTostar.warning("No tiene permisos para crear Categorias de Espacios Publicitarios.", this.titulo);
    } else {
      const modal = this.modal.open(FormCategoriasEspacioPublicitarioComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modal.componentInstance.module_comp = variablesGlobales.fRPEspPublicitarios;
      modal.componentInstance.titulo = this.titulo;
      modal.componentInstance.esNuevaCatEspPub = esNuevaCatEspPub;
      modal.componentInstance.dato = dato;
      modal.componentInstance.permisos = this.permisos;
    }
  }

  limpiarFiltros() {
    this.filtro.descripcion = undefined;
    this.cargarCategoriasEspPublicitarios();
  }

  metodoGlobal(evento) {
    switch (evento.items.boton.texto) {
      case " NUEVO":
        this.mostrarFormularioCatEspPub(true, {});
        break;
      case " MOSTRAR INACTIVOS":
        this.cambiarMostrarInactivos(this.mostrar_inactivo);
        break;
    }
  }

  cambiarMostrarInactivos(mostrarInactivo) {
    if (mostrarInactivo) {
      this.botonera[1].boton.icon = 'far fa-square';
      this.filtro.estado = ['A'];
    } else {
      this.botonera[1].boton.icon = 'far fa-check-square';
      this.filtro.estado = ['A', 'I'];
    }
    this.mostrar_inactivo = !this.mostrar_inactivo;
    this.cargarCategoriasEspPublicitarios();
  }

  borrarCategoriaEspPublicitarios(id_categorias_esp) {
    if (this.permisos.eliminar == "0"){
      this.srvTostar.warning("No tiene permisos para eliminar la Categoria de Espacios Publicitarios.", this.titulo);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar este Concepto?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74'
      }).then((result) => {
        if (result.isConfirmed) {
          this.texto_barra_carga = "Eliminando Categoria de Espacios Publicitarios..."
          this.barra_carga.ctlSpinner(true);
          this.srvCatEspPub.borrarCategoriasEspPublicitarios(id_categorias_esp).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.barra_carga.ctlSpinner(false);
                this.cargarCategoriasEspPublicitarios();
                Swal.fire({
                  icon: "success",
                  title: "Registro Eliminado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8'
                });
              } else {
                this.barra_carga.ctlSpinner(false);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8'
                });
              }
            },
            (error) => {
              this.barra_carga.ctlSpinner(false);
              this.srvTostar.info(error.error.message);
            }
          )
        }
      });
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarCategoriasEspPublicitarios();
  }

}
