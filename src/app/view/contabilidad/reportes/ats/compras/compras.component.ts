import { Component, OnInit, ViewChild , OnDestroy,Output,Input} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { CommonService } from '../../../../../services/commonServices';
//import { RprtAtsService } from '../rprt-ats.service';
import { RprtAtsService } from './../ats.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {


  @Input() ListaAtsCompras: any;


  comprasats:any;

  constructor(
    private rprService: RprtAtsService
  ) {

  }

  ChangeDecimal(valor:string){

    return parseFloat(valor).toFixed(2);

  }

  ngOnInit(): void { }

}
