import { Component, OnInit } from '@angular/core';
import { Programa } from '../programa.model';
import { ShowProgramaComponent } from './show/show.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  programas : Programa[] = [
    { id: 1, id_plan: 1, nombre: "Duis venenatis tortor quis felis", presupuesto: Math.round(Math.random()*10000000) / 100 },
    { id: 2, id_plan: 1, nombre: "Praesent magna ex", presupuesto: Math.round(Math.random()*10000000) / 100 },
    { id: 3, id_plan: 2, nombre: "Maecenas vitae", presupuesto: Math.round(Math.random()*10000000) / 100 },
    { id: 4, id_plan: 2, nombre: "Nunc pharetra hendrerit", presupuesto: Math.round(Math.random()*10000000) / 100 },
    { id: 5, id_plan: 3, nombre: "Mauris viverra vel magna", presupuesto: Math.round(Math.random()*10000000) / 100 },
    { id: 6, id_plan: 3, nombre: "Sed tortor mauris", presupuesto: Math.round(Math.random()*10000000) / 100 },
    { id: 7, id_plan: 3, nombre: "Duis eget mauris", presupuesto: Math.round(Math.random()*10000000) / 100 },
  ];

  dtOptions : DataTables.Settings = {}

  constructor(private modal : NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 7,
      processing: true
    }
  }

  showPrograma(programa : Programa) {
    const modal = this.modal.open(ShowProgramaComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modal.componentInstance.programa = programa;
  }

  deletePrograma(programa : Programa) {
    this.programas = this.programas.filter(prog => prog.id !== programa.id);
  }

}
