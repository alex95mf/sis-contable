import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ParametroService } from '../../../parametro.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices'

@Component({
standalone: false,
  selector: 'app-table-sucursal',
  templateUrl: './table-sucursal.component.html',
  styleUrls: ['./table-sucursal.component.scss']
})
export class TableSucursalComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  dataT: any = [];
  @Input() data_consultar_sucursal: any;
  validaDt: any = false;
  validaDtUser: any = false;
  guardarolT: any = [];
  contador = 0;
  constructor(private toastr: ToastrService, private parametroServices: ParametroService, private commonServices: CommonService) { }

  ngOnInit(): void {
    this.contador += 1;
    if (this.contador == 1) {
      this.getDataTable(this.data_consultar_sucursal);
    } else {
      this.rerender(this.data_consultar_sucursal);
    }
  }

  getDataTable(data) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      /* scrollY: "200px",
      scrollCollapse: true, */
      order: [[0, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.parametroServices.getSucursal(data)
      .subscribe(res => {
        this.validaDtUser = true;
        this.guardarolT = res;
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.validaDtUser = true;
        this.guardarolT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
        this.toastr.info(error.error.message);
      });
  }

  rerender(data): void {
    this.validaDtUser = false;
    this.guardarolT = [];
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getDataTable(data);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updateSucursal(dt) {
    this.commonServices.setDataSucursal.next(dt);
  }
}
