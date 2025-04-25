import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecepcionComponent } from './recepcion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'recepcion'
        },
        children: [
            {
                path: '',
                component: RecepcionComponent,
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
export class RecepcionRoutingModule { }