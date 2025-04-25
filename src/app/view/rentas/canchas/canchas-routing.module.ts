import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'rentas/canchas'
    },
    children: [
        {
            path: 'generacion',
            loadChildren: () => import('./generacion-valor/generacion-valor.module').then(m => m.GeneracionValorModule)
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanchasRoutingModule { }
