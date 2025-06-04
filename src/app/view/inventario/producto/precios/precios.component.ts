import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as myVarGlobals from '../../../../global';
import { PreciosService } from './precios.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent implements OnInit {

  @ViewChild("vaSelect") myInputVariable: ElementRef;
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  dataUser: any;
  processing: any = false;
  permisions: any;
  validaDt: any = false;
  infoDt: any = [];
  infoDtAux: any = [];
  dataGrupo: any = [];
  dataTipoPrecios: any = [];
  grupoSelect: any = 0;
  precioSelect: any = 'Consumidor final';
  precioSelectView: any;
  actions: any = { dgrupo: false, disabledAll: false, disabledAllChange: false };
  contador: any = 0;
  globalGroup: any;
  valuePricePorcentaje: any;
  search: any = "";
  checkAll: any = false;
  valueR1 = "porcentaje";
  valueR2 = "valor";
  valueR3 = "costo";
  valueR4 = "pvp";
  valueR5 = "subir";
  valueR6 = "bajar";
  change = false;
  valueRadio: any = "";
  valueRadioCosto: any = "";
  valuFluctuacion: any = "";
  diferencia: any = 0;
  flag: any = false;
  fields: any;
  checkAuth: any = true;
  varAux: any = " Seleccione un grupo";
  fieldsAux:any;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private commonServices: CommonService,
    private precioServices: PreciosService
  ) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fPreciosProductos,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de precios de productos");
        this.flag = true;
        this.lcargando.ctlSpinner(false);
      } else {
        this.getGrupos();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getGrupos() {
    this.precioServices.getGrupos().subscribe(res => {
      this.dataGrupo = res['data'];
      this.getGroupPrices();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getGroupPrices() {
    this.precioServices.getGroupPrices().subscribe(res => {
      this.dataTipoPrecios = res['data'];
      this.getTableInitPrice();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTableInitPrice() {
    this.precioServices.getTableInitPrice()
      .subscribe(res => {
        this.processing = true;
        this.validaDt = true;
        this.infoDt = res['data'];
        localStorage.setItem('dataProductsInit', JSON.stringify(this.infoDt));
        this.lcargando.ctlSpinner(false);
        this.getTreeProduct({ inactive: this.checkAuth,flag: "I"  });
        this.rerender(0);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
      });
  }

  getTreeProduct(data) {
    this.precioServices.getTreeProducts(data).subscribe(res => {
      /* this.treeData = res['data']; */
      this.fields = { dataSource: res['data'], value: 'id', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.fieldsAux = { dataSource: res['data'], value: 'id', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.searchTipePrice();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
}


  rerender(evt): void {
    this.checkAll = false;
    if (evt != 0) {
      this.validaDt = false;
      this.infoDt = [];
      let info = JSON.parse(localStorage.getItem('dataProductsInit'));
      this.validaDt = true;
      setTimeout(() => {
        this.infoDt = info.filter(e => e.fk_grupo == evt);
      }, 300);
    } else {
      this.validaDt = false;
      this.infoDt = [];
      setTimeout(() => {
        this.infoDt = JSON.parse(localStorage.getItem('dataProductsInit'));
        this.validaDt = true;
      }, 300);
    }
  }

  onChange(){
    let infoSelect = this.myInputVariable['currentValue'][0];
    this.rerender(this.dataGrupo.filter(e => e.codigo == infoSelect)[0]['id_grupo']);
  }

  activeSection(pst) {
    this.infoDt[pst]['active'] = !this.infoDt[pst]['active'];
    !(this.infoDt[pst]['active']) ? this.infoDt[pst]['establecido'] = this.valuePricePorcentaje : this.infoDt[pst]['establecido'] = 0;
  }

  activeSectionAll() {
    this.infoDt.forEach(element => {
      element['active'] = !element['active'];
      element['activeCheckbox'] = !element['activeCheckbox'];
      !(element['active']) ? element['establecido'] = this.valuePricePorcentaje : element['establecido'] = 0;
    });
  }

  searchTipePrice() {
    if (this.precioSelect != 0) {
      let price = this.dataTipoPrecios.filter(e => e.name_ref == this.precioSelect)[0];
      this.precioSelectView = price.name;
      (this.precioSelect == 0) ? this.actions.disabledAll = true : this.actions.disabledAll = false;
      this.actions.dgrupo = true;
    }
  }

  changeRadio() {
    this.valueRadio = $('input:radio[name=optradio]:checked').val();
    (this.valueRadio != "" && this.valueRadioCosto != "" && this.valuFluctuacion != "") ? document.getElementById('idInptPrice').focus() : "";
  }

  changeRadioCosto() {
    this.valueRadioCosto = $('input:radio[name=optradio2]:checked').val();
    (this.valueRadio != "" && this.valueRadioCosto != "" && this.valuFluctuacion != "") ? document.getElementById('idInptPrice').focus() : "";
  }

  changeFluctuacion() {
    this.valuFluctuacion = $('input:radio[name=optradio3]:checked').val();
    (this.valueRadio != "" && this.valueRadioCosto != "" && this.valuFluctuacion != "") ? document.getElementById('idInptPrice').focus() : "";
  }

  searchPoduct(evt) {
    this.validaDt = false;
    this.infoDt = [];
    let cont = 0;
    let info = [];
    cont += 1;
    if (cont == 1) { info = JSON.parse(localStorage.getItem('dataProductsInit')); }
    this.infoDt = info.filter(e => e.nombre.toLowerCase().substring(0, evt.length) == evt.toString().toLowerCase());
    this.validaDt = true;
  }

  cancelForm() {
    this.actions.disabledAllChange = false;
    this.actions.disabledAll = false;
    this.actions.dgrupo = false;
    this.change = false;
    this.infoDt = [];
    this.precioSelect = undefined;
    this.grupoSelect = undefined;
    this.valuePricePorcentaje = undefined;
    this.search = "";
    this.infoDt = JSON.parse(localStorage.getItem('dataProductsInit'));
    this.checkAll = false;
    this.valueRadio = "";
    this.valueRadioCosto = ""
    this.valuFluctuacion = "";
    
    $('input:radio[name=optradio]').prop('checked', false);
    $('input:radio[name=optradio2]').prop('checked', false);
    $('input:radio[name=optradio3]').prop('checked', false);

    this.grupoSelect = 0;
    this.precioSelect = 'Consumidor final';
    this.searchTipePrice();
    this.rerender(0);
    this.lcargando.ctlSpinner(true);
    this.fields = undefined;
    this.precioServices.getTreeProducts({ inactive: this.checkAuth,flag: "I"  }).subscribe(res => {
      this.varAux = " Seleccione un grupo"; 
      this.fields = { dataSource: res['data'], value: 'id', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }


  btnCalculator() {
    let cont = 0;
    this.infoDt.forEach(element => {
      if (!element['active']) {
        cont += 1;
      }
    });

    if (cont > 0) {
      
      if (this.precioSelect == 0) {
        this.toastr.info("Seleccione a que valor necesita cambiar el precio");
        document.getElementById('idtipePrice').focus();
      } else if (this.valueRadio == "") {
        this.toastr.info("Seleccione si se va a aumentar un porcentaje o un valor");
      } else if (this.valueRadioCosto == "") {
        this.toastr.info("Seleccione si el calculo es en base a un  costo o a un Pvp");
      } else if (this.valuFluctuacion == "") {
        this.toastr.info("Seleccione si va a subir o bajar el precio");
      } else if (this.valuePricePorcentaje == "") {
        this.toastr.info("Verifique porcentaje o valor ingresado");
        document.getElementById('idInptPrice').focus();
      } else if (this.valuePricePorcentaje == 0) {
        this.toastr.info("Verifique porcentaje o valor ingresado");
        document.getElementById('idInptPrice').focus();
      } else if (this.valuePricePorcentaje == undefined) {
        this.toastr.info("Verifique porcentaje o valor ingresado");
        document.getElementById('idInptPrice').focus();
      } else {
        this.change = true;
        this.actions.disabledAll = true;
        this.actions.disabledAllChange = true;

        if (this.valuFluctuacion == 'subir') {
          if (this.valueRadio == 'porcentaje') {
            if (this.valueRadioCosto == 'costo') {
              this.infoDt.forEach(element => {
                if (!element['active']) {
                  if (this.precioSelect == 'Consumidor final') {
                    element['PVP'] = ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['PVP']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['PVP'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Fijo') {
                    element['precio1'] = ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio1']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio1'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Concurrente') {
                    element['precio2'] = ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio2']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio2'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Minorista') {
                    element['precio3'] = ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio3']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio3'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Medio') {
                    element['precio4'] = ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio4']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio4'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Mayorista') {
                    element['precio5'] = ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio5']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio5'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  }
                }
              });
            } else {
              this.infoDt.forEach(element => {
                if (!element['active']) {
                  if (this.precioSelect == 'Consumidor final') {
                    element['PVP'] = ((parseFloat(element['pvp_anterior_aux']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['pvp_anterior_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['PVP']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['PVP'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Fijo') {
                    element['precio1'] = ((parseFloat(element['p_anterior1_aux']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['p_anterior1_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio1']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio1'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Concurrente') {
                    element['precio2'] = ((parseFloat(element['p_anterior2_aux']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['p_anterior2_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio2']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio2'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Minorista') {
                    element['precio3'] = ((parseFloat(element['p_anterior3_aux']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['p_anterior3_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio3']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio3'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Medio') {
                    element['precio4'] = ((parseFloat(element['p_anterior4_aux']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['p_anterior4_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio4']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio4'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Mayorista') {
                    element['precio5'] = ((parseFloat(element['p_anterior5_aux']) * (parseFloat(element['establecido']) / 100)) + parseFloat(element['p_anterior5_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio5']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio5'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  }
                }
              });
            }
          } else {
            if (this.valueRadioCosto == 'costo') {
              this.infoDt.forEach(element => {
                if (!element['active']) {
                  if (this.precioSelect == 'Consumidor final') {
                    element['PVP'] = (parseFloat(element['establecido']) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['PVP']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['PVP'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Fijo') {
                    element['precio1'] = (parseFloat(element['establecido']) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio1']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio1'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Concurrente') {
                    element['precio2'] = (parseFloat(element['establecido']) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio2']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio2'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Minorista') {
                    element['precio3'] = (parseFloat(element['establecido']) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio3']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio3'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Medio') {
                    element['precio4'] = (parseFloat(element['establecido']) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio4']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio4'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Mayorista') {
                    element['precio5'] = (parseFloat(element['establecido']) + parseFloat(element['costo'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio5']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio5'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  }
                }
              });
            } else {
              this.infoDt.forEach(element => {
                if (!element['active']) {
                  if (this.precioSelect == 'Consumidor final') {
                    element['PVP'] = (parseFloat(element['establecido']) + parseFloat(element['pvp_anterior_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['PVP']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['PVP'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Fijo') {
                    element['precio1'] = (parseFloat(element['establecido']) + parseFloat(element['p_anterior1_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio1']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio1'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Concurrente') {
                    element['precio2'] = (parseFloat(element['establecido']) + parseFloat(element['p_anterior2_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio2']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio2'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Minorista') {
                    element['precio3'] = (parseFloat(element['establecido']) + parseFloat(element['p_anterior3_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio3']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio3'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Medio') {
                    element['precio4'] = (parseFloat(element['establecido']) + parseFloat(element['p_anterior4_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio4']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio4'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Mayorista') {
                    element['precio5'] = (parseFloat(element['establecido']) + parseFloat(element['p_anterior5_aux'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio5']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio5'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  }
                }
              });
            }
          }
        } else {
          if (this.valueRadio == 'porcentaje') {
            if (this.valueRadioCosto == 'costo') {
              this.infoDt.forEach(element => {
                if (!element['active']) {
                  if (this.precioSelect == 'Consumidor final') {
                    element['PVP'] = (parseFloat(element['costo']) - ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['PVP']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['PVP'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Fijo') {
                    element['precio1'] = (parseFloat(element['costo']) - ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio1']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio1'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Concurrente') {
                    element['precio2'] = (parseFloat(element['costo']) - ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio2']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio2'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Minorista') {
                    element['precio3'] = (parseFloat(element['costo']) - ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio3']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio3'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Medio') {
                    element['precio4'] = (parseFloat(element['costo']) - ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio4']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio4'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Mayorista') {
                    element['precio5'] = (parseFloat(element['costo']) - ((parseFloat(element['costo']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio5']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio5'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  }
                }
              });
            } else {
              this.infoDt.forEach(element => {
                if (!element['active']) {
                  if (this.precioSelect == 'Consumidor final') {
                    element['PVP'] = (parseFloat(element['pvp_anterior_aux']) - ((parseFloat(element['pvp_anterior_aux']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['PVP']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['PVP'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Fijo') {
                    element['precio1'] = (parseFloat(element['p_anterior1_aux']) - ((parseFloat(element['p_anterior1_aux']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio1']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio1'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Concurrente') {
                    element['precio2'] = (parseFloat(element['p_anterior2_aux']) - ((parseFloat(element['p_anterior2_aux']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio2']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio2'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Minorista') {
                    element['precio3'] = (parseFloat(element['p_anterior3_aux']) - ((parseFloat(element['p_anterior3_aux']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio3']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio3'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Medio') {
                    element['precio4'] = (parseFloat(element['p_anterior4_aux']) - ((parseFloat(element['p_anterior4_aux']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio4']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio4'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Mayorista') {
                    element['precio5'] = (parseFloat(element['p_anterior5_aux']) - ((parseFloat(element['p_anterior5_aux']) * (parseFloat(element['establecido']) / 100)))).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio5']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio5'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  }
                }
              });
            }
          } else {
            if (this.valueRadioCosto == 'costo') {
              this.infoDt.forEach(element => {
                if (!element['active']) {
                  if (this.precioSelect == 'Consumidor final') {
                    element['PVP'] = (parseFloat(element['costo']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['PVP']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['PVP'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Fijo') {
                    element['precio1'] = (parseFloat(element['costo']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio1']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio1'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Concurrente') {
                    element['precio2'] = (parseFloat(element['costo']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio2']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio2'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Minorista') {
                    element['precio3'] = (parseFloat(element['costo']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio3']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio3'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Medio') {
                    element['precio4'] = (parseFloat(element['costo']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio4']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio4'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Mayorista') {
                    element['precio5'] = (parseFloat(element['costo']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio5']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio5'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  }
                }
              });
            } else {
              this.infoDt.forEach(element => {
                if (!element['active']) {
                  if (this.precioSelect == 'Consumidor final') {
                    element['PVP'] = (parseFloat(element['pvp_anterior_aux']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['PVP']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['PVP'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Fijo') {
                    element['precio1'] = (parseFloat(element['p_anterior1_aux']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio1']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio1'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Concurrente') {
                    element['precio2'] = (parseFloat(element['p_anterior2_aux']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio2']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio2'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Minorista') {
                    element['precio3'] = (parseFloat(element['p_anterior3_aux']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio3']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio3'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Medio') {
                    element['precio4'] = (parseFloat(element['p_anterior4_aux']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio4']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio4'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  } else if (this.precioSelect == 'Mayorista') {
                    element['precio5'] = (parseFloat(element['p_anterior5_aux']) - parseFloat(element['establecido'])).toFixed(4);
                    element['diferencia'] = (parseFloat(element['precio5']) - parseFloat(element['costo'])).toFixed(4);
                    if (this.parsearNumber(element['precio5'], element['costo'])) { Swal.fire({ icon: 'warning', title: 'Atención...', text: 'Uno o mas precios estan por debajo del costo, favor revise los precios antes de ser guardados!' }) }
                  }
                }
              });
            }
          }
        }
      }
    } else {
      this.toastr.info("Debe seleccionar al menos un Items");
    }
  }

  async confirmSave() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para guardar");
    } else {
      Swal.fire({
        title: "Atención!!",
        text: "Seguro desea guardar los cambios de los precios?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.value) {
          this.processing = false;
          this.savePrice();
        }
      })
    }
  }

  savePrice() {
    this.lcargando.ctlSpinner(true);
    let data = {
      infoProduct: this.infoDt,
      ip: this.commonServices.getIpAddress(),
      accion: `Cambio de precios por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fPreciosProductos
    }
    this.precioServices.saveInfoPrice(data).subscribe(res => {
      localStorage.removeItem('dataProductsInit');
      this.processing = true;
      this.toastr.success(res['message']);
      this.cancelForm();
      setTimeout(() => {
        this.getGrupos();
      }, 300);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  replaceSpacing(dt) {
    let rp = dt.replace(/ /g, "_");
    return rp;
  }

  revertPrices() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para revertir precios");
    } else {
      Swal.fire({
        title: "Atención!!",
        text: "Seguro desea revertir los precios?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        this.lcargando.ctlSpinner(true);
        if (result.value) {
          this.processing = false;
          let data = {
            info: this.infoDt,
            ip: this.commonServices.getIpAddress(),
            accion: `Se revirtieron los precios, acción realizada por el usuario ${this.dataUser.nombre}`,
            id_controlador: myVarGlobals.fPreciosProductos
          }
          this.precioServices.revertPrices(data).subscribe(res => {
            this.toastr.success(res['message']);
            this.cancelForm();
            setTimeout(() => {
              this.getGrupos();
            }, 300);
          }, error => {
            this.toastr.info(error.error.message);
          })
        }
      })
    }
  }

  parsearNumber(num1, num2) {
    let numero = (parseFloat(num1) < parseFloat(num2));
    return numero;
  }
}
