import { Component, OnInit,ViewChild } from '@angular/core';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ConsultaMovimientosService } from './consulta-movimientos.service'
import { CommonVarService } from 'src/app/services/common-var.services';
import * as moment from 'moment';
import { XlsExportService } from 'src/app/services/xls-export.service';

@Component({
standalone: false,
  selector: 'app-consulta-movimientos',
  templateUrl: './consulta-movimientos.component.html',
  styleUrls: ['./consulta-movimientos.component.scss']
})

export class ConsultaMovimientosComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  fTitle = 'Consulta Movimientos';
  vmButtons: any
  cmb_periodo: any[] = []
  fechaDesde: any;
  fechaHasta: any;
  consultaExcel: any = []
  resultadoConsulta: any = []
  filter: any = {
    periodo: Number(moment(new Date()).format('YYYY')),
    mes_actual: Number(moment(new Date()).format('MM')),
    fecha_desde: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
    fecha_hasta: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
    tipo: null,
    tipo_afectacion: null,
    codigo_partida:null ,
    codigo_partida_compuesto: ''
  }
  paginate: any = {
    perPage: 50,
    page: 1,
    length: 0,
    pageSizeOptions: [10, 25, 50, 100, 150, 1000, 2000]
  }

  rubro = {
    id_rubro: 0,
    codigo: null,
    nombre: null,
    cuentaInvDeb: null,
    cuentaCorrDeb: null,
    cuentaProdDeb: null,
    cuentaPresupuestoInvDeb: null,
    cuentaPresupuestoCorrDeb: null,
    cuentaPresupuestoProdDeb: null,
    cuentaInvHab: null,
    cuentaCorrHab: null,
    cuentaProdHab: null,
    alSueldo: null,
    alIngreso: null,
    losep: null,
    aportable: null,
    tipoRubro: null,
    automatico: null,
    estado: null,
    numcInvDeb: null,
    numcCorrDeb: null,
    numcProdDeb: null,
    numpcInvDeb: null,
    numpcCorrDeb: null,
    numpcProdDeb: null,
    diferencia_por_region: null,
    numcInvHab: null,
    numcCorrHab: null,
    numcProdHab: null,
  }

  totalPartida = 0
  totalCertificado = 0
  totalComprometido = 0
  totalDevengado = 0
  totalCobradoPagado = 0

  tipoList = [{ label: 'INGRESO', value: 'INGRESO' }, { label: 'GASTOS', value: 'GASTOS' }]
  tipoAfectacionList = [{ descripcion: 'CERTIFICADO', valor: 'CERTIFICADO' },{ descripcion: 'COMPROMETIDO', valor: 'COMPROMETIDO' }, { descripcion: 'DEVENGADO', valor: 'DEVENGADO' }, { valor: 'COBRADO', descripcion: 'COBRADO' },{ valor: 'PAGADO', descripcion: 'PAGADO' }]
  arrayMes: any = [{id: 0,name: "-Todos-" },{id: 1,name: "Enero"},{id: 2,name: "Febrero"},{id: 3,name: "Marzo"},{id: 4,name: "Abril"},{id: 5,name: "Mayo"},{id:6,name: "Junio"},{id:7,name: "Julio"},{id: 8,name: "Agosto"},{id: 9,name: "Septiembre"},{id: 10,name: "Octubre"},{id: 11,name: "Noviembre"}, {id: 12,name: "Diciembre" }];
  constructor(
    private xlsService: XlsExportService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService, private apiSrv: ConsultaMovimientosService) {
      this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
        (res) => {
          console.log(res);
          console.log(res.presupuesto?.codigo ? res.presupuesto_haber?.codigo : '')
          if (res.validacion == '1') {
            this.rubro.cuentaInvDeb = res.data.codigo
            this.rubro.numcInvDeb = res.data.nombre
            this.rubro.cuentaPresupuestoInvDeb = res.data.presupuesto != null ? res.data.presupuesto?.codigo : res.data.presupuesto_haber?.codigo
            this.rubro.numpcInvDeb = res.data.presupuesto != null ? res.data.presupuesto?.nombre : res.data.presupuesto_haber?.nombre
          } else if (res.validacion == 'p1') {
            this.rubro.cuentaPresupuestoInvDeb = res.data.codigo
            this.rubro.numpcInvDeb = res.data.descripcion_general
          }
        }
      )
  }
  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsconsulta", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsconsulta", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar:false , imprimir: false },
      { orig: "btnsconsulta", paramAccion: "", boton: { icon: "fa fa-file-excel", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
    ];
    setTimeout(() => {
      this.cargaInicial();
    }, 50)
  }

  ChangeYearPeriodos(evento:any){
    console.log(evento.periodo);
    this.ChangeMesCierrePeriodos(this.filter.mes_actual)
    this.vmButtons[0].habilitar = false; //.
    this.vmButtons[2].habilitar = false;
  }
  ChangeMesCierrePeriodos(evento: any) {
    const year = this.filter.periodo;
    let efent;
    this.filter.mes_actual = evento;
    if(evento == 0){
      const primerDia = new Date(year, 1 - 1, 1).toISOString().substring(0, 10);
      const ultimoDia = new Date(year, 12, 0).toISOString().substring(0, 10);
      this.filter.fecha_desde= primerDia;
      this.filter.fecha_hasta = ultimoDia;
    }else{
      const primerDia = new Date(year, evento - 1, 1).toISOString().substring(0, 10);
    const ultimoDia = new Date(year, evento, 0).toISOString().substring(0, 10);
    this.filter.fecha_desde= primerDia;
    this.filter.fecha_hasta = ultimoDia;
    }
    
  } 

  modalCodigoPresupuesto(valor) {
    let modal = this.modalDet.open(ModalCuentPreComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.tieneReglas = false;
    modal.componentInstance.validar = valor;
  }
  async cargaInicial() {
    try {
      this.lcargando.ctlSpinner(true);
      const resPeriodos = await this.apiSrv.getPeriodos()
      this.cmb_periodo = resPeriodos
      this.lcargando.ctlSpinner(false);
    } catch (err) {
      this.lcargando.ctlSpinner(false);
    }
  }

  clanForm(){
 
  
    this.filter.periodo = Number(moment(new Date()).format('YYYY'))
    this.filter.tipo = null
    this.filter.mes_actual=Number(moment(new Date()).format('MM'))
    this.filter.fecha_desde= new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
    this.filter.fecha_hasta= new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
    this.filter.tipo= null
    this.filter.tipo_afectacion= null
    this.filter.codigo_partida=null 
    this.filter.codigo_partida_compuesto = ''
    this.rubro.cuentaPresupuestoInvDeb=null 
    this.rubro.numpcInvDeb  =null 
    this.resultadoConsulta = [];
    this.totalPartida = 0
    this.totalComprometido = 0
    this.totalDevengado = 0
    this.totalCobradoPagado = 0
    //this.vmButtons[0].habilitar = true;
    this.vmButtons[2].habilitar = true;
   
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " PROCESAR":
        // this.setProcesoCedulaPresupuestaria();
        break;
      case "CONSULTAR":
        //   this.validaConsultaRdep();
        this.consultarCedulaIngresos();
        break;
      case "LIMPIAR":
        this.clanForm();//   this.restoreForm();
        break;
      case "EXCEL":
        //  this.btnExportarExcel();
        this.btnExportExcel();
        break;
      case " XML":
        //  this.GeneraXmlRdep()
        break;
    }
  }

  handleColumnCheck(event: any, data: any) {
    this.resultadoConsulta.forEach(e => {
      if (event.target.checked) {
        Object.assign(e, { aprobar: event.target.checked })
      } else {
        if (e.tiene_control != true) {
          Object.assign(e, { aprobar: false })
        }
      }
    });
    let sinAprobar = this.resultadoConsulta.filter(e => e.aprobar == true && e.num_control == '')
    if (sinAprobar.length > 0) {
      //this.vmButtons[2].habilitar = false;
    } else {
      // this.vmButtons[2].habilitar = true;
    }
  }

  consultarCedulaIngresos() {
    this.lcargando.ctlSpinner(true);
    this.filter.codigo_partida = this.rubro.cuentaPresupuestoInvDeb;

    let totalPartida = 0
    let totalCertificado = 0
    let totalComprometido = 0
    let totalDevengado = 0
    let totalCobradoPagado = 0
    let data = {
      filter: this.filter,
      paginate: this.paginate
    }
    this.apiSrv.consultarmovimientos(data).subscribe(res => {
      console.log(res["data"]);
      this.resultadoConsulta = [];
      if (res["data"].length > 0) {
       
        this.resultadoConsulta = res["data"];

        this.resultadoConsulta.forEach(e => {
          totalPartida += parseFloat(e.valor_partida)
          totalCertificado += parseFloat(e.certificado) 
          totalComprometido += parseFloat(e.comprometido) 
          totalDevengado += parseFloat(e.devengado)
          totalCobradoPagado += parseFloat(e.cobrado_pagado)
        })

        this.totalPartida = totalPartida
        this.totalCertificado = totalCertificado
        this.totalComprometido = totalComprometido
        this.totalDevengado = totalDevengado
        this.totalCobradoPagado = totalCobradoPagado

        this.vmButtons[2].habilitar = false;
      } else {

      }
      this.lcargando.ctlSpinner(false);
    }, error => { this.lcargando.ctlSpinner(false);
    })
  }

  btnExportExcel() {
    
    this.filter.codigo_partida = this.rubro.cuentaPresupuestoInvDeb;
      this.lcargando.ctlSpinner(true);

    let totalPartida = 0
    let totalCertificado = 0
    let totalComprometido = 0
    let totalDevengado = 0
    let totalCobradoPagado = 0

    let data = {
      filter: this.filter,
      paginate: this.paginate
    }
    let year;
    this.apiSrv.consultarmovimientos(data).subscribe(res => {
      this.consultaExcel = res["data"];
      this.consultaExcel.forEach(e => {
        Object.assign(e, {
          num_doc:e.num_doc,
          concepto:e.concepto,
          fecha:e.fecha.slice(0, 10),
          codigo_partida:parseFloat(e.codigo_partida),
          nombre_partida:e.nombre_partida,
          codigo_partida_compuesto:parseFloat(e.codigopartida),
          valor_partida:parseFloat(e.valor_partida),
          tipo_presupuesto:e.tipo_presupuesto,
          tipo_afectacion:e.tipo_afectacion,
          certificado:parseFloat(e.certificado),
          comprometido:parseFloat(e.comprometido),
          devengado:parseFloat(e.devengado),
          cobrado_pagado:parseFloat(e.cobrado_pagado),
          cod_programa:parseFloat(e.cod_programa),
          nombre_programa:e.nombre_programa
          
        });
          totalPartida += parseFloat(e.valor_partida)
          totalCertificado += parseFloat(e.certificado) 
          totalComprometido += parseFloat(e.comprometido) 
          totalDevengado += parseFloat(e.devengado)
          totalCobradoPagado += parseFloat(e.cobrado_pagado)
      })

      let totales = {
        num_doc:'',
          concepto:'',
          fecha:'',
          codigo_partida:'',
          nombre_partida:'',
          codigo_partida_compuesto:'',
          valor_partida: totalPartida,
          tipo_presupuesto:'',
          tipo_afectacion:'',
          certificado: totalCertificado,
          comprometido: totalComprometido,
          devengado:totalDevengado,
          cobrado_pagado:totalCobradoPagado,
          cod_programa:'',
          nombre_programa:''
      }
      this.consultaExcel.push(totales)

      if (this.consultaExcel.length > 0) {
        let data = {
          title: 'Consulta de movimientos',
          rows: this.consultaExcel
        }
        this.xlsService.exportExcelMovimientos(data, 'Consulta movimientos')
      } else {
      }
      this.lcargando.ctlSpinner(false);
    }, error => {
    });
  }
}
