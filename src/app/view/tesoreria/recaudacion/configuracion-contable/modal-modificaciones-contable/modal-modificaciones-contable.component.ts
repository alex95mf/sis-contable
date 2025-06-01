import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionContableService } from '../configuracion-contable.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ModalCuentPreComponent } from '../modal-cuent-pre/modal-cuent-pre.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { EncargadoTrasladoComponent } from 'src/app/view/gestion-bienes/movimientos/traslado/encargado-traslado/encargado-traslado.component';

@Component({
standalone: false,
  selector: 'app-modal-modificaciones-contable',
  templateUrl: './modal-modificaciones-contable.component.html',
  styleUrls: ['./modal-modificaciones-contable.component.scss']
})
export class ModalModificacionesContableComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static:false}) lcargando: CcSpinerProcesarComponent;
  @Input() new: any;
  @Input() dato: any;
  mensajeSppiner: string = "Cargando...";
  fTitle: any;

  vmButtons: any;


  tipo_pago: boolean = true

  tipoPagos: any[] = [];
  lst_forma_pago: any[] = [];

  lbl_formapago: string = 'Forma de Pago';

  formaPagos: any[] = [];
  metodoPagos: any[] = [];
  tipoDesembolso: any[] = [];

  data = {
    id_configuracion_contable: 0,
    submodulo: null,
    modulo: '',
    forma_pago: 0,
    descripcion: '',
    cuenta_deudora: '',
    cuenta_acreedora: '',
    codigo_presupuesto: '',
    empleado: '',
    id_recibido: 0,
    estado: 'A'

  }



  estados = [
    {valor: 'A', descripcion: 'Activo'},
    {valor: 'C', descripcion: 'Inactivo'}
  ]

  descripcion_deudora:any;
  descripcion_acreedora: any;
  descripcion_presupuesto : any;

  tipo_pagoVal: boolean = false;  // Controla el input del Encargado

  constructor(
    private modal: NgbActiveModal,
    private service: ConfiguracionContableService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService
  ) {
    this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res)=>{
        console.log(res);
        if( res.validacion == 'Deudora'){
          this.data.cuenta_deudora = res.data.codigo
          this.descripcion_deudora = res.data.descripcion_original
        }else if(res.validacion == 'Acreedora'){
          this.data.cuenta_acreedora = res.data.codigo
          this.descripcion_acreedora = res.data.descripcion_original
        }else if(res.validacion == 'Presupuestario'){
          this.data.codigo_presupuesto = res.data.codigo
          this.descripcion_presupuesto = res.data.descripcion_general
        }

      }
    )

    this.commonVarSrv.encargadoSelect.asObservable().subscribe(
      (res)=>{
        if(res['tipo']==1){
          this.data.empleado = res['recibido']['emp_full_nombre'];
          this.data.id_recibido = res['recibido']['id_empleado'];
          // this.prestamo.id_recibido= res['recibido']['id_empleado'];
          // this.prestamo.recibido = res['recibido']['emp_full_nombre'];
          // this.prestamo.nombre_departamento_recibido = res['recibido']['departamento']['dep_nombre'];
          // this.prestamo.nombre_cargo_recibido = res['recibido']['cargos']['car_nombre'];
        }
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "fas fa-edit", texto: "EDITAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "CERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]

    if(this.new){
      this.vmButtons[1].showimg = false
      this.fTitle = 'Nueva configuracion contable'

    }else{
      this.vmButtons[0].showimg = false;
      this.fTitle = 'Edicion de configuracion contable';

      this.data.id_configuracion_contable = this.dato.id_configuracion_contable
      this.data.descripcion = this.dato.descripcion;
      this.data.forma_pago = this.dato.forma_pago;
      this.data.cuenta_deudora = this.dato.cuenta_deudora.codigo
      this.data.cuenta_acreedora = this.dato.cuenta_acreedora?.codigo
      this.data.codigo_presupuesto = this.dato.codigo_presupuesto?.codigo
      this.data.estado = this.dato.estado

      this.descripcion_deudora = this.dato.cuenta_deudora.descripcion_original;
      this.descripcion_acreedora =  this.dato.cuenta_acreedora?.descripcion_original;
      this.descripcion_presupuesto =  this.dato.codigo_presupuesto?.descripcion_general;
      this.data.submodulo = this.dato.submodulo
    }

    setTimeout(() => {
      this.getCatalogos()
    }, 0);
  }


  metodoGlobal(event){
    switch(event.items.boton.texto){
      case 'GUARDAR':
        this.validacion();
        break;
      case 'EDITAR':
        this.validacion();
        break;
      case 'CERRAR':
        this.modal.close();
        break;

    }
  }


  validacion(){
    if(this.data.descripcion == ''){
      this.toastr.info('EL campo descripcion debe ser llenado');
    }else if(this.data.forma_pago == 0){
      this.toastr.info('EL campo Forma de pago debe ser llenado');
    }else if(this.data.cuenta_deudora == ''){
      this.toastr.info('EL campo cuenta deudora debe ser llenado');
    }else if(this.data.submodulo != 'PAG_TIPO_DESEMBOLSO' && this.data.cuenta_acreedora == ''){
      this.toastr.info('EL campo cuenta acredora debe ser llenado');
    }else if(this.data.submodulo != 'PAG_TIPO_DESEMBOLSO' && this.data.codigo_presupuesto == ''){
      this.toastr.info('EL campo codigo presupuesto debe ser llenado');
    }else {
      if(this.new){
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea crear una configuracion contable?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        }).then((result) => {
          if (result.isConfirmed) {
            this.guardarNuevo();
          }
        });

      }else{
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea actualizar una configuracion contable?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        }).then((result) => {
          if (result.isConfirmed) {
            this.updateContable();
          }
        });

      }
    }
  }


  getCatalogos() {
    this.mensajeSppiner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REC_FORMA_PAGO','REC_TIPO_PAGO','REC_METODO_PAGO','PAG_TIPO_DESEMBOLSO'",
    }

    this.service.getCatalogos(data).subscribe(
      (res: any) => {
        console.log(res);
        this.tipoPagos = res.data['REC_TIPO_PAGO']

        this.tipoDesembolso = res.data['PAG_TIPO_DESEMBOLSO']
        this.formaPagos = res.data['REC_FORMA_PAGO']
        this.metodoPagos = res.data['REC_METODO_PAGO']

        if (!this.new) {
          this.changeTipoPago(this.data.submodulo)
        }

        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error cargando Catalogos')
      }
    )
  }

  changeTipoPago(evento){
    console.log(evento);
    // this.data.forma_pago = 0
    if(evento == 'REC_METODO_PAGO'){
      this.tipo_pago = false
      this.tipo_pagoVal = true
      this.lst_forma_pago = this.metodoPagos
      this.lbl_formapago = 'Forma de Pago'
    }else if (evento == 'REC_FORMA_PAGO'){
      this.tipo_pagoVal = false
      this.tipo_pago = true
      this.lst_forma_pago = this.formaPagos
      this.lbl_formapago = 'Forma de Pago'
    } else if (evento == 'PAG_TIPO_DESEMBOLSO') {
      this.tipo_pagoVal = false
      this.lst_forma_pago = this.tipoDesembolso
      this.lbl_formapago = 'Tipo de Desembolso'
    }

  }

  guardarNuevo(){
    this.lcargando.ctlSpinner(true)
    this.mensajeSppiner = 'Almacenando Configuracion Contable'
    this.service.postConfiguracionContable(this.data).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false)

        this.commonVarSrv.modalConfiguracionContable.next(null)
        this.modal.close()
      }
    )
  }

  updateContable(){
    this.lcargando.ctlSpinner(true)
    this.mensajeSppiner = 'Actualizando Configuracion Contable'
    this.service.updateConfiguracionContable(this.data).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false)

        this.commonVarSrv.modalConfiguracionContable.next(null)
        this.modal.close()
      }
    )
  }

  modalEncargado(data: any){
    let modal = this.modalDet.open(EncargadoTrasladoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.tipo = data;
  }


  modalCodigoPresupuesto(){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = 'Presupuestario';
  }

  modalCuentaContable(valor){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = valor;

  }

}
