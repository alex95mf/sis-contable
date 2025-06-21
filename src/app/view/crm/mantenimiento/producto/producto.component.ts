import { Component, OnInit ,Input,ViewChild} from '@angular/core';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as myVarGlobals from '../../../../global';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import { ModalBuscarProductoComponent } from './modal-buscar-producto/modal-buscar-producto.component'

import { ProductoServiceService } from './producto-service.service';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatPaginator } from '@angular/material/paginator';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';



@Component({
standalone: false,
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {






  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  @ViewChild(MatPaginator) paginator : MatPaginator
  disabledProduct:boolean=true;
  fotos: any = [];
  fotosEliminar: any = [];
  dataUser: any = {};
  isNew: boolean;
  vmButtons: any = [];
  paginate: any;
  filter:any=[];
  lista_productos:any=[];
  lista_grupos:any=[];
  lista_grupos_productos:any=[];
  lista_clase_productos:any=[];
  lista_bodegas:any=[];
  lista_stock_por_bodega:any=[];
  lista_impuestos:any=[];

  bodega: any;
  permisions: any = [{ver: 0, abrir: 0, consultar: 0, editar: 0}];
  //imageBase64: string | null = null;




  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];
  //     const reader = new FileReader();
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       const result = e.target?.result as string;
  //       this.imageBase64 = result.split(',')[1]; // Obtener solo la parte base64
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

imageBase64:string="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";

  defaultImage:string="data:image/jpeg;base64,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";

  @Input() fTitle: any="Registro de Productos";
  @Input() permissions: any;
  producto:any={
    id_producto: 0,
    codigo:'',
    nombre:'',
    nombrecorto:'',
    descripcion:'',
    anio:  Number(moment(new Date()).format('YYYY')),
    fecha_desde: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
    fecha_hasta: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
    fecha_actual:new Date(),
    estado : 'A',
    secuencia:'000',

};

lista_estados:any = [
  { estado: "A",descripcion:"ACTIVO" },
  { estado: "I",descripcion:"INACTIVO" }

]


  constructor(
    private modal: NgbModal,
    private productoSrv: ProductoServiceService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
  ) {

    this.productoSrv.productos$.subscribe(
      (res: any) => {
      console.log(res)
        if(res.refrescar){
         // alert(res.id);
          this.producto.id_producto = res.id;
          this.consultarProducto();
        }
      }
    )

  }

  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
   // this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fCrmProductos,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {

        if (res["data"].length===0)
          {
            this.lcargando.ctlSpinner(false);
            this.vmButtons = [];
            this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
            return;
          }
        this.permissions = res["data"][0];


        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);


        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }
  metodoGlobal(evento: any) {
     switch (evento.items.boton.texto + evento.items.paramAccion) {
    //   case "NUEVO1":
    //     this.newProduct();
    //     break;
     case "BUSCAR1":
         this.buscarProductoS();
       break;

    //   case "GUARDAR1":
    //     this.validaSaveProduct();
    //     break;
      case "MODIFICAR1":
    //     // this.updateProduct();
         this.validarProducto();
         break;
       case "CANCELAR1":
         this.cancelar();
         break;
    //   case "ELIMINAR1":
    //     this.validateDeleteProduct();
    //     break;
    //   case "CERRAR2":
    //     this.cancelcatalogo();
    //     break;
    //   case "GUARDAR2":
    //     this.vaidateSaveCatalogo();
    //     break;
    //   case "CERRAR3":
    //     ($('#exampleModalQr') as any).modal('hide');
    //     break;
    //   case "CERRAR4":
    //     this.closeModal();
    //     break;

    //   case "COMPLETAR INGRESO1":
    //     console.log('holis')
    //     this.saveAllProducts();
    //     break;
    }
  }


  cargaFoto(archivos) {
    (this as any).mensajeSpinner = 'Cargando fotos...';
    this.lcargando.ctlSpinner(true);
    if (archivos.length > 0 && (archivos.length + this.fotos?.length) <= 5) {
      for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = (c: any) => {
          this.fotos.push({
            id_producto_fotos: 0,
            recurso: c.target.result
          });
        };
        reader.readAsDataURL(archivos[i]);
      }
    } else if ((archivos.length + this.fotos.length) > 5) {
      this.toastr.warning("No puede subir más de 5 fotos", "¡Atención!");
    }
    this.lcargando.ctlSpinner(false);
  }

  removeFoto(index) {
    if (this.fotos[index].id_producto_fotos > 0) {
      this.fotosEliminar.push(this.fotos.splice(index, 1)[0].id_producto_fotos);
    } else {
      this.fotos.splice(index, 1);
    }
  }


  expandirVistaFotos(index) {
    const modalInvoice = this.modal.open(ModalVistaFotosComponent, {
      size: "xl",
       backdrop: "static",
       windowClass: "viewer-content-general",
     });
     modalInvoice.componentInstance.fotos = this.fotos;
     modalInvoice.componentInstance.indexActive = index;
  }



  async validarProducto() {

    //alert('aki')
    //console.log(this.permissions);

    if (this.isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar Productos");
    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Proyectos.", this.fTitle);
    } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          if (this.isNew) {
            this.guardarProducto();
          } else {
            this.editarProducto();
          }
        }
      });
    }
  }

  guardarProducto(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo Producto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = "Guardando Producto...";
        this.lcargando.ctlSpinner(true);

        this.producto.fotos = this.fotos.filter(e => e.id_producto_fotos === 0);
        this.producto.fotosEliminar = this.fotosEliminar;




        this.productoSrv.guardarProducto({producto:this.producto}).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {

              this.producto = res["data"];
              this.producto.fotos = res["data"].fotos;
              this.producto.fotosEliminar=[];

           //   this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Producto Guardado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                //  this.closeModal();
                 // this.commonVarSrv.mesaAyuTicket.next(res['data']);
                }
              });
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
            console.log(error);
          }
        )
      }
    });
  }

  editarProducto(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este Producto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = "Editando Producto...";
        this.lcargando.ctlSpinner(true);

        this.producto.id_usuario= this.dataUser['id_usuario'];



        this.producto.fotos = this.fotos.filter(e => e.id_producto_fotos === 0);
        this.producto.fotosEliminar = this.fotosEliminar;
        console.log(this.producto);



        this.productoSrv.editarProducto({producto:this.producto}).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
            //  this.needRefresh = true;
            this.producto = res["data"];
            this.producto.fotos = res["data"].fotos;
            this.producto.fotosEliminar=[];



              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Producto Guardado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
               //   this.closeModal();
                 // this.commonVarSrv.mesaAyuTicket.next(res['data']);
                }
              });
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
            console.log(error);
          }
        )
      }
    });
  }
  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.producto.codigo == '' ||
        this.producto.codigo == undefined
      ) {
        this.toastr.info("Debe Ingresar un Codigo de Producto");
        flag = true;
      }
      else if (
        this.producto.nombre == 0||
        this.producto.nombre == undefined
      ) {
        this.toastr.info("Debe Ingresar un nombre de producto ");
        flag = true;
      }
      else if (
        this.producto.descripcion == 0||
        this.producto.descripcion == undefined
      ) {
        this.toastr.info("Debe Ingesar una Descripcion");
        flag = true;
      }
      else if (
        this.producto.nombrecorto == '' ||
        this.producto.nombrecorto== undefined
      ) {
        this.toastr.info("El campo Nombre Corto no puede ser vacío");
        flag = true;
      }


      !flag ? resolve(true) : resolve(false);
    })
  }





  async cargaInicial()
  {
    (this as any).mensajeSpinner = 'Cargando Grupo de Productos';
    this.lcargando.ctlSpinner(true);
    try {

    let response=await this.productoSrv.getCatalogos ({params:"'IMPUESTOS'"});


    this.lista_impuestos=response['IMPUESTOS'];

    console.log(this.lista_impuestos);








    this.lcargando.ctlSpinner(false)
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error.message, 'Error en Carga Inicial')
  }

  }



  async CargarGrupoProductos(){
    (this as any).mensajeSpinner = 'Cargando Grupo de Productos';
    this.lcargando.ctlSpinner(true);
    try {


     //alert(JSON.stringify(this.filter));

      let grupos =await this.productoSrv.getGrupoProductos({});
      this.lista_grupos= grupos;


    //  console.log(this.lista_grupos);

      //this.lista_Clase_Productos= this.lista_Grupos.filter(e => e.padreid === 0);
      this.lista_clase_productos = this.lista_grupos.filter(grupo => grupo.padreid === 0);
//console.log(this.lista_clase_productos);

      if (this.lista_clase_productos.length>0)
        {
          let clase = this.lista_clase_productos[0];
          this.lista_grupos_productos = this.lista_grupos.filter(e => e.padreid === clase.id_grupo);

        }
      //  console.log(this.lista_grupos_productos);



      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }


  }

  async CargarBodegas(){
    (this as any).mensajeSpinner = 'Cargando Bodegas';
    this.lcargando.ctlSpinner(true);
    try {


     //alert(JSON.stringify(this.filter));

      let bodegas =await this.productoSrv.getBodegas({});
      this.lista_bodegas= bodegas;








      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }


  }

removeBodega(index)
  {
    if (this.producto.bodegas[index].id_bodega_stock === 0) {

      this.producto.bodegas.splice(index, 1);
    }
  };

  addBodega(): void {


    const existe = this.producto.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

    // Si no existe, agregarla
    if (!existe) {
      let nuevoElemento = {
        id_bodega_stock: 0,
        fk_bodega: this.bodega.id_bodega,
        bodega: this.bodega,
        stock: 0
      };
      this.producto.bodegas.push(nuevoElemento);
    } else {
      // Manejar el caso donde la bodega ya existe
    //  console.log('La bodega ya existe en producto.bodegas');
      // Aquí podrías mostrar un mensaje al usuario o manejarlo según tus necesidades
    }


  }

  onClaseProductoChange(newValue: any) {
    // Aquí puedes manejar el evento de cambio
    this.producto.fk_grupo=0;
    let clase = this.lista_clase_productos.find(e => e.codigo === newValue);

    this.lista_grupos_productos = this.lista_grupos.filter(e => e.padreid === clase.id_grupo);


    console.log('Nuevo valor seleccionado:', newValue);
    // Puedes agregar aquí más lógica según lo que necesites hacer con el nuevo valor seleccionado
  }


  async consultarProducto(){
    (this as any).mensajeSpinner = 'Cargando Producto';
    this.lcargando.ctlSpinner(true);
    try {


     //alert(JSON.stringify(this.filter));
    // console.log(this.producto);

      let producto =await this.productoSrv.getProducto(this.producto.id_producto,{ producto: this.producto });
      //alert(JSON.stringify(producto));

      console.log('product0',producto);
      this.producto= producto;//.data;


      this.vmButtons[1].habilitar=true;
      this.vmButtons[2].habilitar=false;
      this.isNew = false;
      //this.paginate.length = proyectos.total;
      this.fotos = this.producto.fotos;
      this.lista_stock_por_bodega = this.producto.bodegas;

      let clase = this.lista_clase_productos.find(e => e.codigo === this.producto.clase);

      //console.log(clase);


      this.lista_grupos_productos = this.lista_grupos.filter(e => e.padreid === clase.id_grupo);

     // console.log(this.lista_grupos_productos);

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }


  }

  buscarProductoS():void{
    const modalInvoice = this.modal.open(ModalBuscarProductoComponent, {
      size: "xl",
      // backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fConciliacionBank;
    this.producto.id_producto = 0;

    modalInvoice.componentInstance.producto = this.producto;
    //modalInvoice.componentInstance.isNew = isNew;
    //modalInvoice.componentInstance.data = data;

    //modalInvoice.componentInstance.lista_estados = this.lista_estados;
    //modalInvoice.componentInstance.programas = this.programas;
    //modalInvoice.componentInstance.cmb_periodo= this.cmb_periodo;



  }
  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fas fa-edit", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },
          // Modal de Marca, Modelo, Color
      { orig: "btnIProductoModal", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnIProductoModal", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      // Modal Codigo de Barra
      { orig: "btnIQrModal", paramAccion: "3", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      // Modal Tarifas Arancelarias
      { orig: "btnarancelModal", paramAccion: "4", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },

    ];
    this.paginate = {
      length: 0,
      perPage: 8,
      page: 1,
      pageSizeOptions: [8, 20, 40, 60]
    };

    this.filter = {

      nombre:''
    }

    setTimeout(()=> {
      this.validaPermisos()
      this.cancelar()
      this.CargarGrupoProductos()
      this.CargarBodegas()
   //   this.consultar();
      this.cargaInicial();
    }, 50);

  }
  cancelar():void{

    this.vmButtons[0].habilitar=false;
    this.vmButtons[1].habilitar=false;
    this.vmButtons[2].habilitar=true;
    this.vmButtons[3].habilitar=false;
    this.isNew = true;
    this.producto={
      id_producto: 0,
      codigo:'',
      nombre:'',
      nombrecorto:'',
      descripcion:'',
      clase:'',
      fk_grupo:0,
      anio:  Number(moment(new Date()).format('YYYY')),
      fecha_desde: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
      fecha_hasta: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
      fecha_actual:new Date(),
      estado : 'A',
      secuencia:'000',
      bodegas:[],
      codigo_impuesto_iva : ''


  };
  this.fotos=[];
  this.fotosEliminar=[];
  this.lista_stock_por_bodega=[];
  if (this.lista_clase_productos.length>0)
    {
      let clase = this.lista_clase_productos[0];
      this.lista_grupos_productos = this.lista_grupos.filter(e => e.padreid === clase.id_grupo);

    }



    }

}
