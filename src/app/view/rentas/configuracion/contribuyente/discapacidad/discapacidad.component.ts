import { Component, OnInit, ViewChild, Input ,Output,EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from "../../../../../global";
import { ContribuyenteService } from '../contribuyente.service';

@Component({
standalone: false,
  selector: 'app-discapacidad',
  templateUrl: './discapacidad.component.html',
  styleUrls: ['./discapacidad.component.scss']
})
export class DiscapacidadComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  validaciones = new ValidacionesFactory;

  //Objeto


  contribuyenteDis: any = {
    di_tiene_discpacidad: false,
    di_tipo_discapacidad: null,
    di_porcentaje_discapacidad: null,
    di_resolucion: null,
    di_fecha_resolucion: null,
    di_persona_autoriza: null,
  }

  //Variable de button cargar
  cargarAnexo: boolean = true;

  fileList: FileList;
  anexo: any = undefined
  anexoIdentificador: any = undefined

  catalog: any = {};

  detalle_edit: any;

  @Input() permissions: any;

  @Input() dataUser: any;

  @Input() validadorNt: any

  @Output() checkDiscaEvent = new EventEmitter<any>();

  constructor(
    private commonServices: CommonService,
    private contribuyenteSrv: ContribuyenteService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      (res) => {
        this.cargarAnexo = true
        this.contribuyenteDis["detalle"] = [];
        // this.contribuyenteDis["di_tiene_discpacidad"] = this.discapcidad;
        this.contribuyenteDis['Update'] = 'discapacidad'
        this.contribuyenteDis = { ...this.contribuyenteDis, ...res.data }
        // console.log(this.contribuyente);

        if (this.contribuyenteDis.di_tiene_discpacidad && this.contribuyenteDis.di_tipo_discapacidad) {
          this.updateContribuyente(this.contribuyenteDis);
        }

        // this.permissions = res.permissions;
        this.dataUser = res.dataUser
        console.log('Objeto Discapacidad', this.contribuyenteDis);
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
        this.contribuyenteDis = res.data;
        this.permissions = res.permissions;
      }
    )

    this.commonVrs.diableCargarDis.asObservable().subscribe(
      (res) => {
         console.log(res)
        this.anexo = res.anexo
        this.anexoIdentificador = res.identificador
        if(res.validacion){
          this.cargarAnexo = true;
        }else{
          this.cargarAnexo = false;
        }

        this.checkDiscaEvent.emit({
          check : this.contribuyenteDis.di_tiene_discpacidad,
          datos: this.contribuyenteDis, 
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
    console.log(this.contribuyenteDis);
    contribuyenteDis["ip"] = this.commonServices.getIpAddress();
    contribuyenteDis["accion"] = `Actualización de contribuyente`;
    contribuyenteDis["id_controlador"] = myVarGlobals.fContribuyente;

    if (this.detalle_edit != undefined) {
      contribuyenteDis["detalle"] = this.detalle_edit.arraycontact;
      contribuyenteDis["deleteContribuyente"] = this.detalle_edit.deleteContac;
      contribuyenteDis["edit"] = true;
    } else {
      contribuyenteDis["edit"] = false;
    }

    this.contribuyenteSrv.updateContribuyente(contribuyenteDis).subscribe(
      (res) => {
        console.log('Update Discapa', res);
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
    this.contribuyenteDis = {
      di_tiene_discpacidad: false,
      di_tipo_discapacidad: null,
      di_porcentaje_discapacidad: null,
      di_resolucion: null,
      di_fecha_resolucion: null,
      di_persona_autoriza: null,
    };
    this.detalle_edit = undefined;
    // this.validadorNt = false
    this.fileList = undefined
    this.anexo=  undefined
  }


  fillCatalog() {
    // console.log('Catalogo');
    // this.lcargando.ctlSpinner(true);
    // (this as any).mensajeSpinner = "Cargando Catalogs";
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
     this.checkDiscaEvent.emit({
      check : this.contribuyenteDis.di_tiene_discpacidad,
      datos: this.contribuyenteDis, 
      file: this.fileList, 
      anexo: this.anexo,
      identificador: this.anexoIdentificador
     });
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
      component: myVarGlobals.fContribuyenteDiscapacidad,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.contribuyenteDis.id_cliente,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.contribuyenteDis.id_cliente}`,
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
      this.commonVrs.contribAnexoLoad.next({ id_cliente: this.contribuyenteDis.id_cliente, condi: 'dis' })
    })
  }




  ngOnInit(): void {
    this.contribuyenteDis.di_tiene_discpacidad= false
    this.fillCatalog()
    
  }

  selectedCheck() {
    this.checkDiscaEvent.emit({
      check : this.contribuyenteDis.di_tiene_discpacidad,
      datos: this.contribuyenteDis, 
      file: this.fileList, 
      anexo: this.anexo,
      identificador: this.anexoIdentificador
     });
  }


}
