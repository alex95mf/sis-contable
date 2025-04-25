import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'rentas/liquidacion'
    },
    children: [
        
        {
            path: 'generacion',
            loadChildren: () => import('./generacion/generacion.module').then(m => m.GeneracionModule)
        },
        {
            path: 'espectaculos',
            loadChildren: () => import('./generacion-valor/generacion-valor.module').then(m => m.GeneracionValorModule)
        },
        {
          path: 'permisos',
          loadChildren: () => import('./generacion-permisos/generacion-permisos.module').then(m => m.GeneracionPermisosModule)
        },
        {
          path: 'cterreno',
          loadChildren: () => import('./generacion-compra-terreno/generacion-compra-terreno.module').then(m => m.GeneracionCompraTerrenoModule)
        },
        {
          path: 'anulacion',
          loadChildren: () => import('./anulacion/anulacion.module').then(m => m.AnulacionModule)
        },
        {
          path: 'recibo-cobro',
          loadChildren: () => import('./recibo-cobro/recibo-cobro.module').then(m => m.ReciboCobroModule)
        },
        {
          path: 'multas-emitidas',
          loadChildren: () => import('./multas-emitidas/multas-emitidas.module').then(m => m.MultasEmitidasModule)
        },
        {
          path: 'permisos-emitidos',
          loadChildren: () => import('./permisos-emitidos/permisos-emitidos.module').then(m => m.PermisosEmitidosModule)
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionRoutingModule { }
