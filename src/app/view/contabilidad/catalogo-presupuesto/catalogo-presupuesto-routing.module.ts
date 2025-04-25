import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoPresupuestoComponent } from './catalogo-presupuesto.component';

const routes: Routes = [{
  path: '',
  component: CatalogoPresupuestoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoPresupuestoRoutingModule { }
