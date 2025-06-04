import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ModalCuentPreComponent } from '../modal-cuent-pre/modal-cuent-pre.component';
import { RubrosService } from '../../rubros/rubros.service';
import { ContratoRubrosService } from '../../contrato-rubros/contrato-rubros.service';
import { ConfirmationDialogService } from "src/app/config/custom/confirmation-dialog/confirmation-dialog.service";
import Swal from 'sweetalert2';

import { MspreguntaComponent } from "src/app/config/custom/mspregunta/mspregunta.component";
@Component({
standalone: false,
  selector: 'app-modal-mod-set',
  templateUrl: './modal-mod-set.component.html',
  styleUrls: ['./modal-mod-set.component.scss']
})
export class ModalModSetComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() isNew: any;
  @Input() data: any;
  @Input() cuentas: any;
  vmButtons: any;

  deudora: boolean = false;
  presupuesto: boolean = false;

  rubro = {
    id_rubro: 0,
    codigo: null,
    nombre: null,
    cuentaInvDeb:null,
    cuentaCorrDeb:null,
    cuentaProdDeb:null,
    cuentaPresupuestoInvDeb:null,
    cuentaPresupuestoCorrDeb:null,
    cuentaPresupuestoProdDeb:null,
    cuentaInvHab:null,
    cuentaCorrHab:null,
    cuentaProdHab:null,
    alSueldo: null,
    alIngreso: null,
    losep: null,
    aportable: null,
    tipoRubro: null,
    automatico: null,
    estado: null,
    numcInvDeb: null,
    numcCorrDeb: null,
    numcProdDeb: null,
    numpcInvDeb: null,
    numpcCorrDeb: null,
    numpcProdDeb: null,
    diferencia_por_region: null,
    numcInvHab: null,
    numcCorrHab: null,
    numcProdHab: null,

  }

  listadoNS = []

  tipoRubro = []

  estado = []

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private modal: NgbActiveModal,
    private service: RubrosService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService,private apiService: ContratoRubrosService,
  ) {
    this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res)=>{
        console.log(res);
        console.log(res.presupuesto?.codigo ? res.presupuesto_haber?.codigo : '')
        if( res.validacion == '1'){
          this.rubro.cuentaInvDeb = res.data.codigo
          this.rubro.numcInvDeb = res.data.nombre
          this.rubro.cuentaPresupuestoInvDeb = res.data.presupuesto != null ? res.data.presupuesto?.codigo : res.data.presupuesto_haber?.codigo
          this.rubro.numpcInvDeb = res.data.presupuesto != null ? res.data.presupuesto?.nombre : res.data.presupuesto_haber?.nombre
    /*       this.rubro.cuentaPresupuestoInvDeb = res.data.presupuesto != null ? res.data.presupuesto?.codigo : res.presupuesto_haber?.codigo */
       /*    this.rubro.numpcInvDeb = res.data.presupuesto != null ? res.data.presupuesto?.nombre : res.data.presupuesto_haber?.nombre  */
        }else if(res.validacion == '2'){
          this.rubro.cuentaCorrDeb = res.data.codigo
          console.log(res.data);
          this.rubro.numcCorrDeb = res.data.nombre
          this.rubro.cuentaPresupuestoCorrDeb =  res.data.presupuesto != null  ? res.data.presupuesto?.codigo : res.data.presupuesto_haber?.codigo
          this.rubro.numpcCorrDeb = res.data.presupuesto != null ? res.data.presupuesto?.nombre : res.data.presupuesto_haber?.nombre

        }else if(res.validacion == '3'){
          this.rubro.cuentaProdDeb = res.data.codigo
          this.rubro.numcProdDeb = res.data.nombre
          this.rubro.cuentaPresupuestoProdDeb =   res.data.presupuesto != null ? res.data.presupuesto?.codigo : res.data.presupuesto_haber?.codigo
          this.rubro.numpcProdDeb = res.data.presupuesto != null ? res.data.presupuesto?.nombre : res.data.presupuesto_haber?.nombre

        }
        else if(res.validacion == '4'){
          this.rubro.cuentaInvHab = res.data.codigo
          this.rubro.numcInvHab = res.data.nombre
        }else if(res.validacion == '5'){
          this.rubro.cuentaCorrHab = res.data.codigo
          this.rubro.numcCorrHab = res.data.nombre
        }
        else if(res.validacion == '6'){
          this.rubro.cuentaProdHab = res.data.codigo
          this.rubro.numcProdHab = res.data.nombre
        }
        else if(res.validacion == 'p1'){
          this.rubro.cuentaPresupuestoInvDeb = res.data.codigo
          this.rubro.numpcInvDeb = res.data.descripcion_general
        }else if(res.validacion == 'p2'){
          this.rubro.cuentaPresupuestoCorrDeb = res.data.codigo
          this.rubro.numpcCorrDeb = res.data.descripcion_general
        }else if(res.validacion == 'p3'){
          this.rubro.cuentaPresupuestoProdDeb = res.data.codigo
          this.rubro.numpcProdDeb = res.data.descripcion_general
        }

      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    setTimeout(() => {
      this.rubro.cuentaPresupuestoInvDeb = this.cuentas.codigo_presupuesto
      this.rubro.cuentaInvDeb= this.cuentas.cuenta_deudora
      this.rubro.cuentaInvHab= this.cuentas.cuenta_acreedora
      this.rubro.numcInvDeb= this.cuentas.numcInvDeb
      this.rubro.numpcInvDeb= this.cuentas.numpcInvDeb
      this.rubro.numcInvHab= this.cuentas.numcInvHab
      console.log(this.data)
      this.getCatalogo();
    /*   if(!this.isNew){
        this.rubro.id_rubro = this.data.id_rubro
        this.rubro.codigo = this.data.rub_codigo
        this.rubro.nombre = this.data.rub_descripcion
        this.rubro.cuentaInvDeb = this.data.cuenta_1?.codigo
        this.rubro.cuentaCorrDeb = this.data.cuenta_2?.codigo
        this.rubro.cuentaProdDeb = this.data.cuenta_3?.codigo
        this.rubro.cuentaInvHab = this.data.cuenta_inversion_haber?.codigo
        this.rubro.cuentaCorrHab = this.data.cuenta_corriente_haber?.codigo
        this.rubro.cuentaProdHab = this.data.cuenta_produccion_haber?.codigo
        this.rubro.cuentaPresupuestoInvDeb = this.data.cuenta_pre1
        this.rubro.cuentaPresupuestoCorrDeb = this.data.cuenta_pre2
        this.rubro.cuentaPresupuestoProdDeb = this.data.cuenta_pre3
        this.rubro.alSueldo = this.data.porcentaje_al_sueldo
        this.rubro.alIngreso = this.data.porcentaje_al_ingreso
        this.rubro.losep = this.data.porcentaje_al_ingreso_losep
        this.rubro.aportable = this.data.id_aportable
        this.rubro.diferencia_por_region = this.data.id_diferencia_por_region
        this.rubro.tipoRubro = this.data.id_tipo_rubro
        this.rubro.automatico = this.data.id_automatico
        this.rubro.estado = this.data.estado_id
        this.rubro.numcInvDeb = this.data.cuenta_1?.nombre
        this.rubro.numcCorrDeb = this.data.cuenta_2?.nombre
        this.rubro.numcProdDeb = this.data.cuenta_3?.nombre
        this.rubro.numpcInvDeb = this.data.presupuest_1?.descripcion_general
        this.rubro.numpcCorrDeb = this.data.presupuest_2?.descripcion_general
        this.rubro.numpcProdDeb = this.data.presupuest_3?.descripcion_general

        this.rubro.numcInvHab = this.data.cuenta_inversion_haber?.nombre
        this.rubro.numcCorrHab = this.data.cuenta_corriente_haber?.nombre
        this.rubro.numcProdHab = this.data.cuenta_produccion_haber?.nombre

        this.vmButtons[0].showimg = false
      }else{

        this.vmButtons[0].showimg = true
        this.vmButtons[1].showimg = false
      } */

    }, 50);

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal("regresar");
        break;
      case " GUARDAR":
        this.validacion('SAVE');
        break;
      case " ACTUALIZAR":
        this.validacion('UPDATE');
        break;
    }
  }

  closeModal(x){
    this.modal.close(x)
  }

  getCatalogo(){
    this.lcargando.ctlSpinner(true)
    let paretnId = [7, 4, 1]
    this.service.getNomCatalogo(paretnId).subscribe(
      (res) =>{
        console.log(res);
        this.lcargando.ctlSpinner(false)
        res['data'].map(
          (e)=>{
            if(e['parent_id'] == 4){
              this.listadoNS.push(e);
            }else if(e['parent_id'] == 7){
              this.tipoRubro.push(e);
            }else if(e['parent_id'] == 1){
              this.estado.push(e);
            }
          }
        )
        let listadoNS = []
      }
    )
  }

  validacion(valor){
    this.lcargando.ctlSpinner(true)
    if(this.rubro.cuentaInvDeb == null){
      Swal.fire({
        title: 'Pregunta',
        text: '¿Está seguro de guardar sin cuenta Debe?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (!result.value) {
            this.lcargando.ctlSpinner(false);
            return this.toastr.info('Escoja la cuenta Debe');
        } else {
            if (valor == 'SAVE') {
                this.guardarRubro();
            }
        }
    });/*
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta de Debe'); */ //Inversion

    }
    else if(this.rubro.cuentaInvHab == null){
      Swal.fire({
        title: 'Pregunta',
        text: '¿Está seguro de guardar sin cuenta Haber?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (!result.value) {
            this.lcargando.ctlSpinner(false);
            return this.toastr.info('Escoja la cuenta Haber');
        } else {
            if (valor == 'SAVE') {
                this.guardarRubro();
            }
        }
    });




    }
    else if(this.rubro.cuentaPresupuestoInvDeb == null){

      Swal.fire({
        title: 'Pregunta',
        text: '¿Está seguro de guardar sin cuenta presupuesto de Debe ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (!result.value) {
            this.lcargando.ctlSpinner(false);
            return this.toastr.info('Escoja la cuenta presupuesto de Debe');
        } else {
            if (valor == 'SAVE') {
                this.guardarRubro();
            }
        }
    });


    }else{
      if(valor == 'SAVE'){
        this.guardarRubro();
      }else if(valor == 'UPDATE'){
       // this.actualizarRubro();
      }
    }
  }


 async guardarRubro(){


    console.log(this.data)
    console.log(this.rubro);

  /*
  , */ /*  */
    await this.apiService.updateTipoContratoRubro({id:this.data,cuenta_deudora: this.rubro.cuentaInvDeb, codigo_presupuesto: this.rubro.cuentaPresupuestoInvDeb, cuenta_acreedora: this.rubro.cuentaInvHab})
    this.toastr.success('Se Guardo con éxito');
    this.lcargando.ctlSpinner(false);
    this.closeModal("guardado");
    /* this.service.setRubros(this.rubro).subscribe(
      (res)=>{
        this.toastr.success('Se Guardo con éxito');
        this.lcargando.ctlSpinner(false);
        this.closeModal();
        this.commonVarSrv.modalCargarRubros.next(null)
      }
    ) */
  }


  actualizarRubro(){

   /*  this.service.updateRubros(this.rubro).subscribe(
      (res)=>{
        this.toastr.success('Se Actualizo con éxito');
        this.lcargando.ctlSpinner(false);
        this.closeModal();
        this.commonVarSrv.modalCargarRubros.next(null)
      }
    ) */
  }


  modalCuentaContable(valor){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.tieneReglas = false;
    modal.componentInstance.validar = valor;

  }
  modalCuentaContableReg(valor){
    console.log("reglas")
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.tieneReglas = true;
    modal.componentInstance.validar = valor;
    modal.componentInstance.filtrar = this.rubro.cuentaPresupuestoInvDeb;
  }







  modalCodigoPresupuesto(valor){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.tieneReglas = false;
    modal.componentInstance.validar = valor;
  }

}
