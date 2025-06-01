
import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { ExcelService } from 'src/app/services/excel.service';
//import { ComponentModalBusquedaComponent } from './component-modal-busqueda/component-modal-busqueda.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ModalJornadaComponent } from './modal-jornada/modal-jornada.component';
import { JornadaService } from './jornada.service';
import { IngresoAjusteComponent } from 'src/app/view/inventario/producto/kardex/ingreso-ajuste-component/ingreso-ajuste.component';
import { EventEmitter } from 'protractor';

@Component({
standalone: false,
  selector: 'app-jornada',
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.scss']
})
export class JornadaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private modalService: NgbModal,
    private modal: NgbModal,
    private commonVrs: CommonVarService,
    private apiSrv: JornadaService,
    private toastr: ToastrService,

  ) { 

    this.commonVrs.modalJornada.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.idJornada=res['id_jornada']
        this.id_estado_almuerza=res['id_estado_almueza']
        this.id_estado=res['estado_id']
        this.id_tiempo_almuerzo=res['id_tiempo_almuerzo']
        this.vmButtons[1].habilitar = false;
        this.vmButtons[0].habilitar = true;
        this.vmButtons[2].habilitar = false;

        this.fillTableBySearch(res)
      }
    )

  }
  @ViewChild(ButtonRadioActiveComponent, { static: false }) buttonRadioActiveComponent: ButtonRadioActiveComponent;
  permissions: any
  vmButtons: any[] = []; 
  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsTabla", boton: { icon: "fa fa-plus-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsTabla", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsTabla", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: true, imprimir: false},

    ];

    
    setTimeout(() => {
      this.getTiposEstados()
    }, 75)
    setTimeout(() => {
      this.getTiposAlmuerza()
    }, 75)
    setTimeout(() => {
    this.getTiempoAlmuerzo()
  }, 75)
  }
  fTitle: string = "Jornadas";
  id_tiempo_almuerzo: any = ' ';
  id_estado: any = ' ';
  id_estado_almuerza: any = ' ';
  tipos_almuerza: any[] = [];
  tiempo_almuerzo: any[] = [];
  estados: any[] = [];
  titles: any = [];
  dataExcel: any = [];
  monto_total: any = 0;
  monto_total1: any = 0;
  inicial: any = 0;
  interes: any = 0;
  no_cuotas: any = 0;
  calculoDisabled = false;
  botonDisabled= true;
  selectTipo: any = ' ';
  ingreso: any = '';
  jornadas: any = [];
  jornadasdias: any = [];
  lunes: any = [];
  martes: any = [];
  miercoles: any = [];
  jueves: any = [];
  viernes: any = [];
  sabado: any = [];
  domingo: any = [];
  lunesup: any = [];
  martesup: any = [];
  jnd_hora_ingreso: any = ' ';
  jnd_hora_salida: any = ' ';
  ingresolunes: any = '00:00';
  salidalunes: any = '00:00';
  totallunes: any = 0;
  ingresomartes: any = '00:00';
  salidamartes: any = '00:00';
  totalmartes: any = 0;
  ingresomiercoles: any = '00:00';
  salidamiercoles: any = '00:00';
  totalmiercoles: any = 0;
  ingresojueves: any = '00:00';
  salidajueves: any = '00:00';
  totaljueves: any = 0;
  ingresoviernes: any = '00:00';
  salidaviernes: any = '00:00';
  totalviernes: any = 0;
  ingresosabado: any = '00:00';
  salidasabado: any = '00:00';
  totalsabado: any = 0;
  ingresodomingo: any = '00:00';
  salidadomingo: any = '00:00';
  totaldomingo: any = 0;

  totalSemanal : any = 0
  id: any = ' ';
  dias: any = [
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO'


  ];
  numero_documento: any = ' ';
  fk_amortizacion_cab: any = ' ';
  fecha: any = 0;
  idJornada: any = 0;
  observacion: any = ' ';
  estado: any = ' ';
  jornada: any = ' ';
  almuerza: any = ' ';
  tiempo: any = ' ';
  mensajeSpiner: string = "Cargando...";
  mensajeSppiner2: string = "Cargando...";
  constDisabled = false;
  totalIntereses = 0;
  totalPagoMensual = 0;
  totalPagoTotal = 0;
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {

      case "GUARDAR":
        this.validarGuardar(); 
      break;
      case "MODIFICAR": 
        this.validarActualizar();
      break;
      case "LIMPIAR": 
        this.limpiarData();
      break;

    }
  }



  validarActualizar(){
    console.log(this.jornada)
    console.log(this.jnd_hora_ingreso);
    if (this.estado == null ) {
      this.toastr.info('Debe ingresar un estado');
      return;
    } else if (this.id_estado_almuerza == null) {
      this.toastr.info('Debe ingresar un opcion en Almuerza');
      return;
    } else if (this.id_tiempo_almuerzo == null) {
      this.toastr.info('Debe ingresar un Tiempo de Almuerzo');
      return;
    }
    else if (this.jornada == "") {
    this.toastr.info('Debe ingresar un nombre de Jornada');
    return;
  }
    else if (this.totalSemanal < 40){
      this.toastr.info('El total de horas semanales debe ser mayor a 40');
      return;
    }
    else if (this.totalSemanal > 60){
      this.toastr.info('El total de horas semanales debe ser menor a 60');
      return;
    }

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea actualizar los datos de Jornadas  " + "?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateJornada()
        this.vmButtons[0].habilitar = true;
      }
    });

    
    
    return;

  }
  

  calcularTotalHoras(evento) {
    console.log(evento)
    this.totalSemanal = 0
      if(evento =='lunes'){
        console.log(this.ingresolunes,this.salidalunes)
       
        this.totallunes= this.calcularTotalHorasTrabajadas(this.ingresolunes,this.salidalunes).toFixed(2)
      }
      if(evento =='martes'){
        this.totalmartes= this.calcularTotalHorasTrabajadas(this.ingresomartes,this.salidamartes).toFixed(2)
      }
      if(evento =='miercoles'){
        this.totalmiercoles= this.calcularTotalHorasTrabajadas(this.ingresomiercoles,this.salidamiercoles).toFixed(2)
      }
      if(evento =='jueves'){
        this.totaljueves= this.calcularTotalHorasTrabajadas(this.ingresojueves,this.salidajueves).toFixed(2)
      }
      if(evento =='viernes'){
        this.totalviernes= this.calcularTotalHorasTrabajadas(this.ingresoviernes,this.salidaviernes).toFixed(2)
      }
      if(evento =='sabado'){
        this.totalsabado= this.calcularTotalHorasTrabajadas(this.ingresosabado,this.salidasabado).toFixed(2)
      }
      if(evento =='domingo'){
        this.totaldomingo= this.calcularTotalHorasTrabajadas(this.ingresodomingo,this.salidadomingo).toFixed(2)
      }

      this.totalSemanal = parseFloat(this.totallunes) + parseFloat(this.totalmartes)+ parseFloat(this.totalmiercoles) + parseFloat(this.totaljueves) + parseFloat(this.totalviernes) + parseFloat(this.totalsabado) + parseFloat(this.totaldomingo) 

  }

   calcularTotalHorasTrabajadas(inicio: string, fin: string): number {

    const horaInicio = new Date(`2024-01-08T${inicio}`);
    const horaFin = new Date(`2024-01-08T${fin}`);
  
    // Calcular la diferencia en milisegundos
    const diferenciaMilisegundos = horaFin.getTime() - horaInicio.getTime();
  
    // Convertir la diferencia a horas
    const totalHoras = diferenciaMilisegundos / (1000 * 60 * 60);

    if(inicio == fin){
     return 0
    }
    return totalHoras -1 ;
    console.log(totalHoras)
    
  }

  // calculoTotalHorasSemanal(){
  //   let totalHorasSemana= 0
  //   this.jornadas.forEach(e => {
  //     totalHorasSemana += parseFloat(e.totallunes) + parseFloat(e.totalmartes)+ parseFloat(e.totalmiercoles) + parseFloat(e.totaljueves) + parseFloat(e.totalviernes) + parseFloat(e.totalsabado) + parseFloat(e.totaldomingo)
  //   });
  //    return totalHorasSemana;
  // }

 
  

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  validarGuardar(){
    if (this.estado == "") {
      this.toastr.info('Debe ingresar un estado');
      return;
    } else if (this.almuerza == ' ') {
      this.toastr.info('Debe ingresar un opcion en Almuerza');
      return;
    } else if (this.tiempo == ' ') {
      this.toastr.info('Debe ingresar un Tiempo de Almuerzo');
      return;
    }
    else if (this.jornada == ' ') {
    this.toastr.info('Debe ingresar un nombre de Jornada');
    return;
  }else if (this.totalSemanal < 40){
    this.toastr.info('El total de horas semanales debe ser mayor a 40');
    return;
  }
  else if (this.totalSemanal > 60){
    this.toastr.info('El total de horas semanales debe ser menor a 60');
    return;
  }
  else if (parseInt(this.ingresolunes) > parseInt(this.salidalunes) || (parseInt(this.ingresomartes) > parseInt(this.salidamartes)) ||
   (parseInt(this.ingresomiercoles) > parseInt(this.salidamiercoles)) || (parseInt(this.ingresojueves) > parseInt(this.salidajueves)) ||
   (parseInt(this.ingresoviernes) > parseInt(this.salidaviernes)) || (parseInt(this.ingresodomingo) > parseInt(this.salidadomingo)) ||
   (parseInt(this.ingresosabado) > parseInt(this.salidasabado))
   ) {
    //this.toastr.info('Hora de salida  es menor que la hora de entrada');
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: " Hora de salida  es menor que la hora de entrada, ¿Seguro que desea seguir ?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (!result.isConfirmed) {
        console.log('fernando')
      }
      else{
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea registrar los datos de Jornadas  " + "?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        }).then((result) => {
          if (result.isConfirmed) {
            this.guardarJornadas()
            this.vmButtons[0].habilitar = true;
          }
        });

      }
    });
    
    return;

  }else if (parseInt(this.ingresolunes) < parseInt(this.salidalunes) || (parseInt(this.ingresomartes) < parseInt(this.salidamartes)) ||
  (parseInt(this.ingresomiercoles) < parseInt(this.salidamiercoles)) || (parseInt(this.ingresojueves) < parseInt(this.salidajueves)) ||
  (parseInt(this.ingresoviernes) < parseInt(this.salidaviernes)) || (parseInt(this.ingresodomingo) < parseInt(this.salidadomingo)) ||
  (parseInt(this.ingresosabado) < parseInt(this.salidasabado))
  ) {
   //this.toastr.info('Hora de salida  es menor que la hora de entrada');

   Swal.fire({
    icon: "warning",
    title: "¡Atención!",
    text: "¿Seguro que desea registrar los datos de Jornadas  " + "?",
    showCloseButton: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Aceptar",
    cancelButtonColor: '#F86C6B',
    confirmButtonColor: '#4DBD74',
  }).then((result) => {
    if (result.isConfirmed) {
      this.guardarJornadas()
      this.vmButtons[0].habilitar = true;
    }
  });
   return;

 }  

 
    
    
  
  }
  selectedEstado(event){
    console.log(event)
    this.estado= event
    this.id_estado = event
  }

  selectedAlmuerza(event){
    console.log(event)
    this.almuerza= event
    this.id_estado_almuerza = event
  }

  selectedTiempo(event){
    this.tiempo= event
    this.id_tiempo_almuerzo = event
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  expandJornadas() {
    const modalInvoice = this.modalService.open(ModalJornadaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRPEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.validacion = 3;
  }

  limpiarData(){
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.tiempo = "";
    this.almuerza = "";
    this.estado="";
     this.jornada="";
    this.jornadas = [];
    this.ingresolunes= '00:00';
    this.salidalunes = '00:00';
    this.ingresomartes = '00:00';
    this.salidamartes = '00:00';
    this.ingresomiercoles = '00:00';
    this.salidamiercoles = '00:00';
    this.ingresojueves = '00:00';
    this.salidajueves = '00:00';
    this.ingresoviernes = '00:00';
    this.salidaviernes = '00:00';
    this.ingresosabado = '00:00';
    this.salidasabado = '00:00';
    this.ingresodomingo = '00:00';
    this.salidadomingo = '00:00';
    this.totallunes = 0;
    this.totalmartes = 0;
    this.totalmiercoles = 0;
    this.totaljueves = 0;
    this.totalviernes = 0;
    this.totalsabado = 0;
    this.totaldomingo = 0;  
    this.totalSemanal = 0;
  }

  fillTableBySearch(res) {
    console.log(res)
    this.mensajeSppiner2 = "Cargando lista de Jornadas...";
    this.lcargando.ctlSpinner(true);
    this.jornadas = [];
    let totalHorasSemana= 0
   
    console.log(res['jordana_detalles']);
          res['jordana_detalles'].forEach(e => {
            let tablaBusqueda = {
              dias: e.dia.cat_nombre,
              jnd_hora_ingreso:e.jnd_hora_ingreso,
              jnd_hora_salida: e.jnd_hora_salida,
              total_horas: e.total_horas,
            } 
            totalHorasSemana += parseFloat(e.total_horas)

        this.jornadas.push(tablaBusqueda);
        console.log(tablaBusqueda) 
          })
        this.totalSemanal= totalHorasSemana
        this.lcargando.ctlSpinner(false);

        this.estado=res['estado']['cat_nombre'];
        this.almuerza=res['estado_almuerza']['cat_nombre'];
        this.tiempo=res['tiempo_almuerzo']['cat_nombre'];
        this.jornada=res['jnd_tipo_jornada']
        /*this.constDisabled = true*/
  }

  guardarJornadas(){
    this.mensajeSpiner = 'Guardando Jornadas...';
      this.lcargando.ctlSpinner(true);
      
      this.lunes.push(12)
      this.lunes.push(this.ingresolunes)
      this.lunes.push(this.salidalunes)
      this.lunes.push(this.totallunes)
      this.martes.push(13)
      this.martes.push(this.ingresomartes)
      this.martes.push(this.salidamartes)
      this.martes.push(this.totalmartes)
      this.miercoles.push(14)
      this.miercoles.push(this.ingresomiercoles)
      this.miercoles.push(this.salidamiercoles)
      this.miercoles.push(this.totalmiercoles)

      this.jueves.push(15)
      this.jueves.push(this.ingresojueves)
      this.jueves.push(this.salidajueves)
      this.jueves.push(this.totaljueves)
      this.viernes.push(16)
      this.viernes.push(this.ingresoviernes)
      this.viernes.push(this.salidaviernes)
      this.viernes.push(this.totalviernes)

      this.sabado.push(17)
      this.sabado.push(this.ingresosabado)
      this.sabado.push(this.salidasabado)
      this.sabado.push(this.totalsabado)

      this.domingo.push(18)
      this.domingo.push(this.ingresodomingo)
      this.domingo.push(this.salidadomingo)
      this.domingo.push(this.totaldomingo)


      let data = {
        lunes: this.lunes,
        martes: this.martes,
        miercoles: this.miercoles,
        jueves: this.jueves,
        viernes: this.viernes,
        sabado: this.sabado,
        domingo: this.domingo,
        nombre: this.jornada,
        estado:this.estado,
        tiempo: this.tiempo,
        almuerza: this.almuerza,
        total_horas: this.totalSemanal
      };
      console.log(data);
      this.apiSrv.guardarJornadas(data).subscribe(
        res => {
          console.log(res);
  
          Swal.fire({
            icon: "success",
            title: "Exito",
            text: 'Se guardó exitosamente la Jornada',
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          });
          //this.vmButtons[0].habilitar = true;
          //this.vmButtons[3].habilitar = false;
          this.vmButtons[2].habilitar = false;
          this.lcargando.ctlSpinner(false);
          //this.numero_documento= res['documento'];
  
        },
        err => {
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error al guardar la Jornada')
        }
      )
  
      //this.vmButtons[4].habilitar = false;
      //this.constDisabled = true;
      //this.calculoDisabled = true;
      //this.calcAmortizaciones();
      //this.limpiarData()
      
  }
  updateTotalHoras(d){
    console.log(d.jnd_hora_ingreso,d.jnd_hora_salida)
    d['total_horas'] = this.calcularTotalHorasTrabajadas(d.jnd_hora_ingreso,d.jnd_hora_salida).toFixed(2)
    this.totalSemanal = 0
    this.jornadas.forEach(e => {
      this.totalSemanal += parseFloat(e.total_horas)
    });

  }


  updateJornada(){
    /*if (this.jnd_hora_ingreso < parseInt(this.jnd_hora_salida)  ) {
      this.toastr.info('Hora de salida menor ');
      return;
    }*/
  console.log(this.jornadas)
    let datos = {
      jornadas: this.jornadas,
      nombre: this.jornada,
      id:this.idJornada,
      estado:this.id_estado,
      tiempo: this.id_tiempo_almuerzo,
      almuerza: this.id_estado_almuerza,
      total_horas: this.totalSemanal
    };
    console.log(datos);
    this.mensajeSpiner ='Actualizando...';
    this.lcargando.ctlSpinner(true);
      this.apiSrv.updateJornada(datos).subscribe(
        res => {
            console.log(res);
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "success",
              title: "Exito",
              text: 'Se actualizó exitosamente la Jornada',
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
            //this.vmButtons[0].habilitar = true;
            this.vmButtons[2].habilitar = false;
            this.lcargando.ctlSpinner(false);
            //this.numero_documento= res['documento'];
    
          },
          err => {
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error al actualizar la Jornada')
          }
          
        
      )
      this.limpiarData();
      //this.vmButtons[3].habilitar = false;
      //this.vmButtons[0].habilitar = true;
  }

  getTiposEstados() {
    this.mensajeSpiner = 'Cargando Tipos de Estados';
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getTiposEstado().subscribe(
      (res: any) => {
         console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            id_catalogo: element.id_catalogo,
            cat_nombre: element.cat_nombre,
            cat_keyword: element.cat_keyword
          };
          this.estados.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

getTiposAlmuerza(){
  this.mensajeSpiner = 'Cargando opciones de Almuerzo';
  this.lcargando.ctlSpinner(true);
  this.apiSrv.getAlmuerza().subscribe(
    (res: any) => {
       console.log(res.data);
      res.data.forEach((element: any) => {
        let o = {
          id_catalogo: element.id_catalogo,
          cat_nombre: element.cat_nombre,
          cat_keyword: element.cat_keyword
        };
        this.tipos_almuerza.push({ ...o });
      });
      this.lcargando.ctlSpinner(false);
    },
    (err: any) => {
      console.log(err);
      this.lcargando.ctlSpinner(false);
    }
  )
}
getTiempoAlmuerzo(){
  this.mensajeSpiner = 'Cargando Tiempos de Almuerzo';
  this.lcargando.ctlSpinner(true);
  this.apiSrv.getTiposTiempoAlmuerzo().subscribe(
    (res: any) => {
       console.log(res.data);
      res.data.forEach((element: any) => {
        let o = {
          id_catalogo: element.id_catalogo,
          cat_nombre: element.cat_nombre,
          cat_keyword: element.cat_keyword
        };
        this.tiempo_almuerzo.push({ ...o });
      });
      this.lcargando.ctlSpinner(false);
    },
    (err: any) => {
      console.log(err);
      this.lcargando.ctlSpinner(false);
    }
  )
}

}
