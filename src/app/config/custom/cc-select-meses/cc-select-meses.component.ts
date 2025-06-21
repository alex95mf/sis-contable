import { Component, Input, OnInit ,EventEmitter,Output} from '@angular/core';
import moment from 'moment'
import * as internal from 'stream';

@Component({
standalone: false,
  selector: 'app-cc-select-meses',
  templateUrl: './cc-select-meses.component.html',
  styleUrls: ['./cc-select-meses.component.scss']
})
export class CcSelectMesesComponent implements OnInit {

  @Input() presentar: string;
  @Input() mes_actual: string;

  @Output() ChangeMes = new EventEmitter();

  onChangeMes(evento: any) {
    this.ChangeMes.emit(evento);
  }

  selected_mes : any;
  arrayMes: any =
    [
      {
        id: "0",
        name: "-Todos-"
      },{
        id: "1",
        name: "Enero"
      },
      {
        id: "2",
        name: "Febrero"
      },
      {
        id: "3",
        name: "Marzo"
      },
      {
        id: "4",
        name: "Abril"
      },
      {
        id: "5",
        name: "Mayo"
      },
      {
        id: "6",
        name: "Junio"
      },
      {
        id: "7",
        name: "Julio"
      },
      {
        id: "8",
        name: "Agosto"
      },

      {
        id: "9",
        name: "Septiembre"
      },
      {
        id: "10",
        name: "Octubre"
      },
      {
        id: "11",
        name: "Noviembre"
      },
      {
        id: "12",
        name: "Diciembre"
      },
    ];

  constructor() { }

  ngOnInit(): void {
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();
    this.ChangeMes.emit(this.mes_actual)
  }

}
