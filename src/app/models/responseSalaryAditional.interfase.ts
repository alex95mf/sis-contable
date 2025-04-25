export interface SalaryAditionalI {
    current_page:   number;
    data:           Sueldo[];
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

export interface Sueldo {
    id_sueldo:            number;
    sld_anio:             number;
    id_mes:               number;
    id_cargo:             number;
    id_tipo_contrato:     number;
    sld_codigo_sectorial: string;
    sld_salario_minimo:   string;
    estado_id:            number;
    tipo_contrato:        Estado;
    mes:                  Estado;
    cargo:                Cargo;
    estado:               Estado;
}

export interface Cargo {
    id_cargo:        number;
    car_nombre:      string;
    car_descripcion: string;
    car_keyword:     string;
    id_departamento: number;
    estado_id:       number;
}

export interface Estado {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       number;
}
