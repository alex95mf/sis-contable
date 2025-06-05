import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { TablasConfigService } from '../tablas-config.service'; 
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-tablas-config-form',
  templateUrl: './tablas-config-form.component.html',
  styleUrls: ['./tablas-config-form.component.scss']
})
export class TablasConfigFormComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;

  dataUser: any;
  vmButtons: any;
  tasasConfig: any = { tipo_tabla: 0 };
  needRefresh: boolean = false;
  hayTarifas: boolean = false;
  catalog: any = {};

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() tablas: any;

  constructor(public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private commonSrv: CommonService,
      private tablasConfigSrv: TablasConfigService,
      private commonVarSrv: CommonVarService,
    ) {}

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnTablasConfigForm",
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
          orig: "btnTablasConfigForm",
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

  this.tasasConfig = {
    tipo_tabla: 0,
    base_calculo: "",
    rango_desde: "",
    rango_hasta: "",
    valor: "",
    valor_excedente: ""
  }

  if(!this.isNew){
    console.log(this.data);
    this.tasasConfig = JSON.parse(JSON.stringify(this.data));
  }
           
  }

  editarTablasConfig(dt) {
    this.commonVarSrv.editarTablasConfig.next(dt);
    this.closeModal();
  }
  
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.closeModal();
            break;
        case " GUARDAR":
            this.validaTablasConfig();
            break;
  }
}

getTablasConfigBy(id) {
  (this as any).mensajeSpinner = "Obteniendo tablas...";
  this.lcargando.ctlSpinner(true);
  this.tablasConfigSrv.getTablasConfigBy(id).subscribe(
    (res) => {
      // console.log(res);
      this.tasasConfig = res['data'];
      this.lcargando.ctlSpinner(false);
    },
    (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    }
  )
}

async validaTablasConfig() {
  if(this.isNew && this.permissions.guardar=="0") {
    this.toastr.warning("No tiene permisos para crear nuevas Tablas");

  } else if (!this.isNew && this.permissions.editar == "0") {
    this.toastr.warning("No tiene permisos para editar Tablas.", this.fTitle);
  } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {
        
        if(respuesta) {
          if (this.isNew) {
            this.crearTablasConfig();
            
          } else {
            this.editTablasConfig();
          }
        }
      });
  }
}

fillCatalog() {
  let data = {
    params: "'REN_TIPO_TABLA_TASA'",
  };
  this.tablasConfigSrv.getCatalogo(data).subscribe(
    
    (res) => {
      //console.log(res);
      this.catalog.tabla = res["data"]["REN_TIPO_TABLA_TASA"];
    },
    (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    }
  );
}

onlyNumber(event): boolean {
  let key = event.which ? event.which : event.keyCode;
  if (key != 46 && key > 31 && (key < 48 || key > 57)) {
    return false;
  }
  return true;
}


validaDataGlobal() {
  let flag = false;
  return new Promise((resolve, reject) => {
    if(
      this.tasasConfig.tipo_tabla == 0 ||
      this.tasasConfig.tipo_tabla == undefined  
    ) {
      this.toastr.info("Debe seleccionar un Tipo Tabla");
      flag = true;
    } else if(
      this.tasasConfig.base_calculo == "" ||
      this.tasasConfig.base_calculo == undefined
    ) {
      this.toastr.info("El campo Base cálculo no puede ser vacío");
      flag = true;
    } else if (
      this.tasasConfig.rango_desde =="" ||
      this.tasasConfig.rango_desde == undefined
    ) {
      this.toastr.info("El campo Rango Desde no puede ser vacío");
      flag = true;
    } else if (
      this.tasasConfig.rango_hasta =="" ||
      this.tasasConfig.rango_hasta == undefined 
    ) {
      this.toastr.info("El campo Rango Hasta no puede ser vacío");
      flag = true;
    } else if (
      this.tasasConfig.valor == "" ||
      this.tasasConfig.valor == undefined
    ) {
      this.toastr.info("El campo Valor no puede ser vacío");
      flag = true;
    } else if(
      this.tasasConfig.valor_excedente == "" ||
      this.tasasConfig.valor_excedente == undefined
    ) {
      this.toastr.info("El campo Valor Excedente no puede ser vacío");
      flag = true;
    }
    !flag ? resolve(true) : resolve(false);
  })
}

crearTablasConfig() {
  Swal.fire({
    icon: "warning",
    title: "¡Atención!",
    text: "¿Seguro que desea crear una nueva tabla?",
    showCloseButton: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Aceptar",
    cancelButtonColor: '#F86C6B',
    confirmButtonColor: '#4DBD74',
    }).then((result) => {
        if (result.isConfirmed) {
            (this as any).mensajeSpinner = "Guardando tabla...";
            this.lcargando.ctlSpinner(true);

            let data = {
              tasasConfig: {
                tipo_tabla: this.tasasConfig.tipo_tabla,
                base_calculo: this.tasasConfig.base_calculo,
                rango_desde: this.tasasConfig.rango_desde,
                rango_hasta: this.tasasConfig.rango_hasta,
                valor: this.tasasConfig.valor,
                valor_excedente: this.tasasConfig.valor_excedente,
              }
            }

            this.tablasConfigSrv.createTablasConfig(data).subscribe(
                (res) => {
                    console.log(res);
                    if (res["status"] == 1) {
                    this.needRefresh = true;
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                        icon: "success",
                        title: "Tabla Creada",
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

editTablasConfig() {

  Swal.fire({
    icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea editar esta Tabla?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
  }).then((result) => {
    if (result.isConfirmed) {
        (this as any).mensajeSpinner = "Guardando tabla..."
        this.lcargando.ctlSpinner(true);

        let data = {
          tasasConfig: {
            tipo_tabla: this.tasasConfig.tipo_tabla,
            base_calculo: this.tasasConfig.base_calculo,
            rango_desde: this.tasasConfig.rango_desde,
            rango_hasta: this.tasasConfig.rango_hasta,
            valor: this.tasasConfig.valor,
            valor_excedente: this.tasasConfig.valor_excedente,
          }
        }

        this.tablasConfigSrv.editTablasConfig(this.data.id_tasas_configuracion, data).subscribe(
            (res) => {
                if (res["status"] == 1) {
                this.needRefresh = true;
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                    icon: "success",
                    title: "Tabla Actualizada",
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

closeModal() {
  this.commonVarSrv.editarTablasConfig.next(this.needRefresh);
  this.activeModal.dismiss();
}

}
