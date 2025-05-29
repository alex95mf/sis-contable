import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PeriodoResponseI } from "src/app/models/responsePeriodo.interface";
import { GeneralService } from "src/app/services/general.service";

@Component({
standalone: false,
  selector: "app-cc-select-periodos-nom",
  templateUrl: "./cc-select-periodos-nom.component.html",
  styleUrls: ["./cc-select-periodos-nom.component.scss"],
})
export class CcSelectPeriodosNomComponent implements OnInit {
  @Input() labelDescription: string;
  @Input() optionDefault: string;
  @Input() estado?: string;
  @Output() ccPeriodoSelecionado = new EventEmitter<any>();
  @Output() ccPeriodoValueSelecionado = new EventEmitter<any>();
  @Input() ngModelCcPeriodo: any;
  @Input() ngValorSelect :any;
  listPeriod : any ;



  periodos: PeriodoResponseI;

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
    this.ngModelCcPeriodo = "0";
    this.generalService
      .getPeriodos(this.estado)
      .subscribe((res: PeriodoResponseI) => {
        this.periodos = res;
      });
  }

  onSelectMessage() {

    this.listPeriod = this.periodos;
    let newPeriod = this.listPeriod.filter((period)=>{
      if(period.id_periodos === this.ngModelCcPeriodo){
        return period;
      }
    });

    this.ngModelCcPeriodo =  newPeriod[0];
   
    // console.log( this.ngModelCcPeriodo );
    // this.ngModelCcPeriodo = this.periodos;
    // this.ccPeriodoValueSelecionado.emit(this.ngValorSelect);
    this.ccPeriodoSelecionado.emit(this.ngModelCcPeriodo);
  }

  onClearLang(): void {
    this.ngModelCcPeriodo = [];
    console.log("clear event");
  }
}
