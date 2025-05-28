import { Component, OnInit, ViewChild } from '@angular/core';
import { FeriasService } from './ferias.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import moment from 'moment';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { ModalFeriasComponent } from './modal-ferias/modal-ferias.component';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-ferias',
  templateUrl: './ferias.component.html',
  styleUrls: ['./ferias.component.scss']
})
export class FeriasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatTable) table: MatTable<any>;
  msgSpinner: string;
  vmButtons: Botonera[];

  filter: any = {
    contribuyente: null,
    fecha_inicio: null,
    fecha_finalizacion: null,
    estado: 'A',
  }

  paginate: any = {
    pageIndex: 0,
    page: 1,
    perPage: 20,
    total: 0,
  }

  cmb_estado: any[] = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ]
  lst_ferias: any[] = [];
  displayedColumns: string[] = ['contribuyente', 'nombre', 'inicio', 'finalizacion', 'estado', 'acciones']

  constructor(
    private apiService: FeriasService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsFerias',
        paramAccion: '',
        boton: { icon: 'far fa-plus-square', texto: 'NUEVO' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsFerias',
        paramAccion: '',
        boton: { icon: 'far fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsFerias',
        paramAccion: '',
        boton: { icon: 'far fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
    ]

    this.apiService.createTable$.subscribe(
      (feria: any) => {
        this.lst_ferias.push(feria)
        this.table.renderRows()
      }
    )

    this.apiService.updateTable$.subscribe(
      async () => {
        this.lcargando.ctlSpinner(true)
        await this.getFerias()
        this.lcargando.ctlSpinner(false)
      }
    )
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.getFerias()
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  async metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "NUEVO":
        this.modalService.open(ModalFeriasComponent, {size: 'xl', backdrop: 'static'})
        break;
      case "CONSULTAR":
        this.lcargando.ctlSpinner(true)
        await this.getFerias()
        this.lcargando.ctlSpinner(false)
        break;
      case "LIMPIAR":
        Object.assign(this.filter, {
          contribuyente: null,
          fecha_inicio: null,
          fecha_finalizacion: null,
          estado: 'A',
        })
        break;

      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { pageIndex: 0, page: 1 })
    this.getFerias()
  }

  async getFerias() {
    try {
      this.msgSpinner = 'Cargando Ferias'
      let ferias = await this.apiService.getFerias({params: {filter: this.filter, paginate: this.paginate}})
      console.log(ferias)
      this.paginate.total = ferias.total
      this.lst_ferias = ferias.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  verDetalles(id: number) {
    const modal = this.modalService.open(ModalFeriasComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.feria_id = id
  }

}
