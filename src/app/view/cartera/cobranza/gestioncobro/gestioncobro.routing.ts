import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestioncobroComponent } from './gestioncobro.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'gestioncobro'
        },
        children: [
            {
                path: '',
                component: GestioncobroComponent,
                data: {
                    title: ''
                }
            },
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GestionCobroRoutingModule { }