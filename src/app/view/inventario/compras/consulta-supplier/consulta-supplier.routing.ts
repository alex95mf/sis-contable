import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaSupplierComponent } from './consulta-supplier.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'consulta'
        },
        children: [
            {
                path: '',
                component: ConsultaSupplierComponent,
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
export class ConsultaSupplierRoutingModule { }