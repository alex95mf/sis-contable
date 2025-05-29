import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormRentasService } from '../form-rentas.service';


@Component({
standalone: false,
  selector: 'app-modal-activos',
  templateUrl: './modal-activos.component.html',
  styleUrls: ['./modal-activos.component.scss']
})
export class ModalActivosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  fTitle: string = "Registro de valores de activos";
  msgSpinner: string = "Cargando...";
  @Input() contr: any;
  @Input() permisos: any;

  vmButtons: any = [];
  listaActivos: any = [];

  periodo: any;

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private apiSrv: FormRentasService,
    ) { 
      this.commonVarSrv.guardarActivos.asObservable().subscribe(
        (res) => {
          // console.log(res);
          this.listaActivos = res['data']; // se actualiza la lista para que tenga ids en caso que se agreguen

          // sort descendiente
          this.listaActivos.sort(function(a,b) {
            return parseFloat(b.periodo) - parseFloat(a.periodo);
          });
        }
      )
    }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsActivosModal", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: " GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsActivosModal", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    // console.log(this.contr);

    setTimeout(() => {
      this.cargarActivos();
    }, 0)


  }

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    // console.log(key)
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validarActivos();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  cargarActivos() {
    let id = this.contr.id_cliente;
    let data = {
      id_contribuyente: id
    }
    // console.log(data);
    this.msgSpinner = "Cargando activos por contribuyente...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getActivosByContribuyente(data).subscribe(
      (res) => {
        // console.log(res);
        this.listaActivos = res['data'];
        this.listaActivos.sort(function(a,b) {
          return parseFloat(b.periodo) - parseFloat(a.periodo);
        });
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error al intentar cargar activos');
      }
    )
  }

  handleActivo(item) {
    item.patrimonio = item.activos - item.pasivos;
  }

  handlePasivo(item) {
    item.patrimonio = item.activos - item.pasivos;
  }

  handleIngreso(item) {
    item.resultado = item.ingresos - item.egresos;
  }

  handleEgreso(item) {
    item.resultado = item.ingresos - item.egresos;
  }

  eliminar(item, i) {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Está seguro que desea eliminar este registro?",
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
        if(item.id_registro_activo==0){
          this.listaActivos.splice(i,1);
        } else if (item.id_registro_activo!=0){
          // borrar de ade veras
          this.msgSpinner = "Eliminando registro de activos...";
          this.lcargando.ctlSpinner(true);

          let data = {
            id_registro_activo: item.id_registro_activo
          }

          this.apiSrv.deleteActivo(data).subscribe(
            (res) => {
              // console.log(res);
              Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "El registro de activos ha sido eliminado con éxito",
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                cancelButtonColor: '#F86C6B',
                confirmButtonColor: '#4DBD74',
              })
              this.listaActivos.splice(i,1);
              this.lcargando.ctlSpinner(false);
            },
            (err) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.error(err.error.message, 'Error al intentar eliminar registro de activos');
            }
          )
        }
      }
    });

  }

  agregaActivos() {
    let nuevo = {
      id_registro_activo: 0,
      fk_contribuyente: this.contr.id_cliente,
      periodo: this.periodo,
      activos: 0,
      pasivos_corrientes: 0,
      pasivos: 0,
      patrimonio: 0,
      ingresos: 0,
      egresos: 0,
      resultado: 0,
    }

    if (!this.periodo){
      this.toastr.warning("Debe ingresar un periodo primero.", this.fTitle);
      this.periodo=null;
    } else if (this.periodo.toString().length!=4) {
      this.toastr.warning("El formato del periodo no es el adecuado.", this.fTitle);
      this.periodo=null;
    } else {
      this.listaActivos.forEach(i => {
        // console.log(i);
        if (this.periodo==i.periodo){
          this.toastr.warning("Solo se permite un registro por periodo.", this.fTitle);
          this.periodo=null;
        } 
        
      });
    }
    if(this.periodo) {
      this.listaActivos.push(nuevo);
    }
  }

  async validarActivos() {
    if(this.permisos.guardar=="0") {
      this.toastr.warning("No tiene permisos para crear nuevos Activos.");
    } else if (this.permisos.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Activos.", this.fTitle);
    } else {
      let resp = await this.validarCampos().then((respuesta) => {
        if(respuesta) {
          this.guardarActivos();
        }
      });
    }
  }

  validarCampos() {
    let flag = false;
    return new Promise((resolve, reject) => {
      this.listaActivos.forEach((r, index, array) => {
        // console.log(r);
        if(
          r.periodo == 0 ||
          r.periodo == undefined  
        ) {
          this.toastr.info("El campo periodo no puede ser vacío en periodo: "+r.periodo);
          flag = true;
          resolve(false);
        } else if(
          r.activos <= 0 ||
          r.activos == undefined
        ) {
          this.toastr.info("El valor de activos debe ser mayor a 0 en periodo: "+r.periodo);
          flag = true;
          resolve(false);
        } else if(
          r.pasivos_corrientes <= 0 ||
          r.pasivos_corrientes == undefined
        ) {
          this.toastr.info("El valor de pasivos corrientes debe ser mayor a 0 en periodo: "+r.periodo);
          flag = true;
          resolve(false);
        } else if(
          r.pasivos <= 0 ||
          r.pasivos == undefined
        ) {
          this.toastr.info("El valor de pasivos totales debe ser mayor a 0 en periodo: "+r.periodo);
          flag = true;
          resolve(false);
        } else if (r.pasivos_corrientes > r.pasivos) {
          this.toastr.info("El valor de pasivos corrientes no puede ser mayor a los pasivos totales.");
          flag = true;
          resolve(false);
        } 
        // else if(
        //   r.patrimonio<0 ||
        //   r.patrimonio == undefined
        // ) {
        //   this.toastr.info("El campo patrimonio debe ser mayor o igual a 0");
        //   flag = true;
        // } 
        else if(
          r.ingresos <= 0 ||
          r.ingresos == undefined
        ) {
          this.toastr.info("El valor de ingresos debe ser mayor a 0 en periodo: "+r.periodo);
          flag = true;
          resolve(false);
        }
        //  else if(
        //   r.resultado<0 ||
        //   r.resultado == undefined
        // ) {
        //   this.toastr.info("El campo resultado debe ser mayor o igual a 0");
        //   flag = true;
        // }
        // para que se resuelva la promesa true solo en la ultima iteracion
        if( index === array.length - 1){
          !flag ? resolve(true) : resolve(false);
        }
        
        
      });
      
    });
  }

  guardarActivos() {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Está seguro que desea guardar estos registros?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result)=>{

      if(result.isConfirmed){
        this.msgSpinner = "Guardando registros de activos...";
        this.lcargando.ctlSpinner(true);

        let data = {
          params: this.listaActivos
        }

        this.apiSrv.saveActivos(data).subscribe(
          (res) => {
            // console.log(res);
            Swal.fire({
              icon: "success",
              title: "¡Éxito!",
              text: "Registros de activos guardados con éxito",
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              cancelButtonColor: '#F86C6B',
              confirmButtonColor: '#4DBD74',
            })
            this.commonVarSrv.guardarActivos.next(res);
            this.lcargando.ctlSpinner(false);
          },
          (err) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.error(err.error.message, 'Error al intentar guardar registros de activos');
          }
        )
      }
    });
    
  }
}
