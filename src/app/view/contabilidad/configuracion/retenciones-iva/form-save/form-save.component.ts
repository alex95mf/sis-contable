import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { RetencionesIvaService } from '../retenciones-iva.service';
import { ModalCuentPreComponent } from 'src/app/view/rrhh/configuracion/rubros/modal-cuent-pre/modal-cuent-pre.component';

@Component({
standalone: false,
  selector: 'app-form-save',
  templateUrl: './form-save.component.html',
  styleUrls: ['./form-save.component.scss']
})
export class FormSaveComponent implements OnInit {

  msgSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() isNew: any;
  @Input() data: any;

  vmButtons: any;

  retencion = {
    id: 0,
    descripcion: '',
    porcentaje: 0,
    codigo_sri: 0,
    num_cuenta1: '',
    desc_cuenta1: '',
  }

  estado = []

  constructor(
    private modal: NgbActiveModal,
    private service: RetencionesIvaService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService,
  ) {
    this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res)=>{
        console.log(res);
        if( res.validacion == '1'){
          this.retencion.num_cuenta1 = res.data.codigo
          this.retencion.desc_cuenta1 = res.data.descripcion_original
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
        this.retencion.id = this.data.id;
        this.retencion.descripcion = this.data.descripcion_tipo_servicio;
        this.retencion.porcentaje = this.data.porcentaje_rte_iva;
        this.retencion.codigo_sri = this.data.codigo_sri_iva;
        this.retencion.num_cuenta1 = this.data.codigo;
        this.retencion.desc_cuenta1 = this.data.cuenta_1?.descripcion_original;

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
    this.lcargando.ctlSpinner(true)
    if(this.retencion.descripcion == undefined || this.retencion.descripcion == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese una descripción');

    }else if(this.retencion.porcentaje < 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('El porcentaje no puede ser menor a cero');

    }else if(this.retencion.codigo_sri <= 0){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('El código no puede ser menor o igual a cero');

    }else if(this.retencion.num_cuenta1 == undefined || this.retencion.num_cuenta1 == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Escoja la cuenta 1');

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
  //   this.lcargando.ctlSpinner(true)
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
