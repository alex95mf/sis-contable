import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ChequeProtestadoService } from '../cheque-protestado.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from "../../../../../global";
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { MspreguntaComponent } from 'src/app/config/custom/mspregunta/mspregunta.component';

@Component({
standalone: false,
  selector: 'app-ing-chq-protestado',
  templateUrl: './ing-chq-protestado.component.html',
  styleUrls: ['./ing-chq-protestado.component.scss']
})
export class IngChqProtestadoComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<IngChqProtestadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chequeProtestadoService: ChequeProtestadoService,
    private commonServices: CommonService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  vmButtons:any = [];
  lInputs:any = {};
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnIngChqProt", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      // { orig: "btnIngChqProt", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, printSection: "print-section-p-ant", imprimir: true, imprimirId: "imprimirDatos"},
      { orig: "btnIngChqProt", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false},
    ];

    this.lInputs.motivo = "";
    this.lInputs.fechaDevolucion = new Date();
    this.lInputs.valorComision = "";
    this.lInputs.concepto = "";
    this.lInputs.totalProtesto = "";
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
            this.guardar(); 
          }
        });
      break; 
      case "CANCELAR": 
        this.dialogRef.close(false);
      break;
    }   
  }

  calcularTotal(valor){
    this.lInputs.totalProtesto = Number(this.lInputs.valorComision) + Number(valor);
    this.lInputs.totalProtesto = this.validaciones.roundNumber(Number(this.lInputs.totalProtesto), 4)
  }

  guardar(){
    if(this.validarInput()){
      return;
    }

    console.log("pasoo: ", this.lInputs, this.data.datos);

    this.data.lstCtas.forEach(element => {
      if(element.id == 26){
        element.valor_deb = this.data.datos.valor;
        element.valor_cre = 0;
      }
      // if(element.id == 27){
      //   element.valor_deb = this.lInputs.valorComision;
      //   element.valor_cre = 0;
      // }
    });

    this.lInputs.fechaProtesto = moment(this.lInputs.fechaDevolucion).format("YYYY-MM-DD");

    this.data.lstCtas.push({
      cuenta_contable: this.data.datos._bank_deposito.detalle_bank.cuenta_contable,
      nombre_cuenta: this.data.datos._bank_deposito.detalle_bank.name_cuenta,
      valor_cre: this.data.datos.valor,
      valor_deb: 0
    })

    let datosEnviar:any = {
      lInputs: this.lInputs,
      datos: this.data.datos,
      detConMov: this.data.lstCtas,
      id_controlador: myVarGlobals.fChequeProtestado,
      accion: ("Se protestó cheque de " + this.data.datos.descripcion),
      ip: this.commonServices.getIpAddress()
    }
    console.log("datosEnviar: ", datosEnviar)
    (this as any).mensajeSpinner = "Guardando por favor espere...";
    this.lcargando.ctlSpinner(true);
    this.chequeProtestadoService.protestarCheque(datosEnviar).subscribe((datos:any)=>{

      this.lcargando.ctlSpinner(false);
      this.validaciones.mensajeExito("Exito", "El cheque se protesto correctamente");
      datosEnviar.resultadoSave = datos.data;
      this.dialogRef.close(datosEnviar);

    }, error=>{
      this.lcargando.ctlSpinner(false);
      this.validaciones.mensajeError("Error", "Error inesperado, intentelo nuevamente " + error.error.message);      
    });
  }

  validarInput(){
    let valida:boolean = false;
    console.log("cccccccccccc: ", this.lInputs);
    if(this.validaciones.verSiEsNull(this.lInputs.motivo) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","Por favor seleccionar un motivo de protesto");
      valida = true;
    }

    if(this.validaciones.verSiEsNull(this.lInputs.fechaDevolucion) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","Por favor seleccionar una fecha devolución");
      valida = true;
    }

    if(this.validaciones.verSiEsNull(this.lInputs.valorComision) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","Por favor ingresar valor de la comisión");
      valida = true;
    }

    if(Number(this.lInputs.valorComision) <= 0){
      this.validaciones.mensajeAdvertencia("Advertencia","Por favor ingresar un valor de la comisión mayor a 0(CERO)");
      valida = true;
    }

    if(this.validaciones.verSiEsNull(this.lInputs.concepto) == undefined){
      this.validaciones.mensajeAdvertencia("Advertencia","Por favor ingresar concepto");
      valida = true;
    }

    return valida;
  }

}
