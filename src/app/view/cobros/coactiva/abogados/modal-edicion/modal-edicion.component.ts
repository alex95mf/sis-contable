import { Component,Input, OnInit,ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JuiciosService } from '../../juicios/juicios.service';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { AbogadosService } from '../abogados.service';

@Component({
  selector: 'app-modal-edicion',
  templateUrl: './modal-edicion.component.html',
  styleUrls: ['./modal-edicion.component.scss']
})
export class ModalEdicionComponent implements OnInit {
  msgSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  botonera: any = [];
  abogado: any;
  estados: any[] = [
    { value: 'A', label: 'ACTIVO' },
    { value: 'I', label: 'INACTIVO' },
    { value: 'X', label: 'ANULADO' },

  ]
  @Input() data: any;
  @Input() isNew: any;
  fTitle = "Editar Abogado"
  needRefresh: boolean = false;
  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private juicsrv:JuiciosService,
    private abogsrv: AbogadosService,
    private commonVarSrv: CommonVarService,) 
    {

     }


     ngOnInit(): void {
      this.botonera = [
        { orig: "btnPass", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
        { orig: "btnPass", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ]
    this.abogado = {
      nombres: "",
      apellidos: "",
      email: "",
      cedula: "",
      matricula: "",
      estado: ""
    }
    setTimeout(() => {
      if (!this.isNew) {
        this.fillAbogado();
      }

    }, 0);
    }


    metodoGlobal(evento: any) {
      switch (evento.items.boton.texto) {
        case "GUARDAR":
          this.editAbogado();
          break;
        case "CERRAR":
          this.cerrarModal();
          break;
      }
    }

    fillAbogado() {
      this.msgSpinner = "Cargando datos...";
      this.lcargando.ctlSpinner(true);
      console.log(this.data)
      let abogado = {
        id: this.data.id,
      }
  

          this.abogado = {
            nombres: this.data.nombres,
            apellidos: this.data.apellidos,
            email: this.data.email,
            estado: this.data.estado,
            matricula: this.data.matricula,
            cedula: this.data.cedula,
          }
          console.log(this.abogado);
          //this.getCatalogs();
          this.lcargando.ctlSpinner(false);
    }


    editAbogado() {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea editar los datos del Abogado?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {

          let data = {
            abogado: {
              nombres: this.abogado.nombres,
              apellidos: this.abogado.apellidos,
              email: this.abogado.email,
              estado: this.abogado.estado,
              matricula: this.abogado.matricula,
              cedula: this.abogado.cedula,
            }
          }
          console.log(this.abogado);
          this.validarDatos().then(
            (_) => {
          this.abogsrv.editAbogado(this.data.id, data).subscribe(
            (res) => {
              if (res["status"] == 1) {
                console.log(res);
                this.needRefresh = true;
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "success",
                  title: "Abogado Actualizado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.cerrarModal();
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
        ,
            (_) => {
              Swal.fire({
                title: this.fTitle,
                text: 'Se han presentado errores de validación, por favor verificar.',
                icon: 'warning'
              })
            })
        }
      });
    }
    validarDatos() {
      let invalid = false
      return new Promise((resolve, reject) => {
        if (!this.abogado.nombres.trim().length) {
              this.toastr.warning('No ha ingresado un Nombre', this.fTitle)
              invalid = true
        }else if (this.abogado.apellidos == '') {
          this.toastr.warning('No ha ingresado un Apellido', this.fTitle)
          invalid = true
        }
        else if (this.abogado.email == '') {
          this.toastr.warning('No ha ingresado un Correo electrónico', this.fTitle)
          invalid = true
        }
        else if (this.abogado.matricula == '') {
         this.toastr.warning('No ha ingresado un No. Contrato', this.fTitle)
         invalid = true
        }
        else if (this.abogado.cedula == '') {
        this.toastr.warning('No ha ingresado un No. Cédula', this.fTitle)
        invalid = true
        }else if (this.abogado.estado == '') {
          this.toastr.warning('No ha ingresado un Estado', this.fTitle)
          invalid = true
          }
        !invalid ? resolve(!invalid) : reject(invalid)
      })
    }
  
    cerrarModal() {
      this.commonVarSrv.editAbogado.next(this.needRefresh);
      this.modal.dismiss();
    }
  

}
