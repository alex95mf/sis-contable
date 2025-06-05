import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsistenciaEmpleadoService } from '../asistencia-empleado.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-atrasos',
  templateUrl: './atrasos.component.html',
  styleUrls: ['./atrasos.component.scss']
})
export class AtrasosComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  mensajeSpinner: string = "Cargando...";
  cmb_periodo: any[] = []
  fileName: string|null = null;
  tbl_registros: any[] = []
  lst_update: any[] = [];

  periodoSelected: number | null = null;
  mes_id_cc: number | null = null;

  filter: any = {
    nombre: null,
    fecha_desde: null,
    fecha_hasta: null,
    area: null,
    departamento: null,

  }

  motivosAtraso: any = [];

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: AsistenciaEmpleadoService,
    private toastr: ToastrService,
  ) {
    this.apiService.atrasosConsultar.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        let message = '';

        if (this.periodoSelected == null) message += '* No ha ingresado un Periodo.<br>'
        if (this.mes_id_cc == null) message += '* No ha seleccionado un Mes.<br>'

        if (message.length > 0) {
          this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
          return
        }
        this.lcargando.ctlSpinner(true)
        try {
          (this as any).mensajeSpinner = 'Cargando Atrasos'
          let response = await this.apiService.getAtrasos({ params: { filter: this.filter, periodo: this.periodoSelected, mes: this.mes_id_cc } })
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
          this.apiService.atrasosBotones.emit(btns)
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message)
        }
      }
    )

    this.apiService.atrasosModificar.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        if (!this.lst_update.length) {
          this.toastr.warning('No hay registros para actualizar')
          return;
        }

        let result = await Swal.fire({
          titleText: 'Actualizacion de Atrasos',
          text: `Esta seguro/a de actualizar ${this.lst_update.length} registro(s)?`,
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Actualizar',
        })

        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true)
          try {
            (this as any).mensajeSpinner = 'Actualizando Registros'
            let response = await this.apiService.updateAtrasos({ atrasos: this.lst_update })
            console.log(response)
            //
            this.lcargando.ctlSpinner(false)
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error actualizando Registros')
          }
        }
      }
    )

    this.apiService.atrasosEliminar.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        let result = await Swal.fire({
          titleText: 'Eliminacion de Atrasos',
          html: 'Esta seguro/a de eliminar los atrasos para el periodo seleccionado?<br>Solo se eliminarán los atrasos que no han sido aprobados.',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Eliminar',
        })

        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true)
          try {
            (this as any).mensajeSpinner = 'Eliminando Atrasos'
            let response = await this.apiService.deleteAtrasos({periodo: this.periodoSelected, mes: this.mes_id_cc})
            console.log(response)
            //
            this.lcargando.ctlSpinner(false)
            Swal.fire('Atrasos eliminadas correctamente', '', 'success').then(() => this.clearScreen())
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error eliminando Atrasos')
          }
        }
      }
    )

    this.apiService.atrasosAprobar.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        let result = await Swal.fire({
          titleText: 'Aprobacion de Atrasos',
          text: 'Esta seguro/a de aprobar todas los atrasos del periodo seleccionado?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aprobar'
        })

        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true)
          try {
            (this as any).mensajeSpinner = 'Aprobando Atrasos'
            let response = await this.apiService.aprobarAtrasos({ periodo: this.periodoSelected, mes: this.mes_id_cc })
            console.log(response)
            //
            const btns = {
              modificar: false,
              eliminar: false,
              aprobar: false,
            }
            this.apiService.atrasosBotones.emit(btns)
            this.lcargando.ctlSpinner(false)
            Swal.fire('Atrasos aprobados correctamente', '', 'success')
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error aprobando Atrasos')
          }
        }
      }
    )

    this.apiService.atrasosLimpiar.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.clearScreen())

  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.cmb_periodo = await this.apiService.getPeriodos()
      this.getMotivosAtrasos();
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
        (this as any).mensajeSpinner = 'Procesando Archivo de Marcas'
        let response = await this.apiService.procesarAtrasos(file, { periodo: this.periodoSelected, mes: this.mes_id_cc })
        console.log(response)

        this.tbl_registros = response;
        const btns = {
          modificar: true,
          eliminar: true,
          aprobar: true,
        }
        this.apiService.atrasosBotones.emit(btns)
        //
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error procesando Archivo de Marcas')
      }
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

  getMotivosAtrasos(){
    let data = {
      valor_cat: 'TPPM',
    }

    this.apiService.getMotivoAtraso(data).subscribe((result: any) => {
      console.log(result);

      if(result.data.length > 0){
        this.motivosAtraso=result['data'];
      }else {
        this.motivosAtraso=[];
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
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
    document.querySelector('#input-atrasos').setAttribute('value', '');

    // Limpiar la tabla
    this.tbl_registros = [];

    const btns = {
      modificar: false,
      aprobar: false,
    }
    this.apiService.atrasosBotones.emit(btns)
  }


}
