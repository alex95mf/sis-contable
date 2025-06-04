import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ParametroadService } from '../../parametroad/parametroad.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/commonServices';
import { CommonVarService } from '../../../../../services/common-var.services';

@Component({
standalone: false,
  selector: 'app-table-cuenta',
  templateUrl: './table-cuenta.component.html',
  styleUrls: ['./table-cuenta.component.scss']
})
export class TableCuentaComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  dataT: any = [];
  @Input() data_carga_cuenta: any;

  validaDtUser: any = false;
  guardarolT: any = [];

  constructor(private toastr: ToastrService, private parametroAdminidtracionSrv: ParametroadService, private commonServices: CommonService,
     private commonVarSrvice: CommonVarService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getDataTable(this.data_carga_cuenta);
    }, 10);


  }

  getDataTable(data) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.parametroAdminidtracionSrv.tablaCuenta(data).subscribe(res => {
        this.validaDtUser = true;
        this.guardarolT = res['data'];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updateCuenta(dt) {
    this.commonVarSrvice.setCuentaData.next(dt);
  }

}
