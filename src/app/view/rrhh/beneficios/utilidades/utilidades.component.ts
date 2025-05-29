import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { CommonService } from '../../../../services/commonServices';

@Component({
standalone: false,
  selector: 'app-utilidades',
  templateUrl: './utilidades.component.html',
  styleUrls: ['./utilidades.component.scss']
})
export class UtilidadesComponent implements OnInit {

  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;
  dataUser: any;
  permissions: any;

  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      /*{ orig: "btnNomUtils", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnNomUtils", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnNomUtils", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },*/
    ];

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        
        break;
    }
  }

}
