import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { NotaDebitoService } from '../nota-debito.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Socket } from '../../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';


@Component({
standalone: false,
  selector: 'app-show-notas-debito',
  templateUrl: './show-notas-debito.component.html',
  styleUrls: ['./show-notas-debito.component.scss']
})
export class ShowNotasDebitoComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  empresLogo: any;
  @Input() module_comp: any;
  @Input() id_document: any;
  @Input() editar: any;
  latestStatus: any;
  prefict: any;
  NexPermisions: any;
  vmButtons:any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private accSrv: NotaDebitoService,
    private socket: Socket
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarSrvice.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnNdC", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.getTableAccounts();
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

  getTableAccounts() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    this.accSrv.getNotasDebito({ id_document: this.id_document,type:"Cliente" })
      .subscribe(res => {
        this.validaDt = true;
        this.dataDT = res['data'];
        this.dataDT.forEach(element => {
          element['total'] = parseFloat(element['total']).toFixed(2);
        });
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.commonVarSrvice.updPerm.next(false);
        }, 50);
      }, error => {
        this.validaDt = true;
        this.dataDT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.commonVarSrvice.updPerm.next(false);
        }, 50);
      });
  }

  editarND(dt) {
    this.commonVarSrvice.setNotasDebitoVenta.next(dt);
    this.closeModal();
  }

  deleteND(dt) {
    if (dt.isModule == 1) {
      Swal.fire({
        title: 'Atención!!',
        text: "Esta nota de débito no puede ser eliminada!!",
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    } else {
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
          if (informacion == "") {
            this.toastr.info("Ingrese una descripción");
          } else {
            this.commonVarSrvice.updPerm.next(true);
            let data = {
              motivo: informacion,
              id_ncdv_cab: dt.id,
              ip: this.commonService.getIpAddress(),
              accion: informacion,
              id_controlador: this.module_comp
            }
            this.accSrv.deleteNotaDebito(data).subscribe(res => {
              this.toastr.success(res['message']);
              this.commonVarSrvice.updPerm.next(false);
              this.closeModal();
            }, error => {
              this.commonVarSrvice.updPerm.next(false);
              this.toastr.info(error.error.message);
            })
          }
        },
      })
    }
  }

  /* nexStatus(dt) {
    if (this.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
    } else {
      let permission = this.commonService.filterPermissionStatus(dt.filter_doc, this.id_document);
      this.NexPermisions = this.commonService.filterNexStatus(dt.filter_doc, this.id_document);
      if (permission) {
        this.confirmSave("Seguro desea cambiar de estado de la nota de débito?", "MOD_NDV", dt);
      } else {
        this.toastr.info("Usuario no tiene Permiso para cambiar al siguiente estado o los permisos aún no han sido asignados");
      }
    }
  }

  async confirmSave(message, action, order?: any) {
    Swal.fire({
      title: "Atención!!",
      text: message,
       icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "MOD_NDV") {
          this.modNCV(order);
        }
      }
    })
  }

  modNCV(ncv) {
    let data = {
      nexPermi: this.NexPermisions,
      id: ncv.id,
      ip: this.commonService.getIpAddress(),
      accion: `Cambio de estado de la nota de débito número ${ncv.secuencia_doc.toString().padStart(10, '0')}`,
      id_controlador: this.module_comp,
      filter_doc: this.NexPermisions,
      id_document: this.id_document,
      abbr_doc: this.dataUser.permisos_doc.filter(e => e.fk_documento == this.id_document)[0].codigo,
      notifycation: `Se ha cambiado de estado a la nota de débito ${ncv.secuencia_doc.toString().padStart(10, '0')} por el usuario ${this.dataUser.nombre}`,
      secuence: ncv.secuencia_doc
    }

    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == this.id_document);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];
    let currentStatus = this.commonService.filterNexStatus(filter, this.id_document);
    if (parseInt(this.latestStatus) != parseInt(currentStatus)) {
      data['usersFilter'] = this.commonService.filterUserNotification(filter, this.id_document);
      data['usersAprobated'] = null;
      data['idUserAprobated'] = null;
    } else {
      data['usersFilter'] = Array.from(new Set(this.commonService.allUserNotification(this.id_document)));
      data['usersAprobated'] = this.dataUser.nombre;
      data['idUserAprobated'] = this.dataUser.id_usuario;
    }

    this.accSrv.updatedPermisions(data).subscribe(res => {
      this.socket.onEmitNotification(data['usersFilter']);
      this.toastr.success(res['message']);
      this.closeModal();
      setTimeout(() => {
        location.reload();
      }, 300);
    }, error => {
      this.toastr.info(error.error.message);
    })
  } */

}
