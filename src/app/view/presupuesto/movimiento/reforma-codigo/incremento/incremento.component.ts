import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ReformaCodigoService } from '../reforma-codigo.service';
import { ModalBusquedaPartidaComponent } from '../modal-busqueda-partida/modal-busqueda-partida.component';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-incremento',
  templateUrl: './incremento.component.html',
  styleUrls: ['./incremento.component.scss']
})
export class IncrementoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  listaSolicitudesAtribucion: Array<any> = [];
  masterSelected: boolean = false;

  periodo: any;
  programa: any;
  bienes: Array<any> = [];
  cod_presupuesto: any = {
    label: ''
  };

  totalBienes: number = 0;
  totalReforma: number = 0;
  totalAjustado: number = 0;
  valorReforma: number = 0;

  constructor(
    private apiService: ReformaCodigoService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { 
    this.apiService.periodoSelected$.subscribe({
      next: (periodo: any) => {
        console.log(periodo)
        this.periodo = periodo
      }
    })
    this.apiService.programaSelected$.subscribe({
      next: (programa: any) => {
        console.log(programa)
        this.programa = programa
      }
    })

    this.apiService.partidaSelected$.subscribe(
      (res: any) => {
        if (res.forIncremento) {
          // console.log(res)
          this.cod_presupuesto = res.data
        }
      }
    )
  }

  ngOnInit(): void {
  }

  expandPartidas() {
    const modal = this.modalService.open(ModalBusquedaPartidaComponent, { size: 'xl', backdrop: 'static'})
    modal.componentInstance.origen = 'incremento'
  }

  async getBienes() {
    let message = '';
    if (this.periodo == undefined) {
      message += '* No ha seleccionado un Periodo.<br>'
    }
    if (this.programa == undefined) {
      message += '* No ha seleccionado un Programa.<br>'
    }
    if (this.cod_presupuesto == undefined) {
      message += '* No ha seleccionado una Partida Presupuestaria.<br>'
    }

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', {enableHtml: true})
      return;
    }

    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Bienes'
      let response = await this.apiService.getBienes({programa: this.programa, periodo: this.periodo, codigo_presupuesto: this.cod_presupuesto});
      response.map((item: any) => Object.assign(item, { 
        check: false,
        cantidad_mod: item.cantidad_por_solicitar,
        costo_total_mod: item.costo_total_por_solicitar,
      }))
      this.listaSolicitudesAtribucion = response;

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Bienes')
    }
  }

  clonarBien(bien: any) {

  }

  selectAll() {
    this.listaSolicitudesAtribucion.map((e: any) => e.check = this.masterSelected)

    this.calcularValorTotal()
  }

  calcularAjuste() {
    let total = 0;
    this.listaSolicitudesAtribucion.forEach((item: any) => {
      if (item.check) {
        item.costo_total_mod = parseFloat(item.cantidad_mod) * parseFloat(item.costo_unitario);
        total += parseFloat(item.cantidad_mod) * parseFloat(item.costo_unitario);
      }
    })

    this.totalAjustado = total + this.valorReforma
  }
  
  calcularValorTotal(){
    this.totalBienes = 0;
    this.totalAjustado = 0;
    this.listaSolicitudesAtribucion.forEach((item: any) => {
      if (item.check) {
        item.costo_total_mod = parseFloat(item.cantidad_mod) * parseFloat(item.costo_unitario);
        this.totalBienes += parseFloat(item.costo_total_por_solicitar)
        this.totalAjustado += parseFloat(item.cantidad_mod) * parseFloat(item.costo_unitario);
      }
    })

    this.totalReforma = this.totalBienes - this.valorReforma;
  }

}
