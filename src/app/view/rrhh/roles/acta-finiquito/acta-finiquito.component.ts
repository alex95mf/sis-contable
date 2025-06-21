import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { NgxCurrencyInputMode  } from 'ngx-currency';
import moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActaFiniquitoService } from './acta-finiquito.service';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
//import { ThisReceiver } from '@angular/compiler/src/expression_parser/ast';
import { DialogService } from "primeng/dynamicdialog";
import { CcModalTableEmpleadoComponent } from "src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component";
import { EmployeesResponseI } from "src/app/models/responseEmployee.interface";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { environment } from 'src/environments/environment';



@Component({
standalone: false,
  selector: 'app-acta-finiquito',
  templateUrl: './acta-finiquito.component.html',
  styleUrls: ['./acta-finiquito.component.scss'],
  providers: [DialogService]
})
export class ActaFiniquitoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  // ref: DynamicDialogRef;
  @ViewChild("print") print!: ElementRef;

  @ViewChild("nameInputSearchEmpleado") inputNameSearchEmpleado;
  @ViewChild("nameTipo") inputTipo; // accessing the reference element
  @ViewChild("nameEmpuFullNombre") inputNameEmpFullNombre; // accessing the reference element
  @ViewChild("nameSalarioMinimo") inputNameSalarioMinimo;

  @ViewChild("nameDepartamento") inputNamenameDepartamento; // accessing the reference element
  @ViewChild("nameDepartamentoDos") inputNamenameDepartamentoDos; // accessing the reference element
  @ViewChild("nameCargo") inputNamenameCargo; // accessing the reference element



  fTitle = "Acta de Finiquito";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  formReadOnly = false;
  readonlyInputSearchEmpleado = false
  disableBtnConsultaEmpleados = false
  id_empleado:any
  registroActaFiniquito: FormGroup;
  acta: any = {
    id_empleado:0,
    num_documento:"",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    fecha_inicio_labores: null,
    fecha_fin_labores: moment().format('YYYY-MM-DD'),
    tipo_contrato: null,
    ultima_remuneracion: null,
    motivo: "",
    total: 0.00,
    detallesIngresos: [],
    detallesEgresos: [],
  }

  lst_motivos_contrato: any[] = []
  lst_motivos_filtered: any[] = []

  rubrosI: any = [];
  rubrosE: any = [];
  rubrosIngresos: any = [];
  rubrosEgresos: any = [];
  totalIngresos: any = 0
  totalEgresos: any = 0
  totalDiferencia: any = 0
  ordenDeseado: string[] = ["SUEL", "FRES", "DECIT", "DECIC", "IVAC", "IUTI", "IOTR","ICOM","IBON","DESAH","INDEM"];
  ordenDeseadoEgreso: string[] = ["APOR","PRES","EANT","OTR","MULT","EATR"];


  empleadoForm: EmployeesResponseI = {
    id_empleado: 0,
    id_tipo_identificacion: 0,
    emp_identificacion: "",
    emp_primer_nombre: "",
    emp_segundo_nombre: "",
    emp_primer_apellido: "",
    emp_segundo_apellido: "",
    emp_full_nombre: "",
    id_nivel_educativo: 0,
    emp_fecha_nacimiento: undefined,
    fechajubilacion:undefined,
    id_estado_civil: 0,
    id_genero: 0,
    estado_id: 0,
    tienejubilacion:"",
    nacionalidad:"",
    localidad:"",
    region:"",
    direccion:"",
    id_codigo_biometrico:"",
    id_tipo_discapacidad: 0,
    porcentaje_discapacidad: 0,
    emp_telefono: "",
    emp_celular: "",
    emp_correo: "",
    emp_correo_empresarial: "",
    id_area: 0,
    id_departamento: 0,
    id_cargo: 0,
    id_jornada: 0,
    id_tipo_salario: 0,
    id_sueldo: 0,
    id_tipo_nomina_pago: 0,
    id_tipo_anticipo: 0,
    emp_porcentaje_valor_quincena: "",
    id_config_semanal: 0,
    emp_fecha_ingreso: undefined,
    id_extension_conyuge: 0,
    id_iees_jubilado: 0,
    id_fondo_reserva_uno_dia: 0,
    // emp_codigo_trabajo:0,
    id_codigo_trabajo: 0,
    id_acu_decimo_tercero: 0,
    id_acu_decimo_cuarto: 0,
    id_acu_fondo_reserva: 0,
    id_retenciones_judiciales: 0,
    estado: undefined,
    tipo_identificacion: undefined,
    estado_civil: undefined,
    genero: undefined,
    area: undefined,
    departamento: undefined,
    cargo: undefined,
    jornada: undefined,
    sueldo: undefined,
    id_sueldo_variable: 0,
    valor_sueldo_variable: 0,
    valor_retencion_judicial: 0,
    emp_valor_reeten_judicial:"",
    marca_biometrico: 0,
    entidad:"",
    num_cuenta: "",
    tipo_cuenta:"",
    id_tipo_pago:0,
    jornada_parcial_permanente: false
    // id_countries: 0,
    // name_countries: "",
    // id_states: 0,
    // name_states: "",
    // id_cities: 0,
    // name_cities: "",
    // direccion_domicilio_emp: ""
  };

  validaciones: ValidacionesFactory = new ValidacionesFactory()
  options = {
    max: 1000000,
    min: 0,
    inputMode: NgxCurrencyInputMode .Natural,
  }
  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: ActaFiniquitoService,
    public dialogService: DialogService,
    private fb: FormBuilder,
  ) {
    this.registroActaFiniquito = this.fb.group({
      nameEmpuFullNombre: [{value: '', disabled: true}, [Validators.required]],
    })

    this.apiSrv.listaActas$.subscribe(
      async (res) => {
        this.lcargando.ctlSpinner(true);
        (this as any).mensajeSpinner = 'Recuperando datos'
        // Mostrar el empleado
        const empleado: any = await this.apiSrv.getEmpleado(res.fk_empleado)
        console.log(empleado)
        this.registroActaFiniquito.get('nameEmpuFullNombre').setValue(empleado.emp_full_nombre)
        // Cargar lista de Motivos
        this.filtrarMotivosContrato(res.tipo_contrato)
        this.lcargando.ctlSpinner(false)

        this.formReadOnly = true;
        this.readonlyInputSearchEmpleado = true
        this.disableBtnConsultaEmpleados = true


        this.acta= res;
        this.acta.num_documento= res['documento'];
        this.inputNameEmpFullNombre.nativeElement.value = res['empleado']['emp_full_nombre'];
        this.acta.fecha = res.fecha.split(" ")[0];
        console.log(res['detalles'])

        // this.apiSrv.getRubrosCatalogo({}).subscribe(
        //   res => {
        //     console.log(res['ingresos'])
        //     this.rubros= res
        //     let rubro_nombre=
        //     res['ingresos'].forEach(e => {
        //     rubro_nombre = e.cat_nombre
        //     });
        //     res['egresos'].forEach(e => {
        //       rubro_nombre = e.cat_nombre
        //       this.rubros.push(rubro_nombre)
        //     });


        //   },
        //   err => {
        //     this.lcargando.ctlSpinner(false)
        //     this.toastr.error(err.error.message, 'Error cargando Rubros')
        //   }
        // )


  console.log(this.rubrosI)

        this.rubrosIngresos = [];
        this.rubrosEgresos = [];
        res['detalles'].map(e => {
          if(e.tipo_rubro=='INGRESOS'){
            let nombre_rubro=''
            this.rubrosI.map(a => {
              if(a.cat_keyword == e.codigo_rubro){
                nombre_rubro=a.cat_nombre
              }
            })
            let ingresos ={
              tipo_rubro: e.tipo_rubro,
              codigo_rubro:e.codigo_rubro,
              nombre_rubro: nombre_rubro,
              cantidad: e.cantidad,
              valor: e.valor,
              porcentaje: e.porcentaje,
              valor_calculado: e.valor_calculado,
              total: e.total,
            }
            this.rubrosIngresos.push(ingresos)

          }
          if(e.tipo_rubro=='EGRESOS'){
            let nombre_rubro=''
            this.rubrosE.map(a => {
              if(a.cat_keyword == e.codigo_rubro){
                nombre_rubro=a.cat_nombre
              }
            })
            let egresos ={
              tipo_rubro: e.tipo_rubro,
              codigo_rubro:e.codigo_rubro,
              nombre_rubro:  nombre_rubro,
              cantidad: e.cantidad,
              valor: e.valor,
              porcentaje: e.porcentaje,
              valor_calculado: e.valor_calculado,
              total: e.total,
            }
            this.rubrosEgresos.push(egresos)
          }
        });

        let totalIngresos = 0;
        let totalEgresos = 0;
        this.rubrosIngresos.forEach(e => {
          totalIngresos += +e.total;
        });
        this.rubrosEgresos.forEach(e => {
          totalEgresos += +e.total;
        });
        this.totalIngresos = totalIngresos;
        this.totalEgresos = totalEgresos;
        this.totalDiferencia =  this.totalIngresos - this.totalEgresos;

        this.vmButtons[0].habilitar = true;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
      }
    )

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnsActaFini",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsActaFini",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: " BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsActaFini",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
        imprimir: true
      },
      {
        orig: "btnsActaFini",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }
    ]
  }

  ngOnInit(): void {
    setTimeout(async () => {
      await this.cargarMotivosContrato();
      this.cargarRubrosActa();
      this.validaPermisos();
    }, 0);

  }

  obtenerIndice(nombre) {

    return this.ordenDeseado.indexOf(nombre);
}
obtenerIndiceEgreso(nombre) {

  return this.ordenDeseadoEgreso.indexOf(nombre);
}



  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " GUARDAR":
        this.validaActaFiniquito();
        break;
      case " BUSCAR":
        this.expandListActasFiniquito();
        break;
      case " IMPRIMIR":
      this.imprimirActaFiniquito();
        break;
      case " LIMPIAR":
        this.confirmRestore();
        break;
      default:
        break;
    }
  }


  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);



    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fActaFiniquito,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        console.log(res)
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false)

        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }


  confirmRestore() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reiniciar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.restoreForm();
      }
    });
  }

  onClicConsultaEmpleados() {

    const ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "yes",
        search : this.inputNameSearchEmpleado.nativeElement.value,
        relation_selected : "",
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe((empleadoData: EmployeesResponseI) => {
      if (empleadoData) {
      console.log(empleadoData);
      this.id_empleado = empleadoData.id_empleado;
      this.acta.id_empleado = empleadoData.id_empleado;
      this.acta.fecha_inicio_labores = moment(empleadoData.emp_fecha_ingreso).format('YYYY-MM-DD')
      this.acta.tipo_contrato = empleadoData.codigo_trabajo?.cat_nombre
      this.acta.ultima_remuneracion = empleadoData.sueldo?.sld_salario_minimo
      this.empleadoForm = empleadoData;
      this.inputNameEmpFullNombre.nativeElement.value = empleadoData.emp_full_nombre;

      this.filtrarMotivosContrato(empleadoData.codigo_trabajo?.cat_nombre)
      }
    });
  }

  cargarMotivosContrato = async () => {
    try {
      const response = await this.apiSrv.getMotivosContrato({params: "'MOTIVO_FINIQUITO'"})
      console.log(response['data'])
      this.lst_motivos_contrato = response['data']['MOTIVO_FINIQUITO']
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  filtrarMotivosContrato = (tipo_contrato: string) => {
    if (!['LOSEP', 'CODIGO DE TRABAJO'].includes(tipo_contrato)) this.lst_motivos_filtered = []
    else this.lst_motivos_filtered = this.lst_motivos_contrato.filter((motivo: any) => motivo.grupo == tipo_contrato)
  }


  cargarRubrosActa(){
    (this as any).mensajeSpinner = 'Cargando Rubros...';
    this.lcargando.ctlSpinner(true);

    let data = {
      cat_keyword: 'TDR',
    };

    this.apiSrv.getRubrosCatalogo(data).subscribe(
      res => {
        this.lcargando.ctlSpinner(false);
        console.log(res['ingresos'])
        this.rubrosI= res['ingresos']
        this.rubrosI.sort((a, b) => {
          const indiceA = this.obtenerIndice(a.cat_keyword);
          const indiceB = this.obtenerIndice(b.cat_keyword);
          return indiceA - indiceB;
        });
        this.rubrosE= res['egresos']
        this.rubrosE.sort((a, b) => {
          const indiceA = this.obtenerIndiceEgreso(a.cat_keyword);
          const indiceB = this.obtenerIndiceEgreso(b.cat_keyword);
          return indiceA - indiceB;
        });

        res['ingresos'].forEach(e => {

            let data = Object.assign(e, {
              tipo_rubro: 'INGRESOS',
              codigo_rubro: e.cat_keyword,
              nombre_rubro: e.cat_nombre,
              cantidad: 0,
              valor: 0,
              porcentaje: 0,
              valor_calculado: 0,
              total: 0,
            });

            this.rubrosIngresos.push(data)

        });
        res['egresos'].forEach(f => {

          let data = Object.assign(f, {
            tipo_rubro: 'EGRESOS',
            codigo_rubro: f.cat_keyword,
            nombre_rubro: f.cat_nombre,
            cantidad: 0,
            valor: 0,
            porcentaje: 0,
            valor_calculado: 0,
            total: 0,
          });

          this.rubrosEgresos.push(data)

      });
        //this.rubrosIngresos = res['ingresos']
        //this.rubrosEgresos = res['egresos']

      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Rubros')
      }
    )
  }


  calculoTotales(event){

    let totalIngresos = 0;
    let totalEgresos = 0;

    this.rubrosIngresos.forEach(e => {

      Object.assign(e, {
        valor_calculado: (e.valor * e.porcentaje) + e.valor ,
        total: e.total,// e.cantidad * ((e.valor * e.porcentaje) + e.valor),
      });
    });
    this.rubrosEgresos.forEach(e => {

      Object.assign(e, {
        valor_calculado: (e.valor * e.porcentaje) + e.valor ,
        total: e.cantidad * ((e.valor * e.porcentaje) + e.valor),
      });
    });

    this.rubrosIngresos.forEach(e => {
      totalIngresos += +e.total;
    });
    this.rubrosEgresos.forEach(e => {
      totalEgresos += +e.total;
    });
    this.totalIngresos = totalIngresos;
    this.totalEgresos = totalEgresos;
    this.totalDiferencia =  this.totalIngresos - this.totalEgresos;
  }


  sumaTotales(event){

    let totalIngresos = 0;
    let totalEgresos = 0;

    this.rubrosIngresos.forEach(e => {

      Object.assign(e, {
        valor_calculado: (e.valor * e.porcentaje) + e.valor ,
        total: e.total,// e.cantidad * ((e.valor * e.porcentaje) + e.valor),
      });
    });
    this.rubrosEgresos.forEach(e => {

      Object.assign(e, {
        valor_calculado: (e.valor * e.porcentaje) + e.valor ,
        total: e.total,
      });
    });

    this.rubrosIngresos.forEach(e => {
      totalIngresos += +e.total;
    });
    this.rubrosEgresos.forEach(e => {
      totalEgresos += +e.total;
    });
    this.totalIngresos = totalIngresos;
    this.totalEgresos = totalEgresos;
    this.totalDiferencia =  this.totalIngresos - this.totalEgresos;
  }


  async validaActaFiniquito() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Ordenes de Pago.", this.fTitle);
      return
    }

    try {
      await this.validaDataGlobal()
      this.createActaFiniquito();
    } catch (err) {
      console.log(err)
      this.toastr.warning(err, 'Validacion de Datos', {enableHtml: true})
    }
  }

  validaDataGlobal() {
    // console.log(this.acta.id_empleado)
    // let flag = false;
    let message = ''
    return new Promise<void>((resolve, reject) => {


        if (
          this.acta.id_empleado == 0 || this.acta.id_empleado == undefined
        ) {
          // this.toastr.info("Debe seleccionar un Empleado")
          // flag = true;
          message += '* Debe seleccionar un Empleado <br>'
        }
        if (this.acta.motivo == "" || this.acta.motivo == undefined) {
          // this.toastr.info("Debe ingresar un Motivo")
          // flag = true;
          message += '* Debe seleccionar un Motivo<br>'
        }
        if (this.totalIngresos <= 0) {
          // this.toastr.info("El total de Ingresos no puede ser 0")
          // flag = true;
          message += '* El total de Ingresos no puede ser 0<br>'
        }
        if (this.totalEgresos <= 0) {
          // this.toastr.info("El total de Egresos no puede ser 0")
          // flag = true;
          message += '* El total de Egresos no puede ser 0<br>'
        }

      message.length > 0 ? reject(message) : resolve()
    })
  }
  createActaFiniquito() {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de realizar una Acta de Finiquito ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = 'Generando Acta de Finiquito..';
        this.lcargando.ctlSpinner(true);
        this.acta.total =  this.totalDiferencia;
        this.rubrosIngresos.forEach(e => {
          let data =  {
            tipo_rubro: e.tipo_rubro,
            codigo_rubro:e.codigo_rubro,
            nombre_rubro: e.nombre_rubro,
            cantidad: e.cantidad,
            valor: e.valor,
            porcentaje: e.porcentaje,
            valor_calculado: e.valor_calculado,
            total: e.total,
          };
          this.acta.detallesIngresos.push(data);
        });
        this.rubrosEgresos.forEach(f => {
          let data =  {
            tipo_rubro: f.tipo_rubro,
            codigo_rubro:f.codigo_rubro,
            nombre_rubro: f.nombre_rubro,
            cantidad: f.cantidad,
            valor: f.valor,
            porcentaje: f.porcentaje,
            valor_calculado: f.valor_calculado,
            total: f.total,
          };
          this.acta.detallesEgresos.push(data);
        });

        let data = {
          acta: this.acta
        }

        this.apiSrv.setActaFiniquito(data).subscribe(
          (res) => {
            console.log(res)
              this.acta = res;
              this.acta.num_documento = res['documento'];
              this.formReadOnly = true;
              this.vmButtons[0].habilitar = true;
              this.vmButtons[2].habilitar = false;
              this.vmButtons[3].habilitar = false;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Acta de Finiquito generada con el No. "+ res['documento'],
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              })
          },
          (error) => {
            console.log(error)
            this.lcargando.ctlSpinner(false);
            this.toastr.error(error.error?.message);
          }
        );
      }
    });
    //}
  }

  expandListActasFiniquito() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListRecDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  restoreForm() {

    this.cargarRubrosActa();
    this.formReadOnly = false;
    this.readonlyInputSearchEmpleado = false
    this.disableBtnConsultaEmpleados = false
    this.acta = {
      id_empleado:0,
      num_documento:"",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      motivo: "",
      total: 0.00,
      detallesIngresos: [],
      detallesEgresos: [],
    }
    this.empleadoForm.id_empleado = 0;
    this.inputNameEmpFullNombre.nativeElement.value = "";
    this.rubrosI= [];
    this.rubrosE= [];
    this.rubrosIngresos = [];
    this.rubrosEgresos = [];
    this.totalIngresos = 0;
    this.totalEgresos = 0;
    this.totalDiferencia = 0;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;

  }

  imprimirActaFiniquito(){
   console.log(this.acta.id_acta_finiquito)
    window.open(environment.ReportingUrl + "rpt_rrhh_acta_finiquito.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_acta_finiquito=" + this.acta.id_acta_finiquito , '_blank')

  }

  calcularValores = async () => {
    let msgValidacion = ''

    if (this.empleadoForm.id_empleado == 0) msgValidacion += '* No ha seleccionado un Empleado<br>'

    if (msgValidacion.length > 0) {
      this.toastr.warning(msgValidacion, 'Validacion de Datos', {enableHtml: true})
      return
    }

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Calculando valores'
    try {
      const response = await this.apiSrv.calcularValores({empleado: this.empleadoForm});
      console.log(response)

      response['data']['ingresos'].forEach((element: any, idx: number) => {
        Object.assign(this.rubrosIngresos[idx], {
          cantidad: 1,
          valor: element,
          valor_calculado: element,
          total: element,
        })
        // this.rubrosIngresos[idx].valor = element
      })

      response['data']['egresos'].forEach((element: any, idx: number) => {
        Object.assign(this.rubrosEgresos[idx], {
          cantidad: 1,
          valor: element,
          valor_calculado: element,
          total: element,
        })
        // this.rubrosEgresos[idx].valor = element
      })

      this.sumaTotales({}) //calculoTotales

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error calculando Valores')
    }
  }

}
