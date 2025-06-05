import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ProductoService } from '../producto.service';
import { ToastrService } from 'ngx-toastr';
import Botonera from 'src/app/models/IBotonera';
import { MatTabChangeEvent } from '@angular/material/tabs';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-modal-udm',
  templateUrl: './modal-udm.component.html',
  styleUrls: ['./modal-udm.component.scss']
})
export class ModalUdmComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Array<Botonera> = [];

  unidad_medida: any = {
    tipo: 'S',  // S: Simple, C: Compuesta
    texto: null,
    id_unidad_primaria: null,
    unidad_primaria: null,
    cantidad: 1,
    id_unidad_secundaria: null,
    unidad_secundaria: null,
  }

  cmb_unidad_primaria: Array<any> = [];
  cmb_unidad_secundaria: Array<any> = [];

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: ProductoService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalUdm',
        paramAccion: '',
        boton: { icon: 'fas fa-floppy-o', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        showbadge: false,
        showimg: true,
        showtxt: true,
        permiso: true,
        habilitar: false,
      },
      {
        orig: 'btnsModalUdm',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'CANCELAR' },
        clase: 'btn btn-sm btn-danger',
        showbadge: false,
        showimg: true,
        showtxt: true,
        permiso: true,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50);
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.setUnidadMedida()
        break;
      case "CANCELAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      let response = await this.apiService.getUdmSimple()
      this.cmb_unidad_primaria = [...response]
      this.cmb_unidad_secundaria = [...response]

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  handleType(event: MatTabChangeEvent) {
    let tipo = (event.index == 0) ? 'S' : 'C';
    Object.assign(this.unidad_medida, { tipo })
  }

  async setUnidadMedida() {
    let result: SweetAlertResult = await Swal.fire({
      title: 'Creacion de Unidad de Medida',
      text: 'Seguro/a desea crear una nueva Unidad de Medida?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        let response = await this.apiService.createUdm({udm: this.unidad_medida});
        console.log(response)

        this.lcargando.ctlSpinner(false)
        Swal.fire('Unidad de Medida Creada', '', 'success').then(() => {
          this.activeModal.close()
          this.apiService.updateUdm$.emit()
        })
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }

  handleSelectPrimaria({id_catalogo, valor}) {
    // console.log(event);
    Object.assign(this.unidad_medida, { id_unidad_primaria: id_catalogo, unidad_primaria: valor })
  }

  handleSelectSecundaria({id_catalogo, valor}) {
    // console.log(event);
    Object.assign(this.unidad_medida, { id_unidad_secundaria: id_catalogo, unidad_secundaria: valor })
  }

}
