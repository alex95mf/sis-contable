import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router'
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DataTableDirective } from 'angular-datatables';
import { DepreciacionService } from './depreciacion.service'
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { AdquisicionesService } from '../adquisiciones/adquisiciones.service'
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-depreciacion',
  templateUrl: './depreciacion.component.html',
  styleUrls: ['./depreciacion.component.scss']
})
export class DepreciacionComponent implements OnInit {

  payload: any;
  permissions: any;
  processing: boolean = false;
  processing_dt: boolean = false;

  /* params maintenance */
  depreciation: any = { year: 0, status: 0, acquisition: 0 };
  status: Array<any> = [
    { id: 1, name: "Activo" },
    { id: 2, name: "Baja" },
  ];
  years: Array<any> = [];
  acquisitions: Array<any> = [];

  /* dictionaries */
  fixed_assets: Array<any> = [];
  fixed_assets_aux: Array<any> = [];

  /* datatable */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: any = {};
  dtTrigger = new Subject();

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(private toastr: ToastrService, private router: Router, private depreciationSrv: DepreciacionService,
    private adqSrv: AdquisicionesService, private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermissions();
  }

  /* Calls API REST */
  getPermissions() {
    this.payload = JSON.parse(localStorage.getItem('Datauser'));

    let params = { codigo: myVarGlobals.fDepreciacion, id_rol: this.payload.id_rol }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene acceso a este formulario.");
        this.lcargando.ctlSpinner(false);
      } else {
        this.getBackYears();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getBackYears() {
    const data = { years: 2 }
    this.depreciationSrv.getBackYears(data).subscribe(res => {
      this.years = res['data'];
      this.getTypeAcquisitions();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTypeAcquisitions() {
    this.adqSrv.getInfoDEpreciaciones().subscribe(res => {
      this.acquisitions = res['data'];
      this.buildTable();
      this.processing = true;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  depreciateFixedAsset(element) {
    Swal.fire({
      title: "Atención",
      text: "¿Esta seguro de realizar esta acción?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        element['ip'] = this.commonServices.getIpAddress();
        element['id_controlador'] = myVarGlobals.fDepreciacion;
        element['accion'] = `Depreciación [year] del AF ${element.nombre}`;

        this.depreciationSrv.setAFDepreciate(element).subscribe(res => {
          this.toastr.success(res['message']);
          this.rerender();
        }, error => {
          this.toastr.info(error.error.message);
        })
      }
    })
  }

  /* datatable actions */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(evt?): void {
    if (this.depreciation.status !== 0 && this.depreciation.year !== 0 && this.depreciation.acquisition !== 0) {
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.onSearchDepreciation(evt);
      });
    }
  }

  buildTable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }

    setTimeout(() => {
      this.lcargando.ctlSpinner(false);
      this.dtTrigger.next(null);
    }, 50);
  }

  /* OnChange*/
  onSearchDepreciation(evt?) {
    const data = {
      year: this.depreciation.year,
      status: this.depreciation.status,
      acquisition: this.depreciation.acquisition,
    }

    this.lcargando.ctlSpinner(true);
    this.depreciationSrv.getAF(data).subscribe(response => {
      this.fixed_assets = response["data"];
      this.fixed_assets_aux = response["data"];
      this.processing_dt = true;

      setTimeout(() => {
        this.lcargando.ctlSpinner(false);
        this.dtTrigger.next(null);
      }, 50);

    }, error => {
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.fixed_assets = [];
        this.fixed_assets_aux = [];
        this.dtTrigger.next(null);
      }, 50);
    });
  }
}
