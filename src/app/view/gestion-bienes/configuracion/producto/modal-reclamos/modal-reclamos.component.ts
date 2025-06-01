import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IReclamo } from './IReclamos';
import * as moment from 'moment';
import { ProductoService } from '../producto.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-reclamos',
  templateUrl: './modal-reclamos.component.html',
  styleUrls: ['./modal-reclamos.component.scss']
})
export class ModalReclamosComponent implements OnInit {
  @Input() producto: any;
  fTitle: string = 'Registro de Reclamos';
  vmButtons: Array<any> = [];

  @Input() reclamo: IReclamo;
  estados: Array<any>;

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: ProductoService,
    private toastr: ToastrService,
  ) {
    if (this.reclamo == undefined) {
      this.reclamo = {
        fecha: moment().format('YYYY-MM-DD'),
        estado: 'P',
        observacion_inicial: null,
      }
    }

    this.estados = [
      { value: 'P', label: 'Pendiente' },
      { value: 'C', label: 'Cerrado' },
    ]
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsModalReclamos", 
        paramAccion: "1", 
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
        habilitar: this.reclamo.id
      },
      {
        orig: "btnsModalReclamos", 
        paramAccion: "1", 
        boton: { icon: "fa fa-floppy-o", texto: "ACTUALIZAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-primary boton btn-sm", 
        habilitar: !this.reclamo.id
      },
      {
        orig: "btnsModalReclamos", 
        paramAccion: "1", 
        boton: { icon: "fa fa-window-close", texto: "CANCELAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-warning boton btn-sm", 
        habilitar: false 
      },
    ]
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CANCELAR":
        this.activeModal.close();
        break;
      case "ACTUALIZAR":
        this.updateReclamo();
        break;
      case "GUARDAR":
        this.setReclamo();
        break;
    
      default:
        break;
    }
  }

  async setReclamo() {
    let producto = this.producto;
    let reclamo = this.reclamo;
    try {
      let response = await this.apiService.setReclamo({ producto, reclamo });
      console.log(response)
      this.apiService.setReclamo$.emit(response)
      this.activeModal.close()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error.message, 'Error almacenando Reclamo')
    }
  }

  async updateReclamo() {
    let reclamo = this.reclamo
    try {
      let response = await this.apiService.updateReclamo(reclamo.id, { reclamo });
      console.log(response)

      this.activeModal.close();
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error.message, 'Error actualizando Reclamo')
    }
  }

}
