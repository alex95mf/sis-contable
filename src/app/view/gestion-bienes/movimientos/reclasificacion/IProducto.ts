export interface IProducto {
    id_producto?: number;
    codigoproducto: string;
    nombre: string;
    stock: number;
    codigoanterior?: string;
}

export interface IFilter {
    codigo: string | null;
    descripcion: string | null;
}

export interface IProductoResponse {
    total: number;
    data: Array<IProducto>;
}