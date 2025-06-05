import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { CierreBienesService } from './cierre-bienes.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';
import Swal from 'sweetalert2';


@Component({
standalone: false,
  selector: 'app-cierre-bienes',
  templateUrl: './cierre-bienes.component.html',
  styleUrls: ['./cierre-bienes.component.scss']
})
export class CierreBienesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Cierre de Bienes';
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[] = [];

  cmb_tipo_bien: Array<any> = [];

  readOnly: boolean = false;

  documento: any = {
    tipo: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    num_documento: null,
    observaciones: null,
    bienes: [],
  };
  columnas: Array<any> = [];

  constructor(
    private toastr: ToastrService,
    private apiService: CierreBienesService,
    private modalService: NgbModal,
    private cierremesService: CierreMesService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsCierreBienes",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsCierreBienes",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsCierreBienes",
        paramAccion: "",
        boton: { icon: "fas fa-file-import", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsCierreBienes",
        paramAccion: "",
        boton: { icon: "fas fa-trash-alt", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsCierreBienes",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
    ];

    this.apiService.cierreSelected$.subscribe(
      async (documento: any) => {
        // Consultar detalles del documento y mostrar en pantalla
        console.log(documento)
        this.columnas = (documento.tipo == 'BCA') ? [{name: 'costo', label: 'Costo'}] : [{name: 'stock', label: 'Stock'}, {name: 'costo', label: 'Costo'}, {name: 'costo_total', label: 'Costo Total'}]
        this.lcargando.ctlSpinner(true);
        let response = await this.getCierre(documento.id)
        Object.assign(response, { bienes: [], txt_tipo: this.cmb_tipo_bien.find((item: any) => item.valor == documento.tipo).descripcion })
        response.detalles.forEach((item: any) => {
          response.bienes.push(item.producto)
        })
        console.log(response)
        this.documento = response
        this.readOnly = true

        this.vmButtons[1].habilitar = true
        this.vmButtons[3].habilitar = false

        this.lcargando.ctlSpinner(false)
      }
    )
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "GUARDAR":
        this.guardar()
        break;
      case "BUSCAR":
        const modal = this.modalService.open(ModalBusquedaComponent, { size: 'xl', backdrop: 'static' })
        modal.componentInstance.cmb_tipo_bien = this.cmb_tipo_bien
        break;
      case "ELIMINAR":
        this.deleteCierre()
        break;
      case "LIMPIAR":
        this.clearForm()
        break;

      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Catalogos'
      let catalogos = await this.apiService.getCatalogos({params: "'INV_TIPO_BIEN'"})
      catalogos['INV_TIPO_BIEN'] = catalogos['INV_TIPO_BIEN'].filter((item: any) => ['EXI', 'BCA'].includes(item.valor))
      this.cmb_tipo_bien = catalogos['INV_TIPO_BIEN']

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }

  async consultar() {
    let message = '';
    if (this.documento.tipo == null) message += '* No ha seleccionado un Tipo de Bien.<br>';

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
      return;
    }

    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Consultando Bienes'
      let bienes = await this.apiService.getBienes({ filter: {...this.documento} })
      // console.log(bienes)
      this.columnas = (this.documento.tipo == 'BCA') ? [{name: 'costo', label: 'Costo'}] : [{name: 'stock', label: 'Stock'}, {name: 'costo', label: 'Costo'}, {name: 'costo_total', label: 'Costo Total'}]
      this.documento.bienes = bienes
      this.vmButtons[1].habilitar = false
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error consultando Bienes')
    }
  }

  async guardar() {

    (this as any).mensajeSpinner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let data = {
      "anio": Number(moment(this.documento.fecha).format('YYYY')),
      "mes": Number(moment(this.documento.fecha).format('MM'))
      }

      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
          try {

            if (res["data"][0]?.estado !=='C') {
              let message = '';
              if (this.documento.observaciones == null) message += '* No ha ingresado una Observacion para este documento.<br>';

              if (message.length > 0) {
                this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
                return;
              }

              this.lcargando.ctlSpinner(true);
              try {
                (this as any).mensajeSpinner = 'Almacenando Documento'
                let response = await this.apiService.setDocumento({documento: this.documento})
                console.log(response)
                const { num_documento, id } = response
                Object.assign(this.documento, { num_documento, id })
                //
                this.lcargando.ctlSpinner(false)
                Swal.fire('Cierre almacenado correctamente', '', 'success').then(() => this.clearForm())
              } catch (err) {
                console.log(err)
                this.lcargando.ctlSpinner(false)
                this.toastr.error(err.error?.message, 'Error almacenando Documento')
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

  clearForm() {
    Object.assign(this.documento, {
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      num_documento: null,
      tipo: null,
      observaciones: null,
      bienes: []
    })

    this.vmButtons[1].habilitar = true
    this.vmButtons[3].habilitar = true
    this.readOnly = false
  }

  async getCierre(id: number) {
    try {
      (this as any).mensajeSpinner = 'Leyendo Documento'
      let response = await this.apiService.getCierre(id)
      return response;
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  async deleteCierre() {
    let result = await Swal.fire({
      titleText: 'Eliminar Cierre',
      text: 'Esta seguro/a de eliminar este documento?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {
      (this as any).mensajeSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);
      let data = {
        "anio": Number(moment(this.documento.fecha).format('YYYY')),
        "mes": Number(moment(this.documento.fecha).format('MM'))
        }

      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
          try {

            if (res["data"][0]?.estado !=='C') {
              this.lcargando.ctlSpinner(true);
              try {
                (this as any).mensajeSpinner = 'Eliminando Cierre'
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
