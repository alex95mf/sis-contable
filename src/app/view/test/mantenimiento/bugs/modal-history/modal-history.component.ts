import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { BugsServiceService } from '../bugs-service.service';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { CcInputGroupPrepend } from 'src/app/config/custom/cc-input-group-prepend.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CcSpinerProcesarComponent,
    ButtonRadioActiveComponent,
    CcInputGroupPrepend,
    NgSelectModule
  ],
  templateUrl: './modal-history.component.html',
  styleUrls: ['./modal-history.component.scss']
})
export class ModalHistoryComponent implements OnInit {

  vmButtonsHistory: Array<any> = [];

  @Input() bug;
  @Input() lstestados;
  @Input() cmb_tipo_identificacion;
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent

  titleModal: String = "Registro de History";
  isNuevo: boolean=true;
  lstBugsHistory: Array<any> = [];



  bugHistory: any={

    fk_empleado: 92,
    fk_test_bugs: 0,


    fecha: moment().format('YYYY-MM-DD'),
    estado_history: "",
    observacion: "",
    costo: 0,

  }


  constructor(
    private activemodal: NgbActiveModal,
    private apiBugsService: BugsServiceService,
    private toastr: ToastrService

  ) {
    this.vmButtonsHistory = [
      {
        orig: 'btnsHistoryBubsModal',
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
        orig: 'btnsHistoryBubsModal',
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

   // this.lstBugsHistory= this.bug.history;
    this.bugHistory.fk_test_bugs = this.bug.id_test_bugs;



    //alert(JSON.stringify(this.bug));
    setTimeout(() =>this.cargarBugsHistory(),50);
  }

  async cargarBugsHistory() {
    this.lcargando.ctlMensaje("Actualizando History de Bugs....!!!");
    this.lcargando.ctlSpinner(true)



    this.lstBugsHistory = await this.apiBugsService.obtenerBugsHistory(this.bug.id_test_bugs);
    //console.log(bugs)
    //this.lst_bugs= bugs.data;
    //this.paginate.length = bugs.total;


    this.lcargando.ctlSpinner(false)
  }

  metodoGlobalHistory(parametro): void {
    switch (parametro.items.boton.texto) {
      case "Consultar":
        //this.consultar()
        break;
      case "Guardar":
        //this.guardar();
         //alert('grabar');
         this.guardar();
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
  expandEmpleado()
  {
    //this.modalService.open(ModalContribuyentesComponent,{size:"xl",backdrop:"static"})


  }
  async guardar() {

    let mensaje='';

    if (this.bugHistory.observacion.trim().length==0) mensaje+='* La observacion no puede ser vacia.<br>';

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
      this.lcargando.ctlSpinner(true)


      let respuesta;
       if (this.isNuevo)
      {

       // alert(JSON.stringify(this.bugHistory));
         respuesta = await this.apiBugsService.guardarBugHistory({ bugshistory: this.bugHistory });
      }
      else
      {
        // respuesta = await this.apiBugsService.modificarBug(this.bugHistory.id_test_bugs,{ bugs: this.bugNuevo });
      }
      this.lcargando.ctlSpinner(false)
      const result2=await Swal.fire({
        titleText:"Mensaje de Informacion", text:"Se guardó con éxito!!!",
        icon: 'success', confirmButtonText:"OK"
      });

      this.activemodal.close();
      this.apiBugsService.actualizarFormulario$.emit();

    }


      }

}
