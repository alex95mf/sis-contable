import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'rentas/predurbano'
    },
    children: [
        
        {
            path: 'generacion',
            loadChildren: () => import('./generacion/generacion.module').then(m => m.GeneracionModule)
        },
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredUrbanoRoutingModule { }
