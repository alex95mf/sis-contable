import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JuiciosService } from '../juicios.service';
import * as myVarGlobals from 'src/app/global';
import { saturate } from '@amcharts/amcharts4/.internal/core/utils/Colors';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-modal-nuevoJuicio',
  templateUrl: './modal-nuevoJuicio.component.html',
  styleUrls: ['./modal-nuevoJuicio.component.scss']
})
export class ModalNuevoJuicioComponent implements OnInit {
    botonera: any = [];
    fTitle = "Nuevo Juicio"
    estados: any[] = [
        { id: 'EMI', value: 'EMITIDO' },
        { id: 'CIT', value: 'CITADO' },
        { id: 'CAN', value: 'CANCELADO' },
        { id: 'PUB', value: 'PUBLICADO' },
        { id: 'EMB', value: 'EMBARGO' },
        { id: 'REM', value: 'REMATE' },
        { id: 'RYP', value: 'REMATE Y PUBLICADO' },
        { id: 'POS', value: 'POSTURA' },
        { id: 'CAL', value: 'AUTO DE CALIFICACION' },
        { id: 'PUN', value: 'PUBLICADO - NOTIFICACION', pos: 5 },
        { id: 'PAP', value: 'PUBLICADO - AUTO DE PAGO', pos: 6 },
        { id: 'PUR', value: 'PUBLICADO - REMATE', pos: 7 },
        { id: 'ANU', value: 'ANULADO'},
      ];
      permissions: any  

      juicio = {
        fk_contribuyente: { razon_social: '', email: 'dbarrera@todotek.net' },
        proceso:'',
        total:0,
        observaciones:'',
        
      }

      expediente = {
        num_expediente:'', 
      }
      variableEstado: any;
      cmbEstado: any;
      proceso: any;
      contribuyente: any;
      total: any;
      observaciones: any;
      dataUser: any;
      user: any;
      id_cliente:0;
      cmbTipoGestion: any;

  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private juicsrv:JuiciosService
  ) {
    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      
        (res: any) => {
            
            this.juicio.fk_contribuyente = res
            console.log(res);
            this.id_cliente=res.id_cliente;
        }
    )

    
   
   }

  ngOnInit(): void {
    this.botonera = [
        { orig: "btnPass", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
        { orig: "btnPass", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ]

  }
  
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.saveJuicioExpediente();
        break;
      case "CERRAR":
        this.cerrarModal();
        break;
    }
  }

  cerrarModal() {
    this.modal.dismiss();
  }



  selectOption2(evt) { 
    if (evt !== 0) {
      this.variableEstado=evt;
      console.log(this.variableEstado);
	}
    return this.variableEstado;
    
  }


  
  saveJuicioExpediente(){
    this.validarDatos().then(
      (_) => {
              this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
              var today = new Date();
              var day = today.getDate();
              var month = today.getMonth() + 1;
              var year = today.getFullYear();
              var fecha_total=`${year}-${month}-${day}`;
              console.log(fecha_total);
              let parametros = {
                  juicio:

                      {"fk_contribuyente":this.id_cliente,
                      "num_proceso":this.juicio.proceso,
                      "total":this.juicio.total,
                      "saldo": this.juicio.total,
                      "estado": this.cmbEstado,
                      "fk_abogado":"",
                      "id_usuario":this.dataUser.id_usuario,
                      "valor": "0",
                      "activo": "1",
                      "elim_observacion":this.juicio.observaciones,
                      "elim_usuario":this.dataUser.id_usuario,
                      "fk_contribuyente2":this.id_cliente,
                      "tipo_gestion":this.cmbTipoGestion,
                      "fecha_vencimiento_titulo":"",
                      "fecha":fecha_total,
                      "total2":this.juicio.total,
                      "estado_email":"",
                      "estado2":"P",
                      "notificador":"",
                      "persona_recepcion":"",
                      "fecha_recepecion":"",
                      "fk_usuario_registro":"",
                      "observacion":"",
                      "usuario_id":this.dataUser.id_usuario,
                      "tipo":"EXPEDIENTE",
                      "juicio":"1",
                      "expediente":"0",
                      "num_expediente":this.expediente.num_expediente,
                      "periodo":"",
                      "fk_mercado":"",
                      "fk_puesto":"",
                      "fk_local":"",
                      "foto":"",
                    }
              };

              /*let parametrosExpediente = {
                  expediente:
                      {
                  }
              }*/
              this.juicsrv.saveJuicio(parametros).subscribe(res => {
                  console.log(res);
                  Swal.fire({
                    title: this.fTitle,
                    text: res['data']['message'] == 'OK' ? 'Juicio almacenado correctamente' : '',
                    icon: 'success'
                  })
                  this.cerrarModal();
            
              });
              //this.juicsrv.saveExpediente(parametrosExpediente).subscribe(res => {
                  //console.log(res);
                  
            
              //});
              
             

            },
            (_) => {
              Swal.fire({
                title: this.fTitle,
                text: 'Se han presentado errores de validación, por favor verificar.',
                icon: 'warning'
              })
            })

  }


  validarDatos() {
    let invalid = false
    return new Promise((resolve, reject) => {
      if (!this.juicio.fk_contribuyente.razon_social.trim().length) {
        this.toastr.warning('No ha seleccionado un Contribuyente', this.fTitle)
        invalid = true
      } else if (this.juicio.total == 0) {
        this.toastr.warning('No ha ingresado un Total', this.fTitle)
        invalid = true
      } else if (this.cmbEstado ==  undefined   || this.cmbEstado == null ) {
        this.toastr.warning('No ha elegido un Estado', this.fTitle)
        invalid = true
      } 
      else if (this.cmbTipoGestion ==  undefined   || this.cmbTipoGestion == null) {
        this.toastr.warning('No ha elegido un Tipo de Gestión:', this.fTitle)
        invalid = true
      }
      else if (this.juicio.proceso == '') {
        this.toastr.warning('No ha ingresado un Proceso', this.fTitle)
        invalid = true
      } else if (!this.juicio.observaciones.length) {
        this.toastr.warning('No ha ingresado una Observacion', this.fTitle)
        invalid = true
      }
      !invalid ? resolve(!invalid) : reject(invalid)
    })
  }




  
  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenContrato;
    modalInvoice.componentInstance.permissions = this.permissions;
  }




  
  
}
