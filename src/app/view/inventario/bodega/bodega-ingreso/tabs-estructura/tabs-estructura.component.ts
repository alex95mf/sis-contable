import { Component, OnInit,ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {BodegaIngresoServices} from '../bodega-ingreso.services'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/commonServices'

@Component({
  selector: 'app-tabs-estructura',
  templateUrl: './tabs-estructura.component.html',
  styleUrls: ['./tabs-estructura.component.scss']
})
export class TabsEstructuraComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  //dtOptions: DataTables.Settings = {};
  dtOptions: any = {};
  dtTrigger = new Subject();
  dataT: any = [];
  validaDtBodega: any = false;
  dataBodega:any;

  constructor(
                private bodegaService:BodegaIngresoServices,
                private toastr: ToastrService,
                private commonServices:CommonService
             )
           {
             this.commonServices.refreshDataTableStruct.asObservable().subscribe(res =>{
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
    this.bodegaService.getEstruture()
      .subscribe(res => {
        this.validaDtBodega = true;
        this.dataBodega = res['data'];
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }, error => {
        this.validaDtBodega = false;
        //this.toastr.info(error.error.message);
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updateBodega(dt){
    this.commonServices.setDataStruc.next(dt);
  }

  rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();    
        this.getDataTable();
      });
  }
}
