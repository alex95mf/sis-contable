import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BovedasComponent } from './bovedas.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'bovedas'
        },
        children: [
            {
                path: '',
                component: BovedasComponent,
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
export class BovedasRoutingModule { }