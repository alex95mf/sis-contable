import { Component, OnInit } from '@angular/core';
import { Proyecto } from '../proyecto.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowProyectoComponent } from './show/show.component';
import { ConsultaService } from './consulta.service';

@Component({
standalone: false,
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  proyectos : Proyecto[] = []

  dtOptions : DataTables.Settings = {}
  vmButtons : any;

  constructor(private modal : NgbModal, private proyectoService : ConsultaService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }

    this.vmButtons = [
      { orig: "consProyecto", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section", imprimir: true },
      { orig: "consProyecto", paramAccion: "1", boton: { icon: "far fa-file-alt", texto: "REPORTE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },
      { orig: "consProyecto", paramAccion: "1", boton: { icon: "far fa-window-close", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
    ]

    this.getProyectos();
  }

  getProyectos() {
    /**
     * Obtiene todos los proyectos almacenados en la base
     */
    this.proyectoService.getProyectos().subscribe(res => {
      console.log(res['data']);
      res['data'].forEach(element => {
        // Armado del objeto, basado en la respuesta
        let proyecto : Proyecto = {
          id: element.id_proyecto || 0,
          nombre: element.nombre,
          id_programa: element.id_programa,
          objetivo: element.objetivo,
          presupuesto: element.presupuesto,
          fechaInicio: element.fecha_inicio,
          fechaFinal: element.fecha_final,
          actividades: [],
        }
        // Agregado a la tabla
        this.proyectos.push(proyecto);
      });
    });
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case "IMPRIMIR":
        break;
      case "REPORTE":
        break;
      case "CANCELAR":
        break;
    }
  }

  showProyecto(proyecto : Proyecto) {
    /**
     * Muestra los detalles del proyecto seleccionado
     */
    const modal = this.modal.open(ShowProyectoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modal.componentInstance.proyecto = proyecto;
  }

  deleteProyecto(proyecto : Proyecto) {
    // Elimina el proyecto de la tabla
    // TODO: eliminar de la base
    this.proyectos = this.proyectos.filter(p => p.id !== proyecto.id);
  }

}
