import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CierreService } from '../cierre.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

@Component({
standalone: false,
  selector: 'app-show-denomination-cierre',
  templateUrl: './show-denomination-cierre.component.html',
  styleUrls: ['./show-denomination-cierre.component.scss']
})
export class ShowDenominationCierreComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  @Input() info: any;
  dataDT: any = [];
  validaDt: any = false;
  total: any = 0;
  infoNavigated: any = [];
  total_cuadre:any;

  constructor(
    private cierreSrv: CierreService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService
  ) { }

  ngOnInit(): void {
    /* console.log(this.info);
    if (this.info != null) {
      this.dataDT = [];
      this.dataDT = this.info['informacion'];
      this.total = this.info['total'];
      this.validaDt = true;
    } else {
      this.getDataTableDenominations();
    } */
    this.total_cuadre = parseFloat(this.info['total_venta_periodo']).toFixed(2);
    this.getDataTableDenominations();
  }

  getDataTableDenominations() {
    this.cierreSrv.getDenominations()
      .subscribe(res => {
        this.validaDt = true;
        this.dataDT = res['data'][0]['denominations'];
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  calculated(i) {
    this.dataDT[i].total_denom = 0;
    this.total = 0;
    this.dataDT[i].total_denom = (parseFloat(this.dataDT[i].denominacion) * parseFloat(this.dataDT[i].cantidad)).toFixed(2);

    this.dataDT.forEach(element => {
      this.total = (parseFloat(this.total) + parseFloat(element['total_denom'])).toFixed(2);
    });
  }

  calculatedOthers(i) {
    this.dataDT[i].denominacion = parseInt(this.dataDT[i].denominacion) + 1 ;  
    this.total = 0;
    this.dataDT[i].total_denom = (parseFloat(this.dataDT[i].total_denom) + parseFloat(this.dataDT[i].cantidad)).toFixed(2);
    this.dataDT.forEach(element => {
      this.total = (parseFloat(this.total) + parseFloat(element['total_denom'])).toFixed(2);
    });
    this.dataDT[i].cantidad = 0;
  }

  registerTotal() {
    Swal.fire({
      title: "Atención!!",
      text: "Seguro desea registrar el valor total?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.infoNavigated['informacion'] = this.dataDT;
        this.infoNavigated['total'] = this.total;
        this.commonVarSrvice.setValueCajaCierre.next(this.infoNavigated);
        this.closeModal();
      }
    })
  }

  cancel(){
    this.total = 0;
    this.getDataTableDenominations();
  }

  parsearNum(num){
    return parseFloat(num);
  }

}
