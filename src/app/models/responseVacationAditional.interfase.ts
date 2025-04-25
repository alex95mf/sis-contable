export interface VacacionAditionalResponseI {
    current_page:   number;
    data:           Vacaciones[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    next_page_url:  null;
    path:           string;
    per_page:       string;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface Vacaciones {
    data? : Vacaciones;
    id_vacacion:           number;
    id_empresa:            number;
    id_empleado:           number;
    vac_anio:              number;
    vac_periodos_totales:  number;
    vac_dias_acumulados:   number;
    vac_gozados:           number;
    vac_restantes:         number;
    vac_horas_base?:         number;
    vac_observacion?:         number;
    // // vac_fecha_inicio:      null;
    // // vac_fecha_fin:         null;
    vc_valor_liquidado:    string;
    vc_valor_por_liquidar: string;
    id_procesado_rol:      number;
    estado_id:             number;
    vac_detalle_estado_id?: number|string;
    empleado:              Empleado;
    procesando_rol:        Estado;
    estado:                Estado;
    vaciones_detalles:     VacionesDetalle[];
    emp_full_nombre?:    string;
    cantidad_horas_fal_per_vac?:    string|number;
  
}

export interface Empleado {
    id_empleado:                   number;
    id_tipo_identificacion:        number;
    emp_identificacion:            string;
    emp_primer_nombre:             string;
    emp_segundo_nombre:            string;
    emp_primer_apellido:           string;
    emp_segundo_apellido:          string;
    emp_full_nombre:               string;
    emp_fecha_nacimiento:          Date;
    id_estado_civil:               number;
    id_genero:                     number;
    estado_id:                     number;
    id_tipo_discapacidad:          number;
    porcentaje_discapacidad:       number;
    emp_telefono:                  string;
    emp_celular:                   string;
    emp_correo:                    string;
    emp_correo_empresarial:        string;
    id_area:                       number;
    id_departamento:               number;
    id_cargo:                      number;
    id_jornada:                    number;
    id_tipo_salario:               number;
    id_sueldo:                     number;
    id_tipo_nomina_pago:           number;
    id_tipo_anticipo:              number;
    emp_porcentaje_valor_quincena: string;
    id_config_semanal:             number;
    emp_fecha_ingreso:             Date;
    id_extension_conyuge:          number;
    id_iees_jubilado:              number;
    id_fondo_reserva_uno_dia:      number;
    id_acu_decimo_tercero:         number;
    id_acu_decimo_cuarto:          number;
    id_acu_fondo_reserva:          number;
    id_retenciones_judiciales:     number;
    id_empresa:                    number;
    emp_fecha_salida:              null;
    emp_valor_sueldo_variable:     null;
    emp_valor_reeten_judicial:     null;
    id_sueldo_variable:            number;
    id_codigo_trabajo:             number;
}

export interface Estado {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       number;
}


export interface VacionesDetalle {
    data? : VacionesDetalle;
    id_vac_detalle:   number;
    id_vacacion:      number;
    id_empresa:       number;
    id_empleado:      number;
    vdt_anio:         number;
    vdt_fecha_inicio: Date;
    vdt_fecha_fin:    Date;
    vdt_num_horas:    number;
    estado_id?:        number;
    vac_detalle_estado_id:        number;
    vdt_observacion:  string;
    estado_detalle_vacion:                Estado;
}
