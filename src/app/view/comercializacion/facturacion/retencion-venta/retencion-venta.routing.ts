import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetencionVentaComponent } from './retencion-venta.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'retnecion'
        },
        children: [
            {
                path: '',
                component: RetencionVentaComponent,
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
export class RetencionVentaRoutingModule { }