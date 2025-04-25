import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
        title: 'cobros/coactiva'
    },
    children: [
      {
        path: 'emision-expediente',
        loadChildren: () => import('./emision-expediente/emision-expediente.module').then(m => m.EmisionExpedienteModule )
      },
      {
        path: 'gestion-expediente',
        loadChildren: ()=> import('./gestion-expediente/gestion-expediente.module').then(m=>m.GestionExpedienteModule)
      },
      {
        path: 'emision-juicio',
        loadChildren: () => import('./gestion-juicio/gestion-juicio.module').then(m => m.GestionJuicioModule)
      },
      {
        path: 'juicios',
        loadChildren: () => import('./juicios/juicios.module').then(m => m.JuiciosModule)
      },
      {
        path: 'abogados',
        loadChildren: () => import('./abogados/abogados.module').then(m => m.AbogadosModule)
      },
      {
        path: 'reporte',
        loadChildren: ()=> import('./reporte/reporte.module').then(m=>m.ReporteModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoactivaRoutingModule { }
