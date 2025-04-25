import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoComponent } from './grupo.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: GrupoComponent,
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
export class GrupoRoutingModule { }
