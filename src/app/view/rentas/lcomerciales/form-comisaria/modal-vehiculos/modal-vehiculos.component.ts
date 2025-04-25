import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { FormComisariaService } from '../form-comisaria.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';

@Component({
  selector: 'app-modal-vehiculos',
  templateUrl: './modal-vehiculos.component.html',
  styleUrls: ['./modal-vehiculos.component.scss']
})
export class ModalVehiculosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  fTitle: string = "Registro de vehículos";
  msgSpinner: string = "Cargando...";
  @Input() inspeccion: any;
  @Input() permisos: any;
  @Input() formDisabled: boolean = false;
  editForm: boolean;

  vmButtons: any = [];
  listaVehiculos: any = [];
  tiposTonelaje: any = [];

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private apiSrv: FormComisariaService,
    private commonSrv: CommonService
  ) { 
    this.commonVarSrv.guardarVehiculos.asObservable().subscribe(
      (res) => {
        // console.log(res);
        this.listaVehiculos = res['data']; // se actualiza la lista para que tenga ids en caso que se agreguen

        // sort descendiente
        // this.listaVehiculos.sort(function(a,b) {
        //   return parseFloat(b.periodo) - parseFloat(a.periodo);
        // });
      }
    )

    
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsVehiculosModal", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: " GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: this.formDisabled },
      { orig: "btnsVehiculosModal", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    
    this.editForm = !this.formDisabled;

    setTimeout(() => {
      this.cargarTiposTonelaje();
    }, 0)

  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validarVehiculos();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  cargarVehiculos() {
    let id = this.inspeccion.id_inspeccion_res;
    let data = {
      id_inspeccion_res_cab: id
    }

    // console.log(data);

    this.msgSpinner = "Cargando vehiculos por inspeccion...";
    // this.lcargando.ctlSpinner(true);
    this.apiSrv.getVehiculosByInspeccion(data).subscribe(
      (res) => {
        // console.log(res);
        this.listaVehiculos = res['data'];
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error al intentar cargar vehiculos');
      }
    )

  }

  cargarTiposTonelaje() {
    this.msgSpinner = "Cargando catalogos...";
    this.lcargando.ctlSpinner(true);

    let datos = {
      params: "'REN_LOCAL_TIPO_TONELAJE'"
    };

    this.apiSrv.obtenerCatalogos(datos).subscribe(
      (res) => {
        // console.log(res);
        res['data']['REN_LOCAL_TIPO_TONELAJE'].forEach((elem)=>{
          let obj = {
            id: elem.id_catalogo,
            nombre: elem.valor,
            tipo_tonelaje: elem.descripcion // este es el valor que ira a la base de datos de vehiculos
          }

          this.tiposTonelaje.push(obj);
        });
        this.cargarVehiculos();
        // this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  agregaVehiculos() {
    let nuevo = {
      id_local_vehiculo: 0,
      fk_local: this.inspeccion.local_comercial.id_local,
      fk_inspeccion_orden: this.inspeccion.fk_orden,
      fk_inspeccion_res_cab: this.inspeccion.id_inspeccion_res,
      tipo_tonelaje: 0,
      placa: "",
      tonelaje: 0,
    }

    this.listaVehiculos.push(nuevo);
  }

  async validarVehiculos() {
    if(this.permisos.guardar=="0") {
      this.toastr.warning("No tiene permisos para crear nuevos Conceptos Detalle.");
    } else if (this.permisos.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Conceptos.", this.fTitle);
    } else {
      let resp = await this.validarCampos().then((respuesta) => {
        if(respuesta) {
          this.guardarVehiculos();
        }
      });
    }
  }

  validarCampos() {
    let flag = false;
    return new Promise((resolve, reject) => {
      this.listaVehiculos.forEach((r, index, array) => {
        console.log(r);
        if (
          r.tipo_tonelaje == 0 ||
          r.tipo_tonelaje == undefined
        ) {
          this.toastr.info("Debe seleccionar un tipo de tonelaje");
          flag = true;
          resolve(false);          
        } else if(
          r.placa ==  "" ||
          r.placa == undefined
        ) {
          this.toastr.info("El campo placa debe llenarse");
          flag = true;
          resolve(false);
        } else if(
          r.tonelaje <= 0 ||
          r.tonelaje == undefined  
        ) {
          this.toastr.info("El campo tonelaje debe ser mayor o igual a 0");
          flag = true;
          resolve(false);
        } else if(
          r.tipo_tonelaje == 'MENOR5.5' &&
          r.tonelaje > 5.5
        ) {
          this.toastr.info("Debe ingresar un tonelaje mayor a 5.5 o cambiar el tipo de tonelaje");
          flag = true;
          resolve(false);
        } else if(
          r.tipo_tonelaje == 'MAYOR5.5' &&
          r.tonelaje <= 5.5
        ) {
          this.toastr.info("Debe ingresar un tonelaje menor o igual a 5.5 o cambiar el tipo de tonelaje");
          flag = true;
          resolve(false);
        } else if(
          this.placaInvalida(r.placa)
        ) {
          this.toastr.info("Verifique que la placa ingresada empiece con 3 letras seguida de 4 números, la primera letra no puede empezar con D, F o Ñ");
          flag = true;
          resolve(false);
        }
        if( index === array.length - 1){
          !flag ? resolve(true) : resolve(false);
        }
        
        
      });
      
    });
  }

  placaInvalida(placa: String):boolean {
    let letras = placa.substring(0,3);
    let numeros = placa.substring(3); 

    // let iniciales = ['A','B','U','C','X','H','O','E','W','G','I','L','R','M','V','N','S','P','Q','K','T','Z','Y','J'];
    let no_iniciales = ['D','F','Ñ'];
    // funcion que retorna true si la placa es invalida, caso contrario retorna false
    if (placa.length != 7){
      return true;
    }
    for(let inicial of no_iniciales) {
      if(placa.charAt(0)==inicial){
        return true;
      }
    }
    for(let i=0;i<letras.length;i++){
      if(letras.charCodeAt(i)<65 || letras.charCodeAt(i)>90){
        return true;
      }
    }
    for(let i=0;i<numeros.length;i++){
      if(numeros.charCodeAt(i)<48 || numeros.charCodeAt(i)>57){
        return true;
      }
    }

    return false;
  }

  guardarVehiculos() {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Está seguro que desea guardar estos tonelajes?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result)=>{

      if(result.isConfirmed){
        this.msgSpinner = "Guardando tonelajes de vehiculos...";
        this.lcargando.ctlSpinner(true);

        let data = {
          params: this.listaVehiculos
        }

        this.apiSrv.saveVehiculos(data).subscribe(
          (res) => {
            // console.log(res);
            Swal.fire({
              icon: "success",
              title: "¡Éxito!",
              text: "Tonelajes de vehículos guardados con éxito",
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              cancelButtonColor: '#F86C6B',
              confirmButtonColor: '#4DBD74',
            })
            this.commonVarSrv.numVehiculos.next(this.listaVehiculos.length);
            this.commonVarSrv.guardarVehiculos.next(res);
            this.lcargando.ctlSpinner(false);
          },
          (err) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.error(err.error.message, 'Error al intentar guardar tonelaje de vehiculos');
          }
        )
      }
      
    });
    
  }

  eliminar(item, i) {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Está seguro que desea eliminar este tonelaje?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(item);
        if(item.id_local_vehiculo==0){
          this.listaVehiculos.splice(i,1);
        } else if (item.id_local_vehiculo!=0){
          // borrar de ade veras
          this.msgSpinner = "Eliminando registro de activos...";
          this.lcargando.ctlSpinner(true);

          let data = {
            id_local_vehiculo: item.id_local_vehiculo
          }

          this.apiSrv.deleteVehiculo(data).subscribe(
            (res) => {
              // console.log(res);
              Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "El tonelaje de vehículos ha sido eliminado con éxito",
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                cancelButtonColor: '#F86C6B',
                confirmButtonColor: '#4DBD74',
              })
              this.listaVehiculos.splice(i,1);
              this.lcargando.ctlSpinner(false);
              this.commonVarSrv.numVehiculos.next(this.listaVehiculos.length);
            },
            (err) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.error(err.error.message, 'Error al intentar eliminar tonelaje');
            }
          )
        }
      }
    });

  }

}
