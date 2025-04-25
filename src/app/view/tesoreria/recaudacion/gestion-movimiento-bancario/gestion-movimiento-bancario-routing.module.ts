import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionMovimientoBancarioComponent } from './gestion-movimiento-bancario.component';

const routes: Routes = [
  {
    path:'',
    component: GestionMovimientoBancarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionMovimientoBancarioRoutingModule { }
