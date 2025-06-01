import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AreaResponseI } from 'src/app/models/responseArea.interface';
import { GeneralService } from 'src/app/services/general.service';

@Component({
standalone: false,
  selector: 'app-cc-select-nom-area',
  templateUrl: './cc-select-nom-area.component.html',
  styleUrls: ['./cc-select-nom-area.component.scss']
})
export class CcSelectNomAreaComponent implements OnInit {

  @Input() labelDescription: string;
  @Input() optionDefault: string;
  @Output() ccItemSelecionadoArea = new EventEmitter<any>();
  @Input() ngModelCcHijoArea: any;

  areas: any;
  constructor(private generalService: GeneralService) {
  }

  
  ngOnInit(): void {

    this.ngModelCcHijoArea = "0";
    this.generalService
      .getAreas()
      .subscribe((res: AreaResponseI) => {
        this.areas = res;
      });
  }

  onSelectMessage() {
    this.ccItemSelecionadoArea.emit(this.ngModelCcHijoArea);
    // console.log(this.ngModelCcHijoCatg);
    // this.contador.emit("hola desde catalogo");
  }

  onClearLang(): void {
    this.ngModelCcHijoArea = [];
    console.log('clear event')
  }
}
