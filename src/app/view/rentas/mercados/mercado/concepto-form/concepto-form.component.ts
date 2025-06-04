import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
// import { ConceptosService } from '../conceptos.service';
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ModalCuentPreComponent } from '../modal-cuent-pre/modal-cuent-pre.component';
import { MercadoService } from '../mercado.service';

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
  cuentas: any = {
    deudora: [],
    acreedora: [],
    presupuesto: []
  }

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;

  vmButtons: any;

  mercado = {
    id_mercado: 0,
    nombre: null,
    fk_mercado: null,
    tipo_mercado: null,
    direccion: null,
    administrador: null,
    cantidad_puestos: null,
    cantidad_puestos_ocupados: null,
    cantidad_puestos_disponibles: null,
    estado: 'A'

  };

  estado = [
    {valor: 'A', descripcion: 'Activo'},
    {valor: 'I', descripcion: 'Inactivo'},
  ]

  tipo_mercado = []
  mercado_cat = []

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

  tieneTarifaList = [
    {
      value: true,
      label: "Si"
    },
    {
      value: false,
      label: "No"
    },
  ]

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private conceptosSrv: MercadoService,
    private commonVarSrv: CommonVarService,
    private modalDet: NgbModal
  ) {
    this.subscription = this.searchText.pipe(
      debounceTime(1000),
    ).subscribe((param: any) => {
      this.searching[param.field] = true
      this.conceptosSrv.getCuentas(param).subscribe(
        (res: any) => {
          console.log(res.data)
          this.cuentas[param.field] = res.data
          this.searching[param.field] = false
          console.log(res.data)
        },
        (err: any) => {
          console.log(err)
          this.searching[param.field] = false
          this.toastr.error(err.error.message, 'Error buscando Cuentas')
        }
      )
    })
    this.commonVarSrv.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res)=>{
        console.log(res);
        
        
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


    setTimeout(() => {
      this.getCatalogs();
      

    }, 0);

  }

  

  getCatalogs() {
    this.mensajeSpinner = "Cargando conceptos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REN_MERCADO_TIPO', 'REN_MERCADO'"
    }

    this.conceptosSrv.obtenerCatalogos(data).subscribe(
      (res) => {
        console.log(res);
        res['data']['REN_MERCADO_TIPO'].forEach(elem => {
          let tipoCalculo = {
            value: elem.descripcion,
            label: elem.valor
          }
          this.tipo_mercado.push(tipoCalculo);
        })

        res['data']['REN_MERCADO'].forEach(elem => {
          let tipoCalculo = {
            id: elem.id_catalogo,
            value: elem.descripcion,
            label: elem.valor
          }
          this.mercado_cat.push(tipoCalculo);
        })
        if (!this.isNew) {
          console.log(this.data);
          this.mercado = this.data;
          this.mercado.fk_mercado = this.data.fk_mercado.id_catalogo
        }
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message);
      }
    )
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validaConcepto();
        break;
    }
  }

  async validaConcepto() {
    if (this.isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear nuevos Conceptos");

    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Conceptos.", this.fTitle);
    } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {
        if (respuesta) {
          if (this.isNew) {
            this.crearMercado();
          } else {
            this.editMercado();
          }
        }
      });

    }
  }



  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.mercado.nombre == "" ||
        this.mercado.nombre == null
      ) {
        this.toastr.info("El campo Nombre no puede ser vacío");
        flag = true;
      } else if(
        this.mercado.tipo_mercado == "" ||
        this.mercado.tipo_mercado == null
      ){
        this.toastr.info("El campo Tipo mercado no puede ser vacío");
        flag = true;
      }else if(
        this.mercado.direccion == "" ||
        this.mercado.direccion == null
      ){
        this.toastr.info("El campo direccion no puede ser vacío");
        flag = true;
      }else if(
        this.mercado.administrador == "" ||
        this.mercado.administrador == null
      ){
        this.toastr.info("El campo administrador no puede ser vacío");
        flag = true;
      }else if(
        this.mercado.cantidad_puestos == "" ||
        this.mercado.cantidad_puestos == null
      ){
        this.toastr.info("El campo Cantidad puestos no puede ser vacío");
        flag = true;
      }else if(
        this.mercado.cantidad_puestos_ocupados == "" ||
        this.mercado.cantidad_puestos_ocupados == null
      ){
        this.toastr.info("El campo Cantidad puestos ocupados no puede ser vacío");
        flag = true;
      }else if(
        this.mercado.cantidad_puestos_disponibles == "" ||
        this.mercado.cantidad_puestos_disponibles == null
      ){
        this.toastr.info("El campo Cantidad puestos disponibles no puede ser vacío");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })
  }

  crearMercado() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo concepto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Guardando concepto...";
        this.lcargando.ctlSpinner(true);


        this.conceptosSrv.createMercado(this.mercado).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Concepto Creado",
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

  editMercado() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este Concepto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Guardando concepto..."
        this.lcargando.ctlSpinner(true);


        this.conceptosSrv.editMercado(this.mercado).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Concepto Actualizado",
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
    this.commonVarSrv.editConcepto.next(this.needRefresh);
    this.activeModal.dismiss();
  }


  modalCodigoPresupuesto(){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = 'Presupuestario';
  }

  modalCuentaContable(valor){
    let modal = this.modalDet.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = valor;
    
  }

}
