import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';

import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
// import * as myVarGlobals from "../../../../../global";
import { FormularioConceptosService } from './formulario-conceptos.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-formulario-conceptos',
  templateUrl: './formulario-conceptos.component.html',
  styleUrls: ['./formulario-conceptos.component.scss']
})
export class FormularioConceptosComponent implements OnInit {

  mensajeSppiner: string = "Cargnado...";
  @ViewChild(CcSpinerProcesarComponent, { static: false}) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;
  @Input() id_concepto: any;
  @Input() codigo: string;
  @Input() fk_contribuyente: any;
  @Input() deudas: any = [];
  @Input() listaConceptos: any;

  conceptosList: any = [];

  vmButtons: any;
  resdata: any = [];
  liquidacionesDt: any = [];
  paginate: any;
  filter: any;

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;

  excelData: any [];
  exportList: any[]
  estados: any[] = [
    { id: 'A', nombre: 'PENDIENTE', class: 'bg-warning' },
    { id: 'G', nombre: 'GENERADO', class: 'bg-success' }
  ]


  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: FormularioConceptosService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnModalLiq",
        paramAction: "",
        boton: {icon: "fas fa-download", texto: "EXPORTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }
    ]

    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);

    this.filter = {
      razon_social: undefined,
      sector: 0,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      gestion: 0,
      estado: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    setTimeout(()=> {
      this.validaPermisos()

    }, 20);
  }

  // Cargar conceptos
  getConceptos() {
    this.mensajeSppiner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getConceptos().subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: 'Título',
            text: 'No hay Conceptos para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(c => {
          let concepto = {
            id: c.id_concepto,
            codigo: c.codigo,
            nombre: c.nombre,
            id_tarifa: c.id_tarifa,
            tipo_calculo: c.tipo_calculo,
            tiene_tarifa: c.tiene_tarifa==1 ? true : false //llena el campo con true si tiene tarifa
          }
          this.conceptosList.push({...concepto})
        })


        this.conceptosList = this.conceptosList.filter(c => (c.codigo!="BA" && c.codigo!="AN" && c.codigo!="EX"));

        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case "EXPORTAR":
        this.btnExportar()
    }
  }


  btnExportar() {
    this.apiSrv.getLiqByContribuyenteExport({estado: 'A'}).subscribe(
      (res)=>{
        console.log(res);
        this.exportList = res['data']
        this.excelData = [];
        if (this.permissions.exportar == "0") {
          this.toastr.info("Usuario no tiene permiso para exportar");
        } else {
          Object.keys(this.exportList).forEach(key => {
            let filter_values = {};
            filter_values['ID'] = key;
            filter_values['Código'] = (this.exportList[key].concepto.codigo != null) ? this.exportList[key].concepto.codigo.trim() : "";
            filter_values['Documento'] = (this.exportList[key].documento != null) ? this.exportList[key].documento.trim() : "";
            filter_values['Contribuyente'] = (this.exportList[key].contribuyente.razon_social != null) ? this.exportList[key].contribuyente.razon_social.trim() : "";
            filter_values['Fecha'] = (this.exportList[key].fecha.split(" ")[0] != undefined) ? this.exportList[key].fecha.split(" ")[0] : "";
            filter_values['Valor'] = (this.exportList[key].total != undefined) ? this.exportList[key].total : "";
            filter_values['Saldo'] = (this.exportList[key].deuda != undefined) ? this.exportList[key].deuda.saldo : "TITULO INVALIDO";
            filter_values['Estado'] = (this.exportList[key].estado != undefined) ? (this.exportList[key].estado == 'E' ? 'Emitido' : this.exportList[key].estado == 'A' ? 'Aprobado' : this.exportList[key].estado == 'X' ? 'Anulado' : this.exportList[key].estado == 'C' && 'Anulado' ) : "";

            // filter_values['Acciones'] = (this.liquidacionesDt[key].current_total != undefined) ? this.commonServices.formatNumber(parseFloat(this.liquidacionesDt[key].current_total).toFixed(2)) : "";

            // dt.deuda ? '$ '+ dt.deuda.saldo : 'TITULO INVALIDO'



            this.excelData.push(filter_values);
          })
          this.exportAsXLSX();
        }
      }
    )

  }


  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Balance general');
  }

  validaPermisos() {
    this.mensajeSppiner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTTickets,
      id_rol: this.dataUser.id_rol,
    };

    this.apiSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", "Edicion Notificacion detalles");
          this.vmButtons = [];
        } else {
          this.cargarLiquidaciones();
          this.getConceptos();
        }
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

  cargarLiquidaciones(){
    this.mensajeSppiner = "Cargando lista de Liquidaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      codigo: "ALL",
      estado: 'A',
      // fk_contribuyente: this.fk_contribuyente,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    console.log(data);

    this.apiSrv.getLiqByContribuyente(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];

        if (res['data']['current_page'] == 1) {
          let array = res['data']['data'];
          array.forEach(e => {
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e , {
                  tipo_documento: e.concepto.codigo,
                  numero_documento: e.documento,
                  nombre: e.concepto.nombre ?? "",
                  valor: e.total,
                  saldo: e.deuda.saldo,
                  cobro: 0,
                  nuevo_saldo: 0,
                  comentario: "",
                  aplica: true,
                  total: e.total,
                  id_liquidacion: e.id_liquidacion
                })
              }
            })
          })
          this.resdata = array;
        } else {
          let array = Object.values(res['data']['data']);
          array.forEach((e:any)=> {
            this.deudas.forEach(c => {
              if (e.id_liquidacion==c.id_liquidacion){
                Object.assign(e , {
                  tipo_documento: e.concepto.codigo,
                  numero_documento: e.documento,
                  nombre: e.concepto.nombre ?? "",
                  valor: e.total,
                  saldo: e.deuda.saldo,
                  cobro: 0,
                  nuevo_saldo: 0,
                  comentario: "",
                  aplica: true,
                  total: e.total,
                  id_liquidacion: e.id_liquidacion
                })
              }
            })
          })
          this.resdata = array;
        }
        console.log(this.resdata);
        this.liquidacionesDt = this.resdata.filter(l =>l.estado =="A");
        // this.liquidacionesDt = this.resdata
        this.lcargando.ctlSpinner(false);
        console.log(this.liquidacionesDt);
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  aplica(dt){
    let aplica = dt.aplica;
    // console.log(dt);
    if(aplica){
      // dt.cantidad = 1;
      // dt.total = dt.valor;
      // ENCONTRAR DEUDA ASOCIADA Y AGREGAR CAMPOS DE DEUDA A LA LIQUIDACION
      Object.assign(dt , {
        tipo_documento: dt.concepto.codigo,
        numero_documento: dt.documento,
        nombre: dt.concepto.nombre ?? "",
        valor: dt.total,
        saldo: dt.deuda.saldo,
        cobro: 0,
        nuevo_saldo: 0,
        comentario: "",
        aplica: true,
        total: dt.total,
        id_liquidacion: dt.id_liquidacion
      })

      this.deudas.push(dt);
    }else {
      // let id = this.conceptos.indexOf(dt);
      // this.conceptos.splice(i,1);
      this.deudas.forEach(c => {
        if(dt.id_liquidacion==c.id_liquidacion){
          // console.log(c);
          let id = this.deudas.indexOf(c);
          this.deudas.splice(id,1);
        }
      })
    }
  }

  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigo: 0,
      estado: undefined,
      filterControl: ""
    }
    // this.cargarLiquidaciones();
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar esta Liquidación? Los campos llenados y calculos realizados serán reiniciados.",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeModal(data);
        }
      });
    } else {
      this.closeModal(data);
    }
  }

  closeModal(data?:any) {
    if(data){
      this.commonVrs.selectLiqAnulacion.next(data);
    }
    this.activeModal.dismiss();
  }

}
