import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPolizaComponent } from './registro-poliza.component';


const routes: Routes = [
  {
    path:'',
    component: RegistroPolizaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroPolizaRoutingModule { }
