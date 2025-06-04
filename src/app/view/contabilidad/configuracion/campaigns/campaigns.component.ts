import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { CampaignsService } from './campaigns.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCampaignDetailsComponent } from './modal-campaign-details/modal-campaign-details.component';

@Component({
standalone: false,
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mensajeSpinner: string;
  vmButtons: Botonera[] = [];

  filter: any = {
    nombre: null,
    concepto: null,
    fecha_desde: null,
    fecha_hasta: null,
    estado: 'A',
  }

  cmb_concepto: any[] = [];
  cmb_estado: any[] = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ]
  lst_campaigns: any[] = [];
  displayedColumns: string[] = ['nombre', 'fecha_desde', 'fecha_hasta', 'estado', 'acciones']

  constructor(
    private apiService: CampaignsService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsCampaigns',
        paramAccion: '',
        boton: { icon: 'far fa-plus-square', texto: 'NUEVO' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsCampaigns',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsCampaigns',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ]

    this.apiService.updateCampaigns$.subscribe(
      (campaign: any) => {
        this.lst_campaigns.push(campaign)
        this.table.renderRows()
      }
    )
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.getConceptos()
      await this.getCampaigns()
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  async metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "NUEVO":
        this.nuevaCampana();
        break;
      case "CONSULTAR":
        this.lcargando.ctlSpinner(true)
        await this.getCampaigns()
        this.lcargando.ctlSpinner(false)
        break;
      case "LIMPIAR":
        this.limpiarFilter()
        break;
    
      default:
        break;
    }
  }

  async getCampaigns() {
    try {
      this.mensajeSpinner = 'Cargando Campañas'
      let descuentos = await this.apiService.getCampaigns({params: { filter: this.filter }})
      console.log(descuentos)
      this.lst_campaigns = descuentos
      this.table.renderRows()
    } catch (err) {
      this.toastr.error(err.error?.message, 'Error cargando Campañas')
    }
  }

  async getConceptos() {
    try {
      this.mensajeSpinner = 'Cargando Conceptos'
      let conceptos = await this.apiService.getConceptos();
      console.log(conceptos)
      this.cmb_concepto = conceptos
    } catch (err) {
      this.toastr.error(err.error?.message, 'Error cargando Campañas')
    }
  }

  nuevaCampana() {
    const modal = this.modalService.open(ModalCampaignDetailsComponent, { size: 'xl', backdrop: 'static' })
  }
  
  viewDetalles(campaign: any) {
    const modal = this.modalService.open(ModalCampaignDetailsComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.campaign_id = campaign.id
  }

  limpiarFilter() {
    Object.assign(this.filter, {
      nombre: null,
      concepto: null,
      fecha_desde: null,
      fecha_hasta: null,
      estado: 'A',
    }) 
  }
}
