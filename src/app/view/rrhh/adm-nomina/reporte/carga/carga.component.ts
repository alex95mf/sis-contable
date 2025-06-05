import { Component, OnInit, ViewChild , OnDestroy} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { CommonService } from '../../../../../services/commonServices';
import { ReporteNominaService } from '../reporte.service'
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ModalEmpleadosComponent } from './modal-empleados/modal-empleados.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as myVarGlobals from 'src/app/global';
import { ExcelService } from 'src/app/services/excel.service';
@Component({
standalone: false,
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss']
})
export class CargaComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  
  arrayPersonal: Array<any> = [];
  arrayData:any;
  empleado: any = 0;
  validaDt: any = false;
  dataUser:any;
  empresLogo:any;
  datam:any;
  permissions: any;
  cantidadtotal:any;
  date: Date = new Date();
  dateNow:  any;
  verifyRestore = false;
  paginate: any;
  filter: any;
  hora = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  constructor( private commonServices: CommonService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private reportService: ReporteNominaService,
    private excelService: ExcelService) {

      this.reportService.exportCargasExcel$.subscribe(
        () => {
          //
          this.reportService.loadingSpinner$.emit({state: true, message: 'Exportando Listado de Cargas Familiares'})
          //this.reportService.getPersonalCarga({params: { filter: this.filter }}).subscribe(
            //(res: any) => {
              let excelData: any[] = [];
             //  console.log(res.data)
             this.arrayData.forEach((element: any) => {

                let o = {
                  Empleado: `${element.nombres} ${element.apellidos}`,
                  IdentificacionCarga: element.cedula_carga,
                  NombresCarga: `${element.nombres_general}`,
                  ApellidosCarga: `${element.apellidos_general}`,
                  FechaNacimiento: `${element.fecha_nacim}`,
                  Parentesco: `${element.relacion}`,
                }
                excelData.push(o)
              });
              this.reportService.loadingSpinner$.emit(false)
              this.excelService.exportAsExcelFile(excelData, 'ListadoCargasFamiliares')
           // }
         // )
        }
      )
     }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.dateNow =  moment(this.date).format('YYYY-MM-DD');
    this.filter = {
      empleado: '',
    };
    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10,20,30,50]
    };

     this.getPersonal();
  }

  getPersonal(){
    this.reportService.getPersonalAll().subscribe(res => {
      this.arrayPersonal = res['data'];
      this.getTableReport();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalEmpleadosComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRPEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
  }

    getTableReport() {
      this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 10,
        search: true,
        paging: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
        },
      };
      // let data = {
      //   empleado: this.empleado == 0 ? null : this.empleado,
      //   filter: this.filter,
      //   paginate: this.paginate
      // }
      let data = {
        params: {
          empleado: this.empleado == 0 ? null : this.empleado,
          filter: this.filter,
          paginate: this.paginate
        }
      }

      this.reportService.getPersonalCarga(data).subscribe(
        (res) => {
          console.log(res);
          this.paginate.length = res['data']['total'];
          if (res['data']['current_page'] == 1) {
            this.arrayData = res['data']['data'];
          } else {
            this.arrayData = Object.values(res['data']['data']);
          }
          // this.lcargando.ctlSpinner(false);
        },
        (error) => {
          // this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      )

      // this.reportService.getPersonalCarga(data).subscribe(res => {
      //   console.log(res);
      // this.validaDt = true;
      // this.arrayData = res['data'];
      // if(this.arrayData.length > 0 && this.empleado !=0){
      //   this.cantidadtotal = this.arrayData.length;
      //   this.datam = this.arrayPersonal.find(datos=> datos.id_personal == this.empleado);
      //   console.log(this.datam)
      // }else{
      //   this.cantidadtotal = this.arrayData.length;
      //   this.datam = this.arrayPersonal.find(datos=> datos.id_personal == this.empleado);
      //   console.log(this.datam)
      // }
      //   setTimeout(() => {
      //     this.dtTrigger.next(null);
      //   }, 50);
      // }, error => {
      //   setTimeout(() => {
      //     this.dtTrigger.next(null);
      //   }, 50);
      //   this.toastr.info(error.error.message);
      // });
    }

    rerender(): void {
      this.arrayData = [];
      this.validaDt = false;
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.getTableReport();
      });
    }

    filterptDepartamento(data) {
      if (this.empleado != 0) {
        this.empleado = data;


        this.rerender();
      } else {

        this.rerender();
      }
    }

    limpiarFiltros() {

      this.filter.empleado = '';

    }
    changePaginate(event) {
      let newPaginate = {
        perPage: event.pageSize,
        page: event.pageIndex + 1,
      }
      Object.assign(this.paginate, newPaginate);
      this.getTableReport();
    }


}
