import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { LturisticosService } from '../lturisticos.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ThisReceiver } from '@angular/compiler/src/expression_parser/ast';
import { List } from '@amcharts/amcharts4/core';


@Component({
  selector: 'app-modal-nuevo',
  templateUrl: './modal-nuevo.component.html',
  styleUrls: ['./modal-nuevo.component.scss']
})
export class ModalNuevoComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";

  @ViewChild(CcSpinerProcesarComponent,{ static: false}) barra_carga: CcSpinerProcesarComponent;
  botonera: any =[];
  necesita_refrescar:any;
  lugar_turistico:any = {};
  lista_categorias: any = [];
  lista_subcategorias:any=[];
  lista_subc_fil:any[];
  categoria: any = 1;
  subcategoria: any=1;
  ltur_cat: any;
  cat_step: any = 1;
  @Input() esNuevoLTur:any;
  @Input() titulo:any;
  @Input() dato: any;

  constructor(
    public modal: NgbActiveModal,
    private svrToStar: ToastrService,
    private commonService: CommonService,
    private srvLTur: LturisticosService,
    private srvLTurV: CommonVarService,
    ) {


    }

  ngOnInit(): void {
    this.botonera = [

      {
        orig: "btnsFormLTuristicos",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
    },
    {
        orig: "btnsFormLTuristicos",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
    }
    ];

    this.lugar_turistico = {
      categoria:0,
      subcategoria:0,
      porcentaje: 0,
      calculo: "",
      comentario:""
    };


    setTimeout (()=>{
      if (!this.esNuevoLTur){
        console.log("prueba");
        console.log(this.dato);
        //this.lugar_turistico = this.dato
        this.lugar_turistico = {
          id: this.dato.id_local_comercial_configuracion,
          categoria:this.dato.concepto_categoria.descripcion,
          subcategoria:this.dato.sub_categoria.descripcion,
          porcentaje: this.dato.porcentaje,
          calculo: this.dato.base_calculo,
          comentario:this.dato.comentario
        };
        
        
      }
      
      

      this.getCatalogos();
    },75)

    //this.cargarLCat


  }


  cerrarModal(){
    this.modal.close();
  }

  metodoGlobal(evento){
    switch(evento.items.boton.texto){
      case "GUARDAR":
      this.guardar();
      break;
      case "REGRESAR":
        console.log("cerrar");
        this.cerrarModal();
        break;

    }
  }


  guardar(){
    if(this.esNuevoLTur){
      this.crearLTuristico();
    }
    else{
      this.actualizarLT();
    }
  }
  //obtener categorias y subcategorias
  getCatalogos(){
    this.texto_barra_carga ="obtener recursos";
    // this.barra_carga.ctlSpinner(true);
    let data ={
      params: "'REN_LOCAL_TURISTICO_CATEGORIA','REN_LOCAL_TURISTICO_CATEGORIA_2' "
    }
    this.srvLTur.obtenerCatalogos(data).subscribe((res)=>{
      console.log(res)
      res['data']['REN_LOCAL_TURISTICO_CATEGORIA'].forEach(cat =>{
        let obj = {
          nombre: cat.valor,
          codigo : cat.descripcion,
        }
        this.lista_categorias.push({...obj});
      });
      console.log(this.lista_categorias)


      res['data']['REN_LOCAL_TURISTICO_CATEGORIA_2'].forEach(scat=>{
        let obj = {
          nombre: scat.valor,
           codigo: scat.descripcion,
           grupo: scat.grupo
         }
         this.lista_subcategorias.push({...obj});
         console.log("hola")
       })
       this.barra_carga.ctlSpinner(false);

    },
    (err)=>{
      // this.barra_carga.ctlSpinner(false);
      this.svrToStar.error(err.error.message, 'Error de datos')
    }
    )
  }

  cargarSubCat(evento){

    this.cat_step = 2;
    this.lugar_turistico.subcategoria = 0;
    this.lista_subc_fil = this.lista_subcategorias.filter(sc=>sc.grupo == evento);
    console.log(evento);
  }





  crearLTuristico(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo local turístico?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result)=>{
      if(result.isConfirmed){
        this.texto_barra_carga = "Guardando nuevo local turístico"
        this.barra_carga.ctlSpinner(true);
        let datos = {
          params:{
            categoria: this.lugar_turistico.categoria,
            subcategoria: this.lugar_turistico.subcategoria,
            porcentaje: this.lugar_turistico.porcentaje,
            calculo: this.lugar_turistico.calculo,
            comentario: this.lugar_turistico.comentario
          }
        };
        console.log(datos);
        this.srvLTur.crearLTuristicos(datos).subscribe(
          (res) => {
            console.log(res)
            if (res["status"]==1){
              this.necesita_refrescar = true;
              this.barra_carga.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                  title: "Local Turístico creado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8'
              }).then((result)=>{
                if(result.isConfirmed){
                  this.cerrarModal();
                }
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
            }
          },
          (error)=>{
            this.barra_carga.ctlSpinner(false);
            this.svrToStar.info(error.error.message);
          }
        )
      }
    })
  }

  actualizarLT(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar este local turístico?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result)=>{
      if(result.isConfirmed){
        this.texto_barra_carga ="Guardando locales turísticos ...."
        this.barra_carga.ctlSpinner(true);
        let datos = {
          params:{
            id: this.lugar_turistico.id,
            categoria: this.lugar_turistico.categoria,
            subcategoria : this.lugar_turistico.subcategoria,
            porcentaje: this.lugar_turistico.porcentaje,
            calculo: this.lugar_turistico.calculo,
            comentario: this.lugar_turistico.comentario,
          }
        };
        this.srvLTur.editarLTurisiticos(datos).subscribe(
          (res)=>{
            console.log(res)
            if (res["status"]==1){
              this.necesita_refrescar = true;
              this.barra_carga.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Local turístico actualizado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              }).then((result)=>{
               if(result.isConfirmed){
                this.cerrarModal();
               }
              });
            }
            else {
              this.barra_carga.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8'
              });
            }
          },
          (error)=>{
            this.barra_carga.ctlSpinner(false);
            this.svrToStar.info(error.error.message);
          }
        )
      }
    });
  }

}
