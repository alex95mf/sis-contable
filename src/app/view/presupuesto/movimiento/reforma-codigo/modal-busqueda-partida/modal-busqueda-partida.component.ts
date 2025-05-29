import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ReformaCodigoService } from '../reforma-codigo.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
standalone: false,
  selector: 'app-modal-busqueda-partida',
  templateUrl: './modal-busqueda-partida.component.html',
  styleUrls: ['./modal-busqueda-partida.component.scss']
})
export class ModalBusquedaPartidaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() origen: string;
  fTitle: string = 'Busqueda de Partidas Presupuestarias'
  filter: any;
  paginate: any;
  msgSpinner: string;
  vmButtons: Array<any>;

  partidas: Array<any> = [];

  constructor(
    private apiService: ReformaCodigoService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsModalBusquedaPartidas",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.filter = {
      codigo: null,
      nombre: null,
    };

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
    };
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getPartidas()
    }, 50)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close();
        break;

      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, {
      page: 1,
      pageIndex: 0,
    })
    this.getPartidas()
  }

  async getPartidas() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Partidas'
      let response: any = await this.apiService.getPartidas({params: { filter: this.filter, paginate: this.paginate }});
      console.log(response); 
      this.paginate.length = response.total
      response.data.map((item: any) => Object.assign(item, { label: `${item.codigo} - ${item.nombre}` }))
      this.partidas = response.data
      
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Partidas')
    }
  }

  selectPartida(partida: any) {
    let response = {
      forDecremento: this.origen == 'decremento',
      forIncremento: this.origen == 'incremento',
      data: partida,
    }
    this.apiService.partidaSelected$.emit(response);
    this.activeModal.close();
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getPartidas();
  }

}
