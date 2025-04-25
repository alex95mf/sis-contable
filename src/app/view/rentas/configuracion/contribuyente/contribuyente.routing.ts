import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContribuyenteComponent } from './contribuyente.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'contribuyente'
        },
        children: [
            {
                path: '',
                component: ContribuyenteComponent,
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
export class ContribuyenteRoutingModule { }