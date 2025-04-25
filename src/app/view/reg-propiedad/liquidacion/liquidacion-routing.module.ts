import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'reg-propiedad/liquidacion'
    },
    children: [
        
        {
            path: 'emision',
            loadChildren: () => import('./generacion/generacion.module').then(m => m.GeneracionModule)
        },
        {
            path: 'titulos',
            loadChildren: () => import('./titulos/titulos.module').then(m => m.TitulosModule)
        },
        {
            path: 'emision-aranceles',
            loadChildren: ()=> import('./emision-aranceles/emision-aranceles.module').then(m=>m.EmisionArancelesModule)
        }
    ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionRoutingModule { }
