export interface EducacionEmpleadoResponseI {
  id_emp_educacion: number;
  id_empleado: number;
  nivel_educacion_id: number;
  num_cursos: number;
  institucion: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  grado_obtenido: string;
  estado_id: number;
  nivel_educacion: Estado;
  estado: Estado;
}

interface Estado {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}
