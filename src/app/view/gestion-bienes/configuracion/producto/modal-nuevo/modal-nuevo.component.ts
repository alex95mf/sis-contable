import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ProductoService } from '../producto.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ThisReceiver } from '@angular/compiler/src/expression_parser/ast';
import { List } from '@amcharts/amcharts4/core';


@Component({
  selector: 'app-modal-nuevo',
  templateUrl: './modal-nuevo.component.html',
  styleUrls: ['./modal-nuevo.component.scss']
})
export class ModalNuevoComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";

  @ViewChild(CcSpinerProcesarComponent,{ static: false}) barra_carga: CcSpinerProcesarComponent;
  botonera: any =[];
  necesita_refrescar:any;
  cat_step: any = 1;
  @Input() dt:any;
  @Input() titulo:any;
  @Input() dato: any;

  no_documento: any
  proveedor: any
  observation:any
  estado:any
  fecha:any
  fecha_inicio:any
  fecha_fin:any
  numero_poliza_contrato:any
  valor_asegurado:any
  tipo_poliza:any
  nombre_cargo_recibido:any
  nombre_departamento_recibido:any
  nombre_persona_recibido:any
  nota:any
  traslado_por:any


  constructor(
    public modal: NgbActiveModal,
    private svrToStar: ToastrService,
    private commonService: CommonService,
    private srvLTur: ProductoService,
    private srvLTurV: CommonVarService,
    ) {


    }

  ngOnInit(): void {
    this.botonera = [

    {
        orig: "btnsFormLTuristicos",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
    }
    ];



    setTimeout (()=>{
    
      console.log(this.titulo)
      console.log(this.dt)
    },75)
    //this.cargarLCat

    if(this.titulo == 'mantenimiento' ){
      this.no_documento = this.dt.mantenimiento.num_documento
      this.proveedor = this.dt.mantenimiento.proveedor.razon_social
      this.observation = this.dt.mantenimiento.observaciones
      this.fecha = this.dt.mantenimiento.fecha
      this.estado = this.dt.mantenimiento.estado
    }else if( this.titulo == 'poliza'){
      this.no_documento = this.dt.poliza.num_documento
      this.proveedor = this.dt.poliza.proveedor.razon_social
      this.observation = this.dt.poliza.observaciones
      this.fecha = this.dt.poliza.fecha
      this.estado = this.dt.poliza.estado
      this.fecha_inicio = this.dt.poliza.fecha_inicio
      this.fecha_fin = this.dt.poliza.fecha_fin
      this.valor_asegurado = this.dt.poliza.valor_asegurado
      this.tipo_poliza = this.dt.poliza.tipo_poliza
      this.numero_poliza_contrato = this.dt.poliza.numero_poliza_contrato
    }else if(this.titulo=='traslado'){
      this.no_documento = this.dt.traslado.num_doc
      this.observation = this.dt.traslado.observaciones
      this.fecha = this.dt.traslado.fecha
      this.estado = this.dt.traslado.estado
      this.nombre_cargo_recibido=this.dt.traslado.nombre_cargo_custodio
      this.nombre_departamento_recibido = this.dt.traslado.nombre_departamento_custodio
      this.nombre_persona_recibido = this.dt.traslado.nombre_persona_custodio
      this.nota = this.dt.traslado.nota
      this.traslado_por = this.dt.traslado.traslado_por


    }


  }


  cerrarModal(){
    this.modal.close();
  }

  metodoGlobal(evento){
    switch(evento.items.boton.texto){
     
      case "REGRESAR":
        console.log("cerrar");
        this.cerrarModal();
        break;

    }
  }




 






 

}
