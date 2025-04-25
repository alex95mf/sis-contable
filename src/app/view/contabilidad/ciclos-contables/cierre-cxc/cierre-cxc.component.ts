import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CierreCxcService } from './cierre-cxc.service';
import { CierreMesService } from 'src/app/view/presupuesto/configuracion/cierre-de-mes/cierre-mes.service'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';

@Component({
  selector: 'app-cierre-cxc',
  templateUrl: './cierre-cxc.component.html',
  styleUrls: ['./cierre-cxc.component.scss']
})
export class CierreCxcComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: Botonera[] = [];
  msgSpinner: string;

  filter: any = {
    fecha_hasta: moment(new Date()).format('YYYY-MM-DD'),
  };

  documento: any = {
    num_documento: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observaciones: null,
    deudas: [],
  };


  constructor(
    private apiService: CierreCxcService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cierremesService: CierreMesService
  ) {
    this.vmButtons = [
      {
        orig: 'btnsCierreCxc',
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
        orig: 'btnsCierreCxc',
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
        orig: 'btnsCierreCxc',
        paramAccion: '',
        boton: { icon: 'fas fa-file-import', texto: 'BUSCAR' },
        clase: 'btn btn-sm btn-info text-white',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsCierreCxc',
        paramAccion: '',
        boton: { icon: 'fas fa-trash', texto: 'ELIMINAR' },
        clase: 'btn btn-sm btn-danger text-white',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsCierreCxc',
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

    this.apiService.cierreSelected$.subscribe(
      async (documento: any) => {
        // console.log(documento)
        this.lcargando.ctlSpinner(true)
        try {
          let response = await this.apiService.getCierre(documento.id)
          console.log(response)
          Object.assign(response, { deudas: [] })
          response.detalles.forEach((element: any) => {
            response.deudas.push(element.liquidacion)
          });
          this.documento = response
          // cambiar estado de Botones
          this.vmButtons[1].habilitar = true
          this.vmButtons[3].habilitar = false

          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message)
        }
      }
    )
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
      case "ELIMINAR":
        this.eliminarCierre()
        break;
      case "BUSCAR":
        this.modalService.open(ModalBusquedaComponent, { size: 'xl', backdrop: 'static' })
        break;

      default:
        break;
    }
  }

  async getDocumentos() {
    this.documento.deudas = []
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Cuentas por Cobrar'
      let documentos: Array<any> = await this.apiService.getDocumentos({ params: { filter: this.filter } })
      console.log(documentos)
      this.documento.deudas = documentos
      // cambiar estado de Botones
      this.vmButtons[1].habilitar = false
      this.vmButtons[3].habilitar = true

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

    let result = await Swal.fire({
      text: 'Seguro/a desea generar este cierre?',
      title: 'Cierre de Cuentas por Pagar',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar',
    });

    if (result.isConfirmed) {

      this.msgSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);

      let data = {
        "anio": Number(moment(this.documento.fecha).format('YYYY')),
        "mes": Number(moment(this.documento.fecha).format('MM'))
        }
        
        this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
            try {
              if (res["data"][0].estado !=='C') {
                this.lcargando.ctlSpinner(true)
                try {
                  this.msgSpinner = 'Almacenando Cierre'
                  let response: any = await this.apiService.setDocumento({ documento: this.documento })
                  console.log(response);
                  const { num_documento, id } = response
                  Object.assign(this.documento, { id, num_documento })
                  // cambiar estado de Botones
                  this.vmButtons[1].habilitar = true
                  this.vmButtons[3].habilitar = false
          
                  this.lcargando.ctlSpinner(false)
                  Swal.fire('Cierre almacenado correctamente', '', 'success').then(() => this.clearForm())
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
      deudas: [],
    })

    // cambiar estado de Botones
    this.vmButtons[1].habilitar = false
    this.vmButtons[3].habilitar = true

    this.getDocumentos()
  }

  async eliminarCierre() {
    let result = await Swal.fire({
      titleText: 'Eliminar Cierre',
      text: 'Esta seguro/a de eliminar este documento?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {

      this.msgSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);
      let data = {
        "anio": Number(moment(this.documento.fecha).format('YYYY')),
        "mes": Number(moment(this.documento.fecha).format('MM'))
        }
      
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
          try {
           
            if (res["data"][0]?.estado !=='C') {
              
              this.lcargando.ctlSpinner(true)
              try {
                this.msgSpinner = 'Eliminando Cierre'
                await this.apiService.deleteCierre(this.documento.id)
        
                this.lcargando.ctlSpinner(false)
                Swal.fire('Cierre eliminado correctamente.', '', 'success').then(() => this.clearForm())
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

}
