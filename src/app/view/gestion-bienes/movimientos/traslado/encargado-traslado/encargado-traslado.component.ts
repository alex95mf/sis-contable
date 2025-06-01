import { Component, OnInit, ViewChild , Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { EncargadoTrasladoService } from './encargado-traslado.service';

@Component({
standalone: false,
  selector: 'app-encargado-traslado',
  templateUrl: './encargado-traslado.component.html',
  styleUrls: ['./encargado-traslado.component.scss']
})
export class EncargadoTrasladoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
@Input () tipo: any;
  encargados: any = []
  vmButtons: any

  dataUser: any

  filter: any
  paginate: any
  
 


  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicio: EncargadoTrasladoService
  ) { 

  }

  ngOnInit(): void {
    this.vmButtons = [

      {
        orig: "btnEncargadoForm",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: " CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnEncargadoForm",
        paramAction: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnEncargadoForm",
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
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(()=>{
      this.cargarEncargado()
    },500)

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
        case " CONSULTAR":
          this.cargarEncargado();
          break;
          case " LIMPIAR":
            this.limpiarFiltros();
            break;
    }
  }

  closeModal(){
    this.activeModal.close()
  }
 
  
  cargarEncargado( flag: boolean = false){
    this.lcargando.ctlSpinner(true);
    if (flag) this.paginate.page = 1
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.servicio.setEncargado(data).subscribe(
      (res)=>{
        // console.log(res);
        this.paginate.length= res['data']['total']
        if(res['data']['current_page'] == 1){
          this.encargados = res['data']['data']
        }else{
          this.encargados = Object.values(res['data']['data'])
        }
        this.lcargando.ctlSpinner(false);
      }
    )


  }


  limpiarFiltros(){
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarEncargado();
  }

  selectOption(dt){
    if(this.tipo==1){
      let data = {
        tipo: this.tipo,
        recibido:dt,
        custodio:null,
        responsable:null,
        elabora:null,
        verifica:null,
        custodio_origen:null,
        dt: dt
      }
      this.commonVrs.encargadoSelect.next(data)
    }
    else if(this.tipo==2){
      let data = {
        tipo: this.tipo,
        recibido:null,
        custodio:dt,
        responsable:null,
        elabora:null,
        verifica:null,
        custodio_origen:null,
        dt: dt
      }
      this.commonVrs.encargadoSelect.next(data)
    }else if(this.tipo==4){
      let data = {
        tipo: this.tipo,
        recibido:null,
        custodio:null,
        responsable:dt,
        elabora:null,
        verifica:null,
        custodio_origen:null,
        dt: dt
      }
      this.commonVrs.encargadoSelect.next(data)
    }else if(this.tipo==5){
      let data = {
        tipo: this.tipo,
        recibido:null,
        custodio:null,
        responsable:null,
        elabora:dt,
        verifica:null,
        custodio_origen:null,
        dt: dt
      }
      this.commonVrs.encargadoSelect.next(data)
    }else if(this.tipo==6){
      let data = {
        tipo: this.tipo,
        recibido:null,
        custodio:null,
        responsable:null,
        elabora:null,
        verifica:dt,
        custodio_origen:null,
        dt: dt
      }
      this.commonVrs.encargadoSelect.next(data)
    }
    else if(this.tipo==7){
      let data = {
        tipo: this.tipo,
        recibido:null,
        custodio:null,
        responsable:null,
        elabora:null,
        verifica:null,
        custodio_origen:dt,
        dt: dt
      }
      this.commonVrs.encargadoSelect.next(data)
    }
    else{
      let data = {
        tipo: this.tipo,
        dt: dt
      }
      this.commonVrs.encargadoSelect.next(data)
    }
    
    
    this.activeModal.close()

  }

}
