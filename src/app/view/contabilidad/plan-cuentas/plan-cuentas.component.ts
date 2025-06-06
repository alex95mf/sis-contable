import { Component, OnInit, ViewChild,EventEmitter, Output} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanCuentasService } from './plan-cuentas.service'
import * as myVarGlobals from '../../../global';
import { CommonService } from '../../../services/commonServices'
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../../services/excel.service';
import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CcModalTablaCatalogoPresupuestoComponent } from 'src/app/config/custom/cc-modal-tabla-catalogo-presupuesto/cc-modal-tabla-catalogo-presupuesto.component';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ModalReglaPresupuestariaComponent } from './modal-regla-presupuestaria/modal-regla-presupuestaria.component';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';


@Component({
standalone: false,
  selector: 'app-plan-cuentas',
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.scss'],
  providers: [DialogService,MessageService]

})
export class PlanCuentasComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Output() onNodeSelect = new EventEmitter<any>();
  gridConfig: object;
  grid: any;

  selectedNode2: any;

  gubernamental = [
    {
      value: 'SI',
      descripcion: "SI"
    }, {
      value: 'NO',
      descripcion: "NO"
    }

  ];

  field: any;
  cssClass: any = "custom";
  lengthCaracter: any;
  treeData: any;
  dataUser: any;
  permisions: any;
  codigoGlobalMayor: any;
  numAccountMayor: any;
  numCuentaPadre: string;
  numCatalogoCodigo: any;
  numCatalogoCodigoHaber: any;
  numAccountCierre: any;
  nameAccountMayor: any;
  numaccountCierreCon: any;
  nameAccountCierreCon: any;
  nameCatalogoPresupuesto: any;
  nameCatalogoPresupuestoHaber: any;
  numCatalogoPresupuestoCon: any;
  nameCatalogoPresupuestoCon: any;
  nameAccountCierre: any;
  tipeAccountMayor: any;
  nivelAccountMayor: any;
  saldoAccountMayor: any /* = "$ 100.000.000,0000" */ = parseFloat('0.0000').toFixed(4);
  validaSaldo: any;
  estadoAccountMayor: any;
  claseAccountMayor: any;
  idAccountMayor: any;
  cuentaAccount: any;
  nameAccount: any;
  nivelAccount: any;
  claseCuenta: any = null;
  nameCodigoficial: any;
  codigoficial: any;
  codigoMigrado: any;
  newAcc: any;
  clasAction: any;
  grupoDetail: any;
  grupoCuenta: any = null;
  grupoGubCuenta: any = null;
  disabledNew: any;
  btnModificar: any;
  btnGuardar: any;
  aa: any;
  codigoSaveFinal: any;//codigo a guardar
  tipoSaveFinal: any;//grupo a guardar
  icon_edit: any;
  validaAcc: any = false;
  excelData: any = [];
  dataPrint: any;
  btnPrint: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  checkAuth: any = true;
  valueDivisa: any;
  numAccount: any;
  processing: any = false;
  vmButtons: any;
  empresLogo: any;

  permiso_ver: any = "0";
  Isgubernamental: any;
  iSgubenamentalCon: any;

  cod_ref_auxiliar: string;
  desc_ref_auxiliar: string;

  cmb_catalogo_auxiliares: Array<any> = [];
  public grupos: any
  public gruposLoading: boolean = false
  loading: boolean = false;
  cmb_estado: Array<any> = [
    { value: 'A', label: 'ACTIVO' },
    { value: 'I', label: 'INACTIVO' },
  ]
  estadoAccount: any;
  showActivos: boolean = true;

  paginate: any;
  filter: any;
  reglas:any;
  listEstado: any = [
    'A',
    'I'
  ]

  constructor
    (
      private pCuentasService: PlanCuentasService,
      private commonService: CommonService,
      private toastr: ToastrService,
      private excelService: ExcelService,
      private modalService: NgbModal,
      public dialogService: DialogService,
      private messageService: MessageService
    ) {

    const data = [];

    this.Isgubernamental = 'SI';

    this.gridConfig = {

      title: 'ARBOL PLAN DE CUENTAS',
      height: 'fit',
      selModel: 'rows',
      trackOver: true,
      id: 'GridPlanCuenta',
      theme: 'gray',
      tbar:
        [
          {
            text: 'Expadir Todo',
            handler: function () {
              var me = this;
              me.expandAll();
            },
          }, {
            text: 'Contraer Todo',
            handler: function () {

              var me = this;
              me.collapseAll();

            },
          },
        ],
      data: {
        items: data,
        fields: ['cuenta', 'descripcion', 'nivel', 'codigo_padre', 'clase']
      },
      events: this.getEvents(),
      defaults: {
        type: 'string',
        sortable: true,
        resizable: true
      },
      columns: [
        {
          index: 'nivel',
          title: 'NIVEL',
          format: 'number',
          type: 'number',
          editable: false,
          width: 65
        }, {
          type: 'tree',
          title: 'CUENTA',
          width: 200,
          editable: false,
          index: 'cuenta'
        }, {
          index: 'descripcion',
          title: 'NOMBRE CUENTA',
          minWidth: 350,
          flex: 1
        }, {
          index: 'codigo_padre',
          title: 'CUENTA PADRE',
          width: 200
        }, {
          index: 'clase',
          title: 'CLASE',
          width: 200
        }
      ]
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion de arranque
  */

  ref: DynamicDialogRef;

  async ngOnInit() {

    this.getButtons();


    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
      this.CargarPlanCuentaArbolNew(this.grid, this.listEstado)
    }, 50);

    await this.loadCatalogoAuxiliares();


    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fPlanCuentas,
      id_rol: id_rol
    }

    this.commonService.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'];

      this.permiso_ver = this.permisions[0].ver;

      if (this.permisions[0].ver == "0") {

        this.toastr.info("Usuario no tiene Permiso para ver el formulario de plan de cuentas");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);

      } else {

        this.getLengtParameters();

      }
    }, error => {

      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })

  }

  /* Funcion que contiene todo los eventos del grid para el arbol */
  getEvents() {
    return [
      {
        init: this.CargarPlanCuentaArbol,
        scope: this
      }, {
        rowdblclick: this.DbClicEventPlanCuenta,
        scope: this
      }
    ];
  }

  // nodeSelect(event) {
  //   console.log(event);
  //   // this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.data.name});
  // }
  nodeSelect(event: any): void {
    console.log('Nodo seleccionado:', event.node);
    console.log('Evento completo:', event); // Información completa del evento

    // Lógica adicional aquí
}

  nodeUnselect(event) {
    console.log(event);
      this.messageService.add({severity: 'info', summary: 'Node Unselected', detail: event.node.data.name});
  }
  CargarPlanCuentaArbolNew(grid, estado?: []) {
    // this.grid ||= grid;

    // grid.showLoadMask('Cargando...')
    this.gruposLoading = true
    this.pCuentasService.JsonPlanCuentaNew({ estado }).subscribe((res: any) => {

      // let arreglo_tree = ((res['data'])[0].json_agg).replaceAll("child3", "child").replaceAll("child4", "child").replaceAll("child5", "child").replaceAll("child6", "child").replaceAll("child7", "child");
      // let obj = JSON.parse(arreglo_tree);

      this.grupos = this.mapResponseToNode(res.data)
      console.log(this.grupos);
      this.gruposLoading = false

      // grid.setData(obj);
      // grid.update();

      // grid.hideLoadMask();


    }, error => {
      console.log(error)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error?.mesagge);

    })

  }

  mapResponseToNode = (elements: any[]) => {
    return elements.map(elem => {
      const nodeElem = {
        data: {
          nivel: elem.nivel,
          codigo: elem.codigo,
          nombre: elem.nombre,
          codigo_padre: elem.codigo_padre,
          clase: elem.clase,
        },
        children: elem.children ? this.mapResponseToNode(elem.children) : []
      }
      return nodeElem
    })
  }

  /* Cargar plan de cuentas grid*/
  CargarPlanCuentaArbol(grid, estado?: string) {
    this.grid ||= grid;

    grid.showLoadMask('Cargando...')
    this.pCuentasService.JsonPlanCuenta({ estado }).subscribe(res => {

      let arreglo_tree = ((res['data'])[0].json_agg).replaceAll("child3", "child").replaceAll("child4", "child").replaceAll("child5", "child").replaceAll("child6", "child").replaceAll("child7", "child");
      let obj = JSON.parse(arreglo_tree);

      console.log(obj);

      grid.setData(obj);
      grid.update();

      grid.hideLoadMask();


    }, error => {
      console.log(error)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error?.mesagge);

    })

  }


  onClicConsultaCatalogoPresupuesto(content) {
    // debugger

    let busqueda = (typeof this.numCatalogoCodigo === 'undefined') || this.numCatalogoCodigo === null ? "" : this.numCatalogoCodigo;

    let consulta = {
      busqueda: this.numCatalogoCodigo
    }

    localStorage.setItem("busqueda_presupuesto", busqueda)
    localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTablaCatalogoPresupuestoComponent, {
      header: 'Catalogo codigo presupuestario',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((catalogo: any) => {

      if (catalogo) {

        this.numCatalogoCodigo = catalogo["data"].codigo;
        this.nameCatalogoPresupuesto = catalogo["data"].nombre;

      }

    });



  }

  onClicConsultaCatalogoPresupuestoHaber(content) {
    // debugger

    let busqueda = (typeof this.numCatalogoCodigoHaber === 'undefined') || this.numCatalogoCodigoHaber === null ? "" : this.numCatalogoCodigoHaber;

    let consulta = {
      busqueda: this.numCatalogoCodigoHaber
    }

    localStorage.setItem("busqueda_presupuesto", busqueda)
    localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTablaCatalogoPresupuestoComponent, {
      header: 'Catalogo codigo presupuestario',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((catalogo: any) => {

      if (catalogo) {

        this.numCatalogoCodigoHaber = catalogo["data"].codigo;
        this.nameCatalogoPresupuestoHaber = catalogo["data"].nombre;

      }

    });



  }

  DbClicEventPlanCuenta(grid, o) {
    this.onNodeSelecting(o.data.cuenta);
  }



  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para crear el archivo excel
  */
  exportAsXLSX() {
    this.lcargando.ctlSpinner(false);
    this.excelService.exportAsExcelFile(this.excelData[0], 'Cuentas');
  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para obtener los parameytros de validacion de caracteres y longitudes
  */
  getLengtParameters() {
    this.pCuentasService.getLengtCaracteres().subscribe(res => {

      //debugger
      this.lengthCaracter = res['data'][0];

      this.printData();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }




  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para seleccionar el nodo
  */
  onNodeSelecting(id: any) {

    this.lcargando.ctlSpinner(true);
    this.disabledNew = true;

    this.vmButtons[0].habilitar = false; //nuevo
    this.vmButtons[1].habilitar = true; //guardar
    this.vmButtons[2].habilitar = true; //editar

    this.newAcc = false;
    this.btnGuardar = false;

    this.validaAcc = true;
    this.btnModificar = false;

    this.setNewAccount();
    this.codigoGlobalMayor = id;
    let data = {
      id_account: id
    }

    this.pCuentasService.getPlanCuentas(data).subscribe(res => {

      console.log(res);

      this.numAccountMayor = res['data'][0].codigo.trim();
      this.numCuentaPadre = res['data'][0].codigo_padre.trim();
      this.nameAccountMayor = res['data'][0].nombre.trim();
      this.tipeAccountMayor = res['data'][0].tipo.trim();
      this.nivelAccountMayor = res['data'][0].nivel.trim();
      this.estadoAccountMayor = (res['data'][0].estado.trim() == "A") ? 'ACTIVO' : 'PASIVO';
      this.estadoAccount = res['data'][0].estado.trim();
      this.claseAccountMayor = res['data'][0].clase.trim();
      this.idAccountMayor = res['data'][0].id;
      this.saldoAccountMayor = res['data'][0].saldo.toString().substring(0, 1);
      // (this.saldoAccountMayor == '-') ? this.validaSaldo = true : this.validaSaldo = false;
      this.validaSaldo = this.saldoAccountMayor == '-';
      this.saldoAccountMayor = (this.validaSaldo) ? "( " + this.saldoAccountMayor + " )" : this.saldoAccountMayor;
      this.saldoAccountMayor = this.commonService.formatNumber(parseFloat(res['data'][0].saldo));

      this.numAccountCierre = res['data'][0].cuenta_cierre;//.trim();
      this.nameAccountCierre = res['data'][0].nom_cuenta_cierre;//.trim();
      this.numaccountCierreCon = res['data'][0].cuenta_cierre;//.trim();
      this.nameAccountCierreCon = res['data'][0].nom_cuenta_cierre;//.trim();

      this.numCatalogoCodigo = res['data'][0].codigo_presupuesto;//.trim();
      this.numCatalogoCodigoHaber = res['data'][0].codigo_presupuesto_haber;//.trim();
      this.nameCatalogoPresupuesto = res['data'][0].presupuesto_debe;//.trim();
      this.nameCatalogoPresupuestoHaber = res['data'][0].presupuesto_haber;//.trim();
      // this.nameCatalogoPresupuesto = res['data'][0].nombre_catalogo_presupuesto;//.trim();
      // this.nameCatalogoPresupuestoHaber = res['data'][0].nombre_catalogo_presupuesto_haber;//.trim();
      this.numCatalogoPresupuestoCon = res['data'][0].codigo_presupuesto;//.trim();
      this.nameCatalogoPresupuestoCon = res['data'][0].nombre_catalogo_presupuesto;//.trim();
      this.Isgubernamental = res['data'][0].cuenta_gubernamental;//.trim();
      this.iSgubenamentalCon = res['data'][0].cuenta_gubernamental;//.trim();

      this.cod_ref_auxiliar = res['data'][0].cod_ref_auxiliar;
      this.desc_ref_auxiliar = res['data'][0].desc_ref_auxiliar;
      this.grupoGubCuenta = res['data'][0].tipo_gubernamental;

      /* ((this.lengthCaracter.lengthniveles - 1) == (parseInt(this.nivelAccountMayor) + 1)) ? this.grupoDetail = true : this.grupoDetail = false; */
      /*esta linea fue reemplazada por la de ariba*/
      (parseInt(this.nivelAccountMayor) >= 4) ? this.grupoDetail = true : this.grupoDetail = false;
      (parseInt(this.nivelAccountMayor) >= 4) ? this.grupoCuenta = "DETALLE" : this.grupoCuenta = "GRUPO";
      /*fin reemplazado*/
      this.valueDivisa = this.lengthCaracter.valor;
      this.lcargando.ctlSpinner(false);

      this.editAccount();

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  /* onNodeSelecting(e) {
    console.log(e.nodeData.id);
    this.getTreePlanCuentas2(e.nodeData.id);
  }
  getTreePlanCuentas2(d) {
    let data = {
      id_nodo:d,
      t_data : this.treeData
    }
    this.pCuentasService.getTreePlanCuentas2(data).subscribe(res => {
      this.treeData = res['data'];
      this.field = { dataSource: res['data'], id: 'id', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.processing = true;
    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  } */

  setNewAccount() {
    this.cuentaAccount = "";
    this.nameAccount = "";
    this.nivelAccount = "";
    this.claseCuenta = null;
    this.grupoCuenta = null;
  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para armar el arbol de las cuentas
  */

  /*
@ViewChild('treeelement') public treeObj: TreeViewComponent;
colapseTree: boolean = false;
mensajeTree: any = "+ Expandir todo el arbol de las cuentas";
public expandOrContraerAll() {
  if (!this.colapseTree) {
    this.lcargando.ctlSpinner(true);
    this.colapseTree = true;
    this.treeObj.expandAll();
    this.mensajeTree = "- Contraer todo el arbol de las cuentas";
    this.lcargando.ctlSpinner(false);
  } else {
    this.lcargando.ctlSpinner(true);
    this.colapseTree = false;
    //this.getTreePlanCuentas();
    this.mensajeTree = "+ Expandir todo el arbol de las cuentas";
  }
}*/





  /*getTreePlanCuentas() {
    this.lcargando.ctlSpinner(false);

    this.pCuentasService.JsonPlanCuenta().subscribe(res => {

      console.log(res);
      console.log(res['data']);
      console.log((res['data'])[0]);

      console.log((res['data'])[0].json_agg);

      let obj = JSON.parse((res['data'])[0].json_agg);

      //this.data = obj
      console.log(obj);
      this.treeData = res['data'];
      this.field = { dataSource: res['data'], id: 'id', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.printData();
   }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })

  }*/

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para agregar una nueva cuenta
  */
  /* RegistrarCuenta() {

    this.lcargando.ctlSpinner(true);

    if (this.permisions[0].agregar == "0") {

      this.toastr.info("Usuario no tiene permiso para agregar");
      this.lcargando.ctlSpinner(false);
      return;

    }

    if (parseInt(this.nivelAccountMayor) == this.lengthCaracter.lengthniveles) {

      this.newAcc = false;
      this.toastr.info("La configuracion contable no permite crear sobre el nivel :" + this.lengthCaracter.lengthniveles);
      return;

    } else if (this.tipeAccountMayor == "DETALLE") {

      this.newAcc = false;
      this.toastr.info("La cuenta a la que desea añadir es de detalle, por favor cambie las caracteristicas de la cuenta");
      return;

    }

    document.getElementById('IdnameAccount').focus();

    this.newAcc = true;
    this.btnGuardar = true;
    this.vmButtons[1].habilitar = false;

    if (this.lengthCaracter.lengthniveles == 5 && (parseInt(this.nivelAccountMayor) == 1 || parseInt(this.nivelAccountMayor) == 2)) {

      this.tipoSaveFinal = "Grupo";

    } else if (this.lengthCaracter.lengthniveles == 6 && parseInt(this.nivelAccountMayor) == 1 || parseInt(this.nivelAccountMayor) == 2 || parseInt(this.nivelAccountMayor) == 3) {

      this.tipoSaveFinal = "Grupo";

    } else {

      this.tipoSaveFinal = "Detalle";

    }

    let data = {
      codigo: this.codigoGlobalMayor
    }

    this.pCuentasService.getChildrensAccount(data).subscribe(res => {
      if (res['data'][0].codigo == null) {
        if (this.tipoSaveFinal == "Detalle") {
          if (this.lengthCaracter.lengthdetalle == 1) {
            this.codigoSaveFinal = this.codigoGlobalMayor + this.lengthCaracter.caracter + "1";
          } else if (this.lengthCaracter.lengthdetalle == 2) {
            this.codigoSaveFinal = this.codigoGlobalMayor + this.lengthCaracter.caracter + "01";
          } else if (this.lengthCaracter.lengthdetalle == 3) {
            this.codigoSaveFinal = this.codigoGlobalMayor + this.lengthCaracter.caracter + "001";
          }
        } else {
          if (this.lengthCaracter.lengthgrupo == 1) {
            this.codigoSaveFinal = this.codigoGlobalMayor + this.lengthCaracter.caracter + "1";
          } else if (this.lengthCaracter.lengthgrupo == 2) {
            this.codigoSaveFinal = this.codigoGlobalMayor + this.lengthCaracter.caracter + "01";
          } else if (this.lengthCaracter.lengthgrupo == 3) {
            this.codigoSaveFinal = this.codigoGlobalMayor + this.lengthCaracter.caracter + "001";
          }
        }
      } else {

        if (this.tipoSaveFinal == "Detalle") {

          let codigo = res['data'][0].codigo;
          let subcadena = codigo.split(this.lengthCaracter.caracter, -1);
          let codigoSubfinal = this.numAccountMayor;
          let subcadenaFinal = subcadena[subcadena.length - 1];
          let cadenaSumada = parseInt(subcadenaFinal) + 1;
          if (this.lengthCaracter.lengthdetalle == 1 && cadenaSumada.toString().length == 1) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthdetalle == 2 && cadenaSumada.toString().length == 1) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + "0" + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthdetalle == 3 && cadenaSumada.toString().length == 1) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + "00" + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthdetalle == 1 && cadenaSumada.toString().length == 2) {
            this.toastr.info("La longitud no permite generar un código");
          } else if (this.lengthCaracter.lengthdetalle == 2 && cadenaSumada.toString().length == 2) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthdetalle == 3 && cadenaSumada.toString().length == 2) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + "0" + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthdetalle == 1 && cadenaSumada.toString().length == 3) {
            this.toastr.info("La longitud no permite generar un código.");
          } else if (this.lengthCaracter.lengthdetalle == 2 && cadenaSumada.toString().length == 3) {
            this.toastr.info("La longitud no permite generar un código..");
          } else if (this.lengthCaracter.lengthdetalle == 3 && cadenaSumada.toString().length == 3) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + cadenaSumada.toString();
          }

        } else {

          let codigo = res['data'][0].codigo;
          let subcadena = codigo.split(this.lengthCaracter.caracter, -1);
          let codigoSubfinal = this.numAccountMayor;
          let subcadenaFinal = subcadena[subcadena.length - 1];
          let cadenaSumada = parseInt(subcadenaFinal) + 1;
          if (this.lengthCaracter.lengthgrupo == 1 && cadenaSumada.toString().length == 1) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthgrupo == 2 && cadenaSumada.toString().length == 1) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + "0" + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthgrupo == 3 && cadenaSumada.toString().length == 1) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + "00" + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthgrupo == 1 && cadenaSumada.toString().length == 2) {
            this.toastr.info("La longitud no permite generar un código");
          } else if (this.lengthCaracter.lengthgrupo == 2 && cadenaSumada.toString().length == 2) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthgrupo == 3 && cadenaSumada.toString().length == 2) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + "0" + cadenaSumada.toString();
          } else if (this.lengthCaracter.lengthgrupo == 1 && cadenaSumada.toString().length == 3) {
            this.toastr.info("La longitud no permite generar un código.");
          } else if (this.lengthCaracter.lengthgrupo == 2 && cadenaSumada.toString().length == 3) {
            this.toastr.info("La longitud no permite generar un código..");
          } else if (this.lengthCaracter.lengthgrupo == 3 && cadenaSumada.toString().length == 3) {
            this.codigoSaveFinal = codigoSubfinal + this.lengthCaracter.caracter + cadenaSumada.toString();
          }
        }
      }
      this.cuentaAccount = this.codigoSaveFinal;
      this.nivelAccount = parseInt(this.nivelAccountMayor) + 1;
      this.nivelAccount = this.nivelAccount.toString();

    }, error => {

      console.log(error)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);

    })
    // this.lcargando.ctlSpinner(false);
  } */

  async crearCodigoCuenta() {
    if (this.permisions[0].agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
      return;
    }

    if (this.tipeAccountMayor == "DETALLE") {
      this.newAcc = false;
      this.toastr.info("La cuenta a la que desea añadir es de detalle, por favor cambie las caracteristicas de la cuenta");
      return;
    }

    document.getElementById('IdnameAccount').focus();

    this.newAcc = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;

    this.lcargando.ctlSpinner(true);
    try {
      let niveles: number[] = [1, 1, 1, 2, 2, 2, 2, 2, 2, 2]
      let codigo_padre: string[] = this.codigoGlobalMayor.split(this.lengthCaracter.caracter)
      let nivel: number = codigo_padre.length

      let ultimo_hijo = await this.pCuentasService.getUltimaCuenta({codigo: this.codigoGlobalMayor})
      if (ultimo_hijo[0].codigo != null) {
        let ultimo_digito: number = parseInt(ultimo_hijo[0].codigo.split(this.lengthCaracter.caracter).slice(-1)[0]) + 1
        let codigo = [...codigo_padre, `${ultimo_digito}`.padStart(niveles[nivel], '0')].join(this.lengthCaracter.caracter)
        console.log(codigo_padre, ultimo_digito, codigo)

        this.codigoSaveFinal = codigo;
      } else {
        let codigo = [...codigo_padre, '1'.padStart(niveles[nivel], '0')].join(this.lengthCaracter.caracter)
        console.log(codigo_padre, 1, codigo)

        this.codigoSaveFinal = codigo;
      }

      this.cuentaAccount = this.codigoSaveFinal;
      this.nivelAccount = parseInt(this.nivelAccountMayor) + 1;
      this.nivelAccount = this.nivelAccount.toString();
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  cambiarGrupoDetalle() {
    //
  }

  async confirmSave() {

    let result: SweetAlertResult = await Swal.fire({

      title: "Atención!!",
      text: "Seguro desea guardar la cuenta?",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar",
    })

    console.log(result)

    if (result.isConfirmed) {
      this.guardarAccount()
    }

  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para guardar la nueva cuenta
  */

  guardarAccount() {

    if (this.permisions[0].guardar == "0") {

      this.toastr.info("Usuario no tiene permiso para guardar");

    } else {

      // if (this.grupoDetail) {
        this.tipoSaveFinal = this.grupoCuenta;
      // }

      let g = this.codigoSaveFinal.split(this.lengthCaracter.caracter/* , -1 */);
      let grupo = g[0];
      let grupoFinal;

      if (grupo == "1") {
        grupoFinal = "Activo"
      } else if (grupo == "2") {
        grupoFinal = "Pasivo"
      } else if (grupo == "3") {
        grupoFinal = "Patrimonio"
      } else if (grupo == "4") {
        grupoFinal = "Ingresos"
      } else if (grupo == "5") {
        grupoFinal = "costos"
      }else if (grupo == "6") {
        grupoFinal = "Gastos"
      }
      if (this.nameAccount == undefined || this.nameAccount == "") {

        this.toastr.info("Debe ingresar el nombre de la nueva cuenta");
        let autFocus = document.getElementById("IdnameAccount").focus();
        return;

      } else if (this.claseCuenta == undefined || this.claseCuenta == null || this.claseCuenta == 0) {

        this.toastr.info("Seleccione una Clase para la nueva cuenta");
        return;

      } else if ((this.grupoCuenta == undefined || this.grupoCuenta == 0) && this.grupoDetail) {

        this.toastr.info("Seleccione un Tipo de Cuenta");
        return;

      } else if ((parseInt(this.nivelAccount) == this.lengthCaracter.lengthniveles) && (this.grupoCuenta == "GRUPO")) {

        this.toastr.info("No se puede crear un nuevo GRUPO sobre este nivel, solo cuenta de detalles");
        return;

      } else {



        this.lcargando.ctlSpinner(true);
        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        let id_empresa = this.dataUser.id_empresa;

        let codigoOficial: string = this.codigoSaveFinal.replace(/\./g, '');

        let data = {
          ip: this.commonService.getIpAddress(),
          accion: `Creación de nueva cuenta con código ${this.codigoSaveFinal}`,
          id_controlador: myVarGlobals.fPlanCuentas,
          tipo: this.tipoSaveFinal.toUpperCase(),
          tipoGub: this.grupoGubCuenta.toUpperCase(),
          grupo: grupoFinal.toUpperCase(),
          clase: this.claseCuenta.toUpperCase(),
          nivel: this.nivelAccount,
          codigo: this.codigoSaveFinal,
          codigo_padre: this.numAccountMayor,
          codigo_oficial: codigoOficial,
          codigo_migrado: codigoOficial,
          nombre: this.nameAccount,
          estado: this.estadoAccount,
          id_empresa: id_empresa,
          codPresupuesto: this.numCatalogoCodigo,
          namePresupuesto: this.nameCatalogoPresupuesto,
          codPresupuestoHaber: this.numCatalogoCodigoHaber,
          namePresupuestoHaber: this.nameCatalogoPresupuestoHaber,
          codCuentaCierre: this.numAccountCierre,
          nameCuentaCierre: this.nameAccountCierre,
          cuentaGubernamente: this.Isgubernamental,
          cod_ref_auxiliar: this.cod_ref_auxiliar,
          desc_ref_auxiliar: this.desc_ref_auxiliar,
        }

        this.pCuentasService.saveNewAccount(data).subscribe(res => {

          this.disabledNew = true;
          this.vmButtons[0].habilitar = false;
          this.newAcc = false;
          this.setNewAccount();
          this.toastr.success(res['message']);

          this.lcargando.ctlSpinner(false);

          this.cancelar();

          /*const grid = Fancy.getWidget('GridPlanCuenta');
          console.log(grid);
          grid.setTitle('New Title');
          */
         this.CargarPlanCuentaArbol(this.grid)

        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
        })


      }
    }
  }

  async confirmUpdate() {

    Swal.fire({
      title: "Atención!!",
      text: "Seguro desea modificar la cuenta?",
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.modificarAccount();
      }
    })

  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para modificar una cuenta
  */
  modificarAccount() {


    if (this.permisions[0].editar == "0") {

      this.toastr.info("Usuario no tiene permiso para modificar");

    } else {

      if (this.nameAccount == undefined || this.nameAccount == "") {
        this.toastr.info("Debe ingresar el nombre de la nueva cuenta");
        let autFocus = document.getElementById("IdnameAccount").focus();
      } else if (this.claseCuenta == undefined || this.claseCuenta == null || this.claseCuenta == 0) {
        this.toastr.info("Seleccione una clase para la nueva cuenta");
      } else if ((this.grupoCuenta == undefined || this.grupoCuenta == 0) && this.grupoDetail) {
        this.toastr.info("Seleccione un grupo");
      } else {

        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        let id_empresa = this.dataUser.id_empresa;



        let data = {
          ip: this.commonService.getIpAddress(),
          accion: `Actualización de la cuenta con código ${this.cuentaAccount}`,
          id_controlador: myVarGlobals.fPlanCuentas,
          id_empresa: id_empresa,
          nombre: this.nameAccount,
          codigo: this.cuentaAccount,
          // tipo: (this.grupoDetail) ? this.grupoCuenta : this.tipeAccountMayor,
          clase: this.claseCuenta,
          id_account: this.idAccountMayor,
          codPresupuesto: this.numCatalogoCodigo,
          namePresupuesto: this.nameCatalogoPresupuesto,
          codPresupuestoHaber: this.numCatalogoCodigoHaber,
          namePresupuestoHaber: this.nameCatalogoPresupuestoHaber,
          codCuentaCierre: this.numAccountCierre,
          nameCuentaCierre: this.nameAccountCierre,
          cuentaGubernamente: this.Isgubernamental,
          cod_ref_auxiliar: this.cod_ref_auxiliar,
          desc_ref_auxiliar: this.desc_ref_auxiliar,
          estado: this.estadoAccount,
          tipo: this.grupoCuenta,
          tipoGub: this.grupoGubCuenta,
        }

        this.lcargando.ctlSpinner(true);
        this.pCuentasService.updateAccount(data).subscribe(res => {

          this.disabledNew = false;
          this.vmButtons[0].habilitar = true;
          this.newAcc = false;
          this.setNewAccount();
          this.toastr.success(res['message']);

          this.cancelar();

          //const grid = Fancy.getWidget('GridPlanCuenta');
          //grid.showLoadMask('Actualizando...');

          this.CargarPlanCuentaArbol(this.grid);

          /*const grid = Fancy.getWidget('GridPlanCuenta');
          grid.setTitle('New Title');*/

          this.lcargando.ctlSpinner(false);

        }, error => {

          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);

        })

      }
    }
  }

  editAccount() {

    this.lcargando.ctlSpinner(true);
    console.log(this.permisions[0])
    if (this.permisions[0].editar == "0") {

      this.lcargando.ctlSpinner(false);
      this.toastr.info("Usuario no tiene permiso para editar");

    } else {

      this.lcargando.ctlSpinner(false);

      if (!this.validaAcc) {

        this.toastr.info("Debe seleccionar una cuenta");

      } else {

        document.getElementById('IdnameAccount').focus();
        this.newAcc = true;

        if (parseInt(this.nivelAccountMayor) == this.lengthCaracter.lengthniveles - 1) {

          this.disabledNew = false;
          //this.vmButtons[0].habilitar = true;
          this.btnGuardar = false;
          this.vmButtons[1].habilitar = true;
          this.grupoDetail = true;
          this.btnModificar = true;
          this.vmButtons[2].habilitar = false;
          this.cuentaAccount = this.numAccountMayor;
          this.nameAccount = this.nameAccountMayor;
          this.nivelAccount = this.nivelAccountMayor;
          this.claseCuenta = this.claseAccountMayor;
          this.grupoCuenta = this.tipeAccountMayor;

          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });

        } else {

          this.grupoDetail = false;
          this.btnGuardar = false;
          this.vmButtons[1].habilitar = true;
          this.disabledNew = false;
          //this.vmButtons[0].habilitar = true;
          this.btnModificar = true;
          this.vmButtons[2].habilitar = false;
          this.cuentaAccount = this.numAccountMayor;
          this.nameAccount = this.nameAccountMayor;
          this.nivelAccount = this.nivelAccountMayor;
          this.claseCuenta = this.claseAccountMayor;
          this.grupoCuenta = this.tipeAccountMayor;

          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });

        }
      }
    }
  }

  cancelar() {
    //this.router.navigateByUrl('dashboard');
    // this.permisions = false;
    this.codigoGlobalMayor = "";
    this.numAccountMayor = "";
    this.nameAccountMayor = "";
    this.tipeAccountMayor = "";
    this.nivelAccountMayor = "";
    this.saldoAccountMayor = parseFloat('0.0000').toFixed(4);
    this.validaSaldo = false;
    this.estadoAccountMayor = "";
    this.claseAccountMayor = "";
    this.idAccountMayor = "";
    this.cuentaAccount = "";
    this.nameAccount = "";
    this.nivelAccount = "";
    this.claseCuenta = null;
    this.nameCodigoficial = "";
    this.codigoficial = "";
    this.codigoMigrado = "";
    this.newAcc = false;
    this.grupoDetail = false;
    this.grupoCuenta = null;
    this.grupoGubCuenta = null;
    this.disabledNew = false;
    this.btnModificar = false;
    this.btnGuardar = false;
    this.codigoSaveFinal = "";
    this.tipoSaveFinal = "";
    this.validaAcc = false;
    this.checkAuth = true;
    this.valueDivisa = "";
    this.numAccount = "";

    this.numCatalogoCodigo = "";
    this.nameCatalogoPresupuesto = "";
    this.numCatalogoCodigoHaber = "";
    this.nameCatalogoPresupuestoHaber = "";
    this.numAccountCierre = "";
    this.nameAccountCierre = "";
    this.Isgubernamental = "SI";


    this.numCatalogoPresupuestoCon = "";
    this.nameCatalogoPresupuestoCon = "";
    this.numaccountCierreCon = "";
    this.nameAccountCierreCon = "";
    this.iSgubenamentalCon = "";

    this.cod_ref_auxiliar = null;
    this.estadoAccount = null;

    // this.getButtons();

    /*this.getTreePlanCuentas();*/

    // setTimeout(() => {
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
    // }, 10);

  }

  changeAction() {
    this.clasAction = !this.clasAction;
  }

  prepareData() {
    this.lcargando.ctlSpinner(true);
    this.excelData = [];
    if (this.permisions[0].exportar == "0") {
      this.toastr.info("Usuario no tiene permiso para exportar");
    } else {
      this.pCuentasService.exportAccounts().subscribe(res => {
        this.excelData.push(res['data']);
        this.exportAsXLSX();
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      })
    }
  }

  onClicConsultaPlanCuentas(content) {

    let busqueda = (typeof this.numAccountMayor === 'undefined') ? "" : this.numAccountMayor;

    let consulta = {
      busqueda: this.numAccountMayor
    }

    localStorage.setItem("busqueda_cuetas", busqueda)
    localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {

      if (cuentas) {

        this.onNodeSelecting(cuentas.data.codigo);
        //console.log(cuentas.data.codigo);
        //this.CargarCuentas(cuentas, i);
      } else {
        this.lcargando.ctlSpinner(false);
      }

    });


  }




  onClicConsultaPlanCuentasCierre(content) {

    let busqueda = (typeof this.numAccountCierre === 'undefined') || this.numAccountCierre === null ? "" : this.numAccountCierre;

    let consulta = {
      busqueda: this.numAccountCierre
    }


    localStorage.setItem("busqueda_cierre", busqueda)
    localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {

      if (cuentas) {
        this.numAccountCierre = cuentas['data'].codigo;
        this.nameAccountCierre = cuentas['data'].nombre;
      }

    });
  }

  CargarCuentaEditar(event: any) {
    this.onNodeSelecting(event["codigo"]);
    this.modalService.dismissAll();
  }


  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para imprimir archivo pdf
  */
  printData() {

    if (this.permisions[0]) {
      if (this.permisions[0].imprimir == "0") {
        this.btnPrint = false;
        this.vmButtons[4].habilitar = true;
        this.processing = true;
        this.lcargando.ctlSpinner(false);
      } else {
        this.btnPrint = true;
        this.vmButtons[4].habilitar = false;
        this.pCuentasService.printAccounts().subscribe(res => {
          this.dataPrint = res['data'];
          this.lcargando.ctlSpinner(false);
          this.processing = true;
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
        })
      }
    }


  }

  savePrint() {
    let data = {
      ip: this.commonService.getIpAddress(),
      accion: "Registro de impresion de plan de cuentas",
      id_controlador: myVarGlobals.fPlanCuentas
    }
    this.pCuentasService.printData(data).subscribe(res => {
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.crearCodigoCuenta();
        break;
      case "GUARDAR":
        this.confirmSave();
        break;
      case "MODIFICAR":
        this.confirmUpdate();
        break;
      case "EXPORTAR":
        this.prepareData();
        break;
      case "IMPRIMIR":
        // this.savePrint();
        this.imprimirPdf();
        break;
      case "CANCELAR":
        this.cancelar();
        break;
      case "MOSTRAR ACTIVOS":
      case "MOSTRAR TODOS":
        this.handleShowCuentas()
    }
  }

  getButtons() {
    this.vmButtons = [
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXPORTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "far fa-check-square", texto: "MOSTRAR TODOS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsPlanCuentas", paramAccion: "", boton: { icon: "far fa-square", texto: "MOSTRAR ACTIVOS" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
    ];
  }

  async loadCatalogoAuxiliares() {
    // this.loading = true
    let response = await this.pCuentasService.getCatalogoAuxiliares({ params: "'CON_CATALOGO_AUXILIARES'" });
    this.cmb_catalogo_auxiliares = response['CON_CATALOGO_AUXILIARES'].map((item: any) => Object.assign(item, { label: `${item.valor} - ${item.descripcion}` }));
    // this.loading = false
  }

  handleSelectAuxiliar({ valor, descripcion }) {
    this.cod_ref_auxiliar = valor
    this.desc_ref_auxiliar = descripcion
  }

  handleShowCuentas() {
    if (this.showActivos) {
      // Mostrar todos
      this.showActivos = !this.showActivos
      this.vmButtons[6].showimg = false
      this.vmButtons[7].showimg = true
      this.CargarPlanCuentaArbol(this.grid, "'A', 'I'")
    } else {
      // Mostrar activos
      this.showActivos = !this.showActivos
      this.vmButtons[6].showimg = true
      this.vmButtons[7].showimg = false
      this.CargarPlanCuentaArbol(this.grid)
    }
  }

  imprimirPdf(){
    window.open(environment.ReportingUrl + "rpt_plan_cuentas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting, '_blank')
  }

  nuevaReglaPresupuestaria() {
    const modalInvoice = this.modalService.open(ModalReglaPresupuestariaComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    modalInvoice.componentInstance.codigo_cuenta = this.numAccountMayor;
    modalInvoice.componentInstance.nombre_cuenta = this.nameAccountMayor;
    modalInvoice.componentInstance.codigo_presupuesto = this.numCatalogoCodigo;
    modalInvoice.componentInstance.nombre_presupuesto = this.nameCatalogoPresupuesto;

    // modalInvoice.componentInstance.isNew = isNew;
    // modalInvoice.componentInstance.data = data;
    modalInvoice.result.then(

      // Función a ejecutar cuando el modal se cierra
      (result) => {
        if (result == "actualizar") {
          this.loadReglas(false);
         // this.LoadGruposOcupacionales(false);
        }
      },
      (reason) => {
        if (reason == "actualizar") {
          this.loadReglas(false);
         // this.LoadGruposOcupacionales(false);
        }
      }
    );
  }

  loadReglas(flag: boolean = false){
    this.lcargando.ctlSpinner(true);
      if (flag) this.paginate.page = 1;
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.pCuentasService.getReglas(data).subscribe(
      res => {
        console.log(res)
        if (res['data'].length == 0) {
          console.log("LENG0")
          this.reglas = []
        } else {

          this.reglas = res['data']['data'];

          this.reglas.forEach(element => {
          if (element.codigo_presupuesto_gasto != null && element.codigo_presupuesto_gasto!= null)
              element.codigo_presupuesto_gasto = element.codigo_presupuesto_gasto + ". " + (element.nombre_codigo_presupuesto_gasto ? element.nombre_codigo_presupuesto_gasto : "");

          if (element.codigo_presupuesto_ingreso != null  && element.codigo_presupuesto_ingreso!= null)
              element.codigo_presupuesto_ingreso = element.codigo_presupuesto_ingreso + ". " + (element.nombre_codigo_presupuesto_ingreso ? element.nombre_codigo_presupuesto_ingreso : "");

          if (element.cuenta_contable != null  && element.cuenta_contable!= null)
              element.cuenta_contable = element.cuenta_contable + ". " + (element.nombre_cuenta_contable ? element.nombre_cuenta_contable : "");

          if (element.cuenta_contable_cobro != null  && element.cuenta_contable_cobro!= null)
              element.cuenta_contable_cobro = element.cuenta_contable_cobro + ". " + (element.nombre_cuenta_contable_cobro ? element.nombre_cuenta_contable_cobro : "");

          if (element.cuenta_contable_pago != null  && element.cuenta_contable_pago!= null)
              element.cuenta_contable_pago = element.cuenta_contable_pago + ". " + (element.nombre_cuenta_contable_pago ? element.nombre_cuenta_contable_pago : "");
          });


          this.paginate.length = res['data']['total'];
          console.log(" this.reglas", this.reglas)
        }
        this.lcargando.ctlSpinner(false)
      }
      ,
      (error) => {
        console.log(error)
       this.lcargando.ctlSpinner(false)
        // this.toastr.info(error.error.message);
      }
    );
  }
}
