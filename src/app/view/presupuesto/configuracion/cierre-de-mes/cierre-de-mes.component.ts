
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices'
import { CierreMesService } from './cierre-mes.service'
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

import * as moment from 'moment'
import Swal, { SweetAlertResult } from 'sweetalert2';
import Botonera from 'src/app/models/IBotonera';



@Component({
  selector: 'app-cierre-de-mes',
  templateUrl: './cierre-de-mes.component.html',
  styleUrls: ['./cierre-de-mes.component.scss'],
})
export class CierreDeMesComponent implements OnInit {

  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: Array<Botonera> = [];
  msgSpinner:string;

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
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR'},
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      // { orig: "btnsConsultCierreMes", paramAccion: "", boton: { icon: "fa fa-print", texto: "APERTURAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      // { orig: "btnsConsultCierreMes", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    this.selected_anio = null;
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
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Periodos'
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

  ObtenerPeriodo() {
    this.periodos = [];

    let data = {
      "anio": this.selected_anio
    }

    this.lcargando.ctlSpinner(true);
    this.msgSpinner = 'Cargando Periodo'

    this.cierremesService.obtenerCierresPeriodoPresupuesto(data).subscribe(res => {
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
              estate: element["estado"]
  
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


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GENERAR":
        // this.generarPeriodo();
        break;
      case "CONSULTAR":
        // this.ObtenerPeriodo();
        break;
      default:
        break;
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

    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cambiando Estado'
      let response = await this.cierremesService.updateEstadoMesPresupuesto({ anio: data.anio, mes: data.mes, estado });
      console.log(response)
      
      this.lcargando.ctlSpinner(false)
      Swal.fire('Estado actualizado correctamente.', '', 'success').then(() => this.cargaInicial())
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cambiando Estado')
    }
  }

  async generarPeriodo() {
    // Obtener el siguiente periodo a ser creado
    this.lcargando.ctlSpinner(true)
    this.msgSpinner = 'Obteniendo ultimo Periodo'
    const nuevoPeriodo = await this.cierremesService.getNuevoPeriodo()
    this.lcargando.ctlSpinner(false)

    const {value: periodo} = await Swal.fire({
      titleText: 'Nuevo Periodo',
      text: 'Ingrese el periodo que desee crear',
      input: 'number',
      inputLabel: 'Periodo',
      inputValue: nuevoPeriodo.data,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar',
      inputValidator: (value) => {
        if (!value) return 'Ingrese un periodo'
        if (parseInt(value) > 2999 || parseInt(value) < 1900) return 'El periodo ingresado no es valido.' 
      }
    })

    if (periodo) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Generando Periodo de Presupuesto'
        const response = await this.cierremesService.generarPeriodoPresupuesto({periodo})
        console.log(response)
        //
        this.lcargando.ctlSpinner(false)
        Swal.fire('Periodo creado correctamente', '', 'success').then(async () => {
          this.lcargando.ctlSpinner(true)
          try {
            this.msgSpinner = 'Cargando Periodos'
            const response = await this.cierremesService.getPeriodos();
            console.log(response)
            this.cmb_periodos = response;
            this.lcargando.ctlSpinner(false)
          } catch(err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error cargando Periodos');
          }
        })
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error creando Periodo')
      }
      


    }
    
    /* let result = await Swal.fire({
      title: 'Generar Periodo de Presupuesto',
      text: 'Esta seguro/a de generar un nuevo Periodo de Presupuesto? Esto debe realizarse una sola vez al iniciar el nuevo año.',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Generando Periodo'
        let periodo = await this.cierremesService.generarPeriodoPresupuesto()
        console.log(periodo)
        
        this.lcargando.ctlSpinner(false)
        Swal.fire(`Periodo ${periodo} generado`, '', 'success').then(() => this.cargaInicial())
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    } */
  }

  async cambiarEstate(item: any, event: any) {
    //
    console.log(item, event.target.checked)
    switch (item.mes) {
      case "ENERO":
        Object.assign(item, { mes: 1 })
        break;
      case "FEBRERO":
        Object.assign(item, { mes: 2 })
        break;
      case "MARZO":
        Object.assign(item, { mes: 3 })
        break;
      case "ABRIL":
        Object.assign(item, { mes: 4 })
        break;
      case "MAYO":
        Object.assign(item, { mes: 5 })
        break;
      case "JUNIO":
        Object.assign(item, { mes: 6 })
        break;
      case "JULIO":
        Object.assign(item, { mes: 7 })
        break;
      case "AGOSTO":
        Object.assign(item, { mes: 8 })
        break;
      case "SEPTIEMBRE":
        Object.assign(item, { mes: 9 })
        break;
      case "OCTUBRE":
        Object.assign(item, { mes: 10 })
        break;
      case "NOVIEMBRE":
        Object.assign(item, { mes: 11 })
        break;
      case "DICIEMBRE":
        Object.assign(item, { mes: 12 })
        break;
    
      default:
        break;
    }

    const estado = (event.target.checked) ? 'A' : 'C'

    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cambiando Estado'
      let response = await this.cierremesService.updateEstadoMesPresupuesto({ anio: item.anio, mes: item.mes, estado });
      console.log(response)
      
      this.lcargando.ctlSpinner(false)
      Swal.fire('Estado actualizado correctamente.', '', 'success').then(() => this.ObtenerPeriodo())
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cambiando Estado')
    }
  }


}




