import { Component, OnInit, ViewChild, OnDestroy, Input,NgZone  } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { prestamosService } from "../prestamos.service";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import * as moment from "moment";
import * as myVarGlobals from "../../../../../global";
import "sweetalert2/src/sweetalert2.scss";
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
const Swal = require("sweetalert2");

@Component({
standalone: false,
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  validaDtUser: any = false;
  guardarolT: any = [];
  processing: any = false;
  processingtwo: any = false;
  data:any;
  flag: number = 0;
  personal:any;

  personales:Array<any> = [];
  constructor(private toastr: ToastrService, private prestamoSrvc: prestamosService, private commonServices: CommonService,
    private commonVarSrvice: CommonVarService,public activeModal: NgbActiveModal, private router: Router, private zone: NgZone) { }

    vmButtons: any = [];
    mensajeSppiner: string = "Cargando...";
    @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnPerMdPrs", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false, imprimir: false}
    ];

    setTimeout(() => {
			this.lcargando.ctlSpinner(true);
		}, 10);

    this.getClientes();
  }

  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "CERRAR":
				this.closeModal();
			break;
		}
	}

   /* actions modals */
   closeModal() {
    this.activeModal.dismiss();
  }

  getClientes() {
    this.prestamoSrvc.tablaPersonal().subscribe((res) => {
      this.personales = res["data"];
      this.getDataTable();
    },error=>{
      this.lcargando.ctlSpinner(false);
    });
  }

  getDataTable() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.prestamoSrvc.tablaPersonal().subscribe((res) => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.validaDtUser = true;
      this.flag += 1;
      this.guardarolT = res["data"];
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.dtTrigger.next(null);
      this.processing = true;
    });
  }

  getReportsVentados() {
    const data = {
      id_personal: this.personal == undefined ? null : this.personal
    };

    this.guardarolT = [];
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      scrollY: "200px",
      scrollCollapse: true,
      paging: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.prestamoSrvc.showpersonalDos(data).subscribe((res) => {
      this.lcargando.ctlSpinner(false);
        this.validaDtUser = true;
        this.processing = true;
        this.flag += 1;
        this.guardarolT = res["data"];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.dtTrigger.next(null);
        this.processing = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  searchPersonal(event) {
    this.personal = event;
    this.rerender();
  }

  rerender(): void {
    this.validaDtUser = false;
    if (this.flag >= 1) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.guardarolT = [];
        this.getReportsVentados();
      });
    } else {
      this.getDataTable();
      this.guardarolT = [];
    }
  }

  searchPersonalModal(dt) {
    this.commonVarSrvice.dataPersonal.next(dt);
this.closeModal();
  }


}
