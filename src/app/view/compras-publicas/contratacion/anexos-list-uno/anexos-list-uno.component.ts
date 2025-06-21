import { Component, OnInit, ViewChild, Input,Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';
import moment from 'moment';

import { ContratacionService } from '../contratacion.service';

import { AnexoListUnoService } from './anexo-list-uno.service';
import { ModalAnexoComponent } from 'src/app/view/administracion/tramites/tramite/modal-anexo/modal-anexo.component';


@Component({
standalone: false,
  selector: 'app-anexos-list-uno',
  templateUrl: './anexos-list-uno.component.html',
  styleUrls: ['./anexos-list-uno.component.scss']
})
export class AnexosListUnoComponentDis implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  fTitle = 'Listado de Anexos'
  @Input() dataUser: any
  @Input() permissions: any
  @Input() tipo: any
  @Input() identifier: any
  @Input() archivo: any;
  
  anexos = [];

  fileList : FileList;
  date: any;


  firstday: any;
  today: any;
  tomorrow: any;
  fecha_hasta: any;
  lastday: any;

  @Output()
  sendDate = new EventEmitter<any>()

  constructor(
    private commonService: CommonService, 
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiService: AnexoListUnoService,
    private confirmationDialogService: ConfirmationDialogService,
    private contraService: ContratacionService
  ) {

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
      
    }, 50);
  }

  cargarArchivo(){
    console.log(this.tipo)
    this.anexos = [];

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: this.tipo
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo Contribuyente',res)
        console.log(res.data)
        if(res.data.length > 0 ){
          this.date = res.data[0].custom2
        }
     
        res.data.forEach(e => {
          let o = {
            id_anexo: e.id_anexos,
            nombre: e.original_name,
            extension: e.original_extension,
            storage: e.storage,
            storageName: e.name,
            identifier: e.identifier,
            fecha:e.custom2 
          }
          this.anexos.push({...o})

          //this.sendDate.emit(e.custom2)
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
  cargaArchivo2(archivos, custom1) {
    let fileList: FileList

    if (archivos.length > 0) {
      fileList = archivos
      this.fileList = fileList
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + fileList.length + ' archivo(s).', 'Anexos de Contratación')
      }, 50)
      // console.log(this.fileList)
    }


  }

  validacionArchivo() {

    if (this.date == null || this.date == undefined) {
      this.toastr.info("Debe ingresar una fecha para el anexo")
      return;
    }else {
      this.uploadFile()
    }

  }

  uploadFile() {
    console.log('Presionado una vez');
    let date: any = null;
    date = this.date

    let data = {
      // Informacion para almacenamiento de anexo
      module: 20,
      component: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.identifier,
      custom1: this.tipo,
      custom2: date,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Ticket ${this.identifier}`,
      ip: this.commonService.getIpAddress()
    }

    let fileList: FileList

    fileList = this.fileList

    for (let i = 0; i < fileList.length; i++) {
      console.log('File', data);
      this.UploadService(fileList[i], data, null);
    }
    if (this.tipo != '') {
      this.fileList = undefined
    }
    this.lcargando.ctlSpinner(false)

  }
UploadService(file, payload?: any, custom1?: any): void {
    let cont = 0
    console.log('Se ejecuto con:', payload);
    this.contraService.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {
      this.cargarArchivo()
     // this.commonVrs.contribAnexoLoad.next({ id_cliente: this.listaSolicitudes['id_solicitud'], condi: 'dis', custom1: custom1 })
      setTimeout(() => {
        this.toastr.info('Carga exitosa', 'Anexos de Contratación')
      }, 10)
    })
  }
  

  deleteSinConfirmar(anexo){
    let data = {
      // Data del archivo
      id_anexo: anexo.id_anexo,
      component: myVarGlobals.fContratacion,
      module: 20,
      identifier: anexo.identifier,
      // Datos para registro en Bitacora
      // cambiar con el que haga despues para rentas
      id_controlador: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
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
            component: myVarGlobals.fContratacion,
            module: 20,
            identifier: anexo.identifier,
            // Datos para registro en Bitacora
            // cambiar con el que haga despues para rentas
            id_controlador: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
            accion: `Borrado de Anexo ${anexo.id_anexo}`,
            ip: this.commonService.getIpAddress()
          }
          console.log(data);
          (this as any).mensajeSpinner = 'Eliminando anexo'
          this.lcargando.ctlSpinner(true);
      
          this.apiService.deleteAnexo(data).subscribe(
            (res: any) => {
              console.log(res);
              this.lcargando.ctlSpinner(false)

              this.anexos = this.anexos.filter(a => a !== anexo)
              this.date = undefined
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

