import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
// import { GeneracionService } from '../generacion.service';
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";
import { EmisionArancelesService } from '../emision-aranceles.service';
import Botonera from 'src/app/models/IBotonera';
import { MatPaginator } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: 'app-modal-aranceles',
  templateUrl: './modal-aranceles.component.html',
  styleUrls: ['./modal-aranceles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalArancelesComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator

  dataUser: any;
  
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;

  vmButtons: Botonera[] = [];
  arancelesDt: any = [];
  paginate: any = {
    length: 0,
    perPage: 10,
    page: 1,
    pageSizeOptions: [5, 10, 15]
  };
  filter: any = {
    codigo: null,
    descripcion: null,
    estado: ['A'],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private generacionSrv: EmisionArancelesService,
    private commonVrs: CommonVarService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: 'btnArancelForm',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        habilitar: false,
        showbadge: false,
        showimg: true,
        showtxt: true,
      },
      {
        orig: 'btnArancelForm',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        habilitar: false,
        showbadge: false,
        showimg: true,
        showtxt: true,
      },
      {
        orig: "btnArancelForm",
        paramAccion: "",
        boton: {icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    
    setTimeout(()=> {
      this.cargarAranceles();
    }, 0);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.cargarAranceles()
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.cargarAranceles();
  }

  cargarAranceles() {
    this.mensajeSppiner = "Cargando lista de Aranceles..."
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    
    this.generacionSrv.getAranceles(data).subscribe(
      (res) => {
        this.paginate.length = res['data']['total'];
        this.arancelesDt = res['data']['data']
        // if (res['data']['current_page'] == 1) {
        //   this.arancelesDt = res['data']['data'];
        // } else {
        //   this.arancelesDt = Object.values(res['data']['data']);
        // }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  limpiarFiltros() {
    Object.assign(this.filter, {codigo: null, descripcion: null})
    this.cargarAranceles();
  }
  
  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea seleccionar otro arancel?",
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
      this.commonVrs.selectArancelLiqRP.next(data);
    }
    this.activeModal.dismiss();
  }

}
