import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from 'src/app/global'
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolaresService } from './solares.service';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import Swal from 'sweetalert2';
import { ConsultaLotesComponent } from './consulta-lotes/consulta-lotes.component';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import moment from 'moment';



@Component({
standalone: false,
  selector: 'app-solares',
  templateUrl: './solares.component.html',
  styleUrls: ['./solares.component.scss']
})
export class SolaresComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[] = [];

  dataUser: any;
  permissions: any;

  formReadonly: boolean = false;
  processing: boolean = false;

  verifyRestore = false;
  zonas: any[] = []
  sectores: any[] = []
  sectores_filter: any[] = [] 
  propietarios: any[] = [] 

  estados_predio : any[] = [] 

  today = new Date();

  codigo_zona: any
  codigo_sector: any

  solar: any = []

  cmb_tipo: any[] = [
    { value: 'L', label: 'Lista' },
    { value: 'E', label: 'Elemento' },
  ]
  cmb_estado: any[] = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ]
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private apiService: SolaresService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVarServices: CommonVarService,
    private modalService: NgbModal
  ) {


    this.vmButtons = [
      { orig: "btnsCatastroSolares", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsCatastroSolares", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsCatastroSolares", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsCatastroSolares", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnsCatastroSolares", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: true }
    ];
    // this.cargaCatalogos()

    this.commonVarServices.selectLote.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
       console.log(res)
       this.solar = res
       console.log(this.zonas)
       const zona = this.zonas.find((element: any) => element.id == res.zona_id)
       console.log(zona)
       this.filterSector(zona)
       this.solar.sector_id = res.sector_lote?.id_catalogo
       let total = parseInt(res.valor_edificacion) + parseInt(res.valor_solar)
       this.solar.valor_comercial = total

       this.propietarios = res.propietarios
       console.log( this.propietarios)

       this.vmButtons[1].habilitar = true;
       this.vmButtons[2].habilitar = false;
     });
 

      }

  ngOnInit(): void {
    this.solar =  {
      cod_catastral: '',
      cod_anterior: '',
      zona_id: '',
      zona:'',
      sector_id: '',
      sector:'',
      manzana: '',
      solar: '',
      area: '',
      valor_metro_cuadrado: 0,
      valor_solar: 0,
      valor_edificacion: 0,
      valor_comercial: 0,
      valor_hipoteca: 0,
      tipo_relacion: 0,
      fecha_adquisicion: moment(new Date()).format('YYYY-MM-DD'),
      estado: ""
  
    }
    setTimeout(async () => {
      // this.lcargando.ctlSpinner(true);
      this.validatePermission()
      await this.cargaCatalogos()
      // this.lcargando.ctlSpinner(false)
    }, 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "BUSCAR":
        this.expandListSolares()
        break;
      case "GUARDAR":
        this.setSolares()
        break;
      case "MODIFICAR":
        this.updateSolares()
        break;
      case "CANCELAR":
        this.limpiar()
        //this.actualizar()
        break;
      case "ELIMINAR":
        //this.limpiar()
        break;
    
      default:
        break;
    }
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    let params = {
      codigo: myVarGlobals.fSolares,
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
          //this.cargaCatalogos()
        }, 1000);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  async cargaCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    this.lcargando.ctlSpinner(true);
    
    try {
      let catalogos: any = await this.apiService.getCatalogos({ params: "'CAT_ZONA','CAT_SECTOR','CAT_ESTADO_PREDIO'" })
      // Zona
      catalogos.CAT_ZONA.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          codigo: elem.valor,
          nombre: elem.descripcion,
          label: `${elem.valor}. ${elem.descripcion}`
        }
        // this.zonas.push({ ...obj })
        this.zonas = [...this.zonas, {...obj}]
      })
      // Sectores
      catalogos.CAT_SECTOR.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          grupo: elem.grupo,
          codigo: elem.valor,
          nombre: elem.descripcion,
        }
        this.sectores.push({ ...obj })
      })
      //Estados Predio
     
      catalogos.CAT_ESTADO_PREDIO.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          grupo: elem.grupo,
          codigo: elem.valor,
          nombre: elem.descripcion,
        }
        this.estados_predio.push({ ...obj })
        console.log(this.estados_predio)
      })
     
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Catalogos')
    }
  }

  filterSector(event) {
    console.log(event);
    this.solar.zona = event.codigo
    this.solar.sector_id = 0
    this.sectores_filter = this.sectores.filter(e => e.grupo == event.codigo);
    
  }

  codigoCatastral(event){
    this.solar.cod_catastral = ''
    let sector = this.sectores.filter(e => e.id == event)[0];
    this.solar.sector = sector['codigo']
  }

  async setSolares() {

    console.log(this.solar)
    // Validar Datos
    let message = '';

    if(this.solar.zona == ''  ||  this.solar.sector == '' || this.solar.manzana == '' || this.solar.solar == '')
     {
        message += '* Debe ingresar un Código Catastral válido.<br>'
    }else{
      this.solar.cod_catastral = this.solar.zona+'-'+this.solar.sector+'-'+this.solar.manzana+'-'+this.solar.solar
    }

    //if (this.solar.cod_catastral == null || this.solar.cod_catastral.trim().length == 0) message += '* No ha ingresado un Código Catastral.<br>'
    if (this.solar.cod_catastral_anterior == null || this.solar.cod_catastral_anterior.trim().length == 0) message += '* No ha ingresado un Código Catastral Anterior.<br>'
    if (this.solar.estado == null || this.solar.estado == 0) message += '* No ha seleccionado un Estado.<br>'
    if (this.solar.zona_id == null || this.solar.zona_id == 0) message += '* No ha ingresado una Zona.<br>'
    if (this.solar.sector_id == null || this.solar.sector_id == 0) message += '* No ha ingresado un Sector.<br>'
    if (this.solar.manzana == null || this.solar.manzana == 0) message += '* No ha ingresado una Manzana.<br>'
    if (this.solar.solar == null || this.solar.solar == 0) message += '* No ha ingresado un Solar.<br>'
    if (this.solar.area == null || this.solar.area == 0) message += '* No ha ingresado un Área.<br>'
    if (this.solar.valor_metro_cuadrado == null || this.solar.valor_metro_cuadrado == 0 ) message += '* No ha ingresado un Valor mt2.<br>'
    if (this.solar.valor_solar == null || this.solar.valor_solar == 0 ) message += '* No ha ingresado un Valor del solar.<br>'
    //if (this.solar.valor_edificacion == null || this.solar.valor_edificacion == 0 ) message += '* No ha ingresado un Valor de edificación.<br>'
    if (this.solar.valor_comercial == null || this.solar.valor_comercial == 0 ) message += '* No ha ingresado un Valor comercial.<br>'
   // if (this.solar.valor_hipoteca == null || this.solar.valor_hipoteca == 0 || this.solar.valor_hipoteca.trim().length == 0) message += '* No ha ingresado un Valor hipoteca.<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true})
      return;
    }

    let result = await Swal.fire({
      titleText: 'Creacion de nuevo Solar',
      text: 'Esta seguro/a de crear este nuevo solar?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Almacenando Solar'
        let response = await this.apiService.setSolar({solar: this.solar})
        console.log(response)
        Swal.fire({
          icon: "success",
          title: "¡Atención!",
          text: "Solar creado con exito",
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        })
        //this.toastr.success('Solar creado con exito')

        this.limpiar()
   

        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }

  async updateSolares() {
    // Validar Datos
    let message = '';

    //if (this.itemCatalogo.descripcion == null || this.itemCatalogo.descripcion.trim().length == 0) message += '* No ha ingresado un NOMBRE.<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true})
      return;
    }

    // Confirmar con el usuario
    let result = await Swal.fire({
      titleText: 'Modificacion de Solar',
      text: 'Esta seguro/a de modificar este solar?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Modificar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Modificando Solar'
        //let response = await this.apiService.putCatalogo(this.itemCatalogo.id_catalogo, {catalogo: this.itemCatalogo})
       // console.log(response)
        //
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }

  async actualizar() {
    this.lcargando.ctlSpinner(true);

    this.lcargando.ctlSpinner(false)
  }

  
  calculoValorComercial() {
    let total = parseInt(this.solar.valor_edificacion) + parseInt(this.solar.valor_solar)
    this.solar.valor_comercial = total
  } 

 

  expandListSolares() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Lotes.");
    } else {
      const modalInvoice = this.modalService.open(ConsultaLotesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fSolares;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
    
  }

  limpiar() {
    Object.assign(this.solar, {
      cod_catastral: '',
      cod_catastral_anterior: '',
      zona_id: '',
      zona: '',
      sector_id: '',
      sector: '',
      manzana: '',
      solar: '',
      area: '',
      valor_metro_cuadrado: 0,
      valor_solar: 0,
      valor_edificacion: 0,
      valor_comercial: 0,
      valor_hipoteca: 0,
      tipo_relacion: 0,
      fecha_adquisicion: moment(new Date()).format('YYYY-MM-DD'),
    })

    this.propietarios = [];

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
    this.vmButtons[4].habilitar = true;
    this.formReadonly = false
  }

  /* handleSelectTipo({value}) {
    Object.assign(this.itemCatalogo, {
      categoria: value
    })
  } */


}
