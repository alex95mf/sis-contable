import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';

@Component({
standalone: false,
  selector: 'app-force-cierre',
  templateUrl: './force-cierre.component.html',
  styleUrls: ['./force-cierre.component.scss']
})
export class ForceCierreComponent implements OnInit {
  @Input() caja: any;
  @Input() arrayUsers: any;
  vmButtons: any;
  dataUser: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
  ) { }

  ngOnInit(): void {
    this.caja.concep_force_box = "";
    this.caja.pass = "";
    this.caja.valor_cierre = parseFloat(this.caja.valor_cierre).toFixed(2);

    this.vmButtons = [
      { orig: "btnForceCierre", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnForceCierre", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    setTimeout(() => {
      document.getElementById('IdValue').focus();
    }, 100);
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "GUARDAR":
        this.setSupervisorBox();
        break;
    }
  }

  showPass() {
    var tipo = document.getElementById("password").getAttribute("type")
    if (tipo == "password") {
      document.getElementById("password").setAttribute("type", "text");
    } else {
      document.getElementById("password").setAttribute("type", "password");
    }
  }

  setSupervisorBox() {
    if (this.caja.supervisor == 0) {
      this.toastr.info("Seleccione un usuario supervisor");
    } else if (this.caja.pass == "" || this.caja.pass == undefined || this.caja.pass == null) {
      this.toastr.info("Ingrese una contraseña");
      document.getElementById('password').focus();
    } else if (this.caja.concep_force_box == "" || this.caja.concep_force_box == undefined || this.caja.concep_force_box == null) {
      this.toastr.info("Ingrese un concepto");
      document.getElementById('idConceptoForce').focus();
    } else {
      this.commonVarSrvice.setSupervisorBox.next(this.caja);
      this.closeModal();
    }
  }

  calculatedDiference(){
    if(parseFloat(this.caja.valor_cierre) > parseFloat(this.caja.total_venta_periodo)){
      this.caja.valor_cierre = parseFloat('0').toFixed(2);
      this.caja.valor_inconsistencia = parseFloat('0').toFixed(2);
    }else{
      this.caja.valor_inconsistencia = parseFloat(this.caja.valor_cierre) - parseFloat(this.caja.total_venta_periodo);
      this.caja.valor_inconsistencia = parseFloat(this.caja.valor_inconsistencia).toFixed(2);
    }
  }

}
