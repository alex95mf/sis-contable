export interface JornadaNominaResponseI {
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

interface Estado {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       number;
}

interface JordanaDetalle {
    id_jordana_detalle: number;
    id_jornada:         number;
    id_dia:             number;
    jnd_hora_ingreso:   string;
    jnd_hora_salida:    string;
    estado_id:          number;
    estado:             Estado;
    dia:                Estado;
}
