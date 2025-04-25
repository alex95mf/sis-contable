import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportNotaCreditoComponent } from './report-nota-credito.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'reportes'
        },
        children: [
            {
                path: '',
                component: ReportNotaCreditoComponent,
                data: {
                    title: ''
                }
            },
          /*   {
                path: 'reporte',
                loadChildren: () => import('./customers-register/customers-register.module').then(m => m.CustomersRegisterModule)
            }, */
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportNotaRoutingModule { }