import TipoContrato from "./ITipoContrato";

export default interface Rubro {
    id_rubro: number;
    rub_codigo: string;
    rub_descripcion: string;
    tipo_contrato?: Array<TipoContrato>;
    lst_tipo_contrato?: any;
  }