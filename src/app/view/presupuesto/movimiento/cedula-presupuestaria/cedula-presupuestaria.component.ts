import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CedulaPresupuestariaService } from './cedula-presupuestaria.service';
import { environment } from 'src/environments/environment';
import { DetalleReformaComponent } from './detalle-reforma/detalle-reforma.component';
import e from 'cors';

@Component({
standalone: false,
  selector: 'app-cedula-presupuestaria',
  templateUrl: './cedula-presupuestaria.component.html',
  styleUrls: ['./cedula-presupuestaria.component.scss']
})
export class CedulaPresupuestariaComponent implements OnInit {

  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  
  fTitle: string = "Cédula Presupuestaria";

  vmButtons: any
  //periodo: any;
  arrayCedula: any = []
  arrayCedulaPrograma: any = []
  arrayCedulaResumen: any = []
  arrayCedulaEjecucion: any = []
  procesos: any = [];
  cmb_periodo: any[] = []
 
  tipoSelected: any
  procesoSelected: any
  programa: any = 'N' ;
  checkPrograma: boolean = false
  resumen: boolean = false
  ejecucion: boolean = false
  tipo: boolean = true
  procesoDisabled: boolean = false
  totalIngresos: any = 0
  totalEgresos: any = 0
  totalDiferencia: any = 0
  mes_actual: any = 0;

  totalCodificadoInv: any = 0
  totalDevengadoInv: any = 0
  totalPorDevengarInv: any = 0

  totalCodificadoCorr: any = 0
  totalDevengadoCorr: any = 0
  totalPorDevengarCorr: any = 0

  totalCodificadoFin: any = 0
  totalDevengadoFin: any = 0
  totalPorDevengarFin: any = 0

  totalCodificadoGeneral: any = 0
  totalDevengadoGeneral: any = 0
  totalPorDevengarGeneral: any = 0

  filter: any = {
    periodo: Number(moment(new Date()).format('YYYY')),
    mes_actual:Number(moment(new Date()).format('MM')),
    fecha_desde: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
    fecha_hasta: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
   
    nivel: 0,
    tipo: ['I','G']
  }
  paginate: any = {
    perPage: 50,
    page: 1,
    length: 0,
    pageSizeOptions: [10, 25, 50, 100,150,1000,2000]
  }

  tipoList = [
    {value: "I",label: "INGRESOS"},
    {value: "G",label: "GASTOS"},
    {value: "R",label: "RESUMEN"},
    {value: "E",label: "EJECUCION"}
  ]
  arrayMes: any = [{id: 0,name: "-Todos-" },{id: 1,name: "Enero"},{id: 2,name: "Febrero"},{id: 3,name: "Marzo"},{id: 4,name: "Abril"},{id: 5,name: "Mayo"},{id:6,name: "Junio"},{id:7,name: "Julio"},{id: 8,name: "Agosto"},{id: 9,name: "Septiembre"},{id: 10,name: "Octubre"},{id: 11,name: "Noviembre"}, {id: 12,name: "Diciembre" }];


  constructor( private commonSrv: CommonService,
    private toastr: ToastrService,
    private apiSrv: CedulaPresupuestariaService,
    private modal: NgbModal,
    private commonVar: CommonVarService) { }

  ngOnInit(): void {

    this.filter.mes_actual = Number(moment(new Date()).format('MM'));
    this.vmButtons = [
      { orig: "btnsCedulaP", paramAccion: "", boton: { icon: "far fa-search", texto: " PROCESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsCedulaP", paramAccion: "", boton: { icon: "far fa-search", texto: " CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsCedulaP", paramAccion: "", boton: { icon: "far fa-eraser", texto: " LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsCedulaP", paramAccion: "", boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true, imprimir: true},
    ]
    
    setTimeout(()=> {
      this.cargaInicial()
      this.getCatalogos();
    }, 50);

  }

  
  metodoGlobal(event){
    switch(event.items.boton.texto){
      case " PROCESAR":
         this.setProcesoCedulaPresupuestaria();
        break;
      case " CONSULTAR":
         this.validaConsultaCedula();
        break;
      case " LIMPIAR":
         this.restoreForm();
        break;
      case " IMPRIMIR":
         this.btnImprimir();
        break;
    }
  }
  ChangeYearPeriodos(evento:any){
   // console.log(evento.periodo);
    this.ChangeMesCierrePeriodos(this.filter.mes_actual)
   // this.vmButtons[0].habilitar = false; //.
   // this.vmButtons[2].habilitar = false;
  }
  ChangeMesCierrePeriodos(evento: any) { 
    const year = this.filter.periodo;
    this.mes_actual = evento; 
    this.filter.mes_actual = evento ;
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
  async validaConsultaCedula() {
    let resp = await this.validaDataGlobal().then((respuesta) => {
      if(respuesta) {
          this.consultarCedula(); 
      }
    });
}
validaDataGlobal() {
  let flag = false;
  return new Promise((resolve, reject) => {

    if (this.filter.periodo == undefined || this.filter.periodo == '' )
    {
      this.toastr.info('Debe ingresar un Período');
      flag = true;
    }else if( this.tipoSelected == 0 || this.tipoSelected == '' || this.tipoSelected == undefined) 
    {
      this.toastr.info('Debe seleccionar un tipo');
      flag = true;
    }
    !flag ? resolve(true) : resolve(false);
  })
}


asignarTipo(evt) {
  if(evt!=undefined){
    //this.procesoDisabled= true
    //this.vmButtons[0].habilitar = true;
    this.arrayCedula=[]
    this.arrayCedulaPrograma=[]
    this.arrayCedulaResumen= []
    this.arrayCedulaEjecucion= []
    this.totalIngresos=0
    this.totalEgresos= 0
  
    console.log(evt)
    if(evt=='I'){
      this.resumen= false
      this.checkPrograma = false
      this.tipo = true
      this.ejecucion = false
      this.vmButtons[0].habilitar = false;
    }if(evt=='G'){
      this.resumen= false
      this.checkPrograma = false
      this.tipo = true
      this.ejecucion = false
      this.vmButtons[0].habilitar = false;
    }
    if(evt=='R'){
      this.resumen= true
      this.checkPrograma = false
      this.tipo = false
      this.ejecucion = false
    }
     if(evt=='E'){
      this.resumen= false
      this.checkPrograma = false
      this.tipo = false
      this.ejecucion = true
    }
    this.filter.tipo = [evt]
  }
}
asignarProceso(evt){
  if(evt!=undefined){
    //this.procesoDisabled= false
    this.vmButtons[0].habilitar = false;
    //this.vmButtons[1].habilitar = true;
  }
}
programaChecked(){
console.log(this.checkPrograma)
}

 getCatalogos() {
    let data = {
      params: "'PRE_PROCESOS'",
    };
   
    this.apiSrv.getCatalogos(data).subscribe(
     
      (res) => {
        this.procesos = res["data"]['PRE_PROCESOS'];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {

      this.mensajeSpiner = "Cargando Períodos"
      const resPeriodos = await this.apiSrv.getPeriodos()
      this.cmb_periodo = resPeriodos

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }
 

  consultarCedula(){
    
    if(this.checkPrograma){
      this.consultarCedulaPorPrograma();
    }else if(this.resumen){
      this.consultarCedulaResumen();
    }
    else if(this.ejecucion){
      console.log(this.ejecucion)
      this.consultarCedulaEjecucion();
    }
    else{
      this.consultarCedulaIngresos();
    }
  }
  consultarCedulaPorPrograma(){
    this.arrayCedulaPrograma = []
    if(this.filter.nivel == null) this.filter.nivel= 0
    let data = {
      //periodo: this.periodo,
      filter: this.filter,
      paginate: this.paginate
    }
 
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCedulaPorPrograma(data).subscribe(res => {
      console.log(res["data"]);
      if(res["data"].length > 0){
        res["data"].forEach(e => {
          if(e.partida.length ==1){
            Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer:parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido), class:'font-weight-bold' , size:"font-size:14px;"});
          } else if(e.partida.length ==2){
            Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer:parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido), class:'font-weight-bold font-italic ' , size:"font-size:12px;text-decoration: underline;"});
          }
          else if(e.partida.length ==4){
            Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer:parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido), class:'font-weight-bold' , size:"font-size:12px;"});
          }
          else{
            Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer:parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido), class:'text-bold' , size:"font-size:12px;"});
          }
        })
  
        this.arrayCedulaPrograma = res["data"]
        let totalIngresos = 0
        let totalEgresos = 0
        this.arrayCedulaPrograma.filter(e => {
          if(e.partida.length ==1){
            if(e.tipo=='I'){
              let valor100 = +e.asignacion_codificada * 100;
              totalIngresos += +valor100
            }
            if(e.tipo=='G'){
              let valor100 = +e.asignacion_codificada * 100;
              totalEgresos += +valor100
            }
            
          }
        }) 
        this.totalIngresos= totalIngresos/100
        this.totalEgresos= totalEgresos/100
        this.vmButtons[3].habilitar = false;
      }else{
        this.toastr.info('No hay datos para este Período');
      }
      this.lcargando.ctlSpinner(false);
      
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
}

  consultarCedulaIngresos(){

    //alert('ak');
    this.arrayCedula = []
    if(this.filter.nivel == null) this.filter.nivel= 0
      let data = {
        //periodo: this.periodo,
        filter: this.filter,
        paginate: this.paginate
      }
      console.log(data);
      this.lcargando.ctlSpinner(true);
      this.apiSrv.consultarCedulaIngresos(data).subscribe(res => {
        console.log(res["data"]);
        if(res["data"].length > 0){
          res["data"].forEach(e => {
            if(this.tipoSelected=='I'){
              if(e.partida.length ==1){
                Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), class:'font-weight-bold' , size:"font-size:14px;"});
              } else if(e.partida.length ==2){
                Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), class:'font-weight-bold font-italic ' , size:"font-size:12px;text-decoration: underline;"});
              }
              else if(e.partida.length ==4){
                Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), class:'font-weight-bold' , size:"font-size:12px;"});
              }
              else{
                Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), class:'text-bold' , size:"font-size:12px;"});
              }
            }
            if(this.tipoSelected=='G'){
              if(e.partida!=null){
                if(e.partida.length ==1){
                  Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer: parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido),class:'text-bold h5', size:"font-size:14px"});
                }else if(e.partida.length ==2){
                  Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer: parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido),class:'font-weight-bold font-italic text-decoration-underline' , size:"font-size:12px;text-decoration: underline;"});
                }else if(e.partida.length ==4){
                  Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado),saldo_comprometer: parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido), class:'font-weight-bold' , size:"font-size:12px;"});
                }
                else{
                  Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer: parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido),class:'text-bold', size:"font-size:12px"});
                }
              }
            }

          })
    
          this.arrayCedula = res["data"]

        let totalIngresos = 0
        let totalEgresos = 0
        this.arrayCedula.filter(e => {
          if(e.partida!=null){
            if(e.partida.length ==1){
              if(e.tipo=='I'){
                let valor100 = +e.asignacion_codificada * 100;
                totalIngresos += +valor100
              }
              if(e.tipo=='G'){
                let valor100 = +e.asignacion_codificada * 100;
                totalEgresos += +valor100
              }
            }
          }

        }) 
        this.totalIngresos= totalIngresos/100
        this.totalEgresos= totalEgresos/100
          this.vmButtons[3].habilitar = false;
        }else{
          this.toastr.info('No hay datos para este Período');
        }
        this.lcargando.ctlSpinner(false);
        
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      })
  }
  consultarCedulaResumen(){
    this.arrayCedulaResumen = []
    let data = {
      //periodo: this.periodo,
      filter: this.filter,
      paginate: this.paginate
    }
 
    this.lcargando.ctlSpinner(true);
    this.apiSrv.consultarCedulaResumen(data).subscribe(res => {
      console.log(res["data"]);
     
      if(res["data"].length > 0){
        res["data"].forEach(e => {
          console.log(e.partida.length)
          if(e.tipo=='I'){
            Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer: "0.00"});
          }
          if(e.tipo=='G'){
            Object.assign(e, {saldo_devengar: parseFloat(e.asignacion_codificada) - parseFloat(e.devengado), saldo_comprometer: parseFloat(e.asignacion_codificada) - parseFloat(e.comprometido)});
          }
        })
  
        this.arrayCedulaResumen = res["data"]
        let totalIngresos = 0
        let totalEgresos = 0
        this.arrayCedulaResumen.filter(e => {
          if(e.partida.length ==1){
            if(e.tipo=='I'){
              let valor100 = +e.asignacion_codificada * 100;
              totalIngresos += +valor100
            }
            if(e.tipo=='G'){
              let valor100 = +e.asignacion_codificada * 100;
              totalEgresos += +valor100
            }
            
          }
        }) 
        this.totalIngresos= totalIngresos/100
        this.totalEgresos= totalEgresos/100


        this.totalDiferencia=this.totalIngresos - this.totalEgresos


        this.vmButtons[3].habilitar = false;
      }else{
        this.toastr.info('No hay datos para este Período');
      }
      this.lcargando.ctlSpinner(false);
      
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
}
consultarCedulaEjecucion(){
  this.arrayCedulaEjecucion = []
  let data = {
    //periodo: this.periodo,
    filter: this.filter,
    paginate: this.paginate
  }
console.log(data);
  alert('aki');
  this.lcargando.ctlSpinner(true);
  this.apiSrv.consultarCedulaEjecucion(data).subscribe(res => {
    console.log(res["data"]);
   
    if(res["data"].length > 0){
      

      this.arrayCedulaEjecucion = res["data"]
      let totalCodInv = 0
      let totalDevInv = 0
      let totalPorDevInv = 0

      let totalCodCorr = 0
      let totalDevCorr = 0
      let totalPorDevCorr = 0

      let totalCodFin = 0
      let totalDevFin = 0
      let totalPorDevFin = 0

      let totalCodGeneral = 0
      let totalDevGeneral = 0
      let totalPorDevGeneral = 0
      
      this.arrayCedulaEjecucion.forEach(e => {
        if(e.partida.length ==1){
          if(e.naturaleza=='CORRIENTE'){

            totalCodCorr += +e.total_3
            totalDevCorr += +e.total_6
            totalPorDevCorr += +e.total_9
          }
          if(e.naturaleza=='INVERSION'){

            totalCodInv += +e.total_3
            totalDevInv += +e.total_6
            totalPorDevInv += +e.total_9
          }
          if(e.naturaleza=='FINANCIAMIENTO'){
            totalCodFin += +e.total_3
            totalDevFin += +e.total_6
            totalPorDevFin += +e.total_9
          }
          totalCodGeneral += +e.total_3
          totalDevGeneral += +e.total_6
          totalPorDevGeneral += +e.total_9
          
        }
      }) 
      this.totalCodificadoInv= totalCodInv
      this.totalDevengadoInv= totalDevInv
      this.totalPorDevengarInv= totalPorDevInv

      this.totalCodificadoCorr= totalCodCorr
      this.totalDevengadoCorr= totalDevCorr
      this.totalPorDevengarCorr= totalPorDevCorr

      this.totalCodificadoFin= totalCodFin
      this.totalDevengadoFin= totalDevFin
      this.totalPorDevengarFin= totalPorDevFin

      this.totalCodificadoGeneral= totalCodGeneral
      this.totalDevengadoGeneral= totalDevGeneral
      this.totalPorDevengarGeneral= totalPorDevGeneral


      //this.totalDiferencia=this.totalIngresos - this.totalEgresos


      this.vmButtons[3].habilitar = false;
    }else{
      this.toastr.info('No hay datos para este Período');
    }
    this.lcargando.ctlSpinner(false);
    
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.toastr.info(error.error.mesagge);
  })
}

totalCodInv(){

}
totalesCorriente(){
  
}
totalesFinanciamiento(){
  
}



setProcesoCedulaPresupuestaria() {
  if(this.filter.periodo ==undefined  || this.filter.periodo==''){
    this.toastr.info('Debe seleccionar un periodo');
  }
  else if(this.procesoSelected==undefined || this.procesoSelected==''){
    this.toastr.info('Debe seleccionar un proceso');
  }
  else{

    let data = {
      periodo: this.filter.periodo,
      proceso: this.procesoSelected,
      mes: this.filter.mes_actual

    }
  
    this.lcargando.ctlSpinner(true);
    this.apiSrv.setProcesoCedulaPresupuestaria(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info('El proceso fue ejecutado con éxito');
    },error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    });
  }


}

consultaDetalleReforma(data?:any) {
 
  const modalInvoice = this.modal.open(DetalleReformaComponent, {
    size: "lg",
    backdrop: "static",
    windowClass: "viewer-content-general",
  });
  modalInvoice.componentInstance.data = data;
  modalInvoice.componentInstance.periodo = this.filter.periodo;
  //modalInvoice.componentInstance.permissions = this.permissions;
}


  restoreForm() {
    this.arrayCedula = []
    this.arrayCedulaPrograma = []
    this.arrayCedulaResumen = []
    this.procesos = [];
    this.tipoSelected = undefined
    this.filter = {
      periodo: this.filter.periodo,
      mes_actual:Number(moment(new Date()).format('MM')),
      fecha_desde: moment().format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      nivel: 0,
      tipo: undefined
    }
 
    this.totalIngresos=0.00
    this.totalEgresos=0.00
    this.totalDiferencia=0.00
    this.procesoDisabled= false
    this.programa = 'N'
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
  }

  btnImprimir(){
    let nivel = 0
    if(this.filter.nivel == 0 || this.filter.nivel == undefined){
      nivel = 6
    } else if(this.filter.nivel == 3 ){
      nivel = 4
    }
    else if(this.filter.nivel == 4){
      nivel = 6
    }
    else {
      nivel = this.filter.nivel
    }
   

    
    if(this.checkPrograma){
      if(this.filter.mes_actual == undefined){
        this.toastr.info('Por favor seleccione un mes')
      }else{
        if(this.tipoSelected=='I'){
          window.open(environment.ReportingUrl + "rpt_pre_cedula_ingresos_programa.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&mes="+ this.filter.mes_actual+"&nivel="+nivel, '_blank');
          console.log(environment.ReportingUrl + "rpt_pre_cedula_ingresos_programa.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&mes="+ this.filter.mes_actual+"&nivel="+nivel)
        }else if(this.tipoSelected=='G'){
          window.open(environment.ReportingUrl + "rpt_pre_cedula_gastos_programa.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&mes="+ this.filter.mes_actual+"&nivel="+nivel, '_blank');
          console.log(environment.ReportingUrl + "rpt_pre_cedula_gastos_programa.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&mes="+ this.filter.mes_actual+"&nivel="+nivel)
        }
      }
      
    }else{
      if(this.tipoSelected=='I'){
        window.open(environment.ReportingUrl + "rpt_pre_cedula_ingresos.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&nivel="+nivel, '_blank');
        console.log(environment.ReportingUrl + "rpt_pre_cedula_ingresos.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&nivel="+nivel)
      }else if(this.tipoSelected=='G'){
        window.open(environment.ReportingUrl + "rpt_pre_cedula_gastos.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&nivel="+nivel, '_blank');
        console.log(environment.ReportingUrl + "rpt_pre_cedula_gastos.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&nivel="+nivel)
      }else if(this.tipoSelected=='E'){
        window.open(environment.ReportingUrl + "rpt_pre_ejecucion_presupuestaria.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&nivel="+nivel, '_blank');
        console.log(environment.ReportingUrl + "rpt_pre_ejecucion_presupuestaria.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&periodo="+ this.filter.periodo+"&tipo="+ this.tipoSelected+"&nivel="+nivel)
      }
    }
    

  }

  seleccionado(event){
   
    if (event.checked.length > 0) {
     
      this.programa= 'S';
    } else {
      
      this.programa= 'N';
    }
    console.log(this.programa)
  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

}
