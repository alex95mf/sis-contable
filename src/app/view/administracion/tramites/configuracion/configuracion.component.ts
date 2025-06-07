import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ModalUsuarioComponent } from './modal-usuario/modal-usuario.component';
import * as myVarGlobals from "../../../../global";
import { ToastrService } from 'ngx-toastr';
import { TramitesService } from '../tramites.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ModalTareasComponent } from './modal-tareas/modal-tareas.component';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';

@Component({
standalone: false,
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
  cities = [];
  selectedCityIds: string[];
  users = [];
  heightTr = 0;


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  usuarios: any = [];
  usuariosMultiselect: any = [];
  almacenUsuarios: any = [];
  pasosL: any = [];
  pasosD: any = [];
  pasosT: any = [];
  pasosS: any = [];

  dataUser: any;

  permissions: any;

  listaPasos: any = [];

  pregunta = ['SI', 'NO'];

  numeroPasos = [];

  usuariospre: any = [];

  selectUser: any = null;
  selectedUsers: any = [];

  flujo: any = null;
  preguntaDisabled = false;
  formReadOnly = false;
  validacionF = true;

  disabled: boolean =true;
  disabledPasos: boolean =true;

  //lista para actualizar
  usuarioActualizar: any = [];
  rolActualizar: any = [];
  fk_flujoActualizar: any;
  lengthPasos: any;
  lengthRoles: any;

  tarea: any = {
    nombre: null,
    descripcion: null,
    tipo: 0,
    id_usuario: null,
    prioridad:  0,
    dias_totales: null,
    puede_retornar: 0,
  }

  vmButtons: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  pasoActual: any;
  pasoSeleccionado: any;
  selectedPasos = [];

  roles: any[] = [];
  rolesTramite: any[] = [];
  selectRol: any;

  constructor(
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

    this.commonVrs.selectTramites.asObservable().subscribe(
      (res)=>{

        (this as any).mensajeSpinner = "Cargando Tarea...";
        this.lcargando.ctlSpinner(true);
        this.tarea = res.tarea;
       console.log(res.tarea);

       this.disabledPasos=false;
        this.fk_flujoActualizar = res.tarea.id_flujo
        this.serviceAdmin.getRolesFlujo(res.tarea).subscribe(
          (res1)=>{
            console.log(res1['data']);
            this.lengthRoles = res1['data'].length
            res1['data'].map((data)=>{
              // console.log(data);
              this.rolActualizar = [...this.rolActualizar, data];
              data['rol']['id_flujo_roles'] = data['id_flujo_roles']
              this.rolesTramite = [data['rol'], ...this.rolesTramite];


            })
           // console.log(this.usuarios);
            this.serviceAdmin.getUsuariosPasos(res.tarea).subscribe(
              (res2)=>{


                this.listaPasos = res2['data']
                this.lengthPasos = this.listaPasos.length
                console.log('lista de pasos   ',this.listaPasos);
                this.vmButtons[0]['habilitar'] = true;
                this.vmButtons[1]['habilitar'] = true;
                this.vmButtons[2]['habilitar'] = false;
                this.lcargando.ctlSpinner(false);


              }
            )
          }
        )

      }
    );

  }


  ngOnInit(): void {

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

    setTimeout(() => {
      this.cargarUsuarios(),
      this.cargarRoles()
    }, 50)
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
    this.usuarios = [];
    this.rolesTramite = [];
    this.tarea = {
      nombre: null,
      descripcion: null,
      tipo: 0,
      id_usuario: null,
      prioridad:  0,
      dias_totales: null,
      puede_retornar: 0
    };
    this.selectRol={};
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
      else if (
        this.tarea.puede_retornar == "" ||
        this.tarea.puede_retornar == undefined
      ){
        this.toastr.info("Seleccione si la tarea puede retornar al paso anterior");
        flag = true;
      } else if (
        this.rolesTramite.length == 0
      ){
        this.toastr.info("Ingrese los Roles");
        flag = true;
      } else if (
        this.listaPasos.length == 0
      ){
        this.toastr.info("Ingrese los pasos");
        flag = true;
      }
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
            if(pasos['fk_rol'] == null && pasos.grupo_usuarios==null){
              this.toastr.info("Ingrese el rol en el paso " + (index + 1));
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
          this.guardarTarea()
        } else if(action == "UPDATE_VENDEDOR"){
          this.actualizarTarea()
        }

      }
    });
  }

  actualizarTarea(){
    (this as any).mensajeSpinner = "Actualizando Tarea...";
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
    this.rolActualizar = [];
    this.rolesTramite.map((data)=>{
      let valor = {
        id_flujo_roles: data['id_flujo_roles'],
        fk_flujo: this.fk_flujoActualizar,
        fk_rol: data.id_rol,
        id_usuario:this.dataUser.id_usuario,
      }
      this.rolActualizar = [valor, ...this.rolActualizar]
    })

    let data ={
      tarea: this.tarea,
      roles: this.rolActualizar,
      pasos: this.listaPasos
    }
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
    (this as any).mensajeSpinner = "Cargando lista de Usuarios...";
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


  cargarRoles(){
    (this as any).mensajeSpinner = "Cargando Lista de Roles...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_empresa: this.dataUser.id_empresa
    }

    this.serviceAdmin.getRol(data).subscribe(
      (res)=>{
        this.roles = res['data'];
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

    (this as any).mensajeSpinner = "guardando Tarea...";
    this.lcargando.ctlSpinner(true);
    //console.log(this.dataUser);
    //console.log(this.tarea);
    // let flujo: any = null;
    this.tarea['id_usuario'] = this.dataUser.id_usuario;
    this.serviceAdmin.crearFlujo(this.tarea).subscribe(
      (res)=>{

        this.agregarFlujoRol(res['data']['id_flujo']);
        this.preguntaDisabled = false;
        this.formReadOnly = false;

      },
      (error)=>{
        console.log(error);
      }
    )



  }

  agregarFlujoUsuario(flujo){
    let usuariosRequest: any = [];

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
        console.log(error);
      }
    )

  }

  agregarFlujoRol(flujo){
    let rolesRequest: any = [];

    this.rolesTramite.map((data)=>{
      let valor = {
        id_flujo_roles: 0,
        fk_flujo: flujo,
        fk_rol: data.id_rol,
        id_usuario:this.dataUser.id_usuario,
      }
      rolesRequest.push(valor)
    })

    let data={
      params: rolesRequest
    }

    console.log(data);

    this.serviceAdmin.crearFlujoRol(data).subscribe(
      (res)=>{
        console.log(res);
        this.guardarPasos(flujo)
      },
      (error)=>{
        console.log(error);
      }
    )

  }

  agregarPasos(){

    if(this.rolesTramite.length != 0){
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
        fk_rol: null,
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
      this.toastr.info('Ingrese los roles')
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
          this.reordenarPasos();
          console.log(this.pasosL.filter((p)=>pasos['nro_paso'] != p));
          this.pasosL = this.pasosL.filter((p)=>pasos['nro_paso'] != p);
        }
        // else if(pasos['id_flujo_pasos'] != 0){
        //   (this as any).mensajeSpinner = "Eliminando...";
        //   this.lcargando.ctlSpinner(true);
        //   this.serviceAdmin.deletePasos(pasos).subscribe(
        //     (res)=>{
        //       this.lcargando.ctlSpinner(false);
        //       Swal.fire({
        //         icon: "success",
        //         title: "Éxito!",
        //         text: "Se elimino con éxito",
        //         showCloseButton: true,
        //         showCancelButton: true,
        //         showConfirmButton: true,
        //         cancelButtonText: "Cancelar",
        //         confirmButtonText: "Aceptar",
        //         cancelButtonColor: '#F86C6B',
        //         confirmButtonColor: '#4DBD74',
        //       })
        //       console.log(res);
        //       this.listaPasos.splice(index,1);
        //     }
        //   )
        // }


      }
    })
  }


reordenarPasos() {
  this.listaPasos.forEach((paso, idx) => {
    paso.nro_paso = idx + 1;
  });
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

  eliminarRol(rol, index){
  // console.log(user);

    let flag = true;
    let paso_configurado = "";
    for(let i = 0 ; i<this.listaPasos.length; i++){
      if(this.listaPasos[i].fk_rol === rol.id_rol){
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
          if(rol['id_flujo_roles'] == 0){
            this.rolesTramite.splice(index,1);
          }else if(rol['id_flujo_roles'] != 0){
            this.serviceAdmin.deleteRol(rol).subscribe(
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
                this.rolesTramite.splice(index,1);
              }
            )
          }
        }

      })

    }else{
      console.log(flag)
      this.toastr.info( "No puede eliminar este rol porque se encuentra configurado en el paso "+paso_configurado);
    }
  }
  guardarPasos(flujo){
    this.listaPasos.map((data)=>{
      data['id_usuario'] = this.dataUser.id_usuario;
      data['fk_flujo'] = flujo
    })
    let data = {
      params: this.listaPasos
    }
    console.log(data);
    this.serviceAdmin.crearFlujoPasos(data).subscribe(
      (res)=>{
        this.lcargando.ctlSpinner(false);
        if (this.tarea.nombre == "" || this.tarea.nombre == undefined) {
          this.toastr.info("Debe ingresar una tarea para poder realizar el trámite")
          return;
        }
        Swal.fire({
          icon: "success",
          title: "Éxito!",
          text: "El trámite fue creado con éxito",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        })
        this.rolesTramite = [];
        this.selectRol = {};
        this.preguntaDisabled = true;
        this.listaPasos = [];
        this.tarea = {
          nombre: null,
          descripcion: null,
          tipo: null,
          id_usuario: null,
          prioridad:  null
        }

        console.log(res);
      },
      (error)=>{
        console.log(error);
      }

    )
  }
  userSelected(event){

    if(event.id_usuario){
      this.disabled= false;
    }  else {
      this.disabled= true;
    }

  }

  rolSelected(event){
    console.log(event);
    if(event.id_rol){
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

  modalAgregarRoles(){
    this.disabledPasos=false;
    let flag = true;
    for(let i = 0 ; i<this.rolesTramite.length; i++){
      if(this.rolesTramite[i].id_rol === this.selectRol.id_rol){
       // console.log(this.usuarios[i]);
        flag = false;
        break;
      }
    }
    if(flag){
      const nuevoRol = {
        ...this.selectRol,          // Copia todas las propiedades existentes
        id_flujo_roles: 0           // Agrega la nueva propiedad
      };
      this.rolesTramite.push(nuevoRol);
    }else{
      console.log(flag)
      this.toastr.info( "No puede seleccionar el mismo rol dos veces");
    }

  }

}
