import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ConceptoDetFormComponent } from './concepto-det-form/concepto-det-form.component';
import { ConceptoDetService } from './concepto-det.service';
import * as variablesGlobales from "../../../../global";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: 'app-concepto-det',
  templateUrl: './concepto-det.component.html',
  styleUrls: ['./concepto-det.component.scss']
})
export class ConceptoDetComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  barra_carga: CcSpinerProcesarComponent;
  titulo: string = "Detalles de Conceptos";
  botonera: any = [];
  datos_usuario: any;
  permisos: any;
  
  concepto_detalle_dt: any = [];
  mostrar_inactivo = false;

  paginate: any;
  filter: any;

  lista_conceptos: any;

  constructor(
    private srvConceptoDet: ConceptoDetService,
    private srvComun: CommonService,
    private srvTostar: ToastrService,
    private srvVarCom: CommonVarService,
    private modal: NgbModal,
    private toastr: ToastrService,
  ) {
    this.srvVarCom.editConceptoDet.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargarConceptosDet();
        }
      }
    );
   }

  ngOnInit(): void {
    this.botonera = [
      {
        orig: "btnsConceptoDet",
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
        orig: "btnsConceptoDet",
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

    this.filter = {
      nombre_detalle: undefined,
      codigo_detalle: undefined,
      concepto:  undefined,
      estado: ['A', 'I'],
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(()=> {
      this.validaPermisos();
    }, 0);
  }

  validaPermisos() {
    this.texto_barra_carga = "Verificando permisos del usuario...";
    this.barra_carga.ctlSpinner(true);

    this.datos_usuario = JSON.parse(localStorage.getItem("Datauser"));

    let parametros = {
      codigo: variablesGlobales.fConceptoDet,
      id_rol: this.datos_usuario.id_rol
    };

    this.srvComun.getPermisionsGlobas(parametros).subscribe(
      (res) => {
        this.permisos = res["data"][0];
        if (this.permisos.ver == "0") {
          this.barra_carga.ctlSpinner(false);
          this.srvTostar.warning("No tiene permisos para ver este formulario.", this.titulo);
          this.botonera = [];
        } else {
          this.cargarConceptosDet();
          this.llenarConceptos();
        }
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }


  llenarConceptos() {
    this.texto_barra_carga = "Cargando conceptos...";
    this.barra_carga.ctlSpinner(true);

    this.srvConceptoDet.getConceptos().subscribe(
      (res: any) => {
        this.lista_conceptos = res.data;
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  //poner estas dos validaciones en donde se esta cayendo,
  cargarConceptosDet() {
    this.texto_barra_carga = "Cargando listado de Conceptos...";
    this.barra_carga.ctlSpinner(true);

    //*debo agregar estas 2 validaciones en mi boton de consultas en donde se esta cayendo
    if (this.filter.nombre_detalle !== undefined && !this.filter.nombre_detalle.trim().length) {
      this.filter.nombre_detalle = undefined
    }

    if (this.filter.codigo_detalle !== undefined && !this.filter.codigo_detalle.trim().length) {
      this.filter.codigo_detalle = undefined
    }
    //*
    
    let datos = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    };

    this.srvConceptoDet.obtenerConceptosDetCodigo(datos).subscribe(
      (res) => {
        console.log(res);  
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.concepto_detalle_dt = res['data']['data'];
        } else {
          this.concepto_detalle_dt = Object.values(res['data']['data']);
        }
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

  metodoGlobal(evento) {
    switch (evento.items.boton.texto) {
      case " NUEVO":
        this.formularioConceptoDet(true, {});
        break;
      case " MOSTRAR INACTIVOS":
        this.mostrarInactivos(this.mostrar_inactivo);
        break;
    }
  }

  formularioConceptoDet(esNuevo:boolean, dato?:any) {
    console.log(dato)
    if (!esNuevo && this.permisos.consultar == "0") {
      this.srvTostar.warning("No tiene permisos para consultar Conceptos detalle.", this.titulo);
    } else if (esNuevo && this.permisos.guardar == "0") {
      this.srvTostar.warning("No tiene permisos para crear Conceptos detalle.", this.titulo);
    } else {
      const invocar_modal = this.modal.open(ConceptoDetFormComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      invocar_modal.componentInstance.modulo = variablesGlobales.fConcepto;
      invocar_modal.componentInstance.titulo = this.titulo;
      invocar_modal.componentInstance.esNuevo = esNuevo;
      invocar_modal.componentInstance.dato = dato;
      invocar_modal.componentInstance.permisos = this.permisos;
    }
  }

  borrarConceptoDet(id) {
    if (this.permisos.eliminar == "0"){
      this.srvTostar.warning("No tiene permisos para eliminar Conceptos Detalle.", this.titulo);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar este Detalle de Concepto?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74'
      }).then((result) => {
        if (result.isConfirmed) {
          this.texto_barra_carga = "Eliminando concepto..."
          this.barra_carga.ctlSpinner(true);
          this.srvConceptoDet.borrarConcepto(id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.barra_carga.ctlSpinner(false);
                this.cargarConceptosDet();
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

  mostrarInactivos(mostrar) {
    if (mostrar) {
      this.botonera[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A', 'I'];
    } else {
      this.botonera[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['I'];
    }
    this.mostrar_inactivo = !this.mostrar_inactivo;
    this.cargarConceptosDet();
  }

  limpiarFiltros() {
    this.filter.nombre_detalle = undefined;
    this.filter.codigo_detalle = undefined;
    this.filter.concepto = undefined;
    // this.mostrarInactivos(true);
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarConceptosDet();
  }

}
