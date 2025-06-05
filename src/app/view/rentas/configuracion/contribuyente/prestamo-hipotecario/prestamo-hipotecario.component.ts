import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ContribuyenteService } from '../contribuyente.service';
import * as myVarGlobals from "../../../../../global";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-prestamo-hipotecario',
  templateUrl: './prestamo-hipotecario.component.html',
  styleUrls: ['./prestamo-hipotecario.component.scss']
})
export class PrestamoHipotecarioComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  validaciones = new ValidacionesFactory;


  //Objeto
  contribuyentePrest: any = {
    ph_tiene_prestamo: null,
    ph_valor_credito: null,
    ph_institucion_credito: null,
    ph_fecha_inicio: null,
    ph_fecha_fin: null,
    ph_resolucion: null,
    ph_fecha_resolucion: null,
    ph_persona_autoriza: null,
  }

  //variable cargar anexo
  cargarAnexo: boolean = true
  // prestamo: boolean;
  anexo: any = undefined
  anexoIdentificador: any = undefined

  fileList: FileList;

  detalle_edit: any;

  catalog: any = {};

  @Input() permissions: any;

  @Input() dataUser: any;

  @Input() validadorNt: any

  @Input() presentacion: any

  @Output() checkPresHipoEvent = new EventEmitter<any>();

  constructor(
    private commonServices: CommonService,
    private contribuyenteSrv: ContribuyenteService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      (res) => {
        this.contribuyentePrest["detalle"] = [];
        // this.contribuyentePrest["ph_tiene_prestamo"] = this.prestamo;
        this.contribuyentePrest['Update'] = 'prestamo'
        this.contribuyentePrest = { ...this.contribuyentePrest, ...res.data }
        
        if (this.contribuyentePrest.ph_tiene_prestamo && (this.presentacion == 'Natural' || this.presentacion == 'Juridico')) {
          console.log(this.presentacion);
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
        this.contribuyentePrest = res.data
        this.permissions = res.permissions;
      }
    )
    this.commonVrs.disableCargarPrestamo.asObservable().subscribe(
      (res)=>{
        console.log(res)
        this.anexo = res.anexo
        this.anexoIdentificador = res.identificador
        if(res.validacion){
          this.cargarAnexo = true;
        }else{
          this.cargarAnexo = false;
        }

        this.checkPresHipoEvent.emit({
          check : this.contribuyentePrest.ph_tiene_prestamo,
          datos: this.contribuyentePrest, 
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
    this.contribuyentePrest["ip"] = this.commonServices.getIpAddress();
    this.contribuyentePrest["accion"] = `Actualización de contribuyente`;
    this.contribuyentePrest["id_controlador"] = myVarGlobals.fContribuyente;

    if (this.detalle_edit != undefined) {
      this.contribuyentePrest["detalle"] = this.detalle_edit.arraycontact;
      this.contribuyentePrest["deleteContribuyente"] = this.detalle_edit.deleteContac;
      this.contribuyentePrest["edit"] = true;
    } else {
      this.contribuyentePrest["edit"] = false;
    }

    this.contribuyenteSrv.updateContribuyente(this.contribuyentePrest).subscribe(
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


  ClearForm() {
    this.contribuyentePrest = {
      ph_tiene_prestamo: false,
      ph_valor_credito: null,
      ph_institucion_credito: null,
      ph_fecha_inicio: null,
      ph_fecha_fin: null,
      ph_resolucion: null,
      ph_fecha_resolucion: null,
      ph_persona_autoriza: null,
    };
    // this.validadorNt = false
    this.detalle_edit = undefined;
    this.fileList = undefined
    this.anexo=  undefined

  }

  fillCatalog() {
    // console.log('Catalogo');
    // this.lcargando.ctlSpinner(true);
    // (this as any).mensajeSpinner = "Cargando Catalogs";
    let data = {
      params: "'REN_INSTITUCION_CREDITO'",
    };
    this.contribuyenteSrv.getCatalogs(data).subscribe(
      (res) => {
        // console.log('catalogo',res);
        this.catalog.ren_institucion_credito = res['data']['REN_INSTITUCION_CREDITO'];

        // console.log(this.catalog);
        // this.lcargando.ctlSpinner(false);
      },
      (error) => {
        // this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }


  onlyNumber(event):boolean{
    console.log(event);
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
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
      this.checkPresHipoEvent.emit({check : this.contribuyentePrest.ph_tiene_prestamo,datos: this.contribuyentePrest, file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});

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
      component: myVarGlobals.fContribuyentePrestamo,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.contribuyentePrest.id_cliente,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.contribuyentePrest.id_cliente}`,
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
      this.commonVrs.contribAnexoLoad.next({id_cliente: this.contribuyentePrest.id_cliente, condi: 'prest'})
      this.checkPresHipoEvent.emit({check : this.contribuyentePrest.ph_tiene_prestamo,datos: this.contribuyentePrest, file: this.fileList, anexo: this.anexo,identificador: this.anexoIdentificador});

    })
    
    
    
    // subscribe(
    //   res => {

    //     this.commonVrs.contribAnexoLoad.next({ id_cliente: this.contribuyentePrest.id_cliente, condi: 'prest' })

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
   
    this.checkPresHipoEvent.emit({check : this.contribuyentePrest.ph_tiene_prestamo,datos: this.contribuyentePrest,  file: this.fileList, anexo: this.anexo, identificador: this.anexoIdentificador });
  }

}
