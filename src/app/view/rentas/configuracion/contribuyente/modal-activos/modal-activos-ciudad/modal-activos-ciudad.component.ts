import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ContribuyenteService } from '../../contribuyente.service';

@Component({
standalone: false,
  selector: 'app-modal-activos-ciudad',
  templateUrl: './modal-activos-ciudad.component.html',
  styleUrls: ['./modal-activos-ciudad.component.scss']
})
export class ModalActivosCiudadComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  fTitle: string = "Registro de valores de activos";
  msgSpinner: string = "Cargando...";
  @Input() contr: any;
  @Input() permisos: any;

  vmButtons: any = [];
  listaActivos: any[] = [];

  @Input() periodo: any;

  localidades: any ={
    provincia: null,
    ciudad: null
  }

  catalog: any = {};

  @Input() ingresos = 0;

  @Input() activos =0;

  @Input() patrimonio = 0;

  // totalIngresos = 0

  sumaTotalIngresos = 0;

  // sumaTotalActivos = 0;

  sumaTotalPatrimonio = 0;

  sumaTotalPorcentajeIngre = 0;

  sumaTotalPorcentajePatrim = 0;

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private apiSrv: ContribuyenteService,
    ) { 
      this.commonVarSrv.guardaActivosPorCiudad.asObservable().subscribe(
        (res) => {
          console.log(res);
          this.listaActivos = res['data']; // se actualiza la lista para que tenga ids en caso que se agreguen

          

          // sort descendiente
          this.listaActivos.sort(function(a,b) {
            return parseFloat(b.id_registro_ciudad) - parseFloat(a.id_registro_ciudad);
          });
        }
      )

      // this.commonVarSrv.loadActivo.asObservable().subscribe(
      //   (res) => {
      //     this.contr = {id_cliente: res.id_cliente};
      //     // console.log(this.contr, this.permisos);
      //     this.cargarActivos();
          
      //   }
      // )

      
    }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsActivosModal", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsActivosModal", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    // console.log(this.contr);

    setTimeout(() => {
      this.cargarActivos();
      this.fillCatalog();
    }, 0)
    // setTimeout(() => {
    //   this.fillCatalog()
    // }, 0)


  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "GUARDAR":
        this.validarActivos();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }


  searchCities(event) {
    console.log(event);
    this.apiSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      console.log(res);
      this.localidades.ciudad = undefined
      this.catalog.ciudad = res['data'];


    }, error => {
      this.toastr.info(error.error.message);
    })
  }


  modalActivosCiudad(local){
    
  }

  cargarActivos() {
    let id = this.contr.id_cliente;
    let data = {
      id_contribuyente: id,
      periodo: this.periodo
    }
    // console.log(data);
    this.msgSpinner = "Cargando activos por contribuyente...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getActivosByCiudad(data).subscribe(
      (res) => {
        // console.log(res);
        this.listaActivos = res['data'];
        // this.ingresarElementoPorcentaje();
        this.listaActivos.sort(function(a,b) {
          return parseFloat(b.periodo) - parseFloat(a.periodo);
        });
        console.log(res['data']);

        if(this.listaActivos.length == 0){
          this.listaActivos.push( {
            id_registro_ciudad: 0,
            fk_contribuyente: this.contr.id_cliente,
            periodo: this.periodo,
            provinica: 'Guayas',
            ciudad: 'Guayaquil',
            ingresos: 0,
            patrimonio: 0,
      
          })
        }
        this.CalculoIngreso()
        this.CalculoPatrimonio()
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error al intentar cargar activos');
      }
    )
  }

  handleActivo(item) {
    item.patrimonio = item.activos - item.pasivos;
  }

  handlePasivo(item) {
    item.patrimonio = item.activos - item.pasivos;
  }

  handleIngreso(item) {
    item.resultado = item.ingresos - item.egresos;
  }

  handleEgreso(item) {
    item.resultado = item.ingresos - item.egresos;
  }

  eliminar(item, i) {
    console.log(item);
    Swal.fire({
      icon: "warning",
      title: "Atencion!",
      text: "Esta seguro que desea eliminar este registro?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(item);
        if(item.id_registro_ciudad==0){
          this.listaActivos.splice(i,1);
          this.CalculoIngreso()
          this.CalculoPatrimonio()
        } else if (item.id_registro_ciudad!=0){
          // borrar de ade veras
          this.msgSpinner = "Eliminando registro de activos...";
          this.lcargando.ctlSpinner(true);
          
          let data = {
            id_registro_ciudad: item.id_registro_ciudad
          }
          console.log(data);
          this.apiSrv.deleteActivoCiudad(data).subscribe(
            (res) => {
              // console.log(res);
              Swal.fire({
                icon: "success",
                title: "Exito!",
                text: "El registro de activos ha sido eliminado con exito",
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                cancelButtonColor: '#F86C6B',
                confirmButtonColor: '#4DBD74',
              })
              this.listaActivos.splice(i,1);
              this.CalculoIngreso()
              this.CalculoPatrimonio()
              this.lcargando.ctlSpinner(false);
            },
            (err) => {
              this.lcargando.ctlSpinner(false);
              console.log(err.error);
              this.toastr.error(err.error.message, 'Error al intentar eliminar registro de activos');
            }
          )
        }
      }
    });

  }


  agregaActivos() {
    let nuevo = {
      id_registro_ciudad: 0,
      fk_contribuyente: this.contr.id_cliente,
      periodo: this.periodo,
      provinica: this.localidades.provincia,
      ciudad: this.localidades.ciudad,
      ingresos: 0,
      patrimonio: 0,

    }

    console.log('nuevo',nuevo);

    if (!this.localidades.provincia && !this.localidades.ciudad){
      this.toastr.warning("Debe ingresar la provincia y ciudad.", this.fTitle);
      this.localidades.provincia=null;
      this.localidades.ciudad=null;
    }
    // } else if (this.periodo.toString().length!=4) {
    //   this.toastr.warning("El formato del periodo no es el adecuado.", this.fTitle);
    //   this.periodo=null;
    // } 
    else {
      this.listaActivos.forEach(i => {
        // console.log(i);
        if ( this.localidades.ciudad==i.ciudad){
          this.toastr.warning("Solo se permite una ciudad.", this.fTitle);
          this.localidades.provincia=null;
          this.localidades.ciudad=null;
        } 
        
      });
    }
    if(this.localidades.provincia && this.localidades.ciudad) {
      console.log('Ingreso ListaActivos');
      this.listaActivos.push(nuevo);
      this.localidades.provincia=null;
      this.localidades.ciudad=null;
    }
  }

  validarActivos() {
    if(this.permisos.guardar=="0") {
      this.toastr.warning("No tiene permisos para crear nuevos Conceptos Detalle.");
    } else if (this.permisos.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Conceptos.", this.fTitle);
    } else {
      this.validarCampos().then((respuesta) => {
        if(respuesta) {
          this.guardarActivos();
        }
      });
    }
  }

  ingresarElementoPorcentaje(){
    this.listaActivos.map((dato)=>{
      console.log(dato);
      dato["porcentajeIngresos"] = 0
      dato["porcentajePatrimonio"] = 0
    })
  }


  fillCatalog() {
    // console.log('Catalogo');
    // this.lcargando.ctlSpinner(true);
    // this.mensajeSppiner = "Cargando Catalogs";
    let data = {
      params: "'CIUDAD', 'PROVINCIA'",
    };
    this.apiSrv.getCatalogs(data).subscribe(
      (res) => {
        // console.log('catalogo',res);
        this.catalog.provincia = res["data"]["PROVINCIA"];
        this.catalog.ciudad = res["data"]["CIUDAD"];

        // console.log(this.catalog);
        // this.lcargando.ctlSpinner(false);
      },
      (error) => {
        // this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }

  CalculoIngreso(){
    let sumaIngresos = 0;
    this.listaActivos.map((datos, index)=>{
      sumaIngresos += parseFloat(datos.ingresos)
      this.calcularPorcentajeIngreso(datos.ingresos, index)
    })
    this.sumaTotalIngresos = sumaIngresos
    // console.log(sumaIngresos);
    this.CalculoSumaPorcentajeIngre()
  }



  calcularPorcentajeIngreso(ingresos, index){
    if(this.ingresos != 0  && this.patrimonio != 0){
      let porcentajeIngresos = (ingresos/this.ingresos)*100;
      this.listaActivos[index]["porcentajeIngresos"] = porcentajeIngresos;

    }else {
      this.listaActivos[index]["porcentajeIngresos"] = 0
    }
    
  }

  CalculoSumaPorcentajeIngre(){
    let sumaPorcentajeIngre: number = 0;
    this.listaActivos.map((datos, index)=>{
      sumaPorcentajeIngre += datos.porcentajeIngresos
      console.log(sumaPorcentajeIngre);
    })
    this.sumaTotalPorcentajeIngre = sumaPorcentajeIngre
    // console.log(sumaIngresos);
  }


  CalculoPatrimonio(){
    // let sumaPatrimonio = 0;
    // this.listaActivos.map((datos, index)=>{
    //   sumaPatrimonio += parseFloat(datos.patrimonio)
      
    //   this.calcularPorcentajePatrimonio( datos.patrimonio, index)
    // })
    const sumaPatrimonio = this.listaActivos.reduce((acc: number, curr: any, idx: number) => {
      this.calcularPorcentajePatrimonio(curr.patrimonio, idx)
      if (idx == this.listaActivos.length - 1) {
        
      }
      return acc + (Math.floor(curr.patrimonio * 100) / 100)
    }, 0)

    this.sumaTotalPatrimonio = sumaPatrimonio
    // console.log(sumaIngresos);
    this.CalculoSumaPorcentajePatrim()
    
  }

  calcularPorcentajePatrimonio( patrimonio,index){

    if(this.ingresos != 0  && this.patrimonio != 0){
      // let porcentajePatrimonio = Math.ceil((patrimonio/this.patrimonio)*100);
      this.listaActivos[index]["porcentajePatrimonio"] = Math.round(patrimonio / this.patrimonio*10000)/100;
    }else {
      this.listaActivos[index]["porcentajePatrimonio"] = 0
    }
    
  }

  

  CalculoSumaPorcentajePatrim(){
    // let sumaPorcentajePatrim: number = 0;
    // this.listaActivos.map((datos, index)=>{
      
    //   sumaPorcentajePatrim += datos.porcentajePatrimonio
    //   console.log(sumaPorcentajePatrim);
    // })
    const sumaPorcentajePatrim = this.listaActivos.reduce((acc: number, curr: any) => acc + curr.porcentajePatrimonio, 0)

    this.sumaTotalPorcentajePatrim = sumaPorcentajePatrim
    // console.log(sumaIngresos);
  }


  





  // Calculoactivos(){
  //   let sumaActivos = 0;
  //   this.listaActivos.map((datos)=>{
  //     sumaActivos += parseInt(datos.activos)
  //   })

  //   this.sumaTotalActivos = sumaActivos

  // }


  validarCampos() {
    let flag = false;
    let verificacion = false;
    return new Promise((resolve, reject) => {
      this.listaActivos.forEach((r, index, array) => {
        // console.log(r);
        // if(
        //   r.provinica == 0 ||
        //   r.provinica == undefined  
        // ) {
        //   this.toastr.info("El campo ciudad no puede ser vacio: "+r.periodo);
        //   flag = true;
        //   resolve(false);
        // } else if(
        //   r.ciudad == 0 ||
        //   r.ciudad == undefined  
        // ) {
        //   this.toastr.info("El campo periodo no puede ser vacio en periodo: "+r.periodo);
        //   flag = true;
        //   resolve(false);
        // }
        // if(
        //   r.ingresos <= 0 ||
        //   r.ingresos == undefined
        // ) {
        //   this.toastr.info("El valor de ingresos debe ser mayor a 0 : ");
        //   flag = true;
        //   resolve(false);
        // } else if(
        //   r.patrimonio <= 0 ||
        //   r.patrimonio == undefined
        // ) {
        //   this.toastr.info("El valor de patrimonio debe ser mayor a 0 : ");
        //   flag = true;
        //   resolve(false);
        // }

        if(
          r.ingresos !=0
        ){
          verificacion = true
        }else if(
          r.patrimonio != 0
        ){
          verificacion = true
        }


        // else if(
        //   this.ingresos != this.sumaTotalIngresos
        // ){
        //   this.toastr.info("Los valores de los ingresos deben sumar  "+ this.ingresos);
        //   flag = true;
        //   resolve(false);
        // }    
        // else if(
        //   r.patrimonio<0 ||
        //   r.patrimonio == undefined
        // ) {
        //   this.toastr.info("El campo patrimonio debe ser mayor o igual a 0");
        //   flag = true;
        // } 
        // else if(
        //   r.ingresos <= 0 ||
        //   r.ingresos == undefined
        // ) {
        //   this.toastr.info("El valor de ingresos debe ser mayor a 0 en periodo: "+r.periodo);
        //   flag = true;
        //   resolve(false);
        // }
        //  else if(
        //   r.resultado<0 ||
        //   r.resultado == undefined
        // ) {
        //   this.toastr.info("El campo resultado debe ser mayor o igual a 0");
        //   flag = true;
        // }
        // para que se resuelva la promesa true solo en la ultima iteracion
        // if( index === array.length - 1){
        //   !flag ? resolve(true) : resolve(false);
        // }
        
        
      });

      if(verificacion){
        if( (this.sumaTotalPorcentajeIngre < 100 && this.sumaTotalPorcentajeIngre > 0) || this.sumaTotalPorcentajeIngre > 100 ){
          this.toastr.info("El porcentaje del ingreso no debe ser " + this.sumaTotalPorcentajeIngre);
          flag = true;
          resolve(false);
        }else if ((this.sumaTotalPorcentajePatrim <100 && this.sumaTotalPorcentajePatrim > 0) || this.sumaTotalPorcentajePatrim > 100){
          this.toastr.info("El porcentaje del patrimonio no debe ser " + this.sumaTotalPorcentajePatrim);
          flag = true;
          resolve(false);
        }
      }

      if(this.ingresos != this.sumaTotalIngresos){
        this.toastr.info("Los valores de los ingresos deben sumar $"+ this.ingresos);
        flag = true;
        resolve(false);
      }else if (Math.round(this.patrimonio * 100) / 100 != this.sumaTotalPatrimonio || !this.sumaTotalPatrimonio){
        this.toastr.info("Los valores de patrimonio deben sumar $"+ this.patrimonio);
        flag = true;
        resolve(false);
      }

      !flag ? resolve(true) : resolve(false);
      
    });
  }

  guardarActivos() {

    Swal.fire({
      icon: "warning",
      title: "Atención!",
      text: "Esta seguro que desea guardar estos registros?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result)=>{

      if(result.isConfirmed){
        this.msgSpinner = "Guardando registros de activos...";
        this.lcargando.ctlSpinner(true);
        console.log(this.listaActivos);
        let data = {
          params: this.listaActivos
        }

        this.apiSrv.saveActivosCiudad(data).subscribe(
          (res) => {
            // console.log(res);
            Swal.fire({
              icon: "success",
              title: "Éxito!",
              text: "Registros de activos guardados con éxito",
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              cancelButtonColor: '#F86C6B',
              confirmButtonColor: '#4DBD74',
            })
            this.CalculoIngreso()
            this.commonVarSrv.guardaActivosPorCiudad.next(res);
            this.lcargando.ctlSpinner(false);
          },
          (err) => {
            this.lcargando.ctlSpinner(false);
            console.log(err.error);
            this.toastr.error(err.error.message, 'Error al intentar guardar registros de activos');
          }
        )
      }
    });
    
  }

}
