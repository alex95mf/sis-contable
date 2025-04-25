import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotesComponent } from './quotes.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cotizaciones'
        },
        children: [
            {
                path: '',
                component: QuotesComponent,
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
export class QuotesRoutingModule { }