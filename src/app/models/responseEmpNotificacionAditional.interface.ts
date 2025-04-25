export interface SMTPEmailAditionalResponseI {
    current_page:   number;
    data:           NotificacionEmp[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface NotificacionEmp {
    data? : NotificacionEmp;
    id_empleado:               number;
    emp_identificacion:        string;
    emp_full_nombre:        string;
    emp_correo:                     string;
    emp_correo_empresarial:        string;
    emp_fecha_ingreso:         Date;
    id_sueldo:                 number;
    id_tipo_contrato:          number;
    sld_salario_minimo:        string;
    cat_nombre_tipo_contrato:  string;
    cat_keyword_tipo_contrato: string;
    id_cat_detalle:            number;
    cantidad_tiempo:           number;
    id_tiempo:                 number;
    cat_nombre_tiempo:         string;
    cat_keyword_tiempo:        string;
    notificacion_empleado_nom: NotificacionEmpleadoNom;
}

export interface NotificacionEmpleadoNom {
    id_emp_notificacion: number;
    id_empresa:          number;
    id_empleado:         number;
    fecha_notificacion:  Date;
    fecha_fin_contrao:   Date;
    observacion:         null;
}
