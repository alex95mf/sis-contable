import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtiquetaAcfijoComponent } from './etiqueta-acfijo.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'etiqueta'
        },
        children: [
            {
                path: '',
                component: EtiquetaAcfijoComponent,
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
export class EtiquetaAcfijoRoutingModule { }