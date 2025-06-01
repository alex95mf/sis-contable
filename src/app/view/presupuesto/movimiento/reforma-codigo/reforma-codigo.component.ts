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
// import { ReformaInternaService } from './reforma-interna.service';
import { ModalBusquedaReformaComponent } from './modal-busqueda-reforma/modal-busqueda-reforma.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ReformaCodigoService } from './reforma-codigo.service';
import { ModalBusquedaReformaDocComponent } from './modal-busqueda-reforma-doc/modal-busqueda-reforma-doc.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-reforma-codigo',
  templateUrl: './reforma-codigo.component.html',
  styleUrls: ['./reforma-codigo.component.scss']
})
export class ReformaCodigoComponent implements OnInit, OnDestroy {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  msgSpinner: string;
  mensajeSppiner: string = "Cargando...";

  periodos: Array<any> = [];
  periodoObjectSelected: any = {};
  programas: Array<any> = [];
  programaObjectSelected: any = {};

  programa: any = [];
  departamento: any = [];
  atribucion: any = [];

  // listaSolicitudes: any = [];
  listaSolicitudesAtribucion: any = [];

  listaSolicitudesAtribucion2: any = [];

  nuevaSolicitud: boolean = true;

  nuevaS: any = {

  }

  total: any = 0;

  total2:any = 0;

  totalOriginal: number = 0;

  total2Original: number = 0;

  ajuste1: number = 0;

  ajuste2: number = 0;

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

  atribucionParamsNew: any = {
    id_reforma_interna: null,
    nom_documento: null,
    periodo: null,
    programa: null,
    departamento: null,
    atribucion: null,
    reforma_presupuesto: null,
    reforma_presupuesto2: null,
    observacion: null,
    total_1: 0,
    total_2: 0,
    ajuste_1: 0,
    ajuste_2: 0,
    diferencia_1: 0,
    diferencia_2: 0,
    tipo_reforma: 'COD',
    fecha: moment().format('YYYY-MM-DD')
  }

  periodo: any;
  bienes: Array<any> = [];
  cod_presupuesto: any = {
    label: ''
  };
  datoDepartamento: any = []

  dato_Programa: any = []

  cargarAnexo: boolean = true;
  search: boolean = false;
  descripcion_presupuesto: any;
  descripcion_presupuesto2: any;

  por_actualizar: boolean = false;

  fileList: FileList;

  reformaSelected: any = {}

  onDestroy$ = new Subject<void>()

  constructor(
    private modalService: NgbModal,
    private service: ReformaCodigoService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarService: CommonVarService,
  ) {
    this.service.reformaSelected$.subscribe(
      (reforma: any) => {
        console.log(reforma)
        this.reformaSelected = reforma
        const { fecha_registro } = reforma
        Object.assign(this.atribucionParamsNew, {
          // nom_documento: no_reforma,
          fecha: moment(fecha_registro).format('YYYY-MM-DD'),
        })
      }
    )

    /* this.commonVarService.diableCargarDis.asObservable().subscribe(
      (res) => {
        this.cargarAnexo = false;
      }
    ) */

    this.commonVarService.modalreformaInterna.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res: any)=>{
        console.log(res);

        this.search = true
        this.atribucionParamsNew = res
        // this.atribucionParamsNew.nom_documento = res.nom_documento
        this.total = res.diferencia_1
        this.totalOriginal = res.total_1
        this.ajuste1 = res.diferencia_1

        this.total2 = res.diferencia_2
        this.total2Original = res.total_2
        this.ajuste2 = res.diferencia_2

        // this.atribucionParamsNew['reforma_presupuesto2'] = res.codigo_presupuesto2
        this.atribucionParamsNew['reforma_presupuesto'] = res.codigo_presupuesto1
        res['detalles'].forEach(
          (e: any)=>{

            if(e.tipo_ajuste == 1){
              this.listaSolicitudesAtribucion.push(e)
            }else if (e.tipo_ajuste == 2){
              this.listaSolicitudesAtribucion2.push(e)
            }

          }
        )
      }
    )


    this.commonVarService.modalreformaPrespuestoCod.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res)=>{
        console.log("cierra modal y trae esto:",res);
        this.cod_presupuesto = res.data
        // if (res.partida == 'partida1') {
          this.atribucionParamsNew.reforma_presupuesto = res.data.codigo;
          this.SearchBienesSelect()
          this.SearchBienes2()
        // } else if (res.partida == 'partida2') {
          //   this.atribucionParamsNew.reforma_presupuesto2 = res.data.codigo;
          //   this.SearchBienes2()
        // }
        /*  if(res.validacion == 'Presupuestario'){
          this.atribucionParamsNew.reforma_presupuesto = res.data.codigo;
          this.descripcion_presupuesto = res.data.descripcion_general;
        }else{
          this.atribucionParamsNew.reforma_presupuesto2 = res.data.codigo;
          this.descripcion_presupuesto2 = res.data.descripcion_general
        } */


      }
    )

   }
  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasP", paramAccion: "", boton: { icon: "fas fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsComprasP", paramAccion: "", boton: { icon: "fas fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsComprasP", paramAccion: "", boton: { icon: "fas fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}

    ]

    /* this.filter = {
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

    this.paginateNew = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }; */

    setTimeout(() => {
      this.validaPermisos()
    }, 500);


  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "GUARDAR":
        this.validaSolicitud();
        break;
      case "BUSCAR":
        this.modalReformaInt();
        break;
      case "LIMPIAR":
        // this.limpiar();
        break;
    }
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
          this.cargaInicial()
          // this.cargarPrograma()
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      let response: Array<any>;
      // Cargar Periodos
      this.mensajeSppiner = 'Cargando Periodos'
      response = await this.service.getPeriodos();
      // console.log(response)
      this.periodos = response;


      // Cargar Programas
      this.mensajeSppiner = 'Cargando Programas'
      response = await this.service.getProgramas();
      // console.log(response)
      response.map((item: any) => {
        Object.assign(
          item,
          { label: `${item.descripcion} - ${item.valor}`}
        )
      })
      this.programas = response

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Programas')
    }

  }

  handleSelectPeriodo(event) {
    // console.log(event)
    // this.service.periodoSelected$.emit(event)
    Object.assign(this.periodoObjectSelected, event)
    Object.assign(this.atribucionParamsNew, { periodo: event.periodo })
    // this.atribucionParamsNew.perido = event.periodo
  }

  handleSelectPrograma(event) {
    // console.log(event)
    // this.service.programaSelected$.emit(event)
    Object.assign(this.programaObjectSelected, event)
    Object.assign(this.atribucionParamsNew, { programa: { id_catalogo: event.id_catalogo,fk_programa: event.id_catalogo, label: event.label } })
    // this.atribucionParamsNew.programa = event.valor
  }

  expandReforma() {
    if (this.atribucionParamsNew.periodo && this.atribucionParamsNew.programa) {
      const modal = this.modalService.open(ModalBusquedaReformaDocComponent, {size: 'xl', backdrop: 'static'})
      modal.componentInstance.periodo = this.periodoObjectSelected
      modal.componentInstance.programa = this.programaObjectSelected
    } else {
      this.toastr.warning('No ha escogido Periodo o Programa.', 'Validacion de Datos')
    }
  }

  async validaSolicitud() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear nuevos Reformas internas");
      return;
    }
    else if ( this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para Reformas internas.");
      return;
    }
    this.setReforma()
    // this.guardarSolicitud()
  }

  async setReforma() {
    let result = await Swal.fire({
      title: 'Almacenar Reforma',
      text: 'Seguro/a desea almacenar esta reforma?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      Object.assign(this.atribucionParamsNew, {
        bienes: [],
        total_1: this.totalOriginal,
        total_2: this.total2Original,
        diferencia_1: this.total,
        diferencia_2: this.total2,
        tipo_reforma: 'COD'
      })

      this.listaSolicitudesAtribucion.forEach((element: any) => {
        if (element.check) {
          // Estos son los que se decrementan
          element.tipo_ajuste = 1
          this.atribucionParamsNew.bienes.push(element)
        }
      });
      this.listaSolicitudesAtribucion2.forEach((element: any) => {
        if (element.check) {
          // Estos son los que se incrementan
          element.tipo_ajuste = 2
          this.atribucionParamsNew.bienes.push(element)
        }
      })
console.log("this.atribucionParamsNew",this.atribucionParamsNew);
      this.lcargando.ctlSpinner(true)
      try {
        this.mensajeSppiner = 'Validando datos'
        await this.validaDataGlobal()
        const response = await this.service.setReformaInterna({documento: this.atribucionParamsNew})
        console.log(response)
        //
        Swal.fire('Reforma almacenada correctamente', '', 'success').then(() => {
          this.atribucionParamsNew.nom_documento = response.nom_documento
        })
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.warning(err, 'Validacion de Datos', {enableHtml: true})
      }
    }

  }

  expandPartidas(partida) {
    let message = ''

    if (!this.atribucionParamsNew.periodo) message += '* No ha seleccionado un Periodo.<br>'
    if (!this.atribucionParamsNew.programa.fk_programa) message += '* No ha seleccionado un Programa.<br>'

    if (message.length) {
      this.toastr.warning(message, 'Validacion de Datos', {enableHtml: true})
      return
    }

    let programa = []
    let departamento = []
    // if(partida=='partida1'){
       programa = this.atribucionParamsNew.programa
       departamento = this.atribucionParamsNew.departamento

console.log("departamento",departamento);


    // }
  //   if(partida=='partida2'){
  //     programa = this.atribucionParamsNew.programa_dos
  //     departamento = this.atribucionParamsNew.departamento_dos
  //  }
    const modal = this.modalService.open(ModalCuentPreComponent, { size: 'xl', backdrop: 'static'})
    modal.componentInstance.validacionModal = false
    // modal.componentInstance.partida = partida
    modal.componentInstance.programa = {fk_programa: this.programaObjectSelected.id_catalogo}
    modal.componentInstance.departamento = departamento;
    modal.componentInstance.periodo = this.atribucionParamsNew.periodo;

  }

  validaDataGlobal() {
    // console.log(this.ticketNew);
    return new Promise<void>((resolve, reject) => {
      let message = '';

      if (this.atribucionParamsNew.ajuste1 != this.atribucionParamsNew.ajuste2) message += '* Los valores ajustados no coinciden.<br>'
      // if (this.atribucionParamsNew.reforma_presupuesto != this.atribucionParamsNew.reforma_presupuesto2) message += '* Los codigos para aplicar la Reforma no coinciden.<br>'

      return (message.length > 0) ? reject(message) : resolve()
    })
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

      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Duplicando Bien'
        let response: Array<any> = await this.service.duplicarBien({
          bien: bien,
          codigo_presupuesto: this.cod_presupuesto,
          periodo: this.atribucionParamsNew,
          programa: this.programa,
        })
        console.log("response",response);
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

        let data = {
          params: {
            filter: {codigo: null, nombre: null},
            paginate: paginatet,
            programa: this.atribucionParamsNew.programa,
            departamento: this.departamento,
            periodo: this.atribucionParamsNew.periodo,
            tienecodigo: true,
            codigo:this.atribucionParamsNew.reforma_presupuesto,
          }
        }
//;


console.log("ejecutando recalculo",data);
        this.service.getCatalogoPresupuestoreforma(data).subscribe(
          (res: any)=>{
             console.log(res);
           // //this.paginate.length= res.data.total
          //  this.encargados = res.data.data
        // res.data.data  codigo o id_catalogo_presupuesto "510304"

        this.cod_presupuesto = res.data.data[0]
       //  this.atribucionParamsNew.reforma_presupuesto
      // if (res.partida == 'partida1') {
        this.atribucionParamsNew.reforma_presupuesto = res.data.data[0].codigo;
        this.SearchBienesSelect()
        this.SearchBienes2()




          //  this.lcargando.ctlSpinner(false);
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error cargando Codigos')
          }
        )




      /*   this.listaSolicitudesAtribucion = response;

        this.lcargando.ctlSpinner(false) */
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error duplicando Bien')
      }
    }
  }


  actualizaTotalCotizado(element: any) {
    element.precio_cotizado_mod = element.cantidad_solicitada_mod * element.costo_unitario_mod
    this.calcularValorTotal()
  }

  calcularValorTotal(){
    this.totalOriginal = this.listaSolicitudesAtribucion.reduce((acc: number, curr: any) => {
      if (curr.check) return acc + parseFloat(curr.precio_cotizado)
      return acc
    }, 0)
    this.total = this.totalOriginal - this.atribucionParamsNew.ajuste_1
    this.ajuste1 = this.listaSolicitudesAtribucion.reduce((acc: number, curr: any) => {
      if (curr.check) return acc + curr.precio_cotizado_mod
      return acc
    }, 0)
  }

  actualizaTotalCotizado2(element: any) {
    // element.costo_total_reforma = element.cantidad_reforma * element.costo_unitario_reforma
    element.precio_cotizado_mod = element.cantidad_solicitada_mod * element.costo_unitario_mod
    this.calcularValorTotal2()
  }

  calcularValorTotal2(){
    this.total2Original = this.listaSolicitudesAtribucion2.reduce((acc: number, curr: any) => {
      if (curr.check) return acc + parseFloat(curr.precio_cotizado)
      return acc
    }, 0)
    this.total2 = this.total2Original + this.atribucionParamsNew.ajuste_2
    this.ajuste2 = this.listaSolicitudesAtribucion2.reduce((acc: number, curr: any) => {
      if (curr.check) return acc + curr.precio_cotizado_mod
      return acc
    }, 0)
  }


  /* calcularAjuste(event){
    // setTimeout(() => {
    //   if(event == '') {console.log('algo');this.atribucionParamsNew.ajuste_1 = 0};
    // }, 50);
    let total = 0

    this.listaSolicitudesAtribucion.map((res)=>{
      if(res.check){
        console.log('Entro',res.cantidad_solicitada_mod);
        res.precio_cotizado_mod = res.cantidad_solicitada_mod * res.costo_unitario_mod
        total += (res.cantidad_solicitada_mod * res.costo_unitario_mod)

      }

    })
    console.log(this.atribucionParamsNew.ajuste_1);
    this.total = total - parseFloat(this.atribucionParamsNew.ajuste_1);

    if(isNaN(this.total)) this.total = 0;
    console.log(total);
  } */



  /* calcularValorTotal(){
    let total = 0
    let totalOr = 0
    this.listaSolicitudesAtribucion.map((res)=>{
      if(res.check){
        console.log('Entro',res.cantidad_solicitada_mod);
        res.precio_cotizado_mod = res.cantidad_solicitada_mod * res.costo_unitario_mod
        total += (res.cantidad_solicitada_mod * res.costo_unitario_mod)
        totalOr += (res.cantidad_solicitada * res.costo_unitario)
      }

    })
    console.log(this.atribucionParamsNew.ajuste_1);
    // this.total = total - this.atribucionParamsNew.ajuste_1
    this.ajuste1 = total
    this.totalOriginal = totalOr
    console.log(total);
  } */


  /* calcularAjuste2(event){


    // setTimeout(() => {
    //   if(event == '') {console.log('algo');this.atribucionParamsNew.ajuste_2 = 0};
    // }, 50);


    let total = 0

    this.listaSolicitudesAtribucion2.map((res)=>{
      if(res.check){
        console.log('Entro',res.cantidad_solicitada_mod);
        res.precio_cotizado_mod = res.cantidad_solicitada_mod * res.costo_unitario_mod
        total += (res.cantidad_solicitada_mod * res.costo_unitario_mod)

      }

    })
    console.log(this.atribucionParamsNew.ajuste_1);
    this.total2 = total + parseFloat(this.atribucionParamsNew.ajuste_2);

    if(isNaN(this.total2)) this.total2 = 0;
    console.log(total);
  } */



  /* calcularValorTotal2(){
    let total = 0
    let totalOr = 0
    this.listaSolicitudesAtribucion2.map((res)=>{
      if(res.check){
        console.log('Entro',res.cantidad_solicitada_mod);
        res.precio_cotizado_mod = res.cantidad_solicitada_mod * res.costo_unitario_mod
        total += (res.cantidad_solicitada_mod * res.costo_unitario_mod)
        totalOr += (res.cantidad_solicitada * res.costo_unitario)
      }

    })
    this.ajuste2 = total
    this.total2Original = totalOr
    console.log(total);
  } */

  /* changePaginate(event) {
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
  } */

  /* changePaginateNew2(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginateNew, newPaginate);
    this.SearchBienes2();
  } */


  /* cantidadTotalItem(item){
    console.log(item);
    if(item['cantidad_requerida'] > item['cantidad_solicitada']){
      this.toastr.info('El valor ingresado es mayor a la cantidad en stock')
      setTimeout(() => {
        item['cantidad_requerida'] = null
      }, 10);

    }else if(item['cantidad_requerida'] == 0){
      this.toastr.info('El valor ingresado no debe ser cero')
      setTimeout(() => {
        item['cantidad_requerida'] = null
      }, 10);

    }
    else{
      item['precio_cotizado'] =( item['costo_unitario'] * item['cantidad_requerida'])
      this.calcularValorTotal()
    }

  } */


  /* guardarSolicitud(){
    if(this.total2Original == 0 || this.ajuste2 == 0){
      this.toastr.info('Realice la reforma interna')
      return
    }else if (this.atribucionParamsNew.periodo == null){
      this.toastr.info('Ingrese el periodo')
      return
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
        this.mensajeSppiner = "Creando Reforma interna...";
        this.lcargando.ctlSpinner(true);
        console.log(this.atribucionParamsNew);
        // let detalles = []
        this.atribucionParamsNew.bienes = []
        this.listaSolicitudesAtribucion.map((res)=>{
          if(res.check){
            res['tipo_ajuste'] = 1;
            this.atribucionParamsNew.bienes.push(res);
          }
        })

        // this.atribucionParamsNew.bienes2 = []
        this.listaSolicitudesAtribucion2.map((res)=>{
          if(res.check){
            res['tipo_ajuste'] = 2;
            this.atribucionParamsNew.bienes.push(res);
          }
        })

        this.atribucionParamsNew.total_1 = this.totalOriginal
        this.atribucionParamsNew.total_2 = this.total2Original
        this.atribucionParamsNew.diferencia_1 = this.total
        this.atribucionParamsNew.diferencia_2 = this.total2

        console.log(this.atribucionParamsNew);

        this.service.setReformaInterna(this.atribucionParamsNew).subscribe((dat:any)=>{
          console.log(dat);
          // this.uploadFile(dat.data.id_solicitud)
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
              console.log(dat.data.nom_documento);
              setTimeout(() => {
                this.atribucionParamsNew.nom_documento = dat.data.nom_documento
              }, 50);

              // this.nuevaSolicitud =true
              // this.SearchList()
            }
          });
        },
        (error)=>{
          console.log(error);
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error['message'])
        }
        )
      }
    });



  } */

  onMaterialGroupChange(event){
    console.log(event);
  }

  cargarPrograma(){
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);

    this.service.searchPrograma({}).subscribe((res: any)=>{
      // console.log(res);
      let program = []
      res.map((data)=>{

        let dat = {
          ...data.catalogo,
          value: data.catalogo['descripcion'] + '-'+ data.catalogo['valor']
        }
        program.push(dat)
        this.lcargando.ctlSpinner(false);
      })
      this.programa = program
      console.log(this.programa);
    })
  }

  departamentoSearch(){
    // console.log(event);
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);

    let data = {
      programa: this.dato_Programa //event.valor
    }
    console.log(data);
    this.service.searchDepartamento(data).subscribe((data: any)=>{
      console.log(data);
      let depa = []
      data.map((res)=>{
        let d = {
          ...res,
          value: res['descripcion'] + '-'+ res['valor'],

        }
        depa.push(d)
      })
      this.departamento = depa
      console.log(this.departamento);
      this.lcargando.ctlSpinner(false);
    })
  }


  departamentoSearchSelect(){
    // console.log(event);
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);

    let data = {
      programa: this.atribucionParamsNew.programa //event.valor
    }
    console.log(data);
    this.service.searchDepartamentoSelect(data).subscribe((data: any)=>{
      console.log(data);
      let depa = []
      data.map((res)=>{
        let d = {
          ...res,
          value: res['descripcion'] + '-'+ res['valor'],

        }
        depa.push(d)
      })
      this.departamento = depa
      console.log(this.departamento);
      this.lcargando.ctlSpinner(false);
    })
  }



  AtribucionSearch(event){
    // console.log(event);
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      departamento: event.valor
    }
    this.service.searchAtribucion(data).subscribe((dat)=>{
      // console.log(dat);
      this.atribucion = dat['data']
      this.lcargando.ctlSpinner(false);
    })
  }

  /* SearchList(){
    // console.log(event);
    this.listaSolicitudes = []
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);


    let data = {
      id: this.datoDepartamento,
      params:{
        paginate: this.paginate,
        filter: this.filter
      }


    }
    console.log(data);
    this.service.searchSolicitud(data).subscribe((dat)=>{
      console.log(dat);
      if(dat['data'].length == 0){
        this.listaSolicitudes = [];
      }else{
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
    (error)=>{
      console.log(error);
      this.lcargando.ctlSpinner(false);
    }
    )
  } */

  /* SearchBienes(){
    // console.log(event);

    if(this.atribucionParamsNew.reforma_presupuesto == null){
      this.toastr.info('Debe ingresar el codigo presupuesto')
    }else if (this.atribucionParamsNew.periodo == null){
      this.toastr.info('Ingrese el periodo')
      return
    }else{
      this.listaSolicitudesAtribucion = []
      this.mensajeSppiner = "Cargando Bienes...";
      this.lcargando.ctlSpinner(true);
      let data = {
        id: this.datoDepartamento,
        codigo_presupuesto: this.atribucionParamsNew.reforma_presupuesto

      }

      this.service.searchBienes(data).subscribe((dat)=>{
        console.log(dat);
        if(dat['data'].length == 0){
          this.toastr.info('No existe bienes para esa atribución')
          this.listaSolicitudesAtribucion = []
        }else {

          dat['data'].map((res)=>{
            let bienes = {
              check: false,
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
              precio_cotizado: res.cantidad * res.costo_unitario,
              cantidad_solicitada_mod: res.cantidad,
              costo_unitario_mod: res.costo_unitario,
              precio_cotizado_mod: res.cantidad * res.costo_unitario,
            }
            this.listaSolicitudesAtribucion.push(bienes)

          })
          // this.listaSolicitudesAtribucion = dat['data']

        }

        this.lcargando.ctlSpinner(false);

      })

    }
  } */

  SearchBienesSelect(){
    // console.log(event);

    if(this.atribucionParamsNew.reforma_presupuesto == null){
      this.toastr.info('Debe ingresar el codigo presupuesto')
    }else if (this.atribucionParamsNew.periodo == null){
      this.toastr.info('Ingrese el periodo')
      return
    }else{
      this.listaSolicitudesAtribucion = []
      this.mensajeSppiner = "Cargando Bienes...";
      this.lcargando.ctlSpinner(true);
      let data = {
        id: this.atribucionParamsNew.departamento,
        codigo_presupuesto: {codigo: this.atribucionParamsNew.reforma_presupuesto},
        periodo: {periodo: this.atribucionParamsNew.periodo}
      }

      this.service.searchBienes(data).subscribe((dat)=>{
        console.log(dat);
        if(dat['data'].length == 0){
          this.toastr.info('No existe bienes para esa atribución')
          this.listaSolicitudesAtribucion = []
        }else {

          dat['data'].map((res)=>{
            let bienes = {
              check: false,
              id: res.id,
              descripcion: res.descripcion,
              u_medida: res.u_medida,
              fk_departamento: res.fk_departamento,
              departamento: res.departamento?.valor,
              fk_atribucion: res.fk_atribucion?.id,
              atribucion: res.fk_atribucion?.catalogo?.valor,
              fk_programa: res.departamento?.programa?.id_catalogo,
              programa: res.departamento?.programa?.valor,
              // Cantidades Iniciales
              cantidad_solicitada: res.cantidad_ajustada,
              costo_unitario: res.costo_unitario_ajustado,
              precio_cotizado: res.costo_total_ajustado,
              // Cantidades por Solicitar
              cantidad_por_solicitar: res.cantidad_por_solicitar,
              costo_total_por_solicitar: res.cantidad_por_solicitar * res.costo_unitario_ajustado,
              // Cantidades Reforma
              cantidad_solicitada_mod: res.cantidad_por_solicitar,
              costo_unitario_mod: res.costo_unitario_ajustado,
              precio_cotizado_mod: res.cantidad_por_solicitar * res.costo_unitario_ajustado,
            }
            this.listaSolicitudesAtribucion.push(bienes)

          })
          // this.listaSolicitudesAtribucion = dat['data']

        }

        this.lcargando.ctlSpinner(false);

      })

    }
  }

  SearchBienes2(){
    // console.log(event);

    // if(this.atribucionParamsNew.reforma_presupuesto2 == null){
    //   this.toastr.info('Debe ingresar el codigo presupuesto')
    // }else{
      this.listaSolicitudesAtribucion2 = []
      this.mensajeSppiner = "Cargando Bienes...";
      this.lcargando.ctlSpinner(true);
      let data = {
        id: this.atribucionParamsNew.departamento,
        codigo_presupuesto: {codigo: this.atribucionParamsNew.reforma_presupuesto},
        periodo: {periodo: this.atribucionParamsNew.periodo}

      }

      this.service.searchBienes(data).subscribe((dat)=>{
        console.log(dat);
        if(dat['data'].length == 0){
          this.toastr.info('No existe bienes para esa atribución')
          this.listaSolicitudesAtribucion2 = []
        }else {

          dat['data'].map((res)=>{
            let bienes = {
              check: false,
              descripcion: res.descripcion,
              u_medida: res.u_medida,
              fk_departamento: res.fk_departamento,
              departamento: res.departamento?.valor,
              fk_atribucion: res.fk_atribucion?.id,
              atribucion: res.fk_atribucion?.catalogo?.valor,
              fk_programa: res.departamento?.programa?.id_catalogo,
              programa: res.departamento?.programa?.valor,
              // Cantidades Iniciales
              cantidad_solicitada: res.cantidad_ajustada,
              costo_unitario: res.costo_unitario_ajustado,
              precio_cotizado: res.costo_total_ajustado,
              // Cantidades por Solicitar
              cantidad_por_solicitar: res.cantidad_por_solicitar,
              costo_total_por_solicitar: res.cantidad_por_solicitar * res.costo_unitario_ajustado,
              // Cantidades Reforma
              cantidad_solicitada_mod: res.cantidad_por_solicitar,
              costo_unitario_mod: res.costo_unitario_ajustado,
              precio_cotizado_mod: res.cantidad_por_solicitar * res.costo_unitario_ajustado,
            }
            this.listaSolicitudesAtribucion2.push(bienes)

          })
          // this.listaSolicitudesAtribucion = dat['data']

        }

        this.lcargando.ctlSpinner(false);

      })

    // }

  }

  // nuevoSolicitud(valor){
  //   this.nuevaSolicitud = false
  //   this.vmButtons[0].showimg = true
  //   this.vmButtons[1].showimg = true
  //   this.vmButtons[2].showimg = false
  //   // this.vmButtons[3].showimg = false

  //   if(!!this.atribucionParams['atribucion']){
  //     this.atribucionParamsNew['programa'] = this.atribucionParams['programa']
  //     this.atribucionParamsNew['departamento'] = this.atribucionParams['departamento']
  //     this.atribucionParamsNew['atribucion'] = this.atribucionParams['atribucion']
  //     console.log(this.atribucionParamsNew['atribucion']);
  //     this.SearchBienes();
  //   }

  //   // this.listaSolicitudes = []
  //   // console.log(this.vmButtons[0]);

  // }

  // regresar(){
  //   this.vmButtons[0].showimg=false
  //   this.vmButtons[1].showimg=false
  //   this.vmButtons[2].showimg=true
  //   // this.vmButtons[3].showimg = true
  //   this.nuevaSolicitud =true

  // }

  AtribucionSearchNew(event){
    console.log(event);
  }

  // moduloDetalle(event){
  //   console.log(event);
  //   let modal = this.modalDet.open(DetalleSolicitudComponent , {
  //     size: "lg",
  //     backdrop: "static",
  //     windowClass: "viewer-content-general",
  //   })

  //   modal.componentInstance.item = event
  // }

  /* limpiar(){
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
          departamento: null,
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

        this.listaSolicitudesAtribucion = []
        this.listaSolicitudesAtribucion2 = []
        this.total2 = 0;
        this.total = 0;
        this.totalOriginal = 0;
        this.ajuste1 =0;
        this.ajuste2 = 0;
        this.total2Original =0;

        this.descripcion_presupuesto = undefined;
        this.descripcion_presupuesto2 = undefined;

        this.search = false

        this.listaSolicitudes = []

        this.dato_Programa =[]
        this.datoDepartamento = []
      }
    })

  } */


  /* limpiarSinConf(){
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

    this.listaSolicitudes = []

    this.listaSolicitudesAtribucion = []
  } */

  /* eliminarSolicitud(item){
    let data = {
      id: item['id_solicitud']
    }
    console.log(data);
    this.service.eliminarSolicitud(data).subscribe((res)=>{
      console.log(res);
      this.SearchList();
    })
  } */

  limpiarFiltro(){
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
      // console.log(this.fileList)
    }
  }

  // uploadFile(identifier) {
  //   console.log('Presionado una vez', this.fileList);
  //   let data = {
  //     // Informacion para almacenamiento de anexo
  //     module: this.permissions.id_modulo,
  //     component: myVarGlobals.fCPSolici,  // TODO: Actualizar cuando formulario ya tenga un ID
  //     identifier: identifier,
  //     // Informacion para almacenamiento de bitacora
  //     id_controlador: myVarGlobals.fCPSolici,  // TODO: Actualizar cuando formulario ya tenga un ID
  //     accion: `Nuevo anexo para Inspeccion Comisaria ${identifier}`,
  //     ip: this.commonSrv.getIpAddress()
  //   }

  //   for (let i = 0; i < this.fileList.length; i++) {
  //     console.log('File', data);
  //     this.UploadService(this.fileList[i], identifier, data );
  //   }
  //   this.fileList = undefined
  //   // this.lcargando.ctlSpinner(false)
  // }

  // UploadService(file, identifier:any, payload?: any): void {
  //   let cont = 0
  //   console.log('Se ejecuto');
  //   this.service.uploadAnexo(file, payload).toPromise().then(res => {
  //     console.log('aqui', res);
  //   }).then(res => {

  //   })
  // }



  modalReformaInt(){
    const modal = this.modalService.open(ModalBusquedaReformaComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }


  modalCodigoPresupuesto(valid){
    let modal = this.modalService.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = valid;
  }


}
