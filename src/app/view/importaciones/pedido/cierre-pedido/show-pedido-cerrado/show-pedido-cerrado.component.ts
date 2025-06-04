import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { CierrePedidoService } from '../cierre-pedido.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { Socket } from '../../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-show-pedido-cerrado',
  templateUrl: './show-pedido-cerrado.component.html',
  styleUrls: ['./show-pedido-cerrado.component.scss']
})
export class ShowPedidoCerradoComponent implements OnInit {

  mensajeSpinner:string = "Cargando...";
  @ViewChild (CcSpinerProcesarComponent,{static: false }) lcargando:CcSpinerProcesarComponent;

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
  fechaDelete: any = new Date();
  vmButtons:any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private accSrv: CierrePedidoService,
    private socket: Socket
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarSrvice.updPerm.next(true);
    }, 50);
    this.vmButtons = [
      { orig: "btnPedidosImpCerrado", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
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

    this.accSrv.getPedidosCerrados()
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

  showDetallePedido(dt) {
    this.commonVarSrvice.listenCierrePedidosImp.next(dt);
    this.closeModal();
  }

  deletePedido(dt) {
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
          this.lcargando.ctlSpinner(true);
          let data = {
            motivo: informacion,
            id_pedido: dt.id,
            ip: this.commonService.getIpAddress(),
            accion: informacion,
            id_controlador: this.module_comp,
            total_pedido: dt.total_pedido
          }
          this.accSrv.deletePedidosCerrados(data).subscribe(res => {
            this.lcargando.ctlSpinner(false);
            this.toastr.success(res['message']);
            this.commonVarSrvice.cancelImpPedido.next(null);
            this.closeModal();
          }, error => {
            this.toastr.info(error.error.message);
          })
        }
      },
    })
  }
}
