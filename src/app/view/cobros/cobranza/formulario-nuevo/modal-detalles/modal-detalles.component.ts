import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { FormularioNuevoService } from '../formulario-nuevo.service';
import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-modal-detalles',
  templateUrl: './modal-detalles.component.html',
  styleUrls: ['./modal-detalles.component.scss']
})
export class ModalDetallesComponent implements OnInit {
  @Input() liquidacion: any
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando..."
  ftitulo: any = "Detalles de Liquidación"
  vmButtons: any;

  data: any[] = []

  constructor(
    private commSrv: CommonVarService,
    private modal: NgbActiveModal,
    private toastr: ToastrService,
    private apiService: FormularioNuevoService,
  ) { 

    // this.commSrv.modalDetallesCobro.asObservable().subscribe(
    //   (res)=>{
    //     // console.log(res)
    //     this.ListaDetalle = res.detalles
    //     this.DetalleDeuda = res.deuda
    //   }
    // );

  }

  ngOnInit(): void {

    this.vmButtons = [

      {
        orig: "btnsDetalles",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        
      },
    ]

    setTimeout(() => {
      this.getDetallesLiquidacion(this.liquidacion.id_liquidacion)
    }, 75)
  }

  getDetallesLiquidacion(id_liquidacion: number) {
    (this as any).mensajeSpinner = 'Cargando Detalles de Liquidacion'
    this.lcargando.ctlSpinner(true);
    this.apiService.getLiquidacionDetalles({id_liquidacion: id_liquidacion}).subscribe(
      (res: any) => {
        console.log(res.data)
        // Si hay detalles de Liquidacion, usarlos
        if (res.data.detalles.length > 0) {
          res.data.detalles.forEach(e => {
            const obj = {
              id: e.id_liquidacion_detalle,
              concepto: { codigo: e.concepto?.codigo_detalle ?? e.arancel?.codigo ?? 'N/A', nombre: e.concepto?.nombre_detalle ?? e.arancel?.descripcion ?? 'N/A' },
              total: e.total
            }
            this.data.push(obj)
          })
        } 
        // De lo contrario, usar Deuda
        else if (res.data.deuda != null) {
          const { id_deuda, tipo_documento, numero_documento, valor } = res.data.deuda
          this.data.push({id: id_deuda, concepto: {codigo: tipo_documento, nombre: numero_documento}, total: valor})
        }
        // Si no hay nada, usar la misma cabecera
        else {
          const { id_liquidacion, concepto: { codigo, nombre }, total } = res.data
          this.data.push({id: id_liquidacion, concepto: {codigo: codigo, nombre: nombre}, total: total})
        }

        this.data.push({
          id: '',
          concepto: {
            codigo: '',
            nombre: 'Subtotal'
          },
          total: this.liquidacion.subtotal,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.data.push({
          id: '',
          concepto: {
            codigo: '',
            nombre: '(-) Exoneraciones'
          },
          total: this.liquidacion.exoneraciones,
          comentario:'',
          class: 'text-left' 
        })
        this.data.push({
          id:'',
          concepto: {
            codigo: '',
            nombre: 'Subtotal - Exoneraciones'
          },
          total: this.liquidacion.subtotal_1,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.data.push({
          id:'',
          concepto: {
            codigo: '',
            nombre: '(+) STA'
          },
          total: this.liquidacion.sta,
          comentario:'',
          class: 'text-left'
        })
        this.data.push({
          id:'',
          concepto: {
            codigo: '',
            nombre: 'Subtotal + STA'
          },
          total: this.liquidacion.subtotal_2,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.data.push({
          id:'',
          concepto: {
            codigo: '',
            nombre: '(+) Recargo'
          },
          total: this.liquidacion.recargo,
          comentario:'' ,
          class: 'text-left'
        })
        this.data.push({
          id:'',
          concepto: {
            codigo: '',
            nombre: '(+) Interés'
          },
          total: this.liquidacion.interes,
          comentario:'',
          class: 'text-left' 
        })
        this.data.push({
          id:'',
          concepto: {
            codigo: '',
            nombre: '(-) Descuento'
          },
          total: this.liquidacion.descuento,
          comentario:'',
          class: 'text-left' 
        })
        this.data.push({
          id:'',
          concepto: {
            codigo: '',
            nombre: 'Total'
          },
          total: this.liquidacion.total,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Detalles')
      }
    )
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "REGRESAR":
        this.modal.close()
        break;
    }
  }
}
