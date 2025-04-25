import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: '/panel/accesos'
        },
        children: [
            {
                path: 'usuariosl',
                loadChildren: () => import('./usuarios-online/usuarios-online.module').then(m => m.UsuariosOnlineModule)
            },
            {
                path: 'seguridad',
                loadChildren: () => import('./seguridad/seguridad.module').then(m => m.SeguridadModule)
            },
            {
                path: 'bitacora',
                loadChildren: () => import('./bitacora/bitacora.module').then(m => m.BitacoraModule)
            },
            {
                path: 'consulta-alertas',
                loadChildren: () => import('./consulta-alertas/consulta-alertas.module').then(m => m.ConsultaAlertasModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemasRoutingModule {}
