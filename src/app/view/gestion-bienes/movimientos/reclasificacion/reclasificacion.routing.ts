import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclasificacionComponent } from './reclasificacion.component';

const routes: Routes = [
  {
    path: '',
    component: ReclasificacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReclasificacionRoutingModule { }
