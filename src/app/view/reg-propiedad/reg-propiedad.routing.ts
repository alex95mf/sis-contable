import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'reg-propiedad'
    },
    children: [
        {
            path: 'configuracion',
            loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
        },
        {
            path: 'liquidacion',
            loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule)
        }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegPropiedadRoutingModule { }
