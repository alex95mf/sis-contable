import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from '../../../../../services/common-var.services'
import { GeneracionValorService } from '../generacion-valor.service';

@Component({
  selector: 'app-modal-exoneraciones',
  templateUrl: './modal-exoneraciones.component.html',
  styleUrls: ['./modal-exoneraciones.component.scss']
})
export class ModalExoneracionesComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() exoneracionesSelect: any = [];
  @Input() contribuyente: any;
  
  vmButtons: any;

  exoneraciones: any = [];

  constructor(
    private apiService: GeneracionValorService,
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
    
    setTimeout(()=> {
      this.cargarExoneraciones();
    }, 0);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " APLICAR":
        this.exoneracionesSelect = []
        this.exoneraciones.forEach(e => {
          if (e.action) {
            this.exoneracionesSelect.push(e);
          }
        })
        this.closeModal(this.exoneracionesSelect);
        break;
    }
  }

  cargarExoneraciones() {
    this.mensajeSppiner = "Cargando lista de Exoneraciones..."
    this.lcargando.ctlSpinner(true);

   // let data = {concepto: {codigo: "LC"}}
   let data = {
    contribuyente: this.contribuyente.id_cliente,
    concepto: {
      codigo: "CV"
    }
  }

    //this.apiService.getExoneraciones(data).subscribe(
    this.apiService.getExoneracionesCodigo(data).subscribe(
      (res) => {
        this.exoneraciones = res['data'];
        this.exoneraciones.forEach(e => Object.assign(e, {action: false}));
        this.exoneracionesSelect.forEach(e => {
          this.exoneraciones.filter(f => f.id == e.id)[0].action = true;
        });
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  closeModal(data?:any) {
    if(data){
      this.commonVarService.selectExonerLiqPURen.next(data);
    }
    this.activeModal.dismiss();
  }

}
