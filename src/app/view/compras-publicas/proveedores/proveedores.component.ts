import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from 'src/app/global'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProveedoresService } from './proveedores.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { IngresoService } from '../../inventario/producto/ingreso/ingreso.service';
import { GlobalTableComponent } from '../../commons/modals/global-table/global-table.component';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
declare const $: any;
import { DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';
import { ModalProveedoresComponent } from './modal-proveedores/modal-proveedores.component';
@Component({
standalone: false,
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {

  @ViewChild("vaSelect") myInputVariable: ElementRef;
  public ddTree: DropDownTreeComponent;

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('certificadoUpload') certificadoUpload: ElementRef;

  newOrigin: any;
  tipoOrigin: any;
  valueLabel: any;
  dataCatalogos: any;
  dataModalsCatalogo: any = { countries: null, provinces: null, value: null, description: null };

  /* extenal information */
  infoArrayContact: any = [];

  fileList: FileList;
  disabledCampo: boolean = false;
  verifyRestore = false;

  fileToUpload: File;
  fileBase64: any;
  nameFile: any;

  /* Actions */
  actions: any = {
    new: false,
    search: false,
    add: true,
    edit: true,
    cancel: true,
    delete: true,
  }

  loading: boolean;

  /* validations */
  dataUser: any;
  permissions: any;
  processing: boolean = false;
  tamDoc: any = 0;
  province: boolean = false;
  city: boolean = false;
  validateDoc: boolean = false;


  /* Information */
  supplier: any = {
    id_proveedor: 0,
    switchCredit: false,
    switchGarant: false,
    cupcredit: 0.00,
    valcredit: 0.00,
    totalcredit: 0.00,
    valmonto: 0.00,
    document: 0,
    constribuyente: 0,
    tipcontribuyente: 0,
    tipo: 0,
    linea: 0,
    docgarantia: 0,
    timecredit: 0,
    origin: 0,
    country: 0,
    province: 0,
    city: 0,
    entidad:0,
    tipocuenta:0,
    codigoAccountporPagar:'',
    nameAccountporPagar:'',
    numCuentaAux:"",
    estado:0,
    numcuenta:'',
    cuentas: [],
    cuentasEliminar: []
  };
  // supplier: any = {
  //   switchCredit: false,
  //   switchGarant: false,
  //   cupcredit: 0.00,
  //   valcredit: 0.00,
  //   totalcredit: 0.00,
  //   valmonto: 0.00,
  //   document: 0,
  //   constribuyente: 0,
  //   tipcontribuyente: 0,
  //   tipo: 0,
  //   linea: 0,
  //   docgarantia: 0,
  //   timecredit: 0,
  //   origin: 0,
  //   country: 0,
  //   province: 0,
  //   city: 0
  // };

  catalog: any = {};
  vmButtons: any;

  treeData: any = false;
  fields: any;
  checkAuth: any = true;
  lineaSendId: any;
  varAux: any = " Seleccione un grupo";
  flagDropDown: any = false;

  cuentas: any = [];
  cuentasEliminar: any = [];
  historicoCuentas: Array<any> = []
  numCuentaAux: any = ""
  estadoList= [
    {value:'A',label:'Activo'},
    {value:'I',label:'Inactivo'},
  ]

  cmb_tipo_contribuyente: Array<any> = [];


  constructor(private toastr: ToastrService, private router: Router, private commonServices: CommonService, private commonVarServices: CommonVarService,
    private provSrv: ProveedoresService, private ingresoSrv: IngresoService, private modalService: NgbModal) {
    this.commonServices.resContactProvider.asObservable().subscribe(res => {
      this.supplier.contact_delete = res.contact_delete;
      this.supplier.contact_modify = res.contact_modify;
    })

    this.commonServices.actionsSearchProviders.asObservable().subscribe(res => {
      console.log(res)
     /* if (res.linea != null) {
        this.lineaSendId = res.linea;
        this.supplier.linea = this.catalog.linea.filter(e => e.id_grupo == res.linea)[0]['nombre'];
        console.log(this.supplier.linea)
        this.myInputVariable['currentText'] = this.supplier.linea;
        res.linea = this.lineaSendId;
        this.varAux = this.myInputVariable['currentText'];
      }*/

      this.supplier = res;
      this.supplier['ruc_axiliar'] = res['docnumber'];
      this.supplier.entidad = res['entidad'];
      this.supplier.numcuenta = res['num_cuenta'];
      this.supplier.tipocuenta = res['tipo_cuenta'];
      this.supplier.numCuentaAux = res['num_cuenta'];

      this.cuentas = res['cuentas'];

      this.docValidate(this.supplier.document);
      this.actions.new = true;
      this.actions.search = true;
      this.actions.add = true;
      this.actions.edit = false;
      this.actions.cancel = false;
      this.actions.delete = false;

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = false;
      //this.vmButtons[4].habilitar = false;
      this.vmButtons[5].habilitar = false;

      var province = this.supplier.province;
      var city = this.supplier.city;
      this.changeGroup(this.supplier.tipo);
      this.provinceSearch(this.supplier.country);
      this.citieSearch(this.supplier.province);

      setTimeout(() => {
        this.supplier.province = province;
        this.province = true;

        this.supplier.city = city;
        this.city = true;
        this.commonVarServices.regProveedores.next({condi:'PROVEEDOR-CERTIFICADO-BANCARIO', identifier: this.supplier.id_proveedor})

      }, 500);
      this. historicoCuentasProveedor();

      this.commonServices.actionsSuppliers.next(this.actions);
    })

    this.commonServices.resAnexosProvider.asObservable().subscribe(res => {
      this.supplier.anexos_delete = res.anexos_delete;
      this.commonVarServices.regProveedores.next({condi:'PROVEEDOR-CERTIFICADO-BANCARIO', identifier: this.supplier.id_proveedor})
    })

    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })
    this.commonVarServices.regProveedores.asObservable().subscribe(
      (res) => {
        console.log(res)
        if(res.custom1 == 'PROVEEDOR-CERTIFICADO-BANCARIO'){
          this.disabledCampo = res.validacion;
        }
      }
    );
    this.provSrv.listaProveedores$.subscribe(
      (res) => {

        console.log(res)

        this.supplier.id_proveedor      = res['id_proveedor'];
        this.supplier.document          = res['tipo_documento'];
        this.supplier.docnumber         = res['num_documento'];
        this.supplier.constribuyente    = res['tipo_persona'];
        this.supplier.tipcontribuyente  = res['contribuyente'];
        this.supplier.rsocial       = res['razon_social'];
        this.supplier.ncomercial    = res['nombre_comercial_prov'];
        this.supplier.replegal      = res['representante_legal'];
        this.supplier.address       = res['direccion'];
        this.supplier.website       = (res['website'] != null) ?  res['website'] : "";
        this.supplier.observation   = (res['observacion'] != null) ?  res['observacion'] : "";
        this.supplier.tipo          = res['clase'];
        this.supplier.linea         = res['linea'];
        this.supplier.phone         = res['telefono'];
        this.supplier.origin        = res['origen'];
        this.supplier.country       = res['pais'];
        this.supplier.province      = res['provincia'];
        this.supplier.city          = res['ciudad'];
        this.supplier.switchCredit  = res['credito'];
        this.supplier.timecredit    = (res['plazo_credito'] != null) ? res['plazo_credito'] : "";
        this.supplier.cupcredit     =  res['cupo_credito'];
        this.supplier.valcredit     = res['valor_credito'];
        this.supplier.totalcredit   =  res['saldo_credito'];
        this.supplier.switchGarant  =  res['garantia_credito'];
        this.supplier.docgarantia   = (res['garantia_documento'] != null) ? res['garantia_documento'] : "";
        this.supplier.valmonto      =  res['garantia_monto'];
        this.supplier.email         = (res['email'] != null) ? res['email'] : "";
        this.supplier.contactos     = res['contactos'];
        this.supplier.anexos        = res['anexos'];
        this.supplier.estado       = res['estado'];

        this.supplier.entidad     =res['entidad'];
        this.supplier.numcuenta   = res['num_cuenta'];
        this.supplier.tipocuenta  = res['tipo_cuenta'];

        this.cuentas        = res['cuentas'];
        this.historicoCuentas = res['historico'];
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = false;
        this.vmButtons[4].habilitar = false;
        this.vmButtons[5].habilitar = false;
        this.commonVarServices.regProveedores.next({condi:'PROVEEDOR-CERTIFICADO-BANCARIO', identifier: res['id_proveedor']})

      }
    )


  }

  PrintSectionCDI() {
    let el: HTMLElement = this.myInputVariable.nativeElement as HTMLElement;
    el.click();
    this.onChange();
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "NUEVO" }, permiso: false, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: true }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.ActivateForm();
    this.validatePermission();
  }

  /* Call Api  */
  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    let params = {
      codigo: myVarGlobals.fProveedores,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Proveedores");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        setTimeout(() => {
          this.processing = true;
          this.fillCatalog();
        }, 1000);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  fillCatalog() {
    let data = {
      params: "'DOCUMENTO','PERSONA','CONTRIBUYENTE','ORIGEN','CLASE','PLAZO','PAIS','GARANTIAS','PROVINCIA','BANCO','TIPO CUENTA','TIPO CONTRIBUYENTE SRI'",
    };
    this.provSrv.getCatalogs(data).subscribe(res => {
      this.catalog.documents = res["data"]["DOCUMENTO"];
      this.catalog.countries = res["data"]["PAIS"];
      this.catalog.persons = res["data"]["PERSONA"];
      /* this.catalog.contrib = res["data"]["CONTRIBUYENTE"]; */
      this.catalog.origin = res["data"]["ORIGEN"];
      this.catalog.class = res["data"]["CLASE"].filter(e => e.valor != "Representaciones" && e.valor != "Mixto");
      this.catalog.time = res["data"]["PLAZO"];
      this.catalog.paises = res["data"]["PAIS"];
      this.catalog.provincias = res["data"]["PROVINCIA"];
      this.catalog.garantias = res["data"]["GARANTIAS"];
      this.catalog.entidad = res["data"]["BANCO"];
      this.catalog.tipoCuenta = res["data"]["TIPO CUENTA"];
      this.cmb_tipo_contribuyente = res['data']['TIPO CONTRIBUYENTE SRI'];

      console.log(this.catalog);

      this.supplier.country = 0;
      this.supplier.province = 0;
      this.supplier.city = 0;
      let flagSend = "";
      this.supplier.tipo = this.catalog.class[0]['valor'];
      if (this.supplier.tipo == "Productos - Inventario") {
        flagSend = "I";
      } else if (this.supplier.tipo == "Servicios") {
        flagSend = "S";
      } else if (this.supplier.tipo == "Proveeduria") {
        flagSend = "P";
      } else if (this.supplier.tipo == "Activos") {
        flagSend = "A";
      }
     // this.lcargando.ctlSpinner(false);
      // this.getAgentRetencion(flagSend);
       this.getGroupsProduct(flagSend);
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  async comprobar() {
    let resp = await this.validarCuentas().then((respuesta)=> {
      if(respuesta) {
        this.supplier.cuentas = this.cuentas;
        console.log(this.supplier.cuentas);
      }
    })
  }

  validCuentas() {
    if(this.supplier.cuentas.length<=0){
      return false;
    } else {
      let sum = 0;
      for(let i=0; i<this.cuentas.length;i++) {
        sum += this.cuentas[i].principal;
        if (
          this.cuentas[i].entidad  == undefined ||
          this.cuentas[i].entidad  == 0
        ) {
          this.toastr.info("Debe seleccionar una entidad para la cuenta "+(i+1));
          return true;
        } else if(
          this.cuentas[i].num_cuenta  == undefined ||
          this.cuentas[i].num_cuenta  == ''
        ) {
          this.toastr.info("Debe escribir un número para la cuenta "+(i+1));
          return true;
        } else if(
          this.cuentas[i].tipo_cuenta  == undefined ||
          this.cuentas[i].tipo_cuenta  == 0
        ) {
          this.toastr.info("Debe seleccionar un tipo para la cuenta "+(i+1));
          return true;
        }
      }
      if(sum==0){
        this.toastr.info("Debe seleccionar una de las cuentas bancarias como principal");
        return true;
      }
      return false;
    }
  }


  validCuentasRep() {
    if(this.supplier.cuentas.length<=0){
      return false;
    } else {
      for(let i=0; i<this.cuentas.length;i++) {
        for(let j=i+1; j<this.cuentas.length;j++){
          if(this.cuentas[i].entidad == this.cuentas[j].entidad && this.cuentas[i].num_cuenta == this.cuentas[j].num_cuenta){
            return true;
          }
        }
      }
      return false;
    }
  }

  validarCuentas() {
    let flag = false;
    return new Promise((resolve, reject) => {
      for(let i=0; i<this.cuentas.length;i++) {
        if (
          this.cuentas[i].entidad  == undefined ||
          this.cuentas[i].entidad  == 0
        ) {
          this.toastr.info("Debe seleccionar una entidad para la cuenta "+(i+1));
          flag = true;
          break;
        } else if(
          this.cuentas[i].num_cuenta  == undefined ||
          this.cuentas[i].num_cuenta  == ''
        ) {
          this.toastr.info("Debe escribir un número para la cuenta "+(i+1));
          flag = true;
          break;
        } else if(
          this.cuentas[i].tipo_cuenta  == undefined ||
          this.cuentas[i].tipo_cuenta  == 0
        ) {
          this.toastr.info("Debe seleccionar un tipo para la cuenta "+(i+1));
          flag = true;
          break;
        }
        for(let j=i+1; j<this.cuentas.length;j++){
          if(this.cuentas[i].entidad == this.cuentas[j].entidad && this.cuentas[i].num_cuenta == this.cuentas[j].num_cuenta){
            this.toastr.info("No pueden existir dos cuentas asociadas al mismo banco y al mismo numero de cuenta" );
            flag = true;
            break;
          }
        }
      }
      !flag ? resolve(true) : resolve(false);
    });
  }

  checkPrincipal(index, event) {
    console.log(event)
    // verifica si el checkbox esta true o false, si esta true es que se marco como principal, todo lo demas pasa a false (solo puede haber un principal)
    for (let i=0; i<this.cuentas.length;i++){
      if(i==index && event.target.checked) {
        this.cuentas[i].principal = 1;
        console.log(this.cuentas)
        this.supplier.entidad =this.cuentas[i].entidad;
        this.supplier.numcuenta =this.cuentas[i].num_cuenta;
        this.supplier.tipocuenta =this.cuentas[i].tipo_cuenta;
      } else {
        this.cuentas[i].principal = 0;
      }
    }
  }

  addCuenta() {
    let t = 0;
    if (this.cuentas.length<=0){
      // si es la primera cuenta que se agrega automaticamente se pone como principal
      t = 1;

    }
    this.cuentas.push({
      id_cuenta: 0,
      fk_proveedor:0,
      entidad: 0,
      num_cuenta: '',
      tipo_cuenta: 0,
      principal: 0,
      nombre_archivo: null,
      archivo_base_64: null
    })
  }

  async removeCuenta(cuenta: any, index: number) {
    if (this.cuentas[index].id_cuenta > 0) {
      const result = await Swal.fire({
        titleText: 'Eliminacion de Cuenta Bancaria',
        text: 'Esta seguro/a de eliminar esta Cuenta Bancaria?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
      })

      if (result.isConfirmed) {
        this.lcargando.ctlSpinner(true)
        try {
          (this as any).mensajeSpinner = 'Eliminando Cuenta Bancaria'
          let response = await this.provSrv.deleteCuentaBancaria({cuenta})
          console.log(response)
          this.cuentas.splice(index, 1)[0].id_cuenta
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.mesagge, 'Error eliminando Cuenta Bancaria')
        }

      }
      // this.cuentasEliminar.push(this.cuentas.splice(index, 1)[0].id_cuenta);
    } else {
      this.cuentas.splice(index, 1);
    }
  }

  getAgentRetencion(flagSend) {
    this.provSrv.getAgentRetencion().subscribe(res => {
      this.catalog.contrib = res["data"]
      // this.getGroupsProduct(flagSend);
      this.lcargando.ctlSpinner(false);
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

   getGroupsProduct(flagSend) {
    this.ingresoSrv.getGrupos().subscribe(res => {
      this.catalog.linea = res["data"];
      this.getTreeProduct({ inactive: this.checkAuth, flag: flagSend });
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

   getTreeProduct(data) {
    this.provSrv.getTreeProducts(data).subscribe(res => {
      this.treeData = res['data'];
      (this.treeData.length == 0) ? this.fields = undefined :
        this.fields = { dataSource: res['data'], value: 'id_grupo', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }

  changeGroup(evt) {
    this.lcargando.ctlSpinner(true);
    let flagSend = "";
    if (evt == "Productos - Inventario") {
      flagSend = "I";
    } else if (evt == "Servicios") {
      flagSend = "S";
    } else if (evt == "Proveeduria") {
      flagSend = "P";
    } else {
      flagSend = "A";
    }
    this.treeData = [];
    this.fields = undefined;
     this.getTreeProduct({ inactive: this.checkAuth, flag: flagSend });
  }

  setProveedor(data) {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para guardar de Proveedores");
      this.router.navigateByUrl('dashboard');
    }
     else {
      this.lcargando.ctlSpinner(true);
      data.id_controlador = myVarGlobals.fProveedores;
      data.accion = `Registro del proveedor ${data.docnumber}`;
      data.ip = this.commonServices.getIpAddress();
      (this.supplier.linea != "" && this.supplier.linea != undefined && this.supplier.linea != null) ? data.linea = this.lineaSendId : data.linea = "";

    //   this.provSrv.saveProveedores(data).subscribe(res => {
    //     //this.toastr.success(res["message"]);
    //     Swal.fire({
    //       icon: "success",
    //       title: "Proveedor Creado",
    //       text: res['message'],
    //       showCloseButton: true,
    //       confirmButtonText: "Aceptar",
    //       confirmButtonColor: '#20A8D8',
    //     })
    //     this.lcargando.ctlSpinner(false);
    //     if(this.fileList!=null){
    //       this.uploadFile(res['data']['id_proveedor'])
    //     }
    //  // this.commonServices.saveProveedores.next({ identifier: data.id_proveedor });
    //     // this.CancelForm();
    //     // setTimeout(() => {
    //     //   this.fillCatalog();
    //     // }, 300);
    //   }, (error) => {
    //     this.lcargando.ctlSpinner(false);
    //     this.toastr.info(error.error.message);
    //   });

      // Logica nueva para mas de una cuenta por proveedor
      this.provSrv.saveProveedoresCuentas(data).subscribe(res => {
        //this.toastr.success(res["message"]);
        Swal.fire({
          icon: "success",
          title: "Proveedor Creado",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        })
        console.log(res);
        this.supplier.id_proveedor = res['data']['id_proveedor'];
        this.cuentas = res['data']['cuentas'];
        this.historicoCuentas = res['data']['historico'];
        for(let i=0; i<this.cuentas.length;i++){
          if(this.cuentas[i].principal){
            this.cuentas[i].principal = 1;
          }else{
            this.cuentas[i].principal = 0;
          }
        }
        this.lcargando.ctlSpinner(false);
        if(this.fileList!=null){
          this.uploadFile(res['data']['id_proveedor'])
        }
      // this.commonServices.saveProveedores.next({ identifier: data.id_proveedor });
        // this.CancelForm();
        // setTimeout(() => {
        //   this.fillCatalog();
        // }, 300);
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = false;
        this.vmButtons[4].habilitar = false;
        this.vmButtons[5].habilitar = false;
      }, (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message);
      });
    }
  }

  patchProveedor(data) {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para editar al proveedor");
      this.router.navigateByUrl('dashboard');
    } else {
      this.lcargando.ctlSpinner(true);
      delete data['anexos'];
      delete data['contactos'];

      data.id_controlador = myVarGlobals.fProveedores;
      data.accion = `Actualización del proveedor ${data.id_proveedor}`;
      data.ip = this.commonServices.getIpAddress();
      (this.supplier.linea != "" && this.supplier.linea != undefined && this.supplier.linea != null) ? data.linea = this.lineaSendId : data.linea = "";

      // this.provSrv.updateProveedores(data).subscribe(res => {
      //   //this.toastr.success(res["message"]);
      //   Swal.fire({
      //     icon: "success",
      //     title: "Proveedor Modificado",
      //     text: res['message'],
      //     showCloseButton: true,
      //     confirmButtonText: "Aceptar",
      //     confirmButtonColor: '#20A8D8',
      //   })
      //   this.lcargando.ctlSpinner(false);
      //   console.log(data.id_proveedor)
      //   if(this.fileList!=null){
      //     this.uploadFile(data.id_proveedor)
      //   }
      //   // this.commonServices.saveProveedores.next({ identifier: data.id_proveedor });
      //   // this.CancelForm();
      //   // setTimeout(() => {
      //   //   this.fillCatalog();
      //   // }, 300);
      // }, (error) => {
      //   this.lcargando.ctlSpinner(false);
      //   this.toastr.info(error.error.message);
      // });

      // nuevo servicio para guardar proveedores y sus cuentas
      this.provSrv.updateProveedoresCuentas(data).subscribe(res => {
        //this.toastr.success(res["message"]);
        Swal.fire({
          icon: "success",
          title: "Proveedor Modificado",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        })
        this.cuentas = res['data']['cuentas'];
        this.historicoCuentas = res['data']['historico'];
        for(let i=0; i<this.cuentas.length;i++){
          if(this.cuentas[i].principal){
            this.cuentas[i].principal = 1;
          }else{
            this.cuentas[i].principal = 0;
          }
        }
        console.log(res);
        this.cuentasEliminar = []; // REINICIO EL ARRAY DE IDS A ELIMINAR PARA QUE NO DE ERROR EN BACKEND
        this.lcargando.ctlSpinner(false);
        if(this.fileList!=null){
          this.uploadFile(data.id_proveedor)
        }
        // this.commonServices.saveProveedores.next({ identifier: data.id_proveedor });
        // this.CancelForm();
        // setTimeout(() => {
        //   this.fillCatalog();
        // }, 300);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });

    }
  }

  destroyProveedor(data) {
    this.lcargando.ctlSpinner(true);
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene Permiso para eliminar al proveedor");
      this.router.navigateByUrl('dashboard');
    } else {
      data.id_controlador = myVarGlobals.fProveedores;
      data.accion = `Borrado del proveedor ${data.id_proveedor}`;
      data.ip = this.commonServices.getIpAddress();

      this.provSrv.deleteProveedor(data).subscribe(res => {
        this.toastr.success(res["message"]);
        this.lcargando.ctlSpinner(false);
        this.CancelForm();
        setTimeout(() => {
          this.fillCatalog();
        }, 300);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }
  }

  /* Common Methods */
  ActivateForm() {
    this.actions.new = true;
    this.actions.search = true;
    this.actions.add = false;
    this.actions.edit = true;
    this.actions.cancel = false;
    this.actions.delete = true;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    //this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = true;

    this.supplier.province = 0;
    this.supplier.city = 0

    this.province = false;
    this.city = false;
   // this.commonServices.actionsSuppliers.next(this.actions);
  }

  CancelForm() {
    this.actions.new = true;
    this.actions.search = false;
    this.actions.add = true;
    this.actions.edit = true;
    this.actions.cancel = true;
    this.actions.delete = true;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    //this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;
    this.varAux = " Seleccione un grupo";
    this.historicoCuentas = []

   // this.commonServices.actionsSuppliers.next(this.actions);
    this.ClearForm();
  }

  ClearForm() {
    this.lcargando.ctlSpinner(true);
    /* this.supplier = {
      switchCredit: false, switchGarant: false, cupcredit: 0.00, valcredit: 0.00, totalcredit: 0.00, valmonto: 0.00,
    }; */
    this.supplier = {
      switchCredit: false,
      switchGarant: false,
      cupcredit: 0.00,
      valcredit: 0.00,
      totalcredit: 0.00,
      valmonto: 0.00,
      document: 0,
      constribuyente: 0,
      tipcontribuyente: 0,
      tipo: 0,
      linea: 0,
      docgarantia: 0,
      timecredit: 0,
      origin: 0,
      country: 0,
      province: 0,
      city: 0,
      cuentas: [],
      cuentasEliminar: []
    };

    this.cuentas = [];
    this.cuentasEliminar = [];
    this.historicoCuentas =[]
    this.fileList=undefined;
    this.commonServices.clearAnexos.next({});
    this.disabledCampo = false;

    let flagSend = "";
    this.supplier.tipo = this.catalog.class[0]['valor'];
    if (this.supplier.tipo == "Productos - Inventario") {
      flagSend = "I";
    } else if (this.supplier.tipo == "Servicios") {
      flagSend = "S";
    } else if (this.supplier.tipo == "Proveeduria") {
      flagSend = "P";
    } else if (this.supplier.tipo == "Activos") {
      flagSend = "A";
    }
    this.getTreeProduct({ inactive: this.checkAuth, flag: flagSend });

  }

  clearSwitchCredit() {
    this.supplier.timecredit = 0;
    this.supplier.cupcredit = 0.00;
    this.supplier.valcredit = 0.00;
    this.supplier.totalcredit = 0.00;
  }

  clearSwitchGarant() {
    this.supplier.docgarantia = 0;
    this.supplier.valmonto = 0.00;
  }

  calculateCredit() {
    setTimeout(() => {
      let balance = [this.supplier.cupcredit, this.supplier.valcredit].reduce((a, b) => {
        return a - b
      })
      this.supplier.totalcredit = parseFloat(balance).toFixed(2);
    }, 500);
  }

  async saveProveedor() {
    this.supplier.cuentas = this.cuentas;
    this.supplier.cuentasEliminar = this.cuentasEliminar;
    await this.commonValidate(0).then(resp => {
      if (resp) {
        this.commonServices.contactProvider.next(null);
        if(this.supplier.cuentas.length>0){
          this.confirmSave("Seguro desea guardar el proveedor?", "SET_SUPPLIERS");
        }
        else{
          this.confirmSave("Seguro desea guardar el proveedor sin cuentas bancarias asociadas?", "SET_SUPPLIERS");
        }
      }
    })
  }

  async updateProveedor() {
    this.supplier.cuentas = this.cuentas;
    this.supplier.cuentasEliminar = this.cuentasEliminar;
    await this.commonValidate(1).then(resp => {
      if (resp) {
        this.commonServices.contactProvider.next(null);
        this.commonServices.anexosProvider.next(null);
        this.confirmSave("Seguro desea actualizar el proveedor?", "PATCH_SUPPLIERS");
      }
    });
  }

  deleteProveedor() {
    this.confirmSave("Seguro desea eliminar el proveedor?", "DESTROY_SUPPLIERS");
  }
  historicoCuentasProveedor() {
    let data = {
     id_proveedor:this.supplier.id_proveedor
    }
     this.provSrv.getProveedorHistoricoCuentas(data).subscribe(res => {
      if (res["status"] == 1) {
        this.historicoCuentas = res['data'];
      } else {
        this.historicoCuentas = [];

      }
    }
    //  }, error => {
    //    this.toastr.info(error.error.message);
    //  }
    )
   }

  /* Validation Forms */
  commonValidate(action) {
    return new Promise((resolve, reject) => {
      if (this.supplier.document == 0) {
        document.getElementById("document").focus();
        this.toastr.info("Seleccione un documento");
      } else if (this.supplier.docnumber == undefined || this.supplier.docnumber == 0) {
        document.getElementById("docNumber").focus();
        this.toastr.info("Ingrese un número de documento");
      } else if ((this.supplier.docnumber.toString().length < 10 || this.supplier.docnumber.toString().length > 10) && this.supplier.document == 'Cedula') {
        document.getElementById("docNumber").focus();
        this.toastr.info("Cantidad de dígitos no corresponde al tipo de documento");
      } else if ((this.supplier.docnumber.toString().length < 13 || this.supplier.docnumber.toString().length > 13) && this.supplier.document == 'Ruc') {
        document.getElementById("docNumber").focus();
        this.toastr.info("Cantidad de dígitos no corresponde al tipo de documento");
      } else if (this.supplier.constribuyente == 0) {
        document.getElementById("constribuyente").focus();
        this.toastr.info("Seleccione el tipo de persona");
      } else if (this.supplier.tipcontribuyente == 0) {
        document.getElementById("tipcontribuyente").focus();
        this.toastr.info("Seleccione el tipo contribuyente");
      } else if (this.supplier.rsocial == undefined || this.supplier.rsocial == "") {
        document.getElementById("rsocial").focus();
        this.toastr.info("Ingrese una Razón Social");
      } else if (this.supplier.ncomercial == undefined || this.supplier.ncomercial == "") {
        document.getElementById("ncomercial").focus();
        this.toastr.info("Ingrese un Nombre Comercial");
      } else if (this.supplier.constribuyente != 'Natural' && (this.supplier.replegal == undefined || this.supplier.replegal == "")) {
        document.getElementById("replegal").focus();
        this.toastr.info("Ingrese un Representante Legal");
      } else if (this.supplier.address == undefined || this.supplier.address == "") {
        document.getElementById("address").focus();
        this.toastr.info("Ingrese una dirección");
      } else if (this.supplier.tipo == 0) {
        document.getElementById("tipo").focus();
        this.toastr.info("Seleccione un tipo de proveeduría");
      }
      // else if (this.supplier.linea == "" || this.supplier.linea == undefined || this.supplier.linea == null) {
      //   document.getElementById("linea").focus();
      //   this.toastr.info("Seleccione una linea de producto");
      // }
      else if (this.supplier.phone == undefined || this.supplier.phone == "") {
        document.getElementById("phone").focus();
        this.toastr.info("Ingrese un teléfono");
      } else if (this.supplier.origin == 0) {
        document.getElementById("origin").focus();
        this.toastr.info("Seleccione un origen");
      } else if (this.supplier.country == undefined || this.supplier.country == 0) {
        document.getElementById("country").focus();
        this.toastr.info("Seleccione un país");
      } else if (this.supplier.province == undefined || this.supplier.province == 0) {
        document.getElementById("province").focus();
        this.toastr.info("Seleccione una provincia");
      } else if (this.supplier.city == undefined || this.supplier.city == 0) {
        document.getElementById("city").focus();
        this.toastr.info("Seleccione una ciudad");
      } else if (!this.validateCredit()) {
        /* Su validación se encuentra en otra función */
      } else if (!this.validarEmail(this.supplier.email)) {
        this.toastr.info("El correo no es válido !!");
        document.getElementById("idCorreoFac").focus();
      } else if (this.validDocxPersona()) {
        // validacion para solo poder escoger RUC si es tipo persona juridica y viceversa
        this.toastr.info("Tipo de persona juridica solo puede tener RUC como documento" );
      } else if (this.validCedARuc()) {
        // validacion para poder cambiar doc de cedula a RUC pero no viceversa
        this.toastr.info("No puede cambiar tipo de documento RUC" );
      } else if (this.validCuentas()) {
        // validacion para no campos vacios en cuentas bancarias
      } else if (this.validCuentasRep()) {
        // validacion para que las cuentas bancarias no se repitan
        this.toastr.info("No pueden existir dos cuentas asociadas al mismo banco y al mismo numero de cuenta" );
      }
      else {
        if (action === 0) {
          this.lcargando.ctlSpinner(true);
          this.provSrv.validateDoc({ cedula: this.supplier.docnumber }).subscribe(res => {
            this.lcargando.ctlSpinner(false);
            if (res['data'].length > 0) {
              this.toastr.info(`La información ${this.supplier.docnumber} ya se encuentra registrada.`);
              document.getElementById("docNumber").focus();
            } else {
              resolve(true);
            }
          });
        } else if (action === 1) {
          console.log('avanza a modificar');
          resolve(true);
        }
      }
    });
  }

  validDocxPersona() {
    if(
      (this.supplier.constribuyente!='Natural' && this.supplier.document!='Ruc')
    ){
      return true;
    }
    return false;
  }

  validCedARuc() {

    return false;
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  validateCredit(): boolean {
    if (this.supplier.switchCredit) {
      if (this.supplier.timecredit == 0) {
        document.getElementById("timecredit").focus();
        this.toastr.info("Seleccione un plazo de crédito");
        return false;
      } else if (this.supplier.cupcredit == null) {
        document.getElementById("cupcredit").focus();
        this.toastr.info("Ingrese un cupo de crédito");
        return false;
      }
    } if (this.supplier.switchGarant) {
      if (this.supplier.docgarantia == undefined) {
        document.getElementById("docgarantia").focus();
        this.toastr.info("Seleccione un documento de garanía");
        return false;
      } else if (this.supplier.valmonto == null) {
        document.getElementById("valmonto").focus();
        this.toastr.info("Ingrese un monto de garantía");
        return false;
      }
    }
    return true;
  }

  searchProviders() {
    const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content' });
    modalInvoice.componentInstance.title = "PROVEEDOR";
    modalInvoice.componentInstance.module = this.permissions.id_modulo;
    modalInvoice.componentInstance.component = myVarGlobals.fProveedores;
  }
  expandListProveedores() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Proveedores.");
    } else {
      const modalInvoice = this.modalService.open(ModalProveedoresComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module = this.permissions.id_modulo;
      modalInvoice.componentInstance.component = myVarGlobals.fProveedores;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      //modalInvoice.componentInstance.validacion = 8;
    }
  }

  onlyNumber(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  /* OnChange */
  docValidate(event) {
    document.getElementById("docNumber").focus();
    if (event == "Cedula") {
      this.tamDoc = 10;
    } else if (event == "Ruc") {
      this.tamDoc = 13;
    } else if (event == "Pasaporte") {
      this.tamDoc = 12;
    }
  }

  searchProvinces(event) {
    this.lcargando.ctlSpinner(true);
    this.provSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.catalog.province = res['data'];

      this.province = true;
      this.city = false;
      setTimeout(() => {
        this.supplier.province = 0;
        this.catalog.city = undefined;
        this.supplier.city = 0;
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  searchCities(event) {
    this.lcargando.ctlSpinner(true);
    this.provSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.catalog.city = res['data'];

      this.city = true;
      setTimeout(() => {
        this.supplier.city = 0;
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  provinceSearch(event) {
    this.provSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.province = res['data'];
      this.province = true;
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  citieSearch(event) {
    this.provSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.city = res['data'];
      this.city = true;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  /* Modals */
  setCatalogoTitle(d, type, data) {
    $('#locationModal').appendTo("body").modal('show');
    this.newOrigin = d;
    this.tipoOrigin = type;
    this.valueLabel = data;
  }

  cancelcatalogo() {
    this.dataModalsCatalogo = {};
  }

  vaidateSaveCatalogo() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (this.dataModalsCatalogo.value == null) {
        this.toastr.info("Ingrese un valor");
        document.getElementById("IdValorCatalogo").focus();
        return;
      } else {
        this.validaNameGlobal(this.dataModalsCatalogo.value, this.tipoOrigin);
      }
      setTimeout(() => {
        if (this.dataModalsCatalogo.valNameGlobal) {
          document.getElementById("IdValorCatalogo").focus();
        } else if ((this.tipoOrigin == 'PROVINCIA') &&
          (this.dataModalsCatalogo.countries == null)) {
          this.toastr.info("Seleccione país");
          document.getElementById("IdproductSendNg").focus();
        } else if ((this.tipoOrigin == 'CIUDAD') &&
          (this.dataModalsCatalogo.provinces == null)) {
          this.toastr.info("Seleccione una Provincia");
          document.getElementById("IdproductSendNg").focus();
        } else {
          this.confirmSave('Seguro desea crear el registro?', 'ADD_CATALOGO');
        }
      }, 1000);
    }
  }

  validaNameGlobal(value, type) {
    let data = {
      valor: value,
      type: type
    }
    this.ingresoSrv.getValidaNameGlobal(data).subscribe(res => {
      this.dataModalsCatalogo.valNameGlobal = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.dataModalsCatalogo.valNameGlobal = true;
      this.toastr.info(error.error.message);
    })
  }

  /* Confirm CRUD's */
  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SET_SUPPLIERS") {
          this.setProveedor(this.supplier);
        } else if (action == "PATCH_SUPPLIERS") {
          this.patchProveedor(this.supplier);
        } else if (action == "DESTROY_SUPPLIERS") {
          this.destroyProveedor(this.supplier);
        } else if (action == "ADD_CATALOGO") {
          ($('#locationModal') as any).modal('hide');
          this.crearCatalogo();
        }
      }
    })
  }

  crearCatalogo() {
    let grupo;
    if (this.dataModalsCatalogo.provinces == null && this.dataModalsCatalogo.countries == null) {
      grupo = null;
    } else if (this.dataModalsCatalogo.countries != null) {
      grupo = this.dataModalsCatalogo.countries;
    } else if (this.dataModalsCatalogo.provinces != null) {
      grupo = this.dataModalsCatalogo.provinces;
    }
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de valor ${this.dataModalsCatalogo.value} como nuevo catálogo`,
      id_controlador: myVarGlobals.fProveedores,
      tipo: this.tipoOrigin,
      group: grupo,
      descripcion: this.dataModalsCatalogo.description,
      valor: this.dataModalsCatalogo.value,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }

    this.ingresoSrv.saveRowCatalogo(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.dataModalsCatalogo.description = null;
      this.dataModalsCatalogo.value = null;
      this.dataModalsCatalogo.provinces = null;
      this.dataModalsCatalogo.countries = null;
      this.province = false;
      this.city = false;

      this.catalog = {};
      this.fillCatalog();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.ActivateForm();
        break;
      case "BUSCAR":
        //this.searchProviders();
        this.expandListProveedores();
        break;
      case "GUARDAR":
        this.saveProveedor();
        break;
      case "MODIFICAR":
        this.updateProveedor();
        break;
      case "CANCELAR":
        this.CancelForm();
        break;
      case "ELIMINAR":
        this.deleteProveedor();
        break;
    }
  }

  selectCountry(e) {
    if (e == 0 || e == 'Extranjero') {
      this.supplier.country = 0;
      this.supplier.city = 0;
      this.supplier.province = 0;
      this.catalog.city = undefined;
      this.catalog.province = undefined;
    } else {
      this.supplier.country = this.catalog.countries.filter(evt => evt.valor == "Ecuador")[0]['valor']
      this.searchProvinces(this.supplier.country);
    }
  }

  onChange() {
    this.lineaSendId = "";
    this.supplier.linea = this.myInputVariable['currentValue'][0];
    this.lineaSendId = this.myInputVariable['currentValue'][0];
  }
 cargaCertificado(archivo: FileList, index:number) {

    console.log(archivo)
    console.log(index)
    // Convertir en base 64
    this.fileToUpload = archivo[0];

    let reader = new FileReader();

    reader.onload = async (event: any) => {
      this.cuentas[index].nombre_archivo = this.fileToUpload.name;
      this.cuentas[index].archivo_base_64 = event.target.result;

      if(this.cuentas[index].id_cuenta && this.cuentas[index].id_cuenta != 0){
        this.lcargando.ctlSpinner(true)
        (this as any).mensajeSpinner = 'Almacenando Certificado'
        try {
          let response = await this.provSrv.saveCertificado({
            id: this.cuentas[index].id_cuenta,
            certificado: this.cuentas[index].archivo_base_64,
            nombre: this.cuentas[index].nombre_archivo
          })
          console.log(response)
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error almacenando Certificado')
        }
      }

    };
    reader.readAsDataURL(this.fileToUpload);
  }

  descargarCertificado($data){
    const linkSource = $data.archivo_base_64;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = $data.nombre_archivo;
    downloadLink.click();
  }

  async eliminarCertificado(data: any, index: number)
  {
    const result = await Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de borrar el Certificado Bancario?",
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      if( data.id_cuenta!= 0 && data.id_cuenta != undefined ){
        this.lcargando.ctlSpinner(true)
        try {
          (this as any).mensajeSpinner = 'Eliminando Certificado'
          let response = await this.provSrv.deleteCertificado({id: data.id_cuenta})
          console.log(response)
          this.cuentas[index].nombre_archivo = null;
          this.cuentas[index].archivo_base_64 = null;
          this.lcargando.ctlSpinner(false)
          Swal.fire('Certificado eliminado correctamente.', '', 'success')
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
        }
      } else {
        this.cuentas[index].nombre_archivo = null;
        this.cuentas[index].archivo_base_64 = null;
      }
    }

  }
  eliminarCertificadoBanc(id_cuenta, index){
    this.loading = true;
    let data = {
      // info: this.areaForm,
      // ip: this.commonService.getIpAddress(),
      // accion: "get folder digital",
      // id_controlador: myVarGlobals.fBovedas,
      id_proveedor:this.supplier.id_proveedor,
      id_cuenta : id_cuenta
    };

    this.provSrv.deleteCertificadoBancario(data)
      .subscribe({
        next: (rpt:any /*  GeneralResponseI */) => {
      console.log(rpt)
        //  this.messageService.add({key: 'bc', severity:'success', summary: 'Confirmado', detail: 'Documento digital borrado correctamente.'});
        if( rpt['status']==1){
          Swal.fire({
            icon: "success",
            title: "Certificado Bancario eliminado con éxito!",
            text: rpt['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          })

          this.cuentas = rpt['data']
        }
        this.loading = false;
        },
        error: (e) => {
          console.log(e.data);
          this.loading = false;

        },
    });
  }

  handleButtonUpload(index: number) {
    document.getElementById(`anexo${index}`).click()
  }

  resetInput(index: number) {
    document.getElementById(`anexo${index}`).click()
    // Limpia el valor seleccionado para que el cambio se dispare siempre
    this.certificadoUpload.nativeElement.value = null;

    // Dispara el evento de clic en el nuevo elemento de entrada de archivo
    this.certificadoUpload.nativeElement.click();
  }


  cargaArchivo(archivos) {

    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Certificado Bancario')
      }, 50)
    }
  }
  uploadFile(id) {
    console.log('upload files '+ id)
    let data = {
      //module: this.permissions.id_modulo,
      module:4,
      component: myVarGlobals.fProveedores,
      identifier: id,
      id_controlador: myVarGlobals.fProveedores,
      accion: `Nuevo anexo para Registro de Proveedores Certificado Bancario ${id}`,
      ip: this.commonServices.getIpAddress(),
      custom1:'PROVEEDOR-CERTIFICADO-BANCARIO'
    }
    console.log(data)
    this.UploadService(this.fileList[0], data);
    // if(this.fileList.length!=0){
    //   for (let i = 0; i < this.fileList.length; i++) {

    //   }
    // }
    this.fileList = undefined
    this.lcargando.ctlSpinner(false)
  }
  UploadService(file, payload?: any): void {
    console.log('G',payload)
    this.provSrv.uploadAnexo(file, payload).subscribe(
      (res: any) => {
        console.log(res)
        if (res.type == 4) {
          console.log('Fin de carga de archivo', {condi:'PROVEEDOR-CERTIFICADO-BANCARIO', identifier: res.body.identifier})
          this.commonVarServices.regProveedores.next({condi:'PROVEEDOR-CERTIFICADO-BANCARIO', identifier: payload.identifier})
        }
      },
      err => {
        console.log(err)
        this.toastr.info(err.error.message);
      })
  }


}
