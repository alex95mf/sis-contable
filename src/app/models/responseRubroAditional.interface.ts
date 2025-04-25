export interface RubroAditionalResponseI {
    current_page:   number;
    data:           Rubro[];
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

export interface Rubro {
    id_rubro:              number;
    rub_codigo:            string;
    rub_descripcion:       string;
    id_cuenta:             number;
    porcentaje_al_sueldo:  string;
    porcentaje_al_ingreso: string;
    id_aportable:          number;
    id_automatico:         number;
    id_tipo_rubro:         number;
    estado_id:             number;
}
