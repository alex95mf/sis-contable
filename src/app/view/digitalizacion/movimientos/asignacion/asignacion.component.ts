import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DetalleSolicitudComponent } from './detalle-solicitud/detalle-solicitud.component'

import { DetallePrestamoComponent } from './detalle-prestamo/detalle-solicitud.component'
import { AsignacionService } from './asignacion.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';
import moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonVarService } from 'src/app/services/common-var.services';
import { DatePipe } from '@angular/common';

import { ModalUsuariosComponent } from 'src/app/config/custom/modal-usuarios/modal-usuarios.component';



import { ConsultaDirectorioService } from '../consulta-directorio/consulta-directorio.service';
import { subscribeOn } from 'rxjs/operators';
@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.scss']
})
export class AsignacionComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";
  newReserva: any;
  numeros_medios: any = [];
  bodega: any;
  ubicacion: any;
  dataBodega: any;
  dataubicacion: any;
  dataubicacionIndividual: any = [];
  disableGeneralUbicaciones:any = false;
  tipo_medida: any;
  programa: any = [];
  departamento: any = [];
  atribucion: any = [];
  resultadoConsulta: any;
  detallesToSave: any = [];
  medios_to_save: any = [];
  lst_tipoDoC: any;
  listaSolicitudes: any = [];
  listaSolicitudesAtribucion: any = [];
  tipoDoC: any;
  nuevaSolicitud: boolean = true;
  diasprestamotemporal: any;
  diasprestamoactual: any
  nuevaS: any = {
  }
  listaPrestamos: any = [];
  total: any = 0;

  vmButtons: any;

  dataForms: any;
  rutaFinal: any;
  campos: any;
  documento: any
  fecha: Date = new Date();
  periodo: Date = new Date();

  cmb_periodo: any[] = []
  periodoSelectedV: any

  atribucionParams: any = {
    programa: null,
    departamento: null,
    atribucion: null
  }


  binding: any;
  DocGeneral: any;
  directorioDt: any;
  paginate: any;
  filter: any;
  documentoactual: any;
  paginateNew: any;
  filterNew: any;
  masterSelected: boolean = false

  dataUser: any;
  permissions: any;

  firstday: any;
  lastday: any;
  today: any;
  tomorrow: any;
  daylimit: any;
  atribucionParamsNew: any;

  datoDepartamento: any = []

  dato_Programa: any = []

  dropdownSettings: IDropdownSettings = {};
  cargarAnexo: boolean = true;



  fileList: FileList;

  changeCheck: boolean = true;
  filterdev: any;

  estadoDevList = [
    { value: "P", label: "Prestado" },
    { value: "D", label: "Devuelto" },
  ]


  constructor(
    private router: Router,
    private modalDet: NgbModal,
    private service: AsignacionService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarService: CommonVarService,
    private modalService: NgbModal,

    private commonVarSrv: CommonVarService,

    private apiService: ConsultaDirectorioService,
  ) {
    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
    this.commonVarSrv.selectUsuario.asObservable().subscribe(
      (res) => {
        this.newReserva.id_usuario = res['data']['id_usuario'];
        this.newReserva.usuario = res['data']['usuario'];
      }
    )

    this.commonVarService.diableCargarDis.asObservable().subscribe(
      (res) => {
        this.cargarAnexo = false;
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [{
      orig: 'btnsComprasP',
      paramAccion: '',
      boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
      clase: 'btn btn-sm btn-primary',
      permiso: true,
      showimg: true,
      showtxt: true,
      showbadge: false,
      habilitar: false,
    },
    { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },

    { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-eraser", texto: "Limpiar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
      , { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-eraser", texto: "Nuevo" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
    { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false }

    ]
    this.vmButtons[3].showimg = false
    this.vmButtons[2].showimg = false
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(), this.today.getMonth(), 1);


    // Obtén el primer día del próximo mes
    this.lastday = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);

    // Resta un día al primer día del próximo mes para obtener el último día del mes actual
    this.lastday = new Date(this.lastday - 1);

    // Ahora lastDayOfMonth contiene la fecha del último día del mes actual



    this.filter = {
      num_solicitud: "",
      estado: ['A', 'P', 'D'],
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: "",
      tipo_documento: null,
      buscador: '',
      descripcion: '',
      campos: [],
    };

    this.filterdev = {
      codigo: '',
      fecha: moment(this.firstday).format('YYYY-MM-DD'),
      fechamaxima: moment(this.lastday).format('YYYY-MM-DD'),
      num_orden: '',
      estadoSelected: '',
    };


    /*   this.filter = {
      
        filterControl: ""
      } */

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.filterNew = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    };

    this.atribucionParamsNew = {
      programa: null,
      departamento: null,
      atribucion: null,
      num_solicitud: null,
      // fecha_creacion: new Date()
      fecha_creacion: moment(this.today).format('YYYY-MM-DD')
    }

    this.paginateNew = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.vmButtons[0].showimg = false
    this.vmButtons[1].showimg = false

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    setTimeout(() => {
      this.validaPermisos();
      this.getDatosIniciales();
      this.obtenerparametros();
      this.getCatalogos();
      this.getBodegas();
    }, 500);


  }


  validaPermisos() {
    this.mensajeSppiner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fCPSolici,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        // console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.");
          this.vmButtons = [];
        } else {
          this.cargarPrograma()
          this.SearchList()
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );


  }
  /* 
    metodoGlobal(event: any) {
      switch (event.items.boton.texto) {
        
        case "LIMPIAR":
        
          break;
      
        default:
          break;
      }
    } */


  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "Guardar":
        // this.validaSolicitud();

        this.saveBodega();
        break;
      case "Regresar":
        this.regresar();
        break;
      case "Nuevo":
        this.nuevoSolicitud(1);//()
        break;

      case "Buscar":
        this.SearchList();
        break;
      case "Limpiar":
        this.limpiar();
        break;
      case "CONSULTAR":
        let newPaginate = {
          perPage: 10,
          page: 1,
        }
        Object.assign(this.paginateNew, newPaginate);
        this.consultarDirectorio()
        break;
    }
  }

  async validaSolicitud() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar Solicitudes de Compras")
      return;
    }
    else if (this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para ver Solicitudes de Compras.");
      return;
    }

    try {
      await this.validaDataGlobal()

      this.guardarSolicitud()
    } catch (err) {
      console.log(err)
      this.toastr.warning(err, '', { enableHtml: true })
    }


    /* else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          this.guardarSolicitud();

        }
      });
    } */

  }



  validaDataGlobal() {
    // console.log(this.ticketNew);
    let flag = false;
    return new Promise((resolve, reject) => {

      let message = '';

      let contador = 0;
      let contaro_tru = 0;
      let valor = 0;
      this.listaSolicitudesAtribucion.forEach((item: any) => {
        if (!item.check) {
          contador += 1;
        } else {
          contaro_tru += 1;
        }

        if (item.check && item.cantidad_requerida == null) {
          valor += 1;
        }
      });
      let fecha_creacion = moment(this.atribucionParamsNew.fecha_creacion).format('YYYY');
      if (fecha_creacion != this.periodoSelectedV) message += '* La fecha debe estar dentro de periodo seleccionado <br>';

      if (this.atribucionParamsNew.num_solicitud == null || this.atribucionParamsNew.num_solicitud == '') message += '* Debe ingresar el número de solicitud<br>';
      if (this.atribucionParamsNew.descripcion == '' || this.atribucionParamsNew.descripcion == null || this.atribucionParamsNew.descripcion == undefined) message += '* No ha ingresado una Descripcion<br>';
      if (!this.listaSolicitudesAtribucion.length) message += '* No ha cargado bienes<br>';
      if (this.listaSolicitudesAtribucion.length && contaro_tru == 0) message += '* Debe seleccionar un bien<br>';
      if (valor > 0) message += '* Debe colocar una cantidad requerida<br>';

      return (!message.length) ? resolve(true) : reject(message)
    })
  }

  asignarEstado(evt) {
    this.filter.estado = [evt]
  }

  periodoSelected(evt: any, year: any) {
    console.log(evt)
    this.periodo = evt
    if (evt) {
      this.cargarPrograma();
    }



  }

  calcularValorTotal() {
    let total = 0
    this.listaSolicitudesAtribucion.map((res) => {
      if (res.check) {
        console.log('Entro', res.costo_unitario);
        total += res.precio_cotizado
      }

    })
    this.total = total
    console.log(total);
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.SearchList();
  }

  selectTipoMedioMid(event, origen) {
    if (origen == "select") {
      this.paginateNew = {
        length: 0,
        perPage: 10,
        page: 1,
        pageSizeOptions: [5, 10]
      };
      this.selectTipoMedio(event)
    } else if (origen == "paginador") {
      this.selectTipoMedio(event)
    }
  }

  changePaginateNew(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginateNew, newPaginate);
    /*   this.consultarDirectorio(); */
    let origen = "paginador";
    this.selectTipoMedioMid(this.tipo_medida, origen);
    // SearchBienes
  }


  cantidadTotalItem(item) {
    console.log(item['precio_cotizado']);


    let precio_cotizado = item['costo_unitario'] * item['cantidad_requerida']

    if (precio_cotizado > item['costo_total_por_solicitar']) {
      this.toastr.info('El Valor Total de ' + this.commonSrv.formatNumberDos(precio_cotizado) + ' no puede ser mayor al Total Disponible de ' + this.commonSrv.formatNumberDos(parseFloat(item['costo_total_por_solicitar'])))
      setTimeout(() => {
        item['precio_cotizado'] = null
      }, 10);

    } else if (item['cantidad_requerida'] <= 0) {
      this.toastr.info('El valor ingresado no debe ser menor o igual a 0')
      setTimeout(() => {
        item['cantidad_requerida'] = null
      }, 10);

    }

    else {
      item['precio_cotizado'] = (item['costo_unitario'] * item['cantidad_requerida'])
      this.calcularValorTotal()
    }

  }


  guardarSolicitud() {
    console.log(this.departamento)

    if (this.fileList == undefined) {
      this.toastr.info("Debe ingresar un anexo")
      return;
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar el formulario?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {

      if (result.isConfirmed) {
        this.mensajeSppiner = "Creando Solicitud...";
        this.lcargando.ctlSpinner(true);
        console.log(this.atribucionParamsNew);
        let detalles = []
        this.listaSolicitudesAtribucion.map((res) => {
          if (res.check) {
            detalles.push(res)
          }
        })
        let data = {
          documento: {

            valor: this.total,
            estado: 'P',
            detalles: detalles,
            fecha_creacion: this.atribucionParamsNew.fecha_creacion,
            num_solicitud: this.atribucionParamsNew.num_solicitud,
            descripcion: this.atribucionParamsNew.descripcion,
            periodo: this.periodoSelectedV
          }

        }
        this.service.crearSolicitud(data).subscribe((dat: any) => {
          console.log(dat);
          this.uploadFile(dat.data.id_solicitud)
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "success",
            title: "Se creo una nueva solicitud",
            text: dat['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8'
          }).then((result) => {
            if (result.isConfirmed) {
              this.nuevaSolicitud = true
              this.vmButtons[0].showimg = false
              this.vmButtons[1].showimg = false
              /*   this.vmButtons[2].showimg = true */
              this.listaSolicitudesAtribucion = []
              this.atribucionParamsNew = {
                programa: null,
                departamento: null,
                atribucion: null,
                num_solicitud: null,
                fecha_creacion: moment(this.today).format('YYYY-MM-DD')
              }
              this.total = 0;
              this.SearchList()
            }
          });
        })
      }
    });



  }

  onProgramaSelect(event: Array<any>) {
    console.log(event)
    this.departamento = []
    this.datoDepartamento = []
    this.listaSolicitudesAtribucion = []
  }

  onDepartamentoSelect(event: Array<any>) {
    this.listaSolicitudesAtribucion = []
  }

  onMaterialGroupChange(event) {
    // this.departamento = []
  }

  cargarPrograma() {
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);

    this.service.searchPrograma({ periodo: this.periodo.getFullYear() }).subscribe((res: any) => {
      console.log(res);
      this.lcargando.ctlSpinner(false);
      let program = []
      res.forEach((data) => {
        let dat = {
          ...data.catalogo,
          value: data.catalogo['descripcion'] + '-' + data.catalogo['valor']
        }
        program.push(dat)
        // this.lcargando.ctlSpinner(false);
      })
      this.programa = program
      console.log(this.programa);
    })
  }

  departamentoSearch() {
    // console.log(event);
    this.mensajeSppiner = "Cargando Departamentos...";
    this.lcargando.ctlSpinner(true);

    this.service.searchDepartamento({ programa: this.dato_Programa }).subscribe(
      (data: any) => {
        data.map((item: any) => Object.assign(item, { value: `${item.descripcion} - ${item.valor}` }))
        this.departamento = data
        // console.log(this.departamento);
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
      }
    )
  }
  
 /*  AtribucionSearch(event) {
    // console.log(event);
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      departamento: event.valor
    }
    this.service.searchAtribucion(data).subscribe((dat) => {
      // console.log(dat);
      this.atribucion = dat['data']
      this.lcargando.ctlSpinner(false);
    })
  } */

  SearchList() {
    // console.log(event);

    this.lcargando.ctlSpinner(true);
    this.listaSolicitudes = []
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id_programa: this.dato_Programa,
      id: this.datoDepartamento,
      params: {
        paginate: this.paginate,
        filter: this.filter,
        filterdev: this.filterdev,
      }
    }
    this.listaPrestamos = [];
    console.log(data);
    this.service.searchReservascab(data).subscribe((dat) => {
      console.log(dat);

      if (dat['data'].length == 0) {
        this.listaSolicitudes = [];
      } else {
        // this.listaSolicitudes = dat['data'];
        this.paginate.length = dat['total'];
        if (dat['current_page'] == 1) {
          this.listaPrestamos = dat['data'];
        } else {
          this.listaPrestamos = Object.values(dat['data']);
        }
      }



      this.lcargando.ctlSpinner(false);
    },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
      }
    )


  }

  SearchBienes() {
    // console.log(event);
    this.listaSolicitudesAtribucion = []
    this.mensajeSppiner = "Cargando Bienes...";
    this.lcargando.ctlSpinner(true);
    let data = {
      //valor_programa: this.dato_Programa,
      id: this.datoDepartamento,
      periodo: this.periodoSelectedV

    }

    this.service.searchBienes(data).subscribe((dat) => {
      console.log(dat);
      if (dat['data'].length == 0) {
        this.toastr.info('No existe bienes para el Departamento seleccionado.')
        this.listaSolicitudesAtribucion = []
      } else {


        dat['data'].map((res) => {
          let bienes = {
            id: res.id,
            check: false,
            descripcion: res.descripcion,
            valor: res.u_medida?.valor,
            u_medida: res.u_medida,
            cantidad_solicitada: res.cantidad_por_solicitar,
            costo_total_por_solicitar: res.costo_total_por_solicitar,
            //costo_unitario: res.costo_unitario,
            costo_unitario: 0,
            fk_departamento: res.fk_departamento,
            departamento: res.departamento?.valor,
            fk_atribucion: res.fk_atribucion?.id,
            atribucion: res.fk_atribucion?.catalogo?.valor,
            fk_programa: res.departamento?.programa?.id_catalogo,
            programa: res.departamento?.programa?.valor,
            cantidad_requerida: null,
            precio_cotizado: null
          }
          this.listaSolicitudesAtribucion.push(bienes)

        })


      }

      this.lcargando.ctlSpinner(false);

    })




  }

  async nuevoSolicitud(valor) {
    this.limpiar();
    this.vmButtons[2].showimg = true
    this.vmButtons[3].showimg = true
    this.vmButtons[4].showimg = false
    this.nuevaSolicitud = false
    this.vmButtons[0].showimg = true
    this.vmButtons[1].showimg = true

    if (!!this.atribucionParams['atribucion']) {
      this.atribucionParamsNew['programa'] = this.atribucionParams['programa']
      this.atribucionParamsNew['departamento'] = this.atribucionParams['departamento']
      this.atribucionParamsNew['atribucion'] = this.atribucionParams['atribucion']
      console.log(this.atribucionParamsNew['atribucion']);
      this.SearchBienes();
    }

    let periodos = await this.service.getPeriodos().toPromise<any>()
    console.log(periodos.data)
    this.cmb_periodo = periodos.data


  }


  regresar() {
    this.vmButtons[0].showimg = false
    this.vmButtons[1].showimg = false
    this.vmButtons[2].showimg = false 
    this.vmButtons[3].showimg = false
    this.vmButtons[4].showimg = true
    this.nuevaSolicitud = true

    this.atribucionParamsNew = {
      programa: null,
      departamento: null,
      atribucion: null,
      num_solicitud: null,
      fecha_creacion: moment(this.today).format('YYYY-MM-DD')
    }

    this.listaSolicitudesAtribucion = []
    this.newReserva = {
      codigo: '',
      observacion: '',
      fecha: moment(this.today).format('YYYY-MM-DD'),
      devolucion: null,
      fechamaxima: moment(this.lastday).format('YYYY-MM-DD'),
    }
    this.SearchList();
  }

 /*  AtribucionSearchNew(event) {
    console.log(event);
  } */

  selectAll() {
    this.resultadoConsulta.map((e: any) => { e.check = this.masterSelected })
  }

  moduloDetalle(event) {
    console.log(event);
    let modal = this.modalDet.open(DetalleSolicitudComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.item = event
    modal.result.then((result) => {
      console.log("Datos devueltos desde el modal:", result);
    }).catch((error) => {
      console.error("Error al cerrar el modal:", error);
    });
  }


  moduloDetallePrestamo(event) {
    console.log(event);
    let modal = this.modalDet.open(DetallePrestamoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.item = event
    modal.componentInstance.opcion = 'ver'
  }

  moduloDetallePrestamoedit(event) {
    console.log(event);
    let modal = this.modalDet.open(DetallePrestamoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.item = event
    modal.componentInstance.opcion = 'editar'
  }

  limpiar() {
    this.atribucionParamsNew = {
      programa: null,
      departamento: null,
      atribucion: null,
      num_solicitud: null,
      fecha_creacion: moment(this.today).format('YYYY-MM-DD')
    }

    this.listaSolicitudesAtribucion = []
    this.newReserva = {
      codigo: '',
      observacion: '',
      fecha: moment(this.today).format('YYYY-MM-DD'),
      devolucion: null,
      fechamaxima: moment(this.lastday).format('YYYY-MM-DD'),
      num_orden: '' 
    }

    this.vmButtons[1].habilitar = false
    this.atribucionParams = {
      programa: null,
      departamento: null,
      atribucion: null
    }

    this.atribucionParamsNew = {
      programa: null,
      departamento: null,
      atribucion: null,
      num_solicitud: null,
      fecha_creacion: moment(this.today).format('YYYY-MM-DD')
    }

    this.dataForms = [];
    this.rutaFinal = [];
    this.documento = [];
    this.resultadoConsulta = []
    this.filter.tipo_documento = ''

  }


  limpiarSinConf() {
    this.atribucionParams = {
      programa: null,
      departamento: null,
      atribucion: null
    }

    this.atribucionParamsNew = {
      programa: null,
      departamento: null,
      atribucion: null,
      num_solicitud: null,
      fecha_creacion: moment(this.today).format('YYYY-MM-DD')
    }

    this.listaSolicitudes = []
    this.listaSolicitudesAtribucion = []
  }

  eliminarSolicitud(item) {
    let data = {
      id: item['id_solicitud']
    }
    console.log(data);
    this.service.eliminarSolicitud(data).subscribe((res) => {
      console.log(res);
      this.SearchList();
    })
  }

  limpiarFiltro() {
    this.filter = {
      num_solicitud: "",
      estado: null,
      fecha_desde: null,
      fecha_hasta: null,
      filterControl: ""
    };

    this.filterdev = {
      codigo: '',
      fecha: moment(this.firstday).format('YYYY-MM-DD'),
      fechamaxima: moment(this.lastday).format('YYYY-MM-DD'),
      num_orden: '',
      estadoSelected: '',
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
  }

  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Inspeccion')
      }, 50)
    }
  }

  changeValueCheck(item) {
    if (item.check) {
      const existingIndex = this.medios_to_save.findIndex(detalle => detalle.numero_medio === item.numero_medio);
      if (existingIndex !== -1) {
        this.medios_to_save[existingIndex] = item;
      } else {
        this.medios_to_save.push(item);
      }
    } else {
      const index = this.medios_to_save.findIndex(detalle => detalle.numero_medio === item.numero_medio);
      if (index !== -1) {
        this.medios_to_save.splice(index, 1);
      }
    }
  }


  removeItem(index: number) {
    this.medios_to_save.splice(index, 1);
    this.daylimit = new Date(this.today);
    this.daylimit.setDate(this.daylimit.getDate() + this.diasprestamoactual);
    this.newReserva.fechamaxima = moment(this.daylimit).format('YYYY-MM-DD')
  }


  uploadFile(identifier) {
    let data = {
      // Informacion para almacenamiento de anexo
      module: this.permissions.id_modulo,
      component: myVarGlobals.fCPSolici,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: identifier,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fCPSolici,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${identifier}`,
      ip: this.commonSrv.getIpAddress()
    }

    for (let i = 0; i < this.fileList.length; i++) {
      console.log('File', data);
      this.UploadService(this.fileList[i], identifier, data);
    }
    this.fileList = undefined
  }

  UploadService(file, identifier: any, payload?: any): void {
    let cont = 0
    this.service.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {

    })
  }

  getDatosIniciales() {
    this.lcargando.ctlSpinner(true);
    this.resultadoConsulta = null;
    let data = {};
    this.service.getTipoDocumentos(data).subscribe((res) => {
      console.log(res)
      this.lcargando.ctlSpinner(false);
      this.lst_tipoDoC = res["data"];
    }, (error) => {
      this.toastr.info(error.message);
      this.lcargando.ctlSpinner(false);
    });
  }

  selectTipoMedio(event) {

    this.lcargando.ctlSpinner(true);
    let datae = { tipo_medio: event, paginate: this.paginateNew }; 
    this.service.getNumMedios(datae).subscribe((res: any) => {
      console.log(res);
      this.lcargando.ctlSpinner(false);
      let resultado = res;
      if (resultado.current_page == 1) { 
        this.numeros_medios = resultado.data;
      } else {
        this.numeros_medios = Object.values(resultado['data']);
      }
      this.numeros_medios.forEach(item => {
       
        item['check'] = false;
        item['bodega'] = "";
        item['ubicacion'] = "";
        item['bodega_nombre'] = "";
        item['ubicacion_nombre'] = "";
      });
      this.paginateNew.length = res.total;
      this.lcargando.ctlSpinner(false);
    })
    this.filter.campos = []
    let data2 = {
      tipoDoc: this.tipoDoC,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
    };
  }

  getBodegas() {
    this.mensajeSppiner = "Cargando bodegas";
    this.lcargando.ctlSpinner(true);
    let filter = {
      nombre_bodega: null,
      filterControl: "",
    };

    let paginate = {
      length: 0,
      perPage: 1000,
      page: 1,
      pageSizeOptions: [5, 10],
    };

    let data = {
      params: {
        filter: filter,
        paginate: paginate,
      },
    };
    this.service.getInformationDig(data).subscribe(
      (res) => {
        this.dataBodega = res["data"]["data"];
        this.lcargando.ctlSpinner(false);
        this.mensajeSppiner = "";
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.mensajeSppiner = "";
      }
    );
  }

  consultarDirectorio() {
    this.lcargando.ctlSpinner(true);
    this.resultadoConsulta = []
    this.filter.tipo_documento = this.tipoDoC
    const camposFiltrados = this.filter.campos.filter(camp => camp.campo_indice && camp.valor_indice);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginateNew,
      },
    }

    if (camposFiltrados.length > 0) {
      this.apiService.getDirectorio(data).subscribe(
        (res: any) => {
          this.paginateNew.length = res['data']['total'];
          this.directorioDt = res.data.data;
          this.resultadoConsulta = res.data.data;
          this.paginateNew.length = res.data.total;
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      );
    } else {
      this.apiService.getDirectorio(data).subscribe(
        (res: any) => {
          this.paginateNew.length = res['data']['total'];
          this.directorioDt = res.data.data;
          this.resultadoConsulta = res.data.data;
          this.paginateNew.length = res.data.total;
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      );
    }
  }

  obtenerparametros() {
    this.lcargando.ctlSpinner(true);
    this.daylimit = new Date(this.today);
    // Obtener la fecha actual
    const fechaActual: Date = new Date();
    this.daylimit.setDate(this.daylimit.getDate() + 5);
    // Agregar 5 días a la fecha actual
    const fechaMaxima: Date = new Date();
    fechaMaxima.setDate(fechaMaxima.getDate() + 5);
    // Asignar valores por defecto al objeto newReserva
    this.newReserva = {
      codigo: '',
      observacion: '',
      fecha: moment(this.today).format('YYYY-MM-DD'),
      devolucion: null,
      fechamaxima: moment(this.lastday).format('YYYY-MM-DD'),
    }
  }

  saveBodega() {
    console.log(this.tipo_medida);
    if (this.medios_to_save.length == 0) {
      this.toastr.success("seleccione algun documento");
      return

    }
    /* if (this.bodega == undefined || this.bodega == "") {
      this.toastr.info("Debe seleccionar bodega");
      this.lcargando.ctlSpinner(false);
      return;
    }

    if (this.ubicacion == undefined || this.ubicacion == "") {
      this.toastr.info("Debe seleccionar ubicacion");
      this.lcargando.ctlSpinner(false);
      return;
    } */
    this.lcargando.ctlSpinner(true);
    const elementosCheckTrue = this.medios_to_save;
    let data = { tipo_medio: this.tipo_medida, bodega: this.bodega, ubicacion: this.ubicacion, detalle: elementosCheckTrue };
    this.service.saveBodegaDig(data).subscribe(res => {
      
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
     

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  modalUsuarios() {
    let modal = this.modalService.open(ModalUsuariosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }
  async getCatalogos() {
    this.lcargando.ctlSpinner(true);
    let response: any = await this.service.getCatalogo({ params: "'TIPO_MEDIO'" })
    console.log("getcatalogo", response);
    this.estadoDevList = response.TIPO_MEDIO
    this.lcargando.ctlSpinner(false);

  }


  getUbicaciones(x, y,z) {
    this.disableGeneralUbicaciones= false;
    this.numeros_medios.forEach(item => {
       item['bodega_nombre'] =z;
      item['bodega'] = y;
    });
    this.lcargando.ctlSpinner(true);

    let filter = {
      nombre_bodega: null,
      fk_bodega_cab: y,
    };

    let paginate = {
      length: 0,
      perPage: 1000,
      page: 1,
      pageSizeOptions: [5, 10],
    };
    let data = {
      params: {
        filter: filter,
        paginate: paginate,
      },
    };
    this.service
      .getEstrutureDig(data)
      .subscribe(
        (res) => {
          this.lcargando.ctlSpinner(false);
          console.log("ubicaciones", res["data"]);

          this.dataubicacion = res["data"]["data"];
          this.numeros_medios.forEach((item, index) => {
          this.dataubicacionIndividual[index] =res["data"]["data"];
          
          });
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          console.log(error);
          this.lcargando.ctlSpinner(false);
        }
      );
  }

  setAllUbicaciones(y,x) {
    this.numeros_medios.forEach(item => {
      item['ubicacion_nombre'] = x;
      item['ubicacion'] = y;
    });
  }

  getUbicacionesIndividual(index: number, y:any,x:any) {
    console.log(index);
    this.lcargando.ctlSpinner(true);
    console.log(x);
    this.numeros_medios[index].bodega_nombre =  x;
    this.disableGeneralUbicaciones= true;
    let filter = {
      nombre_bodega: null,
      fk_bodega_cab: y,
    };

    let paginate = {
      length: 0,
      perPage: 1000,
      page: 1,
      pageSizeOptions: [5, 10],
    };
    let data = {
      params: {
        filter: filter,
        paginate: paginate,
      },
    };
    this.service
      .getEstrutureDig(data)
      .subscribe(
        (res) => {
          this.lcargando.ctlSpinner(false);
          console.log("ubicaciones", res["data"]);
          this.dataubicacionIndividual[index] = res["data"]["data"];
        /*   this.dataubicacion = res["data"]["data"]; */

          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          console.log(error);
          this.lcargando.ctlSpinner(false);
        }
      );
  }

  setubicacionIndividual(index: number, x:any) {
    console.log(x);
    console.log(index);
    this.numeros_medios[index].ubicacion_nombre =  x;
  }

}
