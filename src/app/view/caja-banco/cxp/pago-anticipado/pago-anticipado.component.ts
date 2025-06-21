import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { MspreguntaComponent } from '../../../../config/custom/mspregunta/mspregunta.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { CommonService } from '../../../../services/commonServices';
import { PagoAnticipadoService } from './pago-anticipado.service';
import * as myVarGlobals from "../../../../global";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusqProveedorComponent } from './busq-proveedor/busq-proveedor.component';
import moment from 'moment';
import { Subject } from 'rxjs';
import { GeneraPagoComponent } from './genera-pago/genera-pago.component';
import { ImprimirComponent } from './imprimir/imprimir.component';
import { ButtonRadioActiveComponent } from '../../../../config/custom/cc-panel-buttons/button-radio-active.component';
import { DataTableDirective } from 'angular-datatables';
import { ListaCxpComponent } from './lista-cxp/lista-cxp.component';

declare const $: any;

@Component({
standalone: false,
  selector: 'app-pago-anticipado',
  templateUrl: './pago-anticipado.component.html',
  styleUrls: ['./pago-anticipado.component.scss']
})
export class PagoAnticipadoComponent implements OnInit {

  constructor(
    private pagoAnticipadoService: PagoAnticipadoService,
    private commonServices: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder
  ) { }


  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(ButtonRadioActiveComponent, { static: false }) buttonRadioActiveComponent: ButtonRadioActiveComponent;

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnspagant", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "GENERAR PAGO ANTICIPADO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnspagant", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, printSection: "print-section-p-ant", imprimir: true, imprimirId: "imprimirDatos"},
      { orig: "btnspagant", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}
    ];;

    this.crearFormulario();

    setTimeout(() => {
      this.permisos();
    }, 10);
  }
  lestado:any;
  permisions: any = [];
  dataUser: any;
  permisos() {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      codigo: myVarGlobals.fPagoAnticipado,
      id_rol: this.dataUser.id_rol,
    };
    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
      this.lcargando.ctlSpinner(false);
      this.permisions = res["data"];

      if (this.permisions[0].ver == "0") {
        this.vmButtons = [];
        this.validaciones.mensajeAdvertencia("Advertencia", "Usuario no tiene permiso para ver el formulario de pago de anticipo");
      } else {
        //ok
        this.getSucursal();
        this.obtenerCajaChica();
        this.getInfoBank();
        this.parametrosCuentas();
      }
    }, (error) => {
      this.lcargando.ctlSpinner(false);
    });
  }

  dataSucursal: any = [];
  getSucursal() {
    this.pagoAnticipadoService.getSucursales().subscribe((res) => {
      this.dataSucursal = res["data"].filter((e) => e.id_sucursal == this.dataUser.id_sucursal)[0];
    }, (error) => {}
    );
  }

  lstCajaChica:any = [];
  obtenerCajaChica(){
    this.pagoAnticipadoService.getBoxSmallXUsuario().subscribe((datos:any)=>{
      this.lstCajaChica = datos.data;
    },error=>{});
  }

  arrayBanks: any = [];
  getInfoBank() {
    this.pagoAnticipadoService.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe((res) => {
      this.arrayBanks = res["data"];
    }, (error) => {});
  }

  lstParametrosCuentas:any = [];
  lstParametrosCxP:any = [];
  parametrosCuentas(){
    this.pagoAnticipadoService.getParametrosCuentas({ id: 21 }).subscribe((res1) => {
      this.lstParametrosCuentas = res1["data"];

      this.pagoAnticipadoService.getParametrosCuentas({ id: 7 }).subscribe((res2) => {
        this.lstParametrosCxP = res2["data"];
      }, (error) => {});
    }, (error) => {});
  }


  forma: FormGroup;
  crearFormulario(){
    this.forma = this.fb.group({
      lFecha:["",[Validators.required]],
      lEstado:["A",[Validators.required]],
      lIdentificacion:["",[Validators.required]],
      lIdProveedor:[null,[Validators.required]],
      lDescProveedor:[{value: "",disabled:true},[Validators.required]],
      itemDinamicos: this.fb.array([])
    });
  }

  impTimer: any;
  metodoGlobal(evento: any) {
    let lIdentificacion:any = this.forma.get("lIdentificacion").value;
    switch (evento.items.boton.texto) {
      case "GENERAR PAGO ANTICIPADO":
        if(this.validaciones.verSiEsNull(lIdentificacion) == undefined){
          this.validaciones.mensajeAdvertencia("Adertencia","Por favor selecione un proveedor");
          return;
        };
        (this as any).mensajeSpinner = "Seteando valores...";
        this.lcargando.ctlSpinner(true);
        this.pagoAnticipadoService.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe((res) => {
          this.arrayBanks = res["data"];
          this.pagoAnticipadoService.getBoxSmallXUsuario().subscribe((datos:any)=>{
            this.lcargando.ctlSpinner(false);
            this.lstCajaChica = datos.data;
            const dialogRef = this.confirmationDialogService.openDialogMat(GeneraPagoComponent, {
              width: '1000px', height: 'auto',
              data: { titulo: "Generación de Pago Anticipado", dataUser: this.dataUser,
              lstParametrosCuentas: this.lstParametrosCuentas, arrayBanks: this.arrayBanks, lstCajaChica: this.lstCajaChica,
              myVarGlobals: myVarGlobals, commonServices: this.commonServices, formulario: this.forma}

            } );

            dialogRef.afterClosed().subscribe(resultado => {
              if(resultado!=false && resultado!=undefined){

                let datosEnviar:any = {
                  fk_documento: resultado.data.tip_doc_eg,
                  secuencial: resultado.data.num_doc_eg
                }
                this.pagoAnticipadoService.getComprobanteEgreso(datosEnviar).subscribe((respdatos:any)=>{

                  resultado.data.comprobanteEgreso = respdatos.data;


                  let lstPlusImprimir:any = [];
                  let validaTermina:boolean = false;
                  let contador:any = 0;
                  [resultado.data].forEach(itemImp => {

                    let buscar:any = {
                      num_doc_eg: itemImp.num_doc_eg,
                      tip_doc_eg: itemImp.tip_doc_eg,
                      tipo_doc_pa: itemImp.tipo_doc_pa,
                      num_doc_pa: itemImp.num_doc_pa,
                      lEstado: this.forma.get("lEstado").value
                     };
                    this.pagoAnticipadoService.getMovimientos(buscar).subscribe((datosMov:any)=>{
                      datosMov.data.mov_eg.forEach(element => {
                        lstPlusImprimir.push(element);
                      });
                      datosMov.data.mov_pa.forEach(element => {
                        lstPlusImprimir.push(element);
                      });
                      if((contador+1) == [resultado.data].length){
                        validaTermina = true;
                      }
                      contador++;
                    }, error=>{

                    });

                  });


                  this.impTimer = setInterval(() => {
                    if (validaTermina) {
                      this.imprimirComponent.setearValores(lstPlusImprimir, this.dataUser, this.dataSucursal, this.forma.get("lDescProveedor").value);
                      clearInterval(this.impTimer);
                      setTimeout(() => {
                        this.buttonRadioActiveComponent.printSectionCDE("imprimirDatos");

                        this.recargarPa();
                        this.recargarCxP();
                      }, 100);
                    }
                  }, 200);

                }, error=>{

                });


              }
            });
          },error=>{
            this.lcargando.ctlSpinner(false);
          });
        }, (error) => {
          this.lcargando.ctlSpinner(false);
        });
        break;
      case "BUSCAR":
        this.buscar();
        break;
    }
  }

  buscar(){
    let lIdentificacion:any = this.forma.get("lIdentificacion").value;
    if(this.validaciones.verSiEsNull(lIdentificacion) == undefined){
      this.validaciones.mensajeAdvertencia("Adertencia","Por favor selecione un proveedor");
      return;
    }
    this.recargarPa();
    this.recargarCxP();
  }

  mapearEstados(valor:any){
    if (valor=="A"){
      return "ACTIVO";
    }
    if (valor=="P"){
      return "PAGADO";
    }
    if (valor=="I"){
      return "ANULADO";
    }
  }

  /**LISTADO */
  dataSource: any;
  dataAnteriorPA:any = [];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  listadoGeneral(): any {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      searching: false,
      paging: true,
      order: [[ 0, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let lEstado:any = this.forma.get("lEstado").value;
    let lfecha:any = this.forma.get("lFecha").value;
    let lIdProveedor:any = this.forma.get("lIdProveedor").value;
    this.selectPagoAnticipo = null;
    this.btnRadioPant=false;
    this.selectCxP = null;
    this.btnRadioCxP = false;
    let data = {
      idProveedor: lIdProveedor,
      lfecha: this.validaciones.verSiEsNull(lfecha)==undefined?null:moment(lfecha).format("YYYY-MM-DD"),
      lEstado: lEstado == "P"? "A": lEstado
    };
    this.lcargando.ctlSpinner(true);
    this.pagoAnticipadoService.obtenerPagosAnticipados(data).subscribe((res:any) => {

      if(lEstado == "P"){
        let resultado:any = [];
        res.data.forEach(element => {
          if(element.details_cruce.length > 0){
            resultado.push(element);
          }
        });

        this.dataSource = resultado;
        this.dataAnteriorPA = JSON.stringify(resultado);
        this.dataAnteriorPA = JSON.parse(this.dataAnteriorPA);
      }else{
        this.dataSource = res["data"];
        this.dataAnteriorPA = JSON.stringify(res["data"]);
        this.dataAnteriorPA = JSON.parse(this.dataAnteriorPA);
      }

      this.setearImprimir();

      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);


    }, (error) => {

    });
  }

  recargarPa(){
    (this as any).mensajeSpinner = "Cargando...";
    if(this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.listadoGeneral();
      });
    }else{
      this.listadoGeneral();
    }
  }

  /**LISTADO */

  selectPagoAnticipo:any = null;
  btnRadioPant:any=false;
  abrirCuentasXPagar(dato:any){
    this.selectPagoAnticipo = dato;
    this.selectCxP = null;
    this.btnRadioCxP = false;
    this.listaCxpComponent.dataSourceCxP.forEach(element => {
      let item:any = this.listaCxpComponent.dataAnteriorCxP.find(datos=> datos.id == element.id);
      if(item!=undefined){
        element.monto_abono = item.monto_abono;
        element.monto_saldo = item.monto_saldo;
      }
    });
    this.listaCxpComponent.presentarRadio = true;
  }

  selectCxP:any = null;
  btnRadioCxP:any=false;
  seleccionarCuentaPorPagar(dato:any){
    if(this.validaciones.verSiEsNull(this.selectPagoAnticipo) == undefined){
      this.selectCxP = null;
      this.btnRadioCxP = false;
      this.listaCxpComponent.presentarRadio = false;
      this.validaciones.mensajeAdvertencia("Advertencia","Por favor seleccione un pago de anticipo");
      return;
    }

    this.selectCxP = dato;
    this.listaCxpComponent.dataSourceCxP.forEach(element => {
      let item:any = this.listaCxpComponent.dataAnteriorCxP.find(datos=> datos.id == element.id);
      if(item!=undefined){
        element.monto_abono = item.monto_abono;
        element.monto_saldo = item.monto_saldo;
      }
    });

    dato.monto_abono = 0;

    let montoTotal = this.validaciones.roundNumber((Number(dato.monto_total) - Number(this.selectPagoAnticipo.valor_final)), 2);
    console.log("montoTotal: ", montoTotal)
    if(montoTotal<=0){
      dato.monto_abono = this.validaciones.roundNumber(Number(dato.monto_total), 2);
      dato.monto_saldo = this.validaciones.roundNumber(0, 2);
      dato.montoSaldoReal = (montoTotal < 0) ? montoTotal * -1 : montoTotal;
    }else{
      dato.monto_abono = this.validaciones.roundNumber(Number(this.selectPagoAnticipo.valor_final), 2);
      dato.monto_saldo = montoTotal;
      dato.montoSaldoReal = 0;
    }

    /******************************************************** */
    this.dataSource.forEach(element => {
      let item:any = this.dataAnteriorPA.find(datos=> datos.id == element.id);
      if(item!=undefined){
        element.pago_estado = item.pago_estado;
      }
    });
  }


  abrirModalProveedor(){
    let lIdentificacion:any = this.forma.get("lIdentificacion").value;
    this.lcargando.ctlSpinner(true);
    this.pagoAnticipadoService.getProveedores().subscribe((res) => {
      this.lcargando.ctlSpinner(false);
      let datoBuscar:any = res["data"].find(datos=> datos.num_documento == lIdentificacion);
      this.forma.get("lIdentificacion").patchValue(null);
      this.forma.get("lIdProveedor").patchValue(null);
      this.forma.get("lDescProveedor").patchValue(null);

      // if(datoBuscar!=undefined){
      //   this.lcargando.ctlSpinner(false);
      //   this.forma.get("lIdentificacion").patchValue(datoBuscar.num_documento);
      //   this.forma.get("lIdProveedor").patchValue(datoBuscar.id_proveedor);
      //   this.forma.get("lDescProveedor").patchValue(datoBuscar.nombre_comercial_prov);
      // }else{
          const dialogRef = this.confirmationDialogService.openDialogMat(BusqProveedorComponent, {
            width: '1000px', height: 'auto',
            data: { titulo: "Proveedores", dataUser: this.dataUser, identificacion: "", listado: res["data"]}

          } );


          dialogRef.afterClosed().subscribe(resultado => {
            this.forma.get("lIdentificacion").patchValue(null);
            this.forma.get("lIdProveedor").patchValue(null);
            this.forma.get("lDescProveedor").patchValue(null);
            if(resultado!=false && resultado!=undefined){
              this.forma.get("lIdentificacion").patchValue(resultado.num_documento);
              this.forma.get("lIdProveedor").patchValue(resultado.id_proveedor);
              this.forma.get("lDescProveedor").patchValue(resultado.nombre_comercial_prov);

              this.recargarPa();
              this.recargarCxP();
            }
          });
      // }

    }, error=>{
      this.lcargando.ctlSpinner(false);
    });
  }


  /**LISTADO */
  @ViewChild (ListaCxpComponent,{static:false}) listaCxpComponent:ListaCxpComponent;
  listadoGeneralCxP(): any {
    this.selectCxP = null;
    this.btnRadioCxP = false;
    this.selectCxP = null;
    this.btnRadioCxP = false;
  }

  recargarCxP(){
    let lEstado:any = this.forma.get("lEstado").value;
    let lfecha:any = this.forma.get("lFecha").value;
    let lIdProveedor:any = this.forma.get("lIdProveedor").value;
    if(lEstado == "A"){
      setTimeout(() => {
        this.listadoGeneralCxP();
      this.listaCxpComponent.recargarCxP(lIdProveedor, lfecha, lEstado);
      }, 10);

    }
  }

  /**LISTADO */


  modificaPagoAnticipado(){

    let dataPresentar = {
      mensaje: "¿Esta seguro de realizar esta accion?.",
      titulo: "Pregunta"
    };
    const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
    dialogRef1.result.then((res) => {
      //No:true; SI:false
      if (res.valor) {
        let lgIdProveedor:any = this.forma.get("lIdProveedor").value;
        let lgDescProveedor:any = this.forma.get("lDescProveedor").value;

        // if(Number(this.selectCxP.monto_saldo) != 0){
        //   this.validaciones.mensajeAdvertencia("Advertencia","No se puede aplicar el cruce de cuentas porque el saldo de cuentas por pagar no cuadra");
        //   return;
        // }

        this.selectPagoAnticipo.ip = this.commonServices.getIpAddress();
        this.selectPagoAnticipo.accion = "Aplicar pago anticipado del proveedor " + lgIdProveedor + "- " + lgDescProveedor;
        this.selectPagoAnticipo.id_controlador = myVarGlobals.fPagoAnticipado;

        this.selectPagoAnticipo.cxp_fecha = this.selectCxP.fecha_inicio;
        this.selectPagoAnticipo.cxp_id = this.selectCxP.id;
        this.selectPagoAnticipo.cxp_proveedor = this.selectCxP.fk_provider;
        if(Number(this.selectCxP.monto_saldo) <= 0 && Number(this.selectPagoAnticipo.valor) == Number(this.selectPagoAnticipo.valor_inicial)){
          this.selectPagoAnticipo.pago_estado = "P";
        }

        let valorAbono = Number(this.selectCxP.monto_abono);
        let contLetras:any = 0;
        if(this.selectCxP.details.length > 0){
          this.selectCxP.details.forEach(element => {
            if(Number(element.valor_saldo) > 0){
              element.fecha_ult_abono = moment(new Date()).format("YYYY-MM-DD");
              valorAbono = valorAbono - Number(element.valor_saldo);
              if(valorAbono >= 0){
                element.valor_abono = element.valor_saldo;
                element.valor_saldo = 0;
                element.observaciones = "Se realizo el pago por medio del modulo pagos anticipados";
                contLetras++;
              }
            }

          });
        }

        this.selectCxP.letras_canceladas = contLetras;
        this.selectCxP.letras_pendientes = Number(this.selectCxP.letras_pendientes) - Number(contLetras);
        this.selectCxP.fecha_fin = moment(new Date()).format("YYYY-MM-DD");
        this.selectPagoAnticipo.paramCuentaPA = this.lstParametrosCuentas;
        this.selectCxP.paramCxP = this.lstParametrosCxP;
        this.selectPagoAnticipo.selectCxP = this.selectCxP;

        console.log("this.selectPagoAnticipo: ", this.selectPagoAnticipo);

        (this as any).mensajeSpinner = "Aplicando Pago Anticipado";
        this.lcargando.ctlSpinner(true);
        this.pagoAnticipadoService.modificarPagoAnticipado(this.selectPagoAnticipo).subscribe((datos:any)=>{
          this.lcargando.ctlSpinner(false);
          this.selectPagoAnticipo.details_cruce = datos.data;



          let lstPlusImprimir:any = [];
          let validaTermina:boolean = false;
          let contador:any = 0;
          [this.selectPagoAnticipo].forEach(itemImp => {

            let buscar:any = {
              num_doc_eg: itemImp.num_doc_eg,
              tip_doc_eg: itemImp.tip_doc_eg,
              tipo_doc_pa: itemImp.tipo_doc_pa,
              num_doc_pa: itemImp.num_doc_pa,
              lEstado: this.forma.get("lEstado").value
              };
            this.pagoAnticipadoService.getMovimientos(buscar).subscribe((datosMov:any)=>{

              datosMov.data.mov_eg.forEach(element => {
                lstPlusImprimir.push(element);
              });
              datosMov.data.mov_pa.forEach(element => {
                lstPlusImprimir.push(element);
              });


              if((contador+1) == [this.selectPagoAnticipo].length){
                validaTermina = true;
              }
              contador++;
            }, error=>{

            });

          });


          this.impTimer = setInterval(() => {
            if (validaTermina) {
              this.imprimirComponent.setearValores(lstPlusImprimir, this.dataUser, this.dataSucursal, this.forma.get("lDescProveedor").value);
              clearInterval(this.impTimer);
              setTimeout(() => {
                this.buttonRadioActiveComponent.printSectionCDE("imprimirDatos");

                this.recargarPa();
                this.recargarCxP();
              }, 100);
            }
          }, 200);

          this.validaciones.mensajeExito("Exito","El pago anticipado se generó correctamente");
        }, error=>{
          this.lcargando.ctlSpinner(false);
          this.validaciones.mensajeError("Error inesperado", error);
        });
      }
    });
  }

  @ViewChild(ImprimirComponent, { static: false }) imprimirComponent: ImprimirComponent;
  timer: any;
  setearImprimir(){

    this.imprimirComponent.lstPlusImprimir = [];
    this.dataSource.forEach(element => {

      let datos:any = {
        fk_documento: element.tip_doc_eg,
        secuencial: element.num_doc_eg
      }
      this.pagoAnticipadoService.getComprobanteEgreso(datos).subscribe((datos:any)=>{

        element.comprobanteEgreso = datos.data;
      }, error=>{

      });
    });

    let lstPlusImprimir:any = [];
    let validaTermina:boolean = false;
    let contador:any = 0;
    this.dataSource.forEach(itemImp => {

      let buscar:any = {
        num_doc_eg: itemImp.num_doc_eg,
        tip_doc_eg: itemImp.tip_doc_eg,
        tipo_doc_pa: itemImp.tipo_doc_pa,
        num_doc_pa: itemImp.num_doc_pa,
        lEstado: this.forma.get("lEstado").value
        };
      this.pagoAnticipadoService.getMovimientos(buscar).subscribe((datosMov:any)=>{

        datosMov.data.mov_eg.forEach(element => {
          lstPlusImprimir.push(element);
        });
        datosMov.data.mov_pa.forEach(element => {
          lstPlusImprimir.push(element);
        });


        if((contador+1) == this.dataSource.length){
          validaTermina = true;
        }
        contador++;
      }, error=>{

      });

    });


    this.impTimer = setInterval(() => {
      if (validaTermina) {
        this.imprimirComponent.setearValores(lstPlusImprimir, this.dataUser, this.dataSucursal, this.forma.get("lDescProveedor").value);
        clearInterval(this.impTimer);
        this.lcargando.ctlSpinner(false);
      }

      if (this.dataSource.length == 0) {
        clearInterval(this.timer);
        this.lcargando.ctlSpinner(false);
      }
    }, 200);
  }


  imprimirPorClick(valor:any){



    let lstPlusImprimir:any = [];
    let validaTermina:boolean = false;
    let contador:any = 0;
    [valor].forEach(itemImp => {

      let buscar:any = {
        num_doc_eg: itemImp.num_doc_eg,
        tip_doc_eg: itemImp.tip_doc_eg,
        tipo_doc_pa: itemImp.tipo_doc_pa,
        num_doc_pa: itemImp.num_doc_pa,
        lEstado: this.forma.get("lEstado").value
        };
      this.pagoAnticipadoService.getMovimientos(buscar).subscribe((datosMov:any)=>{

        datosMov.data.mov_eg.forEach(element => {
          lstPlusImprimir.push(element);
        });
        datosMov.data.mov_pa.forEach(element => {
          lstPlusImprimir.push(element);
        });


        if((contador+1) == [valor].length){
          validaTermina = true;
        }
        contador++;
      }, error=>{

      });

    });


    this.impTimer = setInterval(() => {
      if (validaTermina) {
        this.imprimirComponent.setearValores(lstPlusImprimir, this.dataUser, this.dataSucursal, this.forma.get("lDescProveedor").value);
        clearInterval(this.impTimer);
        setTimeout(() => {
          this.buttonRadioActiveComponent.printSectionCDE("imprimirDatos");

          this.recargarPa();
          this.recargarCxP();
        }, 100);
      }
    }, 200);
  }


  anularPagoAnticipado(valor:any){

    let dataPresentar = {
      mensaje: "¿Esta seguro de realizar esta accion?.",
      titulo: "Pregunta",
      phObservacion: "Ingresar motivo de anulacion de pago anticipado"
    };
    const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
    dialogRef1.result.then((res) => {
      //No:true; SI:false
      if (res.valor) {
        let lgIdProveedor:any = this.forma.get("lIdProveedor").value;
        let lgDescProveedor:any = this.forma.get("lDescProveedor").value;
        valor.motivoAnulacion = res.observacion;
        valor.ip = this.commonServices.getIpAddress();
        valor.accion = "Anulacion de pago anticipado del proveedor " + lgIdProveedor + " - " + lgDescProveedor;
        valor.id_controlador = myVarGlobals.fPagoAnticipado;

        if(valor.details_cruce.length > 0){
          valor.details_cruce.forEach(dato1 => {



            let contLetras:any = 0;
            if(dato1.detalle_cx_p_cab.details.length > 0){
              dato1.detalle_cx_p_cab.details.forEach(element1 => {
                if(Number(element1.valor_abono) > 0){
                  element1.fecha_ult_abono = null;
                  element1.valor_abono = 0;
                  element1.valor_saldo = element1.valor;
                  element1.observaciones = "Se anulo el anticipo de pago por lo tanto se reverso el pago";
                  contLetras++;
                }

              });
            }
            dato1.detalle_cx_p_cab.letras_canceladas = Number(dato1.detalle_cx_p_cab.letras_canceladas) - Number(contLetras);
            dato1.detalle_cx_p_cab.letras_pendientes = Number(dato1.detalle_cx_p_cab.letras_pendientes) + Number(contLetras);
            dato1.detalle_cx_p_cab.fecha_fin = null;
            dato1.detalle_cx_p_cab.monto_abono = 0;
            dato1.detalle_cx_p_cab.monto_saldo = dato1.detalle_cx_p_cab.monto_total;
          });

        }

        (this as any).mensajeSpinner = "Amulando Pago Anticipado";
        this.lcargando.ctlSpinner(true);
        this.pagoAnticipadoService.anularPagoAnticipado(valor).subscribe(datos=>{
          this.lcargando.ctlSpinner(false);
          this.validaciones.mensajeExito("Exito","El pago anticipado se anuló correctamente");
          this.recargarPa();
          this.recargarCxP();
        }, error=>{
          this.lcargando.ctlSpinner(false);
        });
      }
    });
  }


  cambioAccion(){
    let lEstado:any = this.forma.get("lEstado").value;
    this.vmButtons[1].permiso = true;
    this.vmButtons[1].showimg = true;
    if(lEstado != "I"){

    }else{
      this.vmButtons[1].permiso = false;
      this.vmButtons[1].showimg = false;
    }
  }

}
