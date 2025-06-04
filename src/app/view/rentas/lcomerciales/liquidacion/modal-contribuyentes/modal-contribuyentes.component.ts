import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { LiquidacionService } from '../liquidacion.service';

@Component({
standalone: false,
  selector: 'app-modal-contribuyentes',
  templateUrl: './modal-contribuyentes.component.html',
  styleUrls: ['./modal-contribuyentes.component.scss']
})
export class ModalContribuyentesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string;
  vmButtons: any;

  contribuyentes: Array<any>;
  filter: any;
  paginate: any;

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: LiquidacionService,
  ) {
    this.filter = {
      num_documento: null,
      razon_social: null,
    };

    this.paginate = {
      perPage: 9,
      length: 0,
      page: 1,
    };
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsModalContribuyente",
        paramAction: "",
        boton: {icon: "fas fa-window-close", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    setTimeout(() => this.getContribuyentes(), 50);
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close();
        break;
      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, {
      page: 1,
      pageIndex: 0,
    });
    this.getContribuyentes()
  }

  async getContribuyentes() {
    this.lcargando.ctlSpinner(true);
    
    try {
      this.mensajeSpinner = 'Cargando Contribuyentes'
      let response = await this.apiService.getContribuyentes({
        params: {
          filter: this.filter,
          paginate: this.paginate,
        }
      });
      this.paginate.length = response.total
      this.contribuyentes = response.data

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err);
      this.lcargando.ctlSpinner(false);
    }
  }

  selectContribuyente(contribuyente: any) {
    this.apiService.$contribuyenteSelected.emit(contribuyente)
    this.activeModal.close()
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getContribuyentes();
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      num_documento: null,
      razon_social: null,
    })
  }

}
