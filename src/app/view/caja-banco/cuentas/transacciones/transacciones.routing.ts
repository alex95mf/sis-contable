import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransaccionesComponent } from './transacciones.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'transferencia'
        },
        children: [
            {
                path: '',
                component: TransaccionesComponent,
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
export class TransaccionesRoutingModule { }