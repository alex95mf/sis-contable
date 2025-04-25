import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaMercadoComponent } from './lista-mercado.component';

const routes: Routes = [
  {
    path: '',
    component: ListaMercadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaMercadoRoutingModule { }
