import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevaConsultaComponent } from './nueva-consulta.component';

const routes: Routes = [
  { path: '', component: NuevaConsultaComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NuevaConsultaRoutingModule { }
