import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiarioComponent } from './diario.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: DiarioComponent,
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

export class DiarioRoutingModule { }