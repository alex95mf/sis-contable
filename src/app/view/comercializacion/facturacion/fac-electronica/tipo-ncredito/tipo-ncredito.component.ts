import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { MspreguntaComponent } from 'src/app/config/custom/mspregunta/mspregunta.component';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';
import { FacElectronicaService } from '../fac-electronica.service';
import { FacPdfComponent } from '../fac-pdf/fac-pdf.component';
import { MasDetalleComponent } from '../mas-detalle/mas-detalle.component';
import { VistaClientesComponent } from '../vista-clientes/vista-clientes.component';

@Component({
standalone: false,
  selector: 'app-tipo-ncredito',
  templateUrl: './tipo-ncredito.component.html',
  styleUrls: ['./tipo-ncredito.component.scss']
})
export class TipoNcreditoComponent implements OnInit {

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
    
    this.parametros.tipoDocumento = 3;
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
    if(this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.obtenerDocumentos();
      });
    }else{
      this.obtenerDocumentos();
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

    this.mensajeSppiner = "Generando XML por favor espere...";
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
        // let emision:any = valor._notas_cab._venta.num_doc.split("-");
        // valor.lestab = emision[0].padStart(3, '0');
        // valor.lptoEmi = emision[1];
        // valor.lsecuencial = emision[2];


        let numDocVent:any = valor._notas_cab.num_doc_adq.split("-");
        valor._notas_cab.num_doc_adq = numDocVent[0].padStart(3, '0') + "-" + numDocVent[1].padStart(3, '0') + "-" + numDocVent[2].padStart(9, '0');

        valor.lestab = valor._notas_cab.fk_sucursal.toString().padStart(3, '0');
        valor.lptoEmi = valor._notas_cab.fk_empresa.toString().padStart(3, '0');
        valor.lsecuencial = valor._notas_cab.secuencia_doc.padStart(9, '0');

        let fechaEmision:any = valor._notas_cab._venta.fecha.split("-");
        valor._notas_cab._venta.fechaEmision = fechaEmision[2]+"/"+fechaEmision[1]+"/"+fechaEmision[0];


        let fechaEmisionNC:any = valor._notas_cab.fecha_emision.split("-");
        valor._notas_cab.fecha_emision = fechaEmisionNC[2]+"/"+fechaEmisionNC[1]+"/"+fechaEmisionNC[0];
        


        // valor._notas_cab._venta.proveedor.tipo_contribuyente = valor._notas_cab._venta.proveedor.tipo_contribuyente.padStart(3, '0');
        valor._notas_cab._venta.iva_porcentaje = this.validaciones.roundNumber(valor._notas_cab._venta.iva_porcentaje, 2);
        datosEnviar.push(valor);

        this.facElectronicaService.generacionXMLNC({parametros: datosEnviar}).subscribe((datos1:any)=>{
          this.lcargando.ctlSpinner(false);
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
    }

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
    item.lNumeroDocumento = item._notas_cab.num_doc_adq;
    item.lNombreEstimado = item._notas_cab._venta.client.nombre_comercial_cli;


    item.lTipoDocumentoNombre = item._tipo_documento.nombre;
    item.lNumeroDocumento = item._notas_cab._venta.num_doc;
    item.lNumeroAutorizacion = item.autorizacion_sri;
    item.lFechaAutorizacion = item.fecha_autorizacion_sri;
    item.lAmbiente = "PRODUCCIÓN";
    item.lEmision = "NORMAL";
    item.lNombreCiaCedula = item._notas_cab._venta._empresa.razon_social + " - " + item._notas_cab._venta._empresa.ruc
    item.lObligadoContabilidad = item._notas_cab._venta._empresa.obligado_contabilidad;
    item.lNumeroTelefono = item._notas_cab._venta._empresa.celular;
    item.lDireccionEmpresa = item._notas_cab._venta._empresa.direccion;
    item.lEmailEmpresa = item._notas_cab._venta._empresa.email;
    item.lNombreVendedor = item._notas_cab._venta.creator.nombre;
    item.lEmailVendedor = item._notas_cab._venta.creator.email;
    item.lRazonSocialCliente = item._notas_cab._venta.client.razon_social;
    item.lIdentificacionCliente = item._notas_cab._venta.client.num_documento;
    item.lDireccionCliente = item._notas_cab._venta.client.direccion;
    item.lFechaEmisionInfo = item._notas_cab._venta.fecha;
    item.lRuc = item._notas_cab._venta._empresa.ruc;
    item.lNombreComercial = item._notas_cab._venta._empresa.nombre_comercial;

    item.lImagenLogo = item._notas_cab._venta._empresa.logo_empresa;
    
    item.lSubtotal = Number(item._notas_cab.total) / 1.12;
    item.lIvaValor = Number(item._notas_cab.total) - Number(item.lSubtotal);
    item.lTotal = item._notas_cab.total;

    let dataPresentar = {
      mensaje: "Ingresar correo electrónico para enviar el documento electrónico de tipo " + item._tipo_documento.nombre + ", con el codigo de acceso: " + item.codigo_acceso + ", de " + item._notas_cab._venta.client.nombre_comercial_cli + " - " + item._notas_cab._venta.client.num_documento,
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
