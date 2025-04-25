export interface DepartamentoResponseI {
    id_departamento: number;
    dep_nombre:      string;
    dep_descripcion: string;
    dep_keyword:     string;
    id_area:         number|string;
    estado_id:       number|string;
    catalogo:        Catalogo;
    area:            Area;
}

interface Area {
    id_area:         number;
    are_nombre:      string;
    are_descripcion: string;
    are_keyword:     string;
    estado_id:       number;
    programa:      Programa;
}

interface Programa {
    id_nom_programa: number;
    nombre:          string;
    descripcion:     string;
    codigo:          string;
    tipo_programa:   string;
    clasificacion_programa:string;

}

interface Catalogo {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       null;
}