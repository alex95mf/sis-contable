import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CanjearRegularizarService } from './canjear-regularizar.service';

@Component({
standalone: false,
  selector: 'app-canjear-regularizar',
  templateUrl: './canjear-regularizar.component.html',
  styleUrls: ['./canjear-regularizar.component.scss']
})
export class CanjearRegularizarComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Canjear/Regularizar";
  msgSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  pagosAnteriores: any = [];
  paginate: any;
  filter: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: CanjearRegularizarService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnCanjeRegularizar",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.filter = {
      fecha_docu: undefined,
      num_comprobante: undefined,
      cod_referencia: undefined,
      valor: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(() => {
      this.cargarPagosAnteriores();
    }, 50);
  }

  cargarPagosAnteriores(){

  }

  limpiarFiltros() {
    this.filter.fecha_docu = undefined;
    this.filter.num_comprobante = undefined;
    this.filter.cod_referencia = undefined;
    this.filter.valor = undefined;
  }

}
