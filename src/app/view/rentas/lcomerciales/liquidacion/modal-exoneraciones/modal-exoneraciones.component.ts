import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { LiquidacionService } from '../liquidacion.service';

@Component({
standalone: false,
  selector: 'app-modal-exoneraciones',
  templateUrl: './modal-exoneraciones.component.html',
  styleUrls: ['./modal-exoneraciones.component.scss']
})
export class ModalExoneracionesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @Input() contribuyente: any;
  @Input() impuesto: any;
  @Input() idx: number;

  vmButtons: any;
  mensajeSpinner: string

  exoneraciones: Array<any> = [];

  constructor(
    private apiService: LiquidacionService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnModalExoneraciones", paramAccion: "", boton: { icon: "fas fa-plus", texto: "APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalExoneraciones", paramAccion: "", boton: { icon: "fas fa-window-close", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => this.cargarExoneraciones(), 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close();
        break;
      case "APLICAR":
        this.aplicarExoneraciones()
        break;
    }
  }

  async cargarExoneraciones() {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Cargando Exoneraciones'
      const response = await this.apiService.getExoneraciones({contribuyente: this.contribuyente.id_cliente, concepto: {codigo: 'LC'}})
      let exon_response = response.filter((element: any) => element.cod_concepto_det_aplicable == this.impuesto.codigo_detalle)
      exon_response.forEach((element: any) => Object.assign(element, {aplica: false}))
      // Marcar los ya seleccionados
      if (this.impuesto.exoneraciones.length > 0) {
        this.impuesto.exoneraciones.forEach((exoneracion: any) => {
          Object.assign(exon_response.find((element: any) => element.id == exoneracion.id), {aplica: true})
        })
      }
      
      this.exoneraciones = exon_response
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Exoneraciones')
    }
  }

  aplicarExoneraciones() {
    let seleccionados = this.exoneraciones.filter((item: any) => item.aplica == true)
    this.apiService.$exoneracionesSelected.emit({impuesto: this.impuesto, idx: this.idx, exoneraciones: seleccionados})
    this.activeModal.close()
  }

}
