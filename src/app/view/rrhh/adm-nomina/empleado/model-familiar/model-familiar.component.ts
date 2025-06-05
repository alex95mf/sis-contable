import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { EmpleadoService } from '../empleado.service';
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-model-familiar',
  templateUrl: './model-familiar.component.html',
  styleUrls: ['./model-familiar.component.scss']
})
export class ModelFamiliarComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() empleado: any;
  @Input() data: any;
  

  vmButtons: Array<any> = []

  familiares = {
    id_carga: 0,
    tipo_documento: null,
    cedula_carga: null,
    nombres_general: null,
    apellidos_general: null,
    relacion: { cat_nombre: null, id_catalogo: null },
    // relacion: null,
    fecha_nacim: moment().format('YYYY-MM-DD'),
    discapacidad: null,
    afiliado: null
  }

  cmb_relaciones: Array<any> = [];

  cmb_tipo_documento: Array<any> = [
    { value: 'C', label: 'Cedula' },
    { value: 'P', label: 'Pasaporte' },
  ]

  disafi = [
    { valor: 0, descripcion: 'SI' },
    { valor: 1, descripcion: 'NO' },
  ]

  maxlength: number = 10;

  constructor(
    private activeModal: NgbActiveModal,
    private services: EmpleadoService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,

  ) {
    this.vmButtons = [
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: { icon: "fas fa-save", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50)
    // console.log(this.isNew)
    console.log(this.cmb_relaciones)

    if (this.data) {

      this.vmButtons[0].showimg = false;
      this.vmButtons[1].showimg = true;
      this.vmButtons[1].habilitar = false;

      console.log(this.data);
      this.familiares['id_empleado'] =this.empleado;
      this.familiares.id_carga =this.data.id_carga;
      this.familiares.tipo_documento =this.data.tipo_identificacion;
      this.familiares.cedula_carga =this.data.cedula_carga;
      this.familiares.nombres_general =this.data.nombres_general;
      this.familiares.apellidos_general =this.data.apellidos_general;
      this.familiares.relacion.id_catalogo=this.data.relacion_familiar?.id_catalogo;
      this.familiares.relacion.cat_nombre=this.data.relacion_familiar?.cat_nombre;
      this.familiares.fecha_nacim = moment(this.data.fecha_nacim).format('YYYY-MM-DD');
      this.familiares.discapacidad = this.data.discapacidad;
      this.familiares.afiliado = this.data.afiliado;

    }

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close();
        break;
      case "GUARDAR":
        this.guardar();
        break;
      case "MODIFICAR":
        this.modificar();
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Relaciones'
      let response: Array<any> = await this.services.getRelaciones('CARF');
      this.cmb_relaciones = response;

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Catalogos')
    }
  }


  async guardar() {
    // Validacion de Datos
    let mensaje: string = '';
    if (this.familiares.cedula_carga == null) mensaje += '* Ingrese la cedula<br>'
    if (this.familiares.nombres_general == null) mensaje += '* Ingrese el nombre<br>'
    if (this.familiares.apellidos_general == null) mensaje += '* Ingrese el apellido<br>'
    if (this.familiares.relacion.cat_nombre == null) mensaje += '* Escoga la relacion<br>'
    if (this.familiares.fecha_nacim == null) mensaje += '* Ingrese la fecha de nacimiento<br>'
    if (moment().diff(this.familiares.fecha_nacim) < 0) mensaje += '* Ingrese una fecha de nacimiento valida<br>'
    if (this.familiares.discapacidad == null) mensaje += '* Escoga la capacidad<br>'
    if (this.familiares.afiliado == null) mensaje += '* Escoga si esta afiliado<br>'

    if (mensaje.length > 0) {
      this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true })
      return;
    }

    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Guardando...'
      let response = await this.services.guardarFamiliar(this.empleado, { familiar: this.familiares })
      // console.log(response)
      this.services.setFamiliar$.emit(response);
      this.activeModal.close();
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error almacenando Familiar');
    }

  }

  async modificar(){
      // Validacion de Datos
      let mensaje: string = '';

      if (this.familiares.cedula_carga == null) mensaje += '* Ingrese la cedula<br>'
      if (this.familiares.nombres_general == null) mensaje += '* Ingrese el nombre<br>'
      if (this.familiares.apellidos_general == null) mensaje += '* Ingrese el apellido<br>'
      if (this.familiares.relacion.cat_nombre == null) mensaje += '* Escoga la relacion<br>'
      if (this.familiares.fecha_nacim == null) mensaje += '* Ingrese la fecha de nacimiento<br>'
      if (moment().diff(this.familiares.fecha_nacim) < 0) mensaje += '* Ingrese una fecha de nacimiento valida<br>'
      if (this.familiares.discapacidad == null) mensaje += '* Escoga la capacidad<br>'
      if (this.familiares.afiliado == null) mensaje += '* Escoga si esta afiliado<br>'

      if (mensaje.length > 0) {
        this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true })
        return;
      }


      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Guardando...'
        let response = await this.services.modificarFamiliar(this.empleado, this.familiares )
        // console.log(response)
        this.services.updateFamiliar$.emit(response);
        this.activeModal.close();
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error modificando Familiar');
      }
  }

  handleSetLength(event) {
    this.maxlength = (event.value == 'C') ? 10 : 64;
    // trim this.familiares.cedula_carga to this.maxlength
    if (this.familiares.cedula_carga && this.familiares.cedula_carga.length > 0) Object.assign(this.familiares, { cedula_carga: this.familiares.cedula_carga.slice(0, this.maxlength) })
  }

  handleSelectRelacion(event) {
    Object.assign(this.familiares, { relacion: event })
  }

}
