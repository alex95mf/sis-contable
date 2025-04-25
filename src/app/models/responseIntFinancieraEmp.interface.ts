export interface InstitucionFinancieraEmpResponseI {
    id_emp_financiera:     number;
    id_empresa:            number;
    id_empleado:           number;
    id_int_financiera:     number;
    id_tipo_cuenta:        number;
    emfn_numero_cuenta:    number;
    emfn_observacion:      null;
    estado_id:             number;
    intitucion_financiera: IntitucionFinanciera;
    tipo_cuenta:           Estado;
    estado:                Estado;
}

export interface Estado {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       number;
}

export interface IntitucionFinanciera {
    id_int_financiera: number;
    infn_nombre:       string;
    infn_descripcion:  string;
    infn_keyword:      string;
    parent_id:         null;
    estado_id:         number;
}
