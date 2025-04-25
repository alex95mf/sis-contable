import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaGeneralRubrosComponent } from './consulta-general-rubros.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaGeneralRubrosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaGeneralRubrosRoutingModule { }
