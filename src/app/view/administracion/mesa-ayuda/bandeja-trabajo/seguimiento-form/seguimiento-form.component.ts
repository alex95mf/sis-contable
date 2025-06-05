import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { BandejaTrabajoService } from '../bandeja-trabajo.service'; 
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalVistaFotosComponent } from '../gestion-form/modal-vista-fotos/modal-vista-fotos.component'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
standalone: false,
  selector: 'app-seguimiento-form',
  templateUrl: './seguimiento-form.component.html',
  styleUrls: ['./seguimiento-form.component.scss']
})
export class SeguimientoFormComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false })lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  categorias: any = {};
  subCategorias: any = {};

  dataUser: any = {};
  vmButtons: any = {};
  ticketEdit: any = { categoria:0, subcategoria:0};
  ticketSegui=[];
  fotosSeguimiento: any = [];
 

  needRefresh: boolean = false;
  deshabilitar: boolean = false;

  gesTicket: any = {};

  
  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() ticket: any;
  

  

  estadoList = [
    {value: "P",label: "PENDIENTE"},
    {value: "G",label: "GESTION"},
    {value: "C",label: "CERRADO"}
  ] 
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
    private modalSrv: NgbModal) { 


    
    }

  ngOnInit(): void {

    console.log(this.data);

    this.vmButtons = [
     /* {
          orig: "btnSeguimientoTicketForm",
          paramAccion: "",
          boton: { icon: "fas fa-save", texto: " GUARDAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-success boton btn-sm",
          habilitar: false,
      },*/
      {
          orig: "btnSeguimientoTicketForm",
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
      //console.log('Aquiiiiiii'+ this.ticketEdit.id_ticket);
      this.deshabilitar=true;
     // this.cargarSeguimiento();
    }
   
    
    setTimeout(()=> {
      this.getCatalogoCategoria();
      this.cargarSeguimiento();
    }, 50);
 
  }

  seguiTicket(dt) {
    this.commonVarSrv.seguiTicket.next(dt);
    this.closeModal();
  }
  getCatalogoCategoria() {
    let data = {
      params: "'MDA_CATEGORIA','MDA_SUBCATEGORIA'",
    };
   
    this.bandejaTraSrv.getCatalogoCategoria(data).subscribe(
     
      (res) => {
        this.categorias = res["data"]['MDA_CATEGORIA'];
        this.subCategorias = res["data"]['MDA_SUBCATEGORIA'];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarSeguimiento(){
    console.log('cargando segui')
    (this as any).mensajeSpinner = "Cargando Seguimiento...";
    this.lcargando.ctlSpinner(true);
    this.bandejaTraSrv.seguimientoTicket(this.data,this.data['id_ticket']).subscribe(

      (res) => {
        console.log(res)
        if (res["status"] == 1) {
          let foto = ""
          res['data'].forEach(e => {
            if(e.fotos[0]!=undefined){
              foto = e.fotos[0].recurso
              this.fotosSeguimiento.push(e.fotos)
              console.log(this.fotosSeguimiento)
            }else{
              foto = null
            }
          
            Object.assign(e, {fecha: e.fecha , observacion: e.observacion, usuario: e.usuario.nombre,foto:foto});
          })
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

  

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.closeModal();
            break;
        case " GUARDAR":
           // this.validaGestionTicket();
            break;
    }
  
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



  closeModal() {
    this.commonVarSrv.seguiTicket.next(this.needRefresh);
    this.activeModal.dismiss();
  }

}
