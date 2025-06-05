import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ParametrosCuentasComprobantesService } from '../parametros-cuentas-comprobantes.service';
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

  parametro = {
    id_paranetro_cuenta: 0,
    codigo_comprobante: '',
    descripcion_comprobante: '',
    clase: '',
    codigo_cuenta: '',
    nombre_cuenta: '',
    evento: null,
    descripcion_evento: '',
    estado:'',
    num_cuenta1:'',
    desc_cuenta1:''
  }


  estado = []
  eventosContables: any = [];
  eventoObjetoSelected: any;
  eventoSelected: any;
  estadoList = [
    {value: "A",label: "Activo"},
    {value: "I",label: "Inactivo"},
  ]


  constructor(
    private modal: NgbActiveModal,
    private service: ParametrosCuentasComprobantesService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService,
  ) {
    this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res)=>{
        console.log(res);
        if( res.validacion == '1'){
          this.parametro.codigo_cuenta = res.data.codigo
          this.parametro.nombre_cuenta = res.data.nombre
          this.parametro.clase = res.data.clase
        }
      }
    )
    // this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
    //   (res)=>{
    //     console.log(res);
    //     if( res.validacion == '1'){
    //       this.retencion.cuenta = res.data.codigo
    //       this.retencion.desc_cuenta = res.data.descripcion_original
    //     }else if( res.validacion == '2'){
    //       this.retencion.cuenta_corriente = res.data.codigo
    //       this.retencion.desc_cuenta_corriente = res.data.descripcion_original
    //     }else if( res.validacion == '3'){
    //       this.retencion.cuenta_produccion = res.data.codigo
    //       this.retencion.desc_cuenta_produccion = res.data.descripcion_original
    //     }
    //   }
    // )
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


      this.getEventosContables()
      if(!this.isNew){
        console.log(this.data)
        this.parametro.id_paranetro_cuenta = this.data.paranetros_id;
        this.parametro.codigo_comprobante = this.data.codigo_comprobante;
        this.parametro.descripcion_comprobante = this.data.descripcion_comprobante;
        this.parametro.clase = this.data.clase;
        this.parametro.codigo_cuenta = this.data.codigo_cuenta;
        this.parametro.nombre_cuenta = this.data.nombre_cuenta;
        this.parametro.evento = this.data.evento;
        this.parametro.descripcion_evento = this.data.descripcion_evento;
        this.parametro.estado = this.data.estado;
        this.eventoSelected= Number(this.data.evento);
        // this.parametro.num_cuenta1 = this.data.codigo;
        // this.parametro.desc_cuenta1 = this.data.cuenta_1?.descripcion_original;
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
    if(this.parametro.codigo_comprobante == undefined || this.parametro.codigo_comprobante == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese una código');

    }else if(this.parametro.descripcion_comprobante == undefined || this.parametro.descripcion_comprobante == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese una descripción');

    }else if(this.parametro.clase == undefined || this.parametro.clase == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese una clase');

    }else if(this.parametro.codigo_cuenta == undefined || this.parametro.codigo_cuenta == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese una codigo de cuenta');

    }else if(this.parametro.nombre_cuenta == undefined || this.parametro.nombre_cuenta == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese una nombre de cuenta');

    }
    else if(this.parametro.evento == undefined || this.parametro.evento == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese un evento');

    }
    else if(this.parametro.evento == undefined || this.parametro.evento == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese un evento');

    }
    else if(this.parametro.estado == undefined || this.parametro.estado == ''){
      this.lcargando.ctlSpinner(false)
      return this.toastr.info('Ingrese un evento');

    }
    else{
      if(valor == 'SAVE'){
        this.guardarParametros();
      }else if(valor == 'UPDATE'){
        this.actualizarParametros();
      }
    }
  }

  // guardarParametros(){

  //   this.service.setParametros(this.parametro).subscribe(
  //     (res)=>{
  //       this.toastr.success('Se Guardo con éxito');
  //       this.lcargando.ctlSpinner(false);
  //       this.closeModal();
  //       this.commonVarSrv.modalCargarRetIVA.next(null)
  //     }
  //   )
  // }

  guardarParametros() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar los parametros contables?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {
              (this as any).mensajeSpinner = "Guardando parametros...";
              this.lcargando.ctlSpinner(true);

              this.service.setParametros(this.parametro).subscribe(
                  (res) => {
                     // console.log(res);
                      if (res["status"] == 1) {

                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "success",
                          title: "Parametros contables guardados con éxito",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      }).then((result) => {
                        if (result.isConfirmed) {
                         // this.uploadFile();

                          this.closeModal();
                          //this.commonVarSrv.modalCargarRetIVA.next(null)
                          this.service.listaParametros$.emit()
                        }
                      });
                      } else {
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      });
                      }
                  },
                      (error) => {
                          this.lcargando.ctlSpinner(false);
                          this.toastr.info(error.error.message);
                  }
              )
        }
    });
  }


  actualizarParametros(){
    (this as any).mensajeSpinner = "Actualizando parametros...";
    this.lcargando.ctlSpinner(true);
    this.service.updateParametros(this.parametro).subscribe(
      (res)=>{
        this.toastr.success('Se Actualizo con éxito');
        this.lcargando.ctlSpinner(false);
        this.closeModal();
        //this.commonVarSrv.modalCargarRetIVA.next(null)
        this.service.listaParametros$.emit()
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
  getEventosContables(){
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.service.getEventosContables().subscribe((result: any) => {
      console.log(result);

      if(result.data.length > 0){
        this.eventosContables=result.data;
        this.lcargando.ctlSpinner(false);
      }else {
        this.eventosContables=[];
        //this.toastr.info('No hay registros de dias trabajados para este periodo y mes');
        this.lcargando.ctlSpinner(false);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  handleEventoSelected(event) {
    console.log(event)
   // if (event == undefined) return;
   this.parametro.evento = event.id_evento
   this.parametro.descripcion_evento = event.descripcion_evento

    this.eventoObjetoSelected = event;
  }

}
