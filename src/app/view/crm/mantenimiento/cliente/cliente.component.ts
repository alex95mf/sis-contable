import { Component, OnInit ,Input,ViewChild} from '@angular/core';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as myVarGlobals from '../../../../global';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import { ModalBuscarClienteComponent } from './modal-buscar-cliente/modal-buscar-cliente.component'

import { ClienteServiceService } from './cliente-service.service';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatPaginator } from '@angular/material/paginator';

import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { ThemeService } from 'ng2-charts';




@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {



  mapCoordinates: { lat: number, lng: number };


  initialLat: number = -2.147866;
  initialLng: number = -79.922742;

  onCoordinatesChanged(event: { lat: number, lng: number }) {

    this.cliente.latitud = event.lat;
  this.cliente.longitud = event.lng;

  this.initialLat = event.lat;
  this.initialLng= event.lng;
    console.log('Coordenadas recibidas del componente hijo:', event);
  }

  updateCoordinates() {
    // Cambia los valores de las coordenadas aquí para ver el cambio reflejado en el componente hijo
    this.initialLat = -3.145357; // Ejemplo de cambio
    this.initialLng = -80.901385; // Ejemplo de cambio
  }

  updateCoordinates1() {
    // Cambia los valores de las coordenadas aquí para ver el cambio reflejado en el componente hijo

    //this.setKnownCoordinates(-2.147866, -79.922742)
    this.setKnownCoordinates(this.cliente.latitud,this.cliente.longitud);

   // this.initialLat = this.mapCoordinates.lat;
   // this.initialLng = -this.mapCoordinates.lng;
  }

  setKnownCoordinates(lat: number, lng: number) {
    this.initialLat = lat;
    this.initialLng = lng;
  }

  //onCoordinatesChanged(coordinates: { lat: number, lng: number }) {
  //  this.mapCoordinates = coordinates;
 // }


  // Método para manejar el evento de click en el mapa
 // mapClicked($event: google.maps.MapMouseEvent) {
 //   this.lat = $event.latLng.lat();
 //   this.lng = $event.latLng.lng();
 // }


  mensajeSpiner: string = "Cargando...";
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
  lista_contactos:any=[];
  lista_direcciones:any=[];
  lista_impuestos:any=[];
  lista_tipo_documentos:any=[];
  lista_estado_civil:any=[];
  lista_nivel_educativo:any=[];
  SoloFacturacion:boolean=false;

  lista_segmentacion:any=[];
  lista_medio_contacto:any=[];

  lista_tipo_identificador:any=[];
  lista_tipo_direccion:any=[];
  lista_provincias:any=[];
  lista_ciudad:any=[];
  bodega: any;
  permisions: any = [{ver: 0, abrir: 0, consultar: 0, editar: 0}];

  lista_asesores:any=[];
  lista_oficial_credito:any=[];
  lista_usuarios:any=[];

  lista_plazo:any=[];
  lista_forma_pago:any=[];

  fileToUpload: File;
  fileBase64: any;
  nameFile: any;

  //imageBase64: string | null = null;

Fecha_Actual : any=new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10);





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


  defaultImage:string="data:image/jpeg;base64,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";

  @Input() fTitle: any="Registro de Clientes";
  @Input() permissions: any;
  cliente:any={
    id_cliente: 0,
    codigo:'',
    nombre:'',
    direccion:'',
    telefono1:'',
    genero:'',

    fecha_nacimiento: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
    fecha_registro_credito: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),

    estado : 'A',
    documentos:[]


};

clienteRelacionado:any={};


lista_estados:any = [
  { estado: "A",descripcion:"ACTIVO" },
  { estado: "I",descripcion:"INACTIVO" }

]

lista_generos:any = [
  { codigo: "M",descripcion:"MASCULINO" },
  { codigo: "F",descripcion:"FEMENINO" }

]

  constructor(
    private modal: NgbModal,
    private clienteSrv: ClienteServiceService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
  ) {

    this.clienteSrv.clientes$.subscribe(
      (res: any) => {
      console.log(res)
        if(res.refrescar){
         // alert(res.id);

          if (res.TipoConsulta==="Cliente")
          {
            this.cliente.id_cliente = res.id;
            this.consultarCliente();

          }

        else if (res.TipoConsulta==="Relacionado")
        {
          this.clienteRelacionado.id_cliente = res.id;
          this.consultarClienteRelacionado();
        }

        }
      }
    )

  }

  validaPermisos = () => {
    this.mensajeSpiner = 'Cargando Permisos de Usuario...';
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
         this.buscarClientes();
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
    this.mensajeSpiner = 'Cargando fotos...';
    this.lcargando.ctlSpinner(true);
    if (archivos.length > 0 && (archivos.length + this.fotos?.length) <= 5) {
      for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = (c: any) => {
          this.fotos.push({
            id_cliente_fotos: 0,
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
    if (this.fotos[index].id_cliente_fotos > 0) {
      this.fotosEliminar.push(this.fotos.splice(index, 1)[0].id_cliente_fotos);
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

  get documentosControl(): any[] {
    return this.cliente.documentos.filter(doc => doc.tipo === 'CONTROL');
  }
  get documentosInformativos(): any[] {
    return this.cliente.documentos.filter(doc => doc.tipo === 'INFORMATIVO');
  }
  get documentosGarantias(): any[] {
    return this.cliente.documentos.filter(doc => doc.tipo === 'GARANTIA');
  }

  cargaCertificado(archivo: FileList, id, linea) {

    let index = 0;

    if (id===0){
      index = this.cliente.documentos.findIndex(item => item.linea === linea);
    }
    else
    {
      index = this.cliente.documentos.findIndex(item => item.id_cliente_documento === id);
    }

    console.log(archivo)
    console.log(index)
    // Convertir en base 64
    this.fileToUpload = archivo[0];

    let reader = new FileReader();

    reader.onload = async (event: any) => {
      this.cliente.documentos[index].nombre_archivo = this.fileToUpload.name;
      this.cliente.documentos[index].archivo_base_64 = event.target.result;

      if(this.cliente.documentos[index].id_cliente_documento && this.cliente.documentos[index].id_cliente_documento != 0){
        this.lcargando.ctlSpinner(true)
        this.mensajeSpiner = 'Almacenando Certificado'
        try {

          let data={
            cliente:{
              id_cliente_documento: this.cliente.documentos[index].id_cliente_documento,
              archivo_base_64: this.cliente.documentos[index].archivo_base_64,
              nombre_archivo: this.cliente.documentos[index].nombre_archivo
            }
          }
          let response = await this.clienteSrv.saveCertificado(data)
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

  async eliminarCertificado(data: any)
  {

    let index = 0;

    if (data.id_cliente_documento===0){
      index = this.cliente.documentos.findIndex(item => item.linea === data.linea);
    }
    else
    {
      index = this.cliente.documentos.findIndex(item => item.id_cliente_documento === data.id_cliente_documento);
    }

    const result = await Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de borrar el Documento?",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      if( data.id_cliente_documento!= 0 && data.id_cliente_documento != undefined ){
        this.lcargando.ctlSpinner(true)
        try {
          this.mensajeSpiner = 'Eliminando Documento'
          let response = await this.clienteSrv.deleteCertificado({id_cliente_documento: data.id_cliente_documento})
          console.log(response)
          this.cliente.documentos[index].nombre_archivo = null;
          this.cliente.documentos[index].archivo_base_64 = null;
          this.lcargando.ctlSpinner(false)
          Swal.fire('Documento eliminado correctamente.', '', 'success')
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
        }
      } else {
        this.cliente.documentos[index].nombre_archivo = null;
        this.cliente.documentos[index].archivo_base_64 = null;
      }
    }

  }


  handleButtonUpload(index: number) {
    document.getElementById(`anexo${index}`).click()
  }



  async validarProducto() {

    //alert('aki')
    //console.log(this.permissions);

    if (this.isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar Cliente");
    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Proyectos.", this.fTitle);
    } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          if (this.isNew) {
            this.guardarCliente();
          } else {
            this.editarCliente();
          }
        }
      });
    }
  }

  guardarCliente(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo Cliente?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpiner = "Guardando Cliente...";
        this.lcargando.ctlSpinner(true);

   //     this.producto.fotos = this.fotos.filter(e => e.id_producto_fotos === 0);
   //     this.producto.fotosEliminar = this.fotosEliminar;




        this.clienteSrv.guardarCliente({cliente:this.cliente}).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {

              this.cliente = res["data"];

              this.cliente.fecha_nacimiento = moment( res["data"].fecha_nacimiento).format("YYYY-MM-DD");
              this.cliente.fecha_registro_credito = moment( res["data"].fecha_registro_credito).format("YYYY-MM-DD");

              this.cliente.created_at = moment( res["data"].created_at).format("YYYY-MM-DD");


              this.cliente.documentos.forEach((documento, index) => {
                documento.fecha_emision = moment( documento.fecha_emision).format("YYYY-MM-DD");
                documento.fecha_vencimiento = moment( documento.fecha_vencimiento).format("YYYY-MM-DD");
             });


             // this.producto.fotos = res["data"].fotos;
             // this.producto.fotosEliminar=[];

           //   this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Cliente Guardado",
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

  editarCliente(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este Cliente?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpiner = "Editando Cliente...";
        this.lcargando.ctlSpinner(true);

        this.cliente.id_usuario= this.dataUser['id_usuario'];

        this.cliente.documentos = this.cliente.documentos.filter(doc => doc.id_cliente_documento === 0);



        this.cliente.fotos = this.fotos.filter(e => e.id_cliente_fotos === 0);
        this.cliente.fotosEliminar = this.fotosEliminar;
        console.log(this.cliente);

        //this.cliente.latitud = this.mapCoordinates.lat;
        //this.cliente.longitud = this.mapCoordinates.lng;
        this.cliente.latitud = this.initialLat;
        this.cliente.longitud = this.initialLng;


        this.clienteSrv.editarCliente({cliente:this.cliente}).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
            //  this.needRefresh = true;
            this.cliente = res["data"];
            this.cliente.fecha_nacimiento = moment( res["data"].fecha_nacimiento).format("YYYY-MM-DD");
            this.cliente.created_at = moment( res["data"].created_at).format("YYYY-MM-DD");

            this.cliente.documentos.forEach((documento, index) => {
              documento.fecha_emision = moment( documento.fecha_emision).format("YYYY-MM-DD");
              documento.fecha_vencimiento = moment( documento.fecha_vencimiento).format("YYYY-MM-DD");
           });




       //     this.producto.fotos = res["data"].fotos;
       //     this.producto.fotosEliminar=[];



              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Cliente Guardado",
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
        this.cliente.codigo == '' ||
        this.cliente.codigo == undefined
      ) {
        this.toastr.info("Debe Ingresar un Codigo de Cliente");
        flag = true;
      }
      else if (
        this.cliente.nombre == ''||
        this.cliente.nombre == undefined
      ) {
        this.toastr.info("Debe Ingresar un nombre de Cliente ");
        flag = true;
      }
      else if (
        this.cliente.direccion == ''||
        this.cliente.direccion == undefined
      ) {
        this.toastr.info("Debe Ingesar una Descripcion");
        flag = true;
      }
      else if (
        this.cliente.ruc == '' ||
        this.cliente.ruc== undefined
      ) {
        this.toastr.info("El campo RUC no puede ser vacío");
        flag = true;
      }


      !flag ? resolve(true) : resolve(false);
    })
  }



  async cargarCiudad(event,index)
  {
    let provincia = event;
    this.mensajeSpiner = 'Cargando Ciudad';
    this.lcargando.ctlSpinner(true)
    try {


      let data = {
        params: {
          tipo: 'CIUDAD',
          grupo: provincia
        }
      }

    let response=await this.clienteSrv.getProvincias(data);
    console.log(response);

    this.cliente.direcciones[index].ciudades = response;

//this.lista_ciudad = response;

 this.lcargando.ctlSpinner(false)
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error.message, 'Error en Carga Inicial')
  }


  }

  async cargarCiudad2(event,index)
  {
    let provincia = event;
    this.mensajeSpiner = 'Cargando Ciudad';
    this.lcargando.ctlSpinner(true)
    try {


      let data = {
        params: {
          tipo: 'CIUDAD',
          grupo: provincia
        }
      }

    let response=await this.clienteSrv.getProvincias(data);
    console.log(response);

    this.cliente.referencias[index].ciudades = response;

//this.lista_ciudad = response;

 this.lcargando.ctlSpinner(false)
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error.message, 'Error en Carga Inicial')
  }

  }

  async cargarCiudad3(event,index)
  {
    let provincia = event;
    this.mensajeSpiner = 'Cargando Ciudad';
    this.lcargando.ctlSpinner(true)
    try {


      let data = {
        params: {
          tipo: 'CIUDAD',
          grupo: provincia
        }
      }

    let response=await this.clienteSrv.getProvincias(data);
    console.log(response);

    this.cliente.informacionentrega[index].ciudades = response;

//this.lista_ciudad = response;

 this.lcargando.ctlSpinner(false)
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error.message, 'Error en Carga Inicial')
  }

  }
  async cargarProvincias()
  {
    this.mensajeSpiner = 'Cargando Grupo de Productos';
    this.lcargando.ctlSpinner(true)
    try {


      let data = {
        params: {
          tipo: 'PROVINCIA',
          grupo: 'Ecuador'
        }
      }

    let response=await this.clienteSrv.getProvincias
    (data);

this.lista_provincias = response;
 this.lcargando.ctlSpinner(false)
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error.message, 'Error en Carga Inicial')
  }

  }

  async cargaCatalogos()
  {
    this.mensajeSpiner = 'Cargando Grupo de Productos';
    this.lcargando.ctlSpinner(true)
    try {

    let response=await this.clienteSrv.getCatalogos
    ({params:"'IMPUESTOS','DOCUMENTO','ESTADO CIVIL','NIVEL EDUCATIVO','CLI_SEGMENTACION','CLI_MEDIO_CONTACTO','CLI_TIPO_IDENTIFICADOR','CLI_TIPO_DIRECCION','CLI_FORMA_PAGO','CLI_PLAZO'"});


    this.lista_impuestos=response['IMPUESTOS'];
    this.lista_tipo_documentos=response['DOCUMENTO'];
    this.lista_estado_civil=response['ESTADO CIVIL'];
    this.lista_nivel_educativo=response['NIVEL EDUCATIVO'];
    this.lista_segmentacion=response['CLI_SEGMENTACION'];
    this.lista_medio_contacto=response['CLI_MEDIO_CONTACTO'];

    this.lista_tipo_identificador=response['CLI_TIPO_IDENTIFICADOR'];
    this.lista_tipo_direccion=response['CLI_TIPO_DIRECCION'];

    this.lista_forma_pago=response['CLI_FORMA_PAGO'];
    this.lista_plazo=response['CLI_PLAZO'];

    //console.log(this.lista_tipo_contacto);


    let data = {
      params: {
        perfiles: [3,42]
      }
    }

    let usuarios = await this.clienteSrv.getUsuarios(data);


    console.log('usuasrio',usuarios);
  this.lista_usuarios=usuarios;

 this.lista_asesores = this.lista_usuarios.filter(usuario => usuario.role.nombre_rol === 'ASESOR');

// Filtrar usuarios con nombre_rol igual a 'PEDIDO_ONLINE'
this.lista_oficial_credito = this.lista_usuarios.filter(usuario => usuario.role.nombre_rol === 'PEDIDO_ONLINE');















    this.lcargando.ctlSpinner(false)
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error.message, 'Error en Carga Inicial')
  }

  }



  async CargarGrupoProductos(){
    this.mensajeSpiner = 'Cargando Grupo de Productos';
    this.lcargando.ctlSpinner(true)
    try {


     //alert(JSON.stringify(this.filter));

      let grupos =await this.clienteSrv.getGrupoProductos({});
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
    this.mensajeSpiner = 'Cargando Bodegas';
    this.lcargando.ctlSpinner(true)
    try {


     //alert(JSON.stringify(this.filter));

      let bodegas =await this.clienteSrv.getBodegas({});
      //this.lista_bodegas= bodegas;








      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }


  }

removeContacto(index)
  {
    if (this.cliente.contactos[index].id_cliente_contacto === 0) {

      this.cliente.contactos.splice(index, 1);
    }
    else
    {
      this.cliente.contactos[index].estado='I'
    }
  };

  activarContacto(index)
  {
   this.cliente.contactos[index].estado='A';
  };



  removeDireccion(index)
  {
    if (this.cliente.direcciones[index].id_cliente_direccion === 0) {

      this.cliente.direcciones.splice(index, 1);
    }
    else
    {
      this.cliente.direcciones[index].estado='I'
    }
  };

  activarDireccion(index)
  {
    this.cliente.direcciones[index].estado='A';
  };

  addContacto(): void {


   // const existe = this.cliente.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

    // Si no existe, agregarla

      let nuevoElemento = {
        id_cliente_contacto: 0,
        fk_ciente: this.cliente.id_cliente,
        tipo_contacto:'',
        nombre_contacto:'',
        tipo_identificador_contacto:'',
        telefono_contacto:'',
        correo_contacto:'',
        estado:'A'


      };
      this.cliente.contactos.push(nuevoElemento);

      // Manejar el caso donde la bodega ya existe
    //  console.log('La bodega ya existe en producto.bodegas');
      // Aquí podrías mostrar un mensaje al usuario o manejarlo según tus necesidades



  }

  addDireccion(): void {


    // const existe = this.cliente.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

     // Si no existe, agregarla

       let nuevoElemento = {
         id_cliente_direccion: 0,
         fk_ciente: this.cliente.id_cliente,
         tipo_direccion:'',

         direccion:'',
         tipo_identificador:'',
         provincia:'',
         ciudad:'',
         codigo_postal:'',
         estado:'A',
         ciudades:[]


       };
       this.cliente.direcciones.push(nuevoElemento);

       // Manejar el caso donde la bodega ya existe
     //  console.log('La bodega ya existe en producto.bodegas');
       // Aquí podrías mostrar un mensaje al usuario o manejarlo según tus necesidades



   }

   addReferencia(): void {


    // const existe = this.cliente.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

     // Si no existe, agregarla

       let nuevoElemento = {
         id_cliente_referencia: 0,
         fk_ciente: this.cliente.id_cliente,
         proveedor:'',
         provincia:'',
         ciudad:'',
         telefonos:'',
         productos:'',
         plazo:0,
         compras_mensuales:0,
         estado:'A',
         ciudades:[]


       };
       this.cliente.referencias.push(nuevoElemento);

       // Manejar el caso donde la bodega ya existe
     //  console.log('La bodega ya existe en producto.bodegas');
       // Aquí podrías mostrar un mensaje al usuario o manejarlo según tus necesidades



   }

   removeReferencia(index)
   {
     if (this.cliente.referencias[index].id_cliente_referencia === 0) {

       this.cliente.referencias.splice(index, 1);
     }
     else
     {
       this.cliente.referencias[index].estado='I'
     }
   };

   activarReferencia(index)
   {
     this.cliente.referencias[index].estado='A';
   };


   addInfoFinanciera(): void {


    // const existe = this.cliente.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

     // Si no existe, agregarla

       let nuevoElemento = {
         id_cliente_informacion_financiera: 0,
         fk_ciente: this.cliente.id_cliente,
         ingresos_anuales:0,
         gastos_anuales:0,
         cupo_por_vencer:0,
         cupo_vencido:0,
         deudas_actuales:0,

         estado:'A',



       };
       this.cliente.informacionfinanciera.push(nuevoElemento);

     console.log(this.cliente.informacionfinanciera);


   }

   removeInfoFinanciera(index)
   {
     if (this.cliente.informacionfinanciera[index].id_cliente_informacion_financiera === 0) {

       this.cliente.informacionfinanciera.splice(index, 1);
     }
     else
     {
       this.cliente.informacionfinanciera[index].estado='I'
     }
   };

   activarInfoFinanciera(index)
   {
     this.cliente.informacionfinanciera[index].estado='A';
   };



   addInfoEntrega(): void {


    // const existe = this.cliente.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

     // Si no existe, agregarla

       let nuevoElemento = {
        id_cliente_informacion_entrega: 0,
         fk_ciente: this.cliente.id_cliente,
         bodega :'',
         direccion :'',
         provincia :'',
         ciudad :'',
         zona :'',
         contacto :'',
         documento :'',
         telefono :'',
         transporte :'',
         forma_pago:'',
         estado:'A',



       };
       this.cliente.informacionentrega.push(nuevoElemento);




   }

   removeInfoEntrega(index)
   {
     if (this.cliente.informacionentrega[index].id_cliente_informacion_entrega === 0) {

       this.cliente.informacionentrega.splice(index, 1);
     }
     else
     {
       this.cliente.informacionentrega[index].estado='I'
     }
   };

   activarInfoEntrega(index)
   {
     this.cliente.informacionentrega[index].estado='A';
   };



   addCliente(): void {



    const modalInvoice = this.modal.open(ModalBuscarClienteComponent, {
      size: "xl",
      // backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fConciliacionBank;
    this.cliente.id_producto = 0;


    modalInvoice.componentInstance.cliente = this.clienteRelacionado;
    modalInvoice.componentInstance.TipoConsulta = "Relacionado";


    // const existe = this.cliente.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

     // Si no existe, agregarla






   }

   removeCliente(index)
   {
     if (this.cliente.relacionado[index].id_cliente_relacionado === 0) {

       this.cliente.relacionado.splice(index, 1);
     }
     else
     {
       this.cliente.relacionado[index].estado='I'
     }
   };

   activarCliente(index)
   {
     this.cliente.relacionado[index].estado='A';
   };

  onClaseProductoChange(newValue: any) {
    // Aquí puedes manejar el evento de cambio
    this.cliente.fk_grupo=0;
    let clase = this.lista_clase_productos.find(e => e.codigo === newValue);

    this.lista_grupos_productos = this.lista_grupos.filter(e => e.padreid === clase.id_grupo);


    console.log('Nuevo valor seleccionado:', newValue);
    // Puedes agregar aquí más lógica según lo que necesites hacer con el nuevo valor seleccionado
  }



  addInfoCredito(): void {


    // const existe = this.cliente.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

     // Si no existe, agregarla

       let nuevoElemento = {
         id_cliente_informacion_credito: 0,
         fk_ciente: this.cliente.id_cliente,
         banco:'',
         numero_cuenta:'',
         fk_archivo_1:0,
         fk_archivo_2:0,
         fk_archivo_3:0,
         fk_archivo_4:0,

         estado:'A',



       };
       this.cliente.informacioncredito.push(nuevoElemento);

     //console.log(this.cliente.informacionfinanciera);


   }

   removeInfoCredito(index)
   {
     if (this.cliente.informacioncredito[index].id_cliente_informacion_credito === 0) {

       this.cliente.informacioncredito.splice(index, 1);
     }
     else
     {
       this.cliente.informacioncredito[index].estado='I'
     }
   };

   activarInfoCredito(index)
   {
     this.cliente.informacioncredito[index].estado='A';
   };


   addDocumento(tipodoc): void {


    // const existe = this.cliente.bodegas.some(bodega => bodega.fk_bodega === this.bodega.id_bodega);

     // Si no existe, agregarla

     this.cliente.documentos.length
       let nuevoElemento = {
         id_cliente_documento: 0,
         fk_ciente: this.cliente.id_cliente,
         tipo_documento:'',
         fecha_emision:this.Fecha_Actual,
         fecha_vencimiento:this.Fecha_Actual,
         usuario:{ usuario:''},
         updated_at:this.Fecha_Actual,
         tipo:tipodoc,
         linea :  this.cliente.documentos.length,
         nombre_archivo:'',
         archivo_base_64:'',


         estado:'A',



       };
       this.cliente.documentos.push(nuevoElemento);

     //console.log(this.cliente.informacionfinanciera);


   }

   removeDocumento(id, linea)
   {
    let index = 0;

    if (id===0){
      index = this.cliente.documentos.findIndex(item => item.linea === linea);
    }
    else
    {
      index = this.cliente.documentos.findIndex(item => item.id_cliente_documento === id);
    }




     if (this.cliente.documentos[index].id_cliente_documento === 0) {

       this.cliente.documentos.splice(index, 1);
     }
     else
     {
       this.cliente.documentos[index].estado='I'
     }
   };

   activarDocumento(id,linea)
   {
    let index = 0;

    if (id===0){
      index = this.cliente.documentos.findIndex(item => item.linea === linea);
    }
    else
    {
      index = this.cliente.documentos.findIndex(item => item.id_cliente_documento === id);
    }

     this.cliente.documentos[index].estado='A';
   };

  async consultarCliente(){
    this.mensajeSpiner = 'Cargando Producto';
    this.lcargando.ctlSpinner(true)
    try {


     //alert(JSON.stringify(this.filter));
    // console.log(this.producto);

      let cliente =await this.clienteSrv.getCliente(this.cliente.id_cliente,
        { cliente: this.cliente });
      //alert(JSON.stringify(producto));

      console.log('product0',cliente);
      this.cliente= cliente;//.data;
        this.cliente.fecha_nacimiento = moment(cliente.fecha_nacimiento).format("YYYY-MM-DD");
        this.cliente.created_at = moment(cliente.created_at).format("YYYY-MM-DD");
        this.cliente.fecha_registro_credito = moment(cliente.fecha_registro_credito).format("YYYY-MM-DD");


      this.vmButtons[1].habilitar=true;
      this.vmButtons[2].habilitar=false;
      this.isNew = false;
      //this.cliente.informacioncredito = [];
      this.cliente.archivos=[];
      this.cliente.archivos.push({ id_cliente_archivo:1,descripcion:'firna 1' }); // Agregar la nueva dirección a la lista
      this.cliente.archivos.push({ id_cliente_archivo:2,descripcion:'firna 2' }); // Agregar la nueva dirección a la lista
      this.fotos = this.cliente.fotos;

     // this.mapCoordinates= { lat: this.cliente.latitud, lng: this.cliente.Longitud };
   //  this.setKnownCoordinates(-2.147866, -79.922742);
    //   this.setKnownCoordinates(this.cliente.latitud,this.cliente.longitud);


       this.initialLat = this.cliente.latitud;
       this.initialLng= this.cliente.longitud;

      //this.initialLat = -2.147866;
      // this.initialLng= -79.922742;


      this.cliente.fecha_nacimiento = moment(cliente.fecha_nacimiento).format("YYYY-MM-DD");


      this.cliente.direcciones.forEach((direccion, index) => {
        this.cargarCiudad(direccion.provincia, index);
    });

    this.cliente.documentos.forEach((documento, index) => {
     documento.fecha_emision = moment( documento.fecha_emision).format("YYYY-MM-DD");
     documento.fecha_vencimiento = moment( documento.fecha_vencimiento).format("YYYY-MM-DD");
  });





      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga de Cliente')
    }


  }

  async consultarClienteRelacionado(){
    this.mensajeSpiner = 'Cargando Producto';
    this.lcargando.ctlSpinner(true)
    try {


     //alert(JSON.stringify(this.filter));
    // console.log(this.producto);

      let cliente =await this.clienteSrv.getCliente(this.clienteRelacionado.id_cliente,
        { cliente: this.clienteRelacionado });
      //alert(JSON.stringify(producto));


      this.clienteRelacionado= cliente;//.data;


      let nuevoElemento = {
        id_cliente_relacionado: 0,
        fk_ciente: this.cliente.id_cliente,
        cliente:this.clienteRelacionado,
        fk_cliente_relacionado : this.clienteRelacionado.id_cliente,

        estado:'A',



      };
      this.cliente.relacionado.push(nuevoElemento);





      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga de Cliente')
    }


  }
  buscarClientes():void{
    const modalInvoice = this.modal.open(ModalBuscarClienteComponent, {
      size: "xl",
      // backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fConciliacionBank;
    this.cliente.id_producto = 0;


    modalInvoice.componentInstance.cliente = this.cliente;
    modalInvoice.componentInstance.TipoConsulta = "Cliente";




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
     // this.CargarBodegas()
   //   this.consultar();
      this.cargaCatalogos();
      this.cargarProvincias();
    }, 50);

  }
  cancelar():void{


    this.vmButtons[0].habilitar=false;
    this.vmButtons[1].habilitar=false;
    this.vmButtons[2].habilitar=true;
    this.vmButtons[3].habilitar=false;
    this.isNew = true;
    this.cliente={
      id_cliente: 0,
      codigo:'',
      nombre:'',
      direccion:'',
      telefono1:'',
      genero:'',
      ruc:'',
      tipo_identificacion:'',
      profesion:'',
      nivel_educativo:'',
      pagina_web:'',
      estado_civil:'',

      fecha_nacimiento: this.Fecha_Actual,

      created_at: this.Fecha_Actual,

      estado : 'A',
      segmentacion:'',
      medio_contacto:'',
      email:'',
      fecha_registro_credito:this.Fecha_Actual,
      cupo :0,
      plazo:'',
      forma_pago:'',
      fk_asesor:0,
      fk_oficial_credito:0,

      contactos:[],
      direcciones:[],
      referencias:[],
      informacionfinanciera:[],
      informacioncredito:[],
      archivos:[],
      garantia:'',
      observacion:'',
      notas:'',
      otras_notas:'',
      relacionado:[],
      informacionentrega:[],
      documentos:[],
      latitud: -2.145357,
      longitud:-79.901385

  };
  this.fotos=[];
  this.fotosEliminar=[];
  this.lista_contactos=[];
  this.lista_direcciones=[];
  this.lista_estado_civil=[];
  this.lista_nivel_educativo=[];
 // this.lista_asesores=[];
//  this.lista_oficial_credito=[];
 // this.lista_plazo=[];
 // this.lista_forma_pago=[];


 this.initialLat = -2.147866;

 this.initialLng= -79.922742;
//this.initialLat= -2.2199766900493;
//this.initialLng =   -79.695248034246;

    }

}
