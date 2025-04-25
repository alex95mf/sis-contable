export interface CargaFamiliarResponseI {
  id_carga: number;
  id_empleado: number;
  cedula_carga: string;
  nombres_general: string;
  apellidos_general: string;
  relacion: Relacion;
  fecha_nacim: Date;
  afiliado: number;
  discapacidad: number;
  id_empresa: number;
  edad_descripcion?: string;
}

interface Relacion {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}
