import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotaCreditoComponent } from './nota-credito.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'ingreso'
        },
        children: [
            {
                path: '',
                component: NotaCreditoComponent,
                data: {
                    title: ''
                }
            },
         /*    {
                path: 'ingreso',
                loadChildren: () => import('./nota-credito.module').then(m => m.NotaCreditoModule)
            },
            {
                path: 'reporte',
                loadChildren: () => import('./report-nota-credito/report-nota-credito.module').then(m => m.ReportNotaCreditoModule)
            }, */
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotaCreditoRoutingModule { }