import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaDirectorioService } from './consulta-directorio.service';

import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import moment from 'moment';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnexoListaService } from 'src/app/view/tesoreria/recaudacion/convenio/anexos-lista/anexo-lista.service';

import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';

import { MatTree, MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';

import { CatalogoService } from 'src/app/view/catastro/configuracion/catalogo/catalogo.service';

import { ModalAnexoComponent } from 'src/app/view/administracion/tramites/tramite/modal-anexo/modal-anexo.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { DetallePrestamoComponent } from './detalle-prestamo/detalle-solicitud.component'
interface Catalogo {
  id_catalogo?: number
  tipo: string
  valor: string
  descripcion: string
  categoria: string
  parent_id: number|null
  grupo: string|null
  estado: string
  children?: Catalogo[]
  parent?: Catalogo
}


interface FlatNode {
  expandable: boolean
  name: string
  level: number
}


@Component({
  selector: 'app-consulta-directorio',
  templateUrl: './consulta-directorio.component.html',
  styleUrls: ['./consulta-directorio.component.scss']
})
export class ConsultaDirectorioComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  msgSpinner: string;
  vmButtons: Botonera[] = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  itemCatalogo: Catalogo = {
    id_catalogo: null,
    tipo: null,
    valor: null,
    descripcion: null,
    categoria: null,
    grupo: null,
    estado: 'A',
    parent_id: null,
  }
  tipoDoCNombre:any;
  treeControl = new NestedTreeControl<any>(node => node.children); //Catalogo
  camposRangos:any = [];
  dataSource = new MatTreeNestedDataSource<any>();//Catalogo
  tipo_medio:any;
  numero_medio:any;
  nuevoItemVista: boolean = false
  nuevoItemCatalogo: Catalogo = {
    id_catalogo: null,
    tipo: null,
    valor: null,
    descripcion: null,
    categoria: null,
    grupo: null,
    parent_id: null,
    estado: 'A',
  }

  lst_tipoDoC: any;
  tipoDoC: any;
  dataForms:any;
  dataFormsAux: any;
  rutaFinal:any;
resultadoConsulta:any;
  previewUrl: SafeResourceUrl | null = null;
  isImage: boolean = false;
  arrayToUpload: any[] = [];
  file: File | null = null
  prueba: any;

  paginate: any;
  filter: any;
tipobusqueda:any;
rutacompletadeldirectorioactuali:any;
  tipo_documento: any;

  directorioDt: any = [];

  campos: any = []
  consultaDirectorio: boolean = true

  cols: any[];
  documento: any;
  DocGeneral: any = [];
  cargado: boolean = false;

  constructor(
    private apiService: ConsultaDirectorioService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private apiServiceAnexo: AnexoListaService,
    private confirmationDialogService: ConfirmationDialogService,

    private apiServicecat: CatalogoService,
  ) {}

  ngOnInit(): void {
    this.vmButtons = [

      {
        orig: 'btnsConsultaDirectotio',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsConsultaDirectotio',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ]

    this.filter = {
      tipo_documento: null,
      buscador: '',
      descripcion: '',
      campos: [],
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100]
    }



    setTimeout(() => {
      this.getDatosIniciales()
    }, 10);

  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.tipobusqueda = 'indices';
       this.consultar()
        break;
      case "LIMPIAR":
        this.limpiar()
        break;

      default:
        break;
    }
  }

  getDatosIniciales() {
    this.resultadoConsulta = null;
    //this.getListas();
    let data = {};
   // this.getReadFiles();
    this.apiService.getTipoDocumentos(data).subscribe((res) => {
      console.log(res)
      this.lcargando.ctlSpinner(false);
      this.lst_tipoDoC = res["data"];
      /*  this.dataEmpleado = res["data"];
       this.listadoGeneral(); */
    }, (error) => {
      this.toastr.info(error.message);
      this.lcargando.ctlSpinner(false);
    });
  }

  selectTipoDocumento(event){
this.tipobusqueda = 'indices';
   // this.limpiarFilter()
    this.msgSpinner = 'Cargando Directorio...'
    this.lcargando.ctlSpinner(true);

    this.dataForms = [];
    this.resultadoConsulta = [];
    this.filter.campos = [];
    this.dataSource = new MatTreeNestedDataSource<any>();
    this.treeControl =  new NestedTreeControl<any>(node => node.children);
    console.log(event);
    this.tipoDoC = event;
    this.filter.tipo_documento= event

    let data = {
      tipoDoc:this.tipo_documento,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
    };
    this.directorioDt = []
    this.filter.campos=[]
    this.dataFormsAux=[]


    const selectedTipoDocumento = this.lst_tipoDoC.find(tipo => tipo.id_tipo_documento === event);
    if (selectedTipoDocumento) {
        this.tipoDoCNombre = selectedTipoDocumento.nombre;
    }

    this. consultarDirectorio(2)
    this.apiService.getOrdenCampos(data).subscribe((res) => {
        if(res['status']==1){
          console.log("datos de orden",res)

          this.dataForms= res["data"]["tipoDocumento"];
          console.log("consultar directorio",this.dataForms)
let newDataForms= [];
          this.dataForms.forEach(element => {
            // Verificar si el tipo_dato es 'date'
            if (element.tipo_dato === 'date') {
                // Crear un nuevo objeto con campo_indice modificado para agregar " Hasta"
                let newElement = { ...element,valor_indice_hasta:'', campo_indice_hasta: element.campo_indice + ' Hasta' };
                // Agregar el nuevo objeto al nuevo arreglo
                newDataForms.push(newElement);
            } else {
                // Si el tipo_dato no es 'date', simplemente agregar el elemento original al nuevo arreglo
                newDataForms.push(element);
            }
        });
        this.dataForms = newDataForms;
          this.dataFormsAux=res["data"]["tipoDocumento"];
          this.rutaFinal= res["data"]["ruta"];
          this.documento =  res["data"]["documento"];

          //this.resultadoConsulta= res["data"]["documento2"]
          this.dataForms.forEach(campo => {
            Object.assign(campo, { valor: '' })
            let campoI = this.dataFormsAux.filter(e => e.campo_indice == campo.campo_indice) ;
            let data
            if (campoI[0].tipo_dato == 'date'){
              data ={
                campo_indice: campoI[0].campo_indice,
                valor : campoI[0].valor,
                tipo:campoI[0].tipo_dato,
                campo_indice_hasta: campoI[0].campo_indice+ ' Hasta',
                valor_hasta:null,
              }
            }else{
              data ={
                campo_indice: campoI[0].campo_indice,
                valor : campoI[0].valor,
                tipo:campoI[0].tipo_dato

              }
            }

            this.filter['campos'].push(data)
            this.campos = this.filter['campos']
          });
          this.lcargando.ctlSpinner(false);
          this.cargado = true;

          this.getReadFiles();
        }

    }, (error) => {
      this.toastr.info(error.message);
      this.lcargando.ctlSpinner(false);
    });
  }

  encontrarUnicosPorCampoIndice(lista: any[]): any[] {
    const unicos = [];
    const conjunto = new Set();

    lista.forEach(item => {
      const campoIndice = item.campo_indice;
      if (!conjunto.has(campoIndice)) {
        unicos.push(item);
        conjunto.add(campoIndice);
      }
    });

    return unicos;
  }

  //Consulta principal desde el boton consultar
  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
   //this.paginator.firstPage()
     //Consulta con el filtro campos


    this. consultarDirectorio(1)
  }

  consultarDirectorio(flag: any){
    this.msgSpinner = 'Consultando Directorio...'
    this.lcargando.ctlSpinner(true);



    this.resultadoConsulta = [];
    this.filter.tipo_documento=  this.tipoDoC;
    this.filter.tipo_medio=  this.tipo_medio;
    this.filter.numero_medio=  this.numero_medio;
    this.filter.extras = this.camposRangos;
    const camposFiltrados = this.filter.campos.filter(camp => camp.campo_indice && camp.valor_indice);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,

      },
    }
    console.log(data)
    if(flag == 1){
      if(camposFiltrados.length > 0 || this.tipo_medio != '' || this.numero_medio != '' ){
        this.apiService.getDirectorio(data).subscribe(
          (res: any) => {

            console.log(res)
            this.paginate.length = res['data']['total'];
            this.directorioDt = res.data.data;
            this.resultadoConsulta = res.data.data;

            console.log(this.resultadoConsulta)
            this.paginate.length = res.data.total;
            this.lcargando.ctlSpinner(false);
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        );
      }else{
        let data = {tipoDoc:this.tipoDoC};
        this.apiService.getOrdenCampos(data).subscribe((res) => {
          this.resultadoConsulta= res["data"]["documento2"]
          this.lcargando.ctlSpinner(false);
        }, (error) => {
          this.toastr.info(error.message);
          this.lcargando.ctlSpinner(false);
        });
      }
    }

    if(flag == 2){
      this.apiService.getDirectorio(data).subscribe(
        (res: any) => {

          console.log(res)
          this.paginate.length = res['data']['total'];
          this.directorioDt = res.data.data;
          this.resultadoConsulta = res.data.data;

          console.log(this.resultadoConsulta)
          this.paginate.length = res.data.total;
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      );
    }


  }

  changePaginate(event: PageEvent) {
    if(this.tipobusqueda = 'indices'){
    Object.assign(this.paginate, { page: event.pageIndex + 1})
    //Consulta sin el filtro pero desde cualquier pagina
    this.consultarDirectorio(2);
  }else{
    Object.assign(this.paginate, { page: event.pageIndex + 1})
    //Consulta sin el filtro pero desde cualquier pagina


  this.lcargando.ctlSpinner(true);
    this.msgSpinner = 'Cargando Arbol'

    this.apiService.getSearchFilesByFile({origen:this.tipoDoCNombre,rutacompleta:this.rutacompletadeldirectorioactuali,paginate:this.paginate}).subscribe((res: any) => {

      // Nuevo arreglo para almacenar los datos transformados
    this.consultaDirectorio = false
    let resultado =res['data'];
    const nuevoArreglo = resultado.map(item => {
    const nuevoObjeto = {
      nombre_archivo: item.nombre_archivo
    };

      // Iterar sobre los detalles y agregar al nuevo objeto
      item.detalledocs.forEach(detalle => {
          nuevoObjeto[detalle.campo_indice] = detalle.valor_indice;
      });

      return nuevoObjeto;
    });
    console.log(".ruta",res)
      this.resultadoConsulta = resultado; //nuevoArreglo
      this.paginate.length = resultado.total;
      this.lcargando.ctlSpinner(false);

    } , (error) => {
    this.toastr.info("No se encontraron archivos en la ruta");//error.message
    this.resultadoConsulta = null;
    this.lcargando.ctlSpinner(false);
  })
  }
  }






  hasChild = (_: number, node: Catalogo) => (!!node.children && node.children.length > 0) || ['L','M'].includes(node.categoria);


  async nodeClick(catalogo: Catalogo) {
    /* if (catalogo.categoria == 'L') {
      Object.assign(this.itemCatalogo, {
        valor: null,
        descripcion: null,
        categoria: null,
        estado: 'A',
        grupo: catalogo.valor,
        parent_id: catalogo.id_catalogo
      })
      this.vmButtons[0].habilitar = false
      this.vmButtons[1].habilitar = true
      this.formReadonly = false
    } else {
      Object.assign(this.itemCatalogo, catalogo)
      this.vmButtons[1].habilitar = true
      this.vmButtons[2].habilitar = false
      this.formReadonly = true
    } *//*
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = false */
    this.lcargando.ctlSpinner(true)
    await this.getItemCatalogo(catalogo)
    this.lcargando.ctlSpinner(false)
  }


  async getItemCatalogo(catalogo: Catalogo) {
    try {
      this.msgSpinner = 'Cargando Data'
      const response = await this.apiServicecat.getItemCatalogo({item: catalogo})
      console.log(response)
      this.nuevoItemVista = false
      this.itemCatalogo = response.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Item')
    }
  }

  async getReadFiles() { //catalogo: Catalogo
      this.lcargando.ctlSpinner(true);
      console.log("ejecutando");
      this.msgSpinner = 'Cargando Data' //item: catalogo this.filter.tipo_documento
      this.apiService.getReadFiles({tipocontrato:this.tipoDoCNombre}).subscribe((res: any) => {

          //arboldosarboldos
          this.dataSource.data = res
          this.treeControl.dataNodes =  res
          this.treeControl.expandAll()

          this.lcargando.ctlSpinner(false);
          console.log(res)


      } , (error) => {

      this.toastr.info("no se encuentra directorios para el tipo de documento");//
      this.lcargando.ctlSpinner(false);
    });
    /*   const response = await this.apiService.getReadFiles({})
      console.log(response) */
      //this.nuevoItemVista = false
    //  this.itemCatalogo = response.data

  }
  seleccionarpreview(data){

    console.log(data);
  }

  verAnexo(anexo) { ///app/public/anexos/
    let prueba = 'Digitalizacion/Contratos/2027/01/1312334731/01'
    let ruta = '20240325102711_asientopruebadef1.pdf'
    let data = {

      storage: anexo.ruta_archivo,
      name: anexo.nombre_archivo
    } //anexo.storageName anexo.storage ruta
//prueba**
    this.apiServiceAnexo.downloadAnexo(data).subscribe(
      (resultado) => {
        console.log(resultado);
        const dialogRef = this.confirmationDialogService.openDialogMat(ModalAnexoComponent, {
          width: '1000px', height: 'auto',
          data: {
            titulo: 'Vista de archivo',
            dataUser: this.dataUser,
            objectUrl: URL.createObjectURL(resultado),
            tipoArchivo: anexo.original_type
          }
        })
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }
  getObjectKeysAndValues(obj: any): { key: string, value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map(key => ({ key: key, value: obj[key] }));
  }
  handleClickSearch(event){
    this.tipobusqueda = 'ruta';
    let paginate = {
      perPage: 10,
      page: 1,
    }
    Object.assign(this.paginate, paginate);
    /* this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100]
    }
    Object.assign(this.paginate, {page: 1, pageIndex: 0}) */
    this.lcargando.ctlSpinner(true);
    this.msgSpinner = 'Cargando Arbol'

    console.log(event); this.rutacompletadeldirectorioactuali = event.rutacompleta;
    this.apiService.getSearchFilesByFile({origen:this.tipoDoCNombre,rutacompleta:event.rutacompleta,paginate:this.paginate}).subscribe((res: any) => {

      // Nuevo arreglo para almacenar los datos transformados
    this.consultaDirectorio = false
    let resultado =res['data'];
    const nuevoArreglo = resultado.map(item => {
    const nuevoObjeto = {
      nombre_archivo: item.nombre_archivo
    };

      // Iterar sobre los detalles y agregar al nuevo objeto
      item.detalledocs.forEach(detalle => {
          nuevoObjeto[detalle.campo_indice] = detalle.valor_indice;
      });

      return nuevoObjeto;
    });
    console.log(".ruta",res)
      this.resultadoConsulta = resultado; //nuevoArreglo
      this.paginate.length = resultado.total;
      this.lcargando.ctlSpinner(false);

    } , (error) => {
    this.toastr.info("No se encontraron archivos en la ruta");//error.message
    this.resultadoConsulta = null;
    this.lcargando.ctlSpinner(false);
  })
  }

  limpiarFilter(){
    this.filter = {
      tipo_documento: '',
      buscador: '',
      descripcion: '',
      campos: [],
      filterControl: ""
    }
  }

  limpiar(){
    this.filter = {
      tipo_documento: '',
      buscador: '',
      descripcion: '',
      campos: [],
      filterControl: ""
    }
    this.tipo_documento = null;

    this.resultadoConsulta = []
    this.dataForms = [];
    this.filter.campos = [];
    this.dataSource = new MatTreeNestedDataSource<any>();
    this.treeControl =  new NestedTreeControl<any>(node => node.children);
    this.tipoDoC = null;
    this.filter.tipo_documento= null
    this.directorioDt = []
    this.filter.campos=[]
    this.dataFormsAux=[]
  }

  moduloDetallePrestamo(event) {
    console.log(event);
    let modal = this.modalService.open(DetallePrestamoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.item = event /* */
    modal.componentInstance.opcion = 'ver'
  }




}
