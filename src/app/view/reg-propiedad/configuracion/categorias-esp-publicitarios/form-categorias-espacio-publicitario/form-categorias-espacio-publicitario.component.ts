import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { CategoriasEspPublicitariosService } from '../categorias-esp-publicitarios.service';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: 'app-form-categorias-espacio-publicitario',
  templateUrl: './form-categorias-espacio-publicitario.component.html',
  styleUrls: ['./form-categorias-espacio-publicitario.component.scss']
})
export class FormCategoriasEspacioPublicitarioComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) 
  barra_carga: CcSpinerProcesarComponent;

  datos_usuario: any;

  @Input() modulo: any;
  @Input() esNuevaCatEspPub: any;
  @Input() dato: any;
  @Input() permisos: any;
  @Input() titulo: any;

  botonera: any;

  categoria_esp_publicitario: any = {};

  necesita_refrescar: any;

  lista_tipos: any = [];

  lista_estados: any = [];

  constructor(
    public modal: NgbActiveModal,
    private srvTostar: ToastrService,
    private commonService: CommonService,
    private srvCatEspPub: CategoriasEspPublicitariosService,
    private srvVarCom: CommonVarService,
  ) { }

  ngOnInit(): void {
    this.botonera = [
      {
          orig: "btnsFormCategoriasEspPublicitarios",
          paramAccion: "",
          boton: { icon: "fas fa-save", texto: " GUARDAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-success boton btn-sm",
          habilitar: false
      },
      {
          orig: "btnsFormCategoriasEspPublicitarios",
          paramAccion: "",
          boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false
      }
    ];
    this.datos_usuario = JSON.parse(localStorage.getItem("Datauser"));
    this.lista_estados = [
      {
          valor: "A",
          etiqueta: "Activo"
      },
      {
          valor: "I",
          etiqueta: "Inactivo"
      }
    ];
    this.categoria_esp_publicitario = {
      codigo: 0,
      grupo: "",
      tipo: 0,
      nombre: "",
      formula: "",
      medida_desde: 0,
      medida_hasta: 0,
      excedente_desde: 0,
      excedente_hasta: 0,
      recargo: 0,
      observacion: "",
      estado: "A",
      id_letrero: 0
   };

   setTimeout(() => {
    this.llenarTipos();
    if(!this.esNuevaCatEspPub) {
      this.categoria_esp_publicitario = {
        nivel: this.dato.nivel,
        grupo: this.dato.grupo,
        tipo: this.dato.tipo,
        nombre: this.dato.nombre,
        formula: this.dato.formula,
        porcentaje: this.dato.porcentaje,
        medida_desde: this.dato.medida_desde,
        medida_hasta: this.dato.medida_hasta,
        excedente_desde: this.dato.excedente_desde,
        excedente_hasta: this.dato.excedente_hasta,
        recargo: this.dato.recargo,
        observacion: this.dato.observacion,
        estado: "A"
      };
    }
}, 0);
  }

  llenarTipos() {
    this.texto_barra_carga = "Cargando ...";
    this.barra_carga.ctlSpinner(true);

    let datos = {
      params: "'TIPO_LETRERO'"
    };

    //llenado de catalogo
    this.srvCatEspPub.obtenerCatalogos(datos).subscribe(
      (res) => {
        this.lista_tipos = res['data']['TIPO_LETRERO'];
        console.log(this.lista_tipos);
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

  manejarTipo(evento){
    this.categoria_esp_publicitario.nombre = evento.valor;
    this.categoria_esp_publicitario.tipo = evento.descripcion;
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.cerrarModal();
            break;
        case " GUARDAR":
            this.validarCategoriasEspPublicitario();
            break;
    }
  }

  cerrarModal() {
    this.srvVarCom.editCategoriasEspPublicitario.next(this.necesita_refrescar);
        this.modal.dismiss();
  }

  async validarCategoriasEspPublicitario() {
    if (this.esNuevaCatEspPub && this.permisos.guardar == "0") {
      this.srvTostar.warning("No tiene permisos para crear una Categoria de Espacios Publicitarios.", this.titulo);
    } else if (!this.esNuevaCatEspPub && this.permisos.editar == "0") {
        this.srvTostar.warning("No tiene permisos para editar una Categoria de Espacios Publicitarios.", this.titulo);
    } else {
      let resp = await this.validarDatos().then((respuesta) => {
          if (respuesta) {
            if (this.esNuevaCatEspPub) {
                this.crearCategoriasEspPublicitario();
            } else {
                this.actualizarCategoriasEspPublicitario();
            }
          }
      });
    }
  }

  validarDatos() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.categoria_esp_publicitario.nivel == undefined ||
        this.categoria_esp_publicitario.nivel <= 0
      ) {
        this.srvTostar.info("El nivel no debe ser menor que 0.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.grupo == undefined ||
        this.categoria_esp_publicitario.grupo == "")
      ) {
        this.srvTostar.info("Debe ingresar un grupo.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.tipo == undefined ||
        this.categoria_esp_publicitario.tipo == "0")
      ) {
        this.srvTostar.info("Debe seleccionar un tipo.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.formula == undefined ||
        this.categoria_esp_publicitario.formula == "")
      ) {
        this.srvTostar.info("Debe ingresar una fórmula.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.porcentaje == undefined ||
        this.categoria_esp_publicitario.porcentaje <= 0 ||
        this.categoria_esp_publicitario.porcentaje > 1)
      ) {
        this.srvTostar.info("El porcentaje debe estar entre 0 y 1.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.medida_desde == undefined ||
        this.categoria_esp_publicitario.medida_desde <= 0)
      ) {
        this.srvTostar.info("La medida inicial no debe ser menor que 0.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.medida_hasta == undefined ||
        this.categoria_esp_publicitario.medida_hasta <= 0)
      ) {
        this.srvTostar.info("La medida final no debe ser menor que 0.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.excedente_desde == undefined ||
        this.categoria_esp_publicitario.excedente_desde <= 0)
      ) {
        this.srvTostar.info("El excedente inicial no debe ser menor que 0.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.excedente_hasta == undefined ||
        this.categoria_esp_publicitario.excedente_hasta <= 0)
      ) {
        this.srvTostar.info("El excedente final no debe ser menor que 0.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.recargo == undefined ||
        this.categoria_esp_publicitario.recargo <= 0 ||
        this.categoria_esp_publicitario.recargo > 1)
      ) {
        this.srvTostar.info("El recargo debe estar entre 0 y 1.");
        flag = true;
      } else if (
        (this.categoria_esp_publicitario.observacion == undefined ||
        this.categoria_esp_publicitario.observacion == "")
      ) {
        this.srvTostar.info("Debe ingresar una observacion.");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    });
  }

  crearCategoriasEspPublicitario() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear una nueva Categoria de Espacios Publicitario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
  }).then((result) => {
      if (result.isConfirmed) {
          this.texto_barra_carga = "Guardando Categoria de Espacios Publicitario..."
          this.barra_carga.ctlSpinner(true);

          let datos = {
            params: {
              nivel: this.categoria_esp_publicitario.nivel,
              grupo: this.categoria_esp_publicitario.grupo,
              tipo: this.categoria_esp_publicitario.tipo,
              nombre: this.categoria_esp_publicitario.nombre,
              formula: this.categoria_esp_publicitario.formula,
              porcentaje: this.categoria_esp_publicitario.porcentaje,
              medida_desde: this.categoria_esp_publicitario.medida_desde,
              medida_hasta: this.categoria_esp_publicitario.medida_hasta,
              excedente_desde: this.categoria_esp_publicitario.excedente_desde,
              excedente_hasta: this.categoria_esp_publicitario.excedente_hasta,
              recargo: this.categoria_esp_publicitario.recargo,
              observacion: this.categoria_esp_publicitario.observacion,
              estado: "A"
            }
          };

          console.log(datos);

          this.srvCatEspPub.guardarCategoriasEspPublicitarios(datos).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.necesita_refrescar = true;
                this.barra_carga.ctlSpinner(false);
                Swal.fire({
                  icon: "success",
                  title: "Categoria de Espacios Publicitario Creada",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.cerrarModal();
                  }
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

  actualizarCategoriasEspPublicitario() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar esta Categoria de Espacios Publicitario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
  }).then((result) => {
      if (result.isConfirmed) {
          this.texto_barra_carga = "Guardando Categoria de Espacios Publicitario..."
          this.barra_carga.ctlSpinner(true);

          let datos = {
            params: {
              nivel: this.categoria_esp_publicitario.nivel,
              grupo: this.categoria_esp_publicitario.grupo,
              tipo: this.categoria_esp_publicitario.tipo,
              nombre: this.categoria_esp_publicitario.nombre,
              formula: this.categoria_esp_publicitario.formula,
              porcentaje: this.categoria_esp_publicitario.porcentaje,
              medida_desde: this.categoria_esp_publicitario.medida_desde,
              medida_hasta: this.categoria_esp_publicitario.medida_hasta,
              excedente_desde: this.categoria_esp_publicitario.excedente_desde,
              excedente_hasta: this.categoria_esp_publicitario.excedente_hasta,
              recargo: this.categoria_esp_publicitario.recargo,
              observacion: this.categoria_esp_publicitario.observacion,
              estado: "A"
            }
          };
          this.srvCatEspPub.actualizarCategoriasEspPublicitarios(datos, this.dato.id_categorias_esp).subscribe(
              (res) => {
                if (res["status"] == 1) {
                  this.necesita_refrescar = true;
                  this.barra_carga.ctlSpinner(false);
                  Swal.fire({
                    icon: "success",
                    title: "Categoria de Espacios Publicitario Actualizada",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.cerrarModal();
                    }
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
