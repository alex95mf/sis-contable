import { FormBuilder, FormGroup } from '@angular/forms';
import {  Inject,
  ElementRef,Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from "../../../../global";
import { ToastrService } from 'ngx-toastr';
import { TramitesService } from '../tramites.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ModalTareasComponent } from '../configuracion/modal-tareas/modal-tareas.component';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import * as joint from 'jointjs';
import { g } from 'jointjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
standalone: false,
  selector: 'app-tramite',
  templateUrl: './dfd.component.html',
  styleUrls: ['./dfd.component.scss']
})
export class DfdComponent implements OnInit {
  cities = [];
  selectedCityIds: string[];
  users = [];
  heightTr = 0;

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
 
  usuarios: any = [];
  usuariosMultiselect: any = [];
  almacenUsuarios: any = []
  pasosL: any = []
  pasosD: any = []
  pasosT: any = []
  pasosS: any = []

  dataUser: any;

  permissions: any;

  listaPasos: any = []

  pregunta = ['SI', 'NO'];

  numeroPasos = [];

  usuariospre: any = [];

  selectUser: any = null;
  selectedUsers: any = []

  flujo: any = null;
  preguntaDisabled = false;
  formReadOnly = false;
  validacionF = true;

  disabled: boolean =true;
  disabledPasos: boolean =true;

  //lista para actualizar
  usuarioActualizar: any = [];
  fk_flujoActualizar: any;
  lengthPasos: any;
  lengthUsuarios: any;

  tarea: any = {
    nombre: null,
    descripcion: null,
    tipo: 0,
    id_usuario: null,
    prioridad:  0,
    dias_totales: null
  }

  vmButtons: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  pasoActual: any;
  pasoSeleccionado: any;
  selectedPasos = [];









  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mainContainer') mainContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('canvasNameInput') canvasNameInput!: ElementRef<HTMLInputElement>;
  title = 'frontEndAngular';
  private lineCount = 0;
 


  private paper!: joint.dia.Paper;
  private graph!: joint.dia.Graph;
  paso: any = 0;
  //lineCount = 1;
  canvasNames: string[] = [''];
  private graphData = {
    cells: [
      {
        paso:0,
        type: 'standard.Circle',
        id: 'circle2',
        position: { x: 100, y: 70 },
        size: { width: 40, height: 40 },
        attrs: {
          body: { fill: 'lightgreen' },
          label: {
            text: 'Inicio',
            fill: 'black',
            refY: -15, // Ajusta la posición vertical del label
            yAlignment: 'middle',
          },
          pregunta: {
            text: '',
          },
          dias: {
            text: '',
          },
          usuario: {
            text: '',
          },
        },
      },
    ],
  };
  







  constructor(private ticketSrv: TramitesService,@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private commonVrs: CommonVarService,
    private serviceAdmin: TramitesService,
    private toastr: ToastrService,
   
    
  ) {
    
    this.commonVrs.usuarioTramite.asObservable().subscribe(
      (res)=>{
        this.usuarios = [res['data'], ...this.usuarios]
       
      }
    );

    this.commonVrs.selectTramites.asObservable().subscribe((res) => {
      this.mensajeSppiner = "Cargando lista de Usuarios...";
      this.lcargando.ctlSpinner(true);
      this.tarea = res.tarea;

      console.log(this.tarea);
      console.log("resmh", res);
      const jsonString = res.tarea?.jsonfiguras;
      if (
        jsonString !== null &&
        jsonString !== undefined &&
        jsonString.trim() !== "" && (res.tarea?.ultima_actualizacion == null || res.tarea?.ultima_actualizacion == "grafica")
      ) {
        console.log("res.tarea?.ultima_actualizacion",res.tarea);
        this.graphData = JSON.parse(jsonString);

        this.fk_flujoActualizar = res.tarea.id_flujo;
        this.serviceAdmin.getUsuariosFlujo(res.tarea).subscribe((res1) => {
          console.log(res1["data"]);
          this.lengthUsuarios = res1["data"].length;
          res1["data"].map((data) => {
            // console.log(data);
            this.usuarioActualizar = [...this.usuarioActualizar, data];
            data["user"]["id_flujo_usuarios"] = data["id_flujo_usuarios"];
            this.usuarios = [data["user"], ...this.usuarios];
          });

        })
        this.cargar();
        
        this.vmButtons[0]["habilitar"] = true;
        this.vmButtons[1]["habilitar"] = true;
        this.vmButtons[2]["habilitar"] = false;
        this.lcargando.ctlSpinner(false);
      } else {
       

      console.log("antes de sale del cargar");

      console.log("sssssssssssssssssi sale del cargar");
      this.fk_flujoActualizar = res.tarea.id_flujo;
      this.serviceAdmin.getUsuariosFlujo(res.tarea).subscribe((res1) => {
        console.log(res1["data"]);
        this.lengthUsuarios = res1["data"].length;
        res1["data"].map((data) => {
          // console.log(data);
          this.usuarioActualizar = [...this.usuarioActualizar, data];
          data["user"]["id_flujo_usuarios"] = data["id_flujo_usuarios"];
          this.usuarios = [data["user"], ...this.usuarios];
        });
        // console.log(this.usuarios);
        this.serviceAdmin.getUsuariosPasos(res.tarea).subscribe((res2) => {
          this.listaPasos = res2["data"];
          this.lengthPasos = this.listaPasos.length;
          console.log("lista de pasos   ", this.listaPasos);

          let arrayfiguras = [];
          let arraylinks = [];

          //inicio
let idInicioDelFlujo = 0;
          let inicio = {
            paso: 0,
            type: "standard.Circle",
            id: "circle2",
            position: { x: 100, y: 70 },
            size: { width: 40, height: 40 },
            attrs: {
              body: { fill: "lightgreen" },
              label: {
                text: "Inicio",
                fill: "black",
                refY: -15, // Ajusta la posición vertical del label
                yAlignment: "middle",
              },
              pregunta: {
                text: "",
              },
              dias: {
                text: "",
              },
              usuario: {
                text: "",
              },
            },
          };

          arrayfiguras.push(inicio);

          this.listaPasos.forEach((element) => {
            let nombreUsuario;
            let usuarionombreUsuario = this.usuarios.find(usuario => usuario.id_usuario == element.fk_usuario_atiende)  
               
            if (usuarionombreUsuario) {
              // Obtener el nombre del usuario
              nombreUsuario = usuarionombreUsuario.nombre;
              
              // Usar el nombre del usuario como desees, por ejemplo:
             
          }


            if(idInicioDelFlujo == 0){
              idInicioDelFlujo= element.nro_paso
            }else if(idInicioDelFlujo > element.nro_paso){
              idInicioDelFlujo= element.nro_paso
            }
            //crear figuras
            if (element.tiene_pregunta == "S") {
              let figura = {
                type: "standard.Polygon",
                position: {
                  x: 370,
                  y: 290,
                },
                size: {
                  width: 60,
                  height: 60,
                },
                angle: 0,
                paso: "Paso" + element.nro_paso,
                points: "30,0 60,30 30,60 0,30",
                id: "" + element.nro_paso,
                z: 3,
                attrs: {
                  body: {
                    refPoints: "0,10 10,0 20,10 10,20",
                    strokeWidth: 1,
                    stroke: "black",
                    fill: "orange",
                  },
                  label: {
                    refY: -15,
                    fill: "black",
                    num: "Paso" + element.nro_paso,
                    text: element.descripcion,
                    yAlignment: "middle",
                  },
                  pregunta: {
                    text: element.pregunta_texto,
                  },
                  dias: {
                    text: element.dias,
                  },
                  usuario: {
                    text: ""+nombreUsuario,
                    value: element.fk_usuario_atiende
                  },
                  id_flujo_pasos:{
                    text: element.id_flujo_pasos,
                  },
                },
              };
               
              
            
             
        
              arrayfiguras.push(figura);

              let linksi = {
                type: "standard.Link",
                source: {
                  id: "" + element.nro_paso,
                },
                target: {
                  id: "" + element.nro_paso_si,
                },
                id: element.nro_paso + "to" + element.nro_paso_si,
                z: 2,
                
                attrs: {
                  text: {
                      text: "si", // El valor de "respuesta"
                    
                  },
                  respuesta: {
                    text: "si", // El valor de "respuesta"
                   
                }
              },
              position: {
                  distance: 0.5, // Posiciona la etiqueta en el centro de la línea
              },
              labels:[ {attrs: {
                text: {
                    text: "si", // El valor de "respuesta"
                    fill: 'black',
                    fontSize: 10,
                    fontFamily: 'Arial, sans-serif',
                }
            },
            position: {
                distance: 0.5, // Posiciona la etiqueta en el centro de la línea
            }}]
              };

              let linkno = {
                type: "standard.Link",
                source: {
                  id: "" + element.nro_paso,
                },
                target: {
                  id: "" + element.nro_paso_no,
                },
                id: element.nro_paso + "to" + element.nro_paso_no,
                z: 2,
                
                attrs: {
                  text: {
                      text: "no", // El valor de "respuesta"
                      fill: 'black',
                      fontSize: 10,
                      fontFamily: 'Arial, sans-serif',
                  }, respuesta: {
                    text: "no", // El valor de "respuesta"
                   
                }
              },
              position: {
                  distance: 0.5, // Posiciona la etiqueta en el centro de la línea
              }
              ,
            labels:[ {attrs: {
              text: {
                  text: "no", // El valor de "respuesta"
                  fill: 'black',
                  fontSize: 10,
                  fontFamily: 'Arial, sans-serif',
              }
          },
          position: {
              distance: 0.5, // Posiciona la etiqueta en el centro de la línea
          }}]
              };

 
              if (
                element.nro_paso_no != null &&
                element.nro_paso_no != "" &&
                element.nro_paso_no != undefined
              ) {
                
                arraylinks.push(linkno)
             
              }
              if (
                element.nro_paso_si != null &&
                element.nro_paso_si != "" &&
                element.nro_paso_si != undefined
              ) {
                arraylinks.push(linksi)
             
              }
            

             
           
            } else {
              let figura = {
                type: "standard.Rectangle",
                position: {
                  x: 550,
                  y: 40,
                },
                size: {
                  width: 100,
                  height: 40,
                },
                angle: 0,
                paso: "Paso" + element.nro_paso,
                id: "" + element.nro_paso,
                z: 1,
                attrs: {
                  body: {
                    fill: "skyblue",
                  },
                  label: {
                    refY: -15,
                    fill: "black",
                    num: "Paso" + element.nro_paso,
                    text: element.descripcion,
                    yAlignment: "middle",
                  },
                  pregunta: {
                    text: element.pregunta_texto,
                  },
                  dias: {
                    text: element.dias,
                  },
                  usuario: {
                    text: ""+nombreUsuario,
                    value: element.fk_usuario_atiende
                  }, 
                  id_flujo_pasos:{
                    text: element.id_flujo_pasos,
                  },
                },
              };

              arrayfiguras.push(figura);
            }

            if (element.termina_flujo == "S ") {
              let pasofin = {
                type: "standard.Circle",
                position: {
                  x: 580,
                  y: 510,
                },
                size: {
                  width: 40,
                  height: 40,
                },
                angle: 0,
                paso: "Fin",
                id: element.nro_paso + "fin",
                z: 16,
                attrs: {
                  body: {
                    fill: "red",
                  },
                  label: {
                    refY: -15,
                    fill: "black",
                    text: "Fin",
                    yAlignment: "middle",
                  },
                  pregunta: {
                    text: "Fin",
                  },
                  dias: {
                    text: "Fin",
                  },
                  usuario: {
                    text: "Fin",
                  },
                },
              };

              let link = {
                type: "standard.Link",
                source: {
                  id: "" + element.nro_paso,
                },
                target: {
                  id: "" + element.nro_paso + "fin",
                },
                id: element.nro_paso + "to" + element.nro_paso + "fin",
                z: 2,
                attrs: {},
              };

              arrayfiguras.push(pasofin);
              arraylinks.push(link);
            } else {
              if (
                element.siguiente_paso != null &&
                element.siguiente_paso != "" &&
                element.siguiente_paso != undefined
              ) {
                let link = {
                  type: "standard.Link",
                  source: {
                    id: "" + element.nro_paso,
                  },
                  target: {
                    id: "" + element.siguiente_paso,
                  },
                  id: element.nro_paso + "to" + element.siguiente_paso,
                  z: 2,
                  attrs: {},
                };

                arraylinks.push(link);
              }
            
                if (
                  element.siguiente_paso != null &&
                  element.siguiente_paso != "" &&
                  element.siguiente_paso != undefined
                ) {
                  let link = {
                    type: "standard.Link",
                    source: {
                      id: "" + element.nro_paso,
                    },
                    target: {
                      id: "" + element.siguiente_paso,
                    },
                    id: element.nro_paso + "to" + element.siguiente_paso,
                    z: 2,
                    attrs: {},
                  };
  
                  arraylinks.push(link);
                }
              
                  if (
                    element.siguiente_paso_tres != null &&
                    element.siguiente_paso_tres != "" &&
                    element.siguiente_paso != undefined
                  ) {
                    let link = {
                      type: "standard.Link",
                      source: {
                        id: "" + element.nro_paso,
                      },
                      target: {
                        id: "" + element.siguiente_paso,
                      },
                      id: element.nro_paso + "to" + element.siguiente_paso,
                      z: 2,
                      attrs: {},
                    };
    
                    arraylinks.push(link);
                  }


            }
            //crear enlaces

            let linkinicio = {
              type: "standard.Link",
              source: {
                id: "circle2",
              },
              target: {
                id: "" + idInicioDelFlujo,
              },
              id: "circle2to" + idInicioDelFlujo,
              z: 2,
              attrs: {},
            };

            arraylinks.push(linkinicio);
            

          });

          //
          let newArray = arrayfiguras.concat(arraylinks);

          //
          this.graphData = { cells: newArray };
          console.log("ya armado", this.graphData);
          this.cargar();

          this.vmButtons[0]["habilitar"] = true;
          this.vmButtons[1]["habilitar"] = true;
          this.vmButtons[2]["habilitar"] = false;
          this.lcargando.ctlSpinner(false);
        });
      });
     //armar trama con el los datos de pasos
    }
  });

  }

  @ViewChild('diagramContainer', { static: true })
    diagramContainer!: ElementRef;
  ngOnInit(): void {

  
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.cargar();
      }, 500);
    }
   
    this.getData();
    this.selectAllForDropdownItems(this.getData());
    this.vmButtons = [
      {
        orig: "btnsTramite",
        paramAccion: "",
        boton: { icon: "far fa-search-plus", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsTramite",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsTramite",
        paramAccion: "",
        boton: { icon: "fas fa-edit", texto: "ACTUALIZAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true
      },
      {
        orig: "btnsTramite",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false
      },
    ];

    this.validatePermission()
    // setTimeout(()=>{
      
  //   // },50)

    setTimeout(() => {this.cargarUsuarios()}, 50)
  }
  onMaterialGroupChange(event) {
   // this.modalService.open('#content');
    console.log(event);
    event.forEach((element,index)=>{
      console.log('escribir preguntas ' + element.id_usuario +' '+element.nombre)
    });
    
  }

  getData() {
    return (this.cities = [
      { id: 1, name: 'Amar' },
      { id: 2, name: 'Akbhar' },
      { id: 3, name: 'Anthony' },
      { id: 4, name: 'BadkaG' },
      { id: 5, name: 'Baave' },
    ]);
   
  }

  selectAllForDropdownItems(items: any[]) {
    //this.applyStyles();
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
   
  }

  applyStyles() {
    this.heightTr += +27;
    const styles = {'height' : this.heightTr +'px'};
    return styles;
}

  //onItemSelect(item: any) {
  //   console.log(item);
  // }
  // onSelectAll(items: any) {
  //   console.log(items);
  // }
  metodoGlobal(event){
    switch(event.items.boton.texto){
      case "BUSCAR":
        this.buscarTarea();
        break;
      case "GUARDAR":
        this.validateSaveContribuyente('save')
        break;
      case "ACTUALIZAR":
        this.validateSaveContribuyente('update')
        
        break;
      case "LIMPIAR":
        this.cancelar()
        break;
    }
  }

  getCatalogo() {
    let data = {
      params: "'TRAMITES_DOCUMENTOS'",
    };
    this.serviceAdmin.getCatalogs(data).subscribe(
      (res) => {
        console.log(res)
      //  this.documentos = res["data"]['TRAMITES_DOCUMENTOS'];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  eliminarlPaso(event, pasos, val,index){
    // console.log(event, pasos);
   if(event == pasos){
      console.log(event, pasos);
      // this.listaPasos.filter(p => {p.nro_paso != event});
     this.toastr.info("No puede ingresar el mismo paso");
    // pasos.siguiente_paso = null;
      if(val == 'S'){
        setTimeout(() => {
          pasos.nro_paso_si = null;
        }, 50);
        //console.log(pasos);
      }else if(val == 'N'){
        setTimeout(() => {
          pasos.nro_paso_no = null;
        }, 50);
        //console.log(pasos);
      }else if(val == 'SP'){     
        setTimeout(() => {
          pasos.siguiente_paso = null;
        }, 50);
      }
    }else{
    pasos.siguiente_paso = event
   }
  }

  buscarTarea(){
    let modal = this.modalService.open(ModalTareasComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
  }

  sumaDias(event){
    if(event){
      let diasSuma =0
      this.listaPasos.forEach(e => {
        diasSuma += +e.dias;
      });
      this.tarea.dias_totales= diasSuma
    }
  }

  cancelar(){
    this.usuarios = []
    this.tarea = {
      nombre: null,
      descripcion: null,
      tipo: 0,
      id_usuario: null,
      prioridad:  0,
      dias_totales: null
    };
    this.preguntaDisabled = false;
    this.formReadOnly = false;
    this.listaPasos = [];
    this.vmButtons[0]['habilitar'] = false;
    this.vmButtons[1]['habilitar'] = false;
    this.vmButtons[2]['habilitar'] = true;
  }


  async validateSaveContribuyente(validacion) {
 
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          if(validacion == 'save'){
            this.confirmSave(
              "Seguro desea guardar la Tarea?",
              "SAVE_VENDEDOR"
            );
          }else if(validacion == 'update'){
            this.confirmSave(
              "Seguro desea editar la Tarea?",
              "UPDATE_VENDEDOR"
            );
            
          }
          
        }
      });
    }
  }


  validateDataGlobal(){
    //console.log(this.tarea.tipo);
    let flag = false;
    return new Promise((resolve, reject)=>{
      if (
        this.tarea.tipo == "" ||
        this.tarea.tipo == 0 ||
        this.tarea.tipo == null
        ) {
        this.toastr.info("Seleccione el tipo de tramite");
        flag = true;
      } else if (
        this.tarea.nombre == "" ||
        this.tarea.nombre == undefined
      ){
        this.toastr.info("Ingrese una tarea");
        flag = true;
      }  else if (
        this.tarea.descripcion == "" ||
        this.tarea.descripcion == undefined
      ){
        this.toastr.info("Ingrese la descripcion ");
        flag = true;
      } else if (
        this.tarea.prioridad == "" ||
        this.tarea.prioridad == undefined
      ){
        this.toastr.info("Seleccione la prioridad");
        flag = true;
      }
      else if (
        this.tarea.dias_totales == "" ||
        this.tarea.dias_totales == undefined
      ){
        this.toastr.info("Ingrese los días totales");
        flag = true;
      } 
      // else if (
      //   this.usuarios.length == 0
      // ){
      //   this.toastr.info("Ingrese los Usuario");
      //   flag = true;
      // } 
      // else if (
      //   this.listaPasos.length == 0
      // ){
      //   this.toastr.info("Ingrese los pasos");
      //   flag = true;
      // }
      if(this.listaPasos.length > 0){
        let ultimoPaso= 0;
        this.listaPasos.map(
          (pasos, index)=>{
          
          //  const duplicados = array =>
          //   new Set(array).size < array.length
          //   arrayP.push(duplicados([pasos['nro_paso'], pasos['siguiente_paso']]))
             //console.log(parseInt(pasos['nro_paso'])==parseInt(pasos['siguiente_paso']))
             //ultimoPaso = this.listaPasos[this.listaPasos.length-1];
             ultimoPaso = this.listaPasos[this.listaPasos.length-1];
             console.log(ultimoPaso)
            if(pasos['fk_usuario_atiende'] == null && pasos.grupo_usuarios==null){
              this.toastr.info("Ingrese el usuario en el paso " + (index + 1));
              flag = true;
            }else if(pasos['descripcion'] == null){
              this.toastr.info("Ingrese la descripcion en el paso " + (index + 1));
              flag = true;
            }else if(pasos['tiene_pregunta'] == 'S'){
              if(pasos['pregunta_texto'] == null){
                this.toastr.info("Ingrese la pregunta en el paso " + (index + 1));
                flag = true;
              }
            }else if(pasos['tiene_pregunta'] == 'N'){
              if(pasos['siguiente_paso'] == null){
                this.toastr.info("Ingrese el siguiente paso en el paso " + (index + 1));
                flag = true;
              }
            }else if(pasos['tiene_pregunta'] == null ){
              this.toastr.info("Ingrese tiene pregunta en el paso " + (index + 1));
              flag = true;
            }else if(pasos['hito'] == null ){
              this.toastr.info("Ingrese es hito en el paso " + (index + 1));
              flag = true;
            }
             if(parseInt(pasos['nro_paso'])==parseInt(pasos['siguiente_paso'])){
              //console.log("entra aca")
                this.toastr.info("El nro de paso no puede ser igual al siguiente paso en el paso" + (index + 1));
                flag = true;
             }
             if(pasos['nro_paso']!= ultimoPaso['nro_paso'] && pasos['siguiente_paso']==0){ 
              this.toastr.info("No puede terminar el flujo en un paso anterior al paso " + ultimoPaso['nro_paso'] );
                flag = true;
             }
          }
        )
      }

      !flag ? resolve(true) : resolve(false);
    })
  }

  async confirmSave(message, action, infodev?: any) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if(action == "SAVE_VENDEDOR"){
          //this.guardarTarea()
          this.guardarDatos()
        } else if(action == "UPDATE_VENDEDOR"){
          //this.actualizarTarea()
          this.ActualizarDatos()
        }
        
      }
    });
  }

  actualizarTarea(){
    this.mensajeSppiner = "Actualizando Tarea...";
    this.lcargando.ctlSpinner(true);
    if(this.listaPasos.length > this.lengthPasos){
      //console.log('Ingreso actualizar pasos');
      this.listaPasos.map((data)=>{
        data['fk_flujo'] = this.fk_flujoActualizar
        data['id_usuario'] = this.dataUser.id_usuario;
      })
    }
    //console.log(this.usuarios.length);
    //console.log(this.usuarioActualizar.length);
    if( this.usuarios.length > this.usuarioActualizar.length ){
      //console.log('ingreso a actualizar usuarios');
      //console.log(this.usuarios.length);
      this.usuarioActualizar = []
      this.usuarios.map((data)=>{
        let valor = {
          id_flujo_usuarios: data['id_flujo_usuarios'],
          fk_flujo: this.fk_flujoActualizar,
          fk_usuario: data.id_usuario,
          id_usuario:this.dataUser.id_usuario,
        }
        this.usuarioActualizar = [valor, ...this.usuarioActualizar]
      })
    }
    
    let data ={
      tarea: this.tarea,
      usuarios: this.usuarioActualizar,
      pasos: this.listaPasos
    }
    console.log(data);
    this.serviceAdmin.ActualizarTarea(data).subscribe(
      (res)=>{
        Swal.fire({
          icon: "success",
          title: "Éxito!",
          text: "El trámite fue actualizado con éxito",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        })
        this.lcargando.ctlSpinner(false);
        this.cancelar()
        //console.log(res);
      },
      (erro)=>{
        console.log(erro);
      }
    )
  }

  cargarUsuarios(){
    //console.log('ejecuto');
    this.mensajeSppiner = "Cargando lista de Usuarios...";
    this.lcargando.ctlSpinner(true);
    this.serviceAdmin.getUsuarios({}).subscribe(
      (res)=>{
        //console.log(res['data']);
        res['data'].map((data)=>{
          data['id_flujo_usuarios'] =  0
        })
        
        this.usuariospre = res['data']
        // console.log(this.usuariospre);
        this.lcargando.ctlSpinner(false);
      }
    )
  }


  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let params = {
      codigo: myVarGlobals.fContribuyente,
      id_rol: this.dataUser.id_rol,
    };

    this.serviceAdmin.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        // console.log(this.permissions);
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Clientes"
          );
          // this.lcargando.ctlSpinner(false);
        } else {
          // setTimeout(() => {
          //   this.fillCatalog();
          // }, 500);
        }
      },
      (error) => {
        // this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  guardarTarea(){
  
    this.mensajeSppiner = "guardando Tarea...";
    this.lcargando.ctlSpinner(true);
    //console.log(this.dataUser);
    //console.log(this.tarea);
    // let flujo: any = null;
    this.tarea['id_usuario'] = this.dataUser.id_usuario;
    this.serviceAdmin.crearFlujo(this.tarea).subscribe(
      (res)=>{
        

        //console.log(res);
        // this.flujo = res['data']
        //console.log(res['data']['id_flujo']);
        this.agregarFlujoUsuario(res['data']['id_flujo']);
        this.preguntaDisabled = false;
        this.formReadOnly = false;

      },
      (error)=>{
        console.log(error);
      }
    )
    
   

  }

  agregarFlujoUsuario(flujo){
    let usuariosRequest: any = []

    this.usuarios.map((data)=>{
      let valor = {
        id_flujo_usuarios: 0,
        fk_flujo: flujo,
        fk_usuario: data.id_usuario,
        id_usuario:this.dataUser.id_usuario,
      }
      usuariosRequest.push(valor)
    })

    let data={
      params: usuariosRequest
    }

    console.log(data);
    
   

    
    this.serviceAdmin.crearFlujoUsuario(data).subscribe(
       (res)=>{
        console.log(res);
        this.guardarPasos(flujo)
      },
      (error)=>{
        this.lcargando.ctlSpinner(true);
        console.log(error);
        
     }
    )

  }


  actualizarFlujoUsuario(flujo){




    let usuariosRequest: any = []

    this.usuarios.map((data)=>{
      let valor = {
        id_flujo_usuarios: 0,
        fk_flujo: flujo,
        fk_usuario: data.id_usuario,
        id_usuario:this.dataUser.id_usuario,
      }
      usuariosRequest.push(valor)
    })

    let data={
      params: usuariosRequest
    }

    console.log(data);
    
    if( this.usuarios.length > this.usuarioActualizar.length ){
      //console.log('ingreso a actualizar usuarios');
      //console.log(this.usuarios.length);
      this.usuarioActualizar = []
      this.usuarios.map((data)=>{
        let valor = {
          id_flujo_usuarios: data['id_flujo_usuarios'],
          fk_flujo: this.fk_flujoActualizar,
          fk_usuario: data.id_usuario,
          id_usuario:this.dataUser.id_usuario,
        }
        this.usuarioActualizar = [valor, ...this.usuarioActualizar]
      })
    }
  

    let datasend = {
      user_token_id: this.tarea.user_token_id,
      params:this.usuarioActualizar
    }
    this.serviceAdmin.crearFlujoUsuario(datasend).subscribe(
       (res)=>{
        console.log(res);
        this.guardarPasos(flujo)
      },
      (error)=>{
        console.log(error);
        this.lcargando.ctlSpinner(true);
     }
    )

  }



  agregarPasos(){
    
    if(this.usuarios.length != 0){
      let pasos = {
        id_flujo_pasos: 0,
        fk_flujo: null,
        nro_paso: null,
        tiene_pregunta: null,
        pregunta_texto: null,
        nro_paso_si: null,
        nro_paso_no: null,
        siguiente_paso: null,
        siguiente_paso_dos: null,
        siguiente_paso_tres: null,
        fk_usuario_atiende: null,
        estado_flujo: null,
        termina_flujo: null,
        id_usuario: null,
        prioridad: null,
        descripcion: null,
        dias: null,
        grupo_usuarios: null
      }
      
      pasos['nro_paso'] = this.listaPasos.length +1;

      this.listaPasos.push(pasos);
      //if(pasos['nro_paso'] != 1){
      this.pasosL.push(pasos['nro_paso'] )
      this.pasosS.push(pasos);

      //}
    } else {
      this.toastr.info('Ingrese los usuarios')
    }
    


  }

  

  limpiarCampos(pasos){
    console.log(this.pasosL);
    pasos.pregunta_texto = null;
    pasos.nro_paso_si = null;
    pasos.nro_paso_no = null;
    pasos.siguiente_paso = null;
    pasos.siguiente_paso_dos = null;
    pasos.siguiente_paso_tres = null;
    this.validacionF = false;
    // if(this.pasosL.length == 0){
    //   this.pasosL.push(pasos['']);
    // }else{
    //   this.pasosL.map((paso)=>{
    //     if(paso != pasos){
    //       this.pasosL.push(pasos);
    //     }
    //   })
    // }
    
    
    
    

  }

  eliminarPaso(pasos, index){
    Swal.fire({
      icon: "warning",
      title: "Atención!",
      text: "Esta seguro que desea eliminar este registro?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if(result.isConfirmed){
        if(pasos['id_flujo_pasos'] == 0){
          this.listaPasos.splice(index,1);
          console.log(this.pasosL.filter((p)=>pasos['nro_paso'] != p));
          this.pasosL = this.pasosL.filter((p)=>pasos['nro_paso'] != p);
        }else if(pasos['id_flujo_pasos'] != 0){
          this.serviceAdmin.deletePasos(pasos).subscribe(
            (res)=>{
              Swal.fire({
                icon: "success",
                title: "Éxito!",
                text: "Se elimino con éxito",
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                cancelButtonColor: '#F86C6B',
                confirmButtonColor: '#4DBD74',
              })
              console.log(res);
              this.listaPasos.splice(index,1);
            }
          )
        }
      }
    })
  }

  eliminarUsuario(user, index){
   // console.log(user);

    let flag = true;
    let paso_configurado = "";
    for(let i = 0 ; i<this.listaPasos.length; i++){
      if(this.listaPasos[i].fk_usuario_atiende === user.id_usuario){
       // console.log(this.usuarios[i]);
        flag = false;
        paso_configurado = this.listaPasos[i].nro_paso;
        //break;
      }
    }
    if(flag){
      console.log(flag)
      Swal.fire({
        icon: "warning",
        title: "Atención!",
        text: "Esta seguro que desea eliminar este registro?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if(result.isConfirmed){
          if(user['id_flujo_usuarios'] == 0){
            this.usuarios.splice(index,1);
          }else if(user['id_flujo_usuarios'] != 0){
            this.serviceAdmin.deleteUsuario(user).subscribe(
              (res)=>{
  
                Swal.fire({
                  icon: "success",
                  title: "Éxito!",
                  text: "Se elimino con éxito",
                  showCloseButton: true,
                  showCancelButton: true,
                  showConfirmButton: true,
                  cancelButtonText: "Cancelar",
                  confirmButtonText: "Aceptar",
                  cancelButtonColor: '#F86C6B',
                  confirmButtonColor: '#4DBD74',
                })
                console.log(res);
                this.usuarios.splice(index,1);
              }
            )
          }
        }
  
      })
      
    }else{
      console.log(flag)
      this.toastr.info( "No puede eliminar este usuario porque se encuentra configurado en el paso "+paso_configurado); 
    }
  }
  guardarPasos(flujo){
    try {
    const graphData = this.graph.toJSON();
 
    const simplifiedGraphData = simplifyGraphData(graphData);
    let jsona = simplifiedGraphData.cells;
    console.log(jsona);
    const filteredSteps = jsona.filter(obj => obj.type === "standard.Rectangle" || obj.type === "standard.Polygon")
    .filter(obj => obj.paso && obj.paso.startsWith("Paso")) // Filtrar solo los pasos que empiezan con "Paso"
    .sort((a, b) => {
        const pasoA = a.paso;
        const pasoB = b.paso;
        return pasoA - pasoB;
    });
   
   // Recorrer los pasos filtrados
   filteredSteps.forEach(step => {
    // Verificar si el paso es de tipo "standard.Polygon"
    if (step.type === "standard.Polygon") {
        // Buscar los enlaces cuyo origen sea el mismo que el ID del paso actual
        const relatedLinks = jsona.filter(link => link.source && link.source.id === step.id && link.type === "standard.Link");
   
        // Iterar sobre los enlaces relacionados
        relatedLinks.forEach(link => {
            // Obtener la etiqueta del enlace
            const label = link.labels && link.labels[0] && link.labels[0].attrs && link.labels[0].attrs.text.text;
   
            // Verificar si la etiqueta es "sí" o "no" y asignar el número de paso correspondiente
            if (label === "sí") {
                step.nro_paso_si = link.target.id;
            } else if (label === "no") {
                step.nro_paso_no = link.target.id;
            }
        });
    }
   });
   
   // Obtener los IDs de los círculos con paso "Fin"
   const finCircleIds = jsona.filter(obj => obj.type === "standard.Circle" && obj.paso === "Fin").map(circle => circle.id);
   
   // Filtrar solo los enlaces que coinciden con los círculos de "Fin"
   const finCircleLinkIds = jsona
       .filter(obj => obj.type === "standard.Link") // Filtrar solo los elementos de tipo "standard.Link"
       .filter(link => finCircleIds.includes(link.target.id)) // Filtrar los enlaces que coinciden con los círculos de "Fin"
       .map(link => link.source.id); // Obtener los IDs de los enlaces
   
       const relacionesGenerales = {};
   
   // Filtrar los elementos de tipo "standard.Link" y construir el objeto de relaciones
   jsona.filter(obj => obj.type === "standard.Link").forEach(link => {
       // Verificar si el source del link existe en el objeto relacionesGenerales
       if (relacionesGenerales.hasOwnProperty(link.source.id)) {
           // Si existe, agregamos el link.source.id al arreglo existente
           relacionesGenerales[link.source.id].push(link.target.id);
       } else {
           // Si no existe, creamos un nuevo arreglo con el link.source.id
           relacionesGenerales[link.source.id] = [link.target.id];
       }
   });
   
   
   // Construir el nuevo array
   let newArray = filteredSteps.map(step => {

    
    const siguientePasoUnoElement = filteredSteps.find(element => element.id === relacionesGenerales[step.id][0]);
    const siguientePasoDosElement = filteredSteps.find(element => element.id === relacionesGenerales[step.id][1]);
    const siguientePasoTresElement = filteredSteps.find(element => element.id === relacionesGenerales[step.id][2]);
    let siguientePasoSiPaso = null;
    if (step.type === "standard.Polygon" && step.nro_paso_si) {
        const siguientePasoSiElement = jsona.find(element => element.id === step.nro_paso_si);
        if (siguientePasoSiElement) {
            siguientePasoSiPaso = parseInt(siguientePasoSiElement.paso.replace("Paso", ""));
        }
    }

    let siguientePasoNoPaso = null;
    if (step.type === "standard.Polygon" && step.nro_paso_no) {
        const siguientePasoNoElement = jsona.find(element => element.id === step.nro_paso_no);
        if (siguientePasoNoElement) {
            siguientePasoNoPaso = parseInt(siguientePasoNoElement.paso.replace("Paso", ""));
        }
    }

    return {
        "id_flujo_pasos": step.attrs.id_flujo_pasos ? step.attrs.id_flujo_pasos.text : 0,
        "fk_flujo": flujo,
        "nro_paso": parseInt(step.paso.replace("Paso", "")),
        "tiene_pregunta": step.type === "standard.Polygon" ? "S" : "N",
        "pregunta_texto": step.attrs.pregunta ? step.attrs.pregunta.text : "",
        "nro_paso_si": siguientePasoSiPaso,//step.nro_paso_si ? parseInt(step.nro_paso_si.replace("Paso", "")) : null,
        "nro_paso_no": siguientePasoNoPaso,//step.nro_paso_no ? parseInt(step.nro_paso_no.replace("Paso", "")) : null,
        "siguiente_paso":  finCircleLinkIds.includes(step.id) ? 0 : step.type !== "standard.Polygon" && siguientePasoUnoElement ? parseInt(siguientePasoUnoElement.paso.replace("Paso", "")) : null,
        "siguiente_paso_dos": step.type !== "standard.Polygon" && siguientePasoDosElement ? parseInt(siguientePasoDosElement.paso.replace("Paso", "")) : null,
        "siguiente_paso_tres": step.type !== "standard.Polygon" && siguientePasoTresElement ? parseInt(siguientePasoTresElement.paso.replace("Paso", "")) : null,
        "fk_usuario_atiende": step.attrs.usuario ? step.attrs.usuario.value : "",
        "estado_flujo": null,
        "termina_flujo": finCircleLinkIds.includes(step.id) ? "S" : "N",
        "id_usuario": this.tarea.id_usuario,
        "prioridad": null,
        "descripcion": step.attrs.label.text,
        "dias": step.attrs.dias.text,
        "grupo_usuarios": null,
        "hito": "S"
    };
});

   
   console.log(newArray);
   
   
   
   

    this.listaPasos.map((data)=>{
      data['id_usuario'] = this.dataUser.id_usuario;
      data['fk_flujo'] = flujo
    })

    newArray.map((data)=>{
      data['id_usuario'] = this.dataUser.id_usuario;
      data['fk_flujo'] = flujo
    })
    let data = {
      params: newArray
    }
    console.log(data);
    this.serviceAdmin.crearFlujoPasos(data).subscribe(
      (res)=>{
        this.lcargando.ctlSpinner(false);
        if (this.tarea.nombre == "" || this.tarea.nombre == undefined) {
          this.toastr.info("Debe ingresar una tarea para poder realizar el trámite")
          return;
        } //El trámite fue creado con éxito
        Swal.fire({
          icon: "success", 
          title: "Éxito!",
          text: "Registro exitoso",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        })
        this.usuarios = [];
        this.preguntaDisabled = true;
        this.listaPasos = []
        this.tarea = {
          nombre: null,
          descripcion: null,
          tipo: null,
          id_usuario: null,
          prioridad:  null
        }
        this.lcargando.ctlSpinner(false);
        console.log(res);
      },
      (error)=>{
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Existe un error en el flujo revise nuevamente",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        })
        this.lcargando.ctlSpinner(false);
        console.log(error);
      }

    )

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Existe un error en el flujo revise nuevamente",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    })
    this.lcargando.ctlSpinner(false);
    console.error("Ha ocurrido un error:", error);
    // Aquí puedes presentar un mensaje de error al usuario
}
  }
  userSelected(event){
    
    if(event.id_usuario){
      this.disabled= false;
    }  else {
      this.disabled= true;
    }  
  
  }

  modalAgregarUsuarios(){
      this.disabledPasos=false;
      let flag = true;
      for(let i = 0 ; i<this.usuarios.length; i++){
        if(this.usuarios[i].id_usuario === this.selectUser.id_usuario){
         // console.log(this.usuarios[i]);
          flag = false;
          break;
        }
      }
      if(flag){
        this.usuarios.push(this.selectUser);
        console.log(flag)
      }else{
        console.log(flag)
        this.toastr.info( "No puede seleccionar el mismo usuario dos veces"); 
      }

  }

























/******
 * 
 * 
 * 
 * 
 */

cargar() {
  let select = null;
  let deleteButton = null;
  if (isPlatformBrowser(this.platformId)) {
    this.graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });

    this.paper = new joint.dia.Paper({
      el: this.diagramContainer.nativeElement,
      model: this.graph,
      width: 800,
      height: 1700,
      gridSize: 10,
      restrictTranslate: true, 
    });
   
    if (this.paper.options.width !== undefined && this.paper.options.height !== undefined) {
      const canvasWidth = this.paper.options.width;
      const canvasHeight = this.paper.options.height;
      this.centrarFigura(this.graphData, canvasWidth, canvasHeight);
      this.graph.fromJSON(this.graphData);
    }

    this.graph.fromJSON(this.graphData); 
    this.paper.on('cell:pointerclick', (cellView, evt, x, y) => {
      
      const cell = cellView.model;
      if (cell.isElement()) {
        // Realiza la acción deseada cuando se hace clic en la figura
      }
    });
    
    const graphData = this.graph.toJSON();
    this.graph.getElements().forEach((element) => {
      this.agregarBotonesAFigura(element);
    });
    this.graph.on('add', (cell) => {
      if (cell.isElement()) {
        this.agregarBotonesAFigura(cell);
      }
    });
    const simplifiedGraphData = simplifyGraphData(graphData);
   
    console.log('datos del gráfico :', simplifiedGraphData);
   
    this.paper.el.addEventListener('click', (e) => {
      // Verificar si el clic fue dentro del menú desplegable
      if (e.target === select) {
        return;
      }
  
      // Verificar si el clic fue dentro del enlace
      const linkClicked = (e.target as HTMLElement).closest('.joint-link');
      if (linkClicked) {
        return;
      }
  
      // Si el clic no fue dentro del menú desplegable o el enlace, ocultar el select
      if (select !== null) {
        select.remove();
        deleteButton.remove()
        deleteButton = null;
        select = null;
      }
    });
  


    
this.paper.on('link:pointerclick', (cellView, evt, x, y) => {



    const link = cellView.model;


      // Si ya hay un select creado, elimínalo y restablece la variable select a null
      if (select !== null) {
        select.remove();
        deleteButton.remove()
        deleteButton = null;
        select = null;
        return;
    }
    if (deleteButton !== null) {
      return;
  }
     deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.style.position = 'absolute';
    deleteButton.style.left = `${ evt.clientX + window.scrollX+ 110}px`; // Ajustar la posición del botón
    deleteButton.style.top = `${evt.clientY + window.scrollY}px`;
    deleteButton.style.backgroundColor = 'red';
deleteButton.style.color = 'white';
deleteButton.style.border = 'none';
deleteButton.style.zIndex = '2000';
deleteButton.style.padding = '5px 10px';
    deleteButton.addEventListener('click', () => {
      link.remove(); // Eliminar el enlace
      select.remove(); // Ocultar el select
      select = null;
      deleteButton.remove()
      deleteButton = null;
    });

  
  

    // Crea un menú desplegable (select) para cambiar el valor del vínculo.
    select = document.createElement('select');
    select.innerHTML = `
        <option value="--seleccionar--" disabled>seleccionar</option>
        <option value="sí">Sí</option>
        <option value="no">No</option>
    `;

    // Establece el valor actual del select según el atributo del vínculo.
    const currentAttribute = link.attr('text/text'); // Ajusta esto según el atributo que desees cambiar
    select.value = currentAttribute || 'seleccionar'; // Por defecto, selecciona 'no' si no hay valor inicial

    // Maneja el cambio en el menú desplegable.
    const handleChange = (e) => {
        const selectedValue = e.target.value;

        // Actualiza el atributo del vínculo según la selección.
        link.attr('text/text', selectedValue);

        // Elimina el menú desplegable después de la selección.
        select.remove();
        deleteButton.remove()
       
        deleteButton = null;
        // Restablece la variable select a null después de eliminarla
        select = null;
    };

    select.addEventListener('change', handleChange);

    // Establece el estilo del select para que sea fácil de ver.
    select.style.position = 'absolute';
    select.style.zIndex = '10';
    select.style.top = `${evt.clientY + window.scrollY}px`; // Utiliza las coordenadas del evento de clic
    select.style.left = `${evt.clientX + window.scrollX}px`; 

    // Añade el menú desplegable a la página.
    document.body.appendChild(deleteButton);
    document.body.appendChild(select);
});



  }
}

ngAfterViewInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.dibujarLineas();
    this.dibujarLineasYNombres();
  }
}
agregarBotonesAFigura(figure: joint.dia.Element) {
  // Crear un contenedor para los botones
  let contadorFiguras = 0;



    const graphData = this.graph.toJSON();
 
    const simplifiedGraphData = simplifyGraphData(graphData);
    let jsona = simplifiedGraphData.cells;
    const filteredSteps = jsona.filter(obj => obj.type === "standard.Rectangle" || obj.type === "standard.Polygon")
    .filter(obj => obj.paso && obj.paso.startsWith("Paso")) // Filtrar solo los pasos que empiezan con "Paso"
    .sort((a, b) => {
        const pasoA = a.paso;
        const pasoB = b.paso;
        return pasoA - pasoB;
    });
    // Encontrar el número máximo de los pasos
const maxPasoNumber = filteredSteps.reduce((max, step) => {
  const pasoNumber = parseInt(step.paso.replace("Paso", ""));
  return pasoNumber > max ? pasoNumber : max;
}, 0);

contadorFiguras = maxPasoNumber;
this.paso= maxPasoNumber;



  const containerDiv = document.createElement('div');
  containerDiv.style.position = 'absolute';
  containerDiv.style.zIndex = '10';
  containerDiv.style.display = 'flex';
  containerDiv.style.display = 'none';
  containerDiv.style.flexDirection = 'column';
  containerDiv.style.alignItems = 'center';
  containerDiv.style.gap = '5px';
  containerDiv.style.padding = '2px';
  containerDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'; 
  containerDiv.style.borderRadius = '3px';
  containerDiv.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
  containerDiv.style.fontSize = '10px';
  containerDiv.style.cursor = 'pointer';
  
  const btnContaint = document.createElement('div');
  btnContaint.style.zIndex = '10';
  btnContaint.style.display = 'flex';
  btnContaint.style.flexDirection = 'row';
  btnContaint.style.alignItems = 'center';
  btnContaint.style.gap = '5px';
  btnContaint.style.padding = '2px';
  btnContaint.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'; 
  btnContaint.style.borderRadius = '3px';
  btnContaint.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
  btnContaint.style.fontSize = '10px'; 
  btnContaint.style.cursor = 'pointer';

  // Función para actualizar la posición de los botones
  const updateButtonPosition = () => {
    const bbox = figure.getBBox();
    containerDiv.style.left = `${bbox.x + bbox.width + 5}px`; // Acercar los botones a la figura
    containerDiv.style.top = `${bbox.y + bbox.height / 2}px`;
    containerDiv.style.transform = 'translateY(-50%)';
  };

  updateButtonPosition(); // Llamar a la función para actualizar la posición inicial

  this.paper.on('cell:pointerclick', (cellView) => {
    const cell = cellView.model;
    
    if (cellView.model === figure) {
      if (containerDiv.style.display == 'flex') {
        containerDiv.style.display = 'none';
        textarea.style.display = 'none';
      } else {
        updateButtonPosition();
        textarea.style.display = 'flex';
        containerDiv.style.display = 'flex';
        textarea.focus();
        textarea.oninput = () => {
          const newText = textarea.value;

          // Actualizar el texto de la etiqueta de la figura
          cell.attr({
            label: {
              text: newText,
            },
          });
        };
      }
    }else{
      containerDiv.style.display = 'none';
      textarea.style.display = 'none';
    }
  });
  // Crear un `select` para elegir entre las opciones "sí" y "no"
  
let enlaceContador=0 
  // Función para crear un enlace entre la figura de origen y la nueva figura
  const crearEnlace = (nuevaFigura: joint.dia.Element) => {
    const link = new joint.shapes.standard.Link({
      source: { id: figure.id },
      target: { id: nuevaFigura.id },
    });
    
 
// Si la figura de origen es de tipo "Polygon", alternar el valor del atributo "respuesta"
if (figure.get('type') === 'standard.Polygon') {
  // Alternar entre "sí" y "no" basándose en el contador de enlaces
  const respuestaValor = (enlaceContador % 2 === 0) ? 'sí' : 'no';
  // Agregar el atributo "respuesta" al enlace
  link.attr({
      respuesta: {
          text: respuestaValor
      }
  });

  // Agregar una etiqueta al enlace para mostrar el valor de "respuesta"
  link.appendLabel({
      attrs: {
          text: {
              text: respuestaValor, // El valor de "respuesta"
              fill: 'black',
              fontSize: 10,
              fontFamily: 'Arial, sans-serif',
          }
      },
      position: {
          distance: 0.5, // Posiciona la etiqueta en el centro de la línea
      }
  });

  // Incrementar el contador de enlaces
  enlaceContador++;
}
    this.graph.addCell(link);
  };
  // Crear los campos del formulario
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Título';
  titleInput.style.width = '100%';
  titleInput.value= figure.attr('label/text')
  titleInput.addEventListener('input', (e) => {
  


    const newText = (e.target as HTMLTextAreaElement).value;
    figure.attr('label/text', newText);
  });
  titleInput.addEventListener('click', () => {
    titleInput.focus();
  
  });
  
  const questionInput = document.createElement('input');
  questionInput.type = 'text';
  questionInput.placeholder = 'Pregunta';
  questionInput.style.width = '100%';
  questionInput.value=figure.attr('pregunta/text')
  questionInput.addEventListener('click', () => {
    questionInput.focus();
    // Eliminar el contenedor de botones asociado a la figura
  });
 
 // figure.attr('label/pregunta', questionInput.value);
  questionInput.addEventListener('input', (e) => {
    // Actualizar el atributo de la figura
    //figure.attr('label/text', titleInput.value);

    const newText = (e.target as HTMLTextAreaElement).value;
    figure.attr('pregunta/text', newText);
  });


  const ageInput = document.createElement('input');
  ageInput.type = 'text';
  ageInput.placeholder = 'Dias';
  ageInput.style.width = '100%';
  //figure.attr('dias/text', ageInput.value);

  ageInput.value = figure.attr('dias/text')// figure.attributes['dias'].toString();
  ageInput.addEventListener('click', () => {
    ageInput.focus();
    // Eliminar el contenedor de botones asociado a la figura
  });
  ageInput.addEventListener('change', (e) => {
    // Actualizar el atributo de la figura
    //figure.attr('label/text', titleInput.value);

    const newText = (e.target as HTMLTextAreaElement).value;
    figure.attr('dias/text', newText);
  });
  // usuariospre
  // const userInput = document.createElement('input');
  // userInput.type = 'text';
  // userInput.placeholder = 'Usuario';
  // userInput.style.width = '100%';
  // userInput.value=  figure.attr('usuario/text');
  
  // userInput.addEventListener('click', () => {
  //   userInput.focus();
    
  // });
  // userInput.addEventListener('input', (e) => {
  //   const newText = (e.target as HTMLTextAreaElement).value;
  //   figure.attr('usuario/text', newText);
  // });


// Crear el input de texto
const userInput = document.createElement('input');
userInput.type = 'text';
userInput.placeholder = 'Buscar usuario';
userInput.style.width = '100%';
userInput.value= figure.attr('usuario/text');
// Crear la lista desordenada
const divList= document.createElement('div');
divList.style.height = '190px';
divList.style.width = '100%';

divList.style.listStyleType = 'none';
divList.style.padding = '0';
divList.style.margin = '0';
divList.style.display = 'none';

  divList.style.overflow= 'auto';
  divList.style.zIndex= '9999999';
  divList.style.opacity= '1';
  divList.style.background= 'white';
  divList.style.position= 'fixed';
  divList.style.left= '2px';
  divList.style.padding= '10px';


const userList = document.createElement('ul');
userList.style.width = '100%';

userList.style.listStyleType = 'none';
userList.style.padding = '0';
userList.style.margin = '0';
userList.style.display = 'none'; // Ocultar la lista inicialmente
 userInput.addEventListener('click', () => {
    userInput.focus();
    


// Limpiar la lista existente
userList.innerHTML = '';

// Filtrar los usuarios que coincidan con el texto ingresado
const filteredUsers = this.usuarios; //this.usuariospre

// Mostrar la lista si hay coincidencias
if (filteredUsers.length > 0) {
  userList.style.display = 'block';
  divList.style.display = 'block';
} else {
  userList.style.display = 'none';
  divList.style.display = 'none'; // Ocultar la lista si no hay coincidencias
}

// Agregar cada usuario filtrado como un elemento de la lista
filteredUsers.forEach(usuario => {
  const listItem = document.createElement('li');
  listItem.textContent = usuario.nombre;
  listItem.style.cursor = 'pointer';

  // Agregar un evento click a cada elemento de la lista para seleccionar el usuario
  listItem.addEventListener('click', () => {
    figure.attr('usuario/text', usuario.nombre);
// console.log(usuario);
   figure.attr('usuario/value', usuario.id_usuario);
    userInput.value = usuario.nombre; // Actualizar el valor del input con el usuario seleccionado
    userList.style.display = 'none';
    divList.style.display = 'none'; // Ocultar la lista después de seleccionar un usuario
  });

  userList.appendChild(listItem);
});


   });
// Agregar un evento input al input de texto para filtrar la lista
userInput.addEventListener('input', (e) => {
  const searchText = (e.target as HTMLInputElement).value.toLowerCase();

  // Limpiar la lista existente
  userList.innerHTML = '';

  // Filtrar los usuarios que coincidan con el texto ingresadothis.usuariospre
  const filteredUsers = this.usuarios.filter(usuario => usuario.nombre.toLowerCase().includes(searchText));
  
  // Mostrar la lista si hay coincidencias
  if (filteredUsers.length > 0) {
    userList.style.display = 'block';
    divList.style.display = 'block';
  } else {
    userList.style.display = 'none';
    divList.style.display = 'none'; // Ocultar la lista si no hay coincidencias
  }

  // Agregar cada usuario filtrado como un elemento de la lista
  filteredUsers.forEach(usuario => {
    const listItem = document.createElement('li');
    listItem.textContent = usuario.nombre;
    listItem.style.cursor = 'pointer';

    // Agregar un evento click a cada elemento de la lista para seleccionar el usuario
    listItem.addEventListener('click', () => {
      figure.attr('usuario/text', usuario.nombre);
// console.log(usuario);
     figure.attr('usuario/value', usuario.id_usuario);
      userInput.value = usuario.nombre; // Actualizar el valor del input con el usuario seleccionado
      userList.style.display = 'none';
      divList.style.display = 'none'; // Ocultar la lista después de seleccionar un usuario
    });

    userList.appendChild(listItem);
  });
});
divList.appendChild(userList);
 

  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '5px';
  form.style.width = '120px';
  form.style.marginTop ='24px';

 
  // Agregar los campos al formulario
  
const TitleLabel = document.createElement('label');
TitleLabel.textContent = "Descripcion"
TitleLabel.style.margin = "0px"
    form.appendChild(TitleLabel);
  form.appendChild(titleInput);
  if (figure.get('type') === 'standard.Polygon') {
    const questionLabel = document.createElement('label');
    questionLabel.textContent = "Pregunta"
    questionLabel.style.margin = "0px"
    form.appendChild(questionLabel);
  form.appendChild(questionInput);
}

const ageInputLabel = document.createElement('label');
ageInputLabel.textContent = "Dias"
ageInputLabel.style.margin = "0px"
const userInputLabel = document.createElement('label');
userInputLabel.textContent = "Usuario"
userInputLabel.style.margin = "0px"
    

form.appendChild(ageInputLabel);
  form.appendChild(ageInput);
  form.appendChild(userInputLabel);
  form.appendChild(userInput);//containerDiv
  form.appendChild(divList);
  const buttonLink = document.createElement('button');
  buttonLink.innerHTML = '<span class="material-icons" style="font-size:20px">link</span>';
  buttonLink.style.margin = '0';
  buttonLink.style.padding = '5px';
  buttonLink.style.border = 'none';
  buttonLink.style.backgroundColor = '#f0f0f0';
  buttonLink.style.borderRadius = '3px';

  // Crear el cuadro de diálogo modal
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.zIndex = '9000';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modal.style.display = 'none';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';

  // Crear el contenedor del cuadro de diálogo
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fff';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '5px';
  modalContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

  // Crear el menú desplegable para los IDs
  const selectElement = document.createElement('select');
  selectElement.id = 'figureIdSelect';
  selectElement.style.width = '100%';
  selectElement.style.padding = '10px';
  selectElement.style.marginBottom = '10px';

  // Rellenar el menú desplegable con los IDs de las figuras existentes
  

  // Crear el botón de confirmación
  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Confirmar';
  confirmButton.style.padding = '10px 20px';
  confirmButton.style.marginRight = '10px';
  confirmButton.style.backgroundColor = '#4caf50';
  confirmButton.style.color = '#fff';
  confirmButton.style.border = 'none';
  confirmButton.style.cursor = 'pointer';

  // Crear el botón de cancelar
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.style.padding = '10px 20px';
  cancelButton.style.backgroundColor = '#f44336';
  cancelButton.style.color = '#fff';
  cancelButton.style.border = 'none';
  cancelButton.style.cursor = 'pointer';

  // Añadir los botones al cuadro de diálogo
  modalContent.appendChild(confirmButton);
  modalContent.appendChild(cancelButton);

  // Añadir el contenedor del cuadro de diálogo al cuadro de diálogo modal
  modal.appendChild(modalContent);

  // Añadir el cuadro de diálogo modal al cuerpo del documento
  document.body.appendChild(modal);

  // Manejar el evento de clic del botón de crear enlace
  buttonLink.addEventListener('click', () => {
    // Mostrar el cuadro de diálogo modal
    selectElement.innerHTML = '';

    // Actualiza la lista de elementos disponibles
    const elements = this.graph.getElements();
   // const elements = this.graph.getElements();
    const filteredElements = elements.filter(element => element.id !== 'circle2'  && element.id !== figure.id);
    filteredElements.forEach((element) => {
      const option = document.createElement('option');
      option.value = element.id.toString();
      option.textContent = element.attributes['paso'].toString();
      selectElement.appendChild(option);
    });

    // Añadir el menú desplegable al cuadro de diálogo elements
    modalContent.appendChild(selectElement);


 containerDiv.style.display = 'none';
   
    modal.style.display = 'flex';
   
  });

  // Manejar el evento de clic del botón de confirmación
  confirmButton.addEventListener('click', () => {
    const targetId = selectElement.value;
    const numEnlaces = this.contarEnlaces(figure.id.toString());
    if (numEnlaces >= 2) {
      alert('Esta figura ya tiene 2 enlaces. No se puede crear más enlaces.');
      return; // Detener la función
  }
    // Crear un enlace si el targetId es válido
    const link = new joint.shapes.standard.Link({
      source: { id: figure.id },
      target: { id: targetId },
    });
// Si la figura de origen es de tipo "Polygon"
if (figure.get('type') === 'standard.Polygon') {
// Alternar entre "sí" y "no" basándose en un contador
const respuestaValor = 'sí';
link.appendLabel({
  attrs: {
      text: {
          text: respuestaValor, // El valor de "respuesta"
          fill: 'black',
          fontSize: 10,
          fontFamily: 'Arial, sans-serif',
      }
  },
  position: {
      distance: 0.5, // Posiciona la etiqueta en el centro de la línea
  }
});
// Agregar el atributo "respuesta" al enlace


// Incrementar el contador para la próxima vez
}
    this.graph.addCell(link);

    // Cerrar el cuadro de diálogo modal
    modal.style.display = 'none';
  });

  // Manejar el evento de clic del botón de cancelar
  cancelButton.addEventListener('click', () => {
    // Cerrar el cuadro de diálogo modal
    modal.style.display = 'none';
  });

  // Añadir el botón de crear enlace al contenedor de botones
  if (figure.attributes['paso'] !== 'Fin') {
  
  btnContaint.appendChild(buttonLink);
}
  // Agregar el formulario al contenedor
 
  if (figure.id !== 'circle2' && figure.attributes['paso'] !== 'Fin') {
    containerDiv.appendChild(form);
}



  // Crear un botón para agregar un círculo
  const buttonCircle = document.createElement('button');
  buttonCircle.innerHTML =
    '<span class="material-icons" style="font-size:20px">radio_button_unchecked</span>';
  buttonCircle.style.margin = '0';
  buttonCircle.style.padding = '5px';
  buttonCircle.style.border = 'none';
  buttonCircle.style.backgroundColor = '#f0f0f0';
  buttonCircle.style.borderRadius = '3px';

  buttonCircle.style.fontSize = '5px';
  buttonCircle.addEventListener('click', () => {
    
    const typeFigure = figure.get('type')
    const polygonId =figure.id.toString();
    const numEnlaces = this.contarEnlaces(polygonId);
    let maxhijos = 0;
   if(typeFigure=='standard.Rectangle') {maxhijos=3}
   if(typeFigure=='standard.Circle') {maxhijos=3}
   if(typeFigure=='standard.Polygon') {maxhijos=2}
    
   if (numEnlaces >= maxhijos) {
    // Mostrar un mensaje de error
    alert('No se puede crear más de dos figuras hijas desde este Polygon.');
    return; // Detener la función para no crear la nueva figura hija
}

      
 
    const bbox = figure.getBBox();
    const nuevaFigura = new joint.shapes.standard.Circle({
      position: { x: bbox.x + bbox.width + 60, y: bbox.y },
      size: { width: 40, height: 40 },
      attrs: {
        body: { fill: 'red' },
        label: {
          text: 'Fin',
          fill: 'black',
          refY: -15, // Ajusta la posición vertical del label
          yAlignment: 'middle',
        },
        pregunta: {
          text: 'Inicio',
        },
        dias: {
          text: 'Inicio',
        },
        usuario: {
          text: 'Inicio',
        },
        
      }, paso: 'Fin'
    });
    this.graph.addCell(nuevaFigura);
    // Crear un enlace entre la figura de origen y la nueva figura
    crearEnlace(nuevaFigura);
    // Asociar botones a la nueva figura
    this.agregarBotonesAFigura(nuevaFigura);

  });

  // Crear un botón para agregar un rectángulo
  const buttonRectangle = document.createElement('button');
  buttonRectangle.innerHTML =
    '<span class="material-icons" style="font-size:20px">crop_square</span>';
  buttonRectangle.style.margin = '0';
  buttonRectangle.style.padding = '5px';
  buttonRectangle.style.border = 'none';
  buttonRectangle.style.backgroundColor = '#f0f0f0';
  buttonRectangle.style.borderRadius = '3px';

  buttonRectangle.addEventListener('click', () => {
    const typeFigure = figure.get('type')
    const polygonId =figure.id.toString();
    const numEnlaces = this.contarEnlaces(polygonId);
    let maxhijos = 0;
   if(typeFigure=='standard.Rectangle') {maxhijos=3}
   if(typeFigure=='standard.Circle') {maxhijos=3}
   if(typeFigure=='standard.Polygon') {maxhijos=2}
    
   if (numEnlaces >= maxhijos) {
    // Mostrar un mensaje de error
    alert('No se puede crear más de dos figuras hijas desde este Polygon.');
    return; // Detener la función para no crear la nueva figura hija
}
    contadorFiguras++;
    this.paso++;// Incrementa el contador de figuras
    const idFigura = `Paso${this.paso}`;  // G
    const bbox = figure.getBBox();
    const nuevaFigura = new joint.shapes.standard.Rectangle({
     
      position: { x: bbox.x + bbox.width + 60, y: bbox.y },
      size: { width: 100, height: 40 },
      attrs: {
        body: { fill: 'skyblue' },
        label: {
          num: idFigura,
          text: 'Nuevo Paso',
          fill: 'black',
          refY: -15, // Ajusta la posición vertical del label
          yAlignment: 'middle',
        },
        pregunta: {
          text: '',
        },
        dias: {
          text: '',
        },
        usuario: {
          text: '',
          value: ''
        },
      },
       paso: idFigura,
    });
    this.graph.addCell(nuevaFigura);
    // Crear un enlace entre la figura de origen y la nueva figura
    crearEnlace(nuevaFigura);
    // Asociar botones a la nueva figura
    this.agregarBotonesAFigura(nuevaFigura);
  });

  // Crear un botón para agregar un rombo
  const buttonDiamond = document.createElement('button');
  buttonDiamond.innerHTML =
    '<span class="material-icons" style="font-size:20px">change_history</span>';
  buttonDiamond.style.margin = '0';
  buttonDiamond.style.padding = '5px';
  buttonDiamond.style.border = 'none';
  buttonDiamond.style.backgroundColor = '#f0f0f0';
  buttonDiamond.style.borderRadius = '3px';

  buttonDiamond.addEventListener('click', () => {
   const typeFigure = figure.get('type')
    const polygonId =figure.id.toString();
    const numEnlaces = this.contarEnlaces(polygonId);
    let maxhijos = 0;
   if(typeFigure=='standard.Rectangle') {maxhijos=3}
   if(typeFigure=='standard.Circle') {maxhijos=3}
   if(typeFigure=='standard.Polygon') {maxhijos=2}
    
   if (numEnlaces >= maxhijos) {
    // Mostrar un mensaje de error
    alert('No se puede crear más de dos figuras hijas desde este Polygon.');
    return; // Detener la función para no crear la nueva figura hija
}
   
   
  

    contadorFiguras++;
    this.paso++;// Incrementa el contador de figuras
    const idFigura = `Paso${this.paso}`;
    const bbox = figure.getBBox();
   
    const nuevaFigura = new joint.shapes.standard.Polygon({

      position: { x: bbox.x + bbox.width + 60, y: bbox.y },
      size: { width: 60, height: 60 },
      attrs: {
        body: {
          fill: 'orange',
          stroke: 'black',
          strokeWidth: 1,
          refPoints: '0,10 10,0 20,10 10,20'
        },
        label: {
          num: idFigura,
          text: 'Pregunta',
          fill: 'black',
          refY: -15, // Ajusta la posición vertical del label
          yAlignment: 'middle',
        },
        pregunta: {
          text: '',
        },
        dias: {
          text: '',
        },
        usuario: {
          text: '',
          value:''
        },
        
      },
      paso: idFigura,
      points: '30,0 60,30 30,60 0,30',
    });
    this.graph.addCell(nuevaFigura);
    // Crear un enlace entre la figura de origen y la nueva figura
    crearEnlace(nuevaFigura);
    // Asociar botones a la nueva figura
    this.agregarBotonesAFigura(nuevaFigura);
  });

  const buttonEliminar = document.createElement('button');
  buttonEliminar.innerHTML =
    '<span class="material-icons" style="font-size:20px">delete</span>';
  buttonEliminar.style.margin = '0';
  buttonEliminar.style.padding = '5px';
  buttonEliminar.style.border = 'none';
  buttonEliminar.style.backgroundColor = '#f0f0f0';
  buttonEliminar.style.borderRadius = '3px';
  buttonEliminar.addEventListener('click', () => {
    figure.remove();
    containerDiv.remove();
    // Eliminar el contenedor de botones asociado a la figura
  });

  // Añadir botones al contenedor
  if (figure.attributes['paso'] !== 'Fin') {
  
    btnContaint.appendChild(buttonCircle);
    btnContaint.appendChild(buttonRectangle);
    btnContaint.appendChild(buttonDiamond);
} 
 
  if (figure.id !== 'circle2' ) {
    btnContaint.appendChild(buttonEliminar);
}
  
 
  //containerDiv buttonRectangle
  containerDiv.appendChild(btnContaint);
 // containerDiv.appendChild(buttonDiamond);
  //containerDiv.appendChild(buttonEliminar);

  // Crear un campo de entrada (input) para la figura
  const textarea = document.createElement('textarea');

  textarea.placeholder = 'Ingresa texto';
  textarea.style.position = 'absolute';
  textarea.style.display = 'none';
  textarea.style.zIndex = '10';
  textarea.style.resize = 'none'; // Puedes cambiar esto según lo necesites
  textarea.style.width = '70px';
  textarea.style.height = '100px';

  // Posicionar el área de texto a la izquierda de la figura
  const figureBBox = figure.getBBox();
  textarea.style.left = `${figureBBox.x - 50 - 35}px`; // Colocar 5 píxeles a la izquierda de la figura
  textarea.style.top = `${figureBBox.y + figureBBox.height / 2 - 25}px`; // Centrar verticalmente respecto a la figura

  // Capturar el evento de entrada (input) del área de texto para actualizar la figura
  textarea.addEventListener('input', (e) => {
    const newText = (e.target as HTMLTextAreaElement).value;
    figure.attr('label/text', newText); // Actualizar el texto de la figura
  });





  // Añadir el input al contenedor de botones
//  this.diagramContainer.nativeElement.appendChild(textarea);
  // Capturar el evento de input para actualizar la figura

  // Añadir el campo de entrada al contenedor del diagrama

  // Crear un elemento para mostrar `label.num` y `label.text`
  const labelInfo = document.createElement('div');
  labelInfo.style.display = 'flex';
  labelInfo.style.flexDirection = 'column';
  labelInfo.style.alignItems = 'center';
  labelInfo.style.fontSize = '12px';

  // Obtener `label.num` y `label.text` de la figura
  const labelNum = figure.attr('label/num');
  const labelText = figure.attr('label/text');

  // Mostrar `label.num` y `label.text`
  const numTextElement = document.createElement('span');
  numTextElement.textContent = `Paso: ${labelNum}`;

  const labelTextElement = document.createElement('span');
  labelTextElement.textContent = `Texto: ${labelText}`;

  // Añadir elementos al contenedor de información
  if (figure.id !== 'circle2' && figure.attributes['paso'] !== 'Fin') {
    labelInfo.appendChild(numTextElement);
}
 

  // Añadir `labelInfo` al contenedor principal
  containerDiv.appendChild(labelInfo);


  // Añadir el contenedor al diagrama
  this.diagramContainer.nativeElement.appendChild(containerDiv);

  // Actualizar la posición de los botones cuando la figura se mueva
 
  figure.on('change:position', () => {
    updateButtonPosition();
    const figureBBox = figure.getBBox();
    textarea.style.left = `${figureBBox.x - 50 - 35}px`; 
    textarea.style.top = `${figureBBox.y + figureBBox.height / 2 - 25}px`;
  });
  // Maneja la eliminación de la figura
  figure.on('remove', () => {
    // Elimina el contenedor de botones cuando la figura se elimine
    containerDiv.remove();
    textarea.remove();
  });



}

dibujarLineas() {
  const canvas = this.canvas.nativeElement;
  const context = canvas.getContext('2d');

  if (context) {
    // Ajustar el tamaño del canvas para que coincida con el contenedor
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Limpiar el canvas antes de dibujar
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar líneas horizontales según el número de secciones
    const numLines = this.lineCount + 1;
    const sectionHeight = canvas.height / numLines;

    context.strokeStyle = 'black'; // Color de las líneas
    context.lineWidth = 2; // Grosor de las líneas

    // Dibujar líneas horizontales
    for (let i = 1; i <= numLines; i++) {
      const y = sectionHeight * i;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }
  }
}


agregarCanvas() {
// Aumentar la altura del contenedor
const container = this.mainContainer.nativeElement;
let currentHeight = parseInt(container.style.height, 10);
const newHeight = currentHeight + 200;
container.style.height = `${newHeight}px`;


this.paper.setDimensions(800, newHeight);


this.lineCount++;


this.canvasNames.push(``); //Canvas ${this.lineCount + 1}


}

// Función para dibujar las líneas horizontales y los nombres centrados arriba de cada partición
dibujarLineasYNombres() {
// Obtener el elemento canvas
const canvasElement = this.canvas.nativeElement;

// Obtener el contexto 2D del canvas
const context = canvasElement.getContext('2d');

// Obtener el contenedor principal donde se añadirán los inputs
const container = this.mainContainer.nativeElement;

if (context) {
    // Ajustar el tamaño del canvas para que coincida con el contenedor
    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    // Limpiar el canvas antes de dibujar
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Número de particiones
    const numLines = this.lineCount + 1;
    const sectionHeight = canvasElement.height / numLines;

    context.strokeStyle = 'black';
    context.lineWidth = 2;

    // Dibujar líneas horizontales y nombres
    for (let i = 0; i <= numLines; i++) {
        const y = sectionHeight * i;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvasElement.width, y);
        context.stroke();

        // Añadir un input para el nombre de cada canvas
        
    }
}
}

guardarDatos() {
  this.mensajeSppiner = "guardando Tarea...";
    this.lcargando.ctlSpinner(true);
const tieneFin = this.validarPasoFin();
  const validacionPolygons = this.validarPolygons();
  if (!tieneFin){ this.toastr.info('El diagrama debe contener al menos una figura con paso "Fin".');}
  if (!validacionPolygons){this.toastr.info('Alguna pregunta no tiene sus dos respuestas.');}
  if (tieneFin && validacionPolygons) {

    const graphData = this.graph.toJSON();
 
    const simplifiedGraphData = simplifyGraphData(graphData);

let data = { jsonFiguras: JSON.stringify(simplifiedGraphData),
  nombre:this.tarea.nombre,
  descripcion:this.tarea.descripcion,
  tipo:this.tarea.tipo,
  id_usuario:this.tarea.id_usuario,
  prioridad:this.tarea.prioridad,
  dias_totales:this.tarea.dias_totales,
 };


this.ticketSrv.createFlujo(data).subscribe(
  (res) => {

   this.agregarFlujoUsuario(res['data']['id_flujo']);












  
  
  
  
  },
  (error)=>{
    console.log(error);
    this.lcargando.ctlSpinner(false);
  }



)

 
} else {

 
  this.toastr.info('El diagrama debe contener al menos una figura con paso "Fin".');
}


}


ActualizarDatos() {
  this.mensajeSppiner = "Actualizando Tarea...";
    this.lcargando.ctlSpinner(true);
  const tieneFin = this.validarPasoFin();
    const validacionPolygons = this.validarPolygons();
    if (!tieneFin){ this.toastr.info('El diagrama debe contener al menos una figura con paso "Fin".');}
    if (!validacionPolygons){this.toastr.info('Alguna pregunta no tiene sus dos respuestas.');}
    if (tieneFin && validacionPolygons) {
  
   const graphData = this.graph.toJSON();
   
  const simplifiedGraphData = simplifyGraphData(graphData);
  
  let data = { jsonFiguras: JSON.stringify(simplifiedGraphData),
    nombre:this.tarea.nombre,
    descripcion:this.tarea.descripcion,
    tipo:this.tarea.tipo,
    id_flujo:this.tarea.id_flujo,
    id_usuario:this.tarea.id_usuario,
    prioridad:this.tarea.prioridad,
    dias_totales:this.tarea.dias_totales,
    user_token_id: this.tarea.user_token_id
   };
  
  
  this.ticketSrv.actualizarFlujo(data).subscribe(
    (res) => {
      this.actualizarFlujoUsuario(res['data']['id_flujo']);

  

    } ,(error)=>{
      
      this.lcargando.ctlSpinner(false);
      console.log(error);
    }
  
  )
  
   
  } else {
  
   
    this.toastr.info('El diagrama debe contener al menos una figura con paso "Fin".');
  }
  
  
  }

validarPasoFin(): boolean {
  let tieneFin = false;
 
  this.graph.getCells().forEach((cell: any) => {
      if (cell.isElement()) {
        
          const etiqueta = cell.get('attrs')?.label?.text;
          if (etiqueta === 'Fin') {
              tieneFin = true;
              return false; 
          }
      }
  });
  
  return tieneFin;
}
centrarFigura(graphData: any, width: any, height: any) {
  if (width !== undefined && height !== undefined) {
    // Obtener el tamaño de la figura principal
    const circleWidth = graphData.cells[0].size.width;
    const circleHeight = graphData.cells[0].size.height;

    // Calcular las coordenadas para centrar la figura
    const centerX = (width - circleWidth) / 2;
    const centerY = (height - circleHeight) / 17;

    // Actualizar la posición de la figura en el objeto graphData
    graphData.cells[0].position.x = centerX;
    graphData.cells[0].position.y = centerY;
  }
}

// Función para contar los enlaces de una figura específica
contarEnlaces(sourceId: string): number {
let contador = 0;

// Iterar sobre todas las figuras en el diagrama
this.graph.getLinks().forEach((link: any) => {
    // Verificar si el enlace tiene el ID de la figura como fuente
    if (link.get('source')?.id === sourceId) {
        contador++;
    }
});

return contador;
}

// Función para validar que cada `Polygon` tenga al menos dos enlaces
validarPolygons(): boolean {
let validacionExitosa = true;

// Iterar sobre todas las figuras en el diagrama
this.graph.getCells().forEach((cell: any) => {
    if (cell.isElement() && cell.get('type') === 'standard.Polygon') {
        const polygonId = cell.id;
        const numEnlaces = this.contarEnlaces(polygonId);
        
        // Verificar si el `Polygon` tiene al menos dos enlaces
        if (numEnlaces < 2) {
            validacionExitosa = false;
            // Puedes agregar un mensaje de error aquí si lo deseas
            alert(`La figura Polygon con ID ${polygonId} debe tener al menos dos enlaces.`);
        }
    }
});

return validacionExitosa;
}









}































// Función para simplificar los datos del gráfico sin caer en recursiones infinitas
function simplifyGraphData(graphData: any, visited: Set<any> = new Set()): any {
  // Si el objeto ya ha sido visitado, no procesarlo de nuevo para evitar recursiones infinitas
  if (visited.has(graphData)) {
    return;
  }
  visited.add(graphData);

  // Inicializa un objeto vacío para guardar los datos simplificados
  const simplifiedGraphData: any = {};

  // Itera sobre las propiedades del objeto de datos del gráfico
  for (const key in graphData) {
    if (graphData.hasOwnProperty(key)) {
      // Si la propiedad es un objeto, simplifícala recursivamente
      if (typeof graphData[key] === 'object' && graphData[key] !== null) {
        // Si el objeto es un array, simplificar cada uno de sus elementos
        if (Array.isArray(graphData[key])) {
          // Tipifica explícitamente 'item' como 'any'
          simplifiedGraphData[key] = graphData[key].map((item: any) =>
            simplifyGraphData(item, visited)
          );
        } else {
          simplifiedGraphData[key] = simplifyGraphData(graphData[key], visited);
        }
      } else {
        // Si la propiedad no es un objeto, copiarla directamente
        simplifiedGraphData[key] = graphData[key];
      }
    }
  }

  // Retorna los datos simplificados
  return simplifiedGraphData;
}



