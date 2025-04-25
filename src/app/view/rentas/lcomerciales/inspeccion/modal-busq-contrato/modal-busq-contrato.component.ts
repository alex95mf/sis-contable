import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';

import { InspeccionService } from '../inspeccion.service';

@Component({
  selector: 'app-modal-busq-contrato',
  templateUrl: './modal-busq-contrato.component.html',
  styleUrls: ['./modal-busq-contrato.component.scss']
})
export class ModalBusqContratoComponent implements OnInit {
  @Input() contribuyente: any
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  fTitle = 'Busqueda de Contratos'
  msgSpinner: string
  vmButtons: any[] = []
  contratos: any[] = []

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: InspeccionService,
    private toastr: ToastrService,
    private commonVarService: CommonVarService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsLcomBusqContrato",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(() => {
      this.getContratosContribuyente()
    }, 75)
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  getContratosContribuyente() {
    this.msgSpinner = 'Cargando Contratos'
    this.lcargando.ctlSpinner(true)
    this.apiService.getContratos({contribuyente: this.contribuyente}).subscribe(
      res => {
        // console.log(res)
        res['data'].forEach(elem => {
          let obj = {
            id: elem.id_mercado_contrato,
            mercado_id: elem.fk_mercado.id_catalogo,
            mercado: elem.fk_mercado.valor,
            puesto_id: elem.fk_mercado_puesto.id_mercado_puesto,
            puesto: elem.fk_mercado_puesto.numero_puesto,
            numero_contrato: elem.numero_contrato,
            fecha_inicio: elem.fecha_inicio,
            fecha_vencimiento: elem.fecha_vencimiento,
            estado: elem.estado
          }
          this.contratos.push({...obj})
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Contratos')
      }
    )
  }

  selectContrato(contrato) {
    this.commonVarService.selectContratoContribuyente.next(contrato)
    this.activeModal.dismiss()
  }

}
