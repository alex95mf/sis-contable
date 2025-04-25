import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaImportacionComponent } from './consulta-importacion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'consulta'
        },
        children: [
            {
                path: '',
                component: ConsultaImportacionComponent,
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
export class ConsultaImportaciongRoutingModule { }