import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsistenciaEmpleadoService } from '../asistencia-empleado.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalProgramaComponent } from '../../../beneficios/rol-general/modal-programa/modal-programa.component';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss']
})
export class ImportarComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  msgSpinner: string;
  cmb_periodo: any[] = []
  fileName: string | null = null;
  tbl_registros: any[] = []
  lst_update: any[] = [];
  areas: any = []
  departamentos: any = []

  periodoSelected: number | null = null;
  mes_id_cc: number | null = null;

  filter: any = {
    nombre: null,
    fecha_desde: null,
    fecha_hasta: null,
    area: 0,
    departamento: 0,
    programa: '',
    fk_programa:0
  }

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: AsistenciaEmpleadoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private commonVarSrv: CommonVarService
  ) {

    this.apiService.importarConsultar.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        let message = '';

        if (this.periodoSelected == null) message += '* No ha ingresado un Periodo.<br>'
        if (this.mes_id_cc == null) message += '* No ha seleccionado un Mes.<br>'

        if (message.length > 0) {
          this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
          return;
        }

        this.lcargando.ctlSpinner(true)
        try {
          this.msgSpinner = 'Cargando Marcaciones'
          this.tbl_registros = [];
          if(this.filter.programa==undefined || this.filter.programa=='') { this.filter.fk_programa=0 }
          if(this.filter.departamento==null) { this.filter.departamento=0 }
          if(this.filter.area==null) { this.filter.area=0 }
          let response = await this.apiService.getMarcaciones({ params: { filter: this.filter, periodo: this.periodoSelected, mes: this.mes_id_cc } })
          console.log(response)
          if (!response.length) {
            Swal.fire('No hay datos para el periodo seleccionado', '', 'info')
            this.lcargando.ctlSpinner(false)
            return;
          }
          this.tbl_registros = response
          // Cambiar estado botones de acuerdo
          const btns = {
            modificar: response[0].estado == 'P',
            eliminar: response[0].estado == 'P',
            aprobar: response[0].estado == 'P',
          }
          this.apiService.importarBotones.emit(btns)
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message)
        }
      }
    )

    this.apiService.importarModificar.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        if (!this.lst_update.length) {
          this.toastr.warning('No hay registros para actualizar')
          return;
        }

        let result = await Swal.fire({
          titleText: 'Actualizacion de Marcaciones',
          text: `Esta seguro/a de actualizar ${this.lst_update.length} registro(s)?`,
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Actualizar',
        })

        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true)
          try {
            this.msgSpinner = 'Actualizando Registros'
            let response = await this.apiService.updateMarcarciones({ marcaciones: this.lst_update })
            console.log(response)
            //
            this.lcargando.ctlSpinner(false)
            Swal.fire('Marcaciones actualizadas correctamente', '', 'success')
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error actualizando Registros')
          }
        }
      }
    )

    this.apiService.importarEliminar.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        let result = await Swal.fire({
          titleText: 'Eliminacion de Marcaciones',
          html: 'Esta seguro/a de eliminar las marcaciones para el periodo seleccionado?<br>Solo se eliminarán las marcaciones que no han sido aprobadas.',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Eliminar',
        })

        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true)
          try {
            this.msgSpinner = 'Eliminando Marcaciones'
            let response = await this.apiService.deleteMarcaciones({periodo: this.periodoSelected, mes: this.mes_id_cc})
            console.log(response)
            //
            this.lcargando.ctlSpinner(false)
            Swal.fire('Marcaciones eliminadas correctamente', '', 'success').then(() => this.clearScreen())
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error eliminando Marcaciones')
          }
        }
      }
    )

    this.apiService.importarAprobar.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        let result = await Swal.fire({
          titleText: 'Aprobacion de Marcaciones',
          text: 'Esta seguro/a de aprobar todas las marcaciones del periodo seleccionado?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aprobar'
        })
        console.log(this.tbl_registros)
        let empleadosAprobados = this.tbl_registros.filter(e => e.he_aprobado == true)
        console.log(empleadosAprobados)

        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true)
          try {
            this.msgSpinner = 'Aprobando Marcaciones'
            let response = await this.apiService.aprobarMarcaciones({periodo: this.periodoSelected, mes: this.mes_id_cc, aprobados: empleadosAprobados})
            console.log(response)
            //
            const btns = {
              modificar: false,
              eliminar: false,
              aprobar: false,
            }
            this.apiService.importarBotones.emit(btns)
            this.lcargando.ctlSpinner(false)
            Swal.fire('Marcaciones aprobadas correctamente', '', 'success')
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error aprobando Marcaciones')
          }
        }
      }
    )
    this.commonVarSrv.modalProgramArea.subscribe(
      (res)=>{
        this.filter.programa = res.nombre
        this.filter.fk_programa = res.id_nom_programa
        this.cargarAreas()
      }
    )

    this.apiService.importarLimpiar.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.clearScreen())
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.cmb_periodo = await this.apiService.getPeriodos()
    }, 0)
  }

  resetInput() {
    // Limpia el valor seleccionado para que el cambio se dispare siempre
    this.fileUpload.nativeElement.value = null;

    // Dispara el evento de clic en el elemento de entrada de archivo original
    this.fileUpload.nativeElement.click();
  }

  async onFileSelected(event) {
    const file: File = event.target.files[0];
    this.fileName = file.name

    if (file) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Procesando Archivo de Marcas'
        let response = await this.apiService.procesarMarcas(file, { periodo: this.periodoSelected, mes: this.mes_id_cc })
        console.log(response)

        this.tbl_registros = response;
        //
        const btns = {
          modificar: true,
          eliminar: true,
          aprobar: true,
        }
        this.apiService.importarBotones.emit(btns);
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error procesando Archivo de Marcas')
      }
    }

  }

  async calcularTiempos(registro: any, idx: number, event: any, tipo: string) {
    // console.log(registro)
    if (registro.entrada && registro.salida) {
      // Obtener jornada del Empleado
      this.lcargando.ctlSpinner(true)
      const jornada = await this.getJornada(registro.empleado.id_empleado, registro.fecha)
      const tabla = jornada[1]

      console.log(tabla)

      // Calcular
      let hora_entrada = moment(`${registro.fecha} ${registro.entrada}`)
      let hora_salida = moment(`${registro.fecha} ${registro.salida}`)

      if (tipo == 'entrada') {
        hora_entrada = moment(`${registro.fecha} ${event.target.value}`)
      } else {
        hora_salida = moment(`${registro.fecha} ${event.target.value}`)
      }


      let factor_entrada = this.getFactorTabla(hora_entrada, tabla);
      let factor_salida = this.getFactorTabla(hora_salida, tabla);

      console.log('factor_entrada', factor_entrada, 'factor_salida', factor_salida)
      let factores = []
      if (factor_entrada == 0 && factor_salida == 2) factores = [1]
      else if (factor_entrada == 0 && factor_salida == 3) factores = [1, 2]
      else if (factor_entrada == 0 && factor_salida == 4) factores = [1, 2, 3]
      else if (factor_entrada == 1 && factor_salida == 3) factores = [2]
      else if (factor_entrada == 1 && factor_salida == 4) factores = [2, 3]
      else if (factor_entrada == 1 && factor_salida == 0) factores = [2, 3, 4]
      else if (factor_entrada == 2 && factor_salida == 4) factores = [3]
      else if (factor_entrada == 2 && factor_salida == 0) factores = [3, 4]
      else if (factor_entrada == 2 && factor_salida == 1) factores = [3, 4, 0]
      else if (factor_entrada == 3 && factor_salida == 0) factores = [4]
      else if (factor_entrada == 3 && factor_salida == 1) factores = [4, 0]
      else if (factor_entrada == 3 && factor_salida == 2) factores = [4, 0, 1]
      else if (factor_entrada == 4 && factor_salida == 1) factores = [0]
      else if (factor_entrada == 4 && factor_salida == 2) factores = [0, 1]
      else if (factor_entrada == 4 && factor_salida == 3) factores = [0, 1, 2]
      console.log('factores', factores)

      // Tiempo Trabajado
      let tiempo_trabajado = 0
      let tiempo_entrada = 0
      let tiempo_intermedio = 0;
      let tiempo_salida = 0
      let minutos_extra_25 = 0;
      let minutos_extra_60 = 0;

      if (factor_entrada == 0 && factor_entrada == factor_salida) {
        tiempo_intermedio = hora_salida.diff(hora_entrada, 'minutes')
      } else {
        tiempo_entrada = moment(tabla[factor_entrada][1]).diff(hora_entrada, 'minutes')
        if (factor_entrada != 0) {
          if (factor_entrada == 3) minutos_extra_60 += moment(tabla[factor_entrada][1]).diff(hora_entrada, 'minutes')
          else minutos_extra_25 += moment(tabla[factor_entrada][1]).diff(hora_entrada, 'minutes')
        }
        console.log('tiempo_entrada', tiempo_entrada)
        console.log('entrada => minutos_extra_25', minutos_extra_25)
        console.log('entrada => minutos_extra_60', minutos_extra_60)
        tiempo_salida = hora_salida.diff(tabla[factor_salida][0], 'minutes')
        if (factor_salida != 0) {
          // Estoy en los rangos de horas extra
          if (factor_salida == 3) minutos_extra_60 += hora_salida.diff(tabla[factor_salida][0], 'minutes')
          else minutos_extra_25 += hora_salida.diff(tabla[factor_salida][0], 'minutes')
        }
        console.log('tiempo_salida', tiempo_salida)
        console.log('salida => minutos_extra_25', minutos_extra_25)
        console.log('salida => minutos_extra_60', minutos_extra_60)
      }

      factores.forEach((factor: number) => {
        let rango = tabla[factor];
        let hora_inferior = moment(rango[0])
        let hora_superior = moment(rango[1])
        tiempo_intermedio += hora_superior.diff(hora_inferior, 'minutes')
        if (factor != 0) {
          if (factor != 3) minutos_extra_25 += hora_superior.diff(hora_inferior, 'minutes')
          else minutos_extra_60 += hora_superior.diff(hora_inferior, 'minutes')
        }
      })
      console.log('tiempo_intermedio', tiempo_intermedio)
      console.log('intermedio => minutos_extra_25', minutos_extra_25)
      console.log('intermedio => minutos_extra_60', minutos_extra_60)

      /* if (factor_salida != factor_entrada) {
        tiempo_salida = hora_salida.diff(tabla[factor_salida][0], 'minutes')
        if (factor_salida != 3) minutos_extra_25 += hora_salida.diff(tabla[factor_salida][0], 'minutes')
        else minutos_extra_60 += hora_salida.diff(tabla[factor_salida][0], 'minutes')
      } */

      tiempo_trabajado = tiempo_entrada + tiempo_intermedio + tiempo_salida - minutos_extra_25 - minutos_extra_60;
      console.log('tiempo_trabajado', tiempo_trabajado)

      // let tiempo_extra = 0;
      // factores.filter(v => v === 3).forEach((factor: number) => {
      //   if (factor == factor_salida) {
      //     tiempo_extra += tiempo_salida;
      //     return;
      //   }

      //   let rango = tabla[factor];
      //   let hora_inferior = moment(rango[0])
      //   let hora_superior = moment(rango[1])
      //   tiempo_extra += hora_superior.diff(hora_inferior, 'minutes')
      // })

      // console.log('tiempo_extra', tiempo_extra);  // 25%

      Object.assign(this.tbl_registros[idx], {
        tiempo_trabajado,
        minutos_extra_25,
        minutos_extra_60,
        minutos_extra_100: 0
      })






      // let factor: number;
      // const keys = Object.keys(tabla)
      // const values = Object.values(tabla)

      // for(let i = 0; i < values.length; i++) {
      //   const inicio = values[i][0];
      //   const final = values[i][1];

      //   // console.log(i, hora_salida.isSameOrAfter(inicio), hora_salida.isSameOrBefore(final))
      //   if (hora_salida.isSameOrAfter(inicio) && hora_salida.isSameOrBefore(final)) {
      //     factor = i
      //     break;
      //   }
      // }

      /* if (factor) {
        const jornada_salida = tabla[keys[factor]]

        console.log(hora_salida, jornada_salida[0])
        let minutos_extra = hora_salida.diff(jornada_salida[0], 'minutes')

        let minutos_extra_25 = 0;
        let minutos_extra_60 = 0;
        let minutos_extra_100 = 0;
        if (['25', '25.1', '25.2'].includes(keys[factor])) {
          minutos_extra_25 += minutos_extra;
          if (keys[factor] == '25.1') minutos_extra_25 += 240;  // Compensando el rango entre salida y salida + 4
        } else if (['60'].includes(keys[factor])) {
          minutos_extra_60 += minutos_extra;
        }

        Object.assign(this.tbl_registros[idx], {
          tiempo_trabajado,
          minutos_extra_25,
          minutos_extra_60,
          minutos_extra_100
        })
      } else {
        this.toastr.warning('No se encontro informacion')
      } */
      this.lcargando.ctlSpinner(false)

      // Poneren lista de actualizacion
      this.actualizarRegistro(registro)
    }
  }

  getFactorTabla(hora: moment.Moment, tabla: any[]) {
    let factor: number;
    const keys = Object.keys(tabla)
    const values = Object.values(tabla)

    for(let i = 0; i < values.length; i++) {
      const inicio = values[i][0];
      const final = values[i][1];

      // console.log(i, hora_salida.isSameOrAfter(inicio), hora_salida.isSameOrBefore(final))
      if (hora.isSameOrAfter(inicio) && hora.isSameOrBefore(final)) {
        factor = i
        break;
      }
    }

    return factor;
  }

  async getJornada(empleado_id: number, fecha: any) {
    try {
      this.msgSpinner = 'Obteniendo Jornada'
      let jornada = await this.apiService.getJornada({empleado_id, fecha})
      //
      return jornada;
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error procesando Archivo de Marcas')
    }
  }

  viewSelectionMesCC(event: number) {
    this.mes_id_cc = event
  }

  actualizarRegistro(element: any) {
    if (this.lst_update.includes(element)) {
      this.lst_update.splice(this.lst_update.findIndex((item: any) => item == element), 1)
    }
    this.lst_update.push(element)
  }

  clearScreen() {
    // Limpiar Filtros
    this.periodoSelected = null
    this.mes_id_cc = null
    Object.assign(this.filter, {
      nombre: null,
      fecha_desde: null,
      fecha_hasta: null,
      area: null,
      departamento: null,
    })

    // Limpiar Carga de Archivos
    this.fileName = null;
    document.querySelector('#input-marcaciones').setAttribute('value', '');

    // Limpiar la tabla
    this.tbl_registros = [];

    const btns = {
      modificar: false,
      aprobar: false,
    }
    this.apiService.importarBotones.emit(btns)
  }

  modalPrograma(){
    let modal = this.modalService.open(ModalProgramaComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  cargarAreas() {
    this.msgSpinner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      fk_programa: this.filter.fk_programa
    }

    this.apiService.getAreas(data).subscribe(
      (res: any) => {
        console.log(res);
        this.areas = res.data
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  cargarDepartamentos(event) {
    this.msgSpinner = "Cargando listado de Departamentos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_area: this.filter.area
    }

    this.apiService.getDepartamentos(data).subscribe(
      (res: any) => {
        console.log(res);
        this.departamentos = res
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

}
