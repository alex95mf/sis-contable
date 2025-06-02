import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { IngresoService } from '../ingreso.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component'

@Component({
standalone: false,
  selector: 'app-show-comprobantes',
  templateUrl: './show-comprobantes.component.html',
  styleUrls: ['./show-comprobantes.component.scss']
})
export class ShowComprobantesComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  empresLogo: any;
  @Input() module_comp: any;
  vmButtons:any = [];

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private accSrv: IngresoService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.commonVarSrvice.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnsLstCmpIg", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.getTableAccounts();
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "CERRAR2":
        this.closeModal();
      break;
    }
  }

  getTableAccounts() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      order: [[ 5, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    this.accSrv.getVouchers()
      .subscribe(res => {
        this.validaDt = true;
        this.dataDT = res['data'];
        this.dataDT.forEach(element => {
          element['valor'] = parseFloat(element['valor']).toFixed(2);
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

  editarComprobante(dt) {
    this.commonVarSrvice.setVaucheresIgress.next(dt);
    this.closeModal();
  }

  deleteComprobante(dt) {
    if (dt.isModule == 1) {
      Swal.fire({
        title: 'Atención!!',
        text: "Este comprobante no puede ser eliminado!!",
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
          this.commonVarSrvice.updPerm.next(true);
          let data = {
            motivo: informacion,
            is_cheque: (dt.metodo_pago == 'Cheque') ? 1 : dt.metodo_pago,
            num_trx: (dt.num_tx != null) ? (dt.num_tx).trim() : "",
            id_com_cab: dt.id,
            ip: this.commonService.getIpAddress(),
            accion: informacion,
            id_controlador: this.module_comp,
            det_conciliation:dt.det_conciliation,
            fk_documento: dt.fk_documento,
            secuencial:dt.secuencial
          }
          this.accSrv.deleteComprobante(data).subscribe(res => {
            this.toastr.success(res['message']);
            this.commonVarSrvice.refreshNDV.next(null);
            this.commonVarSrvice.updPerm.next(false);
            this.closeModal();
          }, error => {
            this.commonVarSrvice.updPerm.next(false);
            this.toastr.info(error.error.message);
          })
        },
      })
    }
  }
}
