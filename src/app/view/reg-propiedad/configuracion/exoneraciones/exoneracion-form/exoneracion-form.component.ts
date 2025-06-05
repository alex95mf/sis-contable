import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ExoneracionesService } from '../exoneraciones.service';
import Swal from "sweetalert2/dist/sweetalert2.js";


@Component({
standalone: false,
  selector: 'app-exoneracion-form',
  templateUrl: './exoneracion-form.component.html',
  styleUrls: ['./exoneracion-form.component.scss']
})
export class ExoneracionFormComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static:false })
  lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() isNuevo: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() conceptos: any;
  vmButtons: any;
  
  exoneracion: any;
  selectedConcepto : any;

  needRefresh: boolean = false;
  disabled: boolean = false;
  cmb_conceptos: any[] = []
  conceptosDetalles: any[] = []

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

  @Input() exoneracionList: any;
  concepto_det: any = 0;

  tempExo: any;
  selectedConceptoAplicable: any;
  id_concepto: any

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private exoneracionesSrv: ExoneracionesService,
    private commonVarSrv: CommonVarService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnExoneracionForm",
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
        orig: "btnExoneracionForm",
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

    this.exoneracion = {
      id: "",
      con_codigo: "",
      con_det_codigo: "",
      porcentaje: 0,
      descripcion: "",
      estado: 0,
      fk_concepto: 0,
      fk_concepto_det: 0,
      fk_concepto_det_aplicable:null,
      cod_concepto_det_aplicable:0
    }

    this.tempExo = 0;
    
      
      if(!this.isNuevo) {
        
        console.log(this.data);
        let data = {
          concepto: {
            id: this.data.id
          }
        }
        this.disabled = true
        //let concepto = this.conceptos.filter(e => e.id_concepto == this.data['fk_concepto'])
       // this.selectedConcepto = concepto[0]?.nombre
        //this.id_concepto = concepto[0]?.id_concepto

        this.selectedConcepto = this.data['fk_concepto']
        setTimeout(() => {
        this.buscarConDet();
        },0);
        setTimeout(() => {
          this.getExoneracion(data);
        },100);

       
      }else{
        this.disabled = false
      }

      
  }

  cargarConceptos() {
    (this as any).mensajeSpinner = 'Cargando Conceptos'
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

  getExoneracion(data) {
    console.log(this.exoneracionList);
    (this as any).mensajeSpinner = "Obteniendo exoneracion...";
    this.lcargando.ctlSpinner(true);
    this.exoneracionesSrv.getExoneracion(data).subscribe(
      (res: any) => {
        //console.log(res);
        this.exoneracion = res['data'][0];
        console.log(this.exoneracion);
        this.lcargando.ctlSpinner(false);
        this.detDetalle(this.exoneracion.con_det_codigo);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  detDetalle(detalle:any) {
    // console.log(detalle);
    for(let ex of this.exoneracionList){
      if(ex.codigo_detalle === detalle){
        this.tempExo = ex;
      }
    }
  }
  
  onChange(event) {

    this.concepto_det = event;

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.closeModal();
            break;
        case " GUARDAR":
            this.validaExoneracion();
            break;
    }
  }

  async validaExoneracion() {
    if (this.isNuevo && this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para crear nuevas Exoneraciones");
    } else if (!this.isNuevo && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Exoneraciones.", this.fTitle);
    } else {
        let resp = await this.validateDataGlobal().then((respuesta) => {
            if (respuesta) {
                if (this.isNuevo) {
                    this.crearExoneracion();
                } else {
                    this.editarExoneracion();
                }
            }
        });
    }
  }

  validateDataGlobal() {
    console.log(this.selectedConcepto)
    let flag = false;
    return new Promise((resolve, reject) => {
      if(
        (this.concepto_det == 0 ||
        this.concepto_det == undefined) &&
        (this.tempExo == 0 ||
        this.tempExo == undefined)
      ) {
        this.toastr.info("Seleccione una exoneracion");
        flag = true;
      } else if(
        this.exoneracion.porcentaje < 0 ||
        this.exoneracion.porcentaje == undefined
      ) {
        this.toastr.info("Introduzca un porcentaje no negativo para Exoneracion");
        flag = true;
      } else if (
        this.exoneracion.descripcion == "" ||
        this.exoneracion.descripcion == undefined
      ) {
        this.toastr.info("Seleccione una descripcion para Exoneracion");
        flag = true;
      } else if (
        this.exoneracion.estado == 0 ||
        this.exoneracion.estado == undefined
      ) {
        this.toastr.info("Seleccione un estado para Exoneracion");
        flag = true;
      }
      else if (this.exoneracion.fk_concepto == 0  && this.isNuevo
      ) {
        this.toastr.info("Seleccione un concepto para Exoneracion");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })

  }

  
  crearExoneracion() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear una nueva exoneracion?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
        if (result.isConfirmed) {
            (this as any).mensajeSpinner = "Guardando exoneracion...";
            this.lcargando.ctlSpinner(true);

            let data = {
              exoneracion: {
                fk_concepto: this.exoneracion.fk_concepto,
               // con_codigo: this.selectedConcepto.codigo,
                fk_concepto_det: this.concepto_det.id_concepto_detalle,
                con_det_codigo: this.concepto_det.codigo_detalle,
                porcentaje: this.exoneracion.porcentaje,
                descripcion: this.exoneracion.descripcion,
                estado: this.exoneracion.estado,
                fk_concepto_det_aplicable:this.exoneracion.fk_concepto_det_aplicable,
                //cod_concepto_det_aplicable:this.selectedConceptoAplicable.codigo_detalle
                
              }
            }

            this.exoneracionesSrv.crearExoneracion(data).subscribe(
                (res) => {
                    if (res["status"] == 1) {
                    this.needRefresh = true;
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                        icon: "success",
                        title: "Exoneracion Creada",
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

  editarExoneracion() {
    Swal.fire({
      icon: "warning",
            title: "¡Atención!",
            text: "¿Seguro que desea editar esta Exoneracion?",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
          (this as any).mensajeSpinner = "Guardando arancel..."
          this.lcargando.ctlSpinner(true);
          let data = {
            exoneracion: {
              fk_concepto: this.exoneracion.fk_concepto,
              // con_codigo: "RP",
              fk_concepto_det: this.concepto_det!=0 ? this.concepto_det.id_concepto_detalle : this.tempExo.id_concepto_detalle,
              con_det_codigo: this.concepto_det!=0 ? this.concepto_det.codigo_detalle : this.tempExo.codigo_detalle ,
              porcentaje: this.exoneracion.porcentaje,
              descripcion: this.exoneracion.descripcion,
              estado: this.exoneracion.estado,
              fk_concepto_det_aplicable:this.exoneracion.fk_concepto_det_aplicable,       
              id_usuario: 70,
            }
          }
          this.exoneracionesSrv.editExoneracion(this.data.id, data).subscribe(
              (res) => {
                  if (res["status"] == 1) {
                  this.needRefresh = true;
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                      icon: "success",
                      title: "Exoneracion Actualizada",
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

  buscarConDet(){
    let data
    if(!this.isNuevo) {
      data = {
        concepto: this.data.fk_concepto
      }
    }else{
      data = {
        concepto: this.exoneracion.fk_concepto
      }
    }
   
   
    (this as any).mensajeSpinner = "Buscando detalles..."
    this.lcargando.ctlSpinner(true);

    this.exoneracionesSrv.getConceptoDetalles(data).subscribe(
      (res) => {
          if (res["status"] == 1) {
          this.needRefresh = true;
          this.lcargando.ctlSpinner(false);
          this.conceptosDetalles = res['data']
          console.log(this.conceptosDetalles)
          // if(!this.isNuevo) {
          //   if((this.conceptosDetalles.length > 0) && (this.data.fk_concepto_det_aplicable != null)){
          //     let filter_con = this.conceptosDetalles.filter(e => e.id_concepto_detalle == this.data.fk_concepto_det_aplicable)
          //     this.selectedConceptoAplicable = filter_con[0]?.nombre_detalle
          //     console.log(filter_con)
          //   }else{
          //     this.selectedConceptoAplicable = undefined
          //   }
          // }
         
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

  closeModal() {
    this.commonVarSrv.editExoneracion.next(this.needRefresh)
    this.activeModal.dismiss();
}

}
