import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ChequesPostService } from './cheques-post.service';
import * as myVarGlobals from '../../../../global';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-cheques-post',
  templateUrl: './cheques-post.component.html',
  styleUrls: ['./cheques-post.component.scss']
})
export class ChequesPostComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permisions: any;
  dataDT: any;
  validaDt: any;
  filter: any = 'Girado';
  arrayFilters: any = [
    { key: 'Girado', name: 'Girado' },
    { key: 'Cobrado', name: 'Cobrado' },
    { key: 'Protestado', name: 'Protestado' },
    { key: 'Devuelto', name: 'Devuelto' },
    { key: 'Anulado', name: 'Anulado' },
    { key: 'Procesando', name: 'Procesando' },
    { key: 'Todos', name: 'Todos' }
  ];
  dataDtAux: any;
  flag:any = false;

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private chqSrv: ChequesPostService,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.getPermisions();
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fChequesPostFechados,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario cheques post fechados");
        this.lcargando.ctlSpinner(false);
        this.flag = true;
      } else {

        this.processing = true;
        this.getChequesPostFechados();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getChequesPostFechados() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = {
      filter: this.filter,
      desde: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      hasta: moment(this.toDatePicker).format('YYYY-MM-DD')
    }

    this.chqSrv.getChequesPostFechados(data).subscribe(res => {
      this.validaDt = true;
      this.dataDT = res['data'];
      localStorage.setItem('chequesPost', JSON.stringify(this.dataDT));
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.validaDt = true;
      this.dataDT = [];
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
      this.lcargando.ctlSpinner(false);
    });
  }

  rerender(): void {
    this.lcargando.ctlSpinner(true);
    this.dataDT = [];
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getChequesPostFechados();
    });
  }

  changeFechCobro(dt) {
    let infoBefore = JSON.parse(localStorage.getItem('chequesPost'));
    infoBefore = infoBefore.filter(e => e.id == dt.id)[0];

    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el registro");
    } else {
      /* if (moment(infoBefore.fecha_cobro).format('YYYY-MM-DD') >= moment(dt.fecha_cobro).format('YYYY-MM-DD')) { */
        if (moment(dt.fecha_cobro).format('YYYY-MM-DD') <  moment(this.viewDate).format('YYYY-MM-DD') ) {
        Swal.fire({
          title: 'Error!!',
          text: "La fecha de cambio no puede ser menor o igual a la fecha actual!!",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
      } else {
        Swal.fire({
          title: "Atención!!",
          text: "Seguro desea actualizar la fecha de cobro?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.value) {
            this.lcargando.ctlSpinner(true);
            let data = {
              fecha_cobro: moment(dt.fecha_cobro).format('YYYY-MM-DD'),
              id: dt.id,
              number_cheque: dt.number_cheque,
              ip: this.commonServices.getIpAddress(),
              accion: `Actualización de cheque post fechado con número ${dt.number_cheque}`,
              id_controlador: myVarGlobals.fChequesPostFechados
            }
            this.chqSrv.updatedChangeChequesPostFechados(data).subscribe(res => {
              this.toastr.success(res['message']);
              localStorage.removeItem('chequesPost');
              this.rerender();
            }, error => {
              this.toastr.info(error.error.message);
            })
          }
        })
      }
    }
  }
}
