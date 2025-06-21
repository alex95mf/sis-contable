import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { GestionService } from '../gestion.service';
import moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
standalone: false,
  selector: 'app-gestion-form',
  templateUrl: './gestion-form.component.html',
  styleUrls: ['./gestion-form.component.scss']
})
export class GestionFormComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  dataUser: any;

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() tipoEventosList: any = [];

  vmButtons: any;

  evento: any = {
    id_cal_eventos: 0,
    titulo: '',
    fecha_inicio: moment(new Date()).format('YYYY-MM-DD'),
    hora_inicio: moment(new Date()).format('HH:00:00'),
    fecha_fin: moment(new Date()).format('YYYY-MM-DD'),
    hora_fin: moment(new Date()).format('HH:00:00'),
    descripcion: '',
    tipo_evento: 0,
    id_origin: 0
  };

  needRefresh: boolean = false;

  // format('YYYY-MM-DD HH:mm:ss')

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private apiSrv: GestionService,
    private commonVarSrv: CommonVarService,
    ) { }

  ngOnInit(): void {

    
    this.vmButtons = [
      {
        orig: "btnGestionForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnGestionForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    if(!this.isNew){
      console.log(this.data);
      this.getCalEvento();
    }

  }

  
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validaEvento();
        break;
    }
  }

  getCalEvento() {
    (this as any).mensajeSpinner = "Obteniendo Evento...";
    // this.lcargando.ctlSpinner(true);

    let id = this.data.id_origin;

    this.apiSrv.getCalEventById(id).subscribe(
      (res: any) => {
        console.log(res);
        Object.assign(this.evento, {
          id_cal_eventos: res.id_cal_eventos,
          titulo: res.titulo,
          descripcion: res.descripcion,
          tipo_evento: res.tipo_evento,
          fecha_inicio: res.fecha_inicio.split(' ')[0],
          hora_inicio: res.fecha_inicio.split(' ')[1],
          fecha_fin: res.fecha_fin.split(' ')[0],
          hora_fin: res.fecha_fin.split(' ')[1],
        })
        this.lcargando.ctlSpinner(false);        
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Error al intentar obtener el Evento");
      }
    )
  }

  validaEvento() {

    if (
      this.evento.titulo == '' || this.evento.titulo == undefined
    ) {
      this.toastr.info('Debe ingresar un título para el evento.')
      return;
    } else if(
      this.evento.descripcion == '' || this.evento.descripcion == undefined
    ) {
      this.toastr.info('Ingrese una descripción para el evento.')
      return;
    } else if(
      this.evento.tipo_evento == 0 || this.evento.tipo_evento == undefined
    ) {
      this.toastr.info('Debe seleccionar un tipo de evento.')
      return;
    } else if(
      this.evento.fecha_fin < this.evento.fecha_inicio
    ) {
      this.toastr.info('La fecha final del evento no puede ser anterior a la fecha de inicio.')
      return;
    } else if(
      (this.evento.fecha_fin == this.evento.fecha_inicio) &&  (this.evento.hora_fin <= this.evento.hora_inicio)
    ) {
      this.toastr.info('Si el evento es del mismo día la hora final no puede ser igual o menor a la hora inicial del evento.')
      return;
    }

    Swal.fire({
      icon: "info",
      title: "Confirmar",
      text: this.isNew?"¿Está seguro de crear este nuevo Evento?":"¿Está seguro de editar este Evento?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#20A8D8',      
      cancelButtonColor: 'red'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveEvento();      
      }
    });
  }

  saveEvento() {
    (this as any).mensajeSpinner = "Creando Evento...";
    // this.lcargando.ctlSpinner(true);

    console.log(this.evento);
    let hora_ini = this.evento.hora_inicio.split(':');
    let hora_fin = this.evento.hora_fin.split(':');
    if(hora_ini.length==2){
      this.evento.hora_inicio = this.evento.hora_inicio + ':00';
      console.log(this.evento.hora_inicio);
    }
    if(hora_fin.length==2){
      this.evento.hora_fin = this.evento.hora_fin + ':00';
      console.log(this.evento.hora_fin);
    }

    let fechahora_inicio = this.evento.fecha_inicio + ' ' + this.evento.hora_inicio;
    let fechahora_fin = this.evento.fecha_fin + ' ' + this.evento.hora_fin;
    Object.assign(this.evento, {
      fechahora_inicio: fechahora_inicio,
      fechahora_fin: fechahora_fin,
    })
    console.log(this.evento);

    let data = {
      evento: this.evento
    }

    if(this.isNew){
      this.apiSrv.crearCalEvent(data).subscribe(
        (res) => {
          console.log(res)
          if (res["status"] == 1) {
            this.needRefresh = true;
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "success",
              title: "Se agregó nuevo Evento satisfactoriamente",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            }).then((result) => {
              if (result.isConfirmed) {
                this.closeModal(res);
              }
            });
          }
          else {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            });
          }
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Error al intentar agregar el nuevo Evento");
        }
      )
    } else {
      this.apiSrv.editarCalEvent(data).subscribe(
        (res) => {
          console.log(res)
          if (res["status"] == 1) {
            this.needRefresh = true;
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "success",
              title: "Se editó el Evento satisfactoriamente",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            }).then((result) => {
              if (result.isConfirmed) {
                this.closeModal(res);
              }
            });
          }
          else {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            });
          }
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Error al intentar editar el Evento");
        }
      )
    }


  }

  closeModal(data?) {
    if(data){
      let res = {
        isNew: this.isNew,
        data: data,
      }
      this.commonVarSrv.needRefresh.next(res);
    }
    this.activeModal.dismiss();
  }

}
