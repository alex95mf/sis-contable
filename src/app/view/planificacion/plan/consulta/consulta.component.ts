import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Plan } from '../plan.model';
import { planEstado, PlanTipo } from '../plan.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowPlanComponent } from './show/show.component';

@Component({
standalone: false,
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  // Dummy data
  planes : Plan[] = []

  dtOptions : DataTables.Settings = {}

  constructor(private modal : NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 7,
      processing: true
    }
  }

  showOrder(plan : Plan) {
    // console.log(plan);
    const modal = this.modal.open(ShowPlanComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modal.componentInstance.plan = plan;
  }

  deleteOrder(pplan : Plan) {
    console.log("Elimando plan: " + pplan.nombre);
    this.planes = this.planes.filter(plan => plan.id !== pplan.id);
  }

}
