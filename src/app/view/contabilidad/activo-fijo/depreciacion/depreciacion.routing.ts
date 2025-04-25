import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepreciacionComponent } from './depreciacion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'deprerciacion'
        },
        children: [
            {
                path: '',
                component: DepreciacionComponent,
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

export class DepreciacionRoutingModule { }