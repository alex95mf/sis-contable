export interface DiaTrabajadoAditionalResponseI {
    current_page:   number;
    data:           DiaTrabajado[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    next_page_url:  string;
    path:           string;
    per_page:       string;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface DiaTrabajado {
    data? : DiaTrabajado;
    id_dia_trabajado:                    number;
    id_empresa:                          number;
    ditr_anio:                           number;
    id_mes:                              number;
    id_empleado:                         number;
    ditr_dias_trabajados:                number;
    ditr_dias_adicionales:               number;
    ditr_horas_en_contra_falta_permisos: number;
    ditr_dias_efectivos:                 number;
    ditr_horas_efectivos:                number;
    ditr_horas_trabajados:               number;
    ditr_horas_adicionales:              number;
    ditr_horas_25:                       number|string;
    ditr_horas_50:                       number|string;
    ditr_horas_60:                       number|string;
    ditr_horas_100:                      number|string;
    ditr_horas_restadas:                 number;
    ditr_horas_efectivas:                number;
    ditr_fecha_generacion:               Date;
    estado_id:                           number;
    emp_full_nombre:                     string;
    emp_identificacion:                  string;
    emp_fecha_ingreso:                   Date;
    mes_generar:                         string;
    id_sueldo:                           number;
    sld_salario_minimo:                  string;
    estado_generacion:                   string;
    aux:                                 string;
    ditr_modo_generacion:                string;
    carga_excel?:                        boolean;
}
