import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from "src/app/services/common-var.services";
import { CommonService } from 'src/app/services/commonServices';
import { environment } from 'src/environments/environment';
import * as myVarGlobals from 'src/app/global';

import { ModalActuacionesComponent } from './modal-actuaciones/modal-actuaciones.component';
import { ModalNuevoJuicioComponent } from './modal-nuevoJuicio/modal-nuevoJuicio.component';

import { ModalAbogadosComponent } from './modal-abogados/modal-abogados.component';
import { JuiciosService } from './juicios.service';
import { ModalCitacionComponent } from './modal-citacion/modal-citacion.component';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { ExcelService } from 'src/app/services/excel.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import Botonera from 'src/app/models/IBotonera';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-juicios',
  templateUrl: './juicios.component.html',
  styleUrls: ['./juicios.component.scss']
})
export class JuiciosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator
  fTitle: string = "Juicios/Auto de Pago";
  msgSpinner: string;
  dataUser: any;
  user: any;
  permissions: any;
  vmButtons: Botonera[] = [];

  juicioView: boolean = true;

  juicios: any[] = [];
  juicio: any = {
    expedientes: [],
    actuaciones: []
  };
  estados: any[] = [
    { id: 'ALL', value: 'TODOS'},
    { id: 'EMI', value: 'EMITIDO' },
    { id: 'CIT', value: 'CITADO', pos: 1 },
    { id: 'CIG', value: 'CITADO EN GACETA', pos: 2 },
    { id: 'PAP', value: 'PUBLICACION DE AUTO DE PAGO', pos: 3 },
    { id: 'RET', value: 'RETENCION DE VALORES', pos: 4 },
    { id: 'EMB', value: 'EMBARGO', pos: 5 },
    { id: 'PUR', value: 'PUBLICACION DEL REMATE', pos: 6 },
    { id: 'REM', value: 'REMATE', pos: 7 },
    { id: 'POS', value: 'POSTULACION', pos: 8 },
    { id: 'ADJ', value: 'ADJUDICACION', pos: 9 },
    { id: 'CAN', value: 'CANCELADO', pos: 10 },
    { id: 'ANU', value: 'ANULADO'},
    { id: 'CNV', value: 'EN CONVENIO' },
    // { id: 'PUB', value: 'PUBLICADO' },  // Legacy
  ];

  tipos: any[] = [
    { id: 'ALL', value: 'TODOS' },
    { id: 'PRO', value: 'PROVIDENCIA' },
  ]
  /* estados: any[] = [
    { id: 'ALL', value: 'TODOS'},
    { id: 'EMI', value: 'EMITIDO' },
    { id: 'CIT', value: 'CITADO' },
    { id: 'CAN', value: 'CANCELADO' },
    { id: 'PUB', value: 'PUBLICADO' },
    { id: 'EMB', value: 'EMBARGO' },
    { id: 'REM', value: 'REMATE' },
    { id: 'RYP', value: 'REMATE Y PUBLICADO' },
    { id: 'POS', value: 'POSTURA' },
    { id: 'CAL', value: 'AUTO DE CALIFICACION' },
    { id: 'PUN', value: 'PUBLICADO - NOTIFICACION', pos: 5 },
    { id: 'PAP', value: 'PUBLICADO - AUTO DE PAGO', pos: 6 },
    { id: 'PUR', value: 'PUBLICADO - REMATE', pos: 7 },
    { id: 'ANU', value: 'ANULADO'},
  ]; */

  cmb_abogados: any[] = [
    { contrato: 0, nombres: 'TODOS' },
    { contrato: 1, nombres: 'SIN ASIGNAR' }
  ]

  filter: any = {
    contribuyente: null,
    estado: 'ALL',
    abogado: 0,
    fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
    tipo: null
  }
  paginate: any = {
    length: 0,
    page: 1,
    pageSizeOptions: [10, 20, 30, 50],
    perPage: 10,
  }

  constructor(
    private apiService: JuiciosService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private modalService: NgbModal,
    private excelService: ExcelService,
   

  ) { 
    this.commonVarService.updateCitaciones.asObservable().subscribe(
      (res: any) => {
        // console.log(res)
        this.juicios.find(e => e.id_cob_juicio == res.juicio.id_cob_juicio).citaciones.push(res.citacion)
        Swal.fire('Citación almacenada correctamente', '', 'success')
      }
    )

    this.commonVarService.juicioAsignaAbogado.asObservable().subscribe(
      (res: any) => {
        // console.log(res)
        Object.assign(this.juicios.find(e => e.id_cob_juicio == res.id_cob_juicio), res)
        this. getJuicios();
      }
    )

    this.commonVarService.juicioActuacion.asObservable().subscribe(
      (res: any) => {
        Object.assign(this.juicios.find(e => e.id_cob_juicio == res.id_cob_juicio), { estado: res.estado })
      }
    )
    
   }

  ngOnInit(): void {

    this.vmButtons = [
      {orig: 'btnsJuicio', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false, },
      {orig: 'btnsJuicio', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false, },
      {
        orig: "btnsJuicio",
        paramAccion: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false,
      },
    ]

    setTimeout(() => {
      this.validaPermisos()
      // this.getJuicios()
    }, 50);
  }

  metodoGlobal(event: any) {
    
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.exportarExcel()
        break;
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;

      case "PROCESAR":
        
        break;
    }
  }

  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...'
    this.lcargando.ctlSpinner(true)
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))

    let params = {
      codigo: myVarGlobals.fCoacJuicio,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      (res: any) => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          // this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          // this.lcargando.ctlSpinner(false);
          // this.getJuicios()
          this.getAbogados()
        }
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  getAbogados() {
    this.msgSpinner = 'Cargando Abogados'
    // this.lcargando.ctlSpinner(true)
    this.apiService.getAbogados().subscribe(
      (res: any) => {
        // console.log(res)
        res.data.forEach((abg: any) => {
          const { id, nombres, apellidos, matricula: contrato, cedula } = abg
          this.cmb_abogados = [...this.cmb_abogados, { id: id, nombres: `${nombres} ${apellidos}`, contrato: contrato, cedula: cedula }]
        })
        this.getJuicios()
        // this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Abogados')
      }
    )
  }

  getJuicios() {
    this.msgSpinner = 'Cargando Juicios'
    // this.lcargando.ctlSpinner(true)
    this.apiService.getJuicios({ params: { filter: this.filter, paginate: this.paginate } }).subscribe(
      (res: any) => {

        // console.log(res.data)
        if (Array.isArray(res.data) && !res.data.length) {
          this.lcargando.ctlSpinner(false)
          return;
        }
        
        this.paginate.length = res.data.total;
        this.juicios = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data);
        this.juicios.map((e: any) => e.created_at = moment(e.created_at).format('YYYY-MM-DD'))
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Juicios')

      }
    )
  }

  changePaginate({pageSize, pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize});
    
    this.lcargando.ctlSpinner(true)
    this.getJuicios();
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()

    if (moment(this.filter.fecha_desde).diff(moment(this.filter.fecha_hasta)) > 0) {
      this.toastr.warning('Fecha Desde es superior a Fecha Hasta')
      return
    }
    this.filter.contribuyente = (typeof this.filter.contribuyente?.trim() === 'string' && this.filter.contribuyente?.trim().length > 0) ? this.filter.contribuyente.trim() : null

    this.lcargando.ctlSpinner(true)
    this.getJuicios()
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      contribuyente: null,
      estado: 'ALL',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
    });
  }

  expandActuaciones(juicio) {
    const modal = this.modalService.open(ModalActuacionesComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.juicio = juicio
    modal.componentInstance.permissions = this.permissions
  }

  expandAbogados(juicio) {
    const modal = this.modalService.open(ModalAbogadosComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.juicio = juicio
  }

  changeView() {
    this.juicioView = !this.juicioView
  }

  getEstado(id: string) {
    return this.estados.find(e => e.id == id)?.value
  }

  getJuicioDetalles(juicio: any) {
    this.msgSpinner = 'Recuperando detalles de Juicio'
    this.lcargando.ctlSpinner(true)
    this.apiService.getJuicio(juicio).subscribe(
      (res: any) => {
        this.changeView()
        // console.log(res.data)
        this.juicio = res.data
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Detalles de Juicio')
      }
    )
  }

  eliminarJuicio(juicio: any) {
    Swal.fire({
      title: 'Ingrese motivo para eliminar Juicio',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showLoaderOnConfirm: true,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      inputPlaceholder: 'Ingrese un motivo...',
      inputValidator: (value) => {
        if (!value) {
          return 'No ha ingresado un motivo'
        }
      },
      preConfirm: (observacion: string) => {
        return this.apiService.eliminaJuicio({juicio: juicio, observacion: observacion}).subscribe(
          (res: any) => {
            // console.log(res)
            const { id_cob_juicio, motivo, estado } = res
            Object.assign(this.juicios.find((e: any) => e.id_cob_juicio == id_cob_juicio), { motivo: motivo, estado: estado })
            return res;
          },
          (err: any) => {
            console.log(err)
            Swal.showValidationMessage(
              `Hubo un error: ${err}`
            )
          }
        )
      },
      allowOutsideClick: () => !Swal.isLoading,
    }).then((result: any) => {
      if (result.isConfirmed) {
        juicio.activo = false;
        Swal.fire('Juicio eliminado', '', 'success')
      }
    })
  }

  ingresoJuicio () {
    const modal = this.modalService.open(ModalNuevoJuicioComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    //modal.componentInstance.juicio = juicio
    //modal.componentInstance.permissions = this.permissions
  }


  descargarNotificacion(juicio: any) {
    this.msgSpinner = 'Recuperando detalles de Juicio'
    this.lcargando.ctlSpinner(true)
    
    this.apiService.getJuicio(juicio).subscribe(
      (res: any) => {
        let array = '';
        let deudas = 0;
        let deudasString = ''
        res.data.expedientes.map(
          (re)=>{
            re.detalles.map(
              (dat)=>{
                if(array == ''){
                  array = dat.liquidacion.documento
                }else{
                  array = array + ' ' +dat.liquidacion.documento
                }
                deudas += parseFloat(dat.deuda.valor)
                deudasString = this.commonVarService.NumeroALetras(deudas,0)
                
              }
            )
          }
        );

        console.log(array);
        console.log(deudas)
        console.log(deudasString)

        this.lcargando.ctlSpinner(false)
        window.open(`${environment.ReportingUrl}rpt_auto_de_pago.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}&id_juicio=${juicio.id_cob_juicio}&array=${array}&deudas=${deudas}&deudasString=${deudasString}`)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Detalles de Juicio')
      }
    )

  }

  expandNotificacion(juicio: any) {
    const modal = this.modalService.open(ModalCitacionComponent, { size: 'lg', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.juicio = juicio
  }

  exportarExcel() {
    let excelData = []
    this.msgSpinner = 'Exportando'
    this.lcargando.ctlSpinner(true)

    this.apiService.getJuicios({ params: { filter: this.filter } }).subscribe(
      (res: any) => {
        res.data.forEach((juicio: any) => {
          const { id_cob_juicio,num_proceso,  estado,...items } = juicio;
          const { razon_social, num_documento, codigo_sector, ...contribuyente  } = juicio.fk_contribuyente;
          const {nombres, apellidos} = juicio.fk_abogado == null ? {nombres: 'Sin', apellidos: 'Asignar'} : juicio.fk_abogado
          // const { nombre, ...concepto } = liquidacion.concepto;

          const data = {
            id: id_cob_juicio,
            Contribuyente: razon_social,
            NumDocumento: num_documento,
            Fecha: moment(items.created_at).format('YYYY-MM-DD'),
            NumJuicio: num_proceso,
            Abogado: nombres + " "+ apellidos,
            Estado: this.getEstado(estado) ?? 'DESCONOCIDO',
          }
          excelData.push(data)
        })
        this.excelService.exportAsExcelFile(excelData, `JuiciosAutoPago_${moment().format('YYYYMMDD')}`);
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Juicios')

      }
    )
  }

  expandDetalleLiq(c) {
    const modalInvoice = this.modalService.open(ConceptoDetComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.concepto = c;
  }


}
