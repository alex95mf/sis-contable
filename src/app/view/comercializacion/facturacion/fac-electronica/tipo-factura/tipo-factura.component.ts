import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { MspreguntaComponent } from '../../../../../config/custom/mspregunta/mspregunta.component';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';
import { EditarXmlComponent } from '../editar-xml/editar-xml.component';
import { FacElectronicaService } from '../fac-electronica.service';
import { FacPdfComponent } from '../fac-pdf/fac-pdf.component';
import { MasDetalleComponent } from '../mas-detalle/mas-detalle.component';
import { VistaClientesComponent } from '../vista-clientes/vista-clientes.component';

// declare const $: any;

@Component({
standalone: false,
  selector: 'app-tipo-factura',
  templateUrl: './tipo-factura.component.html',
  styleUrls: ['./tipo-factura.component.scss']
})
export class TipoFacturaComponent implements OnInit {

  constructor(
    private facElectronicaService: FacElectronicaService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }


  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  parametros:any = {fechaDesde: "", fechaHasta: "", estadoSri: "PENDIENTE", idCliente: ""}
  lstEstado:any = [];
  listado:any = [];
  dataUser: any;
  validateDt:any = false;

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
      order: [[ 1, "desc" ]],
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    
    this.parametros.tipoDocumento = 1;
    this.lcargando.ctlSpinner(true);
    this.facElectronicaService.obtenerDocumento(this.parametros).subscribe((datos:any)=>{
      this.lcargando.ctlSpinner(false);
      this.listado = datos.data;
      this.validateDt = true;
      this.listado.forEach(element => {
        element.isCollapsed = true;
      });
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      
    }, error=>{
      this.listado = [];
      this.validateDt = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.lcargando.ctlSpinner(false);
    })
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
    }

    let dataPresentar = {
      mensaje: "¿Esta seguro de generar, firmar y enviar al SRI para que se autorice el documento de tipo " + valor._tipo_documento.nombre + ", de " + valor._venta.client.nombre_comercial_cli + " - " + valor._venta.client.num_documento + "?",
      titulo: "Pregunta",
    };

    const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
    dialogRef1.result.then((res) => {

      if(res.valor){
        this.mensajeSppiner = "Generando XML por favor espere...";
        this.lcargando.ctlSpinner(true);
        try {
          this.procesoDual(valor);
        } catch (error) {
          this.lcargando.ctlSpinner(false);
          this.validaciones.mensajeError("Error","Por favor intentelo nuevamente");
        }
      }

    });
  }

  procesoDual(valor:any){

    try {
        let datosEnviar = [];
        let emision:any = valor._venta.num_doc.split("-");
        valor.lestab = emision[0].padStart(3, '0');
        valor.lptoEmi = emision[1];
        valor.lsecuencial = emision[2];

        let fechaEmision:any = valor._venta.fecha.split("-");
        valor._venta.fechaEmision = fechaEmision[2]+"/"+fechaEmision[1]+"/"+fechaEmision[0];
        valor._venta.client.tipo_contribuyente = valor._venta.client.tipo_contribuyente.padStart(3, '0');
        valor._venta.iva_porcentaje = this.validaciones.roundNumber(valor._venta.iva_porcentaje, 2);
        datosEnviar.push(valor);

        this.facElectronicaService.generacionXML({parametros: datosEnviar}).subscribe((datos1:any)=>{
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


  reprocesarDocuento(valor:any){

    if(this.validaciones.verSiEsNull(valor.codigo_acceso) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento XML no se encuentra generado.");
      return;
    }

    if(valor.estado_sri == "AUTORIZADO"){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento ya se encuentra autorizado");
      return;
    }

    let dataPresentar = {
      mensaje: "¿Esta seguro de reprocesar el documento de tipo " + valor._tipo_documento.nombre + ", de " + valor._venta.client.nombre_comercial_cli + " - " + valor._venta.client.num_documento + "?",
      titulo: "Pregunta",
    };

    const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
    dialogRef1.result.then((res) => {
      if(res.valor){
        this.mensajeSppiner = "Reprocesando Documento...";
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
    });
  }


  editarXml(item:any){

    if(this.validaciones.verSiEsNull(item.codigo_acceso) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento XML no se encuentra generado.");
    }

    this.mensajeSppiner = "Extrayendo datos del XML...";
    this.lcargando.ctlSpinner(true);

    this.facElectronicaService.editarXML({clave_acceso: item.codigo_acceso}).subscribe((datos:any)=>{
      this.lcargando.ctlSpinner(false);

      const dialogRef = this.confirmationDialogService.openDialogMat(EditarXmlComponent, {
        width: '1500px', height: 'auto',
        data: { titulo: "Editar XML", dataUser: this.dataUser, item: item, textoXML: datos.data}
        
      } );
   
      dialogRef.afterClosed().subscribe(resultado => {
        if(resultado!=false && resultado!=undefined){
  
        }
      });

    }, error=>{
      this.lcargando.ctlSpinner(false);
      this.validaciones.mensajeError("Error", error.error.message);
    })

    
  }

  descargarDocumentoXML(item:any){

    if(this.validaciones.verSiEsNull(item.codigo_acceso) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento XML no se encuentra generado.");
      return;
    }

    this.mensajeSppiner = "Extrayendo datos del XML...";
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
 
  isCollapsed:boolean = true;


  abrirModalClientes(){   
    const dialogRef = this.confirmationDialogService.openDialogMat(VistaClientesComponent, {
      width: 'auto', height: 'auto',
      data: { titulo: "Listado de Clientes", tipoDocumento: 1}
      
    } );
 
    dialogRef.afterClosed().subscribe(resultado => {
      if(resultado!=false && resultado!=undefined){
        
        this.parametros.identificacion = resultado.num_documento;
        this.parametros.proveedor = resultado.razon_social;
        this.parametros.idCliente = resultado.id_cliente;
        
      }
    }); 
  }


  recargar(){
    this.listado = [];
    this.validateDt = false;
    this.mensajeSppiner = "Cargando...";
    if(this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.obtenerDocumentos();
      });
    }else{
      this.obtenerDocumentos();
    }
  }

  presentarDetalle(item:any){
    const dialogRef = this.confirmationDialogService.openDialogMat(MasDetalleComponent, {
      width: '1500px', height: 'auto',
      data: { titulo: "Detalle del Documento", itemSeleccionado: item}
      
    } );
  } 

  timer: any;
  anularDocumento(item:any){
    if(item._venta.hasRetencion == 1){
      this.validaciones.mensajeAdvertencia("Advertencia","No puede anular este documento porque tiene una retencion, por favor anular la retencion y vuelva a intentar.");
      return;
    }

    if(item._venta.pagada != 0){
      this.validaciones.mensajeAdvertencia("Advertencia","No puede anular este documento porque ya esta pagada, por favor anular la retencion y vuelva a intentar.");
      return;
    }

    if(item._venta.despachado != 0){
      this.validaciones.mensajeAdvertencia("Advertencia","No puede anular este documento porque ya esta despachada, por favor anular la retencion y vuelva a intentar.");
      return;
    }

    if(item.estado_sri == "ANULADO" || item.estado_doc == "I"){
      this.validaciones.mensajeAdvertencia("Advertencia","El documento ya se encuentra anulado.");
      return;
    }
    

    if(item.estado_sri == "AUTORIZADO"){
      let datoEnviar:any = {
        tipo_documento: item._tipo_documento.tipo,
        fecha_comprobante: item.fecha_autorizacion_sri,
        clave_acceso: item.codigo_acceso,
        numero_autorizacion: item.autorizacion_sri,
        identificacion_receptor: item._venta.client.num_documento,
        correo_receptor: ""
      };
  
      let dataPresentar = {
        mensaje: "¿Esta seguro de anular el documento de tipo " + item._tipo_documento.nombre + ", con el codigo de acceso: " + item.codigo_acceso + ", de " + item._venta.client.nombre_comercial_cli + " - " + item._venta.client.num_documento + "?",
        titulo: "Pregunta",
        datos: datoEnviar,
        phCorreo: "Ingresar Correo electrónico del receptor",
        phObservacion: "Ingresar motivo de anulacion de documento"
      };
      this.anularAutorizados(datoEnviar, dataPresentar, item);
      
    }else{

      let dataPresentar = {
        mensaje: "¿Esta seguro de anular el documento de tipo " + item._tipo_documento.nombre + ", de " + item._venta.client.nombre_comercial_cli + " - " + item._venta.client.num_documento + "?",
        titulo: "Pregunta",
        phObservacion: "Ingresar motivo de anulacion de documento"
      };

      const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
      dialogRef1.result.then((res) => {
        
        if (res.valor) {
          let datosAnular:any = item;
          datosAnular.observacionAnulacion = res.observacion;
          console.log("datosAnular: ", datosAnular)
          this.lcargando.ctlSpinner(true);
          this.facElectronicaService.anularFacturaElectronica({parametros: datosAnular}).subscribe((datosAn:any)=>{
            this.lcargando.ctlSpinner(false);
            this.validaciones.mensajeExito("Exito","El documento se anuló correctamente en el sitema");
            this.recargar();
          }, error=>{
            this.lcargando.ctlSpinner(false);
            this.validaciones.mensajeError("Error", error.error.message);
          });
        }
      });

      
    }
  }

  anularAutorizados(datoEnviar:any, dataPresentar:any, item:any){
    const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
      dialogRef1.result.then((res) => {
        if (res.valor) {
          datoEnviar.correo_receptor = res.lCorreo;
  
          this.mensajeSppiner = "Anulando documento, por favor espere...";
          this.lcargando.ctlSpinner(true);
          this.facElectronicaService.anularDocumento(datoEnviar).subscribe((datos1:any)=>{

            this.timer = setInterval(() => {

              this.facElectronicaService.obtenerRobot({idRobot: datos1.data}).subscribe((datos2:any)=>{
              
                this.mensajeSppiner = ("Anulando documento, por favor espere... " + datos2.data.observacion);

                if (datos2.data.estado == "F") {                
                  clearInterval(this.timer);
                  let datosAnular:any = item;
                  datosAnular.observacionAnulacion = res.observacion;
                  this.facElectronicaService.anularFacturaElectronica({parametros: datosAnular}).subscribe((datosAn:any)=>{
                    // this.validaciones.mensajeExito("Exito","El documento se anuló correctamente en el sitema");

                    this.lcargando.ctlSpinner(false);
                    this.recargar();
                    this.validaciones.mensajeExito("Exito", datos2.data.observacion);

                  }, error=>{
                    this.validaciones.mensajeError("Error", error.error.message);
                  });
                } 

                if (datos2.data.estado == "E") {                
                  clearInterval(this.timer);
                  this.lcargando.ctlSpinner(false);
                  this.recargar();
                  this.validaciones.mensajeError("Error", datos2.data.observacion);
                } 

              }, error=>{
                clearInterval(this.timer);
                this.lcargando.ctlSpinner(false);
                this.validaciones.mensajeError("Error", error.error.message);
              });  
            }, 3000);

          }, error=>{
            this.lcargando.ctlSpinner(false);
            this.validaciones.mensajeError("Error", error.error.message);
          })
  
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
    item.lNumeroDocumento = item._venta.num_doc;
    item.lNombreEstimado = item._venta.client.nombre_comercial_cli;

    item.lTipoDocumentoNombre = item._tipo_documento.nombre;
    item.lNumeroDocumento = item._venta.num_doc;
    item.lNumeroAutorizacion = item.autorizacion_sri;
    item.lFechaAutorizacion = item.fecha_autorizacion_sri;
    item.lAmbiente = "PRODUCCIÓN";
    item.lEmision = "NORMAL";
    item.lNombreCiaCedula = item._venta._empresa.razon_social + " - " + item._venta._empresa.ruc
    item.lObligadoContabilidad = item._venta._empresa.obligado_contabilidad;
    item.lNumeroTelefono = item._venta._empresa.celular;
    item.lDireccionEmpresa = item._venta._empresa.direccion;
    item.lEmailEmpresa = item._venta._empresa.email;
    item.lNombreVendedor = item._venta.creator.nombre;
    item.lEmailVendedor = item._venta.creator.email;
    item.lRazonSocialCliente = item._venta.client.razon_social;
    item.lIdentificacionCliente = item._venta.client.num_documento;
    item.lDireccionCliente = item._venta.client.direccion;
    item.lFechaEmisionInfo = item._venta.fecha;
    item.lRuc = item._venta._empresa.ruc;
    item.lNombreComercial = item._venta._empresa.nombre_comercial;
    item.lImagenLogo = item._venta._empresa.logo_empresa;
    
    item.lSubtotal = item._venta.subtotal;
    item.lIvaValor = item._venta.iva_valor;
    item.lTotal = item._venta.total;

    let dataPresentar = {
      mensaje: "Ingresar correo electrónico para enviar el documento electrónico de tipo " + item._tipo_documento.nombre + ", con el codigo de acceso: " + item.codigo_acceso + ", de " + item._venta.client.nombre_comercial_cli + " - " + item._venta.client.num_documento,
      titulo: "Enviar documento electrónico",
      phCorreo: "Ingresar Correo electrónico"
    };

    const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
    dialogRef1.result.then((res) => {

      if(res.valor){
        console.log("respuesta: ", res)
        item.correoElectronico = res.lCorreo;
        this.mensajeSppiner = "Enviando correo, por favor espere...";
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
