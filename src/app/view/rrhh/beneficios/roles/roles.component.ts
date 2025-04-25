import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { BenefRolesService } from './benef-roles.service';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

import { RolesIndividuales } from './roles';
import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";

import { DepartemtAditionalI } from "src/app/models/responseDepartemtAditional.interface";

import * as moment from 'moment'
import { GeneralResponseI } from 'src/app/models/responseGeneral.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permiso_ver:any = "0";
  empresLogo: any;
  permisions: any;
  rolesempleado: RolesIndividuales[];
  ngDepartamentSelect:any;

  selectRolesInv:RolesIndividuales[];
  dataDepartamentoResponseI: any

  selected_anio: any;
  mes_actual: any = 0;
  LoadOpcionDepartamento: any = false;
  
  vmButtons:any = [];
  tipoPago: any

  tipoPagoSueldo = [
    {value: "Q",label: "Quincena"},
    {value: "M",label: "Fin de mes"},
  ]

  constructor(    
    private commonService: CommonService,
    private toastr: ToastrService, 
    private benefrolesService: BenefRolesService,) { 
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    // this.isRowSelectable = this.isRowSelectable.bind(this);
  }

  ngOnInit(): void {

    this.selected_anio = moment(new Date()).format('YYYY');
    this.mes_actual = Number(moment(new Date()).format('MM'));
    this.ngDepartamentSelect = 0;

    this.vmButtons = [
			
			{ orig: "btnsConsultRoles", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsConsultRoles", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "ENVIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar boton btn-sm", habilitar: true}
		  ];

      this.empresLogo = this.dataUser.logoEmpresa;
      let id_rol = this.dataUser.id_rol;

      let data = {
        id: 2,
        codigo: myVarGlobals.fRoles,
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
          /*
          if (this.permisions[0].imprimir == "0") {
            this.btnPrint = false;
            this.vmButtons[2].habilitar = true;
          } else {
            this.btnPrint = true
            this.vmButtons[2].habilitar = false;
          }
          */
  
          /* this.getParametersFilter(); */
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
  }

/*   getParametersFilter() {
    this.asientoautomaticoService.getParametersFilter({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.dataLength = res['data'];
      if(this.dataLength[0]){
        for (let index = 0; index < this.dataLength[0].niveles; index++) {
          this.lstNiveles.push(index+1);          
        }
      }

      this.getGrupoAccount();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  } */

  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		    case "CONSULTAR":
          this.ConsultarRoldesIndivMes();
        break;
        case "ENVIAR":
          this.EnviarRoles();       
        break;
		}  	 
	}

  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }


  // onRowSelect(event) {

  //   /*Activamos boton de anulacion */
  //   let LentSelect = this.selectRolesInv.length;
  //   if (LentSelect > 0) {
  //     this.vmButtons[1].habilitar = false;
  //   }
  // }

  // onRowUnselect(event) {
  //   /*Inactivamos boton de anulacion */
  //   let LentSelect = this.selectRolesInv.length;
  //   if (LentSelect === 0) {
  //     this.vmButtons[1].habilitar = true;
  //   }
  // }

  // isRowSelectable(event) {
  //   return !this.isOutOfStock(event.data);
  // }

  isOutOfStock(data) {
    return data.id_empleado === 0;
  }



  ImpresionRolPDF(rol:any){

    let mes = this.mes_actual;
    let year;

    if(typeof this.selected_anio !== "string"){
      year = this.selected_anio.getFullYear();
    }else{
      year = this.selected_anio;
    }
    // console.log(environment.ReportingUrl + "rpt_rol_individual.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&usuario=1&anio="+year+"&mes="+mes+"&id_persona=" + rol.id_empleado);
    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_rol_individual.html?id_persona=3&id_empresa=1&mes=2&usuario=0930313655&anio=2023
    window.open(environment.ReportingUrl + "rpt_rol_individual.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&usuario=1&anio="+year+"&mes="+mes+"&id_persona=" + rol.id_empleado+"&tipo_nomina=" + this.tipoPago, '_blank')
    console.log(environment.ReportingUrl + "rpt_rol_individual.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&usuario=1&anio="+year+"&mes="+mes+"&id_persona=" + rol.id_empleado+"&tipo_nomina=" + this.tipoPago)
  }


  ImpresionRolPDFPreview(rol:any){

    let mes = this.mes_actual;
    let year;

    if(typeof this.selected_anio !== "string"){
      year = this.selected_anio.getFullYear();
    }else{
      year = this.selected_anio;
    }

    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_rol_individual.html?id_persona=3&id_empresa=1&mes=2&usuario=0930313655&anio=2023
    window.open(environment.ReportingUrl + "rpt_rol_individual.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&usuario=1&anio="+year+"&mes="+mes+"&id_persona=" + rol.id_empleado + "&tipo_nomina=" + this.tipoPago, '_blank')

  }


  EnviarRoles(){
    let LentSelect = this.selectRolesInv.length;
    if (LentSelect > 0) {
      Swal.fire({
        title: "Atención",
        text: "Desea enviar por correo electronico los roles de pago. \n ¿Desea continuar?",
        //type: "warning",
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {

        // this.mensajeSppiner = "Enviando correos...";
        // this.lcargando.ctlSpinner(true);

        if (result.value) {
          let mes = this.mes_actual;
          let year;
      
          if(typeof this.selected_anio !== "string"){
            year = this.selected_anio.getFullYear();
          }else{
            year = this.selected_anio;
          }
          let id_empresa =this.dataUser.id_empresa;
          
          const  $url_reporting_serve = environment.ReportingUrl + "rpt_rol_individual.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa="+id_empresa+"&usuario=1&anio="+year+"&mes="+mes+"&tipo_nomina="+this.tipoPago+"&id_persona=@ptrIdPersona";
          this.sendEmailRolesPagos(this.selectRolesInv, $url_reporting_serve);
          // this.selectRolesInv.forEach(element => {
          //   console.log(element);
          // });

          // this.lcargando.ctlSpinner(false);
          // this.toastr.warning("Problemas para comunicarnos con el servidor de envio");

        }

      });
    } else {
      this.toastr.info("Debe seleccionar el comprobante de diario que desea anular.");
    }
  }


  ConsultarRoldesIndivMes(){

    if(this.tipoPago == undefined || this.tipoPago == ''){
      this.toastr.info("Debe seleccionar un Tipo de pago")
    }else{
      this.lcargando.ctlSpinner(true);

      let mes = this.mes_actual;
      let year;
  
      if(typeof this.selected_anio !== "string"){
        year = this.selected_anio.getFullYear();
      }else{
        year = this.selected_anio;
      }
  
  
      this.benefrolesService.getRolesIndividuales(1,year,mes, this.ngDepartamentSelect,this.tipoPago).subscribe(res => {
  
        console.log(res);
        this.lcargando.ctlSpinner(false);
        this.rolesempleado =  <RolesIndividuales[]>res;      
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }

  }


  openComboDepartamentos() {


    this.LoadOpcionDepartamento = true;
    let parameterUrl: any = {
      page: 1,
      size: 100,
      sort: "id_departamento",
      type_sort: "asc",
      search: "",
    };

    this.benefrolesService.getDepartamentosPaginate(parameterUrl).subscribe({
      next: (rpt: DepartemtAditionalI) => {


        let DataDepart = rpt.data;


        DataDepart.unshift({
          id_departamento: 0,
          dep_nombre: '-todos-',
          dep_descripcion: '',
          dep_keyword: '',
          id_area: 0,
          estado_id: 0,
          catalogo: null,
          area: null
        });

        this.LoadOpcionDepartamento = false;
        this.dataDepartamentoResponseI = DataDepart;
      },
      error: (e) => {
        this.LoadOpcionDepartamento = false;
        this.toastr.error(e.error.detail);
      },
    });

  }

  selectedRows:any[];
  selectRow(checkValue) {

    if( checkValue.target!= undefined){
      console.log(checkValue.target.ariaChecked);
      this.vmButtons[1].habilitar = false;
    }
    if( checkValue.target == undefined){
      if(checkValue.checked==true) this.vmButtons[1].habilitar = false;
      else if(checkValue.checked==false)this.vmButtons[1].habilitar = true;
    }
  }


  
  mensajeSppiner: string = "Cargando...";
  /* async */ sendEmailRolesPagos($dataEmp, $url_reporting_serve) {

    let mes = this.mes_actual;
    let year;

    if(typeof this.selected_anio !== "string"){
      year = this.selected_anio.getFullYear();
    }else{
      year = this.selected_anio;
    }

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "enviar correo  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,
      id_empresa          : this.dataUser.id_empresa,
      data_empleados : $dataEmp,
      url_reporting_serve : $url_reporting_serve,
      mes: mes,
      anio : year,
    }
    this.mensajeSppiner = "Enviando correos...";
    this.lcargando.ctlSpinner(true);
    this.benefrolesService.sendEmailRolesPagos(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Correos de roles empleados enviados correctamente."
        );

        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);

        /* let errorApi =  Object.values(error?.error?.detail);
        for(let i=0; i< errorApi.length; i++){
          let msj = errorApi[i].toString();
          this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: this.capitalizarPrimeraLetra(msj)});
        } */
      }
    );
  }
}
