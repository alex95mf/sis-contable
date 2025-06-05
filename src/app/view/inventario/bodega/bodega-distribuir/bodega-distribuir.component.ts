import { Component, OnInit, OnDestroy, ViewChild, NgZone} from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BodegaDistribuirService } from './bodega-distribuir.service';
import { CommonVarService } from '../../../../services/common-var.services';
import { CommonService } from '../../../../services/commonServices';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

@Component({
standalone: false,
  selector: 'app-bodega-distribuir',
  templateUrl: './bodega-distribuir.component.html',
  styleUrls: ['./bodega-distribuir.component.scss']
})
export class BodegaDistribuirComponent implements OnInit{
	
	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
  /* Datatable options */
/*   @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {}; */
  // dtOptions: any = {};
/*   dtTrigger = new Subject(); */
	/* Datatable options */
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
  dataUser: any;
  validaDtUser: any = false;

  guardaT: any = [];
  permisions: any;
  processing: any = false;
  actions: any = {
  dComponet: false,
  btnNuevo: false,
  btnGuardar: false,
  btncancelar: false
  };
  /*Productos*/
  productosSearch: any;
  arrayProducts: any;
  udm: any;
  codigoProduct: any;
  cantidadRestante: any = 0.00;
  valorcantidad:any = 0.00;
  valorPerchado: any  = 0.00;
  stock:any  = 0.00;
  /*Bodega*/
  arrayBodega: any;
  arrayAlmacenamiento: any;
  almacenamientoSearch: any;
  bodegaSearch: any;
  disbledTipo: any = false;
  codigoBodega : any;
  filaBodega: any;
  columnaBodega: any;
  productsPerchar: any;
	vmButtons: any = [];

  constructor(private toastr: ToastrService, private router: Router, private modalService: NgbModal,private commonServices: CommonService,
     private bodegaDistribSrv: BodegaDistribuirService, private commonVarSrvice: CommonVarService) { }

  ngOnInit(): void {
    this.vmButtons = [
			{ orig: "btnDistri", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnDistri", paramAccion: "", boton: { icon: "fas fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true, imprimir: false},
      { orig: "btnDistri", paramAccion: "", boton: { icon: "fas fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true, imprimir: false},
			];

    setTimeout(() => {
      this.permissions();
    }, 10);
  }

   /* Api call */
 permissions() {
  this.lcargando.ctlSpinner(true);
  this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
  let data = {
    codigo: myVarGlobals.fAdmiParametros,
    id_rol: this.dataUser.id_rol
  }
  this.commonServices.getPermisionsGlobas(data).subscribe(res => {
    this.permisions = res['data'];
    if (this.permisions[0].ver == "0") {
      this.toastr.info("Usuario no tiene permiso para ver el formulario Distribuir a Bodega");
      this.processing = false;
    } else {
   setTimeout(() => {
     this.processing = true;
     this.showDataTableDistribuir();
     this.getProductos();
  }, 1000);
    }
  }, error => {
    this.toastr.info(error.error.message);
  })
}

metodoGlobal(evento: any) {
  switch (evento.items.boton.texto) {
      case "NUEVO":
      this.newBuy();
      break;
      case "GUARDAR":
      this.validaSaveBuy();
      break;
      case "CANCELAR":
      this.deleteBuy();
      break;
  }
}


showDataTableDistribuir() {
  this.dtOptions = {
    pagingType: "full_numbers",
    pageLength: 10,
    search: true,
    paging: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
    },
  };
  this.bodegaDistribSrv.presentaTablaDistribuir().subscribe(
    res => {
      this.lcargando.ctlSpinner(false);
      this.validaDtUser = true;
      this.guardaT = res["data"];
      setTimeout(() => {
        this.dtTrigger.next(null);
        this.ngOnDestroy();
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
     /*  this.toastr.info(error.error.message); */
    });
}

ngOnDestroy(): void {
  this.dtTrigger.unsubscribe();
}

newBuy() {
/*   this.actions.btnGuardar = true;
  this.actions.btncancelar = true; */
  this.actions.dComponet = true;

  this.vmButtons[1].habilitar = false;
  this.vmButtons[2].habilitar = false;
}

deleteBuy() {
  this.vmButtons[0].habilitar = false;
  this.vmButtons[1].habilitar = true;
  this.vmButtons[2].habilitar = true;

  this.codigoProduct = "";
  this.cantidadRestante = 0.00;
  this.valorPerchado = 0.00;
  this.valorcantidad = 0.00;
  this.stock = 0.00;
  this.codigoBodega = "";
  this.filaBodega = "";
  this.columnaBodega = "";
  this.productosSearch = "";
  this.bodegaSearch = "";
  this.almacenamientoSearch = "";
  this.actions.dComponet = false;
}

getProductos() {
  this.bodegaDistribSrv.getProducts().subscribe(res => {
    this.lcargando.ctlSpinner(false);
    this.arrayProducts = res['data'];
    this.getBodega();
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.toastr.info(error.error.message);
  })
}

getFilterProduct(evt) {
  let filt = this.arrayProducts.filter(e => e.id_producto == evt)
  filt = filt[0];
   if (filt != undefined) {
    this.codigoProduct = filt.codigoProducto;
    this.bodegaDistribSrv.getDataResultado({
      id: filt.id_producto
    }).subscribe(
      (res) => {
          this.lcargando.ctlSpinner(false);
          this.productsPerchar = res["data"];
          this.stock = res['data'][0].stock;
          this.valorPerchado =  res['data'][0].perchado;
          this.cantidadRestante = res['data'][0].restante;
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  } else {
    this.productsPerchar = [];
    this.productosSearch = undefined;
    this.udm = "";
    this.codigoProduct = "";
    this.cantidadRestante = "";
  }
}

getFilterBodega(e) {
  this.bodegaSearch = e;
  this.getAlmacenamiento();
}

getBodega() {
  this.bodegaDistribSrv.getBodegas().subscribe(res => {
    this.lcargando.ctlSpinner(false);
    this.arrayBodega = res['data'];
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.toastr.info(error.error.message);
  })
}

getAlmacenamiento() {
  let data = {
    fk_bodega_cab: this.bodegaSearch
  }
  this.bodegaDistribSrv.getTipoAlmacenamiento(data).subscribe(res => {
    this.lcargando.ctlSpinner(false);
    this.arrayAlmacenamiento = res['data'];
     this.disbledTipo = true;
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.toastr.info(error.error.message);
  })
}


getFilterAlmacenamiento(e) {
  this.almacenamientoSearch = e;
  let filt = this.arrayAlmacenamiento.filter(e => e.id_bodega_det == this.almacenamientoSearch)
  filt = filt[0];
   if (filt != undefined) {
    this.codigoBodega = filt.codigo;
    this.filaBodega = filt.fila;
    this.columnaBodega = filt.columna;
  } else {
    this.almacenamientoSearch = undefined;
    this.codigoBodega = "";
    this.filaBodega = "";
    this.columnaBodega = "";
  }
}


async validaSaveBuy() {
  if (this.permisions.guardar == "0") {
    this.toastr.info("Usuario no tiene permiso para guardar");
    this.router.navigateByUrl("dashboard");
  } else {
    this.validateDataGlobal();
  }
}


validateDataGlobal() {
  return new Promise((resolve, reject) => {
    if (this.bodegaSearch == undefined || this.bodegaSearch == "" || this.bodegaSearch == null) {
      this.toastr.info("Seleccione una bodega");
      document.getElementById("IdBodega").focus(); return;
    } else if (this.almacenamientoSearch == undefined || this.almacenamientoSearch == null || this.almacenamientoSearch == "") {
      this.toastr.info("Seleccione un tipo de almacenamiento");
      document.getElementById("IdAlmacenamiento").focus(); return;
    } else if (this.productosSearch == undefined || this.productosSearch == "" || this.almacenamientoSearch == null) {
      this.toastr.info("Seleccione un producto");
      document.getElementById("IdProducts").focus(); return;
    } else if (this.valorcantidad == "0") {
      this.toastr.info("La cantidad a distribuir no debe ser 0");
      let autFocus = document.getElementById("idCantDist").focus();
    }else if (this.valorcantidad > this.cantidadRestante) {
      this.toastr.info("La cantidad ingresada no puede ser mayor a Restante");
      let autFocus = document.getElementById("idCantDist").focus();
    }else {
      this.confirmSave("Seguro desea guardar el solicitud?", "SAVE_GUARDAR");
    }
  });
}

saveConfirma() {
  this.lcargando.ctlSpinner(true);
   let data = {
   fk_producto: this.productosSearch,
   fk_bod_det: this.almacenamientoSearch,
   bodega: this.bodegaSearch,
   codigo: this.codigoBodega,
   fila: this.filaBodega,
   columna: this.columnaBodega,
   cantidad: this.valorcantidad,
   ip: this.commonServices.getIpAddress(),
   accion: "Ingreso de la distribución de Bodega",
   id_controlador: myVarGlobals.fBodegaDistribucion,
  };
   this.bodegaDistribSrv.saveDistribucion(data).subscribe(res => {
    this.lcargando.ctlSpinner(false);
   this.toastr.success(res['message']);
   setTimeout(() => {
      location.reload();
    }, 300);
  }, error => {
    this.lcargando.ctlSpinner(true);
    this.toastr.info(error.error.message);
  })
}

async confirmSave(message, action) {
  Swal.fire({
    title: "Atención!!",
    text: message,
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#DC3545',
    confirmButtonColor: '#13A1EA',
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.value) {
      if (action == "SAVE_GUARDAR") {
        this.saveConfirma();
      }
    }
  })
}


}
