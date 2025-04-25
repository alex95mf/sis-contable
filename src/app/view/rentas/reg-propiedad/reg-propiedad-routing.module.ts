import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'rentas/reg-propiedad'
    },
    children: [
        
        {
            path: 'titulos',
            loadChildren: () => import('./titulos/titulos.module').then(m => m.TitulosModule)
        },
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegPropiedadRoutingModule { }
