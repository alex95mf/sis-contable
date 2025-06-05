import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SweetAlertResult } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ModalBuscaPrestamoComponent } from './modal-busca-prestamo/modal-busca-prestamo.component';
import { PrestamosService } from '../prestamos-new/prestamos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CcModalTableEmpleadoComponent } from 'src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { environment } from 'src/environments/environment';
import { ModalConsultaPrestamosComponent } from './modal-consulta-prestamos/modal-consulta-prestamos.component';
import { CierreMesService } from 'src/app/view/presupuesto/configuracion/cierre-de-mes/cierre-mes.service';
//import e from 'cors';

@Component({
standalone: false,
  selector: 'app-prestamos-new',
  templateUrl: './prestamos-new.component.html',
  styleUrls: ['./prestamos-new.component.scss']
})
export class PrestamosNewComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any[];
  mensajeSpinner: string = "Cargando...";

  activeTab: number = 0;

  formReadOnly: boolean = false;
  cmb_tipo_pago: Array<any> = [];
  prestamo: any = {
    id_prestamo: null,
    tipo: 'PAE',  // Prestamos A Empleados
    empleado: {
      id_empleado: null,
      emp_full_nombre: null,
    },
    fecha: moment().format('YYYY-MM-DD'),
    fecha_inicio: moment().format('YYYY-MM-DD'),
    fecha_final: moment().endOf('year').format('YYYY-MM-DD'),
    monto: 0,
    abono: 0,
    saldo: 0,
    concepto: null,
    detalle: '',
    tipo_pago: null,
    garante: {
      nombre: null,
      identificacion: null,
      telefono: null,
    },
    num_doc: null,
    codigo_rubro:null
  }
  cuotas: Array<any> = []

  paginate: any = {
    perPage: 10,
    page: 1,
    length: 0,
  }
  filter: any = {
    empleado: { emp_full_nombre: null },
    fecha_desde: moment().startOf('year').startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD')
  }
  prestamos: Array<any> = [];
  rubros: any = []

  constructor(
    private apiService: PrestamosService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private dialogService: DialogService,
    private excelService: ExcelService,
    private cierremesService: CierreMesService
  ) {
    this.vmButtons = [
      {
        orig: "btnsPrestamosNew",
        paramAccion: "0",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true
      },
      {
        orig: "btnsPrestamosNew",
        paramAccion: "0",
        boton: { icon: "fa fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsPrestamosNew",
        paramAccion: "0",
        boton: { icon: "fa fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsPrestamosNew",
        paramAccion: "1",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsPrestamosNew",
        paramAccion: "1",
        boton: { icon: "fa fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true
      },
      {
        orig: "btnsPrestamosNew",
        paramAccion: "0",
        boton: { icon: "fa fa-trash-o", texto: "ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true
      },
      {
        orig: "btnsPrestamosNew",
        paramAccion: "0",
        boton: { icon: "fa fa-file-pdf-o", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true
      },

    ];

    this.apiService.empleadoSelected$.subscribe(
      ({id_empleado, emp_full_nombre}) => {
        this.prestamo.concepto = `PRESTAMO A EMPLEADOS: ${emp_full_nombre}`
        Object.assign(this.prestamo.empleado, {id_empleado, emp_full_nombre})

      }
    )

    this.apiService.prestamoSelected$.subscribe(
      async ({id_prestamo}) => {
        this.lcargando.ctlSpinner(true)
        try {
          (this as any).mensajeSpinner = 'Cargando Prestamo';
          let response: any = await this.apiService.getPrestamo(id_prestamo)
          Object.assign(response, {
            garante: {
              nombre: response.garante_nombre,
              identificacion: response.garante_identificacion,
              telefono: response.garante_telefono
            }
          })
          this.prestamo = response
          this.cuotas = response.detalles;
          this.formReadOnly = true;

          if(this.prestamo.estado == 'A' ){
            this.vmButtons[5].habilitar = false
            this.vmButtons[6].habilitar = false
          }else{
            this.vmButtons[5].habilitar = true
            this.vmButtons[6].habilitar = true
          }

          this.lcargando.ctlSpinner(false)
          //
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error cargando Prestamo')
        }
      }
    )
  }

  ngOnInit(): void {
    setTimeout(() =>{
      this.cargaInicial();

    } , 50)

    this.handleTabChange({index: 0, tab: null })
  }

  async cargaInicial() {
    let response: any;
    let resRubros:  any;

    response = await this.apiService.getCatalogos({params: "'TIPO PAGO PRESTAMO'"})
    this.cmb_tipo_pago = response['TIPO PAGO PRESTAMO']

    resRubros = await this.apiService.getRubros({})
    this.rubros= resRubros

    console.log(this.rubros)
  }

  metodoGlobal(event: any) {
    switch (event.items.paramAccion + event.items.boton.texto) {
      case "0GUARDAR":
        this.setPrestamo()
        break;
      case "0BUSCAR":
        this.expandPrestamos();
        break;
      case "0LIMPIAR":
        this.limpiarFormulario();
        break;
      case "0ANULAR":
        this.anularPrestamo();
        break;
      case "0PDF":
        this.exportarPdf();
        break;
      case "1CONSULTAR":
        this.consultarPrestamos();
        break;
      case "1EXCEL":
        this.exportarPrestamos()
        break;

      default:
        break;
    }
  }

  generarCuotas() {
    let message = '';

    // Obtener cantidad de meses entre fecha inicio y fecha final
    const fecha_inicio = moment(this.prestamo.fecha_inicio)
    const fecha_final = moment(this.prestamo.fecha_final)
    const meses = fecha_final.diff(fecha_inicio, 'months')

    if (fecha_inicio.isAfter(fecha_final)) {
      message += '* La fecha final no puede ser menor a la fecha inicial.<br>'
    }
    if (this.prestamo.monto <= 0) {
      message += '* El monto del prestamo no puede ser menor o igual a 0.<br>'
    }

    if (!fecha_inicio.isSame(fecha_final, 'year')) {
      message += '* La fecha final no pertenece al mismo periodo que la fecha inicial.<br>'
    }

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
      return
    }

    this.cuotas = [];
    for(let mes = 1; mes <= meses; mes++) {
      // console.log(fecha_inicio.toString(), mes, fecha_inicio.add(mes, 'month').toString())
      let cuota = {
        num_cuota: mes,
        fecha_vencimiento: fecha_inicio.add(1, 'months').endOf('month').format('YYYY-MM-DD'),
        monto: this.prestamo.monto / meses,
        estado: 'Pendiente'
      }
      // console.log(cuota)
      this.cuotas = [...this.cuotas, cuota]
    }

    this.vmButtons[0].habilitar = false;

  }

  async setPrestamo() {
    (this as any).mensajeSpinner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);

    let dat = {
      "anio": Number(moment(this.prestamo.fecha).format('YYYY')),
      "mes": Number(moment(this.prestamo.fecha).format('MM')),
      }

    this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(async (res) => {
        try {
          if (res["data"][0].estado !=='C') {

            let message: string = '';
            if (
              (this.prestamo.garante.nombre == null || !this.prestamo.garante.nombre.trim().length) ||
              (this.prestamo.garante.identificacion == null || !this.prestamo.garante.identificacion.trim().length) ||
              (this.prestamo.garante.telefono == null || !this.prestamo.garante.telefono.trim().length)
            ) message += '* No ha ingresado datos completos del Garante<br>';

            if(this.prestamo.codigo_rubro == null || this.prestamo.codigo_rubro == undefined)
              message += '* No ha seleccionado un Código de Rubro<br>';

            if (message.length > 0) {
              this.toastr.warning(message, 'Advertencia de Validacion')
              return;
            }

            this.lcargando.ctlSpinner(true);
            try {
              (this as any).mensajeSpinner = 'Almacenando Prestamo';
              let response = await this.apiService.setPrestamo({prestamo: this.prestamo, cuotas: this.cuotas});
              console.log(response);
              this.lcargando.ctlSpinner(false);
              Swal.fire('Prestamo almacenado correctamente', '', 'success').then(() => {
                Object.assign(this.prestamo, {
                  id_prestamo: response['id_prestamo'],
                  num_doc: response['num_doc'],
                  saldo: response['saldo'],
                  estado: response['estado'],
                })
                this.vmButtons[0].habilitar = true
                this.vmButtons[5].habilitar = false
                this.vmButtons[6].habilitar = false
              });
            } catch (err) {
              console.log(err);
              this.lcargando.ctlSpinner(false);
              this.toastr.error(err.error.message, 'Error almacenando Prestamo');
            }
          } else {

              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
          }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });

  }

  async limpiarFormulario() {
    const result = await Swal.fire('Seguro/a desea limpiar el formulario?', '', 'question');

    if (result.isConfirmed) {
      Object.assign(this.prestamo, {
        id_prestamo: null,
        tipo: 'PAE',  // Prestamos A Empleados
        empleado: {
          id_empleado: null,
          emp_full_nombre: null,
        },
        fecha_inicio: moment().format('YYYY-MM-DD'),
        fecha_final: moment().endOf('year').format('YYYY-MM-DD'),
        monto: 0,
        saldo: 0,
        abono: 0,
        concepto: null,
        detalle: '',
        tipo_pago: null,
        garante: {
          nombre: '',
          identificacion: '',
          telefono: ''
        },
        num_doc: null,
        codigo_rubro: null
      })
      this.cuotas = []
      this.formReadOnly = false
      this.vmButtons[0].habilitar = true
      this.vmButtons[5].habilitar = true
      this.vmButtons[6].habilitar = true
    }
  }

  async consultarPrestamos() {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Cargando Prestamos'
      let response: any = await this.apiService.consultarPrestamos({params: { filter: this.filter, paginate: this.paginate }})
      console.log(response)
      Object.assign(this.paginate, { length: response.total })
      this.prestamos = response.data
      this.vmButtons[4].habilitar = false

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Prestamos')
    }
  }

  async anularPrestamo() {
    let result: SweetAlertResult = await Swal.fire('Seguro/a desea anular este prestamo?', '', 'question');

    let message: string = '';
    if (
      (this.prestamo.monto > 0 && this.prestamo.monto != this.prestamo.saldo)
    ) message += '* El prestamo no puede ser anulado porque una de sus cuotas se ha pagado<br>';

    if (message.length > 0) {
      this.toastr.warning(message, 'Advertencia de Validacion')
      return;
    }
    if (result.isConfirmed) {
      (this as any).mensajeSpinner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);

    let dat = {
      "anio": Number(moment(this.prestamo.fecha).format('YYYY')),
      "mes": Number(moment(this.prestamo.fecha).format('MM')),
      }

      this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(async (res) => {
          try {
            if (res["data"][0].estado !=='C') {
              this.lcargando.ctlSpinner(true);
              try {
                (this as any).mensajeSpinner = 'Anulando Prestamo';
                let response = await this.apiService.setAnularPrestamo({prestamo: this.prestamo, cuotas: this.cuotas});
                console.log(response["id_prestamo"]);
                this.prestamo.id_prestamo= response["id_prestamo"]
                if(this.prestamo.id_prestamo != null || this.prestamo.id_prestamo != undefined ){
                  // this.prestamo.estado= 'X'
                  this.consultarPrestamoById()
                }
                //   this.apiService.prestamoSelected$.emit(this.prestamo.id_prestamo)
                this.lcargando.ctlSpinner(false);
                Swal.fire('Prestamo anulado correctamente', '', 'success');
              } catch (err) {
                console.log(err);
                this.lcargando.ctlSpinner(false);
                this.toastr.error(err.error.message, 'Error anulando Prestamo');
              }

            } else {

                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
            }
          } catch (error) {
              console.error("Error occurred:", error);
          }
      });
    }

  }

  exportarPrestamos() {
    let excelData = [];
    this.prestamos.forEach((prestamo: any) => {
      let o = {
        Empleado: prestamo.empleado.emp_full_nombre,
        Documento: prestamo.num_doc,
        Monto: prestamo.monto_total,
        Cuotas: prestamo.cuotas,
        Estado: prestamo.estado,
        FechaInicio: prestamo.fecha_inicio,
        FechaFinal: prestamo.fecha_final,
      }
      excelData.push(o)
    })

    this.excelService.exportAsExcelFile(excelData, 'PrestamosEmpleados')
  }
  exportarPdf(){
    window.open(environment.ReportingUrl + "rpt_prestamo_empleado.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_prestamo="+this.prestamo.id_prestamo, '_blank')
  }

  changePaginate(event) {
    console.log(event)
  }

  handleTabChange(event: MatTabChangeEvent) {
    console.log(event)
    this.activeTab = event.index
    setTimeout(() => {
      this.vmButtons.forEach((element: Botonera) => {
        if(parseInt(element.paramAccion) == event.index){
          element.permiso = true; element.showimg = true;
        }else{
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);
  }





  expandEmpleados() {
    const modal = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        search : '',
        relation: "not",
        relation_selected : '',
      },

      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    modal.onClose.subscribe((empleadoData: any) => {
      if (empleadoData) {
        if (this.activeTab == 0) {
          this.apiService.empleadoSelected$.emit(empleadoData)
        } else {
          this.filter.empleado = empleadoData
        }
      }
    })
  }

  /* expandPrestamos() {
    const modal = this.dialogService.open(ModalBuscaPrestamoComponent, {
      data: {

      },
      header: "Prestamos",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    modal.onClose.subscribe((prestamoData: any) => this.apiService.prestamoSelected$.emit(prestamoData))
  } */

  expandPrestamos = () => {
    const modal = this.modalService.open(ModalConsultaPrestamosComponent, {size: 'xl', backdrop: 'static', scrollable: true});
  }

  limpiarEmpleado() {
    Object.assign(this.filter, { empleado: { emp_full_nombre: null }})
  }


 async consultarPrestamoById(){
    try {
      (this as any).mensajeSpinner = 'Cargando Prestamo';
      let response: any = await this.apiService.getPrestamo(this.prestamo.id_prestamo)
      Object.assign(response, {
        garante: {
          nombre: response.garante_nombre,
          identificacion: response.garante_identificacion,
          telefono: response.garante_telefono
        }
      })
      this.prestamo = response
      this.cuotas = response.detalles;
      this.formReadOnly = true;

      if(this.prestamo.estado == 'A' ){
        this.vmButtons[5].habilitar = false
        this.vmButtons[6].habilitar = false
      }else{
        this.vmButtons[5].habilitar = true
        this.vmButtons[6].habilitar = true
      }

      this.lcargando.ctlSpinner(false)
      //
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Prestamo')
    }

  }

}
