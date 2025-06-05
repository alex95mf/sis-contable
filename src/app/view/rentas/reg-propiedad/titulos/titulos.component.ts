import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { GeneracionService } from 'src/app/view/reg-propiedad/liquidacion/generacion/generacion.service';
import { TitulosService } from './titulos.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import * as myVarGlobals from 'src/app/global';


@Component({
standalone: false,
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.scss']
})
export class TitulosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Aprobación de títulos (Rentas)";
  mensajeSpinner: string = "Cargando...";
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  select_estado = 0;

  liquidacionesDt: any = [];

  estadosList = [
    {
      value: 'E',
      label: "Emitido",
    },
    {
      value: 'A',
      label: "Aprobado",
    },
    {
      value: 'T',
      label: "Todos",
    },
  ];

  constructor(
    private apiSrv: GeneracionService,
    private tituloSrv: TitulosService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private cierremesService: CierreMesService
  ) { 

  }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      razon_social: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      estado: ['E','A'],
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [2, 5, 10, 20]
    }

  }

  ngAfterViewInit() {

    setTimeout(()=>{
      this.validaPermisos();
    },0)

    
  }

  estadoToPrint(estado) {
    if(estado === 'E'){
      return "Emitido"
    } else if(estado === 'A'){
      return "Aprobado"
    } else {
      return "Todos"
    }
  }

  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';

    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fRenTitulos,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso");
        } else {
          this.cargarLiquidaciones();
        }
      }
    )

  }

  cargarLiquidaciones() {

    (this as any).mensajeSpinner = "Cargando lista de liquidaciones...";
      this.lcargando.ctlSpinner(true);

      let data = {
        concepto: {
          //id: 31
          codigo:'RP'
        },
        params: {
          filter: this.filter,
          paginate: this.paginate,
        }
      }

      this.apiSrv.getLiquidaciones(data).subscribe(
        (res: any) => {
          // console.log(res)
          this.paginate.length = res.data.total;
          this.liquidacionesDt = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      );

  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLiquidaciones();
  }

  limpiarFiltros() {
    this.filter.razon_social = undefined;
    this.filter.fecha_desde = moment(this.firstday).format('YYYY-MM-DD');
    this.filter.fecha_hasta = moment(this.today).format('YYYY-MM-DD');
    this.filter.estado = undefined;
    this.select_estado = 0;
    this.cargarLiquidaciones();
  }

  change(event) {
    // console.log(event);
    if(event!='T'){
      let temp = [];
      temp.push(event);
      this.filter.estado = temp;
      temp = [];
    } else {
      this.filter.estado = ['E','A'];
    }
  
  }

  aprobar(id) {
    
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea aprobar esta Liquidacion?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result)=>{
      if(result.isConfirmed) {


        (this as any).mensajeSpinner = 'Verificando período contable...';
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment().format('YYYY')),
          "mes": Number(moment().format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
           
          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              
              (this as any).mensajeSpinner = "Aprobando liquidacion...";
              this.lcargando.ctlSpinner(true);
              this.tituloSrv.aprobarLiquidacion(id).subscribe(
                (res) => {
                  if (res["status"] == 1) {
                    this.lcargando.ctlSpinner(false);
                    
                    Swal.fire({
                      title: "Registro Aprobado",
                      text: res['message'],
                      showCloseButton: true,
                      //showCancelButton: true,
                      //showConfirmButton: true,
                      //cancelButtonText: "Cancelar",
                      confirmButtonText: "Aceptar",
                      //cancelButtonColor: '#F86C6B',
                      confirmButtonColor: '#20A8D8',
                    }).then((result)=>{
                      if(result.isConfirmed) {
                        this.cargarLiquidaciones();
                      }else{
                        this.cargarLiquidaciones();   
                      }
                    });
                   
      
                  } else {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: res['message'],
                      showCloseButton: true,
                      //showCancelButton: true,
                      //showConfirmButton: true,
                      //cancelButtonText: "Cancelar",
                      confirmButtonText: "Aceptar",
                      //cancelButtonColor: '#F86C6B',
                      confirmButtonColor: '#20A8D8',
                    });
                  }
                },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.message);
                }
              )
            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }
      
          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })
      }
      //this.cargarLiquidaciones();
    });

  }
}
