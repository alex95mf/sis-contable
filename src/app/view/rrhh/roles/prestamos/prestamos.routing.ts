import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrestamosComponent } from './prestamos.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: PrestamosComponent,
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
export class PrestamosRoutingModule { }