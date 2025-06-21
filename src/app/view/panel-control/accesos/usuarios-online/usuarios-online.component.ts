import { Component, OnInit, ViewChild, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UsuariosOnlineService } from './usuarios-online.service'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServices'
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import moment from 'moment';
declare const $: any;
import { Socket } from '../../../../services/socket.service';

@Component({
standalone: false,
  selector: 'app-usuarios-online',
  templateUrl: './usuarios-online.component.html',
  styleUrls: ['./usuarios-online.component.scss']
})
export class UsuariosOnlineComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  // dtOptions: any = {};
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDtUserConected: any = false;
  dataUserConected: any = [];
  dataUserConectedAux: any = [];
  dataUser: any;
  permisions: any;
  processing: any = false;
  vmButtons: any;
  diferentTime: any;
  toDatePicker: any = new Date();
  timeActual: any = moment(this.toDatePicker).format('YYYY-MM-DD HH:mm:ss');
  conTime: any = 0;
  fech1: any;
  fechDay: any;
  fechHour: any;
  fechMin: any;
  urlres: any;
  flag: any = false;
  componetCh: any = false;
  divHtml: any;

  constructor(private toastr: ToastrService, private commonServices: CommonService, private usuarioConectServices: UsuariosOnlineService,
    private router: Router, private socket: Socket) {
    let info = setInterval(() => this.repetirCadaSegundo(), 1000);
    let infores = setInterval(() => this.changeStatus(), 10000);
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsUserOnline", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsUserOnline", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fUserConected,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Bitácora");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getDatabitacora();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }

  changeStatus() {
    this.urlres = localStorage.getItem('url')
    if (this.urlres == "1") {
      let data = {
        id: 1
      }
      this.usuarioConectServices.getUserConectados(data).subscribe(res => {
        this.dataUserConected = res['data'];
        let userOnline = JSON.parse(localStorage.getItem('userOnline'));
        setTimeout(() => {
          for (let index = 0; index < this.dataUserConected.length; index++) {
            let chCmp = userOnline.filter(e => e.id_bitacora == this.dataUserConected[index].id_bitacora);
            if (chCmp.length > 0) {
              if (chCmp[0].component_actual != this.dataUserConected[index].component_actual) {
                this.divHtml = document.getElementById("idNameCmp" + index);
                this.divHtml.innerHTML = `<span style="color: #22A8D8;">${this.dataUserConected[index].component_actual}</span>`;
              } else {
                this.divHtml = document.getElementById("idNameCmp" + index);
                this.divHtml.innerHTML = `<span>${this.dataUserConected[index].component_actual}</span>`;
              }
            }
          }
        }, 10);
        this.dataUserConected.forEach(element => {
          element['time_conected'] = this.msConversion(element.updated_at);
        });
        localStorage.setItem('userOnline', JSON.stringify(this.dataUserConected));
      })
    }
  }

  getDatabitacora() {
    let data = {
      id: 1
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      dom: 'lfrtip',  //lfrtipB Bfrtip
      order: [[0, "desc"]],
      buttons: [{
        extend: 'excel',
        footer: true,
        title: 'Bitácora de actividades',
        filename: 'Export_File',
      }, {
        extend: 'print',
        footer: true,
        title: 'Bitácora de actividades',
        filename: 'Export_File_pdf',
      }],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.lcargando.ctlSpinner(true);
    this.usuarioConectServices.getUserConectados(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.validaDtUserConected = true;
        this.dataUserConected = res['data'];
        localStorage.setItem('userOnline', JSON.stringify(this.dataUserConected));
        this.dataUserConectedAux = res['data'];
        setTimeout(() => {
          this.dtTrigger.next(null);
          for (let index = 0; index < this.dataUserConected.length; index++) {
            this.divHtml = document.getElementById("idNameCmp" + index);
            this.divHtml.innerHTML = `<span>${this.dataUserConected[index].component_actual}</span>`;
            this.dataUserConected[index]['time_conected'] = this.msConversion(this.dataUserConected[index].updated_at);
          }
        }, 50);
      }, error => {
        this.validaDtUserConected = true;
        this.dataUserConected = [];
        this.dataUserConectedAux = [];
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
  }


  repetirCadaSegundo() {
    this.toDatePicker = new Date();
    this.timeActual = moment(this.toDatePicker).format('YYYY-MM-DD HH:mm:ss');
    this.dataUserConected.forEach(element => {
      element['time_conected'] = this.msConversion(element.updated_at);
    });
  }

  msConversion(hourEnter) {
    var entryHour = moment(moment(hourEnter).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
    var exitHour = moment(moment(this.timeActual).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
    var duration = exitHour.diff(entryHour);

    let sec: any = Math.floor(duration / 1000);
    let hrs: any = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min: any = Math.floor(sec / 60);
    sec -= min * 60;

    sec = '' + sec;
    sec = ('00' + sec).substring(sec.length);

    if (hrs > 0) {
      min = '' + min;
      min = ('00' + min).substring(min.length);
      hrs = '' + hrs;
      hrs = ('00' + hrs).substring(hrs.length);
      return hrs + ":" + min + ":" + sec;
    }
    else {
      min = '' + min;
      min = ('00' + min).substring(min.length);
      hrs = '' + hrs;
      hrs = ('00' + hrs).substring(hrs.length);
      return "00" + ":" + min + ":" + sec;
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getDatabitacoraAux();
    });
  }

  getDatabitacoraAux() {
    let data = {
      id: 1
    }
    this.dataUserConected = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      dom: 'lfrtip',  //lfrtipB Bfrtip
      order: [[0, "desc"]],
      buttons: [{
        extend: 'excel',
        footer: true,
        title: 'Bitácora de actividades',
        filename: 'Export_File',
      }, {
        extend: 'print',
        footer: true,
        title: 'Bitácora de actividades',
        filename: 'Export_File_pdf',
      }],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.usuarioConectServices.getUserConectados(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.validaDtUserConected = true;
        this.dataUserConected = res['data'];
        this.dataUserConected.forEach(element => {
          element['time_conected'] = this.msConversion(element.updated_at);
        });
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.validaDtUserConected = true;
        this.dataUserConected = [];
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        $('#tablaUseronline').DataTable().button('.buttons-excel').trigger();
        break;
      case "IMPRIMIR":
        $('#tablaUseronline').DataTable().button('.buttons-print').trigger();
        break;
    }
  }

}
