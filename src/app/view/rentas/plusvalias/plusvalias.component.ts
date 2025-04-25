import { Component, OnInit, ViewChild} from '@angular/core';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';


@Component({
  selector: 'app-plusvalias',
  templateUrl: './plusvalias.component.html',
  styleUrls: ['./plusvalias.component.scss']
})
export class PlusvaliasComponent implements OnInit {

  

  constructor() { }

  ngOnInit(): void {
  }

}
