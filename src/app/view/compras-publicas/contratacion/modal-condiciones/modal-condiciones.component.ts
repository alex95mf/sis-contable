import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ContratacionService } from '../contratacion.service';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import * as moment from 'moment';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';


@Component({
standalone: false,
  selector: 'app-modal-condiciones',
  templateUrl: './modal-condiciones.component.html',
  styleUrls: ['./modal-condiciones.component.scss']
})
export class ModalCondicionesComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) 
  lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  msgSpinner: string

  listacondiciones: any = {
    fk_solicitud:0,
    cod_sercop:"",
    fecha:moment(new Date()).format('YYYY-MM-DD'),
    forma_pago:"",
    condicion:"",
    plazo:moment(new Date()).format('YYYY-MM-DD'),
    valor:0
  };

  totalValorCondiciones: any

  programa: any = []

  departamento: any = []

  atribucion: any = []

  asigna: any =[]

  proceso: any = []

  vmButtons: Botonera[] = [];
  @Input() item: any;
  @Input() detalle_solicitud: any;
  @Input() condiciones: any;
  @Input() totalCondiciones: any;
  @Input() valor_adjudicado: any;

  cmb_forma_pago: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private contratoService: ContratacionService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVrs: CommonVarService,
    private cierremesService: CierreMesService
    
  ) {
    this.vmButtons = [
      { orig: "btnsComprasP", 
      paramAccion: "1", 
      boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, 
      permiso: true, 
      showtxt: true, 
      showimg: true, 
      showbadge: false, 
      clase: "btn btn-warning btn-sm", 
      habilitar: false, 
      imprimir: false},
      {
        orig: "btnsComprasP",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }
    ]
  }

  ngOnInit(): void {
    console.log(this.detalle_solicitud)
    console.log(this.condiciones)
    console.log(this.valor_adjudicado)

    setTimeout(() => {
      this.cargarFormasPago()
    }, 0)
  }

  async cargarFormasPago() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando Formas de Pago'
      let catalogo = await this.contratoService.getCatalogo({params: "'CMP_COND_FORMA_PAGO'"}).toPromise<any>()
      console.log(catalogo.data)
      //
      this.cmb_forma_pago = catalogo.data['CMP_COND_FORMA_PAGO']
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Formas de Pago')
    }
  }

  metodoGlobal(event: any){
    switch(event.items.boton.texto){
      
      case "REGRESAR":
        this.activeModal.close()
        break;
      case "GUARDAR":
        this.validaCondiciones()
        //this.crearCondiones()
        break;
    }
  }
  validarValor(event){
    console.log(event,parseFloat(this.item.con_valor))
   
   
    let totalValorCondicion= 0
    this.condiciones.forEach(element => {
      totalValorCondicion += +parseFloat(element.valor)
     
    });
    this.totalValorCondiciones = totalValorCondicion
console.log((this.totalValorCondiciones+event)+ ' ' + parseFloat(this.item.con_valor))
    if(  event > parseFloat(this.item.con_valor) ){//|| (event+this.totalValorCondiciones) > parseFloat(this.item.con_valor)
      //this.toastr.info('El valor de todas las condiciones no puede ser mayor a ' + parseFloat(this.item.con_valor))
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: `El valor de todas las condiciones no puede ser mayor a ${this.commonService.formatNumberDos(parseFloat(this.item.con_valor).toFixed(2))}`,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      })

    }
  }



   validaCondiciones() {
  
    this.validaCond().then(respuesta => {
      if (respuesta) {
        this.crearCondiones()
      }
    }).catch((err) => {
      console.log(err);
      this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    });

}
validaCond() {

     
  let c = 0;
  let mensajes: string = '';
  return new Promise((resolve, reject) => {
     
    if(new Date(this.listacondiciones.fecha) >= new Date(this.listacondiciones.plazo)){
      mensajes += "* Debe ingresar una fecha válida para la condición <br>"
    }
    if(this.listacondiciones.valor <= 0 ){
      mensajes += "* Debe ingresar un valor mayor a 0 <br>"
    }

    if( this.listacondiciones == undefined || this.listacondiciones.valor == ""){
      mensajes += "* Debe ingresar un valor válido <br>"
    }
    if( (this.listacondiciones.valor + this.totalCondiciones) > parseFloat(this.valor_adjudicado) ){
      mensajes += "* La sumatoria del valor de la condición de $"+ this.commonService.formatNumberDos(this.listacondiciones.valor)
      +" mas el valor total de las condiciones que es de $"+this.commonService.formatNumberDos(this.totalCondiciones)
      +" no puedes ser mayor al valor adjudicado de $"+ this.commonService.formatNumberDos(parseFloat(this.valor_adjudicado))+"<br>"
    }


    return (mensajes.length) ? reject(mensajes) : resolve(true)
   
  });
}


  crearCondiones(){
   
    // let totalValorCondicion= 0
    // this.condiciones.forEach(element => {
    //   totalValorCondicion += +parseFloat(element.valor)
     
    // });

    // if(new Date(this.listacondiciones.fecha) >= new Date(this.listacondiciones.plazo) ){
    //   this.toastr.info("Debe ingresar una fecha válida para la condición")
    //   return
    // }
    // else if (this.listacondiciones.valor <= 0 || this.listacondiciones == undefined || this.listacondiciones.valor == ""){
    //   this.toastr.info("Debe ingresar un valor válido")
    //   return
    // }



    // else if (totalValorCondicion > parseFloat(this.item.con_valor)){
    //   this.toastr.info('El valor de la condición de todas las condiciones no puede ser mayor a '+parseFloat(this.item.con_valor))
    //   return
    // }
    // else if(this.listacondiciones.valor > totalValorCondicion){
    //   this.toastr.info('El valor de la condición no puede ser mayor a '+parseFloat(this.item.con_valor))
    //   return
    // }
    // else if(  parseFloat(this.item.con_valor) > this.listacondiciones.valor  ){
    //   this.toastr.info('El valor de la condición no puede ser mayor a '+parseFloat(this.item.con_valor))
    //   return
    // }
    // else if(totalValorCondicion > parseFloat(this.item.con_valor) && this.listacondiciones.valor > totalValorCondicion){
    //   this.toastr.info('El valor de la condición no puede ser mayor a '+parseFloat(this.item.con_valor))
    //   return
    // }else if(totalValorCondicion==0 ?? this.listacondiciones.valor  > parseFloat(this.item.con_valor)  ){
    //   this.toastr.info('El valor de la condición no puede ser mayor a '+parseFloat(this.item.con_valor))
    //   return
    // }
    // else if((this.listacondiciones.valor+totalValorCondicion) > parseFloat(this.item.con_valor)){
    //   this.toastr.info('El valor de la condición sumado a las condiciones ya registradas no puede ser mayor a '+parseFloat(this.item.con_valor))
    //   return
    // }
    //  else if(this.listacondiciones.valor > parseFloat(this.item.con_valor)){
    //   this.toastr.info('El valor de la condición no puede ser mayor a '+parseFloat(this.item.con_valor))
    //   return
    // }

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar la condicion?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {



            this.msgSpinner = "Verificando período contable";
  this.lcargando.ctlSpinner(true);
  let datos = {
    "anio": Number(moment().format('YYYY')),
    "mes": Number(moment().format('MM')),
  }
    this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
     
    /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {
       
        this.mensajeSpinner = "Cargando...";
        this.lcargando.ctlSpinner(true);
        let data = {
          listacondiciones: {
            fk_solicitud:this.item["id_solicitud"],
            cod_sercop:this.listacondiciones.cod_sercop,
            fecha:this.listacondiciones.fecha,
            forma_pago:this.listacondiciones.forma_pago,
            condicion:this.listacondiciones.condicion,
            plazo:this.listacondiciones.plazo,
            valor:this.listacondiciones.valor
          }
        }
        

        this.contratoService.guardarCondiciones(data).subscribe(
            (res) => {
                console.log(res);
                
                if (res["status"] == 1) {
                  this.lcargando.ctlSpinner(false);
                Swal.fire({
                    icon: "success",
                    title: "Se guardo con éxito",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                }).then((result) => {
                  if (result.isConfirmed) {
                    console.log("hola")
                    this.commonVrs.selectCondicion.next(res)
                    this.activeModal.close()
                  }
                  
                });
                } else {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                });
                
                }
            },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.message);
            }
        )
      } else {
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }

    }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
    })






             
        }
    });
  }



}
