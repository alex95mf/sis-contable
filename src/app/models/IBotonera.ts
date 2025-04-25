export default interface Botonera {
    orig: string;
    paramAccion: string;
    boton: Boton,
    permiso: boolean;
    showtxt: boolean;
    showimg: boolean;
    showbadge: boolean;
    clase: string;
    habilitar: boolean;
    printSection?: string;
    imprimir?: boolean;
  }

  interface Boton {
    icon: string;
    texto: string;
    datoBadge?: string
  }