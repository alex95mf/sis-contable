import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { RetencionesFuenteService } from '../retenciones-fuente.service';
import { ModalCuentPreComponent } from 'src/app/view/rrhh/configuracion/rubros/modal-cuent-pre/modal-cuent-pre.component';

@Component({
standalone: false,
  selector: 'app-form-save',
  templateUrl: './form-save.component.html',
  styleUrls: ['./form-save.component.scss']
})
export class FormSaveComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() isNew: any;
  @Input() data: any;

  vmButtons: any;

  retencion = {
    id_reten_fuente: 0,
    descripcion: '',
    porcentaje: 0,
    codigo_fuente: 0,
    codigo_anexo: 0,
    codigo_concepto: 0,
    codigo_valor_retenido: 0,
    codigo_concepto_retenido: 0,
    formulario: 0,
    cuenta: '',
    desc_cuenta: '',
    cuenta_corriente: '',
    desc_cuenta_corriente: '',
    cuenta_produccion: '',
    desc_cuenta_produccion:'',
  }

  estado = [];
  formulario = [
    {
      valor: 'S',
      label: 'SI'
    },{
      valor: 'N',
      label: 'NO'
    },
  ]

  constructor(
    private modal: NgbActiveModal,
    private service: RetencionesFuenteService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService,
  ) {
    this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res)=>{
        console.log(res);
        if( res.validacion == '1'){
          this.retencion.cuenta = res.data.codigo
          this.retencion.desc_cuenta = res.data.descripcion_original
        }else if( res.validacion == '2'){
          this.retencion.cuenta_corriente = res.data.codigo
          this.retencion.desc_cuenta_corriente = res.data.descripcion_original
        }else if( res.validacion == '3'){
          this.retencion.cuenta_produccion = res.data.codigo
          this.retencion.desc_cuenta_produccion = res.data.descripcion_original
        }
      }
    )
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnRetForm",
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
        orig: "btnRetForm",
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
        orig: "btnRetForm",
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
      // this.getCatalogo();
      if(!this.isNew){
        this.retencion.id_reten_fuente = this.data.id_reten_fuente;
        this.retencion.descripcion = this.data.descripcion;
        this.retencion.porcentaje = this.data.porcentaje_fte;
        this.retencion.codigo_fuente = this.data.codigo_fte_sri;
        this.retencion.codigo_anexo = this.data.codigo_anexo_sri;
        this.retencion.codigo_concepto = this.data.codigo_concepto_103;
        this.retencion.codigo_valor_retenido = this.data.codigo_valor_retenido_103;
        this.retencion.codigo_concepto_retenido = this.data.codigo_concepto_retenido_103;
        this.retencion.formulario = this.data.formulario_103;
        this.retencion.cuenta = this.data.cuenta;
        this.retencion.desc_cuenta = this.data.cuenta_1?.descripcion_original;
        this.retencion.cuenta_corriente = this.data.cuenta_contable_corriente;
        this.retencion.desc_cuenta_corriente = this.data.cuenta_corriente?.descripcion_original;
        this.retencion.cuenta_produccion = this.data.cuenta_contable_produccion;
        this.retencion.desc_cuenta_produccion = this.data.cuenta_produccion?.descripcion_original;

        this.vmButtons[0].showimg = false
      }else{

        this.vmButtons[0].showimg = true
        this.vmButtons[1].showimg = false
      }
   } , 50);
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

  validacion(valor){
    this.lcargando.ctlSpinner(true);
    if(this.retencion.descripcion == undefined || this.retencion.descripcion == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese una descripción');

    }else if(this.retencion.porcentaje < 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('El porcentaje no puede ser menor a cero');

    }else if(this.retencion.codigo_fuente <= 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('El código fuente no puede ser menor o igual a cero');

    }else if(this.retencion.codigo_anexo <= 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('El código anexo no puede ser menor o igual a cero');

    }else if(this.retencion.codigo_concepto <= 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('El código concepto no puede ser menor o igual a cero');

    }else if(this.retencion.codigo_valor_retenido <= 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('El código valor retenido no puede ser menor o igual a cero');

    }else if(this.retencion.codigo_concepto_retenido <= 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('El código concepto retenido no puede ser menor o igual a cero');

    }else if(this.retencion.cuenta == undefined || this.retencion.cuenta == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta principal');

    }else if(this.retencion.cuenta_corriente == undefined || this.retencion.cuenta_corriente == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta corriente');

    }else if(this.retencion.cuenta_produccion == undefined || this.retencion.cuenta_produccion == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta produccion');

    }else if(this.retencion.formulario == undefined || this.retencion.formulario == 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja si tiene o no formulario');

    }else{
      if(valor == 'SAVE'){
        this.guardarRetencion();
      }else if(valor == 'UPDATE'){
        this.actualizarRetencion();
      }
    }
  }

  guardarRetencion(){

    this.service.setRetencion(this.retencion).subscribe(
      (res)=>{
        this.toastr.success('Se Guardo con éxito');
        this.lcargando.ctlSpinner(false);
        this.closeModal();
        this.commonVarSrv.modalCargarRetIVA.next(null)
      }
    )
  }

  actualizarRetencion(){

    this.service.updateRetencion(this.retencion).subscribe(
      (res)=>{
        this.toastr.success('Se Actualizo con éxito');
        this.lcargando.ctlSpinner(false);
        this.closeModal();
        this.commonVarSrv.modalCargarRetIVA.next(null)
      }
    )
  }

  closeModal(){
    this.modal.close()
  }

  // getCatalogo(){
  //   this.lcargando.ctlSpinner(true);
  //   let paretnId = [7, 4, 1]
  //   this.service.getNomCatalogo(paretnId).subscribe(
  //     (res) =>{
  //       console.log(res);
  //       this.lcargando.ctlSpinner(false)
  //       res['data'].map(
  //         (e)=>{
  //           if(e['parent_id'] == 4){
  //             this.listadoNS.push(e);
  //           }else if(e['parent_id'] == 7){
  //             this.tipoRubro.push(e);
  //           }else if(e['parent_id'] == 1){
  //             this.estado.push(e);
  //           }
  //         }
  //       )
  //     }
  //   )
  // }

  modalCuentas(valor) {
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = valor;
  }
}
