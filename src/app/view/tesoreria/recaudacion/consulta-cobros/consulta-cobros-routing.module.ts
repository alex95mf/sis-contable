import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaCobrosComponent } from './consulta-cobros.component'; 

const routes: Routes = [
  {
    path: '',
    component: ConsultaCobrosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCobrosRoutingModule { }
