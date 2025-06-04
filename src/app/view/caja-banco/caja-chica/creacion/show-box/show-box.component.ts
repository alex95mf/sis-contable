import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { CreacionService } from '../../creacion/creacion.service'

@Component({
standalone: false,
  selector: 'app-show-box',
  templateUrl: './show-box.component.html',
  styleUrls: ['./show-box.component.scss']
})
export class ShowBoxComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;
  vmButtons: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private accSrv: CreacionService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsCajaBoxList", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
    ];
    this.getTableAccounts();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "CERRAR2":
        this.closeModal();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  getTableAccounts() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    this.accSrv.getBoxSmall()
      .subscribe(res => {
        this.validaDt = true;
        this.dataDT = res['data'];
        this.dataDT.forEach(element => {
          element['monto']
        });
        Object.keys(this.dataDT).forEach(key => {
          this.dataDT[key].monto = parseFloat(this.dataDT[key].monto).toFixed(2);
          this.dataDT[key].mov_minimo = parseFloat(this.dataDT[key].mov_minimo).toFixed(2);
        })
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
        this.toastr.info(error.error.message);
      });
  }

  setDataBox(dt) {
    this.commonVarSrvice.listenBoxSmall.next(dt);
    this.closeModal();
  }

}
