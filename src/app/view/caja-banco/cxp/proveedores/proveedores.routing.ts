import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'proveedores'
        },
        children: [
            {
                path: '',
                component: ProveedoresComponent,
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
export class ProveedoresRoutingModule { }