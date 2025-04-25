import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaDirectorioComponent } from './consulta-directorio.component';

const routes: Routes = [
  { path: '', component: ConsultaDirectorioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaDirectorioRoutingModule { }
