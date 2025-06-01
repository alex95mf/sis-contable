import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../../services/commonServices'
import * as myVarGlobals from '../../../../../global';
import { ProductoService } from '../producto.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewerComponent } from '../../../../commons/modals/viewer/viewer.component'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-tabs-ingreso',
  templateUrl: './tabs-ingreso.component.html',
  styleUrls: ['./tabs-ingreso.component.scss']
})
export class TabsIngresoComponent implements OnInit {
  /* Common Information */
  dataUser: any;
  permisions: any;
  uri: string = environment.baseUrl;
  dtAnexoxShow: boolean = false;

  accDetails: Array<any> = [];
  catalogs: Array<any> = [];
  conversions: Array<any> = [];
  products: Array<any> = [];
  storeProds: Array<any> = [];
  storeObjs: any = {};
  storeComp: Array<any> = [];
  storeCompObj: any = {};
  storeDetDel: Array<any> = [];
  storeComDel: Array<any> = [];
  storeAnxDel: Array<any> = [];
  actionsTabs = {
    formule: false,
    cancel: false,
  }
  actionsBtn = {
    nuevo: false,
    borrar: false,
  }
  modal: any = {};
  catalog: boolean = false;

  /* burnt Information */
  typeFormuleCab: Array<any> = [
    { id: 0, name: "Producto" },
    { id: 1, name: "Combo" }
  ]

  /* Tab Information */
  tabAccounting: any = { costos: 0, ventas: 0, inventario: 0, devoluciones: 0, descuentos: 0, perdidas: 0, iva_compra: 0, iva_venta: 0, impuestoRent: false, iva: true };
  tabFormule: any = { typFormCab: 0, magFormCab: 0, costFinalFormCab: "0.00" };
  tabFormuleCom: any = {};
  tabDetFormule: any = {};

  /* Anexos */
  anexos: any = { description: "" };
  selectedFiles: FileList;

  /* datatable anexos */
  dtanexos: Array<any> = [];
	vmButtons: any = [];
  pruebaUDM:any;
  Disableenviadata: any = false;

  constructor(private toastr: ToastrService, private router: Router,
    private commonServices: CommonService, private ingresoSrv: ProductoService, private modalService: NgbModal) {
    this.commonServices.setClassPills.asObservable().subscribe(res => {
      if (res) {
        let node = document.getElementById('pills-tab');
        node.querySelector('a.active').classList.remove('active');

        let tab_formula = document.getElementById('pills-formula-tab');
        tab_formula.classList.remove('disabled');
        tab_formula.classList.add('active');

        let content = document.getElementById('pills-tabContent');
        content.querySelector('.show, .active').classList.remove('show', 'active');

        document.getElementById('pills-formula').classList.add('show', 'active');

        window.scroll(0, 1000);
      } else {
        this.CancelFormule();
      }
    });

    this.commonServices.disabledComponent.asObservable().subscribe(res => {
      this.Disableenviadata = true;
      if (res.nuevo !== undefined) {
        this.actionsBtn.nuevo = res.nuevo;
        this.actionsTabs.cancel = res.nuevo;
      } else if (res.borrar !== undefined) {
        this.ClearAll();
      }
    })

    this.commonServices.selectContabilidad.asObservable().subscribe(res => {
      this.validateErrorTab('pills-contabilidad-tab', 'pills-contabilidad');
    })

    this.commonServices.selectFormula.asObservable().subscribe(res => {
      this.validateErrorTab('pills-formula-tab', 'pills-formula');
    })

    this.commonServices.editDeleteData.asObservable().subscribe(res => {
      /* this.Disableenviadata = true; */
      this.ClearAll();
      /* active actions */
      this.actionsBtn.nuevo = true;

      /* set accounting */
      this.tabAccounting.costos = res.cuenta_costo;
      this.tabAccounting.ventas = res.cuenta_venta;
      this.tabAccounting.devoluciones = res.cuenta_devolucion;
      this.tabAccounting.descuentos = res.cuenta_descuento;
      this.tabAccounting.perdidas = res.cuenta_perdida;
      this.tabAccounting.impuestoRent = res.deducible_ir;
      this.tabAccounting.iva = res.iva;
      this.tabAccounting.inventario = res.cuenta_inventario;
      this.tabAccounting.iva_compra = res.iva_compra;
      this.tabAccounting.iva_venta = res.iva_venta;

      if ((res.formuladetails) !== undefined) {
        let node = document.getElementById('pills-tab');
        node.querySelector('a.active').classList.remove('active');

        let tab_formula = document.getElementById('pills-formula-tab');
        tab_formula.classList.remove('disabled');
        tab_formula.classList.add('active');

        let content = document.getElementById('pills-tabContent');
        content.querySelector('.show, .active').classList.remove('show', 'active');

        document.getElementById('pills-formula').classList.add('show', 'active');
        /* active actions */
        this.onChangeFormuleType(res.formuladetails.tipo, false);

        /* Formula Cab */
        this.tabFormule.typFormCab = res.formuladetails.tipo;
        this.tabFormule.magFormCab = res.formuladetails.magnitud;
        this.tabFormule.costFinalFormCab = parseFloat(res.formuladetails.costo);

        /* set objects complements and details product */
        res.formuladetails.formuledet.forEach(el => {
          this.storeObjs[el.fk_product] = { ...el }
        });

        res.formuladetails.formulecom.forEach(el => {
          this.storeCompObj[el.id] = { ...el }
        });

        /* set table complement and details product */
        this.storeProds = res.formuladetails.formuledet;
        this.storeComp = res.formuladetails.formulecom;
      } else {
        let node = document.getElementById('pills-tab');
        node.querySelector('a.active').classList.remove('active');

        let tabnode = document.getElementById('pills-formula-tab');
        tabnode.classList.remove('active');
        tabnode.classList.add('disabled');

        let content = document.getElementById('pills-tabContent');
        content.querySelector('.show, .active').classList.remove('show', 'active');

        let contnode = document.getElementById('pills-formula');
        contnode.classList.remove('show', 'active');

        let tabcontabilidad = document.getElementById('pills-contabilidad-tab');
        tabcontabilidad.classList.add('active');

        let contcontabilidad = document.getElementById('pills-contabilidad');
        contcontabilidad.classList.add('show', 'active');

        window.scroll(0, 0);
      }

      /* set datatable anexos */
      this.setDatatableAnexos(res.anexos);
    })

    this.commonServices.updateData.asObservable().subscribe(res => {
      this.emitRequestInformation(res);
    })

    this.commonServices.setAnexos.asObservable().subscribe(res => {
      if (this.selectedFiles !== undefined) {
        res['description'] = this.anexos.description;
        res['id_controlador'] = myVarGlobals.fIngresoProducto;
        res['accion'] = `Ingreso/Actualización de producto anexos ${res.identifier}`;
        res['ip'] = this.commonServices.getIpAddress();
        this.UploadFile(res);
      }
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnmanofacModal", paramAccion: "", boton: { icon: "fa fa-times", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
       { orig: "btnmanofacModal", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
    ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.validatePermissions();

    setTimeout(() => {
      this.getAccountsTypeDetails();
      this.getTypeCatalogs();
      this.commonServices.cancelFormula.next(this.Disableenviadata);
    }, 1000);
  }

  /* Calls API'S */
  validatePermissions() {
    let data = {
      id: 2,
      codigo: myVarGlobals.fIngresoProducto,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res["data"][0];
    }, error => {
      this.toastr.info(error.error.message);
    });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case "GUARDAR":
          this.validateCatalog();
        break;
         case "CERRAR":
          this.CancelModalCatalog();
        break;
    }
  }


  getAccountsTypeDetails() {
    let data = { company_id: this.dataUser.id_empresa };
    this.ingresoSrv.getAccountsByDetails(data).subscribe(res => {
      this.accDetails = res['data']
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getTypeCatalogs() {
    let data = { fields: ["UNIDAD DE MEDIDA", "MANOFACTURA", "MAGNITUD"] };
    this.ingresoSrv.getCommonInformationFormule(data).subscribe(res => {
      this.conversions = res['data']['conversions']
      this.catalogs = res['data']['catalogs']
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  existCatalog() {
    let data = {
      valor: this.modal.value,
      type: this.modal.type
    }
    this.ingresoSrv.getValidaNameGlobal(data).subscribe(res => {
      this.catalog = false;
    }, error => {
      this.catalog = true;
      this.toastr.info(error.error.message);
    })
  }

  setCatalog() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.modal.value} como nuevo catálogo`,
      id_controlador: myVarGlobals.fIngresoProducto,
      tipo: this.modal.type,
      group: null,
      descripcion: this.modal.description,
      valor: this.modal.value,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }

    this.ingresoSrv.saveRowCatalogo(data).subscribe(res => {
      ($('#generalModal') as any).modal('hide');
      this.toastr.success(res['message']);
      this.modal = {};
      this.getTypeCatalogs();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  /* Methods of Process */
  storeProducts(item) {
    if ((item.prodFormDet  /*&& item.udmFormDet*/) === 0  ||  item.cantUseFormDet  === undefined || (item.cantUseFormDet) === null) {
      this.toastr.info("Complete los campos en la sección detalle formula");
      document.getElementById("ngSelProduct").focus();
    } else {
      let prod_search = this.products.find(el => {
        return el.id_producto == item.prodFormDet

      });
/*       let udm = this.conversions.find(el => {
        return el.id_conversion == item.udmFormDet;
      }); */

      const product = {
        fk_product: item.prodFormDet,
        product: prod_search['nombre'],
        udm: prod_search['UDMVenta'],
        cantidad: parseFloat(item.cantUseFormDet),
        costoMaterial: parseFloat(prod_search['costo']),
        /*   costoTotal: prod_search['costo'] * (parseFloat(udm.factor) * parseFloat(item.cantUseFormDet)), */ //Formula de Conversiones
        costoTotal: prod_search['costo'] * parseFloat(item.cantUseFormDet),
      }

      if (this.storeObjs.hasOwnProperty(product.fk_product)) {
        product.cantidad += this.storeObjs[product.fk_product].cantidad
        product.costoTotal = product.cantidad * product.costoMaterial;
      }

      this.tabDetFormule = {};
      this.storeObjs[product.fk_product] = { ...product }
      this.storeProds = [];
      this.storeProds = Object.values(this.storeObjs);

      this.CalculateFormulePrice();
    }

    this.emitRequestInformation(true);
  }

  deleteFields(obj, pos) {
    if (this.storeObjs.hasOwnProperty(obj)) {
      this.storeDetDel.push(this.storeProds[pos]);
      delete this.storeObjs[obj];
      this.storeProds.splice(pos, 1);

      this.CalculateFormulePrice();
      this.emitRequestInformation(true);
    }
  }

  storeManofactura(item) {
    if ((item.typFormDetCom) === 0 || (item.valFormDetCom) === undefined || (item.valFormDetCom) === null) {
      this.toastr.info("Complete los campos en la sección complementos");
      document.getElementById("inpComMan").focus();
    } else {
      let udm = this.catalogs["MANOFACTURA"].find(el => {
        return el.id_catalogo == item.typFormDetCom;
      });

      const complement = {
        id: item.typFormDetCom,
        name: udm.valor,
        value: parseFloat(item.valFormDetCom),
      }

      this.tabFormuleCom = {};
      this.storeCompObj[complement.id] = { ...complement }
      this.storeComp = [];
      this.storeComp = Object.values(this.storeCompObj);

      this.CalculateFormulePrice();
    }

    this.emitRequestInformation(true);
  }

  deleteManofactura(obj, pos) {
    if (this.storeCompObj.hasOwnProperty(obj)) {
      this.storeComDel.push(this.storeComp[pos]);
      delete this.storeCompObj[obj];
      this.storeComp.splice(pos, 1);

      this.CalculateFormulePrice();
      this.emitRequestInformation(true);
    }
  }

  CancelFormule() {
    /* Clear fields formule */
    this.storeObjs = {};
    this.storeProds = [];
    this.storeComp = [];
    this.storeCompObj = {};
    this.tabFormule = { typFormCab: null, magFormCab: null, costFinalFormCab: "0.00" };
    this.tabDetFormule = {};
    this.tabFormuleCom = {};

    /* set actions buttons and tabs */
    this.actionsTabs.formule = false;
    this.actionsTabs.cancel = false;
    this.actionsBtn.nuevo = false;
    this.actionsBtn.borrar = false;

    this.storeDetDel = [];
    this.storeComDel = [];
    this.storeAnxDel = [];

    this.emitRequestInformation(false);
    this.startPositionTab();
    this.commonServices.cancelFormula.next(null);
  }

  ClearAll() {
    /* Clear fields formule */
    this.tabAccounting = { costos: 0, ventas: 0, inventario: 0, devoluciones: 0, descuentos: 0, perdidas: 0, iva_compra: 0, iva_venta: 0, impuestoRent: false, iva: true };

    /* Clear fields details & complements */
    this.storeObjs = {};
    this.storeProds = [];
    this.storeComp = [];
    this.storeCompObj = {};
    this.tabFormule = { typFormCab: 0, magFormCab: 0, costFinalFormCab: "0.00" };
    this.tabDetFormule = {};
    this.tabFormuleCom = {};

    this.storeDetDel = [];
    this.storeComDel = [];
    this.storeAnxDel = [];

    /* Clear fields anexos */
    this.dtAnexoxShow = false;
    this.dtanexos = [];

    /* set actions buttons and tabs */
    this.actionsTabs.formule = false;
    this.actionsTabs.cancel = false;

    this.emitRequestInformation(false);
    this.ChangeSelect();
  }

  emitRequestInformation(action: boolean) {
    var response = {};
    if (action) {
      response = {
        header: this.tabFormule,
        details: this.storeProds,
        complements: this.storeComp,
        detdel: this.storeDetDel,
        comdel: this.storeComDel,
        anxDel: this.storeAnxDel,
      }
    } else {
      response = {
        anxDel: this.storeAnxDel,
      }
    }
    this.commonServices.formulaInformation.next(response);
  }

  CalculateFormulePrice() {
    let details = this.storeProds.reduce((acc, el) => (acc + el.costoTotal), 0)
    let complements = this.storeComp.reduce((acc, el) => (acc + el.value), 0)
    this.tabFormule.costFinalFormCab = details + complements;
  }

  setDatatableAnexos(anexos) {
    /* Anexos */
    if (anexos.length > 0) {
      this.dtAnexoxShow = true;
      this.dtanexos = anexos;
    }
  }

  showAnexo(item) {
    console.log("probando: ", item)
    if (item.original_extension == '.docx' || item.original_extension == '.doc' || item.original_extension == '.xlsx' || item.original_extension == '.xls' || item.original_extension == '.pptx') {
        let datos: any = {
          storage: item.storage,
          name: item.name,
        };
        this.lcargando.ctlSpinner(true);
        this.ingresoSrv.descargar(datos).subscribe((resultado) => {
            this.lcargando.ctlSpinner(false);
            const url = URL.createObjectURL(resultado);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", item.name);
            document.body.appendChild(link);
            link.click();
            this.toastr.success("Se ha descargado Autamaticamente");
          }, (error) => {
            this.toastr.info(error.message);
            this.lcargando.ctlSpinner(false);
          }
        );

    } else {
      let datos: any = {
        storage: item.storage,
        name: item.name,
      };
      this.lcargando.ctlSpinner(true);
      this.ingresoSrv.descargar(datos).subscribe((resultado) => {
        this.lcargando.ctlSpinner(false);

        const modalInvoice = this.modalService.open(ViewerComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content' });
        modalInvoice.componentInstance.product = item.original_name;
        modalInvoice.componentInstance.ext = item.original_extension;
        modalInvoice.componentInstance.uri = item.location;
        modalInvoice.componentInstance.lstorage = resultado;

      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.message);
      });
    }

  }

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  downloadAnexo(item) {
    const url = `${this.uri}/general/download-files/?storage=${item.storage}&name=${item.name}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", item.name);
    document.body.appendChild(link);
    link.click();

    let datos: any = {
      storage: item.storage,
      name: item.name,
    };
    this.lcargando.ctlSpinner(true);
    this.ingresoSrv.descargar(datos).subscribe((resultado) => {
        this.lcargando.ctlSpinner(false);

        const url = URL.createObjectURL(resultado);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", item.name);
        document.body.appendChild(link);
        link.click();

        this.toastr.success("Se ha descargado Autamaticamente");
      }, (error) => {
        this.toastr.info(error.message);
        this.lcargando.ctlSpinner(false);
      }
    );

  }

  deleteAnexo(item, pos) {
    this.storeAnxDel.push(item);
    this.dtanexos.splice(pos, 1);
  }

  /* Modal Actions */
  setModalCatalog(title, type, label) {
    $('#generalModal').appendTo('body').modal('show');
    this.modal.title = title;
    this.modal.type = type;
    this.modal.label = label;
  }

  CancelModalCatalog() {
    this.modal = {};
    ($('#generalModal') as any).modal('hide');
  }

  validateCatalog() {
    this.existCatalog();
    setTimeout(() => {
      if (this.permisions.guardar == "0") {
        this.toastr.info("Usuario no tiene permiso para guardar");
      } else {
        if (this.modal.value == null || this.modal.value == undefined) {
          document.getElementById("valueCatalog").focus();
        } else if (this.catalog) {
          document.getElementById("valueCatalog").focus();
        } else if (this.modal.description == null || this.modal.description == undefined) {
          document.getElementById("descripCatalog").focus();
        } else {
          this.confirmSave('Seguro desea crear el registro?', 'SET_CATALOG');
        }
      }
    }, 1000);
  }

  /* Events onChange */
  ChangeSelect(evt?: any) {
    if (this.tabAccounting.iva === 0 || this.tabAccounting.iva === false) {
      this.tabAccounting.iva_compra = 0;
      this.tabAccounting.iva_venta = 0;
    }
    this.commonServices.sendAccountingInv.next(this.tabAccounting);
  }

  onChangeFormuleType($evt, cancel?: any) {
    let params = { value: $evt }
    this.ingresoSrv.getProductInformation(params).subscribe(res => {
      this.products = res["data"];
      if (this.products.length > 0) {
       /*  this.actionsTabs.formule = true;
        this.actionsTabs.cancel = (cancel === undefined) ? true : cancel; */
      if($evt == 'Producto'){
        this.actionsTabs.formule = true;
        this.actionsTabs.cancel = true;
        }else{
          this.actionsTabs.formule = false;
          this.actionsTabs.cancel = true;
        }
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  selectFiles(files) {
    this.selectedFiles = undefined;
    if (files.length > 0) {
      this.selectedFiles = files;
    }
  }

  UploadFile(payload?: any): void {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.UploadService(this.selectedFiles[i], payload);
    }
  }

  UploadService(file, payload?: any): void {
    this.ingresoSrv.fileService(file, payload).subscribe(res => {
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  /* Events KeyPress */
  FormatDecimalVal(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 46 || key > 57)) {
      return false;
    }
    return true;
  }

  /* Events Class */
  startPositionTab() {
    let node = document.getElementById('pills-tab');
    node.querySelector('a.active').classList.add('disabled');
    node.querySelector('a.active').classList.remove('active');

    let content = document.getElementById('pills-tabContent');
    content.querySelector('.show, .active').classList.remove('show', 'active');

    let tab_formula = document.getElementById('pills-contabilidad-tab');
    tab_formula.classList.add('active');

    document.getElementById('pills-contabilidad').classList.add('show', 'active');

    window.scroll(0, 0);
  }

  validateErrorTab(tabH: string, tabC: string) {
    let node = document.getElementById('pills-tab');
    node.querySelector('a.active').classList.remove('active');

    let tab_contabilidad = document.getElementById(tabH);
    tab_contabilidad.classList.add('active');

    let content = document.getElementById('pills-tabContent');
    content.querySelector('.show, .active').classList.remove('show', 'active');

    document.getElementById(tabC).classList.add('show', 'active');

    window.scroll(0, 1000);
  }

  /* Library Sweet Alert */
  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SET_CATALOG") {
          this.setCatalog();
        }
      }
    })
  }

  searchProductDt(dt){
  let productdt =  this.products.find(datos=> datos.id_producto == dt);
  this.tabDetFormule.costoSearFromdet = productdt.costo;
  }
}
