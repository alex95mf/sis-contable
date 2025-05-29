import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
// import { ReciboCobroService } from '../recibo-cobro.service';
import { ToastrService } from 'ngx-toastr';
import { CrucePagosService } from '../cruce-pagos.service';

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
    private apiSrv: CrucePagosService,
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

    // console.log(this.concepto);
    // this.detalles = this.concepto.detalles;
    // console.log(this.detalles);
    this.mensajeSpiner = "Cargando detalles...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_liquidacion: this.concepto.id_liquidacion,
    }

    this.apiSrv.getConceptosLiquidacion(data).subscribe(
      (res) => {
        console.log(res);
        this.detalles = res['data'];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

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
