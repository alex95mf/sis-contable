import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { DocElecService } from './doc-elec.service';
import Botonera from 'src/app/models/IBotonera';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
standalone: false,
  selector: 'app-doc-elec',
  templateUrl: './doc-elec.component.html',
  styleUrls: ['./doc-elec.component.scss']
})
export class DocElecComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Array<Botonera> = [];
  masterSelected: boolean = false
  masterIndeterminate: boolean = false

  filter: any = {
    tipo_documento: null,
    estado_documento: null,
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    num_identificacion: null,
    razon_social: null,
  }

  cmb_tipo_documento: Array<any> = [];
  cmb_estado_documento: Array<any> = [
    { valor: 'E', descripcion: 'EMITIDO' },
    { valor: 'G', descripcion: 'GENERADO' },
    { valor: 'F', descripcion: 'FIRMADO' },
  ];
  lst_estado_documento: Array<any> = [
    { valor: 'E', descripcion: 'EMITIDO' },
    { valor: 'G', descripcion: 'GENERADO' },
    { valor: 'F', descripcion: 'FIRMADO' },
    { valor: 'R', descripcion: 'RECIBIDO' },
    { valor: 'A', descripcion: 'AUTORIZADO' },
    { valor: 'X', descripcion: 'ENVIADO' },
  ]
  lst_documentos: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'checkbox',
    'documento',
    'beneficiario',
    'fecha',
    'subtotal',
    'iva',
    'total',
    'clave_acceso',
    'estado',
    'fecha_autorizacion',
    'observacion',
    'correo',
    'acciones'
  ];

  constructor(
    private toastr: ToastrService,
    private apiService: DocElecService,
    private excelService: ExcelService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsConsultaDocElec',
        paramAccion: '',
        boton: { icon: 'far fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsConsultaDocElec',
        paramAccion: '',
        boton: { icon: 'far fa-redo-alt', texto: 'REPROCESAR' },
        clase: 'btn btn-sm btn-info',
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsConsultaDocElec',
        paramAccion: '',
        boton: { icon: 'far fa-envelope', texto: 'ENVIAR AL CORREO' },
        clase: 'btn btn-sm btn-info',
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsConsultaDocElec',
        paramAccion: '',
        boton: { icon: 'far fa-file-excel', texto: 'EXCEL' },
        clase: 'btn btn-sm btn-success ml-1',
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case 'CONSULTAR':
        this.getDocumentos()
        break;

      case 'REPROCESAR':
        this.reprocesarLote()
        break;

      case 'ENVIAR AL CORREO':
        this.enviarCorreoLote()
        break;

      case 'EXCEL':
        this.exportExcel()
        break;

      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Cargando Catalogos'
      let res_tipo_documento = await this.apiService.getTipoDocumentos();
      // console.log(res_tipo_documento)
      this.cmb_tipo_documento = res_tipo_documento

      let res_estado_documento = await this.apiService.getCatalogos({params: "'ESTADO DOCUMENTO SRI'"});
      // console.log(res_estado_documento)
      this.cmb_estado_documento = [...this.cmb_estado_documento, ...res_estado_documento['ESTADO DOCUMENTO SRI']]

      (this as any).mensajeSpinner = 'Cargando Documentos'
      let documentos = await this.apiService.getDocumentos({ filter: this.filter })
      // console.log(documentos)
      documentos.map((item: any) => Object.assign(item, {
        check: false,
        estado_elec_texto: this.lst_estado_documento.find((e: any) => e.valor == item.estado_doc_elec)?.descripcion,
        codigo_tipo_documento_texto: this.cmb_tipo_documento.find((e: any) => e.codigo == item.codigo_tipo_documento)?.nombre,
      }))
      this.lst_documentos = new MatTableDataSource(documentos)
      this.lst_documentos.paginator = this.paginator
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message ?? err.message, 'Error en Carga Inicial')
    }
  }

  async getDocumentos() {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Cargando Documentos'
      let documentos = await this.apiService.getDocumentos({ filter: this.filter })
      // console.log(documentos)
      documentos.map((item: any) => Object.assign(item, {
        check: false,
        estado_elec_texto: this.lst_estado_documento.find((e: any) => e.valor == item.estado_doc_elec)?.descripcion,
        codigo_tipo_documento_texto: this.cmb_tipo_documento.find((e: any) => e.codigo == item.codigo_tipo_documento)?.nombre,
      }))
      this.lst_documentos = new MatTableDataSource(documentos)
      this.lst_documentos.paginator = this.paginator
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message ?? err.message, 'Error cargando Documentos')
    }
  }

  descargarXML(documento: any) {
    this.apiService.descargarXML({clave_acceso: documento.clave_acceso_elec}).subscribe(
      (resultado: any) => {
        const url = URL.createObjectURL(resultado)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${documento.clave_acceso_elec}.xml`)
        link.click()
      },
      (err: any) => {
        console.log(err)
        this.toastr.error(err.error?.message, 'Error descargando Anexo')
      }
    )
  }

  descargarPDF(documento: any) {
    window.open(`${environment.ReportingUrl}rpt_comprobante_factura_barcode.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&numero=${documento.id_factura}`)
  }

  async enviarCorreo(documento: any) {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Enviando Correo'
      let response =  await this.apiService.enviarCorreo({ documento: documento })
      console.log(response)
      this.lcargando.ctlSpinner(false)
        await Swal.fire(`Correo enviado a ${documento.contribuyente.correo_facturacion}.`, '', 'success');
      // if(response.ok){
      //   this.lcargando.ctlSpinner(false)
      //   await Swal.fire(`Correo enviado a ${documento.contribuyente.correo_facturacion}.`, '', 'success');
      // }else{
      //   this.lcargando.ctlSpinner(false)
      //   await Swal.fire(`Correo no se pudo enviar porque el documento no esta Autorizado .`, '', 'error');
      // }
      //

    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      Swal.fire(err.error?.message ?? err.message, '', 'error');
      //this.toastr.error(err.error?.message ?? err.message)
    }
  }

  async reiniciar(documento: any) {
    this.lcargando.ctlSpinner(true)
    try {
      (this as any).mensajeSpinner = 'Restaurando estados del Documento'
      let comprobante = await this.apiService.reiniciar({documento: documento})
      Object.assign(comprobante, {
        check: false,
        estado_elec_texto: this.lst_estado_documento.find((e: any) => e.valor == comprobante.estado_doc_elec)?.descripcion,
        codigo_tipo_documento_texto: this.cmb_tipo_documento.find((e: any) => e.codigo == comprobante.codigo_tipo_documento)?.nombre,
      })

      const index = this.lst_documentos.data.findIndex((item: any) => item === documento);
      if (index !== -1) {
        this.lst_documentos.data[index] = comprobante

        this.lst_documentos.data = [...this.lst_documentos.data]
      }

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message ?? err.message)
    }
  }

  selectAll() {
    this.masterIndeterminate = false;
    this.lst_documentos.data
        .filter((documento: any) => documento.estado_doc_elec !== 'A' && documento.estado_doc_elec !== 'X')
        .forEach((documento: any) => documento.check = this.masterSelected);
}
/*
  selectAll() {
    this.masterIndeterminate = false
    this.lst_documentos.data.map((documento: any) => documento.check = this.masterSelected)
  } */

  checkIndetereminate() {
    const someSelected = this.lst_documentos.data.reduce((acc, curr) => acc | curr.check, 0)
    const allSelected = this.lst_documentos.data.reduce((acc, curr) => acc & curr.check, 1)

    this.masterIndeterminate = !!(someSelected && !allSelected)
    this.masterSelected = !!allSelected
  }

  exportExcel() {
    let excelData = [];
    this.lst_documentos.data.forEach((item: any) => {
      let o = {
        TipoDocumento: item.codigo_tipo_documento_texto,
        NumDocumento: item.num_doc,
        Beneficiario: `${item.contribuyente?.razon_social} - ${item.contribuyente?.num_identificacion} - ${item.contribuyente?.correo_facturacion}`,
        Fecha: item.fecha_compra,
        Subtotal: `$ ${parseFloat(item.subtotal).toFixed(2)}`,
        Iva: `$ ${parseFloat(item.valor_iva).toFixed(2)}`,
        Total: `$ ${parseFloat(item.total).toFixed(2)}`,
        ClaveAcceso: item.clave_acceso_elec,
        Estado: `${item.estado_sri ?? 'N/A'} - ${item.estado_elec_texto}`,
        FechaAutorizacion: item.fecha_autorizacion ?? 'N/A',
        Observacion: `${item.observacion_sri ?? ''} - ${item.observacion_elec ?? ''}`,
      }
      excelData.push(o)
    })
    this.excelService.exportAsExcelFile(excelData, 'DocumentosElectronicos')
  }

  async reprocesarLote() {
    console.log(this.lst_documentos.data);
//    let registros = this.lst_documentos.data.filter((item: any) => item.estado === 'A' || item.estado === 'X');
let registros = this.lst_documentos.data.filter((item: any) =>  item.check === true); //(item.estado_doc_elec === 'A' || item.estado_doc_elec === 'X') &&


    if (registros.length == 0) {
      Swal.fire('No hay registros a reprocesar', 'Esto puede ser porque no ha escogido registros o los seleccionados ya han sido autorizados.', 'warning')
      return;
    }

    let result = await Swal.fire({
      titleText: 'Reprocesar registros',
      text: `Esta seguro/a de reprocesar ${registros.length} registros?`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        (this as any).mensajeSpinner = 'Reprocesando'
        let response = await this.apiService.reiniciarLote({ registros })
        console.log(response)
        //
        this.lcargando.ctlSpinner(false)

        Swal.fire('Registros reprocesados correctamente', '', 'success').then(() => this.getDocumentos())
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message ?? err.message)
      }
    }
  }

  async enviarCorreoLote() {
    console.log(this.lst_documentos.data)
   // let registros = this.lst_documentos.data.filter((item: any) => item.estado !== 'A' || item.estado !== 'X');
    let registros = this.lst_documentos.data.filter((item: any) => item.estado_doc_elec === 'A' || item.estado_doc_elec === 'X' &&  item.check === true);
    console.log(registros)
    if (registros.length == 0) {
      Swal.fire('No hay registros para enviar por correo', 'Esto puede ser porque no ha escogido registros o los seleccionados aun no han sido autorizados.', 'warning')
      return;
    }

    let result = await Swal.fire({
      titleText: 'Envio por correo',
      text: `Esta seguro/a de enviar ${registros.length} registros?`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        (this as any).mensajeSpinner = 'Enviando'
        let response = await this.apiService.enviarCorreoLote({ registros })
        console.log(response)
        //
        this.lcargando.ctlSpinner(false)
        Swal.fire('Correos enviados exitosamente', '', 'success');
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message ?? err.message)
      }
    }
  }

}
