import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportQuotesComponent } from './report-quotes.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'report-quotes'
        },
        children: [
            {
                path: '',
                component: ReportQuotesComponent,
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
export class ReportQuotesRoutingModule { }