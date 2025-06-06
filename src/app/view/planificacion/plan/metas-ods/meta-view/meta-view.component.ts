import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MetasOdsService } from '../metas-ods.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-meta-view',
  templateUrl: './meta-view.component.html',
  styleUrls: ['./meta-view.component.scss']
})
export class MetaViewComponent implements OnInit {
  @Input() registro
  @Input() catalogos

  @Output() is_updated: EventEmitter<any> = new EventEmitter();

  metaOpciones = {
    programa: 0,
    ods: 0,
    ond: 0,
    eje: 0,
    metaZonal: 0,
    competencia: 0,
    oe: 0,
    metaResultado: 0,
    indicador: 0,
    tendencia: 0,
    intervencion: 0
  }

  fTitle = 'Modificacion de Metas'
  vmButtons = []


  constructor(
    private commonServices: CommonService,
    private activeModal: NgbActiveModal,
    private metasService: MetasOdsService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsMetaView", paramAccion: "", boton: { icon: "fa fa-edit", texto: "ACTUALIZAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsMetaView", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false }
    ]

    Object.assign(this.metaOpciones, this.registro)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "ACTUALIZAR":
        this.actualizaMeta();
        break;
      case "CERRAR":
        this.cierraModal();
        break;
    }
  }

  cierraModal() {
    this.activeModal.dismiss()
  }

  actualizaMeta() {
    Swal.fire({
      title: 'Metas y Estrategias',
      text: 'Esta seguro de actualizar las metas y estrategias para este departamento?',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
    }).then(result => {
      if (result.value) {
        let data = {
          accion: 'ACTUALIZA_METAS',
          ip: this.commonServices.getIpAddress(),
          id_controlador: myVarGlobals.fProgMetas,

          params: [this.metaOpciones]
        }
        // console.log(data);
        this.metasService.guardaMetas(data).subscribe(
          res => {
            this.is_updated.emit(res)
          },
          err => {
            console.log(err)
          }
        )
      } else {
        this.cierraModal()
      }
    })
    
  }
}
