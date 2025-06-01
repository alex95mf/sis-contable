import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ReclasificacionService } from '../reclasificacion.service';
import { IFilter, IProducto, IProductoResponse } from '../IProducto';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-modal-reasignacion',
  templateUrl: './modal-reasignacion.component.html',
  styleUrls: ['./modal-reasignacion.component.scss']
})
export class ModalReasignacionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() producto: IProducto;
  vmButtons: Array<any> = [];
  msgSpinner: string;

  filter: IFilter = {
    codigo: null,
    descripcion: null,
  }
  paginate = {
    perPage: 8,
    page: 1,
    length: 0
  }

  productos: Array<IProducto> = [];

  constructor(
    private apiService: ReclasificacionService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      {
        orig: "btnsModalReasignacion",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "CONSULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsModalReasignacion",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsModalReasignacion",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.cargarProductos(), 50)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CANCELAR":
        this.activeModal.close()
        break;
        case "CONSULAR":
          this.cargarProductos();
          break;
          case "LIMPIAR":
            this.limpiarFiltros();
            break;
    
      default:
        break;
    }
  }

  limpiarFiltros() {





    this.filter = {
      codigo:null,
      descripcion:null,

    }
  }



  async cargarProductos() {
    let response: IProductoResponse = await this.apiService.getProductos({params: {filter: this.filter, paginate: this.paginate}})
    this.paginate.length = response.total;
    this.productos = response.data;
  }

  async reasignar(reasignacion: IProducto) {
    if (this.producto.codigoproducto == reasignacion.codigoproducto) {
      Swal.fire('No puede reasignar al mismo producto', '', 'warning')
      return;
    }
    
    let result = await Swal.fire({
      title: 'Reasignacion de Codigo',
      text: `Seguro/a desea reemplazar el producto ${this.producto.nombre} (${this.producto.codigoproducto}) por ${reasignacion.nombre} (${reasignacion.codigoproducto})?`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Reasignar'
    });

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Reasignando Codigo de Producto'
        // Llamar a API enviando producto anterior y nuevo.
        let response = await this.apiService.reasignar({producto: this.producto, reasignacion: reasignacion})
        console.log(response)

        this.lcargando.ctlSpinner(false)
        Swal.fire('Producto reasignado', '', 'success').then(() => {
          this.apiService.refresh$.emit()
          this.activeModal.close()
        });
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
      }
    }
  }

}
