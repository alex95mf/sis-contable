import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DetalleSolicitudComponent } from './detalle-solicitud/detalle-solicitud.component'

import { DetallePrestamoComponent } from './detalle-prestamo/detalle-solicitud.component'
import { SolicitudService } from './solicitud.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';
import moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonVarService } from 'src/app/services/common-var.services';
import { DatePipe } from '@angular/common';

import { ModalUsuariosComponent } from 'src/app/config/custom/modal-usuarios/modal-usuarios.component';
import { XlsExportService } from 'src/app/services/xls-export.service';




import { ConsultaDirectorioService } from '../consulta-directorio/consulta-directorio.service';
@Component({
standalone: false,
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  newReserva:any;
  programa: any = [];
  departamento: any = [];
  atribucion: any = [];
  resultadoConsulta:any;
  detallesToSave:any= [];
  lst_tipoDoC: any;
  listaSolicitudes: any = [];
  listaSolicitudesAtribucion: any = [];
  tipoDoC:any;
  nuevaSolicitud: boolean = true;
diasprestamotemporal:any;
diasprestamoactual:any
  nuevaS: any = {

  }
  listaPrestamos: any = [];
  listaPrestamosExcel: any = [];
  total: any = 0;

  vmButtons: any;

  dataForms:any;
  rutaFinal:any;
  campos:any;
  documento:any
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
  documentoactual:any;
  paginateNew: any;
  filterNew: any;
  masterSelected: boolean = false

  dataUser: any;
  permissions: any;

  firstday: any;
  lastday: any;
  today: any;
  tomorrow: any;
daylimit:any;
  atribucionParamsNew: any;

  datoDepartamento: any = []

  dato_Programa: any = []

  dropdownSettings: IDropdownSettings = {};
  cargarAnexo: boolean = true;



  fileList: FileList;

  changeCheck: boolean = true;
  filterdev:any;
  estadoList = [
    { value: "A", label: "Aprobado" },
    { value: "P", label: "Pendiente" },
    { value: "D", label: "Denegado" },
  ]

  estadoDevList = [
   /*  { value: "G", label: "Gestion" }, */
    { value: "P", label: "Prestado" },
    { value: "D", label: "Devuelto" },
  ]
  /*
    { value: "", label: "Denegado" },e Pendiente*/


  constructor(
    private router: Router,
    private modalDet: NgbModal,
    private service: SolicitudService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarService: CommonVarService,
    private modalService: NgbModal,

    private commonVarSrv: CommonVarService,

    private apiService: ConsultaDirectorioService,
    private xlsService: XlsExportService
  ) {
    this.commonVarSrv.selectUsuario.asObservable().subscribe(
      (res)=>{
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
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },
      // { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-search", texto: "Buscar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-eraser", texto: "Limpiar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fa fa-plus-square", texto: "Nuevo" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsComprasP", paramAccion: "1",  boton: { icon: "fa fa-file-excel-o", texto: "Excel" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
// +"
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
this.lastday = new Date( this.lastday - 1);

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

    this.filterdev= {
    codigo: '',
    fecha: moment(this.firstday).format('YYYY-MM-DD'),
    fechamaxima: moment(this.lastday).format('YYYY-MM-DD'),
    num_orden: '',
    estadoSelected:'',
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
    this.vmButtons[1].habilitar= false;

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
      this.validaPermisos()
      this.getDatosIniciales()
      this.obtenerparametros()
    }, 500);


  }


  validaPermisos() {
    (this as any).mensajeSpinner = "Verificando permisos del usuario...";
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
      case "Excel":
        this.exportExcel();
        break;

    }
  }

  async  validaSolicitud() {
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
      this.toastr.warning(err, '', {enableHtml: true})
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
      let fecha_creacion = moment(this.atribucionParamsNew.fecha_creacion ).format('YYYY');
      if(fecha_creacion != this.periodoSelectedV) message += '* La fecha debe estar dentro de periodo seleccionado <br>';

      if (this.atribucionParamsNew.num_solicitud == null || this.atribucionParamsNew.num_solicitud == '') message += '* Debe ingresar el número de solicitud<br>';
      if (this.atribucionParamsNew.descripcion == '' || this.atribucionParamsNew.descripcion == null || this.atribucionParamsNew.descripcion == undefined ) message += '* No ha ingresado una Descripcion<br>';
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

  changePaginateNew(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginateNew, newPaginate);
    this.consultarDirectorio();
   // SearchBienes
  }


  cantidadTotalItem(item) {
    console.log(item['precio_cotizado']);


    let precio_cotizado = item['costo_unitario'] * item['cantidad_requerida']

    if (precio_cotizado > item['costo_total_por_solicitar']) {
      this.toastr.info('El Valor Total de '+  this.commonSrv.formatNumberDos(precio_cotizado)+ ' no puede ser mayor al Total Disponible de ' + this.commonSrv.formatNumberDos(parseFloat(item['costo_total_por_solicitar'])))
      setTimeout(() => {
        item['precio_cotizado'] = null
      }, 10);

    } else if (item['cantidad_requerida'] <= 0) {
      this.toastr.info('El valor ingresado no debe ser menor o igual a 0')
      setTimeout(() => {
        item['cantidad_requerida'] = null
      }, 10);

    }
    // else if (item['costo_total_por_solicitar'] < item['precio_cotizado']) {
    //   this.toastr.info('El Valor Total de '+  this.commonSrv.formatNumberDos(parseFloat(item['precio_cotizado']))+ 'no puede ser mayor al Total Disponible de ' + this.commonSrv.formatNumberDos(parseFloat(item['costo_total_por_solicitar'])))
    //   setTimeout(() => {
    //     item['cantidad_requerida'] = null
    //   }, 10);

    // }
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
        (this as any).mensajeSpinner = "Creando Solicitud...";
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
            // fk_departamento: this.departamento['id_catalogo'],
            //fk_atribucion: this.atribucionParamsNew.atribucion['id_catalogo'],
            // fk_programa: this.atribucionParamsNew.programa['id_catalogo'],
            // fk_atribucion: 701,
            // fk_departamento: 1714,
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
              this.listaSolicitudesAtribucion = [];
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
    console.log(event);
    this.departamento = [];
    this.datoDepartamento = [];
    this.listaSolicitudesAtribucion = [];
  }

  onDepartamentoSelect(event: Array<any>) {
    this.listaSolicitudesAtribucion = [];
  }

  onMaterialGroupChange(event) {
    // this.departamento = []
  }

  cargarPrograma() {
    (this as any).mensajeSpinner = "Cargando Programa...";
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
    (this as any).mensajeSpinner = "Cargando Departamentos...";
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

  AtribucionSearch(event) {
    // console.log(event);
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      departamento: event.valor
    }
    this.service.searchAtribucion(data).subscribe((dat) => {
      // console.log(dat);
      this.atribucion = dat['data']
      this.lcargando.ctlSpinner(false);
    })
  }

  SearchList() {
    // console.log(event);

    this.lcargando.ctlSpinner(true);
    this.listaSolicitudes = [];
    (this as any).mensajeSpinner = "Cargando Programa...";
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
    this.listaPrestamos=[];
    console.log(data);
   /*  this.service.searchSolicitud(data).subscribe((dat) => {
      console.log(dat);
      if (dat['data'].length == 0) {
        this.listaSolicitudes = [];
      } else {
        // this.listaSolicitudes = dat['data'];
        this.paginate.length = dat['data']['total'];
        if (dat['data']['current_page'] == 1) {
          this.listaSolicitudes = dat['data']['data'];
        } else {
          this.listaSolicitudes = Object.values(dat['data']['data']);
        }
      }


      this.lcargando.ctlSpinner(false);
    },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
      }
    ) */


    this.service.searchReservascab(data).subscribe((dat) => {
       console.log(dat);
       this.vmButtons[1].habilitar= false;

       if (dat['data'].length == 0) {
        this.listaSolicitudes = [];
      } else {

        // this.listaSolicitudes = dat['data'];
        this.paginate.length = dat['total'];
        if (dat['current_page'] == 1) {
          this.listaPrestamos = dat['data'];
        } else {
          this.listaPrestamos= Object.values(dat['data']);
        }
      }




      /*  if (dat['data']['current_page'] == 1) {
        this.listaPrestamos = dat['data']['data'];
      } else {
        this.listaPrestamos = Object.values(dat['data']['data']);
      } */

      /*if (dat['data'].length == 0) {
        this.listaSolicitudes = [];
      } else {

        this.paginate.length = dat['data']['total'];
        if (dat['data']['current_page'] == 1) {
          this.listaSolicitudes = dat['data']['data'];
        } else {
          this.listaSolicitudes = Object.values(dat['data']['data']);
        }
      } */


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
    this.listaSolicitudesAtribucion = [];
    (this as any).mensajeSpinner = "Cargando Bienes...";
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
        this.listaSolicitudesAtribucion = [];
      } else {

        // if (dat['data']['current_page'] == 1) {

        //   dat['data']['data'].map((res)=>{
        //     let bienes = {
        //       check: false,
        //       descripcion: res.descripcion,
        //       valor: res.u_medida?.valor,
        //       cantidad_solicitada: res.cantidad,
        //       costo_unitario: res.costo_unitario,
        //       cantidad_requerida: null,
        //       precio_cotizado: null
        //     }
        //     this.listaSolicitudesAtribucion.push(bienes)

        //   })
        // } else {
        //   Object.values(dat['data']['data']).map((res)=>{
        //     let bienes = {
        //       check: false,
        //       descripcion: res.descripcion,
        //       valor: res.u_medida?.valor,
        //       cantidad_solicitada: res.cantidad,
        //       costo_unitario: res.costo_unitario,
        //       cantidad_requerida: null,
        //       precio_cotizado: null
        //     }
        //     this.listaSolicitudesAtribucion.push(bienes)

        //   });
        // }
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
        // this.listaSolicitudesAtribucion = dat['data']

      }

      this.lcargando.ctlSpinner(false);

    })

    // this.service.searchPlaAtribucion(data).subscribe((dat)=>{
    //   console.log(dat);
    //   let dataAtributo = {
    //     id: dat['data'][0]['id'],
    //     // params:{
    //     //   paginate: this.paginate,
    //     //   filter: this.filter
    //     // }
    //   }
    //   console.log(dataAtributo);
    //   this.service.searchBienes(dataAtributo).subscribe((dat)=>{
    //     console.log(dat);
    //     if(dat['data'].length == 0){
    //       this.toastr.info('No existe bienes para esa atribución')
    //       this.listaSolicitudesAtribucion = [];
    //     }else {

    //       // if (dat['data']['current_page'] == 1) {

    //       //   dat['data']['data'].map((res)=>{
    //       //     let bienes = {
    //       //       check: false,
    //       //       descripcion: res.descripcion,
    //       //       valor: res.u_medida?.valor,
    //       //       cantidad_solicitada: res.cantidad,
    //       //       costo_unitario: res.costo_unitario,
    //       //       cantidad_requerida: null,
    //       //       precio_cotizado: null
    //       //     }
    //       //     this.listaSolicitudesAtribucion.push(bienes)

    //       //   })
    //       // } else {
    //       //   Object.values(dat['data']['data']).map((res)=>{
    //       //     let bienes = {
    //       //       check: false,
    //       //       descripcion: res.descripcion,
    //       //       valor: res.u_medida?.valor,
    //       //       cantidad_solicitada: res.cantidad,
    //       //       costo_unitario: res.costo_unitario,
    //       //       cantidad_requerida: null,
    //       //       precio_cotizado: null
    //       //     }
    //       //     this.listaSolicitudesAtribucion.push(bienes)

    //       //   });
    //       // }
    //       dat['data'].map((res)=>{
    //         let bienes = {
    //           check: false,
    //           descripcion: res.descripcion,
    //           valor: res.u_medida?.valor,
    //           cantidad_solicitada: res.cantidad,
    //           costo_unitario: res.costo_unitario,
    //           cantidad_requerida: null,
    //           precio_cotizado: null
    //         }
    //         this.listaSolicitudesAtribucion.push(bienes)

    //       })
    //       // this.listaSolicitudesAtribucion = dat['data']

    //     }

    //     this.lcargando.ctlSpinner(false);

    //   })
    // })


  }

  async nuevoSolicitud(valor) {
    this.limpiar();
    this.vmButtons[2].showimg = true
    this.vmButtons[3].showimg = true
    this.vmButtons[4].showimg = false
    this.nuevaSolicitud = false
    this.vmButtons[0].showimg = true
    this.vmButtons[1].showimg = true/*
    this.vmButtons[3].showimg = false */
    // this.vmButtons[3].showimg = false

    if (!!this.atribucionParams['atribucion']) {
      this.atribucionParamsNew['programa'] = this.atribucionParams['programa']
      this.atribucionParamsNew['departamento'] = this.atribucionParams['departamento']
      this.atribucionParamsNew['atribucion'] = this.atribucionParams['atribucion']
      console.log(this.atribucionParamsNew['atribucion']);
      this.SearchBienes();
    }

    let periodos = await this.service.getPeriodos() as any
    console.log(periodos.data)
    this.cmb_periodo = periodos.data
    // this.listaSolicitudes = [];
    // console.log(this.vmButtons[0]);

  }

  ChangeFechaCompras(event: any) {

    // this.buyProv.anio = moment(event.value).format('YYYY');
    // this.buyProv.mes = Number(moment(event.value).format('MM'));

  }

  regresar() {
    this.vmButtons[0].showimg = false
    this.vmButtons[1].showimg = false
    this.vmButtons[2].showimg = false //dd true
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

    this.listaSolicitudesAtribucion = [];
    this.newReserva = {
      codigo:'',
      observacion:'',
      fecha:moment(this.today).format('YYYY-MM-DD'),
      devolucion:null,
      fechamaxima:moment(this.lastday).format('YYYY-MM-DD'),//null , //moment(this.daylimit).format('YYYY-MM-DD')

    }
this.SearchList();
  }

  AtribucionSearchNew(event) {
    console.log(event);
  }

  selectAll() {
   // this.listaSolicitudesAtribucion.map((e: any) => { if (e.cantidad_solicitada > 0) e.check = this.masterSelected })
    this.resultadoConsulta.map((e: any) => {  e.check = this.masterSelected }) //if (e.cantidad_solicitada > 0)
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
  // Aquí puedes manejar los datos devueltos desde el modal
 /*  let  = result['data']
 this. resultado.devolucion; */

  console.log("Datos devueltos desde el modal:", result);
}).catch((error) => {
  // Manejar cualquier error que ocurra al cerrar el modal
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

    this.listaSolicitudesAtribucion = [];
    this.newReserva = {
      codigo:'',
      observacion:'',
      fecha:moment(this.today).format('YYYY-MM-DD'),
      devolucion:null,
      fechamaxima:moment(this.lastday).format('YYYY-MM-DD'),//null ,
      num_orden: '' //moment(this.daylimit).format('YYYY-MM-DD')
    }

    this.vmButtons[1].habilitar= true;/*
    this.vmButtons[5].habilitar= false; */

    /*
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea limpiar el formulario?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {

      if (result.isConfirmed) {
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

        this.listaSolicitudes = [];
      }
    })
 */
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





this.dataForms= [];
      this.rutaFinal= [];
      this.documento =  [];

      this.resultadoConsulta= [];
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

    this.listaSolicitudes = [];

    this.listaSolicitudesAtribucion = [];
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


    this.filterdev= {
      codigo: '',
      fecha:  moment(this.firstday).format('YYYY-MM-DD'),// null,
      fechamaxima:  moment(this.lastday).format('YYYY-MM-DD'),//null,
      num_orden: '',
      estadoSelected:'',
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
      // console.log(this.fileList)
    }
  }

  // Cambio de la variable changeCheck
  changeValueCheck(item) {

  // Asignar el valor de this.diasprestamotemporal al campo 'diasprestamo'
  item.diasprestamo = this.diasprestamotemporal;
      //
  //this.diasprestamotemporal
/*

*/

    console.log(item);




    if (item.check) {
      const existingIndex = this.detallesToSave.findIndex(detalle => detalle.id_documento === item.id_documento);
    if (existingIndex !== -1) {
        // Si ya existe, actualiza el elemento existente en lugar de agregar uno nuevo
        this.detallesToSave[existingIndex] = item;
    } else {
        // Si no existe, agrégalo al arreglo
        item['documentoactual'] = this.documentoactual
        this.detallesToSave.push(item);
    }


    /*
        this.detallesToSave.push(item); */
    } else {
        const index = this.detallesToSave.findIndex(detalle => detalle.id_prestamo_detalle === item.id_prestamo_detalle);
        if (index !== -1) {
            this.detallesToSave.splice(index, 1);
        }
    }
    this.diasprestamoactual = 0;
    for (const detalle of this.detallesToSave) {
      if (detalle.diasprestamo > this.diasprestamoactual) {
        this.diasprestamoactual = detalle.diasprestamo;
      }
  }


  this.daylimit = new Date(this.today);
this.daylimit.setDate(this.daylimit.getDate() + this.diasprestamoactual);
this.newReserva.fechamaxima =moment(this.daylimit).format('YYYY-MM-DD')





  }

  removeItem(index: number) {
    this.detallesToSave.splice(index, 1);




      this.diasprestamoactual = 0;
      for (const detalle of this.detallesToSave) {
        if (detalle.diasprestamo > this.diasprestamoactual) {
          this.diasprestamoactual = detalle.diasprestamo;
        }
    }


    this.daylimit = new Date(this.today);
  this.daylimit.setDate(this.daylimit.getDate() + this.diasprestamoactual);
  this.newReserva.fechamaxima =moment(this.daylimit).format('YYYY-MM-DD')












}


  uploadFile(identifier) {
    console.log('Presionado una vez', this.fileList);
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
    // this.lcargando.ctlSpinner(false)
  }

  UploadService(file, identifier: any, payload?: any): void {
    let cont = 0
    console.log('Se ejecuto');
    this.service.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {

    })
  }


  getDatosIniciales() {
    this.resultadoConsulta = null;
    //this.getListas();
    let data = {};
   // this.getReadFiles();
    this.service.getTipoDocumentos(data).subscribe((res) => {
      console.log(res)
      this.lcargando.ctlSpinner(false);
      this.lst_tipoDoC = res["data"];

      /*  this.dataEmpleado = res["data"];
       this.listadoGeneral(); */
    }, (error) => {
      this.toastr.info(error.message);
      this.lcargando.ctlSpinner(false);
    });
  }



  selectTipoDocumento(event){
    console.log(event);

    this.tipoDoC = event;
    const tipoDocumentoEncontrado = this.lst_tipoDoC.find(doc => doc.id_tipo_documento === event);
    this.lcargando.ctlSpinner(true);

    if (tipoDocumentoEncontrado) {
        // Obtener el valor de dias_prestamo del objeto encontrado
        this.diasprestamotemporal = tipoDocumentoEncontrado.dias_prestamo;
        this.documentoactual= tipoDocumentoEncontrado.nombre
        // Si dias_prestamo es null, asignarle un valor predeterminado de 0
        if (this.diasprestamotemporal === null) {
          this.diasprestamotemporal = 0;
        }


    } else {
      this.diasprestamotemporal = 0;
    }
/*
    this.lst_tipoDoC  buscar id_tipo_documento recorrer y obtener dias_prestamo
 */
    this.dataForms=[];
    this.filter.campos = [];
    this.filter.tipo_documento= event
    let data = {tipoDoc:this.tipoDoC};
    this.DocGeneral = [];
    this.directorioDt = [];
    let Data = []

    this.apiService.getOrdenCampos(data).subscribe((res) => {


      console.log("datos de orden",res)
      this.lcargando.ctlSpinner(false);
      this.dataForms= res["data"]["tipoDocumento"];
      this.rutaFinal= res["data"]["ruta"];
      this.documento =  res["data"]["documento"];

     //  this.resultadoConsulta= res["data"]["documento2"]
     /*  this.resultadoConsulta.forEach(item => {
        // Agregamos la clave check con el valor false a cada objeto
        item['check'] = false;
    }); */


      this.dataForms.forEach(campo => {
        Object.assign(campo, { valor: '' })
        let campoI = this.dataForms.filter(e => e.campo_indice == campo.campo_indice) ;
        let data ={
          campo_indice: campoI[0].campo_indice,
          valor : campoI[0].valor
        }
        this.filter['campos'].push(data)
        this.campos = this.filter['campos']
      });

      this.lcargando.ctlSpinner(false);

    }, (error) => {
      this.toastr.info(error.message);
      this.lcargando.ctlSpinner(false);
    });

    this.filter.campos=[];
    let data2 = {
      tipoDoc:this.tipoDoC,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
    };
    this.apiService.getDirectorio(data2).subscribe(
      (res: any) => {

        console.log(res)
        this.paginateNew.length = res['data']['total'];
        this.directorioDt = res.data.data;
        this.resultadoConsulta = res.data.data;
        this.resultadoConsulta.forEach(item => {
          // Agregamos la clave check con el valor false a cada objeto
          item['check'] = false;
      });
        console.log(this.resultadoConsulta)
        this.paginateNew.length = res.data.total;
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }


  consultarDirectorio(){
    this.lcargando.ctlSpinner(true);
    // this.dataForms.forEach(campo => {
    //   this.filter['campos'][campo.campo_indice] = this.dataForms.find((e) => e.campo_indice == campo.campo_indice) ; // Asumiendo que campo_indice contiene los nombres de los campos dinámicos
    // });
    this.resultadoConsulta = [];
    this.filter.tipo_documento=  this.tipoDoC
    const camposFiltrados = this.filter.campos.filter(camp => camp.campo_indice && camp.valor_indice);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginateNew, //paginate
      },
    }
    console.log("data al paginate",data)
    if(camposFiltrados.length > 0){

     /*  this.paginateNew.page = {
        length: 0,
        perPage: 10,
        page: 1,
        pageSizeOptions: [5, 10]
      }; */



      this.apiService.getDirectorio(data).subscribe(
        (res: any) => {

          console.log(res)
          this.paginateNew.length = res['data']['total'];
          this.directorioDt = res.data.data;
          this.resultadoConsulta = res.data.data;

          console.log(this.resultadoConsulta)
          this.paginateNew.length = res.data.total;
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      );
    }else{
      this.apiService.getDirectorio(data).subscribe(
        (res: any) => {

          console.log(res)
          this.paginateNew.length = res['data']['total'];
          this.directorioDt = res.data.data;
          this.resultadoConsulta = res.data.data;

          console.log(this.resultadoConsulta)
          this.paginateNew.length = res.data.total;
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      );
      /*
      let data = {tipoDoc:this.tipoDoC};
      this.apiService.getOrdenCampos(data).subscribe((res) => {
        this.resultadoConsulta= res["data"]["documento2"]
        this.lcargando.ctlSpinner(false);
      }, (error) => {
        this.toastr.info(error.message);
        this.lcargando.ctlSpinner(false);
      }); */

    }

  }


  obtenerparametros(){
      this.daylimit = new Date(this.today);
      // Obtener la fecha actual
          const fechaActual: Date = new Date();
          this.daylimit.setDate(this.daylimit.getDate() + 5);
          // Agregar 5 días a la fecha actual
          const fechaMaxima: Date = new Date();
          fechaMaxima.setDate(fechaMaxima.getDate() + 5);
          // Asignar valores por defecto al objeto newReserva
          this.newReserva = {
            codigo:'',
            observacion:'',
            fecha:moment(this.today).format('YYYY-MM-DD'),
            devolucion:null,
            fechamaxima: moment(this.lastday).format('YYYY-MM-DD'),//null , //moment(this.daylimit).format('YYYY-MM-DD')
          }
  }


  saveBodega() {
if    (this.detallesToSave.length==0){
  this.toastr.success("seleccione algun documento");
  return

}
if (!this.newReserva.usuario) {
  this.toastr.error("Falta llenar el campo 'usuario'");
  return;
} else if (!this.newReserva.codigo) {
  this.toastr.error("Falta llenar el campo 'codigo'");
  return;
} else if (!this.newReserva.observacion) {
  this.toastr.error("Falta llenar el campo 'observacion'");
  return;
} else if (!this.newReserva.fecha) {
  this.toastr.error("Falta llenar el campo 'fecha'");
  return;
} else if (!this.newReserva.fechamaxima) {
  this.toastr.error("Falta llenar el campo 'fechamaxima'");
  return;
} else {
  // Si todos los campos están llenos, ejecuta la lógica que sigue aquí
}
/*
if (!this.newReserva.usuario || !this.newReserva.codigo || !this.newReserva.observacion || !this.newReserva.fecha || !this.newReserva.fechamaxima) {
  this.toastr.error("Faltan campos por llenar");

} */



    this.lcargando.ctlSpinner(true);
   /*  this.resultadoConsulta */
    //const elementosCheckTrue = this.resultadoConsulta.filter(item => item.check === true);

    const elementosCheckTrue = this.detallesToSave;
    let data = {...this.newReserva,detalle:elementosCheckTrue};
    console.log(data);
    this.service.saveReservasDig(data).subscribe(res => {
      console.log(res);
      let restultado = res['data'];
      this.newReserva.num_orden = restultado.num_orden;
      this.lcargando.ctlSpinner(false);
      this.vmButtons[1].habilitar= true;
      this.toastr.success(res['message']);
   //   this.consultarDirectorio();

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  modalUsuarios(){
    let modal = this.modalService.open(ModalUsuariosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  exportExcel(){


    (this as any).mensajeSpinner = "Generando Archivo Excel...";
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

    this.service.searchReservascab(data).subscribe(res => {
      console.log(res)


        this.listaPrestamosExcel = res["data"];
        this.listaPrestamosExcel.forEach(e => {
          Object.assign(e, {
            empleado_nombre: e.detalle_empleadosmn?.nombre,
            usuario_nombre: e.detalleusuario?.nombre,
            estado_prestamo: e.estado_prestamo == 'P' ? 'Prestado' : (e.estado_prestamo == 'D' ? 'Devuelto': '')
          });
        })
        if (this.listaPrestamosExcel.length > 0) {

          let data = {
            title: 'Prestamo de Documentos',
            fecha_desde: moment(this.filterdev.fecha).format('YYYY-MM-DD'),
            fecha_hasta: moment(this.filterdev.fechamaxima).format('YYYY-MM-DD'),
            rows: this.listaPrestamosExcel
          }
          this.xlsService.exportExcelPrestamoDocumentos(data, 'Prestamo de Documentos')
          this.lcargando.ctlSpinner(false);
        } else {
          this.toastr.info("No hay datos para exportar")
          this.lcargando.ctlSpinner(false);
        }
    }, error => {
      this.toastr.info(error.error.mesagge);
      this.lcargando.ctlSpinner(false);
    });
  }


}
