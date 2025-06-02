import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DevolucionesService } from '../devoluciones.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from '../../../../../services/common-var.services';
import { CommonService } from '../../../../../services/commonServices';
import * as myVarGlobals from '../../../../../global';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-show-devolucion',
  templateUrl: './show-devolucion.component.html',
  styleUrls: ['./show-devolucion.component.scss']
})
export class ShowDevolucionComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;
  filter: any = "0";
  vmButtons: any;

  constructor(
    private devSrv: DevolucionesService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
    private commonServices: CommonService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnDevolucionesShow", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.getDevolucionesTable();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  getDevolucionesTable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    let data = {
      filtro: this.filter
    }

    this.devSrv.getDevolucion(data)
      .subscribe(res => {
        this.validaDt = true;
        this.dataDT = res['data'];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.commonVarService.updPerm.next(false);
        }, 50);
      }, error => {
        this.validaDt = true;
        this.dataDT = [];
        this.validaDt = true;
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.commonVarService.updPerm.next(false);
        }, 50);
      });
  }

  rerender(): void {
    this.commonVarService.updPerm.next(true);
    this.validaDt = false;
    this.dataDT = [];
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getDevolucionesTable();
    });
  }

  deleteDevolucion(dt) {
    Swal.fire({
      text: 'INGRESE UN MOTIVO DE ANULACIÓN',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',

      preConfirm: (informacion) => {
        this.commonVarService.updPerm.next(true);
        let data = {
          motivo_anulado: informacion,
          estado_dev: 'Anulado',
          id_usr_cancel: this.dataUser.id_usuario,
          name_usr_cancel: this.dataUser.nombre,
          id_dev: dt.id_dev,
          ip: this.commonServices.getIpAddress(),
          accion: `${informacion}, hecha por el usuario ${this.dataUser.nombre}`,
          id_controlador: myVarGlobals.fDevoluciones
        }
        this.devSrv.deleteDevolucion(data).subscribe(res => {
          this.toastr.success(res['message']);
          this.commonVarService.updPerm.next(false);
          this.closeModal();
        }, error => {
          this.commonVarService.updPerm.next(false);
          this.toastr.info(error.error.message);
        })
      }
    })
  }

  editarDevolucion(dt) {
    this.commonVarService.showDevolutionsListen.next(dt);
    this.closeModal();
  }

}
