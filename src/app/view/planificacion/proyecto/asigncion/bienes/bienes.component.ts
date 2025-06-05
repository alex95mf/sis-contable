import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsigncionService } from '../asigncion.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component'; //.8//.
/* 
import { DetalleBienesModalComponent } from './detalle-bienes-modal/detalle-bienes-modal.component'; */
@Component({
standalone: false,
  selector: 'app-bienes',
  templateUrl: './bienes.component.html',
  styleUrls: ['./bienes.component.scss']
})
export class BienesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  fTitle: string = 'Agregar Bienes y Servicios'
  @Input() periodo: any;
  @Input() programa: any;
  @Input() departamento: any;
  @Input() atribucion: any;
  showTooltips: boolean[] = [];

 
  @Input() unidadesMedida: any;
  @Input() presupuesto: any;
  @Input() valor_periodo: any;
 

  itemBienes: any[] = []
  bienesEliminar: any[] = []
  vmButtons: any[] = []
  itemBienesTotal: number = 0
  proyectos = []

  validaciones = new ValidacionesFactory();

  constructor(private dialog: MatDialog,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
    private apiService: AsigncionService,
  ) {
    this.apiService.updatedPresupuesto.subscribe(
      (presupuesto: any) => this.presupuesto = presupuesto
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsAsigBienes", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsAsigBienes", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ]

    setTimeout(() => {
      this.cargaInicial()
    }, 75);
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;
      case "GUARDAR":
        this.saveInformation();
        break;
    }
  }

  async cargaInicial() {
    // NEcesito Periodo, Programa, Departamento, Atribucion
    // Buscar los bienes que tienen esos 4 datos.
    // Respuesta puede venir vacia (no hay bienes para el PDA-Periodo)
    this.lcargando.ctlSpinner(true);
    try {
      //
      (this as any).mensajeSpinner = 'Cargando Bienes y Servicios'
      this.itemBienes = await this.apiService.getBienes({periodo: this.periodo, programa: this.programa, departamento: this.departamento, atribucion: this.atribucion});
      this.itemBienes.forEach(item => {
        item.cantidad = 1;
        item.costo_total = item.costo_unitario;
      });
      console.log("console principarl", this.itemBienes)
      this.showTooltips = new Array(this.itemBienes.length);
      this.itemBienesTotal = this.itemBienes.reduce((acc: number, bien: any) => acc + parseFloat(bien.costo_total), 0)
      console.log(this.presupuesto);

      (this as any).mensajeSpinner = 'Cargando Proyectos'
      this.proyectos = await this.apiService.getProyectos({periodo: this.valor_periodo, programa: this.programa});

      this.proyectos.forEach((elem: any) => {
        Object.assign(elem,{fk_proyecto: elem.id_proyecto,
          fk_programa: elem.fk_programa,
          secuencia: elem.secuencia,
          descripcion: elem.descripcion,
          label: `${elem.secuencia}-${elem.descripcion}`})
      })

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Bienes y Servicios')
    }
  }
  modalCuentaContableReg(item){
  
    let modal = this.modalService.open(ModalCuentPreComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    console.log(item);
    modal.componentInstance.detalle = item.detalle;

    modal.result.then((result) => {
      // Aquí puedes hacer lo que quieras con el resultado, como por ejemplo imprimirlo en la consola
      console.log("Resultado del modal:", result);
      // Si el modal devuelve el detalle, puedes acceder a él así
      console.log("Detalle del modal:", result.detalle); //modal.componentInstance
      const index = this.itemBienes.findIndex(i => i === item);
      if (index !== -1) {
        this.itemBienes[index].detalle = result.detalle;
      }
    }).catch((error) => {
      // Manejar el error si es necesario
      console.error("Error al cerrar el modal:", error);
    });
  }





  expandBienes(item: any, index: number) {
   /*  const dialogRef = this.dialog.open(DetalleBienesModalComponent, {
      width: '500px',
      data: { texto: item.descripcion } // Pasar los datos al modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    }); */
  /*   const modal = this.dialogmodalService.open(DetalleBienesModalComponent, { size: "xl", backdrop: 'static', centered: true, container: 'body' });
//    const modal = this.modalService.open(DetalleBienesComponent, { size: "xl", backdrop: 'static' })
    modal.componentInstance.item = item; // Pasar el elemento item al modal
    modal.componentInstance.index = index; // Pasar el índice al modal
    modal.componentInstance.data = item;
   // modal.componentInstance.atribucion = atribucion
    modal.componentInstance.unidadesMedida = this.unidadesMedida
    modal.componentInstance.presupuesto = this.presupuesto


    modal.result.then((result) => {
      // La variable "result" contiene el dato que quieres guardar
     // this.variableParaGuardar = result;
      this.itemBienes[index] = result;
  }, (reason) => {
      // Manejar el rechazo de la promesa si es necesario
      console.log("Modal cerrado sin resultado:", reason);
  }); */
  }



  costoTotal(item) {
    item.costo_total = item.cantidad * item.costo_unitario
    this.itemBienesTotal = this.itemBienes.reduce((acc: number, bien: any) => acc + parseFloat(bien.costo_total), 0)
  }

  agregaBienes() {

    let item = {
      id: null, // tabla pla_bienes
      fk_programa: this.programa.id_catalogo,
      fk_departamento: this.departamento.id_catalogo,
      fk_atribucion: this.atribucion.atribucion_data.id,
      fk_atribucion_catalogo: this.atribucion.id_catalogo,
      cantidad: 1,
      fk_medida: null,
      u_medida: null,
      descripcion: null,
      costo_unitario: 0,
      costo_total: 0,
      periodo1: false,
      periodo2: false,
      periodo3: false,
      periodo4: false,
      periodo5: false,
      periodo6: false,
      periodo7: false,
      periodo8: false,
      periodo9: false,
      periodo10: false,
      periodo11: false,
      periodo12: false,
    }
    this.itemBienes.push(item)
  }

  validaData() {
    return new Promise((resolve, reject) => {
      let message = ''

      /* if (!this.itemBienes.length) {
        message += '* No se puede guardar sin Bienes y Servicios agregados.<br>'
      } */

     // this.itemBienesTotal = this.itemBienes.reduce((acc: number, bien: any) => acc + parseFloat(bien.costo_total), 0)
     let valornuevo = this.itemBienes.reduce((acc: number, bien: any) => {
      return bien.id === null ? acc + parseFloat(bien.costo_total) : acc;
    }, 0); 
     if (valornuevo > this.presupuesto.disponible) {
    //  if (this.itemBienesTotal > this.presupuesto.disponible) {
        message += '* El Costo Total de los items ingresados excede lo disponible.<br>'
        message += '*Bienes total '+this.itemBienesTotal+'.<br>'
        message += '*Bienes Disponible '+this.presupuesto.disponible+'.<br>'
      }
  
      for(let i = 0; i < this.itemBienes.length; i++) {
        if (this.itemBienes[i].costo_unitario <= 0 || this.itemBienes[i].costo_unitario == null) {
          message += `* El Costo Unitario del bien #${i + 1} no puede ser 0 o vacío.<br>`
        }
  
        if (this.itemBienes[i].cantidad <= 0 || this.itemBienes[i].cantidad == null) {
          message += `* La Cantidad del bien #${i} no puede ser 0 o vacío.<br>`
        }
  
        if (this.itemBienes[i].descripcion.trim().length === 0) {
          message += `* La Descripcion del bien #${i} no puede ser vacío.<br>`
        }
      }

      return (!message.length) ? resolve(true) : reject(message)
    })

    
  }

  async saveInformation() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Validando datos'
      await this.validaData()

      (this as any).mensajeSpinner = 'Almacenando Bienes'
      let response = await this.apiService.almacenaBienes({
        periodo: this.periodo,
        programa: this.programa,
        departamento: this.departamento,
        atribucion: this.atribucion,
        bienes: this.itemBienes,
        bienesEliminar: this.bienesEliminar
      })
      this.lcargando.ctlSpinner(false)

      Swal.fire('Bienes almacenados correctamente.', '', 'success').then(() => {
        this.apiService.hasBienes$.emit(response)
        this.activeModal.close()
      })
      
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(err, 'Validación de Datos', {enableHtml: true})
    }
  }

  async delBien(item, idx) {
    if (item.id == null) {
      this.itemBienes.splice(idx, 1)
      this.lcargando.ctlSpinner(false)
      return
    }

    const result = await Swal.fire({
      titleText: 'Eliminacion de Bien',
      text: 'Esta seguro/a desea eliminar este bien?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      (this as any).mensajeSpinner = 'Eliminando Bien'

      try {
        const response = await this.apiService.deleteBienes({bien: item})
        console.log(response)
        //
        this.lcargando.ctlSpinner(false)
        this.apiService.actualizaPresupuesto$.emit()
        this.itemBienes.splice(idx, 1)
        // this.cargaInicial()
        // this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error eliminando Bien')
      }
    }
    // if (item.id !== null) this.bienesEliminar.push(item.id)
  }

  handleSelectMedida(event: any, item: any) {
    Object.assign(
      item,
      { fk_medida: event.id_catalogo, u_medida: event.valor }
    )
  }

  handleSelectProyecto(event: any, item: any) {
    Object.assign(
      item,
      { fk_proyecto: event.fk_proyecto, codigo_proyecto: event.secuencia }
    )
  }
 /*  toggleTooltip(item: any) {
    console.log("ejecutando");
    item.showTooltip = !item.showTooltip;
} */
toggleTooltip(index: number) {
  console.log("ejecutando");
  this.showTooltips[index] = !this.showTooltips[index];
}
 

}


/* (this as any).mensajeSpinner = 'Validando...'
    this.lcargando.ctlSpinner(true);
    this.validaData()
      .then(() => {
        (this as any).mensajeSpinner = 'Almacenando Bienes'
        this.apiService.almacenaBienes({
          departamento: { id: this.atribucion.id_departamento },
          atribucion: { id: this.atribucion.id },
          bienes: this.itemBienes,
        }).subscribe(
          (res: any) => {
            console.log(res)
            this.apiService.hasBienes$.emit(res)
            this.lcargando.ctlSpinner(false)
            this.activeModal.close()
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error almacenando Bienes y Servicios')
          }
        )
      })
      .catch((err: string) => {
        console.log(err)
        this.toastr.warning(err, 'Errores de Validación', { enableHtml: true })
      }) */

    // Llamar a endpoint para guardar bienes. Devolver array de bienes registrados

    // this.closeModal()

/*
this.validaData()
  .then(() => {
    Swal.fire({
      title: 'Confirmar que haya guardado los cambios. Si no ha guardado, estos cambios se perderán.',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Si, he guardado los cambios',
      denyButtonText: 'No he hecho cambios',
      cancelButtonText: 'No, no he guardado los cambios',
      confirmButtonColor: '#0d6efd',
      denyButtonColor: '#6c757d',
      cancelButtonColor: '#dc3545'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.apiService.hasBienes$.emit()
        this.activeModal.close()
      } else if (result.isDenied) {
        this.activeModal.close()
      }
    })
  })
  .catch(() => {
    this.toastr.warning('Existen bienes o servicios sin datos completos.')
  })
*/
