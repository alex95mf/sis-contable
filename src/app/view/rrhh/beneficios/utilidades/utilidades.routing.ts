import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { UtilidadesComponent } from './utilidades.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'utilidades'
        },
        children: [
            {
                path: '',
                component: UtilidadesComponent,
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

export class UtilidadesRoutingModule { }