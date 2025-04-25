import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ContratoService } from '../contrato.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';

@Component({
  selector: 'app-email-destinatario',
  templateUrl: './email-destinatario.component.html',
  styleUrls: ['./email-destinatario.component.scss']
})
export class EmailDestinatarioComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  @Input() contrato
  msgSpinner: string
  vmButtons = []
  fTitle: string = "Envio de Correo"

  email: string = ''

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: ContratoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsEmailDestinatario",
        paramAccion: "",
        boton: { icon: "far fa-paper-plane", texto: "ENVIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsEmailDestinatario",
        paramAccion: "",
        boton: { icon: "far fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]
    this.email = this.contrato.fk_contribuyente.email
  }

  metodoGlobal(event) {
    // console.log(event)
    switch (event.items.boton.texto) {
      case "ENVIAR":
        this.enviarCorreo()
        break;

      case "CANCELAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  enviarCorreo() {
    /** Envia correo */
    
    let data = {
      email: this.email,
      contrato: this.contrato.id,
      component: myVarGlobals.fRenContrato
    }

    this.msgSpinner = 'Enviando correo...'
    this.lcargando.ctlSpinner(true)
    this.apiService.enviarCorreo(data).subscribe(
      res => {
        this.lcargando.ctlSpinner(false)
        Swal.fire({
          title: this.fTitle,
          text: 'Envio de correo: ' + res['message'],
          icon: 'success'
        }).then(
          res => {
            this.activeModal.close()
          }
        )
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error enviando el correo')
      }
    )
  }

}
