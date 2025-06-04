import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from '../../../../../services/common-var.services'
import { LiquidacionService } from '../liquidacion.service';

@Component({
standalone: false,
  selector: 'app-modal-conceptos',
  templateUrl: './modal-conceptos.component.html',
  styleUrls: ['./modal-conceptos.component.scss']
})
export class ModalConceptosComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() exoneracionesSelect: any = [];
  @Input() conceptos: any [];
  
  vmButtons: any;

  constructor(
    private apiService: LiquidacionService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnModalExoner", paramAccion: "", boton: { icon: "fas fa-plus", texto: " APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalExoner", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " APLICAR":
        /*this.exoneracionesSelect = []
        this.conceptos.forEach(e => {
          if (e.aplica) {
            this.exoneracionesSelect.push(e);
          }
        })*/
        this.closeModal(this.conceptos);
        break;
    }
  }

  closeModal(data?:any) {
    if(data){
      this.commonVarService.selectConcepLiqLCRen.next(data);
    }
    this.activeModal.dismiss();
  }

}
