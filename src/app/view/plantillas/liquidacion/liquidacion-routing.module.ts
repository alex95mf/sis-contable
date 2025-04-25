import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { InspeccionComponent } from './inspeccion/inspeccion.component';

const routes: Routes = [

  {
    path: '',
    data: {
      title: 'plantillas/liquidacion'
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
export class LcomercialesRoutingModule { }
