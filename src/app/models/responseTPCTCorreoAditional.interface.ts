export interface TPCTCorreoAditional{
    current_page:   number;
    data:           TpCtCorreoNom[];
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

export interface TpCtCorreoNom {
    data? : TpCtCorreoNom;
    id_tpct_correo:       number;
    id_empresa:           number;
    cantidad_dias_vencer: number;
    hora:                 string;
    estado_id:            number;
}
