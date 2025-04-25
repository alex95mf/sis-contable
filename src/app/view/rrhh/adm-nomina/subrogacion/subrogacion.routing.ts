import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubrogacionComponent } from './subrogacion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'subrogacion'
        },
        children: [
            {
                path: '',
                component: SubrogacionComponent,
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

export class EmpleadoRoutingModule { }