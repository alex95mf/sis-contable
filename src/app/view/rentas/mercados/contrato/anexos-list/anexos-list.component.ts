import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';

import { ContratoService } from '../contrato.service';

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
  dataUser: any
  permissions: any
  
  anexos = []

  constructor(
    private commonService: CommonService, 
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiService: ContratoService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.commonVarService.clearContratoForm.asObservable().subscribe(
      (_) => {
        this.anexos = []
      }
    )

    this.commonVarService.editContrato.asObservable().subscribe(
      res => {
        console.log(res);
        if (res['anexos']) {
          this.cargaAnexosTabla(res['anexos'])
        }
      }
    )
    this.apiService.showAnexos$.subscribe(
      (res: any) => {
        if (res.anexos) {
          this.cargaAnexosTabla(res.anexos)
        }
      }
    )
    this.commonService.saveContrato.asObservable().subscribe(
      res => {
        this.mensajeSpinner = 'Actualizando lista de anexos'
        this.lcargando.ctlSpinner(true)
        setTimeout(() => {
          this.apiService.getAnexosContrato({id_contrato: res.id_contrato, component: myVarGlobals.fRenContrato}).subscribe(
            res => {
              // console.log(res['data'])
              this.cargaAnexosTabla(res['data'])
              this.lcargando.ctlSpinner(false)
            },
            err => {
              this.lcargando.ctlSpinner(false)
              console.log(err)
              this.toastr.error(err.error.message, 'Error actualizando Anexos')
            }
          )
        }, 2500)
        
      }
    )
  }

  ngOnInit(): void {
  }

  cargaAnexosTabla(params: any[]) {
    this.anexos = []
    params.forEach(a => {
      let anexo = {
        id: a.id_anexos,
        nombre: a.original_name,
        storageName: a.name,
        extension: a.original_extension,
        storage: a.storage,
        original_type: a.original_type
      }
      this.anexos.push({...anexo})
    })
  }

  deleteAnexo(anexo) {
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
            anexo: anexo
          }
      
          this.mensajeSpinner = 'Eliminando anexo'
          this.lcargando.ctlSpinner(true)
      
          this.apiService.deleteAnexo(data).subscribe(
            res => {
              this.lcargando.ctlSpinner(false)
              this.anexos = this.anexos.filter(a => a !== anexo)
              // console.log(res['data'])
              Swal.fire({
                title: this.fTitle,
                text: res['message'],
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

  verAnexo(anexo) {
    console.log(anexo);
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
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

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

}
