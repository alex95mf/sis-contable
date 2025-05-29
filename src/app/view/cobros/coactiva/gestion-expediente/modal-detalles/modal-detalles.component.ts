import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';

import * as myVarGlobals from 'src/app/global';
import { GestionExpedienteService } from '../gestion-expediente.service';
import { environment } from 'src/environments/environment';

@Component({
standalone: false,
  selector: 'app-modal-detalles',
  templateUrl: './modal-detalles.component.html',
  styleUrls: ['./modal-detalles.component.scss']
})
export class ModalDetallesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  ftitulo: any = "Detalles de Notificacion"
  vmButtons: any;

  @Input() expediente: any;

  ListaDetalle: any = []
  detalles: any = []
  liquidacion : any = []

  paginate: any;
  filter: any;

  constructor(
    private commVarSrv: CommonVarService,
    private commonService: CommonService,
    private modal: NgbActiveModal,
    private apiService: GestionExpedienteService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [

      {
        orig: "btnsDetalles",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "CERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        
      },
    ]

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,     
      codigo: 0,
      estado: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    console.log(this.expediente)

    setTimeout(() => {
      this.getExpedienteDetalles()
    }, 50);
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "CERRAR":
        this.modal.close()
        break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    // this.detallesExpediente();
  }

  getExpedienteDetalles() {
    this.msgSpinner = "Cargando detalles de Expediente"
    this.lcargando.ctlSpinner(true)
    this.apiService.getDetallesExpediente({expediente: this.expediente}).subscribe(
      (res: any) => {
        console.log(res.data)
        this.expediente = res.data
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.warning(err.error.message, 'Error cargando Detalles')
      }
    )
    
  }

  imprimir(liquidacion: any) {
    // window.open(`${environment.ReportingUrl}rep_rentas_generico.pdf&id_liquidacion=${liquidacion.id_liquidacion}&forma_pago=`)
    window.open(environment.ReportingUrl + "rep_rentas_generico_cobranzas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + liquidacion.id_liquidacion + "&forma_pago=", '_blank')
  }
}
