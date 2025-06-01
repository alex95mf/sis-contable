import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ModalCuentPreComponent } from '../modal-cuent-pre/modal-cuent-pre.component';
import { RubrosService } from '../rubros.service';

@Component({
standalone: false,
  selector: 'app-modal-mod-set',
  templateUrl: './modal-mod-set.component.html',
  styleUrls: ['./modal-mod-set.component.scss']
})
export class ModalModSetComponent implements OnInit {

  msgSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() isNew: any;
  @Input() data: any;

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
    codigoTipoPago: null,
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

  tipoPago = []

  estado = []

  constructor(
    private modal: NgbActiveModal,
    private service: RubrosService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService,
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
        boton: { icon: "fas fa-save", texto: " ACTUALIZAR" },
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

      console.log(this.data)
      this.getCatalogo();
      if(!this.isNew){
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
        this.rubro.codigoTipoPago = this.data.codigo_tipo_pago
        this.rubro.automatico = this.data.id_automatico
        this.rubro.estado = this.data.estado_id
        this.rubro.numcInvDeb = this.data.cuenta_1?.nombre
        this.rubro.numcCorrDeb = this.data.cuenta_2?.nombre
        this.rubro.numcProdDeb = this.data.cuenta_3?.nombre
        this.rubro.numpcInvDeb = this.data.presupuest_1?.descripcion_general
        this.rubro.numpcCorrDeb = this.data.presupuest_2?.descripcion_general
        this.rubro.numpcProdDeb = this.data.presupuest_3?.descripcion_general
        console.log('this.rubro.tipoRubro');
        this.deudora = this.rubro.tipoRubro == 9 ? true : false; // aqui valida que sea egreso con el id 9
        this.rubro.numcInvHab = this.data.cuenta_inversion_haber?.nombre
        this.rubro.numcCorrHab = this.data.cuenta_corriente_haber?.nombre
        this.rubro.numcProdHab = this.data.cuenta_produccion_haber?.nombre

        this.vmButtons[0].showimg = false
      }else{

        this.vmButtons[0].showimg = true
        this.vmButtons[1].showimg = false
      }

    }, 50);

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validacion('SAVE');
        break;
      case " ACTUALIZAR":
        this.validacion('UPDATE');
        break;
    }
  }


  closeModal(){
    this.modal.close()
  }

  getCatalogo(){
    this.lcargando.ctlSpinner(true)
    let paretnId = [7, 4, 1,209]
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
            }else if(e['parent_id'] == 209){
              this.tipoPago.push(e);
            }
          }
        )
        let listadoNS = []
      }
    )
  }

  validacion(valor){
    this.lcargando.ctlSpinner(true)
    if(this.rubro.codigo == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese el Codigo');

    }else if(this.rubro.nombre == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese el nombre del rubro');

    }else if(this.rubro.cuentaInvDeb == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta de Inversion Debe');

    }/* else if(this.rubro.cuentaCorrDeb == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta Corriente Debe');

    } else if(this.rubro.cuentaProdDeb == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta Producción Debe');

    }*/
    else if(this.rubro.cuentaInvHab == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta Inversion Haber');

    }/* else if(this.rubro.cuentaCorrHab == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta Corriente Haber');

    } else if(this.rubro.cuentaProdHab == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta Producción Haber');

    }*/
    else if(this.rubro.cuentaPresupuestoInvDeb == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta presupuesto de Inversion Debe');

    }/* else if(this.rubro.cuentaPresupuestoCorrDeb == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta presupuesto Corriente Debe');

    } else if(this.rubro.cuentaPresupuestoProdDeb == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta presupuesto de Producción Debe');

    }*/else if(this.rubro.alSueldo == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese % al sueldo');

    }else if(this.rubro.alIngreso == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese % al ingreso');

    }else if(this.rubro.losep == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese % ingreso LOSEP');

    }else if(this.rubro.aportable == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja Aportable');

    }else if(this.rubro.diferencia_por_region == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Seleccion diferenciable por región');
    }


    else if(this.rubro.tipoRubro == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja tipo rubro');

    } else if(this.rubro.codigoTipoPago == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja tipo pago');

    }
    else if(this.rubro.automatico == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja automatico');

    }else if(this.rubro.estado == null){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja el estado');

    }else{
      if(valor == 'SAVE'){
        this.guardarRubro();
      }else if(valor == 'UPDATE'){
        this.actualizarRubro();
      }
    }
  }


  guardarRubro(){

    this.service.setRubros(this.rubro).subscribe(
      (res)=>{
        this.toastr.success('Se Guardo con éxito');
        this.lcargando.ctlSpinner(false);
        this.closeModal();
        this.commonVarSrv.modalCargarRubros.next(null)
      }
    )
  }

limpiarCDebe(){
  if (this.rubro.tipoRubro == 9){


  console.log("limpiando")
  this.rubro.cuentaInvDeb ='';
  this.rubro.numcInvDeb=''; }
}
  actualizarRubro(){

    this.service.updateRubros(this.rubro).subscribe(
      (res)=>{
        this.toastr.success('Se Actualizo con éxito');
        this.lcargando.ctlSpinner(false);
        this.closeModal();
        this.commonVarSrv.modalCargarRubros.next(null)
      }
    )
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
