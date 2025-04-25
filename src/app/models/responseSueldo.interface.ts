export interface SueldoResponseI {
  id_sueldo: number;
  sld_anio: number;
  id_mes: number;
  id_cargo: number;
  id_tipo_contrato: number;
  sld_codigo_sectorial: string;
  sld_grado_ocupacional: number;
  sld_grado: string;
  sld_salario_minimo: string;
  estado_id: number;
  tipo_contrato: Estado;
  mes: Mes;
  cargo: Cargo;
  estado: Estado;
  ocupacional:Ocupacional;
}

interface Cargo {
  id_cargo: number;
  car_nombre: string;
  car_descripcion: string;
  car_keyword: string;
  id_departamento: number;
  estado_id: number;
}

interface Estado {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}

interface Mes {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}

interface Ocupacional {
  id_grb_ocupacional: number;
  grb_grupo_ocupacional: string;
  grb_nivel_grado: number;
  grb_rbu_valor: number;
}