import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ConciliacionService } from './conciliacion.service';
import { CommonService } from '../../../../services/commonServices';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { formatDate } from '@angular/common';
import { DataConciliacion } from './data_conciliacion';
import { ListaConciliaciones } from './ListaConciliaciones';
import { environment } from 'src/environments/environment';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { MovimientoBancarioFormComponent } from './movimiento-bancario-form/movimiento-bancario-form.component';
import { DetalleConciliacionComponent } from './detalle-conciliacion/detalle-conciliacion.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.scss']
})
export class ConciliacionComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  dataUser: any;
  processing: any = false;
  backAcount: any;
  bankSelect: any = null;
  permisions: any;
  viewDate: Date = new Date();
  fromDatePicker: any = formatDate(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1), 'yyyy-MM-dd', 'en');
  toDatePicker: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  arrayBanks: any;
  validaDt: any = false;


  infoConciliacion: ListaConciliaciones[];
  infoConciliacionConsulta: ListaConciliaciones[];

  infoMovimientosBancarios: any =[]
  infoDt: DataConciliacion[];
  selectedDataConcilia: DataConciliacion[];
  status_conciliaton: any = 0;
  saldo_bank: number = 0;
  saldo_libros: number = 0;
  saldo_bank_final: number = 0
  checkGlobal: any = false;
  btnDisabled: any = false;
  EstadoCuenta: number = 0;
  SaldoConciliado: number = 0;
  bankSelectConsulta: any;
  mes_actual_consulta: any;

  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  selectAllChecked: boolean = true;


  selected_anio: any;
  mes_actual: any = 0;
  locality: any;


  permiso_ver: any = "0";
  tipobusqueda: any;
  filtro_tipo: any;

  fecha_desde_movimiento: any = new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10);
  fecha_hasta_movimiento: any = new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10);

  disabledFields: boolean = false;
  arrayMes: any =
    [
      // {id: "0",name: "-Todos-"},
      {id: "1",name: "Enero" },
      {id: "2", name: "Febrero"},
      {id: "3",name: "Marzo"},
      {id: "4",name: "Abril"},
      {id: "5",name: "Mayo"},
      {id: "6",name: "Junio"},
      {id: "7",name: "Julio"},
      {id: "8",name: "Agosto"},
      {id: "9",name: "Septiembre"},
      {id: "10",name: "Octubre"},
      {id: "11",name: "Noviembre"},
      {id: "12",name: "Diciembre"},
    ];
    tipo_movimientos: any =
    [
      {id: "D",name: "Débito"},
      {id: "C",name: "Crédito"},
    ];

    estado_movimiento: any = [
      {id: "A",name: "Activo"},
      {id: "I",name: "Inactivo"}
    ]




    cmb_periodo: any[] = []

    fecha_desde: any = formatDate(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1), 'yyyy-MM-dd', 'en');
    fecha_hasta: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    bancoConsulta: any = 0
    bancoConsultaMovimiento : any = 0


    filter: any = {
      periodo_movimiento: Number(moment(new Date()).format('YYYY')),
      mes_actual_movimiento: Number(moment(new Date()).format('MM')),
      fecha_desde_movimiento: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
      fecha_hasta_movimiento: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
      fecha_conciliacion: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
      tipo_movimiento: 0,
      estado:0 ,
      banco: 0
    }

    paginate:any = 0

  constructor(
    private cslSrv: ConciliacionService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private cierremesService: CierreMesService,
    private router: Router,
    private modalSrv: NgbModal
  ) {


    this.cslSrv.movimientos$.subscribe(
      (res: any) => {
      console.log(res)
        if(res){
          this.conultaMovimientoBancarios();
        }
      }
    )

  }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.getPermisions();
   //console.log(this.disabledFields)
  }

  getPermisions() {

    //this.selected_anio = moment(new Date()).format('YYYY');
    this.selected_anio = new Date();
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();
    this.filter.mes_actual_movimiento = (Number(moment(new Date()).format('MM'))).toString();


    this.bankSelectConsulta = 0;
    this.mes_actual_consulta = '0';

    this.isRowSeleCkeckConcilia = this.isRowSeleCkeckConcilia.bind(this);

    this.vmButtons = [

      { orig: "btnConciBanc", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "1", boton: { icon: "fal fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: true, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "1", boton: { icon: "fal fa-money-check-edit", texto: "CONCILIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false },
      //{ orig: "btnConciBanc", paramAccion: "1", boton: { icon: "far fa-edit", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-info btn-sm", habilitar: true, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "1", boton: { icon: "far fa-edit", texto: "HABILITAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: true, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "1", boton: { icon: "far fa-window-close", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "2", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "1", boton: { icon: "far fa-window-close", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "3", boton: { icon: "fal fa-save", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-info btn-sm", habilitar: true, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "3", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnConciBanc", paramAccion: "3", boton: { icon: "fal fa-money-check-edit", texto: "ACTUALIZAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },

    ];


    this.tipobusqueda =
      [
        {
          nombre: 'TODAS',
          id: 0
        },
        {
          nombre: 'CONCILIADAS',
          id: 1
        },
        {
          nombre: 'SIN CONCILIAR',
          id: 2
        },

      ]

      this.paginate = {
        length: 0,
        perPage: 20,
        page: 1,
        pageSizeOptions: [20,50, 100]
      };


    setTimeout(() => {
      this.cargaInicial()
      //this.lcargando.ctlSpinner(true);
    }, 50);


    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fConciliacionBank,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'][0];
      this.permiso_ver = this.permisions.ver;

      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de conciliación bancaria");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getInfoBank();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })



    this.filtro_tipo = 0;



  }

  metodoGlobal(evento: any) {
    console.log(evento)
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "1GUARDAR":
        this.validateSaveBorrador();
        break;
      case "1CONSULTAR":
        this.rerenderFech();
        break;
      case "1CONCILIAR":
        this.validateSave();
        break;
      case "1HABILITAR":
        this.validateSaveHabilitar();
        break;
      case "1CANCELAR":
        this.cancel();
        break;
      case "2CONSULTAR":
        this.conultaListaConcliadas();
        break;
      case "1LIMPIAR":
        this.cancel();
        break;
      case "3NUEVO":
        this.nuevoMovimiento(true, {});
        break;
      case "3CONSULTAR":
        this.conultaMovimientoBancarios();
        break;
      case "3ACTUALIZAR":
        this.actualizarConciliacion();
        break;
    }
  }
  ChangeMesCierrePeriodosMov(evento: any) {
    const year = this.filter.periodo;
    let efent;
    this.filter.mes_actual_movimiento = evento;
    // if(evento == 0){
    //   const primerDia = new Date(year, 1 - 1, 1).toISOString().substring(0, 10);
    //   const ultimoDia = new Date(year, 12, 0).toISOString().substring(0, 10);
    //   this.filter.fecha_desde= primerDia;
    //   this.filter.fecha_hasta = ultimoDia;
    // }else{
    //   const primerDia = new Date(year, evento - 1, 1).toISOString().substring(0, 10);
    // const ultimoDia = new Date(year, evento, 0).toISOString().substring(0, 10);
    // this.filter.fecha_desde= primerDia;
    // this.filter.fecha_hasta = ultimoDia;
    // }

  }


  async cargaInicial() {
    try {
      this.lcargando.ctlSpinner(true);
      const resPeriodos = await this.cslSrv.getPeriodos()
      this.cmb_periodo = resPeriodos
      this.lcargando.ctlSpinner(false);
    } catch (err) {
      this.lcargando.ctlSpinner(false);
    }
  }



  getInfoBank() {
    this.cslSrv.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe(res => {

      console.log(res['data']);

      this.arrayBanks = res['data'];
      this.bankSelect = 0;
      if (this.arrayBanks.length > 0) {
        this.bankSelect = this.arrayBanks[0].id_banks;
      }
      /*
      if (this.bankSelect != 0) {
        this.saldo_bank = this.arrayBanks.filter(e => e.id_banks == this.bankSelect)[0]['saldo_cuenta'];
      } else {
        this.saldo_bank = '0.00';
      }*/

     // this.getTableConciliation();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  ChangeMesCierrePeriodos(evento: any) {
    const year = this.filter.periodo_movimiento;
     this.mes_actual = evento;

     if(evento == 0){
      const primerDia = new Date(year, 1 - 1, 1).toISOString().substring(0, 10);
      const ultimoDia = new Date(year, 12, 0).toISOString().substring(0, 10);
    //  this.filter.fecha_desde= primerDia;
    //  this.filter.fecha_hasta = ultimoDia;
    }else{
      const primerDia = new Date(year, evento - 1, 1).toISOString().substring(0, 10);
    const ultimoDia = new Date(year, evento, 0).toISOString().substring(0, 10);
   // this.filter.fecha_desde= primerDia;
    this.filter.fecha_conciliacion = ultimoDia;
    }


    }

  getTableConciliation() {
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
//console.log('aqui 1')
console.log(moment(this.selected_anio).format('YYYY'))

    this.checkGlobal = false;
    this.backAcount = this.arrayBanks.filter(e => e.id_banks == this.bankSelect)[0]['cuenta_contable'];


    let dataConsulta = {
      anio: moment(this.selected_anio).format('YYYY'),
      //id_banco: this.bankSelectConsulta,
      id_banco: this.bankSelect,
      mes:Number(this.mes_actual),
      estado: this.filtro_tipo
    }


    this.cslSrv.ListaConciliaciones(dataConsulta).subscribe(res => {
      this.vmButtons[6].habilitar = false;
      //console.log('aqui 2')
      this.infoConciliacion = <ListaConciliaciones[]>res['data'];
      //console.log('aqui 3')
      //console.log(res['data'])
      if(this.infoConciliacion.length > 0){
        //console.log('aqui 4')
        if(this.infoConciliacion[0].estado === 'E'){
          // this.vmButtons[1].habilitar = false;
          // this.vmButtons[2].habilitar = false;
          // this.vmButtons[3].habilitar = false;
          this.vmButtons[3].habilitar = true;
          this.disabledFields=false;
        }else if(this.infoConciliacion[0].estado === 'C'){
          // this.vmButtons[1].habilitar = true;
          // this.vmButtons[2].habilitar = true;
          // this.vmButtons[3].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.disabledFields=true;
        }else{
          this.disabledFields=true;
        }

        if(this.infoConciliacion[0].isactive === 1){

         // this.filtro_tipo = 1;

          let data = {
            anio: moment(this.selected_anio).format('YYYY'),
            mes: this.mes_actual,
            status: this.status_conciliaton,
            id_banco: this.bankSelect,
            cuenta: this.backAcount
          }
          //console.log(this.infoConciliacion[0].estado)
          this.ObetenerSaldosBancoPeriodo(data);

          this.ConsultaConciliacionMes();

          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
          //this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;

        }else{

          this.ConsultaConciliacionMes();
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;

        }



      }else{
        //console.log('aqui 5')
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;


       // this.filtro_tipo = 0;
        this.ConsultaConciliacionMes();

      }

    }, error => {

    });



  }


  ConsultaConciliacionMes(){
    let conciliada= ''
    if(this.filtro_tipo == 0){
      conciliada = 'TODAS'
    }
    if(this.filtro_tipo == 1){
      conciliada = 'Si'
    }
    if(this.filtro_tipo == 2){
      conciliada = 'No'
    }
    //console.log('aqui 6')
    let data = {
      anio: moment(this.selected_anio).format('YYYY'),
      mes: this.mes_actual,
      status: this.status_conciliaton,
      id_banco: this.bankSelect,
      cuenta: this.backAcount,
      estado: conciliada
    }



    this.cslSrv.ObtenerConciliacion(data).subscribe(res => {


      //console.log( <DataConciliacion[]>res['data']);
      //console.log('aqui 7')

      if(res['data'].length > 0){
        //console.log('aqui 8')
        //  console.log(data.cerrada)
          let cerradas: any = [];
         cerradas = res['data'].filter(e => e.cerrada == 'Si');
          //console.log(cerradas)
          if(cerradas.length > 0){
            this.disabledFields=true;
            this.vmButtons[1].habilitar = true;
            this.vmButtons[2].habilitar = true;
            this.vmButtons[3].habilitar = false;
          }else{
            this.disabledFields=false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = false;
            this.vmButtons[3].habilitar = true;
          }
        }
        //console.log('aqui 9')
      this.ObetenerSaldosBancoPeriodo(data);
      //console.log('aqui 10')

      this.validaDt = true;
      //this.infoDt = <DataConciliacion[]>res['data'];
      this.infoDt =res['data']
      this.infoDt.forEach(e => {
        Object.assign(e,{fecha_conciliacion:moment(e.fecha_conciliacion).format('YYYY-MM-DD')})
      });


      console.log(this.infoDt)
      //console.log('aqui 11')
      //console.log(res['data'].filter(e => e.conciliada == 'Si'));
      this.selectedDataConcilia = <DataConciliacion[]>res['data'].filter(e => e.conciliada == 'Si');
      console.log(this.selectedDataConcilia)

      //console.log('aqui 12')
      localStorage.setItem('conciliation', JSON.stringify(this.infoDt));
      //console.log('aqui 13')
    }, error => {
      this.validaDt = true;
      this.infoDt = [];
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    });

  }


  conultaListaConcliadas() {
    let yearDesde;
    let yearHasta;

    let mesDesde = Number(moment(this.fecha_desde).format("MM"));
    yearDesde = Number(moment(this.fecha_desde).format("YYYY"));

    let mesHasta = Number(moment(this.fecha_hasta).format("MM"));
    yearHasta = Number(moment(this.fecha_hasta).format("YYYY"));

    let Desde = String(yearDesde*100+mesDesde)
    let Hasta = String(yearHasta*100+mesHasta)

    let data = {
      fecha_desde: Desde,
      fecha_hasta: Hasta,
      id_banco: this.bancoConsulta,
    }

    this.lcargando.ctlSpinner(true);


    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.cslSrv.getConciliaciones(data).subscribe(res => {
      console.log(res)

      this.infoConciliacion = <ListaConciliaciones[]>res['data'];
      this.infoConciliacionConsulta = <ListaConciliaciones[]>res['data'];
      console.log(this.infoConciliacionConsulta);
      this.lcargando.ctlSpinner(false);

    }, error => {

    });
  }


  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }

  ObetenerSaldosBancoPeriodo(data) {


    this.cslSrv.ObtenerSaldosBancoPeriodo(data).subscribe(saldos => {

      this.lcargando.ctlSpinner(false);
      console.log(saldos['data'])

      if (saldos['data'].length > 0) {

        this.EstadoCuenta = parseFloat(saldos['data'][0].estado_cuenta_banco);
        this.saldo_bank = parseFloat(saldos['data'][0].saldo_inicial);
        this.SaldoConciliado = parseFloat(saldos['data'][0].saldo_bancos);
        this.saldo_libros = parseFloat(saldos['data'][0].saldo_segun_libros);
        // this.saldo_bank_final = this.formatNumber(saldos['data'][0].saldo_final);
        this.saldo_bank_final = parseFloat(saldos['data'][0].saldo_final);
      }


    }, error => {

      this.toastr.info("No se puedo ejecutar el proceso, verificar " + error);
      this.lcargando.ctlSpinner(false);

    });




  }

  rerenderBank(evt) {
    /*
    if (evt != 0) {
      this.saldo_bank = this.arrayBanks.filter(e => e.id_banks == evt)[0]['saldo_cuenta'];
    } else {
      this.saldo_bank = '0.00';
    }*/
   // this.rerender();
  }

  rerenderFech() {
    this.status_conciliaton = null;
    this.rerender();
  }

  rerender(): void {
    this.validaDt = false;
    this.status_conciliaton = 0;
    this.infoConciliacion = []
    this.getTableConciliation();

  }

  consultConciliado() {

    let status = this.tipobusqueda;

    this.lcargando.ctlSpinner(true);
    this.status_conciliaton = status;
    this.rerender();
  }

  actualizarFechaConciliacion() {

    for (const inf of this.infoDt) {
      inf.fecha_conciliacion = this.filter.fecha_conciliacion;
    }
  }

  seleccionarTodos(event) {
   // alert(event.checked);
    if (event.checked) {
      this.infoDt.forEach(item => {
        item.fecha_conciliacion = this.filter.fecha_conciliacion;
        item.conciliada="Si";
      });
      let SaldoECuenta = ((typeof this.EstadoCuenta === 'number') ? this.EstadoCuenta : parseFloat(this.EstadoCuenta));
      let SaldoConciliado = ((typeof this.SaldoConciliado === 'number') ? this.SaldoConciliado : parseFloat(this.SaldoConciliado));

      let SaldoConcilia = 0;

      if (SaldoECuenta != 0) {


          if(this.selectedDataConcilia.length > 0){
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = false;
          }
          this.selectedDataConcilia.forEach((data: any) => {
            if (data['debito'] > 0) SaldoConcilia += data['debito'] * 100
            else SaldoConcilia -=  data['credito'] * 100
          })

          this.SaldoConciliado = SaldoConcilia / 100;
          this.saldo_bank_final = (SaldoConcilia / 100) + this.saldo_bank;

        this.SaldoConciliado = SaldoConcilia / 100;
        this.saldo_bank_final = (SaldoConcilia / 100) + this.saldo_bank;
        // Si el checkbox está marcado
        //alert('El checkbox está marcado');
        // Realiza las acciones necesarias
      }
    } else {
      this.infoDt.forEach(item => {
        item.fecha_conciliacion = this.filter.fecha_conciliacion;
        item.conciliada="No";
      });

      let SaldoECuenta = ((typeof this.EstadoCuenta === 'number') ? this.EstadoCuenta : parseFloat(this.EstadoCuenta));
      let SaldoConciliado = ((typeof this.SaldoConciliado === 'number') ? this.SaldoConciliado : parseFloat(this.SaldoConciliado));

      let SaldoConcilia = 0;

      if (SaldoECuenta != 0) {
          if(this.selectedDataConcilia.length > 0){
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = false;
          }

          this.selectedDataConcilia.forEach((data: any) => {
            if (data['debito'] > 0) SaldoConcilia += data['debito'] * 100
            else SaldoConcilia -=  data['credito'] * 100
          })
          this.SaldoConciliado = SaldoConcilia / 100;
          this.saldo_bank_final = (SaldoConcilia / 100) + this.saldo_bank;
          // Si el checkbox está desmarcado
          // alert('El checkbox está desmarcado');
          // Realiza las acciones necesarias
      }
    }
  }

  selectAll() {
    this.checkGlobal = !this.checkGlobal;
    if (this.checkGlobal) {
      this.infoDt.forEach(element => {
        element['status_conciliacion'] = true;
        element['fecha_conciliacion'] = this.filter.fecha_conciliacion;
      });
    } else {
      this.validaDt = false;
      this.infoDt = [];
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.validaDt = true;
        this.infoDt = JSON.parse(localStorage.getItem('conciliation'));
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      });
    }
  }

  cancel() {

    this.saldo_bank = 0;
    this.saldo_libros = 0;
    this.saldo_bank_final = 0;
    this.checkGlobal = false;
    this.btnDisabled = false;
    this.validaDt = false;
    this.fromDatePicker = formatDate(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1), 'yyyy-MM-dd', 'en');
    this.toDatePicker = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.status_conciliaton = 0;
    this.infoDt = [];


   // this.selected_anio = moment(new Date()).format('YYYY');
    this.selected_anio = new Date();
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();

    this.bankSelectConsulta = 0;
    this.mes_actual_consulta = '0';
    this.EstadoCuenta = 0;


    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;

   // this.rerender();



  }

  compararAnioConFecha(anio: number, fecha: any): boolean {
    // Extraer el año de la fecha
    //const anioFecha = fecha.getFullYear();
    const anioFecha = Number(moment(fecha).format('YYYY'))

    // Comparar los años
    console.log(anio + '---'+anioFecha)
    return anio == anioFecha;
}
compararMesConFecha(mes: number, fecha: any): boolean {
  // Extraer el año de la fecha
  //const anioFecha = fecha.getFullYear();
  const mesFecha = Number(moment(fecha).format('MM'))

  // Comparar los años
  console.log(mes + '---'+mesFecha)
  return mes == Number(mesFecha);
}





  validateSaveBorrador() {
    let mensaje: string = '';
    if (this.permisions.editar == "0") {
      mensaje += 'Usuario no tiene Permiso para modificar los registros'
    }
    else if(this.EstadoCuenta == 0 ){
      mensaje += 'El campo Estado de cuenta no puede ser 0'
    } else if( this.selectedDataConcilia.length == 0){
      mensaje += 'No puede guardar sin registros seleccionados'
    }
    else if(this.selectedDataConcilia.length > 0){


      this.selectedDataConcilia.forEach( e =>{

         // Ejemplo de uso
         const anio = this.selected_anio.getFullYear(); // Año a comparar
         const fecha = e.fecha_conciliacion; // Fecha actual

         const mes = this.mes_actual;
         console.log(this.compararAnioConFecha(anio, fecha) && this.compararMesConFecha(mes, fecha))
         if (this.compararAnioConFecha(anio, fecha) && this.compararMesConFecha(mes, fecha)) {
           //  console.log(`El año ${anio} es igual al año de la fecha.`);
         } else {

          mensaje += '* Debe colocar una fecha de banco que sea de período '+ this.selected_anio.getFullYear() + ' y el mes de '+  moment(this.mes_actual).format('MMMM')+' en la línea '+e.linea+'<br>'
        }

      })
      // console.log(this.selectedDataConcilia)
      //   for (let index = 0; index < this.selectedDataConcilia.length; index++) {
      //     let anioBanco = moment(this.selectedDataConcilia[index].fecha_conciliacion).format('YYYY')
      //     let mesBanco = moment(this.selectedDataConcilia[index].fecha_conciliacion).format('MM')

      //     if (moment(this.selectedDataConcilia[index].fecha_conciliacion).format('YYYY')!= this.selected_anio.getFullYear() && Number(moment(this.selectedDataConcilia[index].fecha_conciliacion).format('MM')) != this.mes_actual) {
      //       mensaje += '* Debe colocar una fecha de banco que sea de período '+ this.selected_anio.getFullYear() + ' y el mes de '+  moment(this.mes_actual).format('MMMM')+' en la línea '+this.selectedDataConcilia[index].linea+'<br>'
      //     }

      //     console.log(anioBanco[index] + '-'+this.selected_anio.getFullYear())
      //     console.log(Number(mesBanco[index])+ '-'+this.mes_actual)

      //   }
    }


    if (mensaje.length > 0) {
      this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true })
      return;
    }else
     {
      Swal.fire({
        title: "Confirmar!!",
        text: "Desea Guardar  un borrador de la conciliación?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {

          this.mensajeSppiner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(moment(this.selected_anio).format('YYYY'),),
            "mes": Number(moment(this.mes_actual).format('MM'))
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              this.RegistrarBorradorConciliacion();

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })

        }
      })
    }
  }


  RegistrarBorradorConciliacion() {
  //  const unselectedDataConcilia = this.infoDt.filter(row => !this.selectedDataConcilia.includes(row));

    const conciliatedRows = this.infoDt.filter(row => row.conciliada === "Si");
    const unselectedDataConcilia = this.infoDt.filter(row => row.conciliada === "No");
    this.lcargando.ctlSpinner(true);

    console.log(conciliatedRows);
    console.log(unselectedDataConcilia);
    if ((typeof this.selectedDataConcilia === 'undefined') || (typeof this.selectedDataConcilia === undefined)) {
      this.toastr.info("No hay registros seleccionados para guardar");
      return false;
    }

    if (this.selectedDataConcilia.length > 0) {

      let data = {
        anio: moment(this.selected_anio).format('YYYY'),
        mes: this.mes_actual,
        status: this.status_conciliaton,
        id_banco: this.bankSelect,
        cuenta: this.backAcount,
        fecha_conciliacion: this.filter.fecha_conciliacion,
        //details: this.infoDt,
        details: conciliatedRows,
        estadoCuenta: this.EstadoCuenta,
        details2: unselectedDataConcilia
      }

      this.cslSrv.RegistrarBorrador(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.vmButtons[6].habilitar = false;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

    } else {
      this.lcargando.ctlSpinner(false);
      this.toastr.info("No hay registros seleccionados para guardar");
    }
  }

  ChangeMesCierrePeriodos2(evento: any) {
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

  onRowSelect(event) {
    console.log(event, ' aqui')
    console.log(this.selectedDataConcilia)
//alert(event);
event.data.fecha_conciliacion = this.filter.fecha_conciliacion;

    event.data.conciliada = 'Si';
    let SaldoECuenta = ((typeof this.EstadoCuenta === 'number') ? this.EstadoCuenta : parseFloat(this.EstadoCuenta));
    let SaldoConciliado = ((typeof this.SaldoConciliado === 'number') ? this.SaldoConciliado : parseFloat(this.SaldoConciliado));

    let SaldoConcilia = 0;

    if (SaldoECuenta != 0) {

      // if(SaldoConciliado < SaldoECuenta){

        if(this.selectedDataConcilia.length > 0){
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
        }

        // Formatear numero a cosa rara
        /* for (let element of this.selectedDataConcilia) {
          let deb = element['debito'].toString().replace('$', '').replace(',', '');
          if (parseFloat(deb) > 0) {
            SaldoConcilia += parseFloat(deb);
          } else {
            let haber = element['credito'].toString().replace('$', '').replace(',', '');
            SaldoConcilia = SaldoConcilia - parseFloat(haber);
          }
        } */
        this.selectedDataConcilia.forEach((data: any) => {
          if (data['debito'] > 0) SaldoConcilia += data['debito'] * 100
          else SaldoConcilia -=  data['credito'] * 100
        })

        this.SaldoConciliado = SaldoConcilia / 100;
        this.saldo_bank_final = (SaldoConcilia / 100) + this.saldo_bank;

      /* }else{

        this.toastr.info("El total de los saldos conciliados, ya coinciden con el saldo ingresado del estado de cuenta");

      } */

    } else {
      this.selectedDataConcilia = [];
      this.toastr.info("Para poder conciliar, se requiere colocar el saldo del Esatdo de cuenta de banco");
    }


  }

  onRowUnselect(event) {
    console.log(event)
    console.log(this.selectedDataConcilia)
    event.data.conciliada = 'No';
    let SaldoECuenta = ((typeof this.EstadoCuenta === 'number') ? this.EstadoCuenta : parseFloat(this.EstadoCuenta));
    let SaldoConciliado = ((typeof this.SaldoConciliado === 'number') ? this.SaldoConciliado : parseFloat(this.SaldoConciliado));

    let SaldoConcilia = 0;

    if (SaldoECuenta != 0) {

      // if(SaldoConciliado < SaldoECuenta){

        if(this.selectedDataConcilia.length > 0){
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
        }

        // Formatear numero a cosa rara
        /* for (let element of this.selectedDataConcilia) {
          let deb = element['debito'].toString().replace('$', '').replace(',', '');
          if (parseFloat(deb) > 0) {
            SaldoConcilia += parseFloat(deb);
          } else {
            let haber = element['credito'].toString().replace('$', '').replace(',', '');
            SaldoConcilia = SaldoConcilia - parseFloat(haber);
          }
        } */
        this.selectedDataConcilia.forEach((data: any) => {
          if (data['debito'] > 0) SaldoConcilia += data['debito'] * 100
          else SaldoConcilia -=  data['credito'] * 100
        })




        this.SaldoConciliado = SaldoConcilia / 100;
        this.saldo_bank_final = (SaldoConcilia / 100) + this.saldo_bank;

      /* }else{

        this.toastr.info("El total de los saldos conciliados, ya coinciden con el saldo ingresado del estado de cuenta");

      } */

    } else {
      this.selectedDataConcilia = [];
      this.toastr.info("Para poder conciliar, se requiere colocar el saldo del Esatdo de cuenta de banco");
    }

    if(this.selectedDataConcilia.length === 0){
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
    }
  }

  /* onRowUnselect(event) {
    //console.log(event, ' unselectrow')
    event.data.conciliada = 'No';
    let SaldoECuenta = ((typeof this.EstadoCuenta === 'number') ? this.EstadoCuenta : parseFloat(this.EstadoCuenta));
    let SaldoConciliado = ((typeof this.SaldoConciliado === 'number') ? this.SaldoConciliado : parseFloat(this.SaldoConciliado));

    let SaldoConcilia = 0;

    if (SaldoECuenta > 0) {

      if(SaldoConciliado < SaldoECuenta || 1==1){

        if(this.selectedDataConcilia.length > 0){
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
        }

        for (let element of this.selectedDataConcilia) {
          let deb = element['debito'].toString().replace('$', '').replace(',', '');
          if (parseFloat(deb) > 0) {
            SaldoConcilia += parseFloat(deb);
          } else {
            let haber = element['credito'].toString().replace('$', '').replace(',', '');
            SaldoConcilia = SaldoConcilia - parseFloat(haber);
          }
        }

        this.SaldoConciliado = SaldoConcilia;
        this.saldo_bank_final = SaldoConcilia - this.saldo_bank;

      }else{

        this.toastr.info("El total de los saldos conciliados, ya coinciden con el saldo ingresado del estado de cuentaaaa");

      }

    } else {
      this.selectedDataConcilia = [];
      this.toastr.info("Para poder conciliar, se requiere colocar el saldo del Esatdo de cuenta de banco");
    }
    if(this.selectedDataConcilia.length === 0){
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
    }

  } */


  isRowSeleCkeckConcilia(event) {
    //console.log(event)
    if (event.data !== 'undefined') {
      //console.log('click');
    }
    return !this.isOutOfBlock(event.data);
  }

  isOutOfBlock(data) {

    let resp = ((typeof this.EstadoCuenta === 'number') ? this.EstadoCuenta : parseFloat(this.EstadoCuenta))  === 0;
    if(!resp){

      let SaldoECuenta = ((typeof this.EstadoCuenta === 'number') ? this.EstadoCuenta : parseFloat(this.EstadoCuenta));
      let SaldoConciliado = ((typeof this.SaldoConciliado === 'number') ? this.SaldoConciliado : parseFloat(this.SaldoConciliado));

      if(SaldoConciliado >= SaldoECuenta){
        resp = false;
      }

    }

    return resp;
  }



  onRowSelectConciliados(event) {
    console.log(event,' Selected')
  }


  onRowUnselectConciliados(event) {
    console.log(event, ' UNSelected')
  }

  dinamicoBotones(valor: any) {

    let value = valor.index + 1;

    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if (element.paramAccion == value) {
          element.permiso = true; element.showimg = true;
        } else {
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);


  }


  handleChange(e) {
    var index = e.index;

    this.vmButtons[0].showimg = false;

    if (index === 0) {

      this.vmButtons[0].showimg = true;
      this.vmButtons[1].showimg = true;
      this.vmButtons[2].showimg = true;
      this.vmButtons[3].showimg = true;
      this.vmButtons[4].showimg = false;
      this.vmButtons[5].showimg = false;
      this.vmButtons[6].showimg = true;
      this.vmButtons[7].showimg = false;
      this.vmButtons[8].showimg = false;
      this.vmButtons[9].showimg = true;


    }else if(index === 1){
      this.vmButtons[0].showimg = false;
      this.vmButtons[1].showimg = false;
      this.vmButtons[2].showimg = false;
      this.vmButtons[3].showimg = false;
      this.vmButtons[4].showimg = false;
      this.vmButtons[5].showimg = false;
      this.vmButtons[6].showimg = false;
      this.vmButtons[7].showimg = true;
      this.vmButtons[7].habilitar = false;
      this.vmButtons[8].showimg = true;
      this.vmButtons[8].habilitar = false;
      this.vmButtons[9].showimg = false;
    }
    else {

      this.vmButtons[0].showimg = false;
      this.vmButtons[1].showimg = false;
      this.vmButtons[2].showimg = false;
      this.vmButtons[3].showimg = false;
      this.vmButtons[4].showimg = true;
      this.vmButtons[5].showimg = true;
      this.vmButtons[6].showimg = false;
      this.vmButtons[7].showimg = false;
      this.vmButtons[8].showimg = false;
      this.vmButtons[9].showimg = false;

    }
  }

  validateSaveHabilitar() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para modificar los registros");
    } else {
      Swal.fire({
        title: "Atención!!",
        text: "¿Seguro desea habilitar la opción de editar una conciliación ya generada?",
        //icon: "warning",
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {

          this.mensajeSppiner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(moment(this.selected_anio).format('YYYY'),),
            "mes": Number(moment(this.mes_actual).format('MM'))
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              this.habilitarConciliation();

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })

        }
      })
    }

  }


  validateSave() {
    console.log(this.infoDt)
    let mensaje: string = '';
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para modificar los registros");
    }

    else if(this.infoDt.length > 0){
      this.selectedDataConcilia.forEach( e =>{

        // Ejemplo de uso
        const anio = this.selected_anio.getFullYear(); // Año a comparar
        const fecha = e.fecha_conciliacion; // Fecha actual

        const mes = this.mes_actual;
        console.log(this.compararAnioConFecha(anio, fecha) && this.compararMesConFecha(mes, fecha))
        if (this.compararAnioConFecha(anio, fecha) && this.compararMesConFecha(mes, fecha)) {
          //  console.log(`El año ${anio} es igual al año de la fecha.`);
        } else {

         mensaje += '* Debe colocar una fecha de banco que sea de período '+ this.selected_anio.getFullYear() + ' y el mes de '+  moment(this.mes_actual).format('MMMM')+' en la línea '+e.linea+'<br>'
       }

     })
      // console.log(this.infoDt)
      //   for (let index = 0; index < this.infoDt.length; index++) {
      //     let anioBanco = moment(this.infoDt[index].fecha_conciliacion).format('YYYY')
      //     let mesBanco = moment(this.infoDt[index].fecha_conciliacion).format('MM')
      //     console.log(anioBanco + '-'+this.selected_anio)
      //     console.log(mesBanco + '-'+this.mes_actual)
      //     if (anioBanco[index] != this.selected_anio.getFullYear() && Number(mesBanco[index]) != this.mes_actual) {
      //       mensaje += '* Debe colocar una fecha de banco que sea de período '+ this.selected_anio.getFullYear() + ' y el mes de '+  moment(this.mes_actual).format('MMMM')+' en la línea '+this.selectedDataConcilia[index].linea+'<br>'
      //     }

      //   }
    }

    if (mensaje.length > 0) {
      this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true })
      return;
    } else {


      let SaldoEstaCuenta = ((typeof this.EstadoCuenta === 'number') ? this.EstadoCuenta : parseFloat(this.EstadoCuenta));
      let SaldoConciliado = ((typeof this.SaldoConciliado === 'number') ? this.SaldoConciliado : parseFloat(this.SaldoConciliado));
      let SaldoFinal = ((typeof this.saldo_bank_final === 'number') ? this.saldo_bank_final : parseFloat(this.saldo_bank_final));


  //console.log(this.formatNumber(SaldoFinal) , this.formatNumber(SaldoEstaCuenta))

      if(this.formatNumber(SaldoFinal) === this.formatNumber(SaldoEstaCuenta)){

        Swal.fire({
          title: "Atención!!",
          text: "Seguro desea realizar la conciliación?",
          //icon: "warning",
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {

            this.mensajeSppiner = "Verificando período contable";
            this.lcargando.ctlSpinner(true);
            let data = {
              "anio": Number(moment(this.selected_anio).format('YYYY'),),
              "mes": Number(moment(this.mes_actual).format('MM'))
            }
              this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

              /* Validamos si el periodo se encuentra aperturado */
              if (res["data"][0].estado !== 'C') {

                this.updateConciliation();

              } else {
                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
              }

              }, error => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.mesagge);
              })

          }
        })

      }else{

        this.toastr.info("Para generar la conciliación el Saldo final debe ser igual al valor del estado de cuenta");

      }
    }
  }
  habilitarConciliation(){

    let data = {
      anio: moment(this.selected_anio).format('YYYY'),
      mes: this.mes_actual,
      status: this.status_conciliaton,
      id_banco: this.bankSelect,
      cuenta: this.backAcount,
      fecha_conciliacion: moment(this.selected_anio).format('YYYY') + '-' + this.mes_actual + '-' + '01',
      details: this.infoDt,
      estadoCuenta: this.EstadoCuenta
    }

    this.cslSrv.habilitarConciliation(data).subscribe(res => {

      this.vmButtons[6].habilitar = false;

      this.getTableConciliation();
      // this.disabledFields=false;
      // this.vmButtons[1].habilitar = false;
      // this.vmButtons[2].habilitar = false;
      // this.vmButtons[4].habilitar = true;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  updateConciliation() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para modificar los registros");
    } else {

    }

    this.lcargando.ctlSpinner(true);

    let data = {
      info: this.infoDt,
      ip: this.commonServices.getIpAddress(),
      accion: `Conciliación bancaria por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fConciliacionBank,
      anio: moment(this.selected_anio).format('YYYY'),
      mes: this.mes_actual,
      status: this.status_conciliaton,
      id_banco: this.bankSelect,
      cuenta: this.backAcount,
      fecha_conciliacion: moment(this.selected_anio).format('YYYY') + '-' + this.mes_actual + '-' + '01',
      details: this.infoDt,
      estadoCuenta: this.EstadoCuenta
    }

    this.cslSrv.saveConciliation(data).subscribe(res => {

        localStorage.removeItem('conciliation');
        this.toastr.success(res['message']);
        this.lcargando.ctlSpinner(false);
        this.cancel();

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });

  }

  changeStus(dt, index) {
    this.infoDt.forEach(element => {
      if (element['num_doc'] == dt.num_doc && element['num_doc'] != null) {
        element['status_conciliacion'] = dt.status_conciliacion
        element['fecha_conciliacion'] = this.filter.fecha_conciliacion
      } else {
        this.infoDt[index]['status_conciliacion'] = dt.status_conciliacion;
        this.infoDt[index]['fecha_conciliacion'] = this.filter.fecha_conciliacion
      }
    });
  }


  ObtenerPeriodo(anio: any) {

    this.selected_anio = anio;

    let data = {
      "anio": anio
    }

    this.lcargando.ctlSpinner(true);

    this.cierremesService.obtenerCierresPeriodo(data).subscribe(res => {

      if (res["data"].length > 0) {
        for (let element of res["data"]) {

          let mes_letter;

          switch (element["mes"]) {
            case 1: {
              mes_letter = "ENERO";
              break;
            }
            case 2: {
              mes_letter = "FEBRERO";
              break;
            }
            case 3: {
              mes_letter = "MARZO";
              break;
            }
            case 4: {
              mes_letter = "ABRIL";
              break;
            }
            case 5: {
              mes_letter = "MAYO";
              break;
            }
            case 6: {
              mes_letter = "JUNIO";
              break;
            }
            case 7: {
              mes_letter = "JULIO";
              break;
            }
            case 8: {
              mes_letter = "AGOSTO";
              break;
            }
            case 9: {
              mes_letter = "SEPTIEMBRE";
              break;
            }
            case 10: {
              mes_letter = "OCTUBRE";
              break;
            }
            case 11: {
              mes_letter = "NOBIEMBRE";
              break;
            }
            case 12: {
              mes_letter = "DICIEMBRE";
              break;
            }
          }


          this.lcargando.ctlSpinner(false);

        }
      } else {

        this.toastr.info("No hay información para mostrar");
        this.lcargando.ctlSpinner(false);
      }


    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })

  }


  SaldoFinalCal(){
    return this.saldo_bank_final;
  }

  SaldoInicialCal(){
    return this.saldo_bank;
  }


  estatucDetails(data:any){

    return (data === 'Si') ? "CONCILIADO" : "NO CONCILIADO";

  }

  descargarPdf(selected){
    console.log(selected)
    console.log(selected['id_banks'])
    let id_banco = selected['id_banks'];
    let cuenta = selected['cuenta_contable']
    let anio = selected['anio'];
    let mes = selected['mes'];

      window.open(environment.ReportingUrl + "rpt_conciliacion_bancaria.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_banco="+id_banco +"&cuenta="+cuenta +"&anio="+anio +"&mes="+mes, '_blank');
    console.log(environment.ReportingUrl + "rpt_conciliacion_bancaria.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_banco="+id_banco +"&cuenta="+cuenta +"&anio="+anio +"&mes="+mes)
  }
  descargarConciliacionDetallePdf(selected){
    console.log(selected)
    console.log(selected['id_banks'])
    let id_banco = selected['id_banks'];
    let cuenta = selected['cuenta_contable']
    let anio = selected['anio'];
    let mes = selected['mes'];

      window.open(environment.ReportingUrl + "rpt_conciliacion_bancaria_resumen.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_banco="+id_banco +"&cuenta="+cuenta +"&anio="+anio +"&mes="+mes, '_blank');
    console.log(environment.ReportingUrl + "rpt_conciliacion_bancaria_resumen.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_banco="+id_banco +"&cuenta="+cuenta +"&anio="+anio +"&mes="+mes)
  }

  nuevoMovimiento(isNew:boolean, data?:any) {

      const modalInvoice = this.modalSrv.open(MovimientoBancarioFormComponent, {
        size: "xl",
        // backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fConciliacionBank;

      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;



  }

  conultaMovimientoBancarios() {
    this.mensajeSppiner = "Cargando Movimientos Bancarios...";
    this.lcargando.ctlSpinner(true);
    //this.filter.mes_actual_movimiento = Number( this.filter.mes_actual_movimiento)
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.cslSrv.getMovimientoBancarios(data).subscribe(res => {
      console.log(res)
      //this.infoMovimientosBancarios =res['data']['data'][0];
      this.paginate.length = res['data']['data'].total;
      this.infoMovimientosBancarios = (res['data']['data'].current_page == 1) ? res['data']['data']: Object.values(res['data']['data'])
      this.lcargando.ctlSpinner(false);


    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
      console.log(error);
    });
  }


  actualizarConciliacion() {

    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let data = {
      "anio": Number(moment(this.selected_anio).format('YYYY'),),
      "mes": Number(moment(this.mes_actual).format('MM'))
    }
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

      /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {

        this.mensajeSppiner = "Actualizando Conciliación...";
        this.lcargando.ctlSpinner(true);
        //this.filter.mes_actual_movimiento = Number( this.filter.mes_actual_movimiento)
        let data2 = {
          anio: moment(this.selected_anio).format('YYYY'),
          mes: this.mes_actual,
          status: this.status_conciliaton,
          id_banco: this.bankSelect,
          cuenta: this.backAcount,
          //estado: conciliada
        }


        this.cslSrv.actualizarConciliacion(data2).subscribe(res => {
          console.log(res)
          //this.infoMovimientosBancarios =res['data']['data'][0];
          //this.paginate.length = res['data']['data'].total;
          //this.infoMovimientosBancarios = (res['data']['data'].current_page == 1) ? res['data']['data']: Object.values(res['data']['data'])
          this.lcargando.ctlSpinner(false);


        }, (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
          console.log(error);
        });

      } else {
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }

      }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
      })

  }

  convertirMes(evento){

    let mes_letter = ""
    switch (evento) {
      case 1: {
        mes_letter = "ENERO";
        break;
      }
      case 2: {
        mes_letter = "FEBRERO";
        break;
      }
      case 3: {
        mes_letter = "MARZO";
        break;
      }
      case 4: {
        mes_letter = "ABRIL";
        break;
      }
      case 5: {
        mes_letter = "MAYO";
        break;
      }
      case 6: {
        mes_letter = "JUNIO";
        break;
      }
      case 7: {
        mes_letter = "JULIO";
        break;
      }
      case 8: {
        mes_letter = "AGOSTO";
        break;
      }
      case 9: {
        mes_letter = "SEPTIEMBRE";
        break;
      }
      case 10: {
        mes_letter = "OCTUBRE";
        break;
      }
      case 11: {
        mes_letter = "NOBIEMBRE";
        break;
      }
      case 12: {
        mes_letter = "DICIEMBRE";
        break;
      }
    }
    return mes_letter;
  }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.conultaMovimientoBancarios();
  }

  showConciliacionBancaria(data?:any) {
    // console.log(data);
    // if (!isNew && this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos para consultar Tickets.", this.fTitle);
    // } else if (isNew && this.permissions.guardar == "0") {
    //   this.toastr.warning("No tiene permisos para crear Tickets.", this.fTitle);
    // } else {
      const modalInvoice = this.modalSrv.open(DetalleConciliacionComponent, {
        size: "xl",
        // backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fConciliacionBank;
      modalInvoice.componentInstance.data = data;
    //}
  }




}
