import { Injectable } from "@angular/core";
export interface boton{
    icon?: string,
    texto?: string,
    datoBadge?:any
}

export interface cbtn {
    orig?: string,
    accion?: any ,
    paramAccion?: any,
    boton?: boton,
    permiso?: any,
    showtxt?: any,
    showimg?: any,
    showbadge?: any,
    clase?: any,
    accion2?:any,
    paramAccion2?: any,
    paramAccion3?: any,
    habilitar?:any
}


@Injectable()
export class Botones {
    public todos: cbtn[];
    name1 : any ;

    constructor() {
        this.name1=Botones.prototype;
     }

    public getBotones() {
         this.todos = [
            {
                orig: "aprobarRegla",
                accion: this.name1.doThing2 , paramAccion: "X",
                boton: { icon: "fa fa-search", texto: "Aprobar" },
                permiso: true,
                showtxt: true,
                showimg: true,
                showbadge: false,
                clase:"btn-primary", habilitar:false

            },
            {
                orig: "aprobarRegla2",
                accion: "ok", paramAccion: "",
                boton: { icon: "fa fa-search", texto: "Cancelar" },
                permiso: false,
                showtxt: true,
                showimg: true,
                showbadge: false,
                clase:"btn-primary", habilitar:false

            },
            {
                orig: "aprobarRegla3",
                accion: "ok", paramAccion: "",
                boton: { icon: "fa fa-search", texto: "Consulta" },
                permiso: true,
                showtxt: true,
                showimg: true,
                showbadge: false,
                clase:"btn-primary", habilitar:false

            },
            {
                orig: "aprobarRegla4",
                accion: this.name1.doThing , paramAccion: "",
                boton: { icon: "fa fa-search", texto: "Consulta" },
                permiso: true,
                showtxt: false,
                showimg: true,
                showbadge: false,
                clase:"btn-primary", habilitar:false

            }

        ]
        return this.todos;
    }


     doThing(value1: any):void  {        
        // console.log('llamada de funcion 1');
        // console.log('valor1 ' + JSON.stringify({value1}));
    };

     doThing2():void {
        // console.log('llamada de funcion 2');

    }


}
