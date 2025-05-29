import { Component, OnInit, ViewChild, Input,Output, EventEmitter } from '@angular/core';
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
  msgSpinner: string
  fTitle = 'Listado de Anexos'
  @Input() dataUser: any
  @Input() permissions: any
  @Input() tipo: any
  @Input() identifier: any
  @Input() archivo: any;
  
  anexos = [];
  anexosEM = [];
  anexosTR = [];
  anexosPL = [];
  anexosPB = [];
  anexosPR = [];
  anexosRP = [];
  anexosPP = [];
  anexosAO = [];
  anexosNG = [];
  anexosAJ = [];
  anexosPO = [];
  anexosAC = [];
  anexosPV = [];
  anexosDE = [];
  anexosEX = [];
  anexosCO = [];
  anexosCE = [];

  @Output()
  sendDate = new EventEmitter<any>()

  constructor(
    private commonService: CommonService, 
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private apiService: AnexoListService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    
    this.commonVarService.contribAnexoLoad.asObservable().subscribe(
      (res: any) => {
        this.lcargando.ctlSpinner(true)
        this.msgSpinner = 'Cargando Anexos ...'
        if(this.tipo == 'EM'){
          this.cargarArchivoEM()
        }else if(this.tipo == 'TR'){
          this.cargarArchivoTR()
        }else if(this.tipo == 'PL'){
          this.cargarArchivoPL()
          
        }else if(this.tipo == 'PB'){
          this.cargarArchivoPB()
        }else if(this.tipo == 'PR'){
          this.cargarArchivoPR()
        }else if(this.tipo == 'RP'){
          this.cargarArchivoRP()
        }else if(this.tipo == 'PP'){
          this.cargarArchivoPP()
        }else if(this.tipo == 'AO'){
          this.cargarArchivoAO()
        }else if(this.tipo == 'NG'){
          this.cargarArchivoNG()
        }else if(this.tipo == 'AJ'){
          this.cargarArchivoAJ()
        }else if(this.tipo == 'PO'){
          this.cargarArchivoPO()
        }else if(this.tipo == 'AC'){
          this.cargarArchivoAC()
        }
        else if(this.tipo == 'PV'){
          this.cargarArchivoPV()
        }else if(this.tipo == 'DE'){
          this.cargarArchivoDE()
        }else if(this.tipo == 'EX'){
          this.cargarArchivoEX()
        }else if(this.tipo == 'CO'){
          this.cargarArchivoCO()
        }else if(this.tipo == 'CE'){
          this.cargarArchivoCE()
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
      }else if(this.tipo == 'TR'){
        this.cargarArchivoTR()
      }else if(this.tipo == 'PL'){
        this.cargarArchivoPL()
      }else if(this.tipo == 'PB'){
        this.cargarArchivoPB()
      }else if(this.tipo == 'PR'){
        this.cargarArchivoPR()
      }else if(this.tipo == 'RP'){
        this.cargarArchivoRP()
      }else if(this.tipo == 'PP'){
        this.cargarArchivoPP()
      }else if(this.tipo == 'AO'){
        this.cargarArchivoAO()
      }else if(this.tipo == 'NG'){
        this.cargarArchivoNG()
      }else if(this.tipo == 'AJ'){
        this.cargarArchivoAJ()
      }else if(this.tipo == 'PO'){
        this.cargarArchivoPO()
      }else if(this.tipo == 'AC'){
        this.cargarArchivoAC()
      }else if(this.tipo == 'PV'){
        this.cargarArchivoPV()
      }else if(this.tipo == 'DE'){
        this.cargarArchivoDE()
      } else if(this.tipo == 'EX'){
        this.cargarArchivoEX()
      }else if(this.tipo == 'CO'){
        this.cargarArchivoCO()
      }else if(this.tipo == 'CE'){
        this.cargarArchivoCE()
      }

      console.log(this.anexosTR);      

      console.log(this.identifier);
      
    }, 50);
  }

  cargarArchivo(){
    console.log(this.tipo)
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];

    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

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

  cargarArchivoEM(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

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
  cargarArchivoTR(){
    console.log('aqui', this.tipo)
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'TR'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo TR',res)
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
          this.anexosTR.push({...o})
        })
        console.log('Anexo TR',this.anexosTR);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({ custom1: 'TR'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }


  cargarArchivoPL(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'PL'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
        //this.commonVarService.selectAnexo.next(res.data[0])
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
          this.anexosPL.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({ custom1: 'PL'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoPB(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];

    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'PB'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
        //this.commonVarService.selectAnexo.next(res.data[0])
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
          this.anexosPB.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({ custom1: 'PB'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoPR(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];

    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'PR'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
       // this.commonVarService.selectAnexo.next(res.data[0])
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
          this.anexosPR.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({ custom1: 'PR'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoRP(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'RP'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
       // this.commonVarService.selectAnexo.next(res.data[0])
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
          this.anexosRP.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'RP'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoPP(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'PP'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
        //this.commonVarService.selectAnexo.next(res.data[0])
        if(res.data.length != 0){
          //this.commonVarService.selectAnexo.next(res.data[0])
          this.sendDate.emit(res.data[0]);
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
          this.anexosPP.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({ custom1: 'PP'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoAO(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'AO'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
        //this.commonVarService.selectAnexo.next(res.data[0])
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
          this.anexosAO.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'AO'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoNG(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'NG'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
        //this.commonVarService.selectAnexo.next(res.data[0])
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
          this.anexosNG.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({ custom1: 'NG'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoAJ(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'AJ'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
        res.data.forEach(e => {
          let o = {
            id_anexo: e.id_anexos,
            nombre: e.original_name,
            extension: e.original_extension,
            storage: e.storage,
            storageName: e.name,
            identifier: e.identifier
          }
          this.anexosAJ.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'AJ'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoPO(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'PO'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
        res.data.forEach(e => {
          let o = {
            id_anexo: e.id_anexos,
            nombre: e.original_name,
            extension: e.original_extension,
            storage: e.storage,
            storageName: e.name,
            identifier: e.identifier
          }
          this.anexosPO.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'PO'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoAC(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'AC'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PL',res)
        //this.commonVarService.selectAnexo.next(res.data[0])
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
          this.anexosAC.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({ custom1: 'AC'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoPV(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'PV'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo PV',res)
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
          this.anexosPV.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'PV'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoDE(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'DE'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo DE',res)
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
          this.anexosDE.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'DE'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }
  cargarArchivoEX(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];


    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'EX'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo EX',res)
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
          this.anexosEX.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'EX'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoCO(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];

    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'CO'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo CO',res)
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
          this.anexosCO.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'CO'})
        }
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.toastr.error('Error cargando Anexos', this.fTitle)
      }
    )
  }

  cargarArchivoCE(){
    this.anexos = []
    this.anexosEM = []
    this.anexosPL = []
    this.anexosTR = []
    this.anexosPB = [];
    this.anexosPR = [];
    this.anexosRP = [];
    this.anexosPP = [];
    this.anexosAO = [];
    this.anexosNG = [];
    this.anexosAJ = [];
    this.anexosPO = [];
    this.anexosAC = [];
    this.anexosPV = [];
    this.anexosDE = [];
    this.anexosEX = [];
    this.anexosCO = [];
    this.anexosCE = [];

    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cargando Anexos ...'

    let data = {
      module: 20,
      component: myVarGlobals.fContratacion,
      identifier: this.identifier,
      custom1: 'CE'
    }
    console.log(data);
    this.apiService.getAnexos(data).subscribe(
      (res: any) => {
        console.log('Anexo CE',res)
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
          this.anexosCE.push({...o})
        })
        console.log(res.data.length);
        if(res.data.length !=0){
          this.commonVarService.diableCargarDis.next({custom1: 'CE'})
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

    // this.msgSpinner = 'Eliminando anexo'
    // this.lcargando.ctlSpinner(true)

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
          console.log(data)
          this.msgSpinner = 'Eliminando anexo'
          this.lcargando.ctlSpinner(true)
      
          this.apiService.deleteAnexo(data).subscribe(
            (res: any) => {
              console.log(res);
              this.lcargando.ctlSpinner(false)
              if(this.tipo == 'EM'){                
                this.anexosEM = this.anexosEM.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'EM',custom2: '' });
              }else if(this.tipo == 'TR'){
                this.anexosTR = this.anexosTR.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'TR',custom2: '' });
              }else if(this.tipo == 'PL'){
                this.anexosPL = this.anexosPL.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'PL',custom2: '' });
              }else if(this.tipo == 'PB'){
                this.anexosPB = this.anexosPB.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'PB',custom2: '' });
              }else if(this.tipo == 'PR'){
                this.anexosPR = this.anexosPR.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'PR',custom2: '' });
              }else if(this.tipo == 'RP'){
                this.anexosRP = this.anexosRP.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'RP',custom2: '' });
              }else if(this.tipo == 'PP'){
                this.anexosPP = this.anexosPP.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'PP',custom2: '' });
              }else if(this.tipo == 'AO'){
                this.anexosAO = this.anexosAO.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'AO',custom2: '' });
              }else if(this.tipo == 'NG'){
                this.anexosNG = this.anexosNG.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'NG',custom2: '' });
              }else if(this.tipo == 'AJ'){
                this.anexosAJ = this.anexosAJ.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'AJ',custom2: '' });
              }
              else if(this.tipo == 'PO'){
                this.anexosPO = this.anexosPO.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'PO',custom2: '' });
              }
              else if(this.tipo == 'AC'){
                this.anexosAC = this.anexosAC.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'AC',custom2: '' });
              }
              else if(this.tipo == 'PV'){
                this.anexosPV = this.anexosPV.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'PV',custom2: '' });
              }
              else if(this.tipo == 'EX'){
                this.anexosEX = this.anexosEX.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'EX',custom2: '' });
              }
              else if(this.tipo == 'CO'){
                this.anexosCO = this.anexosCO.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'CO',custom2: '' });
              }
              else if(this.tipo == 'CE'){
                this.anexosCE = this.anexosCE.filter(a => a !== anexo)
                this.commonVarService.selectAnexo.next({custom1: 'CE',custom2: '' });
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

