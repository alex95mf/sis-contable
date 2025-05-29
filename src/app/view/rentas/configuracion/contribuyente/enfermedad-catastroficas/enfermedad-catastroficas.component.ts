import { Component, Input,Output, OnInit,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ContribuyenteService } from '../contribuyente.service';
import * as myVarGlobals from "../../../../../global";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-enfermedad-catastroficas',
  templateUrl: './enfermedad-catastroficas.component.html',
  styleUrls: ['./enfermedad-catastroficas.component.scss']
})
export class EnfermedadCatastroficasComponent implements OnInit {

  message: string = "Hola Mundo!";

  contibuyenteEnfermedad: any ={
    en_tiene_enfermedad: false,
    en_tipo_enfermedad: null,
    en_resolucion: null,
    en_fecha_resolucion: null,
    en_persona_autoriza: null
  }

  //Variable de button cargar
  cargarAnexo: boolean = true;

  validaciones = new ValidacionesFactory;



  fileList: FileList;

  anexo: any = undefined
  anexoIdentificador: any = undefined

  catalog: any = {};

  detalle_edit: any;

  @Input() permissions: any;

  @Input() dataUser: any;

  @Input() validadorNt: any

  @Output() checkEvent = new EventEmitter<any>();
  

  constructor(
    private commonServices: CommonService,
    private contribuyenteSrv: ContribuyenteService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      (res) => {
        this.cargarAnexo = true
        this.contibuyenteEnfermedad["detalle"] = [];
        // this.contribuyenteDis["di_tiene_discpacidad"] = this.discapcidad;
        this.contibuyenteEnfermedad['Update'] = 'enfermedad'
        this.contibuyenteEnfermedad = { ...this.contibuyenteEnfermedad, ...res.data }
        // console.log(this.contribuyente);
    
        
        if (this.contibuyenteEnfermedad.en_tiene_enfermedad && this.contibuyenteEnfermedad.en_tipo_enfermedad) {
          console.log('Objeto enfermedadCata', this.contibuyenteEnfermedad);
          this.updateContribuyente(this.contibuyenteEnfermedad);
        }

        // this.permissions = res.permissions;
        this.dataUser = res.dataUser
        
        // this.uploadFile()
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
        this.contibuyenteEnfermedad = res.data;
        this.permissions = res.permissions;
      }
    )

    this.commonVrs.disableCargarEnf.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.anexo = res.anexo
        this.anexoIdentificador = res.identificador
        if(res.validacion){
          this.cargarAnexo = true;
        }else{
          this.cargarAnexo = false;
        }

        this.checkEvent.emit({
          check : this.contibuyenteEnfermedad.en_tiene_enfermedad,
          datos: this.contibuyenteEnfermedad, 
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
 

  updateContribuyente(contribuyenteDis) {
    console.log(this.contibuyenteEnfermedad);
    contribuyenteDis["ip"] = this.commonServices.getIpAddress();
    contribuyenteDis["accion"] = `Actualización de contribuyente`;
    contribuyenteDis["id_controlador"] = myVarGlobals.fContribuyenteEnfermedad;

    if (this.detalle_edit != undefined) {
      contribuyenteDis["detalle"] = this.detalle_edit.arraycontact;
      contribuyenteDis["deleteContribuyente"] = this.detalle_edit.deleteContac;
      contribuyenteDis["edit"] = true;
    } else {
      contribuyenteDis["edit"] = false;
    }

    this.contribuyenteSrv.updateContribuyente(contribuyenteDis).subscribe(
      (res) => {
        console.log('Update enfermedad', res);
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


  


  ClearForm() {
    this.contibuyenteEnfermedad = {
      en_tiene_enfermedad: false,
      en_tipo_enfermedad: null,
      en_resolucion: null,
      en_fecha_resolucion: null,
      en_persona_autoriza: null
    };
    this.detalle_edit = undefined;
    // this.validadorNt = false
    this.fileList = undefined
    this.anexo=  undefined
  }


  fillCatalog() {
    // console.log('Catalogo');
    // this.lcargando.ctlSpinner(true);
    // this.mensajeSppiner = "Cargando Catalogs";
    let data = {
      params: "'REN_DISCAPACIDAD'",
    };
    this.contribuyenteSrv.getCatalogs(data).subscribe(
      (res) => {
        // console.log('catalogo',res);
        this.catalog.ren_discapacidad = res['data']['REN_DISCAPACIDAD'];

        // console.log(this.catalog);
        // this.lcargando.ctlSpinner(false);
      },
      (error) => {
        // this.lcargando.ctlSpinner(false);
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
      this.checkEvent.emit({check : this.contibuyenteEnfermedad.en_tiene_enfermedad,datos: this.contibuyenteEnfermedad, file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});

    }
  }


  /**
  * Se encarga de enviar los archivos al backend para su almacenado
  * @param data Informacion del Formulario de Inspeccion (CAB)
  */
  uploadFile() {
    console.log('Presionado una vez');
    let data = {
      // Informacion para almacenamiento de anexo
      module: this.permissions.id_modulo,
      component: myVarGlobals.fContribuyenteEnfermedad,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.contibuyenteEnfermedad.id_cliente,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.contibuyenteEnfermedad.id_cliente}`,
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
    let cont = 0
    console.log('Se ejecuto');
    this.contribuyenteSrv.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {
      this.commonVrs.contribAnexoLoad.next({ id_cliente: this.contibuyenteEnfermedad.id_cliente, condi: 'dis' })
      this.checkEvent.emit({enfermedad : this.contibuyenteEnfermedad.en_tiene_enfermedad, file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });
    })
  }


  

  ngOnInit(): void {

    this.contibuyenteEnfermedad.en_tiene_enfermedad= false
    this.fillCatalog()
  }

  selectedCheck() {
   
    this.checkEvent.emit({check : this.contibuyenteEnfermedad.en_tiene_enfermedad,datos: this.contibuyenteEnfermedad,  file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });
  }

  
  

}
