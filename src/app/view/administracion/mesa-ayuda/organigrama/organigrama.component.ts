import { Component, OnInit, ViewChild,EventEmitter, Output} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganigramaService } from './organigrama.service'
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CcModalTablaCatalogoPresupuestoComponent } from 'src/app/config/custom/cc-modal-tabla-catalogo-presupuesto/cc-modal-tabla-catalogo-presupuesto.component';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/commonServices';
import { ExcelService } from 'src/app/services/excel.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';


@Component({
standalone: false,
  selector: 'app-mda-organigrama',
  templateUrl: './organigrama.component.html',
  styleUrls: ['./organigrama.component.scss'],
  providers: [DialogService,MessageService]

})
export class OrganigramaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Output() onNodeSelect = new EventEmitter<any>();
  gridConfig: object;
  grid: any;

  selectedNode2: any;

  dataUser: any;
  logoEmpresa: any;

  cmb_estado: Array<any> = [
    { value: 'A', label: 'ACTIVO' },
    { value: 'I', label: 'INACTIVO' },
  ]

  cmb_tipo: Array<any> = [
    { value: 'NIVEL', label: 'NIVEL' },
    { value: 'SUBNIVEL', label: 'SUBNIVEL' },
  ]

  paginate: any;
  filter: any;
  reglas:any;
  listEstado: any = [
    'A',
    'I'
  ]

  permisions: any
  permiso_ver: any
  vmButtons: any


  excelData: any

  nuevoNivel : any = {
    id_organigrama: 0,
    tipo: '',
    nivel: null,
    codigo: '',
    codigo_padre: '',
    nombre: '',
    descripcion: '',
    id_rol: null,
    id_empresa: 0,
    estado: ''
  }

  organigrama: any = []
  organigramaLoading: boolean = false
  nivel: any = {}

  nivelSelected: boolean = false

  lista_roles:any[] = []

  isReadOnly: boolean = true;

  filteredGrupos: any[] = []

  constructor
    (
      private organigramaService: OrganigramaService,
      private commonService: CommonService,
      private toastr: ToastrService,
      private excelService: ExcelService,
      private modalService: NgbModal,
      public dialogService: DialogService,
      private messageService: MessageService
    ) {

    const data = [];


    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.logoEmpresa = this.dataUser.logoEmpresa;
  }

  ref: DynamicDialogRef;

  async ngOnInit() {

    this.getButtons();

    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fPlanCuentas,
      id_rol: id_rol
    }

    setTimeout(() => {
      this.cargarParametrosOrganigrama();
      this.CargarOrganigramaArbolNew(this.grid, this.listEstado)
    }

    , 50);


  }


  async cargarParametrosOrganigrama() {
    let data = {
      id_empresa: this.dataUser.id_empresa
    }


    this.organigramaService.getRol(data).subscribe(resrol => {
      //console.log(resrol['data'].filter(rol => rol.estado === 'A'))
      if(resrol['data'].length > 0){
        this.lista_roles = resrol['data'].filter(rol => rol.estado === 'A');
      }else{
        this.lista_roles = []
      }

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })


  }


  nodeSelect(event: any) {
    console.log('Evento de selección:', event); // Primero verifica si el evento se dispara

    if (event.node) {
        const nodeData = event.node.data;
        console.log('Datos del nodo seleccionado:', nodeData);

        // Opcional: Mostrar en la interfaz
        this.selectedNode2 = nodeData;
    }
  }

  manualClick(rowNode: any) {
    this.isReadOnly = false
    Object.assign(this.nivel,  rowNode.node.data)
    Object.assign(this.nuevoNivel,  rowNode.node.data)

    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = false

  }

  CargarOrganigramaArbolNew(grid, estado?: []) {
    this.grid ||= grid;

    this.organigramaLoading = true
    this.organigramaService.JsonOrganigramaNew({ estado }).subscribe((res: any) => {

      this.organigrama = this.mapResponseToNode(res.data)
      console.log(this.organigrama);
      this.organigramaLoading = false

    }, error => {
      console.log(error)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error?.mesagge);

    })

  }

  mapResponseToNode = (elements: any[]) => {
    return elements.map(elem => {
      const nodeElem = {
        key: elem.id_organigrama,
        data: {
          id_organigrama: elem.id_organigrama,
          tipo: elem.tipo,
          nivel: elem.nivel,
          codigo: elem.codigo,
          codigo_padre: elem.codigo_padre,
          nombre: elem.nombre,
          descripcion: elem.descripcion,
          id_rol: elem.id_rol,
          id_empresa: elem.id_empresa,
          estado: elem.estado,
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
    /*this.pCuentasService.JsonPlanCuenta({ estado }).subscribe(res => {

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

    })*/

  }






  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para crear el archivo excel
  */
  exportAsXLSX() {
    this.lcargando.ctlSpinner(false);
    this.excelService.exportAsExcelFile(this.excelData[0], 'Organigrama');
  }






  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para seleccionar el nodo
  */
  onNodeSelecting(data: any) {

    //this.lcargando.ctlSpinner(true);

    //this.vmButtons[0].habilitar = false; //nuevo
    //this.vmButtons[1].habilitar = true; //guardar
    //this.vmButtons[2].habilitar = true; //editar

    console.log(data)

  }


  setNewAccount() {

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
      console.log('Se confirmo el resultado')
      //this.guardarAccount()
    }

  }

  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para guardar la nueva cuenta
  */



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
      this.toastr.info("Usuario si tiene permiso para modificar");

    }
  }

  editAccount() {

    this.lcargando.ctlSpinner(true);
    console.log(this.permisions[0])
    if (this.permisions[0].editar == "0") {

      this.lcargando.ctlSpinner(false);
      this.toastr.info("Usuario no tiene permiso para editar");

    } else {

      this.toastr.info("Usuario si tiene permiso para editar");
    }
  }

  cancelar() {

    this.limpiarFormulario()

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;


  }

  changeAction() {
    console.log('Se cambio la accion')
    //this.clasAction = !this.clasAction;
  }

  prepareData() {
    this.lcargando.ctlSpinner(true);
    this.excelData = [];
    /*if (this.permisions[0].exportar == "0") {
      this.toastr.info("Usuario no tiene permiso para exportar");
    } else {
      this.pCuentasService.exportAccounts().subscribe(res => {
        this.excelData.push(res['data']);
        this.exportAsXLSX();
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      })
    }*/
  }




  /*
    autor:Iván García
    fecha: 9/11/2020
    descripción:funcion para imprimir archivo pdf
  */
  printData() {

    /*if (this.permisions[0]) {
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
    }*/


  }

  savePrint() {
    let data = {
      ip: this.commonService.getIpAddress(),
      accion: "Registro de impresion de plan de cuentas",
      id_controlador: myVarGlobals.fPlanCuentas
    }
    /*this.pCuentasService.printData(data).subscribe(res => {
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })*/
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.validarNuevo();
        break;
      case "GUARDAR":
        this.validarDataOrganigrama()
        //this.confirmSave();
        break;
      case "MODIFICAR":
        this.validarDataOrganigrama()
        //this.confirmUpdate();
        break;
      case "EXPORTAR":
        console.log('EXPORTAR')
        //this.prepareData();
        break;
      case "IMPRIMIR":
        // this.savePrint();
        console.log('IMPRIMIR')
        //this.imprimirPdf();
        break;
      case "CANCELAR":
        this.cancelar();
        break;
      case "MOSTRAR ACTIVOS":
      case "MOSTRAR TODOS":
        console.log('MOSTRAR ACTIVOS/TODO')
        //this.handleShowCuentas()
    }
  }



  getButtons() {
    this.vmButtons = [
      { orig: "btnsOrganigrama", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsOrganigrama", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsOrganigrama", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      //{ orig: "btnsOrganigrama", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXPORTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },
      //{ orig: "btnsOrganigrama", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsOrganigrama", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      //{ orig: "btnsOrganigrama", paramAccion: "", boton: { icon: "far fa-check-square", texto: "MOSTRAR TODOS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      //{ orig: "btnsOrganigrama", paramAccion: "", boton: { icon: "far fa-square", texto: "MOSTRAR ACTIVOS" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
    ];
  }



  limpiarFormulario(): void {
    this.nuevoNivel = {
      id_organigrama: 0,
      tipo: '',
      nivel: null,
      codigo: '',
      codigo_padre: '',
      nombre: '',
      descripcion: '',
      id_rol: null,
      id_empresa: 0,
      estado: ''
    };
  }


  validarNuevo(): void {
    this.isReadOnly = false;
    this.limpiarFormulario();
    this.nuevoNivelOrganigrama();
    this.vmButtons[1].habilitar = false
    this.vmButtons[2].habilitar = true
  }

  validarDataOrganigrama(): void {
    if(this.nuevoNivel.nombre == ''){
      this.toastr.warning("Debe de ingresar el nombre")
      return;
    }
    if(this.nuevoNivel.id_rol == null){
      this.toastr.warning("Debe de seleccionar el rol")
      return;
    }

    this.saveNivelOrganigrama()

  }

  nuevoNivelOrganigrama() {
      // Ocultar Grupo mostrado, de aplicar
      this.nivelSelected = false

      Swal.fire({
        title: 'Que desea crear?',
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Nivel',
        denyButtonText: 'Subnivel',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#0d6efd',
        denyButtonColor: '#6c757d',
        cancelButtonColor: '#dc3545',
      }).then(async (result: any) => {
        if (result.isConfirmed && !result.isDenied) {
          // Grupo
          // console.log('Nuevo Grupo')
          (this as any).mensajeSpinner = 'Generando codigo'
          this.lcargando.ctlSpinner(true);
          let response: any = await this.organigramaService.getLastChild({parent: this.nivel.codigo_padre});
          console.log(response)
          this.lcargando.ctlSpinner(false)
          this.nuevoNivel = {
            id_organigrama: 0,
            tipo: 'NIVEL',
            nivel: response.nivel, // Usa el nivel del backend
            codigo: response.codigo,
            codigo_padre: this.nivel.codigo_padre,
            nombre: '',
            descripcion: '',
            id_rol: null,
            id_empresa: this.dataUser.id_empresa,
            estado: 'A'
          }

        } else if (!result.isConfirmed && result.isDenied) {
          // Subgrupo
          // console.log('Nuevo Subgrupo')
          (this as any).mensajeSpinner = 'Generando codigo'
          this.lcargando.ctlSpinner(true);
          let response: any = await this.organigramaService.getLastChild({parent: this.nivel.codigo});
          console.log(response)
          this.lcargando.ctlSpinner(false)
          this.nuevoNivel = {
            id_organigrama: 0,
            tipo: 'SUBNIVEL',
            nivel: response.nivel, // Usa el nivel del backend
            codigo: response.codigo,
            codigo_padre: this.nivel.codigo,
            nombre: '',
            descripcion: '',
            id_rol: null,
            id_empresa: this.dataUser.id_empresa,
            estado: 'A'
          }

        } else {
          // Cerro el modal
          return
        }
      })
  }


  saveNivelOrganigrama() {
    (this as any).mensajeSpinner = 'Almacenando Nivel'
    this.lcargando.ctlSpinner(true);
    this.organigramaService.guardarNivelOrganigrama({ organigrama: this.nuevoNivel }).subscribe(
      (res: any) => {
        this.lcargando.ctlSpinner(false)
        this.limpiarFormulario()
        this.CargarOrganigramaArbolNew(this.grid, this.listEstado)

        //this.getGrupos(this.grid)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Nivel')
      }
    )
  }




}
