import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { CatalogoResponseI } from "src/app/models/responseCatalogo.interface";
import { GeneralService } from "src/app/services/general.service";

@Component({
  selector: "app-cc-select-nom-catalogo",
  templateUrl: "./cc-select-nom-catalogo.component.html",
  styleUrls: ["./cc-select-nom-catalogo.component.scss"],
})
export class CcSelectNomCatalogoComponent implements OnInit {
  @Input() labelDescription: string;
  // @Input() labelOptionDefault: string;
  @Input() optionDefault: string;
  @Input() codigocatalogo: string;
  @Output() ccItemSelecionado = new EventEmitter<any>();
  @Input() ngModelCcHijoCatg: any;
  @Input() isDisabled: boolean;

  test: any;
  //isDisabled: boolean;
  catalogos: any;
  /*   selectValue:number = 3; */
  // codigocatalogo: any;

  constructor(private generalService: GeneralService) {
    this.isDisabled = false;
  }

  ngOnInit(): void {
    // this.codigocatalogo = "GEN";
    // this.ngModelCcHijoCatg = "0";
    this.generalService
      .getCatalogoKeyWork(this.codigocatalogo)
      .subscribe((res: any) => {
        // console.log(res);
        this.catalogos = res.data;
        // console.log(this.catalogos);
      });

      // console.log(this.codigocatalogo);
      // if(this.codigocatalogo=="TDA"){
      //   this.isDisabled = true;
      // }
  }



  cargaInfoSustento(){


    // console.log('hello')

  }

  onSelectMessage() {
    console.log(this.ngModelCcHijoCatg);
    this.ccItemSelecionado.emit(this.ngModelCcHijoCatg);

    // this.catalogos.forEach((data) => {
    //   console.log(data);
    //   if (data.cat_keyword == "NO" && this.codigocatalogo=="TDA") {
    //     this.isDisabled = true;
    //     return;
    //   }
    // });

    // this.contador.emit("hola desde catalogo");
  }

  onClearLang(): void {
    this.ngModelCcHijoCatg = [];
    console.log("clear event");
  }
}
