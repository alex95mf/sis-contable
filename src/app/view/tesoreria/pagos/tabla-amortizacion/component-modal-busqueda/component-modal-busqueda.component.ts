
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
// import { ModalContribuyentesService } from './modal-contribuyentes.service';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AmortizacionService } from '../tabla-amortizacion.service';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
standalone: false,
  selector: 'app-component-modal-busqueda',
  templateUrl: './component-modal-busqueda.component.html',
  styleUrls: ['./component-modal-busqueda.component.scss']
})
export class ComponentModalBusquedaComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  paginate: any;
  filter: any;
  vmButtons: any;
  dataUser: any;
  Amortizaciones: any = [];
  @Input() verifyRestore: any = false;
  @Input() validacion: any;
  @Input() verificaContribuyente: any


  constructor(    
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: AmortizacionService,) 
    { }


    @ViewChild(ButtonRadioActiveComponent, { static: false }) buttonRadioActiveComponent: ButtonRadioActiveComponent;

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

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(() => {
      this.cargarAmortizaciones();
     //this.catalogo()
      //this.Departamentos();
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
    this.cargarAmortizaciones();
  }
  
  aplicarFiltros() {
    this.paginate.page = 1;
    this.cargarAmortizaciones();
  }
  
  limpiarFiltros() {
    this.filter.tipo = undefined;
    this.filter.fecha_desde = undefined;
    this.filter.fecha_hasta = undefined;
    // this.cargarContribuyentes();
  }
  

  closeModal(data?: any) {
    if (data) {
      let dato = data
      dato["valid"] = this.validacion;
      dato['valida_contribuyente'] = this.verificaContribuyente
      this.commonVrs.modalConstFisica.next(data);
    }
    this.activeModal.dismiss();
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

  cargarAmortizaciones() {
    this.mensajeSppiner = "Cargando lista de Amortizaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
    this.mdlSrv.getAmortizaciones(data).subscribe(
      (res) => {
        // console.log(data);
        console.log(res);
        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.Amortizaciones = []
        } else {
          this.paginate.length = res['data']['total'];
          if (res['data']['current_page'] == 1) {
            this.Amortizaciones = res['data']['data'];
          } else {
            this.Amortizaciones = Object.values(res['data']['data']);
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

}
