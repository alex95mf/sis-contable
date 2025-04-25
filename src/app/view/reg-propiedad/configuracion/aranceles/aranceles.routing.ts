import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArancelesComponent } from './aranceles.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'aranceles'
        },
        children: [
            {
                path: '',
                component: ArancelesComponent,
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
export class ArancelesRoutingModule { }