import { Component, Input, OnInit } from "@angular/core";
import { ValidacionesFactory } from "../../../../../config/custom/utils/ValidacionesFactory";

@Component({
standalone: false,
  selector: "app-imprimir-rol",
  templateUrl: "./imprimir-rol.component.html",
  styleUrls: ["./imprimir-rol.component.scss"],
})
export class ImprimirRolComponent implements OnInit {
  constructor() {}
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  ngOnInit(): void {}

  titulo:any = "";

  dataUser: any = [];
  dataSucursal: any = [];
  lstTablaEmpleados: any = [];
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  setearValores(lstTablaEmpleados: any, dataUser: any, dataSucursal: any, titulo:any) {
    this.lstTablaEmpleados = lstTablaEmpleados;
    this.dataSucursal = dataSucursal;
    this.dataUser = dataUser;
    this.titulo = titulo;
  }

  obtenerTotalesPrint(tipo: any, item: any) {
    let resultado: any = 0;
    if(item!=undefined){
      switch (tipo) {
        case "I":
          let valorIng: any = item.find(
            (datos) => datos.nombre == "TOTAL INGRESOS"
          );
          if (valorIng != undefined) {
            resultado = valorIng.valor_cantidad;
          }
          break;
        case "E":
          if(item!=undefined){
            let valorEgr: any = item.find(
              (datos) => datos.nombre == "TOTAL EGRESOS"
            );
            if (valorEgr != undefined) {
              resultado = valorEgr.valor_cantidad;
            }
          }        
          break;
        case "T":
          resultado = item.valorNetoRecibir;
          break;
      }
    } 
    return resultado;
  }


  validaPresentacion(group){
    let valida:boolean = false;
    if(Number(group.valor_cantidad) > 0){
      valida = true;
    }
    return valida;
  }
}
