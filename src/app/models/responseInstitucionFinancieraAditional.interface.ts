export interface InstitucionFinancieraAditionalResponseI {
    current_page:   number;
    data:           IntitucionFinancieraAdi[];
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

export interface IntitucionFinancieraAdi {
    data? : IntitucionFinancieraAdi;
    id_int_financiera: number;
    infn_nombre:       string;
    infn_descripcion:  string;
    infn_keyword:      string;
    parent_id:         number;
    estado_id:         number;
    estado:            Estado;
}

export interface Estado {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       number;
}

