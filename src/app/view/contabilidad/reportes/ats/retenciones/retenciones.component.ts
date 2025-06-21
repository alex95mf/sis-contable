import { Component, OnInit, Input} from '@angular/core';

import moment from 'moment'

@Component({
standalone: false,
  selector: 'app-retenciones',
  templateUrl: './retenciones.component.html',
  styleUrls: ['./retenciones.component.scss']
})
export class RetencionesComponent implements OnInit {

  selected_anio: any;

  @Input() ListaAtsRetenciones: any;


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
