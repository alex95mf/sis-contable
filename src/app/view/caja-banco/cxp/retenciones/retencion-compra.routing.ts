import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetencionesComponent } from '../retenciones/retenciones.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'retencion'
        },
        children: [
            {
                path: '',
                component: RetencionesComponent,
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