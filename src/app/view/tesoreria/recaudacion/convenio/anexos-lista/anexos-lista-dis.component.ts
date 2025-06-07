import { Component, OnInit, ViewChild, Input } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';


import { AnexoListaService } from './anexo-lista.service';
import { ModalAnexoComponent } from 'src/app/view/administracion/tramites/tramite/modal-anexo/modal-anexo.component';


@Component({
standalone: false,
  selector: 'app-anexos-lista-dis',
  templateUrl: './anexos-lista-dis.component.html',
  styleUrls: ['./anexos-lista.component.scss']
})
export class AnexosListaComponentDis implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  fTitle = 'Listado de Anexos'
  @Input() dataUser: any
  @Input() permissions: any
  @Input() tipo: any
  @Input() identifier: any
  @Input() archivo: any;
  
  anexos = [];

  constructor(
    private commonService: CommonService, 
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiService: AnexoListaService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    
    this.commonVarService.contribAnexoLoad2.asObservable().subscribe(
      (res: any) => {
        this.lcargando.ctlSpinner(true);
        (this as any).mensajeSpinner = 'Cargando Anexos ...'
        
        // console.log('anexos', res);
        let data = {
         // module: this.permissions.id_modulo,
          module: 19,
          component: myVarGlobals.fConvenio,
          identifier: res.id_cliente,
          custom1: this.archivo

        }

        console.log(data);
        if(res.condi == 'dis'||res.condi == 'all'){
          console.log('Anexo Discapa', res.condi, data);
          this.apiService.getAnexos(data).subscribe(
            (res: any) => {
              console.log('Anexo Contribuyente',res)
              this.anexos = [];
              res.data.forEach(e => {
                let o = {
                  id_anexo: e.id_anexos,
                  nombre: e.original_name,
                  extension: e.original_extension,
                  storage: e.storage,
                  storageName: e.name,
                  identifier: e.identifier
                }
                this.anexos.push({...o})
              })
              console.log(res.data.length);
              if(res.data.length !=0){
                this.commonVarService.diableCargarDis.next({})
              }
              this.lcargando.ctlSpinner(false)
            },
            (err: any) => {
              console.log(err)
              this.toastr.error('Error cargando Anexos', this.fTitle)
            }
          )
        }
        
      }
    )

    this.commonVarService.deleteAnexos.asObservable().subscribe(
      (res)=>{
        this.deleteSinConfirmar(this.anexos[0])
      }
    )

    this.commonVarService.clearAnexos.asObservable().subscribe(
      (res)=>{
        this.anexos = [];
      }
    )



  }

  ngOnInit(): void {
    // console.log(this.permissions);
    
    setTimeout(() => {
      this.cargarArchivo()
      console.log(this.identifier);
    }, 500);
  }

  cargarArchivo(){

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Anexos ...'

    let data = {
      module: 19,
      component: myVarGlobals.fConvenio,
      identifier: this.identifier
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo Contribuyente',res)
        res.data.forEach(e => {
          let o = {
            id_anexo: e.id_anexos,
            nombre: e.original_name,
            extension: e.original_extension,
            storage: e.storage,
            storageName: e.name,
            identifier: e.identifier
          }
          this.anexos.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length ==0){
          this.commonVarService.diableCargarDis.next({})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  deleteSinConfirmar(anexo){
    let data = {
      // Data del archivo
      id_anexo: anexo.id_anexo,
      component: myVarGlobals.fConvenio,
      module: this.permissions.id_modulo,
      identifier: anexo.identifier,
      // Datos para registro en Bitacora
      // cambiar con el que haga despues para rentas
      id_controlador: myVarGlobals.fConvenio,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Borrado de Anexo ${anexo.id_anexo}`,
      ip: this.commonService.getIpAddress()
    }

    // (this as any).mensajeSpinner = 'Eliminando anexo'
    // this.lcargando.ctlSpinner(true);

    this.apiService.deleteAnexo(data).subscribe(
      res => {
        // console.log(res);
        // this.lcargando.ctlSpinner(false)
        this.anexos = this.anexos.filter(a => a !== anexo)  // Quita el anexo de la lista
        this.commonVarService.diableCargarDis.next({})
        // Swal.fire({
        //   title: this.fTitle,
        //   text: 'Anexo eliminado con exito',
        //   icon: 'success'
        // })
      },
      err => {
        // this.lcargando.ctlSpinner(false)
        console.log(err)
        // this.toastr.error(err.error.message, 'Error eliminando Anexo')
      }
    )
  }


  deleteAnexo(anexo) {
    // Solicita confirmacion antes de eliminar un Anexo
    console.log(anexo);
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
            component: myVarGlobals.fConvenio,
            module: this.permissions.id_modulo,
            identifier: anexo.identifier,
            // Datos para registro en Bitacora
            // cambiar con el que haga despues para rentas
            id_controlador: myVarGlobals.fConvenio,  // TODO: Actualizar cuando formulario ya tenga un ID
            accion: `Borrado de Anexo ${anexo.id_anexo}`,
            ip: this.commonService.getIpAddress()
          };
      
          (this as any).mensajeSpinner = 'Eliminando anexo'
          this.lcargando.ctlSpinner(true);
      
          this.apiService.deleteAnexo(data).subscribe(
            res => {
              console.log(res);
              this.lcargando.ctlSpinner(false)
              this.anexos = this.anexos.filter(a => a !== anexo)  // Quita el anexo de la lista
              this.commonVarService.diableCargarDis.next({})
              Swal.fire({
                title: this.fTitle,
                text: 'Anexo eliminado con éxito',
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
        console.log(resultado);
        const dialogRef = this.confirmationDialogService.openDialogMat(ModalAnexoComponent, {
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
    // Cargar anexos correspondietnes

  }

}

