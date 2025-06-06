import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';


import { AnexoListService } from './anexo-list.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
standalone: false,
  selector: 'app-anexos-list-dis',
  templateUrl: './anexos-list-dis.component.html',
  styleUrls: ['./anexos-list.component.scss']
})
export class AnexosListComponentDis implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  fTitle = 'Listado de Anexos'
  @Input() dataUser: any
  @Input() permissions: any
  @Input() tipo: any
  @Input() identifier: any
  @Input() mostrarEliminar: any;
  @Input() custom1: any;


  anexos = [];
  anexosCP = []
  //anexos
  onDestroy$: Subject<void> = new Subject();
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
        // console.log('anexos',res, this.permissions, this.dataUser);
        let data = {
          //module: this.permissions.id_modulo,
          module:20,
          component: myVarGlobals.fCompPubInfi,
          identifier: this.identifier,
          custom1:this.custom1

        }

        console.log(data);
        if(res.condi == 'infimas'){
          //console.log('Anexo Discapa', res.condi, data);
          this.apiService.getAnexos(data).subscribe(
            (res: any) => {
              console.log('Anexo ', this.custom1,res)
              this.anexos = res.data

              console.log(res.data.length);
              if(res.data.length ==0){
                // this.commonVarService.diableCargarDis.next({})
                this.commonVarService.compPubInfimas.next({validacion: false, custom1: this.custom1})
              }else{
                this.commonVarService.compPubInfimas.next({validacion: true, custom1: this.custom1})
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

    //this.commonVarService.clearAnexos.asObservable().subscribe(
  this.commonVarService.clearAnexos.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res)=>{
        this.anexos = []
      }
    )



  }

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
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
      //module: this.permissions.id_modulo,
      module: 20,
      component: myVarGlobals.fCompPubInfi,
      identifier: this.identifier,
      custom1: this.custom1
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo',this.custom1 ,res)
        this.anexos = res.data
        if(this.custom1 == res.data.custom1){
          this.anexosCP = res.data
        }else if(this.custom1 == res.data.custom1){

        }

        console.log(res.data.length);
        if(res.data.length ==0){
          this.commonVarService.diableCargarDis.next({})
          this.commonVarService.compPubInfimas.next({validacion: false, custom1: this.custom1})
        }else{
          this.commonVarService.compPubInfimas.next({validacion: true, custom1: this.custom1})
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
      component: myVarGlobals.fCompPubInfi,
      module: this.permissions.id_modulo,
      identifier: anexo.identifier,
      // Datos para registro en Bitacora
      // cambiar con el que haga despues para rentas
      id_controlador: myVarGlobals.fCompPubInfi,  // TODO: Actualizar cuando formulario ya tenga un ID
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
        this.commonVarService.compPubInfimas.next(false)



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
            id_anexo: anexo.id_anexos,
            component: myVarGlobals.fCompPubInfi,
            module: 20,
            identifier: anexo.identifier,
            // Datos para registro en Bitacora
            // cambiar con el que haga despues para rentas
            id_controlador: myVarGlobals.fCompPubInfi,  // TODO: Actualizar cuando formulario ya tenga un ID
            accion: `Borrado de Anexo ${anexo.id_anexo}`,
            ip: this.commonService.getIpAddress()
          };

          (this as any).mensajeSpinner = 'Eliminando anexo'
          this.lcargando.ctlSpinner(true);
          console.log()
          this.apiService.deleteAnexo(data).subscribe(
            res => {
              // console.log(res);
              this.lcargando.ctlSpinner(false)
              this.anexos = this.anexos.filter(a => a !== anexo)  // Quita el anexo de la lista
              this.commonVarService.diableCargarDis.next({})
              this.commonVarService.compPubInfimas.next({validacion: false, custom1: this.custom1})
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
      name: anexo.name
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

  /**
   * Descarga el anexo a la compu del usuario
   * @param anexo Anexo del Componente
   */
  descargarAnexo(anexo) {
    let data = {
      storage: anexo.storage,
      name: anexo.name
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

