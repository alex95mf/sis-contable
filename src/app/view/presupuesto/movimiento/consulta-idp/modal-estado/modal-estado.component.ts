import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ConsultaIdpService } from '../consulta-idp.service';

@Component({
standalone: false,
  selector: 'app-modal-estado',
  templateUrl: './modal-estado.component.html',
  styleUrls: ['./modal-estado.component.scss']
})
export class ModalEstadoComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  estado: any = [
    {valor: 'E', descripcion: 'Emitido'},
    {valor: 'C', descripcion: 'Comprometido'},
    {valor: 'D', descripcion: 'Devengado'},
    {valor: 'P', descripcion: 'Pagado'},
    {valor: 'A', descripcion: 'Anulado'}
  ];

  newData = {
    id: null,
    estado: null,
    observacion: null
  }

  @Input() id: any
  @Input() estad: any
  @Input() observ: any

  vmButtons: any = []
  constructor(
    private toastr: ToastrService,
    private modal: NgbActiveModal,
    private service: ConsultaIdpService,
    private commonVrs: CommonVarService,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnListRecDocumento",
        paramAction: "",
        boton: {icon: "fas fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnListRecDocumento",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
      
    ]

    setTimeout(() => {
      this.newData.id = this.id
      this.newData.estado = this.estad
      if(this.observ){
        this.newData.observacion = this.observ
      }

    }, 50);


  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.guardar();
        break;
    }
  }

  closeModal(){
    this.modal.close();
  }

  guardar(){
    
    if(this.newData.estado == null){
      return this.toastr.info('Escoja un estado')
    }
    else if(this.newData.observacion == null){
      return this.toastr.info('Ingrese una observacion')
    }
    this.lcargando.ctlSpinner(true);
    this.service.setEstado(this.newData).subscribe(
      (e)=>{
        console.log(e);
        this.lcargando.ctlSpinner(false);
        this.modal.close();
        this.commonVrs.modalCambioEstaIDP.next();
      },
      (error)=>{
        this.toastr.info(error['message'])
        console.log(error);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

}
