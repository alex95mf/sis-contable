import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesGraficosComponent } from './reportes-graficos.component'; 

const routes: Routes = [
  {
    path: '',
    component: ReportesGraficosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesGraficosRoutingModule { }
