import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TransaccionesService } from './transacciones.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { CommonService } from '../../../../services/commonServices';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ReportesTransComponent } from './reportes-trans/reportes-trans.component';

@Component({
standalone: false,
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss']
})
export class TransaccionesComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  tranf: any = { fecha_movimiento: new Date(), bankone: 0, banktwo: 0 };
  processing: any;
  arrayBanks: any;
  dataUser: any;
  permisions: any;
  btnSave: any = false;
  btnMov: any = false;
  validaDt: any = false;
  dataDT: any;
  document: any;
  sendIfo: any = [];
  nameBancoOne: any;
  nameBancoDos: any;
  cuentaOne: any;
  cuentaTwo: any;
  referencia_doc: any;
  infoSendDelete: any;
  validUpdated: any = false;
  globalInfo: any;
  secuenciaGlobal: any;
  processingtwo: any = false;

  vmButtons: any;
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private elementRef: ElementRef,
    private trfSrv: TransaccionesService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService
  ) {

  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnTrsBov", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
      { orig: "btnTrsBov", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true},
      { orig: "btnTrsBov", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
      { orig: "btnTrsBov", paramAccion: "", boton: { icon: "far fa-file-al", texto: "REPORTE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false}
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.elementRef.nativeElement.ownerDocument.body.style = 'background: url(/assets/img/fondo1.jpg);background-size: cover !important;no-repeat;';
    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.valdSavetransf();
        break;
      case "MODIFICAR":
        this.valdUdptransf();
        break;
      case "CANCELAR":
        this.cancel();
        break;
      case "REPORTE":
        this.reportModalTra();
        break;
    }
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fTransferencia,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de transferencias bancarias");
        this.vmButtons = [];
      } else {
        this.processing = true;
        this.getInfoBank();
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getInfoBank() {
    this.trfSrv.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe(res => {
      this.arrayBanks = res['data'];
      this.getDocumentosGlobal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getDocumentosGlobal() {
    this.trfSrv.getDocumentosGlobal().subscribe(res => {
      this.document = res['data'][0]['codigo'] + "-" + res['data'][0]['secuencia'].toString().padStart(10, '0');
      this.referencia_doc = res['data'][0]['codigo'];
      this.secuenciaGlobal = res['data'][0]['secuencia'].toString().padStart(10, '0');
      this.getTableAccounts();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTableAccounts() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      order: [[ 3, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.trfSrv.getTransferencia().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDt = true;
      this.dataDT = res['data'];
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
    });
  }

  getBankDestino(dt) {
    if (dt != 0) {
      let bankdestino = this.arrayBanks.filter(e => e.id_banks == dt)[0];
      this.nameBancoOne = bankdestino['name_banks'];
      this.cuentaOne = bankdestino['cuenta_contable'];
      this.tranf.saldo = parseFloat(bankdestino['saldo_cuenta']).toFixed(2);
    } else {
      this.tranf.banktwo = 0;
    }
  }

  getNameBankTwo(dt) {
    if (dt != 0) {
      let bankName = this.arrayBanks.filter(e => e.id_banks == dt)[0];
      this.nameBancoDos = bankName['name_banks'];
      this.cuentaTwo = bankName['cuenta_contable'];
    }
  }

  validateValue() {
    if (this.tranf.valor > this.tranf.saldo) {
      this.toastr.info("Monto no puede ser mayor al saldo actual del banco seleccionado");
      this.tranf.valor = 0.00;
    }
  }

  async valdSavetransf() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar la transferencia?", "SAVE_TRANSFERENCIA");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.tranf.bankone == 0) {
        this.toastr.info("Seleccione un banco de origen");
      } else if (this.tranf.banktwo == 0) {
        this.toastr.info("Seleccione un tipo de destino");
      } else if (this.tranf.bankone == this.tranf.banktwo) {
        this.toastr.info("Los bancos no pueden ser iguales");
      } else if (this.tranf.saldo == 0.00) {
        this.toastr.info("Saldo insuficiente");
        document.getElementById('idmonto').focus();
      } else if (this.tranf.valor > this.tranf.saldo) {
        this.toastr.info("Saldo insuficiente");
        document.getElementById('idmonto').focus();
      } else if (this.tranf.descripcion == "" || this.tranf.descripcion == undefined || this.tranf.descripcion == null) {
        this.toastr.info("Ingrese un concepto");
        document.getElementById('iddesc').focus();
      } else if (this.tranf.fecha_movimiento == "" || this.tranf.fecha_movimiento == undefined) {
        this.toastr.info("La fecha no puede ser vacia");
      } else {
        resolve(true);
      }
    });
  }

  async confirmSave(message, action, info?) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_TRANSFERENCIA") {
          this.save();
        } else if (action == "DELETE_TRANSFERENCIA") {
          this.deleteTransfer(info);
        } else if (action == "UPDATED_TRANSFERENCIA") {
          this.updated(info);
        }
      }
    })
  }

  save() {
    this.sendIfo = [];
    let dataDeb = {
      ref_doc: this.referencia_doc,
      fk_bank_account: this.tranf.bankone,
      tipo_movimiento: 'D',
      cuenta: (this.validUpdated) ? this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'D')[0]['detalles'][0]['cuenta_contable'] : this.cuentaOne,
      doc_id: 24,
      num_doc: this.tranf.num_doc,
      fecha_movimiento: moment(this.tranf.fecha_movimiento).format('YYYY-MM-DD'),
      valor: this.tranf.valor,
      descripcion: this.tranf.descripcion,
      secuencia: (this.validUpdated) ? this.infoSendDelete[0]['secuencia'] : ""
    }
    let dataCred = {
      ref_doc: this.referencia_doc,
      fk_bank_account: this.tranf.banktwo,
      tipo_movimiento: 'C',
      cuenta: (this.validUpdated) ? this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'C')[0]['detalles'][0]['cuenta_contable'] : this.cuentaTwo,
      doc_id: 24,
      num_doc: this.tranf.num_doc,
      fecha_movimiento: moment(this.tranf.fecha_movimiento).format('YYYY-MM-DD'),
      valor: this.tranf.valor,
      descripcion: this.tranf.descripcion,
      secuencia: (this.validUpdated) ? this.infoSendDelete[0]['secuencia'] : ""
    };
    this.sendIfo.push(dataDeb);
    this.sendIfo.push(dataCred);
    let data = {
      updatedMov: this.validUpdated,
      num_doc: this.tranf.num_doc,
      valor: this.tranf.valor,
      descripcion: this.tranf.descripcion,
      ip: this.commonServices.getIpAddress(),
      accion: `Transferencia bancarias desde el  ${this.nameBancoOne} hacia el  ${this.nameBancoDos} por un valor de $${this.tranf.valor}`,
      id_controlador: myVarGlobals.fTransferencia,
      info: this.sendIfo
    }
    this.trfSrv.saveTransaction(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancel();
      this.validaDt = false;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getInfoBank();
      });
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  rerender(): void {
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getTableAccounts();
    });
  }

  cancel() {
    this.tranf = { fecha_movimiento: new Date(), bankone: 0, banktwo: 0 };
    this.btnSave = false;
    this.btnMov = false;
    this.sendIfo = [];
    this.document = this.referencia_doc + "-" + this.secuenciaGlobal;
    this.infoSendDelete = [];
    this.validUpdated = false;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
  }

  deleteMov(dt) {
    this.infoSendDelete = [];
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar transferencias");
    } else {
      this.infoSendDelete = this.dataDT.filter(e => e.num_doc == dt.num_doc && e.secuencia == dt.secuencia && e.doc_id == dt.doc_id);
      this.confirmSave("Seguro desea eliminar la transferencia?", "DELETE_TRANSFERENCIA", this.infoSendDelete);
    }
  }

  deleteTransfer(info) {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Eliminacion de la transferencia con numero de documento ${info[0].num_doc}`,
      id_controlador: myVarGlobals.fTransferencia,
      info: info,
      val: false
    }
    this.trfSrv.deleteTransaction(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancel();
      this.validaDt = false;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getInfoBank();
      });
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  updateMov(dt) {
    this.infoSendDelete = [];
    this.infoSendDelete = this.dataDT.filter(e => e.num_doc == dt.num_doc && e.secuencia == dt.secuencia && e.doc_id == dt.doc_id);
    this.document = this.referencia_doc + "-" + dt.secuencia.toString().padStart(10, '0');
    this.tranf.bankone = this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'D')[0]['fk_bank_account'];
    this.tranf.banktwo = this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'C')[0]['fk_bank_account'];
    this.tranf.fecha_movimiento = this.infoSendDelete[0]['fecha_movimiento'];
    this.tranf.num_doc = (this.infoSendDelete[0]['num_doc'] != undefined) ? this.infoSendDelete[0]['num_doc'] : "";
    this.tranf.saldo = parseFloat(this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'D')[0]['saldo_actual']).toFixed(2);
    this.tranf.valor = parseFloat(this.infoSendDelete[0]['valor']).toFixed(2);
    this.tranf.descripcion = this.infoSendDelete[0]['descripcion'];
    this.nameBancoOne = this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'D')[0]['detalles'][0]['name_banks'];
    this.nameBancoDos = this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'C')[0]['detalles'][0]['name_banks'];
    this.btnSave = true;
    this.btnMov = true;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
  }

  async valdUdptransf() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar la transferencias");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar la transferencia?", "UPDATED_TRANSFERENCIA", this.infoSendDelete);
        }
      })
    }
  }

  updated(info) {
    this.validUpdated = true;
    this.sendIfo = [];
    let dataDeb = {
      ref_doc: this.referencia_doc,
      fk_bank_account: this.tranf.bankone,
      tipo_movimiento: 'D',
      cuenta: (this.validUpdated) ? this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'D')[0]['detalles'][0]['cuenta_contable'] : this.cuentaOne,
      doc_id: 24,
      num_doc: this.tranf.num_doc,
      fecha_movimiento: moment(this.tranf.fecha_movimiento).format('YYYY-MM-DD'),
      valor: this.tranf.valor,
      descripcion: this.tranf.descripcion,
      secuencia: (this.validUpdated) ? this.infoSendDelete[0]['secuencia'] : ""
    }
    let dataCred = {
      ref_doc: this.referencia_doc,
      fk_bank_account: this.tranf.banktwo,
      tipo_movimiento: 'C',
      cuenta: (this.validUpdated) ? this.infoSendDelete.filter(deb => deb.tipo_movimiento == 'C')[0]['detalles'][0]['cuenta_contable'] : this.cuentaTwo,
      doc_id: 24,
      num_doc: this.tranf.num_doc,
      fecha_movimiento: moment(this.tranf.fecha_movimiento).format('YYYY-MM-DD'),
      valor: this.tranf.valor,
      descripcion: this.tranf.descripcion,
      secuencia: (this.validUpdated) ? this.infoSendDelete[0]['secuencia'] : ""
    };
    this.sendIfo.push(dataDeb);
    this.sendIfo.push(dataCred);
    let data = {
      infoUpdate: info,
      updatedMov: this.validUpdated,
      num_doc: this.tranf.num_doc,
      valor: this.tranf.valor,
      descripcion: this.tranf.descripcion,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualizacion de Transferencia bancarias desde el  ${this.nameBancoOne} hacia el  ${this.nameBancoDos} por un valor de $${this.tranf.valor}`,
      id_controlador: myVarGlobals.fTransferencia,
      info: this.sendIfo
    }

    this.trfSrv.updateTransaction(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.cancel();
      this.validaDt = false;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getInfoBank();
      });
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  selectNameBank(dt) {
    let nameBanktwo = this.dataDT.filter(e => e.secuencia == dt.secuencia && e.tipo_movimiento == 'C');
    return nameBanktwo[0]['detalles'][0]['name_banks'];
  }

  closeModalTra() {
    // ($("#modalTransferencia") as any).modal("hide");
    this.processingtwo = false;
  }

  reportModalTra() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Transferencias");
    } else {
      this.processingtwo = true;
      const dialogRef = this.confirmationDialogService.openDialogMat(ReportesTransComponent, {
        width: 'auto', height: 'auto',
        data: { titulo: "Reporte Tranferencia Bancaria",}

      } );

      dialogRef.afterClosed().subscribe(resultado => {
        if(resultado!=false && resultado!=undefined){
        }else{
          this.closeModalTra();
        }
      });
    }
  }
}
