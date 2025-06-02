import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../services/commonServices';
import { ProGeneracionDeRetencionService } from './pro-generacion-de-retencion.service';
import { CierreMesService } from '../ciclos-contables/cierre-de-mes/cierre-mes.service';
import * as myVarGlobals from '../../../global';
import { ToastrService } from 'ngx-toastr';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from "sweetalert2";


import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { CcModalPreviewRetencionesComponent } from 'src/app/config/custom/cc-modal-preview-retenciones/cc-modal-preview-retenciones.component';
import { CcModalEditarImpuestosComprasComponent } from 'src/app/config/custom/cc-modal-editar-impuestos-compras/cc-modal-editar-impuestos-compras.component';

import * as moment from 'moment'
import { DatePipe } from '@angular/common';

import { environment } from 'src/environments/environment';


import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { RetencionCompras } from './retencion_compra';
import {  RetencionGeneradas } from './retenciones_generdas';


@Component({
standalone: false,
  selector: 'app-generacion-de-retencion',
  templateUrl: './generacion-de-retencion.component.html',
  styleUrls: ['./generacion-de-retencion.component.scss'],
  providers: [DialogService]
})
export class GeneracionDeRetencionComponent implements OnInit {


  @ViewChild(DataTableDirective)

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  generacion_pendientes: RetencionCompras[];
  periodos: any = [];

  selected_anio: any;
  mes_actual: any = 0;
  pipe = new DatePipe('en-US');

  vmButtons: any = [];
  detalleReteGeneradas: RetencionGeneradas[];

  selectedRetencionesElement: RetencionCompras[];
  selectedRetencionesElGenerement: RetencionGeneradas[];
  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  fecha_desde:any;
  fecha_hasta:any;
  selected_mes : any;
  proveedor : any = '';
  arrayMes: any =
    [
      {
        id: "0",
        name: "-Todos-"
      },{
        id: "1",
        name: "Enero"
      },
      {
        id: "2",
        name: "Febrero"
      },
      {
        id: "3",
        name: "Marzo"
      },
      {
        id: "4",
        name: "Abril"
      },
      {
        id: "5",
        name: "Mayo"
      },
      {
        id: "6",
        name: "Junio"
      },
      {
        id: "7",
        name: "Julio"
      },
      {
        id: "8",
        name: "Agosto"
      },

      {
        id: "9",
        name: "Septiembre"
      },
      {
        id: "10",
        name: "Octubre"
      },
      {
        id: "11",
        name: "Noviembre"
      },
      {
        id: "12",
        name: "Diciembre"
      },
    ];

  ref: DynamicDialogRef;

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private progeneracionderetencionService: ProGeneracionDeRetencionService,
    public dialogService: DialogService,
    private cierremesService: CierreMesService
  ) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.isRowSelectable = this.isRowSelectable.bind(this);
  }

  ngOnInit(): void {

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);
    this.fecha_desde= moment(this.firstday).format('YYYY-MM-DD')
    this.fecha_hasta= moment(this.today).format('YYYY-MM-DD')

    this.selected_anio = moment(new Date()).format('YYYY');
    //this.mes_actual = Number(moment(new Date()).format('MM'));
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();

    this.vmButtons = [

      { orig: "btnsGeneraciondeRetencion", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsGeneraciondeRetencion", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GENERAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsGeneraciondeRetencion", paramAccion: "2", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsGeneraciondeRetencion", paramAccion: "1", boton: { icon: "fa fa-search", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },
      { orig: "btnsGeneraciondeRetencion", paramAccion: "1", boton: { icon: "fa fa-file-pdf", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true },
      { orig: "btnsGeneraciondeRetencion", paramAccion: "2", boton: { icon: "fa fa-file-pdf", texto: "PDF" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true },

    ];

    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fProveeduriaCompras,
      id_rol: id_rol
    }

    this.commonService.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'];

      this.permiso_ver = this.permisions[0].ver;

      if (this.permiso_ver == "0") {

        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Balance comprobación");
        this.vmButtons = [];

      }

      this.ObtenerPeriodo(this.selected_anio);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  onRowSelect(event) {

    /*Activamos boton de anulacion */
    let LentSelect = this.selectedRetencionesElGenerement.length;
    if (LentSelect > 0) {
      this.vmButtons[3].habilitar = false;
    }
  }

  onRowUnselect(event) {
    /*Inactivamos boton de anulacion */
    let LentSelect = this.selectedRetencionesElGenerement.length;
    if (LentSelect === 0) {
      this.vmButtons[3].habilitar = true;
    }
  }


  isRowSelectable(event) {
    return !this.isOutOfStock(event.data);
  }

  isOutOfStock(data) {
    return data.isactive === 0;
  }

  RetencionesPendientes() {

    let year;

    if(typeof this.selected_anio !== "string"){
      year = this.selected_anio.getFullYear();
    }else{
      year = this.selected_anio;
    }
    // let proveedor
    // if(this.proveedor!= '' || this.proveedor!= undefined){
    //    proveedor = this.proveedor
    // }else{
    //   proveedor = ''
    // }
    let data={
      anio:year,
      mes:this.mes_actual,
      fecha_desde:this.fecha_desde,
      fecha_hasta:this.fecha_hasta,
      proveedor: this.proveedor
    }

    this.lcargando.ctlSpinner(true);
    this.progeneracionderetencionService.getRetencionesPendientes(data).subscribe(res => {
//console.log(res)
      //this.generacion_pendientes = res;
      this.generacion_pendientes = <RetencionCompras[]>res['data']
      if(this.generacion_pendientes.length > 0){
        this.vmButtons[4].habilitar = false;
      }
      this.lcargando.ctlSpinner(false);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);

    })
  }


  AnularRetenciones() {

    let LentSelect = this.selectedRetencionesElGenerement.length;
    if (LentSelect > 0) {
      Swal.fire({
        title: "Atención",
        text: "Al ejecutar el proceso se anulara los registro, los mismos no podran ser reversados. \n ¿Desea continuar?",
        //icon: "warning",
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {

        this.lcargando.ctlSpinner(true);

        if (result.value) {

          this.selectedRetencionesElGenerement.forEach(element => {

            let data = {
              'id_retencion': element.id_retencion,
              'fk_compra_cab': element.fk_compra_cab,
              'fk_usuario_trans': this.dataUser.id_usuario,
              'ip': this.commonService.getIpAddress(),
              'id_controlador': myVarGlobals.fProveeduriaCompras
            }


            this.progeneracionderetencionService.AnularRegistroRetenciones(data).subscribe(res => {
              console.log(res);
              this.RetencionesPendientes();
              this.lcargando.ctlSpinner(false);
            }, error => {
              this.lcargando.ctlSpinner(false);
            })

          });

          this.lcargando.ctlSpinner(false);

        }

      });
    } else {
      this.toastr.info("Debe seleccionar el comprobante de diario que desea anular.");
    }

  }

  handleChange(e) {
    var index = e.index;

    this.vmButtons[0].showimg = false;

    if (index === 0) {

      this.vmButtons[0].showimg = true;
      this.vmButtons[1].showimg = true;
      this.vmButtons[2].showimg = false;
      this.vmButtons[3].showimg = false;
      this.vmButtons[4].showimg = true;
      this.vmButtons[5].showimg = false;

    } else {

      this.vmButtons[0].showimg = false;
      this.vmButtons[1].showimg = false;
      this.vmButtons[2].showimg = true;
      this.vmButtons[3].showimg = true;
      this.vmButtons[4].showimg = false;
      this.vmButtons[5].showimg = true;

    }
  }



  ObtenerPeriodo(anio: any) {

    this.selected_anio = anio;

    this.periodos = [];

    let data = {
      "anio": anio
    }

    this.lcargando.ctlSpinner(true);

    this.progeneracionderetencionService.obtenerCierresPeriodo(data).subscribe(res => {

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
              break;3
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

          this.periodos.push(
            {

              anio: element["anio"],
              estado: element["estado"] === "C" ? "CERRADO" : "APERTURADO",
              mes: mes_letter,
              estate: element["estado"]

            }
          )

          this.lcargando.ctlSpinner(false);

        }
      } else {
        this.periodos = [];
        this.toastr.info("No hay información para mostrar");
        this.lcargando.ctlSpinner(false);
      }


    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })

  }

  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }

  VistaPreviaImpuestoRetencion(items) {

    console.log(items);

    this.ref = this.dialogService.open(CcModalPreviewRetencionesComponent, {
      data: {
        id_compra: items.id
      },
      header: 'Detalle de Impuestos Retención - Compra # ' + items.num_doc,
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });
    /*
          this.ref.onClose.subscribe((cuentas: any) => {



          });*/
  }

  EditarImpuestoRetencion(items) {

    this.ref = this.dialogService.open(CcModalEditarImpuestosComprasComponent, {
      data: {
        id_compra: items.id
      },
      header: 'Detalle Compra # ' + items.num_doc,
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "CONSULTAR1":
        this.RetencionesPendientes();
        break;
      case "GENERAR1":
        this.GeneracionRetenciones();
        break;
      case "CONSULTAR2":
        this.RetencionesGeneradas();
        break;
      case "ANULAR1":
          this.AnularRetenciones();
          break;
      case "PDF1" :
        this.retencionesPendientesPDF()
        break;
      case "PDF2" :
          this.retencionesAutorizadasPDF()
          break;
    }
  }


  fieldsChange(evento) {
    if (evento.select === 'N') {
      evento.select = 'S'
    } else {
      evento.select = 'N'
    }
  }


  GeneracionRetenciones() {



    this.mensajeSppiner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(this.selected_anio),
            "mes": Number(moment(this.mes_actual).format('MM'))
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

                /*Obtenemos la lista seleccionada */
                const result = this.selectedRetencionesElement;
                console.log(result)
                /*Recorremos la lista para generar de una en una */
                if (result !== undefined) {

                  if (this.selectedRetencionesElement.length > 0) {

                    this.lcargando.ctlSpinner(true);
                    for (const obj in result) {

                      let datosRetencion = {

                        'fk_usuario_trans': this.dataUser.id_usuario,
                        'id_compra': result[obj].id,
                        'doc_proveedor': result[obj].num_doc,
                        'fecha_emision': this.pipe.transform(result[obj].fecha_compra, 'yyyy-MM-dd'),
                        'ip': this.commonService.getIpAddress(),
                        'id_controlador': myVarGlobals.fProveeduriaCompras

                      };

                      this.progeneracionderetencionService.GeneraRetencionesCompraProv(datosRetencion).subscribe(res => {

                        this.selectedRetencionesElement = [];
                        this.RetencionesPendientes();
                        this.lcargando.ctlSpinner(true);

                        this.toastr.success('Retenciones generadas de manera exitosa');

                      }, error => {
                        this.lcargando.ctlSpinner(false);
                        this.toastr.info(error.error.message);

                      })

                    }

                  } else {
                    this.toastr.info("Es necesario seleccionar las compras a las que se desea aplicar retención");
                  }

                } else {
                  this.toastr.info("Es necesario seleccionar las compras a las que se desea aplicar retención");
                }


            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })




  }


  RetencionesGeneradas() {

    this.lcargando.ctlSpinner(true);

    let year;

    if(typeof this.selected_anio !== "string"){
      year = this.selected_anio.getFullYear();
    }else{
      year = this.selected_anio;
    }

    let data={
      anio:year,
      mes:this.mes_actual,
      fecha_desde:this.fecha_desde,
      fecha_hasta:this.fecha_hasta,
      proveedor: this.proveedor
    }

   // this.progeneracionderetencionService.getRetencionesGeneradas(year, this.mes_actual).subscribe(res => {
    this.progeneracionderetencionService.getRetencionesGeneradas(data).subscribe(res => {
      console.log(res);
      this.detalleReteGeneradas = <RetencionGeneradas[]>res['data'];

      if(this.detalleReteGeneradas.length > 0){
        this.vmButtons[5].habilitar = false;
      }
      this.lcargando.ctlSpinner(false);


    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);

    })

  }


  ImpresionRetencionPDF(imp) {
    console.log(imp);
    window.open(environment.ReportingUrl + "rpt_retencion_comprobante.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_retencion=" + imp.id_retencion, '_blank')
  }

  ImpresionRetencionExcel(imp) {
    window.open(environment.ReportingUrl + "rpt_retencion_comprobante.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_retencion=" + imp.id_retencion, '_blank')
  }

  ImpresionComprobante(imp) {
    window.open(environment.ReportingUrl + "rpt_retencion_comprobante.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_retencion=" + imp.id_retencion, '_blank')
  }

  retencionesAutorizadasPDF() {

    let anio = this.selected_anio
    let mes = this.mes_actual
    let fecha_desde = this.fecha_desde
    let fecha_hasta = this.fecha_hasta
    let proveedor = this.proveedor

    window.open(environment.ReportingUrl + "rpt_retenciones_generadas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&anio=" + anio + "&mes=" + mes+ "&proveedor=" + proveedor,'_blank')
    console.log(environment.ReportingUrl + "rpt_retenciones_generadas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&anio=" + anio + "&mes=" + mes + "&proveedor=" + proveedor)
  }

  retencionesPendientesPDF(){
    let anio = this.selected_anio
    let mes = this.mes_actual
    let fecha_desde = this.fecha_desde
    let fecha_hasta = this.fecha_hasta
    let proveedor = this.proveedor

    window.open(environment.ReportingUrl + "rpt_retenciones_pendientes.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&anio=" + anio + "&mes=" + mes+ "&proveedor=" + proveedor,'_blank')
    console.log(environment.ReportingUrl + "rpt_retenciones_pendientes.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&anio=" + anio + "&mes=" + mes + "&proveedor=" + proveedor)
  }

  selectedRetenciones(event) {
    console.log(event);
  }
  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

}
