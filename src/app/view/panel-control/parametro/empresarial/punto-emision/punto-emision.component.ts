import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { Router } from "@angular/router";
import * as moment from "moment";
import "moment/locale/es";
import { PuntodeEmisionService } from "../../empresarial/punto-emision/punto-emision.services";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { Socket } from "../../../../../services/socket.service";
import { CcSpinerProcesarComponent } from "../../../../../config/custom/cc-spiner-procesar.component";

@Component({
standalone: false,
  selector: "app-punto-emision",
  templateUrl: "./punto-emision.component.html",
  styleUrls: ["./punto-emision.component.scss"],
})
export class PuntoEmisionComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  /* Datatable options */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  // dtInstance: Promise<any>;
  validaDtUser: any = false;
  guardaT: any = [];
  fechaAutorizacion: any = new Date();
  fechaCaducidad: any = new Date();
  primerDia_mes: any = moment().startOf("month").format("DD");
  ultimoDia_mes: any = moment().endOf("month").format("DD");
  ptoemision: any = { checkaviso: false, checkCajaDefault: false, empresa: 0, sucursal: 0, tipoDoc: 0 };
  parameters: any = { numeroAviso: 0 };
  actions: any = {
    dComponet: false,
    btnNuevo: false,
    btnGuardar: false,
    btnNuevoDocumento: false,
    btncancelar: false,
    btnmodificar: false,
    btnbuscar: true,
    btneliminar: false,
    btnimprimir: false,
    ptoEmisionFl: true,
  };

  dataUser: any;
  permisions: any;
  arrayEmpresa: any;
  arraySucursal: any;
  arrayDocumento: any;
  disbledTipo: any = false;
  sueldData: any;
  cerodat: string = "Fecha inválida";
  skillForm: any;
  tamDoc: any = 0;
  nuevoPtoEmsion: any = false;
  guardaPtoEmsion: any = true;
  guardarDocumento: any = false;
  nuevoPtoDocumento: any = false;
  cantidad_punto: any;
  puntoExistente: any;
  prueba: any;
  puntoview: any;
  id_ptoEmision: any;
  unidadPtoEmision: any;
  ptoEmisionone: any;
  ptoinput: any;
  disabledUpdated: any = false;
  constador = 0;
  paginate: any;
  filter: any;
  constructor(
    private puntoEmisionServicio: PuntodeEmisionService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private commonVarSrvice: CommonVarService,
    private socket: Socket
  ) {
    moment.locale("es");

    this.commonVarSrvice.listeButtonEmpresa.asObservable().subscribe(res => {
      switch (res) {
        case 1:
          this.newPtoEmision();
          break;
        case 2:
          this.validaSaveparameter();
          break;
        case 3:
          this.newPtoDocumento();
          break;
        case 4:
          this.validaSaveDocumento();
          break;
        case 5:
          this.validaeditModificarPto();
          break;
        case 6:
          this.validateDelete();
          break;
        case 7:
          this.cleanptoemision();
          break;
      }
    })

    this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })
  }

  ngOnInit(): void {

    this.filter = {
      nombre: undefined,
      administrador: undefined,
      filterControl: ""
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fPuntoEmision,
      id_rol: id_rol,
    };

    this.commonServices.getPermisionsGlobas(data).subscribe(
      (res) => {
        this.permisions = res["data"];
        if (this.permisions[0].ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Punto de Emision"
          );
          this.router.navigateByUrl("dashboard");
        } else {
          setTimeout(() => {
            this.getDataTablePtoEmision();
            this.getEmpresaGeneral();
          }, 1000);
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  getDataTablePtoEmision() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 8,
      search: true,
      paging: true,
     /*  scrollY: "200px",
      scrollCollapse: true, */
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.puntoEmisionServicio.showPtoEmision().subscribe(
      (res) => {
        this.validaDtUser = true;
        this.guardaT = res["data"];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      },
      (error) => {
        this.validaDtUser = true;
        this.guardaT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
        this.toastr.info(error.error.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getDataTablePtoEmision();
    });
  }
  newPtoEmision() {
    this.actions.btnNuevoDocumento = true;
    this.disabledUpdated = false;
    this.guardaPtoEmsion = true;
    this.actions.btnGuardar = true;
    this.actions.btncancelar = true;
    this.actions.dComponet = true;
    this.nuevoPtoDocumento = true;
  }

  cleanptoemision() {
    this.ptoemision = {};
    this.fechaAutorizacion = new Date("0000-00-00");
    this.fechaCaducidad = new Date("0000-00-00");
    this.parameters = { numeroAviso: 0 };
    this.actions.dComponet = false;

    this.actions.btnNuevo = false;
    this.actions.btnmodificar = false;
    this.actions.btneliminar = false;
    this.nuevoPtoDocumento = false;
    this.nuevoPtoEmsion = false;
    this.sueldData = false;
    this.actions.btnNuevoDocumento = false;
    document.getElementById("idptonumPuntoEmision").style.border = "";
    setTimeout(() => {
      this.guardaPtoEmsion = false;
      this.guardarDocumento = false;
    }, 100);
  }

  getFilterptoEmision(event) {
    let data = {
      sucursal: event,
    };
    this.puntoEmisionServicio.getSucursalPtEmision(data).subscribe(
      (res) => {
        if (res["data"].length > 0) {
          this.cantidad_punto = res["data"];
          this.unidadPtoEmision = res["data"][0].next_point;
          this.ptoemision.numPuntoEmision = this.unidadPtoEmision
            .toString()
            .padStart(3, "0");
          this.ptoemision.numFacEstablecimiento = this.ptoemision.sucursal
            .toString()
            .padStart(3, "0");
          document.getElementById("idptonumPuntoEmision").style.border =
            "7px solid #46B21A ";
        } else {
          this.toastr.info(
            "No existe Punto de emisión para esta Sucursal, ingrese datos en los campo para crear una nueva"
          );
          this.cantidad_punto = undefined;
          this.cantidad_punto = [];
          this.ptoemision.numPuntoEmision = "";
          this.ptoemision.numFacEstablecimiento = this.ptoemision.sucursal
            .toString()
            .padStart(3, "0");
          document.getElementById("idptonumPuntoEmision").style.border = "";
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  ValidacionPto(evt) {
    let parse = evt.target.value;
    this.ptoinput = parse;
    this.inputPtoEmsion();
  }

  inputPtoEmsion() {
    var cero = 0;
    var printcero = cero.toString().padStart(3, "0");
    var p = parseFloat(printcero);
    if (this.ptoinput.length === 3) {
      let exist = this.guardaT.find(
        (e) =>
          e.fk_sucursal == this.ptoemision.sucursal &&
          e.num_punto_emision.toString().padStart(3, "0") == this.ptoinput
      );
      if (exist !== undefined) {
        /* Pintar en el input del color warning */
        this.toastr.info(
          "El punto de emision ya se encuentra creado para esta sucursal"
        );
        document.getElementById("idptonumPuntoEmision").style.border =
          "7px solid #FF3333";
        this.disabledPtoSucursal();
      } else if (this.ptoinput === printcero) {
        this.toastr.info("El punto de Emision no debe se igual cero.");
        document.getElementById("idptonumPuntoEmision").style.border =
          "7px solid #FF3333 ";
        this.disabledPtoSucursal();
      } else {
        /* Pintar en el input del color success */
        document.getElementById("idptonumPuntoEmision").style.border =
          "7px solid #46B21A";
        this.disabledTruePtoSucursal();
      }
    } else if (this.ptoinput === "") {
      this.toastr.info("El punto de Emision no debe estar vacio");
      document.getElementById("idptonumPuntoEmision").style.border =
        "7px solid #FF3333 ";
      this.disabledPtoSucursal();
    } else if (this.ptoinput.length < 3) {
      this.toastr.info("El punto de emision tiene tres digitos");
      document.getElementById("idptonumPuntoEmision").style.border =
        "7px solid #FF3333 ";
      this.disabledPtoSucursal();
    }
  }

  disabledPtoSucursal() {
    (<HTMLInputElement>(
      document.getElementById("ptoemisionNumFac")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("idptoemisionAutorizacion")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("idptoemisionCaducidad")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("idptoemisionNombre")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("idptoemisionnumFacInicio")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("idptonumFacCaducidad")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("idptonumFacEstablecimiento")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("idptonumFacSerial")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("checksueldouni")
    )).disabled = true;
    (<HTMLInputElement>(
      document.getElementById("idCajaDefault")
    )).disabled = true;
  }

  disabledTruePtoSucursal() {
    (<HTMLInputElement>(
      document.getElementById("ptoemisionNumFac")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("idptoemisionAutorizacion")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("idptoemisionCaducidad")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("idptoemisionNombre")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("idptoemisionnumFacInicio")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("idptonumFacCaducidad")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("idptonumFacEstablecimiento")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("idptonumFacSerial")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("checksueldouni")
    )).disabled = false;
    (<HTMLInputElement>(
      document.getElementById("idCajaDefault")
    )).disabled = false;
  }

  getFilterEmpresa(e) {
    this.ptoemision.empresa = e;
    this.getSucursal();
    document.getElementById("idptonumPuntoEmision").style.border = "";
    this.ptoemision.numAut = "";
    //ptoemision.sucursal
    this.fechaAutorizacion = "";
    this.ptoemision.tipoDoc = "";
    this.fechaAutorizacion = new Date("0000-00-00");
    this.fechaCaducidad = new Date("0000-00-00");
    this.ptoemision.ptoExistente = "";
    this.ptoemision.numFacInicio = "";
    this.ptoemision.numFacCaducidad = "";
    this.ptoemision.numFacEstablecimiento = "";
    this.ptoemision.numPuntoEmision = "";
    this.ptoemision.numFacSerial = "";
    this.parameters.checkaviso = "";
    this.ptoemision.nombre = "";
    this.parameters = { numeroAviso: 0 };
  }

  getEmpresaGeneral() {
    this.puntoEmisionServicio.getEmpresa().subscribe(
      (res) => {
        this.arrayEmpresa = res["data"];
        this.getDocumento();
      },
      (error) => {
        this.toastr.info("No existe Empresa");
        this.arrayEmpresa = [];
      }
    );
  }

  getSucursal() {
    let data = {
      fk_empresa_Seleccionada: this.ptoemision.empresa,
    };
    this.puntoEmisionServicio.getTipoSucursal(data).subscribe(
      (res) => {
        this.commonVarSrvice.updPerm.next(false);
        this.arraySucursal = res["data"];
      },
      (error) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.info("No existe Sucursal para esta empresa");
        this.arraySucursal = [];
      }
    );
  }

  getDocumento() {
    this.commonVarSrvice.updPerm.next(true);
    this.puntoEmisionServicio.showDocuments().subscribe(
      (res) => {
        this.commonVarSrvice.updPerm.next(false);
        this.arrayDocumento = res["data"];
      },
      (error) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.info("No existe Documento");
        this.arrayDocumento = [];
      }
    );
  }

  getFiltersucursalExistente(e) {
    this.ptoemision.sucursal = e;
    this.FilterptoPtoExistente();
  }

  filterExistente(event) {
    this.ptoemision.ptoExistente = event;
    let filt = this.puntoExistente.filter((e) => e.pto_nombre == event);
    filt = filt[0];
    if (filt != undefined) {
      this.ptoemision.nombre = filt.pto_nombre;
      this.ptoemision.numFacEstablecimiento = filt.num_establecimiento;
      this.ptoemision.numPuntoEmision = filt.emision_point;
      this.parameters.checkCajaDefault = filt.hasDefault == "1" ? true : false;
    }
  }

  FilterptoPtoExistente() {
    let data = {
      empresa: this.ptoemision.empresa,
      sucursal: this.ptoemision.sucursal,
    };
    this.commonVarSrvice.updPerm.next(true);
    this.puntoEmisionServicio.getptoPtoExistente(data).subscribe(
      (res) => {
        this.commonVarSrvice.updPerm.next(false);
        this.puntoExistente = res["data"];
        if (res["data"].length > 0) {
          this.puntoExistente = res["data"];
          this.toastr.info("Punto Existente para esta sucursal");
        } else {
          this.toastr.info("No existe Punto Existente para esta Sucursal");
          this.ptoemision.sucursal = "";
          this.ptoemision.sucursal = 0;
          this.puntoExistente = undefined;
          this.puntoExistente = [];
        }
      },
      (error) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.info("No existe punto Existente para esta sucursal");
        this.puntoExistente = [];
      }
    );
  }

  setsueldoUni() {
    if (this.parameters.checkaviso == true) {
      this.sueldData = true;
      this.parameters.numeroAviso = "";
    } else {
      this.parameters.numeroAviso = 0;
      this.sueldData = false;
    }
  }

  existCajaDefecto() {
    if (this.parameters.checkCajaDefault == true) {
      let existdefault = this.guardaT.find(
        (e) =>
          e.fk_sucursal == this.ptoemision.sucursal &&
          e.num_punto_emision.toString().padStart(3, "0") ==
          this.ptoemision.numPuntoEmision &&
          e.fk_type_doc == this.ptoemision.tipoDoc &&
          e.hasDefault == 1
      );
      if (existdefault !== undefined) {
        this.toastr.info("Caja por defecto Existente");
        document.getElementById("idCajaDefault").focus();
        return;
      }
    }
  }

  async validaSaveparameter() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
      this.router.navigateByUrl("dashboard");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar Puneto de Emisión?",
            "SAVE_GUARDAR"
          );
        }
      });
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.ptoemision.empresa == 0 ||
        this.ptoemision.empresa == "" ||
        this.ptoemision.empresa == null
      ) {
        this.toastr.info("Seleccione una empresa");
        document.getElementById("ptoemisionEmpresa").focus();
        return;
      } else if (
        this.ptoemision.sucursal == 0 ||
        this.ptoemision.sucursal == "" ||
        this.ptoemision.sucursal == null
      ) {
        this.toastr.info("Seleccione una sucursal");
        document.getElementById("ptoemisionSucursal").focus();
        return;
      } else if (
        this.ptoemision.tipoDoc == 0 ||
        this.ptoemision.tipoDoc == "" ||
        this.ptoemision.tipoDoc == null
      ) {
        this.toastr.info("Seleccione el tipo de documento");
        document.getElementById("ptoemisionDocumento").focus();
        return;
      } else if (
        this.ptoemision.nombre == undefined ||
        this.ptoemision.nombre == "" ||
        this.ptoemision.nombre == null
      ) {
        this.toastr.info("Ingrese el nombre para el Punto de Emisión");
        document.getElementById("idptoemisionNombre").focus();
        return;
      } else if (
        this.ptoemision.numAut == undefined ||
        this.ptoemision.numAut == "" ||
        this.ptoemision.numAut == null
      ) {
        this.toastr.info("Ingrese el número Autorización");
        document.getElementById("ptoemisionNumFac").focus();
        return;
      } else if (
        this.fechaAutorizacion == undefined ||
        this.fechaAutorizacion == null
      ) {
        this.toastr.info("Seleccione fecha de Autorización");
        document.getElementById("idptoemisionAutorizacion").focus();
        return;
      } else if (
        this.fechaCaducidad == undefined ||
        this.fechaCaducidad == null
      ) {
        this.toastr.info("Seleccione fecha de Caducidad");
        document.getElementById("idptoemisionCaducidad").focus();
        return;
      } else if (
        this.ptoemision.numFacInicio == undefined ||
        this.ptoemision.numFacInicio == "" ||
        this.ptoemision.numFacInicio == null
      ) {
        this.toastr.info("Ingreso Número de Factura");
        document.getElementById("idptoemisionnumFacInicio").focus();
        return;
      } else if (
        this.ptoemision.numFacCaducidad == undefined ||
        this.ptoemision.numFacCaducidad == "" ||
        this.ptoemision.numFacCaducidad == null
      ) {
        this.toastr.info("Ingreso Número de caducidad de Factura");
        document.getElementById("idptonumFacCaducidad").focus();
        return;
      } else if (
        this.ptoemision.numFacEstablecimiento == undefined ||
        this.ptoemision.numFacEstablecimiento == "" ||
        this.ptoemision.numFacEstablecimiento == null
      ) {
        this.toastr.info("Ingreso Número establecimiento de Factura");
        document.getElementById("idptonumFacEstablecimiento").focus();
        return;
      } else if (
        this.ptoemision.numPuntoEmision == undefined ||
        this.ptoemision.numPuntoEmision == "" ||
        this.ptoemision.numPuntoEmision == null
      ) {
        this.toastr.info("Ingreso Número punto de emision Factura");
        document.getElementById("idptonumPuntoEmision").focus();
        return;
      } else if (
        this.ptoemision.numFacSerial == undefined ||
        this.ptoemision.numFacSerial == "" ||
        this.ptoemision.numFacSerial == null
      ) {
        this.toastr.info("Ingreso Número serial de Factura");
        document.getElementById("idptonumFacSerial").focus();
        return;
      } else if (
        this.parameters.checkaviso == true &&
        this.parameters.numeroAviso == ""
      ) {
        this.toastr.info(
          "Ingrese el número diferente a cero que alertará previo al máximo"
        );
        document.getElementById("idnumeroAviso").focus();
        return;
      } else if (
        this.parameters.checkaviso == true &&
        !(
          parseInt(this.parameters.numeroAviso) >
          parseInt(this.ptoemision.numFacInicio) &&
          parseInt(this.parameters.numeroAviso) <
          parseInt(this.ptoemision.numFacCaducidad)
        )
      ) {
        this.toastr.info(
          "El número de aviso debe estar entre No. Factura de Inicio y No. Factura Caducidad"
        );
        document.getElementById("idnumeroAviso").focus();
        return;
      } else {
        if (!flag) {
          let existDocumento = this.guardaT.find(
            (e) =>
              e.fk_sucursal == this.ptoemision.sucursal &&
              e.num_punto_emision.toString().padStart(3, "0") ==
              this.ptoemision.numPuntoEmision &&
              e.fk_type_doc == this.ptoemision.tipoDoc
          );
          if (existDocumento !== undefined) {
            this.toastr.info(
              "El punto de emisión para este documento ya Existe"
            );
            document.getElementById("idptonumPuntoEmision").focus();
            return;
          } else {
            resolve(true);
          }
        } else {
          !flag ? resolve(true) : resolve(false);
        }
      }
    });
  }

  getFilterDocumento(doc) {
    this.ptoemision.tipoDoc = doc;
    let existdefault = this.guardaT.find(
      (e) =>
        e.fk_sucursal == this.ptoemision.sucursal &&
        e.num_punto_emision.toString().padStart(3, "0") ==
        this.ptoemision.numPuntoEmision &&
        e.fk_type_doc == this.ptoemision.tipoDoc &&
        e.hasDefault == 1
    );

    let filt = this.arrayDocumento.filter(
      (e) => e.id == this.ptoemision.tipoDoc
    );
    filt = filt[0];
    if (
      existdefault !== undefined &&
      this.ptoemision.numPuntoEmision !== undefined
    ) {
      this.toastr.info(
        "El punto de emisión para este documento ya Existe El punto de emisión ya Existe para documento"
      );
      this.disabledPtoSucursal();
    } else if (filt != undefined) {
      this.ptoemision.nombreDocumento = filt.nombre;
    } else {
      this.disabledTruePtoSucursal();
    }
  }

  SaveptoEmision() {
    this.commonVarSrvice.updPerm.next(true);
    let data = {
      fk_empresa: this.ptoemision.empresa,
      fk_sucursal: this.ptoemision.sucursal,
      fk_type_doc: this.ptoemision.tipoDoc,
      doc_tipo: this.ptoemision.nombreDocumento,
      pto_nombre: this.ptoemision.nombre,
      num_autorizacion: this.ptoemision.numAut,
      start_date_aut: moment(this.fechaAutorizacion).format("YYYY-MM-DD"),
      end_date_aut: moment(this.fechaCaducidad).format("YYYY-MM-DD"),
      num_start_fact: this.ptoemision.numFacInicio,
      num_end_fact: this.ptoemision.numFacCaducidad,
      hasAlert: this.parameters.checkaviso == true ? 1 : 0,
      num_fact_alert:
        this.parameters.checkaviso == true ? this.parameters.numeroAviso : null,
      num_establecimiento: this.ptoemision.sucursal,
      num_punto_emision: this.ptoemision.numPuntoEmision,
      num_fact_serial: this.ptoemision.numFacSerial,
      hasBoxOpen: 0,
      caja_default: this.parameters.checkCajaDefault == true ? "CD" : null,
      hasDefault: this.parameters.checkCajaDefault == true ? 1 : 0,
      ip: this.commonServices.getIpAddress(),
      accion:
        "Guardar nuevo Punto de emision " +
        this.ptoemision.nombre +
        "" +
        this.ptoemision.numPuntoEmision,
      id_controlador: myVarGlobals.fPuntoEmision,
    };
    this.puntoEmisionServicio.SavepuntoEmision(data).subscribe(
      (res) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.success(
          "Se ha guardado el Nuevo punto de Emisión exitosamente"
        );
        setTimeout(() => {
          this.cleanptoemision();
        }, 100);
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  updatePtoEmision(dt) {
    this.commonVarSrvice.updPerm.next(true);
    this.commonVarSrvice.listeButtonPtEm.next(null);
    this.disabledUpdated = true;
    this.ptoemision.empresa = dt.fk_empresa;
    this.getSucursal();
    this.uploadInfo(dt);
  }

  uploadInfo(dt) {
    this.actions.btnNuevo = true;
    this.actions.dComponet = true;
    this.actions.btnGuardar = false;
    this.actions.btnmodificar = true;
    this.actions.btncancelar = true;
    this.actions.btneliminar = true;
    this.nuevoPtoEmsion = true;
    this.guardarDocumento = false;
    this.nuevoPtoDocumento = true;
    this.guardaPtoEmsion = true;

    this.id_ptoEmision = dt.id;
    this.ptoemision.empresa = dt.fk_empresa;
    this.ptoemision.sucursal = dt.fk_sucursal;
    this.ptoemision.tipoDoc = dt.fk_type_doc;
    this.ptoemision.nombreDocumento = dt.fk_type_doc;
    this.ptoemision.nombre = dt.pto_nombre;
    this.ptoemision.numAut = dt.num_autorizacion;
    this.fechaAutorizacion = dt.start_date_aut;
    this.fechaCaducidad = dt.end_date_aut;
    this.ptoemision.numFacInicio = dt.num_start_fact;
    this.ptoemision.numFacCaducidad = dt.num_end_fact;
    this.ptoemision.numFacEstablecimiento = dt.num_establecimiento
      .toString()
      .padStart(3, "0");
    this.ptoEmisionone = dt.num_punto_emision;
    this.ptoemision.numPuntoEmision = dt.num_punto_emision
      .toString()
      .padStart(3, "0");
    this.ptoemision.numFacSerial = dt.num_fact_serial;
    this.parameters.checkCajaDefault = dt.hasDefault == 1 ? true : false;
    if (dt.hasAlert == 1) {
      this.parameters.numeroAviso = dt.num_fact_alert;
      this.parameters.checkaviso = true;
      this.sueldData = true;
    } else {
      this.parameters.checkaviso = false;
      this.parameters.numeroAviso = 0;
      this.sueldData = false;
    }
  }
  //////Funciones para Documento Nuevo

  newPtoDocumento() {
    this.actions.btnGuardar = true;
    this.actions.btncancelar = true;
    this.actions.dComponet = true;
    this.guardaPtoEmsion = false;
    this.actions.btnNuevo = true;
    this.guardarDocumento = true;
    this.nuevoPtoDocumento = false;
    this.nuevoPtoEmsion = true;
  }

  async validaSaveDocumento() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
      this.router.navigateByUrl("dashboard");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar Nuevo Documento?",
            "SAVE_GUARDAR_DOCUMENTO"
          );
        }
      });
    }
  }

  SaveptoNewDocumento() {
    this.commonVarSrvice.updPerm.next(true);
    let data = {
      fk_empresa: this.ptoemision.empresa,
      fk_sucursal: this.ptoemision.sucursal,
      fk_type_doc: this.ptoemision.tipoDoc,
      doc_tipo: this.ptoemision.nombreDocumento,
      pto_nombre: this.ptoemision.nombre,
      num_autorizacion: this.ptoemision.numAut,
      start_date_aut: moment(this.fechaAutorizacion).format("YYYY-MM-DD"),
      end_date_aut: moment(this.fechaCaducidad).format("YYYY-MM-DD"),
      num_start_fact: this.ptoemision.numFacInicio,
      num_end_fact: this.ptoemision.numFacCaducidad,
      hasAlert: this.parameters.checkaviso == true ? 1 : 0,
      num_fact_alert:
        this.parameters.checkaviso == true ? this.parameters.numeroAviso : null,
      num_establecimiento: this.ptoemision.sucursal,
      num_punto_emision: this.ptoemision.numPuntoEmision,
      num_fact_serial: this.ptoemision.numFacSerial,
      hasBoxOpen: 0,
      caja_default: this.parameters.checkCajaDefault == true ? "CD" : null,
      hasDefault: this.parameters.checkCajaDefault == true ? 1 : 0,
      ip: this.commonServices.getIpAddress(),
      accion:
        "Guardar nuevo Documento " +
        this.ptoemision.nombre +
        "" +
        this.ptoemision.numPuntoEmision,
      id_controlador: myVarGlobals.fPuntoEmision,
    };
    this.puntoEmisionServicio.SavepuntoEmision(data).subscribe(
      (res) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.success("Se ha guardado el Nuevo Documento exitosamente");
        setTimeout(() => {
          this.cleanptoemision();
        }, 1000);
      },
      (error) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  validatemod() {
    let flag = false;
    var cero = 0;
    var printcero = cero.toString().padStart(3, "0");

    return new Promise((resolve, reject) => {
      if (
        this.ptoemision.empresa == 0 ||
        this.ptoemision.empresa == "" ||
        this.ptoemision.empresa == null
      ) {
        this.toastr.info("Seleccione una empresa");
        document.getElementById("ptoemisionEmpresa").focus();
        return;
      } else if (
        this.ptoemision.sucursal == 0 ||
        this.ptoemision.sucursal == "" ||
        this.ptoemision.sucursal == null
      ) {
        this.toastr.info("Seleccione una sucursal");
        document.getElementById("ptoemisionSucursal").focus();
        return;
      } else if (
        this.ptoemision.tipoDoc == 0 ||
        this.ptoemision.tipoDoc == "" ||
        this.ptoemision.tipoDoc == null
      ) {
        this.toastr.info("Seleccione el tipo de documento");
        document.getElementById("ptoemisionDocumento").focus();
        return;
      } else if (
        this.ptoemision.nombre == undefined ||
        this.ptoemision.nombre == "" ||
        this.ptoemision.nombre == null
      ) {
        this.toastr.info("Ingrese el nombre para el Punto de Emisión");
        document.getElementById("idptoemisionNombre").focus();
        return;
      } else if (
        this.ptoemision.numAut == undefined ||
        this.ptoemision.numAut == "" ||
        this.ptoemision.numAut == null
      ) {
        this.toastr.info("Ingrese el número Autorización");
        document.getElementById("ptoemisionNumFac").focus();
        return;
      } else if (
        this.fechaAutorizacion == undefined ||
        this.fechaAutorizacion == null
      ) {
        this.toastr.info("Seleccione fecha de Autorización");
        document.getElementById("idptoemisionAutorizacion").focus();
        return;
      } else if (
        this.fechaCaducidad == undefined ||
        this.fechaCaducidad == null
      ) {
        this.toastr.info("Seleccione fecha de Caducidad");
        document.getElementById("idptoemisionCaducidad").focus();
        return;
      } else if (
        this.ptoemision.numFacInicio == undefined ||
        this.ptoemision.numFacInicio == "" ||
        this.ptoemision.numFacInicio == null
      ) {
        this.toastr.info("Ingreso Número de Factura");
        document.getElementById("idptoemisionnumFacInicio").focus();
        return;
      } else if (
        this.ptoemision.numFacCaducidad == undefined ||
        this.ptoemision.numFacCaducidad == "" ||
        this.ptoemision.numFacCaducidad == null
      ) {
        this.toastr.info("Ingreso Número de caducidad de Factura");
        document.getElementById("idptonumFacCaducidad").focus();
        return;
      } else if (
        this.ptoemision.numFacEstablecimiento == undefined ||
        this.ptoemision.numFacEstablecimiento == "" ||
        this.ptoemision.numFacEstablecimiento == null
      ) {
        this.toastr.info("Ingreso Número establecimiento de Factura");
        document.getElementById("idptonumFacEstablecimiento").focus();
        return;
      } else if (
        this.ptoemision.numPuntoEmision == undefined ||
        this.ptoemision.numPuntoEmision == "" ||
        this.ptoemision.numPuntoEmision == null
      ) {
        this.toastr.info("Ingreso Número punto de emision Factura");
        document.getElementById("idptonumPuntoEmision").focus();
        return;
      } else if (
        this.ptoemision.numFacSerial == undefined ||
        this.ptoemision.numFacSerial == "" ||
        this.ptoemision.numFacSerial == null
      ) {
        this.toastr.info("Ingreso Número serial de Factura");
        document.getElementById("idptonumFacSerial").focus();
        return;
      } else if (
        this.parameters.checkaviso == true &&
        this.parameters.numeroAviso == ""
      ) {
        this.toastr.info(
          "Ingrese el número diferente a cero que alertará previo al máximo"
        );
        document.getElementById("idnumeroAviso").focus();
        return;
      } else if (
        this.parameters.checkaviso == true &&
        !(
          parseInt(this.parameters.numeroAviso) >
          parseInt(this.ptoemision.numFacInicio) &&
          parseInt(this.parameters.numeroAviso) <
          parseInt(this.ptoemision.numFacCaducidad)
        )
      ) {
        this.toastr.info(
          "El número de aviso debe estar entre No. Factura de Inicio y No. Factura Caducidad"
        );
        document.getElementById("idnumeroAviso").focus();
        return;
      } else {
        if (this.ptoemision.numPuntoEmision.length === 3) {
          if (this.ptoemision.numPuntoEmision === printcero) {
            this.toastr.info("El punto de Emision no debe se igual cero.");
            document.getElementById("idptonumPuntoEmision").style.border =
              "7px solid #FF3333";
            this.disabledPtoSucursal();
            return;
          } else {
            this.disabledTruePtoSucursal();
            document.getElementById("idptonumPuntoEmision").style.border =
              "7px solid #46B21A";

            setTimeout(() => {
              resolve(true);
            }, 2000);
          }
        } else {
          !flag ? resolve(true) : resolve(false);
        }
      }
    });
  }

  async validaeditModificarPto() {
    if (this.permisions.modificar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      let resp = await this.validatemod().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea modificar Punto de Emisión?",
            "MODIFICAR_DOCUMENTO"
          );
        }
      });
    }
  }

  modificarPtoEmsion() {
    this.commonVarSrvice.updPerm.next(true);
    let filt = this.arrayDocumento.filter((e) => e.id == this.ptoemision.tipoDoc);
    filt = filt[0].nombre;
    let data = {
      id: this.id_ptoEmision,
      fk_empresa: this.ptoemision.empresa,
      fk_sucursal: this.ptoemision.sucursal,
      fk_type_doc: this.ptoemision.tipoDoc,
      doc_tipo: filt,
      pto_nombre: this.ptoemision.nombre,
      num_autorizacion: this.ptoemision.numAut,
      start_date_aut: moment(this.fechaAutorizacion).format("YYYY-MM-DD"),
      end_date_aut: moment(this.fechaCaducidad).format("YYYY-MM-DD"),
      num_start_fact: this.ptoemision.numFacInicio,
      num_end_fact: this.ptoemision.numFacCaducidad,
      hasAlert: this.parameters.checkaviso == true ? 1 : 0,
      num_fact_alert:
        this.parameters.checkaviso == true ? this.parameters.numeroAviso : null,
      num_establecimiento: this.ptoemision.sucursal,
      num_punto_emision: this.ptoemision.numPuntoEmision,
      num_fact_serial: this.ptoemision.numFacSerial,
      hasBoxOpen: 0,
      caja_default: this.parameters.checkCajaDefault == true ? "CD" : null,
      hasDefault: this.parameters.checkCajaDefault == true ? 1 : 0,
      ip: this.commonServices.getIpAddress(),
      accion:
        "Modificar Punto de emision" +
        this.ptoemision.nombre +
        "con el mumero de punto " +
        this.ptoemision.numPuntoEmision,
      id_controlador: myVarGlobals.fPuntoEmision,
    };
    this.puntoEmisionServicio.modificarpunto(data).subscribe(
      (res) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.success(
          "Se ha actulizado el punto de Emisión exitosamente"
        );
        setTimeout(() => {
          this.cleanptoemision();
        }, 300);
        setTimeout(() => {
          this.getDataTablePtoEmision();
          this.getEmpresaGeneral();
        }, 1000);
      },
      (error) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  validateDelete() {
    if (this.permisions[0].eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.confirmSave(
        "Seguro desea eliminar el Punto de Emisión?",
        "DELETE_PTO_EMISION"
      );
    }
  }

  deletePtoEmision() {
    this.commonVarSrvice.updPerm.next(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      id: this.id_ptoEmision,
      ip: this.commonServices.getIpAddress(),
      accion:
        "Eliminar Punto de emision" +
        this.ptoemision.nombre +
        "con el mumero de punto " +
        this.ptoemision.numPuntoEmision,
      id_controlador: myVarGlobals.fPuntoEmision,
    };
    this.puntoEmisionServicio.deletePuntoEmision(data).subscribe(
      (res) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.success(res["message"]);
        setTimeout(() => {
          0;
          this.cleanptoemision();
        }, 1000);
      },
      (error) => {
        this.commonVarSrvice.updPerm.next(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  //Mensaje y envio a las funciones de guardar
  async confirmSave(message, action) {
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
        if (action == "SAVE_GUARDAR") {
          this.SaveptoEmision();
        } else if (action == "SAVE_GUARDAR_DOCUMENTO") {
          this.SaveptoNewDocumento();
        } else if (action == "MODIFICAR_DOCUMENTO") {
          this.modificarPtoEmsion();
        } else if (action == "DELETE_PTO_EMISION") {
          this.deletePtoEmision();
        }
      }
    });
  }
}
