export default interface TipoContrato {
    id_catalogo: number;
    cat_nombre: string;
    cat_descripcion: string;
    cat_keyword: string;
    pivot?: Pivot;
  }

  interface Pivot {
    fk_rubro: number;
    fk_tipo_contrato: number;
    estado?: boolean;
  }