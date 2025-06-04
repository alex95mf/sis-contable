import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MinMaxServices } from './minmax.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as myVarGlobals from '../../../../global';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-minmax',
  templateUrl: './minmax.component.html',
  styleUrls: ['./minmax.component.scss']
})
export class MinmaxComponent implements OnInit {
  @ViewChild("vaSelect") myInputVariable: ElementRef;
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  dataMarcaProducto: any;
  vmButtons: any = [];
  dataGrupo: any = [];
  fields: any;
  varAux: any = " Seleccione un grupo";
  checkAuth: any = true;
  dataUser: any;
  permisions: any;
  treeData: any = [];
  search: any = "";
  checkAll: any = false;
  valueR1 = "porcentaje";
  valueR2 = "valor";
  valueR3 = "costo";
  valueR4 = "pvp";
  valueR5 = "maximo";
  valueR6 = "minimo";
  change = false;
  valueRadio: any = "";
  valueRadioCosto: any = "";
  valuFluctuacion: any = "";
  valuePricePorcentaje: any;
  actions: any = { dgrupo: false, disabledAll: false, disabledAllChange: false };
  contador: any = 0;
  globalGroup: any;
  validaDt: any = false;
  infoDt: any = [];
  arrayMarcas: any = [];
  marcaSelect: any = 0;
  disableDropw: any = false;

  constructor(
    private minmaxServices: MinMaxServices,
    private toastr: ToastrService,
    private router: Router,
    private commonServices: CommonService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-calculator", texto: "CALCULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.getPermisions();
  }


  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fminmax,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de precios mínimo y máximo");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getTreeProduct({ inactive: this.checkAuth, flag: "I" });
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTreeProduct(data) {
    this.minmaxServices.getTreeProducts(data).subscribe(res => {
      this.treeData = res['data'];
      this.fields = { dataSource: res['data'], value: 'id_grupo', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.getProductosMinMax();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }

  getProductosMinMax() {
    this.minmaxServices.getProductosMinMax().subscribe(res => {
      this.infoDt = res['data'];
      this.infoDt.forEach(element => {
        element['utilidad'] = parseFloat('0').toFixed(2);
        element['pminAux'] = element['pmin'];
        element['pmaxAux'] = element['pmax'];
        element['active'] = false;
        element['activeCheckbox'] = false;
      });
      localStorage.setItem('marcas', JSON.stringify(this.infoDt));
      this.validaDt = true;
      this.getGrupos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }

  getGrupos() {
    this.minmaxServices.getGrupos().subscribe(res => {
      this.dataGrupo = res['data'];
      this.getMarcas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getMarcas() {
    let repeatMarca = [];
    let marcas = JSON.parse(localStorage.getItem('marcas'));
    marcas.forEach(element => {
      if (this.arrayMarcas.length > 0) {
        repeatMarca = [];
        repeatMarca = this.arrayMarcas.filter(e => e == element['marca']);
        if (repeatMarca.length == 0) {
          this.arrayMarcas.push(element['marca']);
        }
      } else {
        this.arrayMarcas.push(element['marca']);
      }
    });
    this.lcargando.ctlSpinner(false);
  }

  onChange() {
    this.marcaSelect = 0;
    let infoSelect = this.myInputVariable['currentValue'][0];
    let productos = JSON.parse(localStorage.getItem('marcas'));
    productos = productos.filter(e => e.fk_grupo == infoSelect);
    this.infoDt = productos;
  }

  filterMarca(evt) {
    if (evt != 0) {
      if (this.myInputVariable['currentValue'] != null) {
        let marcas = JSON.parse(localStorage.getItem('marcas'));
        this.infoDt = marcas.filter(e => e.marca == evt && e.fk_grupo == this.myInputVariable['currentValue'][0]);
      } else {
        this.infoDt = JSON.parse(localStorage.getItem('marcas'));
        this.infoDt = this.infoDt.filter(e => e.marca == evt);
      }
    } else {
      this.infoDt = JSON.parse(localStorage.getItem('marcas'));
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
    if (cont == 1) { info = JSON.parse(localStorage.getItem('marcas')); }
    this.infoDt = info.filter(e => e.nombre.toLowerCase().substring(0, evt.length) == evt.toString().toLowerCase());
    this.validaDt = true;
  }

  activeSectionAll() {
    this.infoDt.forEach(element => {
      element['active'] = !element['active'];
      element['activeCheckbox'] = !element['activeCheckbox'];
    });
  }

  activeSection(pst) {
    this.infoDt[pst]['active'] = !this.infoDt[pst]['active'];
  }

  cancelForm() {
    this.actions.disabledAllChange = false;
    this.actions.disabledAll = false;
    this.actions.dgrupo = false;
    this.change = false;
    this.infoDt = [];

    this.valuePricePorcentaje = undefined;
    this.search = "";
    this.infoDt = JSON.parse(localStorage.getItem('marcas'));
    this.checkAll = false;
    this.valueRadio = "";
    this.valueRadioCosto = ""
    this.valuFluctuacion = "";
    this.disableDropw = false;

    $('input:radio[name=optradio]').prop('checked', false);
    $('input:radio[name=optradio2]').prop('checked', false);
    $('input:radio[name=optradio3]').prop('checked', false);

    this.lcargando.ctlSpinner(true);
    this.fields = undefined;
    this.minmaxServices.getTreeProducts({ inactive: this.checkAuth, flag: "I" }).subscribe(res => {
      this.varAux = " Seleccione un grupo";
      this.fields = { dataSource: res['data'], value: 'id_grupo', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSave();
        break;
      case "CALCULAR":
        this.calculate();
        break;
      case "CANCELAR":
        this.cancelForm();
        break;
    }
  }

  calculate() {
    let cont = 0;
    this.infoDt.forEach(element => {
      if (element['active']) {
        cont += 1;
      }
    });
    if (cont > 0) {
      if (this.valueRadio == "") {
        this.toastr.info("Seleccione si se va a aumentar un porcentaje o un valor"); return;
      } else if (this.valueRadioCosto == "") {
        this.toastr.info("Seleccione si el calculo es en base a un  costo o a un Pvp"); return;
      } else if (this.valuFluctuacion == "") {
        this.toastr.info("Seleccione si es precio mínimo o máximo"); return;
      } else if (this.valuePricePorcentaje == "") {
        this.toastr.info("Verifique porcentaje o valor ingresado");
        document.getElementById('idInptPrice').focus(); return;
      } else if (this.valuePricePorcentaje == 0) {
        this.toastr.info("Verifique porcentaje o valor ingresado");
        document.getElementById('idInptPrice').focus(); return;
      } else if (this.valuePricePorcentaje == undefined) {
        this.toastr.info("Verifique porcentaje o valor ingresado");
        document.getElementById('idInptPrice').focus(); return;
      } else {
        this.change = true;
        this.actions.disabledAll = true;
        this.disableDropw = true;
        this.actions.disabledAllChange = true;

        if (this.valuFluctuacion == 'maximo') {
          if (this.valueRadio == 'porcentaje') {
            if (this.valueRadioCosto == 'costo') {
              this.infoDt.forEach(element => {
                if (element['active']) {
                  element['pmaxAux'] = ((parseFloat(element['costo']) * (parseFloat(this.valuePricePorcentaje) / 100)) + parseFloat(element['costo'])).toFixed(4);
                  element['utilidad'] = (parseFloat(element['pmaxAux']) - parseFloat(element['costo'])).toFixed(4);
                }
              });
            } else {
              this.infoDt.forEach(element => {
                if (element['active']) {
                  element['pmaxAux'] = ((parseFloat(element['PVP']) * (parseFloat(this.valuePricePorcentaje) / 100)) + parseFloat(element['PVP'])).toFixed(4);
                  element['utilidad'] = (parseFloat(element['pmaxAux']) - parseFloat(element['PVP'])).toFixed(4);
                }
              });
            }
          } else {
            if (this.valueRadioCosto == 'costo') {
              this.infoDt.forEach(element => {
                if (element['active']) {
                  element['pmaxAux'] = (parseFloat(this.valuePricePorcentaje) + parseFloat(element['costo'])).toFixed(4);
                  element['utilidad'] = (parseFloat(element['pmaxAux']) - parseFloat(element['costo'])).toFixed(4);
                }
              });
            } else {
              this.infoDt.forEach(element => {
                if (element['active']) {
                  element['pmaxAux'] = (parseFloat(this.valuePricePorcentaje) + parseFloat(element['PVP'])).toFixed(4);
                  element['utilidad'] = (parseFloat(element['pmaxAux']) - parseFloat(element['PVP'])).toFixed(4);
                }
              });
            }
          }
        } else {
          if (this.valueRadio == 'porcentaje') {
            if (this.valueRadioCosto == 'costo') {
              this.infoDt.forEach(element => {
                if (element['active']) {
                  element['pminAux'] = ((parseFloat(element['costo']) * (parseFloat(this.valuePricePorcentaje) / 100)) + parseFloat(element['costo'])).toFixed(4);
                  element['utilidad'] = (parseFloat(element['pminAux']) - parseFloat(element['costo'])).toFixed(4);
                }
              });
            } else {
              this.infoDt.forEach(element => {
                if (element['active']) {
                  element['pminAux'] = ((parseFloat(element['PVP']) * (parseFloat(this.valuePricePorcentaje) / 100)) + parseFloat(element['PVP'])).toFixed(4);
                  element['utilidad'] = (parseFloat(element['pminAux']) - parseFloat(element['PVP'])).toFixed(4);
                }
              });
            }
          } else {
            if (this.valueRadioCosto == 'costo') {
              this.infoDt.forEach(element => {
                if (element['active']) {
                  element['pminAux'] = (parseFloat(this.valuePricePorcentaje) + parseFloat(element['costo'])).toFixed(4);
                  element['utilidad'] = (parseFloat(element['pminAux']) - parseFloat(element['costo'])).toFixed(4);
                }
              });
            } else {
              this.infoDt.forEach(element => {
                if (element['active']) {
                  element['pminAux'] = (parseFloat(this.valuePricePorcentaje) + parseFloat(element['PVP'])).toFixed(4);
                  element['utilidad'] = (parseFloat(element['pminAux']) - parseFloat(element['PVP'])).toFixed(4);
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

  changePriceEdit(i) {
    if (this.valuFluctuacion == 'maximo') {
      if (this.valueRadioCosto == 'costo') {
        this.infoDt[i]['utilidad'] = (parseFloat(this.infoDt[i]['pmaxAux']) - parseFloat(this.infoDt[i]['costo'])).toFixed(4);
      } else {
        this.infoDt[i]['utilidad'] = (parseFloat(this.infoDt[i]['pmaxAux']) - parseFloat(this.infoDt[i]['PVP'])).toFixed(4);
      }
    } else {
      if (this.valueRadioCosto == 'costo') {
        this.infoDt[i]['utilidad'] = (parseFloat(this.infoDt[i]['pminAux']) - parseFloat(this.infoDt[i]['costo'])).toFixed(4);
      } else {
        this.infoDt[i]['utilidad'] = (parseFloat(this.infoDt[i]['pminAux']) - parseFloat(this.infoDt[i]['PVP'])).toFixed(4);
      }
    }
  }

  validateSave() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para guardar");
    } else {
      let cont = 0;
      this.infoDt.forEach(element => { if (element['active']) { cont += 1; } });
      if (cont > 0 && this.disableDropw) {
        this.confirmSave();
      } else {
        this.toastr.info("Debe seleccionar al menos un Items o hacer primero el calculo");
      }
    }
  }

  async confirmSave() {
    Swal.fire({
      title: "Atención!!",
      text: "Seguro desea guardar los cambios de los precios mínimo y máximo?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        this.savePrice();
      }
    })
  }

  savePrice() {
    this.lcargando.ctlSpinner(true);
    let data = {
      infoProduct: this.infoDt,
      ip: this.commonServices.getIpAddress(),
      accion: `Cambio de precio ${this.valuFluctuacion} por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fminmax
    }
    this.minmaxServices.saveInfoPriceMinMax(data).subscribe(res => {
      localStorage.removeItem('marcas');
      this.toastr.success(res['message']);
      this.cancelForm();
      setTimeout(() => {
        this.getProductosMinMax();
      }, 300);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

}
