import { Component, OnInit, Input } from '@angular/core';

import moment from 'moment'

@Component({
standalone: false,
  selector: 'app-anulados',
  templateUrl: './anulados.component.html',
  styleUrls: ['./anulados.component.scss']
})
export class AnuladosComponent implements OnInit {

  selected_anio: any;

  @Input() ListaAtsAnulados: any;


  permiso_ver: any = "0";
  mes_actual: any = 0;
  

  constructor() { }

  ngOnInit(): void {

    this.selected_anio = moment(new Date()).format('YYYY');
    this.mes_actual = Number(moment(new Date()).format('MM'));

  }

  ChangeDecimal(valor:string){

    return parseFloat(valor).toFixed(2);

  }

  ChangeMesAts(evento: any){ this.mes_actual = evento;}

}
