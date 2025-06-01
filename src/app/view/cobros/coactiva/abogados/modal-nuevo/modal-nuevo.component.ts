import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JuiciosService } from '../../juicios/juicios.service';
import { CommonVarService } from 'src/app/services/common-var.services';

@Component({
standalone: false,
  selector: 'app-modal-nuevo',
  templateUrl: './modal-nuevo.component.html',
  styleUrls: ['./modal-nuevo.component.scss']
})
export class ModalNuevoComponent implements OnInit {
  botonera: any = [];
  fTitle = "Nuevo Abogado"

    permissions: any  
    abogado = {
      nombres:'',
      apellidos:'',
      matricula:'',
      cedula:'',
      email:'',
      estado:''
      
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

    
  estados: any[] = [
    { id: 'A', nombre: 'ACTIVO' },
    { id: 'I', nombre: 'INACTIVO' },
    { id: 'X', nombre: 'ANULADO' },

  ]
  constructor(

    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private toastr: ToastrService,
    private juicsrv:JuiciosService
  ) { }

  ngOnInit(): void {
    this.botonera = [
      { orig: "btnPass", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnPass", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
  ]
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.saveAbogado();
        break;
      case "CERRAR":
        this.cerrarModal();
        break;
    }
  }

  cerrarModal() {
    this.modal.dismiss();
  }

  saveAbogado(){
    this.validarDatos().then(
      (_) => {
              this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
              let parametros = {
                  abogado:

                      {
                        "nombres":this.abogado.nombres,
                        "apellidos":this.abogado.apellidos,
                        "cedula":this.abogado.cedula,
                        "matricula":this.abogado.matricula,
                        "email":this.abogado.email,
                        "estado":this.abogado.estado,
                        "id_usuario":this.dataUser.id_usuario
                    }
              };
              this.juicsrv.saveAbogado(parametros).subscribe(res => {
                  console.log(res);
                  Swal.fire({
                    title: this.fTitle,
                    text: res['data']['message'] == 'OK' ? 'Datos del Abogado almacenado correctamente' : '',
                    icon: 'success'
                  })
                  this.cerrarModal();
                  this.commonVarService.updateAbogados.next(res)
                  //this.modalService.open(ModalAbogadosComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })

              });
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

}
