import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from 'moment';
import { GeneracionIcpNominaService } from '../generacion-icp-nomina.service'; 
import { ToastrService } from 'ngx-toastr';
// import { OrdenService } from '../orden.service';

@Component({
standalone: false,
  selector: 'app-modal-cedula-presupuestaria',
  templateUrl: './modal-cedula-presupuestaria.component.html',
  styleUrls: ['./modal-cedula-presupuestaria.component.scss']
})
export class ModalCedulaPresupuestariaComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() proveedor: any;
  @Input() periodo: any;
  @Input() cedulaDetalle: any;

  solicitud:any = []
  cedula:any = []

  vmButtons: any = []

  filter: any;
  paginate: any;
  firstday: any;
  today: any;
  tomorrow: any;

  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private srvCedulaPre: GeneracionIcpNominaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {


    this.vmButtons = [
      {
        orig: "btnCedulaPre",
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
      partida: '',
      denominacion: '',
      filterControl: ""     }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(()=>{
      this.cargarCedulaPreGastos();
    },500)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close();
        break;
    }
  }


  cargarCedulaPreGastos(flag: boolean = false){
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    
    if (flag) this.paginate.page = 1;
    let data={
    
      periodo: this.periodo,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
    this.srvCedulaPre.getCedulaPreGastos(data).subscribe(
      (res: any)=>{
        this.paginate.length = res['data']['total'];
        console.log(res);
        res['data']['data'].forEach(e =>{
          Object.assign(e, {disponible: parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido), denominacion: e.catalogo_presupuesto.nombre});
        });
        if (res['data']['current_page'] == 1) {
          this.solicitud = res['data']['data'];
        }else{
          this.solicitud = Object.values(res['data']['data']);
        }
        this.solicitud.forEach((data) => {
          if (data['aplica'] == undefined) {
            data['aplica'] = false
          }else{
            data['aplica'] = data['aplica']
          }
         this.solicitud.forEach(e => {
          if(this.cedula.length > 0){
            this.cedula.forEach( c => {
              if (e.id_cedula_presupuestaria == c.id_cedula_presupuestaria){
                Object.assign(e, {aplica:true})
              }
            })
          }else{
              Object.assign(e, {aplica:false})
          }
         })
        })
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
    this.cargarCedulaPreGastos();
  }

  aplica(dt) {
    
    let aplica = dt.aplica;
    if (aplica) {

      Object.assign(dt, {
        aplica: true,
        id_cedula_presupuestaria: dt.id_cedula_presupuestaria,
        partida: dt.partida,
        denominacion: dt.denominacion,
        disponible: dt.disponible,
      })
    
      this.cedula.push(dt);
      this.srvCedulaPre.presupuestoSelected$.emit(dt)
      this.cargarCedulaPreGastos()
      
     // this.commonVrs.selectPago.next({dato: dt, val: ''});
    } 
    else{
      Object.assign(dt, {
        aplica: false,
        id_cedula_presupuestaria: dt.id_cedula_presupuestaria,
        partida: dt.partida,
        denominacion: dt.denominacion,
        disponible: dt.disponible,
      })
      this.cedula.forEach(c => {
        if(dt.id_cedula_presupuestaria==c.id_cedula_presupuestaria){
          // console.log(c);
          let id = this.cedula.indexOf(c);
          this.cedula.splice(id,1);
          // this.totalCobro = 0;
          this.srvCedulaPre.presupuestoSelected$.emit(dt)
          this.cargarCedulaPreGastos()
         
        }
      })
    }
    console.log(dt)
    
  }

  validarSelected(data){
    console.log(data);
    console.log(this.cedulaDetalle)
   let detallesCedula = false
   
    if(this.cedulaDetalle?.length > 0){
      console.log('aqui')
      this.cedulaDetalle.forEach(e => {
       if(e.id_cedula_presupuestaria == data.id_cedula_presupuestaria){
        detallesCedula = true
       }
      });
    } 
    console.log(detallesCedula)
    if(detallesCedula){
      this.toastr.info("Ya se ha seleccionado ese codigo de partida por favor escoja otro");
    }else{
      this.selectOption(data)
    }

  }



  selectOption(data) {
    
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea seleccionar esta partida?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
     
          this.srvCedulaPre.presupuestoSelected$.emit(data)
          this.activeModal.close()
        }
      } );
    
  }
  limpiarFiltros() {
    this.filter = {
      partida: '',
      denominacion: '',
      filterControl: "" 
    }
 
  }

}
