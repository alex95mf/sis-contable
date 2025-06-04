import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import Swal from 'sweetalert2';
import { CampaignsService } from '../campaigns.service';

interface Campaign {
  id?: number
  nombre: string
  fecha_desde: string
  fecha_hasta: string
  estado: string
  conceptos: Concepto[]
}

interface Concepto {
  id?: number
  id_concepto: number
  cod_concepto: string
  nom_concepto: string
  valor: number
  porcentaje: number
}

@Component({
standalone: false,
  selector: 'app-modal-campaign-details',
  templateUrl: './modal-campaign-details.component.html',
  styleUrls: ['./modal-campaign-details.component.scss']
})
export class ModalCampaignDetailsComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatTable) table: MatTable<any>;
  @Input() campaign_id: number;
  vmButtons: Botonera[];
  mensajeSpinner: string;

  concepto: any = {
    id_concepto: null,
    cod_concepto: null,
    nom_concepto: null,
    valor: 0,
    porcentaje: 0,
  }

  campaign: Campaign = {
    nombre: null,
    fecha_desde: null,
    fecha_hasta: null,
    estado: 'A',
    conceptos: []
  };

  cmb_concepto: any[] = []
  lst_concepto: any[] = [];
  lst_concepto_del: any[] = [];
  displayedColumns: string[] = ['concepto', 'valor', 'porcentaje', 'acciones'];

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: CampaignsService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalCampaigns',
        paramAccion: '',
        boton: { icon: 'far fa-save', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsModalCampaigns',
        paramAccion: '',
        boton: { icon: 'far fa-edit', texto: 'MODIFICAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsModalCampaigns',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'CERRAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.cargarConceptos()
      if (this.campaign_id) {
        await this.getCampaign(this.campaign_id)
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = false
      }
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  async cargarConceptos() {
    try {
      this.mensajeSpinner = 'Cargando Conceptos'
      let conceptos = await this.apiService.getConceptos();
      this.cmb_concepto = conceptos
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Conceptos')
    }
  }

  async metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        await this.setCampaign()
        break;
      case "MODIFICAR":
        await this.updateCampaign()
        break;
      case "CERRAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  async getCampaign(id: number) {
    try {
      this.mensajeSpinner = 'Cargando Campaña'
      let descuento = await this.apiService.getCampaign(id)
      Object.assign(descuento, {
        fecha_desde: descuento.fecha_inicio,
        fecha_hasta: descuento.fecha_finalizacion,
      })
      this.campaign = descuento
      this.lst_concepto = descuento.detalles
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Campaña')
    }
  }

  async agregarConcepto() {
    let message: string = ''
    if (this.concepto.cod_concepto == null) message += '* No ha seleccionado un Concepto<br>'
    if (this.concepto.valor == 0 && this.concepto.porcentaje == 0) message += '* No ha ingresado un Valor o Porcentaje de descuento<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion', {enableHtml: true})
      return;
    }

    let result = await Swal.fire({
      titleText: 'Agregar Concepto',
      text: 'Esta seguro/a de agregar este Concepto?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Agregar',
    })

    if (result.isConfirmed) {
      this.lst_concepto.push({...this.concepto})
      this.table.renderRows()

      Object.assign(this.concepto, {
        cod_concepto: null,
        valor: 0,
        porcentaje: 0,
      })
    }
  }

  async removeConcepto(concepto: any, index: number) {
    let result = await Swal.fire({
      titleText: 'Eliminar Concepto',
      text: 'Esta seguro/a de eliminar este Concepto?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {
      if (concepto.id) {
        this.lst_concepto_del.push(concepto.id)
      }
      this.lst_concepto.splice(index, 1)
      this.table.renderRows()
    }
  }

  handleSelectConcepto(concepto: any) {
    if (concepto) {
      Object.assign(this.concepto, {
        id_concepto: concepto.id_concepto,
        nom_concepto: concepto.nombre,
      })
    } else {
      Object.assign(this.concepto, {
        id_concepto: null,
        nom_concepto: null,
      })
    }
  }

  async setCampaign() {
    let message: string = ''
    if (this.campaign && (this.campaign.nombre == undefined || this.campaign.nombre == null || this.campaign.nombre.trim() == '')) message += '* No ha ingresado un Nombre.<br>'
    if (this.campaign && (this.campaign.fecha_desde == undefined || this.campaign.fecha_desde == null)) message += '* No ha ingresado una Fecha de Inicio.<br>'
    if (this.campaign && (this.campaign.fecha_hasta == undefined || this.campaign.fecha_hasta == null)) message += '* No ha ingresado una Fecha de Finalizacion.<br>'
    if (!this.lst_concepto.length) message += '* No ha agregado Conceptos.<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion', { enableHtml: true })
      return;
    }

    let result = await Swal.fire({
      titleText: 'Almacenar Campaña',
      text: 'Esta seguro/a de almacenar esta campaña?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Almacenar',
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        Object.assign(this.campaign, { conceptos: this.lst_concepto })
        this.mensajeSpinner = 'Almacenando Campaña'
        let campaign = await this.apiService.setCampaign({ campaign: this.campaign })
        console.log(campaign)
        //
        this.lcargando.ctlSpinner(false)
        Swal.fire('Campaña alcamenada correctamente', '', 'success').then(() => {
          this.apiService.updateCampaigns$.emit(campaign)
          this.activeModal.close()
        })
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error almacenando Campaña')
      }
    }
  }

  async updateCampaign() {
    let result = await Swal.fire({
      titleText: 'Actualizar Campaña',
      text: 'Esta seguro/a de actualizar esta campaña?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Actualizar',
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        Object.assign(this.campaign, {
          conceptos: this.lst_concepto,
          conceptos_del: this.lst_concepto_del
        })
  
        this.mensajeSpinner = 'Actualizando Campaña'
        let response = await this.apiService.putCampaign(this.campaign.id, {campaign: this.campaign})
        console.log(response)
        //
        this.lcargando.ctlSpinner(false)
        Swal.fire('Campaña actualizada correctamente', '', 'success').then(() => {
          this.activeModal.close()
        })
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error actualizando Campaña')
      }
    }
  }

}
