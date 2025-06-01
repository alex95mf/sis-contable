import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ReciboCobroService } from '../recibo-cobro.service';
import { ToastrService } from 'ngx-toastr';

@Component({
standalone: false,
  selector: 'app-concepto-det',
  templateUrl: './concepto-det.component.html',
  styleUrls: ['./concepto-det.component.scss']
})
export class ConceptoDetComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent,{ static: false })
  lcargando: CcSpinerProcesarComponent;

  @Input() concepto: any;

  detalles: any = [];

  fTitle: any = 'Detalle de conceptos';
  vmButtons: any = [];
  dataUser: any;

  constructor(
    private modal: NgbActiveModal,
    private apiSrv: ReciboCobroService,
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

  getDetalles() {

     console.log(this.concepto);
    // this.detalles = this.concepto.detalles;
    // console.log(this.detalles);
    this.mensajeSpiner = "Cargando detalles...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_liquidacion: this.concepto.id_liquidacion,
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
          total: this.concepto.subtotal,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(-) Exoneraciones'
          },
          total: this.concepto.exoneraciones,
          comentario:'',
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: 'Subtotal - Exoneraciones'
          },
          total: this.concepto.subtotal_1,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) STA'
          },
          total: this.concepto.sta,
          comentario:'',
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: 'Subtotal + STA'
          },
          total: this.concepto.subtotal_2,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) Recargo'
          },
          total: this.concepto.recargo,
          comentario:'' ,
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) Coactiva'
          },
          total: this.concepto.coactiva,
          comentario:'' ,
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) Interés'
          },
          total: this.concepto.interes,
          comentario:'',
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(-) Descuento'
          },
          total: this.concepto.descuento,
          comentario:'',
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: 'Total'
          },
          total: this.concepto.total,
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
          total: this.concepto.subtotal,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(-) Exoneraciones'
          },
          total: this.concepto.exoneraciones,
          comentario:'',
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: 'Subtotal - Exoneraciones'
          },
          total: this.concepto.subtotal_1,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) STA'
          },
          total: this.concepto.sta,
          comentario:'',
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: 'Subtotal + STA'
          },
          total: this.concepto.subtotal_2,
          comentario:'' ,
          class: 'font-weight-bold'
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) Recargo'
          },
          total: this.concepto.recargo,
          comentario:'' ,
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) Coactiva'
          },
          total: this.concepto.coactiva,
          comentario:'' ,
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(+) Interés'
          },
          total: this.concepto.interes,
          comentario:'',
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: '(-) Descuento'
          },
          total: this.concepto.descuento,
          comentario:'',
          class: ''
        })
        this.detalles.push({
          concepto: {
            codigo_detalle: '',
            nombre_detalle: 'Total'
          },
          total: this.concepto.total,
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
    }else if(this.concepto.concepto?.codigo == 'EP' || this.concepto.concepto?.codigo == 'ML' || this.concepto.concepto?.codigo == 'AM' || this.concepto.concepto?.codigo == 'CAC'){
      this.apiSrv.getConceptosLiquidacionEp(data).subscribe(
        (res) => {
          console.log(res);
          this.detalles = res['data'];
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: 'Subtotal'
            },
            total: this.concepto.subtotal,
            comentario:'' ,
            class: 'font-weight-bold'
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(-) Exoneraciones'
            },
            total: this.concepto.exoneraciones,
            comentario:'',
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: 'Subtotal - Exoneraciones'
            },
            total: this.concepto.subtotal_1,
            comentario:'' ,
            class: 'font-weight-bold'
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(+) STA'
            },
            total: this.concepto.sta,
            comentario:'',
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: 'Subtotal + STA'
            },
            total: this.concepto.subtotal_2,
            comentario:'' ,
            class: 'font-weight-bold'
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(+) Recargo'
            },
            total: this.concepto.recargo,
            comentario:'' ,
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(+) Coactiva'
            },
            total: this.concepto.coactiva,
            comentario:'' ,
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(+) Interés'
            },
            total: this.concepto.interes,
            comentario:'',
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(-) Descuento'
            },
            total: this.concepto.descuento,
            comentario:'',
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: 'Total'
            },
            total: this.concepto.total,
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
    else{
      this.apiSrv.getConceptosLiquidacionTodas(data).subscribe(
        (res) => {
          console.log(res);
          this.detalles = res['data'];
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: 'Subtotal'
            },
            total: this.concepto.subtotal,
            comentario:'' ,
            class: 'font-weight-bold'
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(-) Exoneraciones'
            },
            total: this.concepto.exoneraciones,
            comentario:'',
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: 'Subtotal - Exoneraciones'
            },
            total: this.concepto.subtotal_1,
            comentario:'' ,
            class: 'font-weight-bold'
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(+) STA'
            },
            total: this.concepto.sta,
            comentario:'',
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: 'Subtotal + STA'
            },
            total: this.concepto.subtotal_2,
            comentario:'' ,
            class: 'font-weight-bold'
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(+) Recargo'
            },
            total: this.concepto.recargo,
            comentario:'' ,
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(+) Coactiva'
            },
            total: this.concepto.coactiva,
            comentario:'' ,
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(+) Interés'
            },
            total: this.concepto.interes,
            comentario:'',
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: '(-) Descuento'
            },
            total: this.concepto.descuento,
            comentario:'',
            class: ''
          })
          this.detalles.push({
            concepto: {
              codigo_detalle: '',
              nombre_detalle: 'Total'
            },
            total: this.concepto.total,
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
