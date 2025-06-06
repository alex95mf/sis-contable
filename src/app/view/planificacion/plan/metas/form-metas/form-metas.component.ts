import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { MetasService } from '../metas.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import { CommonVarService } from 'src/app/services/common-var.services';

@Component({
standalone: false,
  selector: 'app-form-metas',
  templateUrl: './form-metas.component.html',
  styleUrls: ['./form-metas.component.scss']
})
export class FormMetasComponent implements OnInit {
  @Input() selected: any;
  @Input() catalogos: any;
  @Input() depts: any;
  @Input() programs: any;

  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;

  fTitle = `Actualizando meta para programa ` ;
  
  vmButtons: any;

  dataUser: any;
  permisos: any;

  step2 = 1;
  step = 6;

  programas: any = [];
  departamentos: any = [];
  deptFiltrado: any = [];

  year: any;

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
    nombre: '',
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
    // id: 0,
    // nombre: 0,
    // meta: null,
    // departamento: { id: null, nombre: 0},
    // ods: { id: null, nombre: 0 },
    // meta_ods: { id:null, nombre: 0, valor: '' },
    // eje: { id: null, nombre: 0, valor: '' },
    // opg: { id: null, nombre: 0, valor: '' },
    // ppg: { id: null, nombre: 0, valor: '' },
    // meta_zonal: { id: null, nombre: 0, valor: '' },
    // competencia: { id: null, nombre: 0 },
    // oe: { id: null, nombre: 0 },
    // meta_resultado: { id: null, nombre: 0 },
    // indicador: { id: null, nombre: 0 },
    // tendencia: { id: null, nombre: 0 },
    // intervencion: { id: null, nombre: 0 },
  }

  click: any = {
    departamento: false,
    meta_ods: false,
    eje: false,
    opg: false,
    ppg: false,
    meta_zonal: false
  }

  constructor(
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    private metaSrv: MetasService,
    private commonVarSrv: CommonVarService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
    { 
      orig: "btnMetasForm", 
      paramAccion: "", 
      boton: { icon: "fa fa-edit", 
      texto: "GUARDAR" }, 
      permiso: true, 
      showtxt: true, 
      showimg: true, 
      showbadge: false, 
      clase: "btn btn-success btn-sm", 
      habilitar: false, 
      imprimir: false 
    },
    { 
      orig: "btnMetasForm", 
      paramAccion: "", 
      boton: { icon: "fa fa-times", texto: "REGRESAR" }, 
      permiso: true, 
      showtxt: true, 
      showimg: true, 
      showbadge: false, 
      clase: "btn btn-danger btn-sm", 
      habilitar: false, 
      imprimir: false 
    }
    ];

    this.year = new Date();
    this.year = this.year.getFullYear();

    setTimeout(() => {
      this.cargarListasRest(this.selected);
    }, 0);

    this.seleccion.id = this.selected.id;
    this.seleccion.periodo = this.selected.periodo;
    this.seleccion.nombre = this.selected.nombre;
    this.seleccion.departamento = this.selected.departamento.nombre;
    this.seleccion.ods = this.selected.ods.nombre;
    this.seleccion.meta_ods = this.selected.meta_ods.nombre;
    this.seleccion.eje = this.selected.eje.nombre;
    this.seleccion.opg = this.selected.opg.nombre;
    this.seleccion.ppg = this.selected.ppg.nombre;
    this.seleccion.meta_zonal = this.selected.meta_zonal.nombre;
    this.seleccion.competencia = this.selected.competencia.nombre;
    this.seleccion.oe = this.selected.oe.nombre;
    this.seleccion.meta_resultado = this.selected.meta_resultado.nombre;
    this.seleccion.indicador = this.selected.indicador.nombre;
    this.seleccion.tendencia = this.selected.tendencia.nombre;
    this.seleccion.intervencion = this.selected.intervencion.nombre;

    Object.assign(this.cuerpoMetas, this.catalogos);
    Object.assign(this.deptFiltrado, this.depts);
    Object.assign(this.programas, this.programs);
    // console.log(this.seleccion);
    // console.log(this.selected);
    // console.log(this.cuerpoMetas);
  }

  cargarListasRest(elem) {
    // precarga meta zonal
    let ppg = {
      "politica": elem.ppg
    };
    this.cuerpoMetas.meta_zonal = [];
    (this as any).mensajeSpinner = 'Cargando Metas para la Zona...';
    this.lcargando.ctlSpinner(true);
    this.metaSrv.getMetaZona(ppg).subscribe(
      (res) => {
        res['data'].forEach(p => {
          let obj = {
            id: p.id_catalogo,
            nombre: p.descripcion
          };
          this.cuerpoMetas.meta_zonal.push({...obj});
        });
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Politicas');
      }
    )

    // precarga ppg
    this.cuerpoMetas.ppg = [];
    (this as any).mensajeSpinner = 'Cargando Politicas...';
    let opg = {
      "opg": elem.opg
    };
    this.lcargando.ctlSpinner(true);
    this.metaSrv.getPoliticas(opg).subscribe(
      (res) => {
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

    // precarga opg
    this.cuerpoMetas.opg = [];
    let eje = {
      'eje': elem.eje
    };
    (this as any).mensajeSpinner = 'Cargado OPG...';
    this.lcargando.ctlSpinner(true);
    this.metaSrv.getOPG(eje).subscribe(
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

    // precarga de ejes
    this.cuerpoMetas.eje = [];
    let ods = {
      "ods": elem.ods
    };
    (this as any).mensajeSpinner = 'Cargando Ejes...';
    this.lcargando.ctlSpinner(true);
    this.metaSrv.getEje(ods).subscribe(
      (res) => {
        res['data'][0]['ejes'].forEach(eje => {
          let obj = {
            id: eje.id_catalogo,
            nombre: eje.descripcion,
            valor: eje.valor
          };
          this.cuerpoMetas.eje.push({...obj})
        });
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Ejes');
      }
    );


    // precarga de metas ods
    (this as any).mensajeSpinner = 'Cargando Metas ODS...';
    this.lcargando.ctlSpinner(true);
    this.cuerpoMetas.meta_ods = [];
    this.metaSrv.getMetasODS(ods).subscribe(
      (res) => {
        res['data'].forEach(m => {
          let obj = {
            id: m.id_catalogo,
            nombre: m.descripcion
          };
          this.cuerpoMetas.meta_ods.push({...obj})
        });
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Metas para ODS');
      }
    )
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.validarMetas();
        break;
      case "REGRESAR":
        this.cerrarModal();
        break;
    }
  }

  handleMetaODS(event) {
    this.selected.meta_ods = event;
  }

  cerrarModal() {
    this.activeModal.close();
  }

  // cargaProgramas() {
  //   (this as any).mensajeSpinner = "Cargando Programas...";
  //   this.lcargando.ctlSpinner(true);

  //   this.metaSrv.getProgramas().subscribe(
  //     (res)=>{
  //       console.log(res);
  //       res['data'].forEach(prog => {
  //         let programa = {
  //           id: prog.id_catalogo,
  //           nombre: prog.valor,
  //           meta: null,
  //           departamento: { id: null, nombre: ''},
  //           ods: { id: null, nombre: '' },
  //           meta_ods: { id:null, nombre: '' },
  //           eje: { id: null, nombre: '' },
  //           opg: { id: null, nombre: '' },
  //           ppg: { id: null, nombre: '' },
  //           meta_zonal: { id: null, nombre: '' },
  //           competencia: { id: null, nombre: '' },
  //           oe: { id: null, nombre: '' },
  //           meta_resultado: { id: null, nombre: '' },
  //           indicador: { id: null, nombre: '' },
  //           tendencia: { id: null, nombre: '' },
  //           intervencion: { id: null, nombre: '' },
  //         }

  //         this.programas.push(programa);
  //       });
  //       this.cargaODS();
  //       this.lcargando.ctlSpinner(false);
  //     },
  //     (err)=>{
  //       this.lcargando.ctlSpinner(false);
  //       this.toastr.error(err.error.message, "Error Cargando Programas");
  //     }
  //   )
    
  // }

  // cargaODS() {
  //   (this as any).mensajeSpinner = 'Cargando ODS...';
  //   this.metaSrv.getODS().subscribe(
  //     (res) => {
  //       res['data'].forEach(ods => {
  //         let obj = {
  //           id: ods.id_catalogo,
  //           nombre: ods.descripcion
  //         };
  //         this.cuerpoMetas.ods.push({...obj});
  //       })
  //       // this.lcargando.ctlSpinner(false)
  //       this.cargarCatalogos();
  //     },
  //     (err) => {
  //       this.lcargando.ctlSpinner(false);
  //       this.toastr.error(err.error.message, 'Error cargando ODS');
  //     }
  //   )
  // }

  // cargarCatalogos() {
  //   (this as any).mensajeSpinner = 'Cargando Catalogos...';
  //   let data = {
  //     params: "'PLA_DEPARTAMENTO','PLA_COMPETENCIA','PLA_OE','PLA_META_RESULTADO',\
  //     'PLA_INDICADOR','PLA_TENDENCIA','PLA_TIPO_INTERVENCION'"
  //   };

  //   this.metaSrv.getCatalogs(data).subscribe(
  //     (res) => {
  //       // Cargar cuerpoMetas

  //       res['data']['PLA_DEPARTAMENTO'].forEach(d => {
  //         let departamento = {
  //           id: d.id_catalogo,
  //           nombre: d.valor,
  //           plan: d.grupo,
  //           presupuesto: 0
  //         };
  //         this.departamentos.push(departamento);
  //       })
        
  //       res['data']['PLA_COMPETENCIA'].forEach(ond => {
  //         let obj = {
  //           id: ond.id_catalogo,
  //           nombre: ond.valor
  //         };
  //         this.cuerpoMetas.competencia.push(obj);
  //       });
  //       res['data']['PLA_OE'].forEach(ond => {
  //         let obj = {
  //           id: ond.id_catalogo,
  //           nombre: ond.valor
  //         };
  //         this.cuerpoMetas.oe.push(obj);
  //       })
  //       res['data']['PLA_META_RESULTADO'].forEach(ond => {
  //         let obj = {
  //           id: ond.id_catalogo,
  //           nombre: ond.valor
  //         };
  //         this.cuerpoMetas.meta_resultado.push(obj);
  //       })
  //       res['data']['PLA_INDICADOR'].forEach(ond => {
  //         let obj = {
  //           id: ond.id_catalogo,
  //           nombre: ond.valor
  //         };
  //         this.cuerpoMetas.indicador.push(obj);
  //       })
  //       res['data']['PLA_TENDENCIA'].forEach(ond => {
  //         let obj = {
  //           id: ond.id_catalogo,
  //           nombre: ond.valor
  //         };
  //         this.cuerpoMetas.tendencia.push(obj);
  //       })
  //       res['data']['PLA_TIPO_INTERVENCION'].forEach(ond => {
  //         let obj = {
  //           id: ond.id_catalogo,
  //           nombre: ond.valor
  //         };
  //         this.cuerpoMetas.intervencion.push(obj);
  //       })
  //       // this.obtenerMetas();
  //       this.lcargando.ctlSpinner(false)
  //     },
  //     (err) => {
  //       this.lcargando.ctlSpinner(false)
  //       this.toastr.error(err.error.message, 'Error cargando Catalogos')
  //     }
  //   )
  // }

  // obtenerMetas() {

  //   (this as any).mensajeSpinner = 'Obteniendo Metas...';
  //   let data = {
  //     params: this.programas
  //   };

  //   this.metaSrv.obtenerMetas(data).subscribe(
  //     (res) => {
  //       // console.log(res['data'])
  //       if (res['data'].length > 0) {
  //         res['data'].forEach(m => {
  //           // console.log(m)
  //           let meta = {
  //             meta: m.id !== null ? m.id : null,
  //             ods: m.ods !== null ? { id: m.ods.id_catalogo, nombre: m.ods.descripcion } : { id: null, nombre: '' },
  //             meta_ods: m.meta_ods !== null ? { id: m.meta_ods.id_catalogo, nombre: m.meta_ods.descripcion } : { id: null, nombre: '' },
  //             eje: m.eje !== null ? { id: m.eje.id_catalogo, nombre: m.eje.descripcion } : { id: null, nombre: '' },
  //             opg: m.opg !== null ? { id: m.opg.id_catalogo, nombre: m.opg.descripcion } : { id: null, nombre: '' },
  //             ppg: m.ppg !== null ? { id: m.ppg.id_catalogo, nombre: m.ppg.descripcion } : { id: null, nombre: '' },
  //             meta_zonal: m.meta_zonal !== null ? { id: m.meta_zonal.id_catalogo, nombre: m.meta_zonal.descripcion } : { id: null, nombre: '' },
  //             competencia: m.competencia !== null ? { id: m.competencia.id_catalogo, nombre: m.competencia.valor } : { id: null, nombre: '' },
  //             oe: m.oe !== null ? { id: m.oe.id_catalogo, nombre: m.oe.valor } : { id: null, nombre: '' },
  //             meta_resultado: m.meta_resultado !== null ? { id: m.meta_resultado.id_catalogo, nombre: m.meta_resultado.valor } : { id: null, nombre: '' },
  //             indicador: m.indicador !== null ? { id: m.indicador.id_catalogo, nombre: m.indicador.valor } : { id: null, nombre: '' },
  //             tendencia: m.tendencia !== null ? { id: m.tendencia.id_catalogo, nombre: m.tendencia.valor } : { id: null, nombre: '' },
  //             intervencion: m.intervencion !== null ? { id: m.intervencion.id_catalogo, nombre: m.intervencion.valor } : { id: null, nombre: '' },
  //           };
  //           Object.assign(this.programas.find(p => p.id == m.programa.id_catalogo), meta);
  //         });
  //         this.lcargando.ctlSpinner(false);
  //       }
  //     },
  //     (err) => {
  //       this.lcargando.ctlSpinner(false);
  //       this.toastr.error(err.error.message, 'Error obteniendo Metas de Programas');
  //     }
  //   )
  // }

  handleODS(event) {
    this.cargaMetaODS(event);
    this.seleccion.opg = 0;
    this.seleccion.ppg = 0;
    this.seleccion.meta_zonal = 0;
    // this.selected.ods.id = this.seleccion.ods.id;
    // this.selected.ods.nombre = this.seleccion.ods.nombre;
    this.selected.ods = event;
  }

  cargaMetaODS(event?) {

    if(event) {
      this.cuerpoMetas.meta_ods = [];
      this.seleccion.meta_ods = 0;
      let data = {
        "ods": event
      };
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
    // else if (!this.click.meta_ods) {
    //   this.click.meta_ods = true;
    //   this.cuerpoMetas.meta_ods = [];
    //   this.seleccion.meta_ods = 0;
    //   let data = {
    //     "ods": this.seleccion.ods
    //   };
    //   (this as any).mensajeSpinner = 'Cargado Metas para ODS...';
      
    //   this.lcargando.ctlSpinner(true);
    //   this.metaSrv.getMetasODS(data).subscribe(
    //     (res) => {
    //       res['data'].forEach(m => {
    //         let obj = {
    //           id: m.id_catalogo,
    //           nombre: m.descripcion
    //         };
    //         this.cuerpoMetas.meta_ods.push({...obj})
    //       });
    //       this.lcargando.ctlSpinner(false);
    //       this.cargaEje(event);
    //     },
    //     (err) => {
    //       this.lcargando.ctlSpinner(false);
    //       this.toastr.error(err.error.message, 'Error cargando Metas para ODS');
    //     }
    //   )
    // }

  }

  cargaEje(event?) {

    if (event) {
      this.cuerpoMetas.eje = [];
      this.seleccion.eje = 0;
      this.step = 3;
      let data = {
        "ods": event
      };
      (this as any).mensajeSpinner = 'Cargando Ejes...';

      this.lcargando.ctlSpinner(true);
      this.metaSrv.getEje(data).subscribe(
        (res) => {
          res['data'][0]['ejes'].forEach(eje => {
            let obj = {
              id: eje.id_catalogo,
              nombre: eje.descripcion,
              valor: eje.valor
            };
            this.cuerpoMetas.eje.push({...obj});
            if(eje.id_catalogo === res['data'][0]['ejes'].length){
              this.lcargando.ctlSpinner(false);
            }
          });
          // setTimeout(() => {
          
          // }, 0)
        
        },
        (err) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.error(err.error.message, 'Error cargando Ejes');
        }
      )
    } 

  }

  
  handleEje(event) {
    this.cargaOPG(event);
    this.seleccion.ppg = 0;
    this.seleccion.meta_zonal = 0;
    this.selected.eje = event;
  }

  cargaOPG(event?) {

    if(event) {
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
      
  }

  handleOPG(event) {
    this.cargaPPG(event);
    this.seleccion.meta_zonal = 0;
    this.selected.opg = event;
  }

  cargaPPG(event?) {
    
    if(event){
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

  }

  handlePPG(event) {
    this.cargaMetaZonal(event);
    this.selected.ppg = event;
  }

  cargaMetaZonal(event?) {

    if(event){
      this.cuerpoMetas.meta_zonal = [];
      this.seleccion.meta_zonal = 0;
      this.step = 6;
      (this as any).mensajeSpinner = 'Cargando Metas para la Zona...';
      let data = {
        "politica": event
      };
      console.log(data);

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

  }

  handleMetaZonal(event) {
    this.selected.meta_zonal = event;
  }

  handleCompetencia(event) {
    this.selected.competencia = event;
  }

  handleOE(event) {
    this.selected.oe = event;
  }

  handleMetaRes(event) {
    this.selected.meta_resultado = event;
  }

  handleIndicador(event) {
    this.selected.indicador = event;
  }

  handleTendencia(event) {
    this.selected.tendencia = event;
  }

  handleIntervencion(event) {
    this.selected.intervencion = event;
  }

  firstStep(event) {

    // console.log(event);
    // console.log(this.departamentos);
    this.seleccion.id = event.id;
    this.seleccion.nombre = event.nombre;
    if (event) {
      this.deptFiltrado = this.departamentos.filter(d => d.plan == event['nombre']);

    } else {
      this.deptFiltrado = [];
    }
    // console.log(this.deptFiltrado);

  }

  handlePrograma(event){
    this.firstStep(event);
    this.selected.id = event.id;
    this.selected.nombre = event.nombre;
  }
  
  handleDepartamento(event) {
    this.selected.departamento.id = this.seleccion.departamento.id;
    this.selected.departamento.nombre = this.seleccion.departamento.nombre;
  }

  validarMetas() {
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
        text: 'Existen campos sin llenar, porfavor verifique que seleccione un valor para todos los campos',
        icon: 'warning'
      });
      return
    } else {
      // despues de todas las validaciones
      // Object.assign(this.programas.find(p => p.id == this.seleccion.id), this.selected);
      this.guardaMetas();
    }

  }

  guardaMetas() {
    let data = {
      accion: 'ACTUALIZAR METAS A PROGRAMAS',
      ip: this.commonSrv.getIpAddress(),
      id_controlador: myVarGlobals.fProgMetas,
      cambio: this.selected
    };
    // console.log(data);
    (this as any).mensajeSpinner = 'Guardando Metas por Programa...';
    this.lcargando.ctlSpinner(true);
    this.metaSrv.editarMeta(data).subscribe(
      res => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          title: this.fTitle,
          text: res['data'],
          icon: 'success'
        }).then((result) => {
          if (result.isConfirmed) {
            this.activeModal.close();
            this.commonVarSrv.editMetaPlanificacion.next(true);
          }
        });
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error guardando Metas por Programa');
      }
    )

    
  }

}
