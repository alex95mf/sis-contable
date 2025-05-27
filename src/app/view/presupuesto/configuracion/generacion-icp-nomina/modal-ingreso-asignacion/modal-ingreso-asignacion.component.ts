import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { format } from 'date-fns';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';

import { GeneracionIcpNominaService } from '../generacion-icp-nomina.service'; 

@Component({
  selector: 'app-modal-ingreso-asignacion',
  templateUrl: './modal-ingreso-asignacion.component.html',
  styleUrls: ['./modal-ingreso-asignacion.component.scss']
})
export class ModalIngresoAsignacionComponent implements OnInit {
  mensajeSppiner: string = "Cargnado...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  paginate: any;
  filter: any;

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;

  idpIngresos: any = [];

  vmButtons: any;

  @Input() periodo: any;

  constructor(
    private service: GeneracionIcpNominaService,
    private activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
  ) {
    
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnIngreso",
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
     partida: "",
     denominacion:"",
     filterControl: ""
    }
    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    setTimeout(() => {
      this.cargarIngresos()
    }, 500);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close();
        break;
    }
  }



  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarIngresos();
  }


  aplica(dt){
    console.log(dt);
    // dt.valor = 0;
     dt.id_cedula_presupuestaria = 0;
    this.commonVrs.modalAsignacionIngreso.next(dt);

  }

  
  
  cargarIngresos(flag: boolean = false){

    this.mensajeSppiner = "Cargando lista de asignacion ingreso...";
    this.lcargando.ctlSpinner(true);
    if (flag) this.paginate.page = 1
    let data = {
      periodo: this.periodo,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    //this.service.getAsignacionIngreso(data).subscribe(
    this.service.getCedulaPreEgreso(data).subscribe(
      (res)=>{

        this.paginate.length = res['data']['total'];
        console.log(res);
        res['data']['data'].forEach(e =>{
          Object.assign(e, {disponible: parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido), denominacion: e.catalogo_presupuesto.nombre});
        });
        if (res['data']['current_page'] == 1) {
          this.idpIngresos = res['data']['data'];
        }else{
          this.idpIngresos = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      }
    )
  }
  limpiarFiltros(){
    this.filter = {
      partida: "",
      denominacion:"",
      filterControl: ""
     }
   

    this.paginate= {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
  }

}
