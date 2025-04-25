import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-convenio',
  templateUrl: './modal-convenio.component.html',
  styleUrls: ['./modal-convenio.component.scss']
})
export class ModalConvenioComponent implements OnInit {

  @Input() detalles: any;

  amortizaciones: any = []

  vmButtons: any;

  constructor(
    private activeModal: NgbActiveModal
  ) { 
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.detalles);
      
      this.detalles.map((e)=>{
        if(e.codigo_concepto=="CU" || e.codigo_concepto=="COTE"){
          let amort = {
            num: e.num_cuota,
            pago_total: e.valor,
            pago_mensual: e.abono,
            interes: 0, //por ahora hasta que se involucre interes
            saldo_inicial: e.saldo_anterior,
            saldo_final: e.saldo_actual,
            plazo_maximo: e.fecha_plazo_maximo
          }
  
          this.amortizaciones.push(amort);
        }
        
      })
    }, 50);

    // this.amortizaciones = this.detalles['detalles'];

    this.vmButtons = [
      {
        orig: "btnsConvenio",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
    ]
  }


  closeModal() {
    this.activeModal.dismiss();
  }

}
