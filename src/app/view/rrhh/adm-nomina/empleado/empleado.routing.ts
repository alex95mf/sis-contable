import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadoComponent } from './empleado.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'empleado'
        },
        children: [
            {
                path: '',
                component: EmpleadoComponent,
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