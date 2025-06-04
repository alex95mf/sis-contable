import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
// import { ModalContribuyentesService } from './modal-contribuyentes.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { CrucePagosService } from '../cruce-pagos.service';
import * as moment from 'moment';
// import { OrdenService } from '../orden.service';
// import { ValidacionesFactory } from '../utils/ValidacionesFactory';
@Component({
standalone: false,
  selector: 'app-modal-facturas',
  templateUrl: './modal-facturas.component.html',
  styleUrls: ['./modal-facturas.component.scss']
})
export class ModalFacturasComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any = false;
  @Input() validacion: any;

  // Se utiliza en gestion de convenios
  @Input() verificaContribuyente: any

  vmButtons: any;
  contribuyentesDt: any = [];
  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  validaciones: ValidacionesFactory = new ValidacionesFactory()

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: CrucePagosService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 
  
  
    this.filter = {
      proveedor: '',
      num_documento: '',
      fecha_desde:moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      // descripcion: undefined,
      // forma_pago: undefined,
      submodulo: undefined,
      estado: ['A', 'I'],
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 6,
      page: 1,
      pageSizeOptions: [5, 6, 10]
    }

    setTimeout(() => {
      this.cargarContribuyentes();
    }, 0);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarContribuyentes();
  }

  aplicarFiltros() {
    this.paginate.page = 1;
    this.cargarContribuyentes();
  }

  cargarContribuyentes() {
    this.mensajeSpinner = "Cargando lista de Contribuyentes...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.mdlSrv.getFactura(data).subscribe(
      (res) => {
        // console.log(data);
        // console.log(res);
        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.contribuyentesDt = []
        } else {
          this.paginate.length = res['data']['total'];
          if (res['data']['current_page'] == 1) {
            this.contribuyentesDt = res['data']['data'];
          } else {
            this.contribuyentesDt = Object.values(res['data']['data']);
          }
        }

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  limpiarFiltros(){
    // this.filter.descripcion = undefined;
    // this.filter.forma_pago = undefined;
    // this.filter.submodulo = undefined;

    this.filter = {
      proveedor: '',
      num_documento: '',
      fecha_desde:moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      // descripcion: undefined,
      // forma_pago: undefined,
      submodulo: undefined,
      estado: ['A', 'I'],
      filterControl: "",
    };

  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea seleccionar otro contribuyente? Los demás campos y cálculos realizados serán reiniciados.",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeModal(data);
        }
      });
    } else {
      this.closeModal(data);
    }
  }

  closeModal(data?: any) {
    if (data) {
      let dato = data
      dato["valor_pagar"] = data.saldo;
      dato["saldo_factura"] = data.saldo;
      this.commonVrs.modalFacturaCajaChica.next(data);
    }
    this.activeModal.dismiss();
  }
}
