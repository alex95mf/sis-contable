import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BugsServiceService } from '../bugs-service.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

@Component({
standalone: false,
  selector: 'app-model-detalles',
  templateUrl: './model-detalles.component.html',
  styleUrls: ['./model-detalles.component.scss']
})
export class ModelDetallesComponent implements OnInit {
  @Input() bug;
  @Input() isNuevo;
  @Input() cmb_tipo_identificacion;
  @Input() lstestados;
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent

  vmButtons: Array<any> = [];
  titleModal: String = "";
  fecha: any = new Date;
  bugNuevo: any={

    fk_cliente: 0,
    fk_tipo_documento: 0,
    tipo_documento: "CEDULA",
    num_documento: "",
    fecha: moment().format('YYYY-MM-DD'),
    estado: "",
    observacion: "",
    costo: 0,
    histories:[]
  }

  constructor(
    private activemodal: NgbActiveModal,
    private apiBugsService: BugsServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private commonVarService: CommonVarService
  ) {

    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (contribuyente)=>{
        Object.assign(this.bugNuevo,{contribuyente
          ,fk_cliente:contribuyente.id_cliente
          ,num_documento:contribuyente.num_documento
          ,tipo_documento:contribuyente.tipo_documento
        });
      }

      );
    this.vmButtons = [
      {
        orig: 'btnsMantenimientoBubsModal',
        paramAccion: "",
        boton: { icon: "far fa-plus-square", texto: "Guardar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: 'btnsMantenimientoBubsModal',
        paramAccion: "",
        boton: { icon: "far fa-times", texto: "Cerrar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]
  }

  ngOnInit(): void {
    if (this.isNuevo)
      this.titleModal = "Crear Bug";
    else
      this.titleModal = "Editar Bug " + this.bug.id_test_bugs;

      if (this.bug)
      {
       // this.bugNuevo= this.bug;
       Object.assign(this.bugNuevo,this.bug);

      }

  }
  metodoGlobal(parametro): void {
    switch (parametro.items.boton.texto) {
      case "Consultar":
        //this.consultar()
        break;
      case "Guardar":
        this.guardar();
        // alert('grabar');
        //  this.guardar();
        break;
      case "Modificar":
        //   this.modificar(this.bug);

        break;
      case "Cerrar":
        this.activemodal.close();
        //   this.modificar(this.bug);

        break;
      default:
        break;
    }
  }

  async guardar() {

let mensaje='';

if (this.bugNuevo.observacion.trim().length==0) mensaje+='* La observacion no puede ser vacia.<br>';

if (mensaje.length>0)
{
  this.toastr.warning(mensaje,'Validacion de Datos',{enableHtml:true});
  return;
}



const result=await Swal.fire({
  titleText:"Mensaje de Confirmacion", text:"Estas seguro que desea guardar?",
  icon: 'question', showCancelButton:true, cancelButtonText:"No", confirmButtonText:"Si"
});

if (result.isConfirmed){

  this.lcargando.ctlMensaje("Guardando....!!!");
  this.lcargando.ctlSpinner(true);


  let respuesta;
  if (this.isNuevo)
  {
     respuesta = await this.apiBugsService.guardarBug({ bugs: this.bugNuevo });
  }
  else
  {
     respuesta = await this.apiBugsService.modificarBug(this.bugNuevo.id_test_bugs,{ bugs: this.bugNuevo });
  }
  this.lcargando.ctlSpinner(false)

  this.activemodal.close();
  this.apiBugsService.actualizarFormulario$.emit();

}


  }

  expandcontribuyente()
  {
    this.modalService.open(ModalContribuyentesComponent,{size:"xl",backdrop:"static"})
  }


}
