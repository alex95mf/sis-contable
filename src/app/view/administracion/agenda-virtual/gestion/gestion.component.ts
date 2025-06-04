import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings } from 'src/app/app.settings'; 
import { Settings } from 'src/app/app.settings.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { GestionService } from './gestion.service';
import { GestionFormComponent } from './gestion-form/gestion-form.component';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
standalone: false,
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Gestión de agenda virtual";
  mensajeSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;
  tipoEventosList: any = [];
  locale: string = "es";
  eventCopi: any = []

  view: string = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  actions: CalendarEventAction[] = [{
      label: '<i class="material-icons icon-sm white">edit</i>',
      onClick: ({event}: {event: CalendarEvent}): void => {
        this.expandGestionForm(false, event);
      }
  }, {
      label: '<i class="material-icons icon-sm white">close</i>',
      onClick: ({event}: {event: CalendarEvent}): void => {
          // this.events = this.events.filter(iEvent => iEvent !== event);
          // this.snackBar.open('Event deleted successfully!', null, {
          //     duration: 1500
          // });
          this.deleteEvent(event);
      }
      
  }];
  events: CalendarEvent[] = [
  //   {
  //   start: subDays(startOfDay(new Date()), 1),
  //   end: addDays(new Date(), 1),
  //   title: 'A 3 day event',
  //   color: colors.red,
  //   actions: this.actions
  // }, {
  //   start: startOfDay(new Date()),
  //   title: 'An event with no end date',
  //   color: colors.yellow,
  //   actions: this.actions
  // }, {
  //   start: subDays(endOfMonth(new Date()), 3),
  //   end: addDays(endOfMonth(new Date()), 3),
  //   title: 'A long event that spans 2 months',
  //   color: colors.blue
  // }, {
  //   start: addHours(startOfDay(new Date()), 2),
  //   end: new Date(),
  //   title: 'A draggable and resizable event',
  //   color: colors.yellow,
  //   actions: this.actions,
  //   resizable: {
  //     beforeStart: true,
  //     afterEnd: true
  //   },
  //   draggable: true
  // }
  ];
  refresh: Subject<any> = new Subject();
  public settings: Settings;

  constructor(
    private apiSrv: GestionService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
    private dialog: MatDialog,
    private appSettings: AppSettings,
    private snackBar: MatSnackBar
  ) {
    this.settings = this.appSettings.settings; 

    this.commonVarSrv.needRefresh.asObservable().subscribe(
      (res)=>{
          this.eventCopi = this.events
          if (res.isNew){
            console.log(res);
            let event = res.data.data.original.data;
            let evento = {
              id: event.id_cal_eventos,
              title: event.titulo + " de " + event.fecha_inicio_e.split(" ")[1] + " a " + event.fecha_fin_e.split(" ")[1],
              start: new Date(event.fecha_inicio),
              end: new Date(event.fecha_fin),
              color: event.tipo_evento=='E1'?colors.red:(event.tipo_evento=='E2'?colors.yellow:colors.blue),
              actions: this.actions,
              id_origin: event.id_cal_eventos
            }
            this.eventCopi.push(evento)
            // this.events.push(evento);
            this.eventCopi.sort(function (a, b) {
              if (a.start > b.start) {
                return 1;
              }
              if (a.start < b.start) {
                return -1;
              }
              // a must be equal to b
              return 0;
            });
            // console.log('ordenamiento',this.eventCopi);
            // let contador = 0
            // this.eventCopi.map((er)=>{
            //   er['id'] = contador;
            //   contador +=1;
            // })
            // console.log('reemplazo',this.eventCopi);
            this.refresh.next(null);
          } else{
            console.log(res);
            let event = res.data.data.original.data;

            this.events.forEach((e: any) => {
              if(e.id_origin===event.id_cal_eventos){
                Object.assign(e, {
                  id: event.id_cal_eventos,
                  title: event.titulo + " de " + event.fecha_inicio_e.split(" ")[1] + " a " + event.fecha_fin_e.split(" ")[1],
                  start: new Date(event.fecha_inicio),
                  end: new Date(event.fecha_fin),
                  color: event.tipo_evento=='E1'?colors.red:(event.tipo_evento=='E2'?colors.yellow:colors.blue),
                  actions: this.actions,
                  id_origin: event.id_cal_eventos
                })
              }
            })

            this.eventCopi.sort(function (a, b) {
              if (a.start > b.start) {
                return 1;
              }
              if (a.start < b.start) {
                return -1;
              }
              // a must be equal to b
              return 0;
            });
            this.refresh.next(null);
          }
      }
    );
   }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsAgenda",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
     /* {
        orig: "btnsAgenda",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }*/
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    // console.log(this.events);

    setTimeout(()=> {
      this.validaPermisos();
    }, 0);

  }

  
  validaPermisos() {
    this.mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTTickets,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        //console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          // this.lcargando.ctlSpinner(false);
          this.getCatalogos();
          // this.getEvents();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getCatalogos() {
    this.mensajeSpinner = "Cargando catalogos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'CAL_EVENTO'"
    }

    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log(res);
        this.tipoEventosList = [];
        res['data']['CAL_EVENTO'].forEach(e => {
          this.tipoEventosList.push(e);
        });


        console.log(this.events);
        this.getLREvents();
        // this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  getEvents() {
    this.mensajeSpinner = "Cargando eventos del calendario...";
    this.lcargando.ctlSpinner(true);

    this.apiSrv.getCalEvents().subscribe(
      (res) => {
        console.log(res);
        this.events = [];
        res['data'].forEach(e => {
          let evento = {
            id: e.id_cal_eventos,
            title: e.titulo,
            start: new Date(e.fecha_inicio),
            end: new Date(e.fecha_fin),
            color: e.tipo_evento=='E1'?colors.red:(e.tipo_evento=='E2'?colors.yellow:colors.blue),
            actions: this.actions
          }
          this.events.push(evento);
        });
        console.log(this.events);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  getLREvents() {
    let hoy = this.viewDate;
    let mes = hoy.getMonth();
    let anio = hoy.getFullYear();
    let prev_mes = undefined;
    let prev_anio = undefined;
    let next_mes = undefined;
    let next_anio = undefined;
    let prev_fecha = new Date();
    let next_fecha = new Date();

    if(mes==0){ // caso enero
      prev_mes=11;
      prev_anio = +anio - 1;
      next_mes = +mes + 1;
      next_anio = +anio;
    } else if (mes==11){ // caso diciembre      
      next_mes=0;
      next_anio = +anio + 1;
      prev_mes = +mes - 1;
      prev_anio = +anio;
    } else { // cualquier otro mes normal      
      next_mes = +mes + 1;
      next_anio = +anio;
      prev_mes = +mes - 1;
      prev_anio = +anio;
    }

    var last_day_date = new Date(next_anio, +next_mes + 1, 0);

    prev_fecha.setMonth(prev_mes);
    prev_fecha.setFullYear(prev_anio);
    prev_fecha.setDate(1); 
    next_fecha.setMonth(next_mes);
    next_fecha.setFullYear(next_anio);
    next_fecha.setDate(last_day_date.getDate());
    
    console.log(prev_fecha);
    console.log(next_fecha);
    
    let data = {
      params: {
        filter: {
          fecha_desde: moment(prev_fecha).format('YYYY-MM-DD'),
          fecha_hasta: moment(next_fecha).format('YYYY-MM-DD')
        }
      }
    }

    this.mensajeSpinner = "Cargando eventos del calendario...";
    this.lcargando.ctlSpinner(true);

    this.apiSrv.getLRCalEvents(data).subscribe(
      (res) => {
        console.log(res);
        this.events = [];
        let fake_id_evento = 0
        res['data'].forEach(e => {
          // console.log(e);
          let evento = {
            id: fake_id_evento,
            title: e.titulo + " de " + e.fecha_inicio_e.split(" ")[1] + " a " + e.fecha_fin_e.split(" ")[1],
            start: new Date(e.fecha_inicio),
            end: new Date(e.fecha_fin),
            color: e.tipo_evento=='E1'?colors.red:(e.tipo_evento=='E2'?colors.yellow:colors.blue),
            actions: this.actions,
            id_origin: e.id_cal_eventos
          }
          this.events.push(evento);
          fake_id_evento += 1
        });
        console.log(this.events);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  metodoGlobal(event){
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.expandGestionForm(true, {});
       break;
      case " MOSTRAR INACTIVOS":
      //  this.changeShowInactive(this.showInactive);
      break;
    }
  }
  
  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {    
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  deleteEvent(event) {
    console.log(event);
    if (this.permissions.eliminar == "0"){
      this.toastr.warning("No tiene permisos para eliminar Eventos.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar este Evento?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeSpinner = "Eliminando Evento..."
          this.lcargando.ctlSpinner(true);

          let id = event.id_origin;

          this.apiSrv.eliminarCalEvent(id).subscribe(
            (res) => {
              // if (res["status"] == 1) {
              //   this.lcargando.ctlSpinner(false);
              //   Swal.fire({
              //     icon: "success",
              //     title: "Registro Eliminado",
              //     text: res['message'],
              //     showCloseButton: true,
              //     confirmButtonText: "Aceptar",
              //     confirmButtonColor: '#20A8D8',
              //   });
              //   this.events = this.events.filter(e => {
              //     e!==event
              //   });
              // } else {
              //   this.lcargando.ctlSpinner(false);
              //   Swal.fire({
              //     icon: "error",
              //     title: "Error",
              //     text: res['message'],
              //     showCloseButton: true,
              //     confirmButtonText: "Aceptar",
              //     confirmButtonColor: '#20A8D8',
              //   });
              // }
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Éxito",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
              this.events = this.events.filter(iEvent => iEvent !== event);
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            }
          )
        }
      });
    }
  }

  openScheduleDialog(event){
    // let dialogRef = this.dialog.open(ScheduleDialogComponent, {
    //   data: event
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result){
    //     if(!result.isEdit){
    //       result.color = colors.blue;
    //       result.actions = this.actions;
    //       this.events.push(result);
    //       this.refresh.next(null);
    //     }else{
    //       //implement edit here
    //     }
    //   }
    // });
  }
  
  expandGestionForm(isNew:boolean, data?:any) {
    // console.log(data);
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Eventos.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Eventos.", this.fTitle);
    } else {
      const modalInvoice = this.modalSrv.open(GestionFormComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTickets;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.tipoEventosList = this.tipoEventosList;

    }
  }

}
