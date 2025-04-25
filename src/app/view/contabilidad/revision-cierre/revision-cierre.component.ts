import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { RevisionCierreService } from './revision-cierre.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';

@Component({
  selector: 'app-revision-cierre',
  templateUrl: './revision-cierre.component.html',
  styleUrls: ['./revision-cierre.component.scss']
})
export class RevisionCierreComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: Array<Botonera> = [];
  fTitle: string = 'Cierres Contables por Generar'
  msgSpinner: string;

  lst_tipo_cierre: any[] = [
    { value: 'CCON', label: 'Cierres Contables' },
    { value: 'GREC', label: 'Gastos Recurrentes' },
    { value: 'AMAL', label: 'Asientos Mal Aplicados' },
  ]

  lst_tipo: Array<any> = [
    { value: 'EMI', label: 'Asientos de Emisión' },  // Rentas
    { value: 'REC', label: 'Asientos de Recaudación' },  // Recaudacion
    // { value: 'NOM', label: 'Asientos de Nómina' },
    { value: 'DEP', label: 'Depreciacion' },
    // { value: 'CIE', label: 'Cierres Anuales' },
    // { value: 'TCC', label: 'Traspaso de Saldo CxC'},
  ];

  filter: any = {
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    tipo_cierre: null,
    tipo: null,
  }

  cierres: Array<any> = [];

  viewTable: string = 'CCON';

  constructor(
    private apiService: RevisionCierreService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsRevCierre',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.getCierres()
        break;
    
      default:
        break;
    }
  }

  async getCierres() {
    let message = '';
    if (!moment(this.filter.fecha_hasta).isSame(moment(this.filter.fecha_desde), 'month')) message += '* Las fechas no pertecen al mismo mes.<br>';
    if (moment(this.filter.fecha_hasta).diff(moment(this.filter.fecha_desde)) < 0) message += '* El rango de fechas es incorrecto.<br>'
    if (this.filter.tipo_cierre == null) message += '* No ha seleccionado un Tipo de Cierre.<br>'
    if (this.filter.tipo_cierre == 'CCON' && this.filter.tipo == null) message += '* No ha seleccionado un Tipo de Asiento.<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Consulta', { enableHtml: true })
      return;
    }


    this.lcargando.ctlSpinner(true)
    try {
      let response: Array<any> = await this.apiService.getCierreControl({params: { filter: this.filter }})
      console.log(response)

      this.viewTable = this.filter.tipo_cierre;

      if (this.filter.tipo_cierre == 'CCON') {
        response.map((cierre: any) => {
          let estado = (cierre.documento != null) ? 'A' : 'P';
          Object.assign(cierre, { estado })
        })
  
      } /* else if (this.filter.tipo_cierre == 'GREC') {
        //
      } else if (this.filter.tipo_cierre == 'AMAL') {
        //
      } */
      this.cierres = response;

      this.lcargando.ctlSpinner(false);
    } catch (err) {
      console.log(err);
      this.lcargando.ctlSpinner(false);
      this.toastr.error(err.error.message, 'Error cargando Cierres');
    }
  }



  dtViewAsiento(cierre: any) {
console.log(cierre)
    if(cierre.tipo =='CCON'){
      if (cierre.fk_asiento != undefined) {
        //window.open("http://154.12.249.218:9090/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports&reportUnit=%2Freports%2Fasientos_contables&standAlone=true&j_username=jasperadmin&j_password=jasperadmin&id_document="+dt.id, '_blank');
        window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + cierre.fk_asiento, '_blank')
      }
    }
    if(cierre.tipo =='ASIENTOS MAL APLICADOS'){
      if (cierre.id != undefined) {
        //window.open("http://154.12.249.218:9090/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports&reportUnit=%2Freports%2Fasientos_contables&standAlone=true&j_username=jasperadmin&j_password=jasperadmin&id_document="+dt.id, '_blank');
        window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + cierre.id, '_blank')
      }
    }
    
    // if (cierre.id != undefined) {
    //   //window.open("http://154.12.249.218:9090/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports&reportUnit=%2Freports%2Fasientos_contables&standAlone=true&j_username=jasperadmin&j_password=jasperadmin&id_document="+dt.id, '_blank');
    //   window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + cierre.fk_asiento, '_blank')
    // }
   
  }

}
