import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'rentas/mercados'
    },
    children: [
      {
        path: 'old-puestomercado',
        loadChildren: () => import('./puesto/puesto.module').then(m => m.PuestoModule)
      },
      {
        path: 'puestomercado',
        loadChildren: () => import('./puesto-mercado/puesto-mercado.module').then(m => m.PuestoMercadoModule)
      },
      {
        path: 'contrato',
        loadChildren: () => import('./contrato/contrato.module').then(m => m.ContratoModule)
      },
      {
        path: 'titulos',
        loadChildren: () => import('./titulos/titulos.module').then(m => m.TitulosModule)
      },
      {
        path: 'mercado',
        loadChildren: ()=>import('./mercado/mercado.module').then(m=>m.MercadoModule)
      },
      {
        path: 'lista-mercado',
        loadChildren: ()=>import('./lista-mercado/lista-mercado.module').then(m=>m.ListaMercadoModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MercadosRoutingModule { }
