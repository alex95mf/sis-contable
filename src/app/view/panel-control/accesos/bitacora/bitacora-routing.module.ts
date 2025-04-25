import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BitacoraComponent } from './bitacora.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'g-wallet'
        },
        children: [
            {
                path: '',
                component: BitacoraComponent,
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
export class BitacoraRoutingModule { }