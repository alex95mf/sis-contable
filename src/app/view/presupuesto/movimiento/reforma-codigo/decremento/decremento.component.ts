import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ReformaCodigoService } from '../reforma-codigo.service';
import { ModalBusquedaPartidaComponent } from '../modal-busqueda-partida/modal-busqueda-partida.component';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-decremento',
  templateUrl: './decremento.component.html',
  styleUrls: ['./decremento.component.scss']
})
export class DecrementoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string;
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

  por_actualizar: boolean = false;

  constructor(
    private apiService: ReformaCodigoService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    // Viene del Parent
    this.apiService.periodoSelected$.subscribe(
      (periodo: any) => {
        // console.log(periodo)
        this.periodo = periodo
      }
    )

    // Viene del Parent
    this.apiService.programaSelected$.subscribe(
      (programa: any) => {
        // console.log(programa)
        this.programa = programa
      }
    )

    this.apiService.reformaSelected$.subscribe(
      (reforma: any) => {
        
      }
    )

    // Viene del Modal
    this.apiService.partidaSelected$.subscribe(
      (res: any) => {
        if (res.forDecremento) {
          // console.log(res)
          this.cod_presupuesto = res.data
        }
      }
    )

    this.apiService.actualizarDetalles$.subscribe(
      async (cabecera: any) => {
        if (this.por_actualizar) {
          let data = {
            cabecera: cabecera,
            bienes: this.listaSolicitudesAtribucion,
            partida_presupuestaria: this.cod_presupuesto,
            totalOriginal: this.totalBienes,  // SUM(lista.costo_total_por_solicitar)
            totalReforma: this.totalReforma,  // Por Solicitar - Valor Reforma
            totalAjustado: this.totalAjustado,  // SUM(lista.costo_total_reforma)
            origen: 'decremento',
          };

          let response = await this.apiService.setReformaDetalles(data);
          console.log(response)
        }
      }
    )
  }

  ngOnInit(): void {
  }

  expandPartidas(partida) {
    let programa = []
    let departamento = []
    if(partida=='partida1'){
       programa = this.atribucionParamsNew.programa
       departamento = this.atribucionParamsNew.departamento
    }
    if(partida=='partida2'){
      programa = this.atribucionParamsNew.programa_dos
      departamento = this.atribucionParamsNew.departamento_dos
   }
    const modal = this.modalService.open(ModalBusquedaPartidaComponent, { size: 'xl', backdrop: 'static'})
    modal.componentInstance.origen = 'decremento'
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
      this.mensajeSpinner = 'Cargando Bienes'
      let response = await this.apiService.getBienes({programa: this.programa, periodo: this.periodo, codigo_presupuesto: this.cod_presupuesto});
      response.map((item: any) => Object.assign(item, { 
        check: (item.estado !== 'I') ? this.masterSelected : false,
      }))
      this.listaSolicitudesAtribucion = response;

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Bienes')
    }
  }

  async clonarBien(bien: any) {
    console.log("clonando");
    let result: SweetAlertResult = await Swal.fire({
      title: 'Seguro desea duplicar este bien?',
      text: 'Se creara un nuevo bien basado en el seleccionado, con valores en 0.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      this.por_actualizar = true;
 
      this.lcargando.ctlSpinner(true)
      try {
        this.mensajeSpinner = 'Duplicando Bien'
        let response: Array<any> = await this.apiService.duplicarBien({
          bien: bien,
          codigo_presupuesto: this.cod_presupuesto,
          periodo: this.periodo,
          programa: this.programa,
        })
  
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
        this.toastr.error(err.error.message, 'Error duplicando Bien')
      }
    }
  }

  selectAll() {
    this.listaSolicitudesAtribucion.map((e: any) => {
      if (e.estado != 'I') e.check = this.masterSelected
    })

    this.calcularValorTotal()
  }

  calcularAjuste() {
    this.por_actualizar = true;
    this.totalReforma = this.totalBienes - this.valorReforma
  }
  
  calcularValorTotal(){
    this.por_actualizar = true;
    // Calcular Por Solicitar
    let totalPorSolicitar = this.listaSolicitudesAtribucion.reduce((acc, curr) => {
      if (curr.check) {
        return acc + parseFloat(curr.costo_total_por_solicitar)
      } 
      return acc
    }, 0)
    /* let totalPorSolicitar = 0;
    this.listaSolicitudesAtribucion.forEach((item: any) => {
      if (item.check) {
        totalPorSolicitar += parseFloat(item.costo_total_por_solicitar)
      }
    }) */
    console.log('totalPorSolicitar', totalPorSolicitar)
    this.totalBienes = totalPorSolicitar;

    // Calcular Costo Total por Reforma de cada Item
    this.listaSolicitudesAtribucion.forEach((item: any) => {
      if (item.check) {
        item.costo_total_reforma = parseFloat(item.cantidad_reforma) * parseFloat(item.costo_unitario_reforma);
      }
    })

    // Mostrar Ajustado
    let costoTotalReforma = 0;
    this.listaSolicitudesAtribucion.forEach((item: any) => {
      if (item.check) {
        costoTotalReforma += parseFloat(item.costo_total_reforma)
      }
    })
    this.totalAjustado = costoTotalReforma;

    /* this.totalBienes = this.listaSolicitudesAtribucion.reduce((acc, curr) => {
      if (curr.check) acc + parseFloat(curr.costo_total_por_solicitar)
      
      return acc
    }, 0);
    this.totalAjustado = this.listaSolicitudesAtribucion.reduce((acc, curr) => {
      if (curr.check) acc += parseFloat(curr.costo_total_reforma)
      return acc
    }, 0); */
  }

}
