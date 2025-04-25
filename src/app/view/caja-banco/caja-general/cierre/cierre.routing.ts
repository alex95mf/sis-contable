import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CierreComponent } from './cierre.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cierre'
        },
        children: [
            {
                path: '',
                component: CierreComponent,
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
export class CierreRoutingModule { }