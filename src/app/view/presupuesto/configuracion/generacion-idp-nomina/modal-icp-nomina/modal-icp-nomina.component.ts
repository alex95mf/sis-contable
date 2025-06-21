import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from 'moment';
import { GeneracionIdpNominaService } from '../generacion-idp-nomina.service'; 
// import { OrdenService } from '../orden.service';

@Component({
standalone: false,
  selector: 'app-modal-icp-nomina',
  templateUrl: './modal-icp-nomina.component.html',
  styleUrls: ['./modal-icp-nomina.component.scss']
})
export class ModalIcpNominaComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() proveedor: any;
  @Input() periodo: any;

  solicitud:any = []

  vmButtons: any = []

  filter: any;
  paginate: any;
  firstday: any;
  today: any;
  tomorrow: any;

  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicio: GeneracionIdpNominaService
  ) { }

  ngOnInit(): void {


    this.vmButtons = [
      {
        orig: "btnIcpModal",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);

    this.filter = {
      razon_social: undefined,
      documento: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""     }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(()=>{
      this.cargarIcpNomina();
    },500)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close();
        break;
    }
  }


  cargarIcpNomina(flag: boolean = false){
    (this as any).mensajeSpinner = "Cargando Icp de Nómina...";
    this.lcargando.ctlSpinner(true);
    
    if (flag) this.paginate.page = 1;
    let data={
      // id: this.proveedor.id_proveedor,
      params:{
        filter: this.filter,
        paginate: this.paginate,
        periodo: this.periodo,
        codigo: "ICP"
      }
    }
    console.log(data);
    this.servicio.getIcpNominaModal(data).subscribe(
      (res: any)=>{
        console.log(res)
        this.lcargando.ctlSpinner(false);
        // console.log(res);
        this.paginate.length = res.data.total
        this.solicitud = res.data.data
        /* if(res['data']['current_page'] === 1){
          this.solicitud = res['data']['data'];
        }else{
          this.solicitud = Object.values(res['data']['data'])
        } */

       

      }
    )
    
  }
  


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarIcpNomina();
  }


  selectOption(data) {
    
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea seleccionar este ICP?",
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
  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      num_solicitud: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    }
 
  }

}
