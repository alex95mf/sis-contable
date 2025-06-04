import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { TramitesService } from '../../tramites.service';
import * as myVarGlobals from "../../../../../global";

@Component({
standalone: false,
  selector: 'app-modal-reg-contribuyente',
  templateUrl: './modal-reg-contribuyente.component.html',
  styleUrls: ['./modal-reg-contribuyente.component.scss']
})
export class ModalRegContribuyenteComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  vmButtons2:  any = [];
  dataUser: any;
  permissions: any;
  catalog: any = {};
  contribuyente: any = { id_cliente: null, tipo_documento: 0, contribuyente: 0, primer_nombre: '', segundo_nombre: '', primer_apellido: '', segundo_apellido: '' };
  tamDoc: any = 0;
  actions: any = {
    new: false,
    search: false,
    add: true,
    edit: true,
    cancel: true,
    delete: true,
  };
  detalle_contactos: any = [];
  detalle_edit: any;
  paginate: any;
  filter: any;

  validaciones = new ValidacionesFactory;


  //Locales Comerciales
  locales: any[] = [];
  //Solares
  solares: any[] = [];
  //deudas
  deudas: any[] = [];
  //Total de deudas
  totalDeudas = 0;
  //Valor comercial
  valComercial: any[] = []
  //Contratos
  contratos: any = []
  //Novedades
  novedades: any = []
  //Detalles pagos
  documentosDt: any = [];

  regJuridico: boolean = false;
  regNatural: boolean = false;
  //Valor de los Checkbox
  conyugue: boolean = false;
  discapcidad: boolean;
  tutor: boolean;
  prestamo: boolean;
  perteneceTax: boolean;
  fileList: FileList
  //Variables para los acordeones
  contribuyenteSpecial: any = {};
  // Variables para maxlegth
  NOCedula: number = 0;
  //Obligado a llevar contabilidad
  estandarVariables = ["SI", "NO"];

  tipo_contribuyente: any;
  //Variables de validacion de tipo de contribuyente
  validadorNt: boolean = false;
  validadorJr: boolean = false;
  validadorNoDocumentoJr: boolean = true;
  validadorNoDocumentoNt: boolean = true;
  // Tipo de persona
  tipoPersona: any;
  //edad del contribuyente
  edadContribuyente: any;
  //No Documento
  NoDocumento: any
  //Tipo de documento
  tipoDocumento: any;
  //Validacion Busqueda Contribuyente
  validacionBusquedaContri: boolean = false
  //Validacion de cedula o ruc en persona natural
  validadorRucCedu: boolean;
  // Valor para el estado de ecuenta
  totalDeudasCheck = 0;
  // logo
  empresLogo: any
  //Anexos para Arriendo
  anexos = []
  selectAnexos = []
  // Convenios contribuyente
  convenios: any = []

  filterConvenio: any;
  paginateConvenio: any;

  //Objeto Formulario Contribuyente
  contribuyenteForm: any = {
    name: '',
    estado: '',
    tipo: '',
    telefono: '',
    direccion: '',
    provincia: '',
    canton: '',
    email: '',
    tipoID: '',
    cedula_pasp: '',
    ruc: '',
    obligadoCon: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    sexo: '',
    fechaNac: '',
    estadoCivil: '',
    nacionalidad: '',
    razonSocial: '',
    nombreComercial: '',
    tipoJuridico: '',
    contribuyenteSpecial: '',
  }



  constructor(
  
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private commonSrv: CommonService,
    private tramitesSrv: TramitesService,
    private commonVarSrv: CommonVarService,
    public activeModal: NgbActiveModal,
  ) {
    this.commonVrs.listencontribuyente.asObservable().subscribe((res) => {
      if (!res.edit) {
        this.detalle_contactos = [];
        this.detalle_contactos = res.arraycontact;
      } else {
        this.detalle_edit = res;
      }
    });

    // this.commonVrs.editContribuyente.asObservable().subscribe((res) => {
    //   this.vmButtons[1].habilitar = true;
    //   this.vmButtons[2].habilitar = false;
    //   this.contribuyente = res;
    // });

    this.commonVrs.selectContribuyenteCustom.asObservable().subscribe((res) => {
      if (res.valid == 1) {
        this.cancelFormWithout()
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
       


        this.validacionBusquedaContri = true
        this.contribuyente = res;
        this.actions.new = true;
        console.log(res);
        if (res.contribuyente == 'Natural') {
          console.log('Cambia a Natrual', this.validadorNt);
          this.validadorRucCedu = true;
          // if(res.tipo_documento == "Cedula" || res.tipo_documento == "Pasaporte"){
          //   this.validadorRucCedu = true;
          // }else {
          //   this.validadorRucCedu = false;
          // }
          this.validadorNt = true;
          this.validadorJr = false;
          this.validadorNoDocumentoNt = true;
          this.validadorNoDocumentoJr = false;
          this.NoDocumento = this.contribuyente['num_documento']
          console.log('Cambia valor Natrual', this.validadorNt);
          if (res.fecha_nacimiento != null) {
           // this.verificacionTerceraEdad(res.fecha_nacimiento);
          } else {
            this.toastr.info(
              "El contribuyente no tiene una fecha de nacimiento ingresada"
            );
          }

          console.log('Natural');
        } else if (res.contribuyente == 'Jurídico') {
          this.validadorJr = true;
          this.validadorNt = false;
          this.validadorNoDocumentoNt = false;
          this.validadorNoDocumentoJr = true;
          this.validadorRucCedu = true;
          this.NoDocumento = this.contribuyente['num_documento']
          console.log('Juridico');
        } else if (res.contribuyente == 'Juridico') {
          this.validadorJr = true;
          this.validadorNt = false;
          this.validadorNoDocumentoNt = false;
          this.validadorNoDocumentoJr = true;
          this.validadorRucCedu = true;
          this.NoDocumento = this.contribuyente['num_documento']
          console.log('Juridico');
        }

        
        this.commonVrs.contribAnexoLoad.next({ id_cliente: res.id_cliente, condi: 'all' })
        // console.log('Res Contribuyente',res);
        // console.log(this.permissions);
        this.commonVrs.searchDiscapContribu.next({ data: res, permissions: this.permissions })
        this.commonVrs.loadActivo.next({ id_cliente: res.id_cliente })

      }

      console.log('Final ', this.validadorNt);


    });
    // console.log(this.conyugue);
  }


  limpiar() {
    this.ClearForm();
    this.locales = [];
    this.totalDeudas = 0;
    this.solares = [];
    this.deudas = [];
    this.commonVrs.clearAnexos.next({})
  }



  ngOnInit(): void {
      this.vmButtons = [
      {
        orig: "btnsContribuyente",
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
        orig: "btnsContribuyente",
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
   

    this.filter = {
      contribuyente: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    this.filterConvenio = {
      contribuyente: undefined,
      filterControl: ""
    }

    this.paginateConvenio = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }



    setTimeout(() => {
      this.validatePermission();
      this.ActivateForm();

    }, 50);
  }

  

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa
    let params = {
      codigo: myVarGlobals.fContribuyente,
      id_rol: this.dataUser.id_rol,
    };

    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        // console.log(this.permissions);
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Clientes"
          );
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          setTimeout(() => {
            this.fillCatalog();
          }, 500);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  validacionContribu() {
    if(this.NoDocumento==undefined || this.NoDocumento==""){
      this.toastr.info('Debe ingresar un No Documento');
    }else{
      this.mensajeSpinner = "Cargando lista de Contribuyentes...";
    this.lcargando.ctlSpinner(true);
    if (!this.NoDocumento) {
      this.filter['num_documento'] = 'x'
    } else {
      this.filter['num_documento'] = this.NoDocumento

    }

    if (this.tipoPersona != undefined) {
      if (this.tipoDocumento == 'Cedula') {
        if (this.tipoPersona == "Natural") {
          console.log('Cedular Natural');
          this.contribuyente['cedula'] = this.NoDocumento
          this.contribuyente['ruc'] = null
          this.contribuyente['num_documento'] = this.NoDocumento
          this.validadorRucCedu = true;
          if (this.NoDocumento.length < 10) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Atención!!",
              text: "Ingrese 10 digitos para la cedula",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {

            });
          } else {
            this.buscarContribuyente()
          }

        }


      } else if (this.tipoDocumento == 'Ruc') {
        if (this.tipoPersona == "Natural") {
          this.contribuyente['ruc'] = this.NoDocumento
          this.contribuyente['cedula'] = null
          this.contribuyente['num_documento'] = this.NoDocumento
          this.validadorRucCedu = true;
          if (this.NoDocumento.length < 13) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Atención!!",
              text: "Ingrese 13 digitos para el Ruc",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {

            });
          } else {
            this.buscarContribuyente()
          }
        } else {
          this.contribuyente['num_documento'] = this.NoDocumento
          // this.contribuyente['num_documento'] = null
          this.validadorRucCedu = true;
          if (this.NoDocumento.length < 13) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Atención!!",
              text: "Ingrese 13 digitos para el Ruc",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {

            });
          } else {
            this.buscarContribuyente()
          }
        }

      } else if (this.tipoDocumento == 'Pasaporte') {
        this.contribuyente['ruc'] = null
        this.contribuyente['cedula'] = this.NoDocumento
        this.contribuyente['num_documento'] = this.NoDocumento
        this.validadorRucCedu = true;
        // this.contribuyente['num_documento'] = this.NoDocumento
        if (this.NoDocumento.length < 13) {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            title: "Atención!!",
            text: "Ingrese 18 digitos para el Pasaporte",
            icon: "warning",
            confirmButtonColor: "#d33",
            confirmButtonText: "Ok",
          }).then((result) => {

          });
        } else {
          this.buscarContribuyente()
        }

        //this.NOCedula = 18
      }
    } else {
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        title: "Atención!!",
        text: "Ingrese el tipo de contribuyente",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then((result) => {

      });
      // this.toastr.info('Ingrese el tipo de contribuyente');
    }
    }
    






  }

  buscarContribuyente() {
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
    console.log(this.tipoPersona);
    if (this.tipoPersona != undefined) {
      this.tramitesSrv.getContribuyentesByFilter(data).subscribe(
        (res) => {
          console.log(res["data"]);
          this.lcargando.ctlSpinner(false);
          if (res["data"]["data"].length == 0) {
            // this.toastr.info("El contribuyente no se encuentra registrado");
            Swal.fire({
              title: "Atención!!",
              text: "El contribuyente no se encuentra registrado",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {
      
            });
            this.validacionBusquedaContri = true
            if (this.tipoPersona === 'Natural') {
              this.validadorNt = true;
              this.validadorJr = false;
              this.validadorNoDocumentoNt = true;
              this.validadorNoDocumentoJr = false;
            } else if (this.tipoPersona == 'Jurídico') {
              this.validadorJr = true;
              this.validadorNt = false;
              this.validadorNoDocumentoNt = false;
              this.validadorNoDocumentoJr = true;
            }
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
          } else {
            Swal.fire({
              title: "Atención!!",
              text: "El contribuyente ya se encuentra registrado",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {
              this.closeModal();
            });
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
            // this.toastr.info('El contribuyente ya se encuentra registrado');

          }



        },
        (error) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
          this.toastr.info('El contribuyente no se encuentra registrado');
        }
      );
    } else {
      this.lcargando.ctlSpinner(false);
      this.toastr.info('Ingrese el tipo de contribuyente');
    }
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Cargando Catalogs";
    let data = {
      params: "'DOCUMENTO', 'PAIS', 'CIUDAD', 'PROVINCIA', 'GENERO','ESTADO CIVIL', 'REN_DISCAPACIDAD', 'REN_INSTITUCION_CREDITO', 'REN_TIPO_PERSONA_JURIDICA', 'REN_ESTADO_CONTRIBUYENTE', 'REN_ACTIVIDAD_AGROPECUARIA', 'CAT_ZONA','CAT_SECTOR'",
    };
    this.tramitesSrv.getCatalogs(data).subscribe(
      (res) => {
        // console.log(res);
        this.catalog.documents = res["data"]["DOCUMENTO"];
        this.catalog.ciudad = res["data"]["CIUDAD"];
        this.catalog.pais = res["data"]["PAIS"];
        this.catalog.provincia = res["data"]["PROVINCIA"];
        this.catalog.genero = res['data']['GENERO'];
        this.catalog.estado_civil = res['data']['ESTADO CIVIL'];
        this.catalog.ren_discapacidad = res['data']['REN_DISCAPACIDAD'];
        this.catalog.ren_institucion_credito = res['data']['REN_INSTITUCION_CREDITO'];
        this.catalog.tipo_persona_juridica = res['data']['REN_TIPO_PERSONA_JURIDICA'];
        this.catalog.estado = res['data']['REN_ESTADO_CONTRIBUYENTE'];
        this.catalog.ag_actividad = res['data']['REN_ACTIVIDAD_AGROPECUARIA'];
        this.catalog.zona = res['data']['CAT_ZONA'];
        this.catalog.sector = res['data']['CAT_SECTOR'];

        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

    this.tramitesSrv.getAgentRetencion({}).subscribe(res => {
      this.catalog.tipo_contribuyente = res['data']
    })


  }

  onlyNumber(event): boolean {
    // console.log(event);
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  

  /* OnChange */
  docValidate(event) {
    document.getElementById("num_documentoumento").focus();
    if (event == "Cedula") {
      this.tamDoc = 10;
    } else if (event == "Ruc") {
      this.tamDoc = 13;
    } else if (event == "Pasaporte") {
      this.tamDoc = 12;
    }
  }

  // metodoGlobal(event) {
  //   console.log(event);
  //   switch (event.items.boton.texto) {
  //     case "NUEVO":
  //       this.ActivateForm()
  //       break;
  //     case "GUARDAR":
  //       this.validateSaveContribuyente();
  //       break;
  //     case "CANCELAR":
  //       this.CancelForm();
  //       break;
   
  //   }
  // }
   metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validateSaveContribuyente();
        break;
    }
  }
  

  ActivateForm() {
    this.actions.new = true;
    this.actions.search = true;
    this.actions.add = false;
    this.actions.edit = true;
    this.actions.cancel = false;
    this.actions.delete = true;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
   

    // this.supplier.provincia = 0;
    // this.supplier.ciudad = 0

    // this.province = false;
    // this.city = false;

    this.commonServices.actionsClient.next(this.actions);
  }

  CancelForm() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea Cancelar.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if(result.isConfirmed){
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = false;
       

        this.commonVrs.clearContact.next(this.actions);
        this.ClearForm();
        this.locales = [];
        this.totalDeudas = 0;
        this.solares = [];
        this.deudas = [];
        this.contratos = []
        this.actions.new = false
        this.commonVrs.clearContribu.next({})
        this.validadorNt = false;
        this.validadorJr = false;
        this.validadorNoDocumentoNt = true
        this.validadorNoDocumentoJr = true
        this.validacionBusquedaContri = false
        this.NoDocumento = undefined
        this.edadContribuyente = undefined
        this.tipoPersona = undefined;
        this.novedades = []
      }

    });
    
  }

  cancelFormWithout(){
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
   
    this.commonVrs.clearContact.next(this.actions);
    this.ClearForm();
    this.locales = [];
    this.totalDeudas = 0;
    this.solares = [];
    this.deudas = [];
    this.contratos = []
    this.actions.new = false
    this.commonVrs.clearContribu.next({})
    this.validadorNt = false;
    this.validadorJr = false;
    this.validadorNoDocumentoNt = true
    this.validadorNoDocumentoJr = true
    this.validacionBusquedaContri = false
    this.NoDocumento = undefined
    this.edadContribuyente = undefined
    this.tipoPersona = undefined;
    this.novedades = []
  }

  ClearForm() {
    this.contribuyente = { id_cliente: null, tipo_documento: 0, primer_nombre: '', segundo_nombre: '', primer_apellido: '', segundo_apellido: '' };
    this.detalle_contactos = [];
    this.detalle_edit = undefined;
  }

  async validateSaveContribuyente() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar el contribuyente?",
            "SAVE_VENDEDOR"
          );
        }
      });
    }
  }

  async validateUpdateContribuyente() {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea editar la información del contribuyente?",
            "EDIT_VENDEDOR"
          );
        }
      });
    }
  }

  validacionTipoPerson(event) {
    this.tipoPersona = event

    if (event === 'Jurídico') {
      this.contribuyente.tipo_documento = "Ruc"
      this.tipoDocumento = "Ruc"
      this.NOCedula = 13;
      this.regJuridico = true;
      this.regNatural = false;
    }else{
      this.regJuridico = false;
      this.regNatural = true;
    }

    // if (event == 'Cedula') {
    //   this.NOCedula = 10;
    // } else if (event == 'Ruc') {
    //   this.NOCedula = 13;
    // } else if (event == 'Pasaporte') {
    //   this.NOCedula = 18
    // }

  }


  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (this.validadorNt) {
        if (this.contribuyente.tipo_documento == 0) {
          this.toastr.info("Seleccione un tipo de documneto");
          flag = true;
        } else if (
          this.NoDocumento == "" ||
          this.NoDocumento == undefined
        ) {
          this.toastr.info("Ingrese un número de documento");
          flag = true;
        } else if (
          this.contribuyente.direccion == "" ||
          this.contribuyente.direccion == undefined
        ) {
          this.toastr.info("Ingrese una dirección");
          flag = true;
        } else if (
          this.contribuyente.telefono == "" ||
          this.contribuyente.telefono == undefined
        ) {
          this.toastr.info("Ingrese teléfono");
          flag = true;
        } 
        // else if (
        //   this.contribuyente.provincia == "" ||
        //   this.contribuyente.provincia == undefined
        // ) {
        //   this.toastr.info("Ingrese una provincia");
        //   flag = true;
        // } 
        // else if (
        //   this.contribuyente.ciudad == "" ||
        //   this.contribuyente.ciudad == undefined
        // ) {
        //   this.toastr.info("Ingrese una ciudad");
        //   flag = true;
        // } 
        // else if (
        //   this.contribuyente.contribuyente == '' ||
        //   this.contribuyente.contribuyente == 0
        // ) {
        //   this.toastr.info("Ingrese el tipo");
        //   flag = true;

        // }
         else if (
          this.contribuyente.obligado_contabilidad == '' ||
          this.contribuyente.obligado_contabilidad == undefined
        ) {
          this.toastr.info("Ingrese el valor obligado a llevar contabilidad");
          flag = true;
        } else if (
          this.contribuyente.pais == '' ||
          this.contribuyente.pais == undefined
        ) {
          this.toastr.info("Ingrese el pais");
          flag = true;
        } else if (
          this.contribuyente.primer_nombre == '' ||
          this.contribuyente.primer_nombre == undefined
        ) {
          this.toastr.info("Ingrese el primer nombre");
          flag = true;
        } else if (
          this.contribuyente.segundo_nombre == '' ||
          this.contribuyente.segundo_nombre == undefined
        ) {
          this.toastr.info("Ingrese el segundo nombre");
          flag = true;
        } else if (
          this.contribuyente.primer_apellido == '' ||
          this.contribuyente.primer_apellido == undefined
        ) {
          this.toastr.info("Ingrese el primer apellido");
          flag = true;
        } else if (
          this.contribuyente.segundo_apellido == '' ||
          this.contribuyente.segundo_apellido == undefined
        ) {
          this.toastr.info("Ingrese el segundo apellido");
          flag = true;
        } else if (
          this.contribuyente.fecha_nacimiento == '' ||
          this.contribuyente.fecha_nacimiento == undefined
        ) {
          this.toastr.info("Ingrese la fecha de nacimiento");
          flag = true;
        } else if (
          this.contribuyente.genero == '' ||
          this.contribuyente.genero == undefined
        ) {
          this.toastr.info("Ingrese el genero");
          flag = true;
        }
         else if (
          this.contribuyente.estado_civil == '' ||
          this.contribuyente.estado_civil == undefined
        ) {
          this.toastr.info("Ingrese el estado civil");
          flag = true;
        }
        //  else if (
        //   this.contribuyente.supervivencia == '' ||
        //   this.contribuyente.supervivencia == undefined
        // ) {
        //   this.toastr.info("Escoga un valor en Supervivencia");
        //   flag = true;
        // }
        // else if (
        //   this.contribuyente.manzana == '' ||
        //   this.contribuyente.manzana == undefined
        // ) {
        //   this.toastr.info("Escoga un valor en Supervivencia");
        //   flag = true;
        // }
        // else if (
        //   this.contribuyente.zona == '' ||
        //   this.contribuyente.zona == undefined
        // ) {
        //   this.toastr.info("Escoga un valor en Supervivencia");
        //   flag = true;
        // }
        
      } else if (this.validadorJr) {
        if (this.contribuyente.tipo_documento == 0) {
          this.toastr.info("Seleccione un tipo de documneto");
          flag = true;
        } else if (
          this.NoDocumento == "" ||
          this.NoDocumento == undefined
        ) {
          this.toastr.info("Ingrese un número de documento");
          flag = true;
        } else if (
          this.contribuyente.razon_social == "" ||
          this.contribuyente.razon_social == undefined
        ) {
          this.toastr.info("Ingrese una razon_social");
          flag = true;
        } else if (
          this.contribuyente.direccion == "" ||
          this.contribuyente.direccion == undefined
        ) {
          this.toastr.info("Ingrese una dirección");
          flag = true;
        } 
        else if (
          this.contribuyente.telefono == "" ||
          this.contribuyente.telefono == undefined
        ) {
          this.toastr.info("Ingrese teléfono");
          flag = true;
        } 
        // else if (
        //   this.contribuyente.provincia == "" ||
        //   this.contribuyente.provincia == undefined
        // ) {
        //   this.toastr.info("Ingrese una provincia");
        //   flag = true;
        // } 
        // else if (
        //   this.contribuyente.ciudad == "" ||
        //   this.contribuyente.ciudad == undefined
        // ) {
        //   this.toastr.info("Ingrese una ciudad");
        //   flag = true;
        // } 
        // else if (
        //   this.contribuyente.contribuyente == '' ||
        //   this.contribuyente.contribuyente == 0
        // ) {
        //   this.toastr.info("Ingrese el tipo de contribuyente");
        //   flag = true;

        // } 
        // else if (
        //   this.contribuyente.nombre_comercial_cli == '' ||
        //   this.contribuyente.nombre_comercial_cli == undefined
        // ) {
        //   this.toastr.info("Ingrese el nombre comercial");
        //   flag = true;

        // } 
        // else if (
        //   this.contribuyente.tipo_persona_juridica == '' ||
        //   this.contribuyente.tipo_persona_juridica == undefined
        // ) {
        //   this.toastr.info("Ingrese el tipo de persona jurídica");
        //   flag = true;

        // } 
        // else if (
        //   this.contribuyente.contribuyente_especial == '' ||
        //   this.contribuyente.contribuyente_especial == undefined
        // ) {
        //   this.toastr.info("Ingrese el contribuyente especial");
        //   flag = true;

        // } 
        // else if (
        //   this.contribuyente.fecha_inicio_actividad == '' ||
        //   this.contribuyente.fecha_inicio_actividad == undefined
        // ) {
        //   this.toastr.info("Ingrese la fecha de inicio de actividades");
        //   flag = true;

        // }

      }else {
        this.toastr.info("Aun no ha realizado la validacion del contribuyente");
        flag = true;
      }


      if (this.contribuyente.contribuyente == 'Jurídico') {
        console.log('Otra validacion');
      }


      !flag ? resolve(true) : resolve(false);
    });
  }

  async confirmSave(message, action, infodev?: any) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_VENDEDOR") {
          this.saveContribuyente();
        } else if (action == "EDIT_VENDEDOR") {
         // this.updateContribuyente();
        }
      }
    });
  }

  searchProvinces(event) {
    console.log(event);
    this.tramitesSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.province = res['data'];

    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  changeMaxlength(event) {
    this.tipoDocumento = event
    if (event == 'Cedula') {
      this.NOCedula = 10;
    } else if (event == 'Ruc') {
      this.NOCedula = 13;
    } else if (event == 'Pasaporte') {
      this.NOCedula = 18
    }
  }

  searchCities(event) {
    console.log(event);
    this.tramitesSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      console.log(res);
      this.contribuyente.ciudad = undefined
      this.catalog.ciudad = res['data'];


    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  saveContribuyente() {
    this.contribuyente["ip"] = this.commonServices.getIpAddress();
    this.contribuyente["accion"] = `Ingreso de contribuyente`;
    this.contribuyente["id_controlador"] = myVarGlobals.fContribuyente;
    this.contribuyente["detalle"] = this.detalle_contactos;
    this.contribuyente["tipo_contribuyente"] = 1;
    if (this.validadorNt) {
      this.contribuyente["save"] = 'Natural';
      this.contribuyente["razon_social"] = this.contribuyente.primer_nombre + ' ' + this.contribuyente.segundo_nombre + ' ' + this.contribuyente.primer_apellido + ' ' + this.contribuyente.segundo_apellido
      console.log(this.contribuyente["razon_social"]);
      this.contribuyente["zona"] = null;
      this.contribuyente["provincia"] = null;
      this.contribuyente["ciudad"] = null;
      this.contribuyente["manzana"] = null;
      this.contribuyente["supervivencia"] = null;
      this.contribuyente["contribuyente"] = "Natural";
      this.contribuyente["solar"] = null;
      this.contribuyente["estado"] = "A";

    } else if (this.validadorJr) {
      this.contribuyente["save"] = 'Juridico';
      this.contribuyente["contribuyente"] = "Juridico";
    }
    // this.contribuyente["con_tiene_conyugue"] = this.conyugue;
    // this.contribuyente["dt_tiene_discapacidad"] = this.discapcidad;
    // this.contribuyente["ap_tiene_apoderado"] = this.tutor;
    // this.contribuyente["ph_tiene_prestamo"] = this.prestamo;
    // this.contribuyente["ta_pertenece_cooperativa"] = this.perteneceTax;
    console.log('Guardando');
    console.log(this.contribuyente);
    this.mensajeSpinner = "Guardando Contribuyente";
    this.lcargando.ctlSpinner(true);
    this.tramitesSrv.saveContribuyente(this.contribuyente).subscribe(
      (res: any) => {
        this.toastr.success(res["message"]);
       
        console.log(res);
        this.clearFromAfterSave();
        // this.contribuyenteSpecial = res.data;
        this.commonVrs.saveContribu.next({ data: res.data, permissions: this.permissions, dataUser: this.dataUser })
        this.closeModal();
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.toastr.info(error.error.message);
        console.log(error.error.message);
        this.lcargando.ctlSpinner(false);
      }
    );
  }

  clearFromAfterSave() {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
   

    this.commonVrs.clearContact.next(this.actions);
    this.ClearForm();
    this.locales = [];
    this.totalDeudas = 0;
    this.solares = [];
    this.deudas = [];
    this.actions.new = false
    this.validadorJr = false;
    this.validadorNt = false;
    this.validacionBusquedaContri = true
    this.NoDocumento = undefined
    this.edadContribuyente = undefined
    this.tipoPersona = undefined;
    this.validadorNoDocumentoNt = true
    this.validadorNoDocumentoJr = true
  }

closeModal() {
  this.activeModal.dismiss();
}

  
}
