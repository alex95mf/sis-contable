import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuppliersComponent } from './suppliers.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: SuppliersComponent,
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
export class SupplierRoutingModule { }