import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganigramaComponent } from './organigrama.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'plan'
        },
        children: [
            {
                path: '',
                component: OrganigramaComponent,
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
export class OrganigramaRoutingModule { }