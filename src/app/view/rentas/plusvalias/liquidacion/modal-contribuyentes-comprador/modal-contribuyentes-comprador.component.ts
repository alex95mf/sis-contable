import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { LiquidacionService } from '../liquidacion.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
@Component({
standalone: false,
  selector: 'app-modal-contribuyentes-comprador',
  templateUrl: './modal-contribuyentes-comprador.component.html',
  styleUrls: ['./modal-contribuyentes-comprador.component.scss']
})
export class ModalContribuyentesCompradorComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static:false })
  lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any = false;
  @Input() validacion: any;


  vmButtons: any;
  contribuyentesDt: any = [];
  paginate: any;
  filter: any;
  validaciones: ValidacionesFactory = new ValidacionesFactory()


  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private generacionSrv: LiquidacionService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    setTimeout(()=> {
      this.cargarContribuyentes();
    }, 0);
    
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

    this.generacionSrv.getContribuyentes(data).subscribe(
      (res) => {
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.contribuyentesDt = res['data']['data'];
        } else {
          this.contribuyentesDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Acaba de seleccionar un contribuyente para alcabala",
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

  limpiarFiltros() {
    this.filter.razon_social = undefined;
    this.filter.num_documento = undefined;
    this.cargarContribuyentes();
  }

  closeModal(data?:any) {
    if(data){
      this.commonVarSrv.selectContribuyenteC.next(data);
    }
    this.activeModal.dismiss();
  }

  

}
