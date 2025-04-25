import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { ConsultaService } from '../consulta.service';

@Component({
  selector: 'app-show-diario',
  templateUrl: './show-diario.component.html',
  styleUrls: ['./show-diario.component.scss']
})
export class ShowDiarioComponent implements OnInit {
  @Input() info: any;
  total_debito: any;
  total_credito: any;
  validaDt: any;
  dataDT: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private cstSrv: ConsultaService
  ) { }

  vmButtons:any = [];

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnShowDI", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false}
    ];
    this.getTableDiario();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.closeModal();
        break;
    }   
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  getTableDiario() {
    let data = {
      fk_cont_mov_cab: this.info.fk_cont_mov_cab
    }
    this.cstSrv.getDiario(data).subscribe(res => {
      this.validaDt = true;
      this.dataDT = res['data']['maping'];
      this.dataDT.forEach(element => {
        element['valor_deb'] = parseFloat(element['valor_deb']).toFixed(2);
        element['valor_cre'] = parseFloat(element['valor_cre']).toFixed(2);
      });
      this.total_credito = parseFloat(res['data']['total_credito']).toFixed(2);
      this.total_debito = parseFloat(res['data']['total_debito']).toFixed(2);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

}
