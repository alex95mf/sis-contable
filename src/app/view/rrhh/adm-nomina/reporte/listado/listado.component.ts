import { Component, OnInit, ViewChild , OnDestroy, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { CommonService } from '../../../../../services/commonServices';
import { ReporteNominaService } from '../reporte.service'
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { RolGeneralEmplService } from 'src/app/view/rrhh/beneficios/rol-general/rol-general-empl.service';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalProgramaComponent } from 'src/app/view/rrhh/beneficios/rol-general/modal-programa/modal-programa.component';
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
import * as moment from 'moment';
import { ExcelService } from 'src/app/services/excel.service';
@Component({
standalone: false,
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  mensajeSpiner: string = "Cargando...";
  estadosList: any[] = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ]
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  mensajeSppiner: string = "Cargando...";
  arrayGrupo: Array<any> = [];
  arrayData:any;
  grupo: any = 0;
  areas:any;
  departamentos:any;
  cantidadtotal:any = 0;
  validaDt: any = false;
  dataUser:any;
  empresLogo:any;
  datam:any;
  fk_programa:any;
  date: Date = new Date();
  dateNow:  any;
  hora = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();


  dataDt: any = [];
  paginate: any;
  filter: any;

  constructor( private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private reportService: ReporteNominaService,
    private excelService: ExcelService,
    private rolgeneralemplService: RolGeneralEmplService,
    private commonVarSrv: CommonVarService
  ) {
      this.reportService.exportExcel$.subscribe(
        () => {
          //
          this.reportService.loadingSpinner$.emit({state: true, message: 'Exportando Listado de Nomina'})
          this.reportService.getNomEmpleados({params: { filter: this.filter }}).subscribe(
            (res: any) => {
              let excelData: any[] = [];
              // console.log(res.data)
              res.data.forEach((element: any) => {
                let o = {
                  Identificacion: element.emp_identificacion,
                  Nombres: `${element.emp_primer_nombre} ${element.emp_segundo_nombre}`,
                  Apellidos: `${element.emp_primer_apellido} ${element.emp_segundo_apellido}`,
                  Cargo: element.cargo?.car_nombre,
                  Departamento: element.departamento?.dep_nombre,
                  Area: element.area?.are_nombre,
                  Programa: element.area?.programa?.nombre
                }
                excelData.push(o)
              });
              this.reportService.loadingSpinner$.emit(false)
              this.excelService.exportAsExcelFile(excelData, 'ListadoNomina')
            }
          )
        }
      )
      this.commonVarSrv.modalProgramArea.subscribe(
        (res)=>{  console.log("prueba")
          this.filter.programa = res.nombre
          this.fk_programa = res.id_nom_programa

          this.cargarAreas()  /**/
        }
      )
    }

  ngOnInit(): void {

    this.filter = {
      nombre: undefined,
      area: undefined,
      departamento: undefined,
      cargo: undefined,
      programa: undefined,
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.dateNow =  moment(this.date).format('YYYY-MM-DD');
    // this.getDepartamentos();
    this.getEmpleados();
  }
  modalPrograma(){
    let modal = this.modalService.open(ModalProgramaComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }
  getEmpleados() {
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.reportService.getNomEmpleados(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.dataDt = res['data']['data'];
        } else {
          this.dataDt = Object.values(res['data']['data']);
        }
         this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }


  cargarAreas() {
   // this.mensajeSpiner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      fk_programa: this.fk_programa
    }

    this.rolgeneralemplService.getAreas(data).subscribe(
      (res: any) => {
        console.log(res);
        this.areas = res.data
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }


  getDepartamentos(){
    this.reportService.getNomDepart().subscribe(res => {
      this.arrayGrupo = res['data'];
    /*   this.commonServices.actionRpcancelNomina.next(this.arrayGrupo); */
      this.getTableReport();
    }, error => {
     /*  this.lcargando.ctlSpinner(false); */
      this.toastr.info(error.error.message);
    })
  }

    getTableReport() {
      this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 10,
        search: true,
        paging: true,
/*         scrollY: "200px",
        scrollCollapse: true, */
   /*      order: [[ 1, "desc" ]], */
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
        },
      };
      let data = {
        empleado: null,
        departamento: this.grupo == 0 ? null : this.grupo,
      }
/*       this.mensajeSppiner = "Cargando...";
      this.lcargando.ctlSpinner(true); */
      this.reportService.getPersonalDe(data).subscribe(res => {
        /* this.lcargando.ctlSpinner(false); */
        this.validaDt = true;
        this.arrayData = res['data'];
        this.cantidadtotal = res['data'].length;
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        /* this.lcargando.ctlSpinner(false); */
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
        this.toastr.info(error.error.message);
      });
    }

    rerender(): void {
      this.arrayData = [];
      this.validaDt = false;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getTableReport();
      });
    }

    filterptDepartamento(data) {
      if (this.grupo != 0) {
        this.grupo = data;
        this.rerender();
      } else {
        this.rerender();
      }
    }

  cargarDepartamentos(event) {
  //  this.mensajeSpiner = "Cargando listado de Departamentos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_area: this.filter.area
    } /* */

   this.rolgeneralemplService.getDepartamentos(data).subscribe(
      (res: any) => {
        console.log(res);
      this.departamentos = res
       this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    ) /*  */

  }
    changePaginate(event) {
      let newPaginate = {
        perPage: event.pageSize,
        page: event.pageIndex + 1,
      }
      Object.assign(this.paginate, newPaginate);
      this.getEmpleados();
    }

    limpiarFiltros() {

      this.filter.nombre = undefined;
      this.filter.area = undefined;
      this.filter.departamento = undefined;
      this.filter.cargo = undefined;
      this.filter.programa = undefined;
    }


}
