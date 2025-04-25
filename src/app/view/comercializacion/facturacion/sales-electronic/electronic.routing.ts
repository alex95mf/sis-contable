import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesElectronicComponent } from './sales-electronic.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'punto-venta'
        },
        children: [
            {
                path: '',
                component: SalesElectronicComponent,
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
export class ElectronicRoutingModule { }