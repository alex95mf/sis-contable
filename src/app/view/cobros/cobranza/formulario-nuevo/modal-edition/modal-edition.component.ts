import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { FormularioNuevoService } from '../formulario-nuevo.service';
import * as myVarGlobals from 'src/app/global';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
standalone: false,
  selector: 'app-modal-edition',
  templateUrl: './modal-edition.component.html',
  styleUrls: ['./modal-edition.component.scss']
})
export class ModalEditionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string = "Cargando...";
  fTitulo: string = "Recepción de Notificación";
  vmButtons: any;

  @Input() notificacion: any;

  estados: any[] = [
    { value: 0, label: 'Seleccione un Estado' },
    { value: 'P', label: 'Pendiente' },
    { value: 'R', label: 'Recibido' },
    { value: 'N', label: 'No Recibido' },
  ]
  notificadores: any[] = [
    { valor: 0, descripcion: 'Seleccione un Notificador' }
  ]
  validacionDetalles: boolean = false;  // Si hay datos almacenados, poner en solo lectura


  constructor(
    private commSrv: CommonVarService,
    private modal: NgbActiveModal,
    private apiService: FormularioNuevoService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsDetalles",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
        
      },
      {
        orig: "btnsDetalles",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        
      },
    ]

    setTimeout(() => {
      this.validacionDetalles = this.notificacion.fecha_recepcion != null;
      this.fillCatalog()
    }, 50)
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "GUARDAR":
        this.validacion();
        break;
      case "REGRESAR":
        this.modal.close()
        break;
    }
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.msgSpinner = "Cargando Catalogs";
    let data = {
      params: "'TIPO_NOTIFICADOR'",
    };
    this.apiService.getCatalogs(data).subscribe(
      (res: any) => {
        // console.log(res);
        res.data.TIPO_NOTIFICADOR.forEach((e: any) => {
          const { valor, descripcion } = e
          this.notificadores.push({ valor: valor, descripcion: descripcion })
        })

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  async validacion(){
    await this.validaDataGlobal().then(
      (respuesta)=>{
        if(respuesta){
          this.saveDetalles();
        }
      }
    );
  }

  validaDataGlobal() {
    // console.log(this.objRegistro);
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.notificacion.estado == 0 ||
        this.notificacion.estado == undefined
      ) {
        this.toastr.info("El campo tipo de estado no puede ser vacío");
        flag = true;
      }
      else if (
        this.notificacion.notificador == 0 ||
        this.notificacion.notificador == undefined
      ) {
        this.toastr.info("El campo notificador no puede ser vacío");
        flag = true;
      } else if (
        this.notificacion.persona_recepcion == "" ||
        this.notificacion.persona_recepcion == undefined
      ) {
        this.toastr.info("El campo persona que recibe no puede ser vacío");
        flag = true;
      }
      else if (
        this.notificacion.fecha_recepcion == 0 ||
        this.notificacion.fecha_recepcion == undefined
      ) {
        this.toastr.info("El campo fecha de recepcion no puede ser vacío");
        flag = true;
      }
      else if (
        this.notificacion.observacion == 0 ||
        this.notificacion.observacion == undefined
      ) {
        this.toastr.info("El campo observacion no puede ser vacío");
        flag = true;
      }

      !flag ? resolve(true) : resolve(false);
    })
  }

  saveDetalles() {
    this.msgSpinner = "Guardando"
    this.lcargando.ctlSpinner(true)
    // console.log({notificacion: this.notificacion})
    // return

    this.apiService.setNotificador({notificacion: this.notificacion}).subscribe(
      (res: any) => {
        console.log(res.data)
        this.lcargando.ctlSpinner(false)
        Swal.fire('Notificación actualizada con éxito', '', 'success').then((result)=>{
          this.modal.close()
        }

        )
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error guardando datos de Notificación')
      }
    )
  }

  /* saveDetalles(){
    this.mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.objRegistro['id_cob_notificacion'] = this.idNotificacion;
    this.objRegistro['fk_usuario_registro'] = this.dataUser['id_usuario'];

    console.log(this.objRegistro);
    this.serviceModalDet.updateNotificacionCobro(this.objRegistro).subscribe(
      (res)=>{
        console.log(res);
        this.commSrv.modalEditionDetallesCobro.next({})
        this.lcargando.ctlSpinner(false);
      }
    );

    this.modal.close();
  } */

  

}
