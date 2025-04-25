import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: '/panel/configuraciones'
        },
        children: [
            {
                path: 'fichero',
                loadChildren: () => import('./empresarial/empresarial.module').then(m => m.EmpresarialModule)
            },
            {
                path: 'parametros',
                loadChildren: () => import('./general/general.module').then(m => m.GeneralModule)
            },
            {
                path: 'contable',
                loadChildren: () => import('./contable/contable.module').then(m => m.ContableModule)
            },
            {
                path: 'correos',
                loadChildren: () => import('./notificaciones/notificaciones.module').then(m => m.NotificacionesModule)
            },
            {
                path: 'notificaciones',
                loadChildren: () => import('./notif-config/notif-config.module').then(m => m.NotifConfigModule)
            },
            {
                path: 'otras-configuraciones',
                loadChildren: () => import('./otras-configuraciones/otras-configuraciones.module').then(m => m.OtrasConfiguracionesModule)
            },
        ]
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  ParametroRoutingModule {}