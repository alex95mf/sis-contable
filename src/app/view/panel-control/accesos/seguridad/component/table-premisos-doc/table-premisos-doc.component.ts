import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SeguridadService } from '../../seguridad.service'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices'
import { CcSpinerProcesarComponent } from '../../../../../../config/custom/cc-spiner-procesar.component';


@Component({
  selector: 'app-table-premisos-doc',
  templateUrl: './table-premisos-doc.component.html',
  styleUrls: ['./table-premisos-doc.component.scss']
})
export class TablePremisosDocComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dataHeader: any = [];
  dataBody: any = [];
  @Input() data_consultar_doc: any;
  validaDt: any = false;

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private toastr: ToastrService,
    private seguridadServices: SeguridadService,
    private commonServices: CommonService
  ) {
    this.commonServices.refreshDataDoc.asObservable().subscribe(res => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.validaDt = false;
        this.dataHeader = [];
        this.dataBody = [];
        let data = {
          filters: res[0].filtros,
          id_doc: res[0].id
        }
        this.getDataTable(data);
      });
    })
    this.commonServices.actionDocCall.asObservable().subscribe(res => {
      this.commonServices.actionDocResponse.next(this.dataBody);
    })
  }

  ngOnInit(): void {
    let data = {
      filters: this.data_consultar_doc[0].filtros,
      id_doc: this.data_consultar_doc[0].id
    }
    setTimeout(() => {
      this.getDataTable(data);
    }, 10);    
  }

  getDataTable(data) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true); 
    this.seguridadServices.getFilterDocPerm(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false); 
        if (res['data']['body'].length > 0) {
          this.commonServices.activateSaveBtn.next();
        }
        this.validaDt = true;
        this.dataHeader = res['data']['header'];
        this.dataBody = res['data']['body'];
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);

      }, error => {
        this.validaDt = true;
        this.dataHeader = [];
        this.dataBody = [];
        this.lcargando.ctlSpinner(false); 
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
        this.toastr.info(error.error.message);
      });
  }

}
