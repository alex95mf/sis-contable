export interface DepartemtAditionalI {
  current_page: number;
  data: Departamento[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: string;
  prev_page_url: null;
  to: number;
  total: number;
}

interface Departamento {
  id_departamento: number;
  dep_nombre: string;
  dep_descripcion: string;
  dep_keyword: string;
  id_area: number;
  estado_id: number;
  catalogo: Catalogo;
  area: Area;
}

interface Area {
  id_area: number;
  are_nombre: string;
  are_descripcion: string;
  are_keyword: string;
  estado_id: number;
}

interface Catalogo {
  id_catalogo: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_keyword: string;
  parent_id: number;
}
