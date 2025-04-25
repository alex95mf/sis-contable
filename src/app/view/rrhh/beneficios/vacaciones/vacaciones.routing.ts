import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { VacacionesComponent } from './vacaciones.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'vacaciones'
        },
        children: [
            {
                path: '',
                component: VacacionesComponent,
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

export class VacacionesRoutingModule { }