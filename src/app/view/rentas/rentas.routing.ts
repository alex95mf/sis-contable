import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'rentas'
        },
        children: [
            {
                path: 'configuracion',
                loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
            },
            {
                path: 'liquidacion',
                loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule)
            },
            {
                path: 'mercados',
                loadChildren: () => import('./mercados/mercados.module').then(m => m.MercadosModule)
            },
            {
                path: 'regpropiedad',
                loadChildren: () => import('./reg-propiedad/reg-propiedad.module').then(m => m.RegPropiedadModule)
            },
            {
                path: 'predurbano',
                loadChildren: () => import('./pred-urbano/pred-urbano.module').then(m => m.PredUrbanoModule)
            },
            {
                path: 'lcomerciales',
                loadChildren: () => import('./lcomerciales/lcomerciales.module').then(m => m.LcomercialesModule)
            },
            {
                path: 'tasas',
                loadChildren: () => import('./tasas/tasas.module').then(m => m.TasasModule)
            },
            {
                path: 'conceptos-varios',
                loadChildren: () => import('./con-varios/con-varios.module').then(m => m.ConVariosModule)
            },
            {
                path: 'canchas',
                loadChildren: () => import('./canchas/canchas.module').then(m => m.CanchasModule)

            },
            
            {
                path: 'arriendos',
                loadChildren: () => import('./arriendoterrenos/liquidacion/arriendoterrenos.module').then(m => m.ArriendoterrenosModule)
            },
            {
                path: 'plusvalias',
                loadChildren: () => import('./plusvalias/plusvalias.module').then(m => m.PlusvaliasModule)
            },
            {
                path: 'consulta',
                loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule)
            },
            {
                path: 'asiento-cierre',
                loadChildren: () => import('./asiento-cierre/asiento-cierre.module').then(m => m.AsientoCierreModule)
            },
            {
                path: 'tramite-rentas',
                loadChildren: () => import('./tramites/tramites.module').then(m => m.TramitesModule)
            },
            {
                path: 'consulta-titulos',
                loadChildren: () => import('./consulta-titulos/consulta-titulos.module').then(m => m.ConsultaTitulosModule)
            }


        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RentasRoutingModule { }