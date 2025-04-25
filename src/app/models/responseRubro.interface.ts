export interface RubrosResponseI {
  id_rubro: number;
  rub_codigo: string;
  rub_descripcion: string;
  id_cuenta: number;
  porcentaje_al_sueldo: string;
  porcentaje_al_ingreso: string;
  id_aportable: number;
  id_automatico: number;
  id_tipo_rubro: number;
  estado_id: number;
  aportable: Aportable;
  automatico: Aportable;
  estado: Aportable;
  tipo_rubro: Aportable;
  plan_cuenta: PlanCuenta;
}

interface Aportable {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}

interface PlanCuenta {
  id: number;
  tipo: string;
  grupo: string;
  clase: string;
  nivel: string;
  codigo: string;
  codigo_padre: string;
  codigo_oficial: string;
  codigo_migrado: string;
  nombre: string;
  estado: string;
  id_empresa: number;
}
