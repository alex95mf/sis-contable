import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagosServiciosComponent } from './pagos-servicios.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'pago-servicio'
        },
        children: [
            {
                path: '',
                component: PagosServiciosComponent,
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
export class PagosServiciosRoutingModule { }