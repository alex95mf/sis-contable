export interface AreaResponseI {
    id_area:         number;
    are_nombre:      string;
    are_descripcion: string;
    are_keyword:     string;
    estado_id:       number;
    catalogo:        Catalogo;
}

interface Catalogo {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       null;
}
