import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { TrasladoService } from '../traslado.service';

import moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.component.html',
  styleUrls: ['./detalles-producto.component.scss']
})
export class DetallesProductoComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() data: any;
  @Input() verifyRestore: any;
  @Input() isNew: any;
  

  vmButtons: any;
  documentosDt: any = [];
  paginate: any;
  filter: any;

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  arrayBodega: Array < any > = [];

  producto: {}
  listaProductos: any = []
  listaProductos_filter:any = []
  catalog: any = []
  catalog_filter: any = []
  datosProd: {
    tipo_bien:null,
    id_producto:null
  }
  id_producto: 0

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: TrasladoService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnDetProduct",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    
    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);

    
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    this.producto = {
      nombre: "",
      tipo: "",
      clase: "",
      codigoproducto:"",
      codigobarra:"",
      marca:"",
      modelo:"",
      color:"",
      codigobienes:"",
    }

  

    console.log(this.data)
    console.log(this.isNew)
    if(!this.isNew){
      this.id_producto = this.data['producto'][0]['id_producto'];
    }else{
      this.datosProd =JSON.parse(JSON.stringify(this.data));
      this.id_producto = this.data.id_producto;
   // this.producto = JSON.parse(JSON.stringify(this.data['producto'][0]));
    }
    
    
   
  
   
 


    setTimeout(()=> {
   //  this.cargarDocumentos();
     //this.buscarGrupoProducto()
     this.buscarProducto()
     this.getCatalogos();
   //  this.getBodega();
    }, 50);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  // changePaginate(event) {
  //   let newPaginate = {
  //     perPage: event.pageSize,
  //     page: event.pageIndex + 1,
  //   }
  //   Object.assign(this.paginate, newPaginate);
  //   this.cargarDocumentos();
  // }
  getBodega() {
		this.apiSrv.getBodegas().subscribe(res => {
			//this.toma.bodega = 0;
			this.arrayBodega = res['data'];

		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}
  buscarProducto(){
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let data = {
       id_producto: this.id_producto
    }
    this.apiSrv.getDetalleProducto(data).subscribe(res => {
      this.producto = res["data"][0]
      console.log(res["data"])
      // this.listaProductos_filter = res["data"].filter(p => {p.id_grupo_productos == this.data.fk_grupo_producto});
      // console.log(this.listaProductos_filter)
      
      // console.log(res["data"])
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }
  
  // buscarGrupoProducto(){
  //   this.mensajeSppiner = "Cargando...";
  //   this.lcargando.ctlSpinner(true);
  //   let data = {
  //      tipo_bien: this.data.tipo_bien
  //   }
  //   this.apiSrv.getGrupoProducto(data).subscribe(res => {
  //     this.listaProductos = res["data"]
  //     this.listaProductos_filter = res["data"].filter(p => {p.id_grupo_productos == this.data.fk_grupo_producto});
  //     console.log(this.listaProductos_filter)
      
  //     console.log(res["data"])
  //     this.lcargando.ctlSpinner(false);
  //   }, error => {
  //     this.lcargando.ctlSpinner(false);
  //     this.toastr.info(error.error.message)
  //   })
  // }
  getCatalogos() {
    let data = {
      params: "'INV_TIPO_BIEN' "
    }
    this.apiSrv.getCatalogos(data).subscribe(res => {
      // this.dataBuy.tipo_pago = res['data']['TIPO PAGO'];
      // this.dataBuy.forma_pago = res['data']['FORMA PAGO'];
      this.catalog = res["data"]["INV_TIPO_BIEN"];
      this.catalog = this.catalog.filter(c => {c.valor== this.data.tipo_bien});
      console.log(this.catalog)
     
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  // cargarDocumentos(flag: boolean = false){
  //   this.mensajeSppiner = "Cargando lista de Traslados de Bienes...";
  //   this.lcargando.ctlSpinner(true);

  //   if (flag) this.paginate.page = 1 
    
  //   let data = {
  //     params: {
  //       filter: this.filter,
  //       paginate: this.paginate,
  //     },
     
  //   }

  //   this.apiSrv.getTraladoBienesData(data).subscribe(
  //     (res) => {
  //       console.log(res['data'])
  //       //console.log('documentos'+res);
        
  //       this.documentosDt = res['data'];
  //       this.paginate.length = res['data']['total'];
  //       if (res['data']['current_page'] == 1) {
  //         this.documentosDt = res['data']['data'];
  //       } else {
  //         this.documentosDt = Object.values(res['data']['data']);
  //       }
  //       this.lcargando.ctlSpinner(false);
  //     },
  //     (error) => {
  //       this.lcargando.ctlSpinner(false);
  //       this.toastr.info(error.error.message);
  //     }
  //   );
  // }

  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar esta orden de pago? Los campos llenados y cálculos realizados serán reiniciados.",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeModal(data);
        }
      });
    } else {
      this.closeModal(data);
    }
  }

  closeModal(data?:any) {
    if(data){
      this.commonVrs.TrasladoBienes.next(data);
    }
    this.activeModal.dismiss();
  }

}
