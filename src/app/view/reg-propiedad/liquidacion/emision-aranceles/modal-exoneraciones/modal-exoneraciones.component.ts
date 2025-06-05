import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from '../../../../../services/common-var.services'
// import { GeneracionService } from '../generacion.service';
import { EmisionArancelesService } from '../emision-aranceles.service';

@Component({
standalone: false,
  selector: 'app-modal-exoneraciones',
  templateUrl: './modal-exoneraciones.component.html',
  styleUrls: ['./modal-exoneraciones.component.scss']
})
export class ModalExoneracionesComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() exoneracionesSelect: any = [];
  @Input() arancel: any;
  @Input() validacion: any;
  @Input() contribuyente: any;

  fTitles = "Exoneraciones disponibles"
  
  vmButtons: any;

  exoneraciones: any = [];

  constructor(
    private apiService: EmisionArancelesService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnModalExoner", paramAccion: "", boton: { icon: "fas fa-plus", texto: "APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalExoner", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    
    setTimeout(()=> {
      if(this.validacion){
        this.exoneraciones = this.arancel['exoneraciones']
        this.vmButtons[0].showimg = false
        this.fTitles = "Detalles de exoneraciones aplicadas"
      }else{
        this.cargarExoneraciones();
      }
      
    }, 0);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "APLICAR":
        this.aplicarExoneracion();
        
        break;
    }
  }

  aplicarExoneracion(){
    this.exoneracionesSelect = []
    let porcentaje = 0;
    this.exoneraciones.forEach(e => {
      if (e.action) {
        e['decuento'] = Math.floor(this.arancel['valor'] * e['porcentaje'])
        this.exoneracionesSelect.push(e);
        porcentaje += parseFloat(e.porcentaje);
      }
    })
    this.arancel['exoneraciones'] = this.exoneracionesSelect;
    if((porcentaje*100) > 100){
      porcentaje = 1
    }
    const sta = 2
    const descuento = Math.floor(this.arancel['valor'] * porcentaje * 100) / 100
    this.arancel['porcentaje_exoneracion'] = porcentaje;
    this.arancel['descuento'] = descuento;
    this.arancel['total'] = this.arancel['valor'] - descuento;
    this.arancel['cobro'] = this.arancel['valor'] - descuento + sta
    console.log(this.arancel);
    this.closeModal(this.arancel);
  }

  cargarExoneraciones() {
    (this as any).mensajeSpinner = "Cargando lista de Exoneraciones..."
    this.lcargando.ctlSpinner(true);

    this.apiService.getExoneraciones({contribuyente: this.contribuyente.id_cliente, concepto: { codigo: 'RP' }}).subscribe(
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
      this.commonVarService.selectExonerLiqRP.next(data);
    }
    this.activeModal.dismiss();
  }

}
