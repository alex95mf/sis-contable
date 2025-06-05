import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValeService } from '../vale.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonService } from '../../../../../services/commonServices';
import { CommonVarService } from '../../../../../services/common-var.services';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-reposicion',
  templateUrl: './reposicion.component.html',
  styleUrls: ['./reposicion.component.scss']
})
export class ReposicionComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() reposition: any;
  @Input() permisions: any;
  @Input() form: any;
  repoAux: any = {};
  dataUser: any;
  arrayBanks: any;
  viewDate: Date = new Date();
  isTxNumber: boolean = false;
  dataSucursal: any;
  empresLogo: any;
  vmButtons:any;

  constructor(
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private crtSrv: ValeService,
    private commonServices: CommonService,
    private commonVarService: CommonVarService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsRepos", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsRepos", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, printSection: "print-section", imprimir: true},
      { orig: "btnsRepos", paramAccion: "", boton: { icon: "fa fa-times", texto: "REPONER" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false}

    ];
    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    }, 50);
    document.getElementById('idBenef').focus();
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.getInfoBank();
    Object.keys(this.reposition).forEach(key => {
      this.reposition[key].monto = parseFloat(this.reposition[key].monto).toFixed(2);
      this.reposition[key].saldo = parseFloat(this.reposition[key].saldo).toFixed(2);
      this.reposition[key]['reposition'] = (parseFloat(this.reposition[key].monto) - parseFloat(this.reposition[key].saldo)).toFixed(2);
    })
    this.repoAux = this.reposition[0];
    this.repoAux.fk_banco = 0;
    this.repoAux.num_doc_tx = "";
    this.getSucursal();

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "CERRAR":
        this.closeModal();
      break;
      case "REPONER":
        this.validateRepocition();
      break;
    }
  }

  closeModal() {
    this.repoAux.num_doc_tx = "";
    this.repoAux.fk_banco = 0;
    this.isTxNumber = false;

    this.activeModal.dismiss();
  }

  getInfoBank() {
    
    let payload = {
      type: ['Ahorros', 'Corriente', 'Boveda']
    }
    this.crtSrv.getAvailableBanks(payload).subscribe(res => {
      this.arrayBanks = res['data'];
      this.commonVarService.updPerm.next(false);
    }, error => {
      this.commonVarService.updPerm.next(false);
      this.toastr.info(error.error.message);
    })
  }

  async validateRepocition() {
    if (this.permisions == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (parseFloat(this.repoAux.reposition) == 0.00) {
        this.toastr.info('El monto a reponer no puede ser menor o igual a 0.00');
      } else {
        await this.commonValidate().then(rsp => {
          if (rsp) {
            Swal.fire({
              title: "Atención!!",
              text: "Seguro desea reponer el valor de la caja?",
              icon: 'warning',
              showCancelButton: true,
              cancelButtonColor: '#DC3545',
              confirmButtonColor: '#13A1EA',
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) {
                this.commonVarService.updPerm.next(true);
                this.repoAux['ip'] = this.commonServices.getIpAddress();
                this.repoAux['accion'] = `Reposicion de caja chica por un valor de $${this.repoAux.reposition} por el usuario ${this.dataUser.nombre}`;
                this.repoAux['id_controlador'] = this.form;
                this.repoAux['fk_usuario'] = this.dataUser.id_usuario;
                this.repoAux['fecha_reposicion'] = moment(this.viewDate).format('YYYY-MM-DD');

                if (this.repoAux.num_doc_tx === undefined || this.repoAux.num_doc_tx === null || this.repoAux.num_doc_tx === "") {
                  delete this.repoAux.num_doc_tx;
                };
                this.crtSrv.saveReposition(this.repoAux).subscribe(res => {
                  this.commonVarService.updPerm.next(false);
                  this.toastr.success(res['message']);
                  this.commonVarService.listenBoxSmallReposition.next(null);
                  this.closeModal();
                }, error => {
                  this.toastr.info(error.error.message);
                })
              }
            })
          }
        });
      }
    }
  }

  /* onChange Method */
  validateBank(evt) {
    const bank = this.arrayBanks.find((el) => el.id_banks === parseInt(this.repoAux.fk_banco));
    this.isTxNumber = (bank != undefined && bank.tipo_cuenta === "Corriente") ? true : false;
    this.repoAux.num_doc_tx = undefined;
  }

  /* Validations */
  commonValidate() {
    return new Promise((resolve, reject) => {
      if (this.repoAux.fk_banco === 0 || this.repoAux.fk_banco === "0") {
        this.toastr.info("Seleccione un banco");
      } else if (this.isTxNumber === true && (this.repoAux.num_doc_tx === undefined || this.repoAux.num_doc_tx === null || this.repoAux.num_doc_tx === "")) {
        this.toastr.info("Ingrese el número respectivo del comprobante/cheque.");
        document.getElementById('idTrx').focus();
      } else if (this.repoAux.beneficiario === undefined || this.repoAux.beneficiario === null || this.repoAux.beneficiario === "") {
        this.toastr.info("Ingrese un beneficiario.");
        document.getElementById('idBenef').focus();
      } else {
        resolve(true);
      }
    });
  }

  getSucursal() {
    this.crtSrv.getSucursales().subscribe(res => {
      this.dataSucursal = res['data'].filter(e => e.id_sucursal == this.dataUser.id_sucursal)[0];
      this.commonVarService.updPerm.next(false);
    }, error => {
      this.commonVarService.updPerm.next(false);
      this.toastr.info(error.error.message);
    })
  }

}
