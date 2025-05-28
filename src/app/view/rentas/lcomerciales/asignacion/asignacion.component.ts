import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { AsignacionService } from './asignacion.service';
import * as variablesGlobales from "../../../../global";
import { FormInspectorComponent } from './form-inspector/form-inspector.component';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.scss']
})

// http://localhost:4200/#/rentas/lcomerciales/asignacion

export class AsignacionComponent implements OnInit {
  texto_barra_carga: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  barra_carga: CcSpinerProcesarComponent;
  titulo = "Asignación de Inspector";
  @ViewChild(CcSpinerProcesarComponent, {static: false})
  txt_barra_carga: string;

  botonera: any;
  datos_usuario: any;
  permisos: any;
  tipo_inspeccion: string;
  aprueba: string;
  asignacion_dt: any = [];

  estado_actual = 0;

  filtro: any;
  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;

  estados_ins: any = {
    'A': 'far fa-check text-success',
    'F': 'far fa-times text-danger',
    'P': 'far fa-minus-circle text-primary'
  }

  paginacion: any;

  lista_estados: any = [];
  lista_tipos_resultado: any = [];
  lista_tipos_inspeccion: any = [];

  constructor(
    private modal: NgbModal,
    private srvTostar: ToastrService,
    private srvComun: CommonService,
    private srvVarComun: CommonVarService,
    private srvAsignacion: AsignacionService
  ) {
    this.srvVarComun.editAsignacion.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargarAsignaciones();
        }
      }
    );
  }

  ngOnInit(): void {
    // console.log("Iniciando pantalla de asignación de inspectores");
    this.botonera = [];

    this.tipo_inspeccion = "0";

    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);

    this.filtro = {
      razon_social: undefined,
      local_comercial: undefined,
      numero_orden: undefined,
      aprueba: this.aprueba,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      tipo_inspeccion:0,
      // fecha_desde: undefined,
      // fecha_hasta: undefined,
      estado: undefined,
      filterControl: ""
    };

    this.lista_estados = [
      {
        valor: 'A',
        etiqueta: "Ya asignados",
      },
      {
        valor: 'P',
        etiqueta: "Por asignar",
      },
      {
        valor: 'T',
        etiqueta: "Todos",
      }
    ];

    this.lista_tipos_inspeccion = [
      {
        valor: 'HIGIENE',
        etiqueta: 'HIGIENE'
      },
      {
        valor: 'COMISARIA',
        etiqueta: 'COMISARÍA'
      },
      {
        valor: 'PLANIFICACION',
        etiqueta: 'PLANIFICACIÓN'
      },
      {
        valor: 'RENTAS',
        etiqueta: 'RENTAS'
      }
    ];

    this.lista_tipos_resultado = [
      {
        valor: 'F',
        etiqueta: 'FALLIDO'
      },
      {
        valor: 'P',
        etiqueta: 'PENDIENTE'
      },
      {
        valor: 'A',
        etiqueta: 'APROBADO'
      }
    ];

    this.paginacion = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(() => {
      this.validarPermisos();
    }, 0);
  }

  validarPermisos() {
    this.texto_barra_carga = "Verificando permisos del usuario...";
    this.barra_carga.ctlSpinner(true);

    this.datos_usuario = JSON.parse(localStorage.getItem("Datauser"));

    let parametros = {
      codigo: variablesGlobales.fRPAranceles, // Cambiar por el correspondiente.
      id_rol: this.datos_usuario.id_rol
    };

    this.srvComun.getPermisionsGlobas(parametros).subscribe(
      (res) => {
        this.permisos = res["data"][0];
        if (this.permisos.ver == "0") {
          this.barra_carga.ctlSpinner(false);
          this.srvTostar.warning("No tiene permisos para ver este formulario.", this.titulo);
          this.botonera = [];
        } else {
          this.cargarAsignaciones();
        }
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

  consultar() {
    Object.assign(
      this.paginacion,
      { page: 1 }
    )

    this.cargarAsignaciones()
  }

  cargarAsignaciones() {
    this.texto_barra_carga = "Cargando listado de Inspecciones...";
    this.barra_carga.ctlSpinner(true);

    let datos = {
      params: {
        tipo_inspeccion: this.tipo_inspeccion,
        filter: this.filtro,
        paginate: this.paginacion
      }
    };
    console.log(datos);
    this.srvAsignacion.obtenerAsignaciones(datos).subscribe(
      (res) => {
        console.log(res);
        this.paginacion.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.asignacion_dt = res['data']['data'];


        }
         else {
          this.asignacion_dt = Object.values(res['data']['data']);
        }
        this.asignacion_dt.forEach(e => {
          //console.log(e.aprueba)
          e.aprueba = this.estados_ins[e.aprueba]
        })
        this.barra_carga.ctlSpinner(false);
      },
      (error) => {
        this.barra_carga.ctlSpinner(false);
        this.srvTostar.info(error.error.message);
      }
    );
  }

  formularioAsignacion({id_inspeccion_res, fk_inspector, fecha_asignacion, tipo_inspeccion}) {
    const invocar_modal = this.modal.open(FormInspectorComponent, {
      size: "lg",
      backdrop: "static",
    });
    invocar_modal.componentInstance.titulo = this.titulo;
    invocar_modal.componentInstance.tipo_inspeccion = tipo_inspeccion;
    invocar_modal.componentInstance.permisos = this.permisos;
    invocar_modal.componentInstance.id_inspeccion_res = id_inspeccion_res;
    invocar_modal.componentInstance.fk_inspector = fk_inspector ?? 0;
    invocar_modal.componentInstance.fecha_asignacion = fecha_asignacion;
  }

  metodoGlobal(evento) {
  }

  cambiarEstadoBusqueda(evento) {
    if(evento != 'T'){
      let temp = [];
      temp.push(evento);
      this.filtro.estado = temp;
      temp = [];
    } else {
      this.filtro.estado = undefined;
    }
  }

  cambiarTipoInspeccion(evento) {
    this.tipo_inspeccion = evento;
    this.titulo = "Asignación de Inspector de " + this.tipo_inspeccion;
    // this.cargarAsignaciones();
  }


  cambiarTipoResultado(evento) {
    this.tipo_inspeccion = evento;
    this.titulo = "Asignación de Inspector de " + this.tipo_inspeccion;
    // this.cargarAsignaciones();
  }

  limpiarFiltros() {
    this.filtro = {
      razon_social: undefined,
      local_comercial: undefined,
      numero_orden: undefined,
      aprueba: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      // fecha_desde: undefined,
      // fecha_hasta: undefined,
      estado: undefined,
      filterControl: ""
    };
    // this.cargarAsignaciones()
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginacion, newPaginate);
    this.cargarAsignaciones();
  }

}
