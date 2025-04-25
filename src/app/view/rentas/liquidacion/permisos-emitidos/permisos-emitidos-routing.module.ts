import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisosEmitidosComponent } from './permisos-emitidos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'permisos-emitidos'
    },
    children: [
      {
        path: '',
        component: PermisosEmitidosComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermisosEmitidosRoutingModule { }
