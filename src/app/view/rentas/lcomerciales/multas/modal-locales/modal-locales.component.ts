import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { MultasService } from '../multas.service';

@Component({
standalone: false,
  selector: 'app-modal-locales',
  templateUrl: './modal-locales.component.html',
  styleUrls: ['./modal-locales.component.scss']
})
export class ModalLocalesComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent,{ static: false })
  lcargando: CcSpinerProcesarComponent;

  @Input() permissions: any;
  @Input() contribuyente: any;

  fTitle: any;
  vmButtons: any = [];
  dataUser: any;

  filter: any;
  paginate: any;

  localesDt: any;

  constructor(
    private modal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private multasSrv: MultasService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnInspecciones",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.filter = {
      razon_social: undefined,
      estado: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    }

    setTimeout(()=>{
      this.cargarLocales();
    },0)
  }

  cargarLocales() {
    this.mensajeSpiner = "Cargando locales...";
    this.lcargando.ctlSpinner(true);

    let data = {
      contribuyente: this.contribuyente,
      no_ok: true,
      params: {
        filter: this.filter,
        paginate: this.paginate
      }

    }

    this.multasSrv.getLocales(data).subscribe(
      (res: any) => {
        console.log(res);

        if (res.data.current_page == 1) {
          this.localesDt = res.data.data
        } else {
          this.localesDt = Object.values(res.data.data)
        }

        this.paginate.length = res.data.total

        console.log(this.localesDt);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }
  
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  selectLocal(data) {
    this.closeModal(data);
  }

  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      estado: undefined,
      filterControl: ""
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLocales();
  }

  closeModal(data?: any) {
    if(data){
      this.commonVarSrv.selectLocalInspeccion.next(data);
    }
    this.modal.dismiss();
  }

}
