import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { FormularioNotificacionesService } from '../formulario-notificaciones.service';
import { ConceptoDetComponent } from '../../../coactiva/emision-expediente/concepto-det/concepto-det.component';
import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-modal-detalles',
  templateUrl: './modal-detalles.component.html',
  styleUrls: ['./modal-detalles.component.scss']
})
export class ModalDetallesComponent implements OnInit {
  @Input() notificacion: any;
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando..."
  ftitulo: any = "Detalles de Notificación"
  vmButtons: any;
  paginate: any = {
    length: 0,
    perPage: 7,
    page: 1,
    pageSizeOptions: [5, 7, 10]
  }

  ListaDetalle: any[] = []
  ListaMostrar: any[] = []
  anexos: any[] = []

  
  catalog: any = [];

  constructor(
    private commSrv: CommonVarService,
    private modal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private apiService: FormularioNotificacionesService,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [

      {
        orig: "btnsDetalles",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        
      },
    ]

    setTimeout(() => {
      this.cargarDetalles()
    }, 50)
  }


  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "REGRESAR":
        this.modal.close()
        break;
    }
  }

  cargarDetalles() {
    this.mensajeSpinner = 'Cargando Detalles de Notificacion'
        this.lcargando.ctlSpinner(true)
        this.apiService.getNotificacionDetalles({params: { id: this.notificacion.id_cob_notificacion }, component: myVarGlobals.fCobNotificacion}).subscribe(
          (res: any) => {
            this.ListaDetalle = res.data.detalles;
            this.paginate.length = res.data.detalles.length;
            this.ListaMostrar = this.ListaDetalle.slice(0, this.paginate.perPage);
            this.anexos = res.data.anexos;
            this.lcargando.ctlSpinner(false);
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error cargando Detalles de Notificacion')
          }
        )
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    
    this.lcargando.ctlSpinner(true)
    setTimeout(() => {
      this.ListaMostrar = this.ListaDetalle.slice(this.paginate.perPage * (this.paginate.page - 1), this.paginate.perPage * this.paginate.page)
      this.lcargando.ctlSpinner(false)
    }, 1500)
    
  }

  descargarAnexo(anexo) {
    let data = {
      storage: anexo.storage,
      name: anexo.name
    }

    this.apiService.downloadAnexo(data).subscribe(
      (resultado) => {
        const url = URL.createObjectURL(resultado)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', anexo.nombre)
        link.click()
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  expandDetalleLiq(c) {
    const modalInvoice = this.modalService.open(ConceptoDetComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.concepto = c;
  }
}
