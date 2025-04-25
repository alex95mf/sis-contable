import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../../../services/commonServices';
import { CommonVarService } from '../../../../../services/common-var.services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-supplier',
  templateUrl: './show-supplier.component.html',
  styleUrls: ['./show-supplier.component.scss']
})
export class ShowSupplierComponent implements OnInit {
  @Input() info: any;
  vmButtons: any;

  constructor(public activeModal: NgbActiveModal, private commonServices: CommonService,
    private commonVarServices: CommonVarService,) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsConsultProveedor", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

}
