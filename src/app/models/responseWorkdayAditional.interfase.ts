export interface WorkdayAditionalI {
    current_page:   number;
    data:           Jornada[];
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

export interface Jornada {
    id_jornada:         number;
    jnd_tipo_jornada:   string;
    jnd_keyword:        string;
    id_estado_almueza:  number;
    id_tiempo_almuerzo: number;
    estado_id:          number;
    estado_almuerza:    Estado;
    tiempo_almuerzo:    Estado;
    estado:             Estado;
    jordana_detalles:   JordanaDetalle[];
}

export interface Estado {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       number;
}

export interface JordanaDetalle {
    id_jordana_detalle: number;
    id_jornada:         number;
    id_dia:             number;
    jnd_hora_ingreso:   string;
    jnd_hora_salida:    string;
    estado_id:          number;
    dia:                Estado;
}
