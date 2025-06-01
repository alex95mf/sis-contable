import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/commonServices';
import { LturisticosService } from './lturisticos.service';
import { ToastrService } from 'ngx-toastr';
import { ModalNuevoComponent } from './modal-nuevo/modal-nuevo.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as variablesGlobales from "../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';


@Component({
standalone: false,
  selector: 'app-lturisticos',
  templateUrl: './lturisticos.component.html',
  styleUrls: ['./lturisticos.component.scss']
})
export class LturisticosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent,{static:false}) barra_carga: CcSpinerProcesarComponent ;
  texto_barra_carga: string = "Cargando...";
  
  lista: any[]=[];
  botonera: any =[];
  paginate:any;
  titulo = "Lugares Turisticos";
  filtro:any;
  
  constructor( private lturisticos: LturisticosService,
    private srvCom: CommonService,
    private srvTostar: ToastrService,
    private modal:NgbModal,
    private srvVarCom: CommonVarService
    ) { 
    this.srvVarCom.editLugarTuristico.asObservable().subscribe(
      (res)=>{
        if(res){
          this.cargarLTur();
        }
      }
    );
    }

  ngOnInit(): void {
    console.log("Iniciando Lugares Turisticos");
    this.botonera = [
      {
        orig: "btnsLugaresTuristicos",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
    ];
    this.filtro = {
      categoria: undefined,
      subcategoria: undefined,
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [2, 5, 10, 20, 50]
    };

    setTimeout(() => {
      this.cargarLTur();
    }, 75)
    
   
  }

  mostrarFormLTur(esNuevoLTur,dato?:any){
    const modal = this.modal.open(ModalNuevoComponent,{
      size:"xl",
      backdrop:"static",
      windowClass: "viewer-content-general"
    });
    modal.componentInstance.module_comp = variablesGlobales.fLTuristicos;
    modal.componentInstance.titulo = this.titulo;
    modal.componentInstance.esNuevoLTur= esNuevoLTur;
    modal.componentInstance.dato = dato;
    
  }

  metodoGlobal(evento) {
    switch (evento.items.boton.texto) {
      case " NUEVO":
        this. mostrarFormLTur(true,{});
        break;
    }
  }


  cargarLTur(){
    
    // this.texto_barra_carga = "Cargando lista de lugares turisticos...";
    // this.barra_carga.ctlSpinner(true);
    let datos ={
      params: {
        filter: this.filtro,
        paginate: this.paginate
      }
    };
    this.barra_carga.ctlSpinner(true)
    this.lturisticos.getLTFil(datos).subscribe(
      (res:any)=>{
        console.log(res)
        this.paginate.length = res['data']['total'];
        if(res['data']['current_page'] ==1){
          this.lista = res['data']['data'];
        }
        else{
          this.lista = Object.values(res['data']['data']);
        }
        this.barra_carga.ctlSpinner(false);


        // this.lista = res.data;
        // console.log(this.lista);
        // console.log(res);
        
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    )

  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLTur();
  }


  limpiarFiltros(){
    this.filtro.categoria = undefined;
    this.filtro.subcategoria = undefined;
  }

  eliminarLT(idLT){
    console.log(idLT);
    Swal.fire({
      icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar este local turístico?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74'
    }).then((result)=>{
      if(result.isConfirmed){
        this.texto_barra_carga = "Eliminando local turístico...."
        this.barra_carga.ctlSpinner(true);
        this.lturisticos.eliminarLTurisiticos(idLT).subscribe(
          (res)=> {
            if(res["status"]==1){
              this.barra_carga.ctlSpinner(false);
              this.cargarLTur();
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
    })

  }

}

