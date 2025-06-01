import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { TasasInteresService } from './tasas-interes.service';
import { ToastrService } from 'ngx-toastr';
import Swal, { SweetAlertResult } from 'sweetalert2';
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-tasas-interes',
  templateUrl: './tasas-interes.component.html',
  styleUrls: ['./tasas-interes.component.scss']
})
export class TasasInteresComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Tasas de Interes';
  vmButtons: Array<Botonera> = [];
  msgSpinner: string;

  cmb_periodo: Array<any> = [];
  lst_periodo: Array<any> = [];

  periodoSelected: any = moment(new Date()).format('YYYY');

  constructor(
    private apiService: TasasInteresService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsTasasInteres',
        paramAccion: '',
        boton: { icon: 'fas fa-floppy-o', texto: 'INICIALIZAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false
      },
      {
        orig: 'btnsTasasInteres',
        paramAccion: '',
        boton: { icon: 'fas fa-floppy-o', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false
      }
    ]
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargaInicial()
    }, 50);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "INICIALIZAR":
        this.inicializarInteres()
        break;
      case "GUARDAR":
        this.setTasasInteres()
        break;
      case "LIMPIAR":
        //
        break;
      case "BUSCAR":
        //
        break;

      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Periodos'
      let periodos = await this.apiService.getPeriodos()
      this.cmb_periodo = periodos

      this.lcargando.ctlSpinner(false)
      this.ObtenerPeriodo()
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }

  async ObtenerPeriodo() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Tasas de Interes'
      let tasas = await this.apiService.getTasasInteres({periodo: this.periodoSelected});
      tasas.forEach((item: any) => {
        let meses = [
          { num: 1, nombre: 'Enero' },
          { num: 2, nombre: 'Febrero' },
          { num: 3, nombre: 'Marzo' },
          { num: 4, nombre: 'Abril' },
          { num: 5, nombre: 'Mayo' },
          { num: 6, nombre: 'Junio' },
          { num: 7, nombre: 'Julio' },
          { num: 8, nombre: 'Agosto' },
          { num: 9, nombre: 'Septiembre' },
          { num: 10, nombre: 'Octubre' },
          { num: 11, nombre: 'Noviembre' },
          { num: 12, nombre: 'Diciembre' },
        ]

        Object.assign(item, { mes_nombre: meses.find((m: any) => m.num == item.mes).nombre })
      })
      console.log(tasas)
      this.lcargando.ctlSpinner(false);
      if (tasas.length > 0) {
        this.lst_periodo = tasas;
      } else {
        this.lst_periodo = [];

        const result = await Swal.fire({
          title: 'No hay datos para el periodo seleccionado',
          text: 'Desea generar los registros necesarios?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Generar',
          cancelButtonText: 'Cancelar',
        })

        if (result.isConfirmed) this.generarPeriodo();
      }
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Tasas de Interes')
    }
    //
  }

  async generarPeriodo() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Generando Periodo'
      await this.apiService.generarPeriodoTasas({periodo: this.periodoSelected})

      this.lcargando.ctlSpinner(false)
      Swal.fire('Periodo Generado', '', 'success').then(() => this.ObtenerPeriodo())
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async setTasasInteres() {
    const result = await Swal.fire({
      title: 'Almacenar Tasas de Interes',
      text: 'Seguro/a desea almacenar las Tasas de Interes ingresadas?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Almacenando Tasas de Interes'
        let tasas = await this.apiService.setTasasInteres({ tasas: this.lst_periodo })
        console.log(tasas)

        this.lcargando.ctlSpinner(false)
        Swal.fire('Tasas de Interes almacenadas correctamente', '', 'success')
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }

  inicializarInteres(){
    if(this.periodoSelected ==undefined){
      this.toastr.info('Debe seleccionar un Período');
    }
    // else if(this.mes_actual==undefined || this.mes_actual=='' || this.mes_actual==0){
    //   this.toastr.info('Debe seleccionar un Mes');
    // }
    else{

      let data = {
        periodo: Number(this.periodoSelected),
        //mes:
      }
      this.msgSpinner = 'Inicializando Intereses'
      this.lcargando.ctlSpinner(true);
      this.apiService.inicializarSp(data).subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "El proceso fue ejecutado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }

  calcularInteres(item){
    if(item.periodo ==undefined){
      this.toastr.info('Debe seleccionar un Período');
    }
    else if(item.mes_nombre==undefined ||item.mes_nombre=='' ||item.mes_nombre==0){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else{

      let data = {
        periodo: Number(item.periodo),
        mes: Number(item.mes),
        cuenta: ''
      }
      this.msgSpinner = 'Calculando Intereses'
      this.lcargando.ctlSpinner(true);
      this.apiService.calcularInteresSp(data).subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "El proceso fue ejecutado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }


}
