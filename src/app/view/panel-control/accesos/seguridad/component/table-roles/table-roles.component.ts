import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SeguridadService } from '../../seguridad.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices'
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
  selector: 'app-table-roles',
  templateUrl: './table-roles.component.html',
  styleUrls: ['./table-roles.component.scss']
})
export class TableRolesComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dataT: any = [];
  @Input() data_consultar_rol: any;
  validaDt: any = false;
  validaDtUser: any = false;
  guardarolT: any = [];
  filter: any;
  paginate: any;
  estadoSelected = 0
  estadoList = [
    
    {value: "A",label: "Activo"},
    {value: "I",label: "Inactivo"},
  ]


  constructor(private toastr: ToastrService, private seguridadServices: SeguridadService, private commonServices: CommonService) {

    this.seguridadServices.listaRoles$.subscribe(
      (res)=>{
        console.log(res);
        this.getDataTable();
      }
    )
   }


  ngOnInit(): void {
    this.filter ={
      roles: undefined,
      estado: ['A','I'],
      filterControl: ""
    };

    this.paginate= {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [5, 10,20,50]
    }
    setTimeout(() => {
      this.getDataTable();
    }, 500);
    
  }
  
  asignarEstado(evt) {
    if(evt!=null){
      this.filter.estado = [evt]
    }else{
      this.filter.estado = ['A','I']
    }
   
   } 
  getDataTable(flag: boolean = false) {
    this.lcargando.ctlSpinner(true);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    if (flag) this.paginate.page = 1
    let data = {
      params:{
        filter: this.filter,
        paginate: this.paginate

      },

      
    }

    this.seguridadServices.getRol(data)
      .subscribe(res => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.validaDtUser = true;
        // this.guardarolT = res['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.guardarolT = res['data']['data'];
          
        } else {
          this.guardarolT = Object.values(res['data']['data']);
        }
        console.log(this.guardarolT);
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  limpiarFiltros(){
    this.filter ={
      roles: undefined,
      estado: ['A','I'],
      filterControl: ""
    };

    this.paginate= {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getDataTable();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updaterol(dt) {
    this.commonServices.setDataRol.next(dt);
  }
}
