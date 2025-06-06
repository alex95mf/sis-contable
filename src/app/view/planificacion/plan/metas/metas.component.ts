import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { MetasService } from './metas.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import { FormMetasComponent } from './form-metas/form-metas.component';
import { CommonVarService } from 'src/app/services/common-var.services';

@Component({
standalone: false,
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.scss']
})
export class MetasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false})
  lcargando: CcSpinerProcesarComponent;

  fTitle = "Asignación de objetivos y componentes";
  
  vmButtons: any;

  dataUser: any;
  permisos: any;

  step: number = 2;
  step2: number = 0;

  programas: any = [];
  programasList: any = [];
  departamentos: any = [];
  deptFiltrado: any = [];

  cuerpoMetas: any = {
    ods: [],
    meta_ods: [],
    eje: [],
    opg: [],
    ppg: [],
    meta_zonal: [],
    competencia: [],
    oe: [],
    meta_resultado: [],
    indicador: [],
    tendencia: [],
    intervencion: []
  };
  
  seleccion: any = {
    id: 0,  // id_programa
    periodo: null,
    nombre: 0,
    departamento: 0,
    ods: 0,
    meta_ods: 0,
    eje: 0,
    opg: 0,
    ppg: 0,
    meta_zonal: 0,
    competencia: 0,
    oe: 0,
    meta_resultado: 0,
    indicador: 0,
    tendencia: 0,
    intervencion: 0
  }

  nuevo: any = [];

  year: any;

  cmb_periodo = []

  constructor(
    private metaSrv: MetasService,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private modalSrv: NgbModal,
    private commonVarSrv: CommonVarService
  ) { 
    this.commonVarSrv.editMetaPlanificacion.asObservable().subscribe(
      (res)=>{
        if (res){
          this.programas = [];
          this.obtenerTodasMetas();
        }
      }
    )

  }

  ngOnInit(): void {

    this.vmButtons = [
    { 
      orig: "btnMetas", 
      paramAccion: "", 
      boton: { icon: "fas fa-search", texto: "CONSULTAR" }, 
      permiso: true, 
      showtxt: true, 
      showimg: true, 
      showbadge: false, 
      clase: "btn btn-primary btn-sm", 
      habilitar: false, 
      imprimir: false 
    },
    { 
      orig: "btnMetas", 
      paramAccion: "", 
      boton: { icon: "fas fa-floppy-o", texto: "GUARDAR" }, 
      permiso: true, 
      showtxt: true, 
      showimg: true, 
      showbadge: false, 
      clase: "btn btn-success btn-sm", 
      habilitar: false, 
      imprimir: false 
    },
    { 
      orig: "btnMetas", 
      paramAccion: "", 
      boton: { icon: "fas fa-times", texto: "CANCELAR" }, 
      permiso: true, 
      showtxt: true, 
      showimg: true, 
      showbadge: false, 
      clase: "btn btn-danger btn-sm", 
      habilitar: false, 
      imprimir: false 
    },
    ]

    this.year = new Date();
    this.year = this.year.getFullYear();
    this.seleccion.periodo = this.year

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(() => {
      this.validaPermisos();
    }, 0);

  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.validarMetas();
        break;
      case "CONSULTAR":
        this.obtenerTodasMetas();
        break;
      case "CANCELAR":
        this.limpiarPantalla();
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fProgMetas,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permisos = res["data"][0];
        if (this.permisos.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            this.vmButtons[1].habilitar = false
            this.getPeriodos()
          }, 0)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  limpiarPantalla() {
    this.seleccion = {
      id: 0,  // id_programa
      // periodo: this.year,
      nombre: 0,
      departamento: 0,
      ods: 0,
      meta_ods: 0,
      eje: 0,
      opg: 0,
      ppg: 0,
      meta_zonal: 0,
      competencia: 0,
      oe: 0,
      meta_resultado: 0,
      indicador: 0,
      tendencia: 0,
      intervencion: 0
    }
  }

  async getPeriodos() {
    this.lcargando.ctlSpinner(true);
    try {
      const periodos = await this.metaSrv.getPeriodos()
      console.log(periodos.data)
      this.cmb_periodo = periodos.data

      this.cargaProgramas()
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Periodos')
    }
  }

  cargaProgramas() {
    (this as any).mensajeSpinner = "Cargando Programas...";
    this.lcargando.ctlSpinner(true);

    this.metaSrv.getProgramas().subscribe(
      (res)=>{
        res['data'].forEach(prog => {
          // let programa = {
          //   id: prog.id_catalogo,
          //   nombre: prog.valor,
          //   meta: null,
          //   departamento: { id: null, nombre: ''},
          //   ods: { id: null, nombre: '' },
          //   meta_ods: { id:null, nombre: '', valor: '' },
          //   eje: { id: null, nombre: '', valor: '' },
          //   opg: { id: null, nombre: '', valor: '' },
          //   ppg: { id: null, nombre: '', valor: '' },
          //   meta_zonal: { id: null, nombre: '', valor: '' },
          //   competencia: { id: null, nombre: '' },
          //   oe: { id: null, nombre: '' },
          //   meta_resultado: { id: null, nombre: '' },
          //   indicador: { id: null, nombre: '' },
          //   tendencia: { id: null, nombre: '' },
          //   intervencion: { id: null, nombre: '' },
          // }

          let programa = {
            id: prog.id_catalogo,
            nombre: prog.valor,
            codigo: prog.descripcion
          }
          this.programasList.push(programa);
        });
        this.cargaODS();
        // this.lcargando.ctlSpinner(false);
      },
      (err)=>{
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, "Error Cargando Programas");
      }
    )
    
  }

  cargaODS() {
    (this as any).mensajeSpinner = 'Cargando ODS...';
    this.metaSrv.getODS().subscribe(
      (res) => {
        res['data'].forEach(ods => {
          let obj = {
            id: ods.id_catalogo,
            nombre: ods.descripcion
          };
          this.cuerpoMetas.ods.push({...obj});
        });
        // this.lcargando.ctlSpinner(false)
        this.cargarCatalogos();
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando ODS');
      }
    )
  }

  cargarCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos...';
    let data = {
      params: "'PLA_DEPARTAMENTO','PLA_COMPETENCIA','PLA_OE','PLA_META_RESULTADO',\
      'PLA_INDICADOR','PLA_TENDENCIA','PLA_TIPO_INTERVENCION'"
    };

    this.metaSrv.getCatalogs(data).subscribe(
      (res) => {
        // Cargar cuerpoMetas

        res['data']['PLA_DEPARTAMENTO'].forEach(d => {
          let departamento = {
            id: d.id_catalogo,
            nombre: d.valor,
            codigo: d.descripcion,
            plan: d.grupo,
            presupuesto: 0
          };
          this.departamentos.push(departamento);
        })
        
        res['data']['PLA_COMPETENCIA'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          };
          this.cuerpoMetas.competencia.push(obj);
        });
        res['data']['PLA_OE'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          };
          this.cuerpoMetas.oe.push(obj);
        })
        res['data']['PLA_META_RESULTADO'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          };
          this.cuerpoMetas.meta_resultado.push(obj);
        })
        res['data']['PLA_INDICADOR'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          };
          this.cuerpoMetas.indicador.push(obj);
        })
        res['data']['PLA_TENDENCIA'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          };
          this.cuerpoMetas.tendencia.push(obj);
        })
        res['data']['PLA_TIPO_INTERVENCION'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          };
          this.cuerpoMetas.intervencion.push(obj);
        })

        this.programas = [];
        this.obtenerTodasMetas();

        // console.log(this.programas);

        // this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Catalogos');
      }
    )
  }

  obtenerTodasMetas() {
    if (this.seleccion.periodo == null) {
      this.toastr.warning('Seleccione un periodo a consultar')
      return;
    }

    this.programas = [];
    (this as any).mensajeSpinner = "Cargando lista de metas...";
    this.lcargando.ctlSpinner(true);
    this.metaSrv.getGoals({periodo: this.seleccion.periodo}).subscribe(
      res => {
        // console.log(res);

        // if (Array.isArray(res['data']) && !res['data'].length) {
        //   return;
        // }

        res['data'].forEach(m => {
          let meta = {
            meta: m.id !== null ? m.id : null,
            id: m.programa !== null ? m.programa.id_catalogo : null,
            periodo: m.periodo,
            nombre: m.programa !== null ? m.programa.valor : '',
            departamento: m.departamento !== null ? { id: m.departamento.id_catalogo, nombre: m.departamento.valor } : { id: null, nombre: ''},
            ods: m.ods !== null ? { id: m.ods.id_catalogo, nombre: m.ods.descripcion } : { id: null, nombre: '' },
            meta_ods: m.meta_ods !== null ? { id: m.meta_ods.id_catalogo, nombre: m.meta_ods.descripcion, valor: m.meta_ods.valor} : { id: null, nombre: '', valor: '' },
            eje: m.eje !== null ? { id: m.eje.id_catalogo, nombre: m.eje.descripcion, valor: m.eje.valor } : { id: null, nombre: '', valor: '' },
            opg: m.opg !== null ? { id: m.opg.id_catalogo, nombre: m.opg.descripcion, valor: m.opg.valor } : { id: null, nombre: '', valor: '' },
            ppg: m.ppg !== null ? { id: m.ppg.id_catalogo, nombre: m.ppg.descripcion, valor: m.ppg.valor } : { id: null, nombre: '', valor: '' },
            meta_zonal: m.meta_zonal !== null ? { id: m.meta_zonal.id_catalogo, nombre: m.meta_zonal.descripcion , valor: m.meta_zonal.valor} : { id: null, nombre: '', valor: '' },
            competencia: m.competencia !== null ? { id: m.competencia.id_catalogo, nombre: m.competencia.valor } : { id: null, nombre: '' },
            oe: m.oe !== null ? { id: m.oe.id_catalogo, nombre: m.oe.valor } : { id: null, nombre: '' },
            meta_resultado: m.meta_resultado !== null ? { id: m.meta_resultado.id_catalogo, nombre: m.meta_resultado.valor } : { id: null, nombre: '' },
            indicador: m.indicador !== null ? { id: m.indicador.id_catalogo, nombre: m.indicador.valor } : { id: null, nombre: '' },
            tendencia: m.tendencia !== null ? { id: m.tendencia.id_catalogo, nombre: m.tendencia.valor } : { id: null, nombre: '' },
            intervencion: m.intervencion !== null ? { id: m.intervencion.id_catalogo, nombre: m.intervencion.valor } : { id: null, nombre: '' },
          };
          this.programas.push(meta);
        })
        this.lcargando.ctlSpinner(false);
      },
      err => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message)
      }
    )

  }

  obtenerMetas() {

    (this as any).mensajeSpinner = 'Obteniendo Metas...';
    let data = {
      params: this.programas,
      periodo: this.seleccion.periodo,
    };
    // this.lcargando.ctlSpinner(true);

    this.metaSrv.obtenerMetas(data).subscribe(
      (res) => {
        console.log(res['data'])
        if (res['data'].length > 0) {
          res['data'].forEach(m => {
            console.log(m)
            let meta = {
              meta: m.id !== null ? m.id : null,
              periodo: m.periodo,
              departamento: m.departamento !== null ? { id: m.departamento.id_catalogo, nombre: m.departamento.valor } : { id: null, nombre: ''},
              ods: m.ods !== null ? { id: m.ods.id_catalogo, nombre: m.ods.descripcion } : { id: null, nombre: '' },
              meta_ods: m.meta_ods !== null ? { id: m.meta_ods.id_catalogo, nombre: m.meta_ods.descripcion, valor: m.meta_ods.valor} : { id: null, nombre: '', valor: '' },
              eje: m.eje !== null ? { id: m.eje.id_catalogo, nombre: m.eje.descripcion, valor: m.eje.valor } : { id: null, nombre: '', valor: '' },
              opg: m.opg !== null ? { id: m.opg.id_catalogo, nombre: m.opg.descripcion, valor: m.opg.valor } : { id: null, nombre: '', valor: '' },
              ppg: m.ppg !== null ? { id: m.ppg.id_catalogo, nombre: m.ppg.descripcion, valor: m.ppg.valor } : { id: null, nombre: '', valor: '' },
              meta_zonal: m.meta_zonal !== null ? { id: m.meta_zonal.id_catalogo, nombre: m.meta_zonal.descripcion , valor: m.meta_zonal.valor} : { id: null, nombre: '', valor: '' },
              competencia: m.competencia !== null ? { id: m.competencia.id_catalogo, nombre: m.competencia.valor } : { id: null, nombre: '' },
              oe: m.oe !== null ? { id: m.oe.id_catalogo, nombre: m.oe.valor } : { id: null, nombre: '' },
              meta_resultado: m.meta_resultado !== null ? { id: m.meta_resultado.id_catalogo, nombre: m.meta_resultado.valor } : { id: null, nombre: '' },
              indicador: m.indicador !== null ? { id: m.indicador.id_catalogo, nombre: m.indicador.valor } : { id: null, nombre: '' },
              tendencia: m.tendencia !== null ? { id: m.tendencia.id_catalogo, nombre: m.tendencia.valor } : { id: null, nombre: '' },
              intervencion: m.intervencion !== null ? { id: m.intervencion.id_catalogo, nombre: m.intervencion.valor } : { id: null, nombre: '' },
            };
            Object.assign(this.programas.find(p => p.id == m.programa.id_catalogo), meta);
            if(m.id === res['data'].length -1){
              this.lcargando.ctlSpinner(false);
            }
          });

        }
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error obteniendo Metas de Programas');
      }
    )
  }

  cargaMetaODS(event) {
    this.cuerpoMetas.meta_ods = [];
    this.seleccion.meta_ods = 0;
    let data = {
      "ods": event
    };
    console.log(event);
    (this as any).mensajeSpinner = 'Cargado Metas para ODS...';
    
    this.lcargando.ctlSpinner(true);
    this.metaSrv.getMetasODS(data).subscribe(
      (res) => {
        res['data'].forEach(m => {
          let obj = {
            id: m.id_catalogo,
            nombre: m.descripcion
          };
          this.cuerpoMetas.meta_ods.push({...obj})
        });
        this.lcargando.ctlSpinner(false);
        this.cargaEje(event);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Metas para ODS');
      }
    )
  }

  cargaEje(event) {
    this.cuerpoMetas.eje = [];
    this.seleccion.eje = 0;
    this.step = 3;
    let data = {
      "ods": event
    };
    (this as any).mensajeSpinner = 'Cargando Ejes...';
    console.log(event);
    this.lcargando.ctlSpinner(true);
    this.metaSrv.getEje(data).subscribe(
      (res) => {
        res['data'][0]['ejes'].forEach(eje => {
          let obj = {
            id: eje.id_catalogo,
            nombre: eje.descripcion,
            valor: eje.valor
          };
          this.cuerpoMetas.eje.push({...obj})
        });
        // setTimeout(() => {
          this.lcargando.ctlSpinner(false);
        // }, 0)
       
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Ejes');
      }
    )
  }

  cargaOPG(event) {
    this.cuerpoMetas.opg = [];
    this.seleccion.opg = 0;
    this.step = 4;
    let data = {
      'eje': event
    };
    (this as any).mensajeSpinner = 'Cargado OPG...';
    
    this.lcargando.ctlSpinner(true);
    this.metaSrv.getOPG(data).subscribe(
      res => {
        res['data'].forEach(o => {
          let obj = {
            id: o.id_catalogo,
            valor: o.valor,
            nombre: o.descripcion
          };
          this.cuerpoMetas.opg.push({...obj});
        });
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando OPG');
      }
    )
  }

  cargaPPG(event) {
    this.cuerpoMetas.ppg = [];
    this.seleccion.ppg = 0;
    this.step = 5;
    (this as any).mensajeSpinner = 'Cargando Politicas...';
    let data = {
      "opg": event
    };

    this.lcargando.ctlSpinner(true);
    this.metaSrv.getPoliticas(data).subscribe(
      (res) => {
        // console.log(res)
        res['data'].forEach(p => {
          let obj = {
            id: p.id_catalogo,
            valor: p.valor,
            nombre: p.descripcion
          };
          this.cuerpoMetas.ppg.push({...obj});
        });
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Politicas');
      }
    )
  }

  cargaMetaZonal(event?) {
    let data = {
      "politica": event
    };
    console.log(data);
    this.cuerpoMetas.meta_zonal = [];
    this.seleccion.meta_zonal = 0;
    this.step = 6;
    (this as any).mensajeSpinner = 'Cargando Metas para la Zona...';
    

    this.lcargando.ctlSpinner(true);
    this.metaSrv.getMetaZona(data).subscribe(
      (res) => {
        // console.log(res)
        res['data'].forEach(p => {
          let obj = {
            id: p.id_catalogo,
            nombre: p.descripcion
          };
          this.cuerpoMetas.meta_zonal.push({...obj});
          this.lcargando.ctlSpinner(false);
        });
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Politicas');
      }
    )
  }

  firstStep(event) {
    // this.step = 1;
    this.step2 = 1;
    // console.log(event);
    // console.log(this.departamentos);
    this.seleccion.id = event.id;
    this.seleccion.nombre = event.nombre;
    if (event) {
      // this.obtenerMetas(event['id']);
      this.deptFiltrado = this.departamentos.filter(d => d.plan == event['nombre']);

    } else {
      this.deptFiltrado = [];
      // this.registros = [];
    }
    console.log(this.deptFiltrado);

  }

  validarMetas() {

    // console.log(this.permisos);
    if (this.permisos.guardar == 0) {
      this.toastr.warning('No tiene permisos para agregar', this.fTitle)
      return
    }


    let reg1 = this.programas.find(p=>p.id==this.seleccion.id);
    let reg2 = this.programas.find(p=>p.departamento.id==this.seleccion.departamento.id);
 
    let prog: any;
    let depart: any;
    if(reg1){
      prog = reg1.id;
    }
    if(reg2){
      depart = reg2.departamento.id;
    }
    // console.log(prog);
    // console.log(depart);

    if (this.seleccion.id == 0) {
      Swal.fire({
        title: this.fTitle,
        text: 'No ha seleccionado un Programa',
        icon: 'warning'
      });
      return
    } else if (this.seleccion.departamento == 0 ) {
      // || this.seleccion.departamento.id == null
      Swal.fire({
        title: this.fTitle,
        text: 'No ha seleccionado un Departamento',
        icon: 'warning'
      });
      return
    } else if (this.seleccion.id == prog && this.seleccion.departamento.id == depart){
      Swal.fire({
        title: this.fTitle,
        text: 'No puede haber mas de una coincidencia con el mismo programa y departamento',
        icon: 'warning'
      });
      return
    } else if (
      // // TODO: Validar que ninguna propiedad de seleccion este vacio
      // const vacio = (elem) => console.log(elem)
      this.seleccion.ods == 0 || this.seleccion.meta_ods == 0 || this.seleccion.eje == 0 ||
      this.seleccion.opg == 0 || this.seleccion.ppg == 0 || this.seleccion.meta_zonal == 0 ||
      this.seleccion.competencia == 0 || this.seleccion.oe == 0 || this.seleccion.meta_resultado == 0 ||
      this.seleccion.indicador == 0 || this.seleccion.tendencia == 0 || this.seleccion.intervencion == 0
    ) {
      Swal.fire({
        title: this.fTitle,
        text: 'Existen campos sin llenar, por favor verifique que seleccione un valor para todos los campos',
        icon: 'warning'
      });
      return
    } else {
      // despues de todas las validaciones
      // Object.assign(this.programas.find(p => p.id == this.seleccion.id), this.seleccion);
      this.crearMeta();
    }
  }

  crearMeta() {
    

    let data = {
      accion: 'ASIGNAR METAS A PROGRAMAS',
      ip: this.commonSrv.getIpAddress(),
      id_controlador: myVarGlobals.fProgMetas,

      nuevo: this.seleccion
    };
    // console.log(data);
    (this as any).mensajeSpinner = 'Guardando Metas por Programa...';

    this.lcargando.ctlSpinner(true);
    this.metaSrv.crearMeta(data).subscribe(
      res => {
        console.log(res['data']);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          title: this.fTitle,
          text: res['data'],
          icon: 'success'
        }).then((result) => {
          if (result.isConfirmed) {
            // this.programas = [];
            // for(let prog of this.programasList) {
            //   this.obtenerTodasMetas(prog.id);
            // }
            this.limpiarPantalla();
            this.programas = [];
            this.obtenerTodasMetas();
          }
        })
      },
      err => {
        this.lcargando.ctlSpinner(false);
        // console.log(err);
        this.toastr.error(err.error.message, 'Error guardando Metas por Programa');
      }
    )
  }

  // asignarMetas() {
  //   if (this.seleccion.id == 0) {
  //     Swal.fire({
  //       title: this.fTitle,
  //       text: 'No ha seleccionado un Programa',
  //       icon: 'warning'
  //     });
  //     return
  //   }

  //   if (this.seleccion.departamento == 0) {
  //     Swal.fire({
  //       title: this.fTitle,
  //       text: 'No ha seleccionado un Departamento',
  //       icon: 'warning'
  //     });
  //     return
  //   }

  //   // TODO: Validar que ninguna propiedad de seleccion este vacio
  //   // const vacio = (elem) => console.log(elem)
  //   if (
  //     this.seleccion.ods == 0 || this.seleccion.meta_ods == 0 || this.seleccion.eje == 0 ||
  //     this.seleccion.opg == 0 || this.seleccion.ppg == 0 || this.seleccion.meta_zonal == 0 ||
  //     this.seleccion.competencia == 0 || this.seleccion.oe == 0 || this.seleccion.meta_resultado == 0 ||
  //     this.seleccion.indicador == 0 || this.seleccion.tendencia == 0 || this.seleccion.intervencion == 0
  //   ) {
  //     Swal.fire({
  //       title: this.fTitle,
  //       text: 'Existen campos sin llenar, porfavor verifique que seleccione un valor para todos los campos',
  //       icon: 'warning'
  //     });
  //     return
  //   }

  //   Object.assign(this.programas.find(p => p.id == this.seleccion.id), this.seleccion);
  //   this.limpiarPantalla();
  // }

  async updateGoal(elemRef) {

    if (this.permisos.editar == 0) {
      this.toastr.warning('No tiene permisos para actualizar', this.fTitle)
      return
    }

    let elem = JSON.parse(JSON.stringify(elemRef));

    // const result = await this.cargarListas(elem);

    // if(result){
    //   const modal = this.modalSrv.open(FormMetasComponent, 
    //     { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    
    //     console.log(elem);
    
        
    //     modal.componentInstance.selected = elem;
    //     modal.componentInstance.catalogos = this.cuerpoMetas;
    //     modal.componentInstance.depts = this.deptFiltrado;
    //     modal.componentInstance.programs = this.programas;
    //     // modal.componentInstance.selected = elem;
    //     // modal.componentInstance.catalogos = JSON.parse(JSON.stringify(this.cuerpoMetas));
    //     // modal.componentInstance.depts = JSON.parse(JSON.stringify(this.deptFiltrado));
    //     // modal.componentInstance.programs = JSON.parse(JSON.stringify(this.programas));
        
    // }

    // precarga de departamentos
    if (elem) {
      this.deptFiltrado = this.departamentos.filter(d => d.plan == elem['nombre']);
    } else {
      this.deptFiltrado = [];
    }

    const modal = this.modalSrv.open(FormMetasComponent, 
      { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  
      console.log(elem);
  
      
      modal.componentInstance.selected = elem;
      modal.componentInstance.catalogos = this.cuerpoMetas;
      modal.componentInstance.depts = this.deptFiltrado;
      modal.componentInstance.programs = this.programas;

  }

  // cargarListas(elem) {

  //   return new Promise(resolve => {

  //     // precarga meta zonal
  //     let ppg = {
  //       "politica": elem.ppg
  //     };
  //     this.cuerpoMetas.meta_zonal = [];
  //     (this as any).mensajeSpinner = 'Cargando Metas para la Zona...';
  //     this.lcargando.ctlSpinner(true);
  //     this.metaSrv.getMetaZona(ppg).subscribe(
  //       (res) => {
  //         res['data'].forEach(p => {
  //           let obj = {
  //             id: p.id_catalogo,
  //             nombre: p.descripcion
  //           };
  //           this.cuerpoMetas.meta_zonal.push({...obj});
  //         });
  //         this.lcargando.ctlSpinner(false);
  //       },
  //       (err) => {
  //         this.lcargando.ctlSpinner(false);
  //         this.toastr.error(err.error.message, 'Error cargando Politicas');
  //       }
  //     )
  
  //     // precarga ppg
  //     this.cuerpoMetas.ppg = [];
  //     (this as any).mensajeSpinner = 'Cargando Politicas...';
  //     let opg = {
  //       "opg": elem.opg
  //     };
  //     this.lcargando.ctlSpinner(true);
  //     this.metaSrv.getPoliticas(opg).subscribe(
  //       (res) => {
  //         res['data'].forEach(p => {
  //           let obj = {
  //             id: p.id_catalogo,
  //             valor: p.valor,
  //             nombre: p.descripcion
  //           };
  //           this.cuerpoMetas.ppg.push({...obj});
  //         });
  //         this.lcargando.ctlSpinner(false);
  //       },
  //       (err) => {
  //         this.lcargando.ctlSpinner(false);
  //         this.toastr.error(err.error.message, 'Error cargando Politicas');
  //       }
  //     )
  
  //     // precarga opg
  //     this.cuerpoMetas.opg = [];
  //     let eje = {
  //       'eje': elem.eje
  //     };
  //     (this as any).mensajeSpinner = 'Cargado OPG...';
  //     this.lcargando.ctlSpinner(true);
  //     this.metaSrv.getOPG(eje).subscribe(
  //       res => {
  //         res['data'].forEach(o => {
  //           let obj = {
  //             id: o.id_catalogo,
  //             valor: o.valor,
  //             nombre: o.descripcion
  //           };
  //           this.cuerpoMetas.opg.push({...obj});
  //         });
  //         this.lcargando.ctlSpinner(false);
  //       },
  //       err => {
  //         this.lcargando.ctlSpinner(false);
  //         this.toastr.error(err.error.message, 'Error cargando OPG');
  //       }
  //     )
  
  //     // precarga de ejes
  //     this.cuerpoMetas.eje = [];
  //     let ods = {
  //       "ods": elem.ods
  //     };
  //     (this as any).mensajeSpinner = 'Cargando Ejes...';
  //     this.lcargando.ctlSpinner(true);
  //     this.metaSrv.getEje(ods).subscribe(
  //       (res) => {
  //         res['data'][0]['ejes'].forEach(eje => {
  //           let obj = {
  //             id: eje.id_catalogo,
  //             nombre: eje.descripcion,
  //             valor: eje.valor
  //           };
  //           this.cuerpoMetas.eje.push({...obj})
  //         });
  //         this.lcargando.ctlSpinner(false);
  //       },
  //       (err) => {
  //         this.lcargando.ctlSpinner(false);
  //         this.toastr.error(err.error.message, 'Error cargando Ejes');
  //       }
  //     )
  
  
  //     // precarga de metas ods
  //     (this as any).mensajeSpinner = 'Cargando Metas ODS...';
  //     this.lcargando.ctlSpinner(true);
  //     this.cuerpoMetas.meta_ods = [];
  //     this.metaSrv.getMetasODS(ods).subscribe(
  //       (res) => {
  //         res['data'].forEach(m => {
  //           let obj = {
  //             id: m.id_catalogo,
  //             nombre: m.descripcion
  //           };
  //           this.cuerpoMetas.meta_ods.push({...obj})
  //         });
  //         this.lcargando.ctlSpinner(false);
  //       },
  //       (err) => {
  //         this.lcargando.ctlSpinner(false);
  //         this.toastr.error(err.error.message, 'Error cargando Metas para ODS');
  //       }
  //     )
    

  //   resolve(true);

  //   });
  // }

  eliminar(elem) {

    if (this.permisos.editar == 0) {
      this.toastr.warning('No tiene permisos para eliminar', this.fTitle)
      return
    }

    let id = elem.meta;
    // console.log(id);
    let data ={
      meta_id: id
    }

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar esta meta permanentemente?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result)=>{
      if(result.isConfirmed) {
        (this as any).mensajeSpinner = "Eliminado meta del sistema...";
        this.lcargando.ctlSpinner(true);

        this.metaSrv.borrarMeta(data).subscribe(
          (res)=> {
            console.log(res);
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: this.fTitle,
              text: res['data'],
              icon: 'success'
            }).then((result)=>{
              if(result.isConfirmed) {
                this.programas = [];
                this.obtenerTodasMetas();
              }
            });
          },
          (err)=>{
            this.lcargando.ctlSpinner(false);
            this.toastr.error(err.error.message, 'Error eliminando meta');
          }
        )
      }
    });

    
  }

}
