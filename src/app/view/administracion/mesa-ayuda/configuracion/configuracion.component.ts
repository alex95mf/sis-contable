import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ConfiguracionService } from './configuracion.service';
import Swal from 'sweetalert2';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent; 

  fTitle: string = "Parámetros Mesa de Ayuda";
  dataUser: any = {};

  vmButtons: any = [];

  lista_roles: any[] = []

  categorias: any[] = []

  organigrama: any
  filteredOrganigrama: any[] = [];

  parametros_generales: any = {
    id_empresa:0,
    numero_max_reincidencia_ticket: null,
    asignacion_automatica_ticket: null,
    reasignacion_ticket: null,
    emitir_alerta_reapertura: null,
    reaperturar_ticket: null
  }

  perfiles_reasignacion: Array<{
    id_accion_configuracion: number, 
    id_empresa: number,
    tipo_accion: string,
    perfil: string,
    estado: string,
    id_usuario: number
  }> = [];

  constructor(
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private configSrv: ConfiguracionService,
    public validaciones: ValidacionesFactory,
  ) {
    this.vmButtons = [
      {
        orig: "btnsProductos",
        paramAccion: "",
        boton: { icon: "fa fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }
    ];
   }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(() => this.cargarParametros(), 50);

    this.parametros_generales.id_empresa = this.dataUser.id_empresa

  }

  

  async cargarParametros() {
    let data = {
      id_empresa: this.dataUser.id_empresa
    }

    let dataPerfilReasignacion = {
      id_empresa: this.dataUser.id_empresa,
      tipo_accion: "PERFIL_REASIGNACION"
    }

    let dataCategoria = {
      params: "'MDA_CATEGORIA'",
    };

    this.configSrv.getParametrosGenerales(data).subscribe(
      (res) => {
        if (res['data']['parametros_generales'] !== null) {
          this.parametros_generales = res['data']['parametros_generales'];
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    )

    this.configSrv.getRol(data).subscribe(resrol => {
      if(resrol['data'].length > 0){
        this.lista_roles = resrol['data'].filter(rol => rol.estado === 'A');
      }else{
        this.lista_roles = []
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

    this.configSrv.getAccionesConfiguracion(dataPerfilReasignacion).subscribe(
      (res) => {
        if (res['data']) {
          this.perfiles_reasignacion = res['data'];
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    )

    this.configSrv.obtenerOrganigrama(data).subscribe(     
      (res) => {
        console.log(res)
        this.organigrama=res['data']['organigrama']
        this.filteredOrganigrama=res['data']['organigrama']

        this.cargarCategorias()
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );


    
  }

  cargarCategorias() {
    let dataCategoria = {
      params: "'MDA_CATEGORIA'",
    };
  
    this.configSrv.getCatalogoCategoria(dataCategoria).subscribe(
      (res) => {
        console.log(res);
        this.categorias = res["data"]['MDA_CATEGORIA'];
        
        // Procesar cada categoría para generar su lista filtrada
        this.procesarCategorias();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  
  // Método para procesar categorías con organigrama ya cargado
  procesarCategorias() {
    this.categorias.forEach(categoria => {
      if (categoria.necesita_aprobacion === 'S' && categoria.primer_nivel_aprobacion) {
        categoria.filteredOrganigrama = this.filterOrganigrama(categoria.primer_nivel_aprobacion);
      } else {
        categoria.filteredOrganigrama = [];
      }
    });
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " GUARDAR":
        this.validarFormulario();
        break;
    }
  }

  validarParametrosGenerales(): { esValido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (this.parametros_generales.reaperturar_ticket === null) {
      errores.push("En parámetros generales debe de seleccionar si un ticket se va a poder reaperturar");
    }
    if (this.parametros_generales.reaperturar_ticket === 'S' && (this.parametros_generales.numero_max_reincidencia_ticket === null || this.parametros_generales.numero_max_reincidencia_ticket === 0)) {
      errores.push("En parámetros generales debe de ingresar el número máxmo que un ticket se puede reaperturar");
    }
    if(this.parametros_generales.asignacion_automatica_ticket === null){
      errores.push("En parámetros generales debe de seleccionar si el ticket se asignará de forma automatica");
    }
    if(this.parametros_generales.reasignacion_ticket === null){
      errores.push("En parámetros generales debe de seleccionar si el ticket se va a poder reasignar");
    }
    if(this.parametros_generales.emitir_alerta_reapertura === null){
      errores.push("En parámetros generales debe de seleccionar si al re-aperturar un ticket se emitirá alertas");
    }
  
    return {
      esValido: errores.length === 0,
      errores,
    };
  }

  validarFormulario(){

    const validacionParametrosGenerales = this.validarParametrosGenerales();

    if (!validacionParametrosGenerales.esValido) {
      this.toastr.warning(validacionParametrosGenerales.errores.join(". "));
      return;
    }

    this.crearParametros();
  }

  crearParametros() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar estos parámetros?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        // Mostrar un SweetAlert de carga
        Swal.fire({
          title: "Guardando...",
          text: "Por favor, espere mientras se guardan los parámetros.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Mostrar animación de carga
          },
        });


        let data = {
          parametros_generales: this.parametros_generales,
          perfiles_reasignacion: this.perfiles_reasignacion,
          categorias: this.categorias
        }

        console.log(data)

        this.configSrv.guardarParametrosGenerales(data).subscribe(
          async (res: any) => {
            if (res["status"] == 1) {
              Swal.fire('Parametros guardados', res['message'], 'success')
              this.cargarParametros()
            } else {
              Swal.fire('Error', res['message'], 'error')
            }
          },
          (error) => {
            this.toastr.info(error.error.message);
          }
        )
      }
    });
  }

  agregarFilaPerfilReasignacion() {
    this.perfiles_reasignacion.push(
      { 
        id_accion_configuracion: 0,
        id_empresa:this.dataUser.id_empresa,
        tipo_accion: 'PERFIL_REASIGNACION', 
        perfil: '',
        estado: 'A',
        id_usuario: this.dataUser.id_usuario
     });
  }

  eliminarPerfilReasignacion(index: number) {
    this.perfiles_reasignacion.splice(index, 1);
  }

  filterOrganigrama(selectedId: number): any[] {
    if (!selectedId) return this.organigrama;
    
    // 1. Encontrar el nodo seleccionado
    const selectedNode = this.organigrama.find(o => o.id_organigrama === selectedId);
    if (!selectedNode) return this.organigrama;
    
    // 2. Obtener todos los códigos padres en la jerarquía (incluyendo el seleccionado)
    const parentCodes = this.getParentHierarchy(selectedNode.codigo);
    
    // 3. Filtrar organigrama para mostrar solo el nodo seleccionado y sus superiores
    return this.organigrama.filter(item => {
      // Incluir solo si el código está en la jerarquía de padres
      return parentCodes.includes(item.codigo);
    });
  }
  
  // Función auxiliar para obtener la jerarquía de padres (sin cambios)
  getParentHierarchy(codigo: string): string[] {
    const hierarchy = [codigo];
    let currentCode = codigo;
    
    while (currentCode.includes('.')) {
      currentCode = currentCode.substring(0, currentCode.lastIndexOf('.'));
      hierarchy.push(currentCode);
    }
    
    return hierarchy;
  }

  onPrimerNivelChange(selectedId: number, categoria: any) {
    if (!selectedId) {
      categoria.filteredOrganigrama = [];
      categoria.ultimo_nivel_aprobacion = null;
      return;
    }
  
    categoria.filteredOrganigrama = this.filterOrganigrama(selectedId);
    
    // Resetear el último nivel si ya estaba seleccionado y no está en la nueva lista
    if (categoria.ultimo_nivel_aprobacion && 
        !categoria.filteredOrganigrama.some(item => item.id_organigrama === categoria.ultimo_nivel_aprobacion)) {
      categoria.ultimo_nivel_aprobacion = null;
    }
  }



}
