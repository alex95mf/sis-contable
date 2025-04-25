export interface ReferenciaEmpleadoResponseI {
  id_emp_referencia: number;
  id_empleado: number;
  tipo_referencia_id: number;
  // cat_nombre?: string;
  nombre: string;
  empresa: string;
  telefono: string;
  cargo: string;
  estado_id: number;
  tipo_referencia: Estado;
  estado: Estado;
}

export interface Estado {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}
