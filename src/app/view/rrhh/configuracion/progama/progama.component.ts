import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ProgamaService } from './progama.service';
import { ProgramaFormComponent } from './programa-form/programa-form.component';

@Component({
standalone: false,
  selector: 'app-progama',
  templateUrl: './progama.component.html',
  styleUrls: ['./progama.component.scss']
})
export class ProgamaComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  programas: any = [];
  paginate: any;
  filter: any;
  vmButtons: any = [];
  showInactive = false;

  estadoList = [
    {valor: 'A' , descripcion: 'Activo'},
    {valor: 'I' , descripcion: 'Inactivo'},
  ]

  constructor(
    private service: ProgamaService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
  ) {
    this.commonSrv.modalProgramaConfig.subscribe(
      (res)=>{
        this.getPrograma();
      }
    )
  }



  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
    ];

    this.filter = {
      codigo: undefined,
      nombre: undefined,
      estado: ['A', 'I'],
      filterControl: "",
    };
    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };
    setTimeout(()=> {
      this.getPrograma()
    }, 50);
  }


  getPrograma(){
    this.mensajeSppiner = "Cargando Programas...";
    this.lcargando.ctlSpinner(true);
    let data ={
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.service.getPrograma(data).subscribe(
      (res) => {
        // console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.programas = res['data']['data'];
        } else {
          this.programas = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }


  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.programaForm(true, {});
        break;
      case " MOSTRAR INACTIVOS":
        this.changeShowInactive(this.showInactive);
        break;
    }
  }

  programaForm(valor, data){
    let modal = this.modalSrv.open(ProgramaFormComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.isNew = valor;
    modal.componentInstance.data = data;

  }


  changeShowInactive(showInactive) {
    if (showInactive) {
      console.log("hola")
      this.vmButtons[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A', 'I'];
    } 
    else {
      console.log("aqui")
      this.vmButtons[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['I'];
    }
    this.showInactive = !this.showInactive;
    this.getPrograma();
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getPrograma();
  }

  limpiarFiltros(){
    this.filter = {
      codigo: undefined,
      nombre: undefined,
      estado: ['A', 'I'],
      filterControl: "",
    };
  }


  

}
