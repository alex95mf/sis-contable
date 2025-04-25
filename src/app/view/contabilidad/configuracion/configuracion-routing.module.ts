import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'contabilidad/configuracion'
    },
    children: [
        {
            path: 'retenciones-iva',
            loadChildren: () => import('./retenciones-iva/retenciones-iva.module').then(m => m.RetencionesIvaModule)
        },
        {
            path: 'retenciones-fuente',
            loadChildren: () => import('./retenciones-fuente/retenciones-fuente.module').then(m => m.RetencionesFuenteModule)
        },
        {
            path: 'campaign',
            loadChildren: () => import('./campaigns/campaigns.module').then(m => m.CampaignsModule)
        },
        {
            path: 'parametros-cuentas-comprobantes',
            loadChildren: () => import('./parametros-cuentas-comprobantes/parametros-cuentas-comprobantes.module').then(m => m.ParametrosCuentasComprobantesModule)
        }
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
