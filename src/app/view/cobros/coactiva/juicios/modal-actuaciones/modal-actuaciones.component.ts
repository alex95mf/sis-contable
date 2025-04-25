import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';

import { JuiciosService } from '../juicios.service';
import * as myVarGlobals from 'src/app/global';
import Swal from 'sweetalert2/dist/sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-modal-actuaciones',
  templateUrl: './modal-actuaciones.component.html',
  styleUrls: ['./modal-actuaciones.component.scss']
})
export class ModalActuacionesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() juicio: any;
  @Input() permissions: any;
  msgSpinner: string;
  fTitle: string = "Agregar Actuaciones";
  vmButtons: any[] = [];
  dataUser: any;

  estados: any[] = [
    /* { id: 'EMI', value: 'EMITIDO', pos: 0 },
    { id: 'CIT', value: 'CITADO', pos: 1 },
    { id: 'CIG', value: 'CITADO EN GACETA', pos: 2 },
    { id: 'PAP', value: 'PUBLICACION DE AUTO DE PAGO', pos: 3 },
    { id: 'RET', value: 'RETENCION DE VALORES', pos: 4 },
    { id: 'EMB', value: 'EMBARGO', pos: 5 },
    { id: 'PUR', value: 'PUBLICACION DEL REMATE', pos: 6 },
    { id: 'REM', value: 'REMATE', pos: 7 },
    { id: 'POS', value: 'POSTULACION', pos: 8 },
    { id: 'ADJ', value: 'ADJUDICACION', pos: 9 },
    { id: 'CAN', value: 'CANCELADO', pos: 10 }, */
  ];
  tipos: any[] = [
    /* { id: 'PRO', value: 'PROVIDENCIA' },
    { id: 'DJ', value: 'DEPOSITARIO JUDICIAL' },
    { id: 'PU', value: 'PUBLICACIÓN' },
    { id: 'PA', value: 'PERITO AVALUADOR' },
    { id: 'PO', value: 'POSTURA' },
    { id: 'APL', value: 'ADJUDICACIÓN Y PERITO LIQUIDADOR' }, */
 
    // { id: 'ESC', value: 'ESCRITO' },
    // { id: 'SRA', value: 'SENTAR RAZON' },
    // { id: 'RAZ', value: 'RAZON' },
    // { id: 'ATT', value: 'ATENDER PETICION' },
    // { id: 'CAU', value: 'CONVOCATORIA A AUDIENCIA' },
    // { id: 'AUD', value: 'AUDIENCIA PRESENCIAL' },
    // { id: 'NOT', value: 'NOTIFICACION' },
    // { id: 'SUS', value: 'SUSPENCION Y SEñALAMIENTO' },
    // { id: 'RES', value: 'ACTA RESUMEN' },
    // { id: 'SEN', value: 'SENTENCIA' },
    // { id: 'OFC', value: 'OFICIO' },
    // { id: 'EJE', value: 'RAZON DE EJECUTORIA' },
  ]
  estadoSelected: any = 0;
  tipoSelected: any = null;
  observacion: string = "";
  valor: number = null;
  valor_estado: number = null;
  fecha_actuacion: string = moment().add(0, 'years').format('YYYY-MM-DD')

  fileList: FileList;

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: JuiciosService,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsJuicioActuacion",
        paramAction: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsJuicioActuacion",
        paramAction: "",
        boton: { icon: "fas fa-window-close", texto: "CERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]

    this.estadoSelected = this.juicio.estado
    console.log(this.estadoSelected )

    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.setActuacion()
        break;
      case "CERRAR":
        this.activeModal.close()
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Catalogos'
      let catalogos = await this.apiService.getCatalogsAsync({params: "'COB_JUICIO_ESTADO','COB_TIPO_ACTUACION'"})
      // console.log(catalogos)
      this.estados = catalogos['COB_JUICIO_ESTADO']
      console.log(this.estados)
      this.tipos = catalogos['COB_TIPO_ACTUACION']
      //
      this.lcargando.ctlSpinner(false)
      setTimeout(() => this.getJuicio(), 250);
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  getJuicio() {
    this.msgSpinner = "Cargando Juicio"
    this.lcargando.ctlSpinner(true)
    this.apiService.getJuicio(this.juicio).subscribe(
      (res: any) => {
        console.log(res.data)
        this.juicio = res.data
        Object.assign(this.juicio, { estadoText: this.estados.find((estado: any) => estado.valor == res.data.estado).descripcion })

        // console.log('Juicio '+this.juicio.id_cob_juicio);
        this.estadoSelected = this.estados.find(e => e.valor === res.data.estado)

        this.valor = res.data.valor
        // this.getAbogados()
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Juicio')
      }
    )
  }

  async setActuacion() {
    let msgInvalid = ''

    if (this.juicio.fk_abogado == null) msgInvalid += '* Juicio no tiene Abogado asignado<br>';
    if (this.estadoSelected == 0) msgInvalid += '* No se ha seleccionado un Estado<br>';
    if (this.tipoSelected == 0 || this.tipoSelected == null) msgInvalid += '* No se ha seleccionado un Tipo<br>';
    if (!this.observacion.trim().length) msgInvalid += '* No se ha ingresado una observacion<br>';
    

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return
    }

    try {
      const data = {
        estado: this.estadoSelected.valor,
        tipo: this.tipoSelected,
        observaciones: this.observacion,
        valor: (this.estadoSelected.isconstant >= 5 && this.estadoSelected.isconstant < 10) ? this.valor_estado : null,
        fecha_actuacion: this.fecha_actuacion,
      }
  
      Object.assign(this.juicio, { valor: this.valor })
      this.msgSpinner = 'Almancenando Actuacion'
      this.lcargando.ctlSpinner(true)
  
      console.log(data)

      const response = await this.apiService.almacenaActuacion({ juicio: this.juicio, actuacion: data }).toPromise<any>()
      console.log(response)
      if (this.fileList != undefined) {
        this.uploadFile()
      }
      this.lcargando.ctlSpinner(false)
      //
      Swal.fire('Historial de Juicio actualizado', '', 'success').then(() => {
        this.commonVarService.juicioActuacion.next(response.data)
        this.activeModal.close()
      })
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error almacenando Actuacion')
    }
  }

  validateData() {
    return new Promise<void>((resolve, reject) => {
      let response = '';

      // Validar si juicio tiene abogado
      if (this.juicio.fk_abogado == null) {
        response += '* Juicio no tiene Abogado asignado<br>';
      } else {
        // Si tiene abogado, validar datos ingresados
        if (this.estadoSelected == 0) {
          response += '* No se ha seleccionado un Estado<br>';
        }
  
        if (this.tipoSelected == 0 || this.tipoSelected == null) {
          response += '* No se ha seleccionado un Tipo<br>'
        }
  
        if (!this.observacion.trim().length) {
          response += '* No se ha ingresado una observacion<br>'
        }
      }

      response.length > 0 ? resolve() : reject(response)
    })
  }

  getEstado(id: string) {
    return this.estados.find(e => e.id == id).value
  }

  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Juicio')
      }, 50)
    }
  }
  uploadFile() {
    let data = {
      module: this.permissions.id_modulo,
      component: myVarGlobals.fCoacJuicio,
      identifier: this.juicio.id_cob_juicio,
      id_controlador: myVarGlobals.fCoacJuicio,
      accion: `Nuevo anexo para Juicio ${this.juicio.id_cob_juicio}`,
      ip: this.commonService.getIpAddress(),
      description: this.juicio.estado
    }

    for (let i = 0; i < this.fileList.length; i++) {
      this.UploadService(this.fileList[i], data);
    }
    this.lcargando.ctlSpinner(false)
  }

  UploadService(file, payload?: any): void {
    this.apiService.uploadAnexo(file, payload).subscribe(
      res => { },
      err => {
        this.toastr.info(err.error.message);
      })
  }

}
