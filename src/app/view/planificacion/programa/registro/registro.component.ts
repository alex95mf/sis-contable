import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';

import { ToastrService } from 'ngx-toastr';
import { ProgramaRegistroService } from "./registro.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SweetAlertResult } from 'sweetalert2';

interface Presupuesto {
  presupuesto: number;
  disponible: number;
  asignado: number;
}

@Component({
standalone: false,
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})

export class RegistroComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selectables: QueryList<NgSelectComponent>;
  mensajeSpinner = "Cargando Asignacion por Departamentos"
  fTitle = 'Asignación de presupuesto por Departamento'
  vmButtons: any;
  dataUser: any
  permissions: any

  periodos: Array<any> = [];
  programas: Array<any> = [];
  periodoSelected: any;
  periodoObjectSelected: any;
  programaSelected: any;
  programaObjectSelected: any;
  departamentos: Array<any> = [];
  presupuesto: Presupuesto;

  // progSelect = 0
  // programa: any = { presupuesto: { periodo: new Date().getFullYear() + 1, monto: 0, asignado: 0, disponible: 0 } }

  constructor(
    private toastr: ToastrService,
    private programaRegistroService: ProgramaRegistroService,
    protected commonServices: CommonService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "progReg", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },
      { orig: "progReg", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
      // { orig: "progReg", paramAccion: "1", boton: { icon: "fa fa-edit", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: true, imprimir: false },
      { orig: "progReg", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
    ];

    setTimeout(() => {
      this.validaPermisos()
    }, 50)

  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fDeptAsignacion,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            // this.vmButtons[0].habilitar = false  // Es manejado por seleccionaPrograma()
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

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case "CONSULTAR":

      if (this.periodoObjectSelected == undefined || this.programaObjectSelected == undefined 
        )
        {
          this.toastr.warning("Por favor seleccione Periodo y, Programa..", this.fTitle);
          return;
        }


        this.handleCargaDepartamentos()
        break;
      case "GUARDAR":
        this.setPresupuestoDepartamentos()
        break;
      case "MODIFICAR":
        //
        break;
      case "CANCELAR":
        this.cancelaPrograma()
        break;
    }
  }

  async cargaInicial() {
    try {
      // Carga Listado de Periodos de la Base
      (this as any).mensajeSpinner = 'Cargando Periodos'
      this.periodos = await this.programaRegistroService.getPeriodos();

      // Carga los Programas
      (this as any).mensajeSpinner = 'Cargando Listado de Programas'
      this.programas = await this.programaRegistroService.getProgramas();
      this.programas.map((programa: any) => Object.assign(programa, { label: `${programa.descripcion}. ${programa.valor}` }));

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Data Inicial')
    }
  }

  async handleCargaDepartamentos() {
    console.log(this.periodoSelected)
    console.log(this.programaSelected)
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Presupuesto de Programa';
      // Cargar Presupuesto de Programa seleccionado
      let response: any = await this.programaRegistroService.getProgramaPresupuesto({ periodo: this.periodoSelected, programa: this.programaSelected })
      this.presupuesto = {
        presupuesto: response.presupuesto,
        disponible: 0,
        asignado: 0,
      }
      
      (this as any).mensajeSpinner = 'Cargando Presupuesto de Departamentos';
      this.departamentos = await this.programaRegistroService.getDepartamentosPresupuesto({ periodo: this.periodoSelected, programa: this.programaSelected })
      this.departamentos.forEach((departamento: any) => {
        // Se ha creado un nuevo departamento y no tiene presupuesto
        if (departamento.departamento_presupuesto == null) {
          departamento.departamento_presupuesto = {
            id: null,
            periodo: this.periodos.find(periodo => periodo.id == this.periodoSelected).periodo,
            presupuesto: 0,
            estado: 0
          }
        }
        
      })
      
      // let asignado: number = this.departamentos.reduce((acc: number, curr: any) => acc + parseFloat(curr.departamento_presupuesto.presupuesto), 0)
      // let disponible: number = this.presupuesto.presupuesto - asignado
      // Object.assign(this.presupuesto, { asignado, disponible })


      // console.log(this.presupuesto);

      // this.presupuesto.asignado = 0;
      let asignado: number = this.departamentos.reduce((acc, curr) => acc + parseFloat(curr.departamento_presupuesto.presupuesto), 0);
      asignado = parseFloat(asignado.toFixed(2));
      let disponible: number = parseFloat((+this.presupuesto.presupuesto - asignado).toFixed(2));
      Object.assign(this.presupuesto, { asignado, disponible });
      console.log(`Asignado: ${asignado}, Disponible: ${disponible}`);

      // console.log(this.presupuesto)

      this.vmButtons[1].habilitar = false

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err);
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Presupuesto de Departamentos')
    }
  }

  handlePeriodoSelected(event) {
    if (event == undefined) return;
    this.periodoObjectSelected = event;
   // this.periodoSelected = event.id;
  }

  handleProgramaSelected(event) {
    if (event == undefined) return;
    this.programaObjectSelected = event;
    //this.programaSelected= event.id_catalogo;
  }

  async setPresupuestoDepartamentos() {
    // Validaciones
    let message = '';
    console.log(this.presupuesto.disponible)
    let disp100 = (this.presupuesto.disponible < 0) ? Math.ceil(parseInt(`${this.presupuesto.disponible * 100}`)) : Math.floor(parseInt(`${this.presupuesto.disponible * 100}`))
    if (disp100 > 0) message += '* Aun tiene presupuesto disponible.<br>';
    if (disp100 < 0) message += '* Se ha excedido del presupuesto.<br>';

    let sinPresupuesto = 0
    this.departamentos.forEach((departamento: any) => {
      if (departamento.departamento_presupuesto.presupuesto == 0) sinPresupuesto += 1;
    })
    if (sinPresupuesto > 0) message += `* Existen ${sinPresupuesto} departamentos sin presupuesto.<br>`;

    if (message.length > 0) {
      this.toastr.warning(message, 'Validación de Datos', { enableHtml: true });
      return;
    }

    let result: SweetAlertResult = await Swal.fire({
      title: 'Seguro desea guardar los cambios realizados?',
      text: 'Esto sobreescribirá cualquier valor anterior, si lo hubiere.',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar'
    });

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Almacenando Presupuesto de Departamentos';
        let response = await this.programaRegistroService.setPresupuestoDepartamentos({
          periodo: this.periodoObjectSelected,
          programa: this.programaObjectSelected,
          departamentos: this.departamentos
        });
        console.log(response);
        Swal.fire(`${response}`, '', 'success')

        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Presupuestos')
      }
    }
  }

  /* seleccionaPrograma() {
    // Cargar presupuesto del programa
    if (this.progSelect === 0) {
      this.departamentos = []
      this.programa = { presupuesto: { periodo: new Date().getFullYear() + 1, monto: 0, asignado: 0, disponible: 0 } }
      this.vmButtons[0].habilitar = true
      return
    }

    Object.assign(this.programa, this.progSelect)
    this.vmButtons[0].habilitar = false

    (this as any).mensajeSpinner = 'Cargando Presupuesto de Programa'
    this.lcargando.ctlSpinner(true);
    let data = {
      programa: this.programa.id,
      periodo: this.programa.presupuesto.periodo
    }

    this.programaRegistroService.getPresupuestoPrograma(data).subscribe(
      res => {
        // console.log(res['data'])
        // this.lcargando.ctlSpinner(false)
        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.lcargando.ctlSpinner(false)
          Swal.fire({
            title: this.fTitle,
            text: 'No hay presupuesto asignado.',
            icon: 'warning'
          })
          return
        }

        let presupuesto = {
          id: parseFloat(res['data']['fk_presupuesto']),
          monto: parseFloat(res['data']['presupuesto'])
        }
        Object.assign(this.programa.presupuesto, presupuesto)
        this.getDepartamentosPrograma()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargado Presupuesto de Programa')
      }
    )
  } */

  /* getDepartamentosPrograma() {
    this.departamentos = []
    (this as any).mensajeSpinner = 'Cargando Departamentos de Programa'
    // Cargar Departamentos
    let data = {
      programa: this.programa.nombre
    }
    this.programaRegistroService.getDepartamentosPrograma(data).subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.lcargando.ctlSpinner(false)
          Swal.fire({
            title: this.fTitle,
            text: 'El Programa seleccionado no tiene Departamentos asignados.',
            icon: 'warning'
          })
          return
        }

        res['data'].forEach(d => {
          let departamento = {
            id: d.id_catalogo,
            nombre: d.valor,
            presupuesto: {
              id: null,
              monto: 0,
              estado: 0
            }
          }
          this.departamentos.push(departamento)
        })
        // this.lcargando.ctlSpinner(false)
        this.getPresupuestoDepartamentos()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Departamentos de Programa')
      }
    )
  } */

  /* getPresupuestoDepartamentos() { // WIp;
    (this as any).mensajeSpinner = 'Cargando Presupuestos por Departamento'
    let data = {
      presupuesto_id: this.programa.presupuesto.id,
      programa_id: this.programa.id,
      departamentos: this.departamentos.map(d => d.id)
    }
    // console.log(data)

    this.programaRegistroService.getPresupuestoDepartamentos(data).subscribe(
      res => {
        console.log(res['data'])
        // this.lcargando.ctlSpinner(false)
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          this.lcargando.ctlSpinner(false)
          // this.toastr.info('Los departamentos no tienen presupuestos asignados', this.fTitle)
          return
        }

        res['data'].forEach(d => {
          let presupuesto = {
              id: d.id,
              monto:  parseFloat(d.presupuesto),
              estado: d.estado
            }
          Object.assign(this.departamentos.find(dd => dd.id == d.fk_departamento).presupuesto, presupuesto)
        })
        this.sumTotal()
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Presupuesto por Departamento')
      }
    )
  } */

  // sumTotal() {
  //   console.log(this.presupuesto)
  //   this.presupuesto.asignado = 0;
  //   let asignado: number = this.departamentos.reduce((acc, curr) => acc + +curr.departamento_presupuesto.presupuesto, 0);
  //   let disponible: number = +this.presupuesto.presupuesto - +asignado;
  //   Object.assign(this.presupuesto, { asignado, disponible })
  // }
  sumTotal() {
  console.log(this.presupuesto);

  this.presupuesto.asignado = 0;
  
  // Calcula la suma de los presupuestos de todos los departamentos
  let asignado: number = this.departamentos.reduce((acc, curr) => acc + parseFloat(curr.departamento_presupuesto.presupuesto), 0);

  // Redondea el total asignado a dos decimales
  asignado = parseFloat(asignado.toFixed(2));
  
  // Calcula el presupuesto disponible restando el total asignado del presupuesto total
  let disponible: number = parseFloat((+this.presupuesto.presupuesto - asignado).toFixed(2));

  // Asigna los valores calculados de 'asignado' y 'disponible' al objeto 'presupuesto'
  Object.assign(this.presupuesto, { asignado, disponible });

  console.log(`Asignado: ${asignado}, Disponible: ${disponible}`);
}
//   sumTotal() {
//     console.log(this.presupuesto);
//     this.presupuesto.asignado = 0;
//     let asignado: number = this.departamentos.reduce((acc, curr) => acc + (+curr.departamento_presupuesto.presupuesto || 0), 0);
//     let disponible: number = (typeof this.presupuesto.presupuesto === 'number' ? this.presupuesto.presupuesto : 0) - asignado;
//     Object.assign(this.presupuesto, { asignado, disponible });
// }

  /* confirmSaveDepartamento() {
    if (this.permissions.guardar == '0') {
      this.toastr.warning('No tiene permisos para usar este recurso', this.fTitle)
      return
    }

    if (this.programa.presupuesto.disponible < 0) {
      Swal.fire({
        icon: "warning",
        title: this.fTitle,
        text: "El presupuesto ha sido excedido ¿Desea guardar de todas maneras?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveDepartamento();
        } else {
          return;
        }
      });
    } else {
      this.saveDepartamento();
    }
  } */

  /* saveDepartamento() {

    let data = {
      programa_id: this.programa.id,
      presupuesto_id: this.programa.presupuesto.id,
      departamentos: this.departamentos
    };

    (this as any).mensajeSpinner = 'Almacenando Presupuesto de Departamentos'
    this.lcargando.ctlSpinner(true);
    this.programaRegistroService.setPresupuestoDepartamentos(data).subscribe(
      res => {
        // console.log(res['data'])
        this.lcargando.ctlSpinner(false)
        Swal.fire({
          title: this.fTitle,
          text: res['data'],
          icon: 'success'
        })

      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Presupuesto de Departamentos')
      }
    )
  } */

  cancelaPrograma() {
    this.departamentos = []
    delete this.presupuesto
    this.selectables.map((select: NgSelectComponent) => select.handleClearClick())
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    // this.progSelect = 0
    // this.departamentos = []
    // this.programa = { presupuesto: { periodo: new Date().getFullYear() + 1, monto: 0, asignado: 0, disponible: 0 } }
    // this.vmButtons[0].habilitar = true
  }

}
