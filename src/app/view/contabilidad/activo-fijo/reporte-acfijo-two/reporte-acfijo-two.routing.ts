import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteAcfijoTwoComponent } from './reporte-acfijo-two.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'consulta'
        },
        children: [
            {
                path: '',
                component: ReporteAcfijoTwoComponent,
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
export class ReporteAcfijoTwoRoutingModule { }