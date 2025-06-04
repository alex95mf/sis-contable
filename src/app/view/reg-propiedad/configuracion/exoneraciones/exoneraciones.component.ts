import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ExoneracionesService } from './exoneraciones.service';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ExoneracionFormComponent } from './exoneracion-form/exoneracion-form.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MatPaginator } from '@angular/material/paginator';



@Component({
standalone: false,
  selector: 'app-exoneraciones',
  templateUrl: './exoneraciones.component.html',
  styleUrls: ['./exoneraciones.component.scss']
})
export class ExoneracionesComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";

  @ViewChild(CcSpinerProcesarComponent, {static: false})
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fTitle: string = "Exoneraciones";

  vmButtons: any = [];
  dataUser: any;
  permissions: any;

  exoneracionesDt: any = []
  cmb_conceptos: any[] = []
  
  paginate: any;
  filter: any;

  select_estado = 0;

  estadosList: any [] = [
    {
      value: 0,
      label: "Todos",
    },
    {
      value: 'A',
      label: "Activo",
    },
    {
      value: 'I',
      label: "Inactivo",
    },
   
  ];


  exoList: any;

  constructor(
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private exoneracionesSrv: ExoneracionesService,
    private modalSrv: NgbModal,
  ) { 

    this.commonVarSrv.editExoneracion.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargarExoneraciones();
        }
      }
    )
    
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsExcepcionces",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
    ];

    this.filter = {
      descripcion: undefined,
      estado: 0,
      concepto: null,
      control: "",
    }
    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10,20]
    };

    // this.paginate = {
    //   length: 0,
    //   perPage: 10,
    //   page: 1,
    //   pageSizeOptions: [2, 5, 10, 20, 50]
    // }
    
     this.cargarExoneracionesDet();

    setTimeout(() => {
      this.validaPermisos();
    }, 50);

  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.showExoneracionForm(true);
        break;
    }
  }

  validaPermisos() {
    
    this.mensajeSpinner = "Verificando permisos del usuario..."
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRPExoneraciones,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarConceptos() 
          this.cargarExoneraciones();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );


  }

  limpiarFiltros() {
    this.filter.descripcion = undefined;
    this.filter.concepto = null;
    this.filter.estado = 0;
    this.select_estado = 0;
    this.cargarExoneraciones();
  }

  change(event) {
    // verificar si algo de filter existe sino no mandar params
    // console.log(event);
    if(event!='T'){
      let temp = [];
      temp.push(event);
      this.filter.estado = temp;
      temp = [];
    } else {
      this.filter.descripcion = undefined;
      this.filter.estado = undefined;
    }
  
  }
  cargarConceptos() {
    this.mensajeSpinner = 'Cargando Conceptos'
    this.exoneracionesSrv.getConceptos().subscribe(
      (res: any) => {
        res.data.forEach(e => {
          const { id_concepto,codigo,  nombre } = e
          this.cmb_conceptos = [...this.cmb_conceptos, { id_concepto: id_concepto,codigo: codigo, nombre: nombre }]
        })
        
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  cargarExoneraciones() {
    this.mensajeSpinner = "Cargando lista de Exoneraciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      concepto: {
        codigo:"RP"
      },
      params: {
        filter: this.filter,
        paginate: this.paginate
      }      
    } 

  
    this.exoneracionesSrv.getExoneracionesTodas(data).subscribe(
      (res) => {
        console.log(res);
       // this.exoneracionesDt = res['data'];
        this.exoneracionesDt = res['data']['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.exoneracionesDt = res['data']['data'];
        } else {
           this.exoneracionesDt = Object.values(res['data']['data']);
         
        }
        if(this.exoneracionesDt.length > 0){
          this.exoneracionesDt.forEach(e => {
            Object.assign(e , {porcentaje: Math.floor(e.porcentaje * 100) })
          });
        }
        
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

   cargarExoneracionesDet() {
    let dataConcepto = {
      id_concepto: "32"
    }

    this.exoneracionesSrv.getDetallePor(dataConcepto).subscribe(
      (res) => {
        console.log(res);
        this.exoList = res['data'];
        // this.exoneracion.
        // console.log(this.exoneracionList);
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    )
  } 

  showExoneracionForm(isNuevo: any, data?: any) {

    if ( !isNuevo && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Exoneraciones.", this.fTitle);
    } else if (isNuevo && this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para crear Exoneraciones.", this.fTitle);
    } else {

      

      const modalInvoice = this.modalSrv.open(ExoneracionFormComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRPExoneraciones;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNuevo = isNuevo;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.exoneracionList = this.exoList;
      modalInvoice.componentInstance.conceptos = this.cmb_conceptos;
    }

  }

  borrarExoneraciones(id) {
    if (this.permissions.eliminar == "0"){
      this.toastr.warning("No tiene permisos para eliminar Exoneraciones.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar esta Exoneracion?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeSpinner = "Eliminando exoneracion..."
          this.lcargando.ctlSpinner(true);
          this.exoneracionesSrv.borrarExoneracion(id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                this.cargarExoneraciones();
                Swal.fire({
                  icon: "success",
                  title: "Registro Eliminado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
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
        }
      });
    }
  }

  consultar(){
    Object.assign(this.paginate ,{
      page: 1,
      pageIndex: 0
    })
     this.paginator.firstPage()
     this.cargarExoneraciones()
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarExoneraciones();
  }

  

}
