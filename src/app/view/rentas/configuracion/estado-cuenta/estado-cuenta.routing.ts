import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstadoCuentaComponent } from './estado-cuenta.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'estado-cuenta'
        },
        children: [
            {
                path: '',
                component: EstadoCuentaComponent,
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
export class EstadoCuentaRoutingModule { }