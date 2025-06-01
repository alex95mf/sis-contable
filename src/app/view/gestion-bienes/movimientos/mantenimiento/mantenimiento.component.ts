import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ListBusquedaPrestamoComponent } from './list-busqueda-prestamo/list-busqueda-prestamo.component';
import { MantenimientoService } from './mantenimiento.service';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import * as myVarGlobals from '../../../../global';
@Component({
standalone: false,
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.scss']
})
export class MantenimientoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  dataProducto: any = []
  vmButtons: any =[]
  codigoGrupo: any;
  proveedorActive: any = {
    razon_social: ""
  };
  documento :any = {
    num_documento:"",
    observaciones:"",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    fk_proveedor:0,
    detalles:[]

}
  producto:any = []

  mantenimientoDisabled =false
  anexoDisabled =true

  productoDisabled =false

  fileList: FileList;
  id:any
  estado = 'P'
  producto_delete:any

  constructor(
    private commonServices: CommonService,
    private commonVarServices: CommonVarService,
    private toastr: ToastrService,

    private modalService: NgbModal,
    private invService: MantenimientoService,
  ) {
    this.commonVarServices.selectProveedorCustom.asObservable().subscribe(
      (res) => {
        this.documento.fk_proveedor = res['id_proveedor']
        this.proveedorActive = res;
        console.log(res)
      }
    );
    this.commonVarServices.selectProducto.asObservable().subscribe(
      (res) => {
       console.log(res)
       let data = {
        nombre: res['nombre'],
        codigoproducto: res['codigoproducto'],
        fk_producto: res['id_producto'],
        id_mantenimiento_det: 0
       }
       this.documento.detalles.push(data)
       this.producto = this.documento.detalles
       console.log(this.producto)
      }

    );
    this.commonVarServices.selectPrestamo.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.id = res['id_mantenimiento']
        this.estado = res['estado']
        this.documento.fecha= res['fecha']
        this.proveedorActive = res['proveedor']
        this.documento.observaciones = res['observaciones']
        this.documento.num_documento = res['num_documento']
        console.log(res.detalles)

        //this.producto=[];
        res.detalles.forEach(e => {

          let det = {
            nombre: e['producto'][0].nombre,
            codigoproducto: e['producto'][0].codigo,
            fk_producto:e['producto'][0].id_producto,
            observacion:e['observacion'],
            id_mantenimiento_det:e['id_mantenimiento_det']
          }

          this.producto.push(det)

        })
       // console.log(this.producto)
        this.documento.detalles = this.producto


        this.commonVarServices.contribAnexoLoad.next({condi:'infimas', id: res.id_mantenimiento,estado:this.estado});

        if(res['estado']=="C"){
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = true;
          this.vmButtons[4].habilitar = true;
          this.mantenimientoDisabled = true
          this.productoDisabled = true
        }
         else {
          this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = false;
        this.vmButtons[4].habilitar = false;
        this.mantenimientoDisabled = false
        this.productoDisabled = false
        this.anexoDisabled =false


        }
      }
    );
   }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsMantenimiento", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsMantenimiento", paramAccion: "", boton: { icon: "far fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsMantenimiento", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsMantenimiento",paramAccion: "", boton: { icon: "fas fa-edit", texto: "EDITAR" },permiso: true,showtxt: true,showimg: true,showbadge: false,clase: "btn btn-danger btn-sm",habilitar: true,imprimir: false},
      { orig: "btnsMantenimiento",paramAccion: "", boton: { icon: "fas fa-save", texto: "APROBAR" },permiso: true,showtxt: true,showimg: true,showbadge: false,clase: "btn btn-warning btn-sm",habilitar: true,imprimir: false},
    ];

    this.limpiar();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "LIMPIAR":
        this.limpiar();
        break;
      case "BUSCAR":
       this.expandListBusqueda()
        break;
      case "GUARDAR":
       this.saveMantenimiento()
        break;
      case "EDITAR":
          this.editar()
            break;
      case "APROBAR":
          this.aprobar()
            break;

    }
  }


  limpiar(){
    this.producto = []
    this.documento = {
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      observaciones: "",
      num_documento:"",
      fk_proveedor:0,
      detalles: [], // deudas
    }
    this.proveedorActive = {
      razon_social: ""
    }
    this.commonVarServices.clearAnexos.next(null)
    this.estado = 'P'
    this.vmButtons[2].habilitar= false;
    this.vmButtons[3].habilitar= true;
    this.vmButtons[4].habilitar= true;
  }


  addProduct() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListBusquedaPrestamoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    // modal.componentInstance.permissions = this.permissions;
    // modal.componentInstance.validate = 'EB'
    // modal.componentInstance.subgrupo = this.subgrupo
    // modal.componentInstance.verifyRestore = this.verifyRestore;
    }

    expandListProveedores() {

      const modalInvoice = this.modalService.open(ModalProveedoresComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      //modalInvoice.componentInstance.module_comp = myVarGlobals.fContratacion;

    }


  removeTitulo(index,producto) {
    this.producto.splice(index, 1);
    this.producto_delete = producto
    console.log(this.producto_delete)
    if(producto.id_mantenimiento_det != 0 || producto.id_mantenimiento_det>0 ){
      this.eliminarDetalle()
    }
  }

  saveMantenimiento(){
    if(this.documento.detalles.length <=0 || this.documento.detalles == undefined){
      this.toastr.info("Debe seleccionar producto(s)")
      return;
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de guardar un mantenimiento ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result)=>{
      if(result.isConfirmed){
        this.msgSpinner = 'Guardando...';
        this.lcargando.ctlSpinner(true);
        let data = {
          documento :this.documento
        }
        console.log(data)
        this.invService.saveMantenimiento(data).subscribe(
          (res)=>{
            console.log(res)
            Swal.fire({
              icon: "success",
              title: "Documento de mantenimiento generado",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
            this.documento = res['data']
            this.uploadFile(res['data'].id_mantenimiento)
            this.mantenimientoDisabled = true
            this.lcargando.ctlSpinner(false);
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error al generar el documento de pago",
              text: error.error.message,
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          }
        );

      }
    });
  }

  expandListBusqueda() {

    const modalInvoice = this.modalService.open(ListBusquedaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    //modalInvoice.componentInstance.module_comp = myVarGlobals.fContratacion;

  }

  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos')
      }, 50)
    }
  }

  uploadFile(id_mantenimiento) {
    console.log(id_mantenimiento)
    let data = {
      //module: this.permissions.id_modulo,
      module:21,
      component: myVarGlobals.fGestBienesMant,
      identifier: id_mantenimiento,
      id_controlador: myVarGlobals.fGestBienesMant,
      accion: `Nuevo anexo para Prestamo de Bienes ${id_mantenimiento}`,
      ip: this.commonServices.getIpAddress(),
      custom1:'INV-PRESTAMO-BIENES'
    }
    if(this.fileList.length!=0){
      for (let i = 0; i < this.fileList.length; i++) {
        this.UploadService(this.fileList[i], id_mantenimiento,data );
      }
    }
    this.fileList = undefined
    this.lcargando.ctlSpinner(false)
  }

  UploadService(file,  identifier, payload?: any): void {
    this.invService.uploadAnexo(file, payload).subscribe(
      res => {
        this.commonVarServices.contribAnexoLoad.next({condi:'infimas', id: identifier})
      },
      err => {
        this.toastr.info(err.error.message);
      })
  }

  editar(){
    if(this.documento.detalles.length <=0 || this.documento.detalles == undefined){
      this.toastr.info("Debe seleccionar producto(s)")
      return;
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este mantenimiento?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result)=>{
      if(result.isConfirmed){
        this.msgSpinner = 'Guardando...';
        this.lcargando.ctlSpinner(true);
        let data = {
          id:this.id,
          fk_proveedor:this.proveedorActive.id_proveedor,
          fecha:this.documento.fecha,
          observaciones:this.documento.observaciones,
          detalles:this.producto
        }
        this.invService.updateMantenimiento(data).subscribe(
          (res)=>{
          if(res["status"]==1){
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "success",
              title: "Se actualizó con éxito",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            }).then((result) => {
              if (result.isConfirmed) {
                this.productoDisabled = false
                console.log(this.fileList)
              if(this.fileList!=undefined){
                this.uploadFile(data.id)
              }
               // this.mantenimientoDisabled = true

              }
            })
          }
          else{
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            });
          }

          },
          (error)=>{
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        )
      }
    })

  }

  aprobar(){

    if (this.documento.observaciones == "" || this.documento.observaciones == undefined) {
      this.toastr.info("Debe editar e ingresar una observación para realizar el mantenimiento")
      return;
    }
    // else if (this.fileList == undefined ) {
    //   this.toastr.info("Debe editar e ingresar anexo")
    //   return;
    // }
    else if(this.proveedorActive.razon_social =="" || this.proveedorActive.razon_social==undefined){
      this.toastr.info("Debe editar y seleccionar un proveedor")
      return;
    }
    else if(this.documento.detalles.length <=0 || this.documento.detalles == undefined){
      this.toastr.info("Debe editar y seleccionar producto(s)")
      return;
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea aprobar este registro de póliza?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result)=>{
      if(result.isConfirmed){
        this.msgSpinner = 'Guardando...';
        this.lcargando.ctlSpinner(true);
        this.estado = 'C'
        let data = {
          id:this.id
        }
        this.invService.updateEstado(data).subscribe(
          (res)=>{
            console.log(res)
            if(res["status"]==1){
              this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "success",
            title: "Se actualizó con éxito",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8'
          }).then((result)=>{
            if(result.isConfirmed){
              this.lcargando.ctlSpinner(false);
              this.mantenimientoDisabled = true
              this.productoDisabled = true
              this.vmButtons[3].habilitar = true;
              this.vmButtons[4].habilitar = true;
            }
          })
            }
            else{
              this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8'
          });
            }

          },
          (error)=>{
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        )
      }
    })



  }

  eliminarDetalle(){
    this.invService.deleteDetalle(this.producto_delete).subscribe(
      (res)=>{
        if(res["status"]==1){
          this.lcargando.ctlSpinner(false);
        }
      }
    )
  }


}
