import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersConsultComponent } from './customers-consult.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'consulta'
        },
        children: [
            {
                path: '',
                component: CustomersConsultComponent,
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
export class CustomersConsultRoutingModule { }