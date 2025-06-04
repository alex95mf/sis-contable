import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { RolGeneralEmplService } from '../rol-general-empl.service'; 
import { ToastrService } from 'ngx-toastr';

@Component({
standalone: false,
  selector: 'app-detalles-rol',
  templateUrl: './detalles-rol.component.html',
  styleUrls: ['./detalles-rol.component.scss']
})
export class DetallesRolComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent,{ static: false })
  lcargando: CcSpinerProcesarComponent;

  @Input() detalle: any;
  @Input() empleado: any;

  detallesIngresos: any = [];
  detallesEgresos: any = [];
  
  fTitle: any = 'Detalle de Rol';
  vmButtons: any = [];
  dataUser: any;

  constructor(
    private modal: NgbActiveModal,
    private apiSrv: RolGeneralEmplService,
    private toastr: ToastrService
  ) { 

  }

  ngOnInit(): void {
 
    this.vmButtons = [
      {
        orig: "btnDetRol",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    setTimeout(()=>{
      console.log(this.detalle)
      console.log(this.empleado)
      // JSON.parse(JSON.stringify(this.empleado));
      this.detallesIngresos = this.empleado.filter(e => e.id_catalogo_tipo_rubro == 'INGRESO' && e.valor > 0);
      this.detallesEgresos = this.empleado.filter(e => e.id_catalogo_tipo_rubro == 'EGRESO' && e.valor != 0);


      //this.getDetalles();
    },50)
    
  }
  totalIngresos(){
   
    let totalesIngresos = this.detallesIngresos.reduce((suma: number, x: any) => suma + parseFloat(x.valor), 0)
    return totalesIngresos;
  }
  totalEgresos(){
    let totalesEgresos = this.detallesEgresos.reduce((suma: number, x: any) => suma + parseFloat(x.valor), 0)
    return totalesEgresos;
  }

  totalGeneral(){
    let totalesIngresos = this.detallesIngresos.reduce((suma: number, x: any) => suma + parseFloat(x.valor), 0)
    let totalesEgresos = this.detallesEgresos.reduce((suma: number, x: any) => suma + parseFloat(x.valor), 0)
    return totalesIngresos - totalesEgresos;
  }
 

  
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }
  
  closeModal() {
    this.modal.dismiss();
  }

}
