import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ConceptosService } from '../conceptos.service';

import { ModalCuentPreComponent } from '../modal-cuent-pre/modal-cuent-pre.component';
import Swal from 'sweetalert2';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';
import * as myVarGlobals from 'src/app/global';
import { Socket } from '../../../../../services/socket.service';

@Component({
standalone: false,
  selector: 'app-concepto-form',
  templateUrl: './concepto-form.component.html',
  styleUrls: ['./concepto-form.component.scss']
})
export class ConceptoFormComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  dataUser: any;

  searching: any = {
    deudora: false,
    acreedora: false,
    presupuesto: false
  }
  
  cuentas: any = {
    deudora: [],
    acreedora: [],
    presupuesto: []
  }

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;

  vmButtons: any;

  concepto: any;
  anexo: any;
  fileList: FileList;

  tarifasList: any = [];
  tipoCalculosList: any = [];

  needRefresh: boolean = false;
  hayTarifas: boolean = false;

  descripcion_deudora: any;
  descripcion_acreedora: any;
  descripcion_presupuesto: any;

  lst_restricciones: Array<string> = [];

  estadoList = [
    { value: "A", label: "Activo" },
    { value: "I", label: "Inactivo" },
  ]

  tieneTarifaList = [
    { value: true, label: "Si" },
    { value: false, label: "No" },
  ]

  tieneExoneracion = [
    { value: 'S', label: "Si" },
    { value: 'N', label: "No" },
  ]

  tieneSta = [
    { value: 'S', label: "Si" },
    { value: 'N', label: "No" },
  ]

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private conceptosSrv: ConceptosService,
    private commonVarSrv: CommonVarService,
    private modalDet: NgbModal,
    private confirmationDialogService: ConfirmationDialogService,
    private socket: Socket,
  ) {
    this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
      async (res: any)=>{
        console.log(res);
        if( res.validacion == 'Deudora'){
          this.concepto.cuenta_deudora = res.data.codigo
          this.descripcion_deudora = res.data.descripcion_original
       
          // Obtener Regla que aplica
          /* this.lcargando.ctlSpinner(true);
          try {
            (this as any).mensajeSpinner = 'Cargando Regla ESIGEF'
            let restricciones = await this.conceptosSrv.getRegla({cuenta: res.data})
            this.lcargando.ctlSpinner(false)

            if (!restricciones.length) {
              Swal.fire('La cuenta seleccionada no tiene una regla ESIGEF.', '', 'info');
              return;
            }
            this.lst_restricciones = restricciones;
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error cargando Regla ESIGEF')
          } */
        }else if(res.validacion == 'Acreedora'){
          console.log(res);
          this.concepto.cuenta_acreedora = res.data.codigo
          this.descripcion_acreedora = res.data.descripcion_original
          
          this.concepto.codigo_presupuesto = 
          res.data.presupuesto != null ? res.data.presupuesto?.codigo : res.data.presupuesto_haber?.codigo//res.data.codigo_presupuesto
          this.descripcion_presupuesto =  res.data.presupuesto != null ? res.data.presupuesto?.nombre : res.data.presupuesto_haber?.nombre//res.data.presupuesto.descripcion_general

          // Validar si la cuenta seleccionada aplica Regla
        }else if(res.validacion == 'Presupuestario'){
          this.concepto.codigo_presupuesto = res.data.codigo
          this.descripcion_presupuesto = res.data.descripcion_general
          console.log("concepto",this.concepto);
        }
        
      }
    )

    this.vmButtons = [
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-check", texto: "VALIDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnConceptoForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.concepto = {
      codigo: "",
      nombre: "",
      cuenta_deudora: "",
      cuenta_acreedora: "",
      codigo_presupuesto: "",
      tiene_tarifa: -1,
      tipo_calculo: 0,
      id_tarifa: 0,
      estado: "A",
      tiene_exoneracion:"",
      tiene_sta:""
    }
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(() => this.cargaInicial(), 50);

  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Catalogos'
      let catalogos = await this.conceptosSrv.getCatalog({ params: "'REN_CONCEPTO_TIPO_CALCULO'" });
      this.tipoCalculosList = catalogos['REN_CONCEPTO_TIPO_CALCULO'];

      if (!this.isNew) {
        (this as any).mensajeSpinner = 'Cargando Tarifas'
        let tarifas = await this.conceptosSrv.getTarifasConcepto({ id_concepto: this.data.id_concepto });
        this.tarifasList = tarifas;
        this.hayTarifas = this.tarifasList.length > 0;

        (this as any).mensajeSpinner = 'Cargando Anexos'
        let anexo = await this.conceptosSrv.getAnexo({ concepto: this.data.id_concepto, component: this.module_comp })
        console.log(anexo)
        this.anexo = anexo

        this.concepto = {
          codigo: this.data.codigo,
          nombre: this.data.nombre,
          cuenta_deudora: this.data.cuenta_deudora,
          cuenta_acreedora: this.data.cuenta_acreedora,
          codigo_presupuesto: this.data.codigo_presupuesto,
          id_tarifa: this.data.id_tarifa,
          tiene_tarifa: this.data.tiene_tarifa == 1 ? true : false,
          tipo_calculo: this.data.tipo_calculo,
          estado: this.data.estado,          
          tiene_exoneracion:this.data.tiene_exoneracion,
          tiene_sta:this.data.tiene_sta
        }
        this.descripcion_deudora = this.data.cuenta_deudora_m.descripcion_original
        this.descripcion_acreedora =  this.data.cuenta_acreedora_m.descripcion_original
        this.descripcion_presupuesto =  this.data.codigo_presupuesto_m.descripcion_general
      }

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }

  /* fillTarifas() {
    (this as any).mensajeSpinner = "Cargando tarifas...";
    this.lcargando.ctlSpinner(true);
    console.log(this.data);
    let concepto = {
      id_concepto: this.data.id_concepto,
    }
    console.log(this.data.id_concepto)
    this.conceptosSrv.getTarifasBy(concepto).subscribe(
      (res) => {
        console.log(res);
        this.tarifasList = res['data'];
        if (this.tarifasList.length > 0) {
          this.hayTarifas = true;
        } else {
          this.hayTarifas = false;
        }
        // console.log(this.tarifasList);
        // this.getConceptoBy(this.id);
        this.concepto = {
          codigo: this.data.codigo,
          nombre: this.data.nombre,
          cuenta_deudora: this.data.cuenta_deudora,
          cuenta_acreedora: this.data.cuenta_acreedora,
          codigo_presupuesto: this.data.codigo_presupuesto,
          id_tarifa: this.data.id_tarifa,
          tiene_tarifa: this.data.tiene_tarifa == 1 ? true : false,
          tipo_calculo: this.data.tipo_calculo,
          estado: this.data.estado,          
          tiene_exoneracion:this.data.tiene_exoneracion,
          tiene_sta:this.data.tiene_sta
        }
        this.descripcion_deudora = this.data.cuenta_deudora_m.descripcion_original
        this.descripcion_acreedora =  this.data.cuenta_acreedora_m.descripcion_original
        this.descripcion_presupuesto =  this.data.codigo_presupuesto_m.descripcion_general
        console.log(this.concepto);
        //this.getCatalogs();
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  } */

  /* getCatalogs() {
    (this as any).mensajeSpinner = "Cargando conceptos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REN_CONCEPTO_TIPO_CALCULO'"
    }

    this.conceptosSrv.obtenerCatalogos(data).subscribe(
      (res) => {
        console.log(res);
        res['data']['REN_CONCEPTO_TIPO_CALCULO'].forEach(elem => {
          let tipoCalculo = {
            value: elem.descripcion,
            label: elem.valor
          }
          this.tipoCalculosList.push(tipoCalculo);
        })
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message);
      }
    )
  } */

  /* getConceptoBy(id) {
    (this as any).mensajeSpinner = "Obteniendo conceptos...";
    this.lcargando.ctlSpinner(true);
    this.conceptosSrv.getConceptoBy(id).subscribe(
      (res) => {
        // console.log(res);
        this.concepto = res['data'];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  } */

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "VALIDAR":
        this.validacionEsigef();
        break;
      case "GUARDAR":
        this.validaConcepto();
        break;
    }
  }

  async validacionEsigef() {
    // Validacion Local
    let msgInvalid = ''

    if (this.concepto.cuenta_deudora == "") msgInvalid += '* No ha seleccionado una Cuenta Deudora.<br>';
    if (this.concepto.cuenta_acreedora == "") msgInvalid += '* No ha seleccionado una Cuenta Acreedora.<br>';
    if (this.concepto.codigo_presupuesto == "") msgInvalid += '* No ha seleccionado una Cuenta Presupuestaria.<br>';

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return;
    }
    this.lcargando.ctlSpinner(true);

    Swal.fire('Validacion ESIGEF','Regla Aplicada')
    this.vmButtons[1].habilitar = false
    this.lcargando.ctlSpinner(false)
    // Swal.fire('Validacion ESIGEF', `Regla ${response.data.numero_regla} aplicada: ${response.data.descripcion}`).then(() => {
    
    // })
    // try {
    //   (this as any).mensajeSpinner = 'Validacion ESIGEF'
    //   const response = await this.conceptosSrv.validarEsigef({concepto: this.concepto});
    //   console.log(response)
    //   this.lcargando.ctlSpinner(false)
    //   // TESTING
    //   /* let r = Math.floor(Math.random() * 100)
    //   console.log(r)
    //   setTimeout(() => {
    //     this.lcargando.ctlSpinner(false)
    //     if (r > 50) {
    //       Swal.fire('Configuracion correcta', '', 'success').then(() => {
    //         this.vmButtons[1].habilitar = false
    //       })
    //     } else {
    //       Swal.fire('Configuracion incorrecta', '', 'warning').then(() => {
    //         this.vmButtons[1].habilitar = true
    //       })
    //     }
    //   }, 250) */
    //   // End TESTING
    //   Swal.fire('Validacion ESIGEF', `Regla ${response.data.numero_regla} aplicada: ${response.data.descripcion}`).then(() => {
    //     this.vmButtons[1].habilitar = false
    //   })
    // } catch (err) {
    //   console.log(err)
    //   this.lcargando.ctlSpinner(false)
    //   this.toastr.warning(err.error?.message, 'Error en Validacion ESIGEF')
    // }
  }

  validaConcepto() {
    if (this.isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear nuevos Conceptos");

    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Conceptos.", this.fTitle);
    } else {
      this.validaDataGlobal().then(() => {
        
          if (this.isNew) {
            this.crearConcepto();
          } else {
            this.editConcepto();
          }
        
      }).catch((reason) => this.toastr.warning(reason, 'Validacion de Datos', {enableHtml: true}));

    }
  }

  validaDataGlobal() {
    return new Promise<void>((resolve, reject) => {
      let msgInvalid = ''
      if (
        this.concepto.codigo == "" ||
        this.concepto.codigo == undefined
      ) {
        msgInvalid += '* El campo Código no puede ser vacío<br>'
      } else if (
        this.concepto.codigo.length > 10
      ) {
        msgInvalid += '* El campo Código no puede tener una longitud mayor a 10<br>'
      } else if (
        this.concepto.nombre == "" ||
        this.concepto.nombre == undefined
      ) {
        msgInvalid += '* El campo Nombre no puede ser vacío<br>'
      } else if (
        this.concepto.cuenta_deudora == "" ||
        this.concepto.cuenta_deudora == undefined
      ) {
        msgInvalid += '* El campo Cuenta Deudora no puede ser vacío<br>'
      } else if (
        this.concepto.cuenta_deudora.length > 15
      ) {
        msgInvalid += '* El campo Cuenta Deudora no puede tener una longitud mayor a 15<br>'
      } else if (
        this.concepto.cuenta_acreedora == "" ||
        this.concepto.cuenta_acreedora == undefined
      ) {
        msgInvalid += '* El campo Cuenta Acreedora no puede ser vacío<br>'
      } else if (
        this.concepto.cuenta_acreedora.length > 15
      ) {
        msgInvalid += '* El campo Cuenta Acreedora no puede tener una longitud mayor a 15<br>'
      } else if (
        this.concepto.codigo_presupuesto == "" ||
        this.concepto.codigo_presupuesto == undefined
      ) {
        msgInvalid += '* El campo Código presupuesto no puede ser vacío<br>'
      } else if (
        this.concepto.codigo_presupuesto.length > 15
      ) {
        msgInvalid += '* El campo Código presupuesto no puede tener una longitud mayor a 15<br>'
      } else if (
        this.concepto.tiene_tarifa == -1 ||
        this.concepto.tiene_tarifa == undefined
      ) {
        msgInvalid += '* Debe indicar si tiene tarifa o no<br>'
      }else if (
        this.concepto.tiene_exoneracion == "" ||
        this.concepto.tiene_exoneracion == null ||
        this.concepto.tiene_exoneracion == undefined
      ) {
        msgInvalid += '* Debe indicar si tiene exoneración o no<br>'
      } else if (
        this.concepto.tiene_sta == "" ||
        this.concepto.tiene_sta == null ||
        this.concepto.tiene_sta == undefined
      ) {
        msgInvalid += '* Debe indicar si tiene STA o no<br>'
      } 
      else if (
        this.concepto.tipo_calculo == 0 ||
        this.concepto.tipo_calculo == undefined
      ) {
        msgInvalid += '* Debe seleccionar un tipo de cálculo<br>'
      } else if (
        this.concepto.estado == 0 ||
        this.concepto.estado == undefined
      ) {
        msgInvalid += '* Debe seleccionar un estado<br>'
      }

      msgInvalid.length == 0 ? resolve() : reject(msgInvalid);
    })
  }

  crearConcepto() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo concepto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = "Guardando concepto...";
        this.lcargando.ctlSpinner(true);

        const usersFilter = this.commonSrv.filterUserNotification(1, 40)
        let data = {
          concepto: {
            codigo: this.concepto.codigo,
            nombre: this.concepto.nombre,
            cuenta_deudora: this.concepto.cuenta_deudora,
            cuenta_acreedora: this.concepto.cuenta_acreedora,
            codigo_presupuesto: this.concepto.codigo_presupuesto,
            tiene_tarifa: this.concepto.tiene_tarifa,
            tipo_calculo: this.concepto.tipo_calculo,
            id_tarifa: 0,
            estado: this.concepto.estado,
            tiene_exoneracion:this.concepto.tiene_exoneracion,
            tiene_sta:this.concepto.tiene_sta,
          },
          //ip: this.commonSrv.getIpAddress(),
          accion:`Concepto creado por ${this.dataUser['usuario']}`,
          id_controlador: this.module_comp,
          usersFilter
        }

        this.conceptosSrv.createConcepto(data).subscribe(
          async (res: any) => {
            console.log(res);

            //return;
            console.log(usersFilter)
            this.socket.onEmitNotification(usersFilter)

            // Si se guardo el concepto, usar el ID para guardar la resolucion, de existir
            if (this.fileList?.length > 0) {
              try {
                let dataAnexo = {
                  // Informacion para almacenamiento de anexo y bitacora
                  module: this.permissions.id_modulo,
                  component: this.module_comp,  // TODO: Actualizar cuando formulario ya tenga un ID
                  identifier: res.data.id_concepto,
                  id_controlador: this.module_comp,  // TODO: Actualizar cuando formulario ya tenga un ID
                  accion: `Nuevo anexo para Concepto ${this.data.id_concepto}`,
                  ip: this.commonSrv.getIpAddress()
                }
      
                let response = await this.conceptosSrv.fileService(this.fileList[0], dataAnexo);
                console.log(response)
              } catch (err) {
                console.log(err)
                this.toastr.warning(err.error?.message)
              }
            }

            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire('Concepto Creado', res['message'], 'success').then(() => this.closeModal())
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire('Error', res['message'], 'error')
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

  editConcepto() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este Concepto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = "Guardando concepto..."
        this.lcargando.ctlSpinner(true);

        let data = {
          concepto: {
            codigo: this.concepto.codigo,
            nombre: this.concepto.nombre,
            cuenta_deudora: this.concepto.cuenta_deudora,
            cuenta_acreedora: this.concepto.cuenta_acreedora,
            codigo_presupuesto: this.concepto.codigo_presupuesto,
            tiene_tarifa: this.concepto.tiene_tarifa,
            tipo_calculo: this.concepto.tipo_calculo,
            id_tarifa: this.concepto.id_tarifa != 0 ? this.concepto.id_tarifa : 0,
            estado: this.concepto.estado,
            tiene_exoneracion:this.concepto.tiene_exoneracion,
            tiene_sta:this.concepto.tiene_sta
          }
        }
        console.log(data);

        this.conceptosSrv.editConcepto(this.data.id_concepto, data).subscribe(
          async (res) => {
            console.log(res)
            if (this.fileList?.length > 0) {
              try {
                (this as any).mensajeSpinner = 'Almacenando Resolucion'
                let dataAnexo = {
                  // Informacion para almacenamiento de anexo y bitacora
                  module: this.permissions.id_modulo,
                  component: this.module_comp,  // TODO: Actualizar cuando formulario ya tenga un ID
                  identifier: this.data.id_concepto,
                  id_controlador: this.module_comp,  // TODO: Actualizar cuando formulario ya tenga un ID
                  accion: `Nuevo anexo para Concepto ${this.data.id_concepto}`,
                  ip: this.commonSrv.getIpAddress()
                }
                let response = await this.conceptosSrv.fileService(this.fileList[0], dataAnexo)
                console.log(response)
              } catch (err) {
                console.log(err)
                this.toastr.warning(err.error?.message)
              }
            }

            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire('Concepto Actualizado', res['message'], 'success').then(() => this.closeModal())
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire('Error', res['message'], 'error')
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error?.message);
          }
        )
      }
    });
  }

  closeModal() {
    this.commonVarSrv.editConcepto.next(this.needRefresh);
    this.activeModal.dismiss();
  }


  modalCodigoPresupuesto(){
    this.vmButtons[1].habilitar = true
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = 'Presupuestario';
  }

  modalCuentaContable(tipoCuenta: string){
    this.vmButtons[1].habilitar = true
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
    })
  modal.componentInstance.tieneReglas = false;
    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = tipoCuenta;
    modal.componentInstance.restricciones = (tipoCuenta == 'Acreedora') ? this.lst_restricciones : [];
    
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
    modal.componentInstance.filtrar = this.concepto.codigo_presupuesto;
  }

  cargaResolucionConcepto(archivos: FileList) {
    if (archivos.length > 0) {
      this.fileList = archivos
      document.querySelector('#lbl_anexo').innerHTML = archivos[0].name
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Concepto')
      }, 50)
      // console.log(this.fileList)
    }
  }

  dlResolucion(anexo: any) {
    let data = {
      storage: anexo.storage,
      name: anexo.name
    }

    this.conceptosSrv.downloadAnexo(data).subscribe(
      (resultado) => {
        const url = URL.createObjectURL(resultado)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', anexo.original_name)
        link.click()
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  viewResolucion(anexo: any) {
    let data = {
      storage: anexo.storage,
      name: anexo.name
    }

    this.conceptosSrv.downloadAnexo(data).subscribe(
      (resultado) => {
        const dialogRef = this.confirmationDialogService.openDialogMat(VistaArchivoComponent, {
          width: '1000px', height: 'auto',
          data: {
            titulo: 'Vista de archivo',
            dataUser: this.dataUser,
            objectUrl: URL.createObjectURL(resultado),
            tipoArchivo: anexo.original_type
          }
        })
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  async deleteAnexo(anexo: any) {
    let result = await Swal.fire({
      title: 'Eliminar Resolucion',
      text: 'Seguro/a desea eliminar la Resolucion para este Concepto?',
      icon: 'question',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      let data = {
        // Data del archivo
        id_anexo: anexo.id_anexos,
        component: myVarGlobals.fConcepto,
        module: this.permissions.id_modulo,
        identifier: this.data.id_concepto,
        // Datos para registro en Bitacora
        // cambiar con el que haga despues para rentas
        id_controlador: myVarGlobals.fConcepto,  // TODO: Actualizar cuando formulario ya tenga un ID
        accion: `Borrado de Anexo ${anexo.id_anexos}`,
        ip: this.commonSrv.getIpAddress()
      };

      (this as any).mensajeSpinner = 'Eliminando Resolucion'
      this.lcargando.ctlSpinner(true);
      this.conceptosSrv.deleteAnexo(data).subscribe(
        res => {
          this.lcargando.ctlSpinner(false)
          this.anexo = null
          Swal.fire('Resolucion eliminada correctamente', '', 'success')
        },
        err => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error eliminando Resolucion')
        }
      )
    }
  }

}
