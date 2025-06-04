import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { AreaService } from '../area.service';
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ModalProgramaComponent } from '../modal-programa/modal-programa.component';


@Component({
standalone: false,
  selector: 'app-concepto-form',
  templateUrl: './concepto-form.component.html',
  styleUrls: ['./concepto-form.component.scss']
})
export class ConceptoFormComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
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
    private conceptosSrv: AreaService,
    private commonVarSrv: CommonVarService,
    private modalDet: NgbModal
  ) {
    this.commonVarSrv.modalProgramArea.subscribe(
      (res)=>{
        this.documento.programa = res.nombre
        this.documento.fk_programa = res.id_nom_programa
      }
    )
    
    
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
      are_nombre: "",
      are_descripcion: "",
      are_keyword: "",
      estado: "A",
      programa: "",
      fk_programa: ""
    }

    setTimeout(() => {
      console.log(this.data)
      
      // this.getCatalogs();
      if (!this.isNew) {
        console.log(this.data);
        this.documento = this.data
        this.documento.programa = this.data.programas.nombre
        this.documento.fk_programa = this.data.programas.id_nom_programa
      }

    }, 0);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validaArea();
        break;
    }
  }

  async validaArea() {
      let resp = await this.validaDataGlobal().then((respuesta) => {
        if (respuesta) {
          if (this.isNew) {
            this.crearArea();
          } else {
            this.editConcepto();
          }
        }
      });

    
  }

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
     
      if ( this.documento.are_nombre == "" || this.documento.are_nombre == undefined
      ) {
        this.toastr.info("El campo Nombre no puede ser vacío");
        flag = true;
      } 
      else if ( this.documento.are_descripcion == "" || this.documento.are_descripcion == undefined
      ) {
        this.toastr.info("El campo Descripción no puede ser vacío");
        flag = true;
      } 
      else if ( this.documento.are_keyword == "" || this.documento.are_keyword == undefined
      ) {
        this.toastr.info("El campo KeyWord no puede ser vacío");
        flag = true;
      } 
       
      else if (
        this.documento.estado == 0 ||
        this.documento.estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un estado");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })
  }

  crearArea() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear una nueva área?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Guardando área...";
        this.lcargando.ctlSpinner(true);

        let data = {
          documento: {
            are_nombre: this.documento.are_nombre,
            are_descripcion: this.documento.are_descripcion,
            are_keyword: this.documento.are_keyword,
            estado: this.documento.estado,
            fk_programa: this.documento.fk_programa
          }
        }
        console.log(data)

        this.conceptosSrv.createArea(data).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Área Creada",
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

  editConcepto() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar está área?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Guardando área..."
        this.lcargando.ctlSpinner(true);

        let data = {
          id:this.data.id_area,
          documento: {
            are_nombre: this.documento.are_nombre,
            are_descripcion: this.documento.are_descripcion,
            are_keyword: this.documento.are_keyword,
            estado: this.documento.estado,
            fk_programa: this.documento.fk_programa
          }
        }

        this.conceptosSrv.editArea( data).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Área Actualizado",
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

  lookup(event: any, field: string) {
    if (event.target.value.length > 3 && event.target.value.length < 13) this.searchText.next({term: event.target.value, field: field})
  }

  closeModal() {
    this.commonVarSrv.editArea.next(this.needRefresh);
    this.activeModal.dismiss();
  }


  modalPrograma(){
    let modal = this.modalDet.open(ModalProgramaComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  

}
