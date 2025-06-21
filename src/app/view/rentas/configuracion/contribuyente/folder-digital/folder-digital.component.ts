import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContribuyenteService } from '../contribuyente.service';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import moment from 'moment';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-folder-digital',
  templateUrl: './folder-digital.component.html',
  styleUrls: ['./folder-digital.component.scss']
})
export class FolderDigitalComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() contribuyente: number;
  @Input() archivos: Array<any> = [];
  mensajeSpinner: string = "Cargando...";

  cmb_tipo_archivo: Array<any> = [];
  tipoArchivoSelected: any;
  tipoArchivoLoading: boolean = false

  fileToUploadFolde: any;
  fileBase64: any;
  nameFile: any;

  folderDigitalForm: any = {
    id: null,
    fk_contribuyente: null,
    nombre: null,
    tipo_archivo: null,
    extension: null,
    peso_archivo : 0,
    archivo_base_64: null,
    fecha_creacion: moment().format('YYYY-MM-DD'),
    estado: 'A',
  };

  constructor(
    private apiService: ContribuyenteService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    // this.cargaInicial()
  }

  async cargaInicial() {
    // this.lcargando.ctlSpinner(true);
    if (!this.cmb_tipo_archivo.length) {
      this.tipoArchivoLoading = true
      try {
        (this as any).mensajeSpinner = 'Cargando Catalogos'
        let catalogos = await this.apiService.getCatalogoAsync();
        console.log(catalogos)
        this.cmb_tipo_archivo = catalogos;

        // this.lcargando.ctlSpinner(false)
        this.tipoArchivoLoading = false
      } catch (err) {
        console.log(err)
        // this.lcargando.ctlSpinner(false)
        this.tipoArchivoLoading = false
        this.toastr.error(err.error?.message)
      }
    }
  }

  handleFileInputFichaEmpleado(file: FileList) {
    this.fileToUploadFolde = file.item(0);

    let reader = new FileReader();

    reader.onload = (event: any) => {
      this.fileBase64 = event.target.result;
      this.nameFile = this.fileToUploadFolde.name;

      Object.assign(this.folderDigitalForm, {
        archivo_base_64: event.target.result,
        nombre: this.fileToUploadFolde.name,
        extension: this.fileToUploadFolde.name.split('.').pop(),
        peso_archivo: this.fileToUploadFolde.size,
      })
    };

    reader.readAsDataURL(this.fileToUploadFolde);
  }

  async uploadArchivo() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Archivo'
      this.folderDigitalForm.fk_contribuyente = this.contribuyente
      this.folderDigitalForm.tipo_archivo = this.tipoArchivoSelected

      let response = await this.apiService.uploadArchivo({archivo: this.folderDigitalForm})
      console.log(response)
      // this.archivos = response
      //
      this.lcargando.ctlSpinner(false)
      Swal.fire('Archivo cargado correctamente', '', 'success').then(() => {
        this.archivos = response
        this.tipoArchivoSelected = null
        Object.assign(this.folderDigitalForm, {
          id: null,
          fk_contribuyente: null,
          nombre: null,
          tipo_archivo: null,
          extension: null,
          peso_archivo : 0,
          archivo_base_64: null,
          fecha_creacion: moment().format('YYYY-MM-DD'),
          estado: 'A',
        })
      })
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.tipoArchivoLoading = false
      this.toastr.error(err.error?.message)
    }
  }

  descargarArchivo(documento: any) {
    // Obtén el contenido base64 del archivo desde el objeto
    const archivoBase64 = documento.archivo_base_64;

    // Extrae solo la parte base64 del prefijo "data:application/pdf;base64,"
    const base64Data = archivoBase64.split(',')[1];

    // Convierte el contenido base64 en un Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray]);

    // Crea un enlace de descarga y simula el clic en el enlace
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documento.nombre}`; // Nombre que tendrá el archivo descargado
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async deleteDocumento(documento: any) {
    let result: SweetAlertResult = await Swal.fire({
      title: 'Eliminar documento anexo',
      text: 'Esta seguro/a de eliminar este anexo?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Eliminando documento anexo...'
        let response = await this.apiService.eliminarArchivo({ documento })
        console.log(response)
        //
        this.lcargando.ctlSpinner(false)
        Swal.fire('Documento eliminado correctamente', '', 'success').then(() => {
          this.archivos = response
        })
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }

  }

}
