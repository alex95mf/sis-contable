import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CargoResponseI } from "src/app/models/responseCargo.interface";
import { CustonService } from "../../app-custom.service";
// import { CargoService } from "src/app/view/rrhh/mantenimiento-empl/cargo/cargo.service";

@Component({
standalone: false,
  selector: "app-cc-select-nom-cargo-parameter",
  templateUrl: "./cc-select-nom-cargo-parameter.component.html",
  styleUrls: ["./cc-select-nom-cargo-parameter.component.scss"],
})
export class CcSelectNomCargoParameterComponent implements OnInit {
  @Input() labelDescription: string;
  @Input() optionDefault: string;
  @Output() ccItemSelecionadoCargo = new EventEmitter<any>();
  @Input() ngModelCcHijoCargoParameter: any;
  @Input() codigoCargos: any;
  @Input() isDisabled: boolean;

  cargosParameterRpt: CargoResponseI;

  constructor(private cargoService: CustonService) {
    this.isDisabled = false;
  }

  ngOnInit(): void {
    this.ngModelCcHijoCargoParameter = "0";
    if (this.codigoCargos != "0") {
      this.cargoService
        .getPostitionsByDepartment(this.codigoCargos)
        .subscribe((res: CargoResponseI) => {
          this.cargosParameterRpt = res;
        });
    }
  }

  // getCargos(){
  //   this.cargoService
  //   .getPostitionsByDepartment(this.codigoCargos)
  //   .subscribe((res: CargoResponseI) => {
  //     this.cargosParameterRpt = res;
  //   });
  // }
  onSelectMessage() {
    this.ccItemSelecionadoCargo.emit(this.ngModelCcHijoCargoParameter);
    // console.log(this.ngModelCcHijoCatg);
    // this.contador.emit("hola desde catalogo");
  }

  onClearLang(): void {
    this.ngModelCcHijoCargoParameter = [];
    console.log("clear event");
  }
}
