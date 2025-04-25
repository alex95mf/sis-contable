export interface DocFichaAditionalResponseI {
  current_page: number;
  data: DocFicha[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface DocFicha {
  data?: DocFicha;
  id_doc_ficha: number;
  id_empleado: number;
  tipo_archivo_id: number;
  nombre_archivo: string;
  extension: string;
  peso_archivo : number;
  archivo_base_64: string;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  estado_id: number;
  estado: Estado;
  tipo_archivo: Estado;
  empleado?: Empleado;
  full_nombre_empleado?: string;
}


// type DocFichaDefaultValues = Pick<DocFicha, 'fecha_modificacion'>;

// const defaultPersonValues: DocFichaDefaultValues = {
//   fecha_modificacion: '-'
// }

interface Estado {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}

interface Empleado {
  id_empleado: number;
  id_tipo_identificacion: number;
  emp_identificacion: string;
  emp_primer_nombre: string;
  emp_segundo_nombre: string;
  emp_primer_apellido: string;
  emp_segundo_apellido: string;
  emp_full_nombre: string;
  emp_fecha_nacimiento: Date;
  id_estado_civil: number;
  id_genero: number;
  estado_id: number;
  id_tipo_discapacidad: number;
  porcentaje_discapacidad: number;
  emp_telefono: string;
  emp_celular: string;
  emp_correo: string;
  emp_correo_empresarial: string;
  id_area: number;
  id_departamento: number;
  id_cargo: number;
  id_jornada: number;
  id_tipo_salario: number;
  id_sueldo: number;
  id_tipo_nomina_pago: number;
  id_tipo_anticipo: number;
  emp_porcentaje_valor_quincena: string;
  id_config_semanal: number;
  emp_fecha_ingreso: Date;
  id_extension_conyuge: number;
  id_iees_jubilado: number;
  id_fondo_reserva_uno_dia: number;
  id_acu_decimo_tercero: number;
  id_acu_decimo_cuarto: number;
  id_acu_fondo_reserva: number;
  id_retenciones_judiciales: number;
}
