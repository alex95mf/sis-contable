export interface EmployeesAditionalI {
  current_page: number;
  data: Empleado[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: null;
  path: string;
  per_page: string;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface Empleado {
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
  id_sueldo_variable?: number;
  id_codigo_trabajo?: number;


  estado: Estado;
  tipo_identificacion: Estado;
  estado_civil: Estado;
  genero: Estado;
  area: Area;
  departamento: Departamento;
  cargo: Cargo;
  jornada: Jornada;
  sueldo: Sueldo;

  sueldo_variable?: Estado;
  codigo_trabajo?: Estado;
}

interface Area {
  id_area: number;
  are_nombre: string;
  are_descripcion: string;
  are_keyword: string;
  estado_id: number;
}

interface Cargo {
  id_cargo: number;
  car_nombre: string;
  car_descripcion: string;
  car_keyword: string;
  id_departamento: number;
  estado_id: number;
}

interface Departamento {
  id_departamento: number;
  dep_nombre: string;
  dep_descripcion: string;
  dep_keyword: string;
  id_area: number;
  estado_id: number;
}

interface Estado {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}

interface Jornada {
  id_jornada: number;
  jnd_tipo_jornada: string;
  jnd_keyword: string;
  id_estado_almueza: number;
  id_tiempo_almuerzo: number;
  estado_id: number;
  jordana_detalles: JordanaDetalle[];
  estado_almuerza: Estado;
  tiempo_almuerzo: Estado;
}
interface JordanaDetalle {
  id_jordana_detalle: number;
  id_jornada: number;
  id_dia: number;
  jnd_hora_ingreso: string;
  jnd_hora_salida: string;
  estado_id: number;
  dia: Estado;
}

interface Sueldo {
  id_sueldo: number;
  sld_anio: number;
  id_mes: number;
  id_cargo: number;
  id_tipo_contrato: number;
  sld_codigo_sectorial: string;
  sld_salario_minimo: string;
  estado_id: number;
  cargo: Cargo;
  tipo_contrato: Estado;
}
