import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'contabilidad/activofijo'
        },
        children: [
            {
                path: 'adquicisiones',
                loadChildren: () => import('./adquisiciones/adquisiciones.module').then(m => m.AdquisicionesModule)
            },
            {
                path: 'parametros',
                loadChildren: () => import('./parametros/parametros.module').then(m => m.ParametrosModule)
            },
            {
                path: 'depreciacion',
                loadChildren: () => import('./depreciacion/depreciacion.module').then(m => m.DepreciacionModule)
            },
            {
                path: 'etiquetas',
                loadChildren: () => import('./etiqueta-acfijo/etiqueta-acfijo.module').then(m => m.EtiquetaAcfijoModule)
            },
            {
                path: 'consultas',
                loadChildren: () => import('./reporte-adq/reporte-acfijo.module').then(m => m.ReporteAdqModule)
            },
            {
                path: 'consultastwo',
                loadChildren: () => import('./reporte-acfijo-two/reporte-acfijo-two.module').then(m => m.ReporteAcfijoTwoModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivoFijoRoutingModule {}