import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { FormHigieneService } from '../form-higiene/form-higiene.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import moment from 'moment';
import { ModalInspeccionesComponent } from './modal-inspecciones/modal-inspecciones.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { CommonService } from 'src/app/services/commonServices';
import { FormRentasService } from './form-rentas.service';
import { FormComisariaService } from '../form-comisaria/form-comisaria.service';
import { ModalActivosComponent } from './modal-activos/modal-activos.component';
import { ModalVehiculosComponent } from '../form-comisaria/modal-vehiculos/modal-vehiculos.component';


@Component({
standalone: false,
  selector: 'app-form-rentas',
  templateUrl: './form-rentas.component.html',
  styleUrls: ['./form-rentas.component.scss']
})
export class FormRentasComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle: string = "Ingreso de formulario de Inspección (Rentas)";

  vmButtons: any = [];
  dataUser: any;
  permisos: any;

  inspeccion: any;
  orden: any = {
    id_inspeccion_orden: null,
    uso_suelo: null,
  }
  inspeccion_label: string;
  local_comercial: any;

  rentas_res: any;
  higiene_res: any;
  comisaria_res: any;
  planificacion_res: any;
  cantidad_label: String = "Cantidad";
  cantidad_disabled: boolean = false;

  // Anexos
  fileList: FileList
  fileName: string

  catalogos: any = {
    preguntas: [],
    sectores: [],
    tipo_neg: [],
    grupo_neg: [],
    tipo_letrero: [],
    via_publica: [],
    tipo_via_publica: [],
  };

  inspec: any = {
    local_comercial: { razon_social: ""}
  }

  formulario: any = [];
  formularioBackup: any = [];

  letreros: any = [];
  viaPublica: any = [];

  letrerosBackup:  any = [];
  viaPublicaBackup:  any = [];

  listaTipoLocal: any = [
    { value: "MINOR", label: "Minorista" },
    { value: "MAYOR", label: "Mayorista" },
  ]

  listaRespuestas: any = [
    "SI", "NO"
  ]

  listaCategorias: any = []

  listaSubCategorias: any = []

  listaSubCatFiltrada: any = [];

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  isAdmin: boolean = true;
  letEdit: boolean = false;
  disableVehiculos: boolean = true;
  cat_step: any = 1;

  fotos: any = [];
  fotosEliminar: any = [];

  fotosHigiene: any = [];
  fotosComisaria: any = [];
  fotosPlanificacion: any = [];

  cxc: any = {
    orden_inspeccion: 0,
    local: 0,
    impuestos: []
  }


  listaEstados = [
    {
      value: "B",
      label: "Bueno",
    },
    {
      value: "R",
      label: "Regular",
    },
    {
      value: "M",
      label: "Malo",
    },
  ];

  constructor(
    private modalSrv: NgbModal,
    private commonVarSrv: CommonVarService,
    public commonSrv: CommonService,
    private toastr: ToastrService,
    private formSrv: FormRentasService,
    private apiService: FormComisariaService,
  ) {

    this.commonVarSrv.getInspeccionCompleta.asObservable().subscribe(
      (res) => {

        this.restoreForm();
        console.log(res);
        this.cat_step = 1;

        let resultados = res.resultados;
        Object.assign(this.orden, { id_inspeccion_orden: res.id_inspeccion_orden, uso_suelo: res.uso_suelo })
        this.local_comercial = res.fk_local;
        this.inspeccion_label = res.numero_orden;

        Object.assign(this.cxc, { orden_inspeccion: res.numero_orden, local: res.fk_local.id_local })

        if (this.local_comercial.local_turistico) {
          this.cxc.impuestos.push({"LOCALES TURISTICOS": {
            categoria: this.local_comercial.lt_categoria.descripcion,
            categoria_2: this.local_comercial.lt_categoria_2.descripcion,
            cantidad: this.local_comercial.lt_cantidad
          }})
        }

        let rentas: any;
        let higiene: any;
        let comisaria: any;
        let planificacion: any;

        for (let r of resultados){
          if(r.tipo_inspeccion=="RENTAS"){
            rentas = r;
          } else if (r.tipo_inspeccion=="HIGIENE"){
            higiene = r;
          } else if (r.tipo_inspeccion=="COMISARIA"){
            comisaria = r;
          } else if (r.tipo_inspeccion=="PLANIFICACION"){
            planificacion = r;
          }
        }

        this.cat_step = rentas.r_categoria?2:1;

        if (comisaria) this.disableVehiculos = comisaria.c_esintroductor !="SI";

        this.inspeccion = rentas;

        // para mandar a modal vehiculos desde rentas
        if (comisaria) {
          this.inspec = comisaria;
          this.inspec.local_comercial = {
            razon_social: res.fk_local.razon_social
          }
        }

        // para manejar campos de local turistico
        let categoria = rentas.r_categoria;
        this.listaSubCatFiltrada = this.listaSubCategorias.filter(sc => sc.grupo == categoria);
        this.handleLabel(categoria);

        if (rentas.estado == "C") {
          this.letEdit = false;
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;

        } else { //estado = P o A
          this.letEdit = true;
          this.vmButtons[0].habilitar = false;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = true;

        }

        if (rentas.estado == 'C' || rentas.estado == 'A') {
          this.rentas_res = {
            tipo_local: rentas.r_tipolocal,
            catastro: rentas.r_catastro,
            patrimonio: rentas.r_patrimonio,
            area_local: rentas.r_area,
            es_turistico: rentas.r_esturistico,
            categoria: rentas.r_esturistico=="SI" ? rentas.r_categoria : 0,
            subcategoria: rentas.r_esturistico=="SI" ? rentas.r_categoria_2 : 0,
            local_cantidad: rentas.r_esturistico=="SI" ? rentas.r_local_cantidad : 0,
            observacion: rentas.observacion,
            aprobado: (rentas.aprueba=="A" || rentas.aprueba==1) ? true : false,
            fecha: moment(rentas.fecha).format('YYYY-MM-DD'),
            plazo_maximo: (rentas.aprueba=="A" || rentas.aprueba==1) ? moment(new Date()) : moment(rentas.fecha_proxima_visita).format('YYYY-MM-DD'),
            estado: rentas.estado,
            contabilidad: false,
          }

          // if (rentas.r_esturistico == "SI") this.cxc.impuestos.push({"LOCALES TURISTICOS": { categoria: rentas.r_categoria, subcategoria: rentas.r_categoria_2 }})
          console.log(rentas.fotos);
          this.fotos = rentas.fotos;
        } else {
          this.rentas_res = {
            tipo_local: 0,
            catastro: "",
            patrimonio: 0,
            area_local: 0,
            es_turistico: 0,
            categoria: 0,
            subcategoria: 0,
            local_cantidad:0,
            observacion: "",
            aprobado: false,
            fecha: res.fecha,
            plazo_maximo: moment(new Date()).format('YYYY-MM-DD'),
            estado: 'P',
            contabilidad: false,
          }
          this.fotos = [];
        }

        if (higiene) {
          if (higiene.estado == 'C' || higiene.estado == 'A') {
            let detalles: any = higiene.detalles[0];
            this.higiene_res = {
              cab: {
                tipo_inspeccion: "HIGIENE",
                fecha: moment(higiene.fecha).format('YYYY-MM-DD'),
                observacion: higiene.observacion,
                aprueba: (higiene.aprueba=="A" || higiene.aprueba==1) ? true : false,
                fecha_proxima_visita: (higiene.aprueba=="A" || higiene.aprueba==1) ? moment(new Date()) : moment(higiene.fecha_proxima_visita).format('YYYY-MM-DD'),
                estado: higiene.estado,
              },
              det: {
                h_respuesta: 0,
                h_estado: 0,
                h_cantidad: 0,
              }
            }
            if(detalles){

              this.higiene_res.det.h_respuesta = detalles.h_respuesta;
              this.higiene_res.det.h_estado = detalles.h_estado;
              this.higiene_res.det.h_cantidad = detalles.h_cantidad;

              if (detalles.h_respuesta == "SI") this.cxc.impuestos.push({"PESAYMEDIDA": { tipo: this.local_comercial.tipo_negocio, cantidad: detalles.h_cantidad }})

            }

            this.fotosHigiene = higiene.fotos;
          } else {
            this.higiene_res.cab.estado = 'P';
            this.fotosHigiene = [];
          }
        }

        if (comisaria) {
          if (comisaria.estado == 'C' || comisaria.estado == 'A') {
            let detalles: any = comisaria.detalles;

            if(detalles.length>0){
              this.comisaria_res.det.formulario.forEach(e => {
                e.c_respuesta = detalles.find(p => e.c_num == p.c_pregunta).c_respuesta;
                e.c_dias = detalles.find(p => e.c_num == p.c_pregunta).c_dias;
                e.c_anio = detalles.find(p => e.c_num == p.c_pregunta).c_anio;
                e.c_observacion = detalles.find(p => e.c_num == p.c_pregunta).c_observacion;
              });
            }

            this.comisaria_res.cab.tipo_inspeccion = "COMISARIA";
            this.comisaria_res.cab.fecha = moment(comisaria.fecha).format('YYYY-MM-DD');
            this.comisaria_res.cab.observacion= comisaria.observacion;
            this.comisaria_res.cab.aprueba= (comisaria.aprueba=="A" || comisaria.aprueba==1) ? true : false;
            this.comisaria_res.cab.fecha_proxima_visita= (comisaria.aprueba=="A" || comisaria.aprueba==1) ? moment(new Date()) : moment(comisaria.fecha_proxima_visita).format('YYYY-MM-DD');
            this.comisaria_res.cab.estado= comisaria.estado;

            if (comisaria.c_esintroductor == "SI") this.cxc.impuestos.push({"INTRODUCTOR": { cantidad: 0 }})

            this.fotosComisaria = comisaria.fotos;

          } else {
            this.comisaria_res.cab.estado = 'P';
            this.fotosComisaria = [];
          }
        }

        if (planificacion) {
          if (planificacion.estado == 'C' || planificacion.estado == 'A') {
            let detalles: any = planificacion.detalles;

            let datos_vp: any[] = []
            if (detalles.length>0){

              this.planificacion_res.det.viaPublica.forEach(e => {
              e.p_vp_aplica = detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_aplica == 0 ? false : true,
              e.p_vp_dimension_1 = detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension_1,
              e.p_vp_dimension_2 = detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension_2,
              e.p_vp_dimension = detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_dimension,
              e.p_vp_ubicacion = detalles.find(p => e.p_vp_codigo == p.p_vp_codigo).p_vp_ubicacion


              if (e.p_vp_aplica) {
                let data = {codigo: e.p_vp_codigo, dimension: e.p_vp_dimension}

                if (e.p_vp_codigo == 'PAR') {
                  // TODO: Obtener los dias, rango?
                  Object.assign(data, { dias: 365 })
                } else if (e.p_vp_codigo == 'LET') {
                  Object.assign(data, { meses: 12 })
                }

                datos_vp.push(data)
              }
              });

              let datos_rot: any[] = []
              detalles.forEach(e => {

                if (e.p_rot_codigo != null) {
                  let rot = {
                    p_rot_codigo: e.p_rot_tipo,
                    p_rot_tipo: this.catalogos.tipo_letrero.find(l => l.descripcion == e.p_rot_tipo).valor,
                    p_rot_longitud: e.p_rot_longitud,
                    p_rot_altura: e.p_rot_altura,
                    p_rot_area: e.p_rot_area,
                    p_rot_cara_1: e.p_rot_cara_1,
                    p_rot_cara_2: e.p_rot_cara_2,
                    p_rot_factible_1: e.p_rot_factible_1,
                    p_rot_factible_2: e.p_rot_factible_2
                  }
                  this.planificacion_res.det.letreros.push(rot);
                  datos_rot.push({tipo: this.catalogos.tipo_letrero.find(l => l.descripcion == e.p_rot_tipo).valor, dimension: e.p_rot_area})
                }
              });

              if (datos_vp.length > 0) this.cxc.impuestos.push({"VIA PUBLICA": datos_vp})
              if (datos_rot.length > 0) this.cxc.impuestos.push({"LETREROS": datos_rot})
            }

            this.planificacion_res.cab.tipo_inspeccion = "PLANIFICACION";
            this.planificacion_res.cab.fecha = moment(planificacion.fecha).format('YYYY-MM-DD');
            this.planificacion_res.cab.observacion= planificacion.observacion;
            this.planificacion_res.cab.aprueba= (planificacion.aprueba=="A" || planificacion.aprueba==1) ? true : false;
            this.planificacion_res.cab.fecha_proxima_visita= (planificacion.aprueba=="A" || planificacion.aprueba==1) ? moment(new Date()) : moment(planificacion.fecha_proxima_visita).format('YYYY-MM-DD');
            this.planificacion_res.cab.estado= planificacion.estado;

            this.fotosPlanificacion = planificacion.fotos;

          } else {
            this.planificacion_res.cab.estado = 'P';
            this.fotosPlanificacion = [];
          }
        }

        // Para que el back calcule la patente
        this.cxc.impuestos.push({'PATENTE': { valor: 0 }})
        // Para que el back consulte y calcule el 1,5 (si aplica)
        this.cxc.impuestos.push({'1,5': { periodo: moment().subtract(1, 'year').get('year') }})
      }
    );

    // this.commonVarSrv.guardarActivos.asObservable().subscribe(
    //   (res: any) => {
    //     // Obtengo la lista de Activos
    //     // console.log(res)
    //     // Generar Patente
    //     this.cxc.impuestos.push({'PATENTE': { valor: 0 }})
    //   },
    // )
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsFormRentas",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFormRentas",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFormRentas",
        paramAccion: "",
        boton: { icon: "far fa-lock-open", texto: "HABILITAR" },
        permiso: this.isAdmin,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      },
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.rentas_res = {
      tipo_local: 0,
      catastro: "",
      patrimonio: 0,
      area_local: 0,
      es_turistico: 0,
      categoria: 0,
      subcategoria: 0,
      cantidad: 0,
      local_cantidad:0,
      observacion: "",
      aprobado: false,
      fecha: moment(this.today).format('YYYY-MM-DD'),
      plazo_maximo: moment(this.tomorrow).format('YYYY-MM-DD'),
      contabilidad: false,
    }

    this.higiene_res = {
      cab: {
        tipo_inspeccion: "HIGIENE",
        fecha: moment(this.today).format('YYYY-MM-DD'),
        observacion: "",
        aprueba: false,
        fecha_proxima_visita: moment(this.tomorrow).format('YYYY-MM-DD'),
        estado: ""
      },
      det: {
        h_respuesta: 0,
        h_estado: 0,
        h_cantidad: 0,
      }
    }

    this.comisaria_res = {
      cab:{
        tipo_inspeccion: "COMISARIA",
        fecha: moment(this.today).format('YYYY-MM-DD'),
        observacion: "",
        aprueba: false,
        fecha_proxima_visita: moment(this.tomorrow).format('YYYY-MM-DD'),
        estado: ""
      },
      det: {
        formulario: [],
      }
    }

    this.planificacion_res = {
      cab:{
        tipo_inspeccion: "PLANIFICACION",
        fecha: moment(this.today).format('YYYY-MM-DD'),
        observacion: "",
        aprueba: false,
        fecha_proxima_visita: moment(this.tomorrow).format('YYYY-MM-DD'),
        estado: ""
      },
      det: {
        viaPublica: [],
        letreros: [],
      }
    }

    this.local_comercial = {
      id_local: 0,
      razon_social: "",
      tipo_negocio: "",
      fk_sector: {
        id_catalogo: 0,
        tipo: "",
        valor: "",
        descripcion: "",
      },
      fk_actividad_comercial: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
      fk_grupo: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
      estado: "",
      contrato: "",
      cod_catastral: "",
      uso_suelo: "",
      fk_contribuyente: {
        razon_social: "",
      },
      local_turistico: false,
      lt_categoria: {
        valor: ""
      },
      lt_categoria_2: {
        valor: ""
      },
    };

    setTimeout(() => {
      this.validaPermisos();
    }, 0);

  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);

    let params = {
      // cambiar despues con variable propia
      codigo: myVarGlobals.fRenFormRentas,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permisos = res["data"][0];
        console.log(this.permisos);
        if (this.permisos.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
          this.getCatalogos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.guardarForm();
        break;
      case "LIMPIAR":
        this.reiniciarForm();
        break;
      case "HABILITAR":
        this.habilitarForm();
        break;
    }
  }

  getCatalogos() {
    (this as any).mensajeSpinner = 'Obteniendo Recursos...';
    this.lcargando.ctlSpinner(true);
    let data = {
      params: "'REN_LOCAL_TURISTICO_CATEGORIA','REN_LOCAL_TURISTICO_CATEGORIA_2','FORM_INSPEC_COMISARIA', 'REN_TIPO_NEG', 'REN_GRUPO_NEG','TIPO_LETRERO','USO_VIA_PUBLICA','TIPO_USO_VIA_PUBLICA', 'CAT_SECTOR'"
    }

    this.apiService.getCatalogos(data).subscribe(
      (res) => {
        this.catalogos.sectores = res['data']['CAT_SECTOR'];
        this.catalogos.tipo_neg = res['data']['REN_TIPO_NEG'];
        this.catalogos.grupo_neg = res['data']['REN_GRUPO_NEG'];
        this.catalogos.preguntas = res['data']['FORM_INSPEC_COMISARIA'];
        this.catalogos.preguntas.forEach(e => {
          let preg = {
            id_inspeccion_res_det: 0,
            c_num: e.descripcion,
            c_pregunta: e.valor,
            c_respuesta: false,
            c_dias: null,
            c_anio: null,
            c_observacion: ""
          }
          this.formularioBackup.push(preg);
        });

        this.catalogos.tipo_letrero = res['data']['TIPO_LETRERO'];
        this.catalogos.via_publica = res['data']['USO_VIA_PUBLICA'];
        this.catalogos.tipo_via_publica = res['data']['TIPO_USO_VIA_PUBLICA'];
        this.catalogos.via_publica.forEach(e => {
          let op = {
            id_inspeccion_res_det: 0,
            p_vp_codigo: e.descripcion,
            p_vp_tipo: e.valor,
            p_vp_aplica: false,
            p_vp_dimension_1: 0,
            p_vp_dimension_2: 0,
            p_vp_dimension: 0,
            p_vp_ubicacion: "0",
          };
          this.viaPublicaBackup.push(op);
        });
        this.viaPublica = JSON.parse(JSON.stringify(this.viaPublicaBackup));
        this.formulario = JSON.parse(JSON.stringify(this.formularioBackup));
        this.comisaria_res.det.formulario = JSON.parse(JSON.stringify(this.formularioBackup));
        this.planificacion_res.det.viaPublica = JSON.parse(JSON.stringify(this.viaPublicaBackup));

        // locales turisticos
        res['data']['REN_LOCAL_TURISTICO_CATEGORIA'].forEach(cat => {
          let obj = {
            nombre: cat.valor,
            codigo: cat.descripcion,

          }
          this.listaCategorias.push({...obj});
        });

        res['data']['REN_LOCAL_TURISTICO_CATEGORIA_2'].forEach(scat => {
          let obj = {
            nombre: scat.valor,
            codigo: scat.descripcion,
            grupo: scat.grupo
          }
          this.listaSubCategorias.push({...obj});
        })

        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando datos');
      }
    );


  }

  cargarSubCategorias(evento) {
    this.cat_step = 2;
    this.rentas_res.subcategoria = 0;
    this.listaSubCatFiltrada = this.listaSubCategorias.filter(sc => sc.grupo == evento);

    this.handleLabel(evento);
  }

  handleLabel(categoria) {
    switch(categoria) {
      case "AGENCIA":
        this.cantidad_label = "No. establecimientos";
        this.rentas_res.local_cantidad = 0;
        this.cantidad_disabled = false;
        break;
      case "ALOJAMIENTO":
        this.cantidad_label = "No. habitaciones";
        this.rentas_res.local_cantidad = 0;
        this.cantidad_disabled = false;
        break;
      case "COMIDAS":
        this.cantidad_label = "No. mesas";
        this.rentas_res.local_cantidad = 0;
        this.cantidad_disabled = false;
        break;
      case "RECREACION":
        this.cantidad_label = "No. mesas";
        this.rentas_res.local_cantidad = 0;
        this.cantidad_disabled = false;
        break;
      case "RECREACIONTURISTICA":
        this.cantidad_label = "Cantidad";
        this.rentas_res.local_cantidad = 1;
        this.cantidad_disabled = true;
        break;
      case "TRANSPORTEMARITIMO":
        this.cantidad_label = "Cantidad";
        this.rentas_res.local_cantidad = 1;
        this.cantidad_disabled = true;
        break;
      case "TRANSPORTETERRESTRE":
        this.cantidad_label = "No. vehículos";
        this.rentas_res.local_cantidad = 0;
        this.cantidad_disabled = false;
        break;

    }
  }

  handleLocalTuristico(evento) {

    if(evento=="NO"){
      this.cat_step = 1;
      this.rentas_res.subcategoria = 0;
      this.rentas_res.categoria = 0;
      this.rentas_res.local_cantidad = 0;
    }

  }

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if /* (
        this.rentas_res.tipo_local == 0 ||
        this.rentas_res.tipo_local == undefined
      ) {
        this.toastr.info("Seleccione un tipo de local");
        flag = true;
      } else if (
        this.rentas_res.catastro == "" ||
        this.rentas_res.catastro == undefined
      ) {
        this.toastr.info("Debe ingresar información catastral");
        flag = true;
      } else if (
        this.rentas_res.patrimonio <= 0 ||
        this.rentas_res.patrimonio == undefined
      ) {
        this.toastr.info("Debe ingresar el patrimonio estimado");
        flag = true;
      } else if */ /* (moment().diff(moment(this.rentas_res.fecha)) < 0) {
        this.toastr.info('La fecha de inspeecion no puede ser mayor a la de hoy.')
        flag =true
      } else if */ (
        this.rentas_res.area_local <= 0 ||
        this.rentas_res.area_local == undefined
      ) {
        this.toastr.info("Debe ingresar un área válida");
        flag = true;
      } else /* if (
        this.rentas_res.es_turistico == 0 ||
        this.rentas_res.es_turistico == undefined
      ) {
        this.toastr.info("Debe seleccionar si es o no local turístico");
        flag = true;
      } else if (
        (this.rentas_res.es_turistico == "SI") &&
        (this.rentas_res.categoria == 0 ||
          this.rentas_res.categoria == undefined)
      ) {
        this.toastr.info("Debe escoger una categoria del local turístico");
        flag = true;
      } else */ if (
        this.rentas_res.observacion == "" ||
        this.rentas_res.observacion == undefined
      ) {
        this.toastr.info("Debe escribir una observación");
        flag = true;
      } else if (
        (!this.rentas_res.aprobado) &&
        (this.rentas_res.plazo_maximo == "" ||
          this.rentas_res.plazo_maximo == undefined)
      ) {
        this.toastr.info("Debe escoger una fecha válida");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })

  }

  async guardarForm() {

    if (this.permisos.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar este formulario.", this.fTitle);
    } else {
      await this.validaDataGlobal().then((respuesta) => {
        if (respuesta) {
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: "Está seguro de guardar el formulario?\n Una vez guardado no se podrá editar",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
          }).then(async (result) => {
            if (result.isConfirmed) {
              (this as any).mensajeSpinner = "Guardando datos del formulario...";
              this.lcargando.ctlSpinner(true);

              let data = {
                inspeccion: {
                  id_inspeccion_res: this.inspeccion.id_inspeccion_res,
                  tipo_inspeccion: this.inspeccion.tipo_inspeccion,
                  estado: this.inspeccion.estado,
                  observacion: this.rentas_res.observacion,
                  aprueba: this.rentas_res.aprobado ? "A" : "F",
                  fecha_proxima_visita: !this.rentas_res.aprobado ? this.rentas_res.plazo_maximo : null,
                  tipolocal: this.rentas_res.tipo_local,
                  catastro: this.rentas_res.catastro,
                  patrimonio: this.rentas_res.patrimonio,
                  area: this.rentas_res.area_local,
                  esturistico: this.rentas_res.es_turistico,
                  categoria: this.rentas_res.categoria,
                  subcategoria: this.rentas_res.subcategoria,
                  local_cantidad: this.rentas_res.local_cantidad,
                  fecha: moment().format('YYYY-MM-DD'),
                  fk_orden: this.inspeccion.fk_orden,
                  orden_inspeccion: this.orden,
                },
                fotos: this.fotos.filter(e => e.id_inspeccion_res_fotos === 0),
                fotosEliminar: this.fotosEliminar
              }

              // if (this.rentas_res.es_turistico == 'SI') this.cxc.impuestos.push({
              //   "LOCALES TURISTICOS": {
              //     categoria: this.rentas_res.categoria,
              //     subcategoria: this.rentas_res.subcategoria,
              //     cantidad: this.rentas_res.local_cantidad
              //   }
              // })
              // console.log(this.cxc); // return;

              try {
                if (this.rentas_res.aprobado) await this.generarImpuestos();

                this.formSrv.saveResultado(data).subscribe(
                  (res) => {
                    // console.log(res);
                    if (this.fileList) {
                      this.uploadFile();
                    }

                    this.commonVarSrv.updateFormularioCabRen.next(res['data']);
                    Swal.fire({
                      icon: "success",
                      title: "Formulario guardado en la base de datos",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    });
                    this.lcargando.ctlSpinner(false);
                    // se cierra desde cliente
                    this.letEdit = false;
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[1].habilitar = false;
                    this.vmButtons[2].habilitar = false;
                  },
                  (error) => {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "error",
                      title: "Error al guardar formulario",
                      text: error.error.message,
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    });
                  }
                )
              } catch (ex) {
                console.log(ex)
                this.lcargando.ctlSpinner(false)
                this.toastr.warning(ex.result, 'Advertencia')
              }


            }
          });
        }
      })

    }

  }

  generarImpuestos = () => {
    return new Promise((resolve, reject) => {
      this.formSrv.setImpuestos({data: this.cxc}).subscribe(
        (res: any) => {
          console.log(res)
          this.cxc.impuestos = [];
          resolve(res.data)
        },
        (err: any) => {
          console.log(err)
          reject({error: 'No se pudieron generar los impuestos relacionados', result: err.error?.message})
        }
      )
    })
  }

  reiniciarForm() {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reiniciar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.restoreForm();
      }
    });

  }

  restoreForm() {
    this.fileList = undefined;

        this.inspeccion_label = "";
        this.inspeccion = {};
        this.orden = {
          id_inspeccion_orden: null,
          uso_suelo: null,
        }
        this.local_comercial = {
          id_local: 0,
          razon_social: "",
          tipo_negocio: "",
          fk_sector: {
            id_catalogo: 0,
            tipo: "",
            valor: "",
            descripcion: "",
          },
          fk_actividad_comercial: {
            id_catalogo: 0,
            tipo: "",
            valor: ""
          },
          fk_grupo: {
            id_catalogo: 0,
            tipo: "",
            valor: ""
          },
          estado: "",
          contrato: "",
          cod_catastral: "",
          uso_suelo: "",
          fk_contribuyente: {
            razon_social: "",
          }
        };
        this.cat_step = 1;

        this.rentas_res = {
          tipo_local: 0,
          catastro: "",
          patrimonio: 0,
          area_local: 0,
          es_turistico: 0,
          categoria: 0,
          observacion: "",
          aprobado: false,
          plazo_maximo: moment(new Date()).format('YYYY-MM-DD'),
          contabilidad: false,
          fecha: moment(new Date()).format('YYYY-MM-DD'),
        }

        this.higiene_res = {
          cab: {
            tipo_inspeccion: "HIGIENE",
            fecha: moment(this.today).format('YYYY-MM-DD'),
            observacion: "",
            aprueba: false,
            fecha_proxima_visita: moment(this.tomorrow).format('YYYY-MM-DD'),
            estado: ""
          },
          det: {
            h_respuesta: 0,
            h_estado: 0,
            h_cantidad: 0,
          }
        }

        this.comisaria_res = {
          cab:{
            tipo_inspeccion: "COMISARIA",
            fecha: moment(this.today).format('YYYY-MM-DD'),
            observacion: "",
            aprueba: false,
            fecha_proxima_visita: moment(this.tomorrow).format('YYYY-MM-DD'),
            estado: ""
          },
          det: {
            formulario: [],
          }
        }

        this.planificacion_res = {
          cab:{
            tipo_inspeccion: "PLANIFICACION",
            fecha: moment(this.today).format('YYYY-MM-DD'),
            observacion: "",
            aprueba: false,
            fecha_proxima_visita: moment(this.tomorrow).format('YYYY-MM-DD'),
            estado: ""
          },
          det: {
            viaPublica: [],
            letreros: [],
          }
        }

        this.comisaria_res.det.formulario = JSON.parse(JSON.stringify(this.formularioBackup));
        this.planificacion_res.det.viaPublica = JSON.parse(JSON.stringify(this.viaPublicaBackup));

        this.cxc.impuestos = [];

        this.fotos = [];
        this.fotosEliminar = [];
        this.fotosHigiene = [];
        this.fotosComisaria = [];
        this.fotosPlanificacion = [];
        this.commonVarSrv.limpiarArchivos.next(true);
        this.disableVehiculos = true;
        this.letEdit = false;
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
  }

  habilitarForm() {
    let id = this.inspeccion.id_inspeccion_res;

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea habilitar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formSrv.habilitar(id).subscribe(
          (res) => {
            Swal.fire({
              icon: "success",
              title: "Se habilitó satisfactoriamente el formulario",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
            // se abre desde cliente
            this.letEdit = true;
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = true;
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error al habilitar formulario",
              text: error.error.message,
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          }
        )
      }
    });


  }

  expandirInspecciones() {
    const modalInvoice = this.modalSrv.open(ModalInspeccionesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.permisos = this.permisos;
  }

  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Inspeccion')
      }, 50)
      // console.log(this.fileList)
    }
  }

  uploadFile() {
    let data = {
      // Informacion para almacenamiento de anexo y bitacora
      module: this.permisos.id_modulo,
      component: myVarGlobals.fRenFormRentas,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.inspeccion.id_inspeccion_res,
      id_controlador: myVarGlobals.fRenFormRentas,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Inspeccion Comisaria ${this.inspeccion.id_inspeccion_res}`,
      ip: this.commonSrv.getIpAddress()
    }

    for (let i = 0; i < this.fileList.length; i++) {
      this.UploadService(this.fileList[i], data);
    }
    this.lcargando.ctlSpinner(false)
  }

  UploadService(file, payload?: any): void {
    this.formSrv.fileService(file, payload).subscribe(
      res => { },
      err => {
        this.toastr.info(err.error.message, 'Error cargando Anexos');
      })
  }

  cargaFoto(archivos) {
    (this as any).mensajeSpinner = 'Cargando fotos...';
    this.lcargando.ctlSpinner(true);
    if (archivos.length > 0 && (archivos.length + this.fotos.length) <= 5) {
      for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = (c: any) => {
          this.fotos.push({
            id_inspeccion_res_fotos: 0,
            recurso: c.target.result
          });
        };
        reader.readAsDataURL(archivos[i]);
      }
    } else if ((archivos.length + this.fotos.length) > 5) {
      this.toastr.warning("No puede subir más de 5 fotos", "¡Atención!");
    }
    this.lcargando.ctlSpinner(false);
  }

  removeFoto(index) {
    if (this.fotos[index].id_inspeccion_res_fotos > 0) {
      this.fotosEliminar.push(this.fotos.splice(index, 1)[0].id_inspeccion_res_fotos);
    } else {
      this.fotos.splice(index, 1);
    }
  }

  expandirVistaFotos(index,fotos) {
    const modalInvoice = this.modalSrv.open(ModalVistaFotosComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.fotos = fotos;
    modalInvoice.componentInstance.indexActive = index;
  }

  registraVehiculos(inspeccion: any) {
    const modal = this.modalSrv.open(ModalVehiculosComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.inspeccion = inspeccion;
    modal.componentInstance.permisos = this.permisos;
    modal.componentInstance.formDisabled = true; // no se puede editar solo ver
  }
}
