import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { LiquidacionService } from '../liquidacion.service';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-modal-busqueda-documento',
  templateUrl: './modal-busqueda-documento.component.html',
  styleUrls: ['./modal-busqueda-documento.component.scss']
})
export class ModalBusquedaDocumentoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator
  msgSpinner: string;
  vmButtons: any;

  documentos: Array<any> = [];
  filter: any;
  paginate: any;

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: LiquidacionService,
  ) {
    this.filter = {
      documento: null,
      contribuyente: null,
    };

    this.paginate = {
      perPage: 10,
      length: 0,
      page: 1,
    };
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsModalDocumento",
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

    setTimeout(() => this.getDocumentos(), 50)
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
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.getDocumentos()
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.getDocumentos()
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      documento: null,
      contribuyente: null,
    })
  }

  async getDocumentos() {
    this.lcargando.ctlSpinner(true);
    
    try {
      this.msgSpinner = 'Cargando Documentos'
      let response = await this.apiService.getDocumentos({
        params: {
          filter: this.filter,
          paginate: this.paginate,
        }
      });
      response.data.map((item: any) => {
        item.fecha = moment(item.fecha).format('YYYY-MM-DD')
      })
      this.paginate.length = response.total
      this.documentos = response.data

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err);
      this.lcargando.ctlSpinner(false);
    }
  }

  selectDocumento(documento: any) {
    this.apiService.$documentoSelected.emit(documento);
    this.activeModal.close()
  }

}
