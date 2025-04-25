import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'banco'
        },
        children: [
            {
                path: 'cuentas',
                loadChildren: () => import('./bancarias/bancarias.module').then(m => m.BancariasModule)
            },
            {
                path: 'bovedas',
                loadChildren: () => import('./bovedas/bovedas.module').then(m => m.BovedasModule)
            },
             {
                path: 'transferencia',
                loadChildren: () => import('./trasnferencia-depositos/trasnferencia-depositos.module').then(m => m.TrasnferenciaDepositosModule)
            },
            // {
            //     path: 'transferencia',
            //     loadChildren: () => import('./transacciones/transacciones.module').then(m => m.TransaccionesModule)
            // },
            {
                path: 'conciliacion',
                loadChildren: () => import('./conciliacion/conciliacion.module').then(m => m.ConciliacionModule)
            },
            {
                path: 'reportes',
                loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportsBancoModule)
            },
            {
                path: 'chequeprotestado',
                loadChildren: () => import('./cheque-protestado/cheque-protestado.module').then(m => m.ChequeProtestadotModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BancariasRoutingModule {}