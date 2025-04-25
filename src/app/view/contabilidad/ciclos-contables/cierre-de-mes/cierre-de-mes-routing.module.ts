import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreDeMesComponent } from './cierre-de-mes.component';

const routes: Routes = [
  {
    path: '',
    component: CierreDeMesComponent,
   
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreDeMesRoutingModule { }
