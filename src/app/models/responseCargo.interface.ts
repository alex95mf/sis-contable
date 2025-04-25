export interface CargoResponseI {
    id_cargo:        number;
    car_nombre:      string;
    car_descripcion: string;
    car_keyword:     string;
    id_departamento: number;
    estado_id:       number;
    catalogo?:        Catalogo;
    depatamento?:     Depatamento;
}

interface Catalogo {
    id_catalogo:     number;
    cat_nombre:      string;
    cat_descripcion: string;
    cat_keyword:     string;
    parent_id:       number;
}

interface Depatamento {
    id_departamento: number;
    dep_nombre:      string;
    dep_descripcion: string;
    dep_keyword:     string;
    id_area:         number;
    estado_id:       number;
    area:            Area;
}

interface Area {
    id_area:         number;
    are_nombre:      string;
    are_descripcion: string;
    are_keyword:     string;
    estado_id:       number;
}
