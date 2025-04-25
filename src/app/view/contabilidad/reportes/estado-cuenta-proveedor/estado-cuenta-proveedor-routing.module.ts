import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadoCuentaProveedorComponent } from './estado-cuenta-proveedor.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'plan'
    },
    children: [
      {
        path: '',
        component: EstadoCuentaProveedorComponent,
        data: {
          title: ''
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoCuentaProveedorRoutingModule { }
