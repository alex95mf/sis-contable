import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cotizaciones'
        },
        children: [
            {
                path: '',
                component: ReportsComponent,
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
export class ReportsRoutingModule { }