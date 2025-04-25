import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaIdpComponent } from './consulta-idp.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaIdpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaIdpRoutingModule { }
