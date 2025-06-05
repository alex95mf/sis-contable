import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TicketService } from '../ticket.service';
import Swal from 'sweetalert2';

@Component({
standalone: false,
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss']
})
export class CategoriaFormComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;

  @Input() isCategory: any;
  @Input() categorias: any;
  @Input() subCategorias: any;
  @Input() organigrama: any;

  filteredOrganigrama: any[] = [];

  needRefresh: boolean = false;


  vmButtons = [];
  dataUser: any

  categoria : any

  constructor(
    public activeModal: NgbActiveModal,
    private ticketSrv: TicketService,
    private commonVarSrv: CommonVarService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnCategoryForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnCategoryForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.categoria = {
      id_empresa: this.dataUser.id_empresa,
      tipo: '',
      grupo: '',
      valor: '',
      descripcion: '',
      necesita_aprobacion: null,
      primer_nivel_aprobacion: null,
      ultimo_nivel_aprobacion: null
    }

    this.setNextSequence()

    this.filteredOrganigrama = [...this.organigrama];

    console.log(this.organigrama)

    
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "GUARDAR":
        this.validaFormulario();
        break;
    }
  }

  closeModal() {
    this.commonVarSrv.mesaAyuTicket.next(this.needRefresh);
    this.activeModal.dismiss();
  }

  getCatalogoCategoria() {
    let data = {
      params: "'MDA_CATEGORIA','MDA_SUBCATEGORIA'",
    };
    (this as any).mensajeSpinner = "Buscando categoría...";
    this.lcargando.ctlSpinner(true);
    this.ticketSrv.getCatalogoCategoria(data).subscribe(
     
      (res) => {
        this.categorias = res["data"]['MDA_CATEGORIA'];
        this.subCategorias = res["data"]['MDA_SUBCATEGORIA'];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }


  

  getNextSequence(lista: any[], prefix: string): string {
    if (!lista || lista.length === 0) {
        return `${prefix}1`;
    }

    // Obtener solo los valores que coincidan con el prefijo (CAT o SUB)
    let filteredValues = lista
        .map(item => item.valor)
        .filter(valor => valor.startsWith(prefix))
        .map(valor => parseInt(valor.replace(prefix, ''), 10))
        .filter(numero => !isNaN(numero))
        .sort((a, b) => b - a);

    // Determinar el siguiente número en la secuencia
    let nextNumber = filteredValues.length > 0 ? filteredValues[0] + 1 : 1;
    
    return `${prefix}${nextNumber}`;
  }

  setNextSequence(): void {
    if (this.isCategory) {
        this.categoria.tipo = "MDA_CATEGORIA";
        this.categoria.grupo = "MDA_CATEGORIA";
        this.categoria.valor = this.getNextSequence(this.categorias, "CAT");
    } else {
        this.categoria.tipo = "MDA_SUBCATEGORIA";
        this.categoria.valor = this.getNextSequence(this.subCategorias, "SUB");
    }
  }

  crearCategoria() {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea crear un nueva categoría?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
  
          (this as any).mensajeSpinner = "Guardando Categoría...";
          this.lcargando.ctlSpinner(true);
  
          let params =  {
            params: this.categoria
          }
  
          this.ticketSrv.createCatalogo(params).subscribe(
            (res) => {
              //console.log(res);
              if (res["status"] == 1) {
                this.needRefresh = true;
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "success",
                  title: "Categoria Creada",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.needRefresh = true;
                    this.closeModal();
                  }
                  window.location.reload()
                });
                
              } else {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              }
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            }
          )
        }
      });
  }

  crearSubCategoria() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nueva sub-categoría?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        (this as any).mensajeSpinner = "Guardando Sub Categoría...";
        this.lcargando.ctlSpinner(true);

        let params =  {
          params: this.categoria
        }
          

        this.ticketSrv.createCatalogo(params).subscribe(
          (res) => {
            //console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Sub Categoría Creada",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.needRefresh = true;
                  this.closeModal();
                }
                window.location.reload()
              });
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        )
      }
    });
  }

  async validaFormulario() {
    if (this.isCategory) {
      if(this.categoria.descripcion === ""){
        this.toastr.warning("Debe ingresar el nombre de la categoría");
        return;
      } else{
        this.crearCategoria()
      }

    } else { 
      if(this.categoria.grupo === ""){
        this.toastr.warning("Debe seleccionar la categoría");
        return;
      }
      if(this.categoria.descripcion === ""){
        this.toastr.warning("Debe ingresar el nombre de la sub-categoría");
        return;
      }
      this.crearSubCategoria()
    } 
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

  onPrimerNivelChange(selectedId: number) {
    this.filteredOrganigrama = this.filterOrganigrama(selectedId);
    // Resetear el último nivel si ya estaba seleccionado
    if (this.categoria.ultimo_nivel_aprobacion) {
      this.categoria.ultimo_nivel_aprobacion = null;
    }
  }

}
