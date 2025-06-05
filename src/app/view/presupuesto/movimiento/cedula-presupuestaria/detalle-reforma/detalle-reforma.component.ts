import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CedulaPresupuestariaService } from '../cedula-presupuestaria.service'; 
import * as myVarGlobals from 'src/app/global';
import { saturate } from '@amcharts/amcharts4/.internal/core/utils/Colors';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
standalone: false,
  selector: 'app-detalle-reforma',
  templateUrl: './detalle-reforma.component.html',
  styleUrls: ['./detalle-reforma.component.scss']
})
export class DetalleReformaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  botonera: any = [];
  
  fTitle = "Detalle Reformas";
  dataUser: any;
  permissions: any;
  partida:any;
  asignacionOriginal:any;
  asignacionCodificada:any;

  reforma: any = []
  
  @Input() data: any;
  @Input() periodo: any;
  constructor(    
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiSrv:CedulaPresupuestariaService) { }

  ngOnInit(): void {
    this.botonera = [
      { orig: "btnDetRef", paramAccion: "", boton: { icon: "fa fa-times", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
  ]

  this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
  console.log(this.data)
  this.partida = this.data['partida'];
  this.periodo = this.periodo;
  this.asignacionOriginal = this.data['asignacion_original'];
  this.asignacionCodificada = this.data['asignacion_codificada'];

  setTimeout(()=> {
    this.cargarDetalles();
  }, 50);
  }

 
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.cerrarModal();
        break;
    }
  }
  cerrarModal() {
    this.modal.dismiss();
  }

  cargarDetalles() {

    (this as any).mensajeSpinner = "Cargando detalles...";
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo,
      partida: this.partida,
      
    }

    this.apiSrv.cargarDetalles(data).subscribe(
      (res) => {
        console.log(res);
        if (res["status"] == 1) {
          this.reforma = res["data"]
          this.lcargando.ctlSpinner(false);
        } else {
          this.reforma = []
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
      
    
  }
 
  


}
