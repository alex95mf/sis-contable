import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherGroupService } from './otrosgrupos.service';
import { CommonService } from '../../../../services/commonServices'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import * as myVarGlobals from '../../../../global';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGroupComponent } from '../consulta/modal-group/modal-group.component';
import { AnexosComponent } from '../../../commons/modals/anexos/anexos.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-otrosgrupos',
  templateUrl: './otrosgrupos.component.html',
  styleUrls: ['./otrosgrupos.component.scss']
})
export class OtrosgruposComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  field: any;
  treeData: any;
  processing: any = false;
  dataUser: any;
  permisions: any;
  disabledProduct: any = false;
  informationProduct: any;
  sectionGroup: any = false;
  sectionProduct: any = false;
  codeSelected: any;

  /*variables para grupos*/
  nameGroup: any;
  claseGroup: any;
  statusGroup: any;
  codigoGroup: any;
  levelGroup: any;
  dateGroup: any;
  activateSecGroup: any = false;
  claseGlobal: any;

  /*variables para productos*/
  activateSecProduct: any = false;
  nameProduct: any;
  claseProduct: any;
  generico: any;
  num_parte: any;
  pvp: any;
  marca: any;
  modelo: any;
  color: any;
  tasaDes: any;
  descuento: any;
  codigo_producto: any;
  stock: any;
  stockSugerido: any;
  bajoStock: any;
  itinerario: any;
  id_grupo_Send: any;
  title: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  btnPrint: any;
  checkAuth: any = false;
  disable_group: any = false;
  processing_tree: any = false;
  processing_Information = true;
  inProduction: any;
  inTransitoL: any;
  inImportacion: any;
  vmButtons: any;
  flag:any = false;

  constructor(
    private consultaService: OtherGroupService,
    private toastr: ToastrService,
    private router: Router,
    private commonServices: CommonService,
    private modalService: NgbModal
  ) {
    this.commonServices.refreshTree.asObservable().subscribe(res => {
      this.activateSecGroup = false;
      this.claseGlobal = undefined;
      this.processing_tree = false;
      let dataTree = {
        inactive: this.checkAuth
      }
      this.getTreeProduct(dataTree);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion+evento.items.boton.texto) {
      case "1AGREGAR GRUPO":
        this.confirmCreateGroup();
      break;
      case "1MODIFICAR GRUPO":
        this.confirmUpdateGroup();
      break;
      case "1ELIMNAR GRUPO":
      this.confirmDeleteGroup();
      break;



      case "2NUEVO PRODUCTO":
      this.newProduct();
      break;
      case "2IMPRIMIR GRUPO":
        this.savePrint();
      break;



      case "3ANEXOS":
       this.showAnexosProduct();
      break;
      case "3COMPRAS":
       /* this.sendProductOtherCeller(); */
      break;
      case "3KARDEX":
       /* this.sendProductOtherCeller(); */
      break;
      case "3IMPRIMIR PRODUCTO":
       this.savePrint();
      break;
      /* case "3EXCEL":
        $('#FicheroMover').DataTable().button('.buttons-excel').trigger();
        break;
      case "3PDF":
        $('#FicheroMover').DataTable().button('.buttons-pdf').trigger();
        break;
      case "3IMPRIMIR":
        $('#FicheroMover').DataTable().button('.buttons-print').trigger();
        break; */

    }
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsListProduct", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "AGREGAR GRUPO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsListProduct", paramAccion: "1", boton: { icon: "fa fa-pencil", texto: "MODIFICAR GRUPO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsListProduct", paramAccion: "1", boton: { icon: "far fa-trash-alt", texto: "ELIMNAR GRUPO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },

      { orig: "btnsListProduct", paramAccion: "2", boton: { icon: "far fa-layer-plus", texto: "NUEVO PRODUCTO" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsListProduct", paramAccion: "2", boton: { icon: "fa fa-print", texto: "IMPRIMIR GRUPO" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false,printSection: "print-section-group", imprimir: true  },

      { orig: "btnsListProduct", paramAccion: "3", boton: { icon: "fa fa-thumb-tack", texto: "ANEXOS" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      //{ orig: "btnsListProduct", paramAccion: "3", boton: { icon: "fas fa-cart-plus", texto: "COMPRAS" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },
      //{ orig: "btnsListProduct", paramAccion: "3", boton: { icon: "fa fa-tasks", texto: "KARDEX" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsListProduct", paramAccion: "3", boton: { icon: "fa fa-print", texto: "IMPRIMIR PRODUCTO" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false,printSection: "print-section", imprimir: true },
    ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fOtherGroup,
      id_rol: id_rol
    }

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);

    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario Consulta de productos");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        let dataTree = {
          inactive: false
        }
        this.getTreeProduct(dataTree);
        this.printData();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  mostrarInactivos() {
    this.processing_tree = false;
    this.checkAuth = !this.checkAuth;
    if (this.checkAuth) {
      let data = {
        inactive: true
      }
      this.getTreeProduct(data);
    } else {
      let data = {
        inactive: false
      }
      this.getTreeProduct(data);
    }
  }

  printData() {
    if (this.permisions[0].imprimir == "0") {
      this.btnPrint = false;
    } else {
      this.btnPrint = true;
    }
  }

  savePrint() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de impresión de Información de ${this.title}`,
      id_controlador: myVarGlobals.fOtherGroup
    }
    this.consultaService.printData(data).subscribe(res => {

    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }

  getTreeProduct(data) {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      this.consultaService.getTreeProducts(data).subscribe(res => {
        this.treeData = res['data'];
        this.field = { dataSource: res['data'], id: 'id', text: 'name', child: 'subChild', expanded: 'expanded' };
        this.processing_tree = true;
        this.processing = true;
        this.lcargando.ctlSpinner(false);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      })
    }
  }

  onNodeSelecting(event) {
    this.flag = true;
    this.activateSecGroup = false;
    this.activateSecProduct = false;
    this.processing_Information = false;
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {

      this.codeSelected = event.nodeData.id;
      let data = {
        codigo: event.nodeData.id
      }
      this.lcargando.ctlSpinner(true);
      this.consultaService.getTInformationsProducts(data).subscribe(res => {

        this.informationProduct = res['data'];
        if (this.informationProduct.clase == "Productos" || this.informationProduct.clase == "Servicios") {
          this.disable_group = false;
          this.title = (this.informationProduct.clase == "Productos") ? "Producto" : "Servicio";

          this.nameProduct = this.informationProduct.nombre;
          this.claseProduct = this.informationProduct.clase;
          this.generico = this.informationProduct.generico;

          this.marca = this.informationProduct.marca;
          this.modelo = this.informationProduct.modelo;
          this.color = this.informationProduct.color;

          this.stock = this.informationProduct.stock;
          this.stockSugerido = this.informationProduct.sugStock;
          this.bajoStock = (this.informationProduct.bajoStock == 0) ? "Si" : "No";

          this.tasaDes = this.informationProduct.tasa_descuento;
          this.descuento = (this.informationProduct.descuento == 0) ? "Si" : "No";
          this.pvp = "$ "+this.commonServices.formatNumber(this.informationProduct.PVP);

          this.inProduction = this.informationProduct.enProduccion;
          this.inTransitoL = this.informationProduct.enTransitoLocal;
          this.inImportacion = this.informationProduct.enImportacion;

          this.itinerario = (this.informationProduct.fk_formula != null) ? "Si" : "No";

          this.num_parte = this.informationProduct.num_parte;
          this.codigo_producto = this.informationProduct.codigoProducto;

          this.claseGlobal = this.informationProduct.clase;
          this.activateSecProduct = true;
          this.processing_Information = true;

          setTimeout(() => {
            this.vmButtons.forEach(element => {
              if (element.paramAccion == 3) {
                element.permiso = true; element.showimg = true;
                element.habilitar = false;
              } else {
                element.permiso = false; element.showimg = false;
                element.habilitar = true;
              }
            });
          }, 10);
          this.lcargando.ctlSpinner(false);
        } else {
          this.id_grupo_Send = this.informationProduct.id_grupo;
          this.title = "Grupo";
          this.nameGroup = this.informationProduct.nombre;
          this.claseGroup = this.informationProduct.clase;
          this.statusGroup = this.informationProduct.estado;
          this.codigoGroup = this.informationProduct.codigo;
          this.levelGroup = this.informationProduct.nivel;
          this.dateGroup = this.informationProduct.created_at;
          this.claseGlobal = this.informationProduct.clase;
          this.activateSecGroup = true;
          this.disable_group = (this.statusGroup == 'A') ? true : false;
          this.processing_Information = true;

          setTimeout(() => {
            this.vmButtons.forEach(element => {
              if (element.paramAccion == 2 || element.paramAccion == 1) {
                element.permiso = true; element.showimg = true;
                element.habilitar = false;
              } else {
                element.permiso = false; element.showimg = false;
                element.habilitar = true;
              }
            });
          }, 10);
          this.lcargando.ctlSpinner(false);
        }
      }, error => {
        this.toastr.info(error.error.message);
      })
    }
  }

  async confirmCreateGroup() {
    if (this.permisions[0].agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      if (this.claseGlobal != undefined) {
        if (this.claseGlobal != "Productos" && this.claseGlobal != "Servicios") {
          Swal.fire({
            //icon: 'warning',
            title: 'Atención!!',
            text: "Escoge la opción a crear",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Grupo`,
            cancelmButtonText: `Cancelar`,
            denyButtonText: `Subgrupo`,
            cancelButtonColor: '#DC3545',
            confirmButtonColor: '#E0A800',
            denyButtonColor: `#13A1EA`,
          }).then((result) => {
            if (result.isConfirmed) {
              const modalInvoice = this.modalService.open(ModalGroupComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
              modalInvoice.componentInstance.code = null;
              modalInvoice.componentInstance.permisions = this.permisions[0];
              modalInvoice.componentInstance.controlador = myVarGlobals.fOtherGroup;
            } else if (result.isDenied) {
              const modalInvoice = this.modalService.open(ModalGroupComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
              modalInvoice.componentInstance.code = { codigo: this.codeSelected, nivel: this.informationProduct.nivel };
              modalInvoice.componentInstance.permisions = this.permisions[0];
              modalInvoice.componentInstance.controlador = myVarGlobals.fOtherGroup;
            }
          })
        } else {
          this.toastr.info("No se puede crear un grupo a partir de un producto ó servicio");
        }
      } else {
        this.toastr.info("Debe seleccionar un nodo del arbol");
      }
    }
  }

  newProduct() {
    localStorage.setItem("id_grupo", this.id_grupo_Send);
    this.router.navigateByUrl("inventario/producto/fichero");
  }

  confirmDeleteGroup() {
    if (this.permisions[0].eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      if (this.claseGlobal != undefined) {
        Swal.fire({
          title: "Atención!!",
          text: 'Seguro deseas eliminar el grupo?',
          type: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            this.activateSecGroup = false;
            let data = {
              codigo: this.codeSelected,
              ip: this.commonServices.getIpAddress(),
              accion: `Eliminación del grupo ${this.informationProduct.nombre} con código de grupo ${this.codeSelected}`,
              id_controlador: myVarGlobals.fOtherGroup
            }
            this.consultaService.deleteGroup(data).subscribe(res => {
              this.toastr.success(res['message']);
              this.processing_tree = false;
              this.claseGlobal = undefined;
              this.getTreeProduct({ inactive: this.checkAuth });
            }, error => {
              this.toastr.info(error.error.message);
            })
          }
        })
      } else {
        this.toastr.info("Debe seleccionar un nodo del arbol");
      }
    }
  }

  confirmUpdateGroup() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("Usuario no tiene permiso para Actualizar");
    } else {
      if (this.claseGlobal != undefined) {
        const modalInvoice = this.modalService.open(ModalGroupComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
        modalInvoice.componentInstance.dataMod = this.informationProduct;
        modalInvoice.componentInstance.permisions = this.permisions[0];
        modalInvoice.componentInstance.identificador = "MOD";
        modalInvoice.componentInstance.controlador = myVarGlobals.fOtherGroup;
      } else {
        this.toastr.info("Debe seleccionar un nodo del arbol");
      }
    }
  }

  showAnexosProduct() {
    var params = {
      identifier: this.informationProduct.id_producto,
      module: this.permisions[0].id_modulo,
      component: myVarGlobals.fIngresoProducto,
    }
    const modalInvoice = this.modalService.open(AnexosComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.params = params;
  }
}
