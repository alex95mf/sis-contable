import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizacionComponent } from './organizacion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'organizacion'
        },
        children: [
            {
                path: '',
                component: OrganizacionComponent,
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
export class OrganizacionRoutingModule { }