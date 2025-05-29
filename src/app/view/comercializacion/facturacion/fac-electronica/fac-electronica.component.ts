import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { CommonService } from '../../../../services/commonServices';
import { FacElectronicaService } from './fac-electronica.service';
import { TipoFacturaComponent } from './tipo-factura/tipo-factura.component';
import { TipoLiquidacionComponent } from './tipo-liquidacion/tipo-liquidacion.component';
import { TipoNcreditoComponent } from './tipo-ncredito/tipo-ncredito.component';
import { TipoRetencionComponent } from './tipo-retencion/tipo-retencion.component';

@Component({
standalone: false,
  selector: 'app-fac-electronica',
  templateUrl: './fac-electronica.component.html',
  styleUrls: ['./fac-electronica.component.scss']
})
export class FacElectronicaComponent implements OnInit {

  constructor(
    private commonServices: CommonService,
    private router: Router,
    private facElectronicaService: FacElectronicaService
  ) { }

  vmButtons: any = [];
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  listadoTabDinamic:any = [];
  dataEnviar:any = {};
  tipoPestana:any="01";

  @ViewChild (TipoFacturaComponent,{static:false}) tipoFacturaComponent:TipoFacturaComponent;
  @ViewChild (TipoLiquidacionComponent,{static:false}) tipoLiquidacionComponent:TipoLiquidacionComponent;
  @ViewChild (TipoNcreditoComponent,{static:false}) tipoNcreditoComponent:TipoNcreditoComponent;
  @ViewChild (TipoRetencionComponent,{static:false}) tipoRetencionComponent:TipoRetencionComponent;

  ngOnInit(): void {
    this.vmButtons = [//iconoxml
      { orig: "btnFacElt", paramAccion: "1", boton: { icon: "enviarSRI.png", texto: "GENERAR/FIRMAR/ENVIAR SRI" }, faFa:true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      // { orig: "btnFacElt", paramAccion: "1", boton: { icon: "firma.png", texto: "FIRMAR" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false},
      // { orig: "btnFacElt", paramAccion: "1", boton: { icon: "enviarSRI.png", texto: "ENVIAR SRI" }, faFa:true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnFacElt", paramAccion: "1", boton: { icon: "enviar_mail.png", texto: "ENVIAR EMAIL" }, faFa:true, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar btn-sm", habilitar: false, imprimir: false},
      { orig: "btnFacElt", paramAccion: "1", boton: { icon: "reprocesarSRI.png", texto: "REPROCESAR" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},
      { orig: "btnFacElt", paramAccion: "1", boton: { icon: "buscar.png", texto: "BUSCAR" }, faFa:true,  permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false}
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.obtenerTipoDocumento();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO": 
      
      break;
      case "BUSCAR": 
        let valor = {item: {tipo: this.tipoPestana} };
        this.buscarDocumentos(valor);
      break;
    }
  }

  obtenerTipoDocumento(){
    this.facElectronicaService.obtenerTipoDocumentos().subscribe((datos:any)=>{
      this.lcargando.ctlSpinner(false);
      this.listadoTabDinamic = [];
      datos.data.forEach((element, index) => {
        let tabs:any = {activeTab: (index==0?'active':''), classDin: "container-fluid tab-pane fade "+(index==0?'show active':''), item: element};
        this.listadoTabDinamic.push(tabs);
      });
      // this.listadoTabDinamic.push({activeTab: "", classDin: "container-fluid tab-pane fade ", item: {tipo: "99", nombre: "Todos"}, dataAll: datos.data });

      this.obtenerListadoSri();

    }, error=>{
      this.lcargando.ctlSpinner(false);
    })
  }

  obtenerListadoSri(){
    this.facElectronicaService.listadoEstadosSRI().then((datos:any)=>{
      
      this.dataEnviar.estadosSri = datos.data;
      
      setTimeout(() => {
        this.lcargando.ctlSpinner(false);
        this.enviarDatosComponentes();
      }, 100);
    }, error=>{
      this.lcargando.ctlSpinner(false);
    });
  }

  enviarDatosComponentes(){
    this.tipoFacturaComponent.setearValores(this.dataEnviar);
    this.tipoLiquidacionComponent.setearValores(this.dataEnviar);
    this.tipoNcreditoComponent.setearValores(this.dataEnviar);
    this.tipoRetencionComponent.setearValores(this.dataEnviar);
  }

  buscarDocumentos(valor){
    this.tipoPestana = valor.item.tipo;
    if(valor.item.tipo == '01'){
      this.tipoFacturaComponent.recargar();
    }else if(valor.item.tipo == '03'){
      this.tipoLiquidacionComponent.recargar();
    }else if(valor.item.tipo == '04'){
      this.tipoNcreditoComponent.recargar();
    }else if(valor.item.tipo == '07'){
      this.tipoRetencionComponent.recargar();
    }
    
  }

}
