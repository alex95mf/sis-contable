import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CcMantenimientoComponent } from './cc-mantenimiento.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'mantenimiento'
        },
        children: [
            {
                path: '',
                component: CcMantenimientoComponent,
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

export class CCMantenimientoRoutingModule { }