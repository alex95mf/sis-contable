import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DepartamentoResponseI } from "src/app/models/responseDepartamento.interface";
import { GeneralService } from "src/app/services/general.service";

@Component({
standalone: false,
  selector: "app-cc-select-nom-departamento",
  templateUrl: "./cc-select-nom-departamento.component.html",
  styleUrls: ["./cc-select-nom-departamento.component.scss"],
})
export class CcSelectNomDepartamentoComponent implements OnInit {
  @Input() labelDescription: string;
  @Input() optionDefault: string;
  @Output() ccItemSelecionadoDepartamento = new EventEmitter<any>();
  @Input() ngModelCcHijoDepartamento: any;
  @Input() isDisabled: boolean;

  departamentos: any;
  constructor(private generalService: GeneralService) {
    this.isDisabled = false;
  }

  ngOnInit(): void {
    this.ngModelCcHijoDepartamento = "0";
    this.generalService
      .getDeparmentos()
      .subscribe((res: DepartamentoResponseI) => {
        this.departamentos = res;
      });
  }

  onSelectMessage() {
    this.ccItemSelecionadoDepartamento.emit(this.ngModelCcHijoDepartamento);
    // console.log(this.ngModelCcHijoCatg);
    // this.contador.emit("hola desde catalogo");
  }

  onClearLang(): void {
    this.ngModelCcHijoDepartamento = [];
    console.log("clear event");
  }
}
