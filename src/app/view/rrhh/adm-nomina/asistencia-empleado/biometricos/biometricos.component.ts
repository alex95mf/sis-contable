import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { AsistenciaEmpleadoService } from '../asistencia-empleado.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-biometricos',
  templateUrl: './biometricos.component.html',
  styleUrls: ['./biometricos.component.scss']
})
export class BiometricosComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string = "Cargando...";
  @ViewChild('inputFile') fileUpload: ElementRef;
  fileName: string|null = null;

  lst_biometrico = []
  lst_periodos = []
  lst_meses = []

  periodoSelected: string|null = null
  mesSelected: string|null = null
  mesNombreSelected: string|null = null
  biometricoSelected: string|null = null
  biometricoNombreSelected: string|null = null
  file: File|null = null

  tbl_marcaciones = []

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: AsistenciaEmpleadoService,
    private toastr: ToastrService,
  ) {
    this.apiService.biometricoCancelar.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.periodoSelected = null
      this.mesSelected = null
      this.mesNombreSelected = null
      this.biometricoSelected = null
      this.biometricoNombreSelected = null
      this.file = null
      this.fileName = null
    })
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 0)
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    if (this.lst_periodos.length == 0) await this.getPeriodos()
    if (this.lst_meses.length == 0) await this.getMeses()
    if (this.lst_biometrico.length == 0) await this.getBiometricos()
    this.lcargando.ctlSpinner(false)
  }

  async getPeriodos() {
    try {
      (this as any).mensajeSpinner = 'Cargando Periodos'
      const response = await this.apiService.getPeriodos()
      console.log(response)
      this.lst_periodos = response
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message ?? err.message, 'Error cargando Periodos')
    }
  }

  async getMeses() {
    try {
      const response = await this.apiService.getCatalogoNomina({catalogo: 'MES'})
      console.log(response)
      this.lst_meses = response.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message ?? err.message, 'Error cargando Periodos')
    }
  }

  async getBiometricos() {
    try {
      (this as any).mensajeSpinner = 'Cargando Biometricos'
      const response = await this.apiService.getCatalogo({params: "'RRHH_BIOMETRICO'"})
      console.log(response)
      this.lst_biometrico = response.data['RRHH_BIOMETRICO']
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message ?? err.message, 'Error cargando Periodos')
    }
  }

  resetInput() {
    // Limpia el valor seleccionado para que el cambio se dispare siempre
    this.fileUpload.nativeElement.value = null;

    // Dispara el evento de clic en el elemento de entrada de archivo original
    this.fileUpload.nativeElement.click();
  }

  handleMesChange(event) {
    if (event) {
      this.mesNombreSelected = event.cat_nombre
    }
  }

  handleBiometricoChange(event) {
    if (event) {
      this.biometricoNombreSelected = event.descripcion
    }
  }

  handleInputFile(event) {
    this.file = event.target.files[0];

    if (this.file) {
      this.fileName = this.file.name
    }
  }

  async uploadFile() {
    let msgInvalid = ''

    if (this.periodoSelected == null) msgInvalid += 'No ha seleccionado un Periodo.<br>'
    if (this.mesSelected == null) msgInvalid += 'No ha seleccionado un Mes.<br>'
    if (this.biometricoSelected == null) msgInvalid += 'No ha seleccionado un Biometrico.<br>'
    if (this.file == null) msgInvalid += 'No ha seleccionado un archivo de marcaciones.<br>'

    if (msgInvalid.length) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return
    }

    const result = await Swal.fire({
      titleText: 'Carga de Archivo de Marcaciones',
      text: `Esta seguro/a desea cargar el archivo de marcaciones para el Periodo ${this.mesNombreSelected}, ${this.periodoSelected} del dispositivo ${this.biometricoNombreSelected}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cargar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      (this as any).mensajeSpinner = 'Procesando archivo de Marcaciones'
      try {
        const response = await this.apiService.setMarcaciones(this.file, {periodo: this.periodoSelected, mes: this.mesSelected, dispositivo: this.biometricoSelected})
        console.log(response)
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error subiendo Marcaciones')
      }
    }
  }

}
