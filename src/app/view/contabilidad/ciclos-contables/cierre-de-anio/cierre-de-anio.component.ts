import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices'
import { CierreDeAnioService } from './cierre-de-anio.service'
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

const Swal = require('sweetalert2');

import * as moment from 'moment'

@Component({
  selector: 'app-cierre-de-anio',
  templateUrl: './cierre-de-anio.component.html',
  styleUrls: ['./cierre-de-anio.component.scss']
})
export class CierreDeAnioComponent implements OnInit {

  @ViewChild(DataTableDirective)
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  lstNiveles:any = [];
  permisions: any;
  empresLogo: any;
  dataUser: any;
  btnPrint: any;
  dataLength: any;
  groupAccount: any;
  processing:any = false;
  periodos:any = [];
  
  selected_anio: any;

  permiso_ver:any = "0";


  constructor(
    private commonService: CommonService,
    private toastr: ToastrService, 
    private cierremesService: CierreDeAnioService,
  ) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
   }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsConsultCierreAnio", paramAccion: "", boton: { icon: "fa fa-print", texto: "APERTURAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsConsultCierreAnio", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    let data_anio = {

      usuario_apertura:"Luis Frank",
      fecha_apertura : "05/08/2022 14:52:50",
      usuario_cierre: "",
      fecha_cierre: "",
      estate:"A",
      estado: "APERTURADO"
    }

    this.periodos.push(data_anio);

    this.empresLogo = this.dataUser.logoEmpresa;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fAjuste,
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

      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  }


  ObtenerPeriodo(anio: any) {

    this.selected_anio = anio;
  
  }

  CierrePeriodoAnual(){

  }

  async confirmCierrePeriodoAnual() {
    Swal.fire({
      title: "Confirmar",
      text: "Al realizar el cierre de año se generar asiento de cierra, inicilizando los saldos para el nuevo periodo",
      type: 'success',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.CierrePeriodoAnual();
      }
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "APERTURA":
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-excel' ).trigger();
        break;
      case "CERRAR":
        this.confirmCierrePeriodoAnual();    
        break;
    }
  }


}




