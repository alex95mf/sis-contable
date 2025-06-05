import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { LiquidacionPrService } from './liquidacion-pr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContribuyenteComponent } from './modal-contribuyente/modal-contribuyente.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ModalConceptosComponent } from './modal-conceptos/modal-conceptos.component';
import Swal from 'sweetalert2';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';

interface Contribuyente {
  id_cliente?: number
  razon_social: string
  num_documento: string
  tipo_documento: string
}

interface Solar {
  id?: number,
  label?: string
  zona?: string,
  sector?: string
  manzana?: string
  solar?: string
  cod_catastral?: string
  area: number
  valor_solar: number
  valor_hipoteca: number
  valor_edificacion: number
  avaluo: number
  valor_metro_cuadrado: number
}

@Component({
standalone: false,
  selector: 'app-liquidacion-pr',
  templateUrl: './liquidacion-pr.component.html',
  styleUrls: ['./liquidacion-pr.component.scss']
})
export class LiquidacionPrComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[];

  contribuyente: Contribuyente;
  cmb_propiedad$: Solar[];
  propiedadSelected: any;
  propiedadData: Solar = {
    area: 0,
    valor_solar: 0,
    valor_hipoteca: 0,
    valor_edificacion: 0,
    avaluo: 0,
    valor_metro_cuadrado: 0,
  };

  liquidacion: any = {
    num_documento: null,
    fecha: moment().format('YYYY-MM-DD'),
    estado: null,  // Emitido > Aprobado > Cancelado
    observaciones: null,
    conceptos: [],
    exoneraciones: [],
    sum_conceptos: 0,
    sum_exoneraciones: 0,
    total: 0,
    recargo: 0,
    sta: 5,
    interes: 0,
    descuento: 0,
    total_cobro: 0
  };

  roContribuyenteSelected: boolean = true
  roPropiedadSelected: boolean = true

  configuracion: any = {
    tercera_edad: false,
    pertenece_coop: false,
    artesano: false,
    discapacitado: false,
    privada_sin_lucro: false,
    institucion_publica: false,
    perdidas_resultados: false,
    empresa_publica: false,
    tipo_persona_juridica: ''
  }

  formReadonly: boolean = false

  constructor(
    private apiService: LiquidacionPrService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsLiquidacionRural',
        paramAccion: '',
        boton: { icon: 'fas fa-save', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsLiquidacionRural',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'BUSCAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsLiquidacionRural',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
    ]

    this.apiService.contribuyenteSelected$.subscribe(
      async (contribuyente: Contribuyente) => {
        console.log(contribuyente)
        this.contribuyente = contribuyente

        // Valida Tercera Edad
        if (contribuyente['fecha_nacimiento'] != null) {
          console.log(contribuyente['supervivencia'])
          this.configuracion.tercera_edad = this.verificacionTerceraEdad(contribuyente['fecha_nacimiento'])
          if (contribuyente['contribuyente'] == "Natural" && contribuyente['supervivencia'] == "S" && this.configuracion.tercera_edad) {
            // console.log("Holis")
            this.expandSupervivencia(contribuyente.id_cliente);
          }
        }
        // Pertenece a Cooperativa
        if (contribuyente['ta_pertenece_cooperativa'] != null) {
          this.configuracion.pertenece_coop = contribuyente['ta_pertenece_cooperativa'] == 1
        }

        // Es artesano
        if (contribuyente['ar_artesano'] != null) {
          this.configuracion.artesano = contribuyente['ar_artesano'] == 1
        }

        // Tipo de Persona Juridica
        if (contribuyente['tipo_persona_juridica'] != null) {
          this.configuracion.tipo_persona_juridica = contribuyente['tipo_persona_juridica']
        }

        // Consultar Propiedades
        this.lcargando.ctlSpinner(true)
        await this.getPropiedades(contribuyente.id_cliente)
        this.roContribuyenteSelected = false
        this.lcargando.ctlSpinner(false)
      }
    )

    this.apiService.conceptoSelected$.subscribe(
      (conceptos: any[]) => {
        this.liquidacion.conceptos = conceptos
        this.sumaConceptos()
      }
    )

    this.apiService.exoneracionesSelected$.subscribe(
      (exoneraciones: any[]) => {
        this.liquidacion.exoneraciones = exoneraciones
        this.calculaExoneraciones()
      }
    )

    this.apiService.liquidacionSelected$.subscribe(
      async (liquidacion: any) => {
        // console.log(liquidacion)
        this.lcargando.ctlSpinner(true)
        let documento = await this.getLiquidacion(liquidacion.id_liquidacion)
        // console.log(documento)
        this.contribuyente = documento.contribuyente
        this.propiedadData = documento.lote
        // Object.assign(this.contribuyente, documento.contribuyente)
        // Object.assign(this.propiedadData, documento.lote)
        Object.assign(this.liquidacion, documento)
        this.lcargando.ctlSpinner(false)

        this.formReadonly = true
      }
    )
  }

  ngOnInit(): void {
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.setLiquidacion()
        break;
      case "BUSCAR":
        this.expandLiquidaciones()
        break;
      case "LIMPIAR":

        break;

      default:
        break;
    }
  }

  expandContribuyente() {
    const modal = this.modalService.open(ModalContribuyenteComponent, {size: 'xl', backdrop: 'static'})
  }

  expandConceptos() {
    const modal = this.modalService.open(ModalConceptosComponent, { size: 'lg', backdrop: 'static' })
    modal.componentInstance.conceptosArr = this.liquidacion.conceptos
  }

  expandExoneraciones() {
    const modal = this.modalService.open(ModalExoneracionesComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.exoneracionesSelect = this.liquidacion.exoneraciones
    modal.componentInstance.configuracion = this.configuracion
  }

  expandLiquidaciones() {
    const modal = this.modalService.open(ModalLiquidacionesComponent, { size: 'xl', backdrop: 'static' })
  }

  async getPropiedades(id_cliente: number) {
    try {
      (this as any).mensajeSpinner = 'Cargando Propiedades'
      let propiedades = await this.apiService.getPropiedades({ id_cliente })
      console.log(propiedades)
      this.cmb_propiedad$ = propiedades.map((apiObj: any) => {
        const solar: Solar = {
          id: apiObj.id,
          zona: apiObj.zona,
          sector: apiObj.sector,
          manzana: apiObj.manzana,
          solar: apiObj.solar,
          cod_catastral: apiObj.cod_catastral,
          area: parseFloat(apiObj.area), // Convert the string to a number using parseFloat or parseInt
          valor_solar: parseFloat(apiObj.valor_solar),
          valor_hipoteca: parseFloat(apiObj.valor_hipoteca),
          valor_edificacion: parseFloat(apiObj.valor_edificacion),
          avaluo: parseFloat(apiObj.avaluo),
          valor_metro_cuadrado: parseFloat(apiObj.valor_metro_cuadrado),
          label: `Zona: ${apiObj.zona.padStart(3, '0')} Sector: ${apiObj.sector} Manzana: ${apiObj.manzana} Solar: ${apiObj.solar}`
        }

        return solar;
      })
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Propiedades')
    }
  }

  handleSelectPropiedad(event: Solar) {
    this.propiedadData = event
    this.roPropiedadSelected = false
  }

  sumaConceptos() {
    this.liquidacion.sum_conceptos = this.liquidacion.conceptos.reduce((acc: number, curr: any) => acc + parseFloat(curr.valor), 0)
    // this.liquidacion.sta = this.liquidacion.conceptos.reduce((acc, curr) => acc + curr.sta, 0)
    setTimeout(() => this.calcularLiquidacion(), 0)
  }

  calculaExoneraciones() {
    this.liquidacion.exoneraciones.map((e: any) => {
      let base = this.liquidacion.conceptos.find((c: any) => c.codigo_detalle == e.cod_concepto_det_aplicable).valor
      let valor = base * e.porcentaje

      Object.assign(e, { valor })
      return e;
    })
    this.sumaExoneraciones()
  }

  sumaExoneraciones() {
    this.liquidacion.sum_exoneraciones = this.liquidacion.exoneraciones.reduce((acc: number, curr: any) => acc + parseFloat(curr.valor), 0)
    setTimeout(() => this.calcularLiquidacion(), 0)
  }

  calcularLiquidacion() {
    let total = this.liquidacion.sum_conceptos - this.liquidacion.sum_exoneraciones
    Object.assign(this.liquidacion, {
      total,
      total_cobro: total + this.liquidacion.sta + this.liquidacion.recargo + this.liquidacion.interes - this.liquidacion.descuento
    })
  }

  async removeConcepto(idx: number) {
    let result = await Swal.fire({
      titleText: 'Remover Concepto',
      text: 'Esta seguro/a de remover este Concepto?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Remover',
    })
     if (result.isConfirmed) {
       this.liquidacion.conceptos.splice(idx, 1)
       this.sumaConceptos()
     }
  }

  async removeExoneracion(idx: number) {
    let result = await Swal.fire({
      titleText: 'Remover Exoneracion',
      text: 'Esta seguro/a de remover esta Exoneracion?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Remover',
    })

    if (result.isConfirmed) {
      this.liquidacion.exoneraciones.splice(idx, 1)
      this.sumaExoneraciones()
    }
  }

  async setLiquidacion() {
    this.lcargando.ctlSpinner(true)
    try {
      let response = await this.apiService.setLiquidacion({
        contribuyente: this.contribuyente,
        propiedad: this.propiedadData,
        liquidacion: this.liquidacion
      })
      console.log(response)
      Object.assign(this.liquidacion, {
        num_documento: response.documento,
        estado: response.estado
      })
      this.formReadonly = true;
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Propiedades')
    }
  }

  async getLiquidacion(id: number): Promise<any> {
    try {
      (this as any).mensajeSpinner = 'Leyendo Liquidacion'
      let liquidacion = await this.apiService.getLiquidacion(id)
      // Ajustar para el formulario
      Object.assign(liquidacion, {
        sum_conceptos: liquidacion.detalles.reduce((acc: number, curr: any) => acc + parseFloat(curr.valor), 0),
        sum_exoneraciones: liquidacion.exoneraciones,
        total: liquidacion.subtotal,
        observaciones: liquidacion.observacion,
        total_cobro: liquidacion.total,
        num_documento: liquidacion.documento,
        fecha: moment(liquidacion.fecha).format('YYYY-MM-DD'),
        conceptos: [],
        exoneraciones: []
      })
      Object.assign(liquidacion.lote, {
        label: `Zona: ${liquidacion.lote.zona.padStart(3, '0')} Sector: ${liquidacion.lote.sector} Manzana: ${liquidacion.lote.manzana} Solar: ${liquidacion.lote.solar}`
      })

      return liquidacion;
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  /// HELPERS
  verificacionTerceraEdad(event) {
    /* let hoy = moment()
    let nacimiento = moment(event)

    let anio_diff = hoy.diff(nacimiento, 'years')
    return anio_diff >= 65 */

    // console.log(event);
    let fecha = event.split('-')
    let actualyear = new Date().getFullYear()
    let anio = actualyear - parseInt(fecha[0])
    let mes = (new Date().getMonth() + 1) >= parseInt(fecha[1])
    let dia = (new Date().getDate()) >= parseInt(fecha[2])
    console.log(mes);
    console.log(dia);


    if (anio >= 65) {

      if ((new Date().getMonth() + 1) > parseInt(fecha[1])) {

        return true
        console.log('Mayor a mes');

      } else if ((new Date().getMonth() + 1) == parseInt(fecha[1])) {
        if (dia) {

          return true
          console.log('Mayor mes y dia');
        } else {

          return (false)
        }
      } else {

        return (false)
        console.log(anio - 1);
      }

    } else {

      return (false)
      console.log(anio - 1);
    }

  }

  expandSupervivencia(id) {
    console.log('generacion')
    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;
    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }

}
