import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'rrhh/roles'
        },
        children: [
            {
                path: 'anticipo',
                loadChildren: () => import('./adm-anticipo/adm-anticipo.module').then(m => m.AdmAnticipoModule)
            },
            {
                path: 'emisionrol',
                loadChildren: () => import('./adm-rol-pago/adm-rol-pago.module').then(m => m.AdmRolPagoModule)
            },
            {
                path: 'prestamos',
                loadChildren: () => import('./prestamos-new/prestamos-new.module').then(m => m.PrestamosNewModule)
            },
            {
                path: 'prestamo',
                loadChildren: () => import('./prestamos/prestamos.module').then(m => m.PrestamosModule)
            },
            {
                path: 'parametros',
                loadChildren: () => import('./parametroad/parametroad.module').then(m => m.ParametroadModule)
            },
            {
                path: 'acta_finiquito',
                loadChildren: () => import('./acta-finiquito/acta-finiquito.module').then(m => m.ActaFiniquitoModule)
            },
            {
                path: 'reportes',
                loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}