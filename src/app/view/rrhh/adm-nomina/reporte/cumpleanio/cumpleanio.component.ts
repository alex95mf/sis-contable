import { Component, OnInit, ViewChild , OnDestroy} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { CommonService } from '../../../../../services/commonServices';
import { ReporteNominaService } from '../reporte.service'
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
standalone: false,
  selector: 'app-cumpleanio',
  templateUrl: './cumpleanio.component.html',
  styleUrls: ['./cumpleanio.component.scss']
})
export class CumpleanioComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  
  arrayGrupo: Array<any> = [];
  arrayCumple:any;
  mes: any = 0;
  validaDt: any = false;
  cantidadtotal:any;
  dataUser:any;
  empresLogo:any;
  datam:any;
  date: Date = new Date();
  dateNow:  any;
  hora = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();
  arrayMes: any = [{
    id: 1,
    name: "Enero"
  },
  {
    id: 2,
    name: "Febrero"
  },
  {
    id: 3,
    name: "Marzo"
  },
  {
    id: 4,
    name: "Abril"
  },
  {
    id: 5,
    name: "Mayo"
  },
  {
    id: 6,
    name: "Junio"
  },
  {
    id: 7,
    name: "Julio"
  },
  {
    id: 8,
    name: "Agosto"
  },

  {
    id: 9,
    name: "Septiembre"
  },
  {
    id: 10,
    name: "Octubre"
  },
  {
    id: 11,
    name: "Noviembre"
  },
  {
    id: 12,
    name: "Diciembre"
  },

  ];

  totalPages:any;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  constructor( private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private reportService: ReporteNominaService) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.dateNow =  moment(this.date).format('YYYY-MM-DD');
    this.getDepartamentos();
  }

  getDepartamentos(){
    this.reportService.getNomDepart().subscribe(res => {
      this.arrayGrupo = res['data'];
    }, error => {
     /*  this.lcargando.ctlSpinner(false); */
      this.toastr.info(error.error.message);
    })
  }





    getTableCumpleaños() {
      let data = {
        fecha: this.mes == 0 ? null : this.mes,
      }
      this.reportService.getPersonalCumple(data).subscribe(res => {
        console.log(res);
        this.validaDt = true;
        this.arrayCumple = res['data'];
        if(this.arrayCumple.length > 0){
          this.cantidadtotal = this.arrayCumple.length;
          this.arrayCumple = res['data'];
          this.commonServices.actionRpNomina.next(this.arrayCumple);
          this.datam = this.arrayMes.find(datos=> datos.id == this.mes);
        }else{
          this.datam = this.arrayMes.find(datos=> datos.id == this.mes);
          this.validaDt = false;
          this.commonServices.actionRpNomina.next(this.arrayCumple);
          this.toastr.info("No existen cumpleañeros en el mes de " + " " + this.datam.name);
        }
      }, error => {
        this.toastr.info(error.error.message);
      });
    }

    filterptDepartamento(data) {
      if (this.mes != 0) {
        this.mes = data;
        this.getTableCumpleaños();
      } else {
        this.arrayCumple = [];
      }
    }
}
