import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { LiquidacionPrService } from '../liquidacion-pr.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: 'app-modal-contribuyente',
  templateUrl: './modal-contribuyente.component.html',
  styleUrls: ['./modal-contribuyente.component.scss']
})
export class ModalContribuyenteComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  
  vmButtons: Botonera[] = [];

  paginate: any = {
    perPage: 8,
    page: 1,
    pageIndex: 0,
    length: 0,
  };
  filter: any = {
    num_documento: null,
    razon_social: null,
  };

  lst_contribuyente: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private apiService: LiquidacionPrService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsContribuyenteForm",
        paramAccion: "",
        boton: {icon: "fas fa-search", texto: "CONSULTAR" },
        clase: "btn btn-primary btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsContribuyenteForm",
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
        orig: "btnsContribuyenteForm",
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
    setTimeout(() => this.cargarContribuyentes(), 0)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.consultar();
        break;
      case "LIMPIAR":
        this.limpiarFiltros();
        break;
      case "CERRAR":
        this.activeModal.close();
        break;
    }
  }

  changePaginate(event: PageEvent) {
    Object.assign(this.paginate, { page: event.pageIndex + 1 });
    this.cargarContribuyentes();
  }

  consultar() {
    Object.assign(this.paginate, { pageIndex: 0, page: 1})
    this.cargarContribuyentes();
  }

  async cargarContribuyentes(){
    this.lcargando.ctlSpinner(true);
    
    try {
      (this as any).mensajeSpinner = "Cargando lista de Contribuyentes...";
      let res = await this.apiService.getContribuyentes({params: { filter: this.filter, paginate: this.paginate }})
      this.paginate.length = res.total
      this.lst_contribuyente = res.data

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false);
      this.toastr.error(err.error?.message);
    }
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      num_documento: null,
      razon_social: null,
    })
  }

  selectOption(data) {
    this.apiService.contribuyenteSelected$.emit(data)
    this.activeModal.close()
  }

}
