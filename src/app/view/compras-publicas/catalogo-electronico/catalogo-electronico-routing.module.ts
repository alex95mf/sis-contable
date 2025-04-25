import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoElectronicoComponent } from './catalogo-electronico.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogoElectronicoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoElectronicoRoutingModule { }
