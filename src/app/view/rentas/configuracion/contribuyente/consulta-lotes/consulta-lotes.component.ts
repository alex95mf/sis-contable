import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ConsultaLotesService } from './consulta-lotes.service'; 
import * as myVarGlobals from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory'; 
import { MatPaginator } from '@angular/material/paginator';
import { Paginator } from 'primeng/paginator';

@Component({
standalone: false,
  selector: 'app-consulta-lotes',
  templateUrl: './consulta-lotes.component.html',
  styleUrls: ['./consulta-lotes.component.scss']
})
export class ConsultaLotesComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any = false;


  vmButtons: any;
  lotesDt: any = [];
  paginate: any;
  filter: any;
  validaciones: ValidacionesFactory = new ValidacionesFactory()


  constructor( public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: ConsultaLotesService ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnConsuLoteForm",
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
      cod_catastral: undefined,
      cod_catastral_anterior: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(() => {
      this.cargarLotes();
    }, 0);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.cargarLotes();
  }

  aplicarFiltros() {
    Object.assign(this.paginate, {pageIndex: 0, page: 1})
    this.paginator.firstPage()
    this.cargarLotes();
  }


  cargarLotes(){
    this.mensajeSpinner = "Cargando lista de lotes...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    this.mdlSrv.getLotes(data).subscribe(
      (res: any) => {
       
        this.lotesDt = res.data.data
        this.paginate.length = res.data.total
        
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
    
  }

  limpiarFiltros() {
    this.filter.cod_catastral = undefined;
  }

  selectOption(data) {
      this.closeModal(data);
  }

  closeModal(data?: any) {
    if (data) {
      let dato = data

      this.commonVrs.selectLote.next(data);
    }
    this.activeModal.dismiss();
  }

}
