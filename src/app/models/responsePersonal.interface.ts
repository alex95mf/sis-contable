export interface PersonalResponseI {
    id_personal:            number;
    nombres:                string;
    apellidos:              string;
    tipodoc:                string;
    numdoc:                 string;
    foto:                   string;
    sexo:                   string;
    fechanacim:             Date;
    estadocivil:            string;
    profesion:              string;
    discapacidad:           number;
    discapacidadporcentaje: number;
    direccion:              string;
    telefono:               string;
    celular:                string;
    email:                  string;
    fechaingreso:           Date;
    fechasalida:            null;
    cargo:                  string;
    id_usuario:             number;
    id_grupo:               number;
    tipocontrato:           string;
    seguro:                 number;
    jornadalaboral:         string;
    sueldobase:             string;
    sueldohora:             string;
    nota:                   null;
    estado:                 string;
    id_empresa:             number;
    id_sucursal:            number;
    decimo_tercero:         string;
    decimo_cuarto:          string;
    gastos_personales:      GastosPersonale[];
}

interface GastosPersonale {
    id_gasto_personal:    number;
    gtp_anio:             string;
    id_catalogos_nomina:  number;
    id_personal:          number;
    gtp_valor_tope:       string;
    gtp_valor_proyectado: string;
    gtp_valor_real:       string;
    estado_id:            number;
    codigo_formulario:    CodigoFormulario;
}

interface CodigoFormulario {
    id_catalogos_nomina: number;
    noc_nombre:          string;
    noc_descripcion:     string;
    noc_keyword:         string;
    noc_num_casillero:   number;
    parent_id:           number;
    valor_tope:         string;
}