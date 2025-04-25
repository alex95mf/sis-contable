export interface HistoryContractsResponseI {
    id_emp_contrato: number;
    fk_empleado : number;
    num_contrato : string;
    fk_tipo_contrato: number;
    fk_area : number;
    fk_departamento : number;
    fk_cargo : number;
    fk_sueldo : number;
    fecha_ingreso : any ;
    fecha_inicio : any ;
    fecha_cese: any ;
    observacion : string;
    sueldo: number;
    estado : string;
    fk_usuario : number
    
}