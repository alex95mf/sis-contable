import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'bancos'
        },
        children: [
            {
                path: 'cajageneral',
                loadChildren: () => import('./caja-general/caja-general.module').then(m => m.CajaGeneralModule)
            },
            {
                path: 'cajachica',
                loadChildren: () => import('./caja-chica/caja-chica.module').then(m => m.CajaChicaModule)
            },
            {
                path: 'banco',
                loadChildren: () => import('./cuentas/cuentas.module').then(m => m.CuentasModule)
            },
            {
                path: 'cxp',
                loadChildren: () => import('./cxp/pagos.module').then(m => m.PagosModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CajaBancoRoutingModule { }