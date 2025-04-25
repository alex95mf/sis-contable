import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { AprobacionService } from '../aprobacion.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import moment from 'moment';

@Component({
  selector: 'app-denegacion-compra-publica',
  templateUrl: './denegacion-compra-publica.component.html',
  styleUrls: ['./denegacion-compra-publica.component.scss']
})
export class DenegacionCompraPublicaComponent implements OnInit {

  Observaciones: any;
  vmButtons: any;

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";

  @Input() item: any;

  constructor(
    public activeModal: NgbActiveModal,
    private service: AprobacionService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private cierremesService: CierreMesService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsDenegacion", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsDenegacion", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ]

    setTimeout(()=>{
      // console.log(this.item['observacion']);
      console.log(this.item);
      this.item['observacion'] == null ? this.Observaciones = this.item['observacion'] : this.Observaciones = undefined
    })
  }
  metodoGlobal(event: any){
    switch(event.items.boton.texto){
      
      case "Guardar":
        this.validacion();
        break;
      case "Regresar":
        this.activeModal.close()
        break;
    }
  }

  validacion(){
    if(this.Observaciones == undefined || this.Observaciones == null){
      this.toastr.info('Debe ingresar la observacion')
    }else{

      this.mensajeSppiner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);
      
      let data = {
        "anio": Number(moment().format('YYYY')),
        "mes": Number(moment().format('MM'))
      }
        this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
        
        /* Validamos si el periodo se encuentra aperturado */
        if (res["data"][0].estado !== 'C') {
    
          this.guardarDenegacion()
    
        } else {
          this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
          this.lcargando.ctlSpinner(false);
        }
    
        }, error => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.mesagge);
        })
      
    }
  }

  guardarDenegacion(){
    console.log('Guardado');

    this.mensajeSppiner = "Guardando...";    
    this.lcargando.ctlSpinner(true);

    let data = {id: this.item['id_solicitud'],observacion: this.Observaciones, estado: 'D', Detalles: this.item['detalles']}

    console.log(data);
    this.service.saveAprobacion(data).subscribe((res)=>{
      console.log(res);
      this.activeModal.close()
      this.commonVrs.guardarAprobacion.next()
      this.lcargando.ctlSpinner(false);
    })
  }

}
