import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
// import { ModalContribuyentesService } from './modal-contribuyentes.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
// import { ReformaService } from '../reforma.service';
import moment from 'moment';
import { ReformaCodigoService } from '../reforma-codigo.service';
// import { ReformaInternaService } from '../reforma-interna.service';
// import { ValidacionesFactory } from '../utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-modal-busqueda-reforma',
  templateUrl: './modal-busqueda-reforma.component.html',
  styleUrls: ['./modal-busqueda-reforma.component.scss']
})
export class ModalBusquedaReformaComponent implements OnInit {

  
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

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  // validaciones: ValidacionesFactory = new ValidacionesFactory()

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: ReformaCodigoService,
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

    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);

    this.filter = {
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      periodo: undefined,
      num_documento: undefined,
      tipo_reforma: 'COD',
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(() => {
      this.getReformas();
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
    Object.assign(this.paginate, { page: event.pageIndex + 1});
    this.getReformas();
  }

  aplicarFiltros() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0})
    this.getReformas();
  }

  async getReformas() {
    (this as any).mensajeSpinner = "Cargando Reformas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    try {
      const response = await this.mdlSrv.getReformaInterna(data) as any
      // console.log(response.data)
      this.paginate.length = response.data.total
      this.contribuyentesDt = response.data.data
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Reformas')
    }


    /* this.mdlSrv.getReformaInterna(data).subscribe(
      (res) => {
        // console.log(data);
        console.log(res);
        this.paginate.length = res['data']['total'];
        this.contribuyentesDt = res['data']['data'];
        // if (Array.isArray(res['data']) && res['data'].length == 0) {
        //   this.contribuyentesDt = []
        // } else {
        //   this.paginate.length = res['data']['total'];
        //   if (res['data']['current_page'] == 1) {
        //     this.contribuyentesDt = res['data']['data'];
        //   } else {
        //     this.contribuyentesDt = Object.values(res['data']['data']);
        //   }
        // }

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );*/
  }

  limpiarFiltros() {
    this.filter = {
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      periodo: undefined,
      num_documento: undefined,
      filterControl: ""
    }
    // this.cargarContribuyentes();
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
      dato["valid"] = this.validacion;
      dato['valida_contribuyente'] = this.verificaContribuyente
      this.commonVrs.modalreformaInterna.next(data);
    }
    this.activeModal.dismiss();
  }

}
