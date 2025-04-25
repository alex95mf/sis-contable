import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'cajageneral'
        },
        children: [
            {
                path: 'apertura',
                loadChildren: () => import('./apertura/apertura.module').then(m => m.AperturaModule)
            },
            {
                path: 'cierre',
                loadChildren: () => import('./cierre/cierre.module').then(m => m.CierreModule)
            },
            {
                path: 'deposito',
                loadChildren: () => import('./deposito/deposito.module').then(m => m.DepositoModule)
            },
            {
                path: 'reporte',
                loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaCajaModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule {}