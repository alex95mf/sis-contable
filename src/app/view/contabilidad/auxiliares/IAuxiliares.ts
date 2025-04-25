export interface IAuxuliar {
    cod_auxiliar?: string
    codref: string
    tip_aux: string
    nom_tip_aux: string
    descripcion: string
    naturaleza: string
}

export interface IPaginate {
    pageSize: number
    page: number
    length: number
    pageIndex?: number
    pageSizeOptions?: number[]
    showFirstLastButtons?: boolean
}

export interface IOption {
    label: string
    value?: any
}