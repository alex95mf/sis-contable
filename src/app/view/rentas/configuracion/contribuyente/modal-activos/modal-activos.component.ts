import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ContribuyenteService } from '../contribuyente.service';
import { ModalActivosCiudadComponent } from './modal-activos-ciudad/modal-activos-ciudad.component';


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



  tipo_e: any  = ['directa', 'declaración'];
  declara_e: any =['original', 'sustitutiva'];

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private apiSrv: ContribuyenteService,
    private modalService: NgbModal
    ) {
      this.commonVarSrv.guardarActivos.asObservable().subscribe(
        (res) => {
          console.log(res);
          this.listaActivos = res['data']; // se actualiza la lista para que tenga ids en caso que se agreguen
          res['data'].map(
            (e)=>{

              if(e.tipo == 'directa'){
                e['variable'] = true;
                e['variable_declara'] = true;
              }else{
                e['variable'] = false;
                e['variable_declara'] = false;
              }


            }
          )
          // sort descendiente
          this.listaActivos.sort(function(a,b) {
            return parseFloat(b.periodo) - parseFloat(a.periodo);
          });
        }
      )

      this.commonVarSrv.loadActivo.asObservable().subscribe(
        (res) => {
          this.contr = {id_cliente: res.id_cliente};
          // console.log(this.contr, this.permisos);
          this.cargarActivos();

        }
      )

      this.commonVarSrv.clearContribu.asObservable().subscribe(
        (res) => {
          this.listaActivos= [];
        }
      )


    }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsActivosModal", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsActivosModal", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    // console.log(this.contr);

    setTimeout(() => {

    }, 0)


  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "GUARDAR":
        this.validarActivos();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }


  modalActivosCiudad(local){
    if(local.id_registro_activo == 0){
      return this.toastr.info('Guarde primero la asignacion de capitales')
    }
    const modalActivosCiudad = this.modalService.open(ModalActivosCiudadComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    console.log(local);

    modalActivosCiudad.componentInstance.permisos = this.permisos;
    modalActivosCiudad.componentInstance.contr = this.contr;
    modalActivosCiudad.componentInstance.periodo = local.periodo
    modalActivosCiudad.componentInstance.ingresos = local.ingresos
    modalActivosCiudad.componentInstance.activos = local.activos
    modalActivosCiudad.componentInstance.patrimonio = local.patrimonio

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
        res['data'].map(
          (e)=>{

            if(e.tipo == 'directa'){
              e['variable'] = true;
              e['variable_declara'] = true;
            }else{
              e['variable'] = false;
              e['variable_declara'] = false;
            }


          }
        )
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

  cambioTipo(event, item){
    console.log(event, item);
    if(event == 'directa' ){
      item.variable = true;
      item.variable_declara = true
    }else{
      item.variable = false;
      item.variable_declara = false

    }

  }



  eliminar(item, i) {
    Swal.fire({
      icon: "warning",
      title: "Atencion!",
      text: "Esta seguro que desea eliminar este registro?",
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
                title: "Exito!",
                text: "El registro de activos ha sido eliminado con exito",
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
      pasivos_contingentes: 0,
      pasivos: 0,
      patrimonio: 0,
      ingresos: 0,
      egresos: 0,
      resultado: 0,
      observacion: null,
      variable: true,
      variable_declara: true,
      fecha: null,
      tipo: 0,
      declarativa: 0,

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
      this.toastr.warning("No tiene permisos para crear nuevos Conceptos Detalle.");
    } else if (this.permisos.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Conceptos.", this.fTitle);
    } else {
      try {
        await this.validarCampos()

        this.guardarActivos();
      } catch (err) {
        console.log(err)
        this.toastr.warning(err, 'Validacion de Datos', {enableHtml: true})
      }
      /* let resp = await this.validarCampos().then((respuesta) => {
        if(respuesta) {
          this.guardarActivos();
        }
      }); */
    }
  }



  validarCampos() {
    return new Promise<void>((resolve, reject) => {
      let msgInvalid = ''

      this.listaActivos.forEach((element: any, idx: number) => {
        if (element.periodo == 0 || element.periodo == undefined) msgInvalid += `* El campo Periodo no puede ser vacio en item ${idx + 1}.<br>`
        if (element.activos <= 0 || element.activos == undefined) msgInvalid += `* El valor de activos debe ser mayor a 0 en periodo ${element.periodo}.<br>`
        if (element.pasivos_corrientes <= 0 || element.pasivos_corrientes == undefined) msgInvalid += `* El valor de pasivos corrientes debe ser mayor a 0 en periodo ${element.periodo}.<br>`
        if (element.pasivos <= 0 || element.pasivos == undefined) msgInvalid += `* El valor de pasivos totales debe ser mayor a 0 en periodo ${element.periodo}.<br>`
        if (parseFloat(element.pasivos_corrientes) + parseFloat(element.pasivos_contingentes) > parseFloat(element.pasivos)) msgInvalid += `* La suma de Pasivos Corrientes y Contingentes no puede ser mayor a los Pasivos Totales en periodo ${element.periodo}.<br>`
      })

      return (msgInvalid.length > 0) ? reject(msgInvalid) : resolve()
    });
  }

  guardarActivos() {

    Swal.fire({
      icon: "warning",
      title: "Atención!",
      text: "Esta seguro que desea guardar estos registros?",
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
              title: "Éxito!",
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
