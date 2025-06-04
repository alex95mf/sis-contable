import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { GestionMovimientoBancarioService } from '../gestion-movimiento-bancario.service';

@Component({
standalone: false,
  selector: 'app-detalles-movimientos-banc',
  templateUrl: './detalles-movimientos-banc.component.html',
  styleUrls: ['./detalles-movimientos-banc.component.scss']
})
export class DetallesMovimientosBancComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string;


  @Input() detalles :any;

  dataTransaccion: any ;
  vmButtons: any
  num_preimpreso: any;

  constructor(
    private ngModal: NgbActiveModal,
    private service: GestionMovimientoBancarioService,
    private tsr: ToastrService,
    private commonVr: CommonVarService
  ) {

  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsMovimientoBanc",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
        printSection: "PrintSection", imprimir: true
      },
      {
        orig: "btnsMovimientoBanc",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        printSection: "PrintSection", imprimir: true
      },

    ]

    this.dataTransaccion = this.detalles;
    this.num_preimpreso = this.detalles.num_preimpreso == '0' ? '': this.detalles.num_preimpreso



  }


  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " REGRESAR":
       this.ngModal.close()

      break;
      case " GUARDAR":
        this.guardarDetalles();
      break;
    }
  }


  guardarDetalles(){
    this.mensajeSpinner = "Guardando detalles...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id: this.dataTransaccion.id,
      num: this.num_preimpreso
    }

    this.service.guardarNumeroPreImpreso(data).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.ngModal.close()
        this.commonVr.modalMovimientoBanco.next(null)
      },
      (error)=>{
        this.tsr.info('Ocurrio un error en la peticion ', error.message)
        this.lcargando.ctlSpinner(false);
      }
    )
  }

}
