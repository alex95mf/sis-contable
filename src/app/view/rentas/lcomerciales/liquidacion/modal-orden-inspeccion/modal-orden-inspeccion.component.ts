import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { LiquidacionService } from '../liquidacion.service';

@Component({
  selector: 'app-modal-orden-inspeccion',
  templateUrl: './modal-orden-inspeccion.component.html',
  styleUrls: ['./modal-orden-inspeccion.component.scss']
})
export class ModalOrdenInspeccionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() contribuyente: any;
  msgSpinner: string;
  vmButtons: any;

  ordenes: Array<any>;
  filter: any;
  paginate: any;

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: LiquidacionService,
  ) {
    this.filter = {
      razon_social: null,
      local_comercial: null,
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      numero_orden: null,
      estado: null,
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
        orig: "btnsModalOrdenes",
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

    setTimeout(() => this.getOrdenes(), 50);
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
    this.getOrdenes()
  }

  async getOrdenes() {
    this.lcargando.ctlSpinner(true);
    
    try {
      this.msgSpinner = 'Cargando Ordenes de Inspeccion'
      let response = await this.apiService.getOrdenes({
        contribuyente: this.contribuyente,
        params: {
          filter: this.filter,
          paginate: this.paginate,
        }
      });
      this.paginate.length = response.total
      this.ordenes = response.data

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err);
      this.lcargando.ctlSpinner(false);
    }
  }

  selectOrden(orden: any) {
    this.apiService.$ordenInspeccionSelected.emit(orden);
    this.activeModal.close();
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getOrdenes();
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      num_documento: null,
      razon_social: null,
    })
  }

}
