import { Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import * as myVarGlobals from "../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { CatalogoElectronicoService } from '../catalogo-electronico.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-modal-orden-compra',
  templateUrl: './modal-orden-compra.component.html',
  styleUrls: ['./modal-orden-compra.component.scss']
})
export class ModalOrdenCompraComponent implements OnInit, OnDestroy {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;

  fTitle = "Orden de Pago";
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
  adminActive: any = {
    nombre:"",

  };
  adjudicadoChecked: boolean = true;
  ordenCompra: any = {
    fk_proveedor:0,
    num_orden:"",
    fecha_publicacion:moment(new Date()).format('YYYY-MM-DD'),
    fecha_aceptacion: moment(new Date()).format('YYYY-MM-DD'),
    admin_compra: "",
    observacion:"",
    estado: 'A',
    valor: 0,
    id: null,
  }
  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  fecha_generacion: any;
  fecha_aceptacion: any;

  cmb_estado = [
    { valor: 'A', label: 'ACTIVO' },
    { valor: 'I', label: 'INACTIVO' },
  ]
  onDestroy$ = new Subject<void>();


  @Input() item: any;
  @Input() isNew: any;
  @Input() valorTotalOrdenes: number;
  @Input() totalAprobado: number;

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
    this.commonVrs.encargadoSelect.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        this.adminActive.id_empleado= res['id_empleado']
        this.adminActive.nombre = res['emp_primer_nombre'] + " " + res['emp_primer_apellido']
      }
    );



   }
  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsOrdenComp",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },

      {
        orig: "btnsOrdenComp",
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

    if(!this.isNew){
     console.log('ver')
     console.log(this.item)
     this.proveedorActive.razon_social=this.item.proveedor?.razon_social
     this.proveedorActive.id_proveedor = this.item.proveedor?.id_proveedor
    //  this.adminActive.nombre=this.item.empleado?.emp_full_nombre
     this.ordenCompra.num_orden=this.item.num_orden
     this.ordenCompra.fecha_publicacion=this.item.fecha_publicacion
     this.ordenCompra.fecha_aceptacion=this.item.fecha_aceptacion
     this.ordenCompra.admin_compra=this.item.admin_compra
     this.ordenCompra.observaciones=this.item.observaciones
     this.ordenCompra.estado = this.item.estado
     this.ordenCompra.id = this.item.id_ordenes
     this.ordenCompra.valor = this.item.valor
    // this.vmButtons[0].showimg=true
     /* this.vmButtons = [
      {
        orig: "btnsOrdenComp",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }

    ]; */

    }else{
      console.log(this.item)
      console.log('nuevo')
    }
    /* setTimeout(() => {
      // this.catElecDetalles = this.item['detalles']
      // this.detalles.programa = this.item['catalogo_programa'][0]['valor']

      // console.log(' Programa '+this.detalles.programa)
      // this.detalles.departamento = this.item['catalogo_departamento']['valor']
      // this.detalles.atribucion = this.item['catalogo']['valor']
      // this.datosCatElec = this.item
      // if(this.item['tipo_proceso']=='CAT'){
      //   this.detalles.proceso = 'CATALOGO ELECTRÓNICO'
      // }



    }, 50); */
    //getOrdenesCompraCatElec
    // console.log('Item '+this.item)
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    // this.fecha_publicacion= moment(this.firstday).format('YYYY-MM-DD');
    // this.fecha_aceptacion= moment(this.today).format('YYYY-MM-DD');

    // this.vmButtons[0].showimg=true
    //this.vmButtons[1].showimg=true


  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        //this.model = true
        this.guardarOrdenCompra()
        break;
      case "REGRESAR":
        this.closeModal()
       // this.model = true
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
  async guardarOrdenCompra() {
    let invalid = ''

    if (this.proveedorActive.id_proveedor == undefined) invalid += '* No ha seleccionado un Proveedor.<br>'
    if (this.ordenCompra.num_orden.trim() == '') invalid += '* No ha ingresa un Numero de Orden.<br>'
    // console.log(this.valorTotalOrdenes + parseFloat(this.ordenCompra.valor), this.totalAprobado, this.valorTotalOrdenes + parseFloat(this.ordenCompra.valor) > this.totalAprobado)
    if ((this.valorTotalOrdenes) + parseFloat(this.ordenCompra.valor) > this.totalAprobado) invalid += `* Esta Orden de Compra ($${this.ordenCompra.valor}) excede lo disponible del Valor Aprobado ($${this.totalAprobado - this.valorTotalOrdenes}).`

    if (invalid.length > 0) {
      this.toastr.warning(invalid, 'Validacion de Datos', {enableHtml: true})
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar Orden de Compra?",
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
              id_solicitud:this.item.id_solicitud ?? this.item.fk_solicitud
            },
            datos: {
              id_ordenes: this.ordenCompra.id,
              fk_proveedor:this.proveedorActive.id_proveedor,
              num_orden: this.ordenCompra.num_orden,
              fecha_publicacion: this.ordenCompra.fecha_publicacion,
              fecha_aceptacion: this.ordenCompra.fecha_aceptacion,
              // admin_compra: this.adminActive.id_empleado,
              valor: this.ordenCompra.valor,
              observaciones:this.ordenCompra.observaciones,
              estado: this.ordenCompra.estado,
              //id_usuario: this.dataUser.user_token_id
            }
          }

          this.service.setCatElecOrdenes(data).subscribe(
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
                    this.ordenCompra= res['data']
                    this.closeModal()
                    this.commonVrs.CpCatElecOrden.next(res['data']);
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
              console.log(error)
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error?.message);
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



  expandListProveedores() {
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Proveedores.", this.fTitle);
    // } else {
      const modalInvoice = this.modalService.open(ModalProveedoresComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
    }

    expandListAdminCompra() {
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Proveedores.", this.fTitle);
    // } else {
      const modalInvoice = this.modalService.open(EncargadoComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;

    }
  //}
  closeModal() {
    //this.commonVrs.CpCatElecOrden.next(this.needRefresh);
    this.commonVrs.CpCatElecOrden.next(null);
    this.activeModal.dismiss();
  }

  async cambiarEstadoOrden(orden: any) {
    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Cambiando Estado de Orden'
    try {
      const response = await this.service.setEstadoOrden({orden})
      console.log(response)
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cambiando Estado de Orden')
    }
  }

}
