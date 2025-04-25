export interface EmployeesResponseI {
  id_empleado: number;
  id_tipo_identificacion: number;
  emp_identificacion: string;
  emp_primer_nombre: string;
  emp_segundo_nombre: string;
  emp_primer_apellido: string;
  emp_segundo_apellido: string;
  emp_full_nombre: string;
  emp_fecha_nacimiento: Date;
  fechajubilacion:Date;
  id_estado_civil: number;
  id_genero: number;
  id_nivel_educativo:number;
  estado_id: number;
  nacionalidad: string;
  tienejubilacion:string;
  region: string;
  localidad: string;
  direccion: string;
  id_codigo_biometrico:string;
  id_tipo_discapacidad: number;
  porcentaje_discapacidad: number;
  emp_telefono: string;
  emp_celular: string;
  emp_correo: string;
  emp_correo_empresarial: string;
  id_tipo_pago:number;
  entidad:string,
  num_cuenta: string,
  tipo_cuenta:string,
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
  emp_fecha_cese?: string|null;
  id_extension_conyuge: number;
  id_iees_jubilado: number;
  id_fondo_reserva_uno_dia: number;
  id_acu_decimo_tercero: number;
  id_acu_decimo_cuarto: number;
  id_acu_fondo_reserva: number;
  id_retenciones_judiciales: number;
  emp_valor_reeten_judicial:string;
  // emp_codigo_trabajo: number;
  id_codigo_trabajo?: number;
  id_sueldo_variable:number;
  valor_sueldo_variable:number;
  valor_retencion_judicial:number;
  marca_biometrico: number;
  // id_countries:number;
  // name_countries:string;
  // id_states:number;
  // name_states: string,
  // id_cities: number,
  // name_cities: string,
  // direccion_domicilio_emp:string;
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
  jornada_parcial_permanente: boolean
}

interface Area {
  id_area: number;
  are_nombre: string;
  are_descripcion: string;
  are_keyword: string;
  estado_id: number;
  programa: Programa;
}

interface Programa {
  id_nom_programa: number;
  nombre:          string;
  descripcion:     string;
  codigo:          string;
  tipo_programa:   string;
  clasificacion_programa:string;

}


interface Cargo {
  id_cargo: number;
  car_nombre: string;
  car_descripcion: string;
  car_keyword: string;
  id_departamento: number;
  sueldo?: number;
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
