import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
// import{DetalleSolicitudComponent} from './detalle-solicitud/detalle-solicitud.component'
// import { SolicitudService } from './solicitud.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ReformaInternaService } from './reforma-interna.service';
import { ModalBusquedaReformaComponent } from './modal-busqueda-reforma/modal-busqueda-reforma.component';
import { ModalBusquedaReformaGeneralComponent } from './modal-busqueda-reforma-general/modal-busqueda-reforma-general.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-reforma-interna',
  templateUrl: './reforma-interna.component.html',
  styleUrls: ['./reforma-interna.component.scss']
})
export class ReformaInternaComponent implements OnInit, OnDestroy {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

iddetallecabecerareformageneral: any;
  programa: Array<any> = [];
  programa2: Array<any> = [];
  departamento: any = [];
  departamento2: any = [];
  atribucion: any = [];

  listaSolicitudes: any = [];
  listaSolicitudesAtribucion: any = [];

  listaSolicitudesAtribucion2: any = [];

  nuevaSolicitud: boolean = true;
  por_actualizar: boolean = false;

  nuevaS: any = {

  }

  total: any = 0;

  total2: any = 0;

  totalOriginal: any = 0;

  total2Original: any = 0;

  ajuste1: any = 0;

  ajuste2: any = 0;

  vmButtons: any;

  atribucionParams: any = {
    programa: null,
    departamento: null,
    atribucion: null
  }


  binding: any

  paginate: any;
  filter: any;

  paginate2: any;
  filter2: any;

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
  search: boolean = false;
  descripcion_presupuesto: any;
  descripcion_presupuesto2: any;


  fileList: FileList;

  cmb_periodo: Array<any>[];
  totalPartida: number = 0;
  cod_presupuesto: any = {
    label: ''
  };

  onDestroy$ = new Subject<void>()

  constructor(
    private router: Router,
    private modalDet: NgbModal,
    private service: ReformaInternaService,

    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarService: CommonVarService,
    private cierremesService: CierreMesService,
  ) {

    this.commonVarService.modalReformaBusquedageneral.asObservable().subscribe(
      (res) => {
        console.log("trae datos del  modal", res);
        this.iddetallecabecerareformageneral = res.id_reforma;
        this.atribucionParamsNew.periodo = res.periodo;
        this.atribucionParamsNew.num_reforma = res.no_reforma;
        /*  const detallesConIncremento = res.detalles.filter(detalle => parseFloat(detalle.tc_incremento) > 0);
         const detallesConReduccion = res.detalles.filter(detalle => parseFloat(detalle.tc_reduccion) > 0);



         this.atribucionParamsNew.programa = detallesConIncremento.cod_programa */

        const detallesConIncremento = res.detalles.filter(detalle => parseFloat(detalle.tc_incremento) > 0);
        const detallesConReduccion = res.detalles.filter(detalle => parseFloat(detalle.tc_reduccion) > 0);

        if (detallesConReduccion.length > 0) {
          // Asigna el valor del campo 'cod_programa' del primer detalle con incremento a 'atribucionParamsNew.programa'
          this.atribucionParamsNew.programa = detallesConReduccion[0].programa;
          this.atribucionParamsNew.programa.label = detallesConReduccion[0].cod_programa + "-" + detallesConReduccion[0].programa.valor;
          //            this.atribucionParamsNew.programa = detallesConReduccion[0].cod_programa+"-"+detallesConReduccion[0].programa.valor;
          //res.fecha_registro
          this.totalPartida = res.ajuste_1
          this.atribucionParamsNew.ajuste_1 = parseFloat(detallesConReduccion[0].tc_reduccion);
         // this.atribucionParamsNew.ajuste_1 = Math.abs(this.atribucionParamsNew.ajuste_1);
          // Obtenemos la fecha del string original
          const fechaOriginal = res.fecha_registro;
          // Dividimos la fecha y la hora por espacio
          const partesFecha = fechaOriginal.split(' ');
          // Tomamos solo la parte de la fecha
          const fechaSinHora = partesFecha[0];
          // Asignamos la fecha formateada a atribucionParamsNew.fecha
          this.atribucionParamsNew.fecha = fechaSinHora;
          this.atribucionParamsNew.reforma_presupuesto = detallesConReduccion[0].presupuesto.codigo
          this.descripcion_presupuesto = detallesConReduccion[0].presupuesto.descripcion_general

        }


        if (detallesConIncremento.length > 0) {
          // Asigna el valor del campo 'cod_programa' del primer detalle con incremento a 'atribucionParamsNew.programa'
          this.atribucionParamsNew.programa_dos = detallesConIncremento[0].programa;
          this.atribucionParamsNew.programa_dos.label = detallesConIncremento[0].cod_programa + "-" + detallesConIncremento[0].programa.valor;
          //            this.atribucionParamsNew.programa = detallesConReduccion[0].cod_programa+"-"+detallesConReduccion[0].programa.valor;
          //res.fecha_registro
          this.atribucionParamsNew.ajuste_2 = parseFloat(detallesConIncremento[0].tc_incremento);
          // Obtenemos la fecha del string original
          this.atribucionParamsNew.reforma_presupuesto2 = detallesConIncremento[0].presupuesto.codigo
          this.descripcion_presupuesto2 = detallesConIncremento[0].presupuesto.descripcion_general

        }

        // También puedes hacer lo mismo para detallesConReduccion si necesitas asignar algo basado en esos detalles
      }

      /*  this.fileValid = true
        this.fecha_ingreso = moment(res.fecha_registro).format('YYYY-MM-DD')
        this.periodo = res.periodo;
        this.estado = res.estado;
        this.tipoReforma = res.tipo_reforma;
        this.no_reforma = res.no_reforma;
        this.programaSelected = { id_catalogo: res.fk_programa }
        this.fillTableBySearch(res)
        this.id = res.id_reforma;
        this.vmButtons[5].habilitar = false; */
    )




    this.commonVarService.diableCargarDis.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        this.cargarAnexo = false;
      }
    )

    this.commonVarService.modalreformaInterna.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res);
        this.search = true
        this.vmButtons[0].habilitar = true
        this.atribucionParamsNew = res
        this.totalPartida = res.ajuste_1

        this.atribucionParamsNew.nom_documento = res.nom_documento
        this.total = res.diferencia_1
        this.totalOriginal = res.total_1
        this.ajuste1 = res.diferencia_1
        this.atribucionParamsNew.fecha = moment(res.fecha).format('YYYY-MM-DD');

        this.total2 = res.diferencia_2
        this.total2Original = res.total_2
        this.ajuste2 = res.diferencia_2

        this.atribucionParamsNew['reforma_presupuesto2'] = res.codigo_presupuesto2
        this.descripcion_presupuesto = res.presupuesto_uno?.nombre
        this.atribucionParamsNew['reforma_presupuesto'] = res.codigo_presupuesto1
        this.descripcion_presupuesto2 = res.presupuesto_dos?.nombre
        this.atribucionParamsNew['num_reforma'] = res.no_reforma;
        this.atribucionParamsNew['reforma_presupuesto2'] = res.codigo_presupuesto2

        this.atribucionParamsNew['departamento_dos'] = res.departamento_2
        this.atribucionParamsNew['programa_dos'] = res.programa_2
        // cuando es consultado
        console.log("costo_unitario", res)
        res['detalles'].map(
          (e) => {
            e.precio_cotizado = e.costo_unitario;
            e.costo_total_por_mod = e.valor_reforma
            e.saldo_por_comprometer =e.costo_total_por_solicitar

            if (e.tipo_ajuste == 1) {

              this.listaSolicitudesAtribucion.push(e)
            } else {

              this.listaSolicitudesAtribucion2.push(e)
            }

          }
        )

      }
    )


    this.commonVarService.modalreformaPrespuestoCod.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res);
        this.cod_presupuesto = res.data
        if (res.validacion == 'Presupuestario') {
          this.atribucionParamsNew.reforma_presupuesto = res.data.codigo;
          this.descripcion_presupuesto = res.data.descripcion_general;
          this.SearchBienesSelect()
        } else {
          this.atribucionParamsNew.reforma_presupuesto2 = res.data.codigo;
          this.descripcion_presupuesto2 = res.data.descripcion_general
          this.SearchBienes2()
        }

      }
    )

    this.vmButtons = [
      { orig: "btnsComprasP", paramAccion: "", boton: { icon: "fas fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsComprasP", paramAccion: "", boton: { icon: "fas fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsComprasP", paramAccion: "", boton: { icon: "fas fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }

    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

    this.filter = {
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

    this.filter2 = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    };

    this.paginate2 = {
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
      nom_documento: null,
      periodo: null,
      programa: null,
      programa_dos: null,
      departamento: null,
      departamento_dos: null,
      atribucion: null,
      reforma_presupuesto: null,
      reforma_presupuesto2: null,
      observacion: null,
      total_1: null,
      total_2: null,
      ajuste_1: 0.00,
      ajuste_2: 0,
      diferencia_1: 0,
      diferencia_2: 0,
      tipo_reforma: 'INTERNA',
      fecha: moment(this.today).format('YYYY-MM-DD')
    }

    this.paginateNew = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };



    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(null)
    this.onDestroy$.complete()
  }

  ngOnInit(): void {
    this.iddetallecabecerareformageneral = null;
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
          this.lcargando.ctlSpinner(false)
          this.cargaInicial()
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
      case "GUARDAR":
        this.validaSolicitud();
        break;
      case "BUSCAR":
        this.modalReformaInt();
        break;
      case "LIMPIAR":
        this.limpiar();
        break;
    }
  }

  async validaSolicitud() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear nuevos Reformas internas");

    }
    else if (this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para Reformas internas.");
    }
    else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          this.guardarSolicitud();

        }
      });
    }

  }



  validaDataGlobal() {
    // console.log(this.ticketNew);
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.atribucionParamsNew.reforma_presupuesto == null
      ) {
        this.toastr.info("Debe ingresar el numero de solicitud");
        flag = true;
      }
      let contador = 0;
      this.listaSolicitudesAtribucion.map((res) => {
        // if (
        //   !res.check && this.listaSolicitudesAtribucion.length == contador
        // ) {
        //   this.toastr.info("Debe seleccionar un bien");
        //   flag = true;
        // }
        // else if (
        //   (res.cantidad_requerida == null ||
        //   res.cantidad_requerida == undefined)
        // ) {
        //   this.toastr.info("El campo cantidad requerida no debe estar vacío en ",res['descripcion']);
        //   flag = true;
        // }
        contador += 1;
      })



      !flag ? resolve(true) : resolve(false);
    })
  }


  periodoSelected(evt: any, year: any) {
    console.log(evt)
    this.atribucionParamsNew.periodo = evt
    if (evt) {
      this.cargarPrograma();
    }
  }

  cargarPrograma() {
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.atribucionParamsNew.periodo,
    }
    console.log(data);
    this.service.searchProgramaPeriodo(data).subscribe((res: any) => {
      console.log(res);
      this.lcargando.ctlSpinner(false);
      //  let programasRes: []
      //  res.map((item: any) =>
      //  Object.assign(item, { label: `${item.catalogo.descripcion} - ${item.catalogo.valor}` }
      //  ))
      //  this.programa = programasRes
      let programa = []
      res.map((data) => {

        let dat = {
          ...data.catalogo,
          label: data.catalogo['descripcion'] + '-' + data.catalogo['valor']
        }
        programa.push(dat)
        // this.lcargando.ctlSpinner(false);
      })
      this.programa = programa
      console.log(this.programa);
    })
  }




  calcularAjuste(event) {

    let total = 0
    let totalOr = 0

    this.listaSolicitudesAtribucion.map((res) => {
      if (res.check) {
        console.log('Entro', res.cantidad_solicitada_mod);
        res.precio_cotizado_mod = res.costo_unitario_mod //res.cantidad_solicitada_mod *
        total += res.costo_unitario_mod //(res.cantidad_solicitada_mod * )
        totalOr += res.costo_unitario //(res.cantidad_solicitada * )
      }

    })
    console.log(this.atribucionParamsNew.ajuste_1);
    this.total = total - parseFloat(this.atribucionParamsNew.ajuste_1);

    if (isNaN(this.total)) this.total = 0;
    console.log(total);
  }

  /*  actualizaTotalCotizado2(element: any) {
     element.costo_total_por_mod = element.cantidad_solicitada_por_mod * element.costo_unitario_por_mod
     element.cantidad_ajustada = parseInt(element.cantidad_solicitada_mod) + parseInt(element.cantidad_solicitada_por_mod)
     element.costo_unitario_ajustado = element.costo_unitario_por_mod
     element.costo_total_ajustado = element.costo_unitario_ajustado * element.cantidad_ajustada



     this.calcularValorTotal2()
   } */

  actualizaTotalCotizado2(newValue: any, element: any) {


    element.costo_total_ajustado = parseFloat(element.precio_cotizado) + parseFloat(newValue);
    element.saldo_por_comprometer = element.costo_total_ajustado - element.costo_total_solicitado
    this.calcularValorTotal2()
  }


  /* actualizaTotalCotizado(element: any) {
    //element.costo_total_por_mod = element.cantidad_solicitada_por_mod * element.costo_unitario_por_mod
   // element.cantidad_ajustada = parseInt(element.cantidad_solicitada_mod) + parseInt(element.cantidad_solicitada_por_mod)
   // element.costo_unitario_ajustado = element.costo_unitario_por_mod
   // element.costo_total_ajustado = element.costo_unitario_ajustado * element.cantidad_ajustada
   console.log("calculando");
   element.costo_total_ajustado = parseInt(element.precio_cotizado) + parseInt(element.costo_total_por_mod)//   -
    this.calcularValorTotal()
  } */

  actualizaTotalCotizado(newValue: any, element: any) {
    console.log("calculando");

    element.costo_total_ajustado = parseFloat(element.precio_cotizado) + parseFloat(newValue);
    element.saldo_por_comprometer = element.costo_total_ajustado - element.costo_total_solicitado
    this.calcularValorTotal();
  }

  calcularValorTotal() {
    this.totalOriginal = this.listaSolicitudesAtribucion.reduce((acc, curr) => {
      if (curr.check) {
        return acc + curr.precio_cotizado
      }
      return acc
    }, 0)
    console.log(console.log(this.atribucionParamsNew))
    this.total = this.totalOriginal - this.atribucionParamsNew.ajuste_1
    this.ajuste1 = this.listaSolicitudesAtribucion.reduce((acc, curr) => {
      if (curr.check) {
        return acc + curr.costo_total_ajustado
      }
      return acc
    }, 0)
    console.log(console.log(this.atribucionParamsNew))
  }


  calcularAjuste2(event) {
    let total = 0
    this.listaSolicitudesAtribucion2.map((res) => {
      if (res.check) {
        console.log('Entro', res.cantidad_solicitada_mod);
        res.precio_cotizado_mod = res.costo_unitario_mod // res.cantidad_solicitada_mod *
        total += res.costo_unitario_mod//(res.cantidad_solicitada_mod * )
      }
    })
    console.log(this.atribucionParamsNew.ajuste_1);
    this.total2 = total + parseFloat(this.atribucionParamsNew.ajuste_2);
    if (isNaN(this.total2)) this.total2 = 0;
    console.log(total);
  }

  calcularValorTotal2() {
    this.total2Original = this.listaSolicitudesAtribucion2.reduce((acc, curr) => {
      if (curr.check) {
        return acc + curr.precio_cotizado
      }
      return acc
    }, 0)
    this.total2 = this.total2Original + this.atribucionParamsNew.ajuste_2
    this.ajuste2 = this.listaSolicitudesAtribucion2.reduce((acc, curr) => {
      if (curr.check) {
        return acc + curr.costo_total_ajustado
      }
      return acc
    }, 0)
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

  changePaginateNew2(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginateNew, newPaginate);
    this.SearchBienes2();
  }


  cantidadTotalItem(item) {
    console.log(item);
    if (item['cantidad_requerida'] > item['cantidad_solicitada']) {
      this.toastr.info('El valor ingresado es mayor a la cantidad en stock')
      setTimeout(() => {
        item['cantidad_requerida'] = null
      }, 10);

    } else if (item['cantidad_requerida'] == 0) {
      this.toastr.info('El valor ingresado no debe ser cero')
      setTimeout(() => {
        item['cantidad_requerida'] = null
      }, 10);

    }
    else {
      item['precio_cotizado'] = item['costo_unitario'] //(* item['cantidad_requerida'])
      this.calcularValorTotal()
    }
  }

  guardarSolicitud() {
    let msgInvalid = ''
    if (this.ajuste1 == 0 || this.ajuste2 == 0) {
      msgInvalid += '* Realice la Reforma Interna.<br>'
    } else if (this.atribucionParamsNew.periodo == null) {
      msgInvalid += '* Ingrese el periodo.<br>'
    } else if (this.atribucionParamsNew.ajuste_1 !== this.atribucionParamsNew.ajuste_2) {
      msgInvalid += '* El valor a Disminuir es distinto al valor a Incrementar'
    }
    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', { enableHtml: true })
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

        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(this.atribucionParamsNew.periodo),
          "mes": Number(moment(this.atribucionParamsNew.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              (this as any).mensajeSpinner = "Creando Reforma interna...";
              this.lcargando.ctlSpinner(true);
              console.log(this.atribucionParamsNew);
              this.atribucionParamsNew.bienes = [];
              this.listaSolicitudesAtribucion.map((res) => {
                if (res.check) {
                  res['tipo_ajuste'] = 1;
                  this.atribucionParamsNew.bienes.push(res);
                }
              })

              this.listaSolicitudesAtribucion2.map((res) => {
                if (res.check) {
                  res['tipo_ajuste'] = 2;
                  this.atribucionParamsNew.bienes.push(res);
                }
              })

              this.atribucionParamsNew.total_1 = this.totalOriginal
              this.atribucionParamsNew.total_2 = this.total2Original
              this.atribucionParamsNew.diferencia_1 = this.total
              this.atribucionParamsNew.diferencia_2 = this.total2
              this.atribucionParamsNew.tipo_reforma = 'INTERNA'

              console.log(this.atribucionParamsNew);

              this.service.setReformaInterna({ documento: this.atribucionParamsNew }).subscribe((dat: any) => {
                if (this.iddetallecabecerareformageneral !=null){
                  this.service.setReformaAtendida({ id_reforma: this.iddetallecabecerareformageneral }).subscribe((dat: any) => {})
                }
                console.log(dat);
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "success",
                  title: "Reforma Interna almacenada correctamente",
                  text: dat['message'],
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8'
                }).then((result) => {
                  if (result.isConfirmed) {
                    console.log(dat.data.nom_documento);
                    setTimeout(() => {
                      this.atribucionParamsNew.nom_documento = dat.data.nom_documento
                    }, 50);
                  }
                });
              },
                (error) => {
                  this.toastr.info(error.error?.message)
                  this.lcargando.ctlSpinner(false);
                  console.log(error);
                }
              )

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

  onMaterialGroupChange(event) {
    console.log(event);
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Periodos';
      let periodos = await this.service.getPeriodos();
      this.cmb_periodo = periodos;

      (this as any).mensajeSpinner = 'Cargando Programas'
      let programasRes: Array<any> = await this.service.searchPrograma();
      console.log(programasRes)
      programasRes.map((item: any) => Object.assign(item, { label: `${item.catalogo.descripcion} - ${item.catalogo.valor}` }))
      this.programa = programasRes

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }

  departamentoSearch() {
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      programa: this.dato_Programa
    }
    console.log(data);
    this.service.searchDepartamento(data).subscribe((data: any) => {
      console.log(data);
      let depa = []
      data.map((res) => {
        let d = {
          ...res,
          value: res['descripcion'] + '-' + res['valor'],
        }
        depa.push(d)
      })
      this.departamento = depa
      console.log(this.departamento);
      this.lcargando.ctlSpinner(false);
    })
  }


  departamentoSearchSelect(numero) {
    console.log(this.atribucionParamsNew.programa);
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      programa: this.atribucionParamsNew.programa?.valor
    }
    console.log(data);
    this.service.searchDepartamentoSelect(data).subscribe((data: any) => {
      console.log(data);
      let depa = []
      data.map((res) => {
        let d = {
          ...res,
          value: res['descripcion'] + '-' + res['valor'],
        }
        depa.push(d)
      })
      this.departamento = depa
      console.log(this.departamento);
      this.lcargando.ctlSpinner(false);
    })
  }

  departamentoSearchSelect2() {
    console.log(this.atribucionParamsNew.programa_dos);
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      programa: this.atribucionParamsNew.programa_dos?.valor
    }
    console.log(data);
    this.service.searchDepartamentoSelect(data).subscribe((data: any) => {
      console.log(data);
      let depa = []
      data.map((res) => {
        let d = {
          ...res,
          value: res['descripcion'] + '-' + res['valor'],
        }
        depa.push(d)
      })
      this.departamento2 = depa
      console.log(this.departamento2);
      this.lcargando.ctlSpinner(false);
    })
  }

  AtribucionSearch(event) {
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      departamento: event.valor
    }
    this.service.searchAtribucion(data).subscribe((dat) => {
      this.atribucion = dat['data']
      this.lcargando.ctlSpinner(false);
    })
  }

  SearchList() {
    this.listaSolicitudes = [];
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
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
    if (this.atribucionParamsNew.reforma_presupuesto == null) {
      this.toastr.info('Debe ingresar el codigo presupuesto')
    } else if (this.atribucionParamsNew.periodo == null) {
      this.toastr.info('Ingrese el periodo')
      return
    } else {
      this.listaSolicitudesAtribucion = [];
      (this as any).mensajeSpinner = "Cargando Bienes...";
      this.lcargando.ctlSpinner(true);
      let data = {
        id: this.datoDepartamento,
        codigo_presupuesto: this.atribucionParamsNew.reforma_presupuesto
      }
      this.service.searchBienes(data).subscribe((dat) => {
        console.log(dat);
        if (dat['data'].length == 0) {
          this.toastr.info('No existe bienes para esa atribución')
          this.listaSolicitudesAtribucion = [];
        } else {

          dat['data'].map((res) => {
            let bienes = {
              check: false,
              id: res.id,
              descripcion: res.descripcion,
              valor: res.u_medida?.valor,
              cantidad_solicitada: res.cantidad,
              costo_unitario: res.costo_unitario,
              fk_departamento: res.fk_departamento,
              departamento: res.departamento?.valor,
              fk_atribucion: res.fk_atribucion?.id,
              atribucion: res.fk_atribucion?.catalogo?.valor,
              fk_programa: res.departamento?.programa?.id_catalogo,
              programa: res.departamento?.programa?.valor,
              cantidad_requerida: null,
              precio_cotizado: res.costo_total_ajustado != null && res.costo_total_ajustado !== "" ? res.costo_total_ajustado : res.costo_total,
//precio_cotizado: res.costo_total, // res.cantidad *  costo_unitario
              cantidad_solicitada_mod: res.cantidad_por_solicitar,
              costo_unitario_mod: res.costo_unitario_por_solicitar,
              costo_total_por_mod: 0,
              cantidad_solicitada_por_mod: 0,
              costo_unitario_por_mod: 0,
              precio_cotizado_mod: res.costo_unitario_por_solicitar, // res.cantidad_por_solicitar *
              cantidad_ajustada: res.cantidad_ajustada,
              icp: res.icp,
              precio_cotizado_icp: res.precio_cotizado_icp,
              icpactivo: res.icpactivo,
              costo_unitario_ajustado: res.costo_unitario_ajustado,
              costo_total_ajustado: res.costo_total_ajustado,
              costo_total_solicitado: res.costo_total_solicitado,
              saldo_por_comprometer: res.costo_total_por_solicitar,//res.costo_total_ajustado - res.costo_total_solicitado ,
            }
            this.listaSolicitudesAtribucion.push(bienes)
          })
        }
        this.lcargando.ctlSpinner(false);
      })
    }
  }


  SearchBienesSelect() {
    console.log(this.atribucionParamsNew.departamento)
    if (this.atribucionParamsNew.periodo == null) {
      this.toastr.info('Ingrese el periodo')
      return
    } else {
      this.listaSolicitudesAtribucion = [];
      (this as any).mensajeSpinner = "Cargando Bienes...";
      this.lcargando.ctlSpinner(true);
      let data = {
        id: this.atribucionParamsNew.departamento.id_catalogo,
        codigo_presupuesto: this.atribucionParamsNew.reforma_presupuesto
      }

      this.service.searchBienes(data).subscribe((dat: any) => {
        console.log(dat);
        if (dat['data'].length == 0) {
          this.toastr.info('No existe bienes para esa atribución')
          this.listaSolicitudesAtribucion = [];
        } else {
          this.totalPartida = dat.data.reduce((acc: number, curr: any) => acc + (curr.cantidad * curr.costo_unitario), 0)
          dat['data'].map((res) => {
            let bienes = {
              check: false,
              id: res.id,
              descripcion: res.descripcion,
              u_medida: res.u_medida,
              cantidad_solicitada: res.cantidad,
              costo_unitario: res.costo_unitario,
              fk_departamento: res.fk_departamento,
              departamento: res.departamento?.valor,
              fk_atribucion: res.fk_atribucion?.id,
              atribucion: res.fk_atribucion?.catalogo?.valor,
              fk_programa: res.departamento?.programa?.id_catalogo,
              programa: res.departamento?.programa?.valor,
              cantidad_requerida: null,
              precio_cotizado: res.costo_total_ajustado != null && res.costo_total_ajustado !== "" ? res.costo_total_ajustado : res.costo_total,
//precio_cotizado: res.costo_total,//res.cantidad *costo_unitario
              cantidad_solicitada_mod: res.cantidad_por_solicitar,
              costo_unitario_mod: res.costo_unitario_por_solicitar,
              costo_total_por_mod: 0,
              cantidad_solicitada_por_mod: 0,
              costo_unitario_por_mod: 0,
              precio_cotizado_mod: res.costo_unitario_por_solicitar, //res.cantidad_por_solicitar *
              cantidad_ajustada: res.cantidad_ajustada,
              icp: res.icp,
              precio_cotizado_icp: res.precio_cotizado_icp,
              icpactivo: res.icpactivo,
              costo_unitario_ajustado: res.costo_unitario_ajustado,
              costo_total_ajustado: res.costo_total_ajustado,
              costo_total_solicitado: res.costo_total_solicitado,
              saldo_por_comprometer: res.costo_total_por_solicitar,//res.costo_total_ajustado - res.costo_total_solicitado ,
            }
            this.listaSolicitudesAtribucion.push(bienes)
          })
        }
        this.lcargando.ctlSpinner(false);
      })

    }
  }

  SearchBienes2() {
    this.listaSolicitudesAtribucion2 = [];
    (this as any).mensajeSpinner = "Cargando Bienes...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id: this.atribucionParamsNew.departamento_dos.id_catalogo,
      codigo_presupuesto: this.atribucionParamsNew.reforma_presupuesto2
    }
    this.service.searchBienes(data).subscribe((dat) => {
      console.log(dat);
      if (dat['data'].length == 0) {
        this.toastr.info('No existe bienes para esa atribución')
        this.listaSolicitudesAtribucion2 = [];
      } else {
        dat['data'].map((res) => {
          let bienes = {
            check: false, id: res.id,
            descripcion: res.descripcion,
            u_medida: res.u_medida,
            cantidad_solicitada: res.cantidad,
            costo_unitario: res.costo_unitario,
            fk_departamento: res.fk_departamento,
            departamento: res.departamento?.valor,
            fk_atribucion: res.fk_atribucion?.id,
            atribucion: res.fk_atribucion?.catalogo?.valor,
            fk_programa: res.departamento?.programa?.id_catalogo,
            programa: res.departamento?.programa?.valor,
            cantidad_requerida: null,
            precio_cotizado: res.costo_total_ajustado != null && res.costo_total_ajustado !== "" ? res.costo_total_ajustado : res.costo_total,
//precio_cotizado: res.costo_total, // res.cantidad * costo_unitario
            cantidad_solicitada_mod: res.cantidad_por_solicitar,
            costo_unitario_mod: res.costo_unitario_por_solicitar,
            costo_total_por_mod: 0,
            cantidad_solicitada_por_mod: 0,
            costo_unitario_por_mod: 0,
            precio_cotizado_mod: res.costo_unitario_por_solicitar, //res.cantidad_por_solicitar *
            cantidad_ajustada: res.cantidad_ajustada,
            icp: res.icp,
              precio_cotizado_icp: res.precio_cotizado_icp,
              icpactivo: res.icpactivo,
            costo_unitario_ajustado: res.costo_unitario_ajustado,
            costo_total_ajustado: res.costo_total_ajustado,
            costo_total_solicitado: res.costo_total_solicitado,
            saldo_por_comprometer: res.costo_total_por_solicitar,// res.costo_total_ajustado - res.costo_total_solicitado ,
          }
          this.listaSolicitudesAtribucion2.push(bienes)
        })
      }
      this.lcargando.ctlSpinner(false);
    })
  }


  selectAll() {
    this.listaSolicitudesAtribucion.map((e: any) => { if (e.icpactivo != 'activo' && e.saldo_por_comprometer != 0) { e.check = this.masterSelected } })
  }
  selectAll2() {
    this.listaSolicitudesAtribucion2.map((e: any) => { if (e.icpactivo != 'activo') { e.check = this.masterSelected } })
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
          nom_documento: '',
          periodo: null,
          programa: null,
          programa_dos: null,
          departamento: null,
          departamento_dos: null,
          atribucion: null,
          reforma_presupuesto: null,
          reforma_presupuesto2: null,
          observacion: null,
          total_1: null,
          total_2: null,
          ajuste_1: 0,
          ajuste_2: 0,
          diferencia_1: 0,
          diferencia_2: 0,
          fecha: moment(this.today).format('YYYY-MM-DD')
        }

        this.listaSolicitudesAtribucion = [];
        this.listaSolicitudesAtribucion2 = [];
        this.total2 = 0;
        this.total = 0;
        this.totalOriginal = 0;
        this.ajuste1 = 0;
        this.ajuste2 = 0;
        this.total2Original = 0;

        this.descripcion_presupuesto = undefined;
        this.descripcion_presupuesto2 = undefined;

        this.search = false
        this.vmButtons[0].habilitar = false

        this.listaSolicitudes = [];

        this.dato_Programa = [];
        this.datoDepartamento = [];
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
      atribucion: null
    }

    this.listaSolicitudes = [];
    this.listaSolicitudesAtribucion = [];
  }

  eliminarSolicitud(item) {
    let data = {
      id: item['id_solicitud']
    }
    this.service.eliminarSolicitud(data).subscribe((res) => {
      this.SearchList();
    })
  }

  limpiarFiltro() {
    this.filter = {
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

    }
  }

  modalReformaInt() {
    const modal = this.modalDet.open(ModalBusquedaReformaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  modalCodigoPresupuesto(valid, partida) {
    let programa = []
    let departamento = []
    if (partida == 'partida1') {
      programa = this.atribucionParamsNew.programa
      departamento = this.atribucionParamsNew.departamento
    }
    if (partida == 'partida2') {
      programa = this.atribucionParamsNew.programa_dos
      departamento = this.atribucionParamsNew.departamento_dos
    }
    let modal = this.modalDet.open(ModalCuentPreComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = valid;
    modal.componentInstance.partida = partida;
    modal.componentInstance.programa = programa;
    modal.componentInstance.departamento = departamento;
    modal.componentInstance.periodo = this.atribucionParamsNew.periodo;

  }


  async clonarBien(bien: any) {
    console.log("clonando");
    let result: SweetAlertResult = await Swal.fire({
      title: 'Seguro desea duplicar este bien?',
      text: 'Se creara un nuevo bien basado en el seleccionado, con valores en 0.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      this.por_actualizar = true;

      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Duplicando Bien'
        let response: Array<any> = await this.service.duplicarBien({
          bien: bien,
          codigo_presupuesto: this.cod_presupuesto,
          periodo: this.atribucionParamsNew,
          programa: this.programa,
        })

        response.map((item: any) => Object.assign(item, {
          check: false,
          cantidad_mod: item.cantidad_por_solicitar,
          costo_total_mod: item.costo_total_por_solicitar,
          departamento: item.departamento.valor,
          atribucion: item.fk_atribucion.catalogo.valor,
          cantidad: item.cantidad,
        }))


        let paginatet = {
          pageIndex: 0,
          page: 1,
          length: 0,
          perPage: 7,
        }

        let programaData = { ...this.atribucionParamsNew.programa, fk_programa: this.atribucionParamsNew.programa.id_catalogo }

        let data = {
          params: {
            filter: { codigo: null, nombre: null },
            paginate: paginatet,
            programa: programaData,
            departamento: this.departamento,
            periodo: this.atribucionParamsNew.periodo,
            tienecodigo: true,
            codigo: this.atribucionParamsNew.reforma_presupuesto,
          }
        }

        this.service.getCatalogoPresupuestoreforma(data).subscribe(
          (res: any) => {
            console.log(res);
            this.cod_presupuesto = res.data.data[0]
            this.atribucionParamsNew.reforma_presupuesto = res.data.data[0].codigo;
            this.SearchBienesSelect()
            this.SearchBienes2()
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error cargando Codigos')
          }
        )
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error duplicando Bien')
      }
    }
  }


  modalReformas() {
    const modal = this.modalDet.open(ModalBusquedaReformaGeneralComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.tipoReforma= 'RI';
  }

}
