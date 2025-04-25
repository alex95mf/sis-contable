import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { FacturasSaldoService } from '../facturas-saldo.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-modal-busqueda',
  templateUrl: './modal-busqueda.component.html',
  styleUrls: ['./modal-busqueda.component.scss']
})
export class ModalBusquedaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  vmButtons: Array<Botonera> = [];
  msgSpinner: string;

  displayedColumns: Array<string> = ['num_documento', 'fecha', 'observaciones', 'actions'];
  documentos: Array<any> = []
  dataSource: MatTableDataSource<any>;

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: FacturasSaldoService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalBusquedaDocs',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'REGRESAR' },
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
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando...'
      let documentos = await this.apiService.getCierres({ tipo: 'CCP' })
      console.log(documentos)

      this.dataSource = new MatTableDataSource(documentos)
      this.dataSource.paginator = this.paginator
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  selectCierre(cierre: any) {
    this.apiService.cierreSelected$.emit(cierre)
    this.activeModal.close();
  }

}
