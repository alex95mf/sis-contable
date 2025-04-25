import { Component, OnInit, ViewChild } from '@angular/core';

import { ParametrosService } from './parametros.service';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsultaParametrosComponent } from './consulta-parametros/consulta-parametros.component';


@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  vmButtons: Botonera[] = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  tipoDocumento: any;
  listaParametros= []
  tienedate:any = false;
  cols: any[];
  disabledModificar: boolean = false;
 
  listTipoDato: any = [
    {value: "text",label: "Texto"},
    {value: "date",label: "Fecha"},
    {value: "numeric",label: "Número"},
  ]

  row: any;
  disabledAgregar: boolean = false



  constructor(
    private apiSrv: ParametrosService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
   


    this.apiSrv.listaParametros$.subscribe(
      (res) => {
     
        console.log(res)
        this.vmButtons[0].habilitar = true;
        this.vmButtons[2].habilitar = false;
        this.disabledModificar= true;

        this.tipoDocumento = res;
        this.tipoDocumento.fisicotemp =this.tipoDocumento.fisico == 'SI' ? true : false;
        
        res.tipo_documento_indice.forEach(e => {
          Object.assign(e,{
            es_directorio: e.es_directorio == 'SI' ? true : false,
            es_obligatorio: e.es_obligatorio == 'SI' ? true : false,
            estado: e.estado == 'A' ? true : false,
            disabled: e.id_documento_indice != 0 ? true : false
          })
        });

       // tienedate
        this.listaParametros = res.tipo_documento_indice;
        this.listaParametros.forEach(item =>{if (item.anio_dir || item.dia_dir || item.mes_dir){
          this.tienedate = true;
        } })
        console.log(this.listaParametros)
      }
    )
  }

  ngOnInit(): void {

    this.vmButtons = [
     
      {
        orig: 'btnsParametros',
        paramAccion: '',
        boton: { icon: 'fas fa-save', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsParametros',
        paramAccion: '',
        boton: { icon: 'far fa-search', texto: 'BUSCAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsParametros',
        paramAccion: '',
        boton: { icon: 'fas fa-edit', texto: 'MODIFICAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: true,
      },
      {
        orig: 'btnsParametros',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
    ]

    this.tipoDocumento={
      nombre:'',
      descripcion:'',
      codigo: ''
    }

    this.cols = [
      { field: 'orden', header: '#' },
      { field: 'campo_indice', header: 'Nombre' },
      { field: 'tipo_dato', header: 'Tipo' },
      { field: 'es_directorio', header: 'Directorio' },
      { field: 'estado', header: 'Estado' },
      { field: 'es_obligatorio', header: 'Obligatorio' }
  ];


  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
    
      case "GUARDAR":
       this.validateSaveParametros();
        break;
      case "BUSCAR":
        this.expandConsultaParametros();
        break;
      case "MODIFICAR":
        this.validateUpdateParametros();
        break;
      case "LIMPIAR":
       this.confirmRestore()
        break;
    
      default:
        break;
    }
  }


  
  addParametros() {

    if(this.disabledAgregar){
      this.encontrarRepetidosPorValor(this.listaParametros, 'campo_indice');
      return;
    }

      // this.listaParametros.forEach((item, index) => {
      //   item.orden = index + 1;
      // });
      let ultimoOrden = this.listaParametros.length > 0 ? this.listaParametros[this.listaParametros.length - 1].orden : 0;


      let item = {
        //orden: this.listaParametros.length + 1,
        orden:ultimoOrden + 1,
        id_documento_indice: 0, // tabla pla_bienes
        campo_indice: '',
        tipo_dato:this.listTipoDato.value,
        es_directorio: false,
        estado: false,
        es_obligatorio:false,
        disabled: false
      }
      this.listaParametros.push(item)
   
  }

  encontrarRepetidosPorValor(lista: any[], propiedad: string): void {
    const conteo = {};
    const repetidos = [];
  
    // Contar la frecuencia de cada valor de la propiedad en la lista
    lista.forEach((item, index) => {
      const valor = item[propiedad];
      if (conteo[valor]) {
        conteo[valor].indices.push(index + 1); // Sumar 1 al índice
      } else {
        conteo[valor] = {valor, indices: [index + 1]}; // Sumar 1 al índice
      }
    });
  
    // Agregar los valores repetidos al array repetidos
    for (const valor in conteo) {
      if (conteo.hasOwnProperty(valor) && conteo[valor].indices.length > 1) {
        repetidos.push(conteo[valor]);
      }
    }
  
    // Mostrar mensaje de validación si hay elementos repetidos
    if (repetidos.length > 0) {
      let mensaje = 'Los siguientes elementos se repiten en la lista:\n';
      repetidos.forEach(repetido => {
        mensaje += `Nombre: ${repetido.valor}, en las líneas #: ${repetido.indices.join(', ')}\n`;
      });
      this.toastr.warning(mensaje);
    }
  }

  validateListaParametros(campoIndice: string, index: number) {

    if (!campoIndice) {
      console.log('El campo está vacío');
      return;
    }
  
    const existe = this.listaParametros.some((item, i) => i !== index && item.campo_indice === campoIndice);

    if (existe) {
      console.log('El campo ya existe en la lista');
      //this.toastr.warning('El nombre '+campoIndice+' ya existe, por favor ingrese otro')
      this.disabledAgregar = true
    } else {
      console.log('El campo es válido');
      this.disabledAgregar = false
    }
          
  }
 
  async validateSaveParametros() {
   
      this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar esta configuración ?", "SAVE_CONFIGURACION");
        }
      }).catch((err) => {
        console.log(err);
        this.toastr.warning(err,'Errores de Validación', { enableHtml: true})
      });

  }
  async validateUpdateParametros() {
   
    this.validateDataGlobal().then(respuesta => {
      if (respuesta) {
        this.confirmSave("Seguro desea modificar esta configuración ?", "UPDATE_CONFIGURACION");
      }
    }).catch((err) => {
      console.log(err);
      this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    });

}
  
  validateDataGlobal() {
  
    let c = 0;
    let mensajes: string = '';
    return new Promise((resolve, reject) => {
  
  
      if (this.tipoDocumento.nombre == "" || this.tipoDocumento.nombre == undefined) {
        mensajes += "* Debe ingresar un Nombre <br>"
      
      }
      
      if (this.tipoDocumento.descripcion == "" || this.tipoDocumento.descripcion  == undefined) {
        mensajes += "* Debe ingresar un Descripción <br>"
      }

      if (this.tipoDocumento.codigo == "" || this.tipoDocumento.codigo  == undefined) {
        mensajes += "* Debe ingresar un Código <br>"
      }

      if (this.tipoDocumento.fisicotemp == true ) {
        this.tipoDocumento.fisico= "SI";
      }else{
        this.tipoDocumento.fisico= "NO";
      }
      if (this.tipoDocumento.fisicotemp == true ) {
        if (this.tipoDocumento.dias_prestamo == "" || this.tipoDocumento.dias_prestamo  == undefined) {
          mensajes += "* Debe ingresar la cantidad de dias en el campo Tiempo de Devolución<br>"
        }
      }else{
        this.tipoDocumento.dias_prestamo = 0;
      }

      if(this.listaParametros.length == 0){
        mensajes += "* Debe agregar al menos un item a la lista de parámetros <br>"
      }
      if(this.listaParametros.length != 0 ) {
       
        for (let index = 0; index < this.listaParametros.length; index++) {
          if (this.listaParametros[index].campo_indice == '' || this.listaParametros[index].campo_indice == undefined) {
            mensajes += "En el parámetro número "+ (index + 1)+" el campo Nombre no puede ser vacío<br>"
          }else if(this.listaParametros[index].tipo_dato == 0 || this.listaParametros[index].tipo_dato == undefined){
            mensajes += "En el parámetro número "+ (index + 1)+" en el campo Tipo debe seleccionar una opción<br>"
          } 
          else if(this.listaParametros[index].tipo_dato == 0 || this.listaParametros[index].tipo_dato == undefined){
            mensajes += "En el parámetro número "+ (index + 1)+" en el campo Tipo debe seleccionar una opción<br>"
          }
          else if(this.listaParametros[index].tipo_dato == "date" && this.listaParametros[index].es_directorio){
            let datosParaTipoFecha = 0;
            if(this.listaParametros[index].anio_dir ||this.listaParametros[index].mes_dir || this.listaParametros[index].dia_dir){
              datosParaTipoFecha = 1
            }
            if(datosParaTipoFecha == 0) mensajes += "En el parámetro número "+ (index + 1)+" en el campo Fecha debe seleccionar minimo un campo a tomarse en cuenta <br>"
            
            
            
          }
          if (this.listaParametros[index].campo_indice == "nombre" || this.listaParametros[index].campo_indice == "Nombre"  || this.listaParametros[index].campo_indice == "NOMBRE") {
            mensajes += "* El campo 'nombre' se encuentra reservado para el nombre del documento <br>"
          
          }
          if (this.listaParametros[index].campo_indice == "Size" || this.listaParametros[index].campo_indice == "SIZE"  || this.listaParametros[index].campo_indice == "size") {
            mensajes += "* El campo 'nombre' se encuentra reservado para el nombre del documento <br>"
          
          }
          if (this.listaParametros[index].campo_indice == "Paginas" || this.listaParametros[index].campo_indice == "PAGINAS"  || this.listaParametros[index].campo_indice == "paginas") {
            mensajes += "* El campo 'nombre' se encuentra reservado para el nombre del documento <br>"
          
          }
          
          
        }
      
      }

      return (mensajes.length) ? reject(mensajes) : resolve(true)
     
    });
  }
 
  async confirmSave(message, action) {
 
    Swal.fire({
      title: "Atención!!",
      text: message,
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
     // this.processing = false;
      if (result.value) {
        if (action == "SAVE_CONFIGURACION") {
          this.setParametros();
        } 
        if (action == "UPDATE_CONFIGURACION") {
          this.updateParametros();
        } 
      }
    })
  }


  setParametros(){
    
      this.msgSpinner = 'Guardando Configuración...';
      this.lcargando.ctlSpinner(true);
      let data = {
        tipo_documento: this.tipoDocumento,
        lista_parametros: this.listaParametros
      }
      this.apiSrv.setParametros(data).subscribe(
        (res) => {
          console.log(res);
          if(res['status'] == 1){
            this.vmButtons[0].habilitar= true;
            this.vmButtons[2].habilitar= false;
            this.tipoDocumento = res['data'];
            this.tipoDocumento.fisicotemp =this.tipoDocumento.fisico == 'SI' ? true : false;
            res['data']['tipo_documento_indice'].forEach(e => {
              Object.assign(e,{
                es_directorio: e.es_directorio == 'SI' ? true : false,
                es_obligatorio: e.es_obligatorio == 'SI' ? true : false,
                estado: e.estado == 'A' ? true : false,
                disabled: e.id_documento_indice != 0 ? true : false
              })
            });
            /* ,
                anio_dir: e.anio_dir,
                mes_dir: e.mes_dir,
                dia_dir: e.dia_dir */
            this.listaParametros =res['data']['tipo_documento_indice'];
            console.log(this.listaParametros)
            Swal.fire({
              icon: "success",
              title: "Configuración Generada",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          }
          
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "error",
            title: "Error al guardar la configuración",
            text: error.error.message,
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          });
        }
      );
    
  }

  updateParametros(){
    
    this.msgSpinner = 'Modificando Configuración...';
    this.lcargando.ctlSpinner(true);
    let data = {
      tipo_documento: this.tipoDocumento,
      lista_parametros: this.listaParametros
    }
    this.apiSrv.updateParametros(data).subscribe(
      (res) => {
        console.log(res);
        if(res['status'] == 1){
          this.tipoDocumento = res['data'];
          this.tipoDocumento.fisicotemp =this.tipoDocumento.fisico == 'SI' ? true : false;
          res['data']['tipo_documento_indice'].forEach(e => {
            Object.assign(e,{
              es_directorio: e.es_directorio == 'SI' ? true : false,
              es_obligatorio: e.es_obligatorio == 'SI' ? true : false,
              estado: e.estado == 'A' ? true : false,
              disabled: e.id_documento_indice != 0 ? true : false
            })
          });
          this.listaParametros =res['data']['tipo_documento_indice'];
          console.log(this.listaParametros)
          Swal.fire({
            icon: "success",
            title: "Configuración Modificada",
            text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          });
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "error",
          title: "Error al modificar la configuración",
          text: error.error.message,
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
      }
    );
  
}

  getParametros(){
    this.msgSpinner = 'Buscando Configuración...';
    this.lcargando.ctlSpinner(true);
    let data = {
      tipo_documento: this.tipoDocumento,
      lista_parametros: this.listaParametros
    }
    this.apiSrv.setParametros(data).subscribe(
      (res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Configuración Generada",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "error",
          title: "Error al generar la configuración",
          text: error.error.message,
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
      }
    );
  }


  directorioSelected(event,index) {
    console.log(event)
    for (let i=0; i<this.listaParametros.length;i++){
      if(i==index) {
        this.listaParametros[i].es_directorio = event;
      } 
    }
    console.log(this.listaParametros)
  } 

  estadoSelected(event,index){
 
      for (let i=0; i<this.listaParametros.length;i++){
        if(i==index) {
           this.listaParametros[i].estado = event;
        } 
      }
      console.log(this.listaParametros)
  }

  obligatorioSelected(event,index){
    for (let i=0; i<this.listaParametros.length;i++){
      if(i==index) {
        this.listaParametros[i].es_obligatorio = event;
      } 
    }
    console.log(this.listaParametros)
  }

  expandConsultaParametros() {
    const modal = this.modalService.open(ConsultaParametrosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
     modal.componentInstance.parametros = this.listaParametros;
  }

  confirmRestore() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea limpiar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.limpiarForm();
      }
    });
  }

  eliminarItem(item,index) {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar este elemento de la lista?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listaParametros.splice(index, 1);
        this.listaParametros.forEach((campo, i) => {
          campo.orden = i + 1;
        });
      }
    });
   

    // if (this.fotos[index].id_ticket_fotos > 0) {
    //   this.fotosEliminar.push(this.fotos.splice(index, 1)[0].id_ticket_fotos);
    // } else {
    //   this.fotos.splice(index, 1);
    // }
  }

  limpiarForm() {
    this.disabledAgregar = false
    this.disabledModificar = false
    this.tipoDocumento={
      nombre:'',
      descripcion:'',
      codigo: ''
    }
   this.listaParametros = []
   this.vmButtons[0].habilitar =false;
   this.vmButtons[2].habilitar =true;
    
  }

  onDragStart(event: DragEvent, index: number) {
    event.dataTransfer.setData('index', index.toString());
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const draggedIndex = +event.dataTransfer.getData('index');
    const draggedItem = this.listaParametros[draggedIndex];
    this.listaParametros.splice(draggedIndex, 1);
    this.listaParametros.splice(index, 0, draggedItem);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  


  validartipo() {
    this.tienedate = false
    console.log("validando");
    this.listaParametros.forEach(item => {
      console.log(item);
      if (item.tipo_dato == "date") {
        this.tienedate = true;
        if (!item.es_directorio) {
          item.anio_dir = false;
          item.mes_dir = false;
          item.dia_dir = false;
        }
      }
      if (item.tipo_dato != "date") {
      
          item.anio_dir = false;
          item.mes_dir = false;
          item.dia_dir = false;
       
      }
    })

  }
}
