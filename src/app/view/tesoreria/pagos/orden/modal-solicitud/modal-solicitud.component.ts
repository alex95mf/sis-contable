import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { OrdenService } from '../orden.service';

@Component({
standalone: false,
  selector: 'app-modal-solicitud',
  templateUrl: './modal-solicitud.component.html',
  styleUrls: ['./modal-solicitud.component.scss']
})
export class ModalSolicitudComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() proveedor: any;
  @Input() tipo_proceso: any;

  solicitud:any = []

  vmButtons: any = []

  filter: any;
  paginate: any;

  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicioSolicitud: OrdenService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(()=>{
      this.cargarSolicitudes();
    },500)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close();
        break;
    }
  }


  cargarSolicitudes(){
    this.mensajeSppiner = "Cargando lista de Solicitud...";
    this.lcargando.ctlSpinner(true);
    console.log(this.tipo_proceso)
    let data={
      tipo_proceso: this.tipo_proceso,
      id: this.proveedor.id_proveedor,
      params:{
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
    this.servicioSolicitud.getSolicitudModalTipo(data).subscribe(
      (res)=>{
         console.log(res);
        this.paginate.length = res['data']['total']
        if(res['data']['current_page'] === 1){
          this.solicitud = res['data']['data'];
        }else{
          this.solicitud = Object.values(res['data']['data'])
        }

        this.lcargando.ctlSpinner(false);

      }
    )
    
  }
  


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarSolicitudes();
  }


  selectOption(data) {
    
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea seleccionar esta solicitud?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.commonVrs.seleciconSolicitud.next(data)
        this.activeModal.close()
      }
    });
    
  }

}
