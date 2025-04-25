import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevolucionesComponent } from './devoluciones.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'devoluciones'
        },
        children: [
            {
                path: '',
                component: DevolucionesComponent,
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
export class DevolucionesRoutingModule { }