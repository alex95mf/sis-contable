import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspeccionComponent } from './inspeccion/inspeccion.component';

const routes: Routes = [

  {
    path: '',
    data: {
      title: 'rentas/lcomerciales'
    },
    children: [
      {
        path: 'inspeccion',
        component: InspeccionComponent
      },
      {
        path: 'form-planificacion',
        loadChildren: () => import('./form-planificacion/form-planificacion.module').then(m => m.FormPlanificacionModule)
      },
      {
        path: 'form-comisaria',
        loadChildren: () => import('./form-comisaria/form-comisaria.module').then(m => m.FormComisariaModule)
      },
      {
        path: 'asignacion',
        loadChildren: () => import('./asignacion/asignacion.module').then(m => m.AsignacionModule)
      },
      {
        path: 'form-higiene',
        loadChildren: () => import('./form-higiene/form-higiene.module').then(m => m.FormHigieneModule)
      },
      {
        path: 'form-rentas',
        loadChildren: () => import('./form-rentas/form-rentas.module').then(m => m.FormRentasModule)
      },
      {
        path: 'generacion',
        loadChildren: () => import('./generacion/generacion.module').then(m => m.GeneracionModule)
      },
      {
        path: 'liquidacion',
        loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule)
      },
      {
        path: 'multas',
        loadChildren: () => import('./multas/multas.module').then(m => m.MultasModule)
      },
      {
        path: 'comisaria-certificado',
        loadChildren: () => import('./comisaria-certificado/comisaria-certificado.module').then(m => m.ComisariaCertificadoModule)
      },

      {
        path: 'cat-esp-publicitarios',
        loadChildren: () => import('./categorias-esp-publicitarios/categorias-esp-publicitarios.module').then(m => m.CategoriasEspPublicitariosModule)
      },
      {
        path: 'via-publica',
        loadChildren: () => import('./via-publica/via-publica.module').then(m => m.ViaPublicaModule)
      },
      {
        path: 'simulacion',
        loadChildren: () => import('./simulacion/simulacion.module').then(m => m.SimulacionModule)
      },
      {
        path: 'locales-turisticos',
        loadChildren: () => import('./lturisticos/lturisticos.module').then(m => m.LturisticosModule)
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LcomercialesRoutingModule { }
