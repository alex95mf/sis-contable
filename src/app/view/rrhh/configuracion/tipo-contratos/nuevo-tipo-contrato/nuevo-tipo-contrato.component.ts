import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { TiposContratosService } from '../tipos-contratos.service'; 
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
standalone: false,
  selector: 'app-nuevo-tipo-contrato',
  templateUrl: './nuevo-tipo-contrato.component.html',
  styleUrls: ['./nuevo-tipo-contrato.component.scss']
})
export class NuevoTipoContratoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  
  dataUser: any;
  searchText: Subject<any> = new Subject<any>()
  searching: any = {
    deudora: false,
    acreedora: false,
    presupuesto: false
  }
  subscription: any
  

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;

  vmButtons: any;

  documento: any;

  tarifasList: any = [];
  tipoCalculosList: any = [];
  tiempo_contrato:any = [];

  needRefresh: boolean = false;
  hayTarifas: boolean = false;

  descripcion_deudora: any;
  descripcion_acreedora: any;
  descripcion_presupuesto: any;

  estadoList = [
    {
      value: "A",
      label: "Activo"
    },
    {
      value: "I",
      label: "Inactivo"
    },
  ]

  

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private apiSrv: TiposContratosService,
    private commonVarSrv: CommonVarService,
    private modalDet: NgbModal
  ) {
    
    
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnConceptoForm",
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
        orig: "btnConceptoForm",
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

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.documento = {
      cat_nombre: "",
      cat_descripcion: "",
      cat_keyword: "",
      cat_cantidad_tiempo: "",
      cat_tiempo: ""
     
    }

    console.log(this.data)
    console.log(this.isNew)
    if (!this.isNew) {
      this.documento = JSON.parse(JSON.stringify(this.data));
    }
    setTimeout(() => {
     

      this.getTiempoContrato();
      // this.getCatalogs();
     

    }, 50);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validaTipoContrato();
        break;
    }
  }

  getTiempoContrato() {
  
  let cat_keyword= 'TCTP';

  (this as any).mensajeSpinner = "Cargando";
  this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogoTipoContrato(cat_keyword).subscribe(
     
      (res) => {
        console.log(res['data'])
        this.tiempo_contrato = res['data'];
        this.lcargando.ctlSpinner(false);
        //console.log('catalogos '+res);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }

  async validaTipoContrato() {
      let resp = await this.validaDataGlobal().then((respuesta) => {
        if (respuesta) {
          if (this.isNew) {
            this.crearTipoContrato();
          } else {
           // this.editConcepto();
          }
        }
      });

    
  }

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
     
      if ( this.documento.cat_nombre == "" || this.documento.cat_nombre == undefined
      ) {
        this.toastr.info("El campo Nombre no puede ser vacío");
        flag = true;
      } 
      else if ( this.documento.cat_descripcion == "" || this.documento.cat_descripcion == undefined
      ) {
        this.toastr.info("El campo Descripción no puede ser vacío");
        flag = true;
      } 
      else if ( this.documento.cat_keyword == "" || this.documento.cat_keyword == undefined
      ) {
        this.toastr.info("El campo KeyWord no puede ser vacío");
        flag = true;
      } 
       
    
      !flag ? resolve(true) : resolve(false);
    })
  }

  crearTipoContrato() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo Tipo de Contrato?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = "Guardando Tipo Contrato...";
        this.lcargando.ctlSpinner(true);

        let data = {
          documento: {
            cat_nombre: this.documento.cat_nombre,
            cat_descripcion: this.documento.cat_descripcion,
            cat_keyword: this.documento.cat_keyword,
            cat_parent_id: 24,
            cat_cantidad_tiempo: this.documento.cat_cantidad_tiempo,
            cat_tiempo: this.documento.cat_tiempo
          }
        }
        console.log(data)

        this.apiSrv.saveTipoContrato(data).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Tipo de Contrato Creado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.closeModal();
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
      }
    });
  }

  // editConcepto() {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "¡Atención!",
  //     text: "¿Seguro que desea editar está área?",
  //     showCloseButton: true,
  //     showCancelButton: true,
  //     showConfirmButton: true,
  //     cancelButtonText: "Cancelar",
  //     confirmButtonText: "Aceptar",
  //     cancelButtonColor: '#F86C6B',
  //     confirmButtonColor: '#4DBD74',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       (this as any).mensajeSpinner = "Guardando área..."
  //       this.lcargando.ctlSpinner(true);

  //       let data = {
  //         id:this.data.id_area,
  //         documento: {
  //           are_nombre: this.documento.are_nombre,
  //           are_descripcion: this.documento.are_descripcion,
  //           are_keyword: this.documento.are_keyword,
  //           estado: this.documento.estado,
  //         }
  //       }

  //       this.conceptosSrv.editArea( data).subscribe(
  //         (res) => {
  //           if (res["status"] == 1) {
  //             this.needRefresh = true;
  //             this.lcargando.ctlSpinner(false);
  //             Swal.fire({
  //               icon: "success",
  //               title: "Área Actualizado",
  //               text: res['message'],
  //               showCloseButton: true,
  //               confirmButtonText: "Aceptar",
  //               confirmButtonColor: '#20A8D8',
  //             }).then((result) => {
  //               if (result.isConfirmed) {
  //                 this.closeModal();
  //               }
  //             });
  //           } else {
  //             this.lcargando.ctlSpinner(false);
  //             Swal.fire({
  //               icon: "error",
  //               title: "Error",
  //               text: res['message'],
  //               showCloseButton: true,
  //               confirmButtonText: "Aceptar",
  //               confirmButtonColor: '#20A8D8',
  //             });
  //           }
  //         },
  //         (error) => {
  //           this.lcargando.ctlSpinner(false);
  //           this.toastr.info(error.error.message);
  //         }
  //       )
  //     }
  //   });
  // }

  lookup(event: any, field: string) {
    if (event.target.value.length > 3 && event.target.value.length < 13) this.searchText.next({term: event.target.value, field: field})
  }

  closeModal() {
    this.commonVarSrv.editArea.next(this.needRefresh);
    this.activeModal.dismiss();
  }

}
