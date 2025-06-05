import { Component, Input, OnInit,ViewChild} from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ViaPublicaService } from '../via-publica.service';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
standalone: false,
  selector: 'app-editviapublica',
  templateUrl: './editviapublica.component.html',
  styleUrls: ['./editviapublica.component.scss']
})
export class EditviapublicaComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;

  //barra_carga: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  necesita_refrescar: any;
 
  botoneras:any[];
  viaPublica: any = {};

  
  //titulo = "Editar Categorias via publica";
  @Input() listavia: any = [];
  @Input() index: number
  @Input() data: any
  @Input() esNuevaCatEspPub: boolean;
  @Input() titulo: any;

  constructor(private modal: NgbActiveModal, 
    private commonVarService: CommonVarService,
    private srvVarCom: CommonVarService,
    private servVia:ViaPublicaService,
    public srvVarCom1: CommonService
    ) { }


  ngOnInit(): void {
    console.log(this.listavia)

    this.botoneras = [
      {
        orig: "btnseditviapublica",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnseditviapublica",
        paramAccion: "",
        boton: {icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      }
    ];

    this.viaPublica = {
      id_categoria_via_publica: 0,
      tipo: {descripcion: 0, valor: 0},
      valor: 0, //null
      formula: null,
      periodicidad: 0,
      exencion: 0,
      multa: 0,
      porcentaje: 0,
      factor_1: 0,
      factor_2: 0,
      factor_3: 0,
      factor_4: 0,
    }


    setTimeout(()=> {
      this.cargaData();
    }, 0);

  }

  cargaData() {
    if(!this.esNuevaCatEspPub){
      console.log(this.data);
      this.viaPublica = this.data;
      this.viaPublica.tipo.descripcion = this.data.tipo.descripcion
      console.log(this.viaPublica);
    }
  }


  /* cerrarModal() {
    this.srvVarCom.editarViaspublicas.next(this.necesita_refrescar);
    this.modal.close();
  } */
  //cerrarModal() {
  //  this.srvVarCom.editCategoriasEspPublicitario.next(this.necesita_refrescar);
   //     this.modal.dismiss();
  //}


  btnseditar(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        if(this.esNuevaCatEspPub){
          this.crearVia();
        } else {
          this.editarVia();
        }

        break;
      case "REGRESAR":
        this.modal.close();
        break;
    }
  }
  crearVia(){
    // console.log(this.tipo_doc, this.numero_documento, this.nombres, this.estado_civil, this.profesion, this.pais, this.fecha)
    let data = this.viaPublica;
    console.log('dato',data);
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de guardar los datos ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = 'Guardando...';
        this.lcargando.ctlSpinner(true);
        this.servVia.CrearViapublica(data).subscribe(
          (res: any) => {
            console.log(res)
            this.lcargando.ctlSpinner(false);
            this.srvVarCom1.updatevia.next(this.viaPublica)
            this.modal.close();
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error al guardar los datos",
              text: error.error.message,
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          }
        )
      }
    });
   
  }


  editarVia() {
    let data = this.viaPublica;
    console.log(data);
 
    this.servVia.EditarClient(data).subscribe(
      (res: any) => {
    
        console.log(res)
        // Envair a la base

      }
    )
    this.modal.close(); 
  }
  
}


