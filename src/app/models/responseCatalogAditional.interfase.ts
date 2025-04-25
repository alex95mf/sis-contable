export interface CatalogAditionalResponseI {
    current_page:   number;
    data:           CatalogoDetalle[];
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

export interface CatalogoDetalle {
    data?: CatalogoDetalle;
    id_cat_detalle:  number;
    id_catalogo:     number;
    cantidad_tiempo: number;
    id_tiempo:       number;
    tiempo?:          Catalog;
}

export interface Catalog {
    data?: Catalog;
    id_catalogo:       number;
    cat_nombre:        string;
    cat_descripcion:   string;
    cat_keyword:       string;
    parent_id:         number;
    catalogo_detalle?: CatalogoDetalle | null;
}
