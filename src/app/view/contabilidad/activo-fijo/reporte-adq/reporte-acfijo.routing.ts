import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteAcfijoComponent } from './reporte-acfijo.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'consulta'
        },
        children: [
            {
                path: '',
                component: ReporteAcfijoComponent,
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
export class ReporteAdqRoutingModule { }