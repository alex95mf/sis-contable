export interface CatalogoNominaResponseI {
  id_catalogos_nomina: number;
  noc_nombre: string;
  noc_descripcion: string;
  noc_keyword: string;
  noc_num_casillero: number;
  parent_id: number;
  valor_tope: string;
  valor_proyectado: string|number;
  valor_real: string|number;
}
