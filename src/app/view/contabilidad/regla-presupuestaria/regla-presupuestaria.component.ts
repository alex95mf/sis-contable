import { Component, OnInit,ViewChild } from '@angular/core';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SueldoNuevoComponent } from './grupo-nuevo/sueldo-nuevo.component';

import {ReglaPresupuestariaService} from './regla-presupuestaria.service'
@Component({
  selector: 'app-regla-presupuestaria',
  templateUrl: './regla-presupuestaria.component.html',
  styleUrls: ['./regla-presupuestaria.component.scss']
})
export class ReglaPresupuestariaComponent implements OnInit {
  fTitle: string = 'Regla Presupuestaria'
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  vmButtons: any;
  reglas:any;
  paginate: any;
  filter: any;
  estadoList = [
    { valor: 'A', descripcion: 'ACTIVO' },
    { valor: 'I', descripcion: 'INACTIVO' },
  ]
  constructor(private modal:NgbModal,private apiSrv: ReglaPresupuestariaService) {  this.filter = {
    grupo_ocupacional: 0,
    codigo_sectorial: '',
    remuneracion: '',
    cargo: 0,
    tipo_contrato: 0,
    estado: "",
    filterControl: ""
  }

  this.paginate = {
    length: 0,
    perPage: 10,
    page: 1,
    pageSizeOptions: [5, 10]
  }}

  ngOnInit(): void {
    this.initializeButtons();
    
    setTimeout(() => {
    this.cargaInicial();
      //this.lcargando.ctlSpinner(false)
    }, 250)
  }


  initializeButtons(){
    this.vmButtons = [
      { orig: "btnsConceptos", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fas fa-floppy-o", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-sm btn-info",
        habilitar: false,
      },
    ];
  }


cargaInicial(){
  this.loadReglas();
}


loadReglas(flag: boolean = false){
  this.lcargando.ctlSpinner(true)
    if (flag) this.paginate.page = 1
  let data = {
    params: {
      filter: this.filter,
      paginate: this.paginate
    }
  }
  this.apiSrv.getReglas(data).subscribe(
    res => {
      console.log(res)
      if (res['data'].length == 0) {
        console.log("LENG0")
        this.reglas = []
      } else {

        this.reglas = res['data']['data'];

this.reglas.forEach(element => {
  if (element.codigo_presupuesto_gasto != null && element.codigo_presupuesto_gasto!= null)  
    element.codigo_presupuesto_gasto = element.codigo_presupuesto_gasto + ". " + (element.nombre_codigo_presupuesto_gasto ? element.nombre_codigo_presupuesto_gasto : "");

if (element.codigo_presupuesto_ingreso != null  && element.codigo_presupuesto_ingreso!= null)  
    element.codigo_presupuesto_ingreso = element.codigo_presupuesto_ingreso + ". " + (element.nombre_codigo_presupuesto_ingreso ? element.nombre_codigo_presupuesto_ingreso : "");

if (element.cuenta_contable != null  && element.cuenta_contable!= null)  
    element.cuenta_contable = element.cuenta_contable + ". " + (element.nombre_cuenta_contable ? element.nombre_cuenta_contable : "");

if (element.cuenta_contable_cobro != null  && element.cuenta_contable_cobro!= null)  
    element.cuenta_contable_cobro = element.cuenta_contable_cobro + ". " + (element.nombre_cuenta_contable_cobro ? element.nombre_cuenta_contable_cobro : "");

if (element.cuenta_contable_pago != null  && element.cuenta_contable_pago!= null)  
    element.cuenta_contable_pago = element.cuenta_contable_pago + ". " + (element.nombre_cuenta_contable_pago ? element.nombre_cuenta_contable_pago : "");
});


        this.paginate.length = res['data']['total'];
        console.log(" this.reglas", this.reglas)
      }
      this.lcargando.ctlSpinner(false)
    }
    ,
    (error) => {
      console.log(error)
     this.lcargando.ctlSpinner(false)
      // this.toastr.info(error.error.message);
    }
  );
}




  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
       this.nuevaReglaPresupuestaria(true, {});
        break;
      case "CONSULTAR":
        this.loadReglas(true);
       // this.LoadGruposOcupacionales(true);
        break;
      case "CANCELAR":
        break;
    }
  }


  nuevaReglaPresupuestaria(isNew: boolean, data?: any) {
    const modalInvoice = this.modal.open(SueldoNuevoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.isNew = isNew;
    modalInvoice.componentInstance.data = data;
    modalInvoice.result.then(
     
      // Función a ejecutar cuando el modal se cierra
      (result) => {
        if (result == "actualizar") {
          this.loadReglas(false);
         // this.LoadGruposOcupacionales(false);
        }
      },
      (reason) => {
        if (reason == "actualizar") {
          this.loadReglas(false);
         // this.LoadGruposOcupacionales(false);
        }
      }
    );
  }

  updateRegla(isNew: boolean, data?: any) {
    const modalInvoice = this.modal.open(SueldoNuevoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.isNew = isNew;
    modalInvoice.componentInstance.data = data;
    modalInvoice.result.then(
     
      // Función a ejecutar cuando el modal se cierra
      (result) => {
        if (result == "actualizar") {
          this.loadReglas(false);
         // this.LoadGruposOcupacionales(false);
        }
      },
      (reason) => {
        if (reason == "actualizar") {
          this.loadReglas(false);
         // this.LoadGruposOcupacionales(false);
        }
      }
    );
  }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.loadReglas();
  }


}
