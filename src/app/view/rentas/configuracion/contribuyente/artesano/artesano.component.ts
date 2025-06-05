import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ContribuyenteService } from '../contribuyente.service';
import * as myVarGlobals from "../../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-artesano',
  templateUrl: './artesano.component.html',
  styleUrls: ['./artesano.component.scss']
})
export class ArtesanoComponent implements OnInit {


  contribuyenteArte: any = {
    ar_artesano: false,
    ar_rama: null,
    ar_calificacion_numero: null,
    ar_resolucion: null,
    ar_fecha_resolucion: null,
    ar_persona_autoriza: null,
    at_vigencia: null
  }

  //Variable de button cargar
  cargarAnexo: boolean = true;
  anexo: any = undefined
  anexoIdentificador: any = undefined

  fileList: FileList;

  catalog: any = {};

  detalle_edit: any;

  @Input() permissions: any;

  @Input() dataUser: any;

  @Input() validadorNt: any

  @Output() checkArteEvent = new EventEmitter<any>();

  validaciones = new ValidacionesFactory;

  constructor(
    private commonServices: CommonService,
    private contribuyenteSrv: ContribuyenteService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      (res) => {
        console.log('Artesano', res);
        this.cargarAnexo = true
        this.contribuyenteArte["detalle"] = [];
        // this.contribuyenteDis["di_tiene_discpacidad"] = this.discapcidad;
        this.contribuyenteArte['Update'] = 'artesa'
        this.contribuyenteArte = { ...this.contribuyenteArte, ...res.data }
        // console.log(this.contribuyente);

        if (this.contribuyenteArte.ar_artesano && this.contribuyenteArte.ar_rama) {
          this.updateContribuyente(this.contribuyenteArte);
        }

        // this.permissions = res.permissions;
        this.dataUser = res.dataUser
        console.log('Objeto Artesano', this.contribuyenteArte);
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
        this.contribuyenteArte = res.data;
        this.permissions = res.permissions;
      }
    )

    this.commonVrs.diableCargarArt.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.anexo = res.anexo
        this.anexoIdentificador = res.identificador
        if(res.validacion){
          this.cargarAnexo = true;
        }else{
          this.cargarAnexo = false;
        }

        this.checkArteEvent.emit({
          check : this.contribuyenteArte.ar_artesano,
          datos: this.contribuyenteArte, 
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
    console.log(contribuyenteDis);
    contribuyenteDis["ip"] = this.commonServices.getIpAddress();
    contribuyenteDis["accion"] = `Actualización de contribuyente`;
    contribuyenteDis["id_controlador"] = myVarGlobals.fContribuyenteArtesa;

    if (this.detalle_edit != undefined) {
      contribuyenteDis["detalle"] = this.detalle_edit.arraycontact;
      contribuyenteDis["deleteContribuyente"] = this.detalle_edit.deleteContac;
      contribuyenteDis["edit"] = true;
    } else {
      contribuyenteDis["edit"] = false;
    }

    this.contribuyenteSrv.updateContribuyente(contribuyenteDis).subscribe(
      (res) => {
        console.log('Update Artesano', res);
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
    this.contribuyenteArte = {
      ar_artesano: false,
      ar_rama: null,
      ar_calificacion_numero: null,
      ar_resolucion: null,
      ar_fecha_resolucion: null,
      ar_persona_autoriza: null,
      at_vigencia: null
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
      params: "'REN_RAMA_ARTESANAL'",
    };
    this.contribuyenteSrv.getCatalogs(data).subscribe(
      (res) => {
        // console.log('catalogo',res);
        this.catalog.ar_rama = res['data']['REN_RAMA_ARTESANAL'];

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
      this.checkArteEvent.emit({check : this.contribuyenteArte.ar_artesano,datos: this.contribuyenteArte, file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});
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
      component: myVarGlobals.fContribuyenteArtesa,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.contribuyenteArte.id_cliente,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fContribuyenteArtesa,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.contribuyenteArte.id_cliente}`,
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
    console.log(payload);
    this.contribuyenteSrv.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {
      this.commonVrs.contribAnexoLoad.next({ id_cliente: this.contribuyenteArte.id_cliente, condi: 'arte' })
      this.checkArteEvent.emit({check : this.contribuyenteArte.ar_artesano,datos: this.contribuyenteArte, file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});

    })
  }
  ngOnInit(): void {
    this.fillCatalog()
  }

  selectedCheck() {
   
    this.checkArteEvent.emit({check : this.contribuyenteArte.ar_artesano,datos: this.contribuyenteArte,  file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });
  }

}
