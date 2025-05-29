import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositoService } from './deposito.service'
import * as moment from "moment";

@Component({
standalone: false,
  selector: 'app-deposito',
  templateUrl: './deposito.component.html',
  styleUrls: ['./deposito.component.scss']
})
export class DepositoComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  vmButtons: any;
  dataUser: any;
  permisions: any;
  validaDt: any = false;
  changeAll: any = false;
  bankSelect: any = 0;
  registroSelect: any = 0;
  cajaSelect: any = 0;
  arrayCajas: any;
  arrayRegistros: any = [];
  nameSucursal: any = "Nombre Sucursal";
  viewDate: any = new Date();
  arraySumDet: any = [];
  arrayTipeDoc: any;
  arrayBank: any = [];
  arrayDeposito: any = [];
  objTotales: any = { cierre: 0, faltante: 0, deposito: 0, diferencia: 0, total_venta: 0, venta_mas_apertura: 0 };
  numPapeleta: any;
  arrayIndex: any = [];
  flagArrayBank: any = false;
  diferentAux: any = parseFloat('0');
  observacion: any;

  constructor(private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService,
    private depSrv: DepositoService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.viewDate = moment(this.viewDate).format("YYYY-MM-DD")
    this.vmButtons = [
      { orig: "btnDepositoBank", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR DEPÓSITO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnDepositoBank", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.getPermisions();
    }, 10);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fDepositoBanco,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de depósito banco");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getCajas();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCajas() {
    this.depSrv.getCaja().subscribe((res) => {
      this.arrayCajas = res["data"];
      this.getTipeDoc();
    }, error => {
      this.lcargando.ctlSpinner(false);
    });
  }

  getTipeDoc() {
    this.depSrv.getTipeDoc().subscribe(res => {
      this.arrayTipeDoc = res['data'];
      this.getAccountBank();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getAccountBank() {
    let data = { company_id: this.dataUser.id_empresa };
    this.depSrv.getAccountsByDetails(data).subscribe(res => {
      this.arrayBank = res['data']
      this.getTableInit();
    }, error => {
      this.lcargando.ctlSpinner(false);
    })
  }

  getTableInit() {
    this.validaDt = true;
    this.arraySumDet = [];
    this.lcargando.ctlSpinner(false);
  }

  getRegisters(e) {
    this.arraySumDet = [];
    this.arrayDeposito = [];
    this.objTotales.cierre = parseFloat('0.00');
    this.objTotales.faltante = parseFloat('0.00');
    this.objTotales.deposito = parseFloat('0.00');
    this.objTotales.diferencia = parseFloat('0.00');
    if (e != 0) {
      this.lcargando.ctlSpinner(true);
      this.depSrv.getRegister({ box: e }).subscribe(res => {
        this.arrayRegistros = res['data'];
        this.registroSelect = 0;
        (this.arrayRegistros.length > 0) ? this.nameSucursal = this.arrayRegistros[0]['punto_emision'] + "-" + this.arrayRegistros[0]['name_sucursal'] : this.nameSucursal = "Nombre Sucursal";
        this.lcargando.ctlSpinner(false);
      }, error => {
        this.lcargando.ctlSpinner(false);
      })
    } else {
      this.objTotales.cierre = parseFloat('0.00');
      this.objTotales.faltante = parseFloat('0.00');
      this.objTotales.deposito = parseFloat('0.00');
      this.objTotales.diferencia = parseFloat('0.00');
      this.arrayRegistros = [];
      this.registroSelect = 0;
      this.nameSucursal = "Nombre Sucursal";
      this.validaDt = false;
      this.arraySumDet = [];
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getTableInit();
      });
    }
  }

  rerender(e): void {
    this.lcargando.ctlSpinner(true);
    this.validaDt = false;
    this.arraySumDet = [];
    this.getInformationComprobantes(e);
  }

  getInformationComprobantes(e) {
    if (e != 0) {
      this.depSrv.getInformationComprobantes({ id_box: e, pte_emision: this.cajaSelect }).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.validaDt = true;
        this.arraySumDet = res['data'];
        let sumCobrated = parseFloat('0.00');
        let sumNotCobrated = parseFloat('0.00');
        this.arraySumDet.forEach(element => {
          element['validate_sum'] = false;
          if (element['isCobrated'] == 1) {
            sumCobrated = parseFloat(sumCobrated.toString()) + parseFloat(element['valor']);
          } else {
            sumNotCobrated = parseFloat(sumNotCobrated.toString()) + parseFloat(element['valor']);
          }
        });

        localStorage.setItem('deposito', JSON.stringify(this.arraySumDet));
        let total = this.arrayRegistros.filter(ev => ev.id == e)[0];
        this.objTotales.cierre = total.total_venta - sumCobrated;
        this.objTotales.cierre = parseFloat(this.objTotales.cierre).toFixed(2);
        this.objTotales.faltante = total.valor_inconsistencia;
        this.objTotales.deposito = parseFloat('0.00');
        this.objTotales.diferencia = parseFloat(sumNotCobrated.toString()).toFixed(2);
        this.objTotales.diferencia = this.objTotales.diferencia * (-1);
        (this.objTotales.diferencia < 0) ? this.objTotales.diferencia = parseFloat(this.objTotales.diferencia.toString()).toFixed(2) : this.objTotales.diferencia = parseFloat('0.00').toFixed(2);
        this.diferentAux = this.objTotales.diferencia;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.validaDt = true;
        this.arraySumDet = [];
      })
    } else {
      this.objTotales.cierre = parseFloat('0.00');
      this.objTotales.faltante = parseFloat('0.00');
      this.objTotales.deposito = parseFloat('0.00');
      this.objTotales.diferencia = parseFloat('0.00');
      this.validaDt = true;
      this.arraySumDet = [];
    }
  }

  getTipeDocTable(evt) {
    return this.arrayTipeDoc.filter(e => e.id == evt)[0]['codigo'];
  }

  addRegister() {
    let banco;
    let arrayAux;
    this.flagArrayBank = false;

    this.arraySumDet.forEach(element => {
      if (element['validate_sum']) {
        this.flagArrayBank = true;
      }
    });
    if (!this.flagArrayBank) {
      Swal.fire({
        title: 'Atención!!',
        text: "Debe seleccionar al menos un items de la lista",
        icon: 'warning',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    } else if (this.bankSelect == 0 || this.numPapeleta == "" || this.numPapeleta == undefined) {
      Swal.fire({
        title: 'Atención!!',
        text: "Tiene que seleccionar un banco e ingresar el número de papeleta de depósito",
        icon: 'warning',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    } else {
      this.arrayIndex = [];
      banco = this.arrayBank.filter(e => e.id_banks == this.bankSelect)[0];
      for (let i = 0; i < this.arraySumDet.length; i++) {
        if (this.arraySumDet[i]['validate_sum']) {
          this.arraySumDet[i]['id_banks'] = banco.id_banks;
          this.arraySumDet[i]['name_banks'] = banco.name_banks;
          this.arraySumDet[i]['num_cuenta'] = banco.num_cuenta;
          this.arraySumDet[i]['saldo_cuenta'] = banco.saldo_cuenta;
          this.arraySumDet[i]['tipo_cuenta'] = banco.tipo_cuenta;
          this.arraySumDet[i]['cuenta_contable'] = banco.cuenta_contable;
          this.arraySumDet[i]['num_trx'] = this.numPapeleta;
          this.arrayDeposito.push(this.arraySumDet[i]);
          this.arrayIndex.push(this.arraySumDet[i]['id']);
        }
      }

      for (let j = 0; j < this.arrayIndex.length; j++) {
        if (j == 0)
          arrayAux = this.arraySumDet.filter(e => e.id != this.arrayIndex[j]);
        else
          arrayAux = arrayAux.filter(e => e.id != this.arrayIndex[j]);
      }
      this.arraySumDet = arrayAux;

      /*Hacemos la suma de lo depositado*/
      this.objTotales['deposito'] = parseFloat('0');
      this.objTotales['diferencia'] = parseFloat('0');
      let valAux = parseFloat('0');
      this.arrayDeposito.forEach(element => {
        this.objTotales['deposito'] = parseFloat(this.objTotales['deposito']) + parseFloat(element['valor']);
        valAux = parseFloat(valAux.toString()) + parseFloat(element.valor);
        this.objTotales['diferencia'] = parseFloat(this.objTotales.cierre) - parseFloat(valAux.toString());
      });

      this.objTotales['deposito'] = parseFloat(this.objTotales['deposito']).toFixed(2);
      this.objTotales.diferencia = this.objTotales.diferencia * (-1);
      (this.objTotales.diferencia < 0) ? this.objTotales.diferencia = parseFloat(this.objTotales.diferencia.toString()).toFixed(2) : this.objTotales.diferencia = parseFloat('0.00').toFixed(2);
      this.bankSelect = 0;
      this.numPapeleta = "";
    }
  }

  deleteDeposito(id, index) {
    let deposito = JSON.parse(localStorage.getItem('deposito'));
    this.arraySumDet.push(deposito.filter(e => e.id == id)[0]);
    this.arrayDeposito.splice(index, 1);

    if (this.arrayDeposito.length > 0) {
      this.objTotales['deposito'] = parseFloat('0');
      this.objTotales['diferencia'] = parseFloat('0');
      let valAux = parseFloat('0');
      this.arrayDeposito.forEach(element => {
        this.objTotales['deposito'] = parseFloat(this.objTotales['deposito']) + parseFloat(element['valor']);
        valAux = parseFloat(valAux.toString()) + parseFloat(element.valor);
        this.objTotales['diferencia'] = parseFloat(this.objTotales.cierre) - parseFloat(valAux.toString());
      });

      this.objTotales['deposito'] = parseFloat(this.objTotales['deposito']).toFixed(2);
      this.objTotales.diferencia = this.objTotales.diferencia * (-1);
      (this.objTotales.diferencia < 0) ? this.objTotales.diferencia = parseFloat(this.objTotales.diferencia.toString()).toFixed(2) : this.objTotales.diferencia = parseFloat('0.00').toFixed(2);
    } else {
      this.objTotales['deposito'] = parseFloat('0');
      this.objTotales['diferencia'] = this.diferentAux;
    }
    this.bankSelect = 0;
    this.numPapeleta = "";
  }

  changeVal(index) {
    this.arraySumDet[index]['validate_sum'] = !this.arraySumDet[index]['validate_sum'];
  }

  changeValAll() {
    this.changeAll = !this.changeAll;
    this.arraySumDet.forEach(element => {
      if (element['fecha_post'] <= this.viewDate && element['isCobrated'] == 0) {
        element['validate_sum'] = this.changeAll;
      } else {
        element['validate_sum'] = false;
      }
    });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR DEPÓSITO":
        this.saveDeposit();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  saveDeposit() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no permiso para realizar depósitos");
    } else if (this.arrayDeposito.length == 0) {
      this.toastr.info("Debe ingresar al menos 1 depósito");
    } else {
      let data = {
        info: this.arrayDeposito,
        ip: this.commonServices.getIpAddress(),
        accion: `Depósito de caja con id_caja ${this.registroSelect}  por el usuario ${this.dataUser.nombre}`,
        id_controlador: myVarGlobals.fDepositoBanco,
        observation: this.observacion,
        total_faltante: this.objTotales.diferencia,
        total_deposito: this.objTotales.deposito,
        nombre_caja: this.arrayCajas.filter(e => e.num_punto_emision == this.cajaSelect)[0]['pto_nombre'],
        account_box: this.arrayCajas.filter(e => e.num_punto_emision == this.cajaSelect)[0]['account_box'],
        punto_emision: this.cajaSelect
      }

      Swal.fire({
        title: "Atención!!",
        text: "Seguro desea realizar el depósito?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true);
          this.depSrv.saveDeposit(data).subscribe(res => {
            this.toastr.success(res['message']);
            this.cancel();
            this.lcargando.ctlSpinner(false);
          }, error => {
            this.toastr.info(error.error.message);
          })
        }
      })
    }
  }

  cancel() {
    this.nameSucursal = "Nombre Sucursal";
    this.observacion = "";
    this.cajaSelect = 0;
    this.registroSelect = 0;
    this.bankSelect = 0;
    this.numPapeleta = "";
    this.arraySumDet = [];
    this.arrayDeposito = [];
    this.objTotales = { cierre: 0, faltante: 0, deposito: 0, diferencia: 0, total_venta: 0, venta_mas_apertura: 0 };
  }

}
