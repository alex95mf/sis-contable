import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { EstadoCuentaService } from '../estado-cuenta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
standalone: false,
  selector: 'app-concepto-det',
  templateUrl: './concepto-det.component.html',
  styleUrls: ['./concepto-det.component.scss']
})
export class ConceptoDetComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent,{ static: false })
  lcargando: CcSpinerProcesarComponent;

  @Input() concepto: any;

  detalles: any = [];
  
  fTitle: any = 'Detalle de conceptos';
  vmButtons: any = [];
  dataUser: any;

  constructor(
    private modal: NgbActiveModal,
    private apiSrv: EstadoCuentaService,
    private toastr: ToastrService
  ) { 

  }

  ngOnInit(): void {
 
    this.vmButtons = [
      {
        orig: "btnDetConcepto",
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
      console.log(this.concepto)
      this.getDetalles();
    },50)
    
  }

  // getDetalles() {

  //   // console.log(this.concepto);
  //   // this.detalles = this.concepto.detalles;
  //   // console.log(this.detalles);
  //   this.mensajeSpinner = "Cargando detalles...";
  //   this.lcargando.ctlSpinner(true);

  //   let data = {
  //     id_liquidacion: this.concepto.fk_documento,
  //   }

  //   this.apiSrv.getConceptosLiquidacion(data).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.detalles = res['data'];
  //       this.lcargando.ctlSpinner(false);
  //     },
  //     (error) => {
  //       this.lcargando.ctlSpinner(false);
  //       this.toastr.info(error.error.message);
  //     }
  //   );

  // }
  getDetalles() {

    console.log(this.concepto);
   // this.detalles = this.concepto.detalles;
   // console.log(this.detalles);
   this.mensajeSpinner = "Cargando detalles...";
   this.lcargando.ctlSpinner(true);

   let data = {
     id_liquidacion: this.concepto.fk_documento,
   }
   if(this.concepto.tipo_documento == 'RP' ){
     this.apiSrv.getConceptosLiquidacionRp(data).subscribe(
       (res) => {
       console.log(res)
       res['data'].forEach(e => {
         if(e.arancel!=null){
           Object.assign(e, {
             concepto: {
               codigo_detalle: e.arancel?.codigo,
               nombre_detalle: e.arancel?.descripcion
             },
              comentario:'',
              total:e.total ,
              class: ''
             })
         }
       });  
       this.detalles = res['data'];
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: 'Subtotal'
         },
         total: this.concepto.liquidacion.subtotal,
         comentario:'' ,
         class: 'font-weight-bold'
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(-) Exoneraciones'
         },
         total: this.concepto.liquidacion.exoneraciones,
         comentario:'',
         class: '' 
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: 'Subtotal - Exoneraciones'
         },
         total: this.concepto.liquidacion.subtotal_1,
         comentario:'' ,
         class: 'font-weight-bold'
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(+) STA'
         },
         total: this.concepto.liquidacion.sta,
         comentario:'',
         class: ''
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: 'Subtotal + STA'
         },
         total: this.concepto.liquidacion.subtotal_2,
         comentario:'' ,
         class: 'font-weight-bold'
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(+) Recargo'
         },
         total: this.concepto.liquidacion.recargo,
         comentario:'' ,
         class: ''
       })
       this.detalles.push({
        concepto: {
          codigo_detalle: '',
          nombre_detalle: '(+) Coactiva'
        },
        total: this.concepto.liquidacion.coactiva,
        comentario:'' ,
        class: ''
      })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(+) Interés'
         },
         total: this.concepto.liquidacion.interes,
         comentario:'',
         class: '' 
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(-) Descuento'
         },
         total: this.concepto.liquidacion.descuento,
         comentario:'',
         class: '' 
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: 'Total'
         },
         total: this.concepto.liquidacion.total,
         comentario:'' ,
         class: 'font-weight-bold'
       })
       this.lcargando.ctlSpinner(false);
       },
       (error) => {
         this.lcargando.ctlSpinner(false);
         this.toastr.info(error.error.message);
       }
     )
   }else if(this.concepto.tipo_documento == 'TA'){
     this.apiSrv.getConceptosLiquidacionTa(data).subscribe(
       (res) => {
       console.log(res)
       res['data'].forEach(e => {
         if(e.tasas!=null){
           Object.assign(e, {
             concepto: {
               codigo_detalle: e.tasas?.codigo,
               nombre_detalle: e.tasas?.descripcion
             },
              comentario:'',
              total:e.total ,
              class: ''
             })
         }
       });  
       this.detalles = res['data'];
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: 'Subtotal'
         },
         total: this.concepto.liquidacion.subtotal,
         comentario:'' ,
         class: 'font-weight-bold'
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(-) Exoneraciones'
         },
         total: this.concepto.liquidacion.exoneraciones,
         comentario:'',
         class: '' 
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: 'Subtotal - Exoneraciones'
         },
         total: this.concepto.liquidacion.subtotal_1,
         comentario:'' ,
         class: 'font-weight-bold'
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(+) STA'
         },
         total: this.concepto.liquidacion.sta,
         comentario:'',
         class: ''
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: 'Subtotal + STA'
         },
         total: this.concepto.liquidacion.subtotal_2,
         comentario:'' ,
         class: 'font-weight-bold'
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(+) Recargo'
         },
         total: this.concepto.liquidacion.recargo,
         comentario:'' ,
         class: ''
       })
       this.detalles.push({
        concepto: {
          codigo_detalle: '',
          nombre_detalle: '(+) Coactiva'
        },
        total: this.concepto.liquidacion.coactiva,
        comentario:'' ,
        class: ''
      })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(+) Interés'
         },
         total: this.concepto.liquidacion.interes,
         comentario:'',
         class: '' 
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: '(-) Descuento'
         },
         total: this.concepto.liquidacion.descuento,
         comentario:'',
         class: '' 
       })
       this.detalles.push({
         concepto: {
           codigo_detalle: '',
           nombre_detalle: 'Total'
         },
         total: this.concepto.liquidacion.total,
         comentario:'' ,
         class: 'font-weight-bold'
       })
       this.lcargando.ctlSpinner(false);
       },
       (error) => {
         this.lcargando.ctlSpinner(false);
         this.toastr.info(error.error.message);
       }
     )
   }
   else{
     this.apiSrv.getConceptosLiquidacionTodas(data).subscribe(
       (res) => {
         console.log(res);
         console.log(this.concepto.liquidacion.subtotal);
    
         this.detalles = res['data'];
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: 'Subtotal'
           },
           total: this.concepto.liquidacion.subtotal,
           comentario:'' ,
           class: 'font-weight-bold'
         })
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: '(-) Exoneraciones'
           },
           total: this.concepto.liquidacion.exoneraciones,
           comentario:'',
           class: '' 
         })
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: 'Subtotal - Exoneraciones'
           },
           total: this.concepto.liquidacion.subtotal_1,
           comentario:'' ,
           class: 'font-weight-bold'
         })
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: '(+) STA'
           },
           total: this.concepto.liquidacion.sta,
           comentario:'',
           class: ''
         })
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: 'Subtotal + STA'
           },
           total: this.concepto.liquidacion.subtotal_2,
           comentario:'' ,
           class: 'font-weight-bold'
         })
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: '(+) Recargo'
           },
           total: this.concepto.liquidacion.recargo,
           comentario:'' ,
           class: ''
         })
         this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) Coactiva'
          },
          total: this.concepto.liquidacion.coactiva,
          comentario:'' ,
          class: ''
        })
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: '(+) Interés'
           },
           total: this.concepto.liquidacion.interes,
           comentario:'',
           class: '' 
         })
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: '(-) Descuento'
           },
           total: this.concepto.liquidacion.descuento,
           comentario:'',
           class: '' 
         })
         this.detalles.push({
           concepto: {
             codigo_detalle: '',
             nombre_detalle: 'Total'
           },
           total: this.concepto.liquidacion.total,
           comentario:'' ,
           class: 'font-weight-bold'
         })
         this.lcargando.ctlSpinner(false);
       },
       (error) => {
         this.lcargando.ctlSpinner(false);
         this.toastr.info(error.error.message);
       }
     );
   }
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
