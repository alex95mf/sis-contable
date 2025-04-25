import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteCobranzasComponent } from './reporte-cobranzas.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'monitor/reporte'
        },
        children: [
            {
                path: '',
                component: ReporteCobranzasComponent,
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
export class CobranzaReporteRoutingModule { }