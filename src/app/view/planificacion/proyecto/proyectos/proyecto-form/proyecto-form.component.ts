import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from "../../../../../global";
import { ProyectosService } from './../proyectos.service';

@Component({
standalone: false,
  selector: 'app-proyecto-form',
  templateUrl: './proyecto-form.component.html',
  styleUrls: ['./proyecto-form.component.scss']
})
export class ProyectoFormComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
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

   proyecto:any={};
  @Input() lista_estados:any={};
  @Input() lista_proyectos: any[] = [];
  @Input() cmb_periodo: any[] = [];

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private proyectoSrv: ProyectosService,
    private commonVarSrv: CommonVarService,
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
     // this.getInfoBank()
      this.cargaInicial() 
      this.validaPermisos();
    }, 0);

    if(!this.isNew){
   //   this.getInfoBank()
      this.datos = JSON.parse(JSON.stringify(this.data));
      this.proyecto = this.datos

     
      this.deshabilitar=true;
    }
    else
    {

      this.proyecto = {
        id_proyecto: 0,
        fk_programa:null,
        anio:  Number(moment(new Date()).format('YYYY')),
        estado : 'A',
        secuencia:'000',
        descripcion :''
      };



    }
  }
  ChangeMesCierrePeriodosMov(evento: any) {
    this.movimiento.mes = evento;
    //this.movimiento.mes = (Number().format('MM'))).toString();
  } 

  validaPermisos = () => {
    this.mensajeSpinner = 'Cargando Permisos de Usuario...';
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
        this.validarProyecto();
        break;
      case " REGRESAR":
          this.closeModal();
          break;
       
    }
  
  }
  async cargaInicial() {
    try {
      this.lcargando.ctlSpinner(true);
      const resPeriodos = await this.proyectoSrv.getPeriodos()
      this.cmb_periodo = resPeriodos
      this.lcargando.ctlSpinner(false);
    } catch (err) {
      this.lcargando.ctlSpinner(false);
    }
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

  async validarProyecto() {
    if (this.isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar Proyectos");
    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Proyectos.", this.fTitle);
    } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          if (this.isNew) {
            this.guardarProyecto();
          } else {
            this.editarProyecto();
          }
        }
      });
    }
  }

  
  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.proyecto.anio == '' ||
        this.proyecto.anio == undefined
      ) {
        this.toastr.info("Debe seleccionar un Período");
        flag = true;
      }
      else if (
        this.proyecto.fk_programa == 0||
        this.proyecto.fk_programa == undefined
      ) {
        this.toastr.info("Debe seleccionar un Programa ");
        flag = true;
      }
      else if (
        this.proyecto.estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un Estado");
        flag = true;
      }
      else if (
        this.proyecto.descripcion == '' ||
        this.proyecto.descripcion== undefined
      ) {
        this.toastr.info("El campo Descripción no puede ser vacío");
        flag = true;
      }
    

      !flag ? resolve(true) : resolve(false);
    })
  }

  guardarProyecto(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo Proyecto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Guardando Proyecto...";
        this.lcargando.ctlSpinner(true);
  
        this.proyectoSrv.guardarProyecto({proyecto:this.proyecto}).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Proyecto Guardado",
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
      }
    });
  }

  editarProyecto(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este Proyecto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Editando Proyecto...";
        this.lcargando.ctlSpinner(true);
   
        this.proyecto.id_usuario= this.dataUser['id_usuario'];

        console.log(this.proyecto);
     



  
        this.proyectoSrv.editarProyecto({proyecto:this.proyecto}).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Proyecto Guardado",
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
      }
    });
  }
  closeModal() {
    //this.commonVarSrv.seguiTicket.next(this.needRefresh);
    this.proyectoSrv.proyectos$.emit(this.needRefresh)
    this.activeModal.dismiss();
  }

}
