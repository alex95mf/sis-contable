import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudComponent } from './solicitud.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'solicitud'
        },
        children: [
            {
                path: '',
                component: SolicitudComponent,
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
export class SolicitudRoutingModule { }