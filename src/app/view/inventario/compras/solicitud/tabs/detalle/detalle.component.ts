import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices';
import { CommonVarService } from '../../../../../../services/common-var.services';
import { SolicitudService } from '../../solicitud.service';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  solicitudProducto: any = {
    cant_solicitada: 0,
    cant_aprobada: 0,
  };
  contantModify: any = [];
  contantDelete: any = [];
  arraydetalle: any = [];
  validateSearch: any = false;
  editInfoDetalle: any = false;
  dataProducto: any;
  producto: any;
  descuentoData: any;
  existent:any;
  otroProducto: any = false;
  diExist: any = false;
  positionUpdate: any;
  dAction: any = false;
  prueba: any;
  permisoCrear: any;
  permisoRevisar: any;
  permisoProcesar: any;
  permisoAprobar: any;
  presentarEstado: any;
  permisoSolicitud: any;
  dataUser: any;
  detalle: any = {
    dSolicitada: false,
    dAprobada: false,
  }
  solicitada: any = false;
  aprobada: any = false;
  estadoSolicitud: any;
  filtroDocumento: any = false;
  filtro_doc: any;
  disNuevo:any = false;
  observacionesDt:any;
  dtSearch: any;
  obdata: any = false;
  deleteProd: any = false;
  editProd: any =  false;
  disanular:any = false;
  disProexist:any = false;
  disPronuevo:any = false;
  constructor(private toastr: ToastrService, private router: Router,
    private commonServices: CommonService, private requestService: SolicitudService, private commonVarSrvice: CommonVarService) {
      this.commonServices.detalleSolicitud.asObservable().subscribe(res => {
        if (this.validateSearch) {
          let data = {
            detalle_modify: this.contantModify,
            detalle_delete: this.contantDelete
          };
          this.commonServices.resdetalleSolicitud.next(data);
        } else {
          let data = {
            detalle_modify: this.arraydetalle,
            detalle_delete: []
          }
          this.commonServices.resdetalleSolicitud.next(data);
        }
      })
    //buscar
    this.commonServices.actionsSearchSolicitud.asObservable().subscribe(res => {
      this.dtSearch = res;
      this.filtro_doc = res.filter_doc; 
      this.validateSearch = true;
      if (this.filtro_doc == 4) {
        this.dAction = false;
        this.validateSearch = true;
        this.observacionesDt = res.observaciones;
        this.arraydetalle = res.detalle;
        this.commonServices.enviaDt.next(this.arraydetalle);
          this.contantDelete = [];
          this.obdata = true;
      } else { 
        this.validateSearch = true;
        this.solicitudProducto.cant_aprobada = 0;
        this.solicitudProducto.cant_solicitada = 0;
        this.observacionesDt = res.observaciones;
        this.obdata = false;

        if (res.detalle.length > 0) {
          this.arraydetalle = res.detalle;
          this.commonServices.enviaDt.next(this.arraydetalle);
          this.contantDelete = [];
          this.dAction = true;
          this.validateSearch = true;
          this.obdata = false;
          this.solicitudProducto.cant_aprobada = 0;
          this.solicitudProducto.cant_solicitada = 0;
          if (this.filtro_doc == 1 && this.permisoCrear == 1){
            this.deleteProd = false;
            this.disNuevo = false;
            this.diExist = false;
            this.aprobada = false;
            this.solicitada = true;
          } else {
            this.deleteProd = true;
            this.disNuevo = true;
            this.diExist = true;
            this.aprobada = true;
            this.solicitada = false;
            this.disanular = true;
          }
        } else {
          this.obdata = true;
          this.contantModify = [];
          this.arraydetalle = [];
          this.contantDelete = [];
          this.commonServices.enviaDt.next(this.arraydetalle);
          this.solicitudProducto.cant_aprobada = 0;
          this.solicitudProducto.cant_solicitada = 0;
        }
      }
    })
    //envia las acciones
    this.commonServices.actionsSolicitud.asObservable().subscribe(res => {
      this.contantModify = [];
      this.arraydetalle = [];
      this.contantDelete = [];
      this.validateSearch = false;
      this.dAction = true;
      this.obdata = true;
      if (res.new) {
       /*  this.validateSearch = false; */
        this.commonServices.enviaDt.next(this.arraydetalle);
        this.dAction = true;
        this.solicitada = true;
        this.aprobada = false;
        this.otroProducto = false;
        this.obdata = true;
      } else if (res.cancel) {
        this.dAction = false;
        this.cleanForm();
        this.arraydetalle = [];
      } else if (res.search) {
        this.aprobada = true;
        this.detalle.dAprobada = false;
        this.dAction = true;
      }
    })
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.permisoSolicitud = this.dataUser.permisos_doc.filter(e => e.fk_documento == 4);
    this.permisoCrear = this.permisoSolicitud[0]["crear"];
    this.permisoRevisar = this.permisoSolicitud[0]["revisar"];
    this.permisoProcesar = this.permisoSolicitud[0]["procesar"];
    this.permisoAprobar = this.permisoSolicitud[0]["aprobar"];  
    this.getProducto();
  }

  getProducto() {
    this.requestService.searchProducto().subscribe(res => {
      this.dataProducto = res['data'];
    })
  }

  obtenerProducto(e) {
    this.producto = e;
  }

  setProducto() {
    if (this.descuentoData) {
      this.otroProducto = true;
      this.solicitudProducto.fk_producto = "";
      this.diExist = true
    } else {
      this.otroProducto = false; //bloquead productos
      this.solicitudProducto.otros = ' ';
      this.diExist = false;
    }
  }

  setProductoExist(){
    if (this.existent) {
    this.disNuevo = true;
    } else {
    this.disNuevo = false
    }
  }

  cleanForm() {
    this.editInfoDetalle = false;
    this.existent = false;  
    this.descuentoData = false;
    this.diExist = false;
    this.disNuevo = false;
    this.solicitudProducto = {};
    this.observacionesDt = null;
    this.solicitudProducto.cant_aprobada = 0;
    this.solicitudProducto.cant_solicitada = 0;
  }

  async addetalle() {
    if (this.solicitudProducto.fk_producto !== undefined && this.solicitudProducto.fk_producto !== "") {
      var prod = this.dataProducto.filter(e => e.id_producto == this.solicitudProducto.fk_producto)[0];
      this.solicitudProducto.productoName = prod['nombre']
    }

    if (this.validateSearch) {
      await this.validacionDetalle().then(respuesta => {
        if (respuesta) {

          this.contantModify.push(this.solicitudProducto);
          this.arraydetalle.push(this.solicitudProducto);
         /*  this.commonServices.enviaDt.next(this.arraydetalle);  */
          this.cleanForm();
          document.getElementById("idProducto").focus();
          this.solicitudProducto.cant_aprobada = 0;
          this.solicitudProducto.cant_solicitada = 0;
        }
      })
    } else {
      await this.validacionDetalle().then(respuesta => {
        if (respuesta) {
          this.arraydetalle.push(this.solicitudProducto);
          /* this.commonServices.enviaDt.next(this.arraydetalle);  */
          this.cleanForm();
          this.solicitudProducto.cant_aprobada = 0;
          this.solicitudProducto.cant_solicitada = 0;
        }
      })
    }
  }

  validacionDetalle() {
    return new Promise((resolve, reject) => {
     if ((this.existent == undefined && this.descuentoData == undefined ) || (this.existent == false && this.descuentoData == false)){
      this.toastr.info("Seleccione Existe o Nuevo");
     }else if (this.existent == true && (this.solicitudProducto.fk_producto == undefined || this.solicitudProducto.fk_producto == "") ){
      this.toastr.info("Ingrese un producto");
      let autFocus = document.getElementById("idProducto").focus();
     } else if (this.descuentoData == true && (this.solicitudProducto.otros == undefined || this.solicitudProducto.otros == "") ){
      this.toastr.info("Ingrese Nuevo Producto");
      let autFocus = document.getElementById("idOtros").focus();
     }  else if (this.solicitada == true && (this.solicitudProducto.cant_solicitada == 0 || this.solicitudProducto.cant_solicitada == "" || this.solicitudProducto.cant_solicitada == undefined )) {
        this.toastr.info("ingrese Cantidad a Solicitar");
        let autFocus = document.getElementById("idSolicitada").focus();
      } else if (this.aprobada == true && (this.solicitudProducto.cant_aprobada = 0 || this.solicitudProducto.cant_aprobada == undefined || this.solicitudProducto.cant_aprobada == "")) {
        this.toastr.info("Ingrese Cantidad a Aprobar");
        let autFocus = document.getElementById("idAprobada").focus();
      } else {
        return resolve(true);
      } 
    });
  }


  updateDetalle() {

    this.aprobada = true;
    this.solicitada = false;
    this.arraydetalle[this.positionUpdate]['fk_producto'] = this.solicitudProducto.fk_producto;
    this.arraydetalle[this.positionUpdate]['otros'] = this.solicitudProducto.otros;
    this.arraydetalle[this.positionUpdate]['cant_solicitada'] = this.solicitudProducto.cant_solicitada;
    this.arraydetalle[this.positionUpdate]['cant_aprobada'] = this.solicitudProducto.cant_aprobada;
    this.arraydetalle[this.positionUpdate]['estado'] = this.solicitudProducto.estado;
    this.arraydetalle[this.positionUpdate]['justificacion'] = this.solicitudProducto.justificacion;
    this.cleanForm();
  }

  editDetalle(dt, pos) {
/*     this.dAction = true;
    this.positionUpdate = pos;
    this.editInfoDetalle = true;
    this.solicitudProducto = dt;
    this.contantModify.push(this.solicitudProducto); */
   /*  dt.otros == null ? this.existent = true : this.descuentoData  = true; */ //marcar check
      this.permisoCrear = this.permisoSolicitud[0]["crear"];
      this.permisoRevisar = this.permisoSolicitud[0]["revisar"];
      this.permisoProcesar = this.permisoSolicitud[0]["procesar"];
      this.permisoAprobar = this.permisoSolicitud[0]["aprobar"];  
  if (this.validateSearch) {
    if (this.permisoCrear == 1){
      dt.otros == null ? this.existent = true : this.descuentoData  = true;
      dt.otros == null ? this.diExist = true : this.disNuevo  = true ;
      this.positionUpdate = pos;
      this.editInfoDetalle = true;
      this.solicitudProducto = dt;
      this.contantModify.push(this.solicitudProducto); 
    } else if (this.permisoRevisar == 1){
      this.aprobada = true;
      this.solicitada = false; 
      dt.otros == null ? this.existent = true : this.descuentoData  = true;
      dt.otros == null ? this.diExist = true : this.disNuevo  = true ;
      this.positionUpdate = pos;
      this.editInfoDetalle = true;
      this.solicitudProducto = dt;
      this.contantModify.push(this.solicitudProducto);
      this.deleteProd = true;
    }else if (this.permisoProcesar == 1){
      this.aprobada = false;
      this.solicitada = false;
      dt.otros == null ? this.existent = true : this.descuentoData  = true;
      dt.otros == null ? this.diExist = true : this.disNuevo  = true ;
      this.deleteProd = true;
      this.dAction = true;
      this.positionUpdate = pos;
      this.editInfoDetalle = true;
      this.solicitudProducto = dt;
      this.contantModify.push(this.solicitudProducto);
    } else if (this.permisoAprobar == 1){
      this.aprobada = true;
      this.solicitada = true;
      dt.otros == null ? this.existent = true : this.descuentoData  = true;
      dt.otros == null ? this.diExist = true : this.disNuevo  = true ;
      this.deleteProd = true;
      this.dAction = true;
      this.positionUpdate = pos;
      this.editInfoDetalle = true; 
      this.solicitudProducto = dt;
      this.contantModify.push(this.solicitudProducto);
    } else if (this.permisoCrear != 1 || this.permisoRevisar != 1 || this.permisoProcesar != 1 || this.permisoAprobar != 1){
      this.aprobada = true;
      this.solicitada = true;
      dt.otros == null ? this.existent = true : this.descuentoData  = true;
      dt.otros == null ? this.diExist = true : this.disNuevo  = true ;
      this.deleteProd = true;
      this.dAction = true;
      this.disanular = true;
      this.positionUpdate = pos;
      this.editInfoDetalle = true; 
      this.solicitudProducto = dt;
      this.contantModify.push(this.solicitudProducto);
    }
  }
}

  deleteDetalle(item, pos) {
    if (this.validateSearch) {
      this.editInfoDetalle = false;
      this.contantDelete.push(item);
      this.arraydetalle.splice(pos, 1);
    } else {
      this.editInfoDetalle = false;
      this.arraydetalle.splice(pos, 1);
    }
  }

  setObservacion(evt){
    this.commonServices.actionDataOb.next(evt);
  }

  SetDeleteDocument(solicitud) {
    this.commonVarSrvice.deleteDocument.next(solicitud);
  }
}