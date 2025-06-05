import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ConsultaDocumentosService } from '../consulta-documentos.service';

@Component({
standalone: false,
  selector: 'app-detalles-gestion-garantia',
  templateUrl: './detalles-gestion-garantia.component.html',
  styleUrls: ['./detalles-gestion-garantia.component.scss']
})
export class DetallesGestionGarantiaComponent implements OnInit {

  @Input() detalles: any;

  dataDetalles: any;
  vmButtons: any;
  estado: any;

  estadoList = [
    {value: 'E',label: "EJECUTADO"},
    {value: 'P',label: "PENDIENTE"},
    {value: 'C',label: "CUMPLIDO"}
  ]

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";

  constructor(
    private ngModal: NgbActiveModal,
    private service: ConsultaDocumentosService,
    private tsr: ToastrService,
    private commonVr: CommonVarService
  ) { }

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

    this.dataDetalles = this.detalles.observacion;
    this.estado = this.detalles.estado
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
    (this as any).mensajeSpinner = "Guardando detalles...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id: this.detalles.id_documento,
      observacion: this.dataDetalles,
      estado: this.estado
    }

    this.service.guardarObservacion(data).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.ngModal.close();
        this.commonVr.modalMovimientoBanco.next(null);
      },
      (error)=>{
        this.tsr.info('Ocurrio un error en la peticion ', error.message)
        this.lcargando.ctlSpinner(false);
      }
    )
  }

}
