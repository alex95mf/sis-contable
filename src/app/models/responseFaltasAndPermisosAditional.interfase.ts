export interface FaltaAndPermisoAditionalResponseI {
    current_page:   number;
    data:           FaltaPermiso[];
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

export interface FaltaPermiso {
    data?: FaltaPermiso;
    // indc_anio? : number;
    emp_full_nombre?: string,
    id_falt_perm:      number;
    id_empleado:       number;
    flpr_anio:         number;
    id_mes:            number;
    id_tipo_permiso:   number;
    id_afecta_rol:     number;
    flpr_fecha_inicio: any;
    flpr_fecha_fin:    any;
    flpr_num_horas:    number;
    flpr_observacion:  string;
    estado_id:         number;
    flpr_estado_id:         number;
    mes?:               AfectaRol;
    tipo_permiso?:      AfectaRol;
    afecta_rol?:        AfectaRol;
    estado?:            AfectaRol;
    estado_falta_permiso : AfectaRol;
}

export interface AfectaRol {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       number;
}
