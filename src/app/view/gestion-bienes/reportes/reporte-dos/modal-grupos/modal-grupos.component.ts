import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from '../../../../../services/common-var.services'
import { ReporteDosService } from '../reporte-dos.service'; 
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
standalone: false,
  selector: 'app-modal-grupos',
  templateUrl: './modal-grupos.component.html',
  styleUrls: ['./modal-grupos.component.scss']
})
export class ModalGruposComponent implements OnInit {
  mensajeSpinner: string = "Cargando";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() conceptos: any[];
  @Input() exoneracionesSelect: any = [];
  @Input() verifyRestore: any = false;
  @Input() claseSelect:any;
  
  vmButtons: any;

  grupos: any = [];
  subgrupos: any = [];
  subgrupos_filter: any = [];
  paginate: any
  filter: any;

  estadoList = [
    {value: "A",label: "ACTIVO"},
    {value: "I",label: "INACTIVO"},
  ]
  estadoSelected = 0
  constructor(
    private apiService: ReporteDosService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    
    }, 50);

    this.vmButtons = [
      // { orig: "btnModalExoner", paramAccion: "", boton: { icon: "fas fa-plus", texto: " APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalExoner", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.paginate = {
      length: 0,
      perPage: 8,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.filter = {
      estado: ['A'],
      codigo_grupo_producto: null,
      descripcion: null,
      filterControl: ""  
    };
    
    setTimeout(()=> {
      this.cargarSubgrupos();
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " APLICAR":
        this.exoneracionesSelect = []
        // this.grupos.forEach(e => {
        //   if (e.action) {
        //     this.exoneracionesSelect.push(e);
        //   }
        // })
        this.closeModal(this.exoneracionesSelect);
        break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarSubgrupos();
  }
  asignarEstado(evt) {
    this.filter.estado = [evt]
   }

  cargarSubgrupos(flag: boolean = false){
    
    if (flag) this.paginate.page = 1

    this.mensajeSpinner = "Cargando";
    this.lcargando.ctlSpinner(true);
    console.log(this.claseSelect)
   // let id = this.claseSelect.id_grupo_productos
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.apiService.getSubproductos(data).subscribe(
      (res) => {
       
       
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.subgrupos = res['data']['data'];
        } else {
          this.subgrupos = Object.values(res['data']['data']);
        }
        // this.subgrupos.map(e => {
        //   if(e.tipo_bien == 'EXI'){
        //     this.subgrupos_filter.push(e)
        //   }
        // })
        console.log(this.subgrupos_filter)
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Acaba de seleccionar un grupo",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        console.log(result)
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
    
      this.commonVarService.selectGrupo.next(data);
    }
    
    this.lcargando.ctlSpinner(false);
    this.activeModal.dismiss();
  }

  limpiarFiltro(){
    this.filter = {
      estado: ['A'],
      codigo_grupo_producto: null,
      descripcion: null,
      filterControl: ""  
    };
    this.estadoSelected = 0

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
  }

}
