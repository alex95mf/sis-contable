import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { ApiService } from './api.service';
import { CierreMesService } from 'src/app/view/presupuesto/configuracion/cierre-de-mes/cierre-mes.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-cierre-superavit',
  templateUrl: './cierre-superavit.component.html',
  styleUrls: ['./cierre-superavit.component.scss']
})
export class CierreSuperavitComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  vmButtons: Array<Botonera> = [];
  mensajeSpinner: string;

  documentos: Array<any> = [];

  filter: any = {
    fecha_hasta: moment(new Date()).format('YYYY-MM-DD'),
  };

  dataSource: MatTableDataSource<any>;

  documento: any = {
    num_documento: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observaciones: null,
    saldos: [],
  };

  displayedColumns: Array<string> = ['contribuyente', 'documento', 'total', 'saldo'];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private cierremesService: CierreMesService
  ) {
    this.vmButtons = [
      {
        orig: 'btnsCierreSuperavit',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsCierreSuperavit',
        paramAccion: '',
        boton: { icon: 'fas fa-save', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsCierreSuperavit',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ];
  }

  ngOnInit(): void {
    setTimeout(() => this.getDocumentos(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.getDocumentos()
        break;
      case "GUARDAR":
        this.setDocumento()
        break;
      case "LIMPIAR":
        this.clearForm()
        break;

      default:
        break;
    }
  }

  async getDocumentos() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando Documentos'
      let documentos: Array<any> = await this.apiService.getDocumentos({params: {filter: this.filter}})
      documentos.map((item: any) => {
        Object.assign(item, {
          contribuyente: item.contribuyente?.razon_social ?? 'N/A',
        })

        if (item.tipo_documento == 'CA') {
          Object.assign(item, {
            total: item.superavit,
          })
        }
      })
      console.log(documentos)

      this.dataSource = new MatTableDataSource(documentos)
      this.dataSource.paginator = this.paginator
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async setDocumento() {
    let message = '';

    if (this.documento.observaciones == null) message += '* No ha ingresado una Observacion.<br>';

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true });
      return;
    }

    let result: SweetAlertResult = await Swal.fire({
      text: 'Seguro/a desea generar este cierre?',
      title: 'Cierre de Saldos a Favor del Contribuyente',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar',
    });

    if (result.isConfirmed) {

      this.mensajeSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);

      let data = {
        "anio": Number(moment(this.documento.fecha).format('YYYY')),
        "mes": Number(moment(this.documento.fecha).format('MM'))
        }

      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
          try {
            if (res["data"][0].estado !=='C') {
              Object.assign(this.documento, { saldos: this.dataSource.filteredData })
              this.lcargando.ctlSpinner(true)
              try {
                this.mensajeSpinner = 'Almacenando Cierre'
                let response = await this.apiService.setDocumento({ documento: this.documento })
                console.log(response)
                //
                this.lcargando.ctlSpinner(false)
                Swal.fire('Cierre generado correctamente', '', 'success').then(() => this.clearForm())
              } catch (err) {
                console.log(err)
                this.lcargando.ctlSpinner(false)
                this.toastr.error(err.error?.message)
              }

            } else {

                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
            }
          } catch (error) {
              console.error("Error occurred:", error);
          }
      });
    }
  }

  clearForm(): void {
    this.filter.fecha_hasta = moment(new Date()).format('YYYY-MM-DD')
    Object.assign(this.documento, {
      num_documento: null,
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      observaciones: null,
      saldos: [],
    })
  }

}
