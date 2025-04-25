import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ContribuyenteService } from '../contribuyente.service';
import * as myVarGlobals from "../../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { EventValidationErrorMessage } from 'calendar-utils';

@Component({
  selector: 'app-pertenece-cooperativa',
  templateUrl: './pertenece-cooperativa.component.html',
  styleUrls: ['./pertenece-cooperativa.component.scss']
})
export class PerteneceCooperativaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;

  //Objeto
  contribuyenteCoo: any = {
    ta_pertenece_cooperativa: null,
    ta_ruc: null,
    ta_nombre_cooperativa: null,
    ta_resolucion: null,
    ta_fecha_resolucion: null,
    ta_persona_autoriza: null,
  }




  //CArgar booton
  cargarAnexo: boolean = true;

  anexo: any = undefined
  anexoIdentificador: any = undefined

  fileList: FileList;

  detalle_edit: any;

  @Input() permissions: any;

  @Input() dataUser: any;

  @Input() validadorNt: any

  @Output() checkCoopEvent = new EventEmitter<any>();



  constructor(
    private commonServices: CommonService,
    private contribuyenteSrv: ContribuyenteService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      (res) => {
        this.cargarAnexo = true
        this.contribuyenteCoo["detalle"] = [];
        // this.contribuyenteCoo["ta_pertenece_cooperativa"] = this.perteneceTax;
        this.contribuyenteCoo['Update'] = 'coop'
        this.contribuyenteCoo = { ...this.contribuyenteCoo, ...res.data }
        if (this.contribuyenteCoo.ta_pertenece_cooperativa && this.contribuyenteCoo.ta_ruc) {
          this.updateContribuyente();
        }

        this.permissions = res.permissions;
        this.dataUser = res.dataUser
        if (this.fileList) {
          this.uploadFile()
        }
      }
    )


    this.commonVrs.clearContribu.asObservable().subscribe(
      (res) => {
        this.ClearForm();
      }
    )

    this.commonVrs.searchDiscapContribu.asObservable().subscribe(
      (res) => {
        this.cargarAnexo = true
        this.contribuyenteCoo = res.data
        this.permissions = res.permissions;
      }
    )

    this.commonVrs.disableCargarCoop.asObservable().subscribe(
      (res)=>{
        console.log(res)
        this.anexo = res.anexo
        this.anexoIdentificador = res.identificador
        if(res.validacion){
          this.cargarAnexo = true;
        }else{
          this.cargarAnexo = false;
        }

        this.checkCoopEvent.emit({
          check : this.contribuyenteCoo.ta_pertenece_cooperativa,
          datos: this.contribuyenteCoo, 
          file: this.fileList, 
          anexo: this.anexo,
          identificador: this.anexoIdentificador
         });
      }
    )
    this.commonVrs.clearContact.asObservable().subscribe(
      (res) => {
        this.ClearForm();
      }
    )

  }


  updateContribuyente() {
    this.contribuyenteCoo["ip"] = this.commonServices.getIpAddress();
    this.contribuyenteCoo["accion"] = `Actualización de contribuyente`;
    this.contribuyenteCoo["id_controlador"] = myVarGlobals.fContribuyente;

    if (this.detalle_edit != undefined) {
      this.contribuyenteCoo["detalle"] = this.detalle_edit.arraycontact;
      this.contribuyenteCoo["deleteContribuyente"] = this.detalle_edit.deleteContac;
      this.contribuyenteCoo["edit"] = true;
    } else {
      this.contribuyenteCoo["edit"] = false;
    }

    this.contribuyenteSrv.updateContribuyente(this.contribuyenteCoo).subscribe(
      (res) => {
        console.log(res);
        if(this.fileList.length > 0){
          this.uploadFile()
        }
        this.toastr.success(res["message"]);
        this.ClearForm();

      },
      (error) => {
        console.log(error.error.message);
        this.toastr.info(error.error.message);
      }
    );
  }


  /**
   * Almacena en FileList los archivos a ser enviados al backend
   * @param archivos Archivo seleccionado
   */
  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Inspeccion')
      }, 50)
      // console.log(this.fileList)
      this.checkCoopEvent.emit({check : this.contribuyenteCoo.ta_pertenece_cooperativa,datos: this.contribuyenteCoo,  file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });

    }
  }


  /**
  * Se encarga de enviar los archivos al backend para su almacenado
  * @param data Informacion del Formulario de Inspeccion (CAB)
  */
  uploadFile() {
    let data = {
      // Informacion para almacenamiento de anexo
      module: this.permissions.id_modulo,
      component: myVarGlobals.fContribuyenteCoop,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.contribuyenteCoo.id_cliente,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.contribuyenteCoo.id_cliente}`,
      ip: this.commonServices.getIpAddress()
    }

    for (let i = 0; i < this.fileList.length; i++) {
      console.log('File', data);
      this.UploadService(this.fileList[i], data);
    }
    this.fileList = undefined
    // this.lcargando.ctlSpinner(false)
  }

  /**
   * Envia un archivo al backend
   * @param file Archivo
   * @param payload Metadata
   */
  UploadService(file, payload?: any): void {
    this.contribuyenteSrv.uploadAnexo(file, payload).toPromise().then(res=>{
      console.log('aqui',res);
    }).then(res=>{
      this.commonVrs.contribAnexoLoad.next({id_cliente: this.contribuyenteCoo.id_cliente, condi: 'coop'})
      this.checkCoopEvent.emit({check : this.contribuyenteCoo.ta_pertenece_cooperativa,datos: this.contribuyenteCoo,  file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });

    })
    
    
    
    
    // subscribe(
    //   res => {

    //     this.commonVrs.contribAnexoLoad.next({ id_cliente: this.contribuyenteCoo.id_cliente, condi: 'coop'})

    //   },
    //   err => {
    //     console.log('Error');
    //     this.toastr.info(err.error.message, 'Error cargando Anexos');
    //     console.log(err.error.message);
    //   })
  }

  

  onlyNumber(event):boolean{
    console.log(event);
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }


  ClearForm() {
    this.contribuyenteCoo = {
      ta_pertenece_cooperativa: false,
      ta_ruc: null,
      ta_nombre_cooperativa: null,
      ta_resolucion: null,
      ta_fecha_resolucion: null,
      ta_persona_autoriza: null,
    };
    // this.validadorNt = false
    this.detalle_edit = undefined;
    this.fileList = undefined
    this.anexo=  undefined

  }

  ngOnInit(): void {
  }
  selectedCheck() {
   
    this.checkCoopEvent.emit({check : this.contribuyenteCoo.ta_pertenece_cooperativa,datos: this.contribuyenteCoo,  file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });
  }

}
