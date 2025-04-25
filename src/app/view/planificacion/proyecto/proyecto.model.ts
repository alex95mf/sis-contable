export interface Proyecto {
    id : number;
    id_programa : number;
    nombre : string;
    actividades : string[];
    fechaInicio : Date;
    fechaFinal : Date;
    objetivo : string;
    presupuesto : number;
}

export enum ESTADO {
    NUEVO = 'NUEVO',
    PENDIENTE = 'PENDIENTE',
    COMPLETO = 'COMPLETO',
    GUARDADO = 'GUARDADO'
  }