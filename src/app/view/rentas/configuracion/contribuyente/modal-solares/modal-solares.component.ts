import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ContribuyenteService } from '../contribuyente.service';

@Component({
standalone: false,
  selector: 'app-modal-solares',
  templateUrl: './modal-solares.component.html',
  styleUrls: ['./modal-solares.component.scss']
})
export class ModalSolaresComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  @Input() fTitle: string ;
  
  @Input() contr: any;
  @Input() permisos: any;

  vmButtons: any = [];
  listaActivos: any = [];

  @Input() periodo: any;

  solar: any ={
    periodo: null,
    valor: null
  }

  catalog: any = {};

  @Input() objSolar: any;

  @Input() dataUser: any;

  @Input() tipoCont: any;

  @Input() ingresos = 0;

  @Input() activos =0;

  @Input() patrimonio = 0;

  // totalIngresos = 0

  sumaTotalSolares = 0;

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
            return parseFloat(b.id_lote_contribucion) - parseFloat(a.id_lote_contribucion);
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
      { orig: "btnsActivosModal", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: " GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsActivosModal", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];


    setTimeout(() => {
      this.cargarActivos();

    }, 0)
    // setTimeout(() => {
    //   this.fillCatalog()
    // }, 0)


  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validarActivos();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }


  // searchCities(event) {
  //   console.log(event);
  //   this.apiSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
  //     console.log(res);
  //     this.localidades.ciudad = undefined
  //     this.catalog.ciudad = res['data'];


  //   }, error => {
  //     this.toastr.info(error.error.message);
  //   })
  // }



  cargarActivos() {

    let data = {
      fk_solar: this.objSolar.id,
      tipo_contribucion: this.tipoCont
    };
    // console.log(data);
    (this as any).mensajeSpinner = "Cargando activos por contribuyente...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getLoteContribucion(data).subscribe(
      (res) => {
        console.log(res);
        this.listaActivos = res['data'];
        // this.ingresarElementoPorcentaje();
        this.listaActivos.sort(function(a,b) {
          return parseFloat(b.periodo) - parseFloat(a.periodo);
        });
        console.log(res['data']);
        this.CalculoValorSolares()
        // this.CalculoIngreso()
        // this.CalculoPatrimonio()
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error al intentar cargar activos');
      }
    )
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
        if(item.id_lote_contribucion==0){
          this.listaActivos.splice(i,1);
          // this.CalculoIngreso()
          // this.CalculoPatrimonio()
        } else if (item.id_lote_contribucion!=0){
          // borrar de ade veras
          (this as any).mensajeSpinner = "Eliminando registro de activos...";
          this.lcargando.ctlSpinner(true);
          
          let data = {
            id_lote_contribucion: item.id_lote_contribucion
          }
          console.log(data);
          this.apiSrv.deleteLoteContribucion(data).subscribe(
            (res) => {
              console.log(res);
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
              this.CalculoValorSolares()
              // this.CalculoIngreso()
              // this.CalculoPatrimonio()
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
      id_lote_contribucion: 0,
      tipo_contribucion: this.tipoCont,
      fk_contribuyente: this.contr.id_cliente,
      fk_solar: this.objSolar.id,
      periodo: this.solar.periodo,
      valor: this.solar.valor,
      id_usuario: this.dataUser,

    }

    console.log('nuevo',nuevo);

    if (!this.solar.periodo && !this.solar.valor){
      this.toastr.warning("Debe ingresar el periodo y el valor.", this.fTitle);
      this.solar.periodo=null;
      this.solar.valor=null;
    }
    // else {
    //   this.listaActivos.forEach(i => {
    //     // console.log(i);
    //     if ( this.solar.valor==i.ciudad){
    //       this.toastr.warning("Solo se permite una ciudad.", this.fTitle);
    //       this.solar.periodo=null;
    //       this.solar.valor=null;
    //     } 
        
    //   });
    // }
    if(this.solar.periodo && this.solar.valor) {
      console.log('Ingreso ListaActivos');
      this.listaActivos.push(nuevo);
      this.solar.periodo=null;
      this.solar.valor=null;
      this.CalculoValorSolares()
    }
  }

  async validarActivos() {
    if(this.permisos.guardar=="0") {
      this.toastr.warning("No tiene permisos para crear nuevos Conceptos Detalle.");
    } else if (this.permisos.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Conceptos.", this.fTitle);
    } else {
      let resp = await this.validarCampos().then((respuesta) => {
        if(respuesta) {
          this.guardarActivos();
        }
      });
    }
  }



  // fillCatalog() {
  //   // console.log('Catalogo');
  //   // this.lcargando.ctlSpinner(true);
  //   // (this as any).mensajeSpinner = "Cargando Catalogs";
  //   let data = {
  //     params: "'CIUDAD', 'PROVINCIA'",
  //   };
  //   this.apiSrv.getCatalogs(data).subscribe(
  //     (res) => {
  //       // console.log('catalogo',res);
  //       this.catalog.provincia = res["data"]["PROVINCIA"];
  //       this.catalog.ciudad = res["data"]["CIUDAD"];

  //       // console.log(this.catalog);
  //       // this.lcargando.ctlSpinner(false);
  //     },
  //     (error) => {
  //       // this.lcargando.ctlSpinner(false);
  //       this.toastr.info(error.error.message);
  //     }
  //   );

  // }

  CalculoValorSolares(){
    let sumaSolares = 0;
    this.listaActivos.map((datos, index)=>{
      sumaSolares += parseInt(datos.valor)
    })
    this.sumaTotalSolares = sumaSolares
    console.log(sumaSolares);
  }
  


  CalculoIngreso(){
    let sumaIngresos = 0;
    this.listaActivos.map((datos, index)=>{
      sumaIngresos += parseInt(datos.ingresos)
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
    let sumaPatrimonio = 0;
    this.listaActivos.map((datos, index)=>{
      sumaPatrimonio += parseInt(datos.patrimonio)
      
      this.calcularPorcentajePatrimonio( datos.patrimonio, index)
    })
    this.sumaTotalPatrimonio = sumaPatrimonio
    // console.log(sumaIngresos);
    this.CalculoSumaPorcentajePatrim()
    
  }

  calcularPorcentajePatrimonio( patrimonio,index){

    if(this.ingresos != 0  && this.patrimonio != 0){
      let porcentajePatrimonio = (patrimonio/this.patrimonio)*100;
      this.listaActivos[index]["porcentajePatrimonio"] = porcentajePatrimonio;
    }else {
      this.listaActivos[index]["porcentajePatrimonio"] = 0
    }
    
  }

  

  CalculoSumaPorcentajePatrim(){
    let sumaPorcentajePatrim: number = 0;
    this.listaActivos.map((datos, index)=>{
      
      sumaPorcentajePatrim += datos.porcentajePatrimonio
      console.log(sumaPorcentajePatrim);
    })
    this.sumaTotalPorcentajePatrim = sumaPorcentajePatrim
    // console.log(sumaIngresos);
  }



  validarCampos() {
    let flag = false;
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

      // if(
      //   this.ingresos != this.sumaTotalIngresos
      // ){
      //   this.toastr.info("Los valores de los ingresos deben sumar  "+ this.ingresos);
      //   flag = true;
      //   resolve(false);
      // }else if (
      //   this.patrimonio != this.sumaTotalPatrimonio ||
      //   !this.sumaTotalPatrimonio
      // ){
      //   this.toastr.info("Los valores de los activos deben sumar  "+ this.ingresos);
      //   flag = true;
      //   resolve(false);
      // }

      !flag ? resolve(true) : resolve(false);
      
    });
  }

  guardarActivos() {

    Swal.fire({
      icon: "warning",
      title: "Atencion!",
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
        (this as any).mensajeSpinner = "Guardando registros de activos...";
        this.lcargando.ctlSpinner(true);
        console.log(this.listaActivos);
        let data = {
          params: this.listaActivos
        }

        this.apiSrv.createLoteContribucion(data).subscribe(
          (res) => {
            // console.log(res);
            Swal.fire({
              icon: "success",
              title: "Exito!",
              text: "Registros de activos guardados con exito",
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              cancelButtonColor: '#F86C6B',
              confirmButtonColor: '#4DBD74',
            })
            // this.CalculoIngreso()
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