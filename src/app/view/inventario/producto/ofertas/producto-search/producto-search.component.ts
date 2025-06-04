import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OfertasServices } from "../ofertas.service";
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/commonServices';
import { CommonVarService } from '../../../../../services/common-var.services';
import { BodegaIngresoServices } from '../../../bodega/bodega-ingreso/bodega-ingreso.services';

@Component({
standalone: false,
  selector: 'app-producto-search',
  templateUrl: './producto-search.component.html',
  styleUrls: ['./producto-search.component.scss']
})
export class ProductoSearchComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  dataT: any = [];
  @Input() data_carga_product: any;

  validaDtUser: any = false;
  guardarolT: any = [];
  products: Array<any> = [];
  dataGrupo: any = [];

  producto:any;
  grupo:any;
  almacen:any;
  filters: any = [];
  dataCatalogo: any;
  flag: number = 0;
  almacenData:any = false;

  constructor(private toastr: ToastrService,  private ofertasSrv: OfertasServices, private commonServices: CommonService,
    private commonVarSrvice: CommonVarService, private bodegaService: BodegaIngresoServices,) { }

  ngOnInit(): void {

    this.getDataTable();
    this.getProductos();
    this.getCiudades();

  }

  getDataTable() {
    const data = {
      data:  this.data_carga_product,
    };
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
    this.ofertasSrv.tablaProducto(data)
      .subscribe(res => {
        this.validaDtUser = true;
        this.flag += 1;
        this.guardarolT = res['data'];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.dtTrigger.next(null);
      });
  }

  getDataTabledos() {

    let data = {
      producto: this.producto == undefined ? null : this.producto,
      grupo: this.grupo == undefined ? null : this.grupo,
      almacen: this.almacen == undefined ? null : this.almacen ,
      filter1: this.almacen == undefined ? null : 'TipoAlmacen' ,
      filter2: this.producto == undefined ? null : 'Producto' ,
      filter3: this.grupo == undefined ? null : 'Grupo' ,
    };
 /*    console.log(data); */
    this.guardarolT = [];

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.ofertasSrv.tablaProductodos(data)
      .subscribe(res => {
        this.validaDtUser = true;
             this.flag += 1;
        this.guardarolT = res['data'];

        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.dtTrigger.next(null);

      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updateCuenta(dt) {
    this.commonVarSrvice.setCuentaData.next(dt);
  }

  getProductos() {
    this.ofertasSrv.getProducts().subscribe(
      (res) => {
        this.products = res["data"];
        this.getGrupos();
      },
    );
  }

  getGrupos() {
    this.ofertasSrv.getGrupos().subscribe(res => {
      this.dataGrupo = res['data'];
    }, error => {
      this.toastr.info(error.error.message)
    })
  }


  getCiudades() {

      let data = {
        tipo: "'TIPO ALMACENAMIENTO'"
      }
      this.bodegaService.getCiudades(data).subscribe(res => {
        this.dataCatalogo = res['data']['catalogos'];

      }, error => {
        this.toastr.info(error.error.message);
      })

  }

  filterNombre(data){
    this.producto = data;
    this.grupo = undefined;
    this.almacen = undefined;
    this.rerender();
  }

  filterGrupo(data){
   this.grupo = data;
   this.producto = undefined;
   this.almacen = undefined;
   this.rerender();

  }

  filterAlmacen(data){
this.almacen = data;
this.grupo = undefined;
this.producto = undefined;
this.almacenData = true;
this.rerender();

  }

  rerender(): void {
    this.validaDtUser = false;
    if (this.flag >= 1) {
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.guardarolT = [];
        this.getDataTabledos();
      });
    } else {
      this.getDataTable();
      this.guardarolT = [];
    }
  }

  selectProduct(dt) {
    this.commonVarSrvice.setProductData.next(dt);
  }
}


