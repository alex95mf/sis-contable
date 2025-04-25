import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ConciliacionService } from '../conciliacion.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from "../../../../../global";


@Component({
  selector: 'app-movimiento-bancario-form',
  templateUrl: './movimiento-bancario-form.component.html',
  styleUrls: ['./movimiento-bancario-form.component.scss']
})
export class MovimientoBancarioFormComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  dataUser: any = {};
  vmButtons: any = {};
  needRefresh: boolean = false;
  movimiento: any
  datos: any
  deshabilitar: boolean= false

  bankSelect: any = null;
  arrayBanks: any;

  cmb_periodo: any[] = []
  arrayMes: any =
  [
    {id: 1,name: "Enero" },
    {id: 2, name: "Febrero"},
    {id: 3,name: "Marzo"},
    {id: 4,name: "Abril"},
    {id: 5,name: "Mayo"},
    {id: 6,name: "Junio"},
    {id: 7,name: "Julio"},
    {id: 8,name: "Agosto"},
    {id: 9,name: "Septiembre"},
    {id: 10,name: "Octubre"},
    {id: 11,name: "Noviembre"},
    {id: 12,name: "Diciembre"},
  ];

  tipo_movimientos: any =
  [
    {id: "D",name: "Débito"},
    {id: "C",name: "Crédito"},
  ];

  estado_movimiento: any = [
    {id: "A",name: "Activo"},
    {id: "I",name: "Inactivo"}
  ]

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private conciliacionSrv: ConciliacionService,
    private commonVarSrv: CommonVarService,
    private cierremesService: CierreMesService,
    private modalSrv: NgbModal) { }

  ngOnInit(): void {

    this.vmButtons = [
       {
           orig: "btnMovForm",
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
           orig: "btnMovForm",
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

   
       
    this.movimiento = {
      id_banco: 0,
      cuenta_banco: '',
      anio: null,
      mes: null,
      valor: 0,
      tipo_movimiento: 0,
      numero: '',
      detalle: '',
      estado: 0,
      id_usuario: 0,
      fecha: moment(new Date()).format('YYYY-MM-DD')
    }
    
    setTimeout(()=> {
      this.getInfoBank()
      this.cargaInicial() 
      this.validaPermisos();
    }, 0);

    if(!this.isNew){
      this.getInfoBank()
      this.datos = JSON.parse(JSON.stringify(this.data));
      console.log(this.datos)
      this.movimiento = this.datos
      this.bankSelect = this.datos?.id_banco
      this.movimiento.fecha = moment(this.datos?.fecha).format('YYY-MM-DD')
      this.movimiento.valor = this.datos?.tipo_movimiento == 'D' ? this.datos?.debito : (this.datos?.tipo_movimiento == 'C' ? this.datos?.credito : 0 )
      
      
      this.deshabilitar=true;
    }
  }
  ChangeMesCierrePeriodosMov(evento: any) {
    
    this.movimiento.mes = evento;
    //this.movimiento.mes = (Number().format('MM'))).toString();
  } 

  validaPermisos = () => {
    this.mensajeSppiner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
   // this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fConciliacionBank,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
        
           
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " GUARDAR":
        this.validarMoimientoBancario();
        break;
      case " REGRESAR":
          this.closeModal();
          break;
       
    }
  
  }
  async cargaInicial() {
    try {
      this.lcargando.ctlSpinner(true);
      const resPeriodos = await this.conciliacionSrv.getPeriodos()
      this.cmb_periodo = resPeriodos
      this.lcargando.ctlSpinner(false);
    } catch (err) {
      this.lcargando.ctlSpinner(false);
    }
  }

  getInfoBank() {
    this.conciliacionSrv.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe(res => {

      console.log(res['data']);

      this.arrayBanks = res['data'];
      //this.bankSelect = 0;
      // if (this.arrayBanks.length > 0) {
      //   this.bankSelect = this.arrayBanks[0].id_banks;
      // }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  bankSelected(event){
    if(event){
      this.movimiento.id_banco = event
      console.log(this.arrayBanks)
      console.log(event)
      let bancoFilter = this.arrayBanks.filter(e => e.id_banks == event)
      console.log(bancoFilter)
      this.movimiento.cuenta_banco = bancoFilter[0].cuenta_contable
    }

   
    console.log(this.movimiento.id_banco)
    console.log(this.movimiento.cuenta_banco)
  }

  async validarMoimientoBancario() {
    if (this.isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar Movimientos Bancarios");

    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para ver Movimientos Bancarios.", this.fTitle);
    } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
 
          if (this.isNew) {
            this.guardarMovimientoBan();
          } else {
            this.editarMovimientoBan();
          }

        }
      });
    }
  }

  
  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.movimiento.anio == '' ||
        this.movimiento.anio == undefined
      ) {
        this.toastr.info("Debe seleccionar un Período");
        flag = true;
      }
      else if (
        this.movimiento.mes == 0 ||
        this.movimiento.mes == undefined
      ) {
        this.toastr.info("Debe seleccionar un Mes");
        flag = true;
      } else if (
        this.movimiento.tipo_movimiento == 0||
        this.movimiento.tipo_movimiento == undefined
      ) {
        this.toastr.info("Debe seleccionar un Tipo de Movimiento ");
        flag = true;
      }
      else if (
        this.movimiento.id_banco == 0 || this.movimiento.id_banco == undefined
      ) {
        this.toastr.info("Debe seleccionar un banco");
        flag = true;
      }
      else if (
        this.movimiento.numero == '' ||
        this.movimiento.numero== undefined
      ) {
        this.toastr.info("El campo Número Transacción no puede ser vacío");
        flag = true;
      }
      else if (
        this.movimiento.valor == 0 ||
        this.movimiento.valor== undefined
      ) {
        this.toastr.info("El campo Valor no puede ser vacío");
        flag = true;
      }

      !flag ? resolve(true) : resolve(false);
    })
  }

  guardarMovimientoBan(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo Movimiento Bancario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.mensajeSppiner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let data = {
          "anio": Number(this.movimiento.anio),
          "mes": this.movimiento.mes
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
          
          /* Validamos si el periodo se encuentra aperturado */
          if (res["data"][0].estado !== 'C') {
           
            this.mensajeSppiner = "Guardando Movimiento Bancario...";
            this.lcargando.ctlSpinner(true);
            console.log(this.dataUser);
            this.movimiento.id_usuario= this.dataUser['id_usuario'];
            this.movimiento['estado'] = 'A'
            this.movimiento.fecha = moment(this.movimiento.fecha).format('YYYY-MM-DD')
            
            console.log(this.movimiento);
            this.conciliacionSrv.guardarMovBancario(this.movimiento).subscribe(
              (res) => {
                console.log(res);
                if (res["status"] == 1) {
                  this.needRefresh = true;
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "success",
                    title: "Movimiento Bancario Guardado",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.closeModal();
                    // this.commonVarSrv.mesaAyuTicket.next(res['data']);
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
                console.log(error);
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

  editarMovimientoBan(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este Movimiento Bancario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.mensajeSppiner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(this.movimiento.anio),
            "mes": this.movimiento.mes
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
            
            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
             
              this.mensajeSppiner = "Editando Movimiento Bancario...";
              this.lcargando.ctlSpinner(true);
              console.log(this.dataUser);
              this.movimiento.id_usuario= this.dataUser['id_usuario'];
              this.movimiento['id_detalle_movimiento'] = this.datos?.id_detalle_movimiento
              
              console.log(this.movimiento);
              this.conciliacionSrv.editarMovBancario(this.movimiento).subscribe(
                (res) => {
                  console.log(res);
                  if (res["status"] == 1) {
                    this.needRefresh = true;
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "success",
                      title: "Movimiento Bancario Guardado",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.closeModal();
                      // this.commonVarSrv.mesaAyuTicket.next(res['data']);
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
                  console.log(error);
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
  closeModal() {
    //this.commonVarSrv.seguiTicket.next(this.needRefresh);
    this.conciliacionSrv.movimientos$.emit(this.needRefresh)
    this.activeModal.dismiss();
  }

}
