import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreacionComponent } from './creacion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'creacion'
        },
        children: [
            {
                path: '',
                component: CreacionComponent,
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
export class CreacionRoutingModule { }