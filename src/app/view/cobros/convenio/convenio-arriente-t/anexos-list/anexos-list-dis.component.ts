import { Component, OnInit, ViewChild, Input } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';


import { AnexoListService } from './anexo-list.service';
import { ModalAnexoComponent } from 'src/app/view/administracion/tramites/tramite/modal-anexo/modal-anexo.component';


@Component({
standalone: false,
  selector: 'app-anexos-list-dis',
  templateUrl: './anexos-list-dis.component.html',
  styleUrls: ['./anexos-list.component.scss']
})
export class AnexosListComponentDis implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  fTitle = 'Listado de Anexos'
  @Input() dataUser: any
  @Input() permissions: any
  @Input() tipo: any

  @Input() identifier: any
  @Input() archivo: any;
  
  anexos = [];
  anexosEM = [];
 

  constructor(
    private commonService: CommonService, 
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiService: AnexoListService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    
    this.commonVarService.contribAnexoLoad.asObservable().subscribe(
      (res: any) => {
        this.lcargando.ctlSpinner(true);
        (this as any).mensajeSpinner = 'Cargando Anexos ...'
        if(this.tipo == 'EM'){
          this.cargarArchivoEM()
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
        this.anexos = []
      }
    )



  }

  ngOnInit(): void {
    // console.log(this.permissions);
    
    setTimeout(() => {

      if(this.tipo == 'EM'){
        this.cargarArchivoEM()
      }
      
      console.log(this.identifier);
      
    }, 500);
  }

  cargarArchivo(){
    console.log(this.tipo)
    this.anexos = []
    this.anexosEM = []
   
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'EM'
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

  cargarArchivoEM(){
    this.anexos = []
    this.anexosEM = []
    

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'EM'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo EM',res)
        if(res.data.length != 0){
          this.commonVarService.selectAnexo.next(res.data[0])
        }

        res.data.forEach(e => {
          

          let o = {
            id_anexo: e.id_anexos,
            nombre: e.original_name,
            extension: e.original_extension,
            storage: e.storage,
            storageName: e.name,
            identifier: e.identifier
          }
          this.anexosEM.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'EM'})
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
              if(this.tipo == 'EM'){                
                this.anexosEM = this.anexosEM.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'EM',custom2: '' });
              }
             

                // Quita el anexo de la lista
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

