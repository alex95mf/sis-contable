import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacElectronicaComponent } from './fac-electronica.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'punto-venta'
        },
        children: [
            {
                path: '',
                component: FacElectronicaComponent,
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

export class FacElectronicaRoutingModule { }