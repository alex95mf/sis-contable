import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContribuyenteService } from '../contribuyente.service'; 
import * as myVarGlobals from 'src/app/global';
import { saturate } from '@amcharts/amcharts4/.internal/core/utils/Colors';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
standalone: false,
  selector: 'app-detalle-intereses',
  templateUrl: './detalle-intereses.component.html',
  styleUrls: ['./detalle-intereses.component.scss']
})
export class DetalleInteresesComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  botonera: any = [];
  
  fTitle = "Detalle Intereses";
  dataUser: any;
  permissions: any;
  id_liquidacion: any
  id_deuda: any
  totalIntereses: any

  intereses: any = []

  arrayMes: any =
  [
    {id: 1, name: "Enero"},
    {id: 2,name: "Febrero" },
    {id: 3,name: "Marzo"},
    {id: 4,name: "Abril"},
    {id: 5,name: "Mayo"},
    {id: 6,name: "Junio"},
    {id: 7, name: "Julio"},
    {id: 8,name: "Agosto"},
    {id: 9,name: "Septiembre"},
    {id: 10,name: "Octubre"},
    {id: 11,name: "Noviembre"},
    {id: 12,name: "Diciembre"},
  ];
  
  @Input() data: any;

  constructor(    
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiSrv:ContribuyenteService) { }

  ngOnInit(): void {
    this.botonera = [
      { orig: "btnDetRef", paramAccion: "", boton: { icon: "fa fa-times", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
  ]

  this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
  console.log(this.data);
  if(this.data['liquidacion']!= null){
    this.id_liquidacion = this.data['liquidacion']['id_liquidacion'];
  }else{
    this.id_liquidacion = null
  }
  this.id_deuda = this.data['id_deuda'];
  console.log(this.id_liquidacion)
  //this.totalIntereses = this.data['interes']


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

    // if(this.id_liquidacion){

    // }

    let data = {
      id_liquidacion: this.id_liquidacion,
    }

    this.apiSrv.cargarDetallesIntereses(data).subscribe(
      (res) => {
        console.log(res);
        let totalIntereses = 0
        res['data'].forEach(e => {
          Object.assign(e ,{mes: this.arrayMes.filter(f => f.id == e.mes)[0].name})
          totalIntereses += +e.valor
        })
        this.totalIntereses = totalIntereses
        if (res["status"] == 1) {
          this.intereses = res["data"]
          this.lcargando.ctlSpinner(false);
        } else {
          this.intereses = [];
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
