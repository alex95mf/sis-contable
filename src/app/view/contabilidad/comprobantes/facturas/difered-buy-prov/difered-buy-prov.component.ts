import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
//import Swal from "sweetalert2";

import { ChangeDetectorRef } from '@angular/core';


import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';

@Component({
standalone: false,
  template: `


        <p-confirmPopup [styleClass]="mesaje_confirm"></p-confirmPopup>

        <div class="pt-3 pr-3 pl-3">
          <div class="row">
            <div class="col-sm-6">
              <button class="p-button-sm p-button-info"  (click)="ConfirmarRegistro($event)"  pButton type="button" label="Guardar" ></button>
            </div>
          </div>
        </div>


        <div class="p-3  pr-3 pl-3">
          <div class="row">
            <div class="col-sm-6">
                <div class="input-group input-group-sm mt-1">
                    <div class="input-group-prepend">
                        <span class="input-group-text size-span-campo" id="inputGroup-sizing-sm">Monto
                            total</span>
                    </div>
                    <input [(ngModel)]="dataDiferido.amount" type="number" class="form-control form-control-sm text-right pr-2" disabled >
                </div>
            </div>
            <div class="col-sm-6">
                <div class="input-group input-group-sm mt-1">
                    <div class="input-group-prepend">
                        <span class="input-group-text size-span-campo" id="inputGroup-sizing-sm">Número de
                            coutas</span>
                    </div>
                    <input placeholder="cuotas" type="text" class="form-control form-control-sm text-right pr-2"
                        id="idNumCoutas" [(ngModel)]="dataDiferido.cuotas" (keyup)="generateDues()"
                        type="number" maxlength="2" oninput="if(this.value.length > this.maxLength)
                        this.value = this.value.slice(0, this.maxLength);">
                </div>
            </div>
          </div>

        </div>

        <div class="pr-3 pl-3">
          <div class="row">
            <div class="col-sm-12">
              <hr>
            </div>
          </div>
        </div>

        <div id="tabla_xml"  class="pr-3 pl-3 mb-5">
          <div class="row">
            <div class="col-sm-12">
              <div class="col-12 filters p-0">
                <div class="justify-content-center">
                  <div  class="mb-2 content-tabla-general content-tabla_editable table_scroll_horizontal_over">
                    <table class="table">
                      <thead>
                          <tr>

                              <th class="text-center"># Cuota</th>
                              <th class="text-center">Fecha Pago</th>
                              <th class="text-center">Valor Cuota</th>

                          </tr>
                      </thead>
                      <tbody class="w-full">
                      <tr *ngFor="let d of arrCoutas;let i=index" style="width: 100%;">

                            <td scope="row" style="width: 15%;" class="text-center">{{d.Num_cuota}}</td>
                            <td style="width: 60%;">
                                <!--ejs-datepicker [(ngModel)]="d.fecha_vencimiento" name="dateFrom"
                                    format='yyyy-MM-dd'>
                                </ejs-datepicker-->
                                <p-calendar appendTo="body" (onSelect)="CambioFecha($event, i)"  dateFormat="dd/mm/yy"
                                    [readonlyInput]="true"  [(ngModel)]="d.fecha_vencimiento" >
                                </p-calendar>
                            </td>
                            <td style="width: 25%;">
                                <input type="text" min="0" class="text-right pr-2"
                                    (keypress)="commonServices.FormatDecimalVal($event)"
                                    [(ngModel)]="d.monto_cuota" (keyup)="calculatedQuotes(i)">
                            </td>

                          </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



    `,
  providers: [DialogService, MessageService]
})
export class DiferedBuyProvComponent implements AfterViewChecked {

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  @Input() diferedEdit: any;
  dataDiferido: any = { amount: 0, cuotas: 0 };
  arrCoutas: any = [];
  toDatePicker: Date = new Date();
  vmButtons: any;
  @Input() ammount: any;
  @Input() edit: any;
  ammountDiferedTotal = parseFloat('0');


  constructor(
    private commonServices: CommonService,
    public ref: DynamicDialogRef,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarServices: CommonVarService,
    private config: DynamicDialogConfig,
    private cdRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnComprasProv", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnComprasProv", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    if(this.config.data.diferedEdit !== null){

      this.dataDiferido.amount = this.config.data.diferedEdit.amount;
      this.dataDiferido.cuotas = this.config.data.diferedEdit.cuotas;

      this.config.data.diferedEdit.difered.forEach(element => {

        console.log(element);

        this.arrCoutas.push({

          Num_cuota: element.Num_cuota,
          fecha_vencimiento:new Date(element.fecha_vencimiento),
          monto_cuota:element.monto_cuota
        })


      });
      //this.arrCoutas = this.config.data.diferedEdit.difered;

    }else{
      this.dataDiferido.amount = this.config.data.ammount;
      this.dataDiferido.cuotas = 0;
      this.arrCoutas = [];
    }

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

  CambioFecha(evento, position) {


    const toDatePickerAux = evento;
    let contador = 0;

    let a: number = position + 1;

    while (a < this.arrCoutas.length) {
      console.log(this.arrCoutas[a]);
      this.arrCoutas[a].fecha_vencimiento = new Date(toDatePickerAux.setMonth(toDatePickerAux.getMonth() + 1));

      contador++;
      a++;
    }

    this.arrCoutas[position].fecha_vencimiento = new Date(toDatePickerAux.setMonth(toDatePickerAux.getMonth() - contador));

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

  calculatedQuotes(index) {
    let difCoutas = this.dataDiferido.amount / this.dataDiferido.cuotas;
    let val_ant_Aux = parseFloat('0');
    let val_nex_aux = parseFloat('0');
    let cont = 0;
    for (let i = 0; i < this.arrCoutas.length; i++) {
      if (i >= index) {
        if (i > index) {
          this.arrCoutas[i]['monto_cuota'] = val_nex_aux / (this.arrCoutas.length - cont);
          this.arrCoutas[i]['monto_cuota'] = this.arrCoutas[i]['monto_cuota'].toFixed(2);
        } else {
          cont = i + 1;
          val_nex_aux = (this.dataDiferido.amount - val_ant_Aux) - this.arrCoutas[i]['monto_cuota']
        }
      } else {
        this.arrCoutas[i]['monto_cuota'] = difCoutas.toFixed(2);
        val_ant_Aux = parseFloat(val_ant_Aux.toString()) + parseFloat(this.arrCoutas[i]['monto_cuota']);
      }
    }
  }

  ConfirmarRegistro(event) {
    this.confirmationService.confirm({
      target: event.target,
      message: "Al actualizar los montos o el valor de las cuotas las fechas de pago \n se modifican,es necesario que revise las fechas antes de guardarlo. \n Esta seguro de guardar la información ?",
      icon: "pi pi-question-circle",
      acceptLabel: "Confirmar",
      rejectLabel: "Cancelar",
      accept: () => {
        this.saveInformation();
      },
      reject: () => {

      }
    });
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
      ((this.ammountDiferedTotal.toFixed(2) !== this.ammount) && this.foo(this.ammount, this.ammountDiferedTotal.toFixed(2)) > 0.01) ? this.toastr.info("Monto total no coincide con el diferido de las cuotas") : this.confirmSave(data);
    }
  }

  foo(num1, num2) {
    let result = (num1 > num2) ? num1 - num2 : num2 - num1;
    return result;
  }

  async confirmSave(data) {
        this.ref.close(data);
  }
}
