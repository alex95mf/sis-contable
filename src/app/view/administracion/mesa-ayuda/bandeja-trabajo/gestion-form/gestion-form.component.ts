import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { BandejaTrabajoService } from '../bandeja-trabajo.service'; 
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from "../../../../../global";
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-gestion-form',
  templateUrl: './gestion-form.component.html',
  styleUrls: ['./gestion-form.component.scss']
})
export class GestionFormComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  categorias: any = {};
  subCategorias: any = {};

  dataUser: any;
  vmButtons: any;
  ticketEdit: any = { categoria:0, sub_categoria:0};
  needRefresh: boolean = false;
  deshabilitar: boolean = false;
  subirFoto: boolean = false;
  disabledCampo: boolean = false;
  ticketSegui=[];

  gesTicket: any = {};
  categoriaGuard: any;
  fileList2: FileList;

  fotos: any = [];
  fotosEliminar: any = [];
  fotosSeguimiento: any = [];
  estadoList: any = [];

  actions: any = { btnNuevo: false, 
    btnGuardar: false, 
    btnEnviar: false, 
    btncancelar: false, 
    btnDescargar: false, 
    dComponet: false,
    view: false };

  
  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() ticket: any;

  // estadoList = [
  
  //   {value: "G",label: "GESTION"},
  //   {value: "C",label: "CERRADO"},
  //   {value: "GA",label: "GARANTIA"}

  // ] 
  prioridadList = [
    {value: "A",label: "ALTA"},
    {value: "M",label: "MEDIA"},
    {value: "B",label: "BAJA"},
    
  ]
 


  constructor(public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private commonSrv: CommonService,
      private bandejaTraSrv: BandejaTrabajoService,
      private commonVarSrv: CommonVarService,
      private modalSrv: NgbModal
  ) { 

    this.commonVarSrv.gestionTicket.asObservable().subscribe(
      (res) => {
        console.log(res)
        if(res.custom1 == 'TICKET-GESTION'){
          this.disabledCampo = res.validacion;
        }
        
      }
    );
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnGestionTicketForm",
          paramAccion: "",
          boton: { icon: "fas fa-save", texto: " GUARDAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-success boton btn-sm",
          habilitar: false,
      },
      {
          orig: "btnGestionTicketForm",
          paramAccion: "",
          boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false,
      }
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.ticketEdit = {
      fecha: "",
      fk_tramite: 0,
      observacion: "",
      categoria: 0,
      subcategoria: 0,
      estado: 0,
      prioridad: "",
    }

    this.gesTicket = {
      observacion: "",
      estado: 0,
    }

    

    if(!this.isNew){
    this.ticketEdit = JSON.parse(JSON.stringify(this.data));

    console.log(this.ticketEdit)
   // console.log(this.data)
    //console.log(' aquiiii sub categoria '+this.ticketEdit.categoria);
    this.deshabilitar=true;
    if(this.ticketEdit.estado=='G'){
      this.subirFoto=true;
    }
    this.commonVarSrv.bandTrabTicket.next(null);
  }
  setTimeout(()=> {
    this.getCatalogoCategoria();
    this.cargarSeguimiento();
    this.validaPermisos();
    //this.getCatalogoSubCategoria();
  }, 0);

  }
  gestionTicket(dt) {
    this.commonVarSrv.bandTrabTicket.next(dt);
    this.closeModal();
  }
  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
   // this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fRTTickets,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {

        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.closeModal();
            break;
        case " GUARDAR":
            this.validaGestionTicket();
            break;
        default:
            break;
    }
     
  }


  async validaGestionTicket() {
      let resp = await this.validaDataGlobal().then((respuesta) => {
        if(respuesta) {
            this.gestionarTicket(); 
        }
      });
  }
  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
  
      if (
        this.gesTicket.estado == 0 ||
        this.gesTicket.estado == undefined 
      ){
        this.toastr.info("El campo Estado no puede ser vacío");
        flag = true;
      }else if(
        this.gesTicket.observacion == "" ||
        this.gesTicket.observacion == undefined 
      ) {
        this.toastr.info("El campo Observacion no puede ser vacio");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })
  }
  selectedEstado(evt) {
    this.subirFoto = true;
   }

  getCatalogoCategoria() {
    let data = {
      params: "'MDA_CATEGORIA','MDA_SUBCATEGORIA','MDA_ESTADOS'",
    };
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.bandejaTraSrv.getCatalogoCategoria(data).subscribe(
     
      (res) => {
        this.categorias = res["data"]['MDA_CATEGORIA'];
        this.subCategorias = res["data"]['MDA_SUBCATEGORIA'];
       // this.estadoList = res["data"]['MDA_ESTADOS'];
        this.estadoList = res["data"]['MDA_ESTADOS'].filter(e => e.valor != 'P') 
        this.lcargando.ctlSpinner(false);
        //console.log('catalogos '+res);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  getCatalogoSubCategoria(evento: any) {
 ;
     this.subCategorias=0;
     let data = {
       grupo:evento
     };
     (this as any).mensajeSpinner = "Buscando sub categoría...";
     this.lcargando.ctlSpinner(true);
     this.bandejaTraSrv.getCatalogoSubCategoria(data).subscribe(
       
       (res) => {
         this.subCategorias = res["data"];
         this.lcargando.ctlSpinner(false);
       },
       (error) => {
         this.lcargando.ctlSpinner(false);
         this.toastr.info(error.error.message);
       }
     );
   }

   cargaArchivo2(archivos) {
    if (archivos.length > 0) {
      this.fileList2 = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList2.length + ' archivo(s).', 'Anexos de gestión del ticket')
      }, 50)
      // console.log(this.fileList)
    }
    
  }
 
  uploadFile() {
    console.log('Presionado una vez');
    let data = {
      // Informacion para almacenamiento de anexo
      module:3,
      component: myVarGlobals.fRTTickets,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.data.id_ticket,

      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRTTickets,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo de la gestión Ticket ${this.data.id_ticket}`,
      ip: this.commonSrv.getIpAddress(),
      custom1:'TICKET-GESTION' 
    }
  
    if(this.fileList2.length!=0){
      for (let i = 0; i < this.fileList2.length; i++) {
        this.UploadService(this.fileList2[i], data);
      }
    }
    this.fileList2 = undefined
    this.lcargando.ctlSpinner(false)
  }
  
  UploadService(file, payload?: any): void {
    this.bandejaTraSrv.uploadAnexo(file, payload).subscribe(
      res => { 
        this.commonVarSrv.contribAnexoLoad.next({condi:'ticket'})
      },
      err => {
        this.toastr.info(err.error.message);
      })
  }


  cargaFoto(archivos) {
    (this as any).mensajeSpinner = 'Cargando fotos...';
    this.lcargando.ctlSpinner(true);
    if (archivos.length > 0 && (archivos.length + this.fotos.length) <= 1) {
      for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = (c: any) => {
          this.fotos.push({
            id_ticket_fotos: 0,
            recurso: c.target.result
          });
        };
        reader.readAsDataURL(archivos[i]);
      }
      console.log(this.fotos)
    } else if ((archivos.length + this.fotos.length) > 1) {
      this.toastr.warning("No puede subir más de 1 foto", "¡Atención!");
    }
    this.lcargando.ctlSpinner(false);
  }

  removeFoto(index) {
    if (this.fotos[index].id_ticket_fotos > 0) {
      this.fotosEliminar.push(this.fotos.splice(index, 1)[0].id_ticket_fotos);
    } else {
      this.fotos.splice(index, 1);
    }
  }

  gestionarTicket() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar la gestión de Ticket?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {
              (this as any).mensajeSpinner = "Gestionando Ticket...";
              this.lcargando.ctlSpinner(true);
  
              let data = {
                gesTicket: {
                  observacion: this.gesTicket.observacion,
                  estado: this.gesTicket.estado,
                  fotos: this.fotos.filter(e => e.id_ticket_fotos === 0),
                }
              }
              console.log(this.data)
              this.bandejaTraSrv.gestionTicket(this.data.id_ticket,data).subscribe(
                  (res) => {
                     // console.log(res);
                      if (res["status"] == 1) {
                      this.needRefresh = true;
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "success",
                          title: "Ticket gestionado con éxito",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      }).then((result) => {
                        if (result.isConfirmed) {
                         // this.uploadFile();
                          this.needRefresh = true;
                          this.closeModal();
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
                  }
              )
        }
    });
  }
 

  closeModal() {
    this.commonVarSrv.bandTrabTicket.next(this.needRefresh);
    this.activeModal.dismiss();
  }

  cargarSeguimiento(){
    (this as any).mensajeSpinner = "Cargando Seguimiento...";
    this.lcargando.ctlSpinner(true);
    this.bandejaTraSrv.seguimientoTicket(this.data,this.data['id_ticket']).subscribe(

      (res) => {
        if (res["status"] == 1) {
          let foto = ""
          res['data'].forEach(e => {
            if(e.fotos[0]!=undefined){
              foto = e.fotos[0].recurso
              this.fotosSeguimiento.push(e.fotos)
            }else{
              foto = null
            }
          
            Object.assign(e, {fecha: e.fecha , observacion: e.observacion, usuario: e.usuario.nombre, foto:foto});
          })
          //console.log(res['data'].fotos)
          this.ticketSegui = JSON.parse(JSON.stringify(res['data']));
          this.getCatalogoCategoria();
          this.lcargando.ctlSpinner(false);
        }
        
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  expandirVistaFotos(index) {
    const modalInvoice = this.modalSrv.open(ModalVistaFotosComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    //modalInvoice.componentInstance.fotos = this.fotos;
    modalInvoice.componentInstance.indexActive = index;
    modalInvoice.componentInstance.fotos = this.fotosSeguimiento;
  }

}
