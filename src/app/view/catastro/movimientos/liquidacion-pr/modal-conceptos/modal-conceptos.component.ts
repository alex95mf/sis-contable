import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { LiquidacionPrService } from '../liquidacion-pr.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-modal-conceptos',
  templateUrl: './modal-conceptos.component.html',
  styleUrls: ['./modal-conceptos.component.scss']
})
export class ModalConceptosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() conceptosArr: any[];
  msgSpinner: string = "Cargando...";
  vmButtons: Botonera[] = [];

  paginate: any = {
    perPage: 8,
    page: 1,
    pageIndex: 0,
    length: 0,
  };
  filter: any = {
    codigo_detalle: null,
    nombre_detalle: null,
  };

  lst_concepto: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private apiService: LiquidacionPrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalConceptos',
        paramAccion: '',
        boton: { icon: 'fas fa-save', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: "btnsModalConceptos",
        paramAccion: "",
        boton: {icon: "fas fa-eraser", texto: "LIMPIAR" },
        clase: "btn btn-warning boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsModalConceptos",
        paramAccion: "",
        boton: {icon: "fas fa-eraser", texto: "APLICAR" },
        clase: "btn btn-success boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsModalConceptos",
        paramAccion: "",
        boton: {icon: "fas fa-window-close", texto: "CERRAR" },
        clase: "btn btn-danger boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.getConceptos(), 0);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar();
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      case "CERRAR":
        this.activeModal.close()
        break;
      case "APLICAR":
        let filteredConceptos = this.lst_concepto.filter((item: any) => item.aplica)
        this.apiService.conceptoSelected$.emit(filteredConceptos)
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { pageIndex: 0, page: 1})
    this.getConceptos();
  }

  changePaginate(event: PageEvent) {
    Object.assign(this.paginate, { page: event.pageIndex + 1 });
    this.getConceptos();
  }

  async getConceptos() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = "Cargando Conceptos";
      let conceptos = await this.apiService.getConceptos({codigo: 'PR', params: { filter: this.filter, paginate: this.paginate}})
      conceptos.data.map((item: any) => Object.assign(item, { aplica: false }))
      this.conceptosArr.forEach((c: any) => conceptos.data.find((f: any) => f.id_concepto_detalle == c.id_concepto_detalle).aplica = true)
      console.log(conceptos)
      this.paginate.length = conceptos.total
      this.lst_concepto = conceptos.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false);
      this.toastr.error(err.error?.message);
    }
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      codigo: null,
      descripcion: null,
    })
  }
}
