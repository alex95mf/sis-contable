import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { DataTableDirective } from 'angular-datatables';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PagosServiciosService } from '../pagos-servicios.service'
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';

import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-show-pagos-servicios',
  templateUrl: './show-pagos-servicios.component.html',
  styleUrls: ['./show-pagos-servicios.component.scss']
})
export class ShowPagosServiciosComponent implements OnInit {

  /* import information */
  @Input() permissions: any;

  /* validation actions */
  payload: any;
  processing: boolean = false;

  /* dictionaries */
  pas: Array<any> = [];

  /* datatable */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: any = {};
  dtTrigger = new Subject();

  constructor(public activeModal: NgbActiveModal, private pSrv: PagosServiciosService, private toastr: ToastrService,
    private commonVarSrv: CommonVarService, private commonServices: CommonService, private router: Router) { }


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "spShowPgSrs", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.getPaymentAndService();
    }, 10)

    this.payload = JSON.parse(localStorage.getItem('Datauser'));

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.closeModal();
        break;
    }
  }

  /* Calls Api's */
  getPaymentAndService() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }
    this.lcargando.ctlSpinner(true);
    this.pSrv.getAvailablePAS().subscribe(response => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.pas = response["data"];

      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    });
  }

  setPaymentAndService(data) {
    (this as any).mensajeSpinner = "Eliminando...";
    this.lcargando.ctlSpinner(true);
    this.pSrv.deletePaymentAndServ(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.commonVarSrv.showPASListen.next("Eliminar");
      this.closeModal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  /* Common Actions */
  closeModal() {
    this.activeModal.dismiss();
  }

  editPaymentAndService(dt) {
    this.commonVarSrv.showPASListen.next(dt);
    this.closeModal();
  }

  deletePaymentAndService(dt) {
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
    } else {
      let data = {
        id: dt["id"],
        id_usr_anulacion: this.payload["id_usuario"],
        name_usr_anulacion: this.payload["nombre"],
        ip: this.commonServices.getIpAddress(),
        accion: `Anulación de Devolución por el usuario ${this.payload["nombre"]}`,
        id_controlador: myVarGlobals.fPagoServicios
      }
      this.CallsApiCancel("Seguro desea realizar esta acción?", "CANCEL_PAS", data);
    }
  }

  async CallsApiCancel(message, action, payload?: any) {
    Swal.fire({
      text: message,
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
        if (action == "CANCEL_PAS") {
          payload['motivo'] = informacion
          this.setPaymentAndService(payload)
        }
      },
    })
  }
}
