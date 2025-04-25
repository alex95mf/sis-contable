import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EgresosComponent } from './egresos.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'egresos'
        },
        children: [
            {
                path: '',
                component: EgresosComponent,
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
export class EgresosRoutingModule { }