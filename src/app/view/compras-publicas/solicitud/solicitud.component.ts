import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DetalleSolicitudComponent } from './detalle-solicitud/detalle-solicitud.component'
import { SolicitudService } from './solicitud.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { DatePipe } from '@angular/common';
@Component({
standalone: false,
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;


  programa: any = [];
  departamento: any = [];
  atribucion: any = [];

  listaSolicitudes: any = [];
  listaSolicitudesAtribucion: any = [];

  nuevaSolicitud: boolean = true;

  nuevaS: any = {

  }

  total: any = 0;

  vmButtons: any;


  fecha: Date = new Date();
  periodo: Date = new Date();

  cmb_periodo: any[] = []
  periodoSelectedV: any

  atribucionParams: any = {
    programa: null,
    departamento: null,
    atribucion: null
  }


  binding: any

  paginate: any;
  filter: any;

  paginateNew: any;
  filterNew: any;
  masterSelected: boolean = false

  dataUser: any;
  permissions: any;

  firstday: any;
  today: any;
  tomorrow: any;

  atribucionParamsNew: any;

  datoDepartamento: any = []

  dato_Programa: any = []

  dropdownSettings: IDropdownSettings = {};
  cargarAnexo: boolean = true;



  fileList: FileList;

  changeCheck: boolean = true;

  estadoList = [
    { value: "A", label: "Aprobado" },
    { value: "P", label: "Pendiente" },
    { value: "D", label: "Denegado" },
  ]

  constructor(
    private router: Router,
    private modalDet: NgbModal,
    private service: SolicitudService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarService: CommonVarService,
    private cierremesService: CierreMesService,
  ) {

    this.commonVarService.diableCargarDis.asObservable().subscribe(
      (res) => {
        this.cargarAnexo = false;
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },
      // { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-search", texto: "Buscar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fa fa-plus-square", texto: "Nuevo" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-eraser", texto: "Limpiar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }

    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(), this.today.getMonth(), 1);



    this.filter = {
      num_solicitud: "",
      descripcion: "",
      estado: ['A', 'P', 'D'],
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    };

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
      this.validaPermisos()
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

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "Guardar":
        this.validaSolicitud();
        break;
      case "Regresar":
        this.regresar();
        break;

      case "Buscar":
        this.SearchList();
        break;
      case "Nuevo":
        this.nuevoSolicitud(1);
        break;
      case "Limpiar":
        this.limpiar();
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
    if(evt == null || evt == undefined){
      this.filter.estado = []
    }else{
      this.filter.estado = [evt]
    }

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
    this.SearchBienes();
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
        (this as any).mensajeSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(this.periodoSelectedV),
          "mes": Number(moment(this.atribucionParamsNew.fecha_creacion).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

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
                    this.vmButtons[2].showimg = true
                    this.vmButtons[3].showimg = true
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


            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })
      }
    });



  }

  onProgramaSelect(event: Array<any>) {
    console.log(event);
    this.departamento = []
    this.datoDepartamento = []
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
    this.listaSolicitudes = [];
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);


    let data = {
      id_programa: this.dato_Programa,
      id: this.datoDepartamento,
      params: {
        paginate: this.paginate,
        filter: this.filter
      }


    }
    console.log(data);
    this.service.searchSolicitud(data).subscribe((dat) => {
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
    this.nuevaSolicitud = false
    this.vmButtons[0].showimg = true
    this.vmButtons[1].showimg = true
    this.vmButtons[2].showimg = false
    this.vmButtons[3].showimg = false
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
    this.vmButtons[2].showimg = true
    this.vmButtons[3].showimg = true
    // this.vmButtons[3].showimg = true
    this.nuevaSolicitud = true

    this.atribucionParamsNew = {
      programa: null,
      departamento: null,
      atribucion: null,
      num_solicitud: null,
      fecha_creacion: moment(this.today).format('YYYY-MM-DD')
    }

    this.listaSolicitudesAtribucion = [];

  }

  AtribucionSearchNew(event) {
    console.log(event);
  }

  selectAll() {
    this.listaSolicitudesAtribucion.map((e: any) => { if (e.cantidad_solicitada > 0) e.check = this.masterSelected })

  }

  moduloDetalle(event) {
    console.log(event);
    let modal = this.modalDet.open(DetalleSolicitudComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.item = event
  }

  limpiar() {
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
      descripcion: "",
      estado: null,
      fecha_desde: null,
      fecha_hasta: null,
      filterControl: ""
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
    console.log(item);
    if (!item.check) {
      item.cantidad_requerida = null
      item.precio_cotizado = null
    }
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



}
