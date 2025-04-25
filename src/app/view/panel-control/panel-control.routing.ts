import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'panel'
        },
        children: [
            {
                path: 'accesos',
                loadChildren: () => import('./accesos/accesos.module').then(m => m.AccesosModule)
            },
            {
                path: 'configuraciones',
                loadChildren: () => import('./parametro/parametro.module').then(m => m.CatalogoModule)
            }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PanelRoutingModule { }
