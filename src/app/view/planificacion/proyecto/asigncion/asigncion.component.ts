import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from 'src/app/global';

import { AsigncionService } from './asigncion.service';
import { BienesComponent } from './bienes/bienes.component';
import { AtribucionDetComponent } from './atribucion-det/atribucion-det.component';
import { TareasComponent } from './tareas/tareas.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ModalNuevaAtribucionComponent } from './modal-nueva-atribucion/modal-nueva-atribucion.component';
import Botonera from 'src/app/models/IBotonera';
declare const $: any;



@Component({
standalone: false,
  selector: 'app-asigncion',
  templateUrl: './asigncion.component.html',
  styleUrls: ['./asigncion.component.scss']
})

export class AsigncionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selectables: QueryList<NgSelectComponent>;
  fTitle = "Asignación de Bienes y Servicios por Atribución"
  mensajeSpinner: string
  dataUser: any
  permissions: any
  
  // 11-05-2023
  periodos: Array<any>;
  programas: Array<any>;
  departamentos: Array<any>;
  departamentosFilter: Array<any>;
  atribuciones: Array<any>;
  periodoSelected: number = null;
  programaSelected: any = null;
  programaObjectSelected: any = null;
  departamentoSelected: any = null;
  departamentoObjectSelected: any = null;
  presupuesto: any = {
    presupuesto: 0, 
    asignado: 0,
    disponible: 0,
  };

  // Legacy
  // presupuesto: any = { periodo: new Date().getFullYear() + 1 }
  // programas = []
  // departamentos = []
  attrDept = []
  lista_metas = []

  vmButtons: Botonera[] = []

  programaSeleccionado: any = 0
  departamentoSeleccionado: any = 0


  valor_meta: any
  valorPeriodo: any

  newCatalogo: any
  tipoCatalogo: any
  atribucionSelectNew: any = null
  valorCatalogo: any = null
  valueLabel: any
  description: any = null
  flag: any = false
  valNameGlobal: any

  unidadesMedida = []


  frecuencia: number = 0
  prevision: number = 0
  frecMedicion = []
  tiempoPrevision = []

  validaciones: ValidacionesFactory = new ValidacionesFactory();

  constructor(
    private apiService: AsigncionService, 
    private toastr: ToastrService, 
    private modalService: NgbModal, 
    private commonServices: CommonService,
    private commonVarService: CommonVarService
    ) {
      /* this.commonVarService.asignaTareas.asObservable().subscribe(
        (res: any) => {
          // console.log(res)
          this.attrDept.find(a => a.id === res.atribucion.id)['tareas'] = res.tareas  // Asigna tareas
          this.attrDept.find(a => a.id === res.atribucion.id).realizacion_tareas = res.porcentaje
          
          // Guardar en la base
          res.atribucion['id_programa'] = this.programaSeleccionado.id
          this.mensajeSpinner = 'Almacenando Tareas de Atribucion'
          this.lcargando.ctlSpinner(true)
          this.apiService.setTareas(res).subscribe(
            (response: any) => {
              this.attrDept.find(a => a.id === res.atribucion.id)['tareas'] = response.data
              // Object.assign(res.tareas, response.data)
              // console.log(res)
              this.lcargando.ctlSpinner(false)
              Swal.fire({
                title: this.fTitle,
                text: 'Tareas almacenadas exitosamente',
                icon: 'success'
              })
            },
            (err: any) => {
              console.log(err)
              this.lcargando.ctlSpinner(false)
              this.toastr.error(err.error.message, 'Error almacenando Tareas de Atribucion')
            }
          )
        }
      ) */

      this.apiService.hasBienes$.subscribe(
        (res: any) => {
          // Bienes han sido almacenados, 
          // 1. Volver a cargar el presupuesto del departamento con muchos bienes a traves de atribuciones
          // 2. actualizar las atribuciones para obtener el conteo
          this.handleClickBuscar()
        },
      )

      this.apiService.nuevaAtribucion$.subscribe(
        async (res: any) => {
          this.lcargando.ctlSpinner(true)
          try {
            this.mensajeSpinner = 'Almacenando Atribucion'
            let atribucion = {
              tipo: res.tipo,
              group: this.departamentoSelected,
              valor: res.valor,
              estado: 'A',
              id_empresa: 1,
            }
            let response = await this.apiService.setAtribucion(atribucion)
            console.log(response)
            
            this.lcargando.ctlSpinner(false)
            setTimeout(() => this.handleClickBuscar(), 75)
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error almacenado Atribucion')
          }
        }
      )

      this.apiService.actualizaPresupuesto$.subscribe(
        async () => {
          await this.handleClickBuscar()
          this.apiService.updatedPresupuesto.emit(this.presupuesto)
        }
      )
    }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsAttrs", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsAttrs", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsAttrs", paramAccion: "", boton: { icon: "fas fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      {
        orig: "btnsAttrs",
        paramAccion: "",
        boton: { icon: "far fa-envelope", texto: "ENVIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      },
      { orig: "btnAtribucionModal", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnAtribucionModal", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
    ]

    setTimeout(() => {
      this.validaPermisos()
    }, 50)

  }

  validaPermisos() {
    this.mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fAttrAsignacion,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonServices.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            // this.vmButtons[0].habilitar = false // Es manejado por seleccionaDepartamento()
            // this.cargaProgramas()
            // this.cargaCatalogos()
            this.cargaInicial()
          }, 250)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto + event.items.paramAccion) {
      case "CONSULTAR":
        this.handleClickBuscar()
        break;
      case "GUARDAR":
        this.handleClickGuardar()
        break;
      case "CANCELAR":
        this.handleClickCancelar()
        break;
      case "ENVIAR":
        this.enviarCorreo();
        break;
      case "CERRAR2":
        this.cancelcatalogo();
        break;
      case "GUARDAR2":
        //this.vaidateSaveCatalogo();
        this.crearAtribucion();
        break;

      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando Catalogos'
      let response: any = await this.apiService.getCatalogo({params: "'PLA_FRECUENCIA_MEDICIO','PLA_MESES_META','PLA_U_MED','PLA_META_POA'"});
      this.frecMedicion = response.PLA_FRECUENCIA_MEDICIO
      this.tiempoPrevision = response.PLA_MESES_META
      this.unidadesMedida = response.PLA_U_MED
      this.lista_metas = response.PLA_META_POA


      this.mensajeSpinner = 'Cargando Periodos'
      this.periodos = await this.apiService.getPeriodos();

      this.mensajeSpinner = 'Cargando Programas'
      this.programas = await this.apiService.getProgramas();
      this.programas.map((programa: any) => Object.assign(programa, { label: `${programa.descripcion}. ${programa.valor}` }))

      this.mensajeSpinner = 'Cargando Departamentos'
      this.departamentos = await this.apiService.getDepartamentos();
      this.departamentos.map((departamento: any) => Object.assign(departamento, { label: `${departamento.descripcion}. ${departamento.valor}` }))

   
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Data Inicial')
    }
  }

  handleSelectPrograma(event) {
    if (event == undefined) return;
    this.departamentoSelected = null
    this.departamentosFilter = this.departamentos.filter((departamento: any) => departamento.grupo == event.valor)
    this.programaObjectSelected = event

    this.vmButtons[0].habilitar = !(this.periodoSelected && this.programaObjectSelected && this.departamentoSelected)
  }

  handleSelectDepartamento(event) {
    console.log(event)
    if (event == undefined) return;
    // Alguna otra accion
    this.departamentoObjectSelected = event
    // console.log(this.departamentoObjectSelected.grupo)

    this.vmButtons[0].habilitar = !(this.periodoSelected && this.programaObjectSelected && this.departamentoSelected)
  }

  handleSelectMeta(event: any, atribucion: any) {
    if (event == undefined) return;
    // Alguna otra accion
    Object.assign(
      atribucion.atribucion_data,
      {
        meta: event.descripcion,
        fk_meta: event.id_catalogo
      }
    )
  }

  async loadPresupuesto() {
    Object.assign(this.presupuesto, {
      presupuesto: 0, 
      asignado: 0,
      disponible: 0,
    })

    try {
      this.mensajeSpinner = 'Cargando Presupuesto de Departamento';
      let response = await this.apiService.getPresupuestoDepartamento({periodo: this.periodoSelected, programa: this.programaObjectSelected, departamento: this.departamentoObjectSelected});
      console.log(response)
      if (Array.isArray(response) && !response.length) {
        Swal.fire('Departamento seleccionado no tiene Presupuesto asignado.', '', 'info')
      } else {
        this.presupuesto = response;
        let asignado = this.presupuesto.bienes.reduce((total, actual) => total + parseFloat(actual['costo_total']), 0);
        let disponible = parseFloat(this.presupuesto.presupuesto) - asignado;
        Object.assign(this.presupuesto, { asignado, disponible });
        if (disponible < 0) {
          Swal.fire('Se ha excedido del presupuesto. Por favor revisar.', '', 'warning')
        }
      }
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Presupuesto')
    }
  }

  async handleClickBuscar() {
    delete this.atribuciones
    this.lcargando.ctlSpinner(true)
    try {
      await this.loadPresupuesto()

      this.mensajeSpinner = 'Cargando Atribuciones';
      this.atribuciones = await this.apiService.getAtribuciones({periodo: this.periodoSelected, programa: this.programaSelected, departamento: this.departamentoSelected});
      this.atribuciones.map((atribucion: any) => {
        if (atribucion.atribucion_data == null) {
          Object.assign(atribucion, { 
            atribucion_data: { 
              id: null, 
              indicador: null, 
              formula: null, 
              fk_frecuencia: null, 
              meta: null, 
              fk_meta: null, 
              fk_prevision: null, 
              cuatrimestre1: 0, cuatrimestre2: 0, cuatrimestre3: 0, cuatrimestre4: 0 ,
              realizacion: 0,
            } 
          })
        }
        this.sumaRealizacion(atribucion);
      })

      this.vmButtons[1].habilitar = false
      this.vmButtons[3].habilitar = false

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err);
      this.lcargando.ctlSpinner(false);
      this.toastr.error(err.error.message, 'Error cargando datos de Departamento');
    }
  }

  async handleClickGuardar() {
    this.lcargando.ctlSpinner(true)
    try {
      await this.validateData()

      try {
        this.mensajeSpinner = 'Almacenando Atribuciones'
        let response = await this.apiService.setAtribuciones({
          periodo: this.periodoSelected, 
          programa: this.programaObjectSelected, 
          departamento: this.departamentoObjectSelected, 
          atribuciones: this.atribuciones
        });
        console.log(response)
  
        this.lcargando.ctlSpinner(false)
        Swal.fire('Atribuciones almacenadas correctamente', '', 'success').then(() => this.handleClickBuscar())
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Atribuciones')
      }
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(err, 'Validación de Datos', {enableHtml: true})
    }

  }

  handleClickCancelar() {
    this.vmButtons[1].habilitar = true
    this.vmButtons[3].habilitar = true
    this.valorPeriodo= ''
    delete this.atribuciones;
    this.selectables.map((selectable: NgSelectComponent) => selectable.handleClearClick())
  }

  validateData() {
    return new Promise((resolve, reject) => {
      let message = '';

      if (this.presupuesto.disponible < 0) {
        message += '* Se ha excedido del presupuesto.<br>'
      }

      let formula = 0
      let indicador = 0
      /* this.atribuciones.forEach((atribucion: any) => {
        if (atribucion.atribucion_data.formula == null) {
          formula += 1
        }
        if (atribucion.atribucion_data.indicador == null) {
          indicador += 1
        }
      }) */
      if (formula > 0) {
        message += `* Existen ${formula} atribuciones sin Formula<br>`
      }
      if (formula > 0) {
        message += `* Existen ${indicador} atribuciones sin Indicador<br>`
      }

      this.atribuciones.forEach((atribucion: any, index: number) => {
        let realizacion = atribucion.atribucion_data.cuatrimestre1 + atribucion.atribucion_data.cuatrimestre2 + atribucion.atribucion_data.cuatrimestre3 + atribucion.atribucion_data.cuatrimestre4
        if (realizacion > 100) {
          message += `* Atribucion ${index + 1}: Realizacion supera al 100%`
        }
      })

      return (!message.length) ? resolve(true) : reject(message);
    })
  }

  cancelcatalogo() {
    console.log('cerrar')
    this.description = null;
    this.valorCatalogo = null;
    ($('#exampleModal') as any).modal('hide');
  }
 

 
 
  crearAtribucion() {
   
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.valorCatalogo} como nuevo catálogo`,
      id_controlador: myVarGlobals.fIngresoProducto,
      tipo: this.tipoCatalogo,
      group: (this.departamentoObjectSelected.valor != undefined) ? this.departamentoObjectSelected.valor : null,
      descripcion: this.description,
      valor: this.valorCatalogo,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }
    console.log(data)
    this.mensajeSpinner = 'Almacenando Atribucion'
    this.lcargando.ctlSpinner(true);
    this.apiService.saveRowCatalogo(data).subscribe(res => {
      this.cancelcatalogo();
      // this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      //this.disableMarca = true;
      this.description = null;
      this.valorCatalogo = null;
      this.atribucionSelectNew = null;
      // this.colorSelect = 0;
      // this.modeloSelect = 0;
      // this.marcaSelect = 0;
      // this.dataMarcas = undefined;
      // this.dataModelos = undefined;
      // this.dataColores = undefined;
      this.flag = false;
      // this.cargaPresupuestoDepartamento(this.departamentoSeleccionado)
      //this.getCatalogos();
      this.handleClickBuscar();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  /* seleccionaPrograma(event) {
    // Funcion intermedia para limpiar la pantalla y objetos
    this.vmButtons[0].habilitar = true
    this.departamentos = []
    this.departamentoSeleccionado = 0
    this.attrDept = []

    if (this.programaSeleccionado !== 0) this.cargaDepartamentos(event)
  } */

  /* cargaDepartamentos(event) {
    console.log(event);
    // Carga los departamentos asociados al programa seleccionado
    this.mensajeSpinner = 'Cargando Departamentos'
    this.lcargando.ctlSpinner(true)
    let data = {
      programa: event.nombre
    }

    this.apiService.getDepartamentos(data).subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          this.lcargando.ctlSpinner(false)
          Swal.fire({
            title: this.fTitle,
            text: 'No hay departamentos asociados.',
            icon: 'warning'
          })
          return
        }

        res['data'].forEach(d => {
          let departamento = {
            id: d.id_catalogo,
            nombre: d.valor,
            codigo: d.descripcion,
            presupuesto: {
              id: null,  // pla_departamento_presupuesto.id
              id_presupuesto: null,  // pla_departamento_presupuesto.fk_presupuesto
              monto: 0,
              asignado: 0,
              disponible: 0,
              estado: 0
            }
          }
          this.departamentos.push(departamento)
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Departamentos')
        console.log(err)
      }
    )
  } */

  /* cargaPresupuestoDepartamento(event) {
    // Al seleccionar un departamento, cargo el presupuesto y llamo para cargar las atribuciones
    let data = {
      departamento: event,
      presupuesto: this.presupuesto
    }

    this.mensajeSpinner = 'Cargando Presupuesto del Departamento'
    this.lcargando.ctlSpinner(true)
    this.attrDept = []
    this.apiService.getPresupuestoDepartamento(data).subscribe(
      res => {
        // console.log(res)
        // this.lcargando.ctlSpinner(false)
        // console.log(this.programaSeleccionado);
        // console.log(this.departamentoSeleccionado);
        // console.log(this.programas);
        // console.log(this.departamentos);
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          this.lcargando.ctlSpinner(false)
          Swal.fire({
            title: this.fTitle,
            text: 'No hay presupuesto asignado.',
            icon: 'warning'
          })
          return
        }
        
        let presupuesto = {
          id: res['data']['id'],  // pla_departamento_presupuesto.id
          id_presupuesto: res['data']['fk_presupuesto'],  // pla_departamento_presupuesto.fk_presupuesto
          monto: parseFloat(res['data']['presupuesto']),
          estado: res['data']['estado']
        }
        Object.assign(this.departamentos.find(d => d.id == event.id).presupuesto, presupuesto)

        this.vmButtons[0].habilitar = event.presupuesto.estado == 1
        this.vmButtons[2].habilitar = event.presupuesto.estado == 1
        this.getAtribucionesDepartamento(data)
        // this.cargaMetas();
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Presupuesto de Programa')
      }
    )
  } */

    // 2
  /* getAtribucionesDepartamento(arg) {
    // Carga las atribuciones asociadas al departamento seleccionado
    let data = {
      departamento: arg.departamento.nombre
    }
    this.mensajeSpinner = 'Cargando Atribuciones del Departamento'
    this.apiService.getAtribuciones(data).subscribe(
      res => {
        // console.log(res['data'])
        res['data'].forEach(r => {
          let atrib = {
            id: null,
            id_departamento: arg.departamento.id,
            id_catalogo: r.id_catalogo,
            nombre: r.valor,
            departamento: this.departamentoSeleccionado,
            bienes: [],
            bienes_e: [],
            tareas: [],
            indicador: '',
            formula: '',
            meta: 0,
            realizacion: { trimestre: [0, 0, 0, 0], frecMedicion: { id: 0, nombre: '' }, tiempoPrevision: { id: 0, nombre: '' }, total: 0 },

          }
          this.attrDept.push(atrib)
        })
        // console.log(this.attrDept)
        this.cargaDatosRelacionados()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando las Atribuciones')
      }
    )
  } */


  // cargando
  /* cargaDatosRelacionados() {
    // Carga desde la tabla pla_atribucion
    this.mensajeSpinner = 'Cargando data de Atribuciones'
    let data = {
      params: this.attrDept.map(a => a.id_catalogo)
    }
    console.log()

    this.apiService.getAtribBienes(data).subscribe(
      res => {
         console.log(res['data'])
        res['data'].forEach(r => {
          // console.log(r)
          let bienes = []
          if (r.bienes.length > 0) {
            r.bienes.forEach(b => {

              console.log(b.fk_medida)

              // console.log(b)
              let bien = {
                id: b.id,
                id_departamento: this.departamentoSeleccionado.id,
                id_atribucion: r.id,
                descripcion: b.descripcion,
                cant: parseInt(b.cantidad),
                //uMedida: b.fk_medida == null ? { id: 0, nombre: '' } : this.unidadesMedida.find(m => m.id == b.fk_medida.id_catalogo),
                uMedida: b.fk_medida == null ? { id: 0, nombre: '' } : this.unidadesMedida.find(m => m.id == b.fk_medida),
                costoUnitario: parseFloat(b.costo_unitario),
                costoTotal: parseFloat(b.costo_total),
                mes: {
                  ene: b.periodo1,
                  feb: b.periodo2,
                  mar: b.periodo3,
                  abr: b.periodo4,
                  may: b.periodo5,
                  jun: b.periodo6,
                  jul: b.periodo7,
                  ago: b.periodo8,
                  sep: b.periodo9,
                  oct: b.periodo10,
                  nov: b.periodo11,
                  dic: b.periodo12
                }
              }
              bienes.push(bien)
            })
          }

          let realizacion = {
            trimestre: [r.cuatrimestre1, r.cuatrimestre2, r.cuatrimestre3, r.cuatrimestre4],
            total: r.cuatrimestre1 + r.cuatrimestre2 + r.cuatrimestre3 + r.cuatrimestre4,
            frecMedicion: r.fk_frecuencia == 0 ? { id: 0, nombre: '' } : this.frecMedicion.find(f => f.id == r.fk_frecuencia),
            tiempoPrevision: r.fk_prevision == 0 ? { id: 0, nombre: '' } : this.tiempoPrevision.find(p => p.id == r.fk_prevision)
          }

          // console.log(r.meta);

          let response = {
            'bienes': bienes,
            'realizacion': realizacion,
            'indicador': r.indicador,
            'formula': r.formula,
            'meta': r.meta == null ? { id: 0, nombre: '' } : this.lista_metas.find(m => m.codigo == r.meta.descripcion),
            'id': r.id
          }
          Object.assign(this.attrDept.find(a => a.id_catalogo == r.fk_atributo), response)
        })
        this.sumaBienes()
        // console.log(this.attrDept)
        // this.lcargando.ctlSpinner(false)
        this.cargaTareas()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Bienes y Servicios')
      }
    )
  } */

  /* cargaTareas() {
    let data = {
      params: this.attrDept.map(a => a.id_catalogo)
    }
    // this.lcargando.ctlSpinner(true)  // Ya viene activado
    this.mensajeSpinner = 'Cargando Tareas'
    this.apiService.getTareas(data).subscribe(
      (res: any) => {
        // console.log(res)
        res.data.forEach(t => {
          this.attrDept.find(a => a.id_catalogo === t.fk_atribucion).tareas.push(t)
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Tareas de Atribuciones')
        console.log(err)
      }
    )
  } */

  /* totalRalizacion(event){
    console.log(event)
  } */

  /* actualizaPresupuesto() {
    if (this.permissions.guardar == '0') {
      this.toastr.warning('No tiene permisos para usar este recurso', this.fTitle)
      return
    }

    if (this.departamentoSeleccionado.presupuesto.disponible < 0) {
      Swal.fire({
        title: this.fTitle,
        text: 'Se ha excedido del presupuesto. Por favor, verifique.',
        icon: 'warning'
      })
      return
    }
    if (this.departamentoSeleccionado.presupuesto.disponible < 0) {
      Swal.fire({
        title: this.fTitle,
        text: 'Se ha excedido del presupuesto. Por favor, verifique.',
        icon: 'warning'
      })
      return
    }

    if(this.attrDept.length != 0 ) {
       
      for (let index = 0; index < this.attrDept.length; index++) {
        if (this.attrDept[index].realizacion.total > 100 ) {
          this.toastr.info("El total no puede ser mayor al 100% ");
          return
        } 
      }
    }

   
   
    

    // TODO: Validar que todos los campos esten llenos de las atribuciones

    this.mensajeSpinner = 'Actualizando Estado de Presupuesto'
    let data = {
      params: this.departamentoSeleccionado
    }
    // console.log(data.params)
    this.lcargando.ctlSpinner(true)
    this.apiService.actualizaPresupuesto(data).subscribe(
      res => {
        // console.log(res['data'])
        // this.lcargando.ctlSpinner(false)
        // if (Array.isArray(res['data']) && !res['data'].length) {
        //   this.toastr.info('No se han realizado cambios en el Estado del Presupuesto.')
        // }

        // this.almacenaAttr()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error actualizando Estado de Presupuesto')
      }
    )
  } */

  /* almacenaAttr() {
    if (this.permissions.guardar == '0') {
      this.toastr.warning('No tiene permisos para usar este recurso', this.fTitle)
      return
    }

    this.mensajeSpinner = 'Almacenando Atribuciones y Bienes y Servicios'
    let data = {
      ids: this.attrDept.map(a => a.id),
      atribuciones: this.attrDept
    }
    // console.log(data)
    this.lcargando.ctlSpinner(true)
    this.apiService.almacenaAttrs(data).subscribe(
      res => {
        // console.log(res['data'])
        this.lcargando.ctlSpinner(false)
        Swal.fire({ title: this.fTitle, text: res['data'], icon: 'success' })
        // this.cargaPresupuestoDepartamento(this.departamentoSeleccionado)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando las Atribuciones')
      }
    )
  } */

  setCatalogoTitle(d, type, data) {
    $('#exampleModal').appendTo("body").modal('show');
    this.newCatalogo = d;
    this.tipoCatalogo = type;
    this.valueLabel = data;
  }

  expandNuevaAtribucion() {
    const modal = this.modalService.open(ModalNuevaAtribucionComponent, { size: 'xl', backdrop: 'static' })
  }

  expandBienes(atribucion: any) {
    if (this.permissions.editar == '0') {
      this.toastr.warning('No tiene permisos para este recurso', this.fTitle)
      return
    }

    const modal = this.modalService.open(BienesComponent, { size: "xl", backdrop: 'static' })
    modal.componentInstance.periodo = this.periodoSelected
    modal.componentInstance.programa = this.programaObjectSelected
    modal.componentInstance.departamento = this.departamentoObjectSelected
    modal.componentInstance.atribucion = atribucion
    modal.componentInstance.unidadesMedida = this.unidadesMedida
    modal.componentInstance.presupuesto = this.presupuesto
    modal.componentInstance.valor_periodo = this.valorPeriodo
  }

  expandTareas(atribucion: any) {
    const modal = this.modalService.open(TareasComponent, { size: 'xl', backdrop: 'static'})
    modal.componentInstance.periodo = this.periodoSelected
    modal.componentInstance.programa = this.programaObjectSelected
    modal.componentInstance.departamento = this.departamentoObjectSelected
    modal.componentInstance.atribucion = atribucion
    modal.componentInstance.lst_metas = this.lista_metas
  }

  // 1
  tareas(atribucion) {
    if (this.permissions.editar == '0') {
      this.toastr.warning('No tiene permisos para este recurso', this.fTitle)
      return
    }

    const modal = this.modalService.open(TareasComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.programa = this.programaSeleccionado
    modal.componentInstance.departamento = this.departamentoSeleccionado
    modal.componentInstance.atribucion = atribucion
    modal.componentInstance.permissions = this.permissions
  }

  showAttr(atribucion) {
    const modal = this.modalService.open(AtribucionDetComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.atribucion = atribucion
  }

  sumaRealizacion(atribucion) {
    // atribucion.realizacion.total = atribucion.realizacion.trimestre.reduce((parcial, a) => parseInt(parcial) + parseInt(a), 0)
    let realizacion = parseFloat(atribucion.atribucion_data.cuatrimestre1) + parseFloat(atribucion.atribucion_data.cuatrimestre2) + parseFloat(atribucion.atribucion_data.cuatrimestre3) + parseFloat(atribucion.atribucion_data.cuatrimestre4);
    // console.log(atribucion)
    // console.log(realizacion)
    if (realizacion > 100) {
      this.toastr.warning(atribucion.valor, 'Realizacion por periodos excede el 100%')
      // return;
    }
    Object.assign(atribucion, { realizacion });
  }

  sumaBienes() {
    this.departamentoSeleccionado.presupuesto.asignado = 0;
    this.attrDept.forEach(attr => {
      attr.bienes.forEach(bien => {
        this.departamentoSeleccionado.presupuesto.asignado += bien.costoTotal
      });
    })
    this.departamentoSeleccionado.presupuesto.disponible = this.departamentoSeleccionado.presupuesto.monto - this.departamentoSeleccionado.presupuesto.asignado
  }

  handleSelectPeriodo(event: any, item: any) {
    this.valorPeriodo = event.periodo
  }
  
  enviarCorreo() {
    let data = {
      programa: this.programaObjectSelected,
      departamento: this.departamentoObjectSelected,
    }
    this.mensajeSpinner = 'Enviando correos...'
    this.lcargando.ctlSpinner(true)
    this.apiService.enviarCorreos(data).subscribe(
      res => {
        this.lcargando.ctlSpinner(false)
        Swal.fire({
          title: this.fTitle,
          text: 'Envio de correo: ' + res['message'],
          icon: 'success'
        });
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error enviando el correo')
      }
    )
  }
}
