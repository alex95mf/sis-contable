import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConciliacionComponent } from './conciliacion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'conciliacion'
        },
        children: [
            {
                path: '',
                component: ConciliacionComponent,
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
export class ConciliacionRoutingModule { }