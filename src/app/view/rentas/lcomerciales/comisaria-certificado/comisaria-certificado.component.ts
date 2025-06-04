import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from '../../../../config/custom/cc-panel-buttons/button-radio-active.component';
import * as moment from 'moment';
import { ComisariaCertificadoService } from './comisaria-certificado.service';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
standalone: false,
  selector: 'app-comisaria-certificado',
  templateUrl: './comisaria-certificado.component.html',
  styleUrls: ['./comisaria-certificado.component.scss']
})
export class ComisariaCertificadoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = "Certificación de no adeudar";
  mensajeSpinner: string;

  vmButtons: any[] = [];
  dataUser: any;
  arrayData2: any=[];
  permissions: any;
  excelData: any [];
  tipo_doc: any = []
  tipoDocumento: any;
  NoDocumento: any;
  nombreContribuyente: any;
  fechaNacimiento: any;
  id_contribuyente: any;
  mostrarDeuda: boolean = false;
  disabledBuscarContri: boolean = false;

  mostrarBtnVerificar: boolean = true;
  mostrarBtnCertificado: boolean = false;
  adeuda: any;
  paginate: any;
  filter: any;
  validadorRucCedu: boolean;
  validacionBusquedaContri: boolean = false

  NOCedula: number = 0;
  contribuyente: any = {
    tipo_documento: "", // concepto.codigo
  }
  tipo_certificado: any = 0
  tipo_cert= [
    {value: 'MUNI', label: 'No adeudar al municipio'},
    {value: 'PRED', label: 'No adeudar al predio'}
  ]

  constructor(
    private apiService: ComisariaCertificadoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {


    this.vmButtons = [
      {
        orig: "btnsComiCerti",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      // {
      //   orig: "btnsRenConsultaReporte",
      //   paramAccion: "",
      //   boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-success boton btn-sm",
      //   habilitar: false
      // },
    ];

    this.filter = {
      contribuyente: undefined,
      filterControl: ""
    }


    setTimeout(() => {
      this.fillCatalog()
    }, 75)

  }
  periodoSelected(evt: any, year:any){
    console.log(evt.getFullYear())
    this.filter.periodo = evt.getFullYear();
  }
  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      case "EXCEL":
       // this.btnExportar()
        break;
      default:
        break;
    }
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Cargando Catalogs";
    let data = {
      params: "'DOCUMENTO'",
    };
    this.apiService.getCatalogs(data).subscribe(
      (res) => {
         console.log(res);
        this.tipo_doc = res["data"]["DOCUMENTO"];


        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }

  changeMaxlength(event) {
    this.tipoDocumento = event
    if (event == 'Cedula') {
      this.NOCedula = 10;
    } else if (event == 'Ruc') {
      this.NOCedula = 13;
    } else if (event == 'Pasaporte') {
      this.NOCedula = 18
    }
  }

  validacionContribu() {

    if(this.NoDocumento==undefined || this.NoDocumento==""){
      this.toastr.info('Debe ingresar un No Documento');
    }else{
      this.mensajeSpinner = "Buscando contribuyente...";
    this.lcargando.ctlSpinner(true);
    if (!this.NoDocumento) {
      this.filter['num_documento'] = 'x'
    } else {
      this.filter['num_documento'] = this.NoDocumento

    }

      if (this.tipoDocumento == 'Cedula') {
          this.contribuyente['cedula'] = this.NoDocumento
          this.contribuyente['ruc'] = null
          this.contribuyente['num_documento'] = this.NoDocumento
          this.validadorRucCedu = true;
          if (this.NoDocumento.length < 10) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Atención!!",
              text: "Ingrese 10 digitos para la cedula",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {

            });
          } else {
            this.buscarContribuyente()
          }
      } else if (this.tipoDocumento == 'Ruc') {

          this.contribuyente['ruc'] = this.NoDocumento
          this.contribuyente['cedula'] = null
          this.contribuyente['num_documento'] = this.NoDocumento
          this.validadorRucCedu = true;
          if (this.NoDocumento.length < 13) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Atención!!",
              text: "Ingrese 13 digitos para el Ruc",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {

            });
          } else {
            this.buscarContribuyente()
          }


      } else if (this.tipoDocumento == 'Pasaporte') {
        this.contribuyente['ruc'] = null
        this.contribuyente['cedula'] = this.NoDocumento
        this.contribuyente['num_documento'] = this.NoDocumento
        this.validadorRucCedu = true;
        // this.contribuyente['num_documento'] = this.NoDocumento
        if (this.NoDocumento.length < 13) {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            title: "Atención!!",
            text: "Ingrese 18 digitos para el Pasaporte",
            icon: "warning",
            confirmButtonColor: "#d33",
            confirmButtonText: "Ok",
          }).then((result) => {

          });
        } else {
          this.buscarContribuyente()
        }

        //this.NOCedula = 18
      }

    }
  }

  buscarContribuyente() {
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
      this.apiService.getContribuyentesByFilter(data).subscribe(
        (res) => {
          console.log(res["data"]);
          this.lcargando.ctlSpinner(false);
          if (res["data"].length == 0) {
            // this.toastr.info("El contribuyente no se encuentra registrado");
            Swal.fire({
              title: "Atención!!",
              text: "El contribuyente no se encuentra registrado",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {

            });
            this.validacionBusquedaContri = true

          } else {
            this.nombreContribuyente= res['data'][0].razon_social
            this.fechaNacimiento= res['data'][0].fecha_nacimiento
            this.id_contribuyente= res['data'][0].id_cliente

          }
        },
        (error) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
          this.toastr.info('El contribuyente no se encuentra registrado');
        }
      );

  }

  selectedTipoCert(event){
    console.log(event)
    if(event){
    this.adeuda = '';
    this.mostrarDeuda = false;
    this.mostrarBtnVerificar  = true;
    this.mostrarBtnCertificado = false;
    this.disabledBuscarContri= false;
    }
  }
  verificarDeuda(){
    if(this.tipo_certificado=='MUNI'){
      this.verificarDeudaMunicipio();
    }else if(this.tipo_certificado=='PRED'){
      this.verificarDeudaPredio();
    }
  }


  verificarDeudaMunicipio(){
    this.disabledBuscarContri= true;
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Verificando deuda...";
    let data = {
      id_contribuyente: this.id_contribuyente,
    }

    this.apiService.verificarDeudaMunicipio(data).subscribe(
      (res) => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.mostrarDeuda = true
        this.mostrarBtnVerificar  = false;
        this.mostrarBtnCertificado = true;
        if (res["data"].length > 0) {
          this.adeuda = 'SI'
        } else {
          this.adeuda = 'NO'
        }
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info('Error consultando deuda');
      }
    );
  }
  verificarDeudaPredio(){
    this.disabledBuscarContri= true;
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Verificando deuda...";
    let data = {
      id_contribuyente: this.id_contribuyente,
    }

    this.apiService.verificarDeudaPredio(data).subscribe(
      (res) => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.mostrarDeuda = true
        this.mostrarBtnVerificar  = false;
        this.mostrarBtnCertificado = true;
        if (res["data"].length > 0) {
          this.adeuda = 'SI'
        } else {
          this.adeuda = 'NO'
        }
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info('Error consultando deuda');
      }
    );
  }

  generarCertificado(){

    Swal.fire({
      title: "Atención",
      text: "¿Desea generar el certificado?",
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      console.log(result.value)
      if (result.value) {
        if(this.tipo_certificado=='MUNI'){
          if(this.adeuda == 'SI'){
            console.log('imprimir adeuda MUNICIPIO')
            window.open(environment.ReportingUrl + "rep_rentas_comisaria_certificado_deuda.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_contribuyente=" + this.id_contribuyente, '_blank')
          }
          if(this.adeuda == 'NO'){
            console.log('imprimir no adeuda MUNICIPIO')
            window.open(environment.ReportingUrl + "rep_rentas_comisaria_certificado_sin_deuda.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_contribuyente=" + this.id_contribuyente, '_blank')
          }
        }else if(this.tipo_certificado=='PRED'){
          if(this.adeuda == 'SI'){
            console.log('imprimir adeuda PREDIO')
            window.open(environment.ReportingUrl + "rep_rentas_comisaria_certificado_deuda_predio.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_contribuyente=" + this.id_contribuyente, '_blank')
          }
          if(this.adeuda == 'NO'){
            console.log('imprimir no adeuda PREDIO')
            window.open(environment.ReportingUrl + "rep_rentas_comisaria_certificado_sin_deuda_predio.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_contribuyente=" + this.id_contribuyente, '_blank')
          }
        }


      }
    });

  }

  // btnExportar() {

  //   if (
  //     this.selectedReporte == 0 || this.selectedReporte == undefined  ||  this.selectedReporte == ' '
  //   ) {
  //     this.toastr.info('Debe elegir un Reporte');
  //     return;
  //   }
  //   if (
  //     this.selectedReporte == 0 || this.selectedReporte == undefined  ||  this.selectedReporte == ' '
  //   ) {
  //     this.toastr.info('Debe ingresar un Perìodo');
  //     return;
  //   }
  //   console.log(this.selectedReporte);
  //   //console.log(this.fecha_desde);
  //   //console.log(this.fecha_hasta);
  //   this.apiService.getTiposReporteNomina().subscribe(
  //     (res: any) => {
  //        console.log(res.data);
  //        var variable: "";
  //       res.forEach((element: any) => {
  //         let o = {
  //           created_at: element.created_at,
  //           descripcion: element.descripcion,
  //           reporte: element.reporte
  //         };
  //         //this.reportes.push({ ...o });
  //         if (element.descripcion == this.selectedReporte){
  //           window.open(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting
  //           + "&j_password=" + environment.PasswordReporting+"&p_anio=" + this.filter.periodo.getFullYear()+"&p_mes=" + this.mes_actual, '_blank')

  //           console.log(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting
  //           + "&j_password=" + environment.PasswordReporting+"&p_anio=" + this.filter.periodo.getFullYear()+"&p_mes=" + this.mes_actual);

  //         }
  //       });

  //     },
  //     (err: any) => {
  //       console.log(err);
  //       this.lcargando.ctlSpinner(false);
  //     }
  //   )

  // }

  limpiarFiltros() {
    this.tipoDocumento= '';
    this.NoDocumento= '';
    this.nombreContribuyente= '';
    this.fechaNacimiento= '';
    this.contribuyente.tipo_documento = '';
    this.adeuda = '';
    this.mostrarDeuda = false;
    this.mostrarBtnVerificar  = true;
    this.mostrarBtnCertificado = false;
    this.disabledBuscarContri= false;


}

}
