import { Component, Input, OnInit, ViewChild,Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ContribuyenteService } from '../contribuyente.service';
import * as myVarGlobals from "../../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-tutor-apoderado',
  templateUrl: './tutor-apoderado.component.html',
  styleUrls: ['./tutor-apoderado.component.scss']
})
export class TutorApoderadoComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  validaciones = new ValidacionesFactory;

  //Objetos
  contribuyenteTutor: any = {
    ap_tiene_apoderado: false,
    ap_cedula: null,
    ap_primer_nombre: null,
    ap_segundo_nombre: null,
    ap_primer_apellido: null,
    ap_segundo_apellido: null,
    ap_catalogo: null,
    ap_tipo_discapacidad: null,
    ap_porcentaje_discapacidad: null,
    ap_resolucion: null,
    ap_fecha_resolucion: null,
    ap_persona_autoriza: null,
  }
  anexo: any = undefined
  anexoIdentificador: any = undefined

  //Variables cargar anexo
  cargarAnexo: boolean = true
  // tutor: boolean;

  detalle_edit: any;

  fileList: FileList;

  catalog: any = {};

  @Input() permissions: any;

  @Input() dataUser: any;

  @Input() validadorNt: any

  @Output() checkTutorApoEvent = new EventEmitter<any>();

  paginate: any;
  filter: any;

  constructor(
    private commonServices: CommonService,
    private contribuyenteSrv: ContribuyenteService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      (res) => {
        this.contribuyenteTutor["detalle"] = [];
        // this.contribuyenteTutor["ap_tiene_apoderado"] = this.tutor;
        this.contribuyenteTutor['Update'] = 'tutor'
        this.contribuyenteTutor = { ...this.contribuyenteTutor, ...res.data }
        if (this.contribuyenteTutor.ap_tiene_apoderado && this.contribuyenteTutor.ap_cedula) {
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
        this.contribuyenteTutor = res.data
        this.permissions = res.permissions;
      }
    )
    this.commonVrs.disableCargarTutor.asObservable().subscribe(
      (res)=>{
        console.log(res)
        this.anexo = res.anexo
        this.anexoIdentificador = res.identificador
        if(res.validacion){
          this.cargarAnexo = true;
        }else{
          this.cargarAnexo = false;
        }

        this.checkTutorApoEvent.emit({
          check : this.contribuyenteTutor.ap_tiene_apoderado,
          datos: this.contribuyenteTutor, 
          file: this.fileList, 
          anexo: this.anexo,
          identificador: this.anexoIdentificador
         });
      }
    )
  }

  updateContribuyente() {
    this.contribuyenteTutor["ip"] = this.commonServices.getIpAddress();
    this.contribuyenteTutor["accion"] = `Actualización de contribuyente`;
    this.contribuyenteTutor["id_controlador"] = myVarGlobals.fContribuyente;

    if (this.detalle_edit != undefined) {
      this.contribuyenteTutor["detalle"] = this.detalle_edit.arraycontact;
      this.contribuyenteTutor["deleteContribuyente"] = this.detalle_edit.deleteContac;
      this.contribuyenteTutor["edit"] = true;
    } else {
      this.contribuyenteTutor["edit"] = false;
    }

    this.contribuyenteSrv.updateContribuyente(this.contribuyenteTutor).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success(res["message"]);
        if(this.fileList.length > 0){
          this.uploadFile()
        }
        this.ClearForm();

      },
      (error) => {
        console.log(error.error.message);
        this.toastr.info(error.error.message);
      }
    );
    this.commonVrs.clearContact.asObservable().subscribe(
      (res) => {
        this.ClearForm();
      }
    )
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
        this.catalog.ap_catalogo = res["data"]["REN_PARENTEZCO"];

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

  cargarContribuyentes() {
    (this as any).mensajeSpinner = "Cargando lista de Contribuyentes...";
    this.lcargando.ctlSpinner(true);
    this.filter['num_documento'] = this.contribuyenteTutor.ap_cedula

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    
    console.log(data);
    this.contribuyenteSrv.getContribuyentesByFilter(data).subscribe(
      (res) => {
        // console.log(data);
        console.log(res);
        if(res["data"].length == 0){
          this.lcargando.ctlSpinner(false);
          this.toastr.info("El contribuyente no se encuentra registrado");
          this.contribuyenteTutor = {
            ap_tiene_apoderado: false,
            ap_cedula: null,
            ap_primer_nombre: null,
            ap_segundo_nombre: null,
            ap_primer_apellido: null,
            ap_segundo_apellido: null,
            ap_catalogo: null,
            ap_tipo_discapacidad: null,
            ap_porcentaje_discapacidad: null,
            ap_resolucion: null,
            ap_fecha_resolucion: null,
            ap_persona_autoriza: null,
          };
          
        }else {
          this.lcargando.ctlSpinner(false);
          this.contribuyenteTutor['ap_primer_nombre'] = res['data']['data'][0]["primer_nombre"];
          this.contribuyenteTutor['ap_segundo_nombre'] = res['data']['data'][0]["segundo_nombre"];
          this.contribuyenteTutor['ap_primer_apellido'] = res['data']['data'][0]["primer_apellido"];
          this.contribuyenteTutor['ap_segundo_apellido'] = res['data']['data'][0]["segundo_apellido"];
          // this.contribuyenteTutor['co_fecha_nacimiento'] = res['data']['data'][0]["fecha_nacimiento"];
          this.contribuyenteTutor['co_tiene_conyuge'] = true
        }
        
        
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }


  ClearForm() {
    this.contribuyenteTutor = {
      ap_tiene_apoderado: false,
      ap_cedula: null,
      ap_primer_nombre: null,
      ap_segundo_nombre: null,
      ap_primer_apellido: null,
      ap_segundo_apellido: null,
      ap_catalogo: null,
      ap_tipo_discapacidad: null,
      ap_porcentaje_discapacidad: null,
      ap_resolucion: null,
      ap_fecha_resolucion: null,
      ap_persona_autoriza: null,
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
      this.checkTutorApoEvent.emit({check : this.contribuyenteTutor.ap_tiene_apoderado,datos: this.contribuyenteTutor, file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});

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
      component: myVarGlobals.fContribuyenteTutor,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.contribuyenteTutor.id_cliente,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.contribuyenteTutor.id_cliente}`,
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
      this.commonVrs.contribAnexoLoad.next({id_cliente: this.contribuyenteTutor.id_cliente, condi: 'tutor'})
      this.checkTutorApoEvent.emit({check : this.contribuyenteTutor.ap_tiene_apoderado, file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });

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

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }
  }

  selectedCheck() {
   
    this.checkTutorApoEvent.emit({check : this.contribuyenteTutor.ap_tiene_apoderado,datos: this.contribuyenteTutor,  file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });
  }

}
