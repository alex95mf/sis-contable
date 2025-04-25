import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'cobranza'
        },
        children: [
            {
                path: 'gestioncobros',
                loadChildren: () => import('./gestioncobro/gestioncobro.module').then(m => m.GestionCobroModule)
            },
            {
                path: 'ncredito',
                loadChildren: () => import('./nota-credito/nota-credito.module').then(m => m.NotaCreditoModule)
            },
            {
                path: 'ndebito',
                loadChildren: () => import('./nota-debito/nota-debito.module').then(m => m.NotaDebitoModule)
            },
            {
                path: 'cobro',
                loadChildren: () => import('./cobranza/cobranza.module').then(m => m.CobranzaModule)
            },
            {
                path: 'cheques',
                loadChildren: () => import('./cheques-post/cheques-post.module').then(m => m.ChequesPostModule)
            } 
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CobranzasRoutingModule { }