import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TablaCuantiaService } from '../tabla-cuantia.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from "moment";

@Component({
standalone: false,
  selector: 'app-tabla-cuantia-form',
  templateUrl: './tabla-cuantia-form.component.html',
  styleUrls: ['./tabla-cuantia-form.component.scss']
})
export class TablaCuantiaFormComponent implements OnInit {
  mensajeH: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false})
  etiquetaCargando: CcSpinerProcesarComponent;

  datosUsuario: any;

  @Input() comp_mod: any;
  @Input() esNuevo: any;
  @Input() data: any;
  @Input() permisos: any;
  @Input() tituloF: any;
 // @Input() tipo: string;
  @Input() cmb_periodo: any;

  botonesPermisos: any;

  cuantia: any;

  necesitaRefrescar: boolean = false;

  listaCuantias: any;
  datos = "inicial";

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
  filtro: any;
  periodo: any

  constructor(
    public modalActivo: NgbActiveModal,
    private st: ToastrService,
    private stc: TablaCuantiaService,
    private svc: CommonVarService
  ) { }

  ngOnInit(): void {
    this.botonesPermisos = [
      {
        orig: "btnFormCuantia",
        paramAccion: '',
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnFormCuantia",
        paramAccion: '',
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      }
    ];

    this.datosUsuario = JSON.parse(localStorage.getItem("Datauser"));

    this.cuantia = {
      desde: 0,
      hasta: 0,
      porcentaje: 0,
      valor: 0,
      estado: 'A',
      tipo:0,
      periodo: moment(new Date()).format('YYYY')
    }



    if (!this.esNuevo) {

      setTimeout(() => {
        this.obtenerCuantia(this.data);
      }, 0);
    }
  }

  obtenerCuantia(data) {
    /* this.cuantia = {
      id: data.id,
      desde: data.desde,
      hasta: data.hasta,
      porcentaje: data.porcentaje,
      valor: data.valor
    } */

    this.cuantia = data
    console.log(this.cuantia)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
          this.cerrarModal();
          break;
      case "GUARDAR":
          this.validarCuantia();
          break;
    }
  }

  async validarCuantia() {

    if (this.esNuevo && this.permisos.guardar == "0") {
      this.st.warning("No tiene permisos para crear nuevas cuantias");
    } else if (!this.esNuevo && this.permisos.editar == "0") {
      this.st.warning("No tiene permisos para editar nuevas cuantias");
    } else {

      let resp = await this.validarCampos().then((respuesta) => {
        if (respuesta) {
          if (this.esNuevo) {
            this.crearCuantia();
          } else {
            this.editarCuantia();
          }
        }
      });
    }
  }

  validarCampos() {
    let bandera = false;

    return new Promise((resolve, reject) => {
        if (this.cuantia.desde >= this.cuantia.hasta) {
          this.st.info("El valor desde no debe ser mayor que el valor de hasta");
          bandera = true;
        } else if (this.cuantia.valor == 0 && this.cuantia.porcentaje == 0) {
          this.st.info("Valor y cuantia no deben ser ambos cero");
          bandera = true;
        } else if (this.cuantia.desde < 0 || this.cuantia.hasta < 0 || this.cuantia.valor < 0 || this.cuantia.porcentaje < 0) {
          this.st.info("Los datos no deben ser negativos");
          bandera = true;
        }
        !bandera ? resolve(true) : resolve(false);
    });
  }

  crearCuantia() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear una nueva cuantia?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#F86CB",
      confirmButtonColor: "#4DB74"
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeH = "Guardando cuantia...";
        this.etiquetaCargando.ctlSpinner(true);

        let datos = {
          concepto: {
            codigo:  this.cuantia.tipo
          },
          rangos: [{
            secuencial: 0,
            desde: this.cuantia.desde,
            hasta: this.cuantia.hasta,
            porcentaje: this.cuantia.porcentaje,
            valor: this.cuantia.valor,
            periodo: this.cuantia.periodo,
            estado: this.cuantia.estado
          }]
        }

        this.stc.crearCuantia(datos).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.necesitaRefrescar = true;
              this.etiquetaCargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Cuantia Creada",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#20A8D8"
              }).then((result) => {
                if (result.isConfirmed) {
                  this.cerrarModal();
                }
              });
            } else {
              this.etiquetaCargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#20A8D8"
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

  editarCuantia() {
    Swal.fire({
      icon: "warning",
      title: "¿Seguro que desea editar esta cuantia?",
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) =>{
      if (result.isConfirmed) {
        this.mensajeH = "Guardando cuantia...";
        this.etiquetaCargando.ctlSpinner(true);
        let datos = {
          concepto: {
            codigo: this.cuantia.tipo
          },
          rangos: [{
              id: this.cuantia.id,
              secuencial: 0,
              desde: this.cuantia.desde,
              hasta: this.cuantia.hasta,
              porcentaje: this.cuantia.porcentaje,
              valor: this.cuantia.valor,
              periodo: this.cuantia.periodo,
              estado: this.cuantia.estado
          }]
        }
        this.stc.actualizarCuantia(this.cuantia.id, datos).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.necesitaRefrescar = true;
              this.etiquetaCargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Cuantia Actualizada",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.cerrarModal();
                }
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

  cerrarModal() {
    this.svc.editCuantia.next(this.necesitaRefrescar);
    this.modalActivo.dismiss();
  }
}
