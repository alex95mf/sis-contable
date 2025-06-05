import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ParametroService } from '../../../parametro.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices'
import { CommonVarService } from '../../../../../../services/common-var.services'
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
@Component({
standalone: false,
  selector: 'app-table-catalogos',
  templateUrl: './table-catalogos.component.html',
  styleUrls: ['./table-catalogos.component.scss']
})
export class TableCatalogosComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  dataT: any = [];
  @Input() data_consultar_catalogo: any;
  validaDt: any = false;
  validaDtUser: any = false;
  guardarolT: any = [];
  paginate: any;
  filter: any;
  groups: any;
  subgroups: any

  constructor(private toastr: ToastrService, private parametroServices: ParametroService, private commonServices: CommonService,
    private commonVarServices: CommonVarService) { }

  ngOnInit(): void {

    this.filter ={
      tipoCatalogo: undefined,
      subTipo: undefined,
      filterControl: ""
    };

    this.paginate= {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    setTimeout(() => {
      this.getDataTable(this.data_consultar_catalogo);
    }, 500);
  }

  getDataTable(data) {

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = "Cargando informacion... "

    let data1 = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

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

    console.log(data1);
    this.parametroServices.getCatalogos(data1)
      .subscribe(res => {
        // this.lcargando.ctlSpinner(false);
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.guardarolT = res['data']['data'];
        } else {
          this.guardarolT = Object.values(res['data']['data']);
        }
        this.parametroServices.getDistinctCatalog().subscribe(res => {
          this.lcargando.ctlSpinner(false);

          this.groups = res['data'];

        }, error => {
          this.toastr.info(error.error.message);
        })

        this.commonVarServices.updPerm.next(false);
        this.validaDtUser = true;;
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);

      }, error => {
        this.lcargando.ctlSpinner(false);
        console.log(error);
        this.commonVarServices.updPerm.next(false);
        this.validaDtUser = true;
        this.guardarolT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);

      });
  }

  limpiarFiltros(){
    this.filter ={
      tipoCatalogo: undefined,
      subTipo: undefined,
      filterControl: ""
    };

    this.paginate= {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }
  }


  validateSubgroup(event) {
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = "Cargando informacion... "
    console.log(event);
    /* Clear params */

    this.subgroups = [];

    let data = {
      tipo: event
    }
    this.parametroServices.getCatalogByType(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      console.log(res);
      if(res['data'][0]['grupo'] == null || res['data'].length == 0){

      }else {
        console.log(res['data']);
        this.subgroups = res['data'];
      }

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });



    // /* Add new params */
    // if (event == 'MODELOS' || event == 'PROVINCIA' || event == 'CIUDAD') {
    //   this.isSubGroup = true;
    //   this.lbl = (event == 'MODELOS') ? 'Marca' : (event == 'PROVINCIA') ? 'País' : 'Provincia';

    //   let data = {
    //     tipo: (event == 'MODELOS') ? 'MARCAS' : (event == 'PROVINCIA') ? 'PAIS' : 'PROVINCIA',
    //   }
    //   this.seguridadServices.getCatalogByType(data).subscribe(res => {
    //     this.subgroups = res['data'];
    //   }, error => {
    //     this.toastr.info(error.error.message);
    //   });
    // } else {
    //   this.isSubGroup = false;
    //   this.lbl = "";
    // }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getDataTable(this.data_consultar_catalogo);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updateCatalogo(dt) {
    this.commonServices.setDataCatalogo.next(dt);
  }
}
