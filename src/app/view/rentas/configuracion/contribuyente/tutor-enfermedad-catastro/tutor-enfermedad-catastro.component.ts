import { Component, Input, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ContribuyenteService } from '../contribuyente.service';
import * as myVarGlobals from "../../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-tutor-enfermedad-catastro',
  templateUrl: './tutor-enfermedad-catastro.component.html',
  styleUrls: ['./tutor-enfermedad-catastro.component.scss']
})
export class TutorEnfermedadCatastroComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  validaciones = new ValidacionesFactory;

  //Objetos
  contribuyenteTutorEnfermedad: any = {
    ca_tiene_apoderado: false,
    ca_cedula: null,
    ca_primer_nombre: null,
    ca_segundo_nombre: null,
    ca_primer_apellido: null,
    ca_segundo_apellido: null,
    ca_parentezco: null,
    ca_tipo_enfermedad: null,
    ca_porcentaje_enfermedad: null,
    ca_resolucion: null,
    ca_fecha_resolucion: null,
    ca_persona_autoriza: null,
  }


  //Variables cargar anexo
  cargarAnexo: boolean = true
  // tutor: boolean;
  anexo: any = undefined
  anexoIdentificador: any = undefined

  detalle_edit: any;

  fileList: FileList;

  catalog: any = {};

  @Input() permissions: any;

  @Input() dataUser: any;

  @Input() validadorNt: any

  @Output() checkTutorEnfEvent = new EventEmitter<any>();

  constructor(
    private commonServices: CommonService,
    private contribuyenteSrv: ContribuyenteService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      (res) => {
        this.contribuyenteTutorEnfermedad["detalle"] = [];
        // this.contribuyenteTutor["ap_tiene_apoderado"] = this.tutor;
        this.contribuyenteTutorEnfermedad['Update'] = 'tutorEnfermedad'
        this.contribuyenteTutorEnfermedad = { ...this.contribuyenteTutorEnfermedad, ...res.data }
        if (this.contribuyenteTutorEnfermedad.ca_tiene_apoderado && this.contribuyenteTutorEnfermedad.ca_cedula) {
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
        this.contribuyenteTutorEnfermedad = res.data
        this.permissions = res.permissions;
      }
    )
    this.commonVrs.disableCargarTutorEnf.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.anexo = res.anexo

        this.anexoIdentificador = res.identificador
        if(res.validacion){
          this.cargarAnexo = true;
        }else{
          this.cargarAnexo = false;
        }

        this.checkTutorEnfEvent.emit({check : this.contribuyenteTutorEnfermedad.ca_tiene_apoderado,datos: this.contribuyenteTutorEnfermedad,file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});
      }
    )

    this.commonVrs.clearContact.asObservable().subscribe(
      (res) => {
        this.ClearForm();
      }
    )
  }

  updateContribuyente() {
    this.contribuyenteTutorEnfermedad["ip"] = this.commonServices.getIpAddress();
    this.contribuyenteTutorEnfermedad["accion"] = `Actualización de contribuyente`;
    this.contribuyenteTutorEnfermedad["id_controlador"] = myVarGlobals.fContribuyente;

    if (this.detalle_edit != undefined) {
      this.contribuyenteTutorEnfermedad["detalle"] = this.detalle_edit.arraycontact;
      this.contribuyenteTutorEnfermedad["deleteContribuyente"] = this.detalle_edit.deleteContac;
      this.contribuyenteTutorEnfermedad["edit"] = true;
    } else {
      this.contribuyenteTutorEnfermedad["edit"] = false;
    }

    this.contribuyenteSrv.updateContribuyente(this.contribuyenteTutorEnfermedad).subscribe(
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


  fillCatalog() {
    // console.log('Catalogo');
    // this.lcargando.ctlSpinner(true);
    // (this as any).mensajeSpinner = "Cargando Catalogs";
    let data = {
      params: "'REN_DISCAPACIDAD', 'REN_PARENTEZCO'",
    };
    this.contribuyenteSrv.getCatalogs(data).subscribe(
      (res) => {
        // console.log('catalogo',res);
        this.catalog.ren_discapacidad = res['data']['REN_DISCAPACIDAD'];
        this.catalog.ca_parentezco = res["data"]["REN_PARENTEZCO"];

        // console.log(this.catalog);
        // this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }

  

  onlyNumber(event):boolean{
    // console.log(event);
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }


  ClearForm() {
    this.contribuyenteTutorEnfermedad = {
      ca_tiene_apoderado: false,
      ca_cedula: null,
      ca_primer_nombre: null,
      ca_segundo_nombre: null,
      ca_primer_apellido: null,
      ca_segundo_apellido: null,
      ca_parentezco: null,
      ca_tipo_enfermedad: null,
      ca_porcentaje_enfermedad: null,
      ca_resolucion: null,
      ca_fecha_resolucion: null,
      ca_persona_autoriza: null,
    };
    // this.validadorNt = false
    this.detalle_edit = undefined;
    // this.tutor = false
    this.fileList = undefined
    this.anexo=  undefined
    
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
      this.checkTutorEnfEvent.emit({check : this.contribuyenteTutorEnfermedad.ca_tiene_apoderado,datos: this.contribuyenteTutorEnfermedad,file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});

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
      component: myVarGlobals.fContribuyenteTutorEnfermedad,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.contribuyenteTutorEnfermedad.id_cliente,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.contribuyenteTutorEnfermedad.id_cliente}`,
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
    this.contribuyenteSrv.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {
      this.commonVrs.contribAnexoLoad.next({ id_cliente: this.contribuyenteTutorEnfermedad.id_cliente, condi: 'tutor' })
      this.checkTutorEnfEvent.emit({check : this.contribuyenteTutorEnfermedad.ca_tiene_apoderado,datos: this.contribuyenteTutorEnfermedad,file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});

    })

    // subscribe(
    //   res => {

    //     this.commonVrs.contribAnexoLoad.next({ id_cliente: this.contribuyenteTutor.id_cliente, condi: 'tutor' })

    //   },
    //   err => {
    //     console.log('Error');
    //     this.toastr.info(err.error.message, 'Error cargando Anexos');
    //     console.log(err.error.message);
    //   })
  }

  ngOnInit(): void {
    this.fillCatalog()
  }

  selectedCheck() {
   
    this.checkTutorEnfEvent.emit({check : this.contribuyenteTutorEnfermedad.ca_tiene_apoderado,datos: this.contribuyenteTutorEnfermedad,  file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });
  }

}
