import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { Subject } from 'rxjs';
import { MspreguntaComponent } from 'src/app/config/custom/mspregunta/mspregunta.component';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';
import { FacElectronicaService } from '../fac-electronica.service';
import { FacPdfComponent } from '../fac-pdf/fac-pdf.component';
import { MasDetalleComponent } from '../mas-detalle/mas-detalle.component';
import { VistaClientesComponent } from '../vista-clientes/vista-clientes.component';

// declare const $: any;
@Component({
standalone: false,
  selector: 'app-tipo-liquidacion',
  templateUrl: './tipo-liquidacion.component.html',
  styleUrls: ['./tipo-liquidacion.component.scss']
})
export class TipoLiquidacionComponent implements OnInit {

  constructor(
    private facElectronicaService: FacElectronicaService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }


  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();

  validaciones: ValidacionesFactory = new ValidacionesFactory();
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  parametros:any = {fechaDesde: "", fechaHasta: "", estadoSri: "PENDIENTE", idCliente: ""}
  lstEstado:any = [];
  listado:any = [];
  dataUser: any;

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
  }

  setearValores(datos:any){
    this.lstEstado = [];
    this.listado = [];
    this.lstEstado = datos.estadosSri;
    this.obtenerDocumentos();
  }

  obtenerDocumentos(){


    if(this.validaciones.verSiEsNull(this.parametros.fechaDesde) != undefined || this.validaciones.verSiEsNull(this.parametros.fechaHasta) != undefined){

      if(this.validaciones.verSiEsNull(this.parametros.fechaDesde) == undefined){
        this.validaciones.mensajeAdvertencia("Advertencia","Por favor seleccione una Fecha Desde");
        return;
      }
      if(this.validaciones.verSiEsNull(this.parametros.fechaHasta) == undefined){
        this.validaciones.mensajeAdvertencia("Advertencia","Por favor seleccione una Fecha Hasta");
        return;
      }
      this.parametros.fechaDesde = moment(this.parametros.fechaDesde).format('YYYY-MM-DD');
      this.parametros.fechaHasta = moment(this.parametros.fechaHasta).format('YYYY-MM-DD');
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      searching: false,
      paging: true,
      // scrollY: "200px",
      scrollCollapse: true,
      order: [[ 1, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    this.parametros.tipoDocumento = 2;
    this.lcargando.ctlSpinner(true);
    this.facElectronicaService.obtenerDocumento(this.parametros).subscribe((datos:any)=>{
      this.lcargando.ctlSpinner(false);
      this.listado = datos.data;
      this.listado.forEach(element => {
        element.isCollapsed = true;
      });
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);

    }, error=>{
      this.lcargando.ctlSpinner(false);
    })
  }

  recargar(){
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.obtenerDocumentos();
    });
  }

  colorPorEstado(dt:any){
    if(dt.estado_sri == 'AUTORIZADO'){
      // return "color-autorizado";
      return "rgba(2, 87, 29, 0.804)";
    }
    if(dt.estado_sri == 'ANULADO'){
      // return "color-anulado";
      return "rgba(99, 2, 2, 0.845)";
    }
    if(dt.estado_sri == 'RECHAZADO'){
      // return "color-anulado";
      return "rgba(99, 2, 2, 0.845)";
    }
    if(dt.estado_sri == 'RECEPCION'){
      // return "color-recepcion";
      return "rgba(186, 89, 4, 0.722)";
    }
    if(dt.estado_sri == 'DEVUELTA'){
      // return "color-recepcion";
      return "rgba(186, 89, 4, 0.722)";
    }
    if(dt.estado_doc == 'E'){
      // return "color-anulado";
      return "rgba(99, 2, 2, 0.845)";
    }
    return "";
  }

  gererarXML(valor:any){

    if(valor.estado_sri == "AUTORIZADO"){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento ya se encuentra autorizado");
      return;
    }

    if(valor.estado_doc != "A" && valor.estado_doc != "E"){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento ya se encuentra generado.");
      return;
    }

    if(valor.estado_sri == "T"){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento ya se encuentra autorizado por el SRI.");
      return;
    };

    (this as any).mensajeSpinner = "Generando XML por favor espere...";
    this.lcargando.ctlSpinner(true);

    try {
      this.procesoDual(valor);
    } catch (error) {
      this.lcargando.ctlSpinner(false);
      this.validaciones.mensajeError("Error","Por favor intentelo nuevamente");
    }
  }

  procesoDual(valor:any){

    try {
        let datosEnviar = [];
        let emision:any = valor._compras.num_documento.split("-");
        valor.lestab = emision[0];
        valor.lptoEmi = emision[1];
        valor.lsecuencial = emision[2];

        let fechaEmision:any = valor._compras.fecha.split("-");
        valor._compras.fechaEmision = fechaEmision[2]+"/"+fechaEmision[1]+"/"+fechaEmision[0];
        // valor._compras.proveedor.tipo_contribuyente = valor._compras.proveedor.tipo_contribuyente.padStart(3, '0');
        valor._compras.iva_porcentaje = this.validaciones.roundNumber(valor._compras.iva_porcentaje, 2);
        datosEnviar.push(valor);

        this.facElectronicaService.generacionXMLLiq({parametros: datosEnviar}).subscribe((datos1:any)=>{
          if(datos1.data.jar[(datos1.data.jar.length-1)] == "true"){

            this.facElectronicaService.recepcionAlSri({clave_acceso: datos1.data.claveAcceso}).subscribe((dato2:any)=>{

              if(dato2.data.faultstring==undefined){
                if(dato2.data.RespuestaRecepcionComprobante.estado == "RECIBIDA" || (dato2.data.RespuestaRecepcionComprobante.comprobantes.comprobante.mensajes.mensaje.identificador) == "43"){
                  this.facElectronicaService.autorizacionAlSri({clave_acceso: datos1.data.claveAcceso}).subscribe((datos3:any)=>{

                    if(datos3.data.faultstring==undefined){
                      if(datos3.data.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.estado == "AUTORIZADO"){
                        this.validaciones.mensajeExito("Exito",datos3.data.RespuestaAutorizacionComprobante.mensajeWebService);
                      }else{
                        this.validaciones.mensajeError("Error",datos3.data.RespuestaAutorizacionComprobante.mensajeWebService);
                      }
                    }else{
                      this.validaciones.mensajeError("Error",datos3.data.faultstringe);
                    }
                    this.recargar();
                  }, error=>{
                    this.lcargando.ctlSpinner(false);
                    this.validaciones.mensajeError("Error", error.error.message);
                  });
                }else{
                  this.recargar();
                  this.validaciones.mensajeError("Error",dato2.data.RespuestaRecepcionComprobante.mensajeWebService);
                }
              }else{
                this.lcargando.ctlSpinner(false);
                this.validaciones.mensajeError("Error", dato2.data.faultstring);
              }


            }, error=>{
              this.lcargando.ctlSpinner(false);
              this.validaciones.mensajeError("Error", error.error.message);
            });

          }else{
            this.recargar();
            this.validaciones.mensajeError("Error", "Se produjo un error, vuelva a probar");
          }
        }, error=>{
          this.lcargando.ctlSpinner(false);
          this.validaciones.mensajeError("Error", error.error.message);
        });

      } catch (error) {
      this.lcargando.ctlSpinner(false);
      this.validaciones.mensajeError("Error","Por favor intentelo nuevamente");
    }
  }

  reprocesarDocuento(valor:any){

    if(this.validaciones.verSiEsNull(valor.codigo_acceso) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento XML no se encuentra generado.");
      return;
    }

    if(valor.estado_sri == "AUTORIZADO"){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento ya se encuentra autorizado");
      return;
    };

    (this as any).mensajeSpinner = "Reprocesando Documento...";
    this.lcargando.ctlSpinner(true);

    if(valor.estado_sri == "RECIBIDA"|| valor.estado_sri == "DEVUELTA"){

      try {
        this.procesoDual(valor);
      } catch (error) {
        this.lcargando.ctlSpinner(false);
        this.validaciones.mensajeError("Error","Por favor intentelo nuevamente");
      }

    }else{
      this.lcargando.ctlSpinner(false);
      this.validaciones.mensajeError("Error", "El documento no se encuentra en recepcion del SRI. " + valor.observacion);
    }
  }


  descargarDocumentoXML(item:any){

    if(this.validaciones.verSiEsNull(item.codigo_acceso) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento XML no se encuentra generado.");
      return;
    };

    (this as any).mensajeSpinner = "Extrayendo datos del XML...";
    this.lcargando.ctlSpinner(true);
    this.facElectronicaService.descargarXML({clave_acceso: item.codigo_acceso}).subscribe((datos:any)=>{
      const url = URL.createObjectURL(datos);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.codigo_acceso + ".xml");
      document.body.appendChild(link);
      link.click();


      this.lcargando.ctlSpinner(false);
    },error=>{
      this.lcargando.ctlSpinner(false);
      this.validaciones.mensajeError("Error", error.error.message);
    })

  }

  presentarDetalle(item:any){
    const dialogRef = this.confirmationDialogService.openDialogMat(MasDetalleComponent, {
      width: '1500px', height: 'auto',
      data: { titulo: "Detalle del Documento", itemSeleccionado: item}

    } );
  }

  visualizarPdf(item:any){
    const dialogRef = this.confirmationDialogService.openDialogMat(FacPdfComponent, {
      width: '1500px', height: 'auto',
      data: { titulo: "Pre-Visualizacion del comprobante", dataUser: this.dataUser, item: item}

    } );

    dialogRef.afterClosed().subscribe(resultado => {
      if(resultado!=false && resultado!=undefined){
      }
    });

  }

  abrirModalClientes(){
    const dialogRef = this.confirmationDialogService.openDialogMat(VistaClientesComponent, {
      width: 'auto', height: 'auto',
      data: { titulo: "Listado de Clientes", tipoDocumento: 2}

    } );

    dialogRef.afterClosed().subscribe(resultado => {
      if(resultado!=false && resultado!=undefined){

        this.parametros.identificacion = resultado.num_documento;
        this.parametros.proveedor = resultado.razon_social;
        this.parametros.idCliente = resultado.id_proveedor;

      }
    });
  }

  enviarEmail(item:any){
    console.log("enviarEmail: ", item)

    if(item.estado_sri != "AUTORIZADO"){
      this.validaciones.mensajeAdvertencia("Advertencia","No puede enviar el mail por que el documento no se encuentra autorizado");
      return;
    }

    item.lAsunto = "Ha recibido un(a) "+  item._tipo_documento.nombre +" nuevo(a)!";
    item.lNumeroDocumento = item._compras.num_documento;
    item.lNombreEstimado = item._compras.proveedor.nombre_comercial_prov;

    item.lTipoDocumentoNombre = item._tipo_documento.nombre;
    item.lNumeroDocumento = item._compras.num_documento;
    item.lNumeroAutorizacion = item.autorizacion_sri;
    item.lFechaAutorizacion = item.fecha_autorizacion_sri;
    item.lAmbiente = "PRODUCCIÓN";
    item.lEmision = "NORMAL";
    item.lNombreCiaCedula = item._compras.company.razon_social + " - " + item._compras.company.ruc
    item.lObligadoContabilidad = item._compras.company.obligado_contabilidad;
    item.lNumeroTelefono = item._compras.company.celular;
    item.lDireccionEmpresa = item._compras.company.direccion;
    item.lEmailEmpresa = item._compras.company.email;
    item.lNombreVendedor = item._compras.usuario.nombre;
    item.lEmailVendedor = item._compras.usuario.email;
    item.lRazonSocialCliente = item._compras.proveedor.razon_social;
    item.lIdentificacionCliente = item._compras.proveedor.num_documento;
    item.lDireccionCliente = item._compras.proveedor.direccion;
    item.lFechaEmisionInfo = item._compras.fecha;
    item.lRuc = item._compras.company.ruc;
    item.lNombreComercial = item._compras.company.nombre_comercial;

    item.lImagenLogo = item._compras.company.logo_empresa;

    item.lSubtotal = item._compras.subtotal;
    item.lIvaValor = item._compras.iva_valor;
    item.lTotal = item._compras.total;

    let dataPresentar = {
      mensaje: "Ingresar correo electrónico para enviar el documento electrónico de tipo " + item._tipo_documento.nombre + ", con el codigo de acceso: " + item.codigo_acceso + ", de " + item._compras.proveedor.nombre_comercial_prov + " - " + item._compras.proveedor.num_documento,
      titulo: "Enviar documento electrónico",
      phCorreo: "Ingresar Correo electrónico"
    };

    const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
    dialogRef1.result.then((res) => {

      if(res.valor){
        console.log("respuesta: ", res)
        item.correoElectronico = res.lCorreo;
        (this as any).mensajeSpinner = "Enviando correo, por favor espere...";
        this.lcargando.ctlSpinner(true);
        this.facElectronicaService.enviarCorreoDocumentos(item).subscribe((datos:any)=>{
          this.lcargando.ctlSpinner(false);
          this.validaciones.mensajeExito("Exito","Se envió el documento al correo electronico ingresado correctamente.");
        }, error=>{
          this.lcargando.ctlSpinner(false);
          this.validaciones.mensajeError("Error", error.error.message);
        })
      }

    });

  }

}
