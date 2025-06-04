import { Component, OnInit, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {BodegaIngresoServices} from '../bodega-ingreso.services'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/commonServices'

@Component({
standalone: false,
  selector: 'app-tabs-bodega',
  templateUrl: './tabs-bodega.component.html',
  styleUrls: ['./tabs-bodega.component.scss']
})
export class TabsBodegaComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  // dtOptions: any = {};
  dtOptions: any = {};
  dtTrigger = new Subject();
  dataT: any = [];
  validaDtBodega: any = false;
  dataBodega:any;

  constructor(
                private bodegaService:BodegaIngresoServices,
                private toastr: ToastrService,
                private commonServices:CommonService
             ) {
               this.commonServices.refreshDataTable.asObservable().subscribe(res =>{
                if(!this.validaDtBodega){
                  this.getDataTable();
                }else{
                  this.rerender();
                }
               })
             }

  ngOnInit(): void {
    this.getDataTable();
  }

  getDataTable(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.bodegaService.getInformationCellar()
      .subscribe(res => {
        this.validaDtBodega = true;
        this.dataBodega = res['data'];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.validaDtBodega = false;
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updateBodega(dt){
    this.commonServices.setDataBodega.next(dt);
  }

  rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.getDataTable();
      });
  }
}
