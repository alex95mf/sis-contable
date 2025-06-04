import { Component, OnInit, ViewChild, Input } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';

import { FormComisariaService } from '../form-comisaria.service';  // Cambiar de acuerdo al modulo
@Component({
standalone: false,
  selector: 'app-anexos-list',
  templateUrl: './anexos-list.component.html',
  styleUrls: ['./anexos-list.component.scss']
})
export class AnexosListComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  fTitle = 'Listado de Anexos'
  @Input() dataUser: any
  @Input() permissions: any
  
  anexos = []

  constructor(
    private commonService: CommonService, 
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiService: FormComisariaService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    /**
     * Observador cuando se carga un Formulario de Respuesta con datos
     */
    this.commonVarService.selectInspeccionComisaria.asObservable().subscribe(
      (res) => {
        // Se esta cargando una inspeccion, cargar sus anexos
        this.cargaAnexo(res)
      }
    )

    /**
     * Observador cuando se almacena un Formulario de Respuesta
     */
    this.commonVarService.updateFormularioCabCom.asObservable().subscribe(
      (res) => {
        // El formulario ha sido guardado, cargar/mostrar sus anexos
        this.cargaAnexo(res)
      }
    )

    this.commonVarService.limpiarArchivos.asObservable().subscribe(
      (res) => {
        if(res) {
          this.anexos = [];
        }
      }
    )
  }

  ngOnInit(): void {
  }

  deleteAnexo(anexo) {
    // Solicita confirmacion antes de eliminar un Anexo
    Swal.fire({
      title: this.fTitle,
      text: 'Seguro desea eliminar este anexo?',
      icon: 'question',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(
      res => {
        if (res.value) {
          let data = {
            // Data del archivo
            id_anexo: anexo.id_anexo,
            component: anexo.component,
            module: anexo.module,
            identifier: anexo.identifier,
            // Datos para registro en Bitacora
            id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
            accion: `Borrado de Anexo ${anexo.id_anexo}`,
            ip: this.commonService.getIpAddress()
          }
      
          this.mensajeSpinner = 'Eliminando anexo'
          this.lcargando.ctlSpinner(true)
      
          this.apiService.deleteAnexo(data).subscribe(
            res => {
              this.lcargando.ctlSpinner(false)
              this.anexos = this.anexos.filter(a => a !== anexo)  // Quita el anexo de la lista
              Swal.fire({
                title: this.fTitle,
                text: 'Anexo eliminado con exito',
                icon: 'success'
              })
            },
            err => {
              this.lcargando.ctlSpinner(false)
              console.log(err)
              this.toastr.error(err.error.message, 'Error eliminando Anexo')
            }
          )
        }
      }
    )
  }

  /**
   * Permite la visualizacion de un Anexo "sin descargar"
   * @param anexo Anexo del Componente
   */
  verAnexo(anexo) {
    let data = {
      storage: anexo.storage,
      name: anexo.storageName
    }

    this.apiService.downloadAnexo(data).subscribe(
      (resultado) => {
        const dialogRef = this.confirmationDialogService.openDialogMat(VistaArchivoComponent, {
          width: '1000px', height: 'auto',
          data: {
            titulo: 'Vista de archivo',
            dataUser: this.dataUser,
            objectUrl: URL.createObjectURL(resultado),
            tipoArchivo: anexo.original_type
          }
        })
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error visualizando Anexo')
      }
    )
  }

  /**
   * Descarga el anexo a la compu del usuario
   * @param anexo Anexo del Componente
   */
  descargarAnexo(anexo) {
    let data = {
      storage: anexo.storage,
      name: anexo.storageName
    }

    this.apiService.downloadAnexo(data).subscribe(
      (resultado) => {
        const url = URL.createObjectURL(resultado)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', anexo.nombre)
        link.click()
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  /**
   * Carga los anexos asociados al objeto padre
   * @param res Objeto padre
   */
  cargaAnexo(res: any) {
    console.log(this.permissions);
    let data = {
      module: this.permissions.id_modulo,
      component: myVarGlobals.fRenFormComisaria,  // TODO: Ajustar cuando se ingrese el id del formulario
      identifier: res.id_inspeccion_res
    }
    this.apiService.getAnexos(data).subscribe(
      res => {
        this.anexos = []
        res['data'].forEach(anexo => {
          let obj = {
            id_anexo: anexo.id_anexos,
            nombre: anexo.original_name,
            storageName: anexo.name,
            extension: anexo.original_extension,
            storage: anexo.storage,
            original_type: anexo.original_type,
            module: anexo.fk_modulo,
            component:  anexo.fk_component,
            identifier: anexo.identifier,
            fecha: anexo.created_at.split('T')[0]
          }
          this.anexos.push({...obj})
        })
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error leyendo Anexos')
      }
    )
  }

}
