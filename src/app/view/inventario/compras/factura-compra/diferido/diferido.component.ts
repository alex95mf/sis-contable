import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../../../../services/commonServices'
import { CommonVarService } from '../../../../../services/common-var.services'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
standalone: false,
  selector: 'app-diferido',
  templateUrl: './diferido.component.html',
  styleUrls: ['./diferido.component.scss']
})
export class DiferidoComponent implements OnInit {
  @Input() diferedEdit: any;
  dataDiferido: any = { amount: 0, cuotas: 0 };
  arrCoutas: any = [];
  toDatePicker: Date = new Date();
  vmButtons: any;
  @Input() ammount: any;
  @Input() edit:any;
  ammountDiferedTotal = parseFloat('0');
  

  constructor(
    private commonServices: CommonService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarServices: CommonVarService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnDiferedFacompra", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnDiferedFacompra", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
   
    /* if (this.diferedEdit != null && !this.edit) {
      this.dataDiferido.amount = this.diferedEdit.amount;
      this.dataDiferido.cuotas = this.diferedEdit.cuotas;
      this.arrCoutas = this.diferedEdit.difered;
    }else{ */
      this.dataDiferido.amount = this.ammount;
      this.dataDiferido.cuotas = 0;
      this.arrCoutas = [];
    //}
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "GUARDAR":
        this.saveInformation();
        break;
    }
  }

  /* actions modals */
  closeModal() {
    this.activeModal.dismiss();
  }


  generateDues() {
    let toDatePickerAux = new Date();
    this.arrCoutas = [];
    let difCoutas = this.dataDiferido.amount / this.dataDiferido.cuotas;
    for (let i = 0; i < this.dataDiferido.cuotas; i++) {
      let objCoutas = {};
      objCoutas['Num_cuota'] = i + 1;
      objCoutas['monto_cuota'] = difCoutas.toFixed(2);
      objCoutas['fecha_vencimiento'] = (i == 0) ? this.toDatePicker : new Date(toDatePickerAux.setMonth(toDatePickerAux.getMonth() + 1));
      this.arrCoutas.push(objCoutas);
    }
  }

  calculatedQuotes(index){
    let difCoutas = this.dataDiferido.amount / this.dataDiferido.cuotas;
    let val_ant_Aux = parseFloat('0');
    let val_nex_aux = parseFloat('0');
    let cont = 0;
    for (let i = 0; i < this.arrCoutas.length; i++) {
      if(i >= index){       
        if(i > index){
          this.arrCoutas[i]['monto_cuota'] = val_nex_aux / (this.arrCoutas.length - cont );
          this.arrCoutas[i]['monto_cuota'] = this.arrCoutas[i]['monto_cuota'].toFixed(2);
        }else{
          cont = i+1;
          val_nex_aux = (this.dataDiferido.amount - val_ant_Aux) - this.arrCoutas[i]['monto_cuota']
        }
      }else{
        this.arrCoutas[i]['monto_cuota'] = difCoutas.toFixed(2);
        val_ant_Aux = parseFloat(val_ant_Aux.toString())  +  parseFloat(this.arrCoutas[i]['monto_cuota']);
      }     
    }
  }

  saveInformation() {
    this.ammountDiferedTotal = parseFloat('0');
    if (this.dataDiferido.amount == undefined || this.dataDiferido.amount == "" || this.dataDiferido.amount <= 0 ||
      this.dataDiferido.cuotas == undefined || this.dataDiferido.cuotas == "" || this.dataDiferido.cuotas <= 0) {
      this.toastr.info("Monto ó numero de cuota inválido");
    } else {
      
      Object.keys(this.arrCoutas).forEach(key => {
        this.arrCoutas[key]['fecha_vencimiento'] = moment(this.arrCoutas[key]['fecha_vencimiento']).format('YYYY-MM-DD');
        this.ammountDiferedTotal = parseFloat(this.ammountDiferedTotal.toString()) + parseFloat(this.arrCoutas[key]['monto_cuota']);
      })
      let data = {
        amount: this.dataDiferido.amount,
        cuotas: this.dataDiferido.cuotas,
        difered: this.arrCoutas
      };
      ((this.ammountDiferedTotal.toFixed(2) !== this.ammount) && this.foo(this.ammount, this.ammountDiferedTotal.toFixed(2)) > 0.01 ) ? this.toastr.info("Monto total no coincide con el diferido de las cuotas") : this.confirmSave(data);   
    }
  }

 foo(num1, num2){ 
   let result =  (num1 > num2 ) ?  num1-num2  :  num2-num1  ;
   return result;
 } 

  async confirmSave(data) {
    Swal.fire({
      title: "Atención!!",
      text: "Al actualizar los montos o el valor de las cuotas las fechas de pago se modifican,es necesario que revise las fechas antes de guardarlo. Esta seguro de guardar la información ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Guardar",
      cancelButtonText: "Revisar"
    }).then((result) => {
      if (result.value) {
        this.commonVarServices.listenDifered.next(data);
        this.closeModal();
      }
    })
  }
}
