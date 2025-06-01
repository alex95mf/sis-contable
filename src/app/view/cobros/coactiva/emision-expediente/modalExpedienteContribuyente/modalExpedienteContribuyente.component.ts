import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmisionExpedienteService } from '../emision-expediente.service';




@Component({
standalone: false,
  selector: 'app-modal-nuevoJuicio',
  templateUrl: './modalExpedienteContribuyente.component.html',
  styleUrls: ['./modalExpedienteContribuyente.component.scss']
})
export class ModalExpedienteContribuyenteComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  paginate: any;
  vmButtons: any = [];
  lotes: any = {};
  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private emexsrv:EmisionExpedienteService
  ) {

   
   }

  ngOnInit(): void {

    this.vmButtons = [
      { 
        orig: "btnModalConceptos", 
        paramAccion: "", 
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false }
    ];


    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };



    setTimeout(() => {
      this.cargarLotes();
    }, 0);

    
    this.lotes = {
      id_cob_notificacion:0,
      fecha: "",
      lote: "",
    }

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.cerrarModal();
        break;
    }
  }

  cerrarModal() {
    this.modal.dismiss();
  }

  aplicarFiltros() {
    this.paginate.page = 1;
    this.cargarLotes();
  }
  cargarLotes() {
    this.mensajeSppiner = "Cargando lista de Contribuyentes...";
    this.lcargando.ctlSpinner(true);
    this.emexsrv.getLoteNotificacion().subscribe(res => {

        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.lotes = []
            } else {
            this.lotes = Object.values(res['data']);
            res['data'].forEach(e => {
              Object.assign(e, {id_cob_notificacion: e.id_cob_notificacion , fecha: e.fecha, lote: e.lote});
            })
            }
            console.log(this.lotes);        

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }



  


  
  
}
