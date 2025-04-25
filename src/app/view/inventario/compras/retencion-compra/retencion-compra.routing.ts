import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetencionCompraComponent } from './retencion-compra.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'retencion'
        },
        children: [
            {
                path: '',
                component: RetencionCompraComponent,
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
export class RetencionCompraRoutingModule { }