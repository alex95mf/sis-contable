import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { EgresosBodegaService } from '../egresos-bodega.service';
import { ToastrService } from 'ngx-toastr';

@Component({
standalone: false,
  selector: 'app-modal-producto-detalles',
  templateUrl: './modal-producto-detalles.component.html',
  styleUrls: ['./modal-producto-detalles.component.scss']
})
export class ModalProductoDetallesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() producto: any;
  @Input() bodega: any
  @Input() disabled: boolean;
  vmButtons: Array<any> = [];
  mensajeSpinner: string = "Cargando...";

  lotes: Array<any> = [];

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: EgresosBodegaService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      { 
        orig: "btnsModalProductoDetalles", 
        paramAccion: "", 
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
        habilitar: false 
      },
      { 
        orig: "btnsModalProductoDetalles", 
        paramAccion: "", 
        boton: { icon: "fa fa-window-close", texto: "CERRAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-danger boton btn-sm", 
        habilitar: false 
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.cargarLotes(this.producto), 50)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        let message = '';
        
        // Revisar si cantidad_egreso total es igual a quantity
        let total_desglose = this.lotes.reduce((acc, curr) => acc + parseInt(curr.cantidad_egreso), 0);
        if (total_desglose != this.producto.quantity) message += '* Cantidad Egresada no equivale a las solicitadas en el Egreso.<br>';
        this.lotes.forEach((lote: any, index: number) => {
          if (lote.cantidad_egreso > lote.disponible) message += `* Item ${index + 1}: Cantidad Egresada es superior a la Disponible.<br>`
        })

        if (message.length > 0) {
          this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
          return;
        }

        
        
        let producto = this.producto;
        let desglose = this.lotes.filter((item: any) => item.cantidad_egreso != 0);
        this.apiService.cantEgreso$.emit({producto, desglose})
        this.activeModal.close();
        break;

      case "CERRAR":
        this.activeModal.close();
    
      default:
        break;
    }
  }

  async cargarLotes(producto: any) {
    if (producto.desglose != undefined || producto.desglose != null) {
      this.lotes =  producto.desglose;
    } else {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Obteniendo Lotes del Producto'
        let response: any = await this.apiService.getDetalles({producto: this.producto.id_producto, bodega: this.bodega});
        response.data.map((item: any) => Object.assign(item, { cantidad_egreso: 0, fk_producto_det: item.id }))
        console.log(response)
        this.lotes = response.data
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
      }
    }
  }

  /* validarCantidad() {
    let cantidad_egreso = this.lotes.reduce((acc, curr) => acc + parseInt(curr.cantidad_egreso), 0);
    if (cantidad_egreso > this.producto.quantity) {
      this.vmButtons[0].habilitar = true;
      this.toastr.warning('Desglose supera la cantidad Egresada')
    } else {
      this.vmButtons[0].habilitar = false;
    }
  } */

}
