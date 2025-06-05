import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ConsultaDirectorioService } from '../consulta-directorio.service';

import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
@Component({
standalone: false,
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.scss']
})
export class DetallePrestamoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  
  listaSolicitudes: any = []


  resultadoConsulta:any;
  asigna: any =[]
infprestamo:any;
  proceso: any = []

  vmButtons: any;

  detalles: any = {
    programa: null,
    departamento: null,
    atribucion: null,
    asigna: null,
    proceso: null
  }

  /* @Input() item: any; */
  @Input() opcion: any;
  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private service: ConsultaDirectorioService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fa fa-print", texto: "Imprimir" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false}
      
    ]
  /*   this.infprestamo=this.item;
    this.resultadoConsulta=this.item['detalleprestamo']; */

/* 
    this.resultadoConsulta.forEach(item => {
      // Agregamos la clave check con el valor false a cada objeto
      item['check'] = item.estado_prestamo === 'D';
  }); */

    setTimeout(() => {
    /*   console.log(this.item);
      this.listaSolicitudes = this.item['detalles'] */
      // this.detalles.programa = this.item['catalogo_programa']['valor']
      // this.detalles.departamento = this.item['catalogo_departamento']['valor']
      // this.detalles.atribucion = this.item['catalogo']['valor']
      // this.detalles.proceso = this.item['tipo_proceso']
    /*   this.commonVrs.contribAnexoLoad.next({ id_cliente: this.item.id_solicitud, condi: 'dis' }) */
    }, 50);

    

  }

  metodoGlobal(event: any){
    switch(event.items.boton.texto){
      
      
      
      case "Guardar":
       /*  this.saveBodega()  */
        break;
      case "Regresar":
        this.activeModal.close()
        break;
      case "Imprimir":
      /*   this.imprimirReporte() */
        break;
    }
  }

// En tu componente TypeScript
changeValueCheck(dato: any) {
  // Cambiar el estado del préstamo
  dato.estado_prestamo = dato.estado_prestamo === 'D' ? 'P' : 'D';
  this.updateEstadoPrestamo();
}

updateEstadoPrestamo() {/* 
  this.infprestamo.estado_prestamo = this.resultadoConsulta.every(item => item.estado_prestamo === 'D') ? 'D' : 'P'; */
}
/* 
saveBodega() {
 
  this.lcargando.ctlSpinner(true); 
  const elementosCheckTrue = this.resultadoConsulta; 
  let data = {...this.infprestamo,detalle:elementosCheckTrue}; 
  console.log(data);
  this.service.saveReservasDigUpda(data).subscribe(res => {
  
  let rs = res['data'];
   this.infprestamo.devolucion = rs.devolucion;
    this.toastr.success(res['message']);
    this.activeModal.close(res);
    this.lcargando.ctlSpinner(false);
  }, error => {
  
    this.toastr.info(error.error.message);
  })
}
 */
 /*  imprimirReporte(){
    window.open(environment.ReportingUrl + "rpt_dig_documento_prestamo.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_prestamo=" + this.infprestamo.id_prestamo, '_blank')
  } */

}
