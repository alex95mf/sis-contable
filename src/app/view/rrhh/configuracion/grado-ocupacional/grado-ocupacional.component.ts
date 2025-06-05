import { Component, OnInit ,ViewChild} from '@angular/core';
import { GradoOcupacionalService } from './grado-ocupacional.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SueldoNuevoComponent } from './grupo-nuevo/sueldo-nuevo.component';
@Component({
standalone: false,
  selector: 'app-grado-ocupacional',
  templateUrl: './grado-ocupacional.component.html',
  styleUrls: ['./grado-ocupacional.component.scss']
})
export class GradoOcupacionalComponent implements OnInit {
  grado: any;
  fTitle: string = 'Grado ocupacional'
  
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  paginate: any;
  filter: any;
  vmButtons: any;
  grupoSelected: any;
  cargoSelected: any;
  tipoContratoSelected: any;
  estadoList = [
    { valor: 'A', descripcion: 'Activo' },
    { valor: 'I', descripcion: 'Inactivo' },
  ]
  estadoSelected: any;
  constructor(private apiSrv: GradoOcupacionalService, private modal: NgbModal,) {
    this.filter = {
      grupo_ocupacional: 0,
      codigo_sectorial: '',
      remuneracion: '',
      cargo: 0,
      tipo_contrato: 0,
      estado: "",
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsConceptos", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fas fa-floppy-o", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-sm btn-info",
        habilitar: false,
      },
    ];



    setTimeout(() => {
      this.LoadGruposOcupacionales();
    }, 250)

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.nuevoGrupo(true, {});
        break;
      case "CONSULTAR":
        this.LoadGruposOcupacionales(true);
        break;
      case "CANCELAR":
        break;
    }
  }

  updateSueldo(x, y) {
    const modalInvoice = this.modal.open(SueldoNuevoComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.isNew = false;
    modalInvoice.componentInstance.data = x;
    modalInvoice.componentInstance.idToUpdate = y;
    modalInvoice.result.then(
      (result) => {
        if (result == "actualizar") {
          this.LoadGruposOcupacionales();
        }
      },
      (reason) => {
        if (reason == "actualizar") {
          this.LoadGruposOcupacionales(false);
        }
      }
    );
  }

  ingresoSueldo(isNew: boolean, data?: any) {
    const modalInvoice = this.modal.open(SueldoNuevoComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.isNew = isNew;
    modalInvoice.componentInstance.data = data;
    modalInvoice.result.then(
     
      // Función a ejecutar cuando el modal se cierra
      (result) => { console.log("resulta",result);
        if (result == "actualizar") {
          this.LoadGruposOcupacionales(true);
        }
        console.log('Modal cerrado');
      },
      (reason) => {
        if (reason == "actualizar") {
          this.LoadGruposOcupacionales(true);
        }
        console.log('Modal descartado');
      }
    );
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.LoadGruposOcupacionales();
  }


  nuevoGrupo(isNew: boolean, data?: any) {
    const modalInvoice = this.modal.open(SueldoNuevoComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.isNew = isNew;
    modalInvoice.componentInstance.data = data;
    modalInvoice.result.then(
     
      // Función a ejecutar cuando el modal se cierra
      (result) => {
        if (result == "actualizar") {
          this.LoadGruposOcupacionales(false);
        }
      },
      (reason) => {
        if (reason == "actualizar") {
          this.LoadGruposOcupacionales(false);
        }
      }
    );
  }


  LoadGruposOcupacionales(flag: boolean = false) {
    this.lcargando.ctlSpinner(true);
    if (flag) this.paginate.page = 1
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    
    this.apiSrv.getGrupoOcupacionalByFilter(data).subscribe(
      res => {
        if (res['data'].length == 0) {
          this.grado = []
        } else {
          this.grado = res['data']['data'];
          this.paginate.length = res['data']['total'];
        }
        this.lcargando.ctlSpinner(false)
      }
      ,
      (error) => {
        console.log(error)
       this.lcargando.ctlSpinner(false)
        // this.toastr.info(error.error.message);
      }
    );
  }

  async cargaInicial() {
    this.grado = await this.apiSrv.getGrupoOcupacional();
    this.grado.forEach((element: any) => {
      const { id_grb_ocupacional, grb_grupo_ocupacional, grb_nivel_grado, grb_rbu_valor, estado } = element
      this.grado = [...this.grado, { id_grb_ocupacional: id_grb_ocupacional, grb_grupo_ocupacional: grb_grupo_ocupacional, grb_nivel_grado: grb_nivel_grado, grb_rbu_valor: grb_rbu_valor, estado: estado }]
    })
  }
}
