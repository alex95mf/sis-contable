import { Component, Input, OnInit, Output, EventEmitter,ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCondicionesComponent } from '../modal-condiciones/modal-condiciones.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ContratacionService } from '../contratacion.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { AnexosListComponentDis } from '../anexos-list/anexos-list-dis.component';

@Component({
standalone: false,
  selector: 'app-detalle-contratacion',
  templateUrl: './detalle-contratacion.component.html',
  styleUrls: ['./detalle-contratacion.component.scss']
})
export class DetalleContratacionComponent implements OnInit {
  @ViewChildren(AnexosListComponentDis) componentes: AnexosListComponentDis
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  mensajeSpinner: string

  programa: any = []

  departamento: any = []

  atribucion: any = []


  asigna: any = []
  totalCotizado: any = 0
  totalAprobado: any = 0
  totalCondiciones: any = 0
  totalAdjudicado: any = 0
  proceso: any = []
  titulosDisabled = true;
  formReadOnly = false;
  fileListEM: FileList;
  fileListTR: FileList;
  fileListPL: FileList;
  fileListPB: FileList;
  fileListPR: FileList;
  fileListRP: FileList;
  fileListPP: FileList;
  fileListAO: FileList;
  fileListNG: FileList;
  fileListAJ: FileList;
  fileListPO: FileList;
  fileListAC: FileList;
  fileListPV: FileList;
  fileListDE: FileList;
  fileListEX: FileList;
  fileListCO: FileList;
  fileListCE: FileList;

  fileList2: FileList;
  listaDetSolicitudes: any[] = []
  vmButtons: any;
  listaSolicitudes: any = {
    con_adjudicado: "",
    con_valor: 0,
    con_fecha_adjudicacion: moment(new Date()).format('YYYY-MM-DD'),
    con_cod_sercop: "",
    fk_con_proveedor: 0,
    con_contrato: "",
    con_num_proceso: "",
    con_admin_contrato: 0,
    con_anticipo: 0,
    con_adj_observaciones: "",
    con_fecha_contrato: moment(new Date()).format('YYYY-MM-DD'),
    con_estado: "",
    adj_nro_resolucion: "",
    con_extension:"",
    con_fecha_extension:moment(new Date()).format('YYYY-MM-DD'),
    con_extension_valor:0,
    con_extension_idp:"",
    con_extension_observacion:"",
    con_extension_resolucion:"",
    con_anticipo_porcentaje: 0,
    con_plazo: "",
    con_forma_pago: ""

  }
  detalles: any = {
    programa: null,
    departamento: null,
    atribucion: null,
    asigna: null,
    proceso: null
  }
  estadoList = [
    { value: "I", label: "INICIAL" },
    { value: "E", label: "EJECUCIÓN" },
    { value: "C", label: "CERRADO" }
  ]
  proveedorActive: any = {
    razon_social: ""
  };
  listPoliza: any = []

  listarCondiciones: any = []




  dateEM: any
  dateTR: any
  datePL: any
  datePB: any
  datePR: any
  dateRP: any
  datePP: any
  dateAO: any
  dateNG: any
  dateAJ: any
  datePO: any
  dateAC: any
  datePV: any
  dateDE: any
  dateEX: any
  dateCO: any
  dateCE: any

  valiEM = false
  valiTR = false
  valiPL = false
  valiPB = false
  valiPR = false
  valiRP = false
  valiPP = false
  valiAO = false
  valiNG = false
  valiAJ = false
  valiPO = false
  valiAC = false
  valiPV = false
  valiDE = false
  valiEX = false
  valiCO = false
  valiCE = false



  listaCatalogo: any = []
  listaAseguradora: any = []
  listaGarantia: any = []

  listaBitacora: any = {
    fk_solicitud: 0,
    estado: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
  };

  extensionDisabled = true;
  fk_proveedor = 0

  @Input() item: any;
  @Input() model: any;

  listaPoliza: any = {
    fk_solicitud: 0,
    cod_sercop: "",
    fecha_inicio: moment(new Date()).format('YYYY-MM-DD'),
    fecha_finalizacion: moment(new Date()).format('YYYY-MM-DD'),
    num_poliza: 0,
    valor: 0,
    aseguradora: "",
    riesgo: "",
    forma_garantia:"",
    estado: ""
  };

  firstday: any;
  today: any;
  tomorrow: any;
  fecha_hasta: any;
  lastday: any;
  adminActive: any = {
    nombre:"",

  };

  validaciones: ValidacionesFactory = new ValidacionesFactory();



  constructor(
    private modalDet: NgbModal,
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private contratoService: ContratacionService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private cierremesService: CierreMesService

  ) {
    // this.componentes.sendDate.subscribe(
    //   (res) => {
    //     console.log(res)
    //   }
    // )

    this.commonVrs.selectProveedorCustom.asObservable().subscribe(
      (res) => {
        this.proveedorActive = res;
        this.fk_proveedor = this.proveedorActive.id_proveedor
      }
    );

    this.commonVrs.diableCargarDis.asObservable().subscribe(
      (res) => {
        console.log(res)
        if (res.custom1 == 'EM') {
          this.valiEM = true
        } else if (res.custom1 == 'TR') {
          this.valiTR = true
        }
        else if (res.custom1 == 'PL') {
          this.valiPL = true
        }
        else if (res.custom1 == 'PB') {
          this.valiPB = true
        }
        else if (res.custom1 == 'PR') {
          this.valiPR = true
        }
        else if (res.custom1 == 'RP') {
          this.valiRP = true
        }
        else if (res.custom1 == 'PP') {
          this.valiPP = true
        }
        else if (res.custom1 == 'AO') {
          this.valiAO = true
        }
        else if (res.custom1 == 'NG') {
          this.valiNG = true
        }
        else if (res.custom1 == 'AJ') {
          this.valiAJ = true
        }
        else if (res.custom1 == 'PO') {
          this.valiPO = true
        }
        else if (res.custom1 == 'AC') {
          this.valiAC = true
        }
        else if (res.custom1 == 'PV') {
          this.valiPV = true
        }
        else if (res.custom1 == 'DE') {
          this.valiDE = true
        }
        else if (res.custom1 == 'EX') {
          this.valiEX = true
        }
        else if (res.custom1 == 'CO') {
          this.valiCO = true
        }
        else if (res.custom1 == 'CE') {
          this.valiCE = true
        }
      }
    )
    this.commonVrs.selectContrato.asObservable().subscribe(
      (res) => {

        this.crearContrato()
        this.cargarCondiciones()
        this.listaSolicitudes = this.item
        // this.proveedorActive.razon_social = this.item.proveedor.razon_social
        this.cargarPoliza()
        this.cargarBitacora()
      }
    );

    this.commonVrs.selectCondicion.asObservable().subscribe(
      (res) => {
        console.log('Cargar archivo')
        this.cargarCondiciones()
      }
    )


    this.commonVrs.selectAnexo.asObservable().subscribe(
      (res) => {
        console.log(res)
        if (res.custom1 == 'TR') {
          this.dateTR = res.custom2
          this.valiTR = false
        }else if (res.custom1 == 'EM') {
          this.dateEM = res.custom2
          this.valiEM = false
        }else if (res.custom1 == 'PL') {
          this.datePL = res.custom2
          this.valiPL = false
        } else if (res.custom1 == 'PB') {
          this.datePB = res.custom2
          this.valiPB = false
        } else if (res.custom1 == 'PR') {
          this.datePR = res.custom2
          this.valiPR = false
        } else if (res.custom1 == 'RP') {
          this.dateRP = res.custom2
          this.valiRP = false
        } else if (res.custom1 == 'PP') {
          this.datePP = res.custom2
          this.valiPP = false
        } else if (res.custom1 == 'AO') {
          this.dateAO = res.custom2
          this.valiAO = false
        } else if (res.custom1 == 'NG') {
          this.dateNG = res.custom2
          this.valiNG = false
        } else if (res.custom1 == 'AC') {
          this.dateAC = res.custom2
          this.valiAC = false
        }else if (res.custom1 == 'PV') {
          this.datePV = res.custom2
          this.valiPV = false
        }else if (res.custom1 == 'DE') {
          this.dateDE = res.custom2
          this.valiDE = false
        }else if (res.custom1 == 'CO') {
          this.dateCO = res.custom2
          this.valiCO = false
        }else if (res.custom1 == 'CE') {
          this.dateCE = res.custom2
          this.valiCE = false
        }
      }
    )


    this.commonVrs.encargadoSelect.asObservable().subscribe(
      (res) =>{
        this.adminActive.id_empleado= res['id_empleado']
        this.adminActive.nombre = res['emp_primer_nombre'] + " " + res['emp_primer_apellido']
        this.listaSolicitudes.con_admin_contrato = res['id_empleado']
       // console.log(this.listaSolicitudes.con_admin_contrato)
      }
    )



  }

  ngOnInit(): void {
    this.vmButtons = [
      // {
      //   orig: "btnsComprasP",
      //   paramAccion: "",
      //   boton: { icon: "fas fa-save", texto: " GUARDAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-success boton btn-sm",
      //   habilitar: false,
      // },

      {
        orig: "btnsComprasP",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }

    ]
    // this.componentes.sendDate.subscribe(
    //   (res) => {
    //     console.log(res)
    //   }
    // )

    setTimeout(() => {
      console.log(this.item)
      if(this.item.proveedor == null || this.item.proveedor == "" || this.item.proveedor == undefined){
        this.fk_proveedor = 0
      }
      else{
        this.fk_proveedor = this.item.proveedor.id_proveedor
      }

      if (this.item['administrador_cont']==null || this.item['administrador_cont']=="" ||this.item['administrador_cont']==undefined){
        this.adminActive.nombre = "No tiene administrador de compra"
      }
      else {
        this.adminActive.nombre = this.item['administrador_cont']['emp_full_nombre']
        this.listaSolicitudes.con_admin_contrato = this.item['administrador_cont']['id_empleado']
      }

      let valorTotalCotizado = 0;
      let valorTotalAprobado = 0;


      this.item['detalles'].forEach(element => {
        valorTotalCotizado += +element.precio_cotizado;
        valorTotalAprobado += +element.precio_aprobado;
      });
      this.totalCotizado= valorTotalCotizado
      this.totalAprobado= valorTotalAprobado
      this.listaDetSolicitudes = this.item['detalles']
      // this.detalles.programa = this.item['catalogo_programa']['valor']
      // this.detalles.departamento = this.item['catalogo_departamento']['valor']
      // this.detalles.atribucion = this.item['catalogo']['valor']
      // this.detalles.proceso = this.item['tipo_proceso']
      this.cargarCondiciones()
      this.cargarPoliza()
      this.catalogo()
      this.aseguradora()
      this.garantia()
      this.cargarBitacora()
      this.listaSolicitudes = this.item
      console.log(this.listaSolicitudes)
      if (this.listaSolicitudes.fk_con_proveedor == null) {
        console.log("hola")

      }
      else {
        this.proveedorActive.razon_social = this.item.proveedor.razon_social
      }

      console.log(this.listaDetSolicitudes)


      this.calculartotaladjudicado()
    }, 50);







  }

  handleDate(event, tipo) {
    console.log(event, tipo)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {

      case "REGRESAR":
        console.log('H')
        this.commonVrs.selectDetContrato.next({})
        this.model = true

        break;
    }
  }
  validateValor(event){
    console.log(event)

    let totalPrecioCotizado= 0
    let totalPrecioAprobado= 0
    this.listaDetSolicitudes.forEach(element => {
      totalPrecioCotizado += +parseFloat(element.precio_cotizado)
      totalPrecioAprobado += +parseFloat(element.precio_aprobado)

    });

    if(event > totalPrecioAprobado){
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "El valor adjudicado de $"+this.commonService.formatNumberDos(event)+" no puede ser mayor al precio aprobado de $"+  this.commonService.formatNumberDos(totalPrecioAprobado),
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      })
      //this.toastr.info('El valor no puede ser mayor a la suma de los bienes cotizados')
    }
  }

  async validaDetallesContratacion() {

    this.listaDetSolicitudes.forEach(element => {
      if (element.precio_aprobado > element.precio_cotizado){
        this.toastr.info("El valor aprobado: "+element.precio_aprobado+
        " super al precio cotizado: "+element.precio_cotizado)
        return
      }


    });
    this.validaDetallesCon().then(respuesta => {
      if (respuesta) {
        this.confirmSave("Seguro desea guardar los detalles de esta solicitud ?", "SAVE_DETALLES");
      }
    }).catch((err) => {
      console.log(err);
      this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    });

}

validaDetallesCon() {
  let totalPrecioCotizado= 0
    let totalPrecioAprobado= 0
    this.listaDetSolicitudes.forEach(element => {
      totalPrecioCotizado += +parseFloat(element.precio_cotizado)
      totalPrecioAprobado += +parseFloat(element.precio_aprobado)
    });
  if(this.listaSolicitudes.con_valor > totalPrecioAprobado){
    this.toastr.info('El valor adjudicado de $'+ this.commonService.formatNumberDos(this.listaSolicitudes.con_valor) +' no puede ser mayor al precio aprobado de $'+ this.commonService.formatNumberDos(totalPrecioAprobado))
      return;
  }
  console.log(parseFloat(this.totalAprobado) , parseFloat(this.totalCotizado))
  let c = 0;
  let mensajes: string = '';
  return new Promise((resolve, reject) => {

    if(parseFloat(this.totalAprobado) > parseFloat(this.totalCotizado)){
      mensajes += "El valor total aprobado de $"+ this.commonService.formatNumberDos(this.totalAprobado.toFixed(2)) +" no puede ser mayor al valor total cotizado $"
        + this.commonService.formatNumberDos(this.totalCotizado.toFixed(2)) + " la diferencia es de $ "
        + (this.commonService.formatNumberDos(this.totalAprobado.toFixed(2) - this.totalCotizado.toFixed(2) )) +"<br>"
    }
    return (mensajes.length) ? reject(mensajes) : resolve(true)

  });
}

async confirmSave(message, action) {

  Swal.fire({
    title: "Atención!!",
    text: message,
    //icon: "warning",
    showCancelButton: true,
    cancelButtonColor: '#DC3545',
    confirmButtonColor: '#13A1EA',
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
   // this.processing = false;
    if (result.value) {
      if (action == "SAVE_DETALLES") {
        this.guardarContratacionDetalles();
      }
    }
  })
}
guardarContratacionDetalles(){
  this.mensajeSpinner = "Verificando período contable";
  this.lcargando.ctlSpinner(true);
  let datos = {
    "anio": Number(moment().format('YYYY')),
    "mes": Number(moment().format('MM')),
  }
    this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

    /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {

        let data = {
          detalles: this.listaDetSolicitudes,
          valor_adjudicado: this.listaSolicitudes.con_valor
        }
        this.lcargando.ctlSpinner(true);
        this.contratoService.saveContratacionDetalles(data).subscribe(
          (res) => {
              console.log(res['data']);
              if (res["status"] == 1) {
              //this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                  icon: "success",
                  title: "Los Datos fueron guardados con éxito",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
              });
              let valorTotalCotizado = 0;
              let valorTotalAprobado = 0;
              res['data'].forEach(element => {
                valorTotalCotizado += +parseFloat(element.precio_cotizado);
                valorTotalAprobado += +parseFloat(element.precio_aprobado);

              });
              this.totalCotizado= valorTotalCotizado
              this.totalAprobado= valorTotalAprobado


              this.listaDetSolicitudes= res['data']
              this.lcargando.ctlSpinner(false);

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
      } else {
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }

    }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
    })
}


  moduloDetalle() {
    console.log(this.listarCondiciones)
    let modal = this.modalDet.open(ModalCondicionesComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.item = this.item
    modal.componentInstance.detalle_solicitud = this.listaDetSolicitudes
    modal.componentInstance.condiciones = this.listarCondiciones
    modal.componentInstance.totalCondiciones = this.totalCondiciones
    modal.componentInstance.valor_adjudicado = this.listaSolicitudes.con_valor

  }

  //  cargaArchivo(archivos) {
  //   if (archivos.length > 0) {
  //     this.fileListEM = archivos
  //     setTimeout(() => {
  //       this.toastr.info('Ha seleccionado ' + this.fileListEM.length + ' archivo(s).', 'Anexos de trámite')
  //     }, 50)
  //     // console.log(this.fileList)
  //   }


  // }

  cargaArchivo2(archivos, custom1) {
    let fileList: FileList

    if (archivos.length > 0) {
      fileList = archivos
      if (custom1 == 'EM') {
        this.fileListEM = fileList

      } else if (custom1 == 'TR') {
        this.fileListTR = fileList
      } else if (custom1 == 'PL') {
        this.fileListPL = fileList
      } else if (custom1 == 'PB') {
        this.fileListPB = fileList
      } else if (custom1 == 'PR') {
        this.fileListPR = fileList
      } else if (custom1 == 'RP') {
        this.fileListRP = fileList
      } else if (custom1 == 'PP') {
        this.fileListPP = fileList
      } else if (custom1 == 'AO') {
        this.fileListAO = fileList
      } else if (custom1 == 'NG') {
        this.fileListNG = fileList
      } else if (custom1 == 'AJ') {
        this.fileListAJ = fileList
      } else if (custom1 == 'PO') {
        this.fileListPO = fileList
      } else if (custom1 == 'AC') {
        this.fileListAC = fileList
      }else if (custom1 == 'PV') {
        this.fileListPV = fileList
      }else if (custom1 == 'DE') {
        this.fileListDE = fileList
      }else if (custom1 == 'EX') {
        this.fileListEX = fileList
      }else if (custom1 == 'CO') {
        this.fileListCO = fileList
      }else if (custom1 == 'CE') {
        this.fileListCE = fileList
      }


      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + fileList.length + ' archivo(s).', 'Anexos de trámite')
      }, 50)
      // console.log(this.fileList)
    }


  }

  validacionArchivo(custom1) {
    if (custom1 == 'EM') {
      if (this.dateEM == null || this.dateEM == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }

    }
    else if (custom1 == 'TR') {
      if (this.dateTR == null || this.dateTR == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }

    }
    else if (custom1 == 'PL') {
      if (this.datePL == null || this.datePL == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'PB') {
      if (this.datePB == null || this.datePB == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }

    }
    else if (custom1 == 'PR') {
      if (this.datePR == null || this.datePR == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'RP') {
      if (this.dateRP == null || this.dateRP == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }

    }
    else if (custom1 == 'PP') {
      if (this.datePP == null || this.datePP == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'AO') {
      if (this.dateAO == null || this.dateAO == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'NG') {
      if (this.dateNG == null || this.dateNG == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'AC') {
      if (this.dateAC == null || this.dateAC == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'PV') {
      if (this.datePV == null || this.datePV == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'DE') {
      if (this.dateDE == null || this.dateDE == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'CE') {
      if (this.dateCE == null || this.dateCE == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }
    else if (custom1 == 'CO') {
      if (this.dateCO == null || this.dateCO == undefined) {
        this.toastr.info("Debe ingresar una fecha para el anexo")
        return;
      }
      else {
        this.uploadFile(custom1)
      }
    }

  }

  uploadFile(custom1) {
    console.log('Presionado una vez');
    let date: any = null;
    if (custom1 == 'EM') {
      date = this.dateEM
    } else if (custom1 == 'TR') {
      date = this.dateTR
    } else if (custom1 == 'PL') {
      date = this.datePL
    } else if (custom1 == 'PB') {
      date = this.datePB
    } else if (custom1 == 'PR') {
      date = this.datePR
    } else if (custom1 == 'RP') {
      date = this.dateRP
    } else if (custom1 == 'PP') {
      date = this.datePP
    } else if (custom1 == 'AO') {
      date = this.dateAO
    } else if (custom1 == 'NG') {
      date = this.dateNG
    } else if (custom1 == 'AC') {
      date = this.dateAC
    }else if (custom1 == 'PV') {
      date = this.datePV
    }else if (custom1 == 'DE') {
      date = this.dateDE
    }else if (custom1 == 'CE') {
      date = this.dateCE
    }else if (custom1 == 'CO') {
      date = this.dateCO
    }
    else if (custom1 == 'AJ') {
      this.today = new Date();
      this.fecha_hasta = moment(this.today).format('YYYY-MM-DD');
      date = this.fecha_hasta
    }
    else if (custom1 == 'PO') {
      this.today = new Date();
      this.fecha_hasta = moment(this.today).format('YYYY-MM-DD');
      date = this.fecha_hasta
    }
    else if (custom1 == 'EX') {
      this.today = new Date();
      this.fecha_hasta = moment(this.today).format('YYYY-MM-DD');
      date = this.fecha_hasta
    }

    let data = {
      // Informacion para almacenamiento de anexo
      module: 20,
      component: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.item['id_solicitud'],
      custom1: custom1,
      custom2: date,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Ticket ${this.item['id_solicitud']}`,
      ip: this.commonService.getIpAddress()
    }

    let fileList: FileList

    if (custom1 == 'EM') {
      fileList = this.fileListEM
    } else if (custom1 == 'TR') {
      fileList = this.fileListTR
    } else if (custom1 == 'PL') {
      fileList = this.fileListPL
    } else if (custom1 == 'PB') {
      fileList = this.fileListPB
    } else if (custom1 == 'PR') {
      fileList = this.fileListPR
    } else if (custom1 == 'RP') {
      fileList = this.fileListRP
    } else if (custom1 == 'PP') {
      fileList = this.fileListPP
    } else if (custom1 == 'AO') {
      fileList = this.fileListAO
    } else if (custom1 == 'NG') {
      fileList = this.fileListNG
    } else if (custom1 == 'AJ') {
      fileList = this.fileListAJ
    }
    else if (custom1 == 'PO') {
      fileList = this.fileListPO
    }
    else if (custom1 == 'AC') {
      fileList = this.fileListAC
    } else if (custom1 == 'PV') {
      fileList = this.fileListPV
    } else if (custom1 == 'DE') {
      fileList = this.fileListDE
    } else if (custom1 == 'EX') {
      fileList = this.fileListEX
    } else if (custom1 == 'CE') {
      fileList = this.fileListCE
    } else if (custom1 == 'CO') {
      fileList = this.fileListCO
    }
    // else if(custom1 == 'EM'){
    //   fileList = this.fileListEM
    // }else if(custom1 == 'EM'){

    // }

    for (let i = 0; i < fileList.length; i++) {
      console.log('File', data);
      this.UploadService(fileList[i], data, null);
    }
    if (custom1 == 'EM') {
      this.fileListEM = undefined
    } else if (custom1 == 'TR') {
      this.fileListTR = undefined
    } else if (custom1 == 'PL') {
      this.fileListPL == undefined
    } else if (custom1 == 'PB') {
      this.fileListPB = undefined
    } else if (custom1 == 'PR') {
      this.fileListPR = undefined
    } else if (custom1 == 'RP') {
      this.fileListRP == undefined
    } else if (custom1 == 'PP') {
      this.fileListPP = undefined
    } else if (custom1 == 'AO') {
      this.fileListAO == undefined
    } else if (custom1 == 'NG') {
      this.fileListNG = undefined
    } else if (custom1 == 'AJ') {
      this.fileListAJ == undefined
    }else if (custom1 == 'PO') {
      this.fileListPO == undefined
    }else if (custom1 == 'AC') {
      this.fileListAC == undefined
    } else if (custom1 == 'PV') {
      this.fileListPV == undefined
    } else if (custom1 == 'DE') {
      this.fileListDE == undefined
    }else if (custom1 == 'EX') {
      this.fileListEX == undefined
    }else if (custom1 == 'CE') {
      this.fileListCE == undefined
    }else if (custom1 == 'CO') {
      this.fileListCO == undefined
    }
    // this.fileListEM = undefined
    this.lcargando.ctlSpinner(false)

  }

  uploadFile2(identifier) {
    console.log('Presionado una vez');
    let data = {
      // Informacion para almacenamiento de anexo
      module: 20,
      component: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: identifier,
      custom1: 'archivo2',
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Ticket ${identifier}`,
      ip: this.commonService.getIpAddress()
    }

    for (let i = 0; i < this.fileList2.length; i++) {
      console.log('File', data);
      this.UploadService(this.fileList2[i], data, 'archivo2');
    }
    this.fileList2 = undefined
    // this.lcargando.ctlSpinner(false)
  }

  UploadService(file, payload?: any, custom1?: any): void {
    let cont = 0
    console.log('Se ejecuto con:', payload);
    this.contratoService.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {
      this.commonVrs.contribAnexoLoad.next({ id_cliente: this.listaSolicitudes['id_solicitud'], condi: 'dis', custom1: custom1 })
      setTimeout(() => {
        this.toastr.info('Carga exitosa', 'Anexos de trámite')
      }, 10)
    })
  }

  UploadService2(file, payload?: any, custom1?: any): void {
    let cont = 0
    console.log('Se ejecuto');
    this.contratoService.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {
      this.commonVrs.contribAnexoLoad2.next({ id_cliente: this.listaSolicitudes['id_solicitud'], condi: 'dis', custom1: custom1 })
    })
  }

  calcularTotalAprobado(){
    let valorTotalAprobado = 0;
    this.listaDetSolicitudes.forEach(element => {
       Object.assign(element,{ precio_aprobado:parseFloat(element.cantidad_aprobada) * parseFloat(element.precio_unitario_aprobado)})
      valorTotalAprobado += +element.precio_aprobado;
    });
    this.totalAprobado= valorTotalAprobado
  }

  expandListProveedores() {

    const modalInvoice = this.modalDet.open(ModalProveedoresComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fContratacion;

  }

  crearContrato() {

    if (this.listaSolicitudes.con_valor  != this.totalAprobado.toFixed(2) ){
      this.toastr.info("Valor Adjudicado no cuadra con la suma de los detalles")
        return;
    }

    this.today = new Date();
    this.fecha_hasta = moment(this.today).format('YYYY-MM-DD');

    let totalPrecioCotizado= 0
    let totalPrecioAprobado= 0
    this.listaDetSolicitudes.forEach(element => {
      totalPrecioCotizado += +parseFloat(element.precio_cotizado)
      totalPrecioAprobado += +parseFloat(element.precio_aprobado)
    });

    if (this.listaSolicitudes.con_adjudicado == "N") {
      if (this.listaSolicitudes.con_adj_observaciones == "" || this.listaSolicitudes.con_adj_observaciones == undefined) {
        this.toastr.info("Debe ingresar una observación si no existe adjudicado")
        return;
      }
    }
    // else if (this.listaSolicitudes.con_adjudicado == "S") {
    //   console.log("fecha")
    //   if (new Date(this.listaSolicitudes.con_fecha_adjudicacion) > new Date(this.fecha_hasta)) {
    //     this.toastr.info("La fecha ingresada no es valida")
    //     return;
    //   }
    // }
    else if (this.listaSolicitudes.con_extension == "S") {
      console.log("fecha")
      if (new Date(this.listaSolicitudes.con_fecha_extension) > new Date(this.fecha_hasta)) {
        this.toastr.info("La fecha ingresada no es valida")
        return;
      }
    }
    else if (this.listaSolicitudes.con_extension == "S") {
      if (this.listaSolicitudes.con_extension_observacion == "" || this.listaSolicitudes.con_extension_observacion == undefined) {
        this.toastr.info("Debe ingresar una observación")
        return;
      }
    }

    else if (this.listaSolicitudes.con_extension == "S") {
      if (this.listaSolicitudes.con_extension_resolucion == "" || this.listaSolicitudes.con_extension_resolucion == undefined) {
        this.toastr.info("Debe ingresar el número de la resolución")
        return;
      }
    }
    else if (this.listaSolicitudes.con_extension == "S") {
      if (this.listaSolicitudes.con_extension_valor <= 0) {
        this.toastr.info("Debe ingresar el número de la resolución")
        return;
      }
    }
    else if (this.listaSolicitudes.con_extension == "S") {

      if (this.listaSolicitudes.con_extension_idp == "" || this.listaSolicitudes.con_extension_idp == undefined) {
        this.toastr.info("Debe ingresar el IDP")
        return;
      }
    }else if(this.listaSolicitudes.con_valor > totalPrecioAprobado){
      this.toastr.info('El valor adjudicado de $'+ this.commonService.formatNumberDos(this.listaSolicitudes.con_valor) +' no puede ser mayor al precio aprobado de $'+ this.commonService.formatNumberDos(totalPrecioAprobado))
        return;
    }
    this.extensionDisabled = false



    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un proceso de contratación?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.mensajeSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment().format('YYYY')),
          "mes": Number(moment().format('MM')),
        }
        console.log(datos)
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.mensajeSpinner = "Guardando ...";
              this.lcargando.ctlSpinner(true);

              let data = {
                id: this.item.id_solicitud,
                con_adjudicado: this.listaSolicitudes.con_adjudicado,
                con_valor: this.listaSolicitudes.con_valor,
                con_fecha_adjudicacion: this.listaSolicitudes.con_fecha_adjudicacion,
                con_fecha_contrato: this.listaSolicitudes.con_fecha_contrato,
                con_cod_sercop: this.listaSolicitudes.con_cod_sercop,
                fk_con_proveedor: this.fk_proveedor,
                con_contrato: this.listaSolicitudes.con_contrato,
                con_num_proceso: this.listaSolicitudes.con_num_proceso,
                con_admin_contrato: this.listaSolicitudes.con_admin_contrato,
                con_anticipo: this.listaSolicitudes.con_anticipo,
                con_adj_observaciones: this.listaSolicitudes.con_adj_observaciones,
                con_estado: this.listaSolicitudes.con_estado,
                adj_nro_resolucion: this.listaSolicitudes.adj_nro_resolucion,
                con_extension:this.listaSolicitudes.con_extension,
                con_fecha_extension: this.listaSolicitudes.con_fecha_extension,
                con_extension_valor: this.listaSolicitudes.con_extension_valor,
                con_extension_idp: this.listaSolicitudes.con_extension_idp,
                con_extension_observacion: this.listaSolicitudes.con_extension_observacion,
                con_extension_resolucion: this.listaSolicitudes.con_extension_resolucion,
                con_anticipo_porcentaje: this.listaSolicitudes.con_anticipo_porcentaje,
                con_plazo: this.listaSolicitudes.con_plazo,
                con_forma_pago: this.listaSolicitudes.con_forma_pago

              }
              console.log(data)
              this.contratoService.guardarContrato(data.id, data).subscribe(
                (res) => {
                  console.log(res)
                  if (res["status"] == 1) {

                    this.lcargando.ctlSpinner(false);

                    if (!!this.fileList2) {
                      this.uploadFile2(res['data']['id_solicitud']);
                    }


                    console.log(res);
                    Swal.fire({
                      icon: "success",
                      title: "Proceso de contratación realizado con éxito",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',

                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.crearBitacora()
                        this.model = true

                      }
                    });
                  }
                  else {
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
                  console.log(error)
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.message);
                }
              )

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })
      }
    })

  }


    calculartotaladjudicado(){
      console.log("calculando");
      this.totalAdjudicado = 0;
      this.listaDetSolicitudes.forEach(item =>{
        const precioFloat = parseFloat(item.precio_aprobado).toFixed(2);
    // Suma el valor transformado
    this.totalAdjudicado += parseFloat(precioFloat);
         //+= parseFloat(item.precio_aprobado).toFixed(2);//item.precio_aprobado;
      })
      this.listaSolicitudes.con_valor = this.totalAdjudicado
    }



  cargarCondiciones() {
    // this.lcargando.ctlSpinner(true);
    let data = {
    }
    this.contratoService.listarCondiciones(data, this.item['id_solicitud']).subscribe(
      (res) => {
        console.log(res)

        let valorTotalCondiciones = 0;

        this.listarCondiciones = res;
        this.listarCondiciones.forEach(element => {
          valorTotalCondiciones += +parseFloat(element.valor);
        });
        this.totalCondiciones= valorTotalCondiciones
        console.log(this.listarCondiciones);

      },
      (error) => {
        // this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  crearPoliza() {

    if(this.listaPoliza.forma_garantia == undefined || this.listaPoliza.forma_garantia == "") {
      this.toastr.info("Debe seleccionar una forma de garantía")
      return
    }else if (new Date(this.listaPoliza.fecha_inicio) >= new Date(this.listaPoliza.fecha_finalizacion)) {
      this.toastr.info("Debe ingresar una fecha válida para la garantía")
      return
    }
    else if(this.listaPoliza.forma_garantia == 'POLIZA'  && (this.listaPoliza.num_poliza == undefined || this.listaPoliza.num_poliza == "") ) {
      this.toastr.info("Debe ingresar un número de poliza")
      return
    }
    else if(this.listaPoliza.valor <= 0 ) {
      this.toastr.info("Debe ingresar un valor mayor a 0")
      return
    }
    else if(this.listaPoliza.valor <= 0 ) {
      this.toastr.info("Debe ingresar un valor mayor a 0")
      return
    }
    else if(this.listaPoliza.forma_garantia == 'POLIZA' && (this.listaPoliza.aseguradora == undefined || this.listaPoliza.aseguradora == "")) {
      this.toastr.info("Debe seleccionar una aseguradora")
      return
    }
    else if( this.listaPoliza.riesgo == undefined || this.listaPoliza.riesgo == "") {
      this.toastr.info("Debe seleccionar un riesgo asegurado")
      return
    }

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar la garantía ?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.mensajeSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment().format('YYYY')),
          "mes": Number(moment().format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              this.mensajeSpinner = "Cargando...";
              this.lcargando.ctlSpinner(true);

              let data = {
                listaPoliza: {
                  cod_sercop: this.listaPoliza.cod_sercop,
                  fecha_inicio: this.listaPoliza.fecha_inicio,
                  fecha_finalizacion: this.listaPoliza.fecha_finalizacion,
                  num_poliza: this.listaPoliza.num_poliza,
                  valor: this.listaPoliza.valor,
                  aseguradora: this.listaPoliza.aseguradora,
                  riesgo: this.listaPoliza.riesgo,
                  fk_solicitud: this.item.id_solicitud,
                  forma_garantia: this.listaPoliza.forma_garantia,
                  estado: "P"
                }
              }
              this.contratoService.guardarPoliza(data).subscribe(
                (res) => {
                  console.log(res);
                  if (res["status"] == 1) {
                    this.lcargando.ctlSpinner(false);

                    Swal.fire({
                      icon: "success",
                      title: "Se guardo con éxito la garantía",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        console.log("hola")
                        this.cargarPoliza()
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

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })
      }
    });
  }

  cargarPoliza() {
    // this.lcargando.ctlSpinner(true);
    let data = {
    }
    this.contratoService.listarPoliza(data, this.item['id_solicitud']).subscribe(
      (res) => {
        console.log(res)
        console.log("prueba");
        this.listPoliza = res;
      },
      (error) => {
        // this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }


  catalogo() {

    this.contratoService.listarCatalogo({}).subscribe((res: any) => {
      console.log(res);
      res.map((data) => {
        this.listaCatalogo.push(data.descripcion)

      })
    })
  }

  eliminarCondicion(id) {
    console.log(id);
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar esta condicion?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Eliminando...";
        this.lcargando.ctlSpinner(true);
        this.contratoService.eliminarCondiciones(id).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.lcargando.ctlSpinner(false);
              this.cargarCondiciones();
              console.log(res);
              Swal.fire({
                icon: "success",
                title: "Registro Eliminado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              });
            }
            else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        )
      }
    })
  }

  eliminarPoliza(id) {
    console.log(id);
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar esta poliza?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Eliminando...";
        this.lcargando.ctlSpinner(true);
        this.contratoService.eliminarPoliza(id).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.lcargando.ctlSpinner(false);
              this.cargarPoliza()
              console.log(res);
              Swal.fire({
                icon: "success",
                title: "Registro Eliminado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              });
            }
            else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        )
      }
    })
  }

  crearBitacora() {
    this.today = new Date();
    this.fecha_hasta = moment(this.today).format('YYYY-MM-DD');
    this.mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let data = {
      listaBitacora: {
        fk_solicitud: this.item["id_solicitud"],
        estado: this.listaSolicitudes.con_estado,
        fecha: this.fecha_hasta,
      }
    }
    this.contratoService.crearBitacora(data).subscribe(
      (res) => {
        console.log(res);

        if (res["status"] == 1) {
          this.lcargando.ctlSpinner(false);
          console.log("bitacora")
          this.cargarBitacora()
        }
        else {
          console.log("no entro")
          this.lcargando.ctlSpinner(false);

        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  cargarBitacora() {

    let data = {
    }
    this.contratoService.listarBitacora(data, this.item['id_solicitud']).subscribe(
      (res) => {
        console.log(res)
        // console.log("listabitacora");
        this.listaBitacora = res;


      },
      (error) => {
        // this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  aseguradora() {

    this.contratoService.listarAseguradoras({}).subscribe((res: any) => {
      console.log(res);
      res.map((data) => {
        this.listaAseguradora.push(data.descripcion)

      })
    })
  }

  garantia() {

    this.contratoService.listarGarantias({}).subscribe((res: any) => {
      console.log(res);
      res.map((data) => {
        this.listaGarantia.push(data)
        console.log(this.listaGarantia)

      })
    })
  }

   expandListAdminCompra() {

      const modalInvoice = this.modalDet.open(EncargadoComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
     // modalInvoice.componentInstance.permissions = this.permissions;

    }
    onlyNumber(event): boolean {
      let key = (event.which) ? event.which : event.keyCode;
      if (key > 31 && (key < 48 || key > 57)) {
        return false;
      }
      return true;
    }



}
