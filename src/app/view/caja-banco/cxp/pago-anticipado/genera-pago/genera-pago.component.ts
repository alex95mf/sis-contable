import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { MspreguntaComponent } from '../../../../../config/custom/mspregunta/mspregunta.component';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';
import { PagoAnticipadoService } from '../pago-anticipado.service';

@Component({
standalone: false,
  selector: 'app-genera-pago',
  templateUrl: './genera-pago.component.html',
  styleUrls: ['./genera-pago.component.scss']
})
export class GeneraPagoComponent implements OnInit {

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
    private pagoAnticipadoService: PagoAnticipadoService,
    private dialogRef: MatDialogRef<GeneraPagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  vmButtons:any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsgenant", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsgenant", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false}
    ];
    this.crearFormulario();
  }

  forma: FormGroup;
  crearFormulario(){
    this.forma = this.fb.group({
      lgFecha:["",[Validators.required]],
      lgValor:["",[Validators.required]],
      lgIdProveedor:[null,[Validators.required]],
      lgIdentificacion:[{value: "",disabled:true},[Validators.required]],
      lgDescProveedor:[{value: "",disabled:true},[Validators.required]],
      lgDetalle:["",[Validators.required]],
      lgFormaPago:["E",[Validators.required]],
      lgCuenta:["",[Validators.required]],
      lgCaja:["",[Validators.required]],
      lgNumCheque:["",[Validators.required]],
       
      itemDinamicos: this.fb.array([])
    });
    this.setearPagoAnticipado();
  }

  metodoGlobal(evento: any) {
    let dataPresentar = {
      mensaje: "¿Esta seguro de realizar esta accion?.",
      titulo: "Pregunta",
    };
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        const dialogRef1 = this.confirmationDialogService.openDialogBD(MspreguntaComponent, { config: {}, }, dataPresentar );
        dialogRef1.result.then((res) => {
          //No:true; SI:false
          if (res.valor) {
            this.guardaPagoAnticipado(); 
          }
        });
        break;
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }   
  }


  guardaPagoAnticipado(){
    if(this.validaFormulario()){
      return;
    }
    if(this.data.lstParametrosCuentas.length==0){
      this.validaciones.mensajeError("Error","No existe el parametro de cuenta contable para pago anticipado, por favor ir al modulo de crear parametros de cuentas contables.");
      return;
    }
    let lgFecha:any = this.forma.get("lgFecha").value;
    let lgValor:any = this.forma.get("lgValor").value;
    let lgIdProveedor:any = this.forma.get("lgIdProveedor").value;
    let lgIdentificacion:any = this.forma.get("lgIdentificacion").value;
    let lgDescProveedor:any = this.forma.get("lgDescProveedor").value;
    let lgDetalle:any = this.forma.get("lgDetalle").value;
    let lgFormaPago:any = this.forma.get("lgFormaPago").value;
    let lgCuenta:any = this.forma.get("lgCuenta").value;
    let lgCaja:any = this.forma.get("lgCaja").value;
    let lgNumCheque:any = this.forma.get("lgNumCheque").value;
    
    let compbt:any = {}; 
    let bancoSeleccionado: any = this.data.arrayBanks.find((datos) => datos.id_banks == lgCuenta);
    let cajaChica:any = this.data.lstCajaChica.find(datos=> datos.id_caja_chica == lgCaja);
 
    if(lgFormaPago == "E"){
      if((Number(cajaChica.saldo) <= 0 || Number(lgValor) > Number(cajaChica.saldo))){
        this.validaciones.mensajeAdvertencia("Advertencia","El saldo de la caja chica seleccionada tiene saldo insuficiente ya que tiene disponible $ "+this.validaciones.roundNumber(cajaChica.saldo,2)+" y el valor ingresado es de $ "+lgValor+". Por favor seleccione otra caja chica.");
        return;
      }
    }    

    if(lgFormaPago == "C" || lgFormaPago == "T"){
      if((Number(bancoSeleccionado.saldo_cuenta) <= 0 || Number(lgValor) > Number(bancoSeleccionado.saldo_cuenta))){
        this.validaciones.mensajeAdvertencia("Advertencia","El saldo de la cuenta seleccionada tiene saldo insuficiente ya que tiene disponible $ "+this.validaciones.roundNumber(bancoSeleccionado.saldo_cuenta,2)+" y el valor ingresado es de $ "+lgValor+". Por favor seleccione otra cuenta.");
        return;
      }
    }

    compbt = {
      accion: (lgFormaPago=="C" || lgFormaPago == "T")? ("Comprobante de egreso con numero de transaccion "+lgNumCheque+" por el usuario "+this.data.dataUser.usuario):
      ("Comprobante de egreso tipo efectivo por el usuario "+this.data.dataUser.usuario),
      beneficiario: lgDescProveedor,
      ciudad: null,
      concepto: lgDetalle,
      detalle: [
        {
          codigo_cta: this.data.lstParametrosCuentas.cuenta_contable,
          debe: lgValor,
          haber: "0.00",
          nombre_cta: this.data.lstParametrosCuentas.nombre_cuenta
        },
        {
          codigo_cta: (lgFormaPago=="C" || lgFormaPago == "T")?bancoSeleccionado.cuenta_contable: cajaChica.cuenta,
          nombre_cta: (lgFormaPago=="C"|| lgFormaPago == "T")?bancoSeleccionado.name_banks: cajaChica.name_cuenta,
          debe: '0.00', 
          haber: lgValor
        }
      ],
      fecha_emision: moment(lgFecha).format("YYYY-MM-DD"),
      fecha_post: moment(lgFecha).format("YYYY-MM-DD"),
      fk_centro_costo: null,/* efectivo va null */
      fk_cta_affected: (lgFormaPago=="C"|| lgFormaPago == "T")?bancoSeleccionado.id_banks:0,/* efectivo va 0, si es cheque va id de cta de banco */
      fk_documento: 12,/* va 12 por que en sis_documentos el id de comprobantes de egreso es 12 */
      id_controlador: this.data.myVarGlobals.fPagoAnticipado,
      ip: this.data.commonServices.getIpAddress(),
      isPostDate: (moment(lgFecha).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD')) ? 1 : 0,
      metodo_pago: lgFormaPago=="C"?'Cheque':lgFormaPago=="T"?'Transferencia':'Efectivo',/* va forma de pago el nombre */
      num_tx: (lgFormaPago=="C"|| lgFormaPago == "T")?lgNumCheque:null,/* efectivo va "" */
      tipo_egreso: "Varios",/* por ahora va varios tanto para efectivo como cheque */
      typ_acc: (lgFormaPago=="C"|| lgFormaPago == "T")?bancoSeleccionado.id_banks:0,/* efectivo va 0, si es cheque va id de cta de banco */
      valor: lgValor
    }

    let dataPost:any = {
      fecha: moment(lgFecha).format("YYYY-MM-DD"),
      fk_proveedor: lgIdProveedor,
      detalle: lgDetalle,
      pago_forma: lgFormaPago,
      pago_transaccion: (lgFormaPago=="C" || lgFormaPago == "T")?lgNumCheque: null,//si es cheque va lgNumCheque
      fk_cuenta: (lgFormaPago=="C" || lgFormaPago == "T")?lgCuenta:lgCaja,//si es cheque va lgCuenta, si es efectivo va lgCaja
      pago_estado: "A",
      cxp_id: null,
      cxp_proveedor: null,
      cxp_fecha: null,
      valor: lgValor,
      ip: this.data.commonServices.getIpAddress(),
      accion: "Generar pago anticipado del proveedor " + lgIdProveedor + " " + lgDescProveedor,
      id_controlador: this.data.myVarGlobals.fPagoAnticipado,
      datosComPago: compbt
    }

    this.mensajeSpinner = "Generando Pago Anticipado";
    this.lcargando.ctlSpinner(true);
    this.pagoAnticipadoService.guardarPagoAnticipado(dataPost).subscribe(datos=>{
      this.lcargando.ctlSpinner(false);
      this.dialogRef.close(datos);
      this.validaciones.mensajeExito("Exito","El pago anticipado se generó correctamente");

    }, error=>{
      this.lcargando.ctlSpinner(false);
      this.validaciones.mensajeError("Error inesperado", error);
    });
  }

  validaFormulario(){
    let lgFecha:any = this.forma.get("lgFecha").value;
    let lgValor:any = this.forma.get("lgValor").value;
    let lgDetalle:any = this.forma.get("lgDetalle").value;
    let lgFormaPago:any = this.forma.get("lgFormaPago").value;
    let lgCuenta:any = this.forma.get("lgCuenta").value;
    let lgCaja:any = this.forma.get("lgCaja").value;
    let lgNumCheque:any = this.forma.get("lgNumCheque").value;
    let valida:boolean = false;

    if (this.validaciones.verSiEsNull(lgFecha) == undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Por favor seleccionar una fecha");
      valida = true;
    }
    if (this.validaciones.verSiEsNull(lgValor) == undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Por favor ingresar un valor");
      valida = true;
    }
    if (this.validaciones.verSiEsNull(lgDetalle) == undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Por favor ingresar un detalle");
      valida = true;
    }
    if (this.validaciones.verSiEsNull(lgFormaPago) == undefined) {
      this.validaciones.mensajeAdvertencia("Advertencia", "Por favor seleccionar una forma de pago");
      valida = true;
    }
    if(lgFormaPago == "C"){
      if (this.validaciones.verSiEsNull(lgCuenta) == undefined) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Por favor seleccionar una cuenta");
        valida = true;
      }
      if (this.validaciones.verSiEsNull(lgNumCheque) == undefined) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Por favor ingresar numero de cheque");
        valida = true;
      }
    }    

    if(lgFormaPago == "T"){
      if (this.validaciones.verSiEsNull(lgCuenta) == undefined) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Por favor seleccionar una cuenta");
        valida = true;
      }
      if (this.validaciones.verSiEsNull(lgNumCheque) == undefined) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Por favor ingresar numero de transacción");
        valida = true;
      }
    }   

    if(lgFormaPago == "E"){
      if (this.validaciones.verSiEsNull(lgCaja) == undefined) {
        this.validaciones.mensajeAdvertencia("Advertencia", "Por favor seleccionar una caja");
        valida = true;
      }
    }
    return valida;
  } 


  transformarValores(tipo){
    let valor:any = this.forma.get(tipo).value;
    let tranformar:any = this.validaciones.roundNumber(valor, 2);
    this.forma.get(tipo).patchValue(tranformar);
  }

  setearPagoAnticipado(valores?:any){

    let lIdProveedor:any = this.data.formulario.get("lIdProveedor").value;
    let lIdentificacion:any = this.data.formulario.get("lIdentificacion").value;
    let lDescProveedor:any = this.data.formulario.get("lDescProveedor").value;
    this.limpiarFormularioGenera();

    this.forma.get("lgFecha").patchValue(new Date());
    this.forma.get("lgIdentificacion").patchValue(lIdentificacion);
    this.forma.get("lgIdProveedor").patchValue(lIdProveedor);
    this.forma.get("lgDescProveedor").patchValue(lDescProveedor);
  }

  limpiarFormularioGenera(){
    let listado:any=this.forma.controls;
    for (var key in listado) {
      if(key == "lgFormaPago"){
        this.forma.get(key).patchValue("E");
      }else if(key!="itemDinamicos"){
        this.forma.get(key).patchValue("");
      }
    }  
  }


  limpiarCtaTran(){
    this.forma.get("lgCuenta").patchValue("");
    this.forma.get("lgNumCheque").patchValue("");
  }

  cambioTipoCta(){
    if(this.forma.get('lgFormaPago').value == 'C'){
      return {field:'tipo_cuenta', value: 'Corriente'};
    }
    return {field:'tipo_cuenta', value: ''};
  }
}
