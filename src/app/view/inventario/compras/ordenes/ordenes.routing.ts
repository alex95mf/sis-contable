import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdenesComponent } from './ordenes.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'ordenes'
        },
        children: [
            {
                path: '',
                component: OrdenesComponent,
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
export class OrdenesRoutingModule { }