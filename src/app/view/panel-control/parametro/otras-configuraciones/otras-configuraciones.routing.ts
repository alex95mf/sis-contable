import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtrasConfiguracionesComponent } from './otras-configuraciones.component';

const routes: Routes = [
  { path: '', component: OtrasConfiguracionesComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtrasConfiguracionesRoutingModule { }
