import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionPermisosComponent } from './generacion-permisos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'generacion-permisos'
    },
    children: [
      {
        path: '',
        component: GeneracionPermisosComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneracionPermisosRoutingModule { }
