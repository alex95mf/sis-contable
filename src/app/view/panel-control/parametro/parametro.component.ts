import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { ParametroService } from './parametro.service'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/commonServices'
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.scss']
})
export class ParametroComponent implements OnInit {

  constructor(private seguridadServices: ParametroService, private toastr: ToastrService, private router: Router, private zone: NgZone,
    private commonServices: CommonService) {
  }

  ngOnInit() {
  }

}
