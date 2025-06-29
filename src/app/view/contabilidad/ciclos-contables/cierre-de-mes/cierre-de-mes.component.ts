
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices'
import { CierreMesService } from './cierre-mes.service'
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

import moment from 'moment'
import Swal, { SweetAlertResult } from 'sweetalert2';
import Botonera from 'src/app/models/IBotonera';



@Component({
standalone: false,
  selector: 'app-cierre-de-mes',
  templateUrl: './cierre-de-mes.component.html',
  styleUrls: ['./cierre-de-mes.component.scss'],
})
export class CierreDeMesComponent implements OnInit {

  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: Array<Botonera> = [];
  mensajeSpinner:string;

  lstNiveles: any = [];
  periodos: any = [];
  permisions: any;
  empresLogo: any;
  dataUser: any;
  btnPrint: any;
  groupAccount: any;
  processing: any = false;
  disabled: any = false;
  selected_anio: any;
  check_todos_meses: any = false;


  permiso_ver: any = "0";
  mes_actual: any = 0;

  selected_mes : any;
  arrayMes: any =
    [
      {
        id: "0",
        name: "-Todos-"
      },{
        id: "1",
        name: "Enero"
      },
      {
        id: "2",
        name: "Febrero"
      },
      {
        id: "3",
        name: "Marzo"
      },
      {
        id: "4",
        name: "Abril"
      },
      {
        id: "5",
        name: "Mayo"
      },
      {
        id: "6",
        name: "Junio"
      },
      {
        id: "7",
        name: "Julio"
      },
      {
        id: "8",
        name: "Agosto"
      },

      {
        id: "9",
        name: "Septiembre"
      },
      {
        id: "10",
        name: "Octubre"
      },
      {
        id: "11",
        name: "Noviembre"
      },
      {
        id: "12",
        name: "Diciembre"
      },
    ];

  cmb_periodos: Array<any> = [];


  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private cierremesService: CierreMesService,
    //public dialogService: DialogService

  ) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    this.vmButtons = [
      {
        orig: 'btnsConsultCierreMes',
        paramAccion: '',
        boton: { icon: 'fas fa-plus', texto: 'GENERAR'},
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      }
      // { orig: "btnsConsultCierreMes", paramAccion: "", boton: { icon: "fa fa-print", texto: "APERTURAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      // { orig: "btnsConsultCierreMes", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    this.selected_anio = moment(new Date()).format('YYYY');
  }

  ngOnInit(): void {

    //this.mes_actual = Number(moment(new Date()).format('MM'));
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();

    this.empresLogo = this.dataUser.logoEmpresa;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fCierreMes,
      id_rol: id_rol
    }

    this.commonService.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'];

      this.permiso_ver = this.permisions[0].ver;

      if (this.permiso_ver == "0") {

        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Balance comprobación");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);

      } else {
        this.cargaInicial();
      }


    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Periodos'
      let response = await this.cierremesService.getPeriodos();
      this.cmb_periodos = response;
      this.lcargando.ctlSpinner(false)
    } catch(err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial');
    }
  }

  ChangeMesCierrePeriodos(evento: any){ this.mes_actual = evento;}

  getGrupoAccount() {
    this.cierremesService.getGrupoAccount({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.groupAccount = res['data'];
      this.processing = true;
      //this.getAccountData();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }


  EventAllMes(evento: any) {


    this.disabled = evento.checked;

    if (evento.checked) {
      this.mes_actual = "0";
    } else {
      this.mes_actual = Number(moment(new Date()).format('MM'));
    }


  }


  async confirmSave(text: any) {
    Swal.fire({
      title: "Confirmar",
      text: text,
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.guardarApertura();
      }
    })
  }


  async confirmCierre(text: any) {
    Swal.fire({
      title: "Confirmar",
      text: text,
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.guardarCierre();
      }
    })
  }

  ObtenerPeriodo() {
    let year;

    // if(typeof anio !== "string"){
    //   year = anio.getFullYear();

    // }else{
    //   year = anio;
    // }
    year= this.selected_anio

    //this.selected_anio = anio;

    this.periodos = [];

    let data = {
      "anio": year
    }

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Periodo'

    this.cierremesService.obtenerCierresPeriodo(data).subscribe(res => {
      console.log(res["data"]);
      if(res["data"].length > 0){
        for (let element of res["data"]) {

          let mes_letter;

          switch (element["mes"]) {
            case 1: {
              mes_letter = "ENERO";
              break;
            }
            case 2: {
              mes_letter = "FEBRERO";
              break;
            }
            case 3: {
              mes_letter = "MARZO";
              break;
            }
            case 4: {
              mes_letter = "ABRIL";
              break;
            }
            case 5: {
              mes_letter = "MAYO";
              break;
            }
            case 6: {
              mes_letter = "JUNIO";
              break;
            }
            case 7: {
              mes_letter = "JULIO";
              break;
            }
            case 8: {
              mes_letter = "AGOSTO";
              break;
            }
            case 9: {
              mes_letter = "SEPTIEMBRE";
              break;
            }
            case 10: {
              mes_letter = "OCTUBRE";
              break;
            }
            case 11: {
              mes_letter = "NOBIEMBRE";
              break;
            }
            case 12: {
              mes_letter = "DICIEMBRE";
              break;
            }
          }

          this.periodos.push(
            {

              anio: element["anio"],
              estado: element["estado"] === "C" ? "CERRADO" : "APERTURADO",
              mes: mes_letter,
              estate: element["estado"],
              mes_numero: element["mes"],
              checked: element["estado"] === "C" ? false : true,

            }
          )

          this.lcargando.ctlSpinner(false);

        }
      }else{
        this.periodos = [];
        // this.toastr.info("No hay información para mostrar");
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          title: 'No hay datos para el periodo seleccionado',
          text: 'Desea generar los registros necesarios?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Generar',
          cancelButtonText: 'Cancelar',
        }).then((result: SweetAlertResult) => {
          if (result.isConfirmed) this.generarPeriodo();
        })
      }


    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })

  }

  guardarApertura() {


    let year;

    if(typeof this.selected_anio !== "string"){
      year = this.selected_anio.getFullYear();
    }else{
      year = this.selected_anio;
    }

    //debugger;
    let id_empresa = this.dataUser.id_empresa;

    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
      return false;
    }

    if(this.check_todos_meses) {

      this.lcargando.ctlSpinner(true);

      for (let i = 0; i < 12; i++) {

        let data = {
          "id_empresa": id_empresa,
          "anio": year,
          "mes": i+1,
          "estado": "A"
        }

        this.cierremesService.registrarCierresPeriodo(data).subscribe(res => {
          console.log(res);
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
        })

        if(i === 11){
          this.ObtenerPeriodo();

        }

      }


    }else{

      let year;

      if(typeof this.selected_anio !== "string"){
        year = this.selected_anio.getFullYear();
      }else{
        year = this.selected_anio;
      }

      this.lcargando.ctlSpinner(true);

      let meses = document.getElementById("elemento_pruebas")["value"];
      let anio = document.getElementsByClassName("select_periodo_registro");

      let data = {
        "id_empresa": id_empresa,
        "anio": year,
        "mes": this.mes_actual,
        "estado": "A"
      }
/*
      console.log('Empezo')

      this.RegistrarCierreApertura(data);

      console.log('fin')
    */

      this.cierremesService.registrarCierresPeriodo(data).subscribe(res => {
        this.ObtenerPeriodo();
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      })

    }






  }


  guardarCierre() {


    let year;

    if(typeof this.selected_anio !== "string"){
      year = this.selected_anio.getFullYear();
    }else{
      year = this.selected_anio;
    }

    //debugger;
    let id_empresa = this.dataUser.id_empresa;

    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
      return false;
    }

    if(this.check_todos_meses) {

      this.lcargando.ctlSpinner(true);

      for (let i = 0; i < 12; i++) {

        let data = {
          "id_empresa": id_empresa,
          "anio": year,
          "mes": i+1,
          "estado": "C"
        }

        this.cierremesService.registrarCierresPeriodo(data).subscribe(res => {
          console.log(res);
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
        })

        if(i === 11){
          this.ObtenerPeriodo();

        }

      }


    }else{

      let year;

      if(typeof this.selected_anio !== "string"){
        year = this.selected_anio.getFullYear();
      }else{
        year = this.selected_anio;
      }

      this.lcargando.ctlSpinner(true);

      let meses = document.getElementById("elemento_pruebas")["value"];
      let anio = document.getElementsByClassName("select_periodo_registro");

      let data = {
        "id_empresa": id_empresa,
        "anio": year,
        "mes": this.mes_actual,
        "estado": "C"
      }
/*
      console.log('Empezo')

      this.RegistrarCierreApertura(data);

      console.log('fin')
    */

      this.cierremesService.registrarCierresPeriodo(data).subscribe(res => {
        this.ObtenerPeriodo();
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      })

    }

  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GENERAR":
        this.generarPeriodo();
        break;
      case "CONSULTAR":
        this.ObtenerPeriodo();
        break;

      case "APERTURAR":
        if(this.check_todos_meses)

          this.confirmSave("Efectuar apertura del todos los meses del periodo "+ this.selected_anio);
        else
          this.confirmSave("Efectuar apertura del mes "+ this.mes_actual + ', para el periodo '+ this.selected_anio);
        break;
      case "CERRAR":
        if(this.check_todos_meses)
          this.confirmCierre("Efectuar cierre de todos los meses del periodo "+ this.selected_anio);
        else
          this.confirmCierre("Efectuar cierre del mes "+ this.mes_actual + ', para el periodo '+ this.selected_anio);
        break;
    }
  }




  async RegistrarCierreApertura (data) {

    console.log(' asyng')

    let resp = await this.cierremesService.registrarCierresPeriodo(data).toPromise();

    console.log(resp);

    //let resp = await this.cierremesService.registrarCierresPeriodo(data).subscribe(res)


    /*
    let resp = await this.validateDataGlobal().then(respuesta => {
      if (respuesta) {
        this.confirmSave("Seguro desea realizar el egreso por vale?", "SAVE_CAJA_MOV");
      }
    })
    */



  }

  async cambiarEstate(item: any, event: any,index) {
    //


   // console.log(item, event.target.checked)

    // switch (item.mes) {
    //   case "ENERO":
    //     Object.assign(item, { mes: 1 })
    //     break;
    //   case "FEBRERO":
    //     Object.assign(item, { mes: 2 })
    //     break;
    //   case "MARZO":
    //     Object.assign(item, { mes: 3 })
    //     break;
    //   case "ABRIL":
    //     Object.assign(item, { mes: 4 })
    //     break;
    //   case "MAYO":
    //     Object.assign(item, { mes: 5 })
    //     break;
    //   case "JUNIO":
    //     Object.assign(item, { mes: 6 })
    //     break;
    //   case "JULIO":
    //     Object.assign(item, { mes: 7 })
    //     break;
    //   case "AGOSTO":
    //     Object.assign(item, { mes: 8 })
    //     break;
    //   case "SEPTIEMBRE":
    //     Object.assign(item, { mes: 9 })
    //     break;
    //   case "OCTUBRE":
    //     Object.assign(item, { mes: 10 })
    //     break;
    //   case "NOVIEMBRE":
    //     Object.assign(item, { mes: 11 })
    //     break;
    //   case "DICIEMBRE":
    //     Object.assign(item, { mes: 12 })
    //     break;

    //   default:
    //     break;
    // }
    console.log(this.periodos)
    const anteriorIndex = item.mes_numero - 1;
    const siguienteIndex= item.mes_numero + 1;


    let mesAnterior: any = this.periodos.filter((datos) => datos.mes_numero == anteriorIndex);
    let mesPosterior: any = this.periodos.filter((datos) => datos.mes_numero == siguienteIndex);

   // item.mes  =  'cambiado'
    const estado = (event) ? 'A' : 'C'
    console.log(event,estado)
    let message = '';

    if (item.mes_numero !=12 && mesPosterior[0].estado == 'CERRADO' && event) {
       var checkbox = document.getElementById("customSwitch"+index) as HTMLInputElement;
       checkbox.checked = false;
      this.toastr.warning('* No puede aperturar el mes de ' + item.mes +' porque el estado del mes de '+ mesPosterior[0].mes +' esta CERRADO.')
      return;
    }
    //message += '* No puede aperturar el mes de' + item.mes +' porque el estado del mes de '+ mesPosterior[0].mes +' esta CERRADO.<br>';
    if (item.mes_numero !=1 && mesAnterior[0].estado == 'APERTURADO' && !event){
      var checkbox = document.getElementById("customSwitch"+index) as HTMLInputElement;
      checkbox.checked = true;
      this.toastr.warning('* No puede cerrar el mes de ' + item.mes +' porque el estado del mes de '+ mesAnterior[0].mes +' esta APERTURADO.')
      return;
    }
    //message += '* No puede cerrar el mes de' + item.mes +' porque el estado del mes de '+ mesAnterior[0].mes +' esta APERTURADO.<br>';

     item.checked = false;
     console.log(this.periodos)
    // if (message.length > 0) {
    //   item.checked = false
    //    var checkbox = document.getElementById("customSwitch"+index) as HTMLInputElement;
    //    checkbox.checked = false;
    //   this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true });
    //   return;
    // }

    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cambiando Estado'
      let response = await this.cierremesService.updateEstadoMes({ anio: item.anio, mes: item.mes_numero, estado });
      console.log(response)

      this.lcargando.ctlSpinner(false)
      Swal.fire('Estado actualizado correctamente.', '', 'success').then(() => this.ObtenerPeriodo())
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cambiando Estado')
    }
  }

  async cambiarEstado(item: any, estado: string) {
    // estado: 'A' | 'C'
    let data = {...item}
    switch (data.mes) {
      case "ENERO":
        Object.assign(data, { mes: 1 })
        break;
      case "FEBRERO":
        Object.assign(data, { mes: 2 })
        break;
      case "MARZO":
        Object.assign(data, { mes: 3 })
        break;
      case "ABRIL":
        Object.assign(data, { mes: 4 })
        break;
      case "MAYO":
        Object.assign(data, { mes: 5 })
        break;
      case "JUNIO":
        Object.assign(data, { mes: 6 })
        break;
      case "JULIO":
        Object.assign(data, { mes: 7 })
        break;
      case "AGOSTO":
        Object.assign(data, { mes: 8 })
        break;
      case "SEPTIEMBRE":
        Object.assign(data, { mes: 9 })
        break;
      case "OCTUBRE":
        Object.assign(data, { mes: 10 })
        break;
      case "NOVIEMBRE":
        Object.assign(data, { mes: 11 })
        break;
      case "DICIEMBRE":
        Object.assign(data, { mes: 12 })
        break;

      default:
        break;
    }

    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cambiando Estado'
      let response = await this.cierremesService.updateEstadoMes({ anio: data.anio, mes: data.mes, estado });
      console.log(response)

      this.lcargando.ctlSpinner(false)
      Swal.fire('Estado actualizado correctamente.', '', 'success').then(() => this.ObtenerPeriodo())
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cambiando Estado')
    }
  }

  async generarPeriodo() {
    // Validar que haya ingresado un periodo
    if (typeof this.selected_anio !== 'string' || this.selected_anio.trim().length != 4) {
      this.toastr.warning('Ingrese un periodo valido')
      return
    }

    let result = await Swal.fire({
      title: 'Generacion de Periodo',
      text: 'Seguro/a desea generar un nuevo Periodo?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar',
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        await this.cierremesService.generarPeriodo({anio: this.selected_anio})

        this.lcargando.ctlSpinner(false)
        Swal.fire('Periodo Generado', '', 'success')
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }


}




