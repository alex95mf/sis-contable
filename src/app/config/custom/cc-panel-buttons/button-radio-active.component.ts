import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  forwardRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Botones, cbtn } from "../cc-buttons/buttons.componente";

@Component({
  selector: "app-button-radio-active",
  templateUrl: "./button-radio-active.component.html",
  styleUrls: ["./button-radio-active.component.scss"],
})
export class ButtonRadioActiveComponent implements OnInit {
  public radioGroupForm: FormGroup;
  @Input() titulo: string;
  @Input() groupButton: cbtn[]; //pbtns
  @Input() filtroBoton; //pfilterbtns
  @Input() pparams: any;
  @Input() cstyle: string;
  @Input() styleTitle: string;
  @Input() icono: string;

  @Input() presentar: boolean = true;
  private _verDesaparecerBotones: boolean;
  get verDesaparecerBotones(): boolean {
    return this._verDesaparecerBotones;
  }
  @Input()
  set verDesaparecerBotones(valor: boolean) {
    if (valor) {
      this._verDesaparecerBotones = valor;
    } else {
      this._verDesaparecerBotones = true;
    }
  }
  public agrupacion: cbtn[] = [];
  public filtrado;
  private pp: any;
  constructor(private formBuilder: FormBuilder, private _boton: Botones) {}

  ngOnInit() {
    this.radioGroupForm = this.formBuilder.group({
      model: 1,
    });
    if (this.cstyle == undefined || this.cstyle == "") {
      this.cstyle = "bg-info";
    }
    if (this.styleTitle == undefined || this.styleTitle == "") {
      this.styleTitle = "text-dark";
    }
    this.validateData();
  }

  validateData() {
    this.filtrado = this.filtroBoton;
    this.pp = eval(this.pparams);
    if (this.filtrado != null && this.filtrado != undefined) {
      this.groupButton.forEach((element) => {
        if (element.permiso) {
          var b: any = {};
          b = element;
          if (b.boton.datoBadge != undefined) {
            b.pDatoBagde = eval("pp." + b.boton.datoBadge);
          } else {
            b.pDatoBagde = "C";
          }
          if (
            b.paramAccion != "" &&
            b.paramAccion != undefined &&
            this.pp != "" &&
            this.pp != undefined
          ) {
            b.paramAccion = { v1: b.paramAccion, v2: this.pp };
          } else if (this.pp == "" || this.pp == undefined) {
            b.paramAccion = b.paramAccion;
          } else {
            b.paramAccion = this.pp;
          }
          this.agrupacion.push(b);
        }
      });
    } else {
      this.agrupacion = this.groupButton;
    }
  }

  @Output() onMetodoGlobal: EventEmitter<any> = new EventEmitter();

  metodoGlobal(item) {
    this.onMetodoGlobal.emit({
      items: item,
    });
  }

  public setVerDesapareceBoton(valor: boolean) {
    this.verDesaparecerBotones = valor;
  }

  printSectionCDE(valor:any) {
    let element: HTMLElement = document.getElementsByClassName(valor)[0] as HTMLElement;
    element.click();
  }
}
