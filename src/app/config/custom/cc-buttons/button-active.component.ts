import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  forwardRef,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Botones, cbtn } from "./buttons.componente";
import { evaluate } from 'mathjs';

@Component({
standalone: false,
  selector: "app-button-active",
  templateUrl: "./button-active.component.html",
  styleUrls: ["./button-active.component.css"],
})
export class ButtonActiveComponent implements OnInit {
  public radioGroupForm: FormGroup;
  @Input() titulo: string;
  @Input() groupButton: cbtn[]; //pbtns
  @Input() filtroBoton; //pfilterbtns
  @Input() pparams: any;
  @Input() cstyle: string;
  @Input() styleTitle: string;
  @Input() presentar: boolean = false;
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
    this.radioGroupForm = this.formBuilder.group({model: 1,});
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
    this.pp = evaluate(this.pparams);
    if (this.filtrado != null && this.filtrado != undefined) {
      this.groupButton.forEach((element) => {
        if (element.permiso) {
          var b: any = {};
          b = element;
          if (b.boton.datoBadge != undefined) {
            b.pDatoBagde = evaluate("pp." + b.boton.datoBadge);
          } else {
            b.pDatoBagde = "C";
          }
          if (
            b.paramAccion != "" &&
            b.paramAccion != undefined &&
            this.pp != "" &&
            this.pp != undefined
          ) {
            //var a = { v1: b.paramAccion, v2: this.pp };
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
}
