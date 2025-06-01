import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { IngresoBodegaService } from '../ingreso-bodega.service';
import * as moment from 'moment';

@Component({
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
  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  estadoList = [
    { value: "P", label: "Pendiente" },
    { value: "A", label: "Aprobado" },
    { value: "D", label: "Denegado" }
  ]
  estadoSelected = 0

  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicioSolicitud: IngresoBodegaService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: " CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnContribuyenteForm",
        paramAction: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
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

    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);

    this.filter = {
      razon_social: undefined,
      num_solicitud: undefined,
      estado: ['A','P','D'],
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
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
        case " CONSULTAR":
          this.cargarSolicitudes();
          break;
          case " LIMPIAR":
            this.limpiarFiltros;
            break;
    }
  }


  cargarSolicitudes(){
    this.mensajeSppiner = "Cargando lista de Solicitud...";
    this.lcargando.ctlSpinner(true);
    let data={
      id: this.proveedor.id_proveedor,
      tipo_proceso: this.tipo_proceso,
      params:{
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
    this.servicioSolicitud.getSolicitudModalProceso(data).subscribe(
      (res)=>{
        // console.log(res);
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
  asignarEstado(evt) {
    this.filter.estado = [evt]
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
      text: "¿Seguro que desea seleccionar esta solicitud? Los demás campos y cálculos realizados serán reiniciados.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        //this.commonVrs.seleciconSolicitud.next(data)
        this.servicioSolicitud.listaSolicitudes$.emit({data:data, tipo: 'COM'})


        
        this.activeModal.close()
      }
    });
    
  }
  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      num_solicitud: undefined,
      estado: ['A','P','D'],
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }
    this.estadoSelected = 0
  }

}
