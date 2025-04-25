import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CargoResponseI } from 'src/app/models/responseCargo.interface';
import { GeneralService } from "src/app/services/general.service";

@Component({
  selector: 'app-cc-select-nom-cargo',
  templateUrl: './cc-select-nom-cargo.component.html',
  styleUrls: ['./cc-select-nom-cargo.component.scss']
})
export class CcSelectNomCargoComponent implements OnInit {

  @Input() labelDescription: string;
  @Input() optionDefault: string;
  @Output() ccItemSelecionadoCargo = new EventEmitter<any>();
  @Input() ngModelCcHijoCargo: any;
  @Input() isDisabled: boolean;

  cargosRpt: CargoResponseI;
  constructor(private generalService: GeneralService) {
    this.isDisabled = false;
  }

  ngOnInit(): void {
    this.ngModelCcHijoCargo = "0";
    this.generalService
      .getCargosCombo("not")
      .subscribe((res: CargoResponseI) => {
        this.cargosRpt = res;
      });
  }

  onSelectMessage() {
    this.ccItemSelecionadoCargo.emit(this.ngModelCcHijoCargo);
    // console.log(this.ngModelCcHijoCatg);
    // this.contador.emit("hola desde catalogo");
  }

  onClearLang(): void {
    this.ngModelCcHijoCargo = [];
    console.log("clear event");
  }

}
