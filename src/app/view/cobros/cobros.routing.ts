import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'cobros'
    },
    children: [
      {
        path: 'cobranza',
        loadChildren: () => import('./cobranza/cobranza.module').then(m => m.CobranzaModule)
      },
      {
        path: 'coactiva',
        loadChildren: () => import('./coactiva/coactiva.module').then(m => m.CoactivaModule)
      },
      // {
      //   path: 'coactiva',
      //   component: CoactivaComponent
      // },
      {
        path: 'convenio',
        loadChildren: ()=>import('./convenio/convenio.module').then(m=>m.ConvenioModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobrosRoutingModule { }
