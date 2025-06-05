import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { LiquidacionService } from '../liquidacion.service';

@Component({
standalone: false,
  selector: 'app-modal-valores-cobrar',
  templateUrl: './modal-valores-cobrar.component.html',
  styleUrls: ['./modal-valores-cobrar.component.scss']
})
export class ModalValoresCobrarComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @Input() orden_inspeccion;
  @Input() seleccionados: Array<any>;

  vmButtons: any;
  mensajeSpinner: string

  filter: any;
  paginate: any;

  impuestos: Array<any> = [];

  constructor(
    private apiService: LiquidacionService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnModalImpuestos", paramAccion: "", boton: { icon: "fas fa-plus", texto: " APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalImpuestos", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => this.getImpuestos(), 50)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close();
        break;
      case " APLICAR":
        this.seleccionarImpuestos()
        break;
    }
  }

  async getImpuestos() {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Cargando Impuestos'
      let response = await this.apiService.getValoresPorCobrar({
        orden_inspeccion: { numero: this.orden_inspeccion.numero_orden },
        impuestos: ['PESAYMEDIDA', 'INTRODUCTOR', 'LOCALES TURISTICOS', 'PATENTE', 'VIA PUBLICA', '1,5', 'LETREROS']
      });
      response.map((item: any) => {
        let existing = this.seleccionados.find((seleccionado: any) => seleccionado.id_inspeccion_orden_cobrar == item.id_inspeccion_orden_cobrar)
        Object.assign(item, { 
          aplica: existing != undefined, 
          exoneraciones: (existing != undefined && existing.exoneraciones?.length > 0 ) ? existing.exoneraciones : [] 
        })
      })

      this.impuestos = response
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Impuestos')
    }
    
  }

  seleccionarImpuestos() {
    let seleccionados = this.impuestos.filter((item: any) => item.aplica == true)
    this.apiService.$conceptoSelected.emit(seleccionados)
    this.activeModal.close()
  }

}
