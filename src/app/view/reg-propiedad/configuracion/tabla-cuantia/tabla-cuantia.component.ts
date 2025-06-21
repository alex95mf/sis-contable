import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import * as variablesGlobales from "../../../../global";
import Swal from "sweetalert2/dist/sweetalert2.js";

import { TablaCuantiaFormComponent } from './tabla-cuantia-form/tabla-cuantia-form.component';
import { TablaCuantiaService } from './tabla-cuantia.service';
import { CommonVarService } from 'src/app/services/common-var.services';
import moment from "moment";

@Component({
standalone: false,
  selector: 'app-tabla-cuantia',
  templateUrl: './tabla-cuantia.component.html',
  styleUrls: ['./tabla-cuantia.component.scss']
})
export class TablaCuantiaComponent implements OnInit {

  mensajeH: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false})
  etiquetaCargando: CcSpinerProcesarComponent;
  tituloF: string = "Tabla de cuantia";

  botonesPermisos: any = [];
  datosUsuario: any;
  permisos: any;

  cuantiaDt: any = [];
  selEstado = 0;
  listaEstados = [
    {
      value: 'A',
      label: 'Activo'
    },
    {
      value: 'I',
      label: 'Inactivo'
    },
    {
      value: 0,
      label: 'Todos'
    }
  ];

  tipoList = [
    {value: 0,label: 'TODOS'},
    {value: 'RP',label: 'Registro de la Propiedad'},
    {value: 'PAT',label: 'Patente'},
    {value: 'IR',label: 'Impuesto a la Renta'},
    {value: 'URBANO',label: 'Predio Urbano'},
    {value: 'RURAL',label: 'Predio Rural'},
    {value: 'GASTOS_PERSONALES',label: 'Gastos Personales'},
    {value: 'EXONERACION_DISCAPACIDAD',label: 'Exoneracion Discapacidad'}
  ]

  paginacion: any;
  filtro: any;

  cmb_periodo: any[] = []
  periodo: any


  constructor(
    private st: ToastrService,
    private sc: CommonService,
    private svc: CommonVarService,
    private stc: TablaCuantiaService,
    private mod: NgbModal,
  ) {
    this.svc.editCuantia.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargarCuantias();
        }
      }
    );
  }

  ngOnInit(): void {
    this.botonesPermisos = [
      {
        orig: "btnsTablaCuantia",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsTablaCuantia",
        paramAccion: "",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsTablaCuantia",
        paramAccion: "",
        boton: { icon: "fa fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      },
    ];

    this.filtro = {
      estado: ['A'],
      control: "",
      tipo:0,
      periodo: undefined

    };

    // this.paginacion = {
    //   longitud: 0,
    //   perPage: 10,
    //   page: 1,
    //   opcionesTamPagina: [2, 5, 10, 20, 50]
    // };


    setTimeout(async () => {
      this.validarPermisos();
      await this.cargaInicial()
    }, 0)
  }

  validarPermisos() {
    this.mensajeH = "Verificando permisos del usuario...";
    this.etiquetaCargando.ctlSpinner(true);

    this.datosUsuario = JSON.parse(localStorage.getItem("Datauser"));

    let param = {
      codigo: variablesGlobales.fRPTCuantia,
      id_rol: this.datosUsuario.id_rol
    };

    this.sc.getPermisionsGlobas(param).subscribe(
      (res) => {
        this.permisos = res["data"][0];
        if (this.permisos.ver == "0") {
          this.etiquetaCargando.ctlSpinner(false);
          this.st.warning("No tiene permisos para ver este formulario.", this.tituloF);
          this.botonesPermisos = [];
        } else {
          this.cargarCuantias();
        }
      },
      (error) => {
        this.etiquetaCargando.ctlSpinner(false);
        this.st.info(error.error.message);
      }
    );
  }

  async cargaInicial() {
    try {
      this.mensajeH = "Carga Inicial"
      const resPeriodos = await this.stc.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos

    } catch (err) {
      console.log(err)
      this.st.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }

  cargarCuantias() {
    this.mensajeH = "Cargando lista de Cuantias...";
    this.etiquetaCargando.ctlSpinner(true);

    let datos = {
      params: {
        filter: this.filtro,
      }
    }

    this.stc.obtenerCuantiasData(datos).subscribe(
      (res) => {
        this.cuantiaDt = res['data'];
        this.etiquetaCargando.ctlSpinner(false);
      },
      (error) => {
        this.etiquetaCargando.ctlSpinner(false);
        this.st.info(error.error.error);
      }
    );
  }

  metodoGlobal(evento) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.mostrarFormularioCuantia(true);
        break;
      case "CONSULTAR":
        this.cargarCuantias();
        break;
      case "LIMPIAR":
        this.limpiarFiltros();
        break;
    }
  }

  limpiarFiltros() {
    this.filtro.estado = ['A'];
    this.selEstado = 0;
    this.cargarCuantias();
  }

  mostrarFormularioCuantia(esNuevo: any, data?: any) {
    // if (esNuevo && (this.filtro.tipo == 0 || this.filtro.tipo == null)) {
    //   Swal.fire('No ha seleccionado un Tipo', '', 'warning')
    //   return;
    // }

    if (!esNuevo && this.permisos.consultar == "0") {
      this.st.warning("No tiene permisos para consultar rangos.", this.tituloF);
    } else if  (esNuevo && this.permisos.guardar == "0") {
      this.st.warning("No tiene permisos para guardar rangos.", this.tituloF);
    } else {
      const modalCuantia = this.mod.open(TablaCuantiaFormComponent, {
        size: "l",
        backdrop: "static",
        windowClass: "viewer-content-general"
      });
      modalCuantia.componentInstance.comp_mod = variablesGlobales.fRPTCuantia;
      modalCuantia.componentInstance.tituloF = this.tituloF;
      modalCuantia.componentInstance.esNuevo = esNuevo;
      modalCuantia.componentInstance.data = data;
      modalCuantia.componentInstance.permisos = this.permisos;
      //modalCuantia.componentInstance.tipo = (esNuevo) ? this.filtro.tipo : data.tipo;
      modalCuantia.componentInstance.cmb_periodo =this.cmb_periodo
    }
  }

  eliminarCuantia(id) {
    if (this.permisos.eliminar == "0") {
      this.st.warning("No tiene permisos para eliminara cuantias.", this.tituloF);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar esta Cuantia?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeH = "Eliminando cuantia";
          this.etiquetaCargando.ctlSpinner(true);
          this.stc.eliminarCuantia(id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.etiquetaCargando.ctlSpinner(false);
                this.cargarCuantias();
                Swal.fire({
                  icon: "success",
                  title: "Registro Eliminado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              } else {
                this.etiquetaCargando.ctlSpinner(false);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              }
            },
            (error) => {
              this.etiquetaCargando.ctlSpinner(false);
              this.st.info(error.error.message);
            }
          );
        }
      });
    }
  }

  cambiar(evento) {
    if (evento != 'T') {
      let temp = [];
      temp.push(evento);
      this.filtro.estado = temp;
      temp = [];
    } else {
      this.filtro.estado = undefined;
    }
    this.filtro.estado = undefined;
  }

  cambiarPagina(evento) {

  }
}
