import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CierreGeneralService } from '../cierre-general.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-modal-reporte-caja',
  templateUrl: './modal-reporte-caja.component.html',
  styleUrls: ['./modal-reporte-caja.component.scss']
})
export class ModalReporteCajaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @Input() caja: any;
  @Input() fecha: string;
  vmButtons: Botonera[] = []
  mensajeSpinner: string = "Cargando...";

  tbl_data: any[] = []
  totales: any = {
    recaudacion: 0,
    efectivo: 0,
    cheque: 0,
    t_credito: 0,
    transferencia: 0,
    t_debito: 0,
    garantia: 0,
    favor: 0,
    n_debito: 0,
    deposito: 0,
    otros: 0,
  }

  constructor(
    private toastr: ToastrService,
    private apiService: CierreGeneralService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      { orig: 'btnsModalReporteCaja', paramAccion: '', boton: {icon: 'fas fa-window-close', texto: 'CERRAR'}, clase: 'btn btn-sm btn-danger', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false }
    ]
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true);
      await this.getRecibosCajaDia()
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CERRAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  async getRecibosCajaDia() {
    try {
      (this as any).mensajeSpinner = 'Cargando datos de Caja'
      const response = await this.apiService.getRecibosByDia({id_caja: this.caja.id_caja, fecha: this.fecha}) as any
      console.log(response)
      this.tbl_data = response.data
      this.calcDocumentos()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Reporte de Caja')
    }
  }

  calcDocumentos() {

    let total = 0;
    let totalEF = 0;
    let totalCH = 0;
    let totalTC = 0;
    let totalTD = 0;
    let totalGA = 0;
    let totalVF = 0;
    let totalND = 0;
    let totalDE = 0;
    let totalTR = 0;
    let totalOtro = 0;


    this.tbl_data.forEach(r => {
      let r_totalEF = 0; //EFECTIVO
      let r_totalCH = 0; //CHEQUE
      let r_totalTC = 0; //TARJETA CREDITO
      let r_totalTR = 0; //TRANSFERENCIA
      let r_totalTD = 0; //TARJETA DEBITO
      let r_totalGA = 0; //GARANTIA
      let r_totalVF = 0; //VALOR A FAVOR
      let r_totalND = 0; //NOTA DE DEBITO
      let r_totalDE = 0; //DEPOSITO
      let r_totalOtro = 0; //OTRAS FORMAS DE PAGO


      r.formas_pago.forEach(f => {
        if(f.estado!='X'){
          if(f.tipo_pago=="EFECTIVO"){
            r_totalEF += +f.valor;
          }else if(f.tipo_pago=="CHEQUE"){
            r_totalCH += +f.valor;
          }else if(f.tipo_pago=="TARJETA"){
            r_totalTC += +f.valor;
          }else if(f.tipo_pago=="TRANSFERENCIA"){
            r_totalTR += +f.valor;
          }else if(f.tipo_pago=="DEBITO"){
            r_totalTD += +f.valor;
          }else if(f.tipo_pago=="GARANTIA"){
            r_totalGA += +f.valor;
          }else if(f.tipo_pago=="FAVOR"){
            r_totalVF += +f.valor;
          }else if(f.tipo_pago=="NOTA"){
            r_totalND += +f.valor;
          }else if(f.tipo_pago=="DEPOSITO"){
            r_totalDE += +f.valor;
          }else{
            r_totalOtro += +f.valor;
          }
          Object.assign(r,{
            totalEF: r_totalEF,
            totalCH: r_totalCH,
            totalTC: r_totalTC,
            totalTR: r_totalTR,
            totalTD: r_totalTD,
            totalGA: r_totalGA,
            totalVF: r_totalVF,
            totalND: r_totalND,
            totalDE: r_totalDE,
            totalOtro: r_totalOtro,
          });
        }
      })

      console.log(r)

      if(r.tipo_documento=='CA') { // documentos cobro de caja
        if(!r.superavit || +r.superavit==0){ //cobro de caja sin superavit
          console.log('Caja sin superavit');
          let rec100 = +r.total * 100;
          let gvf100 = (+r.totalGA * 100) + (+r.totalVF * 100);
          let dif100 = +rec100 - +gvf100;
          r.total = +dif100 / 100;
        }else if((r.superavit || +r.superavit>0) && +r.total>0){ //cobro de caja con superavit
          // r.total es los titulos cobrados
          let tit100 = +r.total * 100;
          let sph100 = +r.superavit * 100;
          let rec100 = +tit100 + +sph100;
          let gvf100 = (+r.totalGA * 100) + (+r.totalVF * 100);
          let dif100 = +rec100 - +gvf100;
          r.total = +dif100 / 100;
          // r.total += +r.superavit;
          console.log('Caja con superavit');
        }else if((r.superavit || +r.superavit>0) && +r.total==0){ //puro superavit no se cobra ninguna deuda
          let tit100 = +r.total * 100;
          let sph100 = +r.superavit * 100;
          let rec100 = +tit100 + +sph100;
          r.total = +rec100 / 100;
          // r.total += +r.superavit;
          // r.total = +r.superavit;
          console.log('Solo superavit');
        }
      }
      // else if(r.tipo_documento=='GA'){
      //   r.total -= (+r.totalGA + +r.totalVF);
      //   console.log('Garantia');
      // }

      // if(r.tipo_documento == "CA"){
      //  let totalGF = (+(r.totalGA) + +(r.totalVF)) * 100;
      //  let resta = +(r.total * 100) - +totalGF;
      //   r.total = resta / 100;
      // }

      total += +r.total;
      totalEF += +r.totalEF;
      totalCH += +r.totalCH;
      totalTC += +r.totalTC;
      totalTR += +r.totalTR;
      totalTD += +r.totalTD;
      totalGA += +r.totalGA;
      totalVF += +r.totalVF;
      totalND += +r.totalND;
      totalDE += +r.totalDE;
      totalOtro += +r.totalOtro;


    })


    // aqui revisar si se deposita el efectivo recaudado o el efectivo fisico (es decir, se quedaria debiendo de la caja o la caja queda intacta)

    // this.caja_dia.total_efectivo_cierre_final = parseFloat((+this.caja_dia.total_efectivo_inicio + +this.totalEF).toFixed(2));

    // this.sobraOFalta();

    // lo que se deposita es el total del efectivo mas cheque (+ sobrante si existe)
    // this.calcValoresDeposito(); // ya se calculan desde sobraOfalta
    this.calcTotales()
  }

  calcTotales() {
    const recaudacion = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.total), 0)
    const efectivo = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalEF), 0)
    const cheque = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalCH), 0)
    const t_credito = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalTC), 0)
    const transferencia = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalTR), 0)
    const t_debito = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalTD), 0)
    const garantia = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalGA), 0)
    const favor = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalVF), 0)
    const n_debito = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalND), 0)
    const deposito = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalDE), 0)
    const otros = this.tbl_data.reduce((acc, curr) => acc + parseFloat(curr.totalOtro), 0)

    Object.assign(this.totales, {recaudacion, efectivo, cheque, t_credito, transferencia, t_debito, garantia, favor, n_debito, deposito, otros})
  }

}
