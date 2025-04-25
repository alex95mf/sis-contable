import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioCientoTresComponent } from './formulario-ciento-tres.component';

const routes: Routes = [
  {
    path: '',
    component: FormularioCientoTresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoEfectivoRoutingModule { }
