import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaConvenioComponent } from './consulta-convenio.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaConvenioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaConvenioRoutingModule { }
