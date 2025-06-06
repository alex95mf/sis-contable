import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
// import { EmisionArancelesService } from '../emision-aranceles.service';
import { GeneracionService } from '../generacion.service';

@Component({
standalone: false,
  selector: 'app-modal-exon-contribuyente',
  templateUrl: './modal-exon-contribuyente.component.html',
  styleUrls: ['./modal-exon-contribuyente.component.scss']
})
export class ModalExonContribuyenteComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @Input() contribuyente: number;
  @Input() codigo_detalle: string;
  @Input() lote: any;
  @Input() exonSelected: any[];
  mensajeSpinner: string = "Cargando...";

  vmButtons: Botonera[] = [];
  lst_exoneraciones: any = [];

  constructor(
    private apiService: GeneracionService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      { orig: "btnModalExonContribuyente", paramAccion: "", boton: { icon: "fas fa-plus", texto: "APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalExonContribuyente", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
  }

  ngOnInit(): void {
    setTimeout(() => this.getExoneraciones(), 0)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;
      case "APLICAR":
        this.aplicarExoneracion();
        break;
    }
  }

  async getExoneraciones() {
    try {
      this.lcargando.ctlSpinner(true);
      (this as any).mensajeSpinner = 'Cargando Exoneraciones'
      const response = await this.apiService.getExoneraciones({contribuyente: this.contribuyente, lote: this.lote, concepto: {codigo: 'PU'}}) as any
      console.log(response.data)

      const filtered: any[] = response.data.filter((element: any) => element.cod_concepto_det_aplicable == this.codigo_detalle)
      filtered.forEach((element: any) => Object.assign(element, {aplica: false, porcentaje: element.porcentaje * 100}))
      this.lst_exoneraciones = filtered

      // Marca las que ya han sido seleccionadas
      this.lst_exoneraciones.forEach((exoneracion: any) => {
        this.exonSelected.forEach((element: any) => Object.assign(exoneracion, {aplica: exoneracion.id == element.id}))
      })
      //
      this.lcargando.ctlSpinner(false)
    } catch(err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Exoneraciones')
    }
  }

  aplicarExoneracion() {
    // element: exoneracion
    const exoneraciones = this.lst_exoneraciones.filter((element: any) => element.aplica)
    exoneraciones.forEach((element: any) => Object.assign(element, {porcentaje: element.porcentaje / 100}))
    this.apiService.exoneracionContribuyente$.emit({contribuyente_id: this.contribuyente, exoneraciones})
    this.activeModal.close()
  }

}
