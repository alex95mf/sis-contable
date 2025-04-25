import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { GeneracionService } from '../generacion/generacion.service';
import * as myVarGlobals from 'src/app/global';
import { CommonService } from 'src/app/services/commonServices';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.scss']
})
export class TitulosComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Consulta de liquidaciones (Registro de la propiedad)";
  msgSpinner: string;
  vmButtons: Array<Botonera> = [];
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
      value: 'X',
      label: "Anulado",
    },
    {
      value: 'T',
      label: "Todos",
    },
  ]

  constructor(
    private generacionSrv: GeneracionService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private excelService: ExcelService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsConsultaLiquidaciones',
        paramAccion: '',
        boton: { icon: 'far fa-file-excel', texto: 'EXCEL' },
        clase: 'btn btn-sm btn-success',
        habilitar: false,
        showbadge: false,
        showimg: true,
        showtxt: true,
        permiso: true,
      },
    ]
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
      estado: undefined,
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

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.exportLiquidaciones()
        break;
    
      default:
        break;
    }
  }

  async exportLiquidaciones() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando documentos...'
      let documentos = await this.generacionSrv.getLiquidacionesAsync({concepto: { codigo: 'RP' }, params: { filter: this.filter }})
      console.log(documentos)
      //
      this.msgSpinner = 'Exportando'
      let excelData = []
      documentos.forEach((element: any) => {
        const { documento, contribuyente, total, arancel, avaluo, fecha, estado, usuario } = element
        let estado_text = this.estadoToPrint(estado)
        let tipo_text = this.tipoToPrint(arancel?.desc_tipo)
        let o = {
          Documento: documento,
          Contribuyente: contribuyente.razon_social,
          Total: total,
          Detalle: arancel?.descripcion ?? 'Sin Descripcion',
          Tipo: tipo_text,
          Avaluo: avaluo ?? 'N/A',
          Estado: estado_text,
          Emision: fecha,
          Usuario: usuario?.nombre,
        }
        excelData.push(o)
      });

      this.lcargando.ctlSpinner(false)
      this.excelService.exportAsExcelFile(excelData, 'LiquidacionesRP')
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  estadoToPrint(estado) {
    if(estado === 'E'){
      return "Emitido"
    } else if(estado === 'A'){
      return "Aprobado"
    } else if(estado === 'X'){
      return "Anulado"
    } else {
      return "Todos"
    }
  }

  tipoToPrint(tipo: string) {
    if (tipo == 'P') return 'PROPIEDAD'
    else if (tipo == 'M') return 'MERCANTIL'
    else return 'N/A'
  }

  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...';

    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fRPTitulos,
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

      this.mensajeSpinner = "Cargando lista de liquidaciones...";
      this.lcargando.ctlSpinner(true);

      let data = {
        concepto: {
          //id: 31
          codigo: 'RP'
        },
        params: {
          filter: this.filter,
          paginate: this.paginate,
        }
      }

      this.generacionSrv.getLiquidaciones(data).subscribe(
        (res: any) => {
          this.liquidacionesDt = res.data.data;
          this.paginate.length = res.data.total;
          /* if (res['data']['current_page'] == 1) {
           this.liquidacionesDt = res['data']['data'];
          } else {
           this.liquidacionesDt = Object.values(res['data']['data']);
          } */
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error?.message);
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
      this.filter.estado = undefined;
    }
  
  }

  anular(id) {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea anular esta Liquidacion?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result)=>{
      if(result.isConfirmed) {
        this.mensajeSpinner = "Anulando liquidacion...";
        this.lcargando.ctlSpinner(true);
        this.generacionSrv.anularLiquidacion(id).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.lcargando.ctlSpinner(false);
              
              Swal.fire({
                title: "Registro Eliminado",
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
      }
    });
    
  }
  

}
