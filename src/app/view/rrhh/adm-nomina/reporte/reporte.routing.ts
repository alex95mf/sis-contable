import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteComponent } from './reporte.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'reporte'
        },
        children: [
            {
                path: '',
                component: ReporteComponent,
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

export class ReporteRoutingModule { }