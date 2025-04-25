import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'cajachica'
        },
        children: [
            {
                path: 'fichero',
                loadChildren: () => import('./creacion/creacion.module').then(m => m.CreacionModule)
            },
            {
                path: 'vale',
                loadChildren: () => import('./vale/vale.module').then(m => m.ValeModule)
            },
            {
                path: 'consulta',
                loadChildren: () => import('./consulta-cajach/consulta-cajach.module').then(m => m.ConsultaCajachCModule)
            }
        ]
    }

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CajaChicaRoutingModule { }