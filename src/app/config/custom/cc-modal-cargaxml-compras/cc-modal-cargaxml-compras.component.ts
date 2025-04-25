import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import * as myVarGlobals from '../../../global';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices'; 
import { SuppliersService } from 'src/app/view/inventario/compras/suppliers/suppliers.service'; 
import { CcModalTablaProductosComponent } from 'src/app/config/custom/cc-modal-tabla-productos/cc-modal-tabla-productos.component';


import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService,Message,MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

import { CustonService } from '../app-custom.service';
import { contableConfService } from 'src/app/view/panel-control/parametro/contable/contable.service'; 

//import Swal from "sweetalert2";;

@Component(
  {
    templateUrl: './cc-modal-cargaxml-compras.component.html',
    providers: [DialogService, MessageService]
  }
)
export class CcModalCargaxmlComprasComponent implements AfterViewChecked {

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }


  referencia = this.ref;


  mensaje_load:string = 'Procesando información del XML';
  exist_client:boolean = false;
  botonConfirmar:boolean = false;
  impuestos: any;
  sustento_array: any;
  rete_fuente: any;
  rte_iva: any;
  centros: any;
  dataUser: any;

  LoadOpcion: any = false;
  LoadOpcionTipoPago: any = false;
  LoadOpcionUsuario: any = false;
  LoadOpcionTipoDoc: any = false;
  LoadOpcionProductos: any = false;
  LoadOpcionSustento: any = false;
  LoadModalCargaXml: any = false;

  proveedor: any
  permissions: any;

  msgs1: Message[];
  msgs2: Message[];

  buyProv: any = { tipo_documento: '7', sustento: '01', proveedor_name: '', anio: 2022, mes: 9, identificacion_proveedor: '', tipo_identificacion: '01', fk_id_proveedor: 0, subtotal: (0.00).toFixed(2), subcero: (0.00).toFixed(2), objeto: (0.00).toFixed(2), exento: (0.00).toFixed(2), descuento: (0.00).toFixed(2), propina: (0.00).toFixed(2), otro_impuesto: (0.00).toFixed(2), servicio: (0.00).toFixed(2), valor_iva: (0.00).toFixed(2), total: (0.00).toFixed(2), tipo_pago: 0, forma_pago: 0, fk_usuario_receive: 0, isActive: 1 };
  compra: any = {fecha_emision:'',identificacion_proveedor: '',direccion_proveedor: '', numero_comprobante: '', autorizacion: '',  tipo_identificacion: '01', fk_id_proveedor: 0,  proveedor_name:''};
  dataProducto: any = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];
  

  /* Information */
  supplier: any = {
    switchCredit: false,
    switchGarant: false,
    cupcredit: 0.00,
    valcredit: 0.00,
    totalcredit: 0.00,
    valmonto: 0.00,
    document: 0,
    constribuyente: 0,
    tipcontribuyente: 0,
    tipo: 0,
    linea: 0,
    docgarantia: 0,
    timecredit: 0,
    origin: 0,
    country: 0,
    province: 0,
    city: 0
  };

  constructor
  (
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private contableService: contableConfService, 
    private servCusto: CustonService, 
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService, 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private commonServices: CommonService,
    private supplierSrv: SuppliersService,
    public dialogService: DialogService,
    private cdRef:ChangeDetectorRef,
    ) { }

  ngOnInit(): void {

  

    this.primengConfig.ripple = true;
    // this.validatePermission();

    let datos_xml = this.config.data;
    //console.log(datos_xml);
    // this.ValidarExisteProveedor(datos_xml.rucproveedor,datos_xml.nombreproveedor);
    this.compra.proveedor_name = datos_xml.nombreproveedor;
    this.compra.identificacion_proveedor = datos_xml.rucproveedor;
    this.compra.autorizacion = datos_xml.numAuto;
    this.compra.numero_comprobante = datos_xml.numDocumento;
    this.compra.fecha_emision = datos_xml.fechaemision

    console.log(this.compra)

    this.contableService.getRetencionFuenteCompras().subscribe(res => {
      this.rete_fuente = res;

      this.contableService.getRetencionIvaCompras().subscribe(res => {
        this.rte_iva = res;

        let data = { fields: ["IMPUESTOS"] };
        this.contableService.ObtenerCatalogoGeneral(data).subscribe(res => {

          let catalogo = res['data']['catalogs'];
          this.impuestos = catalogo['IMPUESTOS'];

          this.dataProducto = []; 

          for (let detalle of datos_xml.detalles["detalle"]) {
           

            this.dataProducto.push({
              cod_anexo_iva: 0,
              cod_iva: 0,
              porce_iva: 0,
              cod_anexo_fte: 0,
              cod_fte: 0,
              porce_fte: 0,
              subtotal_noobjeto: detalle.impuestos[0].impuesto[0].codigoPorcentaje[0].toString() === '6' ? detalle.impuestos[0].impuesto[0].baseImponible[0] : 0 ,
              subtotal_excento: detalle.impuestos[0].impuesto[0].codigoPorcentaje[0].toString() === '7' ? detalle.impuestos[0].impuesto[0].baseImponible[0] : 0 ,
              subtotal_cero: detalle.impuestos[0].impuesto[0].codigoPorcentaje[0].toString() === '0' ? detalle.impuestos[0].impuesto[0].baseImponible[0] : 0 ,
              subtotal_iva: detalle.impuestos[0].impuesto[0].codigoPorcentaje[0].toString() === '2' ? detalle.impuestos[0].impuesto[0].baseImponible[0] : 0 ,
              iva_detalle: detalle.impuestos[0].impuesto[0].valor[0],
              fk_producto: 0,
              impuesto:  detalle.impuestos[0].impuesto[0].codigoPorcentaje[0].toString(),
              rte_fuente: 0,
              rte_iva: 0,
              centro: 0,
              nombre: detalle.descripcion[0],
              codigo: detalle.codigoPrincipal[0],
              observacion: '',
              cantidad: parseFloat(detalle.cantidad[0]),
              precio: parseFloat(detalle.precioUnitario[0]),
              desc: parseFloat(detalle.descuento[0]),
              subtotalItems: parseFloat(detalle.precioTotalSinImpuesto[0]),
              totalItems: parseFloat(detalle.precioTotalSinImpuesto[0]),
              paga_iva: 1
            })
          
          }

          console.log(this.dataProducto)

          this.LoadModalCargaXml = true;

        }, error => {
        
        })
      }, error => {
       
      })
    }, error => {
     
    })



  }

  ValidarExisteProveedor(identificacion:string, proveedor_name: string){


    let data = {
      ruc:identificacion
    }


    this.servCusto.obteneProveedorIdentificacion(data).subscribe(resTotales => {

      if(resTotales["data"].length > 0){       
          this.CargarProveedor(resTotales["data"]);       
          this.exist_client = true;
      }else{
        this.botonConfirmar = true;
        this.msgs1 = [
            {severity:'error', summary:'Verificar', detail:'El proveedor '+proveedor_name+' no se encuentra registrado, es necesario registrara proveedor para continuar'}
        ];
        
      }
      
    }, error => {
      
    })

    
  }

  CargarProveedor(event: any) {


    let pro = event[0];

    this.buyProv.fk_id_proveedor = pro.id_proveedor;
    this.buyProv.proveedor_name = pro.razon_social;
    this.buyProv.tipo_identificacion = (pro.tipo_documento === 'Ruc') ? '01' : '02';
    this.buyProv.identificacion_proveedor = pro.num_documento;

    this.proveedor = pro;


  }
  
  getImpuestosDetalle(i, data_combo) {

    if ((typeof (this.impuestos) === 'undefined') || (this.impuestos.length === 1)) {

      data_combo[i].LoadOpcionImpuesto = true;
      let data = { fields: ["IMPUESTOS"] };

      this.contableService.ObtenerCatalogoGeneral(data).subscribe(res => {

        let catalogo = res['data']['catalogs'];
        this.impuestos = catalogo['IMPUESTOS'];
        data_combo[i].LoadOpcionImpuesto = false;

      }, error => {
        data_combo[i].LoadOpcionImpuesto = false;

      })

    }
  }

  getRetencionFuente(i) {

    this.dataProducto[i].LoadOpcionReteFuente = true;

    this.contableService.getRetencionFuenteCompras().subscribe(res => {
      this.rete_fuente = res;
      this.dataProducto[i].LoadOpcionReteFuente = false;
    }, error => {
      this.dataProducto[i].LoadOpcionReteFuente = false;
    })

  }

  getRetencionIva(i, datos) {

    datos[i].LoadOpcionRteIva = true;

    this.contableService.getRetencionIvaCompras().subscribe(res => {
      
      this.rte_iva = res;
      datos[i].LoadOpcionRteIva = false;
    }, error => {
      datos[i].LoadOpcionRteIva = false;
    })

  }

  getCentroDetalle(i) {

    this.dataProducto[i].LoadOpcionCentro = true;

    this.contableService.getRetencionIvaCompras().subscribe(res => {
      this.centros = res;
      this.dataProducto[i].LoadOpcionCentro = false;
    }, error => {
      this.dataProducto[i].LoadOpcionCentro = false;
    })

  }


  RegistrarProveedor(event){

    this.supplier.document = 'Ruc';
    this.supplier.docnumber = this.compra.identificacion_proveedor;
    this.supplier.constribuyente = 'Jurídico';
    this.supplier.tipcontribuyente = "1";
    this.supplier.rsocial = this.compra.proveedor_name;
    this.supplier.ncomercial = '';
    this.supplier.replegal = '';
    this.supplier.address = 'S/N';
    this.supplier.website = '';
    this.supplier.tipo = 'Productos - Inventario';
    this.supplier.phone = '0999999999';
    this.supplier.origin = 'Nacional';

    this.confirmationService.confirm({
      target: event.target,
      message: "¿Confirmar registro de proveedor?",
      icon: "pi pi-question-circle",
      accept: () => {
        this.setProveedor(this.supplier);
      },
      reject: () => {
        
      }
    });

  }

  setProveedor(data) {

    this.mensaje_load = 'Registrando proveedor';
    this.LoadModalCargaXml = false;

    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para guardar de Proveedores");
    } else {
      //this.lcargando.ctlSpinner(true);
      data.id_controlador = myVarGlobals.fProveedores;
      data.accion = `Registro del proveedor ${data.docnumber}`;
      data.ip = this.commonServices.getIpAddress();
      //(this.supplier.linea != "" && this.supplier.linea != undefined && this.supplier.linea != null) ? data.linea = this.lineaSendId : data.linea = "";

      this.supplierSrv.saveProveedores(data).subscribe(res => {
        this.toastr.success(res["message"]);
        //this.lcargando.ctlSpinner(false);

        this.mensaje_load = 'Procesando información del XML';
        this.LoadModalCargaXml = true;

        this.exist_client = true;
        this.botonConfirmar = false;

        //this.commonServices.saveProveedores.next({ identifier: res['data']['id'] });
       
        /*setTimeout(() => {
          this.fillCatalog();
        }, 300);*/
      }, (error) => {
        //this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    let params = {
      codigo: myVarGlobals.fProveedores,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
    }, error => {
      //this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  onClickConsultaProductos(i) {

    this.referencia = this.dialogService.open(CcModalTablaProductosComponent, {
      header: 'Lista Productos',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.referencia.onClose.subscribe((productos: any) => {

      if (productos) {
        this.getDataProduct(productos, i);
        this.referencia.destroy();
      }

    });

  }


  getDataProduct(producto: any, index) {


    let filt = producto["data"];


    let validt = false;
    this.dataProducto.forEach(element => {
      if (element.codigo == filt.codigo) { validt = true; }
    });

    if (validt) {
      // Swal.fire(
      //   'Atención!',
      //   'Este producto ya se encuenta en la lista ingresada!',
      //   'error'
      // )
      this.dataProducto[index]['fk_producto'] = 0;
    } else {

      //debugger;
      this.dataProducto[index].codigo = filt.codigo;
      this.dataProducto[index].nombre = filt.nombre;
      this.dataProducto[index].fk_producto = filt.id;

    }

  }


  CargarFacturaProveedor(event){

    this.mensaje_load = 'Procesando información..';
    this.LoadModalCargaXml = false;

    /*Validamos que existan asignado productos */

    let validt = false;
    let message = '';
    this.dataProducto.forEach(element => {

      console.log(element);

      if(element.codigo === "" || element.codigo === undefined || element.codigo === null){
        validt = true;
        message = 'Debe asignar productos al detalle para continuar.'
        return false;
      }


      if(element.rte_fuente === "" || element.rte_fuente === undefined || element.rte_fuente === null || element.rte_fuente === 0){
        validt = true;
        message = 'Debe asignar codigo retencion fuente.'
        return false;
      }

      if(element.rte_iva === "" || element.rte_iva === undefined || element.rte_iva === null || element.rte_iva === 0){
        validt = true;
        message = 'Debe asignar codigo retencion IVA.'
        return false;
      }

    });

    if(validt){
      this.LoadModalCargaXml = true;
      this.msgs2 = [
          {severity:'error', summary:'Verificar', detail:message}
      ];
    }else{

      /*procesar XML al formulario de compras*/

      this.buyProv.autorizacion = this.compra.autorizacion;
      this.buyProv.numero = this.compra.numero_comprobante;
      this.buyProv.fecha = this.compra.fecha_emision;
      this.buyProv['detalle'] = this.dataProducto;
      this.buyProv['proveedor'] = this.proveedor;

      this.ref.close(this.buyProv);

    }


  }


  ChangeFuente(event: any, dataelement, index) {

    dataelement[index].porce_fte = event.porcentaje_fte;
    dataelement[index].cod_fte = event.codigo_fte_sri;
    dataelement[index].cod_anexo_fte = event.codigo_anexo_sri;
  

  }

  ChangeImpuestoIva(event: any, dataelement, index) {

    dataelement[index].porce_iva = event.porcentaje_rte_iva;
    dataelement[index].cod_iva = event.codigo_sri_iva;
    dataelement[index].cod_anexo_iva = event.codigo_sri_iva;
  

  }



}
