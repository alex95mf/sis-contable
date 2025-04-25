import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'rentas/configuracion'
        },
        children: [
            {
                path: 'contribuyente',
                loadChildren: () => import('../../rentas/configuracion/contribuyente/contribuyente.module').then(m => m.ContribuyenteModule)
            },
            // {
            //     path: 'con-contribuyente',
            //     loadChildren: () => import('consulta-contribuyente/consulta-contribuyente.module').then(m => m.ConsultaContribuyente)
            // },
            {
                path: 'estado-cuenta',
                loadChildren: () => import('../../rentas/configuracion/estado-cuenta/estado-cuenta.module').then(m => m.EstadoCuentaModule)
            },
            // {
            //     path: 'concepto',
            //     loadChildren: () => import('../../rentas/configuracion/concepto/concepto.module').then(m => m.ConceptoModule)
            // },
            {
                path: 'tarifa',
                loadChildren: () => import('./tarifa/tarifa.module').then(m => m.TarifaModule)
            },
            {
                path: 'conceptos',
                loadChildren: () => import('./conceptos/conceptos.module').then(m => m.ConceptosModule)
            },
            {
                path: 'conceptodetalle',
                loadChildren: () => import('./concepto-det/concepto-det.module').then(m => m.ConceptoDetModule)
            },
            // {
            //     path: 'capacitacion',
            //     loadChildren: () => import('./capacitacion/capacitacion.module').then(m => m.CapacitacionModule)
            // },
            {
                path: 'con-contribuyente',
                loadChildren: () => import('./con-contribuyente/con-contribuyente.module').then(m => m.ConContribuyenteModule)
            },
            {
                path: 'tasas-interes',
                loadChildren: () => import('./tasas-interes/tasas-interes.module').then(m => m.TasasInteresModule)
            },
            {
                path: 'ferias',
                loadChildren: () => import('./ferias/ferias.module').then(m => m.FeriasModule)
            },
            {
                path: 'inspectores',
                loadChildren: () => import('./inspectores/inspectores.module').then(m => m.InspectoresModule)
            },
            {
                path: 'descuentos',
                loadChildren: () => import('./descuentos/descuentos.module').then(m => m.DescuentosModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule {}