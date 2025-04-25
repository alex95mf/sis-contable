import { Component, OnInit, RendererFactory2, ViewChild} from '@angular/core';
import { ViaPublicaService } from './via-publica.service';
import { EditviapublicaComponent } from './editviapublica/editviapublica.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as variablesGlobales from "../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { title } from 'process';


@Component({
  selector: 'app-via-publica',
  templateUrl: './via-publica.component.html',
  styleUrls: ['./via-publica.component.scss']
})
export class ViaPublicaComponent implements OnInit {
  titulo = "Vias Publicas";
  texto_barra_carga: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  barra_carga: CcSpinerProcesarComponent;

  listavia:any[]=[];
  listacatalogo:any[]=[];
  paginate: any;
  filtro: any;
  botonera: any[];
  showInactive = false;
  filter: any;


  constructor(
    private servVia:ViaPublicaService,
    private srvTostar: ToastrService,
    private modal:NgbModal,
    public srvVarCom: CommonService
  ) { 
    this.srvVarCom.updatevia.asObservable().subscribe(
      (res) => {
        if (res) {
          //this.listavia.push(res);
          this.cargarVias();
        }
      }
    );
  }

  ngOnInit(): void {
   
    console.log("Iniciando Vias Publicas");

    this.botonera = [
      {
        orig: "btnsCategoriasviapublica",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsCategoriasviapublica",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true
      }
    ];

    this.filtro = {
    descripcion: undefined,
    filterControl: "",
    // //   estado: ['A']
    };
  

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [2, 5, 10, 20, 50]
    };


    setTimeout(()=> {
      this.cargarVias();
    }, 0);
  
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.mostrarmodal(true, {});
        break;
      case " MOSTRAR INACTIVOS":
        this.changeShowInactive(this.showInactive);
        break;
    }

  }
  changeShowInactive(showInactive) {
    if (showInactive) {
      this.botonera[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A'];
    } else {
      this.botonera[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['A', 'I'];
    }
    this.showInactive = !this.showInactive
    this.cargarVias();
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    // this.getdata();
    this.cargarVias();
  }

//carga el listado principal de mi tabla 
getdata(){
  let data = {
    params: {
      // filter: this.filtro,
      paginate: this.paginate
    }
  };
  this.servVia.Viapublicalist(data).subscribe(
    (res:any) =>{

    this.listavia = res.data;
    console.log( this.listavia);
    console.log(res);
    this.llenarCatalogos();
  }
  ) 
  }


  llenarCatalogos() {
    this.texto_barra_carga = "Cargando ...";
    this.barra_carga.ctlSpinner(true);

    let datos = {
      params: "'USO_VIA_PUBLICA'"
    };

    //llenado de catalogo de vias publicas
    this.servVia.obtenerCatalogos(datos).subscribe(
      (res) => {
        console.log(res)
        this.listacatalogo = res['data']['USO_VIA_PUBLICA'];
        console.log(this.listacatalogo);
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

    
   mostrarmodal(esNuevaCatEspPub,dato?:any){
    console.log("hola");
    const modal = this.modal.open(EditviapublicaComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.module_comp = variablesGlobales.fRPEspPublicitarios;
   // modal.componentInstance.title = title;
    modal.componentInstance.titulo = this.titulo;
    modal.componentInstance.esNuevaCatEspPub = esNuevaCatEspPub;
    modal.componentInstance.data = dato;
    // modal.componentInstance.permisos = this.permisos;
    modal.componentInstance.listavia = this.listacatalogo;
 
  }


//elimino enviandole la data no un id
eliminarvp(idvp, id){
  console.log(idvp);
  let data = {
    id_categoria_via_publica: idvp
  }
  Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar este Concepto?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
  }).then((result)=>{
    if(result.isConfirmed){
      this.texto_barra_carga = "Eliminando Vias Publicas...."
      this.barra_carga.ctlSpinner(true);
      this.listavia.splice(id,1);//me permite eliminar el ultimo registro y actualizar mi tabla
      this.servVia.Deleteviapublica(data).subscribe(
        (res)=> {
          if(res["status"]==1){
            this.barra_carga.ctlSpinner(false);
            //this.cargarLTur();
            console.log(res);
            Swal.fire({
              icon: "success",
              title: "Registro Eliminado",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8'
            });
          }
          else{
            this.barra_carga.ctlSpinner(false);
            Swal.fire({
              icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
            });
          }// termina 
        },
        (error)=>{
          this.barra_carga.ctlSpinner(false);
          this.srvTostar.info(error.error.message);
        }
        )   
      } 
      });
	 
    }

    limpiarFiltros() {
      this.filtro.descripcion = undefined;
      this.cargarVias();
    }
  
    cargarVias() {
      
      this.texto_barra_carga = "Cargando lista de vias publicas...";
      this.barra_carga.ctlSpinner(true);
     
      if (this.filtro .descripcion !== undefined && !this.filtro .descripcion.trim().length) {
        this.filtro .descripcion = undefined
      }
      let data = {
        params: {
          filtro: this.filtro,
          paginate: this.paginate,  
        }
      }

    this.servVia.listarvias(data).subscribe(
      (res:any) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        console.log(res);
        if (res['data']['current_page'] == 1) {
          this.listavia = res['data']['data'];
        } else {
          // Si la pagina esta dentro del rango, mostrar
          // De lo contrario, ir a pagina 1
          if (res['data'].length != 0){
            this.listavia = Object.values(res['data']['data']);
          } else{
            this.listavia = [];
            console.log(res);
          }
           
        }
        console.log(res);
       // this.llenarCatalogos();
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

} //termina el constructor








  
	

  
 
 




