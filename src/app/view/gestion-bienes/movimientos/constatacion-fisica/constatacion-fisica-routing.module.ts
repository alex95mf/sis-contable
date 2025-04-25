import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstatacionFisicaComponent } from './constatacion-fisica.component';

const routes: Routes = [
  {
    path:'',
    component: ConstatacionFisicaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstatacionFisicaRoutingModule { }
