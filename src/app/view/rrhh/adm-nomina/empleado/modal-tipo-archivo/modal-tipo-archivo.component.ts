import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { GeneralService } from 'src/app/services/general.service';
import { EmpleadoService } from '../empleado.service';

@Component({
standalone: false,
  selector: 'app-modal-tipo-archivo',
  templateUrl: './modal-tipo-archivo.component.html',
  styleUrls: ['./modal-tipo-archivo.component.scss']
})
export class ModalTipoArchivoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[] = []

  txt_tipo_archivo_nombre: string|null = null
  txt_tipo_archivo_descripcion: string|null = null
  txt_tipo_archivo_codigo: string|null = null

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private generalService: GeneralService,
    private empleadoService: EmpleadoService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalTipoArchivo',
        paramAccion: '',
        boton: {icon: 'far fa-save', texto: 'GUARDAR'},
        clase: 'btn btn-success btn-sm',
        permiso: true,
        habilitar: false,
        showbadge: false, 
        showimg: true,
        showtxt: true,
      },
      {
        orig: 'btnsModalTipoArchivo',
        paramAccion: '',
        boton: {icon: 'far fa-window-close', texto: 'CANCELAR'},
        clase: 'btn btn-danger btn-sm',
        permiso: true,
        habilitar: false,
        showbadge: false, 
        showimg: true,
        showtxt: true,
      },
    ]
  }

  ngOnInit(): void {
  }

  async metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CANCELAR":
        this.activeModal.close();
        break;
      case "GUARDAR":
        this.lcargando.ctlSpinner(true);
        (this as any).mensajeSpinner = 'Almacenando Tipo de Archivo'
        await this.createTipoArchivo()
        this.lcargando.ctlSpinner(false)
        break;
    }
  }

  createTipoArchivo = async () => {
    let msgValidacion = ''

    if (this.txt_tipo_archivo_nombre == null || this.txt_tipo_archivo_nombre.trim() == '') msgValidacion += '* No ha ingresado un Nombre<br>'
    if (this.txt_tipo_archivo_descripcion == null || this.txt_tipo_archivo_descripcion.trim() == '') msgValidacion += '* No ha ingresado una Descripcion<br>'
    if (this.txt_tipo_archivo_codigo == null || this.txt_tipo_archivo_codigo.trim() == '') msgValidacion += '* No ha ingresado un Codigo<br>'

    if (msgValidacion.length > 0) {
      this.toastr.warning(msgValidacion, 'Validacion de Catalogo', {enableHtml: true})
      return
    }

    try {
      const catalogo = {
        nombre: this.txt_tipo_archivo_nombre,
        descripcion: this.txt_tipo_archivo_descripcion,
        codigo: this.txt_tipo_archivo_codigo,
      }
      const response = await this.generalService.setCatalogo({ catalogo })
      console.log(response);
      this.empleadoService.updateTipoArchivo$.emit()
      this.activeModal.close()
    } catch (error) {
      console.log(error)
      this.toastr.error(error.error?.message)
    }
  }

}
