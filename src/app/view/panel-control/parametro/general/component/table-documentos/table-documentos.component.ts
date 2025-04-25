import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { ParametroService } from '../../../parametro.service';
import { CommonService } from '../../../../../../services/commonServices'
import { CommonVarService } from '../../../../../../services/common-var.services'

@Component({
  selector: 'app-table-documentos',
  templateUrl: './table-documentos.component.html',
  styleUrls: ['./table-documentos.component.scss']
})
export class TableDocumentosComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  @Input() payload_document: any;

  documents: Array<any> = [];
  isComplete: any = false;

  constructor(private toastr: ToastrService, private paramSrv: ParametroService, private commonServices: CommonService,
    private commonVarServices: CommonVarService) {
    this.commonServices.dtSModifyDocuments.asObservable().subscribe(res => {
      this.rerender();
    });
  }

  ngOnInit(): void {
    this.getDTDocuments();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.documents = [];
      this.getDTDocuments();
    });
  }

  getDTDocuments() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      order: [[0, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    this.paramSrv.getSisDocuments()
      .subscribe(res => {
        this.commonVarServices.updPerm.next(false);
        this.isComplete = true;
        this.documents = res['data'];
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }, error => {
        this.commonVarServices.updPerm.next(false);
        this.isComplete = true;
        this.documents = [];
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      });
  }

  updateDocument(dt) {
    this.commonServices.dtSystemDocuments.next(dt);
  }
}
