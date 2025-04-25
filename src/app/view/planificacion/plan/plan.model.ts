export interface Plan 
{
    id : number;
    nombre : string;
    presupuesto? : number,
    tipo: string,
    descripcion? : string,
    estado : string,
    id_empresa : number,
    id_presupuesto? : number
}

export interface Presupuesto
{
    id?: number,
    periodo: number,
    valor: number,
    asignado: number,
    diferencia: number,
    estado: string,
    usuario?: number
}