import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { AsientoCierreService } from '../asiento-cierre.service';
import Botonera from 'src/app/models/IBotonera';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPaginate } from 'src/app/view/contabilidad/auxiliares/IAuxiliares';

@Component({
standalone: false,
  selector: 'app-modal-cuentas-emi',
  templateUrl: './modal-cuentas-emi.component.html',
  styleUrls: ['./modal-cuentas-emi.component.scss']
})
export class ModalCuentasEmiComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() regla: number;
  @Input() tipo: string;
  msgSpinner: string;
  vmButtons: Array<Botonera> = [];
  filter: any;
  paginate: IPaginate;

  cuentas: Array<any> = [];

  constructor(
    private toastr: ToastrService,
    private apiService: AsientoCierreService,
    private activeModal: NgbActiveModal,
  ) { 
    this.vmButtons = [
      {
        orig: 'btnsModalCuentasEmi',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'CERRAR' },
        clase: 'btn btn-sm btn-danger',
        showbadge: false,
        showimg: true,
        showtxt: true,
        permiso: true,
        habilitar: false,
      },
    ];

    this.filter = {
      codigo: null,
      nombre: null,
    };

    this.paginate = {
      pageSize: 7,
      page: 1,
      length: 0,
    };
  }

  ngOnInit(): void {
    setTimeout(() => this.consultarCuentas(), 50);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CERRAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { pageIndex: 0 })
    this.consultarCuentas()
  }

  changePage({pageIndex}) {
    Object.assign(this.paginate, { page: pageIndex + 1})
    this.consultarCuentas()
  }

  async consultarCuentas() {
    let response: any = await this.apiService.consultarCuentaTipoRegla({ 
      tipo: this.tipo, 
      regla: this.regla, 
      params: { filter: this.filter, paginate: this.paginate} 
    });

    this.paginate.length = response.total
    this.cuentas = response.data


    console.log(response)
  }

  onRowSelect(cuenta: any) {
    this.apiService.cuentaEmiSelected$.emit({tipo: this.tipo, cuenta})
    this.activeModal.close()
  }

}
