import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaComercialComponent } from './bandeja-comercial.component';

const routes: Routes = [
  {
    path: '',
    component: BandejaComercialComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BandejaComercialRoutingModule { }
