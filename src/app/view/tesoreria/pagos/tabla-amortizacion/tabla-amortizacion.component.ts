import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/services/excel.service';
import { ComponentModalBusquedaComponent } from './component-modal-busqueda/component-modal-busqueda.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { AmortizacionService } from './tabla-amortizacion.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Botonera from 'src/app/models/IBotonera';
import { SweetAlertResult } from 'sweetalert2';
@Component({
  selector: 'app-tabla-amortizacion',
  templateUrl: './tabla-amortizacion.component.html',
  styleUrls: ['./tabla-amortizacion.component.scss']
})
export class TablaAmortizacionComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: Botonera[] = []; 
  
  
  titles: any = [];
  dataExcel: any = [];
  monto_total: number = 0;
  monto_total1: number = 0;
  inicial: any = 0;
  interes: any = 0;
  no_cuotas: any = 0;
  calculoDisabled = false;
  botonDisabled= true;
  selectTipo: any = ' ';
  amortizaciones: any = [];
  numero_documento: any = ' ';
  fk_amortizacion_cab: any = ' ';
  fecha: any = 0;
  id: any = 0;
  observacion: any = ' ';
  estado: string = '';
  mensajeSpiner: string = "Cargando...";
  mensajeSppiner2: string = "Cargando...";
  constDisabled = false;
  totalIntereses = 0;
  totalPagoMensual = 0;
  totalPagoTotal = 0;

  cmb_tipo_amortizacion = [
    { value: 'A', label: 'Amortización Alemana' },
    { value: 'F', label: 'Amortización Francesa' },
  ]

  onDestroy$ = new Subject();

  constructor(
    private excelSrv: ExcelService,
    private modal: NgbModal,
    private commonVrs: CommonVarService,
    private apiSrv: AmortizacionService,
    private toastr: ToastrService,

  ) { 
    this.commonVrs.modalConstFisica.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res: any) => {
        console.log(res)

        // this.codigo = res['codigo']
        //this.fecha = res['fecha_adquisicion'],
        /*this.observacion = res['observacion']
        this.estado = res['estado']
        this.periodo = res['tipo_bien']
        this.numero_documento = res['numero_documento']*/
        /*this.fecha = res['fecha'],
        this.observacion = res['observacion']
        this.estado = res['estado']
        this.periodo = res['tipo_bien']
        this.numero_documento = res['numero_documento']
       
        this.constDisabled = true*/

        this.selectTipo = res.tipo
        this.fecha = res.fecha
        this.estado = (res.estado == 'P') ? 'PENDIENTE' : (res.estado == 'C') ? 'CERRADO' : (res.estado == 'A') ? 'APROBADO' : ''
            
        if(res['estado'] == 'P'){
          this.vmButtons[0].habilitar = true
          this.vmButtons[2].habilitar = false;
          this.vmButtons[3].habilitar = false;
          this.vmButtons[6].habilitar = false;
          this.botonDisabled = false;
          this.constDisabled = false;
          this.calculoDisabled = false;
        } else if (res.estado == 'A') {
          this.vmButtons[0].habilitar = true
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = true;
          this.vmButtons[6].habilitar = false;
          this.botonDisabled = false;
          this.constDisabled = true;
          this.calculoDisabled = true;
        }
        else{
          this.vmButtons[0].habilitar = true
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = true;
          this.vmButtons[6].habilitar = true;
          this.botonDisabled = true;
          this.constDisabled = true;
          this.calculoDisabled = true;
        }

        this.fillTableBySearch(res)
      }
    )


    /*this.commonVrs.modalActualizarAmortizacion.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.fillTableBySearch(res)
        this.constDisabled = false
        this.calculoDisabled = false
      }
    )*/

    
  }
  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }
  
  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsTabla", paramAccion: '',  boton: { icon: "fa fa-plus-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsTabla", paramAccion: '', boton: { icon: "fa fa-floppy-o", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsTabla", paramAccion: '', boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsTabla", paramAccion: '', boton: { icon: "far fa-file-signature", texto: "APROBAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsTabla", paramAccion: '', boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsTabla", paramAccion: '', boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsTabla", paramAccion: '', boton: { icon: "fa fa-check", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false},

    ];
     this.fecha = moment().format('YYYY-MM-DD');
  }
  
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {

      case "GUARDAR":
        this.validarGuardar(); 
        break;
      case "BUSCAR": 
        this.modalConsultar();
        break;
      case "MODIFICAR": 
        this.actualizarData();
        break;
      case "IMPRIMIR": 
        this.getDataExportar();
        break;
      case "LIMPIAR": 
        this.limpiarData();
        break;
      case "CERRAR": 
        this.cerrarAmortizacion();
        break;
      case "APROBAR":
        this.aprobarAmortizacion()
        break;
    }
  }

calcularCronograma() {
  console.log(this.fecha);
  console.log(this.selectTipo);
  console.log(this.monto_total);
  console.log(this.no_cuotas);
  console.log(this.interes);
  if (
    this.fecha == 0 || this.fecha == null  ||  this.fecha == ''
  ) {
    this.toastr.info('Debe ingresar una Fecha');
    return;
  }
  else if (
    this.selectTipo == 0 || this.selectTipo == null  ||  this.selectTipo == ''
  ) {
    this.toastr.info('Debe elegir un Tipo de Amortización');
    return;
  } else if (
    this.monto_total == 0 || this.monto_total == undefined ||  this.monto_total == null
  ) {
    this.toastr.info('Debe ingresar un monto');
    return;
  }else if (
    this.no_cuotas == 0 || this.no_cuotas == null ||  this.no_cuotas.trim() == ''
  ) {
    this.toastr.info('Debe ingresar un número de cuotas');
    return;
  } else if (
    this.interes == 0 ||  this.interes == null ||  this.interes.trim() == ''
  ) {
    this.toastr.info('Debe ingresar un interes');
    return;
  }

  this.totalIntereses=0;
  this.totalPagoMensual=0;
  this.totalPagoTotal=0;
  this.amortizaciones = [];
  this.inicial=this.monto_total;
  if (this.selectTipo=="F" || this.selectTipo=="Amortizacion Francesa"){

    let fechas = [];
    let plazo_maximo= [];
    let fechaActual = this.fecha; //Date.now();
    console.log(fechaActual);
    let mes_actual = moment(fechaActual);
    mes_actual.add(1, 'month');    
    console.log(mes_actual);

    let pagoInteres=0, pagoCapital = 0, cuota = 0, saldo_inicial=0;

    cuota = this.monto_total * (Math.pow(1+this.interes/100, this.no_cuotas)*this.interes/100)/(Math.pow(1+this.interes/100, this.no_cuotas)-1);

    for(let i = 1; i <= this.no_cuotas; i++) {
        saldo_inicial=this.monto_total;
        pagoInteres = this.monto_total*(this.interes/100);
        pagoCapital = cuota - pagoInteres;
        this.monto_total = this.monto_total - pagoCapital;

        fechas[i] = mes_actual.format('YYYY-MM-DD');
        console.log(fechas[i]);
        mes_actual.add(1, 'month');

        let amort = {
          num: i,
          fecha: fechas[i],
          saldo_inicial: saldo_inicial,
          interes: pagoInteres,
          capital: pagoCapital,
          monto: this.monto_total,
          cuota: cuota,
          plazo_maximo:plazo_maximo[i] 
        }
        console.log(amort);
        this.amortizaciones.push(amort);
        this.totalIntereses= this.totalIntereses +pagoInteres;
        this.totalPagoMensual = this.totalPagoMensual+ pagoCapital;
        this.totalPagoTotal = this.totalPagoTotal + cuota;
    }
    
  }
  else if (this.selectTipo=="A" || this.selectTipo=="Amortizacion Alemana"){
    let fechas1 = [];
    let fechaActual1 = this.fecha; 
    let mes_actual1 = moment(fechaActual1);
    mes_actual1.add(1, 'month'); 
    let saldo_inicial=0;
    let mesActual = dayjs().add(1, 'month');
    console.log(mesActual);
    let pagoCapital, pagoInteres, cuota;
    pagoCapital = this.monto_total / this.no_cuotas;
    for (let i = 1; i <= this.no_cuotas; i++) {
        fechas1[i] = mes_actual1.format('YYYY-MM-DD');
        console.log(fechas1[i]);
        mes_actual1.add(1, 'month');


        saldo_inicial=this.monto_total;
        pagoInteres = this.monto_total * (this.interes / 100);
        cuota = pagoCapital + pagoInteres;
        this.monto_total = this.monto_total - pagoCapital;
        let fecha = this.fecha;
        fecha = mesActual.format('YYYY-MM-DD');
        console.log(fecha);
        mesActual = mesActual.add(1, 'month');
        let amortaleman = {
          num: i,
          fecha: fechas1[i],
          saldo_inicial: saldo_inicial,
          interes: pagoInteres,
          capital: pagoCapital,
          monto: this.monto_total,
          cuota: cuota,
        } 
    
        this.amortizaciones.push(amortaleman);
        this.totalIntereses= this.totalIntereses +pagoInteres;
        this.totalPagoMensual = this.totalPagoMensual+ pagoCapital;
        this.totalPagoTotal = this.totalPagoTotal + cuota;
  }
  

    }
    //estado:"C",
    //numero_documento: this.numero_documento,
    console.log(this.fecha);
    console.log(this.observacion);
    console.log(this.monto_total);
    console.log(this.interes);
    console.log(this.no_cuotas);
    console.log(this.selectTipo);
    console.log(this.amortizaciones);
    console.log(this.id);
    this.monto_total=this.inicial;
    this.vmButtons[3].habilitar = false;
    this.vmButtons[0].habilitar = false;

}

calculateAmortization() {
  const interestRate = this.interes
  const principal = this.monto_total
  const numberOfMonths = this.no_cuotas
  let pagoMensual: number
  const amortizationMethod: string = (this.selectTipo == 'A') ? 'German' : 'French'
  const amortizationSchedule: any[] = []

  const monthlyInterestRate = interestRate / 12;
  const monthlyPayment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths));

  pagoMensual = monthlyPayment;

  let balance = principal;

  for (let month = 1; month <= numberOfMonths; month++) {
    let interestPayment = balance * monthlyInterestRate;
    let principalPayment = monthlyPayment - interestPayment;
    
    if (amortizationMethod === 'German') {
      balance -= principalPayment;
    }


    amortizationSchedule.push({
      month,
      principalPayment,
      interestPayment,
      pagoMensual,
      balance
    });
  }

  console.table(amortizationSchedule)
}

async aprobarAmortizacion() {
  const result = await Swal.fire({
    titleText: 'Aprobacion de Documento',
    text: 'Esta seguro/a desea aprobar este documento?',
    icon: 'question',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Aprobar'
  })

  if (result.isConfirmed) {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpiner = 'Aprobando Amortizacion'
      let response = await this.apiSrv.aprobarAmortizacion({amortizacion: this.numero_documento})
      console.log(response)
  
      this.estado = 'APROBADO'
      this.vmButtons[2].habilitar = true
      this.botonDisabled = false;
      this.constDisabled = true;
      this.calculoDisabled = true;
  
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error aprobando Amortizacion')
    }
  }
}



getDataExportar() {
  console.log(this.amortizaciones);
  let reporte = []
  let mes = 'MES'
  let estado = 'ESTADO';
  let saldo_inicial = 'SALDO INICIAL';
  let pago_mensual = 'PAGO MENSUAL';
  let interes = 'INTERES';
  let pago_total = 'PAGO TOTAL';
  let saldo_final = 'SALDO FINAL';
  let plazo_maximo = 'PLAZO MAXIMO';

  let copy = JSON.parse(JSON.stringify(this.amortizaciones));

  copy.forEach(e => {
    const data = {
      'MES': e.num,
      'ESTADO': "Pendiente",
      'SALDO INICIAL': e.saldo_inicial,
      'PAGO MENSUAL': e.capital,
      'INTERES': e.interes,
      'PAGO TOTAL': e.cuota,
      'SALDO FINAL':  e.monto,
      'PLAZO MAXIMO': e.fecha

    }
    reporte.push(data)



  })

  this.titles = [mes,estado,saldo_inicial,pago_mensual,interes,pago_total,saldo_final,plazo_maximo];
  console.log(copy);

  this.excelSrv.exportAsExcelFile(reporte, 'Amortizacion', { header: this.titles })
}


changeDetail(data) {

    Swal.fire({
      icon: 'question',
      title: "Pago de Cuota",
      text: "¿Seguro que desea marcar la cuota como pagada?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.lcargando.ctlSpinner(true)
        this.mensajeSpiner = 'Marcando como Pagado'
        this.apiSrv.getIdCabecera({numero_documento: this.numero_documento}).subscribe(
          (res: any) => {
            console.log(res['data'][0]['id']);
            this.apiSrv.modificarEstado({ fk_amortizacion_cab :res['data'][0]['id'], num:data['num']}).subscribe(
              () => {
                this.amortizaciones.find((element: any) => element.num == data['num']).estado = 'Pagado'
                this.lcargando.ctlSpinner(false);
              }
            )
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message)
          }
        )
      }
    });
}

modalConsultar() {

  const modal = this.modal.open(ComponentModalBusquedaComponent, {
    size: "xl",
    backdrop: "static",
    windowClass: "viewer-content-general",
  })
}



fillTableBySearch(data) {
  this.totalIntereses=0;
  this.totalPagoMensual=0;
  this.totalPagoTotal=0;
  this.mensajeSppiner2 = "Cargando lista de Amortizaciones...";
  this.lcargando.ctlSpinner(true);
  this.amortizaciones = [];
    console.log(data.id);
    this.apiSrv.listarCuotas({ id: data.id }).subscribe(
      res => {
        console.log(res['data']);
        res['data'].forEach(e => {
          let tablaBusqueda = {
            num: e.mes,
            estado:e.estado,
            fecha: e.plazo_maximo,
            saldo_inicial:e.saldo_inicial,
            interes:e.interes,
            capital: e.pago_mensual,
            monto: e.saldo_final,
            cuota: e.pago_total,
          } 
      this.amortizaciones.push(tablaBusqueda);
      this.totalIntereses= this.totalIntereses +parseFloat(e.interes);
      this.totalPagoMensual = this.totalPagoMensual+ parseFloat(e.pago_mensual);
      this.totalPagoTotal = this.totalPagoTotal + parseFloat(e.pago_total);
        })
        this.lcargando.ctlSpinner(false);
      })
      console.log(this.totalIntereses);
  //this.constDisabled = true
  //this.calculoDisabled = true
  this.monto_total=data.monto;
  this.interes=data.interes;
  this.no_cuotas=data.no_cuotas;
  this.numero_documento = data.documento;
  this.fecha = data.fecha;
  this.observacion = data.observacion;
  /* if(data.tipo == "A"){
    this.selectTipo = "Amortizacion Alemana"
  }
  else if(data.tipo == "F"){
    this.selectTipo = "Amortizacion Francesa"
  } */
  /* console.log(this.estado);
  if(data.estado == "P"){
    this.estado = "Pendiente"
  }
  else if(data.estado == "C"){
    this.estado = "Cerrado"
  } */
  
  // this.vmButtons[0].habilitar = true;
  // this.vmButtons[2].habilitar = false;
  // this.vmButtons[3].habilitar = false;
  // this.vmButtons[4].habilitar = false;

}




limpiarData(){
  this.vmButtons[0].habilitar = true;
  this.vmButtons[1].habilitar = false;
  this.vmButtons[2].habilitar = true;
  this.vmButtons[3].habilitar = true;
  // this.vmButtons[4].habilitar = true;
  this.calculoDisabled = false
  this.constDisabled = false
  this.monto_total=0;
  this.interes=0;
  this.no_cuotas=0;
  this.numero_documento = null;
  this.estado = "";
  this.fecha = moment().format('YYYY-MM-DD');
  this.observacion ="";
  this.selectTipo=null;
  this.amortizaciones = [];
}

//modificar(data){
  //console.log(data);

  //console.log(this.selectTipo);
  //console.log(this.interes);
  //console.log(this.monto_total);
  //console.log(this.no_cuotas);
  //this.actualizarData();

//}



actualizarData(){
    let datos = {
      // amortizaciones: this.amortizaciones,
      //estado:"PENDIENTE",
      numero_documento: this.numero_documento,
      fecha: this.fecha,
      observacion: this.observacion,
      monto:this.monto_total,
      interes:this.interes,
      no_cuotas:this.no_cuotas,
      tipo: this.selectTipo,
      //id: this.id
    };
    this.mensajeSpiner = 'Actualizando...';
     this.lcargando.ctlSpinner(true);
    //console.log(this.id);
    //console.log(datos);

    /* if(this.selectTipo == "Amortizacion Alemana"){
      this.selectTipo = "A"
    }
    else if(this.selectTipo == "Amortizacion Francesa"){
      this.selectTipo = "F"
    } */


    this.apiSrv.actualizarAmortizacion(datos).subscribe(
      res => {
        console.log(res);
        this.apiSrv.getIdCabecera({numero_documento: this.numero_documento}).subscribe(
          res => {
            const id_cabecera = res['data'][0]['id']
            console.log(res['data'][0]['id']);
            this.mensajeSpiner = 'Eliminando detalles anteriores'
              this.apiSrv.eliminarDetalleAmortizacion({id: res['data'][0]['id']}).subscribe(
                 res => {
                  let data = {
                    amortizaciones: this.amortizaciones,
                    estado:"P",
                    numero_documento: this.numero_documento,
                    fecha: this.fecha,
                    observacion: this.observacion,
                    monto:this.monto_total,
                    interes:this.interes,
                    no_cuotas:this.no_cuotas,
                    tipo: this.selectTipo,
                    id_cabecera
                  };
                  console.log(res);
                  console.log(data);
                  this.mensajeSpiner = 'Almacenando detalles actualizados'
                  this.apiSrv.generarDetalleAmortizacion(data).subscribe(
                    res => {
                      console.log(res);

                      this.lcargando.ctlSpinner(false);
              
                    },
              
                  )
    
                },
    
              )
        })
    })

}


validarGuardar(){
  let message = ''

  if (this.fecha == "" || this.fecha == null || this.fecha == undefined) message += '* Debe ingresar una fecha.<br>'
  if (this.monto_total == 0) message += '* El Monto Total no puede ser 0.<br>'
  if (this.no_cuotas == 0) message += '* El Numero de Cuotas no puede ser 0.<br>'
  if (this.no_cuotas.trim() == '') message += '* El Numero de Cuotas no puede ser vacio.<br>'
  if (this.interes == 0) message += '* El Interes no puede ser 0.<br>'
  if (this.interes.trim() == '') message += '* El Interes no puede ser vacio.<br>'
  if (this.observacion.trim() == '' || this.observacion == null) message += '* Debe ingresar una observacion.<br>'
  if (this.amortizaciones.length <= 0) message += '* No existen registros para Guardar.<br>'

  if (message.length) {
    this.toastr.warning(message, 'Validacion de Datos', {enableHtml: true})
    return;
  }

  /* if (
    this.fecha == "" || this.fecha == null || this.fecha == undefined
  ) {
    this.toastr.info('Debe ingresar una fecha ');
    return;
  }else if (
    this.observacion == ' '
  ) {
    this.toastr.info('Debe ingresar una observacion ');
    return;
  } else if (
    this.amortizaciones.length <= 0
  ) {
    this.toastr.info('No existen registros para Guardar');
    return;
  } */
  Swal.fire({
    icon: "warning",
    title: "¡Atención!",
    text: "¿Seguro que desea registrar los datos de Amortización?",
    showCloseButton: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Aceptar",
    cancelButtonColor: '#F86C6B',
    confirmButtonColor: '#4DBD74',
  }).then((result) => {
    if (result.isConfirmed) {
      this.guardarAmortizacion()
    }
  });

}

validarActualizar(){
  let message = ''

  if (this.fecha == "" || this.fecha == null || this.fecha == undefined) message += '* Debe ingresar una fecha.<br>'
  if (this.observacion.trim() == '' || this.observacion == null) message += '* Debe ingresar una observacion.<br>'
  if (this.amortizaciones.length <= 0) message += '* No existen registros para Guardar.<br>'

  if (message.length) {
    this.toastr.warning(message, 'Validacion de Datos', {enableHtml: true})
    return;
  }

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea Actualizar  " + "?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarData()
      }
    });
  
  }

async cerrarAmortizacion(){
  // Revisar que todos las cuotas esten pagadas
  let cuotas_impagas = this.amortizaciones.reduce((acc: boolean, curr: any) => acc || curr.estado == 'Pendiente', false)
  let message = (cuotas_impagas) ? '¿Seguro que desea Cerrar este Documento? Existen aun cuotas pendientes.' : '¿Seguro que desea Cerrar este Documento?'


  let result = await Swal.fire({
    icon: "warning",
    title: "¡Atención!",
    text: message,
    showCloseButton: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Aceptar",
    cancelButtonColor: '#F86C6B',
    confirmButtonColor: '#4DBD74',
  })

  if (result.isConfirmed) {
    this.mensajeSpiner = 'Actualizando Estado...';
    this.lcargando.ctlSpinner(true);
    
    this.apiSrv.actualizarEstadoCerrado({numero_documento: this.numero_documento}).subscribe(
      res => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
        //
        this.estado = 'Aprobado'
        this.vmButtons[0].habilitar = true
        this.vmButtons[2].habilitar = true;
        this.vmButtons[5].habilitar = true;
        this.botonDisabled = true;
        this.constDisabled = true;
        this.calculoDisabled = true;
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cerrando Documento')
      }
    )
  }
}


guardarAmortizacion(){
  this.mensajeSpiner = 'Guardando Amortización...';
    this.lcargando.ctlSpinner(true);
    console.log(this.amortizaciones);
    let data = {
      amortizaciones: this.amortizaciones,
      estado:"P",
      numero_documento: this.numero_documento,
      fecha: this.fecha,
      observacion: this.observacion,
      monto:this.monto_total,
      interes:this.interes,
      no_cuotas:this.no_cuotas,
      tipo: this.selectTipo
    };
    console.log(data);
    this.apiSrv.guardarAmortizacion(data).subscribe(
      res => {
        console.log(res);

        Swal.fire({
          icon: "success",
          title: "Exito",
          // Asignacion de ingresos para periodo "+this.periodo+" guardada satisfactoriamente
          text: 'Se guardó exitosamente los cálculos de la Amortización',
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.vmButtons[0].habilitar = true;
        this.vmButtons[3].habilitar = false;
        this.lcargando.ctlSpinner(false);
        this.numero_documento= res['documento'];
        if(res['estado']= 'P'){
          this.estado='PENDIENTE';
        }
        else if(res['estado']= 'C'){
          this.estado='CERRADO';
        }

      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al guardar la Amortización')
      }
    )

    // this.vmButtons[4].habilitar = false;
    this.constDisabled = true;
    this.calculoDisabled = true;
    //this.calcAmortizaciones();
    //this.limpiarData()
    
}


}
