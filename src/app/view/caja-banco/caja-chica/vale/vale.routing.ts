import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValeComponent } from './vale.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'vales'
        },
        children: [
            {
                path: '',
                component: ValeComponent,
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
export class ValeRoutingModule { }