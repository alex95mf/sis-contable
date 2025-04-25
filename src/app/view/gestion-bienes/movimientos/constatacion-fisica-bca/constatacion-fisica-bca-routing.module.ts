import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstatacionFisicaBCAComponent } from './constatacion-fisica-bca.component';

const routes: Routes = [
  {
    path:'',
    component: ConstatacionFisicaBCAComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstatacionFisicaBCARoutingModule { }
