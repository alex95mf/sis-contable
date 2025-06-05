import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { LiquidacionPrService } from '../liquidacion-pr.service';
import { ToastrService } from 'ngx-toastr';
import Botonera from 'src/app/models/IBotonera';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-modal-exoneraciones',
  templateUrl: './modal-exoneraciones.component.html',
  styleUrls: ['./modal-exoneraciones.component.scss']
})
export class ModalExoneracionesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() codigo_concepto: any;
  @Input() exoneracionesSelect: any = [];
  @Input() configuracion: any;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[];

  exoneraciones: any = [];

  constructor(
    private apiService: LiquidacionPrService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnModalExoner',
        paramAccion: '',
        boton: { icon: 'fas fa-check', texto: 'APLICAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnModalExoner',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'CERRAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(()=> {
      this.cargarExoneraciones();
    }, 0);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "APLICAR":
        let filteredExoneraciones = this.exoneraciones.filter((item: any) => item.action)
        this.apiService.exoneracionesSelected$.emit(filteredExoneraciones)
        this.activeModal.close()
        break;
      case "CERRRAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  cargarExoneraciones() {
    (this as any).mensajeSpinner = "Cargando lista de Exoneraciones..."
    this.lcargando.ctlSpinner(true);

    let data = {concepto: {codigo: 'PR'}, params: { filter: this.configuracion}}

    this.apiService.getExoneraciones(data).subscribe(
      (res) => {
        this.exoneraciones = res['data'];
        this.exoneraciones.forEach(e => Object.assign(e, {action: false}));
        this.exoneracionesSelect.forEach(e => {
          this.exoneraciones.find(f => f.id == e.id).action = true;
        });
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

}
