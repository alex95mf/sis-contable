import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { GeneracionService } from '../generacion.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";
import * as moment from 'moment';


@Component({
standalone: false,
  selector: 'app-list-liquidaciones',
  templateUrl: './list-liquidaciones.component.html',
  styleUrls: ['./list-liquidaciones.component.scss']
})
export class ListLiquidacionesComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;

  vmButtons: any;
  liquidacionesDt: any = [];
  paginate: any;
  filter: any;

  cmb_conceptos: any[] = []

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private generacionSrv: GeneracionService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnListLiqRP",
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

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.filter = {
      concepto: null,
      razon_social: null,
      num_documento: null,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    
    setTimeout(()=> {
      // this.cargarLiquidaciones();
      this.cargarConceptos()
    }, 0);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLiquidaciones();
  }

  cargarConceptos() {
    (this as any).mensajeSpinner = 'Cargando Conceptos'
    this.lcargando.ctlSpinner(true)
    this.generacionSrv.getConceptoBy({id_concepto: 47}).subscribe(
      (res: any) => {
        // console.log(res)
        res.data.forEach((element: any) => {
          // console.log(element.concept)
          const { id_concepto, nombre, codigo } = element
          this.cmb_conceptos = [...this.cmb_conceptos, { id_concepto: id_concepto, nombre: nombre, codigo: codigo }]
        });
        this.lcargando.ctlSpinner(false)
        // this.cargarLiquidaciones()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  consultarLiquidaciones() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })

    this.cargarLiquidaciones()
  }

  cargarLiquidaciones(){
    if(this.filter.concepto==undefined || this.filter.concepto==null){
      this.toastr.warning("Debe seleccionar un concepto");
    }else{
      (this as any).mensajeSpinner = "Cargando lista de Liquidaciones...";
      this.lcargando.ctlSpinner(true);

      let data = {
        concepto:{
          id: this.filter.concepto
        },
        params: {
          filter: this.filter,
          paginate: this.paginate,
        }
      }

      this.generacionSrv.getLiquidacionesLC(data).subscribe(
        (res: any) => {
          this.paginate.length = res.data.total;
          this.liquidacionesDt = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      );
    }

    
  }

  limpiarFiltros() {
    this.filter = {
      concepto: null,
      razon_social: null,
      num_documento: null,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD')
    }
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar esta Liquidación? Los campos llenados y calculos realizados serán reiniciados.",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeModal(data);
        }
      });
    } else {
      this.closeModal(data);
    }
  }

  closeModal(data?:any) {
    if(data){
      this.commonVrs.selectListLiqPURen.next(data);
    }
    this.activeModal.dismiss();
  }

}
