import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/commonServices';
import { PlanRegistroService } from './registro.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  fTitle: string = 'Asignacion de Presupuesto a Programas'
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  msgSpinner: string;
  vmButtons: any;

  // Permisos del usuario
  dataUser: any;
  permissions: any;

  // Datos del Programa para UI
  periodos: any[] = []
  periodoSelected: any;
  programas: Array<any> = []
  presupuesto: any = {
    id: null,
    periodo: null,
    monto: 0,
    asignado: 0,
    disponible: 0
  }

  validaciones = new ValidacionesFactory();

  constructor(
    private toastr: ToastrService,
    private planRegistroService: PlanRegistroService,
    protected commonServices: CommonService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "planRegistro", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false },
      { orig: "planRegistro", paramAccion: "1", boton: { icon: "fa fa-edit", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: true },
      { orig: "planRegistro", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false },
      {
        orig: "planRegistro",
        paramAccion: "1",
        boton: { icon: "far fa-envelope", texto: "ENVIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      }
    ];

    setTimeout(() => {
      this.validaPermisos();
    }, 50)
  }

  validaPermisos() {
    /** Obtiene los permisos del usuario y valida si puede trabajar sobre el formulario */
    this.msgSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fProgAsignacion,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonServices.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            this.cargaInicial();
          }, 250)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  // Maneja los eventos de la botonera
  metodoGlobal(evento: any) {
    // console.log(evento.items.paramAccion + evento.items.boton.texto)

    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "1GUARDAR":
        // Guarda un nuevo Presupuesto
        this.setPresupuesto();
        break;
      case "1MODIFICAR":
        // Actualiza el Presupuesto seleccionado
        this.updatePresupuesto();
        break;
      case "1CANCELAR":
        this.cancelaPlan();
        break;
      case "1ENVIAR":
        this.enviarCorreo();
        break;
    }
  }

  async cargaInicial() {
    try {
      // Carga Listado de Periodos de la Base
      this.msgSpinner = 'Cargando Periodos'
      this.periodos = await this.planRegistroService.getPeriodos();

      // Carga los Programas
      this.msgSpinner = 'Cargando Programas'
      this.programas = await this.planRegistroService.getProgramas();
      this.programas.map((programa: any) => Object.assign(programa, { presupuesto: 0 }))

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err, 'Error cargando Data Inicial')
    }
  }

  async cargaPresupuesto(event) {
    console.log(event)
    // Se ha presionado Cancelar
    if (event == undefined) return;

    // Limpiar pantalla
    this.vmButtons[0].habilitar = true
    this.vmButtons[1].habilitar = true
    this.vmButtons[3].habilitar = true
    this.presupuesto = { monto: 0, asignado: 0, disponible: 0 }
    this.programas.map((programa: any) => Object.assign(programa, { presupuesto: 0 }))

    // Modificar
    this.vmButtons[0].habilitar = true  // Deshabilitar Guardar
    this.vmButtons[1].habilitar = false  // Habilitar Modificar

    try {
      this.lcargando.ctlSpinner(true)
      this.msgSpinner = 'Cargando Presupuesto del Periodo'
      // Revisar si hay Asignacion Inicial
      let asignacionInicialPeriodo = await this.planRegistroService.getAsignacionInicial(event)
      console.log(asignacionInicialPeriodo)
      // Cargar Presupuesto General
      let presupuestoPeriodo = await this.planRegistroService.getPresupuesto(event);
      console.log(presupuestoPeriodo)

      if (Array.isArray(asignacionInicialPeriodo) && !asignacionInicialPeriodo.length) {
        // No tiene Asignacion Inicial
        this.lcargando.ctlSpinner(false)
        Swal.fire('No existe Asignacion Inicial', 'El periodo seleccionado no tiene una Asignacion Inicial'+event, 'warning');
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = true
        this.vmButtons[3].habilitar = true
        return;
      }

      if (asignacionInicialPeriodo && Array.isArray(presupuestoPeriodo) && !presupuestoPeriodo.length) {
        // Tiene Asignacion Inicial pero no tiene Presupuesto almacenado
        Object.assign(this.presupuesto, {
          id: null,
          periodo: this.periodoSelected,
          monto: asignacionInicialPeriodo,
          asignado: 0,
          disponible: asignacionInicialPeriodo,
        })
        this.vmButtons[0].habilitar = false
        this.vmButtons[1].habilitar = true
        this.vmButtons[3].habilitar = false

      } else if (asignacionInicialPeriodo && presupuestoPeriodo) {
        // Tiene Presupuesto almacenado
        Object.assign(this.presupuesto, {
          id: presupuestoPeriodo.id,
          periodo: presupuestoPeriodo.periodo,
          monto: asignacionInicialPeriodo,
          asignado: presupuestoPeriodo.asignado,
          disponible: presupuestoPeriodo.disponible
        })
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = false
        this.vmButtons[3].habilitar = false
      }
      
      // Cargar Presupuestos de Programas
      this.msgSpinner = 'Cargando Presupuesto por Programa'
      let response = await this.planRegistroService.getPresupuestoProgramas(event);
      response.forEach((elem: any) => {
        this.programas.find((programa: any) => programa.id_catalogo == elem.fk_programa).presupuesto = elem.presupuesto ?? 0
      })
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err, 'Error cargando Presupuesto')
    }
  }

  async setPresupuesto() {
    try {
      await this.validateData();

      const result = await Swal.fire({
        title: 'Presupuesto para Nuevo Periodo',
        text: (this.presupuesto.disponible > 0) 
          ? 'Tiene Presupuesto aun disponible, seguro desea guardar?' 
          : 'Esta seguro de crear un nuevo Periodo con el Presupuesto asignado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          this.lcargando.ctlSpinner(true);

          // Crear nuevo Periodo
          this.msgSpinner = 'Creando nuevo Periodo';
          let general = await this.planRegistroService.setPresupuesto({presupuesto: this.presupuesto});
          // Almacenar Presupuesto de cada Programa
          this.msgSpinner = 'Almacenando Presupuesto de Programas';
          await this.planRegistroService.setPresupuestoProgramas({presupuesto: general, programas: this.programas});
          // Cargar nuevo periodo
          this.msgSpinner = 'Cargando Periodos';
          this.periodos = await this.planRegistroService.getPeriodos();

          this.lcargando.ctlSpinner(false);
          Swal.fire('Presupuesto almacenado correctamente', '', 'success');
        } catch (err) {
          console.log(err);
          this.lcargando.ctlSpinner(false);
          this.toastr.error(err.error.message, 'Error almacenando Presupuesto', { enableHtml: true });
        }
      }
    } catch (err) {
      console.log(err);
      this.lcargando.ctlSpinner(false);
      this.toastr.warning(err, 'Validación de Datos', { enableHtml: true });
    }
  }

  validateData() {
    return new Promise((resolve, reject) => {
      let message = '';

      if (this.presupuesto.monto == 0) {
        message += '* No ha ingresado un presupuesto general.<br>';
      }

      if (this.presupuesto.disponible < 0) {
        message += '* Se ha excedido del presupuesto.<br>';
      }

      if (this.presupuesto.disponible > 0) {
        message += '* Aun tiene presupuesto por asignar.<br>'
      }

      this.programas.forEach((programa: any) => {
        if (programa.presupuesto == 0) {
          message += `* ${programa.valor} no tiene presupuesto asignado.<br>`
        }
      })

      return (!message.length) ? resolve(true) : reject(message)
    })
  }

  async updatePresupuesto() {
    try {
      await this.validateData()

      const result = await Swal.fire({
        title: 'Actualización de Presupuesto',
        text: 'Esta seguro de modificar los valores para el periodo seleccionado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          //
          this.lcargando.ctlSpinner(true);
          // Actualizar periodo seleccionado
          // Actualizar por Programa
          this.msgSpinner = 'Actualizando Presupuesto seleccionado'
          await this.planRegistroService.updatePresupuesto({presupuesto: this.presupuesto, programas: this.programas})
          this.lcargando.ctlSpinner(false);
          Swal.fire('Presupuesto actualizado correctamente', '', 'success');
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error actualizando Presupuesto')
        }
      }
    } catch (err) {
      console.log(err);
      this.lcargando.ctlSpinner(false);
      this.toastr.warning(err, 'Validación de Datos', { enableHtml: true });
    }
  }
  
  cancelaPlan() {
    Swal.fire({
      title: 'Limpieza de Formulario',
      text: 'Seguro desea reiniciar el formulario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.vmButtons[0].habilitar = false
        this.vmButtons[1].habilitar = true
    
        this.programas.map((programa: any) => Object.assign(programa, { presupuesto: 0 }))
        this.presupuesto = {
          id: null,
          periodo: null,
          monto: 0,
          asignado: 0,
          disponible: 0
        }
        this.ngSelectComponent.handleClearClick()
      }
    })
  }

  sumTotal() {
    // Realiza la sumatoria de los montos de programas y opera sobre el presupuesto general
    // const sum100 = parseInt((this.programas.reduce((acc, curr) => acc + curr.presupuesto, 0) * 100).toString())
    const sum100 = Math.floor(this.programas.reduce((acc, programa) => acc + programa.presupuesto, 0) * 100)
    console.log(sum100)
    const asignado = sum100 / 100
    const disponible = this.presupuesto.monto - asignado
    Object.assign(this.presupuesto, {
      asignado,
      disponible
    })
    console.log(this.presupuesto)
    
  }

  enviarCorreo() {
    this.msgSpinner = 'Enviando correos...'
    this.lcargando.ctlSpinner(true)
    this.planRegistroService.enviarCorreos().subscribe(
      res => {
        console.log(res)
        this.lcargando.ctlSpinner(false)
        Swal.fire({
          title: this.fTitle,
          text: 'Envio de correo: ' + res['message'],
          icon: 'success'
        });
      },
      err => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error enviando el correo')
      }
    )
  }
}
