import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import * as myVarGlobals from "../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ToastrService } from 'ngx-toastr';
import { ModalOrdenCompraComponent } from '../modal-orden-compra/modal-orden-compra.component';
import { CatalogoElectronicoService } from '../catalogo-electronico.service';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';



@Component({
standalone: false,
  selector: 'app-detalle-catalogo-electronico',
  templateUrl: './detalle-catalogo-electronico.component.html',
  styleUrls: ['./detalle-catalogo-electronico.component.scss']
})
export class DetalleCatalogoElectronicoComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  fTitle = "Catalogo Electrónico";
  msgSpinner: string;
  vmButtons: any = [];
  listaSolicitudes: any = []
  programa: any = []
  departamento: any = []
  atribucion: any = []
  asigna: any = []
  proceso: any = []
  permissions: any;
  empresLogo: any;
  dataUser: any;
  needRefresh: boolean = false;
  proveedorActive: any = {
    razon_social: ""
  };
  adjudicadoChecked: boolean = true;
  catElecDetalles: any = []
  ordenes: any = []

  detalles: any = {
    programa: null,
    departamento: null,
    atribucion: null,
    asigna: null,
    proceso: null,
    orden: [],
  }
  valorTotalOrdenes: number = 0;

  datosCatElec: any = {
    proceso: "",
    cod_cate: ""
  }
  disabledCampo: boolean = false;

  totalCotizado: any = 0
  totalAprobado: any = 0

  @Input() item: any;
  @Input() model: any;

  fileList: FileList;
  adminActive: any = {
    nombre: "",

  };

  datosAdminElec: any = {
    id_empleado: 0,

  }

  onDestroy$: Subject<void> = new Subject();
  cmb_estado = []

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private service: CatalogoElectronicoService,
    private cierremesService: CierreMesService

  ) {
    this.commonVrs.selectProveedorCustom.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        this.proveedorActive = res;
      }
    );
    this.commonVrs.CpCatElecOrden.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        //this.detalles.orden.push(res);
        this.cargarOrdenes()
        // this.commonVrs.encargadoSelect.next()

      }
    );
    this.commonVrs.compPubInfimas.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        if (res.custom1 == 'CAT-ELECTRONICO') {
          this.disabledCampo = res.validacion;
        }

      }
    );

    this.commonVrs.encargadoSelect.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        this.adminActive.id_empleado = res['id_empleado']
        this.adminActive.nombre = res['emp_primer_nombre'] + " " + res['emp_primer_apellido']
      }
    )

  }
  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()
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
        orig: "btnsDetaCatElec",
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

    setTimeout(() => {
      console.log(this.item)
      console.log(this.item['ordenes'])
      //console.log(this.item['ordenes'])
      let valorTotalCotizado = 0;
      let valorTotalAprobado = 0;
      this.item['detalles'].forEach(element => {
        valorTotalCotizado += +element.precio_cotizado; 
        valorTotalAprobado += +element.precio_aprobado; 
        
      });
      this.totalCotizado= valorTotalCotizado
      this.totalAprobado= valorTotalAprobado
      this.catElecDetalles = this.item['detalles']
      //this.detalles.programa = this.item['catalogo_programa'][0]['valor']

      //console.log(' Programa '+this.detalles.programa)
      //this.detalles.departamento = this.item['catalogo_departamento']['valor']
      //this.detalles.atribucion = this.item['catalogo']['valor']
      this.detalles.orden = this.item['ordenes']
      this.detalles.proveedorOrden = this.item['ordenes']['proveedor']
      this.datosCatElec = this.item
      if (this.item['administrador'] != null) {
        this.datosAdminElec = this.item['administrador']
        Object.assign(this.adminActive, {
          id_empleado: this.item['administrador']['id_empleado'],
          nombre: this.item['administrador']['emp_full_nombre']
        })
      }

      if (this.item['tipo_proceso'] == 'Catalogo Electronico') {
        this.detalles.proceso = 'CATALOGO ELECTRÓNICO'
      }
      this.cargarOrdenes();
      this.getCatalogos()
    }, 0);
    //console.log('Item '+this.item)

  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {

      case "REGRESAR":
        // this.closeModal()
        break;
    }
  }
  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fRenPredUrbanoEmision,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {

        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  async getCatalogos() {
    this.lcargando.ctlSpinner(true)
    try {
      let estados = await this.service.getCatalogos({params: "'CMP_CE_ESTADO'"}).toPromise<any>()
      console.log(estados)

      this.cmb_estado = estados.data['CMP_CE_ESTADO']
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(true)
      this.toastr.error(err.error?.message, 'Error cargando Catalogo')
    }
  }


  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Cierre')
      }, 50)
    }
  }
  uploadFile() {
    console.log('upload files')
    let data = {
      //module: this.permissions.id_modulo,
      module: 20,
      component: myVarGlobals.fCompPubInfi,
      identifier: this.item.id_solicitud,
      id_controlador: myVarGlobals.fCompPubInfi,
      accion: `Nuevo anexo para Anexo de Cierres Catalogo Electrónico ${this.item.id_solicitud}`,
      ip: this.commonService.getIpAddress(),
      custom1: 'CAT-ELECTRONICO'
    }
    if (this.fileList.length != 0) {
      for (let i = 0; i < this.fileList.length; i++) {
        this.UploadService(this.fileList[i], data);
      }
    }
    this.fileList = undefined
    this.lcargando.ctlSpinner(false)
  }
  UploadService(file, payload?: any): void {
    this.service.uploadAnexo(file, payload).subscribe(
      res => {
        this.commonVrs.contribAnexoLoad.next({ condi: 'infimas' })
      },
      err => {
        this.toastr.info(err.error.message);
      })
  }

  cargarOrdenes() {
    //getOrdenesCompraCatElec
    this.msgSpinner = 'Cargando Ordenes...';
    this.lcargando.ctlSpinner(true);

    let data = {
      id_solicitud: this.item.id_solicitud
    };

    this.service.getOrdenesCompraCatElec(data).subscribe(
      res => {
        console.log(res)
        if (res["status"] == 1) {
          //this.needRefresh = true;
          this.lcargando.ctlSpinner(false);
          this.detalles.orden = res["data"];
          this.valorTotalOrdenes = this.detalles.orden.reduce((acc: number, curr: any) => {
            if (curr.estado == 'A') return acc + parseFloat(curr.valor)
            return acc;
          }, 0)
        }
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error cargando Ordenes')
      }
    )
  }


  expandModalOrden(isNew: boolean, item) {
    //console.log();
    let modal = this.modalService.open(ModalOrdenCompraComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.item = item;
    modal.componentInstance.isNew = isNew;
    modal.componentInstance.valorTotalOrdenes = this.valorTotalOrdenes
    modal.componentInstance.totalAprobado = this.totalAprobado
  }

  async validaDetallesCatElec() {
  
    this.catElecDetalles.forEach(element => {
      if (element.precio_aprobado > element.precio_cotizado){
        this.toastr.info("El valor aprobado: "+element.precio_aprobado+
        " super al precio cotizado: "+element.precio_cotizado) 
        return
      }
     
     
    });
    this.validaDatos().then(respuesta => {
      if (respuesta) {
        this.confirmSave("Seguro desea guardar los detalles de esta solicitud ?", "SAVE_DETALLES");
      }
    }).catch((err) => {
      console.log(err);
      this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    });

}
validaDatos() {
  console.log(this.totalAprobado.toFixed(2), this.totalCotizado.toFixed(2))
  console.log(this.totalAprobado.toFixed(2) > this.totalCotizado.toFixed(2))
  let c = 0;
  let mensajes: string = '';
  return new Promise((resolve, reject) => {
     
    if(this.totalAprobado.toFixed(2) > this.totalCotizado.toFixed(2)){
      mensajes += "El valor total aprobado de $"+ this.commonService.formatNumberDos(this.totalAprobado.toFixed(2)) +" no puede ser mayor al valor total cotizado de $" 
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
    //type: "warning",
    showCancelButton: true,
    cancelButtonColor: '#DC3545',
    confirmButtonColor: '#13A1EA',
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
   // this.processing = false;
    if (result.value) {
      if (action == "SAVE_DETALLES") {
        this.guardarCatElecDetalles();
      } 
    }
  })
}

guardarCatElecDetalles(){
  this.msgSpinner = "Verificando período contable";
  this.lcargando.ctlSpinner(true);
  let datos = {
    "anio": Number(moment().format('YYYY')),
    "mes": Number(moment().format('MM')),
  }
  console.log(datos)
  this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
  
  /* Validamos si el periodo se encuentra aperturado */
    if (res["data"][0].estado !== 'C') {
        
    let data = {
      detalles: this.catElecDetalles,
      totalAprobado: this.totalAprobado,
    }
    this.lcargando.ctlSpinner(true);
    this.service.saveCatElecDetalles(data).subscribe(
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
            valorTotalCotizado += +element.precio_cotizado; 
            valorTotalAprobado += +element.precio_aprobado; 
            
          });
          this.totalCotizado= valorTotalCotizado
          this.totalAprobado= valorTotalAprobado
        
          
          this.catElecDetalles= res['data']
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

  guardarCatElecDatos() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar datos SERCOP?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {

            this.msgSpinner = "Verificando período contable";
            this.lcargando.ctlSpinner(true);
            let datos = {
              "anio": Number(moment().format('YYYY')),
              "mes": Number(moment().format('MM')),
            }
            console.log(datos)
            this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
            
            /* Validamos si el periodo se encuentra aperturado */
              if (res["data"][0].estado !== 'C') {
              
                this.msgSpinner = "Guardando datos...";
                this.lcargando.ctlSpinner(true);
    
                let data = {
                  catelec: {
                  id_solicitud: this.item.id_solicitud
                  },
                  datos: {
                    proceso: this.datosCatElec.ce_proceso,
                    cod_cate: this.datosCatElec.ce_cod_cate
                  }
                  }

                this.service.setCatElecDatos(data).subscribe(
                  (res) => {
                    // console.log(res);
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
                      }).then((result) => {
                        if (result.isConfirmed) {
                          //this.limpiar();
                          this.datosCatElec = res['data']
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

  onCheckboxChange(event: any) {

    if (event.target.checked) {
      //console.log(event.target.checked)
      this.adjudicadoChecked = true;
    } else {
      //console.log('unchecked')
      //console.log(event.target.checked)
      this.adjudicadoChecked = false;
    }
  }
  onlyNumber(event): boolean {
    // console.log(event);
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }
  calcularTotalAprobado(){
    let valorTotalAprobado = 0;
    this.catElecDetalles.forEach(element => {
       Object.assign(element,{ precio_aprobado:parseFloat(element.cantidad_aprobada) * parseFloat(element.precio_unitario_aprobado)})
      valorTotalAprobado += +element.precio_aprobado; 
    });
    this.totalAprobado= valorTotalAprobado
  }

  expandListProveedores() {
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Proveedores.", this.fTitle);
    // } else {
    const modalInvoice = this.modalService.open(ModalProveedoresComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    //modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    //modalInvoice.componentInstance.validacion = 8;
  }
  //}

  expandListAdminCompra() {
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Proveedores.", this.fTitle);
    // } else {
    const modalInvoice = this.modalService.open(EncargadoComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;

  }


  async guardarCatAdmin() {
    const result = await Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar datos de Ordenes de Compra?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    })

    if (result.isConfirmed) {


      this.msgSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);
      let datos = {
        "anio": Number(moment().format('YYYY')),
        "mes": Number(moment().format('MM')),
      }
      console.log(datos)
      this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
      
      /* Validamos si el periodo se encuentra aperturado */
        if (res["data"][0].estado !== 'C') {
          this.msgSpinner = "Guardando datos...";
          this.lcargando.ctlSpinner(true);
    
          let data = {
            catelec: {
              id_solicitud: this.item.id_solicitud
            },
            datos: {
              id_empleado: this.adminActive.id_empleado,
              ce_resolucion: this.item.ce_resolucion,
              ce_fecha_aceptacion: this.item.ce_fecha_aceptacion,
              ce_estado: this.item.ce_estado,
              ce_observacion: this.item.observacion,
            }
          }
    
          this.service.setCatAdminDatos(data).subscribe(
            (res) => {
              console.log(res)
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "success",
                  title: "Los Datos fueron guardados con éxito",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                }).then((result) => {
                  if (result.isConfirmed) {
                    //this.limpiar();
                    this.datosAdminElec = res['data']
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
  }
}
