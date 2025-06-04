import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
// import { ConceptoFormComponent } from './concepto-form/concepto-form.component';

import * as myVarGlobals from "../../../../global";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ParametrosNominaService } from './parametros-nomina.service';
import { ParametroFormComponent } from './parametro-form/parametro-form.component';

@Component({
standalone: false,
  selector: 'app-parametros-nomina',
  templateUrl: './parametros-nomina.component.html',
  styleUrls: ['./parametros-nomina.component.scss']
})
export class ParametrosNominaComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;

  fTitle: string = "Parametros Nómina";

  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  
  parametrosDt: any = [];
  showInactive = false;
  tarifas: any;

  paginate: any;
  filter: any;

  estado = [
    {valor: 'A', descripcion: 'Activo'},
    {valor: 'I', descripcion: 'Inactivo'}

  ]
 

  constructor(
    private parametroSrv: ParametrosNominaService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
  ) {

    // this.commonVarSrv.editConcepto.asObservable().subscribe(
    //   (res) => {
    //     if (res) {
    //       this.cargarConceptos();
    //     }
    //   }
    // )

    this.commonVarSrv.modalParametrosNomina.asObservable().subscribe(
      (res)=>{
        this.cargarParametrosNomina()
      }
    )
    

   }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " Nuevo" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      // {
      //   orig: "btnsConceptos",
      //   paramAccion: "",
      //   boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-warning boton btn-sm",
      //   habilitar: false,
      // }
    ];

    this.filter = {
      nombre: undefined,
      codigo: undefined,
      estado: undefined,
      filterControl: "",
    };

    // TODO: Habilitar codigo en Backend

    this.paginate = {
      length: 0,
      perPage: 10,
      pageIndex: 0,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(()=> {
      this.validaPermisos();
    }, 0);

  }

  validaPermisos() {
    this.mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fConcepto,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarParametrosNomina();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    this.cargarParametrosNomina()
  }

  cargarParametrosNomina() {
    this.mensajeSpinner = "Cargando Parametros...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.parametroSrv.getParametrosNomina(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        this.parametrosDt = res['data']['data'];
      
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  updateParametroEmpleados(parametro){


  if(parametro.codigo == 'PORCANTICIPO'){
    this.mensajeSpinner = "Actualizando Parametros en ficha de empleados...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_parametro: parametro.id_parametro,
      codigo: parametro.codigo
    }

    this.parametroSrv.updateParametroEmpleados(data).subscribe(
      (res) => {
        console.log(res);
        if (res["status"] == 1) {
         
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "success",
            title: "Parametros Actualizados",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: '#20A8D8',
          }).then((res) => {
            if (res.isConfirmed) {
             
            }
          })
          
          } else {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error al actualizar parámetros ",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }else{
    this.toastr.info("Este parámetro no se puede actualizar la ficha de los empleados masivamente")
  }
   
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " Nuevo":
        this.showConceptoForm(true, {});
        break;
      case " MOSTRAR INACTIVOS":
        this.changeShowInactive(this.showInactive);
        break;
    }
  }

  showConceptoForm(isNew:boolean, data?:any) {
    console.log(this.permissions)
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Parametros de Nomina.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Parametros de Nomina.", this.fTitle);
    } else {
      console.log(data);
      const modalInvoice = this.modalSrv.open(ParametroFormComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fConcepto;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      
    }
  }

  // deleteConcepto(id) {
  //   if (this.permissions.eliminar == "0"){
  //     this.toastr.warning("No tiene permisos para eliminar Conceptos.", this.fTitle);
  //   } else {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "¡Atención!",
  //       text: "¿Seguro que desea eliminar este Concepto?",
  //       showCloseButton: true,
  //       showCancelButton: true,
  //       showConfirmButton: true,
  //       cancelButtonText: "Cancelar",
  //       confirmButtonText: "Aceptar",
  //       cancelButtonColor: '#F86C6B',
  //       confirmButtonColor: '#4DBD74',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.mensajeSpinner = "Eliminando concepto..."
  //         this.lcargando.ctlSpinner(true);
  //         this.conceptosSrv.deleteConcepto(id).subscribe(
  //           (res) => {
  //             if (res["status"] == 1) {
  //               this.lcargando.ctlSpinner(false);
  //               this.cargarConceptos();
  //               Swal.fire({
  //                 icon: "success",
  //                 title: "Registro Eliminado",
  //                 text: res['message'],
  //                 showCloseButton: true,
  //                 confirmButtonText: "Aceptar",
  //                 confirmButtonColor: '#20A8D8',
  //               });
  //             } else {
  //               this.lcargando.ctlSpinner(false);
  //               Swal.fire({
  //                 icon: "error",
  //                 title: "Error",
  //                 text: res['message'],
  //                 showCloseButton: true,
  //                 confirmButtonText: "Aceptar",
  //                 confirmButtonColor: '#20A8D8',
  //               });
  //             }
  //           },
  //           (error) => {
  //             this.lcargando.ctlSpinner(false);
  //             this.toastr.info(error.error.message);
  //           }
  //         )
  //       }
  //     });
  //   }
  // }

  changeShowInactive(showInactive) {
    if (showInactive) {
      this.vmButtons[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A', 'I'];
    } else {
      this.vmButtons[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['I'];
    }
    this.showInactive = !this.showInactive;
    this.cargarParametrosNomina();
  }

  // changePaginate(event) {
  //   let newPaginate = {
  //     perPage: event.pageSize,
  //     page: event.pageIndex + 1,
  //   }
  //   Object.assign(this.paginate, newPaginate);
  //   this.cargarConceptos();
  // }
  changePaginate({pageSize, pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize});
    this.cargarParametrosNomina();
  }

  limpiarFiltros() {
    
    this.filter.nombre = undefined;
    this.filter.codigo = undefined;
    this.filter.estado = undefined;
    // this.changeShowInactive(true);
    // this.cargarConceptos();
  }

}
