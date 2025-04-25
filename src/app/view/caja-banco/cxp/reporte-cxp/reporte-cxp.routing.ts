import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteCxpComponent } from './reporte-cxp.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'reporte-cxp'
        },
        children: [
            {
                path: '',
                component: ReporteCxpComponent,
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
export class ReporteCxpRoutingModule { }